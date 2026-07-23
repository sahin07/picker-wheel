import Link from "next/link"
import {
  FORTNITE_CHALLENGE_HUB_FAQ,
  FORTNITE_CHALLENGE_HUB_H1,
  FORTNITE_CHALLENGE_HUB_HERO,
  FORTNITE_CHALLENGE_HUB_LINKS,
  FORTNITE_CHALLENGE_HUB_ON_THIS_PAGE,
  FORTNITE_CHALLENGE_HUB_PATH,
} from "@/lib/fortnite-challenge-hub-seo"
import { FORTNITE_WHEEL_PATH } from "@/lib/fortnite-wheel-seo"

export function FortniteChallengeHubSeoIntro() {
  return (
    <section
      aria-labelledby="fortnite-challenge-hub-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="fortnite-challenge-hub-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {FORTNITE_CHALLENGE_HUB_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {FORTNITE_CHALLENGE_HUB_HERO}
      </p>
    </section>
  )
}

export function FortniteChallengeHubSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="fortnite-challenge-hub-article" className="border-t border-slate-200 pt-12">
        <nav
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-violet-700">
            {FORTNITE_CHALLENGE_HUB_ON_THIS_PAGE.map((item) => (
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
          id="fortnite-challenge-hub-templates"
          aria-labelledby="fortnite-challenge-hub-templates-heading"
          className="scroll-mt-24"
        >
          <h2
            id="fortnite-challenge-hub-templates-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Fortnite Challenge Templates
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Each card opens a dedicated challenge page with preset entries. You can also spin duo
            rules on this hub, then switch templates without leaving the{" "}
            <Link
              href={FORTNITE_WHEEL_PATH}
              className="font-medium text-violet-700 underline-offset-2 hover:underline"
            >
              main Fortnite Picker Wheel
            </Link>
            .
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FORTNITE_CHALLENGE_HUB_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block h-full rounded-xl border p-4 transition-colors ${
                    item.href === FORTNITE_CHALLENGE_HUB_PATH
                      ? "border-violet-400 bg-violet-50/70"
                      : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50"
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

        <section
          id="fortnite-challenge-hub-guide"
          aria-labelledby="fortnite-challenge-hub-guide-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="fortnite-challenge-hub-guide-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How Challenge Wheels Work
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            <p>
              Challenge wheels load curated house rules—weapon types, POIs, loadout combos, duo and
              squad dares, emotes, and loot constraints. Spin once above or open a template page for
              a focused URL to share with friends.
            </p>
            <p>
              Stack challenges for layered runs: land at a random POI, use one weapon class, and
              follow a loot rule from three templates. Edit any list in the Text tab when your season
              or squad rules change.
            </p>
          </div>
        </section>

        <section
          id="fortnite-challenge-hub-faq"
          aria-labelledby="fortnite-challenge-hub-faq-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="fortnite-challenge-hub-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {FORTNITE_CHALLENGE_HUB_FAQ.map((item) => (
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
