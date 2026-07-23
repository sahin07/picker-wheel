import Link from "next/link"
import {
  FORTUNE_WHEEL_BENEFITS,
  FORTUNE_WHEEL_DISCLAIMER,
  FORTUNE_WHEEL_FAQ_ITEMS,
  FORTUNE_WHEEL_FEATURES,
  FORTUNE_WHEEL_H1,
  FORTUNE_WHEEL_HERO_INTRO,
  FORTUNE_WHEEL_HOW_IT_WORKS,
  FORTUNE_WHEEL_ON_THIS_PAGE,
  FORTUNE_WHEEL_POPULAR_TEMPLATES,
  FORTUNE_WHEEL_RELATED_TOOLS,
  USE_CASES_COPY,
  VS_RANDOM_PICKER,
} from "@/lib/fortune-wheel-seo"

export function FortuneWheelSeoIntro({
  h1 = FORTUNE_WHEEL_H1,
  intro = FORTUNE_WHEEL_HERO_INTRO,
}: {
  h1?: string
  intro?: string
}) {
  return (
    <section
      aria-labelledby="fortune-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="fortune-wheel-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {h1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {intro}
      </p>
    </section>
  )
}

export default function FortuneWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl px-1 pb-8 pt-4 text-slate-700">
      <article className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-violet-700">
          Complete fortune wheel guide
        </p>
        <nav aria-label="On this page" className="mb-10 rounded-xl border bg-slate-50 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-violet-700">
            {FORTUNE_WHEEL_ON_THIS_PAGE.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-violet-800 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="fortune-how-it-works" className="scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            How the Wheel of Fortune Spinner Works
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Start with the decision template or choose a ready-made wheel for a classroom, prize draw, party,
            holiday, game night, or icebreaker. Every enabled entry receives one equal slice. The wheel then
            animates to a random result that everyone can see, making a choice easier to follow than a hidden
            draw. You remain in control of the entries and what each result means.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2">
            {FORTUNE_WHEEL_HOW_IT_WORKS.map((step, index) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-violet-100 bg-white p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 font-bold text-white">
                  {index + 1}
                </span>
                <p className="self-center text-sm leading-relaxed text-slate-600">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="fortune-features" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Customize Your Fortune Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Replace the starter choices with your own names, tasks, destinations, rewards, questions, or
            activities. Give entries distinct colors, attach optional images, and write result messages with
            instructions for the person who spins. Set a short duration for rapid decisions or a longer duration
            for a more dramatic reveal. Mystery result can conceal the answer until you tap, while elimination
            mode removes a selected entry when you need unique winners or one-time activities.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FORTUNE_WHEEL_FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="fortune-templates" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Popular Fortune Templates
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Templates reduce setup without limiting what you can change. Open a classroom wheel for roles and
            rewards, a prize wheel for a giveaway, or a game-night wheel for group activities. The custom
            template provides neutral placeholders when you already have a list. Every template can be renamed,
            recolored, expanded, shortened, saved, and reused.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FORTUNE_WHEEL_POPULAR_TEMPLATES.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border bg-white p-4 hover:border-violet-300"
                >
                  <span className="block font-semibold text-slate-900">{item.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="fortune-use-cases" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Ways to Play
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            A fortune wheel is useful anywhere a visible random choice can keep a group moving. Teachers can
            rotate classroom jobs or review topics; families can divide chores and choose weekend plans; hosts
            can select party prompts or prizes; teams can choose meeting order and icebreakers. Explain the
            rules before spinning, especially when a result changes turns, awards a prize, or removes an entry.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {USE_CASES_COPY.map((item) => (
              <div key={item.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="fortune-benefits" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Why Use This Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            A visible wheel gives participants a shared view of the available choices and the final selection.
            It can replace repeated debate, add energy to a routine task, and make turn-taking easier to
            understand. Because saved wheels stay available in the browser, recurring lessons, chores, and
            meetings do not need to be rebuilt each time.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {FORTUNE_WHEEL_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600 shadow-sm"
              >
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        <section id="fortune-vs-picker" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Wheel of Fortune vs Random Wheel Picker
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Both tools make random selections, but they offer different starting points. Choose this Wheel of
            Fortune when you want themed templates, images, result messages, timing controls, and an engaging
            reveal for a lesson, game, prize, or decision. Choose the general random picker when you simply want
            to paste a list and select an option quickly. Neither choice changes the basic fairness rule: each
            enabled equal-size entry has the same chance unless you intentionally use a weighted wheel.
          </p>
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3">Feature</th>
                  <th className="p-3">Wheel of Fortune</th>
                  <th className="p-3">Random Wheel Picker</th>
                </tr>
              </thead>
              <tbody>
                {VS_RANDOM_PICKER.map((row) => (
                  <tr key={row.feature} className="border-t align-top">
                    <th className="p-3 font-semibold text-slate-900">{row.feature}</th>
                    <td className="p-3 text-slate-600">{row.fortuneWheel}</td>
                    <td className="p-3 text-slate-600">{row.randomWheelPicker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="fortune-related" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {FORTUNE_WHEEL_RELATED_TOOLS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border bg-white p-4 hover:border-violet-300"
                >
                  <span className="block font-semibold text-slate-900">{item.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="fortune-disclaimer" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Independent Tool Disclaimer
          </h2>
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
            {FORTUNE_WHEEL_DISCLAIMER}
          </p>
        </section>

        <section id="fortune-faq" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {FORTUNE_WHEEL_FAQ_ITEMS.map((item) => (
              <div key={item.question} className="rounded-xl border bg-white p-5 shadow-sm">
                <dt className="font-semibold text-slate-900">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </div>
  )
}
