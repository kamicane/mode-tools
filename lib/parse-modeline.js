import fillTimings from './fill-timings.js'

export default function parseModeline (pClockMhz, hActive, hSyncStart, hSyncEnd, hTotal, vActive, vSyncStart, vSyncEnd, vTotal) {
  const pClockHz = pClockMhz * 1000000
  const hFrontPorch = hSyncStart - hActive
  const hSyncWidth = hSyncEnd - hSyncStart
  const hBackPorch = hTotal - hSyncEnd

  const vFrontPorch = vSyncStart - vActive
  const vSyncWidth = vSyncEnd - vSyncStart
  const vBackPorch = vTotal - vSyncEnd

  return fillTimings(
    pClockHz,
    hActive, hFrontPorch, hSyncWidth, hBackPorch,
    vActive, vFrontPorch, vSyncWidth, vBackPorch
  )
}
