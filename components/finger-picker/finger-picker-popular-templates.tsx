"use client"

import Link from "next/link"
import { FINGER_PICKER_POPULAR } from "@/lib/finger-picker-seo"

export function FingerPickerPopularTemplates() {
  return (
    <section id="fp-popular" className="mb-6 scroll-mt-24">
      <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-violet-700">
        Popular finger picker modes
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {FINGER_PICKER_POPULAR.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="min-w-[200px] rounded-xl border border-violet-200 bg-white p-3 hover:border-violet-400"
          >
            <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
            <span className="mt-1 block text-xs text-slate-600">{item.description}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
