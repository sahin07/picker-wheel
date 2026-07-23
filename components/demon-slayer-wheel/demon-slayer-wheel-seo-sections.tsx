import Link from "next/link"
import {
  WheelGuideCustomizeSection,
  WheelGuideFeaturesSection,
  WheelGuideHowItWorksSection,
  WheelGuideWhatsOnSection,
} from "@/components/picker-wheel/wheel-guide-extra-sections"
import {
  DEMON_SLAYER_WHEEL_ARTICLE_INTRO,
  DEMON_SLAYER_WHEEL_ARTICLE_TITLE,
  DEMON_SLAYER_WHEEL_COMPARISON,
  DEMON_SLAYER_WHEEL_CREATE_POINTS,
  DEMON_SLAYER_WHEEL_CUSTOMIZE_STEPS,
  DEMON_SLAYER_WHEEL_DISCLAIMER,
  DEMON_SLAYER_WHEEL_EEAT_TIPS,
  DEMON_SLAYER_WHEEL_FAQ_ITEMS,
  DEMON_SLAYER_WHEEL_FEATURES_REAL,
  DEMON_SLAYER_WHEEL_H1,
  DEMON_SLAYER_WHEEL_HERO_INTRO,
  DEMON_SLAYER_WHEEL_HOW_IT_WORKS,
  DEMON_SLAYER_WHEEL_ON_THIS_PAGE,
  DEMON_SLAYER_WHEEL_OPTIONS_GUIDE,
  DEMON_SLAYER_WHEEL_RELATED_TOOLS,
  DEMON_SLAYER_WHEEL_USE_CASES_CONTENT,
  DEMON_SLAYER_WHEEL_WHATS_ON_WHEEL,
  DEMON_SLAYER_WHEEL_WHY_POINTS,
} from "@/lib/demon-slayer-wheel-seo"
import { DEMON_SLAYER_WHEEL_POPULAR_SPOKE_LINKS } from "@/lib/demon-slayer-wheel-spokes"

