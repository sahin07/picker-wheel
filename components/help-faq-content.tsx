"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  HELP_FAQ_SECTIONS,
  type FaqChipVariant,
  type FaqInlinePart,
  type FaqStep,
} from "@/lib/help-faq"
import { cn } from "@/lib/utils"

const ALL_FAQ_ITEM_IDS = HELP_FAQ_SECTIONS.flatMap((section) =>
  section.items.map((item) => item.id)
)

/** Keep class names here so Tailwind scans them from components/. */
const FAQ_CHIP_STYLES: Record<FaqChipVariant, string> = {
  green: "border-green-700 bg-green-600 text-white shadow-sm",
  amber: "border-orange-600 bg-orange-500 text-white shadow-sm",
  red: "border-red-700 bg-red-600 text-white shadow-sm",
  gray: "border-slate-800 bg-slate-700 text-white shadow-sm",
  blue: "border-blue-700 bg-blue-600 text-white shadow-sm",
  purple: "border-purple-700 bg-purple-600 text-white shadow-sm",
}

function FaqChip({
  label,
  variant = "green",
  href,
}: {
  label: string
  variant?: FaqChipVariant
  href?: string
}) {
  const className = cn(
    "mx-0.5 inline-flex items-center rounded-md border px-2 py-0.5 align-middle font-spin-display text-[12px] font-bold leading-none tracking-wide !text-white",
    FAQ_CHIP_STYLES[variant] ?? FAQ_CHIP_STYLES.green
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    )
  }

  return <span className={className}>{label}</span>
}

function renderParts(parts: FaqInlinePart[]) {
  return parts.map((part, index) => {
    if (part.type === "text") {
      return <span key={`text-${index}`}>{part.value}</span>
    }

    return (
      <FaqChip
        key={`chip-${part.label}-${index}`}
        label={part.label}
        variant={part.variant}
        href={part.href}
      />
    )
  })
}

function FaqSteps({ steps }: { steps: FaqStep[] }) {
  return (
    <ul className="mt-1 space-y-2.5 pl-1">
      {steps.map((step, index) => (
        <li
          key={`step-${index}`}
          className="relative pl-5 text-[15px] leading-relaxed text-slate-600 before:absolute before:left-0 before:top-[0.55rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-green-500"
        >
          {renderParts(step.parts)}
        </li>
      ))}
    </ul>
  )
}

export default function HelpFaqContent() {
  const [openItems, setOpenItems] = useState<string[]>(ALL_FAQ_ITEM_IDS)

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "")
      if (!hash) return

      const exists = HELP_FAQ_SECTIONS.some((section) =>
        section.items.some((item) => item.id === hash)
      )
      if (!exists) return

      setOpenItems((current) =>
        current.includes(hash) ? current : [...current, hash]
      )

      window.requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      })
    }

    applyHash()
    window.addEventListener("hashchange", applyHash)
    return () => window.removeEventListener("hashchange", applyHash)
  }, [])

  return (
    <div className="space-y-14">
      {HELP_FAQ_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <div className="mb-6 flex items-start gap-3">
            <div
              className="mt-2 flex flex-col gap-1.5"
              aria-hidden="true"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            </div>
            <div>
              <h2 className="font-spin-display text-3xl font-bold text-slate-800 md:text-4xl">
                {section.title}
              </h2>
              <p className="mt-2 max-w-3xl text-base font-medium text-slate-500">
                {section.intro}
              </p>
            </div>
          </div>

          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={setOpenItems}
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 shadow-sm md:px-6"
          >
            {section.items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                id={item.id}
                className="scroll-mt-28 border-slate-200"
              >
                <AccordionTrigger className="py-5 text-left font-spin-display text-lg font-semibold text-slate-800 hover:no-underline hover:text-green-700 md:text-xl">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-5 text-[15px] leading-relaxed text-slate-600">
                  {item.answer.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                  {item.steps && item.steps.length > 0 && (
                    <FaqSteps steps={item.steps} />
                  )}
                  {item.links && item.links.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-1">
                      {item.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="font-spin-display text-sm font-semibold text-green-700 underline-offset-2 hover:underline"
                        >
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </div>
  )
}
