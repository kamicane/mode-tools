import { alignUp } from './util.js'

export default function calculateBlanking (spec, hActive, hTotal, vActive, vTotal) {
  /* --- H */

  const hBlank = hTotal - hActive
  const hSyncWidth = alignUp(Math.ceil(hTotal * spec.H_SYNC_WIDTH_PERCENT), 2)
  const hPorch = hBlank - hSyncWidth

  const hFrontPorch = alignUp(Math.ceil(hPorch * spec.H_PORCH_RATIO), 2)
  const hBackPorch = hBlank - hFrontPorch - hSyncWidth

  /* --- V */

  const vBlank = vTotal - vActive
  const vSyncWidth = Math.ceil(vTotal * spec.V_SYNC_WIDTH_PERCENT)
  const vPorch = vBlank - vSyncWidth

  const vFrontPorch = Math.ceil(vPorch * spec.V_PORCH_RATIO)
  const vBackPorch = vBlank - vFrontPorch - vSyncWidth

  return { hActive, hFrontPorch, hSyncWidth, hBackPorch, hTotal, vActive, vFrontPorch, vSyncWidth, vBackPorch, vTotal }
}
