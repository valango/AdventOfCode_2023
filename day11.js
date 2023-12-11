// --- Day 11: Cosmic Expansion ---
'use strict'
const {cloneDeep} = require('lodash')
const {getOptions, loadData} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]
const {abs} = Math

/** @typedef {{galaxies: number[][], gaps: [number[][],number[][]]}} TData */

const populate = (limit, set = new Set()) => {
  new Array(limit).fill(0).forEach((v, i) => set.add(i))
  return set
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
    data = {galaxies, gaps: [Array.from(idleX).map(v => [v, 1]), Array.from(idleY).map(v => [v, 1])]}
  }
  return data
}

/**
 * @param {number} which
 * @param {number[][]} points
 * @param {number[][]} gaps
 * @param {number} factor
 */
const expandAxis = (which, points, gaps, factor = 2) => {
  const shift = factor - 1
  let from = 0

  for (let i = 0, gapBeg, gapLength; i < gaps.length; ++i) {
    [gapBeg, gapLength] = gaps[i]
    from = gapBeg + gapLength
    gaps[i][1] = gapLength * factor

    points.forEach((xy, i) => {
      if (xy[which] >= from) {
        points[i][which] += shift
      }
    })
    for (let j = gaps.length; --j > i;) gaps[j][0] += shift
  }
}

/**
 * @param {TData} model
 * @param {number} factor
 */
const expandGaps = (model, factor = 2) => {
  for (let which = 0; which < 2; ++which) {
    expandAxis(which, model.galaxies, model.gaps[which], factor)
  }
  return model
}

const makePairs = limit => {
  const pairs = []
  for (let i = 1; i < limit; ++i) {
    for (let j = 0; j < i; ++j) pairs.push([j, i])
  }
  return pairs
}

const getDistance = (points, a, b) => abs(points[a][0] - points[b][0]) + abs(points[a][1] - points[b][1])

/**
 * @param {TData} input
 * @param {number} factor
 */
const compute = (input, factor) => {
  const model = expandGaps(cloneDeep(input), factor)
  const lengths = makePairs(model.galaxies.length).map(([a, b]) => getDistance(model.galaxies, a, b))
  return lengths.reduce((sum, v) => sum + v, 0)
}

/** @param {TData} input */
const puzzle1 = (input) => compute(input, 2)

/** @param {TData} input */
const puzzle2 = (input) => compute(input, getOptions().isDemo ? 100 : 1000000)

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
#...#.....`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
