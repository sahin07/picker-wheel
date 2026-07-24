import type { Metadata } from "next"
import HomeWheelApp from "@/components/home/home-wheel-app"
import {
  HomeSpokeSeoIntro,
  HomeSpokeSeoSections,
} from "@/components/home/home-spoke-seo"
import { HOME_PATH, HOME_SITE_URL, HOME_OG_IMAGE_URL } from "@/lib/home-seo"
import {
  getHomeNameSpoke,
  homeSpokeUrl,
  type HomeNameSpokeId,
} from "@/lib/home-name-picker-spokes"

export function homeSpokeMetadata(spokeId: HomeNameSpokeId): Metadata {
  const spoke = getHomeNameSpoke(spokeId)
  const url = homeSpokeUrl(spoke.path)

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
          url: HOME_OG_IMAGE_URL,
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
      images: [HOME_OG_IMAGE_URL],
    },
  }
}

function HomeSpokeJsonLd({ spokeId }: { spokeId: HomeNameSpokeId }) {
  const spoke = getHomeNameSpoke(spokeId)
  const url = homeSpokeUrl(spoke.path)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#home-spoke-faq`,
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
      url: HOME_SITE_URL,
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
        item: `${HOME_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Random Name Picker",
        item: `${HOME_SITE_URL}${HOME_PATH === "/" ? "/" : HOME_PATH}`,
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
      "@id": `${HOME_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: HOME_SITE_URL,
    },
    mainEntity: { "@id": `${url}#app` },
    hasPart: [{ "@id": `${url}#home-spoke-faq` }],
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

export default function HomeSpokeRoute({ spokeId }: { spokeId: HomeNameSpokeId }) {
  const spoke = getHomeNameSpoke(spokeId)

  return (
    <>
      <HomeSpokeJsonLd spokeId={spokeId} />
      <HomeWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={`Spin the ${spoke.h1} — replace sample names with your list`}
        seoIntro={<HomeSpokeSeoIntro spoke={spoke} />}
        seoSections={<HomeSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
