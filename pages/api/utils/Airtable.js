const Airtable = require('airtable')
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
)
import { months } from '../../../utils/consts'

const tableTodo = base(process.env.AIRTABLE_TABLE_NAME)
const tableIncomeExpenses = base(process.env.AIRTABLE_TABLE_INCOME_NAME)

const getMinifiedRecord = (record) => {
  // console.log(record)
  if (!record.fields.completed) {
    record.fields.completed = false
  }

  return {
    id: record.id,
    fields: record.fields,
  }
}

const minifyRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record))
}

const minifyRecordsTotales = ({ type, userId }) => {
  return new Promise((resolve, reject) => {
    let out = 0
    tableIncomeExpenses
      .select({
        filterByFormula: `AND(concepto = '${type}', userId = '${userId}') `,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          records.forEach(function (record) {
            // console.log('Retrieved', record.get('cantidad'))
            out = out + Number(record.get('cantidad'))
          })

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage()
        },
        function done(err) {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            resolve(out)
          }
        }
      )
  })
}

const minifyRecordsTotalesMonths = ({ type, userId }) => {
  return new Promise((resolve, reject) => {
    // let out = 0
    const year = new Date().getFullYear().toString()
    const totalMonths = []

    tableIncomeExpenses
      .select({
        filterByFormula: `AND(concepto = '${type}', userId = '${userId}') `,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          months.forEach((month) => {
            let total = 0
            records.forEach(function (record) {
              // console.log('Retrieved', record.get('cantidad'))
              if (year === record.get('year')) {
                // console.log(item.fields)
                if (record.get('mes') === month) {
                  total = total + Number(record.get('cantidad'))
                }
              }
            })
            totalMonths.push({ month: month, type: type, total })
          })

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage()
        },
        function done(err) {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            resolve(totalMonths)
          }
        }
      )
  })
}

export {
  tableTodo,
  getMinifiedRecord,
  minifyRecords,
  tableIncomeExpenses,
  minifyRecordsTotales,
  minifyRecordsTotalesMonths,
}
