import Link from "next/link"
import {
  LOL_WHEEL_OPTIONS_GUIDE,
  LOL_WHEEL_PATH,
  LOL_WHEEL_POPULAR_TEMPLATES,
} from "@/lib/lol-wheel-seo"
import {
  getLolSpokeSiblings,
  type LolWheelSpokeSeo,
} from "@/lib/lol-wheel-spokes"

export function LolWheelSpokeSeoIntro({ spoke }: { spoke: LolWheelSpokeSeo }) {
  return (
    <section
      aria-labelledby="lol-spoke-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="lol-spoke-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {spoke.h1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {spoke.heroIntro}
      </p>
    </section>
  )
}

export function LolWheelSpokeSeoSections({ spoke }: { spoke: LolWheelSpokeSeo }) {
  const siblings = getLolSpokeSiblings(spoke)
  const toc = [
    { id: "lol-spoke-popular", label: "Popular LoL templates" },
    { id: "lol-spoke-guide", label: "Guide" },
    { id: "lol-spoke-options", label: "Features & options" },
    { id: "lol-spoke-unique", label: spoke.uniqueSection.title },
    { id: "lol-spoke-cluster", label: "Related LoL templates" },
    { id: "lol-spoke-faq", label: "FAQ" },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <section
        id="lol-spoke-popular"
        aria-labelledby="lol-spoke-popular-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="lol-spoke-popular-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Popular LoL Templates
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Each template is its own page with matching champions. Jump to another LoL tool, or open
          the{" "}
          <Link
            href={LOL_WHEEL_PATH}
            className="font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            main LoL Wheel
          </Link>
          .
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LOL_WHEEL_POPULAR_TEMPLATES.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block h-full rounded-xl border p-4 transition-colors ${
                  item.href === spoke.path
                    ? "border-sky-400 bg-sky-50/70"
                    : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50"
                }`}
              >
                <span className="font-spin-display block text-base font-semibold text-slate-900">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <article id="lol-spoke-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-sky-700">
          LoL template guide
        </p>
        <nav
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-sky-700">
            {toc.map((item) => (
              <li key={item.id} className="marker:font-semibold">
                <a
                  href={`#${item.id}`}
                  className="text-sky-700 underline-offset-2 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section
          id="lol-spoke-guide"
          aria-labelledby="lol-spoke-guide-heading"
          className="scroll-mt-24"
        >
          <h2
            id="lol-spoke-guide-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.articleTitle}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {spoke.articleIntro.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </section>

        <section
          id="lol-spoke-options"
          aria-labelledby="lol-spoke-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lol-spoke-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Features &amp; Options on This Template
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This spoke loads a pre-filtered champion set. Every other control—display modes,
            elimination, results history, and more—works the same as on the{" "}
            <Link
              href={LOL_WHEEL_PATH}
              className="font-medium text-sky-700 underline-offset-2 hover:underline"
            >
              main LoL Wheel
            </Link>
            .
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {LOL_WHEEL_OPTIONS_GUIDE.map((option) => (
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
          id="lol-spoke-unique"
          aria-labelledby="lol-spoke-unique-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lol-spoke-unique-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.uniqueSection.title}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            {spoke.uniqueSection.intro}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {spoke.uniqueSection.points.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="lol-spoke-cluster"
          aria-labelledby="lol-spoke-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lol-spoke-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related LoL Templates
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.slice(0, 6).map((sib) => (
              <li key={sib.path}>
                <Link
                  href={sib.path}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-sky-300 hover:bg-sky-50/50"
                >
                  <span className="font-spin-display block text-sm font-semibold text-slate-900">
                    {sib.shortTitle}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {sib.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="lol-spoke-faq"
          aria-labelledby="lol-spoke-faq-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lol-spoke-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {spoke.faq.map((item) => (
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
