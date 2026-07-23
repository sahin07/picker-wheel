import Link from "next/link"
import { WEIGHTED_WHEEL_DISCLAIMER, WEIGHTED_WHEEL_PATH } from "@/lib/weighted-wheel-seo"
import {
  getWeightedSpokeSiblings,
  type WeightedWheelSpokeSeo,
} from "@/lib/weighted-wheel-spokes"

export function WeightedWheelSpokeSeoIntro({ spoke }: { spoke: WeightedWheelSpokeSeo }) {
  return (
    <section
      aria-labelledby="weighted-spoke-h1"
      className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1 id="weighted-spoke-h1" className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
        {spoke.h1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {spoke.heroIntro}
      </p>
    </section>
  )
}

export function WeightedWheelSpokeSeoSections({ spoke }: { spoke: WeightedWheelSpokeSeo }) {
  const siblings = getWeightedSpokeSiblings(spoke)
  return (
    <div className="mx-auto max-w-5xl px-1 pb-8 pt-4 text-slate-700">
      <article className="border-t border-slate-200 pt-12">
        <nav aria-label="On this page" className="mb-10 rounded-xl border bg-slate-50 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-violet-700">
            <li><a href="#weighted-spoke-guide" className="text-violet-700 hover:underline">Guide</a></li>
            <li><a href="#weighted-spoke-unique" className="text-violet-700 hover:underline">{spoke.uniqueSection.title}</a></li>
            <li><a href="#weighted-spoke-related" className="text-violet-700 hover:underline">Related weighted wheels</a></li>
            <li><a href="#weighted-spoke-faq" className="text-violet-700 hover:underline">FAQ</a></li>
          </ol>
        </nav>

        <section id="weighted-spoke-guide" className="scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">{spoke.articleTitle}</h2>
          <div className="space-y-4 leading-relaxed text-slate-600">
            {spoke.articleIntro.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
            <p>
              Add or rename outcomes in the Inputs panel, set a positive weight for each one, and
              check the live percentage before spinning. You can disable an outcome temporarily
              without losing its label or weight.
            </p>
          </div>
        </section>

        <section id="weighted-spoke-unique" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">{spoke.uniqueSection.title}</h2>
          <p className="mb-6 leading-relaxed text-slate-600">{spoke.uniqueSection.intro}</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spoke.uniqueSection.points.map((point) => (
              <li key={point.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold text-slate-900">{point.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {WEIGHTED_WHEEL_DISCLAIMER}
          </div>
        </section>

        <section id="weighted-spoke-related" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">Related Weighted Wheels</h2>
          <p className="mb-6 text-slate-600">
            Explore another probability setup or return to the{" "}
            <Link href={WEIGHTED_WHEEL_PATH} className="font-semibold text-violet-700 hover:underline">
              main Weighted Wheel Spinner
            </Link>.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.slice(0, 8).map((sibling) => (
              <li key={sibling.path}>
                <Link href={sibling.path} className="block h-full rounded-xl border bg-white p-4 hover:border-violet-300 hover:bg-violet-50/40">
                  <span className="block font-semibold text-slate-900">{sibling.shortTitle}</span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-600">{sibling.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="weighted-spoke-faq" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">Frequently Asked Questions</h2>
          <dl className="space-y-4">
            {spoke.faq.map((item) => (
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
