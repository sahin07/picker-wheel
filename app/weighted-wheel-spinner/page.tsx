import type { Metadata } from "next"
import WeightedWheelApp from "@/components/weighted-wheel/weighted-wheel-app"
import WeightedWheelSeoSections, {
  WeightedWheelSeoIntro,
} from "@/components/weighted-wheel/weighted-wheel-seo-sections"
import {
  WEIGHTED_WHEEL_FAQ_ITEMS,
  WEIGHTED_WHEEL_H1,
  WEIGHTED_WHEEL_KEYWORDS,
  WEIGHTED_WHEEL_OG_IMAGE_URL,
  WEIGHTED_WHEEL_ON_THIS_PAGE,
  WEIGHTED_WHEEL_PAGE_DESCRIPTION,
  WEIGHTED_WHEEL_PAGE_TITLE,
  WEIGHTED_WHEEL_SHORT_TITLE,
  WEIGHTED_WHEEL_SITE_URL,
  WEIGHTED_WHEEL_URL,
} from "@/lib/weighted-wheel-seo"
import { getWeightedWheelSpoke } from "@/lib/weighted-wheel-spokes"

export const metadata: Metadata = {
  title: { absolute: WEIGHTED_WHEEL_PAGE_TITLE },
  description: WEIGHTED_WHEEL_PAGE_DESCRIPTION,
  keywords: [...WEIGHTED_WHEEL_KEYWORDS],
  alternates: { canonical: WEIGHTED_WHEEL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: WEIGHTED_WHEEL_PAGE_TITLE,
    description: WEIGHTED_WHEEL_PAGE_DESCRIPTION,
    url: WEIGHTED_WHEEL_URL,
    siteName: "Picker Wheel",
    locale: "en_US",
    type: "website",
    images: [{ url: WEIGHTED_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: WEIGHTED_WHEEL_H1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: WEIGHTED_WHEEL_PAGE_TITLE,
    description: WEIGHTED_WHEEL_PAGE_DESCRIPTION,
    images: [WEIGHTED_WHEEL_OG_IMAGE_URL],
  },
}

function WeightedWheelJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${WEIGHTED_WHEEL_URL}#app`,
      name: WEIGHTED_WHEEL_H1,
      url: WEIGHTED_WHEEL_URL,
      description: WEIGHTED_WHEEL_PAGE_DESCRIPTION,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: WEIGHTED_WHEEL_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: WEIGHTED_WHEEL_SITE_URL },
        { "@type": "ListItem", position: 2, name: WEIGHTED_WHEEL_H1, item: WEIGHTED_WHEEL_URL },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "On this page",
      itemListElement: WEIGHTED_WHEEL_ON_THIS_PAGE.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `${WEIGHTED_WHEEL_URL}#${item.id}`,
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

export default function WeightedWheelPage() {
  return (
    <>
      <WeightedWheelJsonLd />
      <WeightedWheelApp
        shortTitle={WEIGHTED_WHEEL_SHORT_TITLE}
        toolSubtitle="Set custom odds for every outcome"
        deepLink={getWeightedWheelSpoke("weighted").deepLink}
        seoIntro={<WeightedWheelSeoIntro />}
        seoSections={<WeightedWheelSeoSections />}
      />
    </>
  )
}
