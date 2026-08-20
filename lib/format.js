const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const date = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })

export function formatMetric(value) {
  return value === null || value === undefined ? '—' : compact.format(value)
}

export function formatDate(value) {
  return value ? date.format(new Date(value)) : '—'
}

export function formatDuration(value) {
  if (value === null || value === undefined) return '—'
  const minutes = Math.floor(value / 60)
  const seconds = Math.round(value % 60).toString().padStart(2, '0')
  return minutes ? `${minutes}:${seconds}` : `0:${seconds}`
}
