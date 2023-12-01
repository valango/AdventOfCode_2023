//  core/index.js
'use strict'

const {opendirSync, readFileSync} = require('fs')
const dumper = require('./dumper')
const {
  assert,
  setOptions,
  logOn,
  parseCLI,
  print,
  say,
  usecsFrom
} = require('.')

const maxN = BigInt(Number.MAX_SAFE_INTEGER)

/**
 * @param {Set<string>} requiredDays  - ['01', '02']
 * @param {Array<string>} modules     - ['day01.js', 'day25.js']
 * @param {boolean} allDays
 * @returns {Array<string>|string}    - ['01'] | 'Error'
 */
const prepareDays = (requiredDays, modules, allDays) => {
  let days

  if (allDays) {
    days = modules.sort()
  } else {
    if (requiredDays.size) {
      days = Array.from(requiredDays).filter(day => modules.includes(day))
      if (days.length !== requiredDays.size) {
        return 'No modules for given day(s)!\n'
      }
    } else {
      days = [modules.sort().reverse()[0]]  //  Pick the last one.
    }
  }
  return days
}

/**
 * @param {function(*, object=):*} puzzle
 * @param {*} data
 * @returns {{result: *, time: number}|undefined}
 */
const execute = (puzzle, data) => {
  const t0 = process.hrtime()
  let value = puzzle(data)
  const time = Math.floor(usecsFrom(t0))

  if (value !== undefined) {
    if (typeof value === 'bigint' && value < maxN) {
      value = Number(value)
    }
    return {value, time}
  }
}

/**
 * @param {Array<string>} days
 * @param {Object} options
 * @param {function(string)} say
 * @returns {Array<Object>}
 */
const runPuzzles = (days, options, say) => {
  let loadable, record
  const longLine = '\r'.padEnd(30) + '\r', output = []
  const {useBoth, useDemo} = options, opts = {...options, days: undefined}

  /* istanbul ignore next */
  const runAndReport = (puzzleNumber, data, msg, isDemo) => {
    setOptions({...opts, isDemo})
    say(` ${msg}...`)
    const res = data && execute(loadable.puzzles[puzzleNumber], data)
    say(`\b\b\b: ok`)

    return res
  }

  for (const day of days) {
    loadable = require('../day' + day)
    record = {day, lines: readFileSync('day' + day + '.js').toString().split('\n').length}
    const warmUpData = loadable.parse(1)

    for (let d, d0, d1, n = 0, result; n <= 1; ++n) {
      let msg = (`\rday${day}: puzzle #${n + 1} `)

      if (warmUpData) {
        setOptions({...opts, isDemo: true, isWarmUp: true})
        logOn(false)
        execute(loadable.puzzles[n], warmUpData)
        logOn(true)
      }

      if (useBoth || useDemo) {
        if (n && (d = loadable.parse(2))) {
          d1 = d
        }
        if (d1 === undefined) {
          d1 = loadable.parse(1)

          if (!d1 && !useBoth && (d1 = loadable.parse(0))) {
            record.comment = 'main data was used'
          }
        }
        if ((result = runAndReport(
          n, d1, msg + (record.comment ? 'MAIN' : 'demo'), true))) {
          (record.demo || (record.demo = {}))[n + 1 + ''] = result
        }
        say(longLine)
      }

      if (!useDemo) {
        if (d0 === undefined) d0 = loadable.parse(0)    //  TODO: what is the purpose here?
        if ((result = runAndReport(n, d0, msg + 'main', false))) {
          (record.main || (record.main = {}))[n + 1 + ''] = result
        }
        say(longLine)
      }
    }
    output.push(record)
  }
  return output
}

/* istanbul ignore next */
const run = (argv) => {
  const modules = []

  for (let dir = opendirSync('.'), entry; (entry = dir.readSync());) {
    if (entry.isFile() && /^day\d\d\.js$/.test(entry.name)) {
      modules.push(entry.name.slice(3, 5))
    }
  }

  const options = parseCLI(argv)

  if (options.message) {
    print(options.message)
    return options.code
  }

  assert(modules.length, 'No dayNN.js modules found!')

  const selectedDays = prepareDays(options.days, modules, options.allDays)

  if (typeof selectedDays === 'string') {
    print(options.message)
    return 1
  }

  const dump = dumper(options, print)

  const results = runPuzzles(selectedDays, options, say)

  if (results.length) {
    dump(results, options)
  } else {
    say('There is no results to be shown!\n')
  }

  return 0
}

module.exports = run
