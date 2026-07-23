import { demonSlayerCharacters, filterByCategory } from "@/data/demon-slayer-characters"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import type { DemonSlayerEntry, DisplayMode } from "@/types/demon-slayer-types"

export type DemonSlayerWheelUseCaseId =
  | "all"
  | "main"
  | "hashira"
  | "demons"
  | "upper-rank"
  | "lower-rank"
  | "corps"
  | "breathing"
  | "nichirin"
  | "favorites"
  | "custom"

export type DemonSlayerWheelUseCase = {
  id: DemonSlayerWheelUseCaseId
  label: string
  description: string
  accent: "violet" | "red" | "blue" | "amber" | "emerald" | "rose" | "slate"
  config: { characters: DemonSlayerEntry[]; displayMode: DisplayMode; templateParam: string }
}

const by = (category: Parameters<typeof filterByCategory>[0]) => filterByCategory(category)

const favoriteIds = new Set([
  "tanjiro-kamado",
  "nezuko-kamado",
  "zenitsu-agatsuma",
  "inosuke-hashibira",
  "giyu-tomioka",
  "shinobu-kocho",
  "kyojuro-rengoku",
  "tengen-uzui",
  "muzan-kibutsuji",
  "akaza",
  "kokushibo",
])

const make = (
  id: DemonSlayerWheelUseCaseId,
  label: string,
  description: string,
  characters: DemonSlayerEntry[],
  accent: DemonSlayerWheelUseCase["accent"] = "violet",
): DemonSlayerWheelUseCase => ({
  id,
  label,
  description,
  accent,
  config: { characters, displayMode: "emoji-name", templateParam: id },
})

export const DEMON_SLAYER_WHEEL_USE_CASES: DemonSlayerWheelUseCase[] = [
  make("all", "All Demon Slayer Characters", "The complete character catalog with equal odds.", demonSlayerCharacters),
  make("main", "Main Characters", "Core cast for quick random picks.", by("main"), "blue"),
  make("hashira", "Hashira Wheel", "All nine Hashira for focused spins.", by("hashira"), "amber"),
  make("demons", "Demons", "Demons from across the story.", by("demon"), "red"),
  make("upper-rank", "Upper Rank Demons", "Upper Moon demons for anime discussions.", by("upper_rank"), "rose"),
  make("lower-rank", "Lower Rank Demons", "Lower Moon demons for trivia and challenges.", by("lower_rank"), "slate"),
  make("corps", "Demon Slayer Corps", "Corps members for team challenges.", by("corps"), "emerald"),
  make("breathing", "Breathing Styles", "Named breathing styles for cosplay and role-play.", by("breathing"), "blue"),
  make("nichirin", "Nichirin Sword Colors", "Nichirin blade colors for fan games.", by("nichirin"), "violet"),
  make(
    "favorites",
    "Fan Favorites",
    "A compact set of recognizable favorites.",
    demonSlayerCharacters.filter((item) => favoriteIds.has(item.id)),
    "rose",
  ),
  make("custom", "Custom Demon Slayer Wheel", "Start empty and add your own entries.", [], "slate"),
]

export function getDemonSlayerWheelUseCase(id: DemonSlayerWheelUseCaseId) {
  return DEMON_SLAYER_WHEEL_USE_CASES.find((item) => item.id === id)
}

export function demonSlayerWheelUseCaseFromTemplate(template: string | null): DemonSlayerWheelUseCaseId | null {
  const value = (template || "").toLowerCase()
  const aliases: Record<string, DemonSlayerWheelUseCaseId> = {
    character: "all",
    characters: "all",
    demon: "demons",
    "upper_rank": "upper-rank",
    upperrank: "upper-rank",
    "lower_rank": "lower-rank",
    lowerrank: "lower-rank",
    breathing_style: "breathing",
    "breathing-style": "breathing",
    nichirin_color: "nichirin",
    "nichirin-color": "nichirin",
    favourite: "favorites",
    favorite: "favorites",
  }
  const resolved = aliases[value] || value
  return DEMON_SLAYER_WHEEL_USE_CASES.some((item) => item.id === resolved)
    ? (resolved as DemonSlayerWheelUseCaseId)
    : null
}

export function applyDemonSlayerWheelUseCase(id: DemonSlayerWheelUseCaseId): boolean {
  const useCase = getDemonSlayerWheelUseCase(id)
  if (!useCase) return false
  const store = useWheelManagerStore.getState()
  if (store.currentTool !== "demon-slayer-wheel") store.setCurrentTool("demon-slayer-wheel")
  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("demon-slayer-wheel", "Demon Slayer Spin Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false
  const ids = useCase.config.characters.map((item) => item.id)
  store.updateWheelData("demon-slayer-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedCharacters: ids,
    characterOrder: ids,
    displayMode: useCase.config.displayMode,
  })
  if (typeof window !== "undefined" && window.location.pathname === "/demon-slayer-spin-wheel") {
    const url = new URL(window.location.href)
    url.searchParams.set("template", useCase.config.templateParam)
    window.history.replaceState({}, "", `${url.pathname}${url.search}`)
  }
  return true
}
