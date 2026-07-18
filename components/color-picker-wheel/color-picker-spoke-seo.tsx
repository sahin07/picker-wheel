import Link from "next/link"
import { COLOR_PICKER_PATH } from "@/lib/color-picker-seo"
import {
  getColorSpokeSiblings,
  type ColorPickerSpokeSeo,
} from "@/lib/color-picker-spokes"

export function ColorPickerSpokeSeoIntro({ spoke }: { spoke: ColorPickerSpokeSeo }) {
  return (
    <section
      aria-labelledby="color-spoke-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="color-spoke-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {spoke.h1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {spoke.heroIntro}
      </p>
      <p className="mt-3 text-center text-sm text-slate-500">
        Audience: {spoke.audience} ·{" "}
        <Link href={COLOR_PICKER_PATH} className="text-emerald-700 underline-offset-2 hover:underline">
          Back to Color Picker Wheel
        </Link>
      </p>
    </section>
  )
}

export function ColorPickerSpokeSeoSections({ spoke }: { spoke: ColorPickerSpokeSeo }) {
  const siblings = getColorSpokeSiblings(spoke)
  const toc = [
    { id: "cp-spoke-guide", label: "Guide" },
    { id: "cp-spoke-unique", label: spoke.uniqueSection.title },
    { id: "cp-spoke-cluster", label: "Related color wheels" },
    { id: "cp-spoke-faq", label: "FAQ" },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="color-spoke-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Color wheel guide
        </p>
        <nav
          id="cp-spoke-toc"
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

        <section id="cp-spoke-guide" aria-labelledby="cp-spoke-guide-heading" className="scroll-mt-24">
          <h2
            id="cp-spoke-guide-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.articleTitle}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {spoke.articleIntro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Tap a template in the Popular Color Wheels strip under the title to switch palettes, or
            open the main{" "}
            <Link href={COLOR_PICKER_PATH} className="text-emerald-700 underline-offset-2 hover:underline">
              Color Picker Wheel
            </Link>{" "}
            for spectrum spin, image sampling, and AI tools.
          </p>
        </section>

        <section
          id="cp-spoke-unique"
          aria-labelledby="cp-spoke-unique-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="cp-spoke-unique-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.uniqueSection.title}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">{spoke.uniqueSection.intro}</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spoke.uniqueSection.points.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5"
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
          id="cp-spoke-cluster"
          aria-labelledby="cp-spoke-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="cp-spoke-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Color Wheels
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((sibling) => (
              <li key={sibling.id}>
                <Link
                  href={sibling.path}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <span className="font-spin-display block text-sm font-semibold text-slate-900">
                    {sibling.shortTitle}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {sibling.audience}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={COLOR_PICKER_PATH}
                className="block h-full rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 transition-colors hover:border-emerald-300"
              >
                <span className="font-spin-display block text-sm font-semibold text-emerald-900">
                  Color Picker Wheel
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-emerald-800/80">
                  Pillar — all modes & templates
                </span>
              </Link>
            </li>
          </ul>
        </section>

        <section id="cp-spoke-faq" aria-labelledby="cp-spoke-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="cp-spoke-faq-heading"
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
