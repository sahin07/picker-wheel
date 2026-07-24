import type { Metadata } from "next"
import FortniteWheelApp from "@/components/fortnite-wheel/fortnite-wheel-app"
import {
  FortniteChallengeHubSeoIntro,
  FortniteChallengeHubSeoSections,
} from "@/components/fortnite-wheel/fortnite-challenge-hub-sections"
import {
  FORTNITE_CHALLENGE_HUB_DESCRIPTION,
  FORTNITE_CHALLENGE_HUB_FAQ,
  FORTNITE_CHALLENGE_HUB_H1,
  FORTNITE_CHALLENGE_HUB_HERO,
  FORTNITE_CHALLENGE_HUB_KEYWORDS,
  FORTNITE_CHALLENGE_HUB_PAGE_TITLE,
  FORTNITE_CHALLENGE_HUB_URL,
} from "@/lib/fortnite-challenge-hub-seo"
import {
  FORTNITE_WHEEL_OG_IMAGE_URL,
  FORTNITE_WHEEL_PATH,
  FORTNITE_WHEEL_SITE_URL,
} from "@/lib/fortnite-wheel-seo"
import { getFortniteWheelSpoke } from "@/lib/fortnite-wheel-spokes"

const duoSpoke = getFortniteWheelSpoke("duo-challenge")

export const metadata: Metadata = {
  title: { absolute: FORTNITE_CHALLENGE_HUB_PAGE_TITLE },
  description: FORTNITE_CHALLENGE_HUB_DESCRIPTION,
  keywords: [...FORTNITE_CHALLENGE_HUB_KEYWORDS],
  alternates: { canonical: FORTNITE_CHALLENGE_HUB_URL },
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
    title: FORTNITE_CHALLENGE_HUB_PAGE_TITLE,
    description: FORTNITE_CHALLENGE_HUB_DESCRIPTION,
    url: FORTNITE_CHALLENGE_HUB_URL,
    siteName: "Spinifywheel",
    locale: "en_US",
    type: "website",
    images: [{ url: FORTNITE_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: FORTNITE_CHALLENGE_HUB_H1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: FORTNITE_CHALLENGE_HUB_PAGE_TITLE,
    description: FORTNITE_CHALLENGE_HUB_DESCRIPTION,
    images: [FORTNITE_WHEEL_OG_IMAGE_URL],
  },
}

function FortniteChallengeHubJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${FORTNITE_CHALLENGE_HUB_URL}#fortnite-challenge-hub-faq`,
    mainEntity: FORTNITE_CHALLENGE_HUB_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${FORTNITE_WHEEL_SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Fortnite Picker Wheel",
        item: `${FORTNITE_WHEEL_SITE_URL}${FORTNITE_WHEEL_PATH}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: FORTNITE_CHALLENGE_HUB_H1,
        item: FORTNITE_CHALLENGE_HUB_URL,
      },
    ],
  }

  return (
    <>
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

export default function FortniteChallengeWheelPage() {
  return (
    <>
      <FortniteChallengeHubJsonLd />
      <FortniteWheelApp
        deepLink={duoSpoke.deepLink}
        shortTitle="Challenge Hub"
        toolSubtitle="Duo rules preloaded—browse all challenge templates below"
        seoIntro={<FortniteChallengeHubSeoIntro />}
        seoSections={<FortniteChallengeHubSeoSections />}
      />
    </>
  )
}
