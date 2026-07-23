import Link from "next/link"
import {
  POKEMON_WHEEL_OPTIONS_GUIDE,
  POKEMON_WHEEL_PATH,
  POKEMON_WHEEL_POPULAR_TEMPLATES,
} from "@/lib/pokemon-wheel-seo"
import {
  getPokemonSpokeSiblings,
  type PokemonWheelSpokeSeo,
} from "@/lib/pokemon-wheel-spokes"

export function PokemonWheelSpokeSeoIntro({ spoke }: { spoke: PokemonWheelSpokeSeo }) {
  return (
    <section
      aria-labelledby="pokemon-spoke-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="pokemon-spoke-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {spoke.h1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {spoke.heroIntro}
      </p>
    </section>
  )
}

export function PokemonWheelSpokeSeoSections({ spoke }: { spoke: PokemonWheelSpokeSeo }) {
  const siblings = getPokemonSpokeSiblings(spoke)
  const toc = [
    { id: "pokemon-spoke-popular", label: "Popular Pokémon templates" },
    { id: "pokemon-spoke-guide", label: "Guide" },
    { id: "pokemon-spoke-options", label: "Features & options" },
    { id: "pokemon-spoke-unique", label: spoke.uniqueSection.title },
    { id: "pokemon-spoke-cluster", label: "Related Pokémon templates" },
    { id: "pokemon-spoke-faq", label: "FAQ" },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <section
        id="pokemon-spoke-popular"
        aria-labelledby="pokemon-spoke-popular-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="pokemon-spoke-popular-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Popular Pokémon Templates
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Each template is its own page with matching Pokémon. Jump to another Pokémon tool, or open
          the{" "}
          <Link
            href={POKEMON_WHEEL_PATH}
            className="font-medium text-amber-700 underline-offset-2 hover:underline"
          >
            main Pokémon Wheel
          </Link>
          .
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POKEMON_WHEEL_POPULAR_TEMPLATES.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block h-full rounded-xl border p-4 transition-colors ${
                  item.href === spoke.path
                    ? "border-amber-400 bg-amber-50/70"
                    : "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
                }`}
              >
                <span className="font-spin-display block text-base font-semibold text-slate-900">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <article id="pokemon-spoke-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-amber-700">
          Pokémon template guide
        </p>
        <nav
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-amber-700">
            {toc.map((item) => (
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
          id="pokemon-spoke-guide"
          aria-labelledby="pokemon-spoke-guide-heading"
          className="scroll-mt-24"
        >
          <h2
            id="pokemon-spoke-guide-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.articleTitle}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {spoke.articleIntro.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </section>

        <section
          id="pokemon-spoke-options"
          aria-labelledby="pokemon-spoke-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="pokemon-spoke-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Features &amp; Options on This Template
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This spoke loads a pre-filtered Pokémon set. Every other control—favorites, comparison,
            details, statistics, AI, spin history, and more—works the same as on the{" "}
            <Link
              href={POKEMON_WHEEL_PATH}
              className="font-medium text-amber-700 underline-offset-2 hover:underline"
            >
              main Pokémon wheel
            </Link>
            .
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
          id="pokemon-spoke-unique"
          aria-labelledby="pokemon-spoke-unique-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="pokemon-spoke-unique-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.uniqueSection.title}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            {spoke.uniqueSection.intro}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {spoke.uniqueSection.points.map((point) => (
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
          id="pokemon-spoke-cluster"
          aria-labelledby="pokemon-spoke-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="pokemon-spoke-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Pokémon Templates
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.slice(0, 6).map((sib) => (
              <li key={sib.path}>
                <Link
                  href={sib.path}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/50"
                >
                  <span className="font-spin-display block text-sm font-semibold text-slate-900">
                    {sib.shortTitle}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {sib.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="pokemon-spoke-faq"
          aria-labelledby="pokemon-spoke-faq-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="pokemon-spoke-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {spoke.faq.map((item) => (
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
