import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/footer"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const SITE_URL = HOME_SITE_URL
const PATH = "/privacy-policy"
const PAGE_URL = `${SITE_URL}${PATH}`
const PAGE_TITLE = "Privacy Policy | Picker Wheel"
const PAGE_DESCRIPTION =
  "Privacy Policy for Picker Wheel (spinifywheel.com). Learn what information we collect, how cookies and advertising work, and your choices—including Google AdSense."

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

export default function PrivacyPolicyPage() {
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
        { "@type": "ListItem", position: 2, name: "Privacy Policy", item: PAGE_URL },
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
              <li className="text-slate-800">Privacy Policy</li>
            </ol>
          </nav>

          <h1 className="font-spin-display text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm font-medium text-slate-500">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="mt-6 text-base leading-relaxed text-slate-600">
            This Privacy Policy explains how <strong>Picker Wheel</strong>{" "}
            (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), operated at{" "}
            <a href={SITE_URL} className="font-semibold text-green-700 hover:underline">
              {SITE_URL.replace(/^https?:\/\//, "")}
            </a>
            , collects, uses, and shares information when you use our free online
            spin wheel and random picker tools. By using the site, you agree to
            this policy.
          </p>

          <div className="prose-legal mt-10 space-y-8 text-slate-700">
            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                1. Information we collect
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>
                  <strong>Information you provide.</strong> Wheel names, options,
                  custom lists, images you upload for a wheel, and messages you
                  send through our{" "}
                  <Link href="/contact-us" className="font-semibold text-green-700 hover:underline">
                    Contact
                  </Link>{" "}
                  page or email.
                </li>
                <li>
                  <strong>Device / usage data.</strong> Browser type, device type,
                  approximate location (country/region), pages viewed, and
                  referring URLs, typically collected through cookies or similar
                  technologies.
                </li>
                <li>
                  <strong>Local storage.</strong> Many wheel settings and saved
                  wheels are stored in your browser (for example localStorage)
                  so your lists and preferences can persist on that device. This
                  data stays on your device unless you clear site data.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                2. How we use information
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>To operate and improve Picker Wheel tools and pages</li>
                <li>To remember your wheel preferences on your device</li>
                <li>To respond to support or contact requests</li>
                <li>To measure traffic and fix technical issues</li>
                <li>
                  To show advertising (including Google AdSense) and understand
                  ad performance
                </li>
                <li>To comply with law and protect the service</li>
              </ul>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                3. Cookies and similar technologies
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                We and our partners use cookies, pixels, and similar technologies
                to run the site, remember preferences, analyze traffic, and
                deliver ads. For more detail, see our{" "}
                <Link href="/cookie-policy" className="font-semibold text-green-700 hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                4. Advertising (Google AdSense)
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                We may use <strong>Google AdSense</strong> and other advertising
                partners to display ads on Picker Wheel. Third-party vendors,
                including Google, use cookies to serve ads based on your prior
                visits to this site or other sites on the Internet.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>
                  Google&apos;s use of advertising cookies enables it and its
                  partners to serve ads based on your visit to our site and/or
                  other sites.
                </li>
                <li>
                  You may opt out of personalized advertising by visiting{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    className="font-semibold text-green-700 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Ads Settings
                  </a>
                  .
                </li>
                <li>
                  You can also visit{" "}
                  <a
                    href="https://www.aboutads.info/choices/"
                    className="font-semibold text-green-700 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.aboutads.info
                  </a>{" "}
                  for more opt-out options from participating companies.
                </li>
              </ul>
              <p className="mt-3 text-base leading-relaxed">
                Learn more in{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  className="font-semibold text-green-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google&apos;s Advertising policies
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                5. Analytics
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                We may use analytics tools (such as Google Analytics) to
                understand how visitors use the site. These tools may set cookies
                and collect aggregated usage information. You can control cookies
                through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                6. How we share information
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                We do not sell your personal information. We may share limited
                data with:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>
                  Service providers who help us host, operate, or analyze the
                  site
                </li>
                <li>Advertising partners such as Google (AdSense)</li>
                <li>
                  Authorities when required by law or to protect rights and
                  safety
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                7. Children&apos;s privacy
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                Picker Wheel is a general-audience tool. We do not knowingly
                collect personal information from children under 13. If you
                believe a child has provided personal information, please{" "}
                <Link href="/contact-us" className="font-semibold text-green-700 hover:underline">
                  contact us
                </Link>{" "}
                and we will take appropriate steps to remove it.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                8. Data retention and your choices
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed">
                <li>
                  Clear site data / cookies in your browser to remove locally
                  stored wheels and preferences.
                </li>
                <li>
                  Use browser controls or Google Ads Settings to limit
                  personalized ads.
                </li>
                <li>
                  Contact us to ask questions about this policy or your
                  information.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                9. International visitors
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                Our servers and providers may process information in countries
                other than where you live. By using Picker Wheel, you understand
                that your information may be transferred to and processed in
                those locations.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                10. Changes to this policy
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                We may update this Privacy Policy from time to time. The
                &quot;Last updated&quot; date at the top will change when we do.
                Continued use of the site after changes means you accept the
                updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                11. Contact
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                Questions about privacy? Email us at{" "}
                <a
                  href="mailto:support@spinifywheel.com"
                  className="font-semibold text-green-700 hover:underline"
                >
                  support@spinifywheel.com
                </a>{" "}
                or use our{" "}
                <Link href="/contact-us" className="font-semibold text-green-700 hover:underline">
                  Contact Us
                </Link>{" "}
                page.
              </p>
            </section>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-slate-200 pt-8 text-sm font-semibold text-green-800">
            <Link href="/terms-of-service" className="hover:underline">
              Terms of Service
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
