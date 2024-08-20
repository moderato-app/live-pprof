// noinspection ES6ConvertVarToLetConst,JSUnresolvedReference

'use strict'

var map = {
  year: 31536000000,
  month: 2592000000,
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  second: 1000,
  ms: 1,
}

var short = {
  year: 'y',
  month: 'mo',
  day: 'd',
  hour: 'h',
  minute: 'm',
  second: 's',
  ms: 'ms',
}

export default function prettyTime(value, options) {
  options = options || {}

  if (typeof value === 'string') {
    value = parseInt(value, 10)
    if (isNaN(value)) {
      throw new Error('Invalid value: ' + value)
    }
  } else if (typeof value !== 'number') {
    throw new Error('Invalid value: ' + value)
  }

  value = Math.abs(value)

  var unit
  Object.keys(map).some(function (key) {
    var unitValue = map[key]
    unit = key
    if (value >= unitValue) {
      value = value / unitValue
      return true
    }
  })

  if (typeof options.decimals === 'number') {
    value = Number(value.toFixed(options.decimals))
  }

  if (options.short) {
    unit = short[unit]
  } else if (value > 1 && unit !== 'ms') {
    unit += 's'
  }

  return [value, unit].join(' ')
}
