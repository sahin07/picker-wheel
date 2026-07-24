import type { Metadata } from "next"
import ImagePickerWheelApp from "@/components/image-picker/image-picker-wheel-app"
import {
  ImagePickerSpokeSeoIntro,
  ImagePickerSpokeSeoSections,
} from "@/components/image-picker/image-picker-spoke-seo"
import {
  IMAGE_PICKER_OG_IMAGE_URL,
  IMAGE_PICKER_PATH,
  IMAGE_PICKER_SITE_URL,
} from "@/lib/image-picker-seo"
import {
  getImagePickerSpoke,
  imageSpokeUrl,
  type ImagePickerSpokeId,
} from "@/lib/image-picker-spokes"

export function imagePickerSpokeMetadata(spokeId: ImagePickerSpokeId): Metadata {
  const spoke = getImagePickerSpoke(spokeId)
  const url = imageSpokeUrl(spoke.path)

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
          url: IMAGE_PICKER_OG_IMAGE_URL,
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
      images: [IMAGE_PICKER_OG_IMAGE_URL],
    },
  }
}

function ImagePickerSpokeJsonLd({ spokeId }: { spokeId: ImagePickerSpokeId }) {
  const spoke = getImagePickerSpoke(spokeId)
  const url = imageSpokeUrl(spoke.path)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#ip-spoke-faq`,
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
      url: IMAGE_PICKER_SITE_URL,
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
        item: `${IMAGE_PICKER_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Image Picker Wheel",
        item: `${IMAGE_PICKER_SITE_URL}${IMAGE_PICKER_PATH}`,
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
      "@id": `${IMAGE_PICKER_SITE_URL}/#website`,
      name: "Picker Wheel",
      url: IMAGE_PICKER_SITE_URL,
    },
    mainEntity: { "@id": `${url}#app` },
    hasPart: [{ "@id": `${url}#ip-spoke-faq` }],
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

export default function ImagePickerSpokeRoute({
  spokeId,
}: {
  spokeId: ImagePickerSpokeId
}) {
  const spoke = getImagePickerSpoke(spokeId)

  return (
    <>
      <ImagePickerSpokeJsonLd spokeId={spokeId} />
      <ImagePickerWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={`Spin the ${spoke.h1} to choose a random picture`}
        seoIntro={<ImagePickerSpokeSeoIntro spoke={spoke} />}
        seoSections={<ImagePickerSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
