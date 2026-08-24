import { permanentRedirect } from "next/navigation"
import { NARUTO_WHEEL_PATH } from "@/lib/naruto-wheel-seo"

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

/** Legacy hub alias — 308 to /naruto-spin-wheel-picker (keeps ?template= / ?mode=). */
export default async function NarutoWheelAliasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams> | SearchParams
}) {
  const resolved = await Promise.resolve(searchParams)
  permanentRedirect(NARUTO_WHEEL_PATH + toQueryString(resolved || {}))
}
