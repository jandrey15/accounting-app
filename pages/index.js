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
import Totales from '../components/Totales'

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
            <Totales
              incomesTotal={incomesTotal}
              expensesTotal={expensesTotal}
            />
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
  let incomeExpenseMonths = []

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

      const expensesTotalPromise = await minifyRecordsTotales({
        type: 'Gasto',
        userId,
      })

      expensesTotal = await expensesTotalPromise
      incomesTotal = await incomesTotalPromise

      incomeExpenseMonths = await tableIncomeExpenses
        .select({
          filterByFormula: `AND(concepto = 'Gasto', userId = '${userId}')`,
        })
        .firstPage()
      const year = new Date().getFullYear().toString()
      let totalMonth = 0

      incomeExpenseMonths.forEach((item) => {
        console.log(item.fields)
        if (year === item.fields.year) {
          console.log(item.fields)
          if (item.fields.mes === 'May') {
            console.log('ok paso..')
            totalMonth = totalMonth + item.fields.cantidad
          }
        }
      })
      console.log(totalMonth)
      // console.info({ incomeExpenseMonths })
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
