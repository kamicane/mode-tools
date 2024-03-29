import fillTimings from './fill-timings.js'
import calculateBlanking from './calculate-blanking.js'
import { alignUp } from './util.js'

export default function calculateHVF (spec, pixelClockPrecision, hActive, vActive, vFreq) {
  let pixelClock, vTotal
  let diff = Infinity

  const hTotal = alignUp(Math.ceil(hActive / (1 - spec.H_BLANK_PERCENT)), 16)
  const vTotalMin = Math.ceil(vActive / (1 - spec.V_BLANK_PERCENT_MIN))
  const vTotalMax = Math.ceil(vActive / (1 - (spec.V_BLANK_PERCENT_MAX)))

  const pixelClockAbsMin = Math.ceil((spec.H_FREQ_MIN * hTotal) / pixelClockPrecision)
  const pixelClockAbsMax = Math.floor((spec.H_FREQ_MAX * hTotal) / pixelClockPrecision)

  for (let pixelClockCurrent = pixelClockAbsMin; pixelClockCurrent <= pixelClockAbsMax; pixelClockCurrent++) {
    const pixelClockAdj = pixelClockCurrent * pixelClockPrecision
    const hFreqCurrent = pixelClockAdj / hTotal
    const vTotalCurrent = Math.floor(hFreqCurrent / vFreq)

    if (vTotalCurrent < vTotalMin) continue
    if (vTotalCurrent > vTotalMax) break

    const vFreqCurrent = hFreqCurrent / vTotalCurrent

    const cDiff = Math.abs(vFreq - vFreqCurrent)
    if (cDiff < diff) {
      pixelClock = pixelClockAdj
      vTotal = vTotalCurrent
      diff = cDiff
    }

    if (cDiff === 0) break
  }

  if (vTotal == null) {
    throw new Error('parameters out of spec')
  }

  const {
    hFrontPorch, hSyncWidth, hBackPorch,
    vFrontPorch, vSyncWidth, vBackPorch
  } = calculateBlanking(spec, hActive, hTotal, vActive, vTotal)

  return fillTimings(
    pixelClock,
    hActive, hFrontPorch, hSyncWidth, hBackPorch,
    vActive, vFrontPorch, vSyncWidth, vBackPorch
  )
}
