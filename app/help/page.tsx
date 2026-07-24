import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/footer"
import HelpFaqContent from "@/components/help-faq-content"
import { HELP_FAQ_SECTIONS } from "@/lib/help-faq"

import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const SITE_URL = HOME_SITE_URL
const HELP_PATH = "/help"
const HELP_URL = `${SITE_URL}${HELP_PATH}`

const PAGE_TITLE =
  "Spin Wheel Picker FAQ – Is It Random? How to Use | Picker Wheel Help"
const PAGE_DESCRIPTION =
  "Spin wheel picker FAQ with clear answers: is it really random, how to add names, customize colors, save and reuse wheels, use on mobile, run giveaways, and more."

export const metadata: Metadata = {
  title: {
    absolute: PAGE_TITLE,
  },
  description: PAGE_DESCRIPTION,
  keywords: [
    "spin wheel picker FAQ",
    "what is a spin wheel picker",
    "is the spin wheel really random",
    "random name picker help",
    "custom spin wheel questions",
    "giveaway spin wheel FAQ",
    "wheel of names help center",
  ],
  alternates: {
    canonical: HELP_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: HELP_URL,
    siteName: "Picker Wheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: HOME_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: PAGE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [HOME_OG_IMAGE_URL],
  },
  category: "Help Center",
}

function getAnswerText(item: (typeof HELP_FAQ_SECTIONS)[number]["items"][number]) {
  const stepText =
    item.steps?.map((step) =>
      step.parts
        .map((part) => (part.type === "text" ? part.value : part.label))
        .join("")
    ) ?? []

  return [...item.answer, ...stepText].join(" ").replace(/\s+/g, " ").trim()
}

function buildHelpPageJsonLd() {
  const faqEntities = HELP_FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question" as const,
      "@id": `${HELP_URL}#${item.id}`,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: getAnswerText(item),
      },
    }))
  )

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Picker Wheel",
        url: SITE_URL,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Picker Wheel",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": `${HELP_URL}#webpage`,
        url: HELP_URL,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: {
          "@type": "Thing",
          name: "Spin wheel picker",
        },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "ReadAction",
          target: [HELP_URL],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${HELP_URL}#faq`,
        url: HELP_URL,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": `${HELP_URL}#webpage` },
        inLanguage: "en-US",
        mainEntity: faqEntities,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${HELP_URL}#breadcrumb`,
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
            name: "Help & FAQ",
            item: HELP_URL,
          },
        ],
      },
    ],
  }
}

export default function HelpPage() {
  const jsonLd = buildHelpPageJsonLd()

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
            <Link href="/spin-wheels" className="hover:text-gray-900">
              Wheels
            </Link>
            <Link href="/articles" className="hover:text-gray-900">
              Blogs
            </Link>
            <Link href="/help" className="text-green-700">
              Help
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
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
              <li className="text-slate-800">Help & FAQ</li>
            </ol>
          </nav>

          <div className="mb-12 text-center md:mb-14">
            <p className="font-spin-display text-sm font-semibold uppercase tracking-wide text-green-700">
              Help Center
            </p>
            <h1 className="mt-2 font-spin-display text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
              Frequently Asked Questions
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
              Straight answers for teachers, event hosts, families, and anyone
              searching how a spin wheel picker works—randomness, custom lists,
              saving, mobile use, giveaways, and more.
            </p>
          </div>

          <div className="mb-10 rounded-2xl border border-green-100 bg-green-50/70 p-5 md:p-6">
            <h2 className="font-spin-display text-lg font-bold text-slate-800">
              Jump to a topic
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {HELP_FAQ_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex rounded-full border border-green-200 bg-white px-3 py-1.5 font-spin-display text-sm font-semibold text-green-800 transition-colors hover:border-green-400"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <HelpFaqContent />

          <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h2 className="font-spin-display text-2xl font-bold text-slate-800">
              Still stuck?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-slate-500 md:text-base">
              If your question is about a specific tool, open that wheel and
              check Settings first—many spin, sound, and color controls live
              there. You can also browse the full category list for ready-made
              pickers, or read our how-to articles for classroom, giveaway, and
              game-night tips.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="rounded-full bg-green-600 px-5 py-2.5 font-spin-display text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Open Picker Wheel
              </Link>
              <Link
                href="/articles"
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-spin-display text-sm font-semibold text-slate-700 transition-colors hover:border-green-400 hover:text-green-700"
              >
                Read articles
              </Link>
              <Link
                href="/spin-wheels"
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-spin-display text-sm font-semibold text-slate-700 transition-colors hover:border-green-400 hover:text-green-700"
              >
                Browse wheels
              </Link>
              <Link
                href="/contact-us"
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-spin-display text-sm font-semibold text-slate-700 transition-colors hover:border-green-400 hover:text-green-700"
              >
                Contact Us
              </Link>
              <Link
                href="/help#people-also-ask"
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-spin-display text-sm font-semibold text-slate-700 transition-colors hover:border-green-400 hover:text-green-700"
              >
                People also ask
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
