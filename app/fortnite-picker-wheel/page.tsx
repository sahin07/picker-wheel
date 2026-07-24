import type { Metadata } from "next"
import FortniteWheelApp from "@/components/fortnite-wheel/fortnite-wheel-app"
import FortniteWheelSeoSections, {
  FortniteWheelSeoIntro,
} from "@/components/fortnite-wheel/fortnite-wheel-seo-sections"
import {
  FORTNITE_WHEEL_ARTICLE_TITLE,
  FORTNITE_WHEEL_FAQ_ITEMS,
  FORTNITE_WHEEL_H1,
  FORTNITE_WHEEL_HERO_INTRO,
  FORTNITE_WHEEL_KEYWORDS,
  FORTNITE_WHEEL_OG_IMAGE_URL,
  FORTNITE_WHEEL_ON_THIS_PAGE,
  FORTNITE_WHEEL_PAGE_DESCRIPTION,
  FORTNITE_WHEEL_PAGE_TITLE,
  FORTNITE_WHEEL_SHORT_TITLE,
  FORTNITE_WHEEL_SITE_URL,
  FORTNITE_WHEEL_URL,
} from "@/lib/fortnite-wheel-seo"

export const metadata: Metadata = {
  title: {
    absolute: FORTNITE_WHEEL_PAGE_TITLE,
  },
  description: FORTNITE_WHEEL_PAGE_DESCRIPTION,
  keywords: [...FORTNITE_WHEEL_KEYWORDS],
  alternates: {
    canonical: FORTNITE_WHEEL_URL,
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
    title: FORTNITE_WHEEL_PAGE_TITLE,
    description: FORTNITE_WHEEL_PAGE_DESCRIPTION,
    url: FORTNITE_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: FORTNITE_WHEEL_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: FORTNITE_WHEEL_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: FORTNITE_WHEEL_PAGE_TITLE,
    description: FORTNITE_WHEEL_PAGE_DESCRIPTION,
    images: [FORTNITE_WHEEL_OG_IMAGE_URL],
  },
}

function FortniteWheelJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${FORTNITE_WHEEL_URL}#fortnite-faq`,
    mainEntity: FORTNITE_WHEEL_FAQ_ITEMS.map((item) => ({
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
    "@id": `${FORTNITE_WHEEL_URL}#app`,
    name: "Fortnite Picker Wheel",
    alternateName: [
      "Fortnite Picker Wheel",
      "Fortnite Wheel",
      "Fortnite Skin Wheel",
      "Fortnite Weapon Wheel",
      "Fortnite Challenge Wheel",
      "Fortnite Randomizer",
    ],
    url: FORTNITE_WHEEL_URL,
    description: FORTNITE_WHEEL_PAGE_DESCRIPTION,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin Fortnite skins, weapons, and challenges",
      "Landing spot and loadout wheels",
      "Common through Mythic skin filters",
      "Elimination mode",
      "Favorites and comparison",
      "Stream and party challenges",
      "Mobile-friendly Fortnite spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${FORTNITE_WHEEL_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${FORTNITE_WHEEL_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Fortnite Picker Wheel",
        item: FORTNITE_WHEEL_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${FORTNITE_WHEEL_URL}#fortnite-toc`,
    name: "On this page — Fortnite Picker Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: FORTNITE_WHEEL_ON_THIS_PAGE.length,
    itemListElement: FORTNITE_WHEEL_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${FORTNITE_WHEEL_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${FORTNITE_WHEEL_URL}#webpage`,
    url: FORTNITE_WHEEL_URL,
    name: FORTNITE_WHEEL_H1,
    headline: FORTNITE_WHEEL_H1,
    description: FORTNITE_WHEEL_HERO_INTRO,
    inLanguage: "en-US",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: FORTNITE_WHEEL_OG_IMAGE_URL,
      width: 1200,
      height: 630,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${FORTNITE_WHEEL_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: FORTNITE_WHEEL_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Fortnite Picker Wheel",
    },
    mainEntity: {
      "@id": `${FORTNITE_WHEEL_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${FORTNITE_WHEEL_URL}#article`,
        headline: FORTNITE_WHEEL_ARTICLE_TITLE,
        description: FORTNITE_WHEEL_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: FORTNITE_WHEEL_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: FORTNITE_WHEEL_SITE_URL,
        },
      },
      { "@id": `${FORTNITE_WHEEL_URL}#fortnite-faq` },
      { "@id": `${FORTNITE_WHEEL_URL}#fortnite-toc` },
    ],
    breadcrumb: {
      "@id": `${FORTNITE_WHEEL_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: FORTNITE_WHEEL_URL,
      name: "Spin the Fortnite Picker Wheel",
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

export default function FortnitePickerWheelPage() {
  return (
    <>
      <FortniteWheelJsonLd />
      <FortniteWheelApp
        shortTitle={FORTNITE_WHEEL_SHORT_TITLE}
        toolSubtitle="Spin skins, weapons, landing spots, and challenges"
        seoIntro={<FortniteWheelSeoIntro />}
        seoSections={<FortniteWheelSeoSections />}
      />
    </>
  )
}
