import type { Metadata } from "next"
import NumberPickerWheelApp from "@/components/number-picker/number-picker-wheel-app"
import NumberPickerSeoSections, {
  NumberPickerSeoIntro,
} from "@/components/number-picker/number-picker-seo-sections"
import {
  NUMBER_PICKER_ARTICLE_TITLE,
  NUMBER_PICKER_FAQ_ITEMS,
  NUMBER_PICKER_H1,
  NUMBER_PICKER_HERO_INTRO,
  NUMBER_PICKER_KEYWORDS,
  NUMBER_PICKER_OG_IMAGE_URL,
  NUMBER_PICKER_ON_THIS_PAGE,
  NUMBER_PICKER_PAGE_DESCRIPTION,
  NUMBER_PICKER_PAGE_TITLE,
  NUMBER_PICKER_SITE_URL,
  NUMBER_PICKER_URL,
} from "@/lib/number-picker-seo"

export const metadata: Metadata = {
  title: {
    absolute: NUMBER_PICKER_PAGE_TITLE,
  },
  description: NUMBER_PICKER_PAGE_DESCRIPTION,
  keywords: [...NUMBER_PICKER_KEYWORDS],
  alternates: {
    canonical: NUMBER_PICKER_URL,
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
    title: NUMBER_PICKER_PAGE_TITLE,
    description: NUMBER_PICKER_PAGE_DESCRIPTION,
    url: NUMBER_PICKER_URL,
    siteName: "Picker Wheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: NUMBER_PICKER_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: NUMBER_PICKER_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: NUMBER_PICKER_PAGE_TITLE,
    description: NUMBER_PICKER_PAGE_DESCRIPTION,
    images: [NUMBER_PICKER_OG_IMAGE_URL],
  },
}

function NumberPickerJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${NUMBER_PICKER_URL}#np-faq`,
    mainEntity: NUMBER_PICKER_FAQ_ITEMS.map((item) => ({
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
    "@id": `${NUMBER_PICKER_URL}#app`,
    name: "Random Number Picker Wheel",
    alternateName: [
      "Random Number Picker",
      "Number Picker Wheel",
      "Number Spinner",
      "Random Number Generator Wheel",
      "Wheel of Numbers",
    ],
    url: NUMBER_PICKER_URL,
    description: NUMBER_PICKER_PAGE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin a random number online",
      "Custom number ranges",
      "Elimination mode",
      "Bingo and classroom modes",
      "Weighted numbers",
      "Fullscreen wheel mode",
      "Save wheels on device",
      "Mobile-friendly number spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${NUMBER_PICKER_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${NUMBER_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Random Number Picker Wheel",
        item: NUMBER_PICKER_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${NUMBER_PICKER_URL}#np-toc`,
    name: "On this page — Random Number Picker Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: NUMBER_PICKER_ON_THIS_PAGE.length,
    itemListElement: NUMBER_PICKER_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${NUMBER_PICKER_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${NUMBER_PICKER_URL}#webpage`,
    url: NUMBER_PICKER_URL,
    name: NUMBER_PICKER_H1,
    headline: NUMBER_PICKER_H1,
    description: NUMBER_PICKER_HERO_INTRO,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${NUMBER_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: NUMBER_PICKER_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Random Number Picker Wheel",
    },
    mainEntity: {
      "@id": `${NUMBER_PICKER_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${NUMBER_PICKER_URL}#article`,
        headline: NUMBER_PICKER_ARTICLE_TITLE,
        description: NUMBER_PICKER_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: NUMBER_PICKER_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: NUMBER_PICKER_SITE_URL,
        },
      },
      { "@id": `${NUMBER_PICKER_URL}#np-faq` },
      { "@id": `${NUMBER_PICKER_URL}#np-toc` },
    ],
    breadcrumb: {
      "@id": `${NUMBER_PICKER_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: NUMBER_PICKER_URL,
      name: "Spin the Random Number Picker Wheel",
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

export default function NumberPickerWheelPage() {
  return (
    <>
      <NumberPickerJsonLd />
      <NumberPickerWheelApp
        seoIntro={<NumberPickerSeoIntro />}
        seoSections={<NumberPickerSeoSections />}
      />
    </>
  )
}
