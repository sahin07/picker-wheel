import {
  readPackedFromHash,
  slugifyName,
} from "@/lib/custom-wheel"
import type { RaffleDrawRecord } from "@/types/raffle-spin-wheel-types"

/** Compact payload for shareable raffle outcome URLs (no DB). */
export type RaffleSharePayload = {
  v: 1
  t: string
  c: string
  w: Array<{
    n: number
    name: string
    p?: string
    ts: string
  }>
}

export type RaffleSharedResult = {
  title: string
  createdAt: string
  draws: RaffleDrawRecord[]
  slug: string
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ""
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4))
  const binary = atob(padded + pad)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}

export function packRaffleResult(input: {
  title: string
  draws: RaffleDrawRecord[]
  createdAt?: string
}): string {
  const payload: RaffleSharePayload = {
    v: 1,
    t: input.title.trim() || "Raffle Results",
    c: input.createdAt || new Date().toISOString(),
    w: input.draws.map((draw) => ({
      n: draw.drawNumber,
      name: draw.name,
      ...(draw.prizeLabel ? { p: draw.prizeLabel } : {}),
      ts: draw.timestamp,
    })),
  }
  const json = JSON.stringify(payload)
  return toBase64Url(new TextEncoder().encode(json))
}

export function unpackRaffleResult(packed: string): RaffleSharedResult | null {
  try {
    const json = new TextDecoder().decode(fromBase64Url(packed))
    const data = JSON.parse(json) as RaffleSharePayload
    if (!data || data.v !== 1 || !data.t || !Array.isArray(data.w) || data.w.length === 0) {
      return null
    }
    return {
      title: data.t,
      createdAt: data.c || new Date().toISOString(),
      slug: slugifyName(data.t),
      draws: data.w.map((item) => ({
        drawNumber: item.n,
        name: item.name,
        prizeLabel: item.p,
        timestamp: item.ts,
        locked: true,
      })),
    }
  } catch {
    return null
  }
}

export function buildRaffleResultShareUrl(
  title: string,
  draws: RaffleDrawRecord[],
  origin?: string,
): string | null {
  if (!draws.length) return null
  const packed = packRaffleResult({ title, draws })
  const slug = slugifyName(title || "raffle-results")
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "")
  // Same packed-hash pattern as custom wheels, dedicated raffle result path
  return `${base}/r/${encodeURIComponent(slug)}#d=${packed}`
}

export { readPackedFromHash, slugifyName }
