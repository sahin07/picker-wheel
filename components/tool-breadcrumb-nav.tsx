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
}: {
  crumbs: ToolBreadcrumbCrumb[]
  pathname: string
  withSchema?: boolean
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

  return (
    <div className="w-full border-b border-gray-100 bg-slate-50/80">
      {withSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <nav aria-label="Breadcrumb" className="w-full px-3 py-2 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 font-spin-display text-xs font-semibold text-slate-500 sm:text-sm">
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
