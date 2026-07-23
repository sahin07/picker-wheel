import Link from "next/link"
import {
  TEAM_PICKER_ARTICLE_INTRO,
  TEAM_PICKER_ARTICLE_TITLE,
  TEAM_PICKER_CLUSTER_LINKS,
  TEAM_PICKER_COMPARISON,
  TEAM_PICKER_CREATE_POINTS,
  TEAM_PICKER_FAQ_ITEMS,
  TEAM_PICKER_H1,
  TEAM_PICKER_HERO_INTRO,
  TEAM_PICKER_ON_THIS_PAGE,
  TEAM_PICKER_OPTIONS_GUIDE,
  TEAM_PICKER_POPULAR_TEMPLATES,
  TEAM_PICKER_READY_TEMPLATES,
  TEAM_PICKER_RELATED_TOOLS,
  TEAM_PICKER_TIPS,
  TEAM_PICKER_USE_CASES,
  TEAM_PICKER_WHY_POINTS,
} from "@/lib/team-picker-seo"

/** SEO H1 + pitch — below the tool */
export function TeamPickerSeoIntro() {
  return (
    <section
      aria-labelledby="team-picker-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="team-picker-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {TEAM_PICKER_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {TEAM_PICKER_HERO_INTRO}
      </p>
    </section>
  )
}

export default function TeamPickerSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="team-picker-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="tp-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {TEAM_PICKER_ON_THIS_PAGE.map((item) => (
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

        <section id="tp-spin-wheel" aria-labelledby="tp-spin-heading" className="scroll-mt-24">
          <h2
            id="tp-spin-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {TEAM_PICKER_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {TEAM_PICKER_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Ready to assign teams? Use the Team Picker Wheel above, or tap a template in the{" "}
            <a href="#tp-popular" className="text-emerald-700 underline-offset-2 hover:underline">
              <strong className="font-semibold text-slate-800">Popular Team Picker Templates</strong>
            </a>{" "}
            strip under the title to preload group settings—then add names and generate or spin.
          </p>
        </section>

        <section
          id="tp-create-teams"
          aria-labelledby="tp-create-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="tp-create-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Create Random Teams
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Build a custom team assignment tool in minutes. Add names, assign multiple teams, remove
            selected players, shuffle participants, save team wheels, share assignments, and
            customize colors for a clear visual spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {TEAM_PICKER_CREATE_POINTS.map((point) => (
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

          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[280px] text-left text-sm">
              <caption className="sr-only">Ready-made team picker templates by audience</caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Template
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Audience
                  </th>
                </tr>
              </thead>
              <tbody>
                {TEAM_PICKER_READY_TEMPLATES.map((row) => (
                  <tr key={row.template} className="border-t border-slate-100">
                    <th scope="row" className="px-4 py-3 font-medium text-slate-800">
                      {row.template}
                    </th>
                    <td className="px-4 py-3 text-slate-600">{row.audience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_PICKER_POPULAR_TEMPLATES.map((item) => (
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
          id="tp-options"
          aria-labelledby="tp-options-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="tp-options-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How This Tool&apos;s Options Work
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            The Team Controls sidebar is where most settings live. Use this guide to understand each
            option before you generate teams or spin—so classroom, sports, and gaming setups behave
            the way you expect.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {TEAM_PICKER_OPTIONS_GUIDE.map((option) => (
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
          id="tp-use-cases"
          aria-labelledby="tp-use-cases-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="tp-use-cases-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Common Ways to Use a Team Picker Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            From PE class to esports lobbies, a random team picker fits any moment you need fair
            sides without arguing over captains. Mention NFL, NBA, MLB, soccer, or fantasy football
            only as examples—this tool assigns your own names, not official league rosters.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {TEAM_PICKER_USE_CASES.map((group) => (
              <div
                key={group.category}
                className="rounded-xl border border-slate-200 bg-slate-50/80 p-5"
              >
                <h3 className="font-spin-display mb-3 text-lg font-semibold text-slate-900">
                  {group.category}
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="tp-why" aria-labelledby="tp-why-heading" className="mt-12 scroll-mt-24">
          <h2
            id="tp-why-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Why Use a Team Picker Wheel?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_PICKER_WHY_POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="tp-vs-generator"
          aria-labelledby="tp-vs-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="tp-vs-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Team Picker Wheel vs Random Team Generator
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            People search for both a team picker wheel and a random team generator. This page covers
            both intents: spin for a shared visual draw, or generate teams instantly when you need
            bulk assignments.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[320px] text-left text-sm">
              <caption className="sr-only">
                Comparison of Team Picker Wheel and random team generator
              </caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Aspect
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Team Picker Wheel
                  </th>
                  <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                    Random Team Generator
                  </th>
                </tr>
              </thead>
              <tbody>
                {TEAM_PICKER_COMPARISON.map((row) => (
                  <tr key={row.aspect} className="border-t border-slate-100">
                    <th scope="row" className="px-4 py-3 font-medium text-slate-800">
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

        <section id="tp-tips" aria-labelledby="tp-tips-heading" className="mt-12 scroll-mt-24">
          <h2
            id="tp-tips-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            How Fair Team Selection Works
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            A little setup goes a long way toward trustworthy random assignments—especially when
            parents, players, or coworkers are watching the spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {TEAM_PICKER_TIPS.map((tip) => (
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

        <section
          id="tp-related"
          aria-labelledby="tp-related-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="tp-related-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Related Tools
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Need a single name, a number, a yes/no call, or a sports franchise spin? Those jobs have
            dedicated pages—use them instead of stuffing this team wheel with unrelated lists. NBA and
            MLB franchise pickers are listed here once.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_PICKER_RELATED_TOOLS.map((tool) => (
              <li key={tool.href + tool.label}>
                <Link
                  href={tool.href}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <span className="font-spin-display block text-sm font-semibold text-slate-900">
                    {tool.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {tool.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="tp-cluster"
          aria-labelledby="tp-cluster-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="tp-cluster-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Team Picker Topic Cluster
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            This pillar page is the hub for classroom, sports, gaming, and tournament team tools.
            Each card opens its own dedicated page with matching team settings—for league franchise
            spins, use NBA or MLB under Related Tools above.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_PICKER_CLUSTER_LINKS.map((item) => (
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

        <section id="tp-faq" aria-labelledby="tp-faq-heading" className="mt-12 scroll-mt-24">
          <h2
            id="tp-faq-heading"
            className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {TEAM_PICKER_FAQ_ITEMS.map((item) => (
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
