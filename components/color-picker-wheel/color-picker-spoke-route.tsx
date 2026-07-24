import type { Metadata } from "next"
import ColorPickerWheelApp from "@/components/color-picker-wheel/color-picker-wheel-app"
import {
  ColorPickerSpokeSeoIntro,
  ColorPickerSpokeSeoSections,
} from "@/components/color-picker-wheel/color-picker-spoke-seo"
import {
  COLOR_PICKER_OG_IMAGE_URL,
  COLOR_PICKER_PATH,
  COLOR_PICKER_SITE_URL,
} from "@/lib/color-picker-seo"
import {
  colorSpokeUrl,
  getColorPickerSpoke,
  type ColorPickerSpokeId,
} from "@/lib/color-picker-spokes"

export function colorPickerSpokeMetadata(spokeId: ColorPickerSpokeId): Metadata {
  const spoke = getColorPickerSpoke(spokeId)
  const url = colorSpokeUrl(spoke.path)

  return {
    title: { absolute: spoke.pageTitle },
    description: spoke.description,
    keywords: [...spoke.keywords],
    alternates: { canonical: url },
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
      title: spoke.pageTitle,
      description: spoke.description,
      url,
      siteName: "Picker Wheel",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: COLOR_PICKER_OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: spoke.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: spoke.pageTitle,
      description: spoke.description,
      images: [COLOR_PICKER_OG_IMAGE_URL],
    },
  }
}

function ColorPickerSpokeJsonLd({ spokeId }: { spokeId: ColorPickerSpokeId }) {
  const spoke = getColorPickerSpoke(spokeId)
  const url = colorSpokeUrl(spoke.path)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#cp-spoke-faq`,
    mainEntity: spoke.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#app`,
    name: spoke.h1,
    url,
    description: spoke.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Picker Wheel",
      url: COLOR_PICKER_SITE_URL,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${COLOR_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Color Picker Wheel",
        item: `${COLOR_PICKER_SITE_URL}${COLOR_PICKER_PATH}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: spoke.h1,
        item: url,
      },
    ],
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: spoke.articleTitle,
    description: spoke.heroIntro,
    inLanguage: "en-US",
    author: {
      "@type": "Organization",
      name: "Picker Wheel",
      url: COLOR_PICKER_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Picker Wheel",
      url: COLOR_PICKER_SITE_URL,
    },
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: spoke.h1,
    headline: spoke.h1,
    description: spoke.heroIntro,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${COLOR_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: COLOR_PICKER_SITE_URL,
    },
    mainEntity: { "@id": `${url}#app` },
    hasPart: [{ "@id": `${url}#article` }, { "@id": `${url}#cp-spoke-faq` }],
    breadcrumb: { "@id": `${url}#breadcrumb` },
    potentialAction: {
      "@type": "UseAction",
      target: url,
      name: `Spin the ${spoke.h1}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}

export default function ColorPickerSpokeRoute({
  spokeId,
}: {
  spokeId: ColorPickerSpokeId
}) {
  const spoke = getColorPickerSpoke(spokeId)

  return (
    <>
      <ColorPickerSpokeJsonLd spokeId={spokeId} />
      <ColorPickerWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={`Spin the ${spoke.h1} to choose a random color`}
        seoIntro={<ColorPickerSpokeSeoIntro spoke={spoke} />}
        seoSections={<ColorPickerSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
