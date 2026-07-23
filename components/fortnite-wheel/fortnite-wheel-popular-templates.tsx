"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { CircleDot, Gem, GitBranch, MapPin, Package, Sparkles, Star, Swords, Users, Zap } from "lucide-react"
import { FORTNITE_WHEEL_POPULAR_SPOKE_LINKS } from "@/lib/fortnite-wheel-spokes"
import type { FortniteWheelUseCaseAccent } from "@/lib/fortnite-wheel-use-cases"
import type { FortniteWheelSpokeId } from "@/lib/fortnite-wheel-spokes"

const ICONS: Partial<Record<FortniteWheelSpokeId, LucideIcon>> = {
  "all-skins": CircleDot,
  common: Users,
  uncommon: Sparkles,
  rare: Star,
  epic: Gem,
  legendary: Zap,
  mythic: Zap,
  collabs: Star,
  "weapon-wheel": Swords,
  "landing-spot-wheel": MapPin,
  "loadout-wheel": Package,
  "mythic-weapon-wheel": Zap,
  "vehicle-wheel": CircleDot,
  "duo-challenge": Users,
  "squad-challenge": Users,
  "emote-wheel": Sparkles,
  "loot-challenge": Package,
  "item-picker": Package,
  "decision-wheel": GitBranch,
}

const ACCENT: Record<
  FortniteWheelUseCaseAccent,
  { chip: string; icon: string; card: string; cardActive: string }
> = {
  sky: {
    chip: "bg-sky-100",
    icon: "text-sky-600",
    card: "border-sky-200 bg-gradient-to-br from-sky-50 to-white hover:border-sky-400",
    cardActive:
      "border-sky-500 bg-gradient-to-br from-sky-100 to-sky-50 shadow-md ring-2 ring-sky-300",
  },
  slate: {
    chip: "bg-slate-100",
    icon: "text-slate-600",
    card: "border-slate-200 bg-gradient-to-br from-slate-50 to-white hover:border-slate-400",
    cardActive:
      "border-slate-500 bg-gradient-to-br from-slate-100 to-slate-50 shadow-md ring-2 ring-slate-300",
  },
  emerald: {
    chip: "bg-emerald-100",
    icon: "text-emerald-600",
    card: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-400",
    cardActive:
      "border-emerald-500 bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-md ring-2 ring-emerald-300",
  },
  blue: {
    chip: "bg-blue-100",
    icon: "text-blue-600",
    card: "border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-400",
    cardActive:
      "border-blue-500 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md ring-2 ring-blue-300",
  },
  violet: {
    chip: "bg-violet-100",
    icon: "text-violet-600",
    card: "border-violet-200 bg-gradient-to-br from-violet-50 to-white hover:border-violet-400",
    cardActive:
      "border-violet-500 bg-gradient-to-br from-violet-100 to-violet-50 shadow-md ring-2 ring-violet-300",
  },
  amber: {
    chip: "bg-amber-100",
    icon: "text-amber-600",
    card: "border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-400",
    cardActive:
      "border-amber-500 bg-gradient-to-br from-amber-100 to-amber-50 shadow-md ring-2 ring-amber-300",
  },
  rose: {
    chip: "bg-rose-100",
    icon: "text-rose-600",
    card: "border-rose-200 bg-gradient-to-br from-rose-50 to-white hover:border-rose-400",
    cardActive:
      "border-rose-500 bg-gradient-to-br from-rose-100 to-rose-50 shadow-md ring-2 ring-rose-300",
  },
  orange: {
    chip: "bg-orange-100",
    icon: "text-orange-600",
    card: "border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:border-orange-400",
    cardActive:
      "border-orange-500 bg-gradient-to-br from-orange-100 to-orange-50 shadow-md ring-2 ring-orange-300",
  },
  red: {
    chip: "bg-red-100",
    icon: "text-red-600",
    card: "border-red-200 bg-gradient-to-br from-red-50 to-white hover:border-red-400",
    cardActive:
      "border-red-500 bg-gradient-to-br from-red-100 to-red-50 shadow-md ring-2 ring-red-300",
  },
  cyan: {
    chip: "bg-cyan-100",
    icon: "text-cyan-600",
    card: "border-cyan-200 bg-gradient-to-br from-cyan-50 to-white hover:border-cyan-400",
    cardActive:
      "border-cyan-500 bg-gradient-to-br from-cyan-100 to-cyan-50 shadow-md ring-2 ring-cyan-300",
  },
  indigo: {
    chip: "bg-indigo-100",
    icon: "text-indigo-600",
    card: "border-indigo-200 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-400",
    cardActive:
      "border-indigo-500 bg-gradient-to-br from-indigo-100 to-indigo-50 shadow-md ring-2 ring-indigo-300",
  },
  yellow: {
    chip: "bg-yellow-100",
    icon: "text-yellow-600",
    card: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white hover:border-yellow-400",
    cardActive:
      "border-yellow-500 bg-gradient-to-br from-yellow-100 to-yellow-50 shadow-md ring-2 ring-yellow-300",
  },
  lime: {
    chip: "bg-lime-100",
    icon: "text-lime-600",
    card: "border-lime-200 bg-gradient-to-br from-lime-50 to-white hover:border-lime-400",
    cardActive:
      "border-lime-500 bg-gradient-to-br from-lime-100 to-lime-50 shadow-md ring-2 ring-lime-300",
  },
  pink: {
    chip: "bg-pink-100",
    icon: "text-pink-600",
    card: "border-pink-200 bg-gradient-to-br from-pink-50 to-white hover:border-pink-400",
    cardActive:
      "border-pink-500 bg-gradient-to-br from-pink-100 to-pink-50 shadow-md ring-2 ring-pink-300",
  },
  teal: {
    chip: "bg-teal-100",
    icon: "text-teal-600",
    card: "border-teal-200 bg-gradient-to-br from-teal-50 to-white hover:border-teal-400",
    cardActive:
      "border-teal-500 bg-gradient-to-br from-teal-100 to-teal-50 shadow-md ring-2 ring-teal-300",
  },
  fuchsia: {
    chip: "bg-fuchsia-100",
    icon: "text-fuchsia-600",
    card: "border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-white hover:border-fuchsia-400",
    cardActive:
      "border-fuchsia-500 bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 shadow-md ring-2 ring-fuchsia-300",
  },
}

