import type { Metadata } from "next"
import { HOME_SITE_URL } from "@/lib/home-seo"

/** Canonical site origin for absolute meta URLs */
export const SITE_URL = HOME_SITE_URL

/** Used by root layout `metadataBase` */
export const SITE_METADATA_BASE = new URL(
  SITE_URL.endsWith("/") ? SITE_URL : `${SITE_URL}/`,
)

export const DEFAULT_OG_IMAGE_PATH = "/og/picker-wheel.svg"
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`

export const SITE_NAME = "Picker Wheel"

export const DEFAULT_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
}

export function ogImageEntry(url: string, alt: string) {
  return {
    url,
    width: 1200,
    height: 630,
    alt,
  }
}

type BuildPageMetadataInput = {
  title: string
  description: string
  path?: string
  url?: string
  keywords?: string[]
  imageUrl?: string
  imageAlt?: string
  type?: "website" | "article"
  absoluteTitle?: boolean
  robots?: Metadata["robots"]
  authors?: Metadata["authors"]
  other?: Metadata["other"]
  openGraphExtras?: Metadata["openGraph"]
}

/** Standard title + description + canonical + OG + Twitter package */
export function buildPageMetadata({
  title,
  description,
  path,
  url,
  keywords,
  imageUrl = DEFAULT_OG_IMAGE_URL,
  imageAlt = title,
  type = "website",
  absoluteTitle = true,
  robots = DEFAULT_ROBOTS,
  authors,
  other,
  openGraphExtras,
}: BuildPageMetadataInput): Metadata {
  const pageUrl =
    url ||
    (path
      ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
      : SITE_URL)
  const image = ogImageEntry(imageUrl, imageAlt)

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    ...(authors ? { authors } : {}),
    alternates: { canonical: pageUrl },
    robots,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [image],
      ...openGraphExtras,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    ...(other ? { other } : {}),
  }
}
