import type { Metadata } from "next"
import CreateCustomWheelSpinnerClient from "./create-custom-wheel-client"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_URL = `${HOME_SITE_URL}/create-custom-wheel-spinner`
const PAGE_TITLE = "Create Custom Wheel Spinner | Shareable Spin Wheel"
const PAGE_DESCRIPTION =
  "Create a custom spin wheel with your own options, save it on this device, and share a link—no account required."

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Picker Wheel",
    type: "website",
    images: [
      { url: HOME_OG_IMAGE_URL, width: 1200, height: 630, alt: PAGE_TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [HOME_OG_IMAGE_URL],
  },
}

export default function CreateCustomWheelSpinnerPage() {
  return <CreateCustomWheelSpinnerClient />
}
