"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  Briefcase,
  Cake,
  Gift,
  GraduationCap,
  HandHeart,
  Home,
  Presentation,
  Snowflake,
  Trophy,
  Users,
} from "lucide-react"
import {
  HOME_NAME_PICKER_TEMPLATES,
  type HomeNameTemplateAccent,
  type HomeNameTemplateId,
} from "@/lib/home-name-templates-data"
import { getHomeNameTemplateHref } from "@/lib/home-name-picker-spokes"

export type { HomeNameTemplateId }
export { HOME_NAME_PICKER_TEMPLATES, getHomeNameTemplate } from "@/lib/home-name-templates-data"

const ACCENT_STYLES: Record<
  HomeNameTemplateAccent,
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
  violet: {
    chip: "bg-violet-100",
    icon: "text-violet-600",
    card: "border-violet-200 bg-gradient-to-br from-violet-50 to-white hover:border-violet-400",
    cardActive:
      "border-violet-500 bg-gradient-to-br from-violet-100 to-violet-50 shadow-md ring-2 ring-violet-300",
  },
  cyan: {
    chip: "bg-cyan-100",
    icon: "text-cyan-600",
    card: "border-cyan-200 bg-gradient-to-br from-cyan-50 to-white hover:border-cyan-400",
    cardActive: "border-cyan-500 bg-gradient-to-br from-cyan-100 to-cyan-50 shadow-md ring-2 ring-cyan-300",
  },
  yellow: {
    chip: "bg-yellow-100",
    icon: "text-yellow-700",
    card: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white hover:border-yellow-400",
    cardActive:
      "border-yellow-500 bg-gradient-to-br from-yellow-100 to-yellow-50 shadow-md ring-2 ring-yellow-300",
  },
}

const TEMPLATE_ICONS: Record<HomeNameTemplateId, LucideIcon> = {
  classroom: GraduationCap,
  giveaway: Gift,
  "secret-santa": Snowflake,
  team: Users,
  chores: Home,
  office: Briefcase,
  presentation: Presentation,
  tournament: Trophy,
  volunteer: HandHeart,
  birthday: Cake,
}

interface HomeNamePickerTemplatesProps {
  onSelectTemplate: (options: string[], templateId?: HomeNameTemplateId) => void
  activeId?: HomeNameTemplateId | null
}

export function HomeNamePickerTemplates({
  onSelectTemplate,
  activeId: controlledActiveId,
}: HomeNamePickerTemplatesProps) {
  const [internalActiveId, setInternalActiveId] = useState<HomeNameTemplateId | null>(null)
  const activeId = controlledActiveId ?? internalActiveId
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})

  useEffect(() => {
    if (controlledActiveId !== undefined) {
      setInternalActiveId(controlledActiveId)
    }
  }, [controlledActiveId])

  useEffect(() => {
    if (!activeId) return
    const node = itemRefs.current[activeId]
    if (!node) return
    node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [activeId])

  return (
    <section aria-labelledby="home-popular-name-templates" className="mb-6 w-full">
      <div className="mb-3 text-center sm:text-left">
        <h2
          id="home-popular-name-templates"
          className="text-lg font-bold text-slate-900 sm:text-xl"
        >
          Popular Name Picker Templates
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Tap a template to open its page (or load sample names on this wheel when no page exists
          yet).
        </p>
      </div>

      <ul
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Popular name picker templates"
      >
        {HOME_NAME_PICKER_TEMPLATES.map((template) => {
          const isActive = activeId === template.id
          const Icon = TEMPLATE_ICONS[template.id]
          const styles = ACCENT_STYLES[template.accent]
          const href = getHomeNameTemplateHref(template.id)
          const cardClass = `flex h-full w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${
            isActive ? styles.cardActive : styles.card
          }`

          const cardInner = (
            <>
              <span
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.chip}`}
                aria-hidden
              >
                <Icon className={`h-5 w-5 ${styles.icon}`} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-snug text-slate-900">
                  {template.label}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {template.audience}
                </span>
                <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-600">
                  {template.description}
                </span>
              </span>
            </>
          )

          return (
            <li
              key={template.id}
              ref={(el) => {
                itemRefs.current[template.id] = el
              }}
              className="w-[180px] shrink-0 snap-start sm:w-[220px] sm:snap-center md:w-[240px]"
            >
              {href ? (
                <Link
                  href={href}
                  className={cardClass}
                  aria-current={isActive ? "page" : undefined}
                >
                  {cardInner}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setInternalActiveId(template.id)
                    onSelectTemplate(template.options, template.id)
                  }}
                  className={cardClass}
                >
                  {cardInner}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
