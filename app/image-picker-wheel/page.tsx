import type { Metadata } from "next"
import ImagePickerWheelApp from "@/components/image-picker/image-picker-wheel-app"
import ImagePickerSeoSections, {
  ImagePickerSeoIntro,
} from "@/components/image-picker/image-picker-seo-sections"
import {
  IMAGE_PICKER_ARTICLE_TITLE,
  IMAGE_PICKER_FAQ_ITEMS,
  IMAGE_PICKER_H1,
  IMAGE_PICKER_HERO_INTRO,
  IMAGE_PICKER_KEYWORDS,
  IMAGE_PICKER_OG_IMAGE_URL,
  IMAGE_PICKER_ON_THIS_PAGE,
  IMAGE_PICKER_PAGE_DESCRIPTION,
  IMAGE_PICKER_PAGE_TITLE,
  IMAGE_PICKER_SITE_URL,
  IMAGE_PICKER_URL,
} from "@/lib/image-picker-seo"

export const metadata: Metadata = {
  title: {
    absolute: IMAGE_PICKER_PAGE_TITLE,
  },
  description: IMAGE_PICKER_PAGE_DESCRIPTION,
  keywords: [...IMAGE_PICKER_KEYWORDS],
  alternates: {
    canonical: IMAGE_PICKER_URL,
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
    title: IMAGE_PICKER_PAGE_TITLE,
    description: IMAGE_PICKER_PAGE_DESCRIPTION,
    url: IMAGE_PICKER_URL,
    siteName: "Picker Wheel",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: IMAGE_PICKER_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: IMAGE_PICKER_H1,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: IMAGE_PICKER_PAGE_TITLE,
    description: IMAGE_PICKER_PAGE_DESCRIPTION,
    images: [IMAGE_PICKER_OG_IMAGE_URL],
  },
}

function ImagePickerJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${IMAGE_PICKER_URL}#ip-faq`,
    mainEntity: IMAGE_PICKER_FAQ_ITEMS.map((item) => ({
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
    "@id": `${IMAGE_PICKER_URL}#app`,
    name: "Image Picker Wheel",
    alternateName: [
      "Random Image Picker",
      "Image Spinner",
      "Picture Picker Wheel",
      "Random Image Wheel",
      "Photo Picker Wheel",
      "Image Randomizer",
    ],
    url: IMAGE_PICKER_URL,
    description: IMAGE_PICKER_PAGE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Spin a random image wheel online",
      "Upload photos, icons, logos, and stickers",
      "Customize labels, colors, and image size",
      "Shuffle, save, and share image wheels",
      "Fair visual selection for games and classrooms",
      "Fullscreen wheel mode",
      "Mobile-friendly image spinner",
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${IMAGE_PICKER_URL}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${IMAGE_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Image Picker Wheel",
        item: IMAGE_PICKER_URL,
      },
    ],
  }

  const tocSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${IMAGE_PICKER_URL}#ip-toc`,
    name: "On this page — Image Picker Wheel",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: IMAGE_PICKER_ON_THIS_PAGE.length,
    itemListElement: IMAGE_PICKER_ON_THIS_PAGE.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${IMAGE_PICKER_URL}#${item.id}`,
    })),
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${IMAGE_PICKER_URL}#webpage`,
    url: IMAGE_PICKER_URL,
    name: IMAGE_PICKER_H1,
    headline: IMAGE_PICKER_H1,
    description: IMAGE_PICKER_HERO_INTRO,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${IMAGE_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: IMAGE_PICKER_SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Image Picker Wheel",
    },
    mainEntity: {
      "@id": `${IMAGE_PICKER_URL}#app`,
    },
    hasPart: [
      {
        "@type": "Article",
        "@id": `${IMAGE_PICKER_URL}#article`,
        headline: IMAGE_PICKER_ARTICLE_TITLE,
        description: IMAGE_PICKER_HERO_INTRO,
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: IMAGE_PICKER_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Picker Wheel",
          url: IMAGE_PICKER_SITE_URL,
        },
      },
      { "@id": `${IMAGE_PICKER_URL}#ip-faq` },
      { "@id": `${IMAGE_PICKER_URL}#ip-toc` },
    ],
    breadcrumb: {
      "@id": `${IMAGE_PICKER_URL}#breadcrumb`,
    },
    potentialAction: {
      "@type": "UseAction",
      target: IMAGE_PICKER_URL,
      name: "Spin the Image Picker Wheel",
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

export default function ImagePickerWheelPage() {
  return (
    <>
      <ImagePickerJsonLd />
      <ImagePickerWheelApp
        seoIntro={<ImagePickerSeoIntro />}
        seoSections={<ImagePickerSeoSections />}
      />
    </>
  )
}
