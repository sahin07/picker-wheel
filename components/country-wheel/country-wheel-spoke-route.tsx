import type { Metadata } from "next"
import CountryWheelApp from "@/components/country-wheel/country-wheel-app"
import {
  CountryWheelSpokeSeoIntro,
  CountryWheelSpokeSeoSections,
} from "@/components/country-wheel/country-wheel-spoke-seo"
import {
  COUNTRY_WHEEL_OG_IMAGE_URL,
  COUNTRY_WHEEL_PATH,
  COUNTRY_WHEEL_SITE_URL,
} from "@/lib/country-wheel-seo"
import {
  countrySpokeUrl,
  getCountryWheelSpoke,
  type CountryWheelSpokeId,
} from "@/lib/country-wheel-spokes"

export function countryWheelSpokeMetadata(spokeId: CountryWheelSpokeId): Metadata {
  const spoke = getCountryWheelSpoke(spokeId)
  const url = countrySpokeUrl(spoke.path)

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
          url: COUNTRY_WHEEL_OG_IMAGE_URL,
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
      images: [COUNTRY_WHEEL_OG_IMAGE_URL],
    },
  }
}

function CountryWheelSpokeJsonLd({ spokeId }: { spokeId: CountryWheelSpokeId }) {
  const spoke = getCountryWheelSpoke(spokeId)
  const url = countrySpokeUrl(spoke.path)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#country-spoke-faq`,
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
      url: COUNTRY_WHEEL_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Picker Wheel",
      url: COUNTRY_WHEEL_SITE_URL,
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
        item: `${COUNTRY_WHEEL_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Country Picker Wheel",
        item: `${COUNTRY_WHEEL_SITE_URL}${COUNTRY_WHEEL_PATH}`,
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
      url: COUNTRY_WHEEL_SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Picker Wheel",
      url: COUNTRY_WHEEL_SITE_URL,
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
      "@id": `${COUNTRY_WHEEL_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: COUNTRY_WHEEL_SITE_URL,
    },
    mainEntity: { "@id": `${url}#app` },
    hasPart: [{ "@id": `${url}#article` }, { "@id": `${url}#country-spoke-faq` }],
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

export default function CountryWheelSpokeRoute({
  spokeId,
}: {
  spokeId: CountryWheelSpokeId
}) {
  const spoke = getCountryWheelSpoke(spokeId)

  return (
    <>
      <CountryWheelSpokeJsonLd spokeId={spokeId} />
      <CountryWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={spoke.heroIntro.slice(0, 110)}
        seoIntro={<CountryWheelSpokeSeoIntro spoke={spoke} />}
        seoSections={<CountryWheelSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
