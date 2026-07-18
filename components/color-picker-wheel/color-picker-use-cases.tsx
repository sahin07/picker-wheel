"use client"

import { useEffect, useRef } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Baby,
  Brush,
  Code2,
  Droplets,
  Flame,
  Hash,
  Palette,
  Rainbow,
  Sparkles,
  Sun,
  Snowflake,
  SwatchBook,
  Wand2,
  FileCode2,
} from "lucide-react"
import {
  COLOR_PICKER_USE_CASES,
  type ColorPickerUseCase,
  type ColorPickerUseCaseId,
} from "@/lib/color-picker-use-cases"

interface ColorPickerUseCasesProps {
  activeId?: ColorPickerUseCaseId | null
  onSelectPreset: (id: ColorPickerUseCaseId) => void
}

const USE_CASE_ICONS: Record<ColorPickerUseCaseId, LucideIcon> = {
  basic: SwatchBook,
  rainbow: Rainbow,
  pastel: Droplets,
  neon: Sparkles,
  primary: Palette,
  secondary: Brush,
  warm: Flame,
  cool: Snowflake,
  crayon: Baby,
  paint: Sun,
  random: Wand2,
  html: Code2,
  css: FileCode2,
  hex: Hash,
}

const ACCENT_STYLES: Record<
  ColorPickerUseCase["accent"],
  { chip: string; icon: string; card: string; cardActive: string }
> = {
  sky: {
    chip: "bg-sky-100",
    icon: "text-sky-600",
    card: "border-sky-200 bg-gradient-to-br from-sky-50 to-white hover:border-sky-400",
    cardActive: "border-sky-500 bg-gradient-to-br from-sky-100 to-sky-50 shadow-md ring-2 ring-sky-300",
  },
  amber: {
    chip: "bg-amber-100",
    icon: "text-amber-600",
    card: "border-amber-200 bg-gradient-to-br from-amber-50 to-white hover:border-amber-400",
    cardActive: "border-amber-500 bg-gradient-to-br from-amber-100 to-amber-50 shadow-md ring-2 ring-amber-300",
  },
  rose: {
    chip: "bg-rose-100",
    icon: "text-rose-600",
    card: "border-rose-200 bg-gradient-to-br from-rose-50 to-white hover:border-rose-400",
    cardActive: "border-rose-500 bg-gradient-to-br from-rose-100 to-rose-50 shadow-md ring-2 ring-rose-300",
  },
  lime: {
    chip: "bg-lime-100",
    icon: "text-lime-700",
    card: "border-lime-200 bg-gradient-to-br from-lime-50 to-white hover:border-lime-400",
    cardActive: "border-lime-500 bg-gradient-to-br from-lime-100 to-lime-50 shadow-md ring-2 ring-lime-300",
  },
  orange: {
    chip: "bg-orange-100",
    icon: "text-orange-600",
    card: "border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:border-orange-400",
    cardActive: "border-orange-500 bg-gradient-to-br from-orange-100 to-orange-50 shadow-md ring-2 ring-orange-300",
  },
  teal: {
    chip: "bg-teal-100",
    icon: "text-teal-600",
    card: "border-teal-200 bg-gradient-to-br from-teal-50 to-white hover:border-teal-400",
    cardActive: "border-teal-500 bg-gradient-to-br from-teal-100 to-teal-50 shadow-md ring-2 ring-teal-300",
  },
  indigo: {
    chip: "bg-indigo-100",
    icon: "text-indigo-600",
    card: "border-indigo-200 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-400",
    cardActive:
      "border-indigo-500 bg-gradient-to-br from-indigo-100 to-indigo-50 shadow-md ring-2 ring-indigo-300",
  },
  cyan: {
    chip: "bg-cyan-100",
    icon: "text-cyan-600",
    card: "border-cyan-200 bg-gradient-to-br from-cyan-50 to-white hover:border-cyan-400",
    cardActive: "border-cyan-500 bg-gradient-to-br from-cyan-100 to-cyan-50 shadow-md ring-2 ring-cyan-300",
  },
  yellow: {
    chip: "bg-yellow-100",
    icon: "text-yellow-600",
    card: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white hover:border-yellow-400",
    cardActive:
      "border-yellow-500 bg-gradient-to-br from-yellow-100 to-yellow-50 shadow-md ring-2 ring-yellow-300",
  },
  violet: {
    chip: "bg-violet-100",
    icon: "text-violet-600",
    card: "border-violet-200 bg-gradient-to-br from-violet-50 to-white hover:border-violet-400",
    cardActive:
      "border-violet-500 bg-gradient-to-br from-violet-100 to-violet-50 shadow-md ring-2 ring-violet-300",
  },
}

export function ColorPickerUseCases({ activeId, onSelectPreset }: ColorPickerUseCasesProps) {
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})

  useEffect(() => {
    if (!activeId) return
    const node = itemRefs.current[activeId]
    if (!node) return
    node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [activeId])

  return (
    <section aria-labelledby="color-picker-popular-wheels" className="mb-6 w-full">
      <div className="mb-3 text-center sm:text-left">
        <h2
          id="color-picker-popular-wheels"
          className="text-lg font-bold text-slate-900 sm:text-xl"
        >
          Popular Color Wheels
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Swipe or tap a palette to load matching colors on the spinner.
        </p>
      </div>

      <ul
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="listbox"
        aria-label="Popular color wheels"
      >
        {COLOR_PICKER_USE_CASES.map((useCase) => {
          const isActive = activeId === useCase.id
          const Icon = USE_CASE_ICONS[useCase.id]
          const styles = ACCENT_STYLES[useCase.accent]
          return (
            <li
              key={useCase.id}
              ref={(el) => {
                itemRefs.current[useCase.id] = el
              }}
              className="w-[220px] shrink-0 snap-center sm:w-[240px]"
            >
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => onSelectPreset(useCase.id)}
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
                    {useCase.label}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-600">
                    {useCase.description}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
