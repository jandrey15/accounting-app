import Head from 'next/head'
import { useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import Todo from '../components/Todo'
import IncomeExpense from '../components/IncomeExpense'
import { minifyRecords, table, tableIncomeExpenses } from './api/utils/Airtable'
import { TodosContext } from '../contexts/TodosContext'
import { IncExpensContext } from '../contexts/IncomesExpensesContext'
import auth0 from './api/utils/auth0'
import TodoForm from '../components/TodoForm'

export default function Home({
  initialTodos,
  user,
  initialIncomesExpenese = [],
}) {
  const { todos, setTodos } = useContext(TodosContext)
  const { incomesExpenses, setIncExpens } = useContext(IncExpensContext)
  // console.log(initialTodos)
  console.log(user)
  useEffect(() => {
    setTodos(initialTodos)
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
            <h1 className='text-2xl text-center mb-4'>Accounting App</h1>
            <TodoForm />
            <ul>
              {todos && todos.map((todo) => <Todo key={todo.id} todo={todo} />)}
            </ul>

            <h3>Incomes & Expenses</h3>
            <ul>
              {incomesExpenses &&
                incomesExpenses.map((incomeExpense) => (
                  <IncomeExpense
                    key={incomeExpense.id}
                    incomeExpense={incomeExpense}
                  />
                ))}
            </ul>
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
  let todos = []
  let incomesExpenses = []

  try {
    if (session?.user) {
      todos = await table
        .select({
          filterByFormula: `userId = '${session.user.sub}'`,
        })
        .firstPage()

      incomesExpenses = await tableIncomeExpenses
        .select({
          filterByFormula: `userId = '${session.user.sub}'`,
        })
        .firstPage()
    }

    return {
      props: {
        initialTodos: minifyRecords(todos),
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
