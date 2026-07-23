import type { DistributionMode } from "@/stores/team-picker-store"
import { useTeamPickerStore } from "@/stores/team-picker-store"

export type TeamPickerUseCaseId =
  | "two-teams"
  | "three-teams"
  | "four-teams"
  | "classroom"
  | "football"
  | "basketball"
  | "volleyball"
  | "gaming"
  | "office"
  | "tournament"

export type TeamPickerUseCaseAccent =
  | "sky"
  | "amber"
  | "rose"
  | "lime"
  | "orange"
  | "teal"
  | "indigo"
  | "cyan"
  | "violet"
  | "emerald"

export type TeamPickerUseCaseConfig = {
  groups: number
  maxPeoplePerGroup: number
  distributionMode: DistributionMode
  pickRepresentatives: boolean
  teamNames: string[]
  /** Loaded only when the participant list is empty */
  sampleNames: string[]
  templateParam: string
}

export type TeamPickerUseCase = {
  id: TeamPickerUseCaseId
  label: string
  description: string
  accent: TeamPickerUseCaseAccent
  config: TeamPickerUseCaseConfig
}

const SAMPLE_CLASSROOM = [
  "Alex Rivera",
  "Blake Chen",
  "Casey Morgan",
  "Dana Patel",
  "Ellis Kim",
  "Finley Brooks",
  "Harper Quinn",
  "Jordan Lee",
  "Kai Nguyen",
  "Logan Hayes",
  "Morgan Diaz",
  "Noel Santos",
]

const SAMPLE_SPORTS = [
  "Sam Torres",
  "Riley Brooks",
  "Jamie Cole",
  "Avery Lane",
  "Cameron Reed",
  "Drew Parker",
  "Quinn Bailey",
  "Taylor Cruz",
]

const SAMPLE_GAMING = [
  "NovaFox",
  "PixelAce",
  "ShadowKit",
  "BlitzRune",
  "EchoSpark",
  "FrostByte",
  "OrbitJay",
  "ZenWave",
]

const SAMPLE_OFFICE = [
  "Priya Shah",
  "Marcus Cole",
  "Elena Voss",
  "Noah Kim",
  "Sofia Alvarez",
  "Ethan Park",
  "Amara Okonkwo",
  "Liam Chen",
]

