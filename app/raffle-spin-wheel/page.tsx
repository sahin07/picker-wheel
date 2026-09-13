import type { Metadata } from "next"
import RaffleSpinWheelApp from "@/components/raffle-spin-wheel/raffle-spin-wheel-app"
import RaffleSpinWheelSeoSections, {
  RaffleSpinWheelSeoIntro,
} from "@/components/raffle-spin-wheel/raffle-spin-wheel-seo-sections"
import {
  RAFFLE_SPIN_WHEEL_FAQ_ITEMS,
  RAFFLE_SPIN_WHEEL_H1,
  RAFFLE_SPIN_WHEEL_KEYWORDS,
  RAFFLE_SPIN_WHEEL_OG_IMAGE_URL,
  RAFFLE_SPIN_WHEEL_ON_THIS_PAGE,
  RAFFLE_SPIN_WHEEL_PAGE_DESCRIPTION,
  RAFFLE_SPIN_WHEEL_PAGE_TITLE,
  RAFFLE_SPIN_WHEEL_SHORT_TITLE,
  RAFFLE_SPIN_WHEEL_SITE_URL,
  RAFFLE_SPIN_WHEEL_URL,
} from "@/lib/raffle-spin-wheel-seo"

export const metadata: Metadata = {
  title: { absolute: RAFFLE_SPIN_WHEEL_PAGE_TITLE },
  description: RAFFLE_SPIN_WHEEL_PAGE_DESCRIPTION,
  keywords: [...RAFFLE_SPIN_WHEEL_KEYWORDS],
  alternates: { canonical: RAFFLE_SPIN_WHEEL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: RAFFLE_SPIN_WHEEL_PAGE_TITLE,
    description: RAFFLE_SPIN_WHEEL_PAGE_DESCRIPTION,
    url: RAFFLE_SPIN_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: RAFFLE_SPIN_WHEEL_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: RAFFLE_SPIN_WHEEL_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: RAFFLE_SPIN_WHEEL_PAGE_TITLE,
    description: RAFFLE_SPIN_WHEEL_PAGE_DESCRIPTION,
    images: [RAFFLE_SPIN_WHEEL_OG_IMAGE_URL],
  },
}

function RaffleSpinWheelJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${RAFFLE_SPIN_WHEEL_URL}#app`,
      name: RAFFLE_SPIN_WHEEL_H1,
      url: RAFFLE_SPIN_WHEEL_URL,
      description: RAFFLE_SPIN_WHEEL_PAGE_DESCRIPTION,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: RAFFLE_SPIN_WHEEL_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: RAFFLE_SPIN_WHEEL_SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: RAFFLE_SPIN_WHEEL_H1,
          item: RAFFLE_SPIN_WHEEL_URL,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "On this page",
      itemListElement: RAFFLE_SPIN_WHEEL_ON_THIS_PAGE.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `${RAFFLE_SPIN_WHEEL_URL}#${item.id}`,
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

export default function RaffleSpinWheelPage() {
  return (
    <>
      <RaffleSpinWheelJsonLd />
      <RaffleSpinWheelApp
        shortTitle={RAFFLE_SPIN_WHEEL_SHORT_TITLE}
        toolSubtitle="Serious random drawing for raffles, contests, and giveaways"
        seoIntro={<RaffleSpinWheelSeoIntro />}
        seoSections={<RaffleSpinWheelSeoSections />}
      />
    </>
  )
}
