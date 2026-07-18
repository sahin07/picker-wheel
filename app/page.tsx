import type { Metadata } from "next"
import HomeWheelApp from "@/components/home/home-wheel-app"
import HomeSeoSections, { HomeSeoIntro } from "@/components/home/home-seo-sections"
import {
  HOME_ARTICLE_TITLE,
  HOME_FAQ_ITEMS,
  HOME_H1,
  HOME_HERO_INTRO,
  HOME_ON_THIS_PAGE,
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_TITLE,
  HOME_SITE_URL,
} from "@/lib/home-seo"

const HOME_URL = `${HOME_SITE_URL}/`

export const metadata: Metadata = {
  title: {
    absolute: HOME_PAGE_TITLE,
  },
  description: HOME_PAGE_DESCRIPTION,
  keywords: [
    "random name wheel picker",
    "random name picker",
    "random wheel picker",
    "wheel picker",
    "picker wheel",
    "spin wheel",
    "spin the wheel",
    "custom spin wheel",
    "decision wheel",
    "spin the wheel online",
    "lucky wheel",
    "wheel spinner",
    "name picker wheel",
  ],
  alternates: {
    canonical: HOME_URL,
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
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    url: HOME_URL,
    siteName: "Picker Wheel",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
  },
}

/** Re-export for legacy imports from `@/app/page` */
export type { WheelOption } from "@/components/home/home-wheel-app"

function HomeJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${HOME_URL}#home-faq`,
    mainEntity: HOME_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${HOME_URL}#app`,
    name: "Random Name Wheel Picker",
    alternateName: [
      "Random Wheel Picker",
      "Random Name Picker",
      "Picker Wheel",
      "Spin the Wheel Online",
      "Custom Spin Wheel",
    ],
    url: HOME_URL,
    description: HOME_PAGE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin the wheel online",
      "Create a custom spin wheel",
      "Weighted random picks",
      "Remove winner after spin",
      "CSV import and export",
      "Fullscreen wheel mode",
      "Save wheels on device",
      "Mobile-friendly wheel spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${HOME_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: HOME_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Random Name Wheel Picker",
        item: HOME_URL,
      },
    ],
  }

  /** Visible “On this page” TOC — ItemList mirrors section structure for crawlers */
  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${HOME_URL}#home-toc`,
    name: "On this page — Random Name Wheel Picker",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: HOME_ON_THIS_PAGE.length,
    itemListElement: HOME_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${HOME_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${HOME_URL}#webpage`,
    url: HOME_URL,
    name: HOME_H1,
    headline: HOME_H1,
    description: HOME_HERO_INTRO,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${HOME_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: HOME_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Random Name Wheel Picker",
    },
    mainEntity: {
      "@id": `${HOME_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${HOME_URL}#article`,
        headline: HOME_ARTICLE_TITLE,
        description: HOME_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: HOME_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: HOME_SITE_URL,
        },
      },
      { "@id": `${HOME_URL}#home-faq` },
      { "@id": `${HOME_URL}#home-toc` },
    ],
    breadcrumb: {
      "@id": `${HOME_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: HOME_URL,
      name: "Spin the Random Name Wheel Picker",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tocSchema) }}
      />
    </>
  )
}

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <HomeWheelApp seoIntro={<HomeSeoIntro />} seoSections={<HomeSeoSections />} />
    </>
  )
}
