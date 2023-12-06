'use strict'
// --- Day 1: Trebuchet?! ---

const {assert, loadData} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

const parse = (dsn) => {
  const data = rawInput[dsn]
  return data && data.split('\n').filter(v => Boolean(v))
}

const decode = (data, useWords) => {
  const phrases = 'zero|one|two|three|four|five|six|seven|eight|nine'
  const reversed = phrases.split('|').map(s => Array.from(s).reverse().join('')).join('|')
  const nums = '0123456789'

  const parseValue = (line, words) => {
    const r = new RegExp('(' + words + '|\\d)').exec(line)
    assert(r, 'bad input:', line)
    return r[1].length === 1 ? nums.indexOf(r[1]) : words.split('|').indexOf(r[1])
  }

  return data.map((line) => {
    let first, last

    if (useWords) {
      first = parseValue(line, phrases)
      last = parseValue(Array.from(line).reverse().join(''), reversed)
    } else {
      for (let i = 0, j, ch; (ch = line[i]) !== undefined; ++i) {
        if ((j = nums.indexOf(ch)) === -1) continue
        if (first === undefined) first = j
        last = j
      }
      assert(last !== undefined, 'bad input:', line)
    }
    return 10 * first + last
  })
}

const puzzle1 = (input) => {
  return decode(input, false).reduce((a, v) => a + v, 0)
}

const puzzle2 = (input) => {
  return decode(input, true).reduce((a, v) => a + v, 0)
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
