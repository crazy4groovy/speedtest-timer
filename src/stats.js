const  speedTest = require('speedtest-net')

module.exports = function stats(cb, opts = {}) {
  const test = speedTest(
    Object.assign({ maxTime: 5000 }, opts)
  )
  test.on('data', data => cb(null, data))
  test.on('error', err => cb(err))
}
