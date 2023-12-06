'use strict'
// --- Day 2: Cube Conundrum ---

const {assert, getOptions, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {{string, number}[]} TData */

/** @returns {TData[]} */
const build = (data) =>
  data.map((line, lineIndex) => {
    const parts = line.slice(line.indexOf(':') + 2).split('; ')

    return parts.map(str => {
      const quotes = {}, statements = str.split(', ')
      for (const st of statements) {
        const r = assert(/(\d+)\s(\S+)/.exec(st), 'Error at line', lineIndex)
        quotes[r[2]] = parseInt(r[1])
      }
      return quotes
    })
  })

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) data = build(data)

  return data
}

const isPossible = (set, limits) => Object.entries(set).every(([k, v]) => limits[k] >= v)

/** @param {TData[]} input */
const puzzle1 = (input) => {
  const limits = {red: 12, green: 13, blue: 14}
  let sum = 0

  for (let i = 0, game; (game = input[i++]);) {
    if (game.every(part => isPossible(part, limits))) sum += i
  }
  return sum
}

/** @param {TData} game */
const power = (game) => {
  const res = {blue: 0, green: 0, red: 0}

  for (const part of game) {
    for (const [k, v] of Object.entries(part)) {
      res[k] = Math.max(v, res[k])
    }
  }
  return Object.values(res).reduce((a, v) => a * v, 1)
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return input.reduce((a, game) => a + power(game), 0)
}

//  Example (demo) data.
rawInput[1] = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
