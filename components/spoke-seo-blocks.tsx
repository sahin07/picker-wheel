import Link from "next/link"
import {
  formatSpokeUpdatedAt,
  getQuestionIntentRelated,
  type SpokeRelatedLink,
} from "@/lib/spoke-seo-shared"

export function SpokeUpdatedLabel({
  updatedAt,
  className = "mt-3 text-center text-sm text-slate-500",
}: {
  updatedAt?: string
  className?: string
}) {
  if (!updatedAt) return null
  return (
    <p className={className}>
      <time dateTime={updatedAt}>Updated: {formatSpokeUpdatedAt(updatedAt)}</time>
    </p>
  )
}

export function SpokeTipsSection({
  tips,
  id = "spoke-tips",
  accentClass = "marker:text-emerald-700",
}: {
  tips?: readonly string[]
  id?: string
  accentClass?: string
}) {
  if (!tips?.length) return null
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-12 scroll-mt-24">
      <h2
        id={`${id}-heading`}
        className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
      >
        Tips
      </h2>
      <ul className={`list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600 ${accentClass}`}>
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </section>
  )
}

export function SpokeIntentRelatedSection({
  currentPath,
  links,
  id = "spoke-intent-related",
  accentHover = "hover:border-emerald-300 hover:bg-emerald-50/50",
}: {
  currentPath: string
  links?: readonly SpokeRelatedLink[]
  id?: string
  accentHover?: string
}) {
  const items = links?.length
    ? links.filter((link) => link.href !== currentPath)
    : getQuestionIntentRelated(currentPath)

  if (!items.length) return null

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 border-t border-slate-200 pt-12"
    >
      <h2
        id={`${id}-heading`}
        className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
      >
        Related decisions
      </h2>
      <p className="mb-6 text-base leading-relaxed text-slate-600">
        Stuck on a different everyday choice? Jump to another question-focused spinner.
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 ${accentHover}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
