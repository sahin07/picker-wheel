import type { Metadata } from "next"
import JjkWheelApp from "@/components/jjk-wheel/jjk-wheel-app"
import JjkWheelSeoSections, { JjkWheelSeoIntro } from "@/components/jjk-wheel/jjk-wheel-seo-sections"
import {
  JJK_WHEEL_FAQ_ITEMS,
  JJK_WHEEL_H1,
  JJK_WHEEL_KEYWORDS,
  JJK_WHEEL_OG_IMAGE_URL,
  JJK_WHEEL_ON_THIS_PAGE,
  JJK_WHEEL_PAGE_DESCRIPTION,
  JJK_WHEEL_PAGE_TITLE,
  JJK_WHEEL_SHORT_TITLE,
  JJK_WHEEL_SITE_URL,
  JJK_WHEEL_URL,
} from "@/lib/jjk-wheel-seo"
import { getJjkWheelSpoke } from "@/lib/jjk-wheel-spokes"

export const metadata: Metadata = {
  title: { absolute: JJK_WHEEL_PAGE_TITLE },
  description: JJK_WHEEL_PAGE_DESCRIPTION,
  keywords: [...JJK_WHEEL_KEYWORDS],
  alternates: { canonical: JJK_WHEEL_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: JJK_WHEEL_PAGE_TITLE,
    description: JJK_WHEEL_PAGE_DESCRIPTION,
    url: JJK_WHEEL_URL,
    siteName: "Picker Wheel",
    type: "website",
    images: [{ url: JJK_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: JJK_WHEEL_H1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: JJK_WHEEL_PAGE_TITLE,
    description: JJK_WHEEL_PAGE_DESCRIPTION,
    images: [JJK_WHEEL_OG_IMAGE_URL],
  },
}

function JjkJsonLd() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${JJK_WHEEL_URL}#webpage`,
      url: JJK_WHEEL_URL,
      name: JJK_WHEEL_PAGE_TITLE,
      description: JJK_WHEEL_PAGE_DESCRIPTION,
      isPartOf: { "@type": "WebSite", name: "Picker Wheel", url: JJK_WHEEL_SITE_URL },
      primaryImageOfPage: { "@type": "ImageObject", url: JJK_WHEEL_OG_IMAGE_URL },
      hasPart: {
        "@type": "Article",
        "@id": `${JJK_WHEEL_URL}#article`,
        headline: JJK_WHEEL_H1,
        description: JJK_WHEEL_PAGE_DESCRIPTION,
        author: { "@type": "Organization", name: "Picker Wheel" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${JJK_WHEEL_URL}#app`,
      name: JJK_WHEEL_H1,
      alternateName: ["JJK Wheel", "Jujutsu Kaisen Wheel", "JJK Spin the Wheel"],
      url: JJK_WHEEL_URL,
      description: JJK_WHEEL_PAGE_DESCRIPTION,
      applicationCategory: "EntertainmentApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Equal-odds JJK character spins",
        "Category templates",
        "Elimination mode",
        "Custom entries and images",
        "Achievements, analytics, and games",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${JJK_WHEEL_URL}#faq`,
      mainEntity: JJK_WHEEL_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: JJK_WHEEL_SITE_URL },
        { "@type": "ListItem", position: 2, name: JJK_WHEEL_H1, item: JJK_WHEEL_URL },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${JJK_WHEEL_URL}#toc`,
      name: "On this page",
      itemListElement: JJK_WHEEL_ON_THIS_PAGE.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `${JJK_WHEEL_URL}#${item.id}`,
      })),
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

export default function JjkSpinTheWheelPage() {
  return (
    <>
      <JjkJsonLd />
      <JjkWheelApp
        deepLink={getJjkWheelSpoke("jjk").deepLink}
        shortTitle={JJK_WHEEL_SHORT_TITLE}
        toolSubtitle="Pick a random Jujutsu Kaisen character with equal odds"
        seoIntro={<JjkWheelSeoIntro />}
        seoSections={<JjkWheelSeoSections />}
      />
    </>
  )
}
