import Link from "next/link"
import {
  WORD_PICKER_WHEEL_FAQ_ITEMS,
  WORD_PICKER_WHEEL_FEATURES,
  WORD_PICKER_WHEEL_H1,
  WORD_PICKER_WHEEL_HERO_INTRO,
  WORD_PICKER_WHEEL_HOW_IT_WORKS,
  WORD_PICKER_WHEEL_ON_THIS_PAGE,
  WORD_PICKER_WHEEL_RELATED_TOOLS,
  WORD_PICKER_WHEEL_USE_CASES,
  WORD_PICKER_WHEEL_VS_OTHER,
  WORD_PICKER_WHEEL_WHY,
} from "@/lib/word-picker-wheel-seo"
import { WORD_PICKER_POPULAR_SPOKE_LINKS } from "@/lib/word-picker-wheel-spokes"

export function WordPickerWheelSeoIntro({
  h1 = WORD_PICKER_WHEEL_H1,
  intro = WORD_PICKER_WHEEL_HERO_INTRO,
}: {
  h1?: string
  intro?: string
}) {
  return (
    <section
      aria-labelledby="word-picker-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h2
        id="word-picker-wheel-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {h1}
      </h2>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {intro}
      </p>
    </section>
  )
}

export default function WordPickerWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl px-1 pb-8 pt-4 text-slate-700">
      <article className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-sky-700">
          Complete word picker guide
        </p>
        <nav aria-label="On this page" className="mb-10 rounded-xl border bg-slate-50 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-sky-700">
            {WORD_PICKER_WHEEL_ON_THIS_PAGE.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-sky-800 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="word-how-it-works" className="scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            How the Word Picker Wheel works
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2">
            {WORD_PICKER_WHEEL_HOW_IT_WORKS.map((step, index) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-sky-100 bg-white p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                  {index + 1}
                </span>
                <p className="self-center text-sm leading-relaxed text-slate-600">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="word-features" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Word picker features
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {WORD_PICKER_WHEEL_FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-1 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="word-use-cases" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Strong use cases
          </h2>
          <ul className="mb-6 space-y-3 text-slate-600">
            {WORD_PICKER_WHEEL_WHY.map((reason) => (
              <li key={reason} className="flex gap-2">
                <span className="text-sky-600">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-4 sm:grid-cols-2">
            {WORD_PICKER_WHEEL_USE_CASES.map((item) => (
              <div key={item.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-1 font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="word-vs-other" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Word Picker vs Letter Picker vs Name Picker
          </h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Aspect</th>
                  <th className="px-4 py-3 font-semibold">Word Picker</th>
                  <th className="px-4 py-3 font-semibold">Letter Picker</th>
                  <th className="px-4 py-3 font-semibold">Name Picker</th>
                </tr>
              </thead>
              <tbody>
                {WORD_PICKER_WHEEL_VS_OTHER.map((row) => (
                  <tr key={row.aspect} className="border-t">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.aspect}</td>
                    <td className="px-4 py-3 text-slate-600">{row.word}</td>
                    <td className="px-4 py-3 text-slate-600">{row.letter}</td>
                    <td className="px-4 py-3 text-slate-600">{row.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="word-starter-packs" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Starter word packs
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {WORD_PICKER_POPULAR_SPOKE_LINKS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="block rounded-xl border border-sky-100 bg-sky-50/40 p-4 hover:border-sky-400"
                >
                  <span className="font-semibold text-sky-900">{item.label}</span>
                  <span className="mt-1 block text-sm text-slate-600">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="word-related" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Related tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {WORD_PICKER_WHEEL_RELATED_TOOLS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-xl border p-4 hover:border-sky-400">
                  <span className="font-semibold text-slate-900">{item.label}</span>
                  <span className="mt-1 block text-sm text-slate-600">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="word-faq" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">FAQ</h2>
          <dl className="space-y-4">
            {WORD_PICKER_WHEEL_FAQ_ITEMS.map((item) => (
              <div key={item.question} className="rounded-xl border bg-white p-5">
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
