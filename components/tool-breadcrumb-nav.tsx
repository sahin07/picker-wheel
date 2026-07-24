import Link from "next/link"
import type { ToolBreadcrumbCrumb } from "@/lib/wheel-categories"
import { HOME_SITE_URL } from "@/lib/home-seo"

function absoluteUrl(pathname: string, href?: string) {
  const target = href ?? pathname
  if (target === "/") return `${HOME_SITE_URL}/`
  return `${HOME_SITE_URL}${target}`
}

export function ToolBreadcrumbNav({
  crumbs,
  pathname,
  withSchema = true,
  placement = "content",
}: {
  crumbs: ToolBreadcrumbCrumb[]
  pathname: string
  withSchema?: boolean
  /** `content` sits below the tool UI; `header` is the old top chrome style */
  placement?: "content" | "header"
}) {
  if (crumbs.length < 2) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => {
      const isLast = index === crumbs.length - 1
      return {
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: absoluteUrl(pathname, isLast || !crumb.href ? undefined : crumb.href),
      }
    }),
  }

  const shellClass =
    placement === "header"
      ? "w-full border-b border-gray-100 bg-slate-50/80"
      : "mb-6 mt-2 w-full border-t border-slate-200 pt-4"
  const navClass =
    placement === "header"
      ? "w-full px-3 py-2 sm:px-6 lg:px-8"
      : "flex w-full justify-center py-1"
  const listClass =
    placement === "header"
      ? "flex flex-wrap items-center gap-1.5 font-spin-display text-xs font-semibold text-slate-500 sm:text-sm"
      : "flex flex-wrap items-center justify-center gap-1.5 text-center font-spin-display text-xs font-semibold text-slate-500 sm:text-sm"

  return (
    <div className={shellClass}>
      {withSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <nav aria-label="Breadcrumb" className={navClass}>
        <ol className={listClass}>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1
            return (
              <li
                key={`${crumb.label}-${index}`}
                className="flex items-center gap-1.5"
              >
                {index > 0 && (
                  <span aria-hidden="true" className="text-slate-300">
                    /
                  </span>
                )}
                {isLast || !crumb.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={isLast ? "text-slate-800" : undefined}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-green-700"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
