import React, { useContext, useState } from 'react'
// import { IncExpensContext } from '../contexts/IncomesExpensesContext'
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
import { meses } from '../utils/consts'

export default function IncomeExpense({ incomesExpenses }) {
  const [selectedMonth, setSelectedMonth] = useState([])

  const isCategorySelected = (category) =>
    selectedMonth.includes(category?.month) || selectedMonth.length === 0
  // console.log(incomeExpense)

  return (
    <Card className='mt-6'>
      <MultiSelectBox
        onValueChange={(value) => setSelectedMonth(value)}
        placeholder='Seleccione un mes...'
        className='max-w-xs'
      >
        {meses.map((item) => (
          <MultiSelectBoxItem key={item} value={item} text={item} />
        ))}
      </MultiSelectBox>
      <Table className='mt-6'>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Mes</TableHeaderCell>
            <TableHeaderCell className='text-right'>
              Ingresos ($)
            </TableHeaderCell>
            <TableHeaderCell className='text-right'>Gastos ($)</TableHeaderCell>
            <TableHeaderCell className='text-right'>
              Total Profit
            </TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {incomesExpenses
            .filter((item) => isCategorySelected(item))
            .map((item) => (
              <TableRow key={item.month}>
                <TableCell>{item.month}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>{item.total || 'No aplica'}</TableCell>
                <TableCell className='text-right'>
                  ${new Intl.NumberFormat().format(200000)}
                </TableCell>

                <TableCell className='text-right'>
                  <BadgeDelta
                    deltaType={
                      item.type === 'Ingreso' ? 'increase' : 'decrease'
                    }
                    size='xs'
                  >
                    {item.type}
                  </BadgeDelta>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  )
}
