import type { Metadata } from "next"
import YesNoPickerWheelApp from "@/components/yes-no-picker-wheel/yes-no-picker-wheel-app"
import {
  YesNoPickerSpokeSeoIntro,
  YesNoPickerSpokeSeoSections,
} from "@/components/yes-no-picker-wheel/yes-no-picker-spoke-seo"
import {
  YES_NO_PICKER_OG_IMAGE_URL,
  YES_NO_PICKER_PATH,
  YES_NO_PICKER_SITE_URL,
} from "@/lib/yes-no-picker-seo"
import {
  getYesNoPickerSpoke,
  yesNoSpokeUrl,
  type YesNoPickerSpokeId,
} from "@/lib/yes-no-picker-spokes"

export function yesNoPickerSpokeMetadata(spokeId: YesNoPickerSpokeId): Metadata {
  const spoke = getYesNoPickerSpoke(spokeId)
  const url = yesNoSpokeUrl(spoke.path)

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
          url: YES_NO_PICKER_OG_IMAGE_URL,
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
      images: [YES_NO_PICKER_OG_IMAGE_URL],
    },
  }
}

function YesNoPickerSpokeJsonLd({ spokeId }: { spokeId: YesNoPickerSpokeId }) {
  const spoke = getYesNoPickerSpoke(spokeId)
  const url = yesNoSpokeUrl(spoke.path)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#yn-spoke-faq`,
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
      url: YES_NO_PICKER_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Picker Wheel",
      url: YES_NO_PICKER_SITE_URL,
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
        item: `${YES_NO_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Yes or No Wheel",
        item: `${YES_NO_PICKER_SITE_URL}${YES_NO_PICKER_PATH}`,
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
      url: YES_NO_PICKER_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Picker Wheel",
      url: YES_NO_PICKER_SITE_URL,
    },
    mainEntityOfPage: url,
    about: {
      "@type": "Thing",
      name: spoke.h1,
      description: spoke.eeat.expertise,
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
      "@id": `${YES_NO_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: YES_NO_PICKER_SITE_URL,
    },
    mainEntity: { "@id": `${url}#app` },
    hasPart: [{ "@id": `${url}#article` }, { "@id": `${url}#yn-spoke-faq` }],
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

export default function YesNoPickerSpokeRoute({
  spokeId,
}: {
  spokeId: YesNoPickerSpokeId
}) {
  const spoke = getYesNoPickerSpoke(spokeId)

  return (
    <>
      <YesNoPickerSpokeJsonLd spokeId={spokeId} />
      <YesNoPickerWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={`Spin the ${spoke.h1} to make a decision`}
        seoIntro={<YesNoPickerSpokeSeoIntro spoke={spoke} />}
        seoSections={<YesNoPickerSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
