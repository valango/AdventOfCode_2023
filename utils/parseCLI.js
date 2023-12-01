'use strict'

const helpText = `Command line parameters:
  integer - day number(s), (default: most recent day only)
  a: all days
  b: both datasets (default: main data only)
  d: demo data only (mutually exclusive with 'b' option
  h: print this information and terminate
  j: generate output as JSON-formatted rows
  m: generate markdown output (default: text table for multiple, JSON for single puzzle)\n\n`

/**
 * @param {string[]} argv
 * @returns {Object}
 */
const parseCLI = (argv) => {
  let days = new Set(), flags = ''

  for (const arg of argv) {
    if (/^\d+$/.test(arg)) {
      days.add(arg.padStart(2, '0'))
    } else {
      if (arg.includes('h')) {
        return { code: 0, message: helpText }
      }
      if (Array.from(arg).some(c => !'abdjm'.includes(c))) {
        return { code: 1, message: `Illegal parameter '${arg}' - use -h option for help!\n` }
      }
      flags += arg
    }
  }

  const useBoth = flags.includes('b'), useDemo = flags.includes('d')
  const makeJSON = flags.includes('j'), makeMd = flags.includes('m')

  if (useBoth && useDemo) {
    return { code: 1, message: `Can not use both 'b' and 'd' simultaneously!\n` }
  }
  if (makeJSON && makeMd) {
    return { code: 1, message: `Can not use both 'm' and 'j' simultaneously!\n` }
  }
  return { allDays: flags.includes('a'), days, makeMd, makeJSON, useBoth, useDemo }
}

module.exports = parseCLI
