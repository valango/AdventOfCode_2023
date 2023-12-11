'use strict'

const {assert, getOptions, log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

const {abs, max} = Math

/** @typedef {{galaxies: number[], idles: [number[],number[]]}} TData */

const populate = (limit, set = new Set()) => {
  new Array(limit).fill(0).forEach((v, i) => set.add(i))
  return set
}

const dump = (points) => {
  if (!getOptions().isDemo) return
  let pointsLeft = points.length, width = points.reduce((a, p) => max(a, p[0]), 0) + 1
  let header = ['     ']
  for (let x = 0; x < width; ++x) {
    header.push(x.toString(16).slice(0, 1))
  }
  console.log('\n' + header.join(''))
  for (let y = 0; pointsLeft !== 0; ++y) {
    const row = new Array(width).fill('.')
    for (let i, x = 0; x < width && pointsLeft !== 0; ++x) {
      if ((i = points.findIndex(p => p[0] === x && p[1] === y)) !== -1) {
        row[x] = i + ''
        --pointsLeft
      }
    }
    console.log((y + ': ').padStart(5) + row.join(''))
  }
}

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    const galaxies = [], idleY = populate(data.length), idleX = new Set()
    for (let y = 0, line; (line = data[y]); ++y) {
      if (y === 0) populate(line.length, idleX)
      for (let x = 0; x < line.length; ++x) {
        if (line[x] === '#') {
          galaxies.push([x, y])
          idleX.delete(x)
          idleY.delete(y)
        }
      }
    }
    data = {galaxies, idles: [Array.from(idleX), Array.from(idleY)]}
  }
  return data
}

/**
 * @param {number} which
 * @param {number[][]} points
 * @param {number[]} idles
 * @param {number} factor
 */
const expandAxis = (which, points, idles, factor = 2) => {
  const /** @type {number[]} */ idles1 = [], shift = factor - 1
  let from = 0

  for (let i = 0, value; (value = idles[i]) !== undefined; ++i) {
    for (let i = 0; i < factor; ++i) {
      idles1.push(value + i)
    }
    from = value + 1
    for (let j = idles.length; --j > i;) idles[j] += shift
    points.forEach((xy, i) => {
      if (xy[which] >= from) {
        points[i][which] += shift
      }
    })
  }
  return idles1
}

/**
 * @param {TData} m
 * @param {number} factor
 */
const expand = (m, factor = 2) => {
  for (let which = 0; which < 2; ++which) {
    m.idles[which] = expandAxis(which, m.galaxies, m.idles[which])
  }
  return m
}

const makePairs = limit => {
  const pairs = []
  for (let i = 1; i < limit; ++i) {
    for (let j = 0; j < i; ++j) pairs.push([j, i])
  }
  return pairs
}

const getDistance = (points, a, b) => {
  return abs(points[a][0] - points[b][0]) + abs(points[a][1] - points[b][1])
}

/** @param {TData} input 13:25 expect 374 */
const puzzle1 = (input) => {
  expand(input)
  dump(input.galaxies)
  const pairs = makePairs(input.galaxies.length)
  const lengths = pairs.map(([a, b]) => getDistance(input.galaxies, a, b))
  return lengths.reduce((sum, v) => sum + v, 0)
}

/** @param {TData} input */
const puzzle2 = (input) => {
  return undefined
}

//  Example (demo) data.
rawInput[1] = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....

`
//  Uncomment the next line to disable demo for puzzle2 or to define different demo data for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