/** Popular templates shown under the page title (Date / Color / Letter pattern). */
export const TEAM_PICKER_USE_CASES: TeamPickerUseCase[] = [
  {
    id: "two-teams",
    label: "2 Team Generator",
    description: "Split any roster into two fair sides.",
    accent: "sky",
    config: {
      groups: 2,
      maxPeoplePerGroup: 6,
      distributionMode: "default",
      pickRepresentatives: true,
      teamNames: ["Team A", "Team B"],
      sampleNames: SAMPLE_SPORTS,
      templateParam: "generator",
    },
  },
  {
    id: "three-teams",
    label: "3 Team Generator",
    description: "Three balanced groups for workshops or games.",
    accent: "teal",
    config: {
      groups: 3,
      maxPeoplePerGroup: 4,
      distributionMode: "default",
      pickRepresentatives: true,
      teamNames: ["Team 1", "Team 2", "Team 3"],
      sampleNames: SAMPLE_CLASSROOM,
      templateParam: "three",
    },
  },
  {
    id: "four-teams",
    label: "4 Team Generator",
    description: "Four stations for schools and sports drills.",
    accent: "emerald",
    config: {
      groups: 4,
      maxPeoplePerGroup: 4,
      distributionMode: "default",
      pickRepresentatives: true,
      teamNames: ["Red", "Blue", "Green", "Yellow"],
      sampleNames: SAMPLE_CLASSROOM,
      templateParam: "four",
    },
  },
  {
    id: "classroom",
    label: "Classroom Teams",
    description: "Student groups for projects and quiz bowls.",
    accent: "amber",
    config: {
      groups: 4,
      maxPeoplePerGroup: 3,
      distributionMode: "default",
      pickRepresentatives: true,
      teamNames: ["Table 1", "Table 2", "Table 3", "Table 4"],
      sampleNames: SAMPLE_CLASSROOM,
      templateParam: "classroom",
    },
  },
  {
    id: "football",
    label: "Football Teams",
    description: "Flag or backyard football sides in one spin.",
    accent: "orange",
    config: {
      groups: 2,
      maxPeoplePerGroup: 8,
      distributionMode: "default",
      pickRepresentatives: true,
      teamNames: ["Home", "Away"],
      sampleNames: SAMPLE_SPORTS,
      templateParam: "football",
    },
  },
  {
    id: "basketball",
    label: "Basketball Teams",
    description: "Pickup and practice squads randomized fairly.",
    accent: "rose",
    config: {
      groups: 2,
      maxPeoplePerGroup: 5,
      distributionMode: "default",
      pickRepresentatives: true,
      teamNames: ["Shirts", "Skins"],
      sampleNames: SAMPLE_SPORTS,
      templateParam: "basketball",
    },
  },
  {
    id: "volleyball",
    label: "Volleyball Teams",
    description: "Balanced rotations for PE and leagues.",
    accent: "violet",
    config: {
      groups: 2,
      maxPeoplePerGroup: 6,
      distributionMode: "default",
      pickRepresentatives: true,
      teamNames: ["Court A", "Court B"],
      sampleNames: SAMPLE_SPORTS,
      templateParam: "volleyball",
    },
  },
  {
    id: "gaming",
    label: "Gaming Squads",
    description: "Multiplayer squads and party-game teams.",
    accent: "indigo",
    config: {
      groups: 2,
      maxPeoplePerGroup: 4,
      distributionMode: "default",
      pickRepresentatives: true,
      teamNames: ["Squad Alpha", "Squad Bravo"],
      sampleNames: SAMPLE_GAMING,
      templateParam: "gaming",
    },
  },
  {
    id: "office",
    label: "Office Groups",
    description: "Workshop breakouts and brainstorming pods.",
    accent: "cyan",
    config: {
      groups: 4,
      maxPeoplePerGroup: 3,
      distributionMode: "default",
      pickRepresentatives: false,
      teamNames: ["Pod A", "Pod B", "Pod C", "Pod D"],
      sampleNames: SAMPLE_OFFICE,
      templateParam: "office",
    },
  },
  {
    id: "tournament",
    label: "Tournament Brackets",
    description: "Fast, fair draws for event seeding.",
    accent: "lime",
    config: {
      groups: 4,
      maxPeoplePerGroup: 4,
      distributionMode: "default",
      pickRepresentatives: true,
      teamNames: ["Bracket 1", "Bracket 2", "Bracket 3", "Bracket 4"],
      sampleNames: SAMPLE_CLASSROOM,
      templateParam: "tournament",
    },
  },
]

export function getTeamPickerUseCase(
  id: TeamPickerUseCaseId | null | undefined,
): TeamPickerUseCase | undefined {
  if (!id) return undefined
  return TEAM_PICKER_USE_CASES.find((item) => item.id === id)
}

export function teamPickerUseCaseFromTemplate(
  template: string | null | undefined,
  groups?: number | null,
): TeamPickerUseCaseId | null {
  const t = (template || "").toLowerCase()
  if (t === "classroom") return "classroom"
  if (t === "football") return "football"
  if (t === "basketball") return "basketball"
  if (t === "volleyball") return "volleyball"
  if (t === "gaming") return "gaming"
  if (t === "generator" || t === "two") return "two-teams"
  if (t === "three") return "three-teams"
  if (t === "four") return "four-teams"
  if (t === "office") return "office"
  if (t === "tournament" || t === "sports") return "tournament"
  if (groups === 2) return "two-teams"
  if (groups === 3) return "three-teams"
  if (groups === 4) return "four-teams"
  return null
}

/** Apply a popular template to the live team-picker store. */
export function applyTeamPickerUseCase(id: TeamPickerUseCaseId): boolean {
  const useCase = getTeamPickerUseCase(id)
  if (!useCase) return false

  const { config } = useCase
  const store = useTeamPickerStore.getState()

  store.setNumberOfGroups(config.groups)
  store.setMaxPeoplePerGroup(config.maxPeoplePerGroup)
  store.setDistributionMode(config.distributionMode)
  store.setPickRepresentatives(config.pickRepresentatives)
  store.setCustomTeamNames(config.teamNames)

  if (store.participants.length === 0) {
    config.sampleNames.forEach((name) => store.addParticipant({ name }))
  }

  useTeamPickerStore.getState().generateTeams()

  // Only rewrite query params on the pillar — spoke pages keep clean dedicated URLs
  if (typeof window !== "undefined") {
    const path = window.location.pathname
    const isPillar =
      path === "/team-picker-wheel" ||
      path === "/team-picker" ||
      path === "/random-team-picker"
    if (isPillar) {
      const url = new URL(window.location.href)
      url.searchParams.set("template", config.templateParam)
      url.searchParams.set("groups", String(config.groups))
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }

  return true
}
