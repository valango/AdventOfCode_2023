// --- Day 8: Haunted Wasteland ---
'use strict'

const {assert, loadData} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]
const factorize = require('./utils/lib/factorize')
const {max} = Math

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
  // console.log( 'G8 '+dsn, getOptions())
  let data = rawInput[dsn], map = [], starts = [], ends = []

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    const indexMap = new Map()
    let lr, r, start, end

    const translate = (str) => {
      let i = indexMap.get(str)
      if (i === undefined) {
        i = indexMap.size
        indexMap.set(str, i)
      }
      return i
    }

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
  const {lr, map, end} = input, limit = lr.length
  let ip = 0, steps = 0

  for (let inode = input.start; inode !== end; ++ip, ++steps) {
    if (ip === limit) ip = 0
    inode = map[inode][lr[ip]]
  }

  return steps
}

/** @param {TData} input */
const puzzle2 = (input) => {
  const {lr, map, starts, ends} = input, limit = lr.length

  const solveOneFrom = (inode) => {
    let steps = 0

    for (let ip = 0; !ends.includes(inode); ++ip, ++steps) {
      if (ip === limit) ip = 0

      inode = map[inode][lr[ip]]
    }
    return steps
  }

  const stepCounts = starts.map(solveOneFrom)
  const factorizations = stepCounts.map(factorize)
  const factorCounts = new Map()

  for (const factors of factorizations) {
    for (const [factor, count] of factors) {
      factorCounts.set(factor, max((factorCounts.get(factor) || 0), count))
    }
  }

  let magic = 1
  factorCounts.forEach((cnt, factor) => magic *= cnt * factor)

  return magic
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

rawInput[2] = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
