import type { Metadata } from "next"
import NarutoWheelApp from "@/components/naruto-wheel/naruto-wheel-app"
import { NarutoWheelSpokeSeoIntro, NarutoWheelSpokeSeoSections } from "@/components/naruto-wheel/naruto-wheel-spoke-seo"
import { NARUTO_WHEEL_OG_IMAGE_URL, NARUTO_WHEEL_SITE_URL } from "@/lib/naruto-wheel-seo"
import { getNarutoWheelSpoke, narutoSpokeUrl, type NarutoWheelSpokeId } from "@/lib/naruto-wheel-spokes"

export function narutoWheelSpokeMetadata(spokeId: NarutoWheelSpokeId): Metadata {
  const spoke = getNarutoWheelSpoke(spokeId)
  const url = narutoSpokeUrl(spoke.path)
  return {
    title: { absolute: spoke.pageTitle },
    description: spoke.description,
    keywords: [...spoke.keywords],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: spoke.pageTitle, description: spoke.description, url,
      siteName: "Spinifywheel", type: "website",
      images: [{ url: NARUTO_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }],
    },
    twitter: { card: "summary_large_image", title: spoke.pageTitle, description: spoke.description, images: [NARUTO_WHEEL_OG_IMAGE_URL] },
  }
}

export default function NarutoWheelSpokeRoute({ spokeId }: { spokeId: NarutoWheelSpokeId }) {
  const spoke = getNarutoWheelSpoke(spokeId)
  const url = narutoSpokeUrl(spoke.path)
  const schemas = [
    {
      "@context": "https://schema.org", "@type": "WebPage", "@id": `${url}#webpage`,
      url, name: spoke.pageTitle, description: spoke.description,
      dateModified: spoke.updatedAt,
      isPartOf: { "@type": "WebSite", name: "Spinifywheel", url: NARUTO_WHEEL_SITE_URL },
    },
    {
      "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`,
      headline: spoke.h1, description: spoke.description,
      author: { "@type": "Organization", name: "Spinifywheel" },
      dateModified: spoke.updatedAt,
    },
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
        { "@type": "ListItem", position: 1, name: "Home", item: `${NARUTO_WHEEL_SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Naruto Wheel", item: `${NARUTO_WHEEL_SITE_URL}/naruto-spin-wheel-picker` },
        { "@type": "ListItem", position: 3, name: spoke.h1, item: url },
      ],
    },
  ]
  return <>
    {schemas.map((schema, index) => <script key={index} type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <NarutoWheelApp
      deepLink={spoke.deepLink}
      shortTitle={spoke.shortTitle}
      toolSubtitle={spoke.heroIntro.slice(0, 120)}
      seoIntro={<NarutoWheelSpokeSeoIntro spoke={spoke} />}
      seoSections={<NarutoWheelSpokeSeoSections spoke={spoke} />}
    />
  </>
}
