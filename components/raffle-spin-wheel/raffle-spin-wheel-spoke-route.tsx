import type { Metadata } from "next"
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/site-metadata"
import RaffleSpinWheelApp from "./raffle-spin-wheel-app"
import { RaffleSpinWheelSpokeSeoIntro, RaffleSpinWheelSpokeSeoSections } from "./raffle-spin-wheel-spoke-seo"
import {
  RAFFLE_SPIN_WHEEL_OG_IMAGE_URL,
  RAFFLE_SPIN_WHEEL_PATH,
  RAFFLE_SPIN_WHEEL_SITE_URL,
} from "@/lib/raffle-spin-wheel-seo"
import {
  getRaffleSpinWheelSpoke,
  raffleSpokeUrl,
  type RaffleSpinWheelSpokeId,
} from "@/lib/raffle-spin-wheel-spokes"

export function raffleSpinWheelSpokeMetadata(spokeId: RaffleSpinWheelSpokeId): Metadata {
  const spoke = getRaffleSpinWheelSpoke(spokeId)
  const url = raffleSpokeUrl(spoke.path)
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
      images: [{ url: RAFFLE_SPIN_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: spoke.pageTitle,
      description: spoke.description,
      images: [RAFFLE_SPIN_WHEEL_OG_IMAGE_URL],
    },
  }
}

function RaffleSpokeJsonLd({ spokeId }: { spokeId: RaffleSpinWheelSpokeId }) {
  const spoke = getRaffleSpinWheelSpoke(spokeId)
  const url = raffleSpokeUrl(spoke.path)
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
        { "@type": "ListItem", position: 1, name: "Home", item: `${RAFFLE_SPIN_WHEEL_SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Raffle Spin Wheel",
          item: `${RAFFLE_SPIN_WHEEL_SITE_URL}${RAFFLE_SPIN_WHEEL_PATH}`,
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

export default function RaffleSpinWheelSpokeRoute({ spokeId }: { spokeId: RaffleSpinWheelSpokeId }) {
  const spoke = getRaffleSpinWheelSpoke(spokeId)
  return (
    <>
      <RaffleSpokeJsonLd spokeId={spokeId} />
      <RaffleSpinWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={spoke.heroIntro.slice(0, 110)}
        seoIntro={<RaffleSpinWheelSpokeSeoIntro spoke={spoke} />}
        seoSections={<RaffleSpinWheelSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
