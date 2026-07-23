import Link from "next/link"
import { FORTUNE_WHEEL_DISCLAIMER, FORTUNE_WHEEL_PATH } from "@/lib/fortune-wheel-seo"
import { getFortuneSpokeSiblings, type FortuneWheelSpokeSeo } from "@/lib/fortune-wheel-spokes"

export function FortuneWheelSpokeSeoIntro({ spoke }: { spoke: FortuneWheelSpokeSeo }) {
  return <section aria-labelledby="fortune-spoke-h1" className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700">
    <h1 id="fortune-spoke-h1" className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl">{spoke.h1}</h1>
    <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">{spoke.heroIntro}</p>
    <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-slate-500">{FORTUNE_WHEEL_DISCLAIMER}</p>
  </section>
}
export function FortuneWheelSpokeSeoSections({ spoke }: { spoke: FortuneWheelSpokeSeo }) {
  const siblings = getFortuneSpokeSiblings(spoke)
  return <div className="mx-auto max-w-5xl px-1 pb-8 pt-4 text-slate-700"><article className="border-t border-slate-200 pt-12">
    <section><h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">{spoke.articleTitle}</h2>
      <div className="space-y-4 leading-relaxed text-slate-600">{spoke.articleIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
    <section className="mt-12"><h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">{spoke.uniqueSection.title}</h2>
      <p className="mb-6 text-slate-600">{spoke.uniqueSection.intro}</p><ul className="grid gap-4 sm:grid-cols-3">{spoke.uniqueSection.points.map((point) => <li key={point.title} className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-2 font-semibold text-slate-900">{point.title}</h3><p className="text-sm text-slate-600">{point.description}</p></li>)}</ul></section>
    <section className="mt-12"><h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">Related Fortune Wheels</h2>
      <p className="mb-6 text-slate-600">Try another setup or return to <Link href={FORTUNE_WHEEL_PATH} className="font-semibold text-violet-800 underline">Wheel of Fortune</Link>.</p>
      <ul className="grid gap-3 sm:grid-cols-2">{siblings.map((item) => <li key={item.path}><Link href={item.path} className="block h-full rounded-xl border bg-white p-4 hover:border-violet-300">
        <span className="font-semibold text-slate-900">{item.shortTitle}</span><span className="mt-1 line-clamp-2 block text-xs text-slate-600">{item.description}</span></Link></li>)}</ul></section>
    <section className="mt-12"><h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">Frequently Asked Questions</h2>
      <dl className="space-y-4">{spoke.faq.map((item) => <div key={item.question} className="rounded-xl border bg-white p-5 shadow-sm"><dt className="font-semibold text-slate-900">{item.question}</dt><dd className="mt-2 text-sm text-slate-600">{item.answer}</dd></div>)}</dl></section>
  </article></div>
}
