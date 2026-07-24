import type { Metadata } from "next"
import GameInstructionsHubClient from "./game-instructions-hub-client"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_URL = `${HOME_SITE_URL}/game-instructions`
const PAGE_TITLE = "Game Instructions | Picker Wheel Modes & How to Play"
const PAGE_DESCRIPTION =
  "Learn how to play every Picker Wheel game mode—Normal Spin, Bingo, Memory, Collection Race, Roulette, Speed Challenge, and more."

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

export default function GameInstructionsPage() {
  return <GameInstructionsHubClient />
}
