import { permanentRedirect } from "next/navigation"

type SearchParams = Record<string, string | string[] | undefined>

function toQueryString(searchParams: SearchParams): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, item)
    } else {
      params.set(key, value)
    }
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export function FingerPickerAliasPage(target: string) {
  return async function AliasPage({
    searchParams,
  }: {
    searchParams: Promise<SearchParams> | SearchParams
  }) {
    const resolved = await Promise.resolve(searchParams)
    permanentRedirect(target + toQueryString(resolved || {}))
  }
}
