import type { MetadataRoute } from "next"
import { HOME_SITE_URL } from "@/lib/home-seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/w/"],
      },
    ],
    sitemap: `${HOME_SITE_URL}/sitemap.xml`,
    host: HOME_SITE_URL,
  }
}
