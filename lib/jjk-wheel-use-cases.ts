import { filterByCategory, jjkCharacters } from "@/data/jjk-characters"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import type { DisplayMode, JjkEntry } from "@/types/jjk-types"

export type JjkWheelUseCaseId =
  | "all" | "main" | "students" | "teachers" | "villains" | "cursed-spirits"
  | "grade-1" | "special-grade" | "domain" | "technique" | "favorites" | "team" | "custom"

export type JjkWheelUseCase = {
  id: JjkWheelUseCaseId
  label: string
  description: string
  accent: "violet" | "red" | "blue" | "amber" | "emerald" | "rose" | "slate"
  config: { characters: JjkEntry[]; displayMode: DisplayMode; templateParam: string }
}

const by = (category: Parameters<typeof filterByCategory>[0]) => filterByCategory(category)
const favoriteIds = new Set([
  "yuji-itadori", "megumi-fushiguro", "nobara-kugisaki", "satoru-gojo",
  "ryomen-sukuna", "yuta-okkotsu", "maki-zenin", "kento-nanami",
  "aoi-todo", "toji-fushiguro", "choso",
])
const make = (
  id: JjkWheelUseCaseId, label: string, description: string,
  characters: JjkEntry[], accent: JjkWheelUseCase["accent"] = "violet",
): JjkWheelUseCase => ({
  id, label, description, accent,
  config: { characters, displayMode: "emoji-name", templateParam: id },
})

export const JJK_WHEEL_USE_CASES: JjkWheelUseCase[] = [
  make("all", "All JJK Characters", "The complete character catalog with equal odds.", jjkCharacters),
  make("main", "Main Characters", "Core characters for quick random picks.", by("main"), "blue"),
  make("students", "Students", "Tokyo and Kyoto students together.", by("student"), "emerald"),
  make("teachers", "Teachers", "Jujutsu teachers and school staff.", by("teacher"), "amber"),
  make("villains", "Villains", "Antagonists and dangerous curse users.", by("villain"), "red"),
  make("cursed-spirits", "Cursed Spirits", "Cursed spirits from across the story.", by("cursed_spirit"), "slate"),
  make("grade-1", "Grade 1 Sorcerers", "Grade 1 sorcerers for a focused spin.", by("grade_1"), "amber"),
  make("special-grade", "Special Grade", "Special-grade sorcerers and curses.", by("special_grade"), "rose"),
  make("domain", "Domain Expansions", "Named Domain Expansions only.", by("domain"), "violet"),
  make("technique", "Cursed Techniques", "Named cursed techniques only.", by("technique"), "blue"),
  make("favorites", "Fan Favorites", "A compact set of recognizable favorites.", jjkCharacters.filter((item) => favoriteIds.has(item.id)), "rose"),
  make("team", "JJK Team Draft", "Students and sorcerers suited to elimination drafts.", jjkCharacters.filter((item) =>
    item.category.includes("student") || item.category.includes("grade_1") || item.category.includes("special_grade")), "emerald"),
  make("custom", "Custom JJK Wheel", "Start empty and add your own entries.", [], "slate"),
]

export function getJjkWheelUseCase(id: JjkWheelUseCaseId) {
  return JJK_WHEEL_USE_CASES.find((item) => item.id === id)
}

export function jjkWheelUseCaseFromTemplate(template: string | null): JjkWheelUseCaseId | null {
  const value = (template || "").toLowerCase()
  const aliases: Record<string, JjkWheelUseCaseId> = {
    character: "all", characters: "all", student: "students", teacher: "teachers",
    villain: "villains", "cursed-spirit": "cursed-spirits", cursed_spirit: "cursed-spirits",
    grade1: "grade-1", special: "special-grade", favourite: "favorites",
  }
  const resolved = aliases[value] || value
  return JJK_WHEEL_USE_CASES.some((item) => item.id === resolved)
    ? resolved as JjkWheelUseCaseId
    : null
}

export function applyJjkWheelUseCase(id: JjkWheelUseCaseId): boolean {
  const useCase = getJjkWheelUseCase(id)
  if (!useCase) return false
  const store = useWheelManagerStore.getState()
  if (store.currentTool !== "jjk-wheel") store.setCurrentTool("jjk-wheel")
  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("jjk-wheel", "JJK Spin Wheel picker")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false
  const ids = useCase.config.characters.map((item) => item.id)
  store.updateWheelData("jjk-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedCharacters: ids,
    characterOrder: ids,
    displayMode: useCase.config.displayMode,
  })
  if (typeof window !== "undefined" && window.location.pathname === "/jjk-spin-the-wheel") {
    const url = new URL(window.location.href)
    url.searchParams.set("template", useCase.config.templateParam)
    window.history.replaceState({}, "", `${url.pathname}${url.search}`)
  }
  return true
}
