#!/usr/bin/env node
import yargs from 'yargs'
import yaml from 'yaml'
import fs from 'fs'

import printTimings from './lib/print-timings.js'
import calculateHVF from './lib/calculate-hvf.js'
import fillTimings from './lib/fill-timings.js'
import parseModeline from './lib/parse-modeline.js'

const parser = yargs(process.argv.slice(2))

parser
  .scriptName('mode-tools')
  .usage('Usage: $0 <command> [options]')
  .usage('Usage: $0 <command> --help')
  .alias('h', 'help')
  .alias('v', 'version')
  .demandCommand(1, 'you need to specify a command')

const specOpt = {
  type: 'string',
  demandOption: true,
  normalize: true,
  describe: 'spec file',
  coerce: (filePath) => {
    const specString = fs.readFileSync(filePath, 'utf8')
    return yaml.parse(specString)
  }
}

parser.command('parse-timings', 'parse timings', (yargs) => {
  yargs
    .demandCommand(9)
    .usage('Usage: $0 parse-timings pClockHz hActive hFrontPorch hSyncWidth hBackPorch vActive vFrontPorch vSyncWidth vBackPorch')
})

parser.command('parse-modeline', 'parse linux modeline', (yargs) => {
  yargs
    .demandCommand(9)
    .usage('Usage: $0 parse-modeline pClockMhz hActive hSyncStart hSyncEnd hTotal vActive vSyncStart vSyncEnd vTotal')
})

parser.command('calc', 'calculate timings, requires a spec file', (yargs) => {
  yargs
    .demandCommand(3)
    .usage('Usage: $0 calc hActive vActive vFreq --spec ./spec.yml')
    .option('spec', specOpt)
    .option('pixel-clock-precision', {
      type: 'number',
      default: 1
    })
})

parser.epilogue('https://github.com/kamicane/mode-tools')

const argv = parser.parse()

const params = Array.from(argv._)
const command = params.shift()

let timings

switch (command) {
  case 'calc':
    timings = calculateHVF(argv.spec, argv.pixelClockPrecision, ...params)
    break

  case 'parse-timings':
    timings = fillTimings(...params)
    break

  case 'parse-modeline':
    timings = parseModeline(...params)
    break
}

if (!timings) {
  parser.showHelp()
} else {
  printTimings(timings)
}
