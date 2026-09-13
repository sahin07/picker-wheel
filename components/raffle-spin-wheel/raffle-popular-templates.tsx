"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  RAFFLE_SPIN_WHEEL_POPULAR_SPOKE_LINKS,
  type RaffleSpinWheelSpokeId,
} from "@/lib/raffle-spin-wheel-spokes"
import type { RaffleSpinWheelUseCaseAccent } from "@/lib/raffle-spin-wheel-use-cases"

const ACCENT: Record<RaffleSpinWheelUseCaseAccent, string> = {
  amber: "border-amber-300 bg-amber-50 hover:border-amber-500",
  emerald: "border-emerald-300 bg-emerald-50 hover:border-emerald-500",
  rose: "border-rose-300 bg-rose-50 hover:border-rose-500",
  sky: "border-sky-300 bg-sky-50 hover:border-sky-500",
  violet: "border-violet-300 bg-violet-50 hover:border-violet-500",
}

export function RafflePopularTemplates() {
  const pathname = usePathname()
  const itemRefs = useRef<Partial<Record<RaffleSpinWheelSpokeId, HTMLLIElement | null>>>({})

  useEffect(() => {
    const active = RAFFLE_SPIN_WHEEL_POPULAR_SPOKE_LINKS.find((item) => item.href === pathname)
    if (!active) return
    itemRefs.current[active.id]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [pathname])

  return (
    <div className="mb-5">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-amber-800">
        Popular raffle setups
      </p>
      <ul className="flex flex-wrap justify-center gap-2">
        {RAFFLE_SPIN_WHEEL_POPULAR_SPOKE_LINKS.map((item) => {
          const active = pathname === item.href
          return (
            <li
              key={item.id}
              ref={(node) => {
                itemRefs.current[item.id] = node
              }}
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg border px-3 py-2 text-left text-sm transition ${
                  ACCENT[item.accent]
                } ${active ? "ring-2 ring-amber-500" : ""}`}
              >
                <span className="block font-semibold text-slate-900">{item.label}</span>
                <span className="block text-xs text-slate-600">{item.description}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
