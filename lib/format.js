const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const dates = new Map()

export function formatMetric(value) {
  return value === null || value === undefined ? '—' : compact.format(value)
}

export function formatDate(value, locale = 'ru') {
  if (!value) return '—'
  if (!dates.has(locale)) dates.set(locale, new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }))
  return dates.get(locale).format(new Date(value))
}

export function formatDuration(value) {
  if (value === null || value === undefined) return '—'
  const minutes = Math.floor(value / 60)
  const seconds = Math.round(value % 60).toString().padStart(2, '0')
  return minutes ? `${minutes}:${seconds}` : `0:${seconds}`
}
