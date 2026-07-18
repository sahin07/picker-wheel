/** Shared HEX / RGB / RGBA helpers for the Color Picker Wheel. */

export type RgbChannels = { r: number; g: number; b: number }

export type ColorResultShowMode = {
  color: boolean
  text: boolean
  hex: boolean
  rgb: boolean
  rgba: boolean
}

export const DEFAULT_COLOR_RESULT_SHOW_MODE: ColorResultShowMode = {
  color: true,
  text: true,
  hex: true,
  rgb: true,
  rgba: true,
}

export function parseHexColor(hex: string): RgbChannels | null {
  const raw = hex.trim().replace(/^#/, "")
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return {
      r: parseInt(raw[0] + raw[0], 16),
      g: parseInt(raw[1] + raw[1], 16),
      b: parseInt(raw[2] + raw[2], 16),
    }
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw) || /^[0-9a-fA-F]{8}$/.test(raw)) {
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16),
    }
  }
  return null
}

export function hexToRgbChannels(hex: string): RgbChannels {
  return parseHexColor(hex) ?? { r: 0, g: 0, b: 0 }
}

/** Compact channel string used in stored results: `"255, 0, 128"` */
export function hexToRgbString(hex: string): string {
  const { r, g, b } = hexToRgbChannels(hex)
  return `${r}, ${g}, ${b}`
}

export function formatRgb(hexOrChannels: string | RgbChannels): string {
  const { r, g, b } =
    typeof hexOrChannels === "string"
      ? hexToRgbChannels(hexOrChannels)
      : hexOrChannels
  return `rgb(${r}, ${g}, ${b})`
}

export function clampAlpha(alpha: number): number {
  if (Number.isNaN(alpha)) return 1
  return Math.min(1, Math.max(0, alpha))
}

/** Formats alpha for CSS: integers stay whole, others keep up to 2 decimals. */
export function formatAlpha(alpha: number): string {
  const a = clampAlpha(alpha)
  if (a === 0 || a === 1) return String(a)
  return a.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
}

export function formatRgba(
  hexOrChannels: string | RgbChannels,
  alpha = 1,
): string {
  const { r, g, b } =
    typeof hexOrChannels === "string"
      ? hexToRgbChannels(hexOrChannels)
      : hexOrChannels
  return `rgba(${r}, ${g}, ${b}, ${formatAlpha(alpha)})`
}

/** Build rgba from a stored `"r, g, b"` string plus alpha. */
export function rgbStringToRgba(rgb: string, alpha = 1): string {
  const parts = rgb.split(",").map((p) => Number(p.trim()))
  if (parts.length >= 3 && parts.every((n) => Number.isFinite(n))) {
    return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${formatAlpha(alpha)})`
  }
  return formatRgba("#000000", alpha)
}
