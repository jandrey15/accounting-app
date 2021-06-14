import React, { useState, useContext } from 'react'
import { IncExpensContext } from '../contexts/IncomesExpensesContext'

export default function IncomeExpenseForm() {
  const [incomeExpense, setIncomeExpense] = useState({})
  const { addIncomeExpense } = useContext(IncExpensContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    addIncomeExpense(incomeExpense)
    setIncomeExpense({})
  }

  return (
    <form className='form my-6' onSubmit={handleSubmit}>
      <div className='flex flex-col text-sm mb-2'>
        <label className='font-bold mb-2 text-gray-800' htmlFor='todo'>
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
          className='border border-gray-200 p-2 rounded-lg appearance-none focus:outline-none focus:border-gray-500'
        />
        <label className='font-bold mb-2 text-gray-800' htmlFor='todo'>
          Concepto
        </label>
        <input
          type='text'
          name='concepto'
          id='concepto'
          value={incomeExpense.concepto || ''}
          onChange={(e) =>
            setIncomeExpense({ ...incomeExpense, concepto: e.target.value })
          }
          placeholder='Ex. income or expense'
          className='border border-gray-200 p-2 rounded-lg appearance-none focus:outline-none focus:border-gray-500'
        />
        <label className='font-bold mb-2 text-gray-800' htmlFor='todo'>
          Descripción
        </label>
        <input
          type='text'
          name='description'
          id='description'
          value={incomeExpense.description || ''}
          onChange={(e) =>
            setIncomeExpense({ ...incomeExpense, description: e.target.value })
          }
          placeholder='Ex. description'
          className='border border-gray-200 p-2 rounded-lg appearance-none focus:outline-none focus:border-gray-500'
        />
        <label className='font-bold mb-2 text-gray-800' htmlFor='todo'>
          Cantidad
        </label>
        <input
          type='number'
          name='amount'
          id='amount'
          value={incomeExpense.cantidad || ''}
          onChange={(e) =>
            setIncomeExpense({ ...incomeExpense, cantidad: e.target.value })
          }
          placeholder='Ex. amount'
          className='border border-gray-200 p-2 rounded-lg appearance-none focus:outline-none focus:border-gray-500'
        />
        <label className='font-bold mb-2 text-gray-800' htmlFor='todo'>
          Categorias
        </label>
        <select
          name='categoria'
          id='categoria'
          value={incomeExpense.categoria || ''}
          onChange={(e) =>
            setIncomeExpense({ ...incomeExpense, categoria: e.target.value })
          }
          className='border border-gray-200 p-2 rounded-lg appearance-none focus:outline-none focus:border-gray-500'
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
          <option value='Salud y autocuidado'>Salud y autocuidado</option>
        </select>
      </div>
      <button
        type='submit'
        className='w-full rounded bg-blue-500 hover:bg-blue-600 text-white py-2 px-4'
      >
        Submit
      </button>
    </form>
  )
}
