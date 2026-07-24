import type { Metadata } from "next"
import LolWheelApp from "@/components/lol-wheel/lol-wheel-app"
import LolWheelSeoSections, {
  LolWheelSeoIntro,
} from "@/components/lol-wheel/lol-wheel-seo-sections"
import {
  LOL_WHEEL_ARTICLE_TITLE,
  LOL_WHEEL_FAQ_ITEMS,
  LOL_WHEEL_H1,
  LOL_WHEEL_HERO_INTRO,
  LOL_WHEEL_KEYWORDS,
  LOL_WHEEL_OG_IMAGE_URL,
  LOL_WHEEL_ON_THIS_PAGE,
  LOL_WHEEL_PAGE_DESCRIPTION,
  LOL_WHEEL_PAGE_TITLE,
  LOL_WHEEL_SHORT_TITLE,
  LOL_WHEEL_SITE_URL,
  LOL_WHEEL_URL,
} from "@/lib/lol-wheel-seo"
import { getLolWheelSpoke } from "@/lib/lol-wheel-spokes"

export const metadata: Metadata = {
  title: {
    absolute: LOL_WHEEL_PAGE_TITLE,
  },
  description: LOL_WHEEL_PAGE_DESCRIPTION,
  keywords: [...LOL_WHEEL_KEYWORDS],
  alternates: {
    canonical: LOL_WHEEL_URL,
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
    title: LOL_WHEEL_PAGE_TITLE,
    description: LOL_WHEEL_PAGE_DESCRIPTION,
    url: LOL_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: LOL_WHEEL_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: LOL_WHEEL_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: LOL_WHEEL_PAGE_TITLE,
    description: LOL_WHEEL_PAGE_DESCRIPTION,
    images: [LOL_WHEEL_OG_IMAGE_URL],
  },
}

function LolWheelJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${LOL_WHEEL_URL}#lol-faq`,
    mainEntity: LOL_WHEEL_FAQ_ITEMS.map((item) => ({
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
    "@id": `${LOL_WHEEL_URL}#app`,
    name: "LoL Wheel",
    alternateName: [
      "LoL Champion Wheel",
      "League of Legends Wheel",
      "Random LoL Champion",
      "LoL Champion Picker",
    ],
    url: LOL_WHEEL_URL,
    description: LOL_WHEEL_PAGE_DESCRIPTION,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin a curated League of Legends champion catalog",
      "Role and playstyle templates",
      "Beginner and S-tier wheels",
      "Elimination mode",
      "Mobile-friendly LoL spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${LOL_WHEEL_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${LOL_WHEEL_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "LoL Wheel",
        item: LOL_WHEEL_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${LOL_WHEEL_URL}#lol-toc`,
    name: "On this page — LoL Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: LOL_WHEEL_ON_THIS_PAGE.length,
    itemListElement: LOL_WHEEL_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${LOL_WHEEL_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${LOL_WHEEL_URL}#webpage`,
    url: LOL_WHEEL_URL,
    name: LOL_WHEEL_H1,
    headline: LOL_WHEEL_H1,
    description: LOL_WHEEL_HERO_INTRO,
    inLanguage: "en-US",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: LOL_WHEEL_OG_IMAGE_URL,
      width: 1200,
      height: 630,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${LOL_WHEEL_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: LOL_WHEEL_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "LoL Wheel",
    },
    mainEntity: {
      "@id": `${LOL_WHEEL_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${LOL_WHEEL_URL}#article`,
        headline: LOL_WHEEL_ARTICLE_TITLE,
        description: LOL_WHEEL_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: LOL_WHEEL_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: LOL_WHEEL_SITE_URL,
        },
      },
      { "@id": `${LOL_WHEEL_URL}#lol-faq` },
      { "@id": `${LOL_WHEEL_URL}#lol-toc` },
    ],
    breadcrumb: {
      "@id": `${LOL_WHEEL_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: LOL_WHEEL_URL,
      name: "Spin the LoL Wheel",
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

export default function LolWheelPage() {
  const hubDeepLink = getLolWheelSpoke("all").deepLink
  return (
    <>
      <LolWheelJsonLd />
      <LolWheelApp
        shortTitle={LOL_WHEEL_SHORT_TITLE}
        toolSubtitle="Pick a random League of Legends champion by wheel"
        deepLink={hubDeepLink}
        seoIntro={<LolWheelSeoIntro />}
        seoSections={<LolWheelSeoSections />}
      />
    </>
  )
}
