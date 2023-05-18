import Head from 'next/head'
import { useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import IncomeExpense from '../components/IncomeExpense'
import { minifyRecords, tableIncomeExpenses } from './api/utils/Airtable'
import { IncExpensContext } from '../contexts/IncomesExpensesContext'
import auth0 from './api/utils/auth0'
import IncomeExpenseForm from '../components/IncomeExpenseForm'

export default function Home({ user, initialIncomesExpenese = [] }) {
  const { incomesExpenses, setIncExpens } = useContext(IncExpensContext)
  // console.log(initialTodos)
  console.log(user)
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

  try {
    if (session?.user) {
      incomesExpenses = await tableIncomeExpenses
        .select({
          filterByFormula: `userId = '${session.user.sub}'`,
        })
        .firstPage()
    }

    return {
      props: {
        user: session?.user || null,
        initialIncomesExpenese: minifyRecords(incomesExpenses),
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
