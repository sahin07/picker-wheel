import Link from "next/link"
import {
  LETTER_PICKER_ARTICLE_INTRO,
  LETTER_PICKER_ARTICLE_TITLE,
  LETTER_PICKER_COMPARISON,
  LETTER_PICKER_CREATE_POINTS,
  LETTER_PICKER_FAQ_ITEMS,
  LETTER_PICKER_H1,
  LETTER_PICKER_HERO_INTRO,
  LETTER_PICKER_ON_THIS_PAGE,
  LETTER_PICKER_OPTIONS_GUIDE,
  LETTER_PICKER_POPULAR_WHEELS,
  LETTER_PICKER_RELATED_TOOLS,
  LETTER_PICKER_USE_CASES_SEO,
  LETTER_PICKER_WHY_POINTS,
} from "@/lib/letter-picker-seo"

/** SEO H1 + pitch — below the tool */
export function LetterPickerSeoIntro() {
  return (
    <section
      aria-labelledby="letter-picker-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="letter-picker-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {LETTER_PICKER_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {LETTER_PICKER_HERO_INTRO}
      </p>
    </section>
  )
}

export default function LetterPickerSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <section
        id="lp-popular-wheels"
        aria-labelledby="lp-popular-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="lp-popular-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Popular Letter Wheels
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Jump into a ready-made alphabet wheel. Each link opens this Random Letter Picker with
          matching settings so you can spin right away.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LETTER_PICKER_POPULAR_WHEELS.map((wheel) => (
            <li key={wheel.href + wheel.label}>
              <Link
                href={wheel.href}
                className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
              >
                <span className="font-spin-display block text-base font-semibold text-slate-900">
                  {wheel.label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                  {wheel.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <article
        id="letter-picker-article"
        className="border-t border-slate-200 pt-12"
      >
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="lp-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {LETTER_PICKER_ON_THIS_PAGE.map((item) => (
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

        <section id="lp-spin-wheel" aria-labelledby="lp-spin-heading" className="scroll-mt-24">
          <h2
            id="lp-spin-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {LETTER_PICKER_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {LETTER_PICKER_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Ready to spin? Use the Random Letter Picker above to choose a random letter, then explore
            the guides below for alphabet presets, classroom uses, and how a letter picker compares
            to a classic random letter generator.
          </p>
        </section>

        <section id="lp-create-wheel" aria-labelledby="lp-create-heading" className="mt-12 scroll-mt-24">
          <h2
            id="lp-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Your Own Letter Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Build a custom letter spinner in minutes. Use A–Z, remove letters, add custom entries,
            change colors, shuffle the list, and save wheels for the next lesson or game night.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {LETTER_PICKER_CREATE_POINTS.map((point) => (
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
          id="lp-options"
          aria-labelledby="lp-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lp-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Letter Controls sidebar is where most settings live. Use this guide to understand
            each option before you spin—so classroom, phonics, and game setups behave the way you
            expect.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {LETTER_PICKER_OPTIONS_GUIDE.map((option) => (
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

        <section id="lp-use-cases" aria-labelledby="lp-use-cases-heading" className="mt-12 scroll-mt-24">
          <h2
            id="lp-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Uses
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Each Common Uses mode changes the letter set and shows a tailored result card after you
            spin—similar to how classroom, phonics, and word-game activities work in real life. Use
            the horizontal strip above the tool, or open a mode link below.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {LETTER_PICKER_USE_CASES_SEO.map((useCase) => (
              <li key={useCase.title}>
                <Link
                  href={useCase.href}
                  className="block h-full rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <span className="font-spin-display block text-sm font-semibold text-slate-900">
                    {useCase.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {useCase.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="lp-why" aria-labelledby="lp-why-heading" className="mt-12 scroll-mt-24">
          <h2
            id="lp-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a Random Letter Picker?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LETTER_PICKER_WHY_POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="lp-vs-generator" aria-labelledby="lp-vs-heading" className="mt-12 scroll-mt-24">
          <h2
            id="lp-vs-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Random Letter Picker vs Random Letter Generator
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            People search for both a random letter picker and a random letter generator. This tool
            covers both intents: you get fair random letters with a spinning alphabet wheel that
            works especially well for classrooms and games.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[320px] text-left text-sm">
              <caption className="sr-only">
                Comparison of random letter picker and random letter generator
              </caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Aspect
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Random Letter Picker
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Random Letter Generator
                  </th>
                </tr>
              </thead>
              <tbody>
                {LETTER_PICKER_COMPARISON.map((row) => (
                  <tr key={row.aspect} className="border-t border-slate-100">
                    <th scope="row" className="px-4 py-3 font-medium text-slate-800">
                      {row.aspect}
                    </th>
                    <td className="px-4 py-3 text-slate-600">{row.picker}</td>
                    <td className="px-4 py-3 text-slate-600">{row.generator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="lp-related" aria-labelledby="lp-related-heading" className="mt-12 scroll-mt-24">
          <h2
            id="lp-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Looking for names, numbers, colors, or yes/no decisions? Those topics have dedicated
            pages—use them instead of stuffing this letter wheel with unrelated keywords.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LETTER_PICKER_RELATED_TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <span className="font-spin-display block text-sm font-semibold text-slate-900">
                    {tool.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {tool.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="lp-faq" aria-labelledby="lp-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="lp-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {LETTER_PICKER_FAQ_ITEMS.map((item) => (
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
