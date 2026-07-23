import type { Metadata } from "next"
import CountryWheelApp from "@/components/country-wheel/country-wheel-app"
import CountryWheelSeoSections, {
  CountryWheelSeoIntro,
} from "@/components/country-wheel/country-wheel-seo-sections"
import {
  COUNTRY_WHEEL_OG_IMAGE_URL,
  COUNTRY_WHEEL_PATH,
  COUNTRY_WHEEL_SITE_URL,
} from "@/lib/country-wheel-seo"
import { getCountryWheelSpoke } from "@/lib/country-wheel-spokes"

const PATH = "/random-country-picker"
const URL = `${COUNTRY_WHEEL_SITE_URL}${PATH}`
const TITLE = "Random Country Picker – Spin the Country Wheel Online"
const DESCRIPTION =
  "Use this Random Country Picker to spin a fair country from around the world. Same Country Picker Wheel tool—great for geography games, travel ideas, and classroom quizzes."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "random country picker",
    "country picker wheel",
    "pick a random country",
    "spin country wheel",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "Picker Wheel",
    type: "website",
    images: [{ url: COUNTRY_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [COUNTRY_WHEEL_OG_IMAGE_URL],
  },
}

export default function RandomCountryPickerPage() {
  const hubDeepLink = getCountryWheelSpoke("all").deepLink
  return (
    <CountryWheelApp
      shortTitle="Random Country Picker"
      toolSubtitle={`Spin a random country — same tool as ${COUNTRY_WHEEL_PATH}`}
      deepLink={hubDeepLink}
      seoIntro={<CountryWheelSeoIntro />}
      seoSections={<CountryWheelSeoSections />}
    />
  )
}
