'use strict'
// --- Day 7: Camel Cards ---

const {loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {{hand:string, bid:number, pairs:[string, number][], strength:number}} Rec */

const labelRanks = Array.from('AKQJT98765432').reverse()
const typeRanks = '11111 2111 221 311 32 41 5'.split(' ')
let dbg = []

/** @param {Rec} entry */
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

const getScore = (entries) => {
  entries.sort((a, b) => {
    let i = a.strength - b.strength
    if (i === 0) {
      for (let j = 0; i === 0 && j < 5; ++j) {
        i = labelRanks.indexOf(a.hand[j]) - labelRanks.indexOf(b.hand[j])
      }
    }
    if (i === 0) {
      dbg.pop()
    }
    return i
  })
  dbg.push('')
  return entries.reduce((a, r, i) => a + (i + 1) * r.bid, 0)
}

// #1 D: 6440 M: 251545216   #2 D: 5905  M: 249261452 (wrong)
//                                          250599963 (wrong)
//                                          250599963

/** @param {Rec[]} input */
const puzzle1 = (input) => {
  return getScore(input)
}

/** @param {Rec} rec */
const toReplaceWithJoker = (rec) => {
  if (rec.pairs.length === 1) {
    return 'A'
  }
  const iJ = rec.pairs.findIndex(p => p[0] === 'J')
  const pairs = rec.pairs.slice()
  const pJ = pairs.splice(iJ, 1)[0]
  const s1 = pairs.map(p => p[0]).join('')

  if (pJ[1] === 1 && (rec.strength % 2) === 0 || pJ[1] === 2 && rec.strength === 1 || pJ[1] === 3) {
    dbg.pop()
    pairs.sort((a, b) => labelRanks.indexOf(b[0]) - labelRanks.indexOf(a[0]))
    if (s1 !== pairs.map(p => p[0]).join('') && pJ[1] === 1 && rec.strength === 4) {
      dbg.pop()
    }
  } else {
    dbg.pop()
  }
  return pairs[0][0]
}

//  #2 result is still invalid!

/** @param {Rec[]} entries */
const puzzle2 = (entries) => {
  for (const r of entries) {
    let jokers = Array.from(r.hand).reduce((cnt, ch) => cnt + (ch === 'J' ? 1 : 0), 0)

    if (jokers) {
      let ch = toReplaceWithJoker(r), key = r.hand.replaceAll('J', ch)
      setStrength(r, key)
      dbg.pop()
    }
  }

  return getScore(entries)
}

//  Example (demo) data.
rawInput[1] = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
