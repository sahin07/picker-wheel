import type { Metadata } from "next"
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/site-metadata"
import { RAFFLE_SPIN_WHEEL_OG_IMAGE_URL, RAFFLE_SPIN_WHEEL_SITE_URL } from "@/lib/raffle-spin-wheel-seo"

export const metadata: Metadata = {
  title: { absolute: "Shared Raffle Results | Spinifywheel" },
  description: "View a shared raffle draw outcome snapshot from Spinifywheel.",
  robots: NOINDEX_FOLLOW_ROBOTS,
  openGraph: {
    title: "Shared Raffle Results",
    description: "View a shared raffle draw outcome snapshot.",
    url: `${RAFFLE_SPIN_WHEEL_SITE_URL}/r`,
    images: [{ url: RAFFLE_SPIN_WHEEL_OG_IMAGE_URL, width: 1200, height: 630, alt: "Raffle results" }],
  },
}

export default function RaffleResultLayout({ children }: { children: React.ReactNode }) {
  return children
}
