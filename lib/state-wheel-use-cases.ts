import { getStatesByCountry, type State } from "@/data/states"
import { STATE_WHEEL_PATH } from "@/lib/state-wheel-seo"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"

export type StateWheelUseCaseId =
  | "all"
  | "us"
  | "canada"
  | "australia"
  | "uk"
  | "india"
  | "germany"
  | "japan"
  | "random"

export type StateWheelUseCaseAccent =
  | "sky"
  | "emerald"
  | "amber"
  | "violet"
  | "rose"
  | "blue"
  | "teal"
  | "orange"
  | "indigo"

export type StateWheelUseCaseConfig = {
  selectedCountry: string
  selectedStates: State[]
  templateParam: string
}

export type StateWheelUseCase = {
  id: StateWheelUseCaseId
  label: string
  description: string
  accent: StateWheelUseCaseAccent
  config: StateWheelUseCaseConfig
}

function countryCase(
  id: StateWheelUseCaseId,
  countryCode: string,
  label: string,
  description: string,
  accent: StateWheelUseCaseAccent,
): StateWheelUseCase {
  return {
    id,
    label,
    description,
    accent,
    config: {
      selectedCountry: countryCode,
      selectedStates: getStatesByCountry(countryCode),
      templateParam: id,
    },
  }
}

export const STATE_WHEEL_USE_CASES: StateWheelUseCase[] = [
  {
    id: "all",
    label: "All US States",
    description: "All 50 US states on one fair spinner.",
    accent: "sky",
    config: {
      selectedCountry: "US",
      selectedStates: getStatesByCountry("US"),
      templateParam: "all",
    },
  },
  countryCase("us", "US", "US State Picker Wheel", "All 50 US states.", "blue"),
  countryCase("canada", "CA", "Canada Province Picker Wheel", "Canadian provinces and territories.", "emerald"),
  countryCase("australia", "AU", "Australia State Picker Wheel", "Australian states and territories.", "amber"),
  countryCase("uk", "GB", "UK Region Picker Wheel", "UK regions and countries.", "rose"),
  countryCase("india", "IN", "India State Picker Wheel", "Indian states and union territories.", "orange"),
  countryCase("germany", "DE", "Germany State Picker Wheel", "German federal states (Bundesländer).", "teal"),
  countryCase("japan", "JP", "Japan Prefecture Picker Wheel", "All 47 Japanese prefectures.", "violet"),
  {
    id: "random",
    label: "Random State Picker",
    description: "Quick random state from the full US list.",
    accent: "indigo",
    config: {
      selectedCountry: "US",
      selectedStates: getStatesByCountry("US"),
      templateParam: "random",
    },
  },
]

export function getStateWheelUseCase(id: StateWheelUseCaseId): StateWheelUseCase | undefined {
  return STATE_WHEEL_USE_CASES.find((u) => u.id === id)
}

export function stateWheelUseCaseFromTemplate(template: string | null): StateWheelUseCaseId | null {
  const t = (template || "").toLowerCase()
  const valid = STATE_WHEEL_USE_CASES.map((u) => u.id)
  if (t && (valid as string[]).includes(t)) return t as StateWheelUseCaseId
  if (t === "united-states" || t === "usa" || t === "50-states") return "us"
  if (t === "ca" || t === "provinces") return "canada"
  if (t === "au" || t === "aussie") return "australia"
  if (t === "gb" || t === "britain" || t === "england") return "uk"
  if (t === "in") return "india"
  if (t === "de" || t === "bundesland") return "germany"
  if (t === "jp" || t === "prefectures") return "japan"
  if (t === "spin" || t === "wheel" || t === "us-states") return "all"
  return null
}

export function applyStateWheelUseCase(id: StateWheelUseCaseId): boolean {
  const useCase = getStateWheelUseCase(id)
  if (!useCase) return false

  const { config } = useCase
  const store = useWheelManagerStore.getState()

  if (store.currentTool !== "state-wheel") {
    store.setCurrentTool("state-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("state-wheel", "State Picker Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  store.updateWheelData("state-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedCountry: config.selectedCountry,
    selectedStates: config.selectedStates,
    viewMode: "wheel",
  })

  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path === STATE_WHEEL_PATH) {
      const url = new URL(window.location.href)
      url.searchParams.set("template", config.templateParam)
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }

  return true
}
