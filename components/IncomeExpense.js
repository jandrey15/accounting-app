import React, { useContext } from 'react'
import { IncExpensContext } from '../contexts/IncomesExpensesContext'

export default function IncomeExpense({ incomesExpenses }) {
  const { updateTodo, deleteTodo } = useContext(IncExpensContext)
  // console.log(incomeExpense)

  const handleToggleCompleted = () => {
    const updatedFields = {
      ...todo.fields,
      completed: !todo.fields.completed,
    }
    const updatedTodo = { id: todo.id, fields: updatedFields }

    updateTodo(updatedTodo)
  }

  return (
    <ul>
      {incomesExpenses.map((incomeExpense) => {
        return (
          <li
            key={incomeExpense.id}
            className='bg-white flex items-center shadow-lg rounded-lg my-2 py-2 px-4'
          >
            <p>{incomeExpense.fields.fecha}</p>
            <p>{incomeExpense.fields.concepto}</p>
            <p>{incomeExpense.fields.description}</p>
            <h4>
              ${new Intl.NumberFormat().format(incomeExpense.fields.cantidad)}
            </h4>
            <p>{incomeExpense.fields.categorias}</p>
          </li>
        )
      })}
    </ul>
  )
}
