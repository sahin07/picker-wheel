"use client"

import { Suspense, useEffect, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"

type SearchParamsSyncProps = {
  onChange: (params: URLSearchParams) => void
}

/**
 * Isolates `useSearchParams` so parent trees can still SSR.
 * Without this, Next.js bails the whole Suspense boundary out to
 * client-only HTML (empty pulse shell) — bad for indexing.
 */
function SearchParamsListener({ onChange }: SearchParamsSyncProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    onChange(searchParams)
  }, [searchParams, onChange])

  return null
}

export function SearchParamsSync({ onChange }: SearchParamsSyncProps) {
  return (
    <Suspense fallback={null}>
      <SearchParamsListener onChange={onChange} />
    </Suspense>
  )
}

/** Optional wrapper when a subtree must wait on search params. Prefer SearchParamsSync. */
export function SearchParamsBoundary({
  children,
  fallback = null,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}
