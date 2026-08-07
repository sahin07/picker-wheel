import type { Metadata } from "next"
import StateWheelApp from "@/components/state-wheel/state-wheel-app"
import StateWheelSeoSections, {
  StateWheelSeoIntro,
} from "@/components/state-wheel/state-wheel-seo-sections"
import {
  STATE_WHEEL_FAQ_ITEMS,
  STATE_WHEEL_H1,
  STATE_WHEEL_KEYWORDS,
  STATE_WHEEL_OG_IMAGE_URL,
  STATE_WHEEL_ON_THIS_PAGE,
  STATE_WHEEL_PAGE_DESCRIPTION,
  STATE_WHEEL_PAGE_TITLE,
  STATE_WHEEL_SHORT_TITLE,
  STATE_WHEEL_SITE_URL,
  STATE_WHEEL_URL,
} from "@/lib/state-wheel-seo"
import { getStateWheelSpoke } from "@/lib/state-wheel-spokes"

export const metadata: Metadata = {
  title: { absolute: STATE_WHEEL_PAGE_TITLE },
  description: STATE_WHEEL_PAGE_DESCRIPTION,
  keywords: [...STATE_WHEEL_KEYWORDS],
  alternates: { canonical: STATE_WHEEL_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: STATE_WHEEL_PAGE_TITLE,
    description: STATE_WHEEL_PAGE_DESCRIPTION,
    url: STATE_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: STATE_WHEEL_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: STATE_WHEEL_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: STATE_WHEEL_PAGE_TITLE,
    description: STATE_WHEEL_PAGE_DESCRIPTION,
    images: [STATE_WHEEL_OG_IMAGE_URL],
  },
}

function StateWheelJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${STATE_WHEEL_URL}#faq`,
    mainEntity: STATE_WHEEL_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${STATE_WHEEL_URL}#app`,
    name: STATE_WHEEL_H1,
    url: STATE_WHEEL_URL,
    description: STATE_WHEEL_PAGE_DESCRIPTION,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: STATE_WHEEL_SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: STATE_WHEEL_H1,
        item: STATE_WHEEL_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "On this page",
    itemListElement: STATE_WHEEL_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${STATE_WHEEL_URL}#${item.id}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tocSchema) }}
      />
    </>
  )
}

export default function StateWheelPage() {
  const hubDeepLink = getStateWheelSpoke("all").deepLink
  return (
    <>
      <StateWheelJsonLd />
      <StateWheelApp
        shortTitle={STATE_WHEEL_SHORT_TITLE}
        toolSubtitle="Pick a random state or province by wheel"
        deepLink={hubDeepLink}
        seoIntro={<StateWheelSeoIntro />}
        seoSections={<StateWheelSeoSections />}
      />
    </>
  )
}
