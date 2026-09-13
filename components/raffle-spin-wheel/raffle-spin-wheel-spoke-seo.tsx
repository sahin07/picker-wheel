import Link from "next/link"
import type { RaffleSpinWheelSpokeSeo } from "@/lib/raffle-spin-wheel-spokes"
import { RAFFLE_SPIN_WHEEL_PATH } from "@/lib/raffle-spin-wheel-seo"

export function RaffleSpinWheelSpokeSeoIntro({ spoke }: { spoke: RaffleSpinWheelSpokeSeo }) {
  return (
    <section className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700">
      <h2 className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
        {spoke.h1}
      </h2>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {spoke.heroIntro}
      </p>
    </section>
  )
}

export function RaffleSpinWheelSpokeSeoSections({ spoke }: { spoke: RaffleSpinWheelSpokeSeo }) {
  return (
    <div className="mx-auto max-w-5xl px-1 pb-8 pt-4 text-slate-700">
      <article className="border-t border-slate-200 pt-12">
        <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900">{spoke.articleTitle}</h2>
        {spoke.articleIntro.map((paragraph) => (
          <p key={paragraph} className="mb-3 leading-relaxed text-slate-600">
            {paragraph}
          </p>
        ))}

        <section className="mt-10">
          <h3 className="font-spin-display mb-2 text-xl font-bold text-slate-900">
            {spoke.uniqueSection.title}
          </h3>
          <p className="mb-4 text-slate-600">{spoke.uniqueSection.intro}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {spoke.uniqueSection.points.map((point) => (
              <li key={point.title} className="rounded-xl border bg-white p-4">
                <p className="font-semibold text-slate-900">{point.title}</p>
                <p className="mt-1 text-sm text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h3 className="font-spin-display mb-2 text-xl font-bold text-slate-900">FAQ</h3>
          <dl className="space-y-3">
            {spoke.faq.map((item) => (
              <div key={item.question} className="rounded-xl border p-4">
                <dt className="font-semibold text-slate-900">{item.question}</dt>
                <dd className="mt-1 text-sm text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-8 text-sm text-slate-500">
          Back to the{" "}
          <Link href={RAFFLE_SPIN_WHEEL_PATH} className="font-medium text-amber-800 underline">
            Raffle Spin Wheel
          </Link>
          .
        </p>
      </article>
    </div>
  )
}
