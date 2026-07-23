import { WEIGHTED_WHEEL_PATH } from "@/lib/weighted-wheel-seo"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"

// ─── Types ────────────────────────────────────────────────────────────────────
export type WeightedWheelUseCaseId =
  | "fifty-fifty"
  | "seventy-thirty"
  | "rpg-loot"
  | "classroom-reward"
  | "prize-probability"
  | "random-event"
  | "testing-scenario"
  | "difficulty"
  | "custom"

export type WeightedWheelUseCaseAccent =
  | "sky"
  | "emerald"
  | "amber"
  | "violet"
  | "rose"
  | "blue"
  | "teal"
  | "orange"
  | "indigo"
  | "purple"

export type WeightedWheelEntry = {
  id: string
  name: string
  weight: number
  color?: string
  enabled: boolean
}

export type WeightedWheelUseCaseConfig = {
  entries: WeightedWheelEntry[]
  templateParam: string
}

export type WeightedWheelUseCase = {
  id: WeightedWheelUseCaseId
  label: string
  description: string
  accent: WeightedWheelUseCaseAccent
  config: WeightedWheelUseCaseConfig
}

// ─── Presets ──────────────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_USE_CASES: WeightedWheelUseCase[] = [
  {
    id: "fifty-fifty",
    label: "50 / 50 Coin Flip",
    description: "Equal Yes / No split — pure 50-50 probability.",
    accent: "sky",
    config: {
      templateParam: "fifty-fifty",
      entries: [
        { id: "ff-yes", name: "Yes", weight: 1, color: "#22c55e", enabled: true },
        { id: "ff-no", name: "No", weight: 1, color: "#ef4444", enabled: true },
      ],
    },
  },
  {
    id: "seventy-thirty",
    label: "70 / 30 Split",
    description: "Classic probability split for demonstrations and prototypes.",
    accent: "blue",
    config: {
      templateParam: "seventy-thirty",
      entries: [
        { id: "st-a", name: "Option A", weight: 7, color: "#3b82f6", enabled: true },
        { id: "st-b", name: "Option B", weight: 3, color: "#f59e0b", enabled: true },
      ],
    },
  },
  {
    id: "rpg-loot",
    label: "RPG Loot Table",
    description: "Common, Uncommon, Rare, and Legendary drop rates for tabletop games.",
    accent: "violet",
    config: {
      templateParam: "rpg-loot",
      entries: [
        { id: "loot-common", name: "Common", weight: 50, color: "#94a3b8", enabled: true },
        { id: "loot-uncommon", name: "Uncommon", weight: 30, color: "#22c55e", enabled: true },
        { id: "loot-rare", name: "Rare", weight: 15, color: "#3b82f6", enabled: true },
        { id: "loot-legendary", name: "Legendary", weight: 5, color: "#f59e0b", enabled: true },
      ],
    },
  },
  {
    id: "classroom-reward",
    label: "Classroom Rewards",
    description: "Spin for stickers, homework passes, extra recess, or a mystery prize.",
    accent: "emerald",
    config: {
      templateParam: "classroom-reward",
      entries: [
        { id: "cr-stickers", name: "Stickers", weight: 40, color: "#f43f5e", enabled: true },
        { id: "cr-hw", name: "Homework Pass", weight: 20, color: "#a855f7", enabled: true },
        { id: "cr-recess", name: "Extra Recess", weight: 25, color: "#22c55e", enabled: true },
        { id: "cr-mystery", name: "Mystery Prize", weight: 15, color: "#f59e0b", enabled: true },
      ],
    },
  },
  {
    id: "prize-probability",
    label: "Prize Probability",
    description: "Consolation, mid-tier, and grand prize weighted tiers.",
    accent: "amber",
    config: {
      templateParam: "prize-probability",
      entries: [
        { id: "pp-consolation", name: "Consolation Prize", weight: 50, color: "#94a3b8", enabled: true },
        { id: "pp-mid", name: "Mid Prize", weight: 35, color: "#3b82f6", enabled: true },
        { id: "pp-grand", name: "Grand Prize", weight: 15, color: "#f59e0b", enabled: true },
      ],
    },
  },
  {
    id: "random-event",
    label: "Random Event",
    description: "Quiet days, twists, challenges, and boss events for game masters.",
    accent: "rose",
    config: {
      templateParam: "random-event",
      entries: [
        { id: "re-quiet", name: "Quiet Day", weight: 40, color: "#94a3b8", enabled: true },
        { id: "re-twist", name: "Twist", weight: 30, color: "#3b82f6", enabled: true },
        { id: "re-challenge", name: "Challenge", weight: 20, color: "#f59e0b", enabled: true },
        { id: "re-boss", name: "Boss Event", weight: 10, color: "#ef4444", enabled: true },
      ],
    },
  },
  {
    id: "testing-scenario",
    label: "Testing Scenarios",
    description: "Happy path, edge case, and error path — weighted for realistic coverage.",
    accent: "teal",
    config: {
      templateParam: "testing-scenario",
      entries: [
        { id: "ts-happy", name: "Happy Path", weight: 50, color: "#22c55e", enabled: true },
        { id: "ts-edge", name: "Edge Case", weight: 30, color: "#f59e0b", enabled: true },
        { id: "ts-error", name: "Error Path", weight: 20, color: "#ef4444", enabled: true },
      ],
    },
  },
  {
    id: "difficulty",
    label: "Difficulty Selector",
    description: "Easy, Normal, and Hard — weighted so most sessions start accessible.",
    accent: "orange",
    config: {
      templateParam: "difficulty",
      entries: [
        { id: "diff-easy", name: "Easy", weight: 40, color: "#22c55e", enabled: true },
        { id: "diff-normal", name: "Normal", weight: 35, color: "#3b82f6", enabled: true },
        { id: "diff-hard", name: "Hard", weight: 25, color: "#ef4444", enabled: true },
      ],
    },
  },
  {
    id: "custom",
    label: "Custom Setup",
    description: "Start with three equal entries and adjust weights to fit your use case.",
    accent: "indigo",
    config: {
      templateParam: "custom",
      entries: [
        { id: "cu-a", name: "Option A", weight: 1, enabled: true },
        { id: "cu-b", name: "Option B", weight: 1, enabled: true },
        { id: "cu-c", name: "Option C", weight: 1, enabled: true },
      ],
    },
  },
]

