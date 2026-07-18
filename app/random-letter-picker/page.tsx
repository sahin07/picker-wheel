import type { Metadata } from "next"
import LetterPickerWheelApp from "@/components/letter-picker/letter-picker-wheel-app"
import LetterPickerSeoSections, {
  LetterPickerSeoIntro,
} from "@/components/letter-picker/letter-picker-seo-sections"
import {
  LETTER_PICKER_ARTICLE_TITLE,
  LETTER_PICKER_FAQ_ITEMS,
  LETTER_PICKER_H1,
  LETTER_PICKER_HERO_INTRO,
  LETTER_PICKER_KEYWORDS,
  LETTER_PICKER_ON_THIS_PAGE,
  LETTER_PICKER_PAGE_DESCRIPTION,
  LETTER_PICKER_PAGE_TITLE,
  LETTER_PICKER_SITE_URL,
  LETTER_PICKER_URL,
} from "@/lib/letter-picker-seo"

export const metadata: Metadata = {
  title: {
    absolute: LETTER_PICKER_PAGE_TITLE,
  },
  description: LETTER_PICKER_PAGE_DESCRIPTION,
  keywords: [...LETTER_PICKER_KEYWORDS],
  alternates: {
    canonical: LETTER_PICKER_URL,
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
    title: LETTER_PICKER_PAGE_TITLE,
    description: LETTER_PICKER_PAGE_DESCRIPTION,
    url: LETTER_PICKER_URL,
    siteName: "Picker Wheel",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: LETTER_PICKER_PAGE_TITLE,
    description: LETTER_PICKER_PAGE_DESCRIPTION,
  },
}

function LetterPickerJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${LETTER_PICKER_URL}#lp-faq`,
    mainEntity: LETTER_PICKER_FAQ_ITEMS.map((item) => ({
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
    "@id": `${LETTER_PICKER_URL}#app`,
    name: "Random Letter Picker",
    alternateName: [
      "Letter Picker Wheel",
      "Random Letter Generator",
      "Alphabet Wheel",
      "Letter Spinner",
      "Random Alphabet Picker",
      "Wheel of Letters",
    ],
    url: LETTER_PICKER_URL,
    description: LETTER_PICKER_PAGE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin a random letter online",
      "A–Z alphabet wheel",
      "Vowel and consonant presets",
      "Custom letter lists",
      "Uppercase and lowercase styles",
      "Elimination mode",
      "Fullscreen wheel mode",
      "Save wheels on device",
      "Mobile-friendly letter spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${LETTER_PICKER_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${LETTER_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Random Letter Picker",
        item: LETTER_PICKER_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${LETTER_PICKER_URL}#lp-toc`,
    name: "On this page — Random Letter Picker",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: LETTER_PICKER_ON_THIS_PAGE.length,
    itemListElement: LETTER_PICKER_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${LETTER_PICKER_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${LETTER_PICKER_URL}#webpage`,
    url: LETTER_PICKER_URL,
    name: LETTER_PICKER_H1,
    headline: LETTER_PICKER_H1,
    description: LETTER_PICKER_HERO_INTRO,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${LETTER_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: LETTER_PICKER_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Random Letter Picker",
    },
    mainEntity: {
      "@id": `${LETTER_PICKER_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${LETTER_PICKER_URL}#article`,
        headline: LETTER_PICKER_ARTICLE_TITLE,
        description: LETTER_PICKER_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: LETTER_PICKER_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: LETTER_PICKER_SITE_URL,
        },
      },
      { "@id": `${LETTER_PICKER_URL}#lp-faq` },
      { "@id": `${LETTER_PICKER_URL}#lp-toc` },
    ],
    breadcrumb: {
      "@id": `${LETTER_PICKER_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: LETTER_PICKER_URL,
      name: "Spin the Random Letter Picker",
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

export default function RandomLetterPickerPage() {
  return (
    <>
      <LetterPickerJsonLd />
      <LetterPickerWheelApp
        seoIntro={<LetterPickerSeoIntro />}
        seoSections={<LetterPickerSeoSections />}
      />
    </>
  )
}
