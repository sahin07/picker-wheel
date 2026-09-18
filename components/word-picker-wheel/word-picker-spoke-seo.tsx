import Link from "next/link"
import { WORD_PICKER_WHEEL_PATH } from "@/lib/word-picker-wheel-seo"
import {
  getWordPickerSpokeSiblings,
  WORD_PICKER_POPULAR_SPOKE_LINKS,
  type WordPickerSpokeSeo,
} from "@/lib/word-picker-wheel-spokes"

export function WordPickerSpokeSeoIntro({ spoke }: { spoke: WordPickerSpokeSeo }) {
  return (
    <section
      aria-labelledby="word-picker-spoke-seo-h1"
      className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-sky-700">
        Category: {spoke.category}
      </p>
      <h2
        id="word-picker-spoke-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {spoke.h1}
      </h2>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {spoke.heroIntro}
      </p>
    </section>
  )
}

export function WordPickerSpokeSeoSections({ spoke }: { spoke: WordPickerSpokeSeo }) {
  const siblings = getWordPickerSpokeSiblings(spoke)
  const toc = [
    { id: "word-spoke-popular", label: "Popular word setups" },
    { id: "word-spoke-about", label: "About this pack" },
    { id: "word-spoke-siblings", label: "Related word wheels" },
    { id: "word-spoke-faq", label: "FAQ" },
  ]

  return (
    <div className="mx-auto max-w-5xl px-1 pb-8 pt-4 text-slate-700">
      <article className="border-t border-slate-200 pt-12">
        <nav aria-label="On this page" className="mb-10 rounded-xl border bg-slate-50 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-sky-700">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-sky-800 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="word-spoke-popular" className="scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Popular word setups
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WORD_PICKER_POPULAR_SPOKE_LINKS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 hover:border-sky-300 hover:bg-sky-50/50"
                >
                  <span className="font-semibold text-slate-900">{item.label}</span>
                  <span className="mt-1 block text-sm text-slate-600">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="word-spoke-about" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            About this word pack
          </h2>
          <p className="leading-relaxed text-slate-600">{spoke.description}</p>
          <p className="mt-4 text-sm text-slate-600">
            Part of the{" "}
            <Link href={WORD_PICKER_WHEEL_PATH} className="font-medium text-sky-700 hover:underline">
              Word Picker Wheel
            </Link>{" "}
            pillar — same spinner engine, focused word list and challenge defaults.
          </p>
        </section>

        {siblings.length > 0 && (
          <section id="word-spoke-siblings" className="mt-12 scroll-mt-24">
            <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              Related {spoke.category} word wheels
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {siblings.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.path}
                    className="block rounded-xl border p-4 hover:border-sky-400"
                  >
                    <span className="font-semibold text-slate-900">{item.shortTitle}</span>
                    <span className="mt-1 block text-sm text-slate-600">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="word-spoke-faq" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">FAQ</h2>
          <dl className="space-y-4">
            {spoke.faq.map((item) => (
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
