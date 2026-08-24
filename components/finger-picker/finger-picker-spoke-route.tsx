import type { Metadata } from "next"
import FingerPickerApp from "@/components/finger-picker/finger-picker-app"
import { FingerPickerSpokeSeoIntro, FingerPickerSpokeSeoSections } from "@/components/finger-picker/finger-picker-spoke-seo"
import { FINGER_PICKER_OG_IMAGE_URL, FINGER_PICKER_PATH, FINGER_PICKER_SITE_URL } from "@/lib/finger-picker-seo"
import { fingerSpokeUrl, getFingerPickerSpoke, type FingerPickerSpokeId } from "@/lib/finger-picker-spokes"

export function fingerPickerSpokeMetadata(spokeId: FingerPickerSpokeId): Metadata {
  const spoke = getFingerPickerSpoke(spokeId)
  const url = fingerSpokeUrl(spoke.path)
  return {
    title: { absolute: spoke.pageTitle },
    description: spoke.description,
    keywords: [...spoke.keywords],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: spoke.pageTitle, description: spoke.description, url,
      siteName: "Spinifywheel", type: "website",
      images: [{ url: FINGER_PICKER_OG_IMAGE_URL, width: 1200, height: 630, alt: spoke.h1 }],
    },
    twitter: { card: "summary_large_image", title: spoke.pageTitle, description: spoke.description, images: [FINGER_PICKER_OG_IMAGE_URL] },
  }
}

export default function FingerPickerSpokeRoute({ spokeId }: { spokeId: FingerPickerSpokeId }) {
  const spoke = getFingerPickerSpoke(spokeId)
  const url = fingerSpokeUrl(spoke.path)
  const schemas = [
    {
      "@context": "https://schema.org", "@type": "WebPage", url, name: spoke.pageTitle, description: spoke.description,
      dateModified: spoke.updatedAt,
    },
    {
      "@context": "https://schema.org", "@type": "WebApplication", name: spoke.h1, url, description: spoke.description,
      applicationCategory: "GameApplication", operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: spoke.faq.map((item) => ({
        "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${FINGER_PICKER_SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Finger Picker", item: `${FINGER_PICKER_SITE_URL}${FINGER_PICKER_PATH}` },
        { "@type": "ListItem", position: 3, name: spoke.h1, item: url },
      ],
    },
  ]
  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <FingerPickerApp
        deepLink={spoke.deepLink}
        shortTitle={spoke.shortTitle}
        toolSubtitle={spoke.heroIntro.slice(0, 140)}
        seoIntro={<FingerPickerSpokeSeoIntro spoke={spoke} />}
        seoSections={<FingerPickerSpokeSeoSections spoke={spoke} />}
      />
    </>
  )
}
