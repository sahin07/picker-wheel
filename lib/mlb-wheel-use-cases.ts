import {
  getMLBTeamsByLeague,
  getMLBTeamsByLeagueAndDivision,
  mlbTeams,
  type MLBTeam,
} from "@/data/mlb-teams"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"

export type MlbWheelUseCaseId =
  | "all-teams"
  | "american"
  | "national"
  | "al-east"
  | "al-central"
  | "al-west"
  | "nl-east"
  | "nl-central"
  | "nl-west"
  | "champions"

export type MlbWheelUseCaseAccent =
  | "sky"
  | "red"
  | "blue"
  | "amber"
  | "orange"
  | "teal"
  | "rose"
  | "lime"
  | "violet"
  | "emerald"

export type MlbWheelUseCaseConfig = {
  selectedLeague: "all" | "American" | "National"
  teams: MLBTeam[]
  displayMode: "logo" | "name" | "both"
  templateParam: string
}

export type MlbWheelUseCase = {
  id: MlbWheelUseCaseId
  label: string
  description: string
  accent: MlbWheelUseCaseAccent
  config: MlbWheelUseCaseConfig
}

function champions(): MLBTeam[] {
  return mlbTeams.filter((t) => t.championships > 0)
}

export const MLB_WHEEL_USE_CASES: MlbWheelUseCase[] = [
  {
    id: "all-teams",
    label: "Random MLB Team",
    description: "All 30 franchises on one fair spinner.",
    accent: "sky",
    config: {
      selectedLeague: "all",
      teams: getMLBTeamsByLeague("all"),
      displayMode: "name",
      templateParam: "all",
    },
  },
  {
    id: "american",
    label: "American League",
    description: "AL-only wheel for drafts and watch parties.",
    accent: "red",
    config: {
      selectedLeague: "American",
      teams: getMLBTeamsByLeague("American"),
      displayMode: "name",
      templateParam: "american",
    },
  },
  {
    id: "national",
    label: "National League",
    description: "NL-only wheel for National League pools.",
    accent: "blue",
    config: {
      selectedLeague: "National",
      teams: getMLBTeamsByLeague("National"),
      displayMode: "name",
      templateParam: "national",
    },
  },
  {
    id: "al-east",
    label: "AL East",
    description: "Five-team American League East rivalry set.",
    accent: "amber",
    config: {
      selectedLeague: "American",
      teams: getMLBTeamsByLeagueAndDivision("American", "East"),
      displayMode: "name",
      templateParam: "al-east",
    },
  },
  {
    id: "al-central",
    label: "AL Central",
    description: "American League Central division spinner.",
    accent: "orange",
    config: {
      selectedLeague: "American",
      teams: getMLBTeamsByLeagueAndDivision("American", "Central"),
      displayMode: "name",
      templateParam: "al-central",
    },
  },
  {
    id: "al-west",
    label: "AL West",
    description: "American League West division spinner.",
    accent: "teal",
    config: {
      selectedLeague: "American",
      teams: getMLBTeamsByLeagueAndDivision("American", "West"),
      displayMode: "name",
      templateParam: "al-west",
    },
  },
  {
    id: "nl-east",
    label: "NL East",
    description: "National League East rivalry spinner.",
    accent: "rose",
    config: {
      selectedLeague: "National",
      teams: getMLBTeamsByLeagueAndDivision("National", "East"),
      displayMode: "name",
      templateParam: "nl-east",
    },
  },
  {
    id: "nl-central",
    label: "NL Central",
    description: "National League Central division spinner.",
    accent: "lime",
    config: {
      selectedLeague: "National",
      teams: getMLBTeamsByLeagueAndDivision("National", "Central"),
      displayMode: "name",
      templateParam: "nl-central",
    },
  },
  {
    id: "nl-west",
    label: "NL West",
    description: "National League West rivalry spinner.",
    accent: "violet",
    config: {
      selectedLeague: "National",
      teams: getMLBTeamsByLeagueAndDivision("National", "West"),
      displayMode: "name",
      templateParam: "nl-west",
    },
  },
  {
    id: "champions",
    label: "World Series Winners",
    description: "Franchises with at least one World Series title.",
    accent: "emerald",
    config: {
      selectedLeague: "all",
      teams: champions(),
      displayMode: "name",
      templateParam: "champions",
    },
  },
]

export function getMlbWheelUseCase(id: MlbWheelUseCaseId): MlbWheelUseCase | undefined {
  return MLB_WHEEL_USE_CASES.find((u) => u.id === id)
}

export function mlbWheelUseCaseFromTemplate(
  template: string | null,
  league: string | null,
): MlbWheelUseCaseId | null {
  const t = (template || "").toLowerCase()
  if (t === "all" || t === "all-teams") return "all-teams"
  if (t === "american" || t === "al") return "american"
  if (t === "national" || t === "nl") return "national"
  if (t === "al-east") return "al-east"
  if (t === "al-central") return "al-central"
  if (t === "al-west") return "al-west"
  if (t === "nl-east") return "nl-east"
  if (t === "nl-central") return "nl-central"
  if (t === "nl-west") return "nl-west"
  if (t === "champions" || t === "world-series") return "champions"
  const l = (league || "").toLowerCase()
  if (l === "american") return "american"
  if (l === "national") return "national"
  return null
}

/** Apply a popular MLB template to the live wheel store. */
export function applyMlbWheelUseCase(id: MlbWheelUseCaseId): boolean {
  const useCase = getMlbWheelUseCase(id)
  if (!useCase) return false

  const { config } = useCase
  const store = useWheelManagerStore.getState()

  if (store.currentTool !== "mlb-wheel") {
    store.setCurrentTool("mlb-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("mlb-wheel", "MLB Picker Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  store.updateWheelData("mlb-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedLeague: config.selectedLeague,
    selectedTeams: config.teams,
    displayMode: config.displayMode,
  })

  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path === "/mlb-picker-wheel") {
      const url = new URL(window.location.href)
      url.searchParams.set("template", config.templateParam)
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }

  return true
}
