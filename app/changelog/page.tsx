import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/footer"
import { BrandLogo } from "@/components/brand-logo"
import { buildPageMetadata, SITE_NAME, SITE_URL } from "@/lib/site-metadata"
import { CHANGELOG_ENTRIES, type ChangelogGroup } from "@/lib/changelog"

const CHANGELOG_PATH = "/changelog"
const CHANGELOG_URL = `${SITE_URL}${CHANGELOG_PATH}`

const PAGE_TITLE = `Changelog | ${SITE_NAME}`
const PAGE_DESCRIPTION =
  "Follow what shipped on Spinifywheel, including new wheels, product improvements, performance work, and bug fixes."

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: CHANGELOG_PATH,
  keywords: [
    "Spinifywheel changelog",
    "spin wheel product updates",
    "wheel picker release notes",
    "new features",
  ],
})

const GROUP_STYLES: Record<
  ChangelogGroup["type"],
  { label: string; badge: string; dot: string }
> = {
  Added: {
    label: "Added",
    badge: "border-green-200 bg-green-50 text-green-800",
    dot: "bg-green-500",
  },
  Improved: {
    label: "Improved",
    badge: "border-blue-200 bg-blue-50 text-blue-800",
    dot: "bg-blue-500",
  },
  Fixed: {
    label: "Fixed",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
  },
}

function buildChangelogJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${CHANGELOG_URL}#webpage`,
        url: CHANGELOG_URL,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CHANGELOG_URL}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Changelog",
            item: CHANGELOG_URL,
          },
        ],
      },
    ],
  }
}

export default function ChangelogPage() {
  const jsonLd = buildChangelogJsonLd()
  const latest = CHANGELOG_ENTRIES[0]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo />
          <nav className="flex items-center gap-4 font-spin-display text-sm font-semibold text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <Link href="/spin-wheels" className="hover:text-gray-900">
              Wheels
            </Link>
            <Link href="/articles" className="hover:text-gray-900">
              Blogs
            </Link>
            <Link href="/help" className="hover:text-gray-900">
              Help
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 font-spin-display text-sm font-semibold text-slate-500"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-green-700">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-800">Changelog</li>
            </ol>
          </nav>

          <div className="mb-12 text-center md:mb-14">
            <p className="font-spin-display text-sm font-semibold uppercase tracking-wide text-green-700">
              Product updates
            </p>
            <h1 className="mt-2 font-spin-display text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
              Changelog
            </h1>
            <div
              className="mx-auto mt-4 flex justify-center gap-1.5"
              aria-hidden="true"
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-green-500"
                />
              ))}
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-500 md:text-lg">
              Follow what shipped on {SITE_NAME}, including new wheels, product
              improvements, performance work, and bug fixes.
            </p>
            {latest && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 font-spin-display text-sm font-semibold text-green-800">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Latest release {latest.version} · {latest.date}
              </p>
            )}
          </div>

          <ol className="relative space-y-10 border-l border-slate-200 pl-6 md:pl-8">
            {CHANGELOG_ENTRIES.map((entry) => (
              <li key={entry.version} className="relative">
                <span
                  className="absolute -left-[calc(1.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-white md:-left-[calc(2rem+5px)]"
                  aria-hidden="true"
                />
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-slate-900 px-3 py-1 font-spin-display text-sm font-bold text-white">
                      {entry.version}
                    </span>
                    <time
                      dateTime={entry.isoDate}
                      className="font-spin-display text-sm font-semibold text-slate-500"
                    >
                      {entry.date}
                    </time>
                  </div>

                  <h2 className="mt-4 font-spin-display text-xl font-bold text-slate-800 md:text-2xl">
                    {entry.title}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-slate-500 md:text-base">
                    {entry.summary}
                  </p>

                  <div className="mt-5 space-y-5">
                    {entry.groups.map((group) => {
                      const style = GROUP_STYLES[group.type]
                      return (
                        <div key={group.type}>
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 font-spin-display text-xs font-bold uppercase tracking-wide ${style.badge}`}
                          >
                            {style.label}
                          </span>
                          <ul className="mt-3 space-y-2">
                            {group.items.map((item) => (
                              <li
                                key={item}
                                className="flex gap-3 text-sm font-medium text-slate-600 md:text-base"
                              >
                                <span
                                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
                                  aria-hidden="true"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h2 className="font-spin-display text-2xl font-bold text-slate-800">
              Have a feature request?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-slate-500 md:text-base">
              We ship improvements regularly. Tell us what would make your spin
              wheels better, or jump back in and start spinning.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="rounded-full bg-green-600 px-5 py-2.5 font-spin-display text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Open {SITE_NAME}
              </Link>
              <Link
                href="/contact-us"
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-spin-display text-sm font-semibold text-slate-700 transition-colors hover:border-green-400 hover:text-green-700"
              >
                Contact Us
              </Link>
              <Link
                href="/help"
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-spin-display text-sm font-semibold text-slate-700 transition-colors hover:border-green-400 hover:text-green-700"
              >
                Help & FAQ
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
