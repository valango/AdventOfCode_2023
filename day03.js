'use strict'
// --- Day 3: Gear Ratios ---

const {loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]
const {abs} = Math

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data
  }
  return data
}

const doesOverlap = (a1, a2, b1, b2) => b2 >= a1 && b1 <= a2

/** @type {Map<string, number[]>} */
let gears

/** @param {string[]} input */
const puzzle1 = (input) => {
  const parts = []
  gears = new Map()

  for (let y = 0, line; (line = input[y]); ++y) {
    for (let x = 0, r; (r = /([^.\d]+)/.exec(line));) {
      parts.push([y, x + r.index, x + r.index + r[1].length - 1])
      line = line.slice(r.index + r[1].length)
      if (r[1] === '*') gears.set(y + ':' + (x + r.index), [])
      x += r.index + r[1].length
    }
  }
  let sum = 0

  for (let y = 0, line; (line = input[y]); ++y) {
    for (let x = 0, r, d = 0, array, key; (r = /(\d+)/.exec(line)); x += d) {
      d = r.index + r[1].length

      if (parts.find(([iR, xA, xB]) => {
        if (abs(iR - y) <= 1 && doesOverlap(xA, xB, x + r.index - 1, x + d)) {
          key = iR + ':' + xA
          return true
        }
        return false
      })) {
        if ((array = gears.get(key))) {
          array.push(parseInt(r[1]))
        }
        sum += parseInt(r[1])
      }
      line = line.slice(d)
    }
  }
  return sum
}

/** @param {string[]} input */
const puzzle2 = (input) => {
  if (gears === undefined) puzzle1(input)

  let sum = 0

  gears.forEach((v) => {
    if (v.length === 2) sum += v[0] * v[1]
  })
  return sum
}

//  Example (demo) data.
rawInput[1] = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
