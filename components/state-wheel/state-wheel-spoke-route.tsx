import type { Metadata } from "next"
import StateWheelApp from "@/components/state-wheel/state-wheel-app"
import {
  StateWheelSpokeSeoIntro,
  StateWheelSpokeSeoSections,
} from "@/components/state-wheel/state-wheel-spoke-seo"
import {
  STATE_WHEEL_OG_IMAGE_URL,
  STATE_WHEEL_PATH,
  STATE_WHEEL_SITE_URL,
} from "@/lib/state-wheel-seo"
import {
  stateSpokeUrl,
  getStateWheelSpoke,
  type StateWheelSpokeId,
} from "@/lib/state-wheel-spokes"

export function stateWheelSpokeMetadata(spokeId: StateWheelSpokeId): Metadata {
  const spoke = getStateWheelSpoke(spokeId)
  const url = stateSpokeUrl(spoke.path)

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
      siteName: "Spinifywheel",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: STATE_WHEEL_OG_IMAGE_URL,
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
      images: [STATE_WHEEL_OG_IMAGE_URL],
    },
  }
}

function StateWheelSpokeJsonLd({ spokeId }: { spokeId: StateWheelSpokeId }) {
  const spoke = getStateWheelSpoke(spokeId)
  const url = stateSpokeUrl(spoke.path)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#state-spoke-faq`,
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
    applicationCategory: "EntertainmentApplication",
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
      url: STATE_WHEEL_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Picker Wheel",
      url: STATE_WHEEL_SITE_URL,
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
        item: `${STATE_WHEEL_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "State Picker Wheel",
        item: `${STATE_WHEEL_SITE_URL}${STATE_WHEEL_PATH}`,
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
      url: STATE_WHEEL_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Picker Wheel",
      url: STATE_WHEEL_SITE_URL,
    },
    mainEntityOfPage: url,
    about: {
      "@type": "Thing",
      name: spoke.h1,
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
      "@id": `${STATE_WHEEL_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: STATE_WHEEL_SITE_URL,
    },
    mainEntity: { "@id": `${url}#app` },
    hasPart: [{ "@id": `${url}#article` }, { "@id": `${url}#state-spoke-faq` }],
    breadcrumb: { "@id": `${url}#breadcrumb` },
    potentialAction: {
      "@type": "UseAction",
      target: url,
      name: `Use ${spoke.h1}`,
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

export default function StateWheelSpokeRoute({
  spokeId,
}: {
  spokeId: StateWheelSpokeId
}) {
  const spoke = getStateWheelSpoke(spokeId)

  return (
    <>
      <StateWheelSpokeJsonLd spokeId={spokeId} />
      <StateWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={spoke.heroIntro.slice(0, 110)}
        seoIntro={<StateWheelSpokeSeoIntro spoke={spoke} />}
        seoSections={<StateWheelSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
