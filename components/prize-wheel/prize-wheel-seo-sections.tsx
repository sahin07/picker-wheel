import Link from "next/link"
import {
  PRIZE_WHEEL_BENEFITS,
  PRIZE_WHEEL_FAQ_ITEMS,
  PRIZE_WHEEL_FEATURES,
  PRIZE_WHEEL_H1,
  PRIZE_WHEEL_HERO_INTRO,
  PRIZE_WHEEL_HOW_IT_WORKS,
  PRIZE_WHEEL_ON_THIS_PAGE,
  PRIZE_WHEEL_RELATED_TOOLS,
  PRIZE_WHEEL_POPULAR_TEMPLATES,
  PRIZE_WHEEL_USE_CASES_COPY,
  PRIZE_WHEEL_VS_NAME_PICKER,
} from "@/lib/prize-wheel-seo"

export function PrizeWheelSeoIntro({
  h1 = PRIZE_WHEEL_H1,
  intro = PRIZE_WHEEL_HERO_INTRO,
}: {
  h1?: string
  intro?: string
}) {
  return (
    <section
      aria-labelledby="prize-wheel-seo-h1"
      className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="prize-wheel-seo-h1"
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

export default function PrizeWheelSeoSections() {
  return (
    <div className="mx-auto max-w-5xl px-1 pb-8 pt-4 text-slate-700">
      <article className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-amber-700">
          Complete prize wheel guide
        </p>
        <nav aria-label="On this page" className="mb-10 rounded-xl border bg-slate-50 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-amber-700">
            {PRIZE_WHEEL_ON_THIS_PAGE.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-amber-800 hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="prize-how-it-works" className="scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Spin the Prize Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            The Prize Wheel Spinner turns your prize list into a fair, visual spin. Every enabled prize gets an
            equal slice. Add each real reward once, confirm the list matches what you can fulfill, then spin.
            Guests, students, and attendees can watch the motion and results history so the selection feels
            transparent from start to finish.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2">
            {PRIZE_WHEEL_HOW_IT_WORKS.map((step, index) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-amber-100 bg-white p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 font-bold text-white">
                  {index + 1}
                </span>
                <p className="self-center text-sm leading-relaxed text-slate-600">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="prize-features" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Create Your Own Prize Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Build a wheel that matches your event, classroom, booth, or stream. Rename entries, pick colors,
            upload a photo, and add a message that appears when a prize is selected. Images help when products
            look similar; winner messages can explain collection steps, classroom privileges, or redemption
            details.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRIZE_WHEEL_FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="prize-templates" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Popular Prize Wheel Templates
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Launch a ready-made list, then swap sample rewards for items you can actually provide. Every
            enabled prize stays at equal odds so your promotion remains easy to explain.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRIZE_WHEEL_POPULAR_TEMPLATES.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border bg-white p-4 hover:border-amber-300"
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

        <section id="prize-use-cases" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Common Ways to Use a Prize Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            A prize wheel works best when the host explains what is available before spinning and keeps the
            process consistent. Mix high-value and low-value rewards based on your audience, budget, and
            event type so every spin feels exciting without overpromising inventory.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {PRIZE_WHEEL_USE_CASES_COPY.map((item) => (
              <div key={item.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="prize-why" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Why Use a Prize Wheel Spinner?
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Visual selection builds energy and trust. Participants can see the prize list, watch the spin, and
            understand that every enabled reward had the same chance—ideal for giveaways, promotions,
            classrooms, and events.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PRIZE_WHEEL_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600 shadow-sm"
              >
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        <section id="prize-vs-name-picker" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Prize Wheel Spinner vs Random Name Picker
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Choose based on what the spin should decide. A prize wheel holds the rewards; a name picker holds
            the participants. Many hosts use both—pick a person first, then spin for their prize.
          </p>
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3">Aspect</th>
                  <th className="p-3">Prize Wheel Spinner</th>
                  <th className="p-3">Random Name Picker</th>
                </tr>
              </thead>
              <tbody>
                {PRIZE_WHEEL_VS_NAME_PICKER.map((row) => (
                  <tr key={row.aspect} className="border-t align-top">
                    <th className="p-3 font-semibold text-slate-900">{row.aspect}</th>
                    <td className="p-3 text-slate-600">{row.prizeWheel}</td>
                    <td className="p-3 text-slate-600">{row.namePicker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="prize-fairness" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Fairness, Transparency, and Responsible Use
          </h2>
          <div className="space-y-4 leading-relaxed text-slate-600">
            <p>
              Creating a fair prize wheel starts with equal chance: each enabled prize has the same probability
              unless you intentionally change odds on a{" "}
              <Link href="/weighted-wheel-spinner" className="font-semibold text-amber-800 underline">
                Weighted Wheel Spinner
              </Link>
              . For transparent public giveaways, keep all prizes equally weighted and visible before you spin.
            </p>
            <p>
              Choose suitable prizes by mixing high-value and low-value rewards for your audience and budget.
              Classroom stickers, trade-show samples, loyalty perks, and birthday favors all work when the list
              matches what you can fulfill.
            </p>
            <p>
              Transparency matters. If you run a public giveaway or contest, communicate rules and prize
              availability before spinning. That builds trust and helps participants understand the process.
              Follow the policies that apply to your organization and location—the spinner is a presentation
              and random-selection tool, not a substitute for official terms.
            </p>
            <p>
              Use elimination mode when inventory is limited. After a prize is selected, that entry can be
              disabled so remaining prizes stay equally likely. Re-enable items from Inputs when stock returns.
            </p>
          </div>
        </section>

        <section id="prize-related" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Related Tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PRIZE_WHEEL_RELATED_TOOLS.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border bg-white p-4 hover:border-amber-300"
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

        <section id="prize-faq" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {PRIZE_WHEEL_FAQ_ITEMS.map((item) => (
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
