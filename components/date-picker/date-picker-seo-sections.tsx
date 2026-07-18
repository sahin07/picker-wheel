import Link from "next/link"
import {
  DATE_PICKER_ARTICLE_INTRO,
  DATE_PICKER_ARTICLE_TITLE,
  DATE_PICKER_CLUSTER_LINKS,
  DATE_PICKER_FAQ_ITEMS,
  DATE_PICKER_H1,
  DATE_PICKER_HERO_INTRO,
  DATE_PICKER_ON_THIS_PAGE,
  DATE_PICKER_PATH,
  DATE_PICKER_RANGE_POINTS,
  DATE_PICKER_RELATED_TOOLS,
  DATE_PICKER_USE_CASE_GROUPS,
  DATE_PICKER_WEEKDAY_POINTS,
  DATE_PICKER_WHY_POINTS,
} from "@/lib/date-picker-seo"

export function DatePickerSeoIntro() {
  return (
    <section
      aria-labelledby="date-picker-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="date-picker-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {DATE_PICKER_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {DATE_PICKER_HERO_INTRO}
      </p>
    </section>
  )
}

export default function DatePickerSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="date-picker-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="dp-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {DATE_PICKER_ON_THIS_PAGE.map((item) => (
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

        <section id="dp-spin-wheel" aria-labelledby="dp-spin-heading" className="scroll-mt-24">
          <h2
            id="dp-spin-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {DATE_PICKER_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {DATE_PICKER_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Ready to spin? Use the Date Picker Wheel above, or tap a template in the{" "}
            <a href="#dp-popular" className="text-emerald-700 underline-offset-2 hover:underline">
              <strong className="font-semibold text-slate-800">Popular Date Wheels</strong>
            </a>{" "}
            strip under the title to load a ready-made date set.
          </p>
        </section>

        <section id="dp-ranges" aria-labelledby="dp-ranges-heading" className="mt-12 scroll-mt-24">
          <h2
            id="dp-ranges-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Pick Dates and Ranges
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Build the list that matches your plan—then spin for a fair calendar day.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {DATE_PICKER_RANGE_POINTS.map((point) => (
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
          id="dp-weekdays"
          aria-labelledby="dp-weekdays-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="dp-weekdays-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Filter by Weekday
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Keep only the days that fit your schedule so random picks stay practical.
          </p>
          <ul className="grid gap-4 sm:grid-cols-3">
            {DATE_PICKER_WEEKDAY_POINTS.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </article>

      <section
        id="dp-use-cases"
        aria-labelledby="dp-use-cases-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="dp-use-cases-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Common Ways to Use a Date Picker Wheel
        </h2>
        <p className="mb-8 text-base leading-relaxed text-slate-600">
          From 30-day challenges to meeting picks and classroom prompts, a random date spinner keeps
          calendar decisions fair.
        </p>
        <div className="space-y-8">
          {DATE_PICKER_USE_CASE_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="font-spin-display mb-3 text-xl font-semibold text-slate-900">
                {group.title}
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="block h-full rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                    >
                      <span className="font-spin-display block text-sm font-semibold text-slate-900">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="dp-why"
        aria-labelledby="dp-why-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="dp-why-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Why Use a Date Wheel?
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          A date wheel turns calendar debates into one clear spin—especially when the group needs a
          fair day, not a booking engine.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DATE_PICKER_WHY_POINTS.map((point) => (
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

      <section
        id="dp-related"
        aria-labelledby="dp-related-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="dp-related-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Related Tools
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Need numbers, yes/no, letters, colors, or images? Those tools have dedicated pages. Keep
          this Date Picker Wheel focused on random calendar days.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DATE_PICKER_RELATED_TOOLS.map((tool) => (
            <li key={tool.href + tool.label}>
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
        <div className="mt-8">
          <h3 className="font-spin-display mb-3 text-lg font-semibold text-slate-900">
            More date wheel templates
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-slate-600">
            Each template opens its own page with that date set preloaded.
          </p>
          <ul className="flex flex-wrap gap-2">
            {DATE_PICKER_CLUSTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={DATE_PICKER_PATH}
                className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
              >
                Date Picker Wheel (pillar)
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section
        id="dp-faq"
        aria-labelledby="dp-faq-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="dp-faq-heading"
          className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {DATE_PICKER_FAQ_ITEMS.map((item) => (
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
    </div>
  )
}
