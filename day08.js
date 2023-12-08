// --- Day 8: Haunted Wasteland ---
'use strict'

const {assert, getOptions, log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {{lr:number[],map:number[][], start: number}} TData */

/** @param {number[][]} old */
const optimizeMap = (old) => {
  const mapping = new Map()

  for (let i = 0; i < old.length; ++i) {
    mapping.set(old[i][0], i)
  }

  return old.map(([, l, r]) => ([mapping.get(l), mapping.get(r)]))
}

const parse = (dsn) => {
  let data = rawInput[dsn], map = []

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    const indexMap = new Map()

    const translate = (str) => {
      let i = indexMap.get(str)
      if (i === undefined) {
        i = indexMap.size
        indexMap.set(str, i)
      }
      return i
    }
    let lr, r, start
    for (const line of data) {
      if (lr === undefined) lr = Array.from(line).map(ch => 'LR'.indexOf(ch))
      else {
        assert((r = /(\w+)\W+(\w+)\W+(\w+)/.exec(line)), 'BAD LINE')
        if (r[1] === 'AAA') start = map.length
        map.push([translate(r[1]), translate(r[2]), translate(r[3])])
      }
    }
    map = optimizeMap(map)
    data = {lr, map, start}
  }
  return data
}

// Works w example, hangs w real.
/** @param {TData} input */
const traverse = (input) => {
  const {lr, map} = input, dst = map.length - 1, limit = lr.length
  let ip = 0, steps = 0

  for (let dir = 0, inode = input.start; ; ++ip, ++steps) {
    const [l, r] = map[inode]
    if (l === r && l === inode) break
    if (ip === limit) ip = 0
    dir = lr[ip]
    inode = dir ? r : l
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
ZZZ = (ZZZ, ZZZ)`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo data for it.
rawInput[2] = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
