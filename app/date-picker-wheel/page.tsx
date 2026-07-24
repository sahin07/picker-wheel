import type { Metadata } from "next"
import DatePickerWheelApp from "@/components/date-picker/date-picker-wheel-app"
import DatePickerSeoSections, {
  DatePickerSeoIntro,
} from "@/components/date-picker/date-picker-seo-sections"
import {
  DATE_PICKER_ARTICLE_TITLE,
  DATE_PICKER_FAQ_ITEMS,
  DATE_PICKER_H1,
  DATE_PICKER_HERO_INTRO,
  DATE_PICKER_KEYWORDS,
  DATE_PICKER_OG_IMAGE_URL,
  DATE_PICKER_ON_THIS_PAGE,
  DATE_PICKER_PAGE_DESCRIPTION,
  DATE_PICKER_PAGE_TITLE,
  DATE_PICKER_SITE_URL,
  DATE_PICKER_URL,
} from "@/lib/date-picker-seo"

export const metadata: Metadata = {
  title: {
    absolute: DATE_PICKER_PAGE_TITLE,
  },
  description: DATE_PICKER_PAGE_DESCRIPTION,
  keywords: [...DATE_PICKER_KEYWORDS],
  alternates: {
    canonical: DATE_PICKER_URL,
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
    title: DATE_PICKER_PAGE_TITLE,
    description: DATE_PICKER_PAGE_DESCRIPTION,
    url: DATE_PICKER_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: DATE_PICKER_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: DATE_PICKER_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DATE_PICKER_PAGE_TITLE,
    description: DATE_PICKER_PAGE_DESCRIPTION,
    images: [DATE_PICKER_OG_IMAGE_URL],
  },
}

function DatePickerJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${DATE_PICKER_URL}#dp-faq`,
    mainEntity: DATE_PICKER_FAQ_ITEMS.map((item) => ({
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
    "@id": `${DATE_PICKER_URL}#app`,
    name: "Date Picker Wheel",
    alternateName: [
      "Random Date Picker",
      "Date Wheel",
      "Random Date Generator",
      "Date Spinner",
      "Calendar Wheel",
    ],
    url: DATE_PICKER_URL,
    description: DATE_PICKER_PAGE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin a random date online",
      "Add single dates and date ranges",
      "Filter by weekday",
      "Multiple date display formats",
      "Elimination mode",
      "Ready-made date templates",
      "Save wheels on device",
      "Mobile-friendly date spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${DATE_PICKER_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${DATE_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Date Picker Wheel",
        item: DATE_PICKER_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${DATE_PICKER_URL}#dp-toc`,
    name: "On this page — Date Picker Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: DATE_PICKER_ON_THIS_PAGE.length,
    itemListElement: DATE_PICKER_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${DATE_PICKER_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${DATE_PICKER_URL}#webpage`,
    url: DATE_PICKER_URL,
    name: DATE_PICKER_H1,
    headline: DATE_PICKER_H1,
    description: DATE_PICKER_HERO_INTRO,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${DATE_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: DATE_PICKER_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Date Picker Wheel",
    },
    mainEntity: {
      "@id": `${DATE_PICKER_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${DATE_PICKER_URL}#article`,
        headline: DATE_PICKER_ARTICLE_TITLE,
        description: DATE_PICKER_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: DATE_PICKER_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: DATE_PICKER_SITE_URL,
        },
      },
      { "@id": `${DATE_PICKER_URL}#dp-faq` },
      { "@id": `${DATE_PICKER_URL}#dp-toc` },
    ],
    breadcrumb: {
      "@id": `${DATE_PICKER_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: DATE_PICKER_URL,
      name: "Spin the Date Picker Wheel",
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

export default function DatePickerWheelPage() {
  return (
    <>
      <DatePickerJsonLd />
      <DatePickerWheelApp
        seoIntro={<DatePickerSeoIntro />}
        seoSections={<DatePickerSeoSections />}
      />
    </>
  )
}
