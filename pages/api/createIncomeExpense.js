import { tableIncomeExpenses } from './utils/Airtable'
import auth0 from './utils/auth0'

export default auth0.withApiAuthRequired(async (req, res) => {
  const { fecha, concepto, description, cantidad, categoria } = req.body
  const { user } = await auth0.getSession(req, res)
  let newCantidad = Number(cantidad)

  try {
    const createdRecords = await tableIncomeExpenses.create([
      {
        fields: {
          fecha,
          concepto,
          description,
          cantidad: newCantidad,
          categorias: categoria,
          userId: user.sub,
        },
      },
    ])
    const createdRecord = {
      id: createdRecords[0].id,
      fields: createdRecords[0].fields,
    }
    res.statusCode = 200
    res.json(createdRecord)
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.json({ msg: 'Something went wrong! :(' })
  }
})
