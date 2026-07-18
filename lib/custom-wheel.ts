import { LETTER_WHEEL_COLORS } from "@/lib/letter-picker-constants"
import type { LetterSlice } from "@/types/letter-picker"

export type CustomWheelOption = {
  id: string
  name: string
  color: string
  weight?: number
  enabled?: boolean
}

export type CustomWheel = {
  id: string
  slug: string
  name: string
  description: string
  options: CustomWheelOption[]
  createdAt: string
  updatedAt: string
}

export const CUSTOM_WHEEL_PENDING_KEY = "custom-wheel-pending"

export function stashPendingCustomWheel(wheel: CustomWheel) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(CUSTOM_WHEEL_PENDING_KEY, JSON.stringify(wheel))
  } catch {
    // ignore quota / private mode
  }
}

export function takePendingCustomWheel(slug?: string): CustomWheel | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(CUSTOM_WHEEL_PENDING_KEY)
    if (!raw) return null
    const wheel = JSON.parse(raw) as CustomWheel
    if (slug && wheel.slug.toLowerCase() !== slug.toLowerCase()) return null
    sessionStorage.removeItem(CUSTOM_WHEEL_PENDING_KEY)
    return wheel
  } catch {
    return null
  }
}

/** Compact payload for share URLs (no DB on Vercel) */
export type CustomWheelSharePayload = {
  v: 1
  n: string
  d: string
  o: Array<{ t: string; c: string }>
}

export function createOptionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createDefaultOptions(count = 4): CustomWheelOption[] {
  const labels = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6"]
  return Array.from({ length: count }, (_, i) => ({
    id: createOptionId(),
    name: labels[i] || `Option ${i + 1}`,
    color: LETTER_WHEEL_COLORS[i % LETTER_WHEEL_COLORS.length],
    weight: 1,
    enabled: true,
  }))
}

export function slugifyName(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
  return base || "custom-wheel"
}

export function randomSlugSuffix(length = 4): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let out = ""
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return out
}

/** Prefer clean slug; on collision append -3JRd style suffix */
export function uniqueSlug(name: string, existingSlugs: string[]): string {
  const base = slugifyName(name)
  const taken = new Set(existingSlugs.map((s) => s.toLowerCase()))
  if (!taken.has(base.toLowerCase())) return base

  for (let attempt = 0; attempt < 40; attempt++) {
    const candidate = `${base}-${randomSlugSuffix(4)}`
    if (!taken.has(candidate.toLowerCase())) return candidate
  }
  return `${base}-${Date.now().toString(36)}`
}

export function optionsToSlices(options: CustomWheelOption[]): LetterSlice[] {
  return options
    .filter((o) => o.enabled !== false && o.name.trim().length > 0)
    .map((o, i) => ({
      id: o.id,
      text: o.name.trim(),
      weight: Math.max(1, o.weight || 1),
      enabled: true,
      color: o.color || LETTER_WHEEL_COLORS[i % LETTER_WHEEL_COLORS.length],
    }))
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

export function packCustomWheel(wheel: Pick<CustomWheel, "name" | "description" | "options">): string {
  const payload: CustomWheelSharePayload = {
    v: 1,
    n: wheel.name,
    d: wheel.description || "",
    o: wheel.options
      .filter((o) => o.name.trim())
      .map((o) => ({
        t: o.name.trim(),
        c: o.color,
      })),
  }
  const json = JSON.stringify(payload)
  const bytes = new TextEncoder().encode(json)
  return toBase64Url(bytes)
}

export function unpackCustomWheel(packed: string): CustomWheel | null {
  try {
    const json = new TextDecoder().decode(fromBase64Url(packed))
    const data = JSON.parse(json) as CustomWheelSharePayload
    if (!data || data.v !== 1 || !data.n || !Array.isArray(data.o) || data.o.length === 0) {
      return null
    }
    const now = new Date().toISOString()
    const slug = slugifyName(data.n)
    return {
      id: `shared-${slug}-${Date.now()}`,
      slug,
      name: data.n,
      description: data.d || "",
      options: data.o.map((item, i) => ({
        id: createOptionId(),
        name: item.t,
        color: item.c || LETTER_WHEEL_COLORS[i % LETTER_WHEEL_COLORS.length],
        weight: 1,
        enabled: true,
      })),
      createdAt: now,
      updatedAt: now,
    }
  } catch {
    return null
  }
}

export function buildShareUrl(slug: string, packed: string, origin?: string): string {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "")
  return `${base}/w/${encodeURIComponent(slug)}#d=${packed}`
}

export function readPackedFromHash(hash: string): string | null {
  if (!hash) return null
  const raw = hash.startsWith("#") ? hash.slice(1) : hash
  const params = new URLSearchParams(raw.includes("=") ? raw : `d=${raw}`)
  return params.get("d")
}
