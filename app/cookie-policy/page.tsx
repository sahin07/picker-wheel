import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/footer"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const SITE_URL = HOME_SITE_URL
const PATH = "/cookie-policy"
const PAGE_URL = `${SITE_URL}${PATH}`
const PAGE_TITLE = "Cookie Policy | Picker Wheel"
const PAGE_DESCRIPTION =
  "Cookie Policy for Picker Wheel. How we and partners (including Google AdSense) use cookies and similar technologies, and how you can control them."

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Picker Wheel",
    type: "website",
    images: [
      { url: HOME_OG_IMAGE_URL, width: 1200, height: 630, alt: PAGE_TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [HOME_OG_IMAGE_URL],
  },
}

const LAST_UPDATED = "July 23, 2026"

export default function CookiePolicyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    dateModified: "2026-07-23",
    isPartOf: { "@type": "WebSite", name: "Picker Wheel", url: SITE_URL },
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500">
              <div className="h-4 w-4 rounded-full bg-green-600" />
            </div>
            <span className="font-spin-display text-xl font-bold text-gray-800">
              Picker Wheel
            </span>
          </Link>
          <nav className="flex items-center gap-4 font-spin-display text-sm font-semibold text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <Link href="/privacy-policy" className="hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/contact-us" className="hover:text-gray-900">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-16">
        <article className="container mx-auto max-w-3xl px-4">
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
              <li className="text-slate-800">Cookie Policy</li>
            </ol>
          </nav>

          <h1 className="font-spin-display text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm font-medium text-slate-500">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="mt-6 text-base leading-relaxed text-slate-600">
            This Cookie Policy explains how <strong>Picker Wheel</strong> uses
            cookies and similar technologies. It should be read together with our{" "}
            <Link href="/privacy-policy" className="font-semibold text-green-700 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="mt-10 space-y-8 text-slate-700">
            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                What are cookies?
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                Cookies are small text files stored on your device. Similar
                technologies include local storage, pixels, and tags used for
                preferences, analytics, and advertising.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                How we use them
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>
                  <strong>Essential / functional.</strong> Keep basic site
                  features working and store wheel preferences or saved lists in
                  your browser.
                </li>
                <li>
                  <strong>Analytics.</strong> Help us understand traffic and
                  improve tools (for example Google Analytics, if enabled).
                </li>
                <li>
                  <strong>Advertising.</strong> Partners such as Google AdSense
                  may set cookies to serve and measure ads, including based on
                  prior visits to this or other sites.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                Your choices
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>Block or delete cookies in your browser settings</li>
                <li>
                  Manage Google ad personalization at{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    className="font-semibold text-green-700 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Ads Settings
                  </a>
                </li>
                <li>
                  Visit{" "}
                  <a
                    href="https://www.aboutads.info/choices/"
                    className="font-semibold text-green-700 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    aboutads.info/choices
                  </a>{" "}
                  for industry opt-outs
                </li>
              </ul>
              <p className="mt-3 text-base leading-relaxed">
                Note: blocking cookies may affect site features such as saved
                wheels.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                Contact
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                Questions?{" "}
                <a
                  href="mailto:support@spinifywheel.com"
                  className="font-semibold text-green-700 hover:underline"
                >
                  support@spinifywheel.com
                </a>{" "}
                or{" "}
                <Link href="/contact-us" className="font-semibold text-green-700 hover:underline">
                  Contact Us
                </Link>
                .
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
