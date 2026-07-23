import Link from "next/link"
import {
  FORTNITE_WHEEL_ARTICLE_INTRO,
  FORTNITE_WHEEL_ARTICLE_TITLE,
  FORTNITE_WHEEL_CLUSTER_LINKS,
  FORTNITE_WHEEL_COMPARISON,
  FORTNITE_WHEEL_CREATE_POINTS,
  FORTNITE_WHEEL_CUSTOMIZE_STEPS,
  FORTNITE_WHEEL_EEAT_TIPS,
  FORTNITE_WHEEL_FAQ_ITEMS,
  FORTNITE_WHEEL_FEATURES_REAL,
  FORTNITE_WHEEL_H1,
  FORTNITE_WHEEL_HERO_INTRO,
  FORTNITE_WHEEL_HOW_IT_WORKS,
  FORTNITE_WHEEL_ON_THIS_PAGE,
  FORTNITE_WHEEL_OPTIONS_GUIDE,
  FORTNITE_WHEEL_POPULAR_TEMPLATES,
  FORTNITE_WHEEL_RELATED_TOOLS,
  FORTNITE_WHEEL_USE_CASES_CONTENT,
  FORTNITE_WHEEL_WHATS_ON_WHEEL,
  FORTNITE_WHEEL_WHY_POINTS,
} from "@/lib/fortnite-wheel-seo"
import {
  WheelGuideCustomizeSection,
  WheelGuideFeaturesSection,
  WheelGuideHowItWorksSection,
  WheelGuideWhatsOnSection,
} from "@/components/picker-wheel/wheel-guide-extra-sections"

/** SEO H1 + pitch — below the tool */
export function FortniteWheelSeoIntro() {
  return (
    <section
      aria-labelledby="fortnite-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="fortnite-wheel-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {FORTNITE_WHEEL_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {FORTNITE_WHEEL_HERO_INTRO}
      </p>
    </section>
  )
}

export default function FortniteWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="fortnite-wheel-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-violet-700">
          Complete guide
        </p>
        <nav
          id="fortnite-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-violet-700">
            {FORTNITE_WHEEL_ON_THIS_PAGE.map((item) => (
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
          id="fortnite-spin-wheel"
          aria-labelledby="fortnite-spin-heading"
          className="scroll-mt-24"
        >
          <h2
            id="fortnite-spin-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {FORTNITE_WHEEL_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {FORTNITE_WHEEL_ARTICLE_INTRO.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>

        <WheelGuideWhatsOnSection
          id="fortnite-whats-on"
          heading="What You Can Put on the Wheel"
          items={FORTNITE_WHEEL_WHATS_ON_WHEEL}
        />

        <WheelGuideFeaturesSection
          id="fortnite-features"
          heading="Features on This Page"
          intro="Most Fortnite picker features live in the wheel above and the Inputs sidebar—these are the highlights before you dive into every control."
          features={FORTNITE_WHEEL_FEATURES_REAL}
        />

        <section
          id="fortnite-create"
          aria-labelledby="fortnite-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="fortnite-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Your Own Fortnite Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Load skins, weapons, landing spots, or challenges—filter by rarity, customize
            display options, and save wheels you reuse every stream or squad night.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FORTNITE_WHEEL_CREATE_POINTS.map((point) => (
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
            id="fortnite-popular-wheels"
            className="font-spin-display mb-4 mt-10 text-xl font-bold text-slate-900 sm:text-2xl"
          >
            Popular Fortnite Wheels
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FORTNITE_WHEEL_POPULAR_TEMPLATES.map((item) => (
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

        <WheelGuideHowItWorksSection
          id="fortnite-how-it-works"
          heading="How the Fortnite Wheel Works"
          intro="From blank template to challenge pick in four steps."
          steps={FORTNITE_WHEEL_HOW_IT_WORKS}
          accent="violet"
        />

        <section
          id="fortnite-options"
          aria-labelledby="fortnite-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="fortnite-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Inputs sidebar holds most Fortnite settings. This guide covers favorites,
            comparison, collection stats, AI suggestions, rarity filters, display modes, spin
            history, achievements, and every control before you spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FORTNITE_WHEEL_OPTIONS_GUIDE.map((option) => (
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
          id="fortnite-use-cases"
          aria-labelledby="fortnite-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="fortnite-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Ways to Use a Fortnite Picker Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From random skin nights to landing-spot lotteries and stream challenges—a Fortnite
            picker wheel fits any moment you need a fair, visible pick. Skin names are for
            entertainment only—not affiliated with Epic Games.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {FORTNITE_WHEEL_USE_CASES_CONTENT.map((useCase) => (
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
          id="fortnite-why"
          aria-labelledby="fortnite-why-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="fortnite-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a Fortnite Picker Wheel?
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {FORTNITE_WHEEL_WHY_POINTS.map((point) => (
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
          id="fortnite-comparison"
          aria-labelledby="fortnite-comparison-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="fortnite-comparison-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Fortnite Picker Wheel vs Random Fortnite Generator
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            People often compare a Fortnite picker wheel with a one-click random generator. Both
            can pick skins or challenges—the wheel adds a shared visual spin, customization, and
            more engagement for streams and squads.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[320px] text-left text-sm">
              <caption className="sr-only">
                Comparison of Fortnite Picker Wheel and random Fortnite generator
              </caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Aspect
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Fortnite Picker Wheel
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Random Generator
                  </th>
                </tr>
              </thead>
              <tbody>
                {FORTNITE_WHEEL_COMPARISON.map((row) => (
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
          id="fortnite-tips"
          aria-labelledby="fortnite-tips-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="fortnite-tips-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Streams, Fairness &amp; Seasonal Updates
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Practical tips for creators, squads, and anyone who wants trustworthy spins across
            Fortnite seasons.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FORTNITE_WHEEL_EEAT_TIPS.map((tip) => (
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
          id="fortnite-customize"
          heading="How to Customize Your Fortnite Wheel"
          steps={FORTNITE_WHEEL_CUSTOMIZE_STEPS}
          accent="violet"
        />

        <section
          id="fortnite-related"
          aria-labelledby="fortnite-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="fortnite-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FORTNITE_WHEEL_RELATED_TOOLS.map((item) => (
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
          id="fortnite-cluster"
          aria-labelledby="fortnite-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="fortnite-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Fortnite Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for Fortnite picker wheels—skins, weapons, landing spots,
            and challenge templates. Each card opens its own dedicated page with matching settings.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FORTNITE_WHEEL_CLUSTER_LINKS.map((item) => (
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

        <section id="fortnite-faq" aria-labelledby="fortnite-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="fortnite-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {FORTNITE_WHEEL_FAQ_ITEMS.map((item) => (
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
