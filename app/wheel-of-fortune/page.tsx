import type { Metadata } from "next"
import FortuneWheelApp from "@/components/fortune-wheel/fortune-wheel-app"
import FortuneWheelSeoSections, {
  FortuneWheelSeoIntro,
} from "@/components/fortune-wheel/fortune-wheel-seo-sections"
import {
  FORTUNE_WHEEL_FAQ_ITEMS,
  FORTUNE_WHEEL_H1,
  FORTUNE_WHEEL_KEYWORDS,
  FORTUNE_WHEEL_OG_IMAGE_URL,
  FORTUNE_WHEEL_PAGE_DESCRIPTION,
  FORTUNE_WHEEL_PAGE_TITLE,
  FORTUNE_WHEEL_SHORT_TITLE,
  FORTUNE_WHEEL_SITE_URL,
  FORTUNE_WHEEL_URL,
} from "@/lib/fortune-wheel-seo"
import { getFortuneWheelSpoke } from "@/lib/fortune-wheel-spokes"

export const metadata: Metadata = {
  title: { absolute: FORTUNE_WHEEL_PAGE_TITLE },
  description: FORTUNE_WHEEL_PAGE_DESCRIPTION,
  keywords: [...FORTUNE_WHEEL_KEYWORDS],
  alternates: { canonical: FORTUNE_WHEEL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: FORTUNE_WHEEL_PAGE_TITLE,
    description: FORTUNE_WHEEL_PAGE_DESCRIPTION,
    url: FORTUNE_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [{ url: FORTUNE_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: FORTUNE_WHEEL_H1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: FORTUNE_WHEEL_PAGE_TITLE,
    description: FORTUNE_WHEEL_PAGE_DESCRIPTION,
    images: [FORTUNE_WHEEL_OG_IMAGE_URL],
  },
}

function FortuneWheelJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${FORTUNE_WHEEL_URL}#app`,
      name: FORTUNE_WHEEL_H1,
      url: FORTUNE_WHEEL_URL,
      description: FORTUNE_WHEEL_PAGE_DESCRIPTION,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FORTUNE_WHEEL_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: FORTUNE_WHEEL_SITE_URL },
        { "@type": "ListItem", position: 2, name: FORTUNE_WHEEL_H1, item: FORTUNE_WHEEL_URL },
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

export default function Page() {
  return (
    <>
      <FortuneWheelJsonLd />
      <FortuneWheelApp
        shortTitle={FORTUNE_WHEEL_SHORT_TITLE}
        toolSubtitle="Custom choices, decisions, activities, and prizes with equal odds"
        deepLink={getFortuneWheelSpoke("fortune").deepLink}
        seoIntro={<FortuneWheelSeoIntro />}
        seoSections={<FortuneWheelSeoSections />}
      />
    </>
  )
}
