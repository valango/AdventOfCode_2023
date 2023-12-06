'use strict'
// --- Day 5: If You Give A Seed A Fertilizer ---

const {loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {{seeds:number[], steps: number[][][]}} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    let seeds = [], steps = [], step

    for (const line of data) {
      if (line.startsWith('seeds:')) {
        seeds = line.split(': ')[1].split(' ').map(s => parseInt(s))
      } else if (/^\d/.test(line)) {
        step.push(line.split(' ').map(s => parseInt(s)))
      } else {
        steps.push(step = [])
      }
    }
    data = {seeds, steps}
  }
  return data
}

const skip = new Error()

const convert = (value, steps) => {
  for (const step of steps) {
    try {
      for (const [dst, src, len] of step) {
        if (src <= value && (src + len) > value) {
          value = dst + (value - src)
          throw skip
        }
      }
    } catch (e) {
      if (e !== skip) throw e
    }
  }
  return value
}

/** @param {TData} input */
const puzzle1 = (input) => {
  const values = input.seeds.map(v => convert(v, input.steps))

  return values.reduce((r, v) => Math.min(r, v), Number.POSITIVE_INFINITY)
}

//  With real data, this thing will loop forever...
/** @param {TData} input */
const puzzle2 = (input) => {
  return /*
  let smallest = Number.POSITIVE_INFINITY, value

  for (let i = 0, a, b; (a = input.seeds[i++]) !== undefined;) {
    b = a + input.seeds[i++]
    while (a < b) {
      value = convert(a, input.steps)
      smallest = Math.min(value, smallest)
      ++a
    }
  }

  return smallest */
}

//  Example (demo) data.
rawInput[1] = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
