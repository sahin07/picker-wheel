import Link from "next/link"
import {
  COUNTRY_WHEEL_ARTICLE_INTRO,
  COUNTRY_WHEEL_ARTICLE_TITLE,
  COUNTRY_WHEEL_CLUSTER_LINKS,
  COUNTRY_WHEEL_COMPARISON,
  COUNTRY_WHEEL_CREATE_POINTS,
  COUNTRY_WHEEL_CUSTOMIZE_STEPS,
  COUNTRY_WHEEL_EEAT_TIPS,
  COUNTRY_WHEEL_FAQ_ITEMS,
  COUNTRY_WHEEL_FEATURES_REAL,
  COUNTRY_WHEEL_H1,
  COUNTRY_WHEEL_HERO_INTRO,
  COUNTRY_WHEEL_HOW_IT_WORKS,
  COUNTRY_WHEEL_ON_THIS_PAGE,
  COUNTRY_WHEEL_OPTIONS_GUIDE,
  COUNTRY_WHEEL_POPULAR_TEMPLATES,
  COUNTRY_WHEEL_RELATED_TOOLS,
  COUNTRY_WHEEL_USE_CASES_COPY,
  COUNTRY_WHEEL_WHATS_ON_WHEEL,
  COUNTRY_WHEEL_WHY_POINTS,
} from "@/lib/country-wheel-seo"
import { WheelGuideWhatsOnSection } from "@/components/picker-wheel/wheel-guide-extra-sections"

/** SEO H1 + pitch — rendered below the tool */
export function CountryWheelSeoIntro() {
  return (
    <section
      aria-labelledby="country-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="country-wheel-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {COUNTRY_WHEEL_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {COUNTRY_WHEEL_HERO_INTRO}
      </p>
    </section>
  )
}

export default function CountryWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="country-wheel-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="country-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {COUNTRY_WHEEL_ON_THIS_PAGE.map((item) => (
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

        {/* Article intro */}
        <section
          id="country-spin-wheel"
          aria-labelledby="country-spin-heading"
          className="scroll-mt-24"
        >
          <h2
            id="country-spin-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {COUNTRY_WHEEL_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {COUNTRY_WHEEL_ARTICLE_INTRO.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>

        {/* What's on the wheel */}
        <WheelGuideWhatsOnSection
          id="country-whats-on"
          heading="What You Can Put on the Wheel"
          items={COUNTRY_WHEEL_WHATS_ON_WHEEL}
        />

        {/* Features */}
        <section
          id="country-features"
          aria-labelledby="country-features-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-features-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Features on This Page
          </h2>
          <p className="mb-4 text-base leading-relaxed text-slate-600">
            Most Country Picker Wheel features live in the wheel above and the Inputs
            sidebar—these are the highlights before you dive in.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
            {COUNTRY_WHEEL_FEATURES_REAL.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Popular Country Wheels */}
        <section
          id="country-popular"
          aria-labelledby="country-popular-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-popular-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Popular Country Picker Wheels
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            One-click templates instead of a blank wheel—continents, G20, UN members, and
            population leaders. Load a list, customize, and spin.
          </p>
          <ul className="mb-6 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
            {COUNTRY_WHEEL_CREATE_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COUNTRY_WHEEL_POPULAR_TEMPLATES.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
                >
                  <span className="font-spin-display block text-sm font-semibold text-slate-900">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works — kept for depth; Spin H2 above covers brief */}
        <section
          id="country-how-it-works"
          aria-labelledby="country-how-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-how-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How the Country Picker Wheel Works
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From continent filter to country pick in four steps.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2">
            {COUNTRY_WHEEL_HOW_IT_WORKS.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-emerald-100 bg-white/90 p-5 shadow-sm"
              >
                <span className="font-spin-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-slate-600 self-center">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Options */}
        <section
          id="country-options"
          aria-labelledby="country-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Inputs sidebar holds most Country Picker Wheel settings. This guide covers
            region filters, display modes, action modes, results history, achievements, and
            every control before you spin.
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

        {/* Use cases */}
        <section
          id="country-use-cases"
          aria-labelledby="country-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Ways to Use a Country Picker Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From geography education and travel planning to games and content creation, a
            Country Picker Wheel fits whenever you need a fair, visual country pick.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {COUNTRY_WHEEL_USE_CASES_COPY.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why */}
        <section
          id="country-why"
          aria-labelledby="country-why-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a Country Picker Wheel?
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
            {COUNTRY_WHEEL_WHY_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        {/* Comparison */}
        <section
          id="country-comparison"
          aria-labelledby="country-comparison-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-comparison-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Country Picker Wheel vs Random Country Generator
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Both help you pick a country at random. This comparison helps you choose the right
            experience—and helps the page rank for both keyword families.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {COUNTRY_WHEEL_COMPARISON.map((col) => (
              <div
                key={col.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-3 text-lg font-semibold text-slate-900">
                  {col.title}
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {col.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Fairness tips */}
        <section
          id="country-tips"
          aria-labelledby="country-tips-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-tips-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Fairness Tips &amp; Best Practices
          </h2>
          <p className="mb-4 text-base leading-relaxed text-slate-600">
            Most country pickers stop at &ldquo;spin and go.&rdquo; These notes help you run
            fair, transparent draws for quizzes, trips, and streams.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
            {COUNTRY_WHEEL_EEAT_TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        {/* Customize */}
        <section
          id="country-customize"
          aria-labelledby="country-customize-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-customize-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Customize Your Country Picker Wheel
          </h2>
          <ol className="mt-6 space-y-5">
            {COUNTRY_WHEEL_CUSTOMIZE_STEPS.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-spin-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-base leading-relaxed text-slate-600 self-center">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Related tools */}
        <section
          id="country-related"
          aria-labelledby="country-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COUNTRY_WHEEL_RELATED_TOOLS.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
                >
                  <span className="font-spin-display block text-sm font-semibold text-slate-900">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Topic cluster */}
        <section
          id="country-cluster"
          aria-labelledby="country-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Country Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for country spinners. Each card opens its own
            dedicated page with matching continent or travel settings.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COUNTRY_WHEEL_CLUSTER_LINKS.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
                >
                  <span className="font-spin-display block text-sm font-semibold text-slate-900">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section
          id="country-faq"
          aria-labelledby="country-faq-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="country-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {COUNTRY_WHEEL_FAQ_ITEMS.map((item) => (
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
