import type { MetadataRoute } from "next"
import fs from "fs"
import path from "path"
import { getAllArticleParams } from "@/lib/articles"
import { HOME_SITE_URL } from "@/lib/home-seo"
import {
  ALL_WHEELS_ENTRY,
  SPIN_WHEELS_BASE_PATH,
  WHEEL_CATEGORIES,
} from "@/lib/wheel-categories"

/** Build at deploy time so `app/` is available and robots get a stable sitemap */
export const dynamic = "force-static"

/** Alias / legacy routes that redirect — do not list in the sitemap */
const EXCLUDED_SEGMENTS = new Set([
  "api",
  "w",
  "faq",
  "a-to-z-wheel",
  "letter-picker-wheel",
  "random-consonant-generator",
  "random-vowel-generator",
  "random-team-picker",
  "random-theme-generator",
  "naruto-wheel",
  "naruto-character-picker",
  "which-naruto-character-are-you",
  "which-naruto-character-should-i-be",
  "what-naruto-character-should-i-draw",
  "finger-picker-online",
  "finger-chooser",
  "finger-selector",
  "random-finger-picker",
  "finger-picking-game",
  "random-finger-game",
  "finger-roulette-game",
  "pick-a-finger-game",
  "pick-a-random-player",
  "random-person-selector",
  "who-should-go-first",
  "who-goes-first-in-a-game",
  "who-gets-the-first-turn",
  "who-should-start",
  "team-picker",
  "the-wheel-of-fortune",
  "wheel-of-colors",
  "yes-no-picker-wheel",
  "country-picker-wheel",
  "state-wheel",
  "number-picker-wheel",
  "random-letter-picker",
  "yes-or-no-wheel",
  "color-picker-wheel",
  "image-picker-wheel",
  "date-picker-wheel",
  "theme-picker-wheel",
  "team-picker-wheel",
])

function collectAppRoutes(dir: string, segments: string[] = []): string[] {
  if (!fs.existsSync(dir)) return []

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const routes: string[] = []

  const hasPage = entries.some(
    (entry) => entry.isFile() && /^page\.(tsx|ts|jsx|js)$/.test(entry.name),
  )

  if (hasPage) {
    const route = "/" + segments.join("/")
    routes.push(route === "/" ? "/" : route.replace(/\/$/, "") || "/")
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue
    if (EXCLUDED_SEGMENTS.has(entry.name)) continue
    if (entry.name.startsWith("[") && entry.name.endsWith("]")) continue
    routes.push(
      ...collectAppRoutes(path.join(dir, entry.name), [...segments, entry.name]),
    )
  }

  return routes
}

function priorityFor(route: string): number {
  if (route === "/") return 1
  if (route.startsWith("/articles")) return 0.7
  if (route.startsWith("/spin-wheels")) return 0.8
  if (route.startsWith("/game-instructions")) return 0.5
  if (
    route === "/help" ||
    route === "/privacy-policy" ||
    route === "/terms-of-service" ||
    route === "/cookie-policy" ||
    route === "/contact-us" ||
    route === "/changelog"
  ) {
    return 0.4
  }
  if (route === "/create-custom-wheel-spinner") return 0.6
  return 0.9
}

function changeFrequencyFor(
  route: string,
): NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]> {
  if (route === "/") return "daily"
  if (route.startsWith("/articles") || route.startsWith("/spin-wheels")) {
    return "weekly"
  }
  if (
    route === "/help" ||
    route === "/privacy-policy" ||
    route === "/terms-of-service" ||
    route === "/cookie-policy" ||
    route === "/changelog"
  ) {
    return "monthly"
  }
  return "weekly"
}

export default function sitemap(): MetadataRoute.Sitemap {
  const appDir = path.join(process.cwd(), "app")

  let staticRoutes: string[] = ["/"]
  try {
    staticRoutes = collectAppRoutes(appDir)
  } catch (error) {
    console.error("[sitemap] Failed to scan app routes:", error)
  }

  const articleRoutes = getAllArticleParams().map(
    (item) => `/articles/${item.category}/${item.slug}`,
  )
  const categoryRoutes = [
    `${SPIN_WHEELS_BASE_PATH}/${ALL_WHEELS_ENTRY.id}`,
    ...WHEEL_CATEGORIES.map(
      (category) => `${SPIN_WHEELS_BASE_PATH}/${category.id}`,
    ),
  ]

  const routes = Array.from(
    new Set([...staticRoutes, ...articleRoutes, ...categoryRoutes]),
  ).sort()

  const lastModified = new Date()

  return routes.map((route) => ({
    url: route === "/" ? `${HOME_SITE_URL}/` : `${HOME_SITE_URL}${route}`,
    lastModified,
    changeFrequency: changeFrequencyFor(route),
    priority: priorityFor(route),
  }))
}
