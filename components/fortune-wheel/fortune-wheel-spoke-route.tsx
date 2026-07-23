import type { Metadata } from "next"
import FortuneWheelApp from "./fortune-wheel-app"
import { FortuneWheelSpokeSeoIntro, FortuneWheelSpokeSeoSections } from "./fortune-wheel-spoke-seo"
import { FORTUNE_WHEEL_OG_IMAGE_URL, FORTUNE_WHEEL_PATH, FORTUNE_WHEEL_SITE_URL } from "@/lib/fortune-wheel-seo"
import { fortuneSpokeUrl, getFortuneWheelSpoke, type FortuneWheelSpokeId } from "@/lib/fortune-wheel-spokes"

export function fortuneWheelSpokeMetadata(spokeId: FortuneWheelSpokeId): Metadata {
  const spoke = getFortuneWheelSpoke(spokeId)
  const url = fortuneSpokeUrl(spoke.path)
  return {
    title: { absolute: spoke.pageTitle }, description: spoke.description, keywords: [...spoke.keywords],
    alternates: { canonical: url }, robots: { index: true, follow: true },
    openGraph: { title: spoke.pageTitle, description: spoke.description, url, siteName: "Picker Wheel",
      locale: "en_US", type: "website", images: [{ url: FORTUNE_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }] },
    twitter: { card: "summary_large_image", title: spoke.pageTitle, description: spoke.description, images: [FORTUNE_WHEEL_OG_IMAGE_URL] },
  }
}
export function FortuneWheelSpokeJsonLd({ spokeId }: { spokeId: FortuneWheelSpokeId }) {
  const spoke = getFortuneWheelSpoke(spokeId)
  const url = fortuneSpokeUrl(spoke.path)
  const schemas = [
    { "@context": "https://schema.org", "@type": "WebApplication", "@id": `${url}#app`, name: spoke.h1,
      url, description: spoke.description, applicationCategory: "GameApplication", operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: spoke.faq.map((item) => ({
      "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer },
    })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${FORTUNE_WHEEL_SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Wheel of Fortune", item: `${FORTUNE_WHEEL_SITE_URL}${FORTUNE_WHEEL_PATH}` },
      { "@type": "ListItem", position: 3, name: spoke.h1, item: url },
    ] },
  ]
  return <>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}</>
}
export default function FortuneWheelSpokeRoute({ spokeId }: { spokeId: FortuneWheelSpokeId }) {
  const spoke = getFortuneWheelSpoke(spokeId)
  return <><FortuneWheelSpokeJsonLd spokeId={spokeId} /><FortuneWheelApp deepLink={spoke.deepLink}
    shortTitle={spoke.shortTitle} toolSubtitle={spoke.heroIntro.slice(0, 110)}
    seoIntro={<FortuneWheelSpokeSeoIntro spoke={spoke} />} seoSections={<FortuneWheelSpokeSeoSections spoke={spoke} />} /></>
}
