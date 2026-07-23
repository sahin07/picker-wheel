import Link from "next/link"
import { MLB_WHEEL_OPTIONS_GUIDE, MLB_WHEEL_PATH } from "@/lib/mlb-wheel-seo"
import {
  getMlbSpokeSiblings,
  MLB_WHEEL_POPULAR_SPOKE_LINKS,
  type MlbWheelSpokeSeo,
} from "@/lib/mlb-wheel-spokes"

export function MlbWheelSpokeSeoIntro({ spoke }: { spoke: MlbWheelSpokeSeo }) {
  return (
    <section
      aria-labelledby="mlb-spoke-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="mlb-spoke-seo-h1"
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

export function MlbWheelSpokeSeoSections({ spoke }: { spoke: MlbWheelSpokeSeo }) {
  const siblings = getMlbSpokeSiblings(spoke)
  const toc = [
    { id: "mlb-spoke-popular", label: "Popular MLB templates" },
    { id: "mlb-spoke-guide", label: "Guide" },
    { id: "mlb-spoke-options", label: "Features & options" },
    { id: "mlb-spoke-unique", label: spoke.uniqueSection.title },
    { id: "mlb-spoke-cluster", label: "Related MLB templates" },
    { id: "mlb-spoke-faq", label: "FAQ" },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <section
        id="mlb-spoke-popular"
        aria-labelledby="mlb-spoke-popular-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="mlb-spoke-popular-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Popular MLB Templates
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Each template is its own page with matching teams. Jump to another MLB tool, or open the{" "}
          <Link
            href={MLB_WHEEL_PATH}
            className="font-medium text-emerald-700 underline-offset-2 hover:underline"
          >
            main MLB Picker Wheel
          </Link>
          .
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MLB_WHEEL_POPULAR_SPOKE_LINKS.map((item) => (
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

      <article id="mlb-spoke-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          MLB template guide
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

        <section id="mlb-spoke-guide" aria-labelledby="mlb-spoke-guide-heading" className="scroll-mt-24">
          <h2
            id="mlb-spoke-guide-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.articleTitle}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {spoke.articleIntro.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </section>

        <section
          id="mlb-spoke-options"
          aria-labelledby="mlb-spoke-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="mlb-spoke-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Features &amp; Options on This Template
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This spoke loads a pre-filtered team set. Every other control—favorites, comparison,
            team details, statistics, AI, spin history, and more—works the same as on the{" "}
            <Link
              href={MLB_WHEEL_PATH}
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              main MLB wheel
            </Link>
            .
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {MLB_WHEEL_OPTIONS_GUIDE.map((option) => (
              <li
                key={option.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                  {option.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{option.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="mlb-spoke-unique"
          aria-labelledby="mlb-spoke-unique-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="mlb-spoke-unique-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.uniqueSection.title}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            {spoke.uniqueSection.intro}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {spoke.uniqueSection.points.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="mlb-spoke-cluster"
          aria-labelledby="mlb-spoke-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="mlb-spoke-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related MLB Templates
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.slice(0, 6).map((sib) => (
              <li key={sib.path}>
                <Link
                  href={sib.path}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
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

        <section id="mlb-spoke-faq" aria-labelledby="mlb-spoke-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="mlb-spoke-faq-heading"
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
