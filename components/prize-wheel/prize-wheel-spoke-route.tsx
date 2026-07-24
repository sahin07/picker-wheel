import type { Metadata } from "next"
import PrizeWheelApp from "./prize-wheel-app"
import { PrizeWheelSpokeSeoIntro, PrizeWheelSpokeSeoSections } from "./prize-wheel-spoke-seo"
import { PRIZE_WHEEL_OG_IMAGE_URL, PRIZE_WHEEL_PATH, PRIZE_WHEEL_SITE_URL } from "@/lib/prize-wheel-seo"
import { getPrizeWheelSpoke, prizeSpokeUrl, type PrizeWheelSpokeId } from "@/lib/prize-wheel-spokes"

export function prizeWheelSpokeMetadata(spokeId: PrizeWheelSpokeId): Metadata {
  const spoke = getPrizeWheelSpoke(spokeId)
  const url = prizeSpokeUrl(spoke.path)
  return {
    title: { absolute: spoke.pageTitle }, description: spoke.description, keywords: [...spoke.keywords],
    alternates: { canonical: url }, robots: { index: true, follow: true },
    openGraph: { title: spoke.pageTitle, description: spoke.description, url, siteName: "Spinifywheel",
      locale: "en_US", type: "website", images: [{ url: PRIZE_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }] },
    twitter: { card: "summary_large_image", title: spoke.pageTitle, description: spoke.description, images: [PRIZE_WHEEL_OG_IMAGE_URL] },
  }
}
function PrizeWheelSpokeJsonLd({ spokeId }: { spokeId: PrizeWheelSpokeId }) {
  const spoke = getPrizeWheelSpoke(spokeId)
  const url = prizeSpokeUrl(spoke.path)
  const schemas = [
    { "@context": "https://schema.org", "@type": "WebApplication", "@id": `${url}#app`, name: spoke.h1,
      url, description: spoke.description, applicationCategory: "UtilityApplication", operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: spoke.faq.map((item) => ({
      "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer },
    })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${PRIZE_WHEEL_SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Prize Wheel Spinner", item: `${PRIZE_WHEEL_SITE_URL}${PRIZE_WHEEL_PATH}` },
      { "@type": "ListItem", position: 3, name: spoke.h1, item: url },
    ] },
  ]
  return <>{schemas.map((schema, index) => <script key={index} type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}</>
}
export default function PrizeWheelSpokeRoute({ spokeId }: { spokeId: PrizeWheelSpokeId }) {
  const spoke = getPrizeWheelSpoke(spokeId)
  return <><PrizeWheelSpokeJsonLd spokeId={spokeId} /><PrizeWheelApp deepLink={spoke.deepLink}
    shortTitle={spoke.shortTitle} toolSubtitle={spoke.heroIntro.slice(0, 110)}
    seoIntro={<PrizeWheelSpokeSeoIntro spoke={spoke} />} seoSections={<PrizeWheelSpokeSeoSections spoke={spoke} />} /></>
}
