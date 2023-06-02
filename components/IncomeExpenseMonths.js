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
import { traslateMonths, months } from '../utils/consts'

export default function IncomeExpense({ incomesExpenses }) {
  const [selectedMonth, setSelectedMonth] = useState([])

  const isCategorySelected = (category) => {
    // console.log({ category })
    // console.log({ selectedMonth })
    return selectedMonth.includes(category?.month) || selectedMonth.length === 0
  }
  // console.log(incomeExpense)

  return (
    <Card className='mt-6'>
      <MultiSelectBox
        onValueChange={(value) => setSelectedMonth(value)}
        placeholder='Seleccione un mes...'
        className='max-w-xs'
      >
        {months.map((item) => (
          <MultiSelectBoxItem
            key={item}
            value={item}
            text={traslateMonths[item]}
          />
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
            .filter((item, index) => isCategorySelected(item, index))
            .map((item) => (
              <TableRow key={item.month}>
                <TableCell>{traslateMonths[item.month]}</TableCell>
                <TableCell className='text-right'>
                  ${new Intl.NumberFormat('es-CO').format(item.ingreso)}
                </TableCell>
                <TableCell className='text-right'>
                  ${new Intl.NumberFormat('es-CO').format(item.gasto)}
                </TableCell>
                {/* <TableCell className='text-right'>
                  ${new Intl.NumberFormat().format(200000)}
                </TableCell> */}

                <TableCell className='text-right'>
                  <BadgeDelta
                    deltaType={
                      item.ingreso - item.gasto > 0
                        ? 'increase'
                        : item.ingreso - item.gasto === 0
                        ? 'unchanged'
                        : 'decrease'
                    }
                    size='xs'
                  >
                    $
                    {new Intl.NumberFormat('es-CO').format(
                      item.ingreso - item.gasto
                    )}
                  </BadgeDelta>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  )
}
