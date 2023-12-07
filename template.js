'use strict'

const {assert, getOptions,  log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), undefined, undefined, undefined]

/** @typedef {*} TData */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    return data
  }
  return data
}

/** @param {TData[]} input */
const puzzle1 = (input) => {
  return undefined
}

/** @param {TData[]} input */
const puzzle2 = (input) => {
  return undefined
}

//  Example (demo) data.
rawInput[1] = ``
//  Uncomment the next line to disable demo for puzzle2 or to define different demo data for it.
//  rawInput[2] = ``

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
