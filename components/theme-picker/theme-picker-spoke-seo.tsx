import Link from "next/link"
import { THEME_PICKER_PATH } from "@/lib/theme-picker-seo"
import { getThemeSpokeSiblings, type ThemePickerSpokeSeo } from "@/lib/theme-picker-spokes"
import {
  SpokeIntentRelatedSection,
  SpokeTipsSection,
  SpokeUpdatedLabel,
} from "@/components/spoke-seo-blocks"

export function ThemePickerSpokeSeoIntro({ spoke }: { spoke: ThemePickerSpokeSeo }) {
  return (
    <section
      aria-labelledby="theme-spoke-heading"
      className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h2
        id="theme-spoke-heading"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {spoke.h1}
      </h2>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {spoke.heroIntro}
      </p>
      <SpokeUpdatedLabel updatedAt={spoke.updatedAt} />
      <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-slate-600">
        Part of the{" "}
        <Link href={THEME_PICKER_PATH} className="font-semibold text-teal-800 underline">
          Theme Picker Wheel
        </Link>{" "}
        hub.
      </p>
    </section>
  )
}

export function ThemePickerSpokeSeoSections({ spoke }: { spoke: ThemePickerSpokeSeo }) {
  const siblings = getThemeSpokeSiblings(spoke).filter((item) => item.id !== "pillar")
  return (
    <div className="mx-auto max-w-5xl px-1 pb-8 pt-4 text-slate-700">
      <article className="border-t border-slate-200 pt-12">
        <section>
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            {spoke.articleTitle}
          </h2>
          <div className="space-y-4 leading-relaxed text-slate-600">
            {spoke.articleIntro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
        <section className="mt-12">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            {spoke.uniqueSection.title}
          </h2>
          <p className="mb-6 text-slate-600">{spoke.uniqueSection.intro}</p>
          <ul className="grid gap-4 sm:grid-cols-3">
            {spoke.uniqueSection.points.map((point) => (
              <li key={point.title} className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-2 font-semibold text-slate-900">{point.title}</h3>
                <p className="text-sm text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
        </section>
        <SpokeTipsSection tips={spoke.tips} id="theme-spoke-tips" accentClass="marker:text-teal-700" />
        <SpokeIntentRelatedSection
          currentPath={spoke.path}
          id="theme-spoke-intent"
          accentHover="hover:border-teal-300 hover:bg-teal-50/50"
        />
        <section className="mt-12">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Related Theme Wheels
          </h2>
          <p className="mb-6 text-slate-600">
            Try another theme template or return to the{" "}
            <Link href={THEME_PICKER_PATH} className="font-semibold text-teal-800 underline">
              Theme Picker Wheel
            </Link>
            .
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {siblings.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="block h-full rounded-xl border bg-white p-4 hover:border-teal-300"
                >
                  <span className="font-semibold text-slate-900">{item.shortTitle}</span>
                  <span className="mt-1 line-clamp-2 block text-xs text-slate-600">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-12">
          <h2 className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-4">
            {spoke.faq.map((item) => (
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
