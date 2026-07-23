import Link from "next/link"
import {
  LOL_WHEEL_ARTICLE_INTRO,
  LOL_WHEEL_ARTICLE_TITLE,
  LOL_WHEEL_CLUSTER_LINKS,
  LOL_WHEEL_COMPARISON,
  LOL_WHEEL_CREATE_POINTS,
  LOL_WHEEL_CUSTOMIZE_STEPS,
  LOL_WHEEL_EEAT_TIPS,
  LOL_WHEEL_FAQ_ITEMS,
  LOL_WHEEL_FEATURES_REAL,
  LOL_WHEEL_H1,
  LOL_WHEEL_HERO_INTRO,
  LOL_WHEEL_HOW_IT_WORKS,
  LOL_WHEEL_ON_THIS_PAGE,
  LOL_WHEEL_OPTIONS_GUIDE,
  LOL_WHEEL_POPULAR_TEMPLATES,
  LOL_WHEEL_RELATED_TOOLS,
  LOL_WHEEL_USE_CASES,
  LOL_WHEEL_WHATS_ON_WHEEL,
  LOL_WHEEL_WHY_POINTS,
} from "@/lib/lol-wheel-seo"
import {
  WheelGuideComparisonSection,
  WheelGuideCustomizeSection,
  WheelGuideEeatSection,
  WheelGuideFeaturesSection,
  WheelGuideHowItWorksSection,
  WheelGuideWhatsOnSection,
} from "@/components/picker-wheel/wheel-guide-extra-sections"

/** SEO H1 + pitch — below the tool */
export function LolWheelSeoIntro() {
  return (
    <section
      aria-labelledby="lol-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="lol-wheel-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {LOL_WHEEL_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {LOL_WHEEL_HERO_INTRO}
      </p>
    </section>
  )
}

export default function LolWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="lol-wheel-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-sky-700">
          Complete guide
        </p>
        <nav
          id="lol-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-sky-700">
            {LOL_WHEEL_ON_THIS_PAGE.map((item) => (
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
          id="lol-spin-wheel"
          aria-labelledby="lol-spin-heading"
          className="scroll-mt-24"
        >
          <h2
            id="lol-spin-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {LOL_WHEEL_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {LOL_WHEEL_ARTICLE_INTRO.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>

        <WheelGuideWhatsOnSection
          id="lol-whats-on"
          heading="What You Can Put on the Wheel"
          items={LOL_WHEEL_WHATS_ON_WHEEL}
        />

        <WheelGuideFeaturesSection
          id="lol-features"
          heading="Features on This Page"
          intro="Most LoL Wheel features live in the wheel above and the Inputs sidebar—these are the highlights before you dive into every control."
          features={LOL_WHEEL_FEATURES_REAL}
        />

        <section
          id="lol-create"
          aria-labelledby="lol-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lol-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Your Own LoL Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Create your own LoL Wheel: load the curated champion roster, filter by role or
            playstyle, remove entries, add custom names, and save wheels you reuse for ranked
            nights, challenges, and streams.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {LOL_WHEEL_CREATE_POINTS.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-sky-100 bg-white/90 p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-sky-800">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LOL_WHEEL_POPULAR_TEMPLATES.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-sky-300 hover:bg-sky-50/50"
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
          id="lol-how-it-works"
          heading="How the LoL Wheel Works"
          intro="From role filter to champion pick in four steps."
          steps={LOL_WHEEL_HOW_IT_WORKS}
          accent="violet"
        />

        <section
          id="lol-options"
          aria-labelledby="lol-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lol-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Inputs sidebar holds most LoL settings. This guide covers role filters, display
            modes, action modes, results history, achievements, and every control before you spin.
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
          id="lol-use-cases"
          aria-labelledby="lol-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lol-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Ways to Use a LoL Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From ranked fill picks to stream challenges, a random LoL champion spinner fits any
            moment you need a fair pick. Names and facts are for entertainment only—not affiliated
            with Riot Games.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {LOL_WHEEL_USE_CASES.map((group) => (
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
          id="lol-why"
          aria-labelledby="lol-why-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lol-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a LoL Wheel?
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {LOL_WHEEL_WHY_POINTS.map((point) => (
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
          id="lol-comparison"
          heading="LoL Wheel vs Random Champion Generator"
          intro="Both help you pick a League champion at random. The LoL Wheel adds an interactive spin for streams and groups; a plain generator is usually a one-click result."
          rows={LOL_WHEEL_COMPARISON}
          wheelLabel="LoL Wheel"
          generatorLabel="Random Champion Generator"
        />

        <WheelGuideEeatSection
          id="lol-tips"
          heading="Fairness Tips & Best Practices"
          intro="Most champion pickers stop at “spin and go.” These notes help you run fair, transparent draws for challenges, drafts, and streams."
          sections={LOL_WHEEL_EEAT_TIPS}
        />

        <WheelGuideCustomizeSection
          id="lol-customize"
          heading="How to Customize Your LoL Wheel"
          steps={LOL_WHEEL_CUSTOMIZE_STEPS}
          accent="violet"
        />

        <section
          id="lol-related"
          aria-labelledby="lol-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lol-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LOL_WHEEL_RELATED_TOOLS.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-sky-300 hover:bg-sky-50/50"
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
          id="lol-cluster"
          aria-labelledby="lol-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="lol-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            LoL Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for LoL champion spinners. Each card opens its own dedicated
            page with matching role, playstyle, or curated settings.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LOL_WHEEL_CLUSTER_LINKS.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-sky-300 hover:bg-sky-50/50"
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

        <section id="lol-faq" aria-labelledby="lol-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="lol-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {LOL_WHEEL_FAQ_ITEMS.map((item) => (
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
