import type { Metadata } from "next"
import NarutoWheelApp from "@/components/naruto-wheel/naruto-wheel-app"
import NarutoWheelSeoSections, { NarutoWheelSeoIntro } from "@/components/naruto-wheel/naruto-wheel-seo-sections"
import {
  NARUTO_WHEEL_FAQ_ITEMS,
  NARUTO_WHEEL_H1,
  NARUTO_WHEEL_KEYWORDS,
  NARUTO_WHEEL_OG_IMAGE_URL,
  NARUTO_WHEEL_ON_THIS_PAGE,
  NARUTO_WHEEL_PAGE_DESCRIPTION,
  NARUTO_WHEEL_PAGE_TITLE,
  NARUTO_WHEEL_SHORT_TITLE,
  NARUTO_WHEEL_SITE_URL,
  NARUTO_WHEEL_URL,
} from "@/lib/naruto-wheel-seo"
import { getNarutoWheelSpoke } from "@/lib/naruto-wheel-spokes"

export const metadata: Metadata = {
  title: { absolute: NARUTO_WHEEL_PAGE_TITLE },
  description: NARUTO_WHEEL_PAGE_DESCRIPTION,
  keywords: [...NARUTO_WHEEL_KEYWORDS],
  alternates: { canonical: NARUTO_WHEEL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: NARUTO_WHEEL_PAGE_TITLE,
    description: NARUTO_WHEEL_PAGE_DESCRIPTION,
    url: NARUTO_WHEEL_URL,
    siteName: "Spinifywheel",
    type: "website",
    images: [{ url: NARUTO_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: NARUTO_WHEEL_H1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: NARUTO_WHEEL_PAGE_TITLE,
    description: NARUTO_WHEEL_PAGE_DESCRIPTION,
    images: [NARUTO_WHEEL_OG_IMAGE_URL],
  },
}

function NarutoJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${NARUTO_WHEEL_URL}#webpage`,
      url: NARUTO_WHEEL_URL,
      name: NARUTO_WHEEL_PAGE_TITLE,
      description: NARUTO_WHEEL_PAGE_DESCRIPTION,
      isPartOf: { "@type": "WebSite", name: "Spinifywheel", url: NARUTO_WHEEL_SITE_URL },
      primaryImageOfPage: { "@type": "ImageObject", url: NARUTO_WHEEL_OG_IMAGE_URL },
      hasPart: {
        "@type": "Article",
        "@id": `${NARUTO_WHEEL_URL}#article`,
        headline: NARUTO_WHEEL_H1,
        description: NARUTO_WHEEL_PAGE_DESCRIPTION,
        author: { "@type": "Organization", name: "Spinifywheel" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${NARUTO_WHEEL_URL}#app`,
      name: NARUTO_WHEEL_H1,
      alternateName: ["Naruto Wheel Spin", "Naruto Character Wheel", "Random Naruto Character"],
      url: NARUTO_WHEEL_URL,
      description: NARUTO_WHEEL_PAGE_DESCRIPTION,
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Equal-odds Naruto character spins",
        "Akatsuki, Hokage, Uchiha, and jutsu templates",
        "Elimination and keep-selected",
        "Team generator, fight votes, and Who Are You",
        "Achievements, analytics, and games",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${NARUTO_WHEEL_URL}#faq`,
      mainEntity: NARUTO_WHEEL_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: NARUTO_WHEEL_SITE_URL },
        { "@type": "ListItem", position: 2, name: NARUTO_WHEEL_H1, item: NARUTO_WHEEL_URL },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${NARUTO_WHEEL_URL}#toc`,
      name: "On this page",
      itemListElement: NARUTO_WHEEL_ON_THIS_PAGE.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `${NARUTO_WHEEL_URL}#${item.id}`,
      })),
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

export default function NarutoWheelPage() {
  return (
    <>
      <NarutoJsonLd />
      <NarutoWheelApp
        deepLink={getNarutoWheelSpoke("pillar").deepLink}
        shortTitle={NARUTO_WHEEL_SHORT_TITLE}
        toolSubtitle="Pick a random Naruto character with equal odds"
        seoIntro={<NarutoWheelSeoIntro />}
        seoSections={<NarutoWheelSeoSections />}
      />
    </>
  )
}
