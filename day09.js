// --- Day 9: Mirage Maintenance ---
'use strict'

const {loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {number[]} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    data = data.map(line => Array.from(line.split(' ')).map(parseInt))
  }
  return data
}

/** @param {any[]} array */
const last = (array) => array[array.length - 1]

/** @param {number[]} array */
const doDiffs = (array) => {
  const /** @type {number[]} */ diffs = []
  let last = undefined, allZeroes = true

  for (let i = 0, v, d; (v = array[i]) !== undefined; ++i, last = v) {
    if (i === 0) continue
    diffs.push(d = v - last)
    if (d !== 0) allZeroes = false
  }
  return [allZeroes, diffs]
}

/** @param {TData[]} input */
const puzzle1 = (input) => {
  let sum = 0

  for (const values of input) {
    let diffs = [...values], allZeroes = true, tails = []

    do {
      tails.push(last(diffs));
      [allZeroes, diffs] = doDiffs(diffs)
    } while (!allZeroes)

    sum = tails.reduce((a, v) => a + v, sum)
  }
  return sum
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  let sum = 0

  for (const values of input) {
    let diffs = [...values], allZeroes = true, heads = [], delta = 0

    do {
      heads.push([diffs[0]]);
      [allZeroes, diffs] = doDiffs(diffs)
    } while (!allZeroes)

    for (let i = heads.length; --i >= 0;) {
      delta = heads[i] - delta
    }
    sum += delta
  }
  return sum
}

//  Example (demo) data.
rawInput[1] = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
