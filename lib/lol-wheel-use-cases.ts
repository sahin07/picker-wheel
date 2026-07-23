import { lolChampions } from "@/data/lol-champions"
import { LOL_WHEEL_PATH } from "@/lib/lol-wheel-seo"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import type { DisplayMode, LoLChampion, RoleFilter } from "@/types/lol-types"

export type LolWheelUseCaseId =
  | "all"
  | "top"
  | "jungle"
  | "mid"
  | "adc"
  | "support"
  | "assassin"
  | "mage"
  | "marksman"
  | "tank"
  | "fighter"
  | "beginner"
  | "s-tier"
  | "favorites"
  | "demacia"
  | "noxus"
  | "ionia"
  | "shadow-isles"
  | "piltover"
  | "a-tier"
  | "hard"

export type LolWheelUseCaseAccent =
  | "sky"
  | "red"
  | "emerald"
  | "violet"
  | "amber"
  | "blue"
  | "rose"
  | "orange"
  | "indigo"
  | "lime"
  | "yellow"
  | "teal"
  | "pink"
  | "slate"

export type LolWheelUseCaseConfig = {
  selectedRole: RoleFilter
  champions: LoLChampion[]
  displayMode: DisplayMode
  templateParam: string
}

export type LolWheelUseCase = {
  id: LolWheelUseCaseId
  label: string
  description: string
  accent: LolWheelUseCaseAccent
  config: LolWheelUseCaseConfig
}

export function getAllLolChampionsFlat(): LoLChampion[] {
  return Object.values(lolChampions).flat() as unknown as LoLChampion[]
}

function byRole(role: Exclude<RoleFilter, "all">): LoLChampion[] {
  return ((lolChampions as unknown as Record<string, LoLChampion[]>)[role] || [])
}

function byPlayStyle(
  playStyle: LoLChampion["playStyle"],
): LoLChampion[] {
  return getAllLolChampionsFlat().filter((c) => c.playStyle === playStyle)
}

function byRegion(region: string): LoLChampion[] {
  return getAllLolChampionsFlat().filter((c) => c.region === region)
}

function byPopularity(
  popularity: LoLChampion["popularity"],
): LoLChampion[] {
  return getAllLolChampionsFlat().filter((c) => c.popularity === popularity)
}

function byDifficulties(
  difficulties: LoLChampion["difficulty"][],
): LoLChampion[] {
  return getAllLolChampionsFlat().filter((c) =>
    difficulties.includes(c.difficulty),
  )
}

function regionCase(
  id: Extract<
    LolWheelUseCaseId,
    "demacia" | "noxus" | "ionia" | "shadow-isles" | "piltover"
  >,
  region: string,
  label: string,
  description: string,
  accent: LolWheelUseCaseAccent,
): LolWheelUseCase {
  return {
    id,
    label,
    description,
    accent,
    config: {
      selectedRole: "all",
      champions: byRegion(region),
      displayMode: "emoji-name",
      templateParam: id,
    },
  }
}

function roleCase(
  id: Exclude<RoleFilter, "all">,
  label: string,
  description: string,
  accent: LolWheelUseCaseAccent,
): LolWheelUseCase {
  return {
    id,
    label,
    description,
    accent,
    config: {
      selectedRole: id,
      champions: byRole(id),
      displayMode: "emoji-name",
      templateParam: id,
    },
  }
}

function playStyleCase(
  id: Extract<LolWheelUseCaseId, "assassin" | "mage" | "marksman" | "tank" | "fighter">,
  playStyle: LoLChampion["playStyle"],
  label: string,
  description: string,
  accent: LolWheelUseCaseAccent,
): LolWheelUseCase {
  return {
    id,
    label,
    description,
    accent,
    config: {
      selectedRole: "all",
      champions: byPlayStyle(playStyle),
      displayMode: "emoji-name",
      templateParam: id,
    },
  }
}

