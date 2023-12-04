'use strict'

const {assert, getOptions, log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {*} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    data = data.map(line =>
      line.slice(line.indexOf(':') + 1).split('|').map(half => half.split(' ').filter(s => s))
    )
  }
  return data   //  NOTE: The runner will distinguish between undefined and falsy!
}

const getScore = (bets, winning) => {
  let score = 0

  for (const bet of bets) {
    if (winning.includes(bet)) {
      score = score ? score * 2 : 1
    }
  }
  return score
}

/** @param {TData[]} input */
const puzzle1 = (input) => {
  return input.reduce((s, [bets, winning]) => s + getScore(bets, winning), 0)
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return undefined
}

//  Example (demo) data.
rawInput[1] = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo data for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
