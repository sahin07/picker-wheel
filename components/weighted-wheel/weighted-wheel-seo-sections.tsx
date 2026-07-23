import Link from "next/link"
import {
  RIGGED_DESCRIPTION,
  RIGGED_H1,
  WEIGHTED_WHEEL_DISCLAIMER,
  WEIGHTED_WHEEL_EQUAL_VS_WEIGHTED,
  WEIGHTED_WHEEL_FAQ_ITEMS,
  WEIGHTED_WHEEL_FEATURES,
  WEIGHTED_WHEEL_H1,
  WEIGHTED_WHEEL_HERO_INTRO,
  WEIGHTED_WHEEL_HOW_IT_WORKS,
  WEIGHTED_WHEEL_ON_THIS_PAGE,
  WEIGHTED_WHEEL_POPULAR_TEMPLATES,
  WEIGHTED_WHEEL_RELATED_TOOLS,
  WEIGHTED_WHEEL_USE_CASES_COPY,
} from "@/lib/weighted-wheel-seo"

export function WeightedWheelSeoIntro({
  h1 = WEIGHTED_WHEEL_H1,
  intro = WEIGHTED_WHEEL_HERO_INTRO,
}: {
  h1?: string
  intro?: string
}) {
  return (
    <section
      aria-labelledby="weighted-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="weighted-wheel-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {h1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {intro}
      </p>
    </section>
  )
}

export function RiggedWheelSeoIntro() {
  return <WeightedWheelSeoIntro h1={RIGGED_H1} intro={RIGGED_DESCRIPTION} />
}

export default function WeightedWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl px-1 pb-8 pt-4 text-slate-700">
      <article className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-violet-700">
          Complete probability wheel guide
        </p>
        <nav aria-label="On this page" className="mb-10 rounded-xl border bg-slate-50 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-violet-700">
            {WEIGHTED_WHEEL_ON_THIS_PAGE.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-violet-700 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="weighted-how-it-works" className="scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            How the Weighted Wheel Works
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            A normal picker gives every enabled entry the same chance. This tool adds a positive
            numeric weight to each entry, then converts all active weights into a probability
            distribution. A weight does not need to be a percentage: 7 and 3 produce the same
            70/30 split as 70 and 30. The wheel sector sizes and live percentages make that
            distribution visible before every spin.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2">
            {WEIGHTED_WHEEL_HOW_IT_WORKS.map((step, index) => (
              <li key={step} className="flex gap-4 rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 font-bold text-white">
                  {index + 1}
                </span>
                <p className="self-center text-sm leading-relaxed text-slate-600">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Customize Winning Chances
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Edit labels, weights, colors, and availability independently. The controls recalculate
            the full distribution immediately, so increasing one entry also updates every other
            percentage. Disable an outcome to pause it without deleting your setup, or use
            Equalize to return every enabled option to the same chance.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WEIGHTED_WHEEL_FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="font-spin-display mb-2 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="weighted-templates" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Popular Weight Templates
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Templates provide practical starting distributions. Open one, inspect the percentages,
            and change the labels or weights to match your activity.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WEIGHTED_WHEEL_POPULAR_TEMPLATES.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block h-full rounded-xl border bg-white p-4 hover:border-violet-300 hover:bg-violet-50/40">
                  <span className="block font-semibold text-slate-900">{item.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="weighted-use-cases" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Common Uses for a Weighted Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Weighted selection is useful when a model calls for unequal likelihoods. It can make
            abstract probability easier to teach, help designers test rarity systems, or route
            repeated scenarios according to an intended mix.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {WEIGHTED_WHEEL_USE_CASES_COPY.map((item) => (
              <div key={item.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="weighted-equal-vs-weighted" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Equal Odds vs Weighted Odds
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Choose the method based on the purpose of the draw. Unequal probability is appropriate
            when the distribution itself is part of a lesson, simulation, or game rule. When
            participants expect fair treatment, equal probability is the correct setting.
          </p>
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-900">
                <tr><th className="p-3">Aspect</th><th className="p-3">Equal odds</th><th className="p-3">Weighted odds</th></tr>
              </thead>
              <tbody>
                {WEIGHTED_WHEEL_EQUAL_VS_WEIGHTED.map((row) => (
                  <tr key={row.aspect} className="border-t align-top">
                    <th className="p-3 font-semibold text-slate-900">{row.aspect}</th>
                    <td className="p-3 leading-relaxed text-slate-600">{row.equal}</td>
                    <td className="p-3 leading-relaxed text-slate-600">{row.weighted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            {WEIGHTED_WHEEL_DISCLAIMER}{" "}
            <Link href="/" className="font-semibold underline">Open the equal-odds Random Name Picker.</Link>
          </div>
        </section>

        <section id="weighted-related" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">Related Tools</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WEIGHTED_WHEEL_RELATED_TOOLS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block h-full rounded-xl border bg-white p-4 hover:border-violet-300">
                  <span className="block font-semibold text-slate-900">{item.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="weighted-faq" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {WEIGHTED_WHEEL_FAQ_ITEMS.map((item) => (
              <div key={item.question} className="rounded-xl border bg-white p-5 shadow-sm">
                <dt className="font-semibold text-slate-900">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </div>
  )
}
