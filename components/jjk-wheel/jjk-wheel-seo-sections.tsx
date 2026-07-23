import Link from "next/link"
import {
  WheelGuideCustomizeSection,
  WheelGuideFeaturesSection,
  WheelGuideHowItWorksSection,
  WheelGuideWhatsOnSection,
} from "@/components/picker-wheel/wheel-guide-extra-sections"
import {
  JJK_WHEEL_ARTICLE_INTRO,
  JJK_WHEEL_ARTICLE_TITLE,
  JJK_WHEEL_COMPARISON,
  JJK_WHEEL_CREATE_POINTS,
  JJK_WHEEL_CUSTOMIZE_STEPS,
  JJK_WHEEL_DISCLAIMER,
  JJK_WHEEL_EEAT_TIPS,
  JJK_WHEEL_FAQ_ITEMS,
  JJK_WHEEL_FEATURES_REAL,
  JJK_WHEEL_H1,
  JJK_WHEEL_HERO_INTRO,
  JJK_WHEEL_HOW_IT_WORKS,
  JJK_WHEEL_ON_THIS_PAGE,
  JJK_WHEEL_OPTIONS_GUIDE,
  JJK_WHEEL_RELATED_TOOLS,
  JJK_WHEEL_USE_CASES_CONTENT,
  JJK_WHEEL_WHATS_ON_WHEEL,
  JJK_WHEEL_WHY_POINTS,
} from "@/lib/jjk-wheel-seo"
import { JJK_WHEEL_POPULAR_SPOKE_LINKS } from "@/lib/jjk-wheel-spokes"

export function JjkWheelSeoIntro() {
  return (
    <section
      aria-labelledby="jjk-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="jjk-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {JJK_WHEEL_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {JJK_WHEEL_HERO_INTRO}
      </p>
    </section>
  )
}

export default function JjkWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="jjk-wheel-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-violet-700">
          Complete guide
        </p>
        <nav
          id="jjk-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-violet-700">
            {JJK_WHEEL_ON_THIS_PAGE.map((item) => (
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
          id="jjk-spin-wheel"
          aria-labelledby="jjk-spin-heading"
          className="scroll-mt-24"
        >
          <h2
            id="jjk-spin-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {JJK_WHEEL_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {JJK_WHEEL_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <WheelGuideWhatsOnSection
          id="jjk-whats-on"
          heading="What You Can Put on the Wheel"
          items={JJK_WHEEL_WHATS_ON_WHEEL}
        />

        <WheelGuideFeaturesSection
          id="jjk-features"
          heading="Features on This Page"
          intro="Most JJK picker features live in the wheel above and the Inputs sidebar—these are the highlights before you dive into every control."
          features={JJK_WHEEL_FEATURES_REAL}
        />

        <section
          id="jjk-create"
          aria-labelledby="jjk-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="jjk-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Your Own Jujutsu Kaisen Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Load characters, techniques, or domains—filter by category, customize display
            options, and save wheels you reuse for challenges, drafts, and watch parties.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {JJK_WHEEL_CREATE_POINTS.map((point) => (
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
            id="jjk-popular-wheels"
            className="font-spin-display mb-4 mt-10 text-xl font-bold text-slate-900 sm:text-2xl"
          >
            Popular JJK Wheels
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JJK_WHEEL_POPULAR_SPOKE_LINKS.map((item) => (
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
          id="jjk-how-it-works"
          heading="How the JJK Wheel Works"
          intro="From blank template to character pick in four steps."
          steps={JJK_WHEEL_HOW_IT_WORKS}
          accent="violet"
        />

        <section
          id="jjk-options"
          aria-labelledby="jjk-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="jjk-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Inputs sidebar holds most JJK settings. This guide covers favorites, comparison,
            collection stats, AI suggestions, category filters, display modes, spin history,
            achievements, and every control before you spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {JJK_WHEEL_OPTIONS_GUIDE.map((option) => (
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
          id="jjk-use-cases"
          aria-labelledby="jjk-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="jjk-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Ways to Use a JJK Picker Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From character challenges to team drafts and Domain prompts—a JJK picker wheel fits
            any moment you need a fair, visible pick. Series names are for entertainment only.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {JJK_WHEEL_USE_CASES_CONTENT.map((useCase) => (
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
          id="jjk-why"
          aria-labelledby="jjk-why-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="jjk-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a JJK Picker Wheel?
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {JJK_WHEEL_WHY_POINTS.map((point) => (
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
          id="jjk-comparison"
          aria-labelledby="jjk-comparison-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="jjk-comparison-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            JJK Picker Wheel vs Random Anime Generator
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            People often compare a JJK picker wheel with a one-click anime generator. Both can
            pick characters—the wheel adds a shared visual spin, customization, and more
            engagement for groups and streams.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[320px] text-left text-sm">
              <caption className="sr-only">
                Comparison of JJK Picker Wheel and random anime generator
              </caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Aspect
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    JJK Picker Wheel
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Random Generator
                  </th>
                </tr>
              </thead>
              <tbody>
                {JJK_WHEEL_COMPARISON.map((row) => (
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
          id="jjk-tips"
          aria-labelledby="jjk-tips-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="jjk-tips-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Groups, Fairness &amp; Fan Use
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Practical tips for clubs, watch parties, and anyone who wants trustworthy spins.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {JJK_WHEEL_EEAT_TIPS.map((tip) => (
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
          id="jjk-customize"
          heading="How to Customize Your JJK Wheel"
          steps={JJK_WHEEL_CUSTOMIZE_STEPS}
          accent="violet"
        />

        <section
          id="jjk-related"
          aria-labelledby="jjk-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="jjk-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JJK_WHEEL_RELATED_TOOLS.map((item) => (
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
          id="jjk-cluster"
          aria-labelledby="jjk-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="jjk-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            JJK Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for Jujutsu Kaisen picker wheels—characters, villains,
            spirits, techniques, domains, and team drafts. Each card opens its own dedicated page.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JJK_WHEEL_POPULAR_SPOKE_LINKS.map((item) => (
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

        <section id="jjk-faq" aria-labelledby="jjk-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="jjk-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {JJK_WHEEL_FAQ_ITEMS.map((item) => (
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
          id="jjk-disclaimer"
          aria-labelledby="jjk-disclaimer-heading"
          className="mt-12 scroll-mt-24 rounded-xl border border-violet-200 bg-violet-50 p-5"
        >
          <h2
            id="jjk-disclaimer-heading"
            className="font-spin-display text-xl font-bold text-violet-950"
          >
            Independent Fan-Tool Disclaimer
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-violet-900">{JJK_WHEEL_DISCLAIMER}</p>
        </section>
      </article>
    </div>
  )
}
