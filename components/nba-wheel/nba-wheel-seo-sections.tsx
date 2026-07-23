import Link from "next/link"
import {
  NBA_WHEEL_ARTICLE_INTRO,
  NBA_WHEEL_ARTICLE_TITLE,
  NBA_WHEEL_CLUSTER_LINKS,
  NBA_WHEEL_COMPARISON,
  NBA_WHEEL_CREATE_POINTS,
  NBA_WHEEL_CUSTOMIZE_STEPS,
  NBA_WHEEL_EEAT_TIPS,
  NBA_WHEEL_FAQ_ITEMS,
  NBA_WHEEL_FEATURES_REAL,
  NBA_WHEEL_H1,
  NBA_WHEEL_HERO_INTRO,
  NBA_WHEEL_HOW_IT_WORKS,
  NBA_WHEEL_ON_THIS_PAGE,
  NBA_WHEEL_OPTIONS_GUIDE,
  NBA_WHEEL_POPULAR_TEMPLATES,
  NBA_WHEEL_RELATED_TOOLS,
  NBA_WHEEL_USE_CASES,
  NBA_WHEEL_WHATS_ON_WHEEL,
  NBA_WHEEL_WHY_POINTS,
} from "@/lib/nba-wheel-seo"
import {
  WheelGuideComparisonSection,
  WheelGuideCustomizeSection,
  WheelGuideEeatSection,
  WheelGuideFeaturesSection,
  WheelGuideHowItWorksSection,
  WheelGuideWhatsOnSection,
} from "@/components/picker-wheel/wheel-guide-extra-sections"

/** SEO H1 + pitch — below the tool */
export function NbaWheelSeoIntro() {
  return (
    <section
      aria-labelledby="nba-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="nba-wheel-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {NBA_WHEEL_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {NBA_WHEEL_HERO_INTRO}
      </p>
    </section>
  )
}

export default function NbaWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="nba-wheel-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="nba-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {NBA_WHEEL_ON_THIS_PAGE.map((item) => (
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
          id="nba-spin-wheel"
          aria-labelledby="nba-spin-heading"
          className="scroll-mt-24"
        >
          <h2
            id="nba-spin-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {NBA_WHEEL_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {NBA_WHEEL_ARTICLE_INTRO.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>

        <WheelGuideWhatsOnSection
          id="nba-whats-on"
          heading="What You Can Put on the Wheel"
          items={NBA_WHEEL_WHATS_ON_WHEEL}
        />

        <WheelGuideFeaturesSection
          id="nba-features"
          heading="Features on This Page"
          intro="Most NBA picker features live in the wheel above and the Inputs sidebar—these are the highlights before you dive into every control."
          features={NBA_WHEEL_FEATURES_REAL}
        />

        <section
          id="nba-create"
          aria-labelledby="nba-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="nba-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Build Your NBA Team Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Load all 30 teams, filter by conference or division, customize display options, and save
            wheels you reuse every fantasy season.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {NBA_WHEEL_CREATE_POINTS.map((point) => (
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
            {NBA_WHEEL_POPULAR_TEMPLATES.map((item) => (
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
          id="nba-how-it-works"
          heading="How the NBA Wheel Works"
          intro="From conference filter to franchise pick in four steps."
          steps={NBA_WHEEL_HOW_IT_WORKS}
          accent="emerald"
        />

        <section
          id="nba-options"
          aria-labelledby="nba-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="nba-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Inputs sidebar holds most NBA settings. This guide covers favorites, comparison,
            team details, franchise statistics, conference filters, display modes, AI suggestions,
            spin history, achievements, and every control before you spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {NBA_WHEEL_OPTIONS_GUIDE.map((option) => (
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
          id="nba-use-cases"
          aria-labelledby="nba-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="nba-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Ways to Use an NBA Picker Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From fantasy drafts to classroom trivia, a random NBA team spinner fits any moment you
            need a fair franchise pick. Team names are for entertainment only—not affiliated with
            the NBA.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {NBA_WHEEL_USE_CASES.map((group) => (
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
          id="nba-why"
          aria-labelledby="nba-why-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="nba-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use an NBA Picker Wheel
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {NBA_WHEEL_WHY_POINTS.map((point) => (
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
          id="nba-comparison"
          heading="NBA Picker Wheel vs Random Team Generator"
          intro="People often compare an NBA team wheel with a one-click random team generator. Both can pick a franchise—the wheel adds a shared visual spin, conference filters, and more engagement for groups."
          rows={NBA_WHEEL_COMPARISON}
          wheelLabel="NBA Picker Wheel"
          generatorLabel="Random Team Generator"
        />

        <WheelGuideEeatSection
          id="nba-tips"
          heading="Fairness Tips & Best Practices"
          intro="Most NBA pickers stop at “spin and go.” These notes help you run fair, transparent team draws for drafts, classrooms, and watch parties."
          sections={NBA_WHEEL_EEAT_TIPS}
        />

        <WheelGuideCustomizeSection
          id="nba-customize"
          heading="How to Customize Your NBA Wheel"
          steps={NBA_WHEEL_CUSTOMIZE_STEPS}
          accent="emerald"
        />

        <section
          id="nba-related"
          aria-labelledby="nba-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="nba-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NBA_WHEEL_RELATED_TOOLS.map((item) => (
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
          id="nba-cluster"
          aria-labelledby="nba-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="nba-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            NBA Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for NBA team spinners. Each card opens its own dedicated
            page with matching conference or division settings—for baseball franchises, use MLB under
            Related Tools above.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NBA_WHEEL_CLUSTER_LINKS.map((item) => (
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

        <section id="nba-faq" aria-labelledby="nba-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="nba-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {NBA_WHEEL_FAQ_ITEMS.map((item) => (
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
