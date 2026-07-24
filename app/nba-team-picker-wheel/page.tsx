import type { Metadata } from "next"
import NbaWheelApp from "@/components/nba-wheel/nba-wheel-app"
import NbaWheelSeoSections, {
  NbaWheelSeoIntro,
} from "@/components/nba-wheel/nba-wheel-seo-sections"
import {
  NBA_WHEEL_ARTICLE_TITLE,
  NBA_WHEEL_FAQ_ITEMS,
  NBA_WHEEL_H1,
  NBA_WHEEL_HERO_INTRO,
  NBA_WHEEL_KEYWORDS,
  NBA_WHEEL_OG_IMAGE_URL,
  NBA_WHEEL_ON_THIS_PAGE,
  NBA_WHEEL_PAGE_DESCRIPTION,
  NBA_WHEEL_PAGE_TITLE,
  NBA_WHEEL_SHORT_TITLE,
  NBA_WHEEL_SITE_URL,
  NBA_WHEEL_URL,
} from "@/lib/nba-wheel-seo"

export const metadata: Metadata = {
  title: {
    absolute: NBA_WHEEL_PAGE_TITLE,
  },
  description: NBA_WHEEL_PAGE_DESCRIPTION,
  keywords: [...NBA_WHEEL_KEYWORDS],
  alternates: {
    canonical: NBA_WHEEL_URL,
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
    title: NBA_WHEEL_PAGE_TITLE,
    description: NBA_WHEEL_PAGE_DESCRIPTION,
    url: NBA_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: NBA_WHEEL_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: NBA_WHEEL_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: NBA_WHEEL_PAGE_TITLE,
    description: NBA_WHEEL_PAGE_DESCRIPTION,
    images: [NBA_WHEEL_OG_IMAGE_URL],
  },
}

function NbaWheelJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${NBA_WHEEL_URL}#nba-faq`,
    mainEntity: NBA_WHEEL_FAQ_ITEMS.map((item) => ({
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
    "@id": `${NBA_WHEEL_URL}#app`,
    name: "NBA Picker Wheel",
    alternateName: [
      "NBA Team Wheel",
      "Random NBA Team Generator",
      "NBA Team Spinner",
      "Basketball Team Picker",
      "NBA Randomizer",
    ],
    url: NBA_WHEEL_URL,
    description: NBA_WHEEL_PAGE_DESCRIPTION,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin all 30 NBA teams",
      "Eastern and Western Conference filters",
      "Division templates",
      "Elimination mode",
      "Favorites and comparison",
      "Fantasy draft icebreakers",
      "Mobile-friendly NBA spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${NBA_WHEEL_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${NBA_WHEEL_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "NBA Picker Wheel",
        item: NBA_WHEEL_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${NBA_WHEEL_URL}#nba-toc`,
    name: "On this page — NBA Picker Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: NBA_WHEEL_ON_THIS_PAGE.length,
    itemListElement: NBA_WHEEL_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${NBA_WHEEL_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${NBA_WHEEL_URL}#webpage`,
    url: NBA_WHEEL_URL,
    name: NBA_WHEEL_H1,
    headline: NBA_WHEEL_H1,
    description: NBA_WHEEL_HERO_INTRO,
    inLanguage: "en-US",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: NBA_WHEEL_OG_IMAGE_URL,
      width: 1200,
      height: 630,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${NBA_WHEEL_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: NBA_WHEEL_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "NBA Picker Wheel",
    },
    mainEntity: {
      "@id": `${NBA_WHEEL_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${NBA_WHEEL_URL}#article`,
        headline: NBA_WHEEL_ARTICLE_TITLE,
        description: NBA_WHEEL_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: NBA_WHEEL_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: NBA_WHEEL_SITE_URL,
        },
      },
      { "@id": `${NBA_WHEEL_URL}#nba-faq` },
      { "@id": `${NBA_WHEEL_URL}#nba-toc` },
    ],
    breadcrumb: {
      "@id": `${NBA_WHEEL_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: NBA_WHEEL_URL,
      name: "Spin the NBA Picker Wheel",
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

export default function NbaWheelPage() {
  return (
    <>
      <NbaWheelJsonLd />
      <NbaWheelApp
        shortTitle={NBA_WHEEL_SHORT_TITLE}
        toolSubtitle="Pick a random NBA team by wheel"
        seoIntro={<NbaWheelSeoIntro />}
        seoSections={<NbaWheelSeoSections />}
      />
    </>
  )
}
