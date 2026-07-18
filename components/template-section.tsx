"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface TemplateSectionProps {
  onSelectTemplate: (options: string[]) => void
}

const templates = [
  {
    name: "Yes or No",
    options: ["YES", "NO"],
    color: "bg-green-100",
  },
  {
    name: "Country Picker",
    options: [],
    color: "bg-blue-100",
    isSpecialTool: true,
    href: "/country-wheel",
  },
  {
    name: "State Picker",
    options: [],
    color: "bg-purple-100",
    isSpecialTool: true,
    href: "/state-wheel",
  },
  {
    name: "Numbers 1-10",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    color: "bg-blue-100",
  },
  {
    name: "Colors",
    options: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"],
    color: "bg-purple-100",
  },
  {
    name: "Days of Week",
    options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    color: "bg-yellow-100",
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
    color: "bg-pink-100",
  },
  {
    name: "Food Choices",
    options: ["Pizza", "Burger", "Sushi", "Pasta", "Salad", "Tacos"],
    color: "bg-orange-100",
  },
]

export default function TemplateSection({ onSelectTemplate }: TemplateSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Quick Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <Card key={index} className={`${template.color} border-2 hover:shadow-md transition-shadow cursor-pointer`}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">{template.name}</h3>
              {template.isSpecialTool ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
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
                  <p className="text-sm text-gray-600 mb-3">
                    {template.options.length} options: {template.options.slice(0, 3).join(", ")}
                    {template.options.length > 3 && "..."}
                  </p>
                  <Button onClick={() => onSelectTemplate(template.options)} className="w-full" variant="outline">
                    Use Template
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
