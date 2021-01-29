import { table, getMinifiedRecord } from './utils/Airtable'

export default async (req, res) => {
  const { id, fields } = req.body

  try {
    const updateRecords = await table.update([{ id, fields }])
    res.statusCode = 200
    res.json(getMinifiedRecord(updateRecords[0]))
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.json({ msg: 'Something went wrong! :(' })
  }
}
