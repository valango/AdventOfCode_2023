'use strict'
// --- Day 4: Scratchcards ---

const {loadData} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]
const {floor, min, pow} = Math

/** @typedef {string[][]} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    data = data.map(line =>
      line.slice(line.indexOf(':') + 1).split('|').map(half => half.split(' ').filter(s => s))
    )
  }
  return data
}

const getWins = (bets, winning) =>
  bets.reduce((cnt, bet) => cnt + (winning.includes(bet) ? 1 : 0), 0)

/** @param {TData[]} input */
const puzzle1 = (input) => {
  return input.reduce((s, [bets, winning]) => s + floor(pow(2, getWins(bets, winning)) / 2), 0)
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  const cards = input.map(([b, w]) => ({factor: getWins(b, w), count: 1}))

  for (let i = 0; i < cards.length; ++i) {
    for (let lim = min(i + cards[i].factor + 1, cards.length), j = i; ++j < lim;) {
      cards[j].count += cards[i].count
    }
  }

  return cards.reduce((s, c) => s + c.count, 0)
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

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
