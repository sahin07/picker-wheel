import {
  countries,
  getCountriesByRegion,
  type Country,
} from "@/data/countries"
import { COUNTRY_WHEEL_PATH } from "@/lib/country-wheel-seo"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"

export type CountryWheelUseCaseId =
  | "all"
  | "europe"
  | "asia"
  | "africa"
  | "north-america"
  | "south-america"
  | "oceania"
  | "travel"
  | "visit"
  | "favorites"
  | "g20"
  | "un"
  | "population"

export type CountryWheelUseCaseAccent =
  | "sky"
  | "emerald"
  | "amber"
  | "violet"
  | "rose"
  | "blue"
  | "teal"
  | "orange"
  | "indigo"

export type CountryDisplayMode = "flag" | "name" | "both"

export type CountryWheelUseCaseConfig = {
  selectedRegion: string
  countries: Country[]
  displayMode: CountryDisplayMode
  templateParam: string
}

export type CountryWheelUseCase = {
  id: CountryWheelUseCaseId
  label: string
  description: string
  accent: CountryWheelUseCaseAccent
  config: CountryWheelUseCaseConfig
}

export function getAllCountriesFlat(): Country[] {
  return countries
}

/** Popular / travel-friendly shortlist for visit/travel spokes */
function travelPool(): Country[] {
  const codes = new Set([
    "jp", "it", "fr", "es", "th", "us", "gb", "au", "nz", "is",
    "pt", "gr", "mx", "br", "ca", "kr", "sg", "ae", "ma", "pe",
    "vn", "id", "tr", "hr", "ie", "ch", "nl", "se", "no", "fi",
  ])
  const pooled = countries.filter((c) => codes.has(c.id) || codes.has(c.code.toLowerCase()))
  return pooled.length >= 12 ? pooled : getCountriesByRegion("all").slice(0, 40)
}

/** G20 country members (excluding EU as a bloc) */
function g20Pool(): Country[] {
  const codes = new Set([
    "ar", "au", "br", "ca", "cn", "fr", "de", "in", "id", "it",
    "jp", "kr", "mx", "ru", "sa", "za", "tr", "gb", "us",
  ])
  return countries.filter((c) => codes.has(c.id) || codes.has(c.code.toLowerCase()))
}

/** Curated catalog treated as UN-member-style world list for schools */
function unPool(): Country[] {
  return getCountriesByRegion("all")
}

/** Most populous countries for trivia */
function populationPool(limit = 40): Country[] {
  return [...countries]
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, limit)
}

function regionCase(
  id: CountryWheelUseCaseId,
  region: string,
  label: string,
  description: string,
  accent: CountryWheelUseCaseAccent,
): CountryWheelUseCase {
  return {
    id,
    label,
    description,
    accent,
    config: {
      selectedRegion: region,
      countries: getCountriesByRegion(region),
      displayMode: "both",
      templateParam: id,
    },
  }
}

export const COUNTRY_WHEEL_USE_CASES: CountryWheelUseCase[] = [
  {
    id: "all",
    label: "All Countries",
    description: "Full world catalog on one fair spinner.",
    accent: "sky",
    config: {
      selectedRegion: "all",
      countries: getCountriesByRegion("all"),
      displayMode: "both",
      templateParam: "all",
    },
  },
  regionCase("europe", "Europe", "Europe Picker Wheel", "European countries only.", "blue"),
  regionCase("asia", "Asia", "Asia Picker Wheel", "Asian countries only.", "amber"),
  regionCase("africa", "Africa", "Africa Picker Wheel", "African countries only.", "emerald"),
  regionCase(
    "north-america",
    "North America",
    "North America Picker Wheel",
    "North American countries only.",
    "rose",
  ),
  regionCase(
    "south-america",
    "South America",
    "South America Picker Wheel",
    "South American countries only.",
    "orange",
  ),
  regionCase("oceania", "Oceania", "Oceania Picker Wheel", "Oceania countries only.", "teal"),
  {
    id: "travel",
    label: "Travel Destination Picker Wheel",
    description: "Curated travel-friendly destinations for trip inspiration.",
    accent: "violet",
    config: {
      selectedRegion: "all",
      countries: travelPool(),
      displayMode: "both",
      templateParam: "travel",
    },
  },
  {
    id: "visit",
    label: "Visit Picker Wheel",
    description: "Spin a random country to visit next.",
    accent: "indigo",
    config: {
      selectedRegion: "all",
      countries: travelPool(),
      displayMode: "both",
      templateParam: "visit",
    },
  },
  {
    id: "favorites",
    label: "Favorites Picker Wheel",
    description: "Deep-link style shortlist; falls back to a travel pool if empty.",
    accent: "rose",
    config: {
      selectedRegion: "all",
      countries: travelPool(),
      displayMode: "both",
      templateParam: "favorites",
    },
  },
  {
    id: "g20",
    label: "G20 Picker Wheel",
    description: "Major economies for classrooms, economics units, and trivia.",
    accent: "amber",
    config: {
      selectedRegion: "all",
      countries: g20Pool(),
      displayMode: "both",
      templateParam: "g20",
    },
  },
  {
    id: "un",
    label: "UN Picker Wheel",
    description: "UN member-focused world list for schools and geography lessons.",
    accent: "blue",
    config: {
      selectedRegion: "all",
      countries: unPool(),
      displayMode: "both",
      templateParam: "un",
    },
  },
  {
    id: "population",
    label: "Population Picker Wheel",
    description: "Most populous countries for trivia and classroom challenges.",
    accent: "violet",
    config: {
      selectedRegion: "all",
      countries: populationPool(),
      displayMode: "both",
      templateParam: "population",
    },
  },
]

export function getCountryWheelUseCase(
  id: CountryWheelUseCaseId,
): CountryWheelUseCase | undefined {
  return COUNTRY_WHEEL_USE_CASES.find((u) => u.id === id)
}

export function countryWheelUseCaseFromTemplate(
  template: string | null,
): CountryWheelUseCaseId | null {
  const t = (template || "").toLowerCase()
  const valid = COUNTRY_WHEEL_USE_CASES.map((u) => u.id)
  if (t && (valid as string[]).includes(t)) return t as CountryWheelUseCaseId
  if (t === "random" || t === "world" || t === "all-countries") return "all"
  if (t === "eu" || t === "european") return "europe"
  if (t === "na" || t === "northamerica") return "north-america"
  if (t === "sa" || t === "southamerica") return "south-america"
  if (t === "destination" || t === "trip") return "travel"
  if (t === "to-visit" || t === "visit-next") return "visit"
  if (t === "favourite" || t === "favorite") return "favorites"
  if (t === "g20-countries" || t === "g-20") return "g20"
  if (t === "un-members" || t === "united-nations") return "un"
  if (t === "by-population" || t === "population-leaders") return "population"
  return null
}

export function applyCountryWheelUseCase(id: CountryWheelUseCaseId): boolean {
  const useCase = getCountryWheelUseCase(id)
  if (!useCase) return false

  const { config } = useCase
  const store = useWheelManagerStore.getState()

  if (store.currentTool !== "country-wheel") {
    store.setCurrentTool("country-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("country-wheel", "Country Picker Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  store.updateWheelData("country-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedRegion: config.selectedRegion,
    selectedCountries: config.countries,
    displayMode: config.displayMode,
    viewMode: "wheel",
  })

  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path === COUNTRY_WHEEL_PATH) {
      const url = new URL(window.location.href)
      url.searchParams.set("template", config.templateParam)
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }

  return true
}