export const LOL_WHEEL_USE_CASES: LolWheelUseCase[] = [
  {
    id: "all",
    label: "Random LoL Champion",
    description: "Full curated champion set on one fair spinner.",
    accent: "sky",
    config: {
      selectedRole: "all",
      champions: getAllLolChampionsFlat(),
      displayMode: "emoji-name",
      templateParam: "all",
    },
  },
  roleCase("top", "Top Lane", "Top laners only for solo-lane challenges.", "red"),
  roleCase("jungle", "Jungle", "Junglers for pathing and gank challenges.", "emerald"),
  roleCase("mid", "Mid Lane", "Mid laners for roam and skirmish nights.", "violet"),
  roleCase("adc", "ADC", "Bot-lane marksmen for duo queue fun.", "amber"),
  roleCase("support", "Support", "Supports for vision and peel challenges.", "blue"),
  playStyleCase("assassin", "assassin", "Assassin", "Assassin playstyle champions only.", "rose"),
  playStyleCase("mage", "mage", "Mage", "Mage playstyle champions only.", "indigo"),
  playStyleCase("marksman", "marksman", "Marksman", "Marksman playstyle champions only.", "orange"),
  playStyleCase("tank", "tank", "Tank", "Tank playstyle champions only.", "slate"),
  playStyleCase("fighter", "fighter", "Fighter", "Fighter playstyle champions only.", "lime"),
  {
    id: "beginner",
    label: "Beginner Champions",
    description: "Easy-difficulty champions for new players.",
    accent: "teal",
    config: {
      selectedRole: "all",
      champions: getAllLolChampionsFlat().filter((c) => c.difficulty === "easy"),
      displayMode: "emoji-name",
      templateParam: "beginner",
    },
  },
  {
    id: "s-tier",
    label: "S-Tier Champions",
    description: "S-tier curated picks for meta vibes.",
    accent: "yellow",
    config: {
      selectedRole: "all",
      champions: getAllLolChampionsFlat().filter((c) => c.popularity === "S-tier"),
      displayMode: "emoji-name",
      templateParam: "s-tier",
    },
  },
  {
    id: "favorites",
    label: "Favorite Champions",
    description: "Community-favorite champions for polls.",
    accent: "pink",
    config: {
      selectedRole: "all",
      champions: getAllLolChampionsFlat().filter((c) => c.communityFavorite),
      displayMode: "emoji-name",
      templateParam: "favorites",
    },
  },
  regionCase("demacia", "Demacia", "Demacia", "Demacian champions for lore-themed challenges.", "sky"),
  regionCase("noxus", "Noxus", "Noxus", "Noxian champions for conquest-themed nights.", "red"),
  regionCase("ionia", "Ionia", "Ionia", "Ionian champions for spirit-realm themed spins.", "violet"),
  regionCase(
    "shadow-isles",
    "Shadow Isles",
    "Shadow Isles",
    "Shadow Isles champions for dark-themed challenges.",
    "slate",
  ),
  regionCase("piltover", "Piltover", "Piltover", "Piltover champions for progress-themed drafts.", "amber"),
  {
    id: "a-tier",
    label: "A-Tier Champions",
    description: "A-tier curated picks for strong-but-not-S shortlists.",
    accent: "orange",
    config: {
      selectedRole: "all",
      champions: byPopularity("A-tier"),
      displayMode: "emoji-name",
      templateParam: "a-tier",
    },
  },
  {
    id: "hard",
    label: "Hard Champions",
    description: "Hard and expert difficulty champions for skill challenges.",
    accent: "indigo",
    config: {
      selectedRole: "all",
      champions: byDifficulties(["hard", "expert"]),
      displayMode: "emoji-name",
      templateParam: "hard",
    },
  },
]

export function getLolWheelUseCase(
  id: LolWheelUseCaseId,
): LolWheelUseCase | undefined {
  return LOL_WHEEL_USE_CASES.find((u) => u.id === id)
}

export function lolWheelUseCaseFromTemplate(
  template: string | null,
): LolWheelUseCaseId | null {
  const t = (template || "").toLowerCase()
  const valid = LOL_WHEEL_USE_CASES.map((u) => u.id)
  if (t && (valid as string[]).includes(t)) return t as LolWheelUseCaseId
  if (t === "random" || t === "all-champions" || t === "champion") return "all"
  if (t === "bot" || t === "adcarry") return "adc"
  if (t === "easy" || t === "beginners") return "beginner"
  if (t === "stier" || t === "meta") return "s-tier"
  if (t === "favourite" || t === "favorite") return "favorites"
  if (t === "shadowisles" || t === "shadow_isles" || t === "isles") return "shadow-isles"
  if (t === "atier" || t === "a_tier") return "a-tier"
  if (t === "expert" || t === "hard-expert" || t === "advanced") return "hard"
  return null
}

export function applyLolWheelUseCase(id: LolWheelUseCaseId): boolean {
  const useCase = getLolWheelUseCase(id)
  if (!useCase) return false

  const { config } = useCase
  const store = useWheelManagerStore.getState()

  if (store.currentTool !== "lol-wheel") {
    store.setCurrentTool("lol-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("lol-wheel", "LoL Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  const ids = config.champions.map((c) => c.id)

  store.updateWheelData("lol-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedRole: config.selectedRole,
    selectedChampions: ids,
    championOrder: ids,
    displayMode: config.displayMode,
  })

  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path === LOL_WHEEL_PATH) {
      const url = new URL(window.location.href)
      url.searchParams.set("template", config.templateParam)
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }

  return true
}