export function FortniteWheelPopularTemplates() {
  const pathname = usePathname()
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})

  useEffect(() => {
    const active = FORTNITE_WHEEL_POPULAR_SPOKE_LINKS.find(
      (item) => item.href === pathname,
    )
    if (!active) return
    itemRefs.current[active.id]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [pathname])

  return (
    <section
      id="fortnite-popular"
      aria-labelledby="fortnite-popular-templates"
      className="mb-6 w-full scroll-mt-24"
    >
      <div className="mb-3 text-center sm:text-left">
        <h2
          id="fortnite-popular-templates"
          className="text-lg font-bold text-slate-900 sm:text-xl"
        >
          Popular Fortnite Templates
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Each template opens its own page with skins, weapons, landing spots, challenges, and
          more—same pattern as NBA and MLB pickers.
        </p>
      </div>

      <ul
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Popular Fortnite templates"
      >
        {FORTNITE_WHEEL_POPULAR_SPOKE_LINKS.map((item) => {
          const isActive = pathname === item.href
          const Icon = ICONS[item.id] ?? CircleDot
          const styles = ACCENT[item.accent]
          return (
            <li
              key={item.href}
              ref={(el) => {
                itemRefs.current[item.id] = el
              }}
              className="w-[220px] shrink-0 snap-center sm:w-[240px]"
            >
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-full w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${
                  isActive ? styles.cardActive : styles.card
                }`}
              >
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.chip}`}
                  aria-hidden
                >
                  <Icon className={`h-5 w-5 ${styles.icon}`} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-snug text-slate-900">
                    {item.label}
                  </span>
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
