import React, { useContext, useState } from 'react'
import { IncExpensContext } from '../contexts/IncomesExpensesContext'
import {
  Card,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  BadgeDelta,
  DeltaType,
  MultiSelectBox,
  MultiSelectBoxItem,
} from '@tremor/react'
import { categorys } from '../utils/consts'

export default function IncomeExpense({ incomesExpenses }) {
  const { deleteIncomeExpense } = useContext(IncExpensContext)
  const [selectedCategory, setSelectedCategory] = useState([])

  const isCategorySelected = (category) =>
    selectedCategory.includes(category?.fields?.categorias) ||
    selectedCategory.length === 0
  // console.log(incomeExpense)

  // const handleToggleCompleted = () => {
  //   const updatedFields = {
  //     ...todo.fields,
  //     completed: !todo.fields.completed,
  //   }
  //   const updatedTodo = { id: todo.id, fields: updatedFields }

  //   updateTodo(updatedTodo)
  // }

  const handleDelete = (id) => {
    console.log('Delete -> ' + id)
    deleteIncomeExpense(id)
  }

  return (
    <Card>
      <MultiSelectBox
        onValueChange={(value) => setSelectedCategory(value)}
        placeholder='Seleccione una categoría...'
        className='max-w-xs'
      >
        {categorys.map((item) => (
          <MultiSelectBoxItem key={item} value={item} text={item} />
        ))}
      </MultiSelectBox>
      <Table className='mt-6'>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Fecha</TableHeaderCell>
            <TableHeaderCell className='max-w-xs'>Descripción</TableHeaderCell>
            <TableHeaderCell>Categoría</TableHeaderCell>
            <TableHeaderCell className='text-right'>
              Cantidad ($)
            </TableHeaderCell>
            <TableHeaderCell className='text-right'>Concepto</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {incomesExpenses
            .filter((item) => isCategorySelected(item))
            .map((item) => (
              <TableRow key={item.id}>
                <TableCell className='flex flex-col gap-2'>
                  {item.fields?.fecha}
                  <button
                    onClick={() => handleDelete(item.id)}
                    type='button'
                    className='text-white bg-red-700 hover:bg-red-800 focus:outline-none font-medium text-xs px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700'
                  >
                    Eliminar
                  </button>
                </TableCell>
                <TableCell className='max-w-xs whitespace-pre-wrap align-top'>
                  {item.fields?.description}
                </TableCell>
                <TableCell className='align-top'>
                  {item.fields?.categorias || 'No aplica'}
                </TableCell>
                <TableCell className='text-right align-top'>
                  ${new Intl.NumberFormat().format(item.fields?.cantidad)}
                </TableCell>

                <TableCell className='text-right align-top'>
                  <BadgeDelta
                    deltaType={
                      item.fields?.concepto === 'Ingreso'
                        ? 'increase'
                        : 'decrease'
                    }
                    size='xs'
                  >
                    {item.fields?.concepto}
                  </BadgeDelta>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  )
}
