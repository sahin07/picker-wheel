import type { Metadata } from "next"
import JjkWheelApp from "@/components/jjk-wheel/jjk-wheel-app"
import { JjkWheelSpokeSeoIntro, JjkWheelSpokeSeoSections } from "@/components/jjk-wheel/jjk-wheel-spoke-seo"
import { JJK_WHEEL_OG_IMAGE_URL, JJK_WHEEL_SITE_URL } from "@/lib/jjk-wheel-seo"
import { getJjkWheelSpoke, jjkSpokeUrl, type JjkWheelSpokeId } from "@/lib/jjk-wheel-spokes"

export function jjkWheelSpokeMetadata(spokeId: JjkWheelSpokeId): Metadata {
  const spoke = getJjkWheelSpoke(spokeId)
  const url = jjkSpokeUrl(spoke.path)
  return {
    title: { absolute: spoke.pageTitle },
    description: spoke.description,
    keywords: [...spoke.keywords],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: spoke.pageTitle, description: spoke.description, url,
      siteName: "Spinifywheel", type: "website",
      images: [{ url: JJK_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }],
    },
    twitter: { card: "summary_large_image", title: spoke.pageTitle, description: spoke.description, images: [JJK_WHEEL_OG_IMAGE_URL] },
  }
}

export default function JjkWheelSpokeRoute({ spokeId }: { spokeId: JjkWheelSpokeId }) {
  const spoke = getJjkWheelSpoke(spokeId)
  const url = jjkSpokeUrl(spoke.path)
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
        { "@type": "ListItem", position: 1, name: "Home", item: `${JJK_WHEEL_SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "JJK Spin Wheel picker", item: `${JJK_WHEEL_SITE_URL}/jjk-spin-the-wheel` },
        { "@type": "ListItem", position: 3, name: spoke.h1, item: url },
      ],
    },
  ]
  return <>
    {schemas.map((schema, index) => <script key={index} type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <JjkWheelApp
      deepLink={spoke.deepLink}
      shortTitle={spoke.shortTitle}
      toolSubtitle={spoke.heroIntro.slice(0, 120)}
      seoIntro={<JjkWheelSpokeSeoIntro spoke={spoke} />}
      seoSections={<JjkWheelSpokeSeoSections spoke={spoke} />}
    />
  </>
}
