import Link from "next/link"
import {
  POKEMON_WHEEL_ARTICLE_INTRO,
  POKEMON_WHEEL_ARTICLE_TITLE,
  POKEMON_WHEEL_CLUSTER_LINKS,
  POKEMON_WHEEL_COMPARISON,
  POKEMON_WHEEL_CREATE_POINTS,
  POKEMON_WHEEL_CUSTOMIZE_STEPS,
  POKEMON_WHEEL_EEAT_TIPS,
  POKEMON_WHEEL_FAQ_ITEMS,
  POKEMON_WHEEL_FEATURES_REAL,
  POKEMON_WHEEL_H1,
  POKEMON_WHEEL_HERO_INTRO,
  POKEMON_WHEEL_HOW_IT_WORKS,
  POKEMON_WHEEL_ON_THIS_PAGE,
  POKEMON_WHEEL_OPTIONS_GUIDE,
  POKEMON_WHEEL_POPULAR_TEMPLATES,
  POKEMON_WHEEL_RELATED_TOOLS,
  POKEMON_WHEEL_USE_CASES,
  POKEMON_WHEEL_WHATS_ON_WHEEL,
  POKEMON_WHEEL_WHY_POINTS,
} from "@/lib/pokemon-wheel-seo"
import {
  WheelGuideComparisonSection,
  WheelGuideCustomizeSection,
  WheelGuideEeatSection,
  WheelGuideFeaturesSection,
  WheelGuideHowItWorksSection,
  WheelGuideWhatsOnSection,
} from "@/components/picker-wheel/wheel-guide-extra-sections"

/** SEO H1 + pitch — below the tool */
export function PokemonWheelSeoIntro() {
  return (
    <section
      aria-labelledby="pokemon-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="pokemon-wheel-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {POKEMON_WHEEL_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {POKEMON_WHEEL_HERO_INTRO}
      </p>
    </section>
  )
}

export default function PokemonWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="pokemon-wheel-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-amber-700">
          Complete guide
        </p>
        <nav
          id="pokemon-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-amber-700">
            {POKEMON_WHEEL_ON_THIS_PAGE.map((item) => (
              <li key={item.id} className="marker:font-semibold">
                <a
                  href={`#${item.id}`}
                  className="text-amber-700 underline-offset-2 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section
          id="pokemon-spin-wheel"
          aria-labelledby="pokemon-spin-heading"
          className="scroll-mt-24"
        >
          <h2
            id="pokemon-spin-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {POKEMON_WHEEL_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {POKEMON_WHEEL_ARTICLE_INTRO.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>

        <WheelGuideWhatsOnSection
          id="pokemon-whats-on"
          heading="What You Can Put on the Wheel"
          items={POKEMON_WHEEL_WHATS_ON_WHEEL}
        />

        <WheelGuideFeaturesSection
          id="pokemon-features"
          heading="Features on This Page"
          intro="Most Pokémon picker features live in the wheel above and the Inputs sidebar—these are the highlights before you dive into every control."
          features={POKEMON_WHEEL_FEATURES_REAL}
        />

        <section
          id="pokemon-create"
          aria-labelledby="pokemon-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="pokemon-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Your Own Pokémon Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Create your own Pokémon Wheel: load the curated catalog, filter by generation or type,
            remove entries, add favorites, and save wheels you reuse for challenges, teams, and
            streams.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {POKEMON_WHEEL_CREATE_POINTS.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-amber-100 bg-white/90 p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-amber-800">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {POKEMON_WHEEL_POPULAR_TEMPLATES.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/50"
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
          id="pokemon-how-it-works"
          heading="How the Pokémon Wheel Works"
          intro="From generation filter to creature pick in four steps."
          steps={POKEMON_WHEEL_HOW_IT_WORKS}
          accent="emerald"
        />

        <section
          id="pokemon-options"
          aria-labelledby="pokemon-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="pokemon-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Inputs sidebar holds most Pokémon settings. This guide covers favorites, comparison,
            Pokémon details, pool statistics, generation filters, display modes, AI suggestions,
            spin history, achievements, and every control before you spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {POKEMON_WHEEL_OPTIONS_GUIDE.map((option) => (
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
          id="pokemon-use-cases"
          aria-labelledby="pokemon-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="pokemon-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Ways to Use a Pokémon Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From Nuzlocke challenges to classroom icebreakers, a random Pokémon spinner fits any
            moment you need a fair creature pick. Names and types are for entertainment
            only—not affiliated with Nintendo or The Pokémon Company.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {POKEMON_WHEEL_USE_CASES.map((group) => (
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
          id="pokemon-why"
          aria-labelledby="pokemon-why-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="pokemon-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a Pokémon Wheel?
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {POKEMON_WHEEL_WHY_POINTS.map((point) => (
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
          id="pokemon-comparison"
          heading="Pokémon Wheel vs Random Pokémon Generator"
          intro="Both help you pick a Pokémon at random. The Pokémon Wheel adds an interactive spin for streams and groups; a plain generator is usually a one-click result."
          rows={POKEMON_WHEEL_COMPARISON}
          wheelLabel="Pokémon Wheel"
          generatorLabel="Random Pokémon Generator"
        />

        <WheelGuideEeatSection
          id="pokemon-tips"
          heading="Fairness Tips & Best Practices"
          intro="Most Pokémon pickers stop at “spin and go.” These notes help you run fair, transparent draws for challenge runs, drafts, and classrooms."
          sections={POKEMON_WHEEL_EEAT_TIPS}
        />

        <WheelGuideCustomizeSection
          id="pokemon-customize"
          heading="How to Customize Your Pokémon Wheel"
          steps={POKEMON_WHEEL_CUSTOMIZE_STEPS}
          accent="emerald"
        />

        <section
          id="pokemon-related"
          aria-labelledby="pokemon-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="pokemon-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {POKEMON_WHEEL_RELATED_TOOLS.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/50"
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
          id="pokemon-cluster"
          aria-labelledby="pokemon-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="pokemon-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Pokémon Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for Pokémon spinners. Each card opens its own dedicated
            page with matching generation, type, or curated settings.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {POKEMON_WHEEL_CLUSTER_LINKS.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/50"
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

        <section id="pokemon-faq" aria-labelledby="pokemon-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="pokemon-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {POKEMON_WHEEL_FAQ_ITEMS.map((item) => (
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
