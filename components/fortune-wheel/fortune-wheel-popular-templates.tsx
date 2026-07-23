"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"
import { FORTUNE_WHEEL_POPULAR_SPOKE_LINKS } from "@/lib/fortune-wheel-spokes"

const styles = {
  amber: "border-amber-200 hover:border-amber-400",
  blue: "border-blue-200 hover:border-blue-400",
  cyan: "border-cyan-200 hover:border-cyan-400",
  emerald: "border-emerald-200 hover:border-emerald-400",
  orange: "border-orange-200 hover:border-orange-400",
  violet: "border-violet-200 hover:border-violet-400",
  rose: "border-rose-200 hover:border-rose-400",
}
export function FortuneWheelPopularTemplates() {
  const pathname = usePathname()
  const refs = useRef<Record<string, HTMLLIElement | null>>({})
  useEffect(() => {
    const active = FORTUNE_WHEEL_POPULAR_SPOKE_LINKS.find((item) => item.href === pathname)
    refs.current[active?.id || ""]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [pathname])
  return <section id="fortune-popular" className="mb-6 w-full scroll-mt-24" aria-labelledby="fortune-popular-templates">
    <div className="mb-3 text-center sm:text-left"><h2 id="fortune-popular-templates" className="text-lg font-bold text-slate-900 sm:text-xl">Popular Fortune Wheel Templates</h2>
      <p className="mt-1 text-sm text-slate-600">Start with a game-show wheel, then customize every wedge.</p></div>
    <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FORTUNE_WHEEL_POPULAR_SPOKE_LINKS.map((item) => <li key={item.href} ref={(node) => { refs.current[item.id] = node }} className="w-[220px] shrink-0 snap-center sm:w-[240px]">
        <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}
          className={`flex h-full items-start gap-3 rounded-xl border bg-white px-3.5 py-3 transition-all ${styles[item.accent as keyof typeof styles] || styles.violet} ${pathname === item.href ? "ring-2 ring-violet-200" : ""}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100"><Sparkles className="h-5 w-5 text-violet-700" /></span>
          <span className="min-w-0"><span className="block text-sm font-semibold text-slate-900">{item.label}</span>
            <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-600">{item.description}</span></span>
        </Link></li>)}
    </ul>
  </section>
}
