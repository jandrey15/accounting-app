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
  const { incomesExpenses, setIncExpens, totales, setTotales } = useContext(IncExpensContext)
  const { openModal, closeModal, showModal } = useModal()
  // console.log(initialTodos)
  // console.log(user)
  useEffect(() => {
    setIncExpens(initialIncomesExpenese)
    setTotales({ incomesTotal, expensesTotal })
  }, [])

  return (
    <section className='min-h-screen flex flex-col pb-5'>
      <Head>
        <title>Personal Accounting App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar user={user} />
      <main>
        {user && (
          <>
            <h1 className='text-2xl text-center mb-4 font-bold'>Ingresos y Gastos</h1>
            <button type='button' className='fixed right-5 bottom-5 z-50'>
              {!showModal ? (
                <img src='/agregar.png' alt='Agregar' width={40} height={40} onClick={openModal} />
              ) : (
                <img src='/close.png' alt='Cancelar' width={40} height={40} onClick={closeModal} />
              )}
            </button>

            <Totales incomesTotal={totales.incomesTotal} expensesTotal={totales.expensesTotal} />
            {incomesExpenses && <IncomeExpense incomesExpenses={incomesExpenses} />}

            {totalesIncomesExpensesMonths && <IncomeExpenseMonths incomesExpenses={totalesIncomesExpensesMonths} />}
            <Modal show={showModal} onClose={closeModal}>
              <IncomeExpenseForm onCloseModal={closeModal} />
            </Modal>
          </>
        )}

        {!user && (
          <>
            <div className='flex items-center justify-center gap-4 md:flex-row flex-col mb-5'>
              <div className='md:w-[500px] w-[300px] m-auto md:m-0'>
                <img
                  src='/accounting.webp'
                  className='rounded-full w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-cover shadow-md'
                  alt='Accounting'
                />
              </div>
              <div className='flex flex-col gap-4 w-[315px]'>
                <h3 className='text-center mb-4 text-lg'>
                  Recuerda que la clave para ahorrar y manejar tus gastos de manera efectiva es la disciplina y la
                  constancia. Pequeños cambios en tus hábitos diarios pueden marcar una gran diferencia en tu situación
                  financiera a largo plazo. ¡Buena suerte!
                </h3>
                <p className='text-center'>Inicia sesión para ver los ingresos y gastos.</p>
              </div>
            </div>

            <div className='flex flex-col gap-4 items-center justify-center mt-10 md:mb-5 md:w-full w-[90%] m-auto'>
              <h3 className='text-center mb-4 text-3xl font-bold'>
                Recomendaciones Prácticas para Ahorrar y Administrar tus Gastos Eficientemente
              </h3>
              <ul className='p-0 list-decimal max-w-3xl m-auto'>
                <li className='text-lg mb-3'>
                  <strong>Establece un presupuesto:</strong> Lo primero que debes hacer es crear un presupuesto mensual.
                  Anota tus ingresos y luego enumera todos tus gastos. Asigna montos específicos a cada categoría de
                  gastos, como vivienda, transporte, alimentos, entretenimiento, etc. Asegúrate de no gastar más de lo
                  que ingresas.
                </li>
                <li className='text-lg mb-3'>
                  <strong>Prioriza tus gastos:</strong> Identifica cuáles son tus gastos más importantes y necesarios,
                  como vivienda, alimentación y servicios básicos. Estos deben ser tus prioridades. Luego, evalúa tus
                  gastos secundarios y considera si puedes reducirlos o eliminarlos para ahorrar más dinero.
                </li>
                <li className='text-lg'>
                  <strong>Controla tus gastos diarios:</strong> Lleva un registro de todos tus gastos diarios, ya sea en
                  papel, una hoja de cálculo o mediante aplicaciones móviles de gestión financiera. Esto te ayudará a
                  tener una visión clara de en qué estás gastando tu dinero y te permitirá identificar áreas en las que
                  puedas reducir gastos.
                </li>
              </ul>
            </div>
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
          maxRecords: 32,
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
