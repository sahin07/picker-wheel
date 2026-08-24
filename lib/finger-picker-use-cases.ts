import { useWheelManagerStore, type FingerPickerData } from "@/stores/wheel-manager-store"
import type { FingerPickerActionMode, FingerPickerMode } from "@/types/finger-picker-types"

export type FingerPickerUseCaseId = FingerPickerMode

export type FingerPickerUseCaseAccent =
  | "sky"
  | "amber"
  | "rose"
  | "lime"
  | "orange"
  | "teal"
  | "indigo"
  | "violet"
  | "red"
  | "emerald"

export type FingerPickerUseCaseConfig = {
  mode: FingerPickerMode
  actionMode: FingerPickerActionMode
  winnerCount: number
  countdownSeconds: number
  templateParam: string
}

export type FingerPickerUseCase = {
  id: FingerPickerUseCaseId
  label: string
  description: string
  accent: FingerPickerUseCaseAccent
  config: FingerPickerUseCaseConfig
}

const make = (
  id: FingerPickerUseCaseId,
  label: string,
  description: string,
  accent: FingerPickerUseCaseAccent,
  extra: Partial<FingerPickerUseCaseConfig> = {},
): FingerPickerUseCase => ({
  id,
  label,
  description,
  accent,
  config: {
    mode: id,
    actionMode: extra.actionMode || "normal",
    winnerCount: extra.winnerCount ?? 1,
    countdownSeconds: extra.countdownSeconds ?? 3,
    templateParam: extra.templateParam || id,
  },
})

export const FINGER_PICKER_USE_CASES: FingerPickerUseCase[] = [
  make("roulette", "Finger Roulette", "Everyone holds a finger; one is chosen at random.", "orange"),
  make("who-goes-first", "Who Goes First?", "Fair first-turn picker for games and presentations.", "sky"),
  make("random-player", "Random Player", "Pick one person from the fingers on screen.", "teal"),
  make("elimination", "Elimination Mode", "Remove the selected finger and keep going.", "red", { actionMode: "elimination" }),
  make("last-finger", "Last Finger Standing", "Eliminate until a single winner remains.", "violet", { actionMode: "elimination" }),
  make("tournament", "Tournament Mode", "Knockout rounds until the final finger.", "indigo", { actionMode: "elimination" }),
  make("multiple", "Multiple Winners", "Pick 2 or 3 fingers in one round.", "amber", { winnerCount: 2 }),
  make("team-battle", "Team Battle", "Split live fingers into Team A and Team B.", "emerald"),
  make("truth-or-dare", "Truth or Dare", "The selected finger takes the next challenge.", "rose"),
  make("fastest", "Fastest Finger", "Countdown 3-2-1-TOUCH, then pick from who made it.", "lime", { countdownSeconds: 3 }),
  make("lucky", "Lucky Finger", "A hidden lucky target appears before you place fingers.", "orange"),
  make("dont-get-picked", "Don't Get Picked", "Same random pick — the chosen finger is “it”.", "red"),
]

export function getFingerPickerUseCase(id: FingerPickerUseCaseId) {
  return FINGER_PICKER_USE_CASES.find((item) => item.id === id)
}

export function fingerPickerUseCaseFromTemplate(template: string | null): FingerPickerUseCaseId | null {
  const value = (template || "").toLowerCase()
  const aliases: Record<string, FingerPickerUseCaseId> = {
    roulette: "roulette",
    "finger-roulette": "roulette",
    first: "who-goes-first",
    "goes-first": "who-goes-first",
    "who-goes-first": "who-goes-first",
    player: "random-player",
    "random-player": "random-player",
    eliminate: "elimination",
    elimination: "elimination",
    last: "last-finger",
    "last-finger": "last-finger",
    "last-finger-standing": "last-finger",
    tournament: "tournament",
    multi: "multiple",
    multiple: "multiple",
    winners: "multiple",
    team: "team-battle",
    "team-battle": "team-battle",
    truth: "truth-or-dare",
    dare: "truth-or-dare",
    "truth-or-dare": "truth-or-dare",
    fastest: "fastest",
    "fastest-finger": "fastest",
    lucky: "lucky",
    avoid: "dont-get-picked",
    "dont-get-picked": "dont-get-picked",
  }
  return aliases[value] || null
}

export function applyFingerPickerUseCase(id: FingerPickerUseCaseId): boolean {
  const useCase = getFingerPickerUseCase(id)
  if (!useCase) return false
  const store = useWheelManagerStore.getState()
  const wheel = store.getCurrentWheel()
  if (!wheel || wheel.toolType !== "finger-picker") return false
  const data = (wheel.data || {}) as FingerPickerData
  store.updateWheelData("finger-picker", wheel.id, {
    mode: useCase.config.mode,
    actionMode: useCase.config.actionMode,
    winnerCount: useCase.config.winnerCount,
    countdownSeconds: useCase.config.countdownSeconds,
    players: Array.isArray(data.players) ? data.players : [],
  })
  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path === "/finger-picker" || path === "/finger-picker-wheel") {
      const url = new URL(window.location.href)
      url.searchParams.set("template", useCase.config.templateParam)
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }
  return true
}
