import type { Metadata } from "next"
import FortniteWheelApp from "@/components/fortnite-wheel/fortnite-wheel-app"
import {
  FortniteWheelSpokeSeoIntro,
  FortniteWheelSpokeSeoSections,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-seo"
import { FORTNITE_WHEEL_OG_IMAGE_URL, FORTNITE_WHEEL_PATH, FORTNITE_WHEEL_SITE_URL } from "@/lib/fortnite-wheel-seo"
import {
  fortniteSpokeUrl,
  getFortniteWheelSpoke,
  type FortniteWheelSpokeId,
} from "@/lib/fortnite-wheel-spokes"

export function fortniteWheelSpokeMetadata(spokeId: FortniteWheelSpokeId): Metadata {
  const spoke = getFortniteWheelSpoke(spokeId)
  const url = fortniteSpokeUrl(spoke.path)

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
          url: FORTNITE_WHEEL_OG_IMAGE_URL,
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
      images: [FORTNITE_WHEEL_OG_IMAGE_URL],
    },
  }
}

function FortniteWheelSpokeJsonLd({ spokeId }: { spokeId: FortniteWheelSpokeId }) {
  const spoke = getFortniteWheelSpoke(spokeId)
  const url = fortniteSpokeUrl(spoke.path)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#fortnite-spoke-faq`,
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
      url: FORTNITE_WHEEL_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Picker Wheel",
      url: FORTNITE_WHEEL_SITE_URL,
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
        item: `${FORTNITE_WHEEL_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Fortnite Picker Wheel",
        item: `${FORTNITE_WHEEL_SITE_URL}${FORTNITE_WHEEL_PATH}`,
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
      url: FORTNITE_WHEEL_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Picker Wheel",
      url: FORTNITE_WHEEL_SITE_URL,
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
      "@id": `${FORTNITE_WHEEL_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: FORTNITE_WHEEL_SITE_URL,
    },
    mainEntity: { "@id": `${url}#app` },
    hasPart: [{ "@id": `${url}#article` }, { "@id": `${url}#fortnite-spoke-faq` }],
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

export default function FortniteWheelSpokeRoute({
  spokeId,
}: {
  spokeId: FortniteWheelSpokeId
}) {
  const spoke = getFortniteWheelSpoke(spokeId)

  return (
    <>
      <FortniteWheelSpokeJsonLd spokeId={spokeId} />
      <FortniteWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={spoke.heroIntro.slice(0, 110)}
        seoIntro={<FortniteWheelSpokeSeoIntro spoke={spoke} />}
        seoSections={<FortniteWheelSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
