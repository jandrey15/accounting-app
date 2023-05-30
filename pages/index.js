import Head from 'next/head'
import { useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import IncomeExpense from '../components/IncomeExpense'
import {
  minifyRecords,
  tableIncomeExpenses,
  minifyRecordsTotales,
} from './api/utils/Airtable'
import { IncExpensContext } from '../contexts/IncomesExpensesContext'
import auth0 from './api/utils/auth0'
import IncomeExpenseForm from '../components/IncomeExpenseForm'

export default function Home({
  user,
  initialIncomesExpenese = [],
  incomesTotal,
  expensesTotal,
}) {
  const { incomesExpenses, setIncExpens } = useContext(IncExpensContext)
  // console.log(initialTodos)
  // console.log(user)
  useEffect(() => {
    setIncExpens(initialIncomesExpenese)
  }, [])

  return (
    <section>
      <Head>
        <title>Personal Accounting App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar user={user} />
      <main>
        {user && (
          <>
            <h1 className='text-2xl text-center mb-4'>Incomes & Expenses</h1>
            <IncomeExpenseForm />
            <p>
              Total Ingresos: ${new Intl.NumberFormat().format(incomesTotal)}
            </p>
            <p>
              Total Gastos: ${new Intl.NumberFormat().format(expensesTotal)}
            </p>
            {incomesExpenses && (
              <IncomeExpense incomesExpenses={incomesExpenses} />
            )}
          </>
        )}
        {!user && <p>You should log in to save your TODOS</p>}
      </main>
    </section>
  )
}

export async function getServerSideProps({ req, res }) {
  const session = await auth0.getSession(req, res)
  // console.log(session)
  let incomesExpenses = []
  let incomesTotal = 0
  let expensesTotal = 0

  try {
    if (session?.user) {
      const userId = session.user.sub
      incomesExpenses = await tableIncomeExpenses
        .select({
          filterByFormula: `userId = '${userId}'`,
        })
        .firstPage()

      const incomesTotalPromise = await minifyRecordsTotales({
        type: 'Ingreso',
        userId,
      })

      const expensesTotalPromise = new Promise((resolve, reject) => {
        let out = 0
        tableIncomeExpenses
          .select({
            filterByFormula: `AND(concepto = 'Gasto', userId = '${session.user.sub}')`,
          })
          .eachPage(
            function page(records, fetchNextPage) {
              // This function (`page`) will get called for each page of records.

              records.forEach(function (record) {
                // console.log('Retrieved', record.get('cantidad'))
                out = out + Number(record.get('cantidad'))
              })

              // To fetch the next page of records, call `fetchNextPage`.
              // If there are more records, `page` will get called again.
              // If there are no more records, `done` will get called.
              fetchNextPage()
            },
            function done(err) {
              if (err) {
                console.error(err)
                reject(err)
              } else {
                resolve(out)
              }
            }
          )
      })

      expensesTotal = await expensesTotalPromise
      incomesTotal = await incomesTotalPromise
    }

    return {
      props: {
        user: session?.user || null,
        initialIncomesExpenese: minifyRecords(incomesExpenses),
        incomesTotal: incomesTotal,
        expensesTotal: expensesTotal,
      },
    }
  } catch (err) {
    console.error(err)
    return {
      props: {
        err: 'Something went wrong! :(',
      },
    }
  }
}
