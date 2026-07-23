"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TemplateSectionProps {
  onSelectTemplate: (options: string[]) => void
}

type QuickTemplate = {
  name: string
  options: string[]
  isSpecialTool?: boolean
  href?: string
}

const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    name: "Yes or No",
    options: ["YES", "NO"],
  },
  {
    name: "Country Picker",
    options: [],
    isSpecialTool: true,
    href: "/country-picker-wheel",
  },
  {
    name: "State Picker",
    options: [],
    isSpecialTool: true,
    href: "/state-wheel",
  },
  {
    name: "Numbers 1-10",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
  {
    name: "Colors",
    options: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"],
  },
  {
    name: "Days of Week",
    options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  {
    name: "Months",
    options: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  {
    name: "Food Choices",
    options: ["Pizza", "Burger", "Sushi", "Pasta", "Salad", "Tacos"],
  },
]

/** Secondary templates below SEO intro — name templates live under the tool title */
export default function TemplateSection({ onSelectTemplate }: TemplateSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-center text-xl font-bold text-gray-800">More Quick Templates</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {QUICK_TEMPLATES.map((template) => (
          <div
            key={template.name}
            className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 transition-shadow hover:shadow-md"
          >
            <h3 className="font-semibold text-gray-800">{template.name}</h3>
            {template.isSpecialTool && template.href ? (
              <>
                <p className="mb-3 mt-2 text-sm text-gray-600">
                  {template.name === "Country Picker"
                    ? "Pick a random country from around the world"
                    : "Pick a random state from a selected country"}
                </p>
                <Link href={template.href}>
                  <Button className="w-full bg-transparent" variant="outline">
                    Open Tool
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="mb-3 mt-2 text-sm text-gray-600">
                  {template.options.length} options: {template.options.slice(0, 3).join(", ")}
                  {template.options.length > 3 && "..."}
                </p>
                <Button
                  onClick={() => onSelectTemplate(template.options)}
                  className="w-full"
                  variant="outline"
                >
                  Use Template
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
