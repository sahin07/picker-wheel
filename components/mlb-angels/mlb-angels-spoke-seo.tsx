import Link from "next/link"
import {
  MLB_ANGELS_NICKNAME_DISCLAIMER,
  MLB_ANGELS_NICKNAME_WHEEL_PATH,
  MLB_ANGELS_WHEEL_SITE_URL,
} from "@/lib/mlb-angels-seo"
import { getMlbAngelsSpokeSiblings, type MlbAngelsSpokeSeo } from "@/lib/mlb-angels-spokes"
import { MLB_WHEEL_PATH } from "@/lib/mlb-wheel-seo"

export function MlbAngelsSpokeSeoIntro({ spoke }: { spoke: MlbAngelsSpokeSeo }) {
  return (
    <section className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-center">
      <h2 className="font-spin-display text-3xl font-bold text-slate-900 sm:text-4xl">{spoke.h1}</h2>
      <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-slate-600">{spoke.heroIntro}</p>
    </section>
  )
}

export function MlbAngelsSpokeSeoSections({ spoke }: { spoke: MlbAngelsSpokeSeo }) {
  const siblings = getMlbAngelsSpokeSiblings(spoke)
  return (
    <article className="mx-auto max-w-5xl space-y-12 px-1 pb-10 text-slate-700">
      <p className="font-spin-display text-center text-sm font-semibold uppercase tracking-wide text-red-700">
        Complete guide
      </p>

      <section>
        <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900">{spoke.articleTitle}</h2>
        <div className="space-y-4 leading-relaxed text-slate-600">
          {spoke.articleIntro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-4 leading-relaxed text-slate-600">
          Return to the{" "}
          <Link href={MLB_WHEEL_PATH} className="font-semibold text-red-700 hover:underline">
            MLB Picker Wheel hub
          </Link>{" "}
          for team wheels, divisions, and the full MLB topic cluster.
        </p>
      </section>

      <section>
        <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900">{spoke.uniqueSection.title}</h2>
        <p className="mb-4 leading-relaxed text-slate-600">{spoke.uniqueSection.intro}</p>
        <ul className="grid gap-4 sm:grid-cols-3">
          {spoke.uniqueSection.points.map((point) => (
            <li key={point.title} className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">{point.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {siblings.length > 0 && (
        <section>
          <h2 className="font-spin-display mb-4 text-2xl font-bold text-slate-900">Related Angels Wheels</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {siblings.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="block h-full rounded-xl border bg-white p-4 hover:border-red-300">
                  <span className="font-semibold text-slate-900">{item.shortTitle}</span>
                  <span className="mt-1 block text-sm text-slate-600">{item.description.slice(0, 100)}…</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-spin-display mb-4 text-2xl font-bold text-slate-900">FAQ</h2>
        <dl className="space-y-4">
          {spoke.faq.map((item) => (
            <div key={item.question} className="rounded-xl border bg-white p-5 shadow-sm">
              <dt className="font-semibold text-slate-900">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-center text-xs text-slate-500">{MLB_ANGELS_NICKNAME_DISCLAIMER}</p>
    </article>
  )
}

export function mlbAngelsSpokeBreadcrumbJson(spoke: MlbAngelsSpokeSeo) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${MLB_ANGELS_WHEEL_SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "MLB Picker Wheel", item: `${MLB_ANGELS_WHEEL_SITE_URL}${MLB_WHEEL_PATH}` },
      { "@type": "ListItem", position: 3, name: spoke.h1, item: `${MLB_ANGELS_WHEEL_SITE_URL}${MLB_ANGELS_NICKNAME_WHEEL_PATH}` },
    ],
  }
}
