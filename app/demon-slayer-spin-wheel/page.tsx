import type { Metadata } from "next"
import DemonSlayerWheelApp from "@/components/demon-slayer-wheel/demon-slayer-wheel-app"
import DemonSlayerWheelSeoSections, {
  DemonSlayerWheelSeoIntro,
} from "@/components/demon-slayer-wheel/demon-slayer-wheel-seo-sections"
import {
  DEMON_SLAYER_WHEEL_FAQ_ITEMS,
  DEMON_SLAYER_WHEEL_H1,
  DEMON_SLAYER_WHEEL_KEYWORDS,
  DEMON_SLAYER_WHEEL_OG_IMAGE_URL,
  DEMON_SLAYER_WHEEL_ON_THIS_PAGE,
  DEMON_SLAYER_WHEEL_PAGE_DESCRIPTION,
  DEMON_SLAYER_WHEEL_PAGE_TITLE,
  DEMON_SLAYER_WHEEL_SHORT_TITLE,
  DEMON_SLAYER_WHEEL_SITE_URL,
  DEMON_SLAYER_WHEEL_URL,
} from "@/lib/demon-slayer-wheel-seo"
import { getDemonSlayerWheelSpoke } from "@/lib/demon-slayer-wheel-spokes"

export const metadata: Metadata = {
  title: { absolute: DEMON_SLAYER_WHEEL_PAGE_TITLE },
  description: DEMON_SLAYER_WHEEL_PAGE_DESCRIPTION,
  keywords: [...DEMON_SLAYER_WHEEL_KEYWORDS],
  alternates: { canonical: DEMON_SLAYER_WHEEL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: DEMON_SLAYER_WHEEL_PAGE_TITLE,
    description: DEMON_SLAYER_WHEEL_PAGE_DESCRIPTION,
    url: DEMON_SLAYER_WHEEL_URL,
    siteName: "Spinifywheel",
    type: "website",
    images: [
      {
        url: DEMON_SLAYER_WHEEL_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: DEMON_SLAYER_WHEEL_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEMON_SLAYER_WHEEL_PAGE_TITLE,
    description: DEMON_SLAYER_WHEEL_PAGE_DESCRIPTION,
    images: [DEMON_SLAYER_WHEEL_OG_IMAGE_URL],
  },
}

function DemonSlayerJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${DEMON_SLAYER_WHEEL_URL}#webpage`,
      url: DEMON_SLAYER_WHEEL_URL,
      name: DEMON_SLAYER_WHEEL_PAGE_TITLE,
      description: DEMON_SLAYER_WHEEL_PAGE_DESCRIPTION,
      isPartOf: { "@type": "WebSite", name: "Picker Wheel", url: DEMON_SLAYER_WHEEL_SITE_URL },
      primaryImageOfPage: { "@type": "ImageObject", url: DEMON_SLAYER_WHEEL_OG_IMAGE_URL },
      hasPart: {
        "@type": "Article",
        "@id": `${DEMON_SLAYER_WHEEL_URL}#article`,
        headline: DEMON_SLAYER_WHEEL_H1,
        description: DEMON_SLAYER_WHEEL_PAGE_DESCRIPTION,
        author: { "@type": "Organization", name: "Picker Wheel" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${DEMON_SLAYER_WHEEL_URL}#app`,
      name: DEMON_SLAYER_WHEEL_H1,
      alternateName: ["Demon Slayer Wheel", "Kimetsu no Yaiba Wheel", "Demon Slayer Spinner"],
      url: DEMON_SLAYER_WHEEL_URL,
      description: DEMON_SLAYER_WHEEL_PAGE_DESCRIPTION,
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Equal-odds Demon Slayer character spins",
        "Category templates",
        "Elimination mode",
        "Custom entries and images",
        "Achievements, analytics, and games",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${DEMON_SLAYER_WHEEL_URL}#faq`,
      mainEntity: DEMON_SLAYER_WHEEL_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: DEMON_SLAYER_WHEEL_SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: DEMON_SLAYER_WHEEL_H1,
          item: DEMON_SLAYER_WHEEL_URL,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${DEMON_SLAYER_WHEEL_URL}#toc`,
      name: "On this page",
      itemListElement: DEMON_SLAYER_WHEEL_ON_THIS_PAGE.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `${DEMON_SLAYER_WHEEL_URL}#${item.id}`,
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

export default function DemonSlayerSpinWheelPage() {
  return (
    <>
      <DemonSlayerJsonLd />
      <DemonSlayerWheelApp
        deepLink={getDemonSlayerWheelSpoke("pillar").deepLink}
        shortTitle={DEMON_SLAYER_WHEEL_SHORT_TITLE}
        toolSubtitle="Pick a random Demon Slayer character with equal odds"
        seoIntro={<DemonSlayerWheelSeoIntro />}
        seoSections={<DemonSlayerWheelSeoSections />}
      />
    </>
  )
}
