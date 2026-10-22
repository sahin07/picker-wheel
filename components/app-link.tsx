"use client"

import { forwardRef, type ComponentProps } from "react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"

type AppLinkProps = ComponentProps<typeof NextLink>

/**
 * next/link without viewport prefetch. Pages carry 40+ links each, and prefetching
 * every visible one multiplies origin transfer on Vercel; prefetch on hover/touch instead.
 */
const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink(
  { prefetch, onMouseEnter, onTouchStart, href, ...props },
  ref,
) {
  const router = useRouter()

  if (prefetch !== undefined) {
    return <NextLink ref={ref} href={href} prefetch={prefetch} onMouseEnter={onMouseEnter} onTouchStart={onTouchStart} {...props} />
  }

  const prefetchOnIntent = () => {
    if (typeof href === "string" && href.startsWith("/")) router.prefetch(href)
  }

  return (
    <NextLink
      ref={ref}
      href={href}
      prefetch={false}
      onMouseEnter={(e) => {
        prefetchOnIntent()
        onMouseEnter?.(e)
      }}
      onTouchStart={(e) => {
        prefetchOnIntent()
        onTouchStart?.(e)
      }}
      {...props}
    />
  )
})

export default AppLink
