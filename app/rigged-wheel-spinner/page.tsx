import type { Metadata } from "next"
import WeightedWheelApp from "@/components/weighted-wheel/weighted-wheel-app"
import WeightedWheelSeoSections, {
  RiggedWheelSeoIntro,
} from "@/components/weighted-wheel/weighted-wheel-seo-sections"
import {
  RIGGED_DESCRIPTION,
  RIGGED_H1,
  RIGGED_PAGE_TITLE,
  RIGGED_URL,
  WEIGHTED_WHEEL_OG_IMAGE_URL,
} from "@/lib/weighted-wheel-seo"
import { getWeightedWheelSpoke } from "@/lib/weighted-wheel-spokes"

const spoke = getWeightedWheelSpoke("rigged")

export const metadata: Metadata = {
  title: { absolute: RIGGED_PAGE_TITLE },
  description: RIGGED_DESCRIPTION,
  keywords: [...spoke.keywords],
  alternates: { canonical: RIGGED_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: RIGGED_PAGE_TITLE,
    description: RIGGED_DESCRIPTION,
    url: RIGGED_URL,
    siteName: "Picker Wheel",
    locale: "en_US",
    type: "website",
    images: [{ url: WEIGHTED_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: RIGGED_H1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: RIGGED_PAGE_TITLE,
    description: RIGGED_DESCRIPTION,
    images: [WEIGHTED_WHEEL_OG_IMAGE_URL],
  },
}

export default function RiggedWheelPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: RIGGED_H1,
      url: RIGGED_URL,
      description: RIGGED_DESCRIPTION,
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
  ]
  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <WeightedWheelApp
        variant="rigged"
        shortTitle={spoke.shortTitle}
        toolSubtitle="Create a transparent wheel with custom probabilities"
        deepLink={spoke.deepLink}
        seoIntro={<RiggedWheelSeoIntro />}
        seoSections={<WeightedWheelSeoSections />}
      />
    </>
  )
}
