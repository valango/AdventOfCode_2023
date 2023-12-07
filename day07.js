'use strict'
// --- Day 7: Camel Cards ---

const {loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {{hand:string, bid:number, pairs:[string, number][], strength:number}} Rec */

const labelRanks = Array.from('AKQJT98765432').reverse()
const jokerRanks = Array.from('AKQT98765432J').reverse()
const typeRanks = '11111 2111 221 311 32 41 5'.split(' ')

/**
 * @param {Rec} entry
 * @param {string?} key
 */
const setStrength = (entry, key = '') => {
  const map = new Map(), pairs = []
  const hand = key || entry.hand

  Array.from(hand).forEach(k => map.set(k, (map.get(k) || 0) + 1))
  map.forEach((v, k) => pairs.push([k, v]))

  const pattern = pairs.sort((a, b) => b[1] - a[1]).map(e => e[1]).join('')
  entry.strength = typeRanks.indexOf(pattern)
  if (!key) entry.pairs = pairs
  return entry
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    data = data.map(s => s.split(' '))
      .map(([hand, b]) => setStrength({
        hand, bid: parseInt(b), strength: undefined, pairs: []
      }))
  }
  return data
}

const getScore = (entries, ranks) => {
  entries.sort((a, b) => {
    let i = a.strength - b.strength

    for (let j = 0; i === 0 && j < 5; ++j) i = ranks.indexOf(a.hand[j]) - ranks.indexOf(b.hand[j])
    return i
  })
  return entries.reduce((a, r, i) => a + (i + 1) * r.bid, 0)
}

/** @param {Rec[]} input */
const puzzle1 = (input) => {
  return getScore(input, labelRanks)
}

/** @param {Rec} rec */
const getJokerReplacement = (rec) => {
  const pairs = [...rec.pairs]

  pairs.splice(pairs.findIndex(p => p[0] === 'J'), 1)

  return pairs[0][0]
}

/** @param {Rec[]} entries */
const puzzle2 = (entries) => {
  for (const r of entries) {
    const jokers = Array.from(r.hand).reduce((cnt, ch) => cnt + (ch === 'J' ? 1 : 0), 0)

    if (jokers > 0 && r.pairs.length > 1) {
      setStrength(r, r.hand.replaceAll('J', getJokerReplacement(r)))
    }
  }
  return getScore(entries, jokerRanks)
}

//  Example (demo) data.
rawInput[1] = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
