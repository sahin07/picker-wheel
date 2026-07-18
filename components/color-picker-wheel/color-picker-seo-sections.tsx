import Link from "next/link"
import {
  COLOR_PICKER_ARTICLE_INTRO,
  COLOR_PICKER_ARTICLE_TITLE,
  COLOR_PICKER_COMPARISON,
  COLOR_PICKER_CREATE_POINTS,
  COLOR_PICKER_FAQ_ITEMS,
  COLOR_PICKER_H1,
  COLOR_PICKER_HERO_INTRO,
  COLOR_PICKER_ON_THIS_PAGE,
  COLOR_PICKER_PATH,
  COLOR_PICKER_RELATED_TOOLS,
  COLOR_PICKER_USE_CASE_GROUPS,
  COLOR_PICKER_WHY_POINTS,
} from "@/lib/color-picker-seo"
import { COLOR_PICKER_CLUSTER_LINKS } from "@/lib/color-picker-spokes"

/** SEO H1 + pitch — below the tool */
export function ColorPickerSeoIntro() {
  return (
    <section
      aria-labelledby="color-picker-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="color-picker-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {COLOR_PICKER_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {COLOR_PICKER_HERO_INTRO}
      </p>
    </section>
  )
}

export default function ColorPickerSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="color-picker-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="cp-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {COLOR_PICKER_ON_THIS_PAGE.map((item) => (
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

        <section id="cp-spin-wheel" aria-labelledby="cp-spin-heading" className="scroll-mt-24">
          <h2
            id="cp-spin-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {COLOR_PICKER_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {COLOR_PICKER_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Ready to spin? Use the Color Picker Wheel above, or tap a template in the{" "}
            <strong className="font-semibold text-slate-800">Popular Color Wheels</strong> strip
            under the title to load a ready-made palette. Dedicated pages for each template are
            linked under{" "}
            <a href="#cp-related" className="text-emerald-700 underline-offset-2 hover:underline">
              Related tools
            </a>
            .
          </p>
        </section>

        <section
          id="cp-create-wheel"
          aria-labelledby="cp-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="cp-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Your Own Color Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Build a custom color spinner in minutes. Add custom colors, remove colors, rename
            swatches, change appearance, save wheels, and share results when you want others to spin
            the same setup.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {COLOR_PICKER_CREATE_POINTS.map((point) => (
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
      </article>

      <section
        id="cp-use-cases"
        aria-labelledby="cp-use-cases-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="cp-use-cases-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Ways to Use a Color Picker Wheel
        </h2>
        <p className="mb-8 text-base leading-relaxed text-slate-600">
          From classroom color games to design accents and party prizes, a color wheel spinner keeps
          picks fair and fun. Open a template that matches your activity.
        </p>
        <div className="space-y-8">
          {COLOR_PICKER_USE_CASE_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="font-spin-display mb-3 text-xl font-semibold text-slate-900">
                {group.title}
              </h3>
              <ul className="grid gap-3 sm:grid-cols-3">
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

      <section id="cp-why" aria-labelledby="cp-why-heading" className="scroll-mt-24 border-t border-slate-200 pt-12">
        <h2
          id="cp-why-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Why Use a Color Wheel Instead of Choosing Manually?
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLOR_PICKER_WHY_POINTS.map((point) => (
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
        id="cp-vs-picker"
        aria-labelledby="cp-vs-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="cp-vs-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Color Picker Wheel vs Color Picker Tool
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Many people confuse a Color Picker Wheel with a precision color picker tool (including
          Google’s color picker). This table sets expectations: our spinner chooses a{" "}
          <strong className="font-semibold text-slate-800">random</strong> color; designer tools
          select an <strong className="font-semibold text-slate-800">exact</strong> value.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[320px] text-left text-sm">
            <caption className="sr-only">
              Comparison of color picker wheel and color picker tool
            </caption>
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                  Aspect
                </th>
                <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                  Color Picker Wheel
                </th>
                <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                  Color Picker Tool
                </th>
              </tr>
            </thead>
            <tbody>
              {COLOR_PICKER_COMPARISON.map((row) => (
                <tr key={row.aspect} className="border-t border-slate-100">
                  <th scope="row" className="px-4 py-3 font-medium text-slate-800">
                    {row.aspect}
                  </th>
                  <td className="px-4 py-3 text-slate-600">{row.wheel}</td>
                  <td className="px-4 py-3 text-slate-600">{row.tool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        id="cp-related"
        aria-labelledby="cp-related-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="cp-related-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Related Tools
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Looking for names, numbers, letters, or yes/no decisions? Those topics have dedicated
          pages—use them instead of stuffing this color wheel with unrelated keywords.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COLOR_PICKER_RELATED_TOOLS.map((tool) => (
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
            More color wheel templates
          </h3>
          <ul className="flex flex-wrap gap-2">
            {COLOR_PICKER_CLUSTER_LINKS.map((link) => (
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
                href={COLOR_PICKER_PATH}
                className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
              >
                Color Picker Wheel (pillar)
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section id="cp-faq" aria-labelledby="cp-faq-heading" className="scroll-mt-24 border-t border-slate-200 pt-12">
        <h2
          id="cp-faq-heading"
          className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {COLOR_PICKER_FAQ_ITEMS.map((item) => (
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
