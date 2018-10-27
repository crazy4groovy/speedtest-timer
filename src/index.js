require('dotenv').config()

const stats = require('./stats')
const record = require('./record')

const delayMs = Number(process.env.DELAY_MINUTES || 5) * 60 * 1000

const run = () => stats(
  record(new Date())
)

run()

setInterval(run, delayMs)
