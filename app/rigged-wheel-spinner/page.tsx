import type { Metadata } from "next"
import WeightedWheelApp from "@/components/weighted-wheel/weighted-wheel-app"
import {
  RiggedWheelSeoIntro,
  RiggedWheelSeoSections,
} from "@/components/weighted-wheel/weighted-wheel-seo-sections"
import {
  RIGGED_DESCRIPTION,
  RIGGED_FAQ_ITEMS,
  RIGGED_H1,
  RIGGED_HERO_INTRO,
  RIGGED_HOWTO_STEPS,
  RIGGED_KEYWORDS,
  RIGGED_ON_THIS_PAGE,
  RIGGED_PAGE_TITLE,
  RIGGED_SHORT_TITLE,
  RIGGED_URL,
  WEIGHTED_WHEEL_OG_IMAGE_URL,
  WEIGHTED_WHEEL_PATH,
  WEIGHTED_WHEEL_SHORT_TITLE,
  WEIGHTED_WHEEL_SITE_URL,
} from "@/lib/weighted-wheel-seo"
import { getWeightedWheelSpoke } from "@/lib/weighted-wheel-spokes"

const spoke = getWeightedWheelSpoke("rigged")

export const metadata: Metadata = {
  title: { absolute: RIGGED_PAGE_TITLE },
  description: RIGGED_DESCRIPTION,
  keywords: [...RIGGED_KEYWORDS],
  alternates: { canonical: RIGGED_URL },
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
    title: RIGGED_PAGE_TITLE,
    description: RIGGED_DESCRIPTION,
    url: RIGGED_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [{ url: WEIGHTED_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: RIGGED_H1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: RIGGED_PAGE_TITLE,
    description: RIGGED_DESCRIPTION,
    images: [WEIGHTED_WHEEL_OG_IMAGE_URL],
  },
}

function RiggedWheelJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${RIGGED_URL}#app`,
      name: RIGGED_H1,
      url: RIGGED_URL,
      description: RIGGED_DESCRIPTION,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${RIGGED_URL}#software`,
      name: RIGGED_SHORT_TITLE,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web Browser",
      url: RIGGED_URL,
      description: RIGGED_DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${RIGGED_URL}#webpage`,
      url: RIGGED_URL,
      name: RIGGED_H1,
      headline: RIGGED_H1,
      description: RIGGED_HERO_INTRO,
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: "Spinifywheel",
        url: WEIGHTED_WHEEL_SITE_URL,
      },
      mainEntity: { "@id": `${RIGGED_URL}#app` },
      breadcrumb: { "@id": `${RIGGED_URL}#breadcrumb` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${RIGGED_URL}#faq`,
      mainEntity: RIGGED_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${RIGGED_URL}#howto`,
      name: "How to create a weighted wheel",
      description:
        "Assign custom weights, preview live percentages, and spin a rigged wheel spinner with transparent odds.",
      step: RIGGED_HOWTO_STEPS.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
        url: `${RIGGED_URL}#rigged-howto`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${RIGGED_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${WEIGHTED_WHEEL_SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: WEIGHTED_WHEEL_SHORT_TITLE,
          item: `${WEIGHTED_WHEEL_SITE_URL}${WEIGHTED_WHEEL_PATH}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: RIGGED_SHORT_TITLE,
          item: RIGGED_URL,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: spoke.articleTitle,
      description: RIGGED_HERO_INTRO,
      mainEntityOfPage: RIGGED_URL,
      author: { "@type": "Organization", name: "Spinifywheel" },
      publisher: { "@type": "Organization", name: "Spinifywheel" },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "On this page",
      itemListElement: RIGGED_ON_THIS_PAGE.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `${RIGGED_URL}#${item.id}`,
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

export default function RiggedWheelPage() {
  return (
    <>
      <RiggedWheelJsonLd />
      <WeightedWheelApp
        variant="rigged"
        shortTitle={RIGGED_SHORT_TITLE}
        toolSubtitle="Create a transparent wheel with custom probabilities"
        deepLink={spoke.deepLink}
        seoIntro={<RiggedWheelSeoIntro />}
        seoSections={<RiggedWheelSeoSections />}
      />
    </>
  )
}
