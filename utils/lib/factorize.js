'use strict'

const nextPrime = require('./primeNumbers')

module.exports = number => {
  const /** @type {[number, number][]} */ factorsCounts = []
  let factor = 1, i = 0

  while (number > 1) {
    factor = nextPrime(factor)
    while (number % factor === 0) {
      if ((i = factorsCounts.findIndex(r => r[0] === factor)) === -1) {
        factorsCounts.push([factor, 1])
      } else factorsCounts[i][1]++
      number /= factor
    }
  }
  return factorsCounts
}
