import Link from "next/link"
import {
  STATE_WHEEL_ARTICLE_INTRO,
  STATE_WHEEL_ARTICLE_TITLE,
  STATE_WHEEL_CLUSTER_LINKS,
  STATE_WHEEL_COMPARISON,
  STATE_WHEEL_CREATE_POINTS,
  STATE_WHEEL_CUSTOMIZE_STEPS,
  STATE_WHEEL_EEAT_TIPS,
  STATE_WHEEL_FAQ_ITEMS,
  STATE_WHEEL_FEATURES_REAL,
  STATE_WHEEL_H1,
  STATE_WHEEL_HERO_INTRO,
  STATE_WHEEL_HOW_IT_WORKS,
  STATE_WHEEL_ON_THIS_PAGE,
  STATE_WHEEL_OPTIONS_GUIDE,
  STATE_WHEEL_POPULAR_TEMPLATES,
  STATE_WHEEL_RELATED_TOOLS,
  STATE_WHEEL_USE_CASES_COPY,
  STATE_WHEEL_WHATS_ON_WHEEL,
  STATE_WHEEL_WHY_POINTS,
} from "@/lib/state-wheel-seo"
import {
  WheelGuideCustomizeSection,
  WheelGuideFeaturesSection,
  WheelGuideHowItWorksSection,
  WheelGuideWhatsOnSection,
} from "@/components/picker-wheel/wheel-guide-extra-sections"

/** SEO H1 + pitch — rendered below the tool */
export function StateWheelSeoIntro() {
  return (
    <section
      aria-labelledby="state-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="state-wheel-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {STATE_WHEEL_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {STATE_WHEEL_HERO_INTRO}
      </p>
    </section>
  )
}

export default function StateWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="state-wheel-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="state-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {STATE_WHEEL_ON_THIS_PAGE.map((item) => (
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

        <section
          id="state-spin-wheel"
          aria-labelledby="state-spin-heading"
          className="scroll-mt-24"
        >
          <h2
            id="state-spin-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {STATE_WHEEL_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {STATE_WHEEL_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <WheelGuideWhatsOnSection
          id="state-whats-on"
          heading="What You Can Put on the Wheel"
          items={STATE_WHEEL_WHATS_ON_WHEEL}
        />

        <WheelGuideFeaturesSection
          id="state-features"
          heading="Features on This Page"
          intro="Most State Picker Wheel features live in the wheel above and the Inputs sidebar—these are the highlights before you dive into every control."
          features={STATE_WHEEL_FEATURES_REAL}
        />

        <section
          id="state-create"
          aria-labelledby="state-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="state-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Your Own State Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Build a classroom-ready states list in minutes—start from a template, filter by
            country, then spin.
          </p>
          <ul className="mb-2 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
            {STATE_WHEEL_CREATE_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        <section
          id="state-popular"
          aria-labelledby="state-popular-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="state-popular-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Popular State Picker Wheels
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            One-click templates for US states, Canadian provinces, Australian states, Japanese
            prefectures, and more. Load a list, customize, and spin.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STATE_WHEEL_POPULAR_TEMPLATES.map((item) => (
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

        <WheelGuideHowItWorksSection
          id="state-how-it-works"
          heading="How the State Picker Wheel Works"
          intro="From country filter to state pick in four clear steps."
          steps={STATE_WHEEL_HOW_IT_WORKS}
          accent="emerald"
        />

        <section
          id="state-options"
          aria-labelledby="state-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="state-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Inputs sidebar holds most State Picker Wheel settings. This guide covers country
            filters, display modes, action modes, results history, and every control before you
            spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {STATE_WHEEL_OPTIONS_GUIDE.map((option) => (
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
          id="state-use-cases"
          aria-labelledby="state-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="state-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Ways to Use a State Picker Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From geography education and trivia nights to road trips and content creation, a State
            Picker Wheel fits whenever you need a fair, visual state pick.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {STATE_WHEEL_USE_CASES_COPY.map((item) => (
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

        <section
          id="state-why"
          aria-labelledby="state-why-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="state-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a State Picker Wheel?
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
            {STATE_WHEEL_WHY_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        <section
          id="state-comparison"
          aria-labelledby="state-comparison-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="state-comparison-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            State Picker Wheel vs Random State Generator
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Both help you pick a state at random. This comparison helps you choose the right
            experience—and helps the page rank for both keyword families.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[320px] text-left text-sm">
              <caption className="sr-only">
                Comparison of State Picker Wheel and random state generator
              </caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Aspect
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    State Picker Wheel
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Random State Generator
                  </th>
                </tr>
              </thead>
              <tbody>
                {STATE_WHEEL_COMPARISON.map((row) => (
                  <tr key={row.aspect} className="border-t border-slate-100">
                    <th
                      scope="row"
                      className="px-4 py-3 font-spin-display font-semibold text-slate-800"
                    >
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

        <section
          id="state-tips"
          aria-labelledby="state-tips-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="state-tips-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Fairness Tips &amp; Best Practices
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Most state pickers stop at &ldquo;spin and go.&rdquo; These notes help you run fair,
            transparent draws for quizzes, road trips, and streams.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {STATE_WHEEL_EEAT_TIPS.map((tip) => (
              <li
                key={tip.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                  {tip.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{tip.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <WheelGuideCustomizeSection
          id="state-customize"
          heading="Customize Your State Picker Wheel"
          steps={STATE_WHEEL_CUSTOMIZE_STEPS}
          accent="emerald"
        />

        <section
          id="state-related"
          aria-labelledby="state-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="state-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STATE_WHEEL_RELATED_TOOLS.map((item) => (
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

        <section
          id="state-cluster"
          aria-labelledby="state-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="state-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            State Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for state and province spinners. Each card opens its own
            dedicated page with matching country defaults.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STATE_WHEEL_CLUSTER_LINKS.map((item) => (
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

        <section
          id="state-faq"
          aria-labelledby="state-faq-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="state-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {STATE_WHEEL_FAQ_ITEMS.map((item) => (
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
