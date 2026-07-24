import type { Metadata, Viewport } from "next"
import { Fredoka, Nunito } from "next/font/google"
import {
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_ROBOTS,
  SITE_METADATA_BASE,
  SITE_NAME,
  ogImageEntry,
} from "@/lib/site-metadata"
import "./globals.css"

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-spin-display",
  display: "swap",
})

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-spin-body",
  display: "swap",
})

const ROOT_TITLE = "Random Wheel Picker | Spin the Wheel Online Free"
const ROOT_DESCRIPTION =
  "Spin the wheel online for free with our random wheel picker. Create custom wheels, add names or options, and make fair random choices in seconds."

export const metadata: Metadata = {
  metadataBase: SITE_METADATA_BASE,
  title: {
    default: ROOT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: ROOT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_METADATA_BASE.origin }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: DEFAULT_ROBOTS,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    url: SITE_METADATA_BASE,
    images: [ogImageEntry(DEFAULT_OG_IMAGE_URL, ROOT_TITLE)],
  },
  twitter: {
    card: "summary_large_image",
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body
        className="font-spin-body antialiased"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  )
}
