import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import assert from 'assert'
import mustache from 'mustache'
// the pyramid is all that matters

const dirname = path.dirname(import.meta.url)
const edidTemplateURL = path.join(dirname, '../templates/edid.mustache')
const edidTemplate = fs.readFileSync(new URL(edidTemplateURL), 'utf8')

function log (...arg) {
  console.warn(...arg)
}

function fix (n, f) {
  return chalk.yellow(n.toFixed(f))
}

export default function printTimings (timings) {
  /* --- ASSERT */

  assert(timings.hSyncWidth + timings.hFrontPorch + timings.hBackPorch === timings.hBlank)
  assert(timings.vSyncWidth + timings.vFrontPorch + timings.vBackPorch === timings.vBlank)
  assert(timings.hTotal === timings.hActive + timings.hFrontPorch + timings.hSyncWidth + timings.hBackPorch)
  assert(timings.vTotal === timings.vActive + timings.vFrontPorch + timings.vSyncWidth + timings.vBackPorch)

  /* --- SPEC */

  const hBlankPercent = Math.max(timings.hBlank / timings.hTotal, 0.01)
  const hSyncWidthPercent = Math.max(timings.hSyncWidth / timings.hTotal, 0.01)
  const hPorchRatio = Math.max(timings.hFrontPorch / (timings.hFrontPorch + timings.hBackPorch), 0.01)

  const vBlankPercent = Math.max(timings.vBlank / timings.vTotal, 0.01)
  const vSyncWidthPercent = Math.max(timings.vSyncWidth / timings.vTotal, 0.01)
  const vPorchRatio = Math.max(timings.vFrontPorch / (timings.vFrontPorch + timings.vBackPorch), 0.01)

  log(chalk.blue('# INFO:\n'))

  log('V_FREQ:', timings.vFreq)
  log('H_FREQ:', timings.hFreq)
  log('P_CLOCK_HZ:', timings.pixelClock)

  log('H_ACTIVE:', timings.hActive)
  log('H_FRONT_PORCH:', timings.hFrontPorch)
  log('H_SYNC_WIDTH:', timings.hSyncWidth)
  log('H_BACK_PORCH:', timings.hBackPorch)
  log('H_TOTAL:', timings.hTotal)

  log('V_ACTIVE:', timings.vActive)
  log('V_FRONT_PORCH:', timings.vFrontPorch)
  log('V_SYNC_WIDTH:', timings.vSyncWidth)
  log('V_BACK_PORCH:', timings.vBackPorch)
  log('V_TOTAL:', timings.vTotal)

  log(chalk.blue('\n# SPEC FROM MODE:\n'))

  log('H_BLANK_PERCENT:', fix(hBlankPercent, 2))
  log('H_SYNC_WIDTH_PERCENT:', fix(hSyncWidthPercent, 2))
  log('H_PORCH_RATIO:', fix(hPorchRatio, 2))
  log('V_BLANK_PERCENT:', fix(vBlankPercent, 2))
  log('V_SYNC_WIDTH_PERCENT:', fix(vSyncWidthPercent, 2))
  log('V_PORCH_RATIO:', fix(vPorchRatio, 2))

  /* raspberry pi hdmi timings */
  log(chalk.blue('\n# HDMI TIMINGS (raspberry pi dispmanx):\n'))

  log(
    'hdmi_timings %d 1 %d %d %d %d 1 %d %d %d 0 0 0 %d 0 %d 0',
    timings.hActive, timings.hFrontPorch, timings.hSyncWidth, timings.hBackPorch,
    timings.vActive, timings.vFrontPorch, timings.vSyncWidth, timings.vBackPorch,
    Math.round(timings.vFreq), timings.pixelClock
  )

  /* linux modeline */
  log(chalk.blue('\n# LINUX MODELINE:\n'))

  log(`ModeLine "${timings.hActive}x${timings.vActive}@${timings.vFreq.toFixed(2)}"`,
    timings.pixelClock / 1000000,
    timings.hActive, timings.hSyncStart, timings.hSyncEnd, timings.hTotal,
    timings.vActive, timings.vSyncStart, timings.vSyncEnd, timings.vTotal
  )

  /* edid.s */
  const pixelClockKhz = Math.round(timings.pixelClock / 1000)

  if ((pixelClockKhz * 1000) !== timings.pixelClock) {
    log(chalk.blue('\n# EDID.S (linux kernel edid compiler): cannot generate, pixel clock precision too high.\n'))
  } else {
    log(chalk.blue('\n# EDID.S (linux kernel edid compiler):\n'))

    const vFreqRound = Math.round(timings.vFreq)

    const edidSString = mustache.render(edidTemplate, {
      NAME: `${timings.hActive}x${timings.vActive}@${vFreqRound}`,
      P_CLOCK_KHZ: pixelClockKhz,
      H_ACTIVE: timings.hActive,
      V_ACTIVE: timings.vActive,
      H_BLANK: timings.hBlank,
      V_BLANK: timings.vBlank,
      H_OFFSET: timings.hFrontPorch,
      V_OFFSET: timings.vFrontPorch,
      H_PULSE: timings.hSyncWidth,
      V_PULSE: timings.vSyncWidth,
      V_FREQ_INT: vFreqRound
    })

    log(chalk.green(edidSString))
  }
}
