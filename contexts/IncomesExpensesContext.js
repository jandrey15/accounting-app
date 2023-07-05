import { createContext, useState } from 'react'

const IncExpensContext = createContext()

const IncExpensProvider = ({ children }) => {
  const [incomesExpenses, setIncExpens] = useState([])
  const [totales, setTotales] = useState({ incomesTotal: 0, expensesTotal: 0 })

  const refreshIncExpens = async () => {
    try {
      const res = await fetch('/api/getIncomeExpenses')
      const latestIncExpens = await res.json()
      // console.log('data -> ', latestIncExpens)
      setIncExpens(latestIncExpens)
    } catch (err) {
      console.error(err)
    }
  }

  const addIncomeExpense = async ({
    fecha,
    concepto,
    description,
    cantidad,
    categoria,
  }) => {
    try {
      const res = await fetch('/api/createIncomeExpense', {
        method: 'POST',
        body: JSON.stringify({
          fecha,
          concepto,
          description,
          cantidad,
          categoria,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      const newIncomeExpense = await res.json()

      setIncExpens((prevIncomeExpense) => {
        return [newIncomeExpense, ...prevIncomeExpense]
      })
      setTotales((prevTotales) => {
        let newTotales = { ...prevTotales }

        if (newIncomeExpense.fields.concepto === 'Ingreso') {
          newTotales.incomesTotal = prevTotales.incomesTotal +=
            newIncomeExpense.fields.cantidad
        } else {
          newTotales.expensesTotal = prevTotales.expensesTotal +=
            newIncomeExpense.fields.cantidad
        }
        return newTotales
      })
    } catch (err) {
      console.error(err)
    }
  }

  const updateTodo = async (updatedTodo) => {
    try {
      const res = await fetch('/api/updateTodo', {
        method: 'PUT',
        body: JSON.stringify(updatedTodo),
        headers: { 'Content-Type': 'application/json' },
      })
      await res.json()
      setIncExpens((prevTodos) => {
        const existingTodos = [...prevTodos]
        const existingTodo = existingTodos.find(
          (todo) => todo.id === updatedTodo.id
        )
        existingTodo.fields = updatedTodo.fields
        return existingTodos // tener en cuenta esto
      })
    } catch (err) {
      console.error(err)
    }
  }

  const deleteIncomeExpense = async (id) => {
    try {
      const res = await fetch('/api/deleteIncomeExpense', {
        method: 'Delete',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      })
      setIncExpens((prevIncomeExpense) => {
        return prevIncomeExpense.filter(
          (incomeExpense) => incomeExpense.id !== id
        )
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <IncExpensContext.Provider
      value={{
        incomesExpenses,
        addIncomeExpense,
        deleteIncomeExpense,
        setIncExpens,
        refreshIncExpens,
        totales,
        setTotales,
      }}
    >
      {children}
    </IncExpensContext.Provider>
  )
}

export { IncExpensProvider, IncExpensContext }
