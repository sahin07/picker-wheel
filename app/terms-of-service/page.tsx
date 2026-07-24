import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/footer"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const SITE_URL = HOME_SITE_URL
const PATH = "/terms-of-service"
const PAGE_URL = `${SITE_URL}${PATH}`
const PAGE_TITLE = "Terms of Service | Picker Wheel"
const PAGE_DESCRIPTION =
  "Terms of Service for Picker Wheel. Rules for using our free spin wheel and random picker tools, acceptable use, disclaimers, and liability limits."

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Spinifywheel",
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

export default function TermsOfServicePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    dateModified: "2026-07-23",
    isPartOf: { "@type": "WebSite", name: "Picker Wheel", url: SITE_URL },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Terms of Service", item: PAGE_URL },
      ],
    },
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
              <li className="text-slate-800">Terms of Service</li>
            </ol>
          </nav>

          <h1 className="font-spin-display text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm font-medium text-slate-500">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="mt-6 text-base leading-relaxed text-slate-600">
            These Terms of Service (&quot;Terms&quot;) govern your use of{" "}
            <strong>Picker Wheel</strong> at{" "}
            <a href={SITE_URL} className="font-semibold text-green-700 hover:underline">
              {SITE_URL.replace(/^https?:\/\//, "")}
            </a>
            . By accessing or using the site, you agree to these Terms. If you do
            not agree, please do not use the site.
          </p>

          <div className="mt-10 space-y-8 text-slate-700">
            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                1. The service
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                Picker Wheel provides free online spin wheels and random picker
                tools for entertainment, education, giveaways, games, and
                everyday decisions. Features may change, and we may add or remove
                tools without notice.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                2. Eligibility and accounts
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                You may use most tools without creating an account. If optional
                sign-in or saved-cloud features are offered later, you are
                responsible for keeping your credentials secure and for activity
                under your account.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                3. Acceptable use
              </h2>
              <p className="mt-3 text-base leading-relaxed">You agree not to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>Use the site for unlawful, harmful, or fraudulent activity</li>
                <li>
                  Upload illegal, abusive, hateful, or infringing content
                  (including images or wheel labels)
                </li>
                <li>
                  Attempt to disrupt, scrape excessively, reverse engineer, or
                  overload the service
                </li>
                <li>
                  Misrepresent spin results as official, certified, or legally
                  binding lottery outcomes where that would violate law
                </li>
                <li>
                  Use the site in a way that violates Google AdSense or other
                  advertising partner policies if you embed or redistribute our
                  content
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                4. User content
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                You retain rights to content you enter (names, lists, images). By
                using the tools, you grant us a limited license to process that
                content solely to provide the service on your device or account.
                You are responsible for having rights to any material you upload.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                5. Intellectual property
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                The Picker Wheel name, site design, code, and original content are
                owned by us or our licensors. Fan-themed tools (for example game
                or anime character wheels) are unofficial entertainment tools and
                are not affiliated with or endorsed by the rights holders of those
                franchises.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                6. Advertising
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                The site may display third-party advertisements, including Google
                AdSense. Ad content is provided by third parties; we are not
                responsible for advertisers&apos; products or claims. See our{" "}
                <Link href="/privacy-policy" className="font-semibold text-green-700 hover:underline">
                  Privacy Policy
                </Link>{" "}
                for how ads and cookies work.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                7. Disclaimers
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
                IMPLIED. We do not warrant that spins are suitable for regulated
                gambling, legal disputes, medical decisions, or any high-stakes
                purpose. Random results are for entertainment and convenience.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                8. Limitation of liability
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                OR ANY LOSS OF DATA, PROFITS, OR GOODWILL ARISING FROM YOUR USE OF
                THE SITE. OUR TOTAL LIABILITY FOR ANY CLAIM RELATED TO THE SERVICE
                WILL NOT EXCEED USD $50.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                9. Indemnity
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                You agree to indemnify and hold us harmless from claims arising
                out of your misuse of the site, your content, or your violation of
                these Terms.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                10. Changes and termination
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                We may update these Terms or suspend access to the service at any
                time. Continued use after changes means you accept the new Terms.
                The &quot;Last updated&quot; date will reflect revisions.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                11. Governing law
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                These Terms are governed by the laws applicable in the
                jurisdiction where the site operator is established, without regard
                to conflict-of-law rules. Courts in that jurisdiction will have
                exclusive venue for disputes, except where prohibited by consumer
                law.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                12. Contact
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                Questions about these Terms? Email{" "}
                <a
                  href="mailto:support@spinifywheel.com"
                  className="font-semibold text-green-700 hover:underline"
                >
                  support@spinifywheel.com
                </a>{" "}
                or visit{" "}
                <Link href="/contact-us" className="font-semibold text-green-700 hover:underline">
                  Contact Us
                </Link>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-slate-200 pt-8 text-sm font-semibold text-green-800">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="hover:underline">
              Cookie Policy
            </Link>
            <Link href="/contact-us" className="hover:underline">
              Contact Us
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
