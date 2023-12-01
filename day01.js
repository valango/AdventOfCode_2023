'use strict'

const {assert, getOptions, log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {*} TData */

const parse = (dsn) => {
  const phrases = 'zero|one|two|three|four|five|six|seven|eight|nine'
  const reversed = phrases.split('|').map(s => Array.from(s).reverse().join('')).join('|')
  const nums = '0123456789'
  let data = rawInput[dsn]

  const parse = (line, words) => {
    let r = new RegExp('(' + words + '|\\d)').exec(line)
    if (r === null) {
      r = ''
    }
    return r[1].length === 1 ? nums.indexOf(r[1]) : words.split('|').indexOf(r[1])
  }

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    data = data.map((line) => {
      const first = parse(line, phrases)
      const last = parse(Array.from(line).reverse().join(''), reversed)
      /* while ((r = /(one|two|three|four|five|six|seven|eight|nine|\d)/.exec(line))) {
        last = r[1].length === 1 ? nums.indexOf(r[1]) : words.indexOf(r[1])
        if (first === undefined) first = last
        line = line.slice(r.index + r[1].length)
      } */
      /* for (let i = 0, j, ch; (ch = line[i]) !== undefined; ++i) {
        if ((j = nums.indexOf(ch)) === -1) continue
        if (first === undefined) first = j
        last = j
      } */
      if (last === undefined) throw new Error('BAA')
      log('R', first, last)
      return 10 * first + last
    })
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

/** @param {TData[]} input */
const puzzle1 = (input) => {
  // log('I', input)
  const r = input.reduce((a, v) => a + v, 0)
  return r
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  log('I', input)
  const r = input.reduce((a, v) => a + v, 0)
  return r
}

//  Example (demo) data.
rawInput[1] = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo data for it.
rawInput[2] = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
