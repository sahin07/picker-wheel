"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  Dice5,
  Dices,
  Gift,
  Percent,
  Scale,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"
import {
  WEIGHTED_WHEEL_POPULAR_SPOKE_LINKS,
  type WeightedWheelSpokeId,
} from "@/lib/weighted-wheel-spokes"
import type { WeightedWheelUseCaseAccent } from "@/lib/weighted-wheel-use-cases"

const ICONS: Partial<Record<WeightedWheelSpokeId, LucideIcon>> = {
  weighted: Scale,
  rigged: Zap,
  probability: Percent,
  "weighted-random": Dice5,
  odds: Target,
  chance: Dices,
  percentage: Percent,
  "prize-odds": Gift,
  loot: Sparkles,
  event: Zap,
}

const ACCENT: Record<
  WeightedWheelUseCaseAccent,
  { chip: string; icon: string; card: string; active: string }
> = {
  sky: { chip: "bg-sky-100", icon: "text-sky-600", card: "border-sky-200 hover:border-sky-400", active: "border-sky-500 bg-sky-50 ring-2 ring-sky-200" },
  emerald: { chip: "bg-emerald-100", icon: "text-emerald-600", card: "border-emerald-200 hover:border-emerald-400", active: "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200" },
  amber: { chip: "bg-amber-100", icon: "text-amber-600", card: "border-amber-200 hover:border-amber-400", active: "border-amber-500 bg-amber-50 ring-2 ring-amber-200" },
  violet: { chip: "bg-violet-100", icon: "text-violet-600", card: "border-violet-200 hover:border-violet-400", active: "border-violet-500 bg-violet-50 ring-2 ring-violet-200" },
  rose: { chip: "bg-rose-100", icon: "text-rose-600", card: "border-rose-200 hover:border-rose-400", active: "border-rose-500 bg-rose-50 ring-2 ring-rose-200" },
  blue: { chip: "bg-blue-100", icon: "text-blue-600", card: "border-blue-200 hover:border-blue-400", active: "border-blue-500 bg-blue-50 ring-2 ring-blue-200" },
  teal: { chip: "bg-teal-100", icon: "text-teal-600", card: "border-teal-200 hover:border-teal-400", active: "border-teal-500 bg-teal-50 ring-2 ring-teal-200" },
  orange: { chip: "bg-orange-100", icon: "text-orange-600", card: "border-orange-200 hover:border-orange-400", active: "border-orange-500 bg-orange-50 ring-2 ring-orange-200" },
  indigo: { chip: "bg-indigo-100", icon: "text-indigo-600", card: "border-indigo-200 hover:border-indigo-400", active: "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200" },
  purple: { chip: "bg-purple-100", icon: "text-purple-600", card: "border-purple-200 hover:border-purple-400", active: "border-purple-500 bg-purple-50 ring-2 ring-purple-200" },
}

export function WeightedWheelPopularTemplates() {
  const pathname = usePathname()
  const refs = useRef<Record<string, HTMLLIElement | null>>({})

  useEffect(() => {
    const active = WEIGHTED_WHEEL_POPULAR_SPOKE_LINKS.find((item) => item.href === pathname)
    refs.current[active?.id || ""]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [pathname])

  return (
    <section className="mb-6 w-full" aria-labelledby="weighted-popular-templates">
      <div className="mb-3 text-center sm:text-left">
        <h2 id="weighted-popular-templates" className="text-lg font-bold text-slate-900 sm:text-xl">
          Popular Weighted Wheel Templates
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Start with a transparent probability setup, then adjust every weight.
        </p>
      </div>
      <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {WEIGHTED_WHEEL_POPULAR_SPOKE_LINKS.map((item) => {
          const active = pathname === item.href
          const Icon = ICONS[item.id] || Scale
          const style = ACCENT[item.accent]
          return (
            <li
              key={item.href}
              ref={(node) => { refs.current[item.id] = node }}
              className="w-[220px] shrink-0 snap-center sm:w-[240px]"
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full items-start gap-3 rounded-xl border bg-white px-3.5 py-3 transition-all ${
                  active ? style.active : style.card
                }`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.chip}`}>
                  <Icon className={`h-5 w-5 ${style.icon}`} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
