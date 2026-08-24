import Link from "next/link"
import { FINGER_PICKER_PATH, FINGER_PICKER_POPULAR } from "@/lib/finger-picker-seo"
import { getFingerSpokeSiblings, type FingerPickerSpokeSeo } from "@/lib/finger-picker-spokes"
import { SpokeIntentRelatedSection, SpokeTipsSection, SpokeUpdatedLabel } from "@/components/spoke-seo-blocks"

export function FingerPickerSpokeSeoIntro({ spoke }: { spoke: FingerPickerSpokeSeo }) {
  return (
    <section className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700">
      <h2 className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl">{spoke.h1}</h2>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">{spoke.heroIntro}</p>
      <SpokeUpdatedLabel updatedAt={spoke.updatedAt} />
    </section>
  )
}

export function FingerPickerSpokeSeoSections({ spoke }: { spoke: FingerPickerSpokeSeo }) {
  const siblings = getFingerSpokeSiblings(spoke)
  return (
    <article className="mx-auto mt-12 max-w-3xl space-y-10 text-slate-700">
      <SpokeTipsSection tips={spoke.tips} />
      {spoke.uniqueSection && (
        <section>
          <h2 className="font-spin-display text-2xl font-bold text-slate-900">{spoke.uniqueSection.title}</h2>
          <p className="mt-3">{spoke.uniqueSection.intro}</p>
          <ul className="mt-3 space-y-2">
            {spoke.uniqueSection.points.map((point) => (
              <li key={point.title} className="rounded-lg border p-3">
                <p className="font-semibold">{point.title}</p>
                <p className="text-sm text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section>
        <h2 className="font-spin-display text-2xl font-bold text-slate-900">{spoke.articleTitle}</h2>
        {spoke.articleIntro.map((para) => <p key={para} className="mt-3">{para}</p>)}
      </section>
      <section>
        <h2 className="font-spin-display text-2xl font-bold text-slate-900">Related Finger Picker pages</h2>
        <ul className="mt-3 grid gap-2">
          {siblings.map((item) => (
            <li key={item.path}><Link className="text-violet-700 underline" href={item.path}>{item.h1}</Link></li>
          ))}
          {FINGER_PICKER_POPULAR.filter((item) => item.href !== spoke.path).slice(0, 4).map((item) => (
            <li key={item.href}><Link className="text-violet-700 underline" href={item.href}>{item.label}</Link></li>
          ))}
        </ul>
      </section>
      <SpokeIntentRelatedSection currentPath={spoke.path} />
      <section>
        <h2 className="font-spin-display text-2xl font-bold text-slate-900">FAQ</h2>
        <dl className="mt-3 space-y-4">
          {spoke.faq.map((item) => (
            <div key={item.question}>
              <dt className="font-semibold">{item.question}</dt>
              <dd className="mt-1 text-slate-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="text-sm"><Link className="text-violet-700 underline" href={FINGER_PICKER_PATH}>Back to Finger Picker</Link></p>
    </article>
  )
}
