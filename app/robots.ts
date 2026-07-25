import type { MetadataRoute } from "next"
import { HOME_SITE_URL } from "@/lib/home-seo"

/** Paths that must stay out of search / AI crawler indexes */
const DISALLOW = ["/api/", "/w/"] as const

/**
 * Explicit AI / answer-engine crawlers (M6).
 * Same allow/disallow as the default rule — named for parity with competitors
 * and clearer signaling that public pages may be cited.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "meta-externalagent",
] as const

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...DISALLOW],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: [...DISALLOW],
      })),
    ],
    sitemap: `${HOME_SITE_URL}/sitemap.xml`,
    host: HOME_SITE_URL,
  }
}
