export function alignDown (x, y) {
  return x - (x % y)
}

export function alignUp (x, y) {
  const ym = y - 1
  return (x + ym) & ~ym
}
