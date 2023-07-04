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
import { useModal } from '../hooks/useModal'
import Modal from '../components/Modal'

export default function Home({
  user,
  initialIncomesExpenese = [],
  incomesTotal,
  expensesTotal,
  totalesIncomesExpensesMonths,
}) {
  const { incomesExpenses, setIncExpens } = useContext(IncExpensContext)
  const { openModal, closeModal, showModal } = useModal()
  // console.log(initialTodos)
  // console.log(user)
  useEffect(() => {
    setIncExpens(initialIncomesExpenese)
  }, [])

  return (
    <section className='min-h-screen flex flex-col justify-between pb-5'>
      <Head>
        <title>Personal Accounting App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar user={user} />
      <main>
        {user && (
          <>
            <h1 className='text-2xl text-center mb-4'>Ingresos y Gastos</h1>
            <button
              type='button'
              onClick={openModal}
              className='fixed right-5 bottom-5'
            >
              <img src='/agregar.png' alt='Agregar' width={40} height={40} />
            </button>

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
            <Modal show={showModal} onClose={closeModal}>
              <IncomeExpenseForm />
            </Modal>
          </>
        )}

        {!user && (
          <>
            <img
              src='/accounting.webp'
              className='w-full h-auto'
              alt='Accounting'
            />
            <p className='text-center'>
              Inicia sesión para ver los ingresos y gastos.
            </p>
          </>
        )}
      </main>

      <footer className='flex flex-col items-center justify-center gap-2 mt-5'>
        <h3>Desarrollado por John Serrano</h3>
        <p>Todos los derechos reservados &copy; 2023</p>
      </footer>
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
          sort: [{ field: 'fecha', direction: 'desc' }],
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
