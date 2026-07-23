"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleDot } from "lucide-react"
import { JJK_WHEEL_POPULAR_SPOKE_LINKS } from "@/lib/jjk-wheel-spokes"

const ACCENTS: Record<string, string> = {
  violet: "border-violet-200 from-violet-50 hover:border-violet-400",
  red: "border-red-200 from-red-50 hover:border-red-400",
  blue: "border-blue-200 from-blue-50 hover:border-blue-400",
  amber: "border-amber-200 from-amber-50 hover:border-amber-400",
  emerald: "border-emerald-200 from-emerald-50 hover:border-emerald-400",
  rose: "border-rose-200 from-rose-50 hover:border-rose-400",
  slate: "border-slate-200 from-slate-50 hover:border-slate-400",
}

export function JjkWheelPopularTemplates() {
  const pathname = usePathname()
  return <section id="jjk-popular" className="mb-6 w-full scroll-mt-24" aria-labelledby="jjk-popular-heading">
    <div className="mb-3 text-center sm:text-left"><h2 id="jjk-popular-heading" className="text-lg font-bold text-slate-900 sm:text-xl">
      Popular JJK Wheels</h2>
      <p className="mt-1 text-sm text-slate-600">Ready-made character, villain, spirit, technique, domain, and team templates.</p></div>
    <ul className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
      {JJK_WHEEL_POPULAR_SPOKE_LINKS.map((item) => {
        const active = pathname === item.href
        return <li key={item.href} className="w-[220px] shrink-0 snap-center"><Link href={item.href}
          aria-current={active ? "page" : undefined}
          className={`flex h-full gap-3 rounded-xl border bg-gradient-to-br to-white p-3 transition-all ${ACCENTS[item.accent]} ${active ? "ring-2 ring-violet-300 shadow-md" : ""}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm"><CircleDot className="h-5 w-5 text-violet-700" /></span>
          <span className="min-w-0"><span className="block text-sm font-semibold text-slate-900">{item.label}</span>
            <span className="mt-1 line-clamp-2 block text-xs text-slate-600">{item.description}</span></span>
        </Link></li>
      })}
    </ul>
  </section>
}
