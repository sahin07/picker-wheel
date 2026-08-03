import type { Metadata } from "next"
import ThemePickerWheelApp from "./theme-picker-wheel-app"
import {
  ThemePickerSpokeSeoIntro,
  ThemePickerSpokeSeoSections,
} from "./theme-picker-spoke-seo"
import {
  THEME_PICKER_OG_IMAGE_URL,
  THEME_PICKER_PATH,
  THEME_PICKER_SHORT_TITLE,
  THEME_PICKER_SITE_URL,
} from "@/lib/theme-picker-seo"
import {
  getThemePickerSpoke,
  themeSpokeUrl,
  type ThemePickerSpokeId,
} from "@/lib/theme-picker-spokes"

export function themePickerSpokeMetadata(spokeId: ThemePickerSpokeId): Metadata {
  const spoke = getThemePickerSpoke(spokeId)
  const url = themeSpokeUrl(spoke.path)
  return {
    title: { absolute: spoke.pageTitle },
    description: spoke.description,
    keywords: [...spoke.keywords],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: spoke.pageTitle,
      description: spoke.description,
      url,
      siteName: "Spinifywheel",
      locale: "en_US",
      type: "website",
      images: [{ url: THEME_PICKER_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: spoke.pageTitle,
      description: spoke.description,
      images: [THEME_PICKER_OG_IMAGE_URL],
    },
  }
}

export function ThemePickerSpokeJsonLd({ spokeId }: { spokeId: ThemePickerSpokeId }) {
  const spoke = getThemePickerSpoke(spokeId)
  const url = themeSpokeUrl(spoke.path)
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: spoke.h1,
      url,
      description: spoke.description,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      ...(spoke.updatedAt ? { dateModified: spoke.updatedAt } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: spoke.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${THEME_PICKER_SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: THEME_PICKER_SHORT_TITLE,
          item: `${THEME_PICKER_SITE_URL}${THEME_PICKER_PATH}`,
        },
        { "@type": "ListItem", position: 3, name: spoke.h1, item: url },
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

export default function ThemePickerSpokeRoute({
  spokeId,
}: {
  spokeId: ThemePickerSpokeId
}) {
  const spoke = getThemePickerSpoke(spokeId)
  return (
    <>
      <ThemePickerSpokeJsonLd spokeId={spokeId} />
      <ThemePickerWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle="Spin a random theme for parties, writing, drawing, and more"
        seoIntro={<ThemePickerSpokeSeoIntro spoke={spoke} />}
        seoSections={<ThemePickerSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
