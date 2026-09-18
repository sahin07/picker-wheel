import type { WordPickerChallengeMode } from "@/lib/word-picker-modes"
import type { WordPickerUseCaseId } from "@/lib/word-picker-wheel-use-cases"

export type WordPickerDeepLink = {
  template?: WordPickerUseCaseId | null
  mode?: WordPickerChallengeMode | null
  words?: string[]
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ""
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(value: string): string | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/")
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4))
    const binary = atob(padded + pad)
    const out = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
    return new TextDecoder().decode(out)
  } catch {
    return null
  }
}

/** Encode a word list for URL (keeps links short for small lists). */
export function encodeWordList(words: string[]): string {
  const cleaned = words.map((w) => w.trim()).filter(Boolean).slice(0, 80)
  return toBase64Url(cleaned.join("\n"))
}

export function decodeWordList(packed: string | null | undefined): string[] {
  if (!packed) return []
  const text = fromBase64Url(packed)
  if (!text) return []
  return text
    .split(/\r?\n|,/)
    .map((w) => w.trim())
    .filter(Boolean)
}

export function buildWordPickerShareUrl(input: {
  basePath?: string
  origin?: string
  template?: string | null
  mode?: string | null
  words?: string[]
}): string {
  const origin =
    input.origin || (typeof window !== "undefined" ? window.location.origin : "")
  const path = input.basePath || "/spin-word-picker-wheel"
  const params = new URLSearchParams()
  if (input.template) params.set("template", input.template)
  if (input.mode && input.mode !== "one") params.set("mode", input.mode)
  if (input.words && input.words.length > 0) {
    params.set("words", encodeWordList(input.words))
  }
  const qs = params.toString()
  return `${origin}${path}${qs ? `?${qs}` : ""}`
}

export function parseWordPickerSearchParams(params: URLSearchParams): WordPickerDeepLink {
  const template = params.get("template") as WordPickerUseCaseId | null
  const mode = params.get("mode") as WordPickerChallengeMode | null
  const words = decodeWordList(params.get("words"))
  return {
    template,
    mode,
    words: words.length > 0 ? words : undefined,
  }
}
