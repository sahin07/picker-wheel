import type { Metadata } from "next"
import PrizeWheelApp from "@/components/prize-wheel/prize-wheel-app"
import PrizeWheelSeoSections, { PrizeWheelSeoIntro } from "@/components/prize-wheel/prize-wheel-seo-sections"
import {
  PRIZE_WHEEL_FAQ_ITEMS, PRIZE_WHEEL_H1, PRIZE_WHEEL_KEYWORDS, PRIZE_WHEEL_OG_IMAGE_URL,
  PRIZE_WHEEL_ON_THIS_PAGE, PRIZE_WHEEL_PAGE_DESCRIPTION, PRIZE_WHEEL_PAGE_TITLE,
  PRIZE_WHEEL_SHORT_TITLE, PRIZE_WHEEL_SITE_URL, PRIZE_WHEEL_URL,
} from "@/lib/prize-wheel-seo"
import { getPrizeWheelSpoke } from "@/lib/prize-wheel-spokes"

export const metadata: Metadata = {
  title: { absolute: PRIZE_WHEEL_PAGE_TITLE }, description: PRIZE_WHEEL_PAGE_DESCRIPTION,
  keywords: [...PRIZE_WHEEL_KEYWORDS], alternates: { canonical: PRIZE_WHEEL_URL }, robots: { index: true, follow: true },
  openGraph: { title: PRIZE_WHEEL_PAGE_TITLE, description: PRIZE_WHEEL_PAGE_DESCRIPTION, url: PRIZE_WHEEL_URL,
    siteName: "Spinifywheel", locale: "en_US", type: "website",
    images: [{ url: PRIZE_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: PRIZE_WHEEL_H1 }] },
  twitter: { card: "summary_large_image", title: PRIZE_WHEEL_PAGE_TITLE,
    description: PRIZE_WHEEL_PAGE_DESCRIPTION, images: [PRIZE_WHEEL_OG_IMAGE_URL] },
}
function PrizeWheelJsonLd() {
  const schemas = [
    { "@context": "https://schema.org", "@type": "WebApplication", "@id": `${PRIZE_WHEEL_URL}#app`,
      name: PRIZE_WHEEL_H1, url: PRIZE_WHEEL_URL, description: PRIZE_WHEEL_PAGE_DESCRIPTION,
      applicationCategory: "UtilityApplication", operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: PRIZE_WHEEL_FAQ_ITEMS.map((item) => ({
      "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer },
    })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: PRIZE_WHEEL_SITE_URL },
      { "@type": "ListItem", position: 2, name: PRIZE_WHEEL_H1, item: PRIZE_WHEEL_URL },
    ] },
    { "@context": "https://schema.org", "@type": "ItemList", name: "On this page",
      itemListElement: PRIZE_WHEEL_ON_THIS_PAGE.map((item, index) => ({
        "@type": "ListItem", position: index + 1, name: item.label, url: `${PRIZE_WHEEL_URL}#${item.id}`,
      })) },
  ]
  return <>{schemas.map((schema, index) => <script key={index} type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}</>
}
export default function PrizeWheelPage() {
  return <><PrizeWheelJsonLd /><PrizeWheelApp shortTitle={PRIZE_WHEEL_SHORT_TITLE}
    toolSubtitle="Equal-odds prizes for events, rewards, and classrooms"
    deepLink={getPrizeWheelSpoke("prize").deepLink}
    seoIntro={<PrizeWheelSeoIntro />} seoSections={<PrizeWheelSeoSections />} /></>
}
