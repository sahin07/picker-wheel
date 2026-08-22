import type { Metadata } from "next"
import MlbAngelsWheelApp from "@/components/mlb-angels/mlb-angels-wheel-app"
import {
  MlbAngelsSpokeSeoIntro,
  MlbAngelsSpokeSeoSections,
  mlbAngelsSpokeBreadcrumbJson,
} from "@/components/mlb-angels/mlb-angels-spoke-seo"
import { MLB_ANGELS_WHEEL_OG_IMAGE_URL } from "@/lib/mlb-angels-seo"
import { getMlbAngelsSpoke, mlbAngelsSpokeUrl, type MlbAngelsSpokeId } from "@/lib/mlb-angels-spokes"

export function mlbAngelsSpokeMetadata(spokeId: MlbAngelsSpokeId): Metadata {
  const spoke = getMlbAngelsSpoke(spokeId)
  const url = mlbAngelsSpokeUrl(spoke.path)
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
      type: "website",
      images: [{ url: MLB_ANGELS_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: spoke.pageTitle,
      description: spoke.description,
      images: [MLB_ANGELS_WHEEL_OG_IMAGE_URL],
    },
  }
}

export default function MlbAngelsSpokeRoute({ spokeId }: { spokeId: MlbAngelsSpokeId }) {
  const spoke = getMlbAngelsSpoke(spokeId)
  const url = mlbAngelsSpokeUrl(spoke.path)
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: spoke.h1,
      url,
      description: spoke.description,
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
    mlbAngelsSpokeBreadcrumbJson(spoke),
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
      <MlbAngelsWheelApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={spoke.heroIntro.slice(0, 140)}
        seoIntro={<MlbAngelsSpokeSeoIntro spoke={spoke} />}
        seoSections={<MlbAngelsSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