// ─── Lookup helpers ───────────────────────────────────────────────────────────
export function getWeightedWheelUseCase(
  id: WeightedWheelUseCaseId,
): WeightedWheelUseCase | undefined {
  return WEIGHTED_WHEEL_USE_CASES.find((u) => u.id === id)
}

export function weightedWheelUseCaseFromTemplate(
  template: string | null,
): WeightedWheelUseCaseId | null {
  const t = (template || "").toLowerCase().trim()
  const valid = WEIGHTED_WHEEL_USE_CASES.map((u) => u.id)
  if (t && (valid as string[]).includes(t)) return t as WeightedWheelUseCaseId
  // common aliases
  if (t === "5050" || t === "fifty50" || t === "coin") return "fifty-fifty"
  if (t === "7030" || t === "70-30") return "seventy-thirty"
  if (t === "loot" || t === "loot-table" || t === "rpg") return "rpg-loot"
  if (t === "classroom" || t === "reward" || t === "rewards") return "classroom-reward"
  if (t === "prize" || t === "prizes") return "prize-probability"
  if (t === "event" || t === "events") return "random-event"
  if (t === "testing" || t === "test" || t === "scenario") return "testing-scenario"
  if (t === "hard" || t === "easy" || t === "normal") return "difficulty"
  if (t === "blank" || t === "start" || t === "new") return "custom"
  return null
}

// ─── Apply use case to store ──────────────────────────────────────────────────
export function applyWeightedWheelUseCase(id: WeightedWheelUseCaseId): boolean {
  const useCase = getWeightedWheelUseCase(id)
  if (!useCase) return false

  const { config } = useCase
  const store = useWheelManagerStore.getState()

  if (store.currentTool !== "weighted-wheel") {
    store.setCurrentTool("weighted-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("weighted-wheel", "Weighted Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  store.updateWheelData("weighted-wheel", wheel.id, {
    ...(wheel.data as object),
    entries: config.entries,
    viewMode: "wheel",
  })

  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path === WEIGHTED_WHEEL_PATH) {
      const url = new URL(window.location.href)
      url.searchParams.set("template", config.templateParam)
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }

  return true
}
