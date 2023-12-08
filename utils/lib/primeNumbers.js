'use strict'

const primes = [2]

module.exports = n => {
  if (n < 1) return 1
  n += (n === 1 || n % 2 === 0) ? 1 : 2

  while (!primes.includes(n)) {
    if (!primes.find(p => n % p === 0)) {
      primes.push(n)
      break
    }
    n += 2
  }
  return n
}
