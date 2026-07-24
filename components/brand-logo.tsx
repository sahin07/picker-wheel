import Link from "next/link"
import { SITE_NAME } from "@/lib/site-metadata"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  href?: string
  className?: string
  /** Show brand text next to the mark (default true) */
  showWordmark?: boolean
  /** Wordmark color treatment for light/dark surfaces */
  variant?: "light" | "dark"
  size?: "sm" | "md"
}

/**
 * Site logo mark + wordmark used in header and footer.
 */
export function BrandLogo({
  href = "/",
  className,
  showWordmark = true,
  variant = "light",
  size = "md",
}: BrandLogoProps) {
  const markSize = size === "sm" ? "h-7 w-7" : "h-8 w-8"
  const innerSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
  const textSize = size === "sm" ? "text-lg" : "text-xl"
  const wordmarkClass =
    variant === "dark"
      ? "text-white"
      : "text-gray-800"

  const content = (
    <>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-yellow-500",
          markSize,
        )}
        aria-hidden
      >
        <div className={cn("rounded-full bg-green-600", innerSize)} />
      </div>
      {showWordmark && (
        <span
          className={cn(
            "font-spin-display font-bold tracking-tight",
            textSize,
            wordmarkClass,
            // Header (light): hide wordmark on very small screens; footer always shows it
            variant === "light" && size === "md" && "hidden sm:inline",
          )}
        >
          {SITE_NAME}
        </span>
      )}
    </>
  )

  if (!href) {
    return (
      <div className={cn("flex min-w-0 items-center gap-2", className)}>
        {content}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={cn("flex min-w-0 items-center gap-2", className)}
      aria-label={`${SITE_NAME} home`}
    >
      {content}
    </Link>
  )
}
