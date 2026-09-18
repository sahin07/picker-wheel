import { WORD_PICKER_WHEEL_PATH } from "@/lib/word-picker-wheel-seo"

export function isWordPickerEmbedParam(value: string | null | undefined): boolean {
  if (!value) return false
  return value === "1" || value === "true" || value === "embed"
}

export function buildWordPickerEmbedUrl(input?: {
  origin?: string
  path?: string
  template?: string | null
  mode?: string | null
}): string {
  const origin =
    input?.origin || (typeof window !== "undefined" ? window.location.origin : "")
  const path = input?.path || WORD_PICKER_WHEEL_PATH
  const params = new URLSearchParams()
  params.set("embed", "1")
  if (input?.template) params.set("template", input.template)
  if (input?.mode && input.mode !== "one") params.set("mode", input.mode)
  return `${origin}${path}?${params.toString()}`
}

export function buildWordPickerEmbedCode(url: string): string {
  return `<iframe src="${url}" title="Word Picker Wheel" width="560" height="640" style="border:0;max-width:100%;border-radius:12px;" allowfullscreen loading="lazy"></iframe>`
}
