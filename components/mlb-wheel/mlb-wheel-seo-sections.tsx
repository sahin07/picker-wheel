import Link from "next/link"
import {
  MLB_WHEEL_ARTICLE_INTRO,
  MLB_WHEEL_ARTICLE_TITLE,
  MLB_WHEEL_CLUSTER_LINKS,
  MLB_WHEEL_COMPARISON,
  MLB_WHEEL_CREATE_POINTS,
  MLB_WHEEL_CUSTOMIZE_STEPS,
  MLB_WHEEL_EEAT_TIPS,
  MLB_WHEEL_FAQ_ITEMS,
  MLB_WHEEL_FEATURES_REAL,
  MLB_WHEEL_H1,
  MLB_WHEEL_HERO_INTRO,
  MLB_WHEEL_HOW_IT_WORKS,
  MLB_WHEEL_ON_THIS_PAGE,
  MLB_WHEEL_OPTIONS_GUIDE,
  MLB_WHEEL_POPULAR_TEMPLATES,
  MLB_WHEEL_RELATED_TOOLS,
  MLB_WHEEL_USE_CASES,
  MLB_WHEEL_WHATS_ON_WHEEL,
  MLB_WHEEL_WHY_POINTS,
} from "@/lib/mlb-wheel-seo"
import {
  WheelGuideComparisonSection,
  WheelGuideCustomizeSection,
  WheelGuideEeatSection,
  WheelGuideFeaturesSection,
  WheelGuideHowItWorksSection,
  WheelGuideWhatsOnSection,
} from "@/components/picker-wheel/wheel-guide-extra-sections"

/** SEO H1 + pitch — below the tool */
export function MlbWheelSeoIntro() {
  return (
    <section
      aria-labelledby="mlb-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="mlb-wheel-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {MLB_WHEEL_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {MLB_WHEEL_HERO_INTRO}
      </p>
    </section>
  )
}

export default function MlbWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="mlb-wheel-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="mlb-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {MLB_WHEEL_ON_THIS_PAGE.map((item) => (
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
          id="mlb-spin-wheel"
          aria-labelledby="mlb-spin-heading"
          className="scroll-mt-24"
        >
          <h2
            id="mlb-spin-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {MLB_WHEEL_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {MLB_WHEEL_ARTICLE_INTRO.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>

        <WheelGuideWhatsOnSection
          id="mlb-whats-on"
          heading="What You Can Put on the Wheel"
          items={MLB_WHEEL_WHATS_ON_WHEEL}
        />

        <WheelGuideFeaturesSection
          id="mlb-features"
          heading="Features on This Page"
          intro="Most MLB picker features live in the wheel above and the Inputs sidebar—these are the highlights before you dive into every control."
          features={MLB_WHEEL_FEATURES_REAL}
        />

        <section
          id="mlb-create"
          aria-labelledby="mlb-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="mlb-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Build Your MLB Team Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Load all 30 teams, filter by league or division, customize display options, and save
            wheels you reuse every fantasy season.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {MLB_WHEEL_CREATE_POINTS.map((point) => (
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
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MLB_WHEEL_POPULAR_TEMPLATES.map((item) => (
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
          id="mlb-how-it-works"
          heading="How the MLB Wheel Works"
          intro="From league filter to franchise pick in four steps."
          steps={MLB_WHEEL_HOW_IT_WORKS}
          accent="emerald"
        />

        <section
          id="mlb-options"
          aria-labelledby="mlb-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="mlb-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Inputs sidebar holds most MLB settings. This guide covers favorites, comparison,
            team details, franchise statistics, league filters, display modes, AI suggestions, spin
            history, achievements, and every control before you spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {MLB_WHEEL_OPTIONS_GUIDE.map((option) => (
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
          id="mlb-use-cases"
          aria-labelledby="mlb-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="mlb-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Ways to Use an MLB Picker Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From fantasy drafts to classroom trivia, a random MLB team spinner fits any moment you
            need a fair franchise pick. Team names are for entertainment only—not affiliated with
            MLB.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {MLB_WHEEL_USE_CASES.map((group) => (
              <div
                key={group.category}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-3 text-lg font-semibold text-slate-900">
                  {group.category}
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section
          id="mlb-why"
          aria-labelledby="mlb-why-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="mlb-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use an MLB Picker Wheel
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {MLB_WHEEL_WHY_POINTS.map((point) => (
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

        <WheelGuideComparisonSection
          id="mlb-comparison"
          heading="MLB Picker Wheel vs Random Team Generator"
          intro="People often compare an MLB team wheel with a one-click random team generator. Both can pick a franchise—the wheel adds a shared visual spin, league filters, and more engagement for groups."
          rows={MLB_WHEEL_COMPARISON}
          wheelLabel="MLB Picker Wheel"
          generatorLabel="Random Team Generator"
        />

        <WheelGuideEeatSection
          id="mlb-tips"
          heading="Fairness Tips & Best Practices"
          intro="Most MLB pickers stop at “spin and go.” These notes help you run fair, transparent team draws for drafts, classrooms, and watch parties."
          sections={MLB_WHEEL_EEAT_TIPS}
        />

        <WheelGuideCustomizeSection
          id="mlb-customize"
          heading="How to Customize Your MLB Wheel"
          steps={MLB_WHEEL_CUSTOMIZE_STEPS}
          accent="emerald"
        />

        <section
          id="mlb-related"
          aria-labelledby="mlb-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="mlb-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MLB_WHEEL_RELATED_TOOLS.map((item) => (
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
          id="mlb-cluster"
          aria-labelledby="mlb-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="mlb-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            MLB Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for MLB team spinners. Each card opens its own dedicated
            page with matching league or division settings—for basketball franchises, use NBA under
            Related Tools above.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MLB_WHEEL_CLUSTER_LINKS.map((item) => (
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

        <section id="mlb-faq" aria-labelledby="mlb-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="mlb-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {MLB_WHEEL_FAQ_ITEMS.map((item) => (
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
