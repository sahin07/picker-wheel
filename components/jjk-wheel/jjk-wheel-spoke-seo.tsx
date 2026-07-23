import Link from "next/link"
import { JJK_WHEEL_DISCLAIMER, JJK_WHEEL_PATH } from "@/lib/jjk-wheel-seo"
import { getJjkSpokeSiblings, type JjkWheelSpokeSeo } from "@/lib/jjk-wheel-spokes"

export function JjkWheelSpokeSeoIntro({ spoke }: { spoke: JjkWheelSpokeSeo }) {
  return <section className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-center">
    <h1 className="font-spin-display text-3xl font-bold text-slate-900 sm:text-4xl">{spoke.h1}</h1>
    <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-slate-600">{spoke.heroIntro}</p>
  </section>
}

export function JjkWheelSpokeSeoSections({ spoke }: { spoke: JjkWheelSpokeSeo }) {
  const siblings = getJjkSpokeSiblings(spoke)
  return <article className="mx-auto max-w-5xl space-y-12 px-1 pb-10 text-slate-700">
    <section><h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900">{spoke.articleTitle}</h2>
      <div className="space-y-4 leading-relaxed text-slate-600">{spoke.articleIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <p className="mt-4 leading-relaxed text-slate-600">Use the search and toggles to refine the preset, then press Spin. Every enabled entry has equal odds. For unequal probabilities, use the <Link href="/weighted-wheel-spinner" className="font-semibold text-violet-700 hover:underline">Weighted Wheel Spinner</Link>. Return to the <Link href={JJK_WHEEL_PATH} className="font-semibold text-violet-700 hover:underline">JJK Spin Wheel picker hub</Link> for the complete guide.</p>
    </section>
    <section><h2 className="font-spin-display mb-4 text-2xl font-bold text-slate-900">Related JJK Wheels</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{siblings.slice(0, 9).map((item) =>
        <li key={item.path}><Link href={item.path} className="block h-full rounded-xl border bg-white p-4 hover:border-violet-300">
          <span className="font-semibold text-slate-900">{item.shortTitle}</span><span className="mt-1 block text-xs text-slate-600">{item.description}</span>
        </Link></li>)}</ul>
    </section>
    <section><h2 className="font-spin-display mb-4 text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
      <dl className="space-y-3">{spoke.faq.map((item) => <div key={item.question} className="rounded-xl border bg-white p-5">
        <dt className="font-semibold text-slate-900">{item.question}</dt><dd className="mt-2 text-sm text-slate-600">{item.answer}</dd>
      </div>)}</dl>
    </section>
    <p className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">{JJK_WHEEL_DISCLAIMER}</p>
  </article>
}
