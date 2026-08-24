import { filterByCategory, filterByEra, getAllNarutoEntries, getNarutoCharacters } from "@/data/naruto-characters"
import { narutoChallenges } from "@/data/naruto-challenges"
import { narutoClans } from "@/data/naruto-clans"
import { narutoJutsu } from "@/data/naruto-jutsu"
import { narutoVillages } from "@/data/naruto-villages"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import type { DisplayMode, NarutoEntry } from "@/types/naruto-types"

export type NarutoWheelUseCaseId =
  | "all"
  | "part1"
  | "shippuden"
  | "boruto"
  | "villains"
  | "akatsuki"
  | "hokage"
  | "uchiha"
  | "jinchuriki"
  | "kage"
  | "sensei"
  | "team"
  | "clan"
  | "shinobi"
  | "village"
  | "jutsu"
  | "challenge"
  | "who-are-you"
  | "build-ninja"
  | "fight"
  | "favorites"
  | "custom"

export type NarutoWheelUseCase = {
  id: NarutoWheelUseCaseId
  label: string
  description: string
  accent: "orange" | "red" | "blue" | "amber" | "emerald" | "rose" | "slate" | "violet"
  config: { characters: NarutoEntry[]; displayMode: DisplayMode; templateParam: string; funMode?: string }
}

const favoriteIds = new Set([
  "naruto-uzumaki", "sasuke-uchiha", "sakura-haruno", "kakashi-hatake",
  "itachi-uchiha", "gaara", "killer-bee", "pain", "madara-uchiha", "boruto-uzumaki",
])

const make = (
  id: NarutoWheelUseCaseId,
  label: string,
  description: string,
  characters: NarutoEntry[],
  accent: NarutoWheelUseCase["accent"] = "orange",
  funMode?: string,
): NarutoWheelUseCase => ({
  id,
  label,
  description,
  accent,
  config: { characters, displayMode: "emoji-name", templateParam: id, funMode },
})

const people = () => getNarutoCharacters()

export const NARUTO_WHEEL_USE_CASES: NarutoWheelUseCase[] = [
  make("all", "All Naruto Characters", "The curated character catalog with equal odds.", people()),
  make("part1", "Naruto Characters", "Part I era roster for classic-arc spins.", filterByEra("part1"), "amber"),
  make("shippuden", "Naruto Shippuden Characters", "Shippuden-era characters.", filterByEra("shippuden"), "red"),
  make("boruto", "Boruto Characters", "Next-generation Konoha and Kara faces.", filterByEra("boruto"), "blue"),
  make("villains", "Naruto Villains", "Antagonists across the series.", filterByCategory("villain"), "red"),
  make("akatsuki", "Akatsuki Wheel", "Akatsuki members for fan drafts.", filterByCategory("akatsuki"), "slate"),
  make("hokage", "Hokage Wheel", "Past and present Hokage.", filterByCategory("hokage"), "amber"),
  make("uchiha", "Uchiha Wheel", "Uchiha clan shinobi.", filterByCategory("uchiha"), "rose"),
  make("jinchuriki", "Jinchuriki Wheel", "Tailed-beast hosts and bijū names.", filterByCategory("jinchuriki"), "violet"),
  make("kage", "Kage Wheel", "Village leaders beyond Konoha.", filterByCategory("kage"), "emerald"),
  make("sensei", "Sensei Wheel", "Teachers and jōnin instructors.", filterByCategory("sensei"), "blue"),
  make("team", "Team Wheel", "Draft-friendly shinobi pool.", people().filter((item) =>
    item.category.includes("shinobi") && !item.category.includes("village")), "emerald", "team"),
  make("clan", "Clan Wheel", "Spin a Naruto clan name.", narutoClans, "rose"),
  make("shinobi", "Shinobi Wheel", "Active ninja (no bijū-only entries).", filterByCategory("shinobi"), "orange"),
  make("village", "Village Wheel", "Hidden villages of the shinobi world.", narutoVillages, "emerald"),
  make("jutsu", "Jutsu Wheel", "Named techniques and abilities.", narutoJutsu, "blue"),
  make("challenge", "Ninja Challenge", "Spin a fan challenge prompt.", narutoChallenges, "amber", "challenge"),
  make("who-are-you", "Who Are You?", "Build a random identity stack.", people(), "violet", "who-are-you"),
  make("build-ninja", "Build Your Ninja", "Spin character, village, clan, nature, kekkei ability, and rank.", people(), "orange", "build-ninja"),
  make("fight", "Random Fight", "Spin two characters and vote.", people(), "red", "fight"),
  make("favorites", "Fan Favorites", "A compact recognizable shortlist.", people().filter((item) => favoriteIds.has(item.id)), "rose"),
  make("custom", "Custom Naruto Wheel", "Start empty and add your own entries.", [], "slate"),
]

export function getNarutoWheelUseCase(id: NarutoWheelUseCaseId) {
  return NARUTO_WHEEL_USE_CASES.find((item) => item.id === id)
}

export function narutoWheelUseCaseFromTemplate(template: string | null): NarutoWheelUseCaseId | null {
  const value = (template || "").toLowerCase()
  const aliases: Record<string, NarutoWheelUseCaseId> = {
    character: "all",
    characters: "all",
    "all-characters": "all",
    naruto: "part1",
    "part-1": "part1",
    "naruto-characters": "part1",
    shippuden: "shippuden",
    villain: "villains",
    "akatsuki-picker": "akatsuki",
    "hokage-picker": "hokage",
    kages: "kage",
    teacher: "sensei",
    teachers: "sensei",
    clans: "clan",
    villages: "village",
    technique: "jutsu",
    ability: "jutsu",
    who: "who-are-you",
    "who-am-i": "who-are-you",
    build: "build-ninja",
    ninja: "build-ninja",
    vs: "fight",
    "random-fight": "fight",
    favourite: "favorites",
    quiz: "challenge",
  }
  const resolved = aliases[value] || value
  return NARUTO_WHEEL_USE_CASES.some((item) => item.id === resolved)
    ? (resolved as NarutoWheelUseCaseId)
    : null
}

export function applyNarutoWheelUseCase(id: NarutoWheelUseCaseId): boolean {
  const useCase = getNarutoWheelUseCase(id)
  if (!useCase) return false
  const store = useWheelManagerStore.getState()
  if (store.currentTool !== "naruto-wheel") store.setCurrentTool("naruto-wheel")
  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("naruto-wheel", "Naruto Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false
  const ids = useCase.config.characters.map((item) => item.id)
  const current = wheel.data as { customCharacters?: NarutoEntry[] }
  store.updateWheelData("naruto-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedCharacters: Array.isArray(ids) ? ids : [],
    characterOrder: Array.isArray(ids) ? ids : [],
    displayMode: useCase.config.displayMode,
    funMode: useCase.config.funMode || "spin",
    customCharacters: Array.isArray(current.customCharacters) ? current.customCharacters : [],
    recentResults: [],
  })
  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path === "/naruto-spin-wheel-picker") {
      const url = new URL(window.location.href)
      url.searchParams.set("template", useCase.config.templateParam)
      if (useCase.config.funMode) url.searchParams.set("mode", useCase.config.funMode)
      else url.searchParams.delete("mode")
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }
  return true
}

export function getCatalogSize() {
  return getAllNarutoEntries().length
}
