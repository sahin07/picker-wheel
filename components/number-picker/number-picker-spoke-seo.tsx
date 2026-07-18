import Link from "next/link"
import {
  NUMBER_PICKER_PATH,
  NUMBER_PICKER_POPULAR_WHEELS,
} from "@/lib/number-picker-seo"
import {
  getSpokeSiblings,
  type NumberPickerSpokeSeo,
} from "@/lib/number-picker-spokes"

export function NumberPickerSpokeSeoIntro({ spoke }: { spoke: NumberPickerSpokeSeo }) {
  return (
    <section
      aria-labelledby="number-spoke-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="number-spoke-seo-h1"
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

export function NumberPickerSpokeSeoSections({ spoke }: { spoke: NumberPickerSpokeSeo }) {
  const siblings = getSpokeSiblings(spoke)
  const toc = [
    { id: "np-popular-wheels", label: "Popular number wheels" },
    { id: "np-spoke-guide", label: "Guide" },
    { id: "np-spoke-unique", label: spoke.uniqueSection.title },
    { id: "np-spoke-cluster", label: "Related number wheels" },
    { id: "np-spoke-faq", label: "FAQ" },
  ]

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
          Jump into another range or mode. Dedicated pages keep their own copy; other links open the
          main Number Picker Wheel with matching settings.
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

      <article id="number-spoke-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Number wheel guide
        </p>

        <nav
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {toc.map((item) => (
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

        <section id="np-spoke-guide" aria-labelledby="np-spoke-guide-heading" className="scroll-mt-24">
          <h2
            id="np-spoke-guide-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.articleTitle}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {spoke.articleIntro.map((paragraph) => (
              <p key={paragraph.slice(0, 56)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Ready to spin? Use the wheel above, then explore{" "}
            <Link
              href={NUMBER_PICKER_PATH}
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              the main Random Number Picker Wheel
            </Link>{" "}
            for any custom range or mode.
          </p>
        </section>

        <section
          id="np-spoke-unique"
          aria-labelledby="np-spoke-unique-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="np-spoke-unique-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.uniqueSection.title}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">{spoke.uniqueSection.intro}</p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {spoke.uniqueSection.points.map((point) => (
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
          id="np-spoke-cluster"
          aria-labelledby="np-spoke-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="np-spoke-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Number Wheels
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Stay in the number cluster: jump to sibling tools or return to the pillar page for full
            customization.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li>
              <Link
                href={NUMBER_PICKER_PATH}
                className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
              >
                <span className="font-spin-display block text-base font-semibold text-slate-900">
                  Random Number Picker Wheel
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                  Main pillar — any range, presets, and custom number lists.
                </span>
              </Link>
            </li>
            {siblings.map((sibling) => (
              <li key={sibling.path}>
                <Link
                  href={sibling.path}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
                >
                  <span className="font-spin-display block text-base font-semibold text-slate-900">
                    {sibling.shortTitle}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {sibling.heroIntro.slice(0, 120)}…
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="np-spoke-faq" aria-labelledby="np-spoke-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="np-spoke-faq-heading"
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
