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
  const { updateTodo, deleteTodo } = useContext(IncExpensContext)
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
            <TableHeaderCell>Descripción</TableHeaderCell>
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
                <TableCell>{item.fields.fecha}</TableCell>
                <TableCell>{item.fields.description}</TableCell>
                <TableCell>{item.fields.categorias || 'No aplica'}</TableCell>
                <TableCell className='text-right'>
                  ${new Intl.NumberFormat().format(item.fields.cantidad)}
                </TableCell>

                <TableCell className='text-right'>
                  <BadgeDelta
                    deltaType={
                      item.fields.concepto === 'Ingreso'
                        ? 'increase'
                        : 'decrease'
                    }
                    size='xs'
                  >
                    {item.fields.concepto}
                  </BadgeDelta>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  )
}
