'use strict'

const {assert, getOptions, log, loadData, parseInt} = require('./utils')
const rawInput = [loadData(module.filename), loadData(module.filename, '.demo'), undefined, undefined]
const {max,min} = Math

/** @typedef {{beg:number, end:number, shift:number}} Transform */
/** @typedef {Transform[]} Step */

let id = 0

const parse = (dsn) => {
  let data = rawInput[dsn]
  id = 0

  if (data && (data = data.split('\n').filter(v => Boolean(v))).length) {
    let seeds = [], steps = [], step

    for (const line of data) {
      if (line.startsWith('seeds:')) {
        seeds = line.split(': ')[1].split(' ').map(s => parseInt(s))
      } else if (/^\d/.test(line)) {
        let [dst, beg, len] = line.split(' ').map(s => parseInt(s))
        step.push({beg, end: beg + len, shift: dst - beg, id})
      } else {
        steps.push(step = [])
      }
    }
    data = {seeds, steps}
  }
  return data
}

// const isBetween = (v, a, b) => v >= a && v < b

const doesOverlap = ({beg, end}, from, to) => beg < to && end > from

const add = (array, tr) => {
  const {beg, end} = tr, old = array.find(t => doesOverlap(t, beg, end))

  assert(!old, `OVERLAP ${tr.id} -> ${old && old.id}`)
  tr.id = ++id
  if (id === 6) {
    id *= 1
  }
  return array.push(tr)
}

/** @param {Transform[][]} steps */
const flatten = (steps) => {
  let /** @type {Transform[]} */ transforms = [], i
  let /** @type {Transform} */ tr, /** @type {Transform} */ old
  id = 0

  for (const step of steps) {
    const combined = []

    for (const news = [...step]; (tr = news.pop());) {
      //  TODO: maintain the coverage area of tr, until all overlapping olds have been processed.
      //  Because old transforms inputs do not overlap, it is safe to add combined transform immediately
      //  The uncovered areas would generate new input areas, after they are checked for overlapping the existing inputs.
      let wasAdded = false
      while ((i = transforms.findIndex(t => doesOverlap(tr, t.beg + t.shift, t.end + t.shift))) !== -1) {
        old = transforms.splice(i, 1)[0]
        const {shift} = old, start = old.beg + shift, limit = old.end + shift

        if (start < tr.beg) {                                 //  Old starts before new - preserve starting part
          add(transforms, {...old, end: i = tr.beg - shift})
          old.beg = i
        } else if (start > tr.beg) {                          //  New starts before translation
          add(news, {...tr, end: start})                      // - try starting part with other olds too
          tr.beg = start
        }
        if (limit > tr.end) {                                 //  Old ends after new - preserve trailing part
          add(transforms, {...old, beg: i = tr.end - shift})
          old.end = i
        } else if (limit < tr.end) {                          //  New ends after translation
          add(news, {...tr, beg: limit})                      // - try trailing part with other olds too
          tr.end = limit
        }
        //  Now, the new transform fits w output of the old
        add(combined, {...old, shift: shift + tr.shift})
        wasAdded = true
      } // else add(combined, tr)
      if (!wasAdded) add(combined, tr)
    }
    while ((tr = combined.pop())) {
      if (tr.beg >= tr.end) continue
      if(tr.id===96){
        i = 0
      }
      while ((i = transforms.findIndex(t => doesOverlap(t, tr.beg, tr.end))) !== -1) {
        old = transforms.splice(i, 1)[0]
        if (old.beg < tr.beg) {
          add(transforms, {...old, end: tr.beg})
        }
        if (old.end > tr.end) {
          add(transforms, {...old, beg: tr.end})
        }
      }
      add(transforms, tr)
      /* i = 0
      if ((old = transforms.find(t => doesOverlap(t, tr.beg, tr.end)))) {
        if (tr.beg < old.beg) i = add(combined, {...tr, end: old.beg})
        if (tr.end > old.end) i = add(combined, {...tr, beg: old.end})
      }
      if (i === 0) {
        add(transforms, tr)
        transforms.sort((a, b) => a.beg - b.beg)
      } */
    }
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
  const vals = seeds.map(s => computeOne(s, transforms))
  // const values = input.seeds.map(v => convert(v, input.steps))

  return vals.reduce((r, v) => Math.min(r, v), Number.POSITIVE_INFINITY)
  // return vals.length
}

const puzzle2 = ({steps, seeds}) => {
  const transforms = flatten(steps), beginnings = transforms.map(t => t.beg)
  const tried = new Set()
  let least = Number.POSITIVE_INFINITY, v

  for (let groupIndex = 0; groupIndex < seeds.length;) {
    //  Try only the start values
    let start = seeds[groupIndex++], limit = seeds[groupIndex++] + start, r

    const intervals = transforms.filter(t => t.beg < limit && t.end > start)

    for (const {beg} of intervals) {
      r = computeOne(Math.max(beg, start), transforms)
      if (r < least) least = r
      // tried.add(v)
    }
    // const toTry = beginnings.filter(v => !tried.has(v) && v >= start && v < limit)

    /*for (const v of toTry) {
      r = computeOne(v, transforms)
      if (r < least) least = r
      tried.add(v)
    }*/
  }
  return least
}

module.exports = {parse, puzzles: [puzzle1, puzzle2]}
