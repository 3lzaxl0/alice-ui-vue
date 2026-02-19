/**
 * Helper to parse a date string or object into a Date object.
 * Handles YYYY-MM-DD strings as local components to avoid UTC offset issues.
 */
function parseLocalDate(val: unknown): Date | null {
  if (!val) return null
  if (val instanceof Date) return val
  const dateStr = String(val)

  // Match YYYY-MM-DD (optionally followed by time/timezone)
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch && isoMatch[1] && isoMatch[2] && isoMatch[3]) {
    const year = parseInt(isoMatch[1], 10)
    const month = parseInt(isoMatch[2], 10) - 1 // 0-indexed
    const day = parseInt(isoMatch[3], 10)
    return new Date(year, month, day, 0, 0, 0) // Midnight local
  }

  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Helper to get local date string (YYYY-MM-DD)
 */
export const getLocalDateString = (val: unknown): string => {
  const date = parseLocalDate(val)
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Converts a date value (YYYY-MM-DD string, ISO string, or Date object) to
 * a full RFC3339 string with the local timezone offset, as expected by the
 * backend's OffsetDateTime scalar.
 *
 * Example output: "2027-02-19T00:00:00.000-05:00"
 *
 * @param val    - A date string (YYYY-MM-DD) or Date object.
 * @param time   - Optional HH:MM:SS to use as the time part (defaults to 00:00:00).
 * @returns      A full RFC3339-compliant ISO string with local offset, or `null`
 *               if the value can't be parsed.
 */
export function toGraphQLDateTime(val: unknown, time = '00:00:00'): string | null {
  if (!val) return null

  // Parse YYYY-MM-DD as LOCAL date at the requested time to avoid UTC-shift
  const dateStr = String(val)
  const dateOnly = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  let date: Date

  if (dateOnly && dateOnly[1] && dateOnly[2] && dateOnly[3]) {
    const [h = '00', m = '00', s = '00'] = time.split(':')
    date = new Date(
      parseInt(dateOnly[1], 10),
      parseInt(dateOnly[2], 10) - 1,
      parseInt(dateOnly[3], 10),
      parseInt(h, 10),
      parseInt(m, 10),
      parseInt(s, 10),
      0,
    )
  } else {
    date = new Date(dateStr)
  }

  if (isNaN(date.getTime())) return null

  // Build local timezone offset string (e.g. "-05:00")
  const offsetMin = date.getTimezoneOffset() // positive = behind UTC
  const sign = offsetMin <= 0 ? '+' : '-'
  const absMin = Math.abs(offsetMin)
  const offH = String(Math.floor(absMin / 60)).padStart(2, '0')
  const offM = String(absMin % 60).padStart(2, '0')
  const offset = `${sign}${offH}:${offM}`

  // Build the ISO-like string with milliseconds and local offset
  const y = date.getFullYear()
  const mo = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')

  return `${y}-${mo}-${d}T${hh}:${mm}:${ss}.000${offset}`
}

/**
 * Format a date string or object into various formats
 */
export function formatDate(
  value: unknown,
  format: 'iso' | 'full' | 'short' | 'raw' | 'datetime' | 'timestamp' | string = 'iso',
): string {
  if (!value) return ''
  const dateStr = String(value)
  const date = parseLocalDate(value)
  if (!date) return dateStr

  if (format === 'raw') return dateStr
  if (format === 'iso') return date.toISOString().split('T')[0] || dateStr

  const hasOffset = typeof value === 'string' && /[+-]\d{2}:?\d{2}$/.test(value)
  const day = hasOffset ? date.getUTCDate() : date.getDate()
  const month = hasOffset ? date.getUTCMonth() : date.getMonth()
  const year = hasOffset ? date.getUTCFullYear() : date.getFullYear()

  const months = [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE',
  ]
  const shortMonths = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DIC',
  ]

  if (format === 'full') {
    return `${day} ${months[month]} ${year}`
  }
  if (format === 'short') {
    return `${day} ${shortMonths[month]} ${year}`
  }

  if (format === 'datetime' || format === 'timestamp') {
    const d = String(day).padStart(2, '0')
    const m = String(month + 1).padStart(2, '0')
    const y = String(year)

    const hours = hasOffset ? date.getUTCHours() : date.getHours()
    const minutes = hasOffset ? date.getUTCMinutes() : date.getMinutes()
    const seconds = hasOffset ? date.getUTCSeconds() : date.getSeconds()
    const minStr = String(minutes).padStart(2, '0')

    // If it's exactly midnight (00:00:00), only return the date
    if (hours === 0 && minutes === 0 && seconds === 0) {
      return `${d}/${m}/${y}`
    }

    if (format === 'timestamp') {
      const hStr = String(hours).padStart(2, '0')
      return `${d}/${m}/${y} ${hStr}:${minStr}`
    }

    // datetime (12h with AM/PM)
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.'
    const h12 = hours % 12 || 12
    const hStr = String(h12).padStart(2, '0')
    return `${d}/${m}/${y} ${hStr}:${minStr} ${ampm}`
  }

  // Handle DD/MM/YYYY or other simple templates if needed
  if (format.includes('DD') || format.includes('MM') || format.includes('YYYY')) {
    const d = String(day).padStart(2, '0')
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const y = String(year)
    const h = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return format
      .replace('DD', d)
      .replace('MM', m)
      .replace('YYYY', y)
      .replace('HH', h)
      .replace('mm', min)
  }

  return date.toLocaleDateString()
}
