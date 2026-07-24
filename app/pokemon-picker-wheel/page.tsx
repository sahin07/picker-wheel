import type { Metadata } from "next"
import PokemonWheelApp from "@/components/pokemon-wheel/pokemon-wheel-app"
import PokemonWheelSeoSections, {
  PokemonWheelSeoIntro,
} from "@/components/pokemon-wheel/pokemon-wheel-seo-sections"
import {
  POKEMON_WHEEL_ARTICLE_TITLE,
  POKEMON_WHEEL_FAQ_ITEMS,
  POKEMON_WHEEL_H1,
  POKEMON_WHEEL_HERO_INTRO,
  POKEMON_WHEEL_KEYWORDS,
  POKEMON_WHEEL_OG_IMAGE_URL,
  POKEMON_WHEEL_ON_THIS_PAGE,
  POKEMON_WHEEL_PAGE_DESCRIPTION,
  POKEMON_WHEEL_PAGE_TITLE,
  POKEMON_WHEEL_SHORT_TITLE,
  POKEMON_WHEEL_SITE_URL,
  POKEMON_WHEEL_URL,
} from "@/lib/pokemon-wheel-seo"

export const metadata: Metadata = {
  title: {
    absolute: POKEMON_WHEEL_PAGE_TITLE,
  },
  description: POKEMON_WHEEL_PAGE_DESCRIPTION,
  keywords: [...POKEMON_WHEEL_KEYWORDS],
  alternates: {
    canonical: POKEMON_WHEEL_URL,
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
    title: POKEMON_WHEEL_PAGE_TITLE,
    description: POKEMON_WHEEL_PAGE_DESCRIPTION,
    url: POKEMON_WHEEL_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: POKEMON_WHEEL_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: POKEMON_WHEEL_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: POKEMON_WHEEL_PAGE_TITLE,
    description: POKEMON_WHEEL_PAGE_DESCRIPTION,
    images: [POKEMON_WHEEL_OG_IMAGE_URL],
  },
}

function PokemonWheelJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${POKEMON_WHEEL_URL}#pokemon-faq`,
    mainEntity: POKEMON_WHEEL_FAQ_ITEMS.map((item) => ({
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
    "@id": `${POKEMON_WHEEL_URL}#app`,
    name: "Pokémon Wheel",
    alternateName: [
      "Pokemon Wheel",
      "Pokemon Picker",
      "Pokemon Picker Wheel",
      "Random Pokemon Generator",
      "Pokemon Spinner",
      "Pokemon Randomizer",
      "Starter Pokemon Wheel",
    ],
    url: POKEMON_WHEEL_URL,
    description: POKEMON_WHEEL_PAGE_DESCRIPTION,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin a curated Pokémon catalog",
      "Generation and type templates",
      "Starter and legendary wheels",
      "Elimination mode",
      "Favorites and comparison",
      "Nuzlocke and draft icebreakers",
      "Mobile-friendly Pokémon spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${POKEMON_WHEEL_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${POKEMON_WHEEL_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pokémon Wheel",
        item: POKEMON_WHEEL_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${POKEMON_WHEEL_URL}#pokemon-toc`,
    name: "On this page — Pokémon Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: POKEMON_WHEEL_ON_THIS_PAGE.length,
    itemListElement: POKEMON_WHEEL_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${POKEMON_WHEEL_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${POKEMON_WHEEL_URL}#webpage`,
    url: POKEMON_WHEEL_URL,
    name: POKEMON_WHEEL_H1,
    headline: POKEMON_WHEEL_H1,
    description: POKEMON_WHEEL_HERO_INTRO,
    inLanguage: "en-US",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: POKEMON_WHEEL_OG_IMAGE_URL,
      width: 1200,
      height: 630,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${POKEMON_WHEEL_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: POKEMON_WHEEL_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Pokémon Wheel",
    },
    mainEntity: {
      "@id": `${POKEMON_WHEEL_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${POKEMON_WHEEL_URL}#article`,
        headline: POKEMON_WHEEL_ARTICLE_TITLE,
        description: POKEMON_WHEEL_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: POKEMON_WHEEL_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: POKEMON_WHEEL_SITE_URL,
        },
      },
      { "@id": `${POKEMON_WHEEL_URL}#pokemon-faq` },
      { "@id": `${POKEMON_WHEEL_URL}#pokemon-toc` },
    ],
    breadcrumb: {
      "@id": `${POKEMON_WHEEL_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: POKEMON_WHEEL_URL,
      name: "Spin the Pokémon Wheel",
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

export default function PokemonWheelPage() {
  return (
    <>
      <PokemonWheelJsonLd />
      <PokemonWheelApp
        shortTitle={POKEMON_WHEEL_SHORT_TITLE}
        toolSubtitle="Pick a random Pokémon by wheel"
        seoIntro={<PokemonWheelSeoIntro />}
        seoSections={<PokemonWheelSeoSections />}
      />
    </>
  )
}
