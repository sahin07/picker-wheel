import type { RaffleDrawRecord, RaffleParticipant } from "@/types/raffle-spin-wheel-types"

export const RAFFLE_TICKET_COLORS = [
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#ec4899",
  "#a855f7",
  "#14b8a6",
] as const

export const RAFFLE_TICKET_COUNT_MIN = 1
export const RAFFLE_TICKET_COUNT_MAX = 1000

export function clampRaffleTicketCount(value: number): number {
  if (!Number.isFinite(value)) return 8
  return Math.max(RAFFLE_TICKET_COUNT_MIN, Math.min(RAFFLE_TICKET_COUNT_MAX, Math.floor(value)))
}

export function buildTicketNames(count: number, prefix = "Ticket"): string[] {
  const n = clampRaffleTicketCount(count)
  const label = prefix.trim() || "Ticket"
  const pad = Math.max(2, String(n).length)
  return Array.from({ length: n }, (_, index) => {
    const num = String(index + 1).padStart(pad, "0")
    return `${label} ${num}`
  })
}

export function buildTicketOptions(
  count: number,
  prefix = "Ticket",
  colors: readonly string[] = RAFFLE_TICKET_COLORS,
): RaffleParticipant[] {
  const timestamp = Date.now()
  return buildTicketNames(count, prefix).map((name, index) => ({
    id: `raffle-ticket-${timestamp}-${index}`,
    name,
    weight: 1,
    enabled: true,
    color: colors[index % colors.length],
  }))
}

/** Expand weight N into N equal-weight slices (visible duplicate tickets). */
export function expandWeightsAsTicketOptions(
  options: RaffleParticipant[],
  colors: readonly string[] = RAFFLE_TICKET_COLORS,
): RaffleParticipant[] {
  const timestamp = Date.now()
  const next: RaffleParticipant[] = []
  let index = 0

  for (const option of options) {
    if (option.enabled === false) continue
    const name = String(option.name || "").trim()
    if (!name) continue
    const copies = Math.max(1, Math.min(100, Math.floor(option.weight ?? 1)))
    for (let copy = 0; copy < copies; copy++) {
      next.push({
        id: `raffle-expand-${timestamp}-${index}`,
        name,
        weight: 1,
        enabled: true,
        color: colors[index % colors.length],
      })
      index += 1
    }
  }

  return next
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function raffleDrawsToCsv(draws: RaffleDrawRecord[]): string {
  const header = "Draw #,Winner,Prize,Locked,Timestamp"
  const rows = draws.map((draw) =>
    [
      draw.drawNumber,
      csvEscape(draw.name),
      csvEscape(draw.prizeLabel || ""),
      draw.locked ? "yes" : "no",
      draw.timestamp,
    ].join(","),
  )
  return [header, ...rows].join("\n")
}

export function downloadRaffleTextFile(
  filename: string,
  content: string,
  mime = "text/csv;charset=utf-8",
) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function raffleShareQrUrl(shareUrl: string, size = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(shareUrl)}`
}
