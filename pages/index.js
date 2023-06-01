import Head from 'next/head'
import { useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import IncomeExpense from '../components/IncomeExpense'
import {
  minifyRecords,
  tableIncomeExpenses,
  minifyRecordsTotales,
  minifyRecordsTotalesMonths,
} from './api/utils/Airtable'
import { IncExpensContext } from '../contexts/IncomesExpensesContext'
import auth0 from './api/utils/auth0'
import IncomeExpenseForm from '../components/IncomeExpenseForm'
import Totales from '../components/Totales'
import IncomeExpenseMonths from '../components/IncomeExpenseMonths'

export default function Home({
  user,
  initialIncomesExpenese = [],
  incomesTotal,
  expensesTotal,
  totalesIncomesExpensesMonths,
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

            {totalesIncomesExpensesMonths && (
              <IncomeExpenseMonths
                incomesExpenses={totalesIncomesExpensesMonths}
              />
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
  let totalesIncomesExpensesMonths = []

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

      const incomesTotalMonthsPromise = await minifyRecordsTotalesMonths({
        type: 'Ingreso',
        userId,
      })

      const expensesTotalMonthsPromise = await minifyRecordsTotalesMonths({
        type: 'Gasto',
        userId,
      })

      expensesTotal = await expensesTotalPromise
      incomesTotal = await incomesTotalPromise
      let incomesTotalMonths = await incomesTotalMonthsPromise
      let expensesTotalMonths = await expensesTotalMonthsPromise

      totalesIncomesExpensesMonths = incomesTotalMonths.map((item, index) => {
        console.log(item)
        console.log(expensesTotalMonths[index])
        const expenseMonth = expensesTotalMonths[index]?.month
        const incomeMonth = item.month
        if (incomeMonth === expenseMonth) {
          return {
            month: item.month,
            ingreso: item.total,
            gasto: expensesTotalMonths[index].total,
          }
        }
      })

      // console.log({ incomesTotalMonths, expensesTotalMonths })
      // totalesIncomesExpensesMonths =
      //   incomesTotalMonths.concat(expensesTotalMonths)
      // const testData = []
      // totalesIncomesExpensesMonths.forEach((item) => {
      //   // const month = testData.filter((month) => month.month === item.month)
      //   // console.log(month)
      //   testData.push({
      //     month: item.month,
      //     ingreso: item.total,
      //     gasto: item.total,
      //   })
      //   // return {
      //   //   month,
      //   //   ingreso,
      //   //   gasto
      //   // }
      // })
      // console.log(testData)
      // console.log(totalesIncomesExpensesMonths)
    }

    return {
      props: {
        user: session?.user || null,
        initialIncomesExpenese: minifyRecords(incomesExpenses),
        incomesTotal,
        expensesTotal,
        totalesIncomesExpensesMonths,
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
