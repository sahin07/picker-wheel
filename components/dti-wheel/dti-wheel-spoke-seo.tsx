import Link from "next/link"
import { DTI_WHEEL_DISCLAIMER, DTI_WHEEL_PATH } from "@/lib/dti-wheel-seo"
import { getDtiSpokeSiblings, type DtiWheelSpokeSeo } from "@/lib/dti-wheel-spokes"
import {
  SpokeTipsSection,
  SpokeUpdatedLabel,
} from "@/components/spoke-seo-blocks"

export function DtiWheelSpokeSeoIntro({ spoke }: { spoke: DtiWheelSpokeSeo }) {
  return (
    <section
      aria-labelledby="dti-spoke-heading"
      className="mx-auto mb-10 max-w-5xl border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h2
        id="dti-spoke-heading"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {spoke.h1}
      </h2>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {spoke.heroIntro}
      </p>
      <SpokeUpdatedLabel updatedAt={spoke.updatedAt} />
      <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-slate-500">{DTI_WHEEL_DISCLAIMER}</p>
    </section>
  )
}

export function DtiWheelSpokeSeoSections({ spoke }: { spoke: DtiWheelSpokeSeo }) {
  const siblings = getDtiSpokeSiblings(spoke)
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
        <SpokeTipsSection tips={spoke.tips} id="dti-spoke-tips" accentClass="marker:text-pink-700" />
        <section className="mt-12">
          <h2 className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Related DTI Wheels
          </h2>
          <p className="mb-6 text-slate-600">
            Try another Dress to Impress spinner or return to the{" "}
            <Link href={DTI_WHEEL_PATH} className="font-semibold text-pink-800 underline">
              DTI Wheel Outfit Picker
            </Link>
            .
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {siblings.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="block h-full rounded-xl border bg-white p-4 hover:border-pink-300"
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
