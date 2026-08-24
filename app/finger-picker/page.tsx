import type { Metadata } from "next"
import FingerPickerApp from "@/components/finger-picker/finger-picker-app"
import { FingerPickerSeoIntro, FingerPickerSeoSections } from "@/components/finger-picker/finger-picker-seo-sections"
import {
  FINGER_PICKER_FAQ_ITEMS,
  FINGER_PICKER_H1,
  FINGER_PICKER_HERO_INTRO,
  FINGER_PICKER_KEYWORDS,
  FINGER_PICKER_OG_IMAGE_URL,
  FINGER_PICKER_PAGE_DESCRIPTION,
  FINGER_PICKER_PAGE_TITLE,
  FINGER_PICKER_URL,
} from "@/lib/finger-picker-seo"

export const metadata: Metadata = {
  title: { absolute: FINGER_PICKER_PAGE_TITLE },
  description: FINGER_PICKER_PAGE_DESCRIPTION,
  keywords: [...FINGER_PICKER_KEYWORDS],
  alternates: { canonical: FINGER_PICKER_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: FINGER_PICKER_PAGE_TITLE,
    description: FINGER_PICKER_PAGE_DESCRIPTION,
    url: FINGER_PICKER_URL,
    siteName: "Spinifywheel",
    type: "website",
    images: [{ url: FINGER_PICKER_OG_IMAGE_URL, width: 1200, height: 630, alt: FINGER_PICKER_H1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: FINGER_PICKER_PAGE_TITLE,
    description: FINGER_PICKER_PAGE_DESCRIPTION,
    images: [FINGER_PICKER_OG_IMAGE_URL],
  },
}

export default function Page() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: FINGER_PICKER_H1,
      url: FINGER_PICKER_URL,
      description: FINGER_PICKER_PAGE_DESCRIPTION,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FINGER_PICKER_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ]
  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <FingerPickerApp
        seoIntro={<FingerPickerSeoIntro />}
        seoSections={<FingerPickerSeoSections />}
        toolSubtitle={FINGER_PICKER_HERO_INTRO.slice(0, 140)}
      />
    </>
  )
}
