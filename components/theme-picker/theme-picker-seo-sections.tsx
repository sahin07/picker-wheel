import Link from "next/link"
import {
  THEME_PICKER_BENEFITS,
  THEME_PICKER_FAQ_ITEMS,
  THEME_PICKER_FEATURES,
  THEME_PICKER_H1,
  THEME_PICKER_HERO_INTRO,
  THEME_PICKER_HOW_IT_WORKS,
  THEME_PICKER_ON_THIS_PAGE,
  THEME_PICKER_PATH,
  THEME_PICKER_POPULAR_TEMPLATES,
  THEME_PICKER_QUESTION_BLOCKS,
  THEME_PICKER_RELATED_TOOLS,
  THEME_PICKER_UPDATED_AT,
  THEME_PICKER_USE_CASE_GROUPS,
  THEME_PICKER_VS_IDEA_GENERATOR,
} from "@/lib/theme-picker-seo"
import { SpokeUpdatedLabel } from "@/components/spoke-seo-blocks"

export function ThemePickerSeoIntro({
  h1 = THEME_PICKER_H1,
  intro = THEME_PICKER_HERO_INTRO,
}: {
  h1?: string
  intro?: string
}) {
  return (
    <section
      aria-labelledby="theme-picker-seo-heading"
      className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h2
        id="theme-picker-seo-heading"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {h1}
      </h2>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {intro}
      </p>
      <SpokeUpdatedLabel updatedAt={THEME_PICKER_UPDATED_AT} />
    </section>
  )
}

export default function ThemePickerSeoSections() {
  return (
    <div className="mx-auto max-w-3xl px-1 pb-8 pt-4 text-slate-700">
      <article id="theme-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-teal-700">
          Complete guide
        </p>
        <nav
          id="theme-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="flex list-decimal flex-wrap gap-x-4 gap-y-1 pl-5 text-sm marker:text-teal-700">
            {THEME_PICKER_ON_THIS_PAGE.map((item) => (
              <li key={item.id} className="marker:font-semibold">
                <a
                  href={`#${item.id}`}
                  className="text-teal-700 underline-offset-2 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="theme-how-it-works" className="scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Spin the Theme Picker Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            The Theme Picker Wheel loads a ready-made mix of creative themes so you can spin immediately.
            Every enabled entry receives one equal slice. When the pointer stops, you get a clear theme for
            parties, writing, drawing, classrooms, or content challenges—no endless debating required. Keep
            spinning for rematches, or switch templates when you need a focused list.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2">
            {THEME_PICKER_HOW_IT_WORKS.map((step, index) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-teal-100 bg-white p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-white">
                  {index + 1}
                </span>
                <p className="self-center text-sm leading-relaxed text-slate-600">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="theme-create-own" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Create Your Own Theme Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Templates are only the starting point. Build separate wheels for parties, classrooms, drawing
            prompts, story genres, or video content instead of forcing every idea into one giant list. Add
            custom themes, edit names, change colors, upload optional images, save favorites, and share the
            exact setup with your group.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEME_PICKER_FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="theme-templates" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Popular Theme Wheel Templates
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Jump to a focused spinner when you need party vibes, art prompts, writing themes, classroom
            activities, or Halloween ideas. Each template page preloads a useful list so you arrive ready to
            spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {THEME_PICKER_POPULAR_TEMPLATES.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block h-full rounded-xl border bg-white p-5 shadow-sm hover:border-teal-300"
                >
                  <h3 className="font-semibold text-slate-900">{item.label}</h3>
                  {item.audience && (
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-teal-700">
                      {item.audience}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            Browse the cluster from the template strip above the wheel, or start at{" "}
            <Link href={THEME_PICKER_PATH} className="font-semibold text-teal-800 underline">
              Theme Picker Wheel
            </Link>{" "}
            and branch into focused spokes.
          </p>
        </section>

        <section id="theme-use-cases" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Common Ways to Use a Theme Picker Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            From costume parties to TikTok challenges, a random theme spinner keeps creative decisions fair
            and visible for the whole group.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {THEME_PICKER_USE_CASE_GROUPS.map((group) => (
              <div key={group.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-3 font-semibold text-slate-900">{group.title}</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-teal-600" aria-hidden>
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="theme-why" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Why Use Our Theme Picker Wheel?
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Random themes help writers, artists, teachers, and creators generate fresh ideas when they are
            unsure what to do next. A visual spin makes team activities, workshops, and family game nights
            more engaging—and each theme has an equal chance unless you edit the wheel.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {THEME_PICKER_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="rounded-xl border border-teal-100 bg-teal-50/40 px-4 py-3 text-sm text-slate-700"
              >
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        <section id="theme-vs" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Theme Picker Wheel vs Random Idea Generator
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Use a theme picker when your group already has a shortlist and needs one fair winner. Use a general
            idea generator when you want open-ended suggestions without a shared visual spin.
          </p>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">Feature</th>
                  <th className="px-4 py-3 font-semibold">Theme Picker Wheel</th>
                  <th className="px-4 py-3 font-semibold">Random Idea Generator</th>
                </tr>
              </thead>
              <tbody>
                {THEME_PICKER_VS_IDEA_GENERATOR.map((row) => (
                  <tr key={row.feature} className="border-t">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.feature}</td>
                    <td className="px-4 py-3 text-slate-600">{row.themePicker}</td>
                    <td className="px-4 py-3 text-slate-600">{row.ideaGenerator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="theme-questions" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            What Theme Should I Choose?
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Conversational questions people ask when they are stuck—answered with a fair spin you can
            customize.
          </p>
          <div className="space-y-4">
            {THEME_PICKER_QUESTION_BLOCKS.map((block) => (
              <div key={block.id} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">
                  {"href" in block && block.href ? (
                    <Link href={block.href} className="text-teal-800 hover:underline">
                      {block.title}
                    </Link>
                  ) : (
                    block.title
                  )}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{block.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="theme-related" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Related Wheel Tools
          </h2>
          <p className="mb-6 text-slate-600">
            Pair the Theme Picker Wheel with other Spinifywheel tools for decisions, colors, prizes, and names.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {THEME_PICKER_RELATED_TOOLS.map((tool) => (
              <li key={`${tool.href}-${tool.label}`}>
                <Link
                  href={tool.href}
                  className="block h-full rounded-xl border bg-white p-4 hover:border-teal-300"
                >
                  <span className="font-semibold text-slate-900">{tool.label}</span>
                  <span className="mt-1 block text-xs text-slate-600">{tool.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="theme-faq" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {THEME_PICKER_FAQ_ITEMS.map((item) => (
              <div key={item.question} className="rounded-xl border bg-white p-5 shadow-sm">
                <dt className="font-semibold text-slate-900">{item.question}</dt>
                <dd className="mt-2 text-sm text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </div>
  )
}
