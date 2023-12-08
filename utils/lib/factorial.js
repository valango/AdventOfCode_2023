'use strict'

let lastFactorial = 1, lastNumber = 1

module.exports = n => {
  if (n < lastNumber) {
    lastFactorial = lastNumber = 1
  }
  while (lastNumber < n) {
    lastFactorial *= ++lastNumber
  }
  return lastFactorial
}
