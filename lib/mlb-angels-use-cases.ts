import {
  filterMlbAngelsNicknamesByEra,
  getAllMlbAngelsNicknames,
} from "@/data/mlb-angels-nicknames"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import type { MlbAngelsDisplayMode } from "@/types/mlb-angels-types"

export type MlbAngelsUseCaseId = "all-nicknames" | "legends" | "current"

export type MlbAngelsUseCaseConfig = {
  nicknameIds: string[]
  displayMode: MlbAngelsDisplayMode
  templateParam: string
}

export type MlbAngelsUseCase = {
  id: MlbAngelsUseCaseId
  label: string
  description: string
  accent: "red" | "navy" | "gold"
  config: MlbAngelsUseCaseConfig
}

const idsFrom = (entries: ReturnType<typeof getAllMlbAngelsNicknames>) =>
  entries.map((item) => item.id)

export const MLB_ANGELS_USE_CASES: MlbAngelsUseCase[] = [
  {
    id: "all-nicknames",
    label: "All Angels Nicknames",
    description: "Full Angels nickname catalog on one spinner.",
    accent: "red",
    config: {
      nicknameIds: idsFrom(getAllMlbAngelsNicknames()),
      displayMode: "nickname-name",
      templateParam: "all",
    },
  },
  {
    id: "legends",
    label: "Angels Legends Mode",
    description: "Franchise icons and Hall of Fame-era nicknames.",
    accent: "gold",
    config: {
      nicknameIds: idsFrom(filterMlbAngelsNicknamesByEra("legend")),
      displayMode: "nickname-name",
      templateParam: "legends",
    },
  },
  {
    id: "current",
    label: "Current Players Mode",
    description: "Recent-era Angels stars and active roster nicknames.",
    accent: "navy",
    config: {
      nicknameIds: idsFrom(filterMlbAngelsNicknamesByEra("current")),
      displayMode: "nickname-name",
      templateParam: "current",
    },
  },
]

export function getMlbAngelsUseCase(id: MlbAngelsUseCaseId) {
  return MLB_ANGELS_USE_CASES.find((item) => item.id === id)
}

export function mlbAngelsUseCaseFromTemplate(template: string | null): MlbAngelsUseCaseId | null {
  const value = (template || "").toLowerCase()
  const aliases: Record<string, MlbAngelsUseCaseId> = {
    all: "all-nicknames",
    nickname: "all-nicknames",
    nicknames: "all-nicknames",
    legend: "legends",
    legends: "legends",
    current: "current",
    "current-players": "current",
  }
  const resolved = aliases[value] || value
  return MLB_ANGELS_USE_CASES.some((item) => item.id === resolved)
    ? (resolved as MlbAngelsUseCaseId)
    : null
}

export function applyMlbAngelsUseCase(id: MlbAngelsUseCaseId): boolean {
  const useCase = getMlbAngelsUseCase(id)
  if (!useCase) return false
  const store = useWheelManagerStore.getState()
  if (store.currentTool !== "mlb-angels-wheel") store.setCurrentTool("mlb-angels-wheel")
  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("mlb-angels-wheel", "Angels Nickname Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false
  const ids = useCase.config.nicknameIds
  store.updateWheelData("mlb-angels-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedNicknameIds: ids,
    nicknameOrder: ids,
    displayMode: useCase.config.displayMode,
    activeUseCaseId: id,
  })
  return true
}
