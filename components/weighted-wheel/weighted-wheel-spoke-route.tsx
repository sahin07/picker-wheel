import type { Metadata } from "next"
import WeightedWheelApp from "./weighted-wheel-app"
import {
  WeightedWheelSpokeSeoIntro,
  WeightedWheelSpokeSeoSections,
} from "./weighted-wheel-spoke-seo"
import {
  WEIGHTED_WHEEL_OG_IMAGE_URL,
  WEIGHTED_WHEEL_PATH,
  WEIGHTED_WHEEL_SITE_URL,
} from "@/lib/weighted-wheel-seo"
import {
  getWeightedWheelSpoke,
  weightedSpokeUrl,
  type WeightedWheelSpokeId,
} from "@/lib/weighted-wheel-spokes"

export function weightedWheelSpokeMetadata(spokeId: WeightedWheelSpokeId): Metadata {
  const spoke = getWeightedWheelSpoke(spokeId)
  const url = weightedSpokeUrl(spoke.path)
  return {
    title: { absolute: spoke.pageTitle },
    description: spoke.description,
    keywords: [...spoke.keywords],
    alternates: { canonical: url },
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
      title: spoke.pageTitle,
      description: spoke.description,
      url,
      siteName: "Picker Wheel",
      locale: "en_US",
      type: "website",
      images: [{ url: WEIGHTED_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: spoke.pageTitle,
      description: spoke.description,
      images: [WEIGHTED_WHEEL_OG_IMAGE_URL],
    },
  }
}

function WeightedWheelSpokeJsonLd({ spokeId }: { spokeId: WeightedWheelSpokeId }) {
  const spoke = getWeightedWheelSpoke(spokeId)
  const url = weightedSpokeUrl(spoke.path)
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
      "@id": `${url}#weighted-spoke-faq`,
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
        { "@type": "ListItem", position: 1, name: "Home", item: `${WEIGHTED_WHEEL_SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Weighted Wheel Spinner",
          item: `${WEIGHTED_WHEEL_SITE_URL}${WEIGHTED_WHEEL_PATH}`,
        },
        { "@type": "ListItem", position: 3, name: spoke.h1, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: spoke.articleTitle,
      description: spoke.heroIntro,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Picker Wheel" },
      publisher: { "@type": "Organization", name: "Picker Wheel" },
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

export default function WeightedWheelSpokeRoute({ spokeId }: { spokeId: WeightedWheelSpokeId }) {
  const spoke = getWeightedWheelSpoke(spokeId)
  return (
    <>
      <WeightedWheelSpokeJsonLd spokeId={spokeId} />
      <WeightedWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={spoke.heroIntro.slice(0, 110)}
        seoIntro={<WeightedWheelSpokeSeoIntro spoke={spoke} />}
        seoSections={<WeightedWheelSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
