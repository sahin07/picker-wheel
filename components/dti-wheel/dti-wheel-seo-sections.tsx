import Link from "next/link"
import {
  DTI_WHEEL_BENEFITS,
  DTI_WHEEL_DISCLAIMER,
  DTI_WHEEL_FAQ_ITEMS,
  DTI_WHEEL_FEATURES,
  DTI_WHEEL_FUN_WAYS,
  DTI_WHEEL_H1,
  DTI_WHEEL_HERO_INTRO,
  DTI_WHEEL_HOW_IT_WORKS,
  DTI_WHEEL_ON_THIS_PAGE,
  DTI_WHEEL_PATH,
  DTI_WHEEL_POPULAR_TEMPLATES,
  DTI_WHEEL_RELATED_TOOLS,
  DTI_WHEEL_UPDATED_AT,
} from "@/lib/dti-wheel-seo"
import { SpokeUpdatedLabel } from "@/components/spoke-seo-blocks"

export function DtiWheelSeoIntro({
  h1 = DTI_WHEEL_H1,
  intro = DTI_WHEEL_HERO_INTRO,
}: {
  h1?: string
  intro?: string
}) {
  return (
    <section
      aria-labelledby="dti-wheel-seo-heading"
      className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h2
        id="dti-wheel-seo-heading"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {h1}
      </h2>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {intro}
      </p>
      <SpokeUpdatedLabel updatedAt={DTI_WHEEL_UPDATED_AT} />
      <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-slate-500">{DTI_WHEEL_DISCLAIMER}</p>
    </section>
  )
}

export default function DtiWheelSeoSections() {
  return (
    <div className="mx-auto max-w-3xl px-1 pb-8 pt-4 text-slate-700">
      <article id="dti-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-pink-700">
          Complete guide
        </p>
        <nav
          id="dti-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="flex list-decimal flex-wrap gap-x-4 gap-y-1 pl-5 text-sm marker:text-pink-700">
            {DTI_WHEEL_ON_THIS_PAGE.map((item) => (
              <li key={item.id} className="marker:font-semibold">
                <a
                  href={`#${item.id}`}
                  className="text-pink-700 underline-offset-2 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="dti-how-it-works" className="scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            How the spinner works
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            The dti wheel outfit picker loads twenty ready-made Dress to Impress themes so you can spin
            immediately. Every enabled entry receives one equal slice. When the pointer stops, you get a clear
            theme, aesthetic, color rule, or challenge prompt for your next Roblox DTI round—no chat arguments
            required. Keep spinning for rematches, or switch templates when you want hair, accessory, or
            seasonal challenges instead.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2">
            {DTI_WHEEL_HOW_IT_WORKS.map((step, index) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-pink-100 bg-white p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-600 font-bold text-white">
                  {index + 1}
                </span>
                <p className="self-center text-sm leading-relaxed text-slate-600">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="dti-create-own" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Create Your Own Outfit Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Templates are only the starting point. Build a custom Dress to Impress board for private servers,
            Discord fashion nights, TikTok series, or classroom-friendly Roblox clubs. Add your own outfit
            ideas, aesthetics, and color locks; attach optional images for mood boards; then save or share the
            exact list so everyone spins the same rules.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DTI_WHEEL_FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="dti-templates" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Popular DTI Wheel Templates
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Jump to a focused spinner when you need themes, colors, aesthetics, hair, accessories, or seasonal
            vibes. Each template page preloads a useful list so you arrive ready to spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {DTI_WHEEL_POPULAR_TEMPLATES.map((item) => (
              <li key={item.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-pink-700">
                  {item.audience}
                </p>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            Browse the cluster from the template strip above the wheel, or start at{" "}
            <Link href={DTI_WHEEL_PATH} className="font-semibold text-pink-800 underline">
              DTI Wheel Outfit Picker
            </Link>{" "}
            and branch into theme, color, and challenge spokes.
          </p>
        </section>

        <section id="dti-fun-ways" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Fun Ways to Use the DTI Wheel
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Whether you are grinding Dress to Impress lobbies, hosting friends, or filming short-form fashion
            challenges, a fair spin keeps the night moving and the looks varied.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {DTI_WHEEL_FUN_WAYS.map((group) => (
              <div key={group.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-3 font-semibold text-slate-900">{group.title}</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-pink-600" aria-hidden>
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

        <section id="dti-why" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Why Use Our DTI Wheel Outfit Picker?
          </h2>
          <p className="mb-6 leading-relaxed text-slate-600">
            Fresh outfit inspiration matters when players fall into the same three combinations. Custom
            challenges keep private servers entertaining. Content creators get a live decision mechanic that
            audiences understand instantly. And because every enabled entry starts with equal odds, the result
            feels fair unless you deliberately customize the board.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {DTI_WHEEL_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="rounded-xl border border-pink-100 bg-pink-50/40 px-4 py-3 text-sm text-slate-700"
              >
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        <section id="dti-related" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Related Wheel Tools
          </h2>
          <p className="mb-6 text-slate-600">
            Pair the dti wheel outfit picker with other Spinifywheel tools for color locks, yes/no decisions,
            prizes, and name picks.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {DTI_WHEEL_RELATED_TOOLS.map((tool) => (
              <li key={`${tool.href}-${tool.label}`}>
                <Link
                  href={tool.href}
                  className="block h-full rounded-xl border bg-white p-4 hover:border-pink-300"
                >
                  <span className="font-semibold text-slate-900">{tool.label}</span>
                  <span className="mt-1 block text-xs text-slate-600">{tool.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="dti-faq" className="mt-12 scroll-mt-24">
          <h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {DTI_WHEEL_FAQ_ITEMS.map((item) => (
              <div key={item.question} className="rounded-xl border bg-white p-5 shadow-sm">
                <dt className="font-semibold text-slate-900">{item.question}</dt>
                <dd className="mt-2 text-sm text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-10 text-center text-xs text-slate-500">{DTI_WHEEL_DISCLAIMER}</p>
      </article>
    </div>
  )
}
