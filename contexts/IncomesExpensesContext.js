import { createContext, useState } from 'react'

const IncExpensContext = createContext()

const IncExpensProvider = ({ children }) => {
  const [incomesExpenses, setIncExpens] = useState([])

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
      const newTodo = await res.json()
      setIncExpens((prevTodos) => {
        return [newTodo, ...prevTodos]
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

  const deleteTodo = async (id) => {
    try {
      const res = await fetch('/api/deleteTodo', {
        method: 'Delete',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      })
      setIncExpens((prevTodos) => {
        return prevTodos.filter((todo) => todo.id !== id)
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
        setIncExpens,
        refreshIncExpens,
      }}
    >
      {children}
    </IncExpensContext.Provider>
  )
}

export { IncExpensProvider, IncExpensContext }
