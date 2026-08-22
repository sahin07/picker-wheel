"use client"

import { usePathname } from "next/navigation"
import { MLB_ANGELS_USE_CASES } from "@/lib/mlb-angels-use-cases"
import { applyMlbAngelsUseCase, type MlbAngelsUseCaseId } from "@/lib/mlb-angels-use-cases"
import { useWheelManagerStore, type MlbAngelsWheelData } from "@/stores/wheel-manager-store"

const ACCENT: Record<string, string> = {
  red: "border-red-400 bg-red-50 ring-red-200",
  gold: "border-amber-400 bg-amber-50 ring-amber-200",
  navy: "border-slate-500 bg-slate-50 ring-slate-300",
}

export function MlbAngelsPopularTemplates() {
  const pathname = usePathname()
  const wheel = useWheelManagerStore((state) =>
    (state.wheelsByTool["mlb-angels-wheel"] || []).find((item) => item.id === state.currentWheelId) || null)
  const activeId = (wheel?.data as MlbAngelsWheelData | undefined)?.activeUseCaseId || "all-nicknames"

  if (pathname !== "/mlb-angels-nickname-wheel") return null

  const apply = (id: MlbAngelsUseCaseId) => {
    applyMlbAngelsUseCase(id)
  }

  return (
    <section
      id="angels-popular"
      aria-labelledby="angels-popular-heading"
      className="mb-4 w-full min-w-0"
    >
      <h2 id="angels-popular-heading" className="sr-only">
        Popular Angels nickname modes
      </h2>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MLB_ANGELS_USE_CASES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => apply(item.id)}
            className={`min-w-[9.5rem] shrink-0 snap-start rounded-xl border px-3 py-2.5 text-left transition-shadow sm:min-w-[10.5rem] ${
              activeId === item.id
                ? `ring-2 ${ACCENT[item.accent] || ACCENT.red}`
                : "border-slate-200 bg-white hover:border-red-200 hover:bg-red-50/40"
            }`}
          >
            <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
            <span className="mt-0.5 block text-xs leading-snug text-slate-500">{item.description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
