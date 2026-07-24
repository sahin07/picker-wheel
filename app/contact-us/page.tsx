import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/footer"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const SITE_URL = HOME_SITE_URL
const PATH = "/contact-us"
const PAGE_URL = `${SITE_URL}${PATH}`
const PAGE_TITLE = "Contact Us | Picker Wheel"
const PAGE_DESCRIPTION =
  "Contact Picker Wheel for support, privacy questions, AdSense or partnership inquiries, and feedback about our free spin wheel tools."
const SUPPORT_EMAIL = "support@spinifywheel.com"

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

export default function ContactUsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        url: PAGE_URL,
        isPartOf: { "@type": "WebSite", name: "Picker Wheel", url: SITE_URL },
      },
      {
        "@type": "Organization",
        name: "Picker Wheel",
        url: SITE_URL,
        email: SUPPORT_EMAIL,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: SUPPORT_EMAIL,
          availableLanguage: "English",
        },
      },
    ],
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
            <Link href="/help" className="hover:text-gray-900">
              Help
            </Link>
            <Link href="/contact-us" className="text-green-700">
              Contact
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
              <li className="text-slate-800">Contact Us</li>
            </ol>
          </nav>

          <div className="mb-10 text-center">
            <p className="font-spin-display text-sm font-semibold uppercase tracking-wide text-green-700">
              Support
            </p>
            <h1 className="mt-2 font-spin-display text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
              Contact Us
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-slate-500 md:text-lg">
              Need help with a wheel, have a privacy question, or want to reach
              us about the site? We read every message.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-spin-display text-xl font-bold text-slate-800">
                Email support
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Best for privacy requests, AdSense/site ownership questions,
                bug reports, and general feedback.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Picker%20Wheel%20support`}
                className="mt-4 inline-flex font-spin-display text-lg font-semibold text-green-700 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              <p className="mt-3 text-xs text-slate-500">
                Typical reply time: within a few business days.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-spin-display text-xl font-bold text-slate-800">
                Self-serve help
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Many how-to and randomness questions are answered in our FAQ.
              </p>
              <Link
                href="/help"
                className="mt-4 inline-flex font-spin-display text-lg font-semibold text-green-700 hover:underline"
              >
                Visit Help Center →
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-green-100 bg-green-50/70 p-6">
            <h2 className="font-spin-display text-lg font-bold text-slate-800">
              What to include in your email
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              <li>The page URL you were using</li>
              <li>Device / browser (e.g. Chrome on Android)</li>
              <li>A short description of the issue or request</li>
              <li>
                For privacy requests: the type of request (access, deletion,
                question)
              </li>
            </ul>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-spin-display text-lg font-bold text-slate-800">
              Site &amp; legal
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Website:{" "}
              <a href={SITE_URL} className="font-semibold text-green-700 hover:underline">
                {SITE_URL.replace(/^https?:\/\//, "")}
              </a>
            </p>
            <ul className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-green-800">
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:underline">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
