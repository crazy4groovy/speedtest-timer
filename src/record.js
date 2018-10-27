const path = require('path')
const fetch = require('node-fetch')
const gsp = require('google-spreadsheet-promise')

const FB = {
  domain: process.env.FB_DOMAIN || 'https://contentful-ae.firebaseio.com',
  ns: process.argv[2] || process.env.FB_NS|| 'test-run'
}

function recordFB(startDate, download, upload) {
  const url = `${FB.domain}/${FB.ns}/${+startDate}.json`
  const opts = { method: 'PUT', body: JSON.stringify({ download, upload }) }
  const asJson = r => r.json()

  console.log('>> Firebase', url, opts)
  return fetch(url, opts).then(asJson)
}

const GS = {
  // a spreadsheet key is the long id in the sheets URL
  key: process.env.GS_KEY || '1ZThfvm4B59P93W-7mcD90XOUtEJRM-tWqPuHZux9Roc',
  credsPath: process.env.GS_CREDSPATH || './speedtest-220719-d53a3a1394bc.json'
}

async function recordGSpreadsheet(startDate, download, upload) {
  console.log('>> GSpreadsheet', startDate, download, upload)
  const sheets = await gsp.init(GS.key, path.resolve(process.cwd(), GS.credsPath))
  const sheet = sheets.sheetNumber(0)
  return sheet.addRow({
    time: +startDate,
    download,
    upload,
 })
}

module.exports = (startDate) => async (err, {speeds}) => {
  if (err) throw err

  const { download, upload } = speeds

  await recordFB(startDate, download, upload)
  await recordGSpreadsheet(startDate, download, upload)
}
