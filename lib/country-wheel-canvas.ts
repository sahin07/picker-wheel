import type { Country } from "@/data/countries"

export type CountryCanvasDisplayMode = "flag" | "name" | "both"

const flagImageCache = new Map<string, HTMLImageElement | "loading" | "error">()

export function countryFlagCode(country: Pick<Country, "code" | "id">): string {
  return String(country.code || country.id || "")
    .trim()
    .toLowerCase()
    .slice(0, 2)
}

/** CDN URL for a country flag PNG (works where flag emoji do not). */
export function countryFlagImageUrl(
  country: Pick<Country, "code" | "id">,
  width: 20 | 40 | 80 | 160 | 320 = 80,
): string | null {
  const code = countryFlagCode(country)
  if (!code || code.length !== 2) return null
  return `https://flagcdn.com/w${width}/${code}.png`
}

/** Load flag PNG (Windows canvas often cannot paint flag emoji). */
export function getCountryFlagImage(
  country: Pick<Country, "code" | "id">,
  onReady?: () => void,
): HTMLImageElement | null {
  const code = countryFlagCode(country)
  if (!code || code.length !== 2) return null

  const cached = flagImageCache.get(code)
  if (cached instanceof HTMLImageElement) return cached
  if (cached === "loading" || cached === "error") return null

  flagImageCache.set(code, "loading")
  const img = new Image()
  img.crossOrigin = "anonymous"
  img.onload = () => {
    flagImageCache.set(code, img)
    onReady?.()
  }
  img.onerror = () => {
    flagImageCache.set(code, "error")
    onReady?.()
  }
  img.src = `https://flagcdn.com/w40/${code}.png`
  return null
}

export function drawCountryWheelLabel(
  ctx: CanvasRenderingContext2D,
  country: Country,
  displayMode: CountryCanvasDisplayMode,
  textRadius: number,
  opts: {
    textColor: string
    strokeColor: string
    mysteryNames: boolean
    onFlagReady?: () => void
  },
) {
  const showFlag = displayMode === "flag" || displayMode === "both"
  const showName = displayMode === "name" || displayMode === "both"
  const labelName = opts.mysteryNames ? "?" : country.name
  const maxLen = displayMode === "both" ? 12 : 14
  const displayName =
    labelName.length > maxLen ? `${labelName.slice(0, maxLen)}...` : labelName

  // Keep flag + name on the radial axis (same Y) so thin wedges don't clip the name away
  const flagX = showName ? textRadius + 6 : textRadius
  const nameX = showFlag ? textRadius - 22 : textRadius

  if (showFlag) {
    const img = getCountryFlagImage(country, opts.onFlagReady)
    if (img) {
      const w = displayMode === "flag" ? 28 : 20
      const h = displayMode === "flag" ? 18 : 13
      ctx.drawImage(img, flagX - w / 2, -h / 2, w, h)
    } else {
      // Fallback while loading / if CDN fails — emoji or code
      ctx.font = displayMode === "flag" ? "22px Segoe UI Emoji, Arial" : "16px Segoe UI Emoji, Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = opts.textColor
      const flagToShow =
        typeof country.flag === "string" && country.flag.trim().length > 0
          ? country.flag
          : countryFlagCode(country).toUpperCase() || "🌎"
      ctx.fillText(flagToShow, flagX, 0)
    }
  }

  if (showName) {
    ctx.font = displayMode === "both" ? "11px Arial" : "15px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.lineWidth = 3
    ctx.strokeStyle = opts.strokeColor
    ctx.fillStyle = opts.textColor
    ctx.strokeText(displayName, nameX, 0)
    ctx.fillText(displayName, nameX, 0)
  }
}
