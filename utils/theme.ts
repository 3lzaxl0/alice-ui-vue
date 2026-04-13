/**
 * Alice UI Theme Utilities
 * Handles runtime generation and injection of semantic color scales.
 */

interface HSL {
  h: number
  s: number
  l: number
}

/**
 * Converts a HEX color string to HSL.
 */
export function hexToHsl(hex: string): HSL {
  // Remove hash if present
  hex = hex.replace(/^#/, '')

  // Parse r, g, b
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Generates an 11-level HSL scale (50-950) from a base HSL color.
 * Anchors the 500 weight to the base color's lightness to preserve pastels.
 */
export function generateScale(baseHsl: HSL) {
  const { h, s, l: baseL } = baseHsl
  const scale: Record<string, string> = {}

  // Weights and their relative positions (0 to 1)
  // 50 is near 1.0 (white), 500 is the anchor, 950 is near 0.0 (black)
  const weightMap: Record<number, number> = {
    50: 0.96,
    100: 0.9,
    200: 0.8,
    300: 0.7,
    400: 0.6,
    500: 0.5, // Anchor
    600: 0.4,
    700: 0.3,
    800: 0.2,
    900: 0.1,
    950: 0.05,
  }

  Object.entries(weightMap).forEach(([weightStr, position]) => {
    const weight = parseInt(weightStr)
    let l: number

    if (weight === 500) {
      l = baseL
    } else if (weight < 500) {
      // Interpolate between Light (98) and BaseL
      // position is 0.5 to 0.96
      const t = (position - 0.5) / (0.96 - 0.5) // map 0.5..0.96 to 0..1
      l = baseL + (98 - baseL) * t
    } else {
      // Interpolate between BaseL and Dark (7)
      // position is 0.5 to 0.05
      const t = (0.5 - position) / (0.5 - 0.05) // map 0.5..0.05 to 0..1
      l = baseL - (baseL - 7) * t
    }

    // Dynamic saturation: lighter shades are often less saturated, darker ones a bit more
    let adjustedS = s
    if (weight < 500) {
      adjustedS = Math.max(s - (500 - weight) / 20, 10)
    } else if (weight > 500) {
      adjustedS = Math.min(s + (weight - 500) / 40, 100)
    }

    scale[weight] = `hsl(${h} ${Math.round(adjustedS)}% ${Math.round(l)}%)`
  })

  return scale
}

/**
 * Injects a semantic color scale into the document root.
 */
export function injectThemeScale(type: 'primary' | 'info' | 'success' | 'warning' | 'error', hex: string) {
  const hsl = hexToHsl(hex)
  const scale = generateScale(hsl)
  const root = document.documentElement

  Object.entries(scale).forEach(([weight, value]) => {
    root.style.setProperty(`--alice-${type}-${weight}`, value)
  })

  // Also inject RGB variables for opacity support in utility classes
  // e.g. for shadow-[0_0_15px_rgba(var(--color-primary-500-rgb),0.5)]
  const baseRgb = hslToRgb(hsl.h, hsl.s, hsl.l) // Use actual base lightness for main RGB
  root.style.setProperty(`--color-${type}-500-rgb`, `${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}`)
}

/**
 * Helper to convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number) {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}
