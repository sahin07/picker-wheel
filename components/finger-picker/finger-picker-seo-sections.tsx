import Link from "next/link"
import {
  FINGER_PICKER_ARTICLE_TITLE,
  FINGER_PICKER_FAQ_ITEMS,
  FINGER_PICKER_H1,
  FINGER_PICKER_HERO_INTRO,
  FINGER_PICKER_ON_THIS_PAGE,
  FINGER_PICKER_PATH,
  FINGER_PICKER_POPULAR,
  FINGER_PICKER_RELATED_TOOLS,
} from "@/lib/finger-picker-seo"
import { FINGER_PICKER_USE_CASES } from "@/lib/finger-picker-use-cases"

export function FingerPickerSeoIntro() {
  return (
    <section
      aria-labelledby="fp-spin-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h2 id="fp-spin-h1" className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl">
        {FINGER_PICKER_H1}
      </h2>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {FINGER_PICKER_HERO_INTRO}
      </p>
    </section>
  )
}

export function FingerPickerSeoSections() {
  return (
    <article className="mx-auto mt-12 max-w-3xl space-y-12 text-slate-700">
      <nav className="rounded-xl border bg-white p-4 text-sm">
        <p className="font-semibold text-slate-900">On this page</p>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {FINGER_PICKER_ON_THIS_PAGE.map((item) => (
            <li key={item.id}><a className="text-violet-700 underline" href={`#${item.id}`}>{item.label}</a></li>
          ))}
        </ul>
      </nav>
      <section id="fp-how">
        <h2 className="font-spin-display text-2xl font-bold text-slate-900">{FINGER_PICKER_ARTICLE_TITLE}</h2>
        <p className="mt-3">
          Open the board, place two to ten fingers (or click markers on a computer), then press Pick. A countdown
          freezes the board and one finger is chosen with equal odds. Optional names and colors label each touch.
        </p>
      </section>
      <section id="fp-modes">
        <h2 className="font-spin-display text-2xl font-bold text-slate-900">Modes & games</h2>
        <ul className="mt-3 grid gap-2">
          {FINGER_PICKER_USE_CASES.map((item) => (
            <li key={item.id} className="rounded-lg border p-3">
              <p className="font-semibold">{item.label}</p>
              <p className="text-sm text-slate-600">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>
      <section id="fp-why">
        <h2 className="font-spin-display text-2xl font-bold text-slate-900">Why not a name wheel?</h2>
        <p className="mt-3">
          Random Name Picker is better when people are remote or you already have a typed list. Finger Picker is for
          the same room: who goes first, last finger standing, and truth-or-dare without typing names first.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {FINGER_PICKER_POPULAR.map((item) => (
            <li key={item.href}><Link className="text-violet-700 underline" href={item.href}>{item.label}</Link></li>
          ))}
        </ul>
      </section>
      <section id="fp-related">
        <h2 className="font-spin-display text-2xl font-bold text-slate-900">Related tools</h2>
        <ul className="mt-3 grid gap-2">
          {FINGER_PICKER_RELATED_TOOLS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="font-medium text-violet-700 underline">{item.label}</Link>
              <span className="text-sm text-slate-600"> — {item.description}</span>
            </li>
          ))}
        </ul>
      </section>
      <section id="fp-faq">
        <h2 className="font-spin-display text-2xl font-bold text-slate-900">FAQ</h2>
        <dl className="mt-3 space-y-4">
          {FINGER_PICKER_FAQ_ITEMS.map((item) => (
            <div key={item.question}>
              <dt className="font-semibold text-slate-900">{item.question}</dt>
              <dd className="mt-1 text-slate-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="text-sm text-slate-500">
        Hub: <Link className="underline" href={FINGER_PICKER_PATH}>Finger Picker</Link>.
      </p>
    </article>
  )
}
