"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  BookOpen,
  Eye,
  Gamepad2,
  GraduationCap,
  Paintbrush,
  PenLine,
  Theater,
  Zap,
} from "lucide-react"
import {
  WORD_PICKER_POPULAR_SPOKE_LINKS,
  type WordPickerSpokeId,
} from "@/lib/word-picker-wheel-spokes"
import type { WordPickerUseCaseAccent } from "@/lib/word-picker-wheel-use-cases"

const ICONS: Partial<Record<string, LucideIcon>> = {
  "common-words": BookOpen,
  "easy-words": BookOpen,
  "funny-words": Gamepad2,
  "weird-words": Zap,
  "positive-words": BookOpen,
  "rhyming-words": PenLine,
  "writing-prompt": PenLine,
  "story-words": PenLine,
  "character-picker": Theater,
  "poetry-words": PenLine,
  brainstorming: Zap,
  classroom: GraduationCap,
  vocabulary: GraduationCap,
  sight: Eye,
  spelling: GraduationCap,
  esl: GraduationCap,
  pictionary: Paintbrush,
  charades: Theater,
  "word-challenge": Gamepad2,
  taboo: Gamepad2,
  "drawing-words": Paintbrush,
  inktober: Paintbrush,
  speaking: Theater,
  acting: Theater,
  noun: BookOpen,
  verb: Zap,
  adjective: BookOpen,
  "feeling-word": Theater,
  beginner: BookOpen,
  advanced: GraduationCap,
  "words-a": BookOpen,
  "random-az": BookOpen,
  "three-letter": BookOpen,
  "five-letter": BookOpen,
  "long-words": BookOpen,
  kids: BookOpen,
  preschool: BookOpen,
  party: Gamepad2,
  icebreaker: Gamepad2,
  animal: BookOpen,
  halloween: Gamepad2,
  christmas: Gamepad2,
  "pokemon-words": Gamepad2,
}

const ACCENT: Record<
  WordPickerUseCaseAccent,
  { chip: string; icon: string; card: string; cardActive: string }
> = {
  sky: {
    chip: "bg-sky-100",
    icon: "text-sky-600",
    card: "border-sky-200 bg-gradient-to-br from-sky-50 to-white hover:border-sky-400",
    cardActive: "border-sky-500 bg-gradient-to-br from-sky-100 to-sky-50 shadow-md ring-2 ring-sky-300",
  },
  violet: {
    chip: "bg-violet-100",
    icon: "text-violet-600",
    card: "border-violet-200 bg-gradient-to-br from-violet-50 to-white hover:border-violet-400",
    cardActive:
      "border-violet-500 bg-gradient-to-br from-violet-100 to-violet-50 shadow-md ring-2 ring-violet-300",
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
  rose: {
    chip: "bg-rose-100",
    icon: "text-rose-600",
    card: "border-rose-200 bg-gradient-to-br from-rose-50 to-white hover:border-rose-400",
    cardActive: "border-rose-500 bg-gradient-to-br from-rose-100 to-rose-50 shadow-md ring-2 ring-rose-300",
  },
  teal: {
    chip: "bg-teal-100",
    icon: "text-teal-600",
    card: "border-teal-200 bg-gradient-to-br from-teal-50 to-white hover:border-teal-400",
    cardActive: "border-teal-500 bg-gradient-to-br from-teal-100 to-teal-50 shadow-md ring-2 ring-teal-300",
  },
}

/** Popular Word Picker templates — horizontal scroll row matching Country Wheel. */
export function WordPickerPopularTemplates() {
  const pathname = usePathname()
  const itemRefs = useRef<Partial<Record<WordPickerSpokeId, HTMLLIElement | null>>>({})

  useEffect(() => {
    const active = WORD_PICKER_POPULAR_SPOKE_LINKS.find((item) => item.href === pathname)
    if (!active) return
    itemRefs.current[active.id]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [pathname])

  return (
    <section
      id="word-popular"
      aria-labelledby="word-popular-templates"
      className="mb-6 w-full scroll-mt-24"
    >
      <div className="mb-3 text-center sm:text-left">
        <h2
          id="word-popular-templates"
          className="text-lg font-bold text-slate-900 sm:text-xl"
        >
          Popular Word Picker Wheels
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Ready-made Word Picker Wheel templates for writing, classrooms, drawing, games, and kids.
        </p>
      </div>

      <ul
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Popular word templates"
      >
        {WORD_PICKER_POPULAR_SPOKE_LINKS.map((item) => {
          const isActive = pathname === item.href
          const Icon = ICONS[item.id] ?? BookOpen
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
