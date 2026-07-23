import Link from "next/link"
import { TEAM_PICKER_PATH } from "@/lib/team-picker-seo"
import {
  getTeamSpokeSiblings,
  TEAM_PICKER_POPULAR_SPOKE_LINKS,
  type TeamPickerSpokeSeo,
} from "@/lib/team-picker-spokes"

export function TeamPickerSpokeSeoIntro({ spoke }: { spoke: TeamPickerSpokeSeo }) {
  return (
    <section
      aria-labelledby="team-spoke-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="team-spoke-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {spoke.h1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {spoke.heroIntro}
      </p>
    </section>
  )
}

export function TeamPickerSpokeSeoSections({ spoke }: { spoke: TeamPickerSpokeSeo }) {
  const siblings = getTeamSpokeSiblings(spoke)
  const toc = [
    { id: "tp-spoke-popular", label: "Popular team templates" },
    { id: "tp-spoke-guide", label: "Guide" },
    { id: "tp-spoke-unique", label: spoke.uniqueSection.title },
    { id: "tp-spoke-cluster", label: "Related team templates" },
    { id: "tp-spoke-faq", label: "FAQ" },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <section
        id="tp-spoke-popular"
        aria-labelledby="tp-spoke-popular-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="tp-spoke-popular-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Popular Team Picker Templates
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Each template is its own page with matching settings. Jump to another team tool, or open the{" "}
          <Link
            href={TEAM_PICKER_PATH}
            className="font-medium text-emerald-700 underline-offset-2 hover:underline"
          >
            main Team Picker Wheel
          </Link>
          .
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM_PICKER_POPULAR_SPOKE_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block h-full rounded-xl border p-4 transition-colors ${
                  item.href === spoke.path
                    ? "border-emerald-400 bg-emerald-50/70"
                    : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}
              >
                <span className="font-spin-display block text-base font-semibold text-slate-900">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <article id="team-spoke-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Team template guide
        </p>
        <nav
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {toc.map((item) => (
              <li key={item.id} className="marker:font-semibold">
                <a
                  href={`#${item.id}`}
                  className="text-emerald-700 underline-offset-2 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="tp-spoke-guide" aria-labelledby="tp-spoke-guide-heading" className="scroll-mt-24">
          <h2
            id="tp-spoke-guide-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.articleTitle}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {spoke.articleIntro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section
          id="tp-spoke-unique"
          aria-labelledby="tp-spoke-unique-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="tp-spoke-unique-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.uniqueSection.title}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">{spoke.uniqueSection.intro}</p>
          <ul className="grid gap-4 sm:grid-cols-3">
            {spoke.uniqueSection.points.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-emerald-100 bg-white/90 p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-emerald-800">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="tp-spoke-cluster"
          aria-labelledby="tp-spoke-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="tp-spoke-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Team Templates
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.slice(0, 6).map((sib) => (
              <li key={sib.path}>
                <Link
                  href={sib.path}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <span className="font-spin-display block text-sm font-semibold text-slate-900">
                    {sib.shortTitle}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {sib.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="tp-spoke-faq" aria-labelledby="tp-spoke-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="tp-spoke-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {spoke.faq.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <dt className="font-spin-display text-base font-semibold text-slate-900">
                  {item.question}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </div>
  )
}
