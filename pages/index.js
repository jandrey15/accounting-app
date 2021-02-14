import Head from 'next/head'
import { useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import Todo from '../components/Todo'
import { minifyRecords, table } from './api/utils/Airtable'
import { TodosContext } from '../contexts/TodosContext'

export default function Home({ initialTodos }) {
  const { todos, setTodos } = useContext(TodosContext)
  // console.log(initialTodos)
  useEffect(() => {
    setTodos(initialTodos)
  }, [])
  return (
    <section>
      <Head>
        <title>Personal Accounting App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar />
      <main>
        <h1>Accounting App</h1>
        <ul>
          {todos && todos.map((todo) => <Todo key={todo.id} todo={todo} />)}
        </ul>
      </main>
    </section>
  )
}

export async function getServerSideProps(context) {
  try {
    const todos = await table.select({}).firstPage()
    return {
      props: {
        initialTodos: minifyRecords(todos),
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
