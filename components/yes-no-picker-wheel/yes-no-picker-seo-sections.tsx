import Link from "next/link"
import {
  YES_NO_PICKER_ARTICLE_INTRO,
  YES_NO_PICKER_ARTICLE_TITLE,
  YES_NO_PICKER_CLASSROOM_IDEAS,
  YES_NO_PICKER_COMPARISON,
  YES_NO_PICKER_CUSTOMIZE_POINTS,
  YES_NO_PICKER_EVERYDAY_IDEAS,
  YES_NO_PICKER_FAQ_ITEMS,
  YES_NO_PICKER_H1,
  YES_NO_PICKER_HERO_INTRO,
  YES_NO_PICKER_ON_THIS_PAGE,
  YES_NO_PICKER_OPTIONS_GUIDE,
  YES_NO_PICKER_PARTY_IDEAS,
  YES_NO_PICKER_POPULAR_WHEELS,
  YES_NO_PICKER_RELATED_TOOLS,
  YES_NO_PICKER_TIPS,
  YES_NO_PICKER_WHEN_TO_USE,
  YES_NO_PICKER_WHY_POINTS,
} from "@/lib/yes-no-picker-seo"

/** SEO H1 + pitch — below the tool */
export function YesNoPickerSeoIntro() {
  return (
    <section
      aria-labelledby="yes-no-picker-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="yes-no-picker-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {YES_NO_PICKER_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {YES_NO_PICKER_HERO_INTRO}
      </p>
    </section>
  )
}

export default function YesNoPickerSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <section
        id="yn-popular-wheels"
        aria-labelledby="yn-popular-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="yn-popular-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Popular Yes or No Wheels
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Jump into a common decision mode. Each link opens this Yes or No Wheel with matching
          settings so you can spin right away.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {YES_NO_PICKER_POPULAR_WHEELS.map((wheel) => (
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

      <article id="yes-no-picker-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="yn-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {YES_NO_PICKER_ON_THIS_PAGE.map((item) => (
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

        <section id="yn-spin-wheel" aria-labelledby="yn-spin-heading" className="scroll-mt-24">
          <h2
            id="yn-spin-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {YES_NO_PICKER_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {YES_NO_PICKER_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section id="yn-customize" aria-labelledby="yn-customize-heading" className="mt-12 scroll-mt-24">
          <h2
            id="yn-customize-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Customize Your Decision Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Make the spinner yours. Change Yes and No labels, add more options if needed, customize
            colors, adjust spin duration, save your wheel, and share it with others.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {YES_NO_PICKER_CUSTOMIZE_POINTS.map((point) => (
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
          id="yn-options"
          aria-labelledby="yn-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="yn-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Yes / No Controls sidebar is where most settings live. Use this guide to understand
            each option before you spin—so everyday decisions, classroom votes, and party games
            behave the way you expect.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {YES_NO_PICKER_OPTIONS_GUIDE.map((option) => (
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

        <section
          id="yn-when-to-use"
          aria-labelledby="yn-when-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="yn-when-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            When to Use a Yes or No Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            A yes or no picker wheel fits many long-tail moments—from everyday choices to classroom
            activities, icebreakers, and party games. Spin whenever you need a fair, random yes or no
            answer.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {YES_NO_PICKER_WHEN_TO_USE.map((item) => (
              <li
                key={item.title}
                className="rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3"
              >
                <span className="font-spin-display block text-sm font-semibold text-slate-900">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="yn-vs-coin" aria-labelledby="yn-vs-heading" className="mt-12 scroll-mt-24">
          <h2
            id="yn-vs-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a Yes or No Wheel Instead of Flipping a Coin?
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            People often compare a yes or no wheel with a coin flip. Both can settle a 50/50 call—the
            wheel adds a shared visual spin, customization, and more engagement for groups.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[320px] text-left text-sm">
              <caption className="sr-only">
                Comparison of Yes or No Wheel and coin flip
              </caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Aspect
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Yes or No Wheel
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Coin Flip
                  </th>
                </tr>
              </thead>
              <tbody>
                {YES_NO_PICKER_COMPARISON.map((row) => (
                  <tr key={row.aspect} className="border-t border-slate-100">
                    <th
                      scope="row"
                      className="px-4 py-3 font-spin-display font-semibold text-slate-800"
                    >
                      {row.aspect}
                    </th>
                    <td className="px-4 py-3 text-slate-600">{row.wheel}</td>
                    <td className="px-4 py-3 text-slate-600">{row.coin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="yn-why" aria-labelledby="yn-why-heading" className="mt-12 scroll-mt-24">
          <h2
            id="yn-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Choose Our Yes or No Wheel?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {YES_NO_PICKER_WHY_POINTS.map((point) => (
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

        <section id="yn-ideas" aria-labelledby="yn-ideas-heading" className="mt-12 scroll-mt-24">
          <h2
            id="yn-ideas-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Everyday Decisions, Classroom Uses & Party Ideas
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Most competitors stop after showing the wheel. Use these ideas to make the spinner useful
            for real moments—at home, in class, or at a party.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-spin-display mb-3 text-lg font-semibold text-slate-900">
                Everyday Decisions
              </h3>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
                {YES_NO_PICKER_EVERYDAY_IDEAS.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-spin-display mb-3 text-lg font-semibold text-slate-900">
                Classroom Uses
              </h3>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
                {YES_NO_PICKER_CLASSROOM_IDEAS.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-spin-display mb-3 text-lg font-semibold text-slate-900">
                Party & Game Ideas
              </h3>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
                {YES_NO_PICKER_PARTY_IDEAS.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="yn-tips" aria-labelledby="yn-tips-heading" className="mt-12 scroll-mt-24">
          <h2
            id="yn-tips-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Tips for Better Decisions
          </h2>
          <p className="text-base leading-relaxed text-slate-600">{YES_NO_PICKER_TIPS}</p>
        </section>

        <section id="yn-related" aria-labelledby="yn-related-heading" className="mt-12 scroll-mt-24">
          <h2
            id="yn-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Need names, numbers, letters, a coin flip, or a truth or dare spin? Try these related free
            tools alongside the Yes or No Wheel.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {YES_NO_PICKER_RELATED_TOOLS.map((tool) => (
              <li key={tool.label + tool.href}>
                <Link
                  href={tool.href}
                  className="block rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
                >
                  <span className="font-spin-display block text-base font-semibold text-slate-900">
                    {tool.label}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {tool.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="yn-faq" aria-labelledby="yn-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="yn-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {YES_NO_PICKER_FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-slate-200 bg-white p-4 open:shadow-sm"
              >
                <summary className="font-spin-display cursor-pointer list-none text-base font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">
                    {item.question}
                    <span className="mt-0.5 text-slate-400 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
