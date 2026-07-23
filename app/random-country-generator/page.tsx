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

const PATH = "/random-country-generator"
const URL = `${COUNTRY_WHEEL_SITE_URL}${PATH}`
const TITLE = "Random Country Generator | Spin a Country Picker Wheel"
const DESCRIPTION =
  "Generate a random country with an interactive Country Picker Wheel. Fair equal-odds spins for travel inspiration, geography lessons, and quiz games."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "random country generator",
    "country randomizer",
    "country picker wheel",
    "world country picker",
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

export default function RandomCountryGeneratorPage() {
  const hubDeepLink = getCountryWheelSpoke("all").deepLink
  return (
    <CountryWheelApp
      shortTitle="Random Country Generator"
      toolSubtitle={`Generate a random country — same tool as ${COUNTRY_WHEEL_PATH}`}
      deepLink={hubDeepLink}
      seoIntro={<CountryWheelSeoIntro />}
      seoSections={<CountryWheelSeoSections />}
    />
  )
}
