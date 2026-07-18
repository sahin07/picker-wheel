import Link from "next/link"
import {
  NUMBER_PICKER_ARTICLE_INTRO,
  NUMBER_PICKER_ARTICLE_TITLE,
  NUMBER_PICKER_COMPARISON,
  NUMBER_PICKER_CREATE_POINTS,
  NUMBER_PICKER_FAQ_ITEMS,
  NUMBER_PICKER_H1,
  NUMBER_PICKER_HERO_INTRO,
  NUMBER_PICKER_ON_THIS_PAGE,
  NUMBER_PICKER_POPULAR_WHEELS,
  NUMBER_PICKER_RELATED_TOOLS,
  NUMBER_PICKER_USE_CASES_SEO,
  NUMBER_PICKER_WHY_POINTS,
} from "@/lib/number-picker-seo"

/** SEO H1 + pitch — below the tool */
export function NumberPickerSeoIntro() {
  return (
    <section
      aria-labelledby="number-picker-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="number-picker-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {NUMBER_PICKER_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {NUMBER_PICKER_HERO_INTRO}
      </p>
    </section>
  )
}

export default function NumberPickerSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <section
        id="np-popular-wheels"
        aria-labelledby="np-popular-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="np-popular-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Popular Number Wheels
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Jump into a common range or mode. High-intent options open dedicated pages; others load
          this Random Number Picker Wheel with matching settings so you can spin right away.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NUMBER_PICKER_POPULAR_WHEELS.map((wheel) => (
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
        id="number-picker-article"
        className="border-t border-slate-200 pt-12"
      >
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="np-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {NUMBER_PICKER_ON_THIS_PAGE.map((item) => (
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

        <section id="np-spin-random" aria-labelledby="np-spin-heading" className="scroll-mt-24">
          <h2
            id="np-spin-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {NUMBER_PICKER_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {NUMBER_PICKER_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Ready to spin? Use the Random Number Picker Wheel above to pick a random number, then
            explore the guides below for ranges, use cases, and how a number wheel compares to a
            classic random number generator.
          </p>
        </section>

        <section id="np-create-wheel" aria-labelledby="np-create-heading" className="mt-12 scroll-mt-24">
          <h2
            id="np-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Your Own Number Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Build a custom number spinner in minutes. Add numbers, remove values, set ranges, edit
            labels, and customize colors—then spin for a fair random selection.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {NUMBER_PICKER_CREATE_POINTS.map((point) => (
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

        <section id="np-use-cases" aria-labelledby="np-use-cases-heading" className="mt-12 scroll-mt-24">
          <h2
            id="np-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Ways to Use a Number Picker
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            A number picker wheel covers long-tail needs—from classroom helpers to bingo calls and
            lucky number games. Use the mode strip above the tool for one-tap setups.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {NUMBER_PICKER_USE_CASES_SEO.map((useCase) => (
              <li
                key={useCase.title}
                className="rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3"
              >
                <span className="font-spin-display block text-sm font-semibold text-slate-900">
                  {useCase.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                  {useCase.description}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="np-why" aria-labelledby="np-why-heading" className="mt-12 scroll-mt-24">
          <h2
            id="np-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a Number Picker Wheel?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NUMBER_PICKER_WHY_POINTS.map((point) => (
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

        <section id="np-vs-rng" aria-labelledby="np-vs-heading" className="mt-12 scroll-mt-24">
          <h2
            id="np-vs-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Random Number Wheel vs Random Number Generator
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            People search for both a random number picker wheel and a random number generator. This
            tool covers both intents: you get fair random numbers with a spinning wheel experience
            that works especially well for groups.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[320px] text-left text-sm">
              <caption className="sr-only">
                Comparison of number picker wheel and random number generator
              </caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Aspect
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Number Picker Wheel
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Random Number Generator
                  </th>
                </tr>
              </thead>
              <tbody>
                {NUMBER_PICKER_COMPARISON.map((row) => (
                  <tr key={row.aspect} className="border-t border-slate-100">
                    <th scope="row" className="px-4 py-3 font-medium text-slate-800">
                      {row.aspect}
                    </th>
                    <td className="px-4 py-3 text-slate-600">{row.wheel}</td>
                    <td className="px-4 py-3 text-slate-600">{row.generator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="np-related" aria-labelledby="np-related-heading" className="mt-12 scroll-mt-24">
          <h2
            id="np-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Looking for names, letters, colors, or yes/no decisions? Those topics have dedicated
            pages—use them instead of stuffing this number wheel with unrelated keywords.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {NUMBER_PICKER_RELATED_TOOLS.map((tool) => (
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

        <section id="np-faq" aria-labelledby="np-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="np-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {NUMBER_PICKER_FAQ_ITEMS.map((item) => (
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
