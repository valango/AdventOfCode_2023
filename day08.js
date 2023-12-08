// --- Day 8: Haunted Wasteland ---
'use strict'

const {assert, getOptions, log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {{lr:number[],map:number[][]}} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    const indexMap = new Map(), map = []

    const translate = (str) => {
      let i = indexMap.get(str)
      if (i === undefined) {
        i = indexMap.size
        indexMap.set(str, i)
      }
      return i
    }
    let lr, r
    for (const line of data) {
      if (lr === undefined) lr = Array.from(line).map(ch => 'LR'.indexOf(ch))
      else {
        assert((r = /(\w+)\W+(\w+)\W+(\w+)/.exec(line)), 'BAD LINE')
        map.push([translate(r[1]), translate(r[2]), translate(r[3])])
      }
    }
    data = {lr, map}
  }
  return data
}

// Works w example, hangs w real.
/** @param {TData} input */
const traverse = (input) => {
  const {lr, map} = input, dst = map.length - 1, limit = lr.length
  let ip = 0, steps = 0

  for (let dir = 0, inode = 0; ; ++ip, ++steps) {
    const [v, l, r] = map[inode]
    if (l === r && l === v) break
    if (ip === limit) ip = 0
    dir = lr[ip]
    inode = dir ? r : l
    inode = map.findIndex(([i]) => i === inode)
  }

  return steps
}

/** @param {TData} input */
const puzzle1 = (input) => {
  return traverse(input)
}

/** @param {TData} input */
const puzzle2 = (input) => {
  return traverse(input)
}

//  Example (demo) data.
rawInput[1] = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo data for it.
rawInput[2] = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
