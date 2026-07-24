import type { Metadata } from "next"
import ColorPickerWheelApp from "@/components/color-picker-wheel/color-picker-wheel-app"
import ColorPickerSeoSections, {
  ColorPickerSeoIntro,
} from "@/components/color-picker-wheel/color-picker-seo-sections"
import {
  COLOR_PICKER_ARTICLE_TITLE,
  COLOR_PICKER_FAQ_ITEMS,
  COLOR_PICKER_H1,
  COLOR_PICKER_HERO_INTRO,
  COLOR_PICKER_KEYWORDS,
  COLOR_PICKER_OG_IMAGE_URL,
  COLOR_PICKER_ON_THIS_PAGE,
  COLOR_PICKER_PAGE_DESCRIPTION,
  COLOR_PICKER_PAGE_TITLE,
  COLOR_PICKER_SITE_URL,
  COLOR_PICKER_URL,
} from "@/lib/color-picker-seo"

export const metadata: Metadata = {
  title: {
    absolute: COLOR_PICKER_PAGE_TITLE,
  },
  description: COLOR_PICKER_PAGE_DESCRIPTION,
  keywords: [...COLOR_PICKER_KEYWORDS],
  alternates: {
    canonical: COLOR_PICKER_URL,
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
    title: COLOR_PICKER_PAGE_TITLE,
    description: COLOR_PICKER_PAGE_DESCRIPTION,
    url: COLOR_PICKER_URL,
    siteName: "Picker Wheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: COLOR_PICKER_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: COLOR_PICKER_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: COLOR_PICKER_PAGE_TITLE,
    description: COLOR_PICKER_PAGE_DESCRIPTION,
    images: [COLOR_PICKER_OG_IMAGE_URL],
  },
}

function ColorPickerJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${COLOR_PICKER_URL}#cp-faq`,
    mainEntity: COLOR_PICKER_FAQ_ITEMS.map((item) => ({
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
    "@id": `${COLOR_PICKER_URL}#app`,
    name: "Color Picker Wheel",
    alternateName: [
      "Wheel of Colors",
      "Random Color Picker",
      "Random Color Generator",
      "Color Wheel Spinner",
      "Online Color Wheel",
      "HEX Color Picker Wheel",
    ],
    url: COLOR_PICKER_URL,
    description: COLOR_PICKER_PAGE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin a random color online",
      "Custom color lists and ready-made palettes",
      "Basic, rainbow, pastel, neon, warm, and cool wheels",
      "Classroom and game color spinning",
      "HEX and RGB color output",
      "Image color sampling",
      "AI palette ideas",
      "Fullscreen wheel mode",
      "Save wheels on device",
      "Mobile-friendly color spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${COLOR_PICKER_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${COLOR_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Color Picker Wheel",
        item: COLOR_PICKER_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${COLOR_PICKER_URL}#cp-toc`,
    name: "On this page — Color Picker Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: COLOR_PICKER_ON_THIS_PAGE.length,
    itemListElement: COLOR_PICKER_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${COLOR_PICKER_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${COLOR_PICKER_URL}#webpage`,
    url: COLOR_PICKER_URL,
    name: COLOR_PICKER_H1,
    headline: COLOR_PICKER_H1,
    description: COLOR_PICKER_HERO_INTRO,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${COLOR_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: COLOR_PICKER_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Color Picker Wheel",
    },
    mainEntity: {
      "@id": `${COLOR_PICKER_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${COLOR_PICKER_URL}#article`,
        headline: COLOR_PICKER_ARTICLE_TITLE,
        description: COLOR_PICKER_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: COLOR_PICKER_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: COLOR_PICKER_SITE_URL,
        },
      },
      { "@id": `${COLOR_PICKER_URL}#cp-faq` },
      { "@id": `${COLOR_PICKER_URL}#cp-toc` },
    ],
    breadcrumb: {
      "@id": `${COLOR_PICKER_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: COLOR_PICKER_URL,
      name: "Spin the Color Picker Wheel",
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

export default function ColorPickerWheelPage() {
  return (
    <>
      <ColorPickerJsonLd />
      <ColorPickerWheelApp
        seoIntro={<ColorPickerSeoIntro />}
        seoSections={<ColorPickerSeoSections />}
      />
    </>
  )
}
