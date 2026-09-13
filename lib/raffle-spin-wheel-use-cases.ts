import { useWheelManagerStore } from "@/stores/wheel-manager-store"

export type RaffleSpinWheelUseCaseId =
  | "standard"
  | "contest"
  | "giveaway"
  | "classroom"
  | "charity"

export type RaffleSpinWheelUseCaseAccent =
  | "amber"
  | "emerald"
  | "rose"
  | "sky"
  | "violet"

export type RaffleSpinWheelUseCaseConfig = {
  participants: string[]
  templateParam: string
  elimination: boolean
  toolTitle: string
  toolDescription: string
}

export type RaffleSpinWheelUseCase = {
  id: RaffleSpinWheelUseCaseId
  label: string
  description: string
  accent: RaffleSpinWheelUseCaseAccent
  config: RaffleSpinWheelUseCaseConfig
}

const colors = ["#f59e0b", "#22c55e", "#3b82f6", "#ec4899", "#a855f7", "#14b8a6"] as const

export const RAFFLE_SPIN_WHEEL_USE_CASES: RaffleSpinWheelUseCase[] = [
  {
    id: "standard",
    label: "Standard Raffle",
    description: "Equal-ticket participant draw with elimination ready.",
    accent: "amber",
    config: {
      templateParam: "standard",
      elimination: true,
      toolTitle: "Raffle Spin Wheel",
      toolDescription: "Draw a fair raffle winner from your entrant list",
      participants: [
        "Alex",
        "Jordan",
        "Sam",
        "Taylor",
        "Casey",
        "Riley",
        "Morgan",
        "Avery",
      ],
    },
  },
  {
    id: "contest",
    label: "Contest Draw",
    description: "Remove each winner as you award places.",
    accent: "rose",
    config: {
      templateParam: "contest",
      elimination: true,
      toolTitle: "Contest Winner Picker",
      toolDescription: "Eliminate winners as you fill contest places",
      participants: [
        "Entrant 1",
        "Entrant 2",
        "Entrant 3",
        "Entrant 4",
        "Entrant 5",
        "Entrant 6",
        "Entrant 7",
        "Entrant 8",
        "Entrant 9",
        "Entrant 10",
      ],
    },
  },
  {
    id: "giveaway",
    label: "Giveaway Entrants",
    description: "Paste stream or social entrants and spin live.",
    accent: "violet",
    config: {
      templateParam: "giveaway",
      elimination: true,
      toolTitle: "Giveaway Winner Picker",
      toolDescription: "Pick giveaway winners one draw at a time",
      participants: [
        "@viewer1",
        "@viewer2",
        "@viewer3",
        "@viewer4",
        "@viewer5",
        "@viewer6",
      ],
    },
  },
  {
    id: "classroom",
    label: "Classroom Ticket Draw",
    description: "Ticket-style student raffle for classroom rewards.",
    accent: "sky",
    config: {
      templateParam: "classroom",
      elimination: true,
      toolTitle: "Classroom Raffle",
      toolDescription: "Draw ticket holders for classroom prizes",
      participants: [
        "Ticket 01",
        "Ticket 02",
        "Ticket 03",
        "Ticket 04",
        "Ticket 05",
        "Ticket 06",
        "Ticket 07",
        "Ticket 08",
      ],
    },
  },
  {
    id: "charity",
    label: "Charity Raffle",
    description: "Transparent charity or fundraiser entrant draw.",
    accent: "emerald",
    config: {
      templateParam: "charity",
      elimination: true,
      toolTitle: "Charity Raffle Draw",
      toolDescription: "Transparent charity raffle winner selection",
      participants: [
        "Donor A",
        "Donor B",
        "Donor C",
        "Donor D",
        "Donor E",
        "Donor F",
      ],
    },
  },
]

export function getRaffleSpinWheelUseCase(
  id: string | null | undefined,
): RaffleSpinWheelUseCase | undefined {
  return RAFFLE_SPIN_WHEEL_USE_CASES.find((item) => item.id === id)
}

export function raffleSpinWheelUseCaseFromTemplate(
  template: string | null | undefined,
): RaffleSpinWheelUseCaseId | null {
  if (!template) return null
  const match = RAFFLE_SPIN_WHEEL_USE_CASES.find(
    (item) => item.config.templateParam === template || item.id === template,
  )
  return match?.id ?? null
}

export function applyRaffleSpinWheelUseCase(id: RaffleSpinWheelUseCaseId) {
  const useCase = getRaffleSpinWheelUseCase(id)
  if (!useCase) return

  const { updateWheelData, getCurrentWheel, setCurrentTool, createNewWheel } =
    useWheelManagerStore.getState()

  setCurrentTool("raffle-spin-wheel")
  let wheel = getCurrentWheel()
  if (!wheel || wheel.toolType !== "raffle-spin-wheel") {
    createNewWheel("raffle-spin-wheel", useCase.config.toolTitle)
    wheel = useWheelManagerStore.getState().getCurrentWheel()
  }
  if (!wheel) return

  const timestamp = Date.now()
  const options = useCase.config.participants.map((name, index) => ({
    id: `raffle-${useCase.id}-${timestamp}-${index}`,
    name,
    color: colors[index % colors.length],
    weight: 1,
    enabled: true,
  }))

  updateWheelData("raffle-spin-wheel", wheel.id, {
    ...wheel.data,
    options,
    totalSpins: 0,
    lastResult: null,
    recentResults: [],
    spinHistory: [],
    selectedResult: null,
    toolTitle: useCase.config.toolTitle,
    toolDescription: useCase.config.toolDescription,
    activeUseCaseId: useCase.id,
    drawHistory: [],
    lockedWinnerIds: [],
  })
}
