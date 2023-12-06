'use strict'
// --- Day 6: Wait For It ---

const {parseInt} = require('./utils')
const rawInput = [undefined, undefined]
const {floor, sqrt} = Math

/** @typedef {*} TData */

const parse = (dsn) => {
  const data = rawInput[dsn]

  return data && data.split('\n').filter(v => Boolean(v))
}

const getBetter = (t, distance) => {
  const x = sqrt(t * t - 4 * distance)
  let ta = floor((t - x) / 2), tb = floor((t + x) / 2)
  //  Make sure that our value is better than distance.
  const sa = ta * t - ta * ta
  if (sa <= distance) ++ta
  const sb = tb * t - tb * tb
  if (sb <= distance) --tb
  return tb - ta + 1
}

/** @param {string[]} input */
const puzzle1 = (input) => {
  const durations = input[0].split(/\s+/).slice(1).map(parseInt)
  const records = input[1].split(/\s+/).slice(1).map(parseInt)

  return durations.reduce((a, t, i) => a * getBetter(t, records[i]), 1)
}

/** @param {string[]} input */
const puzzle2 = (input) => {
  return getBetter(parseInt(input[0].split(/\s+/).slice(1).join('')), parseInt(input[1].split(/\s+/).slice(1).join('')))
}

rawInput[0] = `
Time:        41     66     72     66
Distance:   244   1047   1228   1040
`
//  Example (demo) data.
rawInput[1] = `
Time:      7  15   30
Distance:  9  40  200`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
