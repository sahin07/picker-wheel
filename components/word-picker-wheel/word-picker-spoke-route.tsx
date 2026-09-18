import type { Metadata } from "next"
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/site-metadata"
import WordPickerWheelApp from "./word-picker-wheel-app"
import {
  WordPickerSpokeSeoIntro,
  WordPickerSpokeSeoSections,
} from "./word-picker-spoke-seo"
import {
  WORD_PICKER_WHEEL_OG_IMAGE_URL,
  WORD_PICKER_WHEEL_PATH,
  WORD_PICKER_WHEEL_SITE_URL,
} from "@/lib/word-picker-wheel-seo"
import {
  getWordPickerSpoke,
  wordPickerSpokeUrl,
  type WordPickerSpokeId,
} from "@/lib/word-picker-wheel-spokes"

export function wordPickerSpokeMetadata(spokeId: WordPickerSpokeId): Metadata {
  const spoke = getWordPickerSpoke(spokeId)
  const url = wordPickerSpokeUrl(spoke.path)
  return {
    title: { absolute: spoke.pageTitle },
    description: spoke.description,
    keywords: [...spoke.keywords],
    alternates: { canonical: url },
    robots: NOINDEX_FOLLOW_ROBOTS,
    openGraph: {
      title: spoke.pageTitle,
      description: spoke.description,
      url,
      siteName: "Spinifywheel",
      locale: "en_US",
      type: "website",
      images: [{ url: WORD_PICKER_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: spoke.pageTitle,
      description: spoke.description,
      images: [WORD_PICKER_WHEEL_OG_IMAGE_URL],
    },
  }
}

function WordPickerSpokeJsonLd({ spokeId }: { spokeId: WordPickerSpokeId }) {
  const spoke = getWordPickerSpoke(spokeId)
  const url = wordPickerSpokeUrl(spoke.path)
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: spoke.h1,
      url,
      description: spoke.description,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: spoke.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${WORD_PICKER_WHEEL_SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Word Picker Wheel",
          item: `${WORD_PICKER_WHEEL_SITE_URL}${WORD_PICKER_WHEEL_PATH}`,
        },
        { "@type": "ListItem", position: 3, name: spoke.h1, item: url },
      ],
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

export default function WordPickerSpokeRoute({ spokeId }: { spokeId: WordPickerSpokeId }) {
  const spoke = getWordPickerSpoke(spokeId)
  return (
    <>
      <WordPickerSpokeJsonLd spokeId={spokeId} />
      <WordPickerWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={spoke.heroIntro.slice(0, 120)}
        seoIntro={<WordPickerSpokeSeoIntro spoke={spoke} />}
        seoSections={<WordPickerSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
