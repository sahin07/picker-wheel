import type { Metadata } from "next"
import TeamPickerWheelApp from "@/components/team-picker/team-picker-wheel-app"
import TeamPickerSeoSections, {
  TeamPickerSeoIntro,
} from "@/components/team-picker/team-picker-seo-sections"
import {
  TEAM_PICKER_ARTICLE_TITLE,
  TEAM_PICKER_FAQ_ITEMS,
  TEAM_PICKER_H1,
  TEAM_PICKER_HERO_INTRO,
  TEAM_PICKER_KEYWORDS,
  TEAM_PICKER_ON_THIS_PAGE,
  TEAM_PICKER_PAGE_DESCRIPTION,
  TEAM_PICKER_PAGE_TITLE,
  TEAM_PICKER_SHORT_TITLE,
  TEAM_PICKER_SITE_URL,
  TEAM_PICKER_URL,
} from "@/lib/team-picker-seo"

export const metadata: Metadata = {
  title: {
    absolute: TEAM_PICKER_PAGE_TITLE,
  },
  description: TEAM_PICKER_PAGE_DESCRIPTION,
  keywords: [...TEAM_PICKER_KEYWORDS],
  alternates: {
    canonical: TEAM_PICKER_URL,
  },
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
    title: TEAM_PICKER_PAGE_TITLE,
    description: TEAM_PICKER_PAGE_DESCRIPTION,
    url: TEAM_PICKER_URL,
    siteName: "Picker Wheel",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TEAM_PICKER_PAGE_TITLE,
    description: TEAM_PICKER_PAGE_DESCRIPTION,
  },
}

function TeamPickerJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${TEAM_PICKER_URL}#tp-faq`,
    mainEntity: TEAM_PICKER_FAQ_ITEMS.map((item) => ({
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
    "@id": `${TEAM_PICKER_URL}#app`,
    name: "Team Picker Wheel",
    alternateName: [
      "Random Team Picker",
      "Team Generator",
      "Random Team Generator",
      "Team Randomizer",
      "Team Selection Wheel",
      "Random Group Generator",
    ],
    url: TEAM_PICKER_URL,
    description: TEAM_PICKER_PAGE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Create random teams online",
      "Split names into balanced groups",
      "Spin a team selection wheel",
      "Classroom and sports team picker",
      "Elimination mode",
      "Shuffle participants",
      "Customize team colors",
      "Save team wheels on device",
      "Mobile-friendly team generator",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${TEAM_PICKER_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${TEAM_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Team Picker Wheel",
        item: TEAM_PICKER_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${TEAM_PICKER_URL}#tp-toc`,
    name: "On this page — Team Picker Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: TEAM_PICKER_ON_THIS_PAGE.length,
    itemListElement: TEAM_PICKER_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${TEAM_PICKER_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${TEAM_PICKER_URL}#webpage`,
    url: TEAM_PICKER_URL,
    name: TEAM_PICKER_H1,
    headline: TEAM_PICKER_H1,
    description: TEAM_PICKER_HERO_INTRO,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${TEAM_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: TEAM_PICKER_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Team Picker Wheel",
    },
    mainEntity: {
      "@id": `${TEAM_PICKER_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${TEAM_PICKER_URL}#article`,
        headline: TEAM_PICKER_ARTICLE_TITLE,
        description: TEAM_PICKER_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: TEAM_PICKER_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: TEAM_PICKER_SITE_URL,
        },
      },
      { "@id": `${TEAM_PICKER_URL}#tp-faq` },
      { "@id": `${TEAM_PICKER_URL}#tp-toc` },
    ],
    breadcrumb: {
      "@id": `${TEAM_PICKER_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: TEAM_PICKER_URL,
      name: "Spin the Team Picker Wheel",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tocSchema) }}
      />
    </>
  )
}

export default function TeamPickerWheelPage() {
  return (
    <>
      <TeamPickerJsonLd />
      <TeamPickerWheelApp
        shortTitle={TEAM_PICKER_SHORT_TITLE}
        toolSubtitle="Split names into random teams — balance by size, gender, or label"
        seoIntro={<TeamPickerSeoIntro />}
        seoSections={<TeamPickerSeoSections />}
      />
    </>
  )
}
