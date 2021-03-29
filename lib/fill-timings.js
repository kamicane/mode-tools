export default function fillTimings (
  pixelClock, hActive, hFrontPorch, hSyncWidth, hBackPorch, vActive, vFrontPorch, vSyncWidth, vBackPorch
) {
  const hTotal = hActive + hFrontPorch + hSyncWidth + hBackPorch
  const vTotal = vActive + vFrontPorch + vSyncWidth + vBackPorch

  const hFreq = pixelClock / hTotal
  const vFreq = hFreq / vTotal

  const hBlank = hFrontPorch + hSyncWidth + hBackPorch
  const vBlank = vFrontPorch + vSyncWidth + vBackPorch

  /* --- START / END */

  const hSyncStart = hActive + hFrontPorch
  const hSyncEnd = hActive + hFrontPorch + hSyncWidth

  const vSyncStart = vActive + vFrontPorch
  const vSyncEnd = vActive + vFrontPorch + vSyncWidth

  const timings = {
    hFreq,
    vFreq,

    pixelClock,

    hBlank,
    vBlank,

    hActive,
    hFrontPorch,
    hSyncWidth,
    hBackPorch,
    hTotal,
    vActive,
    vFrontPorch,
    vSyncWidth,
    vBackPorch,
    vTotal,

    hSyncStart,
    hSyncEnd,
    vSyncStart,
    vSyncEnd
  }

  return timings
}
