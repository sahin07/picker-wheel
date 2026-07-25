/**
 * Shared spoke SEO helpers for M2 template standardization.
 *
 * Content checklist for question-intent / deep spoke pages:
 * 1. One page H1 (SEO intro) — demote tool chrome to a non-H1 title when seoIntro exists
 * 2. heroIntro answering the intent near the wheel
 * 3. tips[] — 3–5 actionable checklist items
 * 4. updatedAt (YYYY-MM-DD) — visible “Updated: …” + schema dateModified
 * 5. FAQ (4–6 real questions)
 * 6. relatedLinks / intent cluster + in-family siblings + parent hub link
 * 7. uniqueSection for differentiation (keep; do not replace tips)
 */

export type SpokeRelatedLink = {
  href: string
  label: string
}

/** M1 question-intent cluster — cross-family next-step links */
export const QUESTION_INTENT_CLUSTER: readonly SpokeRelatedLink[] = [
  { href: "/food-wheel", label: "What Should I Eat?" },
  { href: "/random-country-to-visit-picker-wheel", label: "What Country Should I Visit?" },
  { href: "/game-night-wheel-of-fortune", label: "What Game Should We Play?" },
  { href: "/presentation-order-picker", label: "Who Goes First?" },
  { href: "/pastel-color-wheel", label: "What Color Should I Choose?" },
  { href: "/should-i-wheel", label: "Should I Do It?" },
  { href: "/what-should-i-do", label: "What Should I Do?" },
  { href: "/what-movie-should-i-watch", label: "What Movie Should I Watch?" },
] as const

export function getQuestionIntentRelated(
  currentPath: string,
  limit = 5,
): SpokeRelatedLink[] {
  return QUESTION_INTENT_CLUSTER.filter((link) => link.href !== currentPath).slice(
    0,
    limit,
  )
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

/** Format ISO date `YYYY-MM-DD` → `July 25, 2026` */
export function formatSpokeUpdatedAt(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim())
  if (!match) return isoDate
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const monthName = MONTHS[month - 1]
  if (!monthName || day < 1 || day > 31) return isoDate
  return `${monthName} ${day}, ${year}`
}
