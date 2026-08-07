import type { Metadata } from "next"
import ThemePickerWheelApp from "@/components/theme-picker/theme-picker-wheel-app"
import ThemePickerSeoSections, {
  ThemePickerSeoIntro,
} from "@/components/theme-picker/theme-picker-seo-sections"
import {
  THEME_PICKER_FAQ_ITEMS,
  THEME_PICKER_H1,
  THEME_PICKER_HERO_INTRO,
  THEME_PICKER_KEYWORDS,
  THEME_PICKER_OG_IMAGE_URL,
  THEME_PICKER_ON_THIS_PAGE,
  THEME_PICKER_PAGE_DESCRIPTION,
  THEME_PICKER_PAGE_TITLE,
  THEME_PICKER_SHORT_TITLE,
  THEME_PICKER_SITE_URL,
  THEME_PICKER_UPDATED_AT,
  THEME_PICKER_URL,
} from "@/lib/theme-picker-seo"
import { getThemePickerSpoke } from "@/lib/theme-picker-spokes"

export const metadata: Metadata = {
  title: { absolute: THEME_PICKER_PAGE_TITLE },
  description: THEME_PICKER_PAGE_DESCRIPTION,
  keywords: [...THEME_PICKER_KEYWORDS],
  alternates: { canonical: THEME_PICKER_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: THEME_PICKER_PAGE_TITLE,
    description: THEME_PICKER_PAGE_DESCRIPTION,
    url: THEME_PICKER_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [{ url: THEME_PICKER_OG_IMAGE_URL, width: 1200, height: 630, alt: THEME_PICKER_H1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: THEME_PICKER_PAGE_TITLE,
    description: THEME_PICKER_PAGE_DESCRIPTION,
    images: [THEME_PICKER_OG_IMAGE_URL],
  },
}

function ThemePickerJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${THEME_PICKER_URL}#app`,
      name: THEME_PICKER_H1,
      url: THEME_PICKER_URL,
      description: THEME_PICKER_PAGE_DESCRIPTION,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      dateModified: THEME_PICKER_UPDATED_AT,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${THEME_PICKER_URL}#webpage`,
      url: THEME_PICKER_URL,
      name: THEME_PICKER_H1,
      headline: THEME_PICKER_H1,
      description: THEME_PICKER_HERO_INTRO,
      inLanguage: "en-US",
      dateModified: THEME_PICKER_UPDATED_AT,
      mainEntity: { "@id": `${THEME_PICKER_URL}#app` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: THEME_PICKER_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${THEME_PICKER_URL}#theme-toc`,
      name: "On this page — Theme Picker Wheel",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: THEME_PICKER_ON_THIS_PAGE.length,
      itemListElement: THEME_PICKER_ON_THIS_PAGE.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `${THEME_PICKER_URL}#${item.id}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: THEME_PICKER_SITE_URL },
        { "@type": "ListItem", position: 2, name: THEME_PICKER_SHORT_TITLE, item: THEME_PICKER_URL },
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

export default function ThemePickerWheelPage() {
  const pillar = getThemePickerSpoke("pillar")
  return (
    <>
      <ThemePickerJsonLd />
      <ThemePickerWheelApp
        deepLink={pillar.deepLink}
        shortTitle={THEME_PICKER_SHORT_TITLE}
        toolSubtitle="Spin a random theme for parties, writing, drawing, and more"
        seoIntro={<ThemePickerSeoIntro />}
        seoSections={<ThemePickerSeoSections />}
      />
    </>
  )
}
