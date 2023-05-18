import React, { useState, useContext } from 'react'
import { IncExpensContext } from '../contexts/IncomesExpensesContext'

export default function IncomeExpenseForm() {
  const [incomeExpense, setIncomeExpense] = useState({ concepto: 'Gasto' })
  const { addIncomeExpense } = useContext(IncExpensContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    addIncomeExpense(incomeExpense)
    setIncomeExpense({ concepto: 'Gasto' })
  }

  return (
    <>
      <form className='w-full max-w-lg' onSubmit={handleSubmit}>
        <div className='flex flex-wrap -mx-3 mb-2'>
          <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
            <label
              className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              htmlFor='fecha'
            >
              Fecha
            </label>
            <input
              type='date'
              name='fecha'
              id='fecha'
              value={incomeExpense.fecha || ''}
              onChange={(e) =>
                setIncomeExpense({ ...incomeExpense, fecha: e.target.value })
              }
              className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
            />
          </div>
          <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
            <label
              className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              htmlFor='concepto'
            >
              Concepto
            </label>
            <div className='relative'>
              <select
                name='concepto'
                id='concepto'
                value={incomeExpense.concepto || 'Gasto'}
                onChange={(e) =>
                  setIncomeExpense({
                    ...incomeExpense,
                    concepto: e.target.value,
                  })
                }
                className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              >
                <option value='Gasto'>Gasto</option>
                <option value='Ingreso'>Ingreso</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                <svg
                  className='fill-current h-4 w-4'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                </svg>
              </div>
            </div>
          </div>
          <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
            <label
              className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              htmlFor='description'
            >
              Descripción
            </label>
            <input
              type='text'
              name='description'
              id='description'
              value={incomeExpense.description || ''}
              onChange={(e) =>
                setIncomeExpense({
                  ...incomeExpense,
                  description: e.target.value,
                })
              }
              placeholder='Ex. description'
              className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            />
          </div>
        </div>

        <div className='flex flex-wrap -mx-3 mb-2'>
          <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
            {incomeExpense.concepto === 'Gasto' && (
              <>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='categoria'
                >
                  Categorias
                </label>
                <div className='relative'>
                  <select
                    name='categoria'
                    id='categoria'
                    value={incomeExpense.categoria || ''}
                    onChange={(e) =>
                      setIncomeExpense({
                        ...incomeExpense,
                        categoria: e.target.value,
                      })
                    }
                    className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                  >
                    <option value='Hogar'>Hogar</option>
                    <option value='Transporte'>Transporte</option>
                    <option value='Entretenimiento y diversión'>
                      Entretenimiento y diversión
                    </option>
                    <option value='Alimentación'>Alimentación</option>
                    <option value='Vestuario'>Vestuario</option>
                    <option value='Educación'>Educación</option>
                    <option value='Comunicaciones'>Comunicaciones</option>
                    <option value='Salud y autocuidado'>
                      Salud y autocuidado
                    </option>
                    <option value='Otra'>Otra</option>
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                    <svg
                      className='fill-current h-4 w-4'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                    </svg>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
            <label
              className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              htmlFor='amount'
            >
              Cantidad
            </label>
            <input
              type='text'
              name='amount'
              id='amount'
              value={incomeExpense.cantidad || ''}
              onChange={(e) => {
                let amount = e.target.value.replaceAll('.', '').replace('$', '')

                if (!isNaN(amount)) {
                  // console.log('this amount 1 -> ' + amount)
                  amount = new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0,
                  }).format(amount)
                  // console.log(amount)
                  setIncomeExpense({
                    ...incomeExpense,
                    cantidad: amount,
                  })
                }
              }}
              placeholder='Ex. amount'
              className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            />
          </div>
          <div className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
            <button
              type='submit'
              className='w-full rounded bg-blue-500 hover:bg-blue-600 text-white py-2 px-4'
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
