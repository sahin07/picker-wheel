import type { Metadata } from "next"
import CountryWheelApp from "@/components/country-wheel/country-wheel-app"
import CountryWheelSeoSections, {
  CountryWheelSeoIntro,
} from "@/components/country-wheel/country-wheel-seo-sections"
import {
  COUNTRY_WHEEL_FAQ_ITEMS,
  COUNTRY_WHEEL_H1,
  COUNTRY_WHEEL_HERO_INTRO,
  COUNTRY_WHEEL_KEYWORDS,
  COUNTRY_WHEEL_OG_IMAGE_URL,
  COUNTRY_WHEEL_ON_THIS_PAGE,
  COUNTRY_WHEEL_PAGE_DESCRIPTION,
  COUNTRY_WHEEL_PAGE_TITLE,
  COUNTRY_WHEEL_SHORT_TITLE,
  COUNTRY_WHEEL_SITE_URL,
  COUNTRY_WHEEL_URL,
} from "@/lib/country-wheel-seo"
import { getCountryWheelSpoke } from "@/lib/country-wheel-spokes"

export const metadata: Metadata = {
  title: { absolute: COUNTRY_WHEEL_PAGE_TITLE },
  description: COUNTRY_WHEEL_PAGE_DESCRIPTION,
  keywords: [...COUNTRY_WHEEL_KEYWORDS],
  alternates: { canonical: COUNTRY_WHEEL_URL },
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
    title: COUNTRY_WHEEL_PAGE_TITLE,
    description: COUNTRY_WHEEL_PAGE_DESCRIPTION,
    url: COUNTRY_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: COUNTRY_WHEEL_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: COUNTRY_WHEEL_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: COUNTRY_WHEEL_PAGE_TITLE,
    description: COUNTRY_WHEEL_PAGE_DESCRIPTION,
    images: [COUNTRY_WHEEL_OG_IMAGE_URL],
  },
}

function CountryWheelJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${COUNTRY_WHEEL_URL}#faq`,
    mainEntity: COUNTRY_WHEEL_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${COUNTRY_WHEEL_URL}#app`,
    name: COUNTRY_WHEEL_H1,
    url: COUNTRY_WHEEL_URL,
    description: COUNTRY_WHEEL_PAGE_DESCRIPTION,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isPartOf: {
      "@type": "WebSite",
      name: "Picker Wheel",
      url: COUNTRY_WHEEL_SITE_URL,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        name: COUNTRY_WHEEL_SHORT_TITLE,
        item: COUNTRY_WHEEL_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${COUNTRY_WHEEL_URL}#toc`,
    name: "On this page",
    itemListElement: COUNTRY_WHEEL_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${COUNTRY_WHEEL_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": COUNTRY_WHEEL_URL,
    url: COUNTRY_WHEEL_URL,
    name: COUNTRY_WHEEL_PAGE_TITLE,
    description: COUNTRY_WHEEL_PAGE_DESCRIPTION,
    isPartOf: { "@type": "WebSite", url: COUNTRY_WHEEL_SITE_URL },
    primaryImageOfPage: COUNTRY_WHEEL_OG_IMAGE_URL,
    about: COUNTRY_WHEEL_HERO_INTRO,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tocSchema) }}
      />
    </>
  )
}

export default function CountryPickerWheelPage() {
  const hubDeepLink = getCountryWheelSpoke("all").deepLink
  return (
    <>
      <CountryWheelJsonLd />
      <CountryWheelApp
        shortTitle={COUNTRY_WHEEL_SHORT_TITLE}
        toolSubtitle="Spin a customizable country wheel for geography, travel, and quizzes"
        deepLink={hubDeepLink}
        seoIntro={<CountryWheelSeoIntro />}
        seoSections={<CountryWheelSeoSections />}
      />
    </>
  )
}
