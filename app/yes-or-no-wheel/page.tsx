import type { Metadata } from "next"
import YesNoPickerWheelApp from "@/components/yes-no-picker-wheel/yes-no-picker-wheel-app"
import YesNoPickerSeoSections, {
  YesNoPickerSeoIntro,
} from "@/components/yes-no-picker-wheel/yes-no-picker-seo-sections"
import {
  YES_NO_PICKER_ARTICLE_TITLE,
  YES_NO_PICKER_FAQ_ITEMS,
  YES_NO_PICKER_H1,
  YES_NO_PICKER_HERO_INTRO,
  YES_NO_PICKER_KEYWORDS,
  YES_NO_PICKER_OG_IMAGE_URL,
  YES_NO_PICKER_ON_THIS_PAGE,
  YES_NO_PICKER_PAGE_DESCRIPTION,
  YES_NO_PICKER_PAGE_TITLE,
  YES_NO_PICKER_SITE_URL,
  YES_NO_PICKER_URL,
} from "@/lib/yes-no-picker-seo"

export const metadata: Metadata = {
  title: {
    absolute: YES_NO_PICKER_PAGE_TITLE,
  },
  description: YES_NO_PICKER_PAGE_DESCRIPTION,
  keywords: [...YES_NO_PICKER_KEYWORDS],
  alternates: {
    canonical: YES_NO_PICKER_URL,
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
    title: YES_NO_PICKER_PAGE_TITLE,
    description: YES_NO_PICKER_PAGE_DESCRIPTION,
    url: YES_NO_PICKER_URL,
    siteName: "Picker Wheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: YES_NO_PICKER_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: YES_NO_PICKER_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: YES_NO_PICKER_PAGE_TITLE,
    description: YES_NO_PICKER_PAGE_DESCRIPTION,
    images: [YES_NO_PICKER_OG_IMAGE_URL],
  },
}

function YesNoPickerJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${YES_NO_PICKER_URL}#yn-faq`,
    mainEntity: YES_NO_PICKER_FAQ_ITEMS.map((item) => ({
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
    "@id": `${YES_NO_PICKER_URL}#app`,
    name: "Yes or No Wheel",
    alternateName: [
      "Yes or No Picker Wheel",
      "Yes or No Spinner",
      "Yes No Wheel",
      "Decision Wheel",
      "Yes or No Generator",
      "Random Decision Maker",
    ],
    url: YES_NO_PICKER_URL,
    description: YES_NO_PICKER_PAGE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin yes or no online",
      "Customizable decision spinner",
      "Yes / No / Maybe mode",
      "Custom option labels",
      "Elimination mode",
      "Save and reuse wheels",
      "Mobile-friendly yes or no wheel",
      "Unlimited spins",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${YES_NO_PICKER_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${YES_NO_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Yes or No Wheel",
        item: YES_NO_PICKER_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${YES_NO_PICKER_URL}#yn-toc`,
    name: "On this page — Yes or No Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: YES_NO_PICKER_ON_THIS_PAGE.length,
    itemListElement: YES_NO_PICKER_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${YES_NO_PICKER_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${YES_NO_PICKER_URL}#webpage`,
    url: YES_NO_PICKER_URL,
    name: YES_NO_PICKER_H1,
    headline: YES_NO_PICKER_H1,
    description: YES_NO_PICKER_HERO_INTRO,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${YES_NO_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: YES_NO_PICKER_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Yes or No Wheel",
    },
    mainEntity: {
      "@id": `${YES_NO_PICKER_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${YES_NO_PICKER_URL}#article`,
        headline: YES_NO_PICKER_ARTICLE_TITLE,
        description: YES_NO_PICKER_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: YES_NO_PICKER_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: YES_NO_PICKER_SITE_URL,
        },
      },
      { "@id": `${YES_NO_PICKER_URL}#yn-faq` },
      { "@id": `${YES_NO_PICKER_URL}#yn-toc` },
    ],
    breadcrumb: {
      "@id": `${YES_NO_PICKER_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: YES_NO_PICKER_URL,
      name: "Spin the Yes or No Wheel",
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

export default function YesOrNoWheelPage() {
  return (
    <>
      <YesNoPickerJsonLd />
      <YesNoPickerWheelApp
        seoIntro={<YesNoPickerSeoIntro />}
        seoSections={<YesNoPickerSeoSections />}
      />
    </>
  )
}
