import {
  getNBATeamsByConference,
  getNBATeamsByConferenceAndDivision,
  nbaTeams,
  type NBATeam,
} from "@/data/nba-teams"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"

export type NbaWheelUseCaseId =
  | "all-teams"
  | "eastern"
  | "western"
  | "atlantic"
  | "central"
  | "southeast"
  | "northwest"
  | "pacific"
  | "southwest"
  | "champions"

export type NbaWheelUseCaseAccent =
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

export type NbaWheelUseCaseConfig = {
  selectedConference: "all" | "Eastern" | "Western"
  teams: NBATeam[]
  displayMode: "logo" | "name" | "both"
  templateParam: string
}

export type NbaWheelUseCase = {
  id: NbaWheelUseCaseId
  label: string
  description: string
  accent: NbaWheelUseCaseAccent
  config: NbaWheelUseCaseConfig
}

function champions(): NBATeam[] {
  return nbaTeams.filter((t) => t.championships > 0)
}

export const NBA_WHEEL_USE_CASES: NbaWheelUseCase[] = [
  {
    id: "all-teams",
    label: "Random NBA Team",
    description: "All 30 franchises on one fair spinner.",
    accent: "sky",
    config: {
      selectedConference: "all",
      teams: getNBATeamsByConference("all"),
      displayMode: "name",
      templateParam: "all",
    },
  },
  {
    id: "eastern",
    label: "Eastern Conference",
    description: "East-only wheel for drafts and watch parties.",
    accent: "red",
    config: {
      selectedConference: "Eastern",
      teams: getNBATeamsByConference("Eastern"),
      displayMode: "name",
      templateParam: "eastern",
    },
  },
  {
    id: "western",
    label: "Western Conference",
    description: "West-only wheel for Western Conference pools.",
    accent: "blue",
    config: {
      selectedConference: "Western",
      teams: getNBATeamsByConference("Western"),
      displayMode: "name",
      templateParam: "western",
    },
  },
  {
    id: "atlantic",
    label: "Atlantic Division",
    description: "Five-team Eastern Atlantic rivalry set.",
    accent: "amber",
    config: {
      selectedConference: "Eastern",
      teams: getNBATeamsByConferenceAndDivision("Eastern", "Atlantic"),
      displayMode: "name",
      templateParam: "atlantic",
    },
  },
  {
    id: "central",
    label: "Central Division",
    description: "Eastern Central division spinner.",
    accent: "orange",
    config: {
      selectedConference: "Eastern",
      teams: getNBATeamsByConferenceAndDivision("Eastern", "Central"),
      displayMode: "name",
      templateParam: "central",
    },
  },
  {
    id: "southeast",
    label: "Southeast Division",
    description: "Eastern Southeast rivalry spinner.",
    accent: "teal",
    config: {
      selectedConference: "Eastern",
      teams: getNBATeamsByConferenceAndDivision("Eastern", "Southeast"),
      displayMode: "name",
      templateParam: "southeast",
    },
  },
  {
    id: "northwest",
    label: "Northwest Division",
    description: "Western Northwest division spinner.",
    accent: "rose",
    config: {
      selectedConference: "Western",
      teams: getNBATeamsByConferenceAndDivision("Western", "Northwest"),
      displayMode: "name",
      templateParam: "northwest",
    },
  },
  {
    id: "pacific",
    label: "Pacific Division",
    description: "Western Pacific rivalry spinner.",
    accent: "lime",
    config: {
      selectedConference: "Western",
      teams: getNBATeamsByConferenceAndDivision("Western", "Pacific"),
      displayMode: "name",
      templateParam: "pacific",
    },
  },
  {
    id: "southwest",
    label: "Southwest Division",
    description: "Western Southwest division spinner.",
    accent: "violet",
    config: {
      selectedConference: "Western",
      teams: getNBATeamsByConferenceAndDivision("Western", "Southwest"),
      displayMode: "name",
      templateParam: "southwest",
    },
  },
  {
    id: "champions",
    label: "NBA Champions",
    description: "Franchises with at least one NBA title.",
    accent: "emerald",
    config: {
      selectedConference: "all",
      teams: champions(),
      displayMode: "name",
      templateParam: "champions",
    },
  },
]

export function getNbaWheelUseCase(id: NbaWheelUseCaseId): NbaWheelUseCase | undefined {
  return NBA_WHEEL_USE_CASES.find((u) => u.id === id)
}

export function nbaWheelUseCaseFromTemplate(
  template: string | null,
  conference: string | null,
): NbaWheelUseCaseId | null {
  const t = (template || "").toLowerCase()
  if (t === "all" || t === "all-teams") return "all-teams"
  if (t === "eastern" || t === "east") return "eastern"
  if (t === "western" || t === "west") return "western"
  if (t === "atlantic") return "atlantic"
  if (t === "central") return "central"
  if (t === "southeast") return "southeast"
  if (t === "northwest") return "northwest"
  if (t === "pacific") return "pacific"
  if (t === "southwest") return "southwest"
  if (t === "champions" || t === "championship" || t === "titles") return "champions"
  const c = (conference || "").toLowerCase()
  if (c === "eastern" || c === "east") return "eastern"
  if (c === "western" || c === "west") return "western"
  return null
}

/** Apply a popular NBA template to the live wheel store. */
export function applyNbaWheelUseCase(id: NbaWheelUseCaseId): boolean {
  const useCase = getNbaWheelUseCase(id)
  if (!useCase) return false

  const { config } = useCase
  const store = useWheelManagerStore.getState()

  if (store.currentTool !== "nba-wheel") {
    store.setCurrentTool("nba-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("nba-wheel", "NBA Picker Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  store.updateWheelData("nba-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedConference: config.selectedConference,
    selectedTeams: config.teams,
    displayMode: config.displayMode,
  })

  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path === "/nba-team-picker-wheel") {
      const url = new URL(window.location.href)
      url.searchParams.set("template", config.templateParam)
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }

  return true
}
