import { tableIncomeExpenses, minifyRecords } from './utils/Airtable'
// Create new table
import auth0 from './utils/auth0'

export default auth0.withApiAuthRequired(async (req, res) => {
  const { user } = await auth0.getSession(req, res)

  try {
    const records = await tableIncomeExpenses
      .select({
        sort: [{ field: 'fecha', direction: 'desc' }],
        filterByFormula: `userId = '${user.sub}'`,
        maxRecords: 30,
      })
      .firstPage() // 20 records
    const minifiedRecords = minifyRecords(records)
    res.statusCode = 200
    res.json(minifiedRecords)
  } catch (err) {
    res.statusCode = 500
    res.json({ msg: 'Something went wrong! :(' })
  }
})
