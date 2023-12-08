// --- Day 8: Haunted Wasteland ---
'use strict'

const {assert, getOptions, log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {{lr:number[],map:number[][], start: number, end: number, starts:number[], ends:number[]}} TData */

/** @param {number[][]} old */
const optimizeMap = (old) => {
  const mapping = new Map()

  for (let i = 0; i < old.length; ++i) {
    mapping.set(old[i][0], i)
  }

  return old.map(([, l, r]) => ([mapping.get(l), mapping.get(r)]))
}

const parse = (dsn) => {
  let data = rawInput[dsn], map = [], starts = [], ends = []

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
    let lr, r, start, end
    for (const line of data) {
      if (lr === undefined) lr = Array.from(line).map(ch => 'LR'.indexOf(ch))
      else {
        assert((r = /(\w+)\W+(\w+)\W+(\w+)/.exec(line)), 'BAD LINE')
        if (r[1].endsWith('A')) {
          starts.push(map.length)
          if (r[1] === 'AAA') start = map.length
        } else if (r[1].endsWith('Z')) {
          ends.push(map.length)
          if (r[1] === 'ZZZ') end = map.length
        }
        map.push([translate(r[1]), translate(r[2]), translate(r[3])])
      }
    }
    map = optimizeMap(map)
    data = {lr, map, start, end, starts, ends}
  }
  return data
}

/** @param {TData} input */
const puzzle1 = (input) => {
  const {lr, map, end} = input, dst = map.length - 1, limit = lr.length
  let ip = 0, steps = 0

  for (let dir = 0, inode = input.start; ; ++ip, ++steps) {
    const [l, r] = map[inode]
    // if (l === r && l === inode) break
    if (inode === end) break
    if (ip === limit) ip = 0
    dir = lr[ip]
    inode = dir ? r : l
  }

  return steps
}


/** @param {TData} input */
const puzzle2 = (input) => {
  const {lr, map, starts, ends} = input
  const pos = [...starts], {length} = pos, limit = lr.length
  let steps = 0

  const solveOneFrom = (inode) => {
    for (let dir = 0, ip = 0, next; ; ++ip, ++steps) {
      if (ends.includes(inode)) break

      if (ip === limit) ip = 0
      dir = lr[ip]

      next = map[inode][dir]
      inode = next
    }
    return steps
  }

  const counts = starts.map(solveOneFrom)
  //  [19631, 36918, 49517, 72664, 86435, 107238]
  //  Now we need to compute the smallest number divisible to each of the counts!
  //  The numbers are not divisible to each other, but their product 24170885259850997520004545120n is too high.

  return counts.length
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
rawInput[2] = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
