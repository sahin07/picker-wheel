"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  Compass,
  Globe,
  Landmark,
  Leaf,
  Map,
  MapPin,
  Navigation,
  Plane,
  Sun,
  Waves,
} from "lucide-react"
import {
  COUNTRY_WHEEL_POPULAR_SPOKE_LINKS,
  type CountryWheelSpokeId,
} from "@/lib/country-wheel-spokes"
import type { CountryWheelUseCaseAccent } from "@/lib/country-wheel-use-cases"

const ICONS: Partial<Record<CountryWheelSpokeId, LucideIcon>> = {
  all: Globe,
  europe: Map,
  asia: Compass,
  africa: Sun,
  "north-america": Landmark,
  "south-america": Leaf,
  oceania: Waves,
  travel: Plane,
  visit: Navigation,
  favorites: MapPin,
}

const ACCENT: Record<
  CountryWheelUseCaseAccent,
  { chip: string; icon: string; card: string; cardActive: string }
> = {
  sky: {
    chip: "bg-sky-100",
    icon: "text-sky-600",
    card: "border-sky-200 bg-gradient-to-br from-sky-50 to-white hover:border-sky-400",
    cardActive: "border-sky-500 bg-gradient-to-br from-sky-100 to-sky-50 shadow-md ring-2 ring-sky-300",
  },
  blue: {
    chip: "bg-blue-100",
    icon: "text-blue-600",
    card: "border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-400",
    cardActive: "border-blue-500 bg-gradient-to-br from-blue-100 to-blue-50 shadow-md ring-2 ring-blue-300",
  },
  emerald: {
    chip: "bg-emerald-100",
    icon: "text-emerald-600",
    card: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-400",
    cardActive:
      "border-emerald-500 bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-md ring-2 ring-emerald-300",
  },
  amber: {
    chip: "bg-amber-100",
    icon: "text-amber-600",
    card: "border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-400",
    cardActive: "border-amber-500 bg-gradient-to-br from-amber-100 to-amber-50 shadow-md ring-2 ring-amber-300",
  },
  orange: {
    chip: "bg-orange-100",
    icon: "text-orange-600",
    card: "border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:border-orange-400",
    cardActive:
      "border-orange-500 bg-gradient-to-br from-orange-100 to-orange-50 shadow-md ring-2 ring-orange-300",
  },
  teal: {
    chip: "bg-teal-100",
    icon: "text-teal-600",
    card: "border-teal-200 bg-gradient-to-br from-teal-50 to-white hover:border-teal-400",
    cardActive: "border-teal-500 bg-gradient-to-br from-teal-100 to-teal-50 shadow-md ring-2 ring-teal-300",
  },
  rose: {
    chip: "bg-rose-100",
    icon: "text-rose-600",
    card: "border-rose-200 bg-gradient-to-br from-rose-50 to-white hover:border-rose-400",
    cardActive: "border-rose-500 bg-gradient-to-br from-rose-100 to-rose-50 shadow-md ring-2 ring-rose-300",
  },
  violet: {
    chip: "bg-violet-100",
    icon: "text-violet-600",
    card: "border-violet-200 bg-gradient-to-br from-violet-50 to-white hover:border-violet-400",
    cardActive:
      "border-violet-500 bg-gradient-to-br from-violet-100 to-violet-50 shadow-md ring-2 ring-violet-300",
  },
  indigo: {
    chip: "bg-indigo-100",
    icon: "text-indigo-600",
    card: "border-indigo-200 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-400",
    cardActive:
      "border-indigo-500 bg-gradient-to-br from-indigo-100 to-indigo-50 shadow-md ring-2 ring-indigo-300",
  },
}

/** Popular Country Picker Wheel templates — each card navigates to its spoke URL. */
export function CountryWheelPopularTemplates() {
  const pathname = usePathname()
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})

  useEffect(() => {
    const active = COUNTRY_WHEEL_POPULAR_SPOKE_LINKS.find((item) => item.href === pathname)
    if (!active) return
    itemRefs.current[active.id]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [pathname])

  return (
    <section
      id="country-popular"
      aria-labelledby="country-popular-templates"
      className="mb-6 w-full scroll-mt-24"
    >
      <div className="mb-3 text-center sm:text-left">
        <h2
          id="country-popular-templates"
          className="text-lg font-bold text-slate-900 sm:text-xl"
        >
          Popular Country Picker Wheels
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Ready-made Country Picker Wheel templates for continents, travel destinations, and fair
          random picks.
        </p>
      </div>

      <ul
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Popular country templates"
      >
        {COUNTRY_WHEEL_POPULAR_SPOKE_LINKS.map((item) => {
          const isActive = pathname === item.href
          const Icon = ICONS[item.id] ?? Globe
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
