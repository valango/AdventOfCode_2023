// --- Day 5: If You Give A Seed A Fertilizer ---
'use strict'

const {cloneDeep} = require('lodash')
const {loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), loadData(module.filename, '.demo'), undefined, undefined]

/** @typedef {{beg:number, end:number, shift:number}} Transform */
/** @typedef {Transform[]} Step */

const parse = (dsn) => {
  let data = rawInput[dsn]

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    let seeds = [], steps = [], step

    for (const line of data) {
      if (line.startsWith('seeds:')) {
        seeds = line.split(': ')[1].split(' ').map(s => parseInt(s))
      } else if (/^\d/.test(line)) {
        let [dst, beg, len] = line.split(' ').map(s => parseInt(s))
        step.push({beg, end: beg + len, shift: dst - beg})
      } else {
        steps.push(step = [])
      }
    }
    data = {seeds, steps}
  }
  return data
}

const doesOverlap = ({beg, end}, from, to) => beg < to && end > from

const add = (array, tr) => {
  // const {beg, end} = tr, old = array.find(t => doesOverlap(t, beg, end))
  // assert(!old, `OVERLAP ${tr.id} -> ${old && old.id}`)
  return array.push(tr)
}

/** @param {Transform[][]} steps */
const flatten = (steps) => {
  let /** @type {Transform[]} */ transforms = [], i
  let /** @type {Transform} */ fresh, /** @type {Transform} */ old

  for (let stepIndex = 0; stepIndex < steps.length; ++stepIndex) {
    const /** @type {Transform[]} */ step = cloneDeep(steps[stepIndex])
    const toAdd = []

    while ((fresh = step.pop())) {
      //  Find existing transform with output affecting the `fresh`.
      while ((i = transforms.findIndex(t => doesOverlap(fresh, t.beg + t.shift, t.end + t.shift))) !== -1) {
        old = transforms.splice(i, 1)[0]

        const {shift} = old, start = old.beg + shift, limit = old.end + shift

        if (start < fresh.beg) {                                 //  Old starts before new - preserve leading part
          add(transforms, {...old, end: i = fresh.beg - shift})
          old.beg = i
        } else if (start > fresh.beg) {                          //  New starts before translation
          add(step, {...fresh, end: start})                      // - try starting part with other olds too
          fresh.beg = start
        }
        if (limit > fresh.end) {                                 //  Old ends after new - preserve trailing part
          add(transforms, {...old, beg: i = fresh.end - shift})
          old.end = i
        } else if (limit < fresh.end) {                          //  New ends after translation
          add(step, {...fresh, beg: limit})                      // - try trailing part with other olds too
          fresh.end = limit
        }
        //  All what is left of `fresh` fits with the output of `old` now.
        if (old.end > old.beg) {
          add(toAdd, {...old, shift: shift + fresh.shift}) //  OK, because no fresh output overlaps fresh input.
          fresh.end = fresh.beg
        }
      }
      //  A fresh transform not matching old outputs.
      if (fresh.end > fresh.beg) {                              //  Trash all parts shadowed by existing inputs.
        while ((i = transforms.findIndex(t => doesOverlap(fresh, t.beg, t.end))) !== -1) {
          old = transforms.splice(i, 1)[0]

          if (fresh.beg < old.beg) {
            fresh.beg = old.beg
            add(step, {...fresh})
          }
          if (fresh.end > old.end) {
            fresh.end = old.end
            add(step, {...fresh})
          }
          if (fresh.beg < fresh.end) {
            add(step, {...fresh})
            fresh.end = fresh.beg
          }
        }
        if (fresh.end > fresh.beg) {
          add(toAdd, fresh)
        }
      }
    }
    while(toAdd.length) add(transforms, toAdd.pop())
  }
  return transforms.sort((a, b) => a.beg - b.beg)
}

const computeOne = (seed, transforms) => {
  const t = transforms.find(r => r.beg <= seed && r.end > seed)
  return t ? seed + t.shift : seed
}

/**
 * @param {Transform[][]} steps
 * @param {number[]}      seeds
 */
const puzzle1 = ({steps, seeds}) => {
  const transforms = flatten(steps)
  const values = seeds.map(s => computeOne(s, transforms))

  return values.reduce((r, v) => Math.min(r, v), Number.POSITIVE_INFINITY)
}

const puzzle2 = ({steps, seeds}) => {
  const transforms = flatten(steps)
  let least = Number.POSITIVE_INFINITY

  for (let groupIndex = 0; groupIndex < seeds.length;) {
    //  Try start values only.
    let start = seeds[groupIndex++], limit = seeds[groupIndex++] + start, r

    const intervals = transforms.filter(t => t.beg < limit && t.end > start)

    for (const {beg} of intervals) {
      r = computeOne(Math.max(beg, start), transforms)
      if (r < least) least = r
    }
  }
  return least
}

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
