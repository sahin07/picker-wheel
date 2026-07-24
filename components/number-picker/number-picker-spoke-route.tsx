import type { Metadata } from "next"
import NumberPickerWheelApp from "@/components/number-picker/number-picker-wheel-app"
import {
  NumberPickerSpokeSeoIntro,
  NumberPickerSpokeSeoSections,
} from "@/components/number-picker/number-picker-spoke-seo"
import {
  NUMBER_PICKER_OG_IMAGE_URL,
  NUMBER_PICKER_SITE_URL,
} from "@/lib/number-picker-seo"
import {
  getNumberPickerSpoke,
  spokeUrl,
  type NumberPickerSpokeId,
} from "@/lib/number-picker-spokes"

export function numberPickerSpokeMetadata(spokeId: NumberPickerSpokeId): Metadata {
  const spoke = getNumberPickerSpoke(spokeId)
  const url = spokeUrl(spoke.path)

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
          url: NUMBER_PICKER_OG_IMAGE_URL,
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
      images: [NUMBER_PICKER_OG_IMAGE_URL],
    },
  }
}

function NumberPickerSpokeJsonLd({ spokeId }: { spokeId: NumberPickerSpokeId }) {
  const spoke = getNumberPickerSpoke(spokeId)
  const url = spokeUrl(spoke.path)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#np-spoke-faq`,
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
      url: NUMBER_PICKER_SITE_URL,
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
        item: `${NUMBER_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Random Number Picker Wheel",
        item: `${NUMBER_PICKER_SITE_URL}/number-picker-wheel`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: spoke.h1,
        item: url,
      },
    ],
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
      "@id": `${NUMBER_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: NUMBER_PICKER_SITE_URL,
    },
    mainEntity: { "@id": `${url}#app` },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}

export default function NumberPickerSpokeRoute({
  spokeId,
}: {
  spokeId: NumberPickerSpokeId
}) {
  const spoke = getNumberPickerSpoke(spokeId)

  return (
    <>
      <NumberPickerSpokeJsonLd spokeId={spokeId} />
      <NumberPickerWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={`Spin the ${spoke.h1} to pick a number`}
        seoIntro={<NumberPickerSpokeSeoIntro spoke={spoke} />}
        seoSections={<NumberPickerSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
