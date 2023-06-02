import { Card, Grid, Metric, Text } from '@tremor/react'
export default function Totales({ incomesTotal, expensesTotal }) {
  const total = incomesTotal - expensesTotal
  return (
    <Grid numColsSm={2} numColsLg={3} className='gap-6 mb-5'>
      <Card key='Ingresos' className='bg-green-100'>
        <Text>Total Ingresos</Text>
        <Metric>${new Intl.NumberFormat('es-CO').format(incomesTotal)}</Metric>
      </Card>
      <Card key='Gastos' className='bg-red-100'>
        <Text>Total Gastos</Text>
        <Metric>${new Intl.NumberFormat('es-CO').format(expensesTotal)}</Metric>
      </Card>
      <Card
        key='Profit'
        className={`${total >= 0 ? 'bg-green-100' : 'bg-red-100'}`}
      >
        <Text>Total Profit</Text>
        <Metric>${new Intl.NumberFormat('es-CO').format(total)}</Metric>
      </Card>
    </Grid>
  )
}
