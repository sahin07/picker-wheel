import type { Metadata } from "next"
import WordPickerWheelApp from "@/components/word-picker-wheel/word-picker-wheel-app"
import WordPickerWheelSeoSections, {
  WordPickerWheelSeoIntro,
} from "@/components/word-picker-wheel/word-picker-wheel-seo-sections"
import {
  WORD_PICKER_WHEEL_FAQ_ITEMS,
  WORD_PICKER_WHEEL_H1,
  WORD_PICKER_WHEEL_KEYWORDS,
  WORD_PICKER_WHEEL_OG_IMAGE_URL,
  WORD_PICKER_WHEEL_ON_THIS_PAGE,
  WORD_PICKER_WHEEL_PAGE_DESCRIPTION,
  WORD_PICKER_WHEEL_PAGE_TITLE,
  WORD_PICKER_WHEEL_SHORT_TITLE,
  WORD_PICKER_WHEEL_SITE_URL,
  WORD_PICKER_WHEEL_URL,
} from "@/lib/word-picker-wheel-seo"

export const metadata: Metadata = {
  title: { absolute: WORD_PICKER_WHEEL_PAGE_TITLE },
  description: WORD_PICKER_WHEEL_PAGE_DESCRIPTION,
  keywords: [...WORD_PICKER_WHEEL_KEYWORDS],
  alternates: { canonical: WORD_PICKER_WHEEL_URL },
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
    title: WORD_PICKER_WHEEL_PAGE_TITLE,
    description: WORD_PICKER_WHEEL_PAGE_DESCRIPTION,
    url: WORD_PICKER_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: WORD_PICKER_WHEEL_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: WORD_PICKER_WHEEL_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: WORD_PICKER_WHEEL_PAGE_TITLE,
    description: WORD_PICKER_WHEEL_PAGE_DESCRIPTION,
    images: [WORD_PICKER_WHEEL_OG_IMAGE_URL],
  },
}

function WordPickerWheelJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${WORD_PICKER_WHEEL_URL}#app`,
      name: WORD_PICKER_WHEEL_H1,
      url: WORD_PICKER_WHEEL_URL,
      description: WORD_PICKER_WHEEL_PAGE_DESCRIPTION,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: WORD_PICKER_WHEEL_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: WORD_PICKER_WHEEL_SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: WORD_PICKER_WHEEL_H1,
          item: WORD_PICKER_WHEEL_URL,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "On this page",
      itemListElement: WORD_PICKER_WHEEL_ON_THIS_PAGE.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `${WORD_PICKER_WHEEL_URL}#${item.id}`,
      })),
    },
  ]
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}

export default function WordPickerWheelPage() {
  return (
    <>
      <WordPickerWheelJsonLd />
      <WordPickerWheelApp
        shortTitle={WORD_PICKER_WHEEL_SHORT_TITLE}
        toolSubtitle="Random word spinner for writing, classrooms, vocabulary, and games"
        seoIntro={<WordPickerWheelSeoIntro />}
        seoSections={<WordPickerWheelSeoSections />}
      />
    </>
  )
}
