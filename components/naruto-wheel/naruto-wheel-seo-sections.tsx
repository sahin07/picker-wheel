import Link from "next/link"
import {
  WheelGuideCustomizeSection,
  WheelGuideFeaturesSection,
  WheelGuideHowItWorksSection,
  WheelGuideWhatsOnSection,
} from "@/components/picker-wheel/wheel-guide-extra-sections"
import {
  NARUTO_WHEEL_ARTICLE_INTRO,
  NARUTO_WHEEL_ARTICLE_TITLE,
  NARUTO_WHEEL_COMPARISON,
  NARUTO_WHEEL_CREATE_POINTS,
  NARUTO_WHEEL_CUSTOMIZE_STEPS,
  NARUTO_WHEEL_DISCLAIMER,
  NARUTO_WHEEL_EEAT_TIPS,
  NARUTO_WHEEL_FAQ_ITEMS,
  NARUTO_WHEEL_FEATURES_REAL,
  NARUTO_WHEEL_H1,
  NARUTO_WHEEL_HERO_INTRO,
  NARUTO_WHEEL_HOW_IT_WORKS,
  NARUTO_WHEEL_ON_THIS_PAGE,
  NARUTO_WHEEL_OPTIONS_GUIDE,
  NARUTO_WHEEL_RELATED_TOOLS,
  NARUTO_WHEEL_USE_CASES_CONTENT,
  NARUTO_WHEEL_WHATS_ON_WHEEL,
  NARUTO_WHEEL_WHY_POINTS,
} from "@/lib/naruto-wheel-seo"
import { NARUTO_WHEEL_POPULAR_SPOKE_LINKS } from "@/lib/naruto-wheel-spokes"

export function NarutoWheelSeoIntro() {
  return (
    <section
      aria-labelledby="naruto-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h2
        id="naruto-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {NARUTO_WHEEL_H1}
      </h2>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {NARUTO_WHEEL_HERO_INTRO}
      </p>
    </section>
  )
}

export default function NarutoWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="naruto-wheel-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-orange-700">
          Complete guide
        </p>
        <nav
          id="naruto-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-orange-700">
            {NARUTO_WHEEL_ON_THIS_PAGE.map((item) => (
              <li key={item.id} className="marker:font-semibold">
                <a
                  href={`#${item.id}`}
                  className="text-orange-700 underline-offset-2 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section
          id="naruto-spin-wheel"
          aria-labelledby="naruto-spin-heading"
          className="scroll-mt-24"
        >
          <h2
            id="naruto-spin-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {NARUTO_WHEEL_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {NARUTO_WHEEL_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <WheelGuideWhatsOnSection
          id="naruto-whats-on"
          heading="What You Can Put on the Wheel"
          items={NARUTO_WHEEL_WHATS_ON_WHEEL}
        />

        <WheelGuideFeaturesSection
          id="naruto-features"
          heading="Features on This Page"
          intro="Most Naruto picker features live in the wheel above and the Inputs sidebar—these are the highlights before you dive into every control."
          features={NARUTO_WHEEL_FEATURES_REAL}
        />

        <section
          id="naruto-create"
          aria-labelledby="naruto-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="naruto-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Your Own Naruto Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Load characters, techniques, or domains—filter by category, customize display
            options, and save wheels you reuse for challenges, drafts, and watch parties.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {NARUTO_WHEEL_CREATE_POINTS.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-orange-100 bg-white/90 p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-orange-800">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
          <h3
            id="naruto-popular-wheels"
            className="font-spin-display mb-4 mt-10 text-xl font-bold text-slate-900 sm:text-2xl"
          >
            Popular Naruto Wheels
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NARUTO_WHEEL_POPULAR_SPOKE_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-orange-300 hover:bg-orange-50/50"
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
          id="naruto-how-it-works"
          heading="How the Naruto Wheel Works"
          intro="From blank template to character pick in four steps."
          steps={NARUTO_WHEEL_HOW_IT_WORKS}
          accent="violet"
        />

        <section
          id="naruto-options"
          aria-labelledby="naruto-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="naruto-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Inputs sidebar holds most Naruto settings. This guide covers favorites, comparison,
            collection stats, AI suggestions, category filters, display modes, spin history,
            achievements, and every control before you spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {NARUTO_WHEEL_OPTIONS_GUIDE.map((option) => (
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
          id="naruto-use-cases"
          aria-labelledby="naruto-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="naruto-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Ways to Use a Naruto Picker Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From character challenges to team drafts and Domain prompts—a Naruto picker wheel fits
            any moment you need a fair, visible pick. Series names are for entertainment only.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {NARUTO_WHEEL_USE_CASES_CONTENT.map((useCase) => (
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
          id="naruto-why"
          aria-labelledby="naruto-why-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="naruto-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a Naruto Picker Wheel?
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {NARUTO_WHEEL_WHY_POINTS.map((point) => (
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
          id="naruto-comparison"
          aria-labelledby="naruto-comparison-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="naruto-comparison-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Naruto Picker Wheel vs Random Anime Generator
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            People often compare a Naruto picker wheel with a one-click anime generator. Both can
            pick characters—the wheel adds a shared visual spin, customization, and more
            engagement for groups and streams.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[320px] text-left text-sm">
              <caption className="sr-only">
                Comparison of Naruto Picker Wheel and random anime generator
              </caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Aspect
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Naruto Picker Wheel
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Random Generator
                  </th>
                </tr>
              </thead>
              <tbody>
                {NARUTO_WHEEL_COMPARISON.map((row) => (
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
          id="naruto-tips"
          aria-labelledby="naruto-tips-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="naruto-tips-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Groups, Fairness &amp; Fan Use
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Practical tips for clubs, watch parties, and anyone who wants trustworthy spins.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {NARUTO_WHEEL_EEAT_TIPS.map((tip) => (
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
          id="naruto-customize"
          heading="How to Customize Your Naruto Wheel"
          steps={NARUTO_WHEEL_CUSTOMIZE_STEPS}
          accent="violet"
        />

        <section
          id="naruto-related"
          aria-labelledby="naruto-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="naruto-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NARUTO_WHEEL_RELATED_TOOLS.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-orange-300 hover:bg-orange-50/50"
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
          id="naruto-cluster"
          aria-labelledby="naruto-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="naruto-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Naruto Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for Naruto picker wheels—characters, villains,
            spirits, techniques, domains, and team drafts. Each card opens its own dedicated page.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NARUTO_WHEEL_POPULAR_SPOKE_LINKS.map((item) => (
              <li key={`cluster-${item.href}`}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-orange-300 hover:bg-orange-50/50"
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

        <section id="naruto-faq" aria-labelledby="naruto-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="naruto-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {NARUTO_WHEEL_FAQ_ITEMS.map((item) => (
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
          id="naruto-disclaimer"
          aria-labelledby="naruto-disclaimer-heading"
          className="mt-12 scroll-mt-24 rounded-xl border border-orange-200 bg-orange-50 p-5"
        >
          <h2
            id="naruto-disclaimer-heading"
            className="font-spin-display text-xl font-bold text-orange-950"
          >
            Independent Fan-Tool Disclaimer
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-orange-900">{NARUTO_WHEEL_DISCLAIMER}</p>
        </section>
      </article>
    </div>
  )
}
