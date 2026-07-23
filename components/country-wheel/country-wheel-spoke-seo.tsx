import Link from "next/link"
import {
  COUNTRY_WHEEL_OPTIONS_GUIDE,
  COUNTRY_WHEEL_PATH,
  COUNTRY_WHEEL_POPULAR_TEMPLATES,
} from "@/lib/country-wheel-seo"
import {
  getCountrySpokeSiblings,
  type CountryWheelSpokeSeo,
} from "@/lib/country-wheel-spokes"

export function CountryWheelSpokeSeoIntro({ spoke }: { spoke: CountryWheelSpokeSeo }) {
  return (
    <section
      aria-labelledby="country-spoke-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="country-spoke-seo-h1"
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

export function CountryWheelSpokeSeoSections({ spoke }: { spoke: CountryWheelSpokeSeo }) {
  const siblings = getCountrySpokeSiblings(spoke)
  const toc = [
    { id: "country-spoke-popular", label: "Popular country templates" },
    { id: "country-spoke-guide", label: "Guide" },
    { id: "country-spoke-options", label: "Features & options" },
    { id: "country-spoke-unique", label: spoke.uniqueSection.title },
    { id: "country-spoke-cluster", label: "Related country templates" },
    { id: "country-spoke-faq", label: "FAQ" },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      {/* Popular templates */}
      <section
        id="country-spoke-popular"
        aria-labelledby="country-spoke-popular-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="country-spoke-popular-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Popular Country Templates
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Each template is its own page with matching countries. Jump to another Country Picker Wheel
          tool, or open the{" "}
          <Link
            href={COUNTRY_WHEEL_PATH}
            className="font-medium text-emerald-700 underline-offset-2 hover:underline"
          >
            main Country Picker Wheel
          </Link>
          .
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRY_WHEEL_POPULAR_TEMPLATES.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block h-full rounded-xl border p-4 transition-colors ${
                  item.href === spoke.path
                    ? "border-emerald-400 bg-emerald-50/70"
                    : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
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

      <article id="country-spoke-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Country template guide
        </p>
        <nav
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
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

        {/* Guide */}
        <section
          id="country-spoke-guide"
          aria-labelledby="country-spoke-guide-heading"
          className="scroll-mt-24"
        >
          <h2
            id="country-spoke-guide-heading"
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

        {/* Options */}
        <section
          id="country-spoke-options"
          aria-labelledby="country-spoke-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-spoke-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Features &amp; Options on This Template
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This spoke loads a pre-filtered country set. Every other control—display modes,
            elimination, results history, and more—works the same as on the{" "}
            <Link
              href={COUNTRY_WHEEL_PATH}
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              main Country Picker Wheel
            </Link>
            .
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {COUNTRY_WHEEL_OPTIONS_GUIDE.map((option) => (
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

        {/* Unique section */}
        <section
          id="country-spoke-unique"
          aria-labelledby="country-spoke-unique-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-spoke-unique-heading"
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

        {/* Siblings / cluster */}
        <section
          id="country-spoke-cluster"
          aria-labelledby="country-spoke-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-spoke-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Country Templates
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.slice(0, 6).map((sib) => (
              <li key={sib.path}>
                <Link
                  href={sib.path}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
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

        {/* FAQ */}
        <section
          id="country-spoke-faq"
          aria-labelledby="country-spoke-faq-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-spoke-faq-heading"
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
