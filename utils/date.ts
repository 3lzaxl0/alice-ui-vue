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
    return new Date(year, month, day, 12, 0, 0) // Noon to avoid small shifts
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
 * Format a date string or object into various formats
 */
export function formatDate(
  value: unknown,
  format: 'iso' | 'full' | 'short' | 'raw' | 'datetime' | string = 'iso',
): string {
  if (!value) return ''
  const dateStr = String(value)
  const date = parseLocalDate(value)
  if (!date) return dateStr

  if (format === 'raw') return dateStr
  if (format === 'iso') return date.toISOString().split('T')[0] || dateStr

  const day = date.getDate()
  const year = date.getFullYear()
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
    return `${day} ${months[date.getMonth()]} ${year}`
  }
  if (format === 'short') {
    return `${day} ${shortMonths[date.getMonth()]} ${year}`
  }

  if (format === 'datetime') {
    // Check if original string has explicit timezone offset (e.g. -05:00 or +02:00)
    // If yes, user likely wants to see the absolute time represented by that string (UTC components)
    // If no, we assume local time.
    const hasOffset = typeof value === 'string' && /[+-]\d{2}:?\d{2}$/.test(value)

    const d = String(hasOffset ? date.getUTCDate() : date.getDate()).padStart(2, '0')
    const m = String((hasOffset ? date.getUTCMonth() : date.getMonth()) + 1).padStart(2, '0')
    const y = String(hasOffset ? date.getUTCFullYear() : date.getFullYear())

    // 12-hour format
    const hours = hasOffset ? date.getUTCHours() : date.getHours()
    const minutes = hasOffset ? date.getUTCMinutes() : date.getMinutes()
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.'
    const h12 = hours % 12 || 12
    const hStr = String(h12).padStart(2, '0')
    const minStr = String(minutes).padStart(2, '0')

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
