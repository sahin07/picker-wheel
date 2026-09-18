/**
 * Indexing focus: a small set of strong intents (hubs/pillars).
 * Template spokes stay usable but are noindex + omitted from sitemap
 * so Google spends crawl budget on pages that can earn their own results.
 */

/** Pillars / hubs we want Google to index and prioritize */
export const CORE_INDEXABLE_PATHS = new Set<string>([
  "/",
  "/spin-random-number-picker-wheel",
  "/spin-random-letter-picker-wheel",
  "/spin-random-yes-no-picker-wheel",
  "/spin-random-team-picker-wheel",
  "/spin-random-color-picker-wheel",
  "/spin-random-country-wheel",
  "/spin-random-state-wheel",
  "/spin-random-theme-picker-wheel",
  "/spin-random-date-picker-wheel",
  "/spin-random-image-picker-wheel",
  "/wheel-of-fortune",
  "/prize-wheel-spinner",
  "/raffle-spin-wheel",
  "/spin-word-picker-wheel",
  "/weighted-wheel-spinner",
  "/pokemon-picker-wheel",
  "/fortnite-picker-wheel",
  "/lol-picker-wheel",
  "/food-wheel",
  "/nba-team-picker-wheel",
  "/mlb-picker-wheel",
  "/jjk-spin-the-wheel",
  "/demon-slayer-spin-wheel",
  "/dti-wheel-outfit-picker",
  "/classroom-name-picker",
  "/giveaway-name-picker",
  "/create-custom-wheel-spinner",
  "/spin-wheels",
  "/help",
  "/contact-us",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/changelog",
  "/articles",
])

/** Name-picker spokes that keep indexability (Tier B) */
export const INDEXABLE_HOME_SPOKE_IDS = new Set(["classroom", "giveaway"])

export function isIndexablePath(pathname: string): boolean {
  if (CORE_INDEXABLE_PATHS.has(pathname)) return true
  if (pathname.startsWith("/articles/")) return true
  if (pathname.startsWith("/spin-wheels/")) return true
  return false
}

export function isIndexableHomeSpoke(spokeId: string): boolean {
  return INDEXABLE_HOME_SPOKE_IDS.has(spokeId)
}
