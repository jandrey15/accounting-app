import Head from 'next/head'
import { useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import Todo from '../components/Todo'
import { minifyRecords, tableTodo } from './api/utils/Airtable'
import { TodosContext } from '../contexts/TodosContext'
import auth0 from './api/utils/auth0'
import TodoForm from '../components/TodoForm'

export default function Home({ initialTodos, user }) {
  const { todos, setTodos } = useContext(TodosContext)
  // console.log(initialTodos)
  console.log(user)
  useEffect(() => {
    setTodos(initialTodos)
  }, [])

  return (
    <section className='container'>
      <Head>
        <title>Personal Accounting App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar user={user} />
      <main className='w-11/12 m-auto md:max-w-full'>
        {user && (
          <>
            <h1 className='text-2xl text-center mb-4'>Accounting App</h1>
            <TodoForm />
            <ul>
              {todos && todos.map((todo) => <Todo key={todo.id} todo={todo} />)}
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

  try {
    if (session?.user) {
      todos = await tableTodo
        .select({
          filterByFormula: `userId = '${session.user.sub}'`,
        })
        .firstPage()
    }

    return {
      props: {
        initialTodos: minifyRecords(todos),
        user: session?.user || null,
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
