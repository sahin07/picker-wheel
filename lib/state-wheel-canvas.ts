import type { State } from "@/data/states"

export type StateCanvasDisplayMode = "flag" | "name" | "both"

/**
 * Draw state/province labels like country-wheel:
 * flag (or abbr badge) + name on the same radial axis so thin wedges don't clip the name.
 */
export function drawStateWheelLabel(
  ctx: CanvasRenderingContext2D,
  state: State,
  displayMode: StateCanvasDisplayMode,
  textRadius: number,
  opts: {
    textColor: string
    strokeColor: string
    mysteryNames: boolean
  },
) {
  const showFlag = displayMode === "flag" || displayMode === "both"
  const showName = displayMode === "name" || displayMode === "both"
  const labelName = opts.mysteryNames ? "?" : state.name
  const maxLen = displayMode === "both" ? 10 : 14
  const displayName =
    labelName.length > maxLen ? `${labelName.slice(0, maxLen)}...` : labelName

  // Same Y (radial centerline); offset X so both fit in narrow slices
  const flagX = showName ? textRadius + 8 : textRadius
  const nameX = showFlag ? textRadius - 20 : textRadius

  if (showFlag) {
    const abbr =
      (state.abbreviation && state.abbreviation.trim()) ||
      state.name.slice(0, 2).toUpperCase()

    if (displayMode === "flag") {
      // Larger abbr badge when flag-only
      const w = 30
      const h = 18
      ctx.fillStyle = "rgba(255,255,255,0.92)"
      ctx.strokeStyle = opts.strokeColor === "#ffffff" ? "#111827" : opts.strokeColor
      ctx.lineWidth = 1.5
      roundRect(ctx, flagX - w / 2, -h / 2, w, h, 3)
      ctx.fill()
      ctx.stroke()
      ctx.font = "bold 11px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#111827"
      ctx.fillText(abbr, flagX, 0)
    } else {
      // Compact badge beside name
      const w = 22
      const h = 13
      ctx.fillStyle = "rgba(255,255,255,0.9)"
      ctx.strokeStyle = "#111827"
      ctx.lineWidth = 1
      roundRect(ctx, flagX - w / 2, -h / 2, w, h, 2)
      ctx.fill()
      ctx.stroke()
      ctx.font = "bold 8px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#111827"
      ctx.fillText(abbr.slice(0, 3), flagX, 0.5)
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

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}
