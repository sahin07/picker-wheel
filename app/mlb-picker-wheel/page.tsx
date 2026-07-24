import type { Metadata } from "next"
import MlbWheelApp from "@/components/mlb-wheel/mlb-wheel-app"
import MlbWheelSeoSections, {
  MlbWheelSeoIntro,
} from "@/components/mlb-wheel/mlb-wheel-seo-sections"
import {
  MLB_WHEEL_ARTICLE_TITLE,
  MLB_WHEEL_FAQ_ITEMS,
  MLB_WHEEL_H1,
  MLB_WHEEL_HERO_INTRO,
  MLB_WHEEL_KEYWORDS,
  MLB_WHEEL_OG_IMAGE_URL,
  MLB_WHEEL_ON_THIS_PAGE,
  MLB_WHEEL_PAGE_DESCRIPTION,
  MLB_WHEEL_PAGE_TITLE,
  MLB_WHEEL_SHORT_TITLE,
  MLB_WHEEL_SITE_URL,
  MLB_WHEEL_URL,
} from "@/lib/mlb-wheel-seo"

export const metadata: Metadata = {
  title: {
    absolute: MLB_WHEEL_PAGE_TITLE,
  },
  description: MLB_WHEEL_PAGE_DESCRIPTION,
  keywords: [...MLB_WHEEL_KEYWORDS],
  alternates: {
    canonical: MLB_WHEEL_URL,
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
    title: MLB_WHEEL_PAGE_TITLE,
    description: MLB_WHEEL_PAGE_DESCRIPTION,
    url: MLB_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: MLB_WHEEL_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: MLB_WHEEL_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: MLB_WHEEL_PAGE_TITLE,
    description: MLB_WHEEL_PAGE_DESCRIPTION,
    images: [MLB_WHEEL_OG_IMAGE_URL],
  },
}

function MlbWheelJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${MLB_WHEEL_URL}#mlb-faq`,
    mainEntity: MLB_WHEEL_FAQ_ITEMS.map((item) => ({
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
    "@id": `${MLB_WHEEL_URL}#app`,
    name: "MLB Picker Wheel",
    alternateName: [
      "MLB Team Wheel",
      "Random MLB Team Generator",
      "MLB Team Spinner",
      "Baseball Team Picker",
      "MLB Randomizer",
    ],
    url: MLB_WHEEL_URL,
    description: MLB_WHEEL_PAGE_DESCRIPTION,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin all 30 MLB teams",
      "American and National League filters",
      "Division templates",
      "Elimination mode",
      "Favorites and comparison",
      "Fantasy draft icebreakers",
      "Mobile-friendly MLB spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${MLB_WHEEL_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${MLB_WHEEL_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "MLB Picker Wheel",
        item: MLB_WHEEL_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${MLB_WHEEL_URL}#mlb-toc`,
    name: "On this page — MLB Picker Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: MLB_WHEEL_ON_THIS_PAGE.length,
    itemListElement: MLB_WHEEL_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${MLB_WHEEL_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${MLB_WHEEL_URL}#webpage`,
    url: MLB_WHEEL_URL,
    name: MLB_WHEEL_H1,
    headline: MLB_WHEEL_H1,
    description: MLB_WHEEL_HERO_INTRO,
    inLanguage: "en-US",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: MLB_WHEEL_OG_IMAGE_URL,
      width: 1200,
      height: 630,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${MLB_WHEEL_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: MLB_WHEEL_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "MLB Picker Wheel",
    },
    mainEntity: {
      "@id": `${MLB_WHEEL_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${MLB_WHEEL_URL}#article`,
        headline: MLB_WHEEL_ARTICLE_TITLE,
        description: MLB_WHEEL_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: MLB_WHEEL_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: MLB_WHEEL_SITE_URL,
        },
      },
      { "@id": `${MLB_WHEEL_URL}#mlb-faq` },
      { "@id": `${MLB_WHEEL_URL}#mlb-toc` },
    ],
    breadcrumb: {
      "@id": `${MLB_WHEEL_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: MLB_WHEEL_URL,
      name: "Spin the MLB Picker Wheel",
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

export default function MlbWheelPage() {
  return (
    <>
      <MlbWheelJsonLd />
      <MlbWheelApp
        shortTitle={MLB_WHEEL_SHORT_TITLE}
        toolSubtitle="Pick a random MLB team by wheel"
        seoIntro={<MlbWheelSeoIntro />}
        seoSections={<MlbWheelSeoSections />}
      />
    </>
  )
}
