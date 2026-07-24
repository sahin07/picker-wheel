import type { Metadata } from "next"
import DemonSlayerWheelApp from "@/components/demon-slayer-wheel/demon-slayer-wheel-app"
import { DemonSlayerWheelSpokeSeoIntro, DemonSlayerWheelSpokeSeoSections } from "@/components/demon-slayer-wheel/demon-slayer-wheel-spoke-seo"
import { DEMON_SLAYER_WHEEL_OG_IMAGE_URL, DEMON_SLAYER_WHEEL_SITE_URL } from "@/lib/demon-slayer-wheel-seo"
import { getDemonSlayerWheelSpoke, demonSlayerSpokeUrl, type DemonSlayerWheelSpokeId } from "@/lib/demon-slayer-wheel-spokes"

export function demonSlayerWheelSpokeMetadata(spokeId: DemonSlayerWheelSpokeId): Metadata {
  const spoke = getDemonSlayerWheelSpoke(spokeId)
  const url = demonSlayerSpokeUrl(spoke.path)
  return {
    title: { absolute: spoke.pageTitle },
    description: spoke.description,
    keywords: [...spoke.keywords],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: spoke.pageTitle, description: spoke.description, url,
      siteName: "Spinifywheel", type: "website",
      images: [{ url: DEMON_SLAYER_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }],
    },
    twitter: { card: "summary_large_image", title: spoke.pageTitle, description: spoke.description, images: [DEMON_SLAYER_WHEEL_OG_IMAGE_URL] },
  }
}

export default function DemonSlayerWheelSpokeRoute({ spokeId }: { spokeId: DemonSlayerWheelSpokeId }) {
  const spoke = getDemonSlayerWheelSpoke(spokeId)
  const url = demonSlayerSpokeUrl(spoke.path)
  const schemas = [
    {
      "@context": "https://schema.org", "@type": "WebApplication", name: spoke.h1,
      url, description: spoke.description, applicationCategory: "EntertainmentApplication",
      operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: spoke.faq.map((item) => ({ "@type": "Question", name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer } })),
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${DEMON_SLAYER_WHEEL_SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Demon Slayer Spin Wheel", item: `${DEMON_SLAYER_WHEEL_SITE_URL}/demon-slayer-spin-wheel` },
        { "@type": "ListItem", position: 3, name: spoke.h1, item: url },
      ],
    },
  ]
  return <>
    {schemas.map((schema, index) => <script key={index} type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <DemonSlayerWheelApp
      deepLink={spoke.deepLink}
      shortTitle={spoke.shortTitle}
      toolSubtitle={spoke.heroIntro.slice(0, 120)}
      seoIntro={<DemonSlayerWheelSpokeSeoIntro spoke={spoke} />}
      seoSections={<DemonSlayerWheelSpokeSeoSections spoke={spoke} />}
    />
  </>
}
