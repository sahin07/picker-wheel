import type { Metadata } from "next"
import DtiWheelApp from "./dti-wheel-app"
import { DtiWheelSpokeSeoIntro, DtiWheelSpokeSeoSections } from "./dti-wheel-spoke-seo"
import {
  DTI_WHEEL_OG_IMAGE_URL,
  DTI_WHEEL_PATH,
  DTI_WHEEL_SHORT_TITLE,
  DTI_WHEEL_SITE_URL,
} from "@/lib/dti-wheel-seo"
import { dtiSpokeUrl, getDtiWheelSpoke, type DtiWheelSpokeId } from "@/lib/dti-wheel-spokes"

export function dtiWheelSpokeMetadata(spokeId: DtiWheelSpokeId): Metadata {
  const spoke = getDtiWheelSpoke(spokeId)
  const url = dtiSpokeUrl(spoke.path)
  return {
    title: { absolute: spoke.pageTitle },
    description: spoke.description,
    keywords: [...spoke.keywords],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: spoke.pageTitle,
      description: spoke.description,
      url,
      siteName: "Spinifywheel",
      locale: "en_US",
      type: "website",
      images: [{ url: DTI_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: spoke.pageTitle,
      description: spoke.description,
      images: [DTI_WHEEL_OG_IMAGE_URL],
    },
  }
}

export function DtiWheelSpokeJsonLd({ spokeId }: { spokeId: DtiWheelSpokeId }) {
  const spoke = getDtiWheelSpoke(spokeId)
  const url = dtiSpokeUrl(spoke.path)
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: spoke.h1,
      url,
      description: spoke.description,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      ...(spoke.updatedAt ? { dateModified: spoke.updatedAt } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: spoke.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${DTI_WHEEL_SITE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: DTI_WHEEL_SHORT_TITLE,
          item: `${DTI_WHEEL_SITE_URL}${DTI_WHEEL_PATH}`,
        },
        { "@type": "ListItem", position: 3, name: spoke.h1, item: url },
      ],
    },
  ]
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}

export default function DtiWheelSpokeRoute({ spokeId }: { spokeId: DtiWheelSpokeId }) {
  const spoke = getDtiWheelSpoke(spokeId)
  return (
    <>
      <DtiWheelSpokeJsonLd spokeId={spokeId} />
      <DtiWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle="Spin random Dress to Impress outfit ideas"
        seoIntro={<DtiWheelSpokeSeoIntro spoke={spoke} />}
        seoSections={<DtiWheelSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
