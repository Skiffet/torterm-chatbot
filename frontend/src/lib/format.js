/** Thai baht, grouped, no decimals — prices in the catalogue are whole units. */
export function formatBaht(value) {
  if (value == null) return null
  return `฿${Math.round(value).toLocaleString('th-TH')}`
}

export function formatCount(value) {
  return value.toLocaleString('th-TH')
}
