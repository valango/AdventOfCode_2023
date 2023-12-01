'use strict'
const {formatWithOptions} = require('util')

/**
 * @param value: any
 * @param message: string
 * @param args: any[]
 */
const assert = (value, message, ...args) => {
  if (value) return value

  const stack = new Error().stack.split('\n')
  const top = stack.findIndex(str => str.includes('modules/'))
  process.stderr.write('FAILED: '+formatWithOptions({colors: true, depth: Infinity}, message, ...args) + '\n')
  process.stderr.write(stack.slice(2,top).join('\n') + '\n')
  process.exit(1)
}

module.exports = assert
