import type { Metadata } from "next"
import DtiWheelApp from "@/components/dti-wheel/dti-wheel-app"
import DtiWheelSeoSections, {
  DtiWheelSeoIntro,
} from "@/components/dti-wheel/dti-wheel-seo-sections"
import {
  DTI_WHEEL_FAQ_ITEMS,
  DTI_WHEEL_H1,
  DTI_WHEEL_HERO_INTRO,
  DTI_WHEEL_KEYWORDS,
  DTI_WHEEL_OG_IMAGE_URL,
  DTI_WHEEL_ON_THIS_PAGE,
  DTI_WHEEL_PAGE_DESCRIPTION,
  DTI_WHEEL_PAGE_TITLE,
  DTI_WHEEL_SHORT_TITLE,
  DTI_WHEEL_SITE_URL,
  DTI_WHEEL_UPDATED_AT,
  DTI_WHEEL_URL,
} from "@/lib/dti-wheel-seo"
import { getDtiWheelSpoke } from "@/lib/dti-wheel-spokes"

export const metadata: Metadata = {
  title: { absolute: DTI_WHEEL_PAGE_TITLE },
  description: DTI_WHEEL_PAGE_DESCRIPTION,
  keywords: [...DTI_WHEEL_KEYWORDS],
  alternates: { canonical: DTI_WHEEL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: DTI_WHEEL_PAGE_TITLE,
    description: DTI_WHEEL_PAGE_DESCRIPTION,
    url: DTI_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [{ url: DTI_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: DTI_WHEEL_H1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: DTI_WHEEL_PAGE_TITLE,
    description: DTI_WHEEL_PAGE_DESCRIPTION,
    images: [DTI_WHEEL_OG_IMAGE_URL],
  },
}

function DtiWheelJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${DTI_WHEEL_URL}#app`,
      name: DTI_WHEEL_H1,
      url: DTI_WHEEL_URL,
      description: DTI_WHEEL_PAGE_DESCRIPTION,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      dateModified: DTI_WHEEL_UPDATED_AT,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${DTI_WHEEL_URL}#webpage`,
      url: DTI_WHEEL_URL,
      name: DTI_WHEEL_H1,
      headline: DTI_WHEEL_H1,
      description: DTI_WHEEL_HERO_INTRO,
      inLanguage: "en-US",
      dateModified: DTI_WHEEL_UPDATED_AT,
      mainEntity: { "@id": `${DTI_WHEEL_URL}#app` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: DTI_WHEEL_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${DTI_WHEEL_URL}#dti-toc`,
      name: "On this page — DTI Wheel Outfit Picker",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: DTI_WHEEL_ON_THIS_PAGE.length,
      itemListElement: DTI_WHEEL_ON_THIS_PAGE.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `${DTI_WHEEL_URL}#${item.id}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: DTI_WHEEL_SITE_URL },
        { "@type": "ListItem", position: 2, name: DTI_WHEEL_SHORT_TITLE, item: DTI_WHEEL_URL },
      ],
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

export default function DtiWheelOutfitPickerPage() {
  const pillar = getDtiWheelSpoke("pillar")
  return (
    <>
      <DtiWheelJsonLd />
      <DtiWheelApp
        deepLink={pillar.deepLink}
        shortTitle={DTI_WHEEL_SHORT_TITLE}
        toolSubtitle="Spin random Dress to Impress outfit themes"
        seoIntro={<DtiWheelSeoIntro />}
        seoSections={<DtiWheelSeoSections />}
      />
    </>
  )
}
