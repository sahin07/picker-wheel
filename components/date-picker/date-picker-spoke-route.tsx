import type { Metadata } from "next"
import DatePickerWheelApp from "@/components/date-picker/date-picker-wheel-app"
import {
  DatePickerSpokeSeoIntro,
  DatePickerSpokeSeoSections,
} from "@/components/date-picker/date-picker-spoke-seo"
import { DATE_PICKER_PATH, DATE_PICKER_SITE_URL } from "@/lib/date-picker-seo"
import {
  dateSpokeUrl,
  getDatePickerSpoke,
  type DatePickerSpokeId,
} from "@/lib/date-picker-spokes"

export function datePickerSpokeMetadata(spokeId: DatePickerSpokeId): Metadata {
  const spoke = getDatePickerSpoke(spokeId)
  const url = dateSpokeUrl(spoke.path)

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
    },
    twitter: {
      card: "summary_large_image",
      title: spoke.pageTitle,
      description: spoke.description,
    },
  }
}

function DatePickerSpokeJsonLd({ spokeId }: { spokeId: DatePickerSpokeId }) {
  const spoke = getDatePickerSpoke(spokeId)
  const url = dateSpokeUrl(spoke.path)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#dp-spoke-faq`,
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
      url: DATE_PICKER_SITE_URL,
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
        item: `${DATE_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Date Picker Wheel",
        item: `${DATE_PICKER_SITE_URL}${DATE_PICKER_PATH}`,
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
      "@id": `${DATE_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: DATE_PICKER_SITE_URL,
    },
    mainEntity: { "@id": `${url}#app` },
    hasPart: [{ "@id": `${url}#dp-spoke-faq` }],
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

export default function DatePickerSpokeRoute({
  spokeId,
}: {
  spokeId: DatePickerSpokeId
}) {
  const spoke = getDatePickerSpoke(spokeId)

  return (
    <>
      <DatePickerSpokeJsonLd spokeId={spokeId} />
      <DatePickerWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={`Spin the ${spoke.h1} to choose a random date`}
        seoIntro={<DatePickerSpokeSeoIntro spoke={spoke} />}
        seoSections={<DatePickerSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