export function DemonSlayerWheelSeoIntro() {
  return (
    <section
      aria-labelledby="ds-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="ds-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {DEMON_SLAYER_WHEEL_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {DEMON_SLAYER_WHEEL_HERO_INTRO}
      </p>
    </section>
  )
}

export default function DemonSlayerWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="ds-wheel-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-violet-700">
          Complete guide
        </p>
        <nav
          id="ds-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-violet-700">
            {DEMON_SLAYER_WHEEL_ON_THIS_PAGE.map((item) => (
              <li key={item.id} className="marker:font-semibold">
                <a
                  href={`#${item.id}`}
                  className="text-violet-700 underline-offset-2 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section
          id="ds-spin-wheel"
          aria-labelledby="ds-spin-heading"
          className="scroll-mt-24"
        >
          <h2
            id="ds-spin-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {DEMON_SLAYER_WHEEL_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {DEMON_SLAYER_WHEEL_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <WheelGuideWhatsOnSection
          id="ds-whats-on"
          heading="What You Can Put on the Wheel"
          items={DEMON_SLAYER_WHEEL_WHATS_ON_WHEEL}
        />

        <WheelGuideFeaturesSection
          id="ds-features"
          heading="Features on This Page"
          intro="Most Demon Slayer picker features live in the wheel above and the Inputs sidebar—these are the highlights before you dive into every control."
          features={DEMON_SLAYER_WHEEL_FEATURES_REAL}
        />

        <section
          id="ds-create"
          aria-labelledby="ds-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="ds-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Your Own Demon Slayer Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Load characters, Hashira, demons, breathing styles, or Nichirin colors—filter by category, customize display
            options, and save wheels you reuse for challenges, drafts, and watch parties.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {DEMON_SLAYER_WHEEL_CREATE_POINTS.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-violet-100 bg-white/90 p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-violet-800">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
          <h3
            id="ds-popular-wheels"
            className="font-spin-display mb-4 mt-10 text-xl font-bold text-slate-900 sm:text-2xl"
          >
            Popular Demon Slayer Wheels
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DEMON_SLAYER_WHEEL_POPULAR_SPOKE_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-violet-300 hover:bg-violet-50/50"
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
          id="ds-how-it-works"
          heading="How the Demon Slayer Wheel Works"
          intro="From blank template to character pick in four steps."
          steps={DEMON_SLAYER_WHEEL_HOW_IT_WORKS}
          accent="violet"
        />

        <section
          id="ds-options"
          aria-labelledby="ds-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="ds-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Inputs sidebar holds most Demon Slayer settings. This guide covers favorites, comparison,
            collection stats, AI suggestions, category filters, display modes, spin history,
            achievements, and every control before you spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {DEMON_SLAYER_WHEEL_OPTIONS_GUIDE.map((option) => (
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
          id="ds-use-cases"
          aria-labelledby="ds-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="ds-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Ways to Use a Demon Slayer Picker Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From character challenges to team drafts and Domain prompts—a Demon Slayer picker wheel fits
            any moment you need a fair, visible pick. Series names are for entertainment only.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {DEMON_SLAYER_WHEEL_USE_CASES_CONTENT.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                  {useCase.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="ds-why"
          aria-labelledby="ds-why-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="ds-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a Demon Slayer Picker Wheel?
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {DEMON_SLAYER_WHEEL_WHY_POINTS.map((point) => (
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
          id="ds-comparison"
          aria-labelledby="ds-comparison-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="ds-comparison-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Demon Slayer Picker Wheel vs Random Anime Generator
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            People often compare a Demon Slayer picker wheel with a one-click anime generator. Both can
            pick characters—the wheel adds a shared visual spin, customization, and more
            engagement for groups and streams.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[320px] text-left text-sm">
              <caption className="sr-only">
                Comparison of Demon Slayer Picker Wheel and random anime generator
              </caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Aspect
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Demon Slayer Picker Wheel
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Random Generator
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEMON_SLAYER_WHEEL_COMPARISON.map((row) => (
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
          id="ds-tips"
          aria-labelledby="ds-tips-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="ds-tips-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Groups, Fairness &amp; Fan Use
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Practical tips for clubs, watch parties, and anyone who wants trustworthy spins.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {DEMON_SLAYER_WHEEL_EEAT_TIPS.map((tip) => (
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
          id="ds-customize"
          heading="How to Customize Your Demon Slayer Wheel"
          steps={DEMON_SLAYER_WHEEL_CUSTOMIZE_STEPS}
          accent="violet"
        />

        <section
          id="ds-related"
          aria-labelledby="ds-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="ds-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DEMON_SLAYER_WHEEL_RELATED_TOOLS.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-violet-300 hover:bg-violet-50/50"
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
          id="ds-cluster"
          aria-labelledby="ds-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="ds-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Demon Slayer Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for Demon Slayer picker wheels—characters, Hashira,
            Upper Rank demons, breathing styles, Nichirin colors, and Corps members. Each card opens its own dedicated page.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DEMON_SLAYER_WHEEL_POPULAR_SPOKE_LINKS.map((item) => (
              <li key={`cluster-${item.href}`}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-violet-300 hover:bg-violet-50/50"
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

        <section id="ds-faq" aria-labelledby="ds-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="ds-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {DEMON_SLAYER_WHEEL_FAQ_ITEMS.map((item) => (
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

        <section
          id="ds-disclaimer"
          aria-labelledby="ds-disclaimer-heading"
          className="mt-12 scroll-mt-24 rounded-xl border border-violet-200 bg-violet-50 p-5"
        >
          <h2
            id="ds-disclaimer-heading"
            className="font-spin-display text-xl font-bold text-violet-950"
          >
            Independent Fan-Tool Disclaimer
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-violet-900">{DEMON_SLAYER_WHEEL_DISCLAIMER}</p>
        </section>
      </article>
    </div>
  )
}
