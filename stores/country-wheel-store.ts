import { create } from "zustand"
import { persist } from "zustand/middleware"
import { countries, getCountriesByRegion, type Country } from "@/data/countries"

interface CountryWheelStore {
  // Selected countries and filters
  selectedRegion: string
  selectedCountries: Country[]
  displayMode: "flag" | "name" | "both"
  viewMode: "wheel" | "list" | "text"

  // Favorites and comparison
  favoriteCountries: Country[]
  comparisonCountries: Country[]

  // Spin state
  isSpinning: boolean
  spinRotation: number
  selectedResult: Country | null
  totalSpins: number

  // UI state
  showStatistics: boolean
  showComparison: boolean
  showFavorites: boolean

  // Actions
  setSelectedRegion: (region: string) => void
  setDisplayMode: (mode: "flag" | "name" | "both") => void
  setViewMode: (mode: "wheel" | "list" | "text") => void
  setSelectedCountries: (countries: Country[]) => void
  toggleCountry: (country: Country) => void
  selectAllCountries: () => void
  deselectAllCountries: () => void

  // Favorites actions
  addToFavorites: (country: Country) => void
  removeFromFavorites: (countryId: string) => void
  isFavorite: (countryId: string) => boolean
  clearFavorites: () => void

  // Comparison actions
  addToComparison: (country: Country) => void
  removeFromComparison: (countryId: string) => void
  clearComparison: () => void
  isInComparison: (countryId: string) => boolean

  // UI actions
  setShowStatistics: (show: boolean) => void
  setShowComparison: (show: boolean) => void
  setShowFavorites: (show: boolean) => void

  // Spin actions
  setIsSpinning: (spinning: boolean) => void
  setSpinRotation: (rotation: number) => void
  setSelectedResult: (result: Country | null) => void
  incrementSpinCount: () => void

  // Getters
  getFilteredCountries: () => Country[]
  getSelectedCount: () => number
  getTotalCount: () => number
}

export const useCountryWheelStore = create<CountryWheelStore>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedRegion: "all",
      selectedCountries: countries,
      displayMode: "name",
      viewMode: "wheel",
      favoriteCountries: [],
      comparisonCountries: [],
      isSpinning: false,
      spinRotation: 0,
      selectedResult: null,
      totalSpins: 0,
      showStatistics: false,
      showComparison: false,
      showFavorites: false,

      // Region and filter actions
      setSelectedRegion: (region) => {
        const regionCountries = getCountriesByRegion(region)
        set({
          selectedRegion: region,
          selectedCountries: regionCountries,
        })
      },

      setDisplayMode: (mode) => set({ displayMode: mode }),
      setViewMode: (mode) => set({ viewMode: mode }),

      setSelectedCountries: (countries) => set({ selectedCountries: countries }),

      toggleCountry: (country) => {
        const state = get()
        const isSelected = state.selectedCountries.some((c) => c.id === country.id)

        if (isSelected) {
          set({
            selectedCountries: state.selectedCountries.filter((c) => c.id !== country.id),
          })
        } else {
          set({
            selectedCountries: [...state.selectedCountries, country],
          })
        }
      },

      selectAllCountries: () => {
        const state = get()
        const regionCountries = getCountriesByRegion(state.selectedRegion)
        set({ selectedCountries: regionCountries })
      },

      deselectAllCountries: () => set({ selectedCountries: [] }),

      // Favorites actions
      addToFavorites: (country) => {
        const state = get()
        if (!state.favoriteCountries.some((c) => c.id === country.id)) {
          set({ favoriteCountries: [...state.favoriteCountries, country] })
        }
      },

      removeFromFavorites: (countryId) => {
        set((state) => ({
          favoriteCountries: state.favoriteCountries.filter((c) => c.id !== countryId),
        }))
      },

      isFavorite: (countryId) => {
        return get().favoriteCountries.some((c) => c.id === countryId)
      },

      clearFavorites: () => set({ favoriteCountries: [] }),

      // Comparison actions
      addToComparison: (country) => {
        const state = get()
        if (state.comparisonCountries.length < 4 && !state.comparisonCountries.some((c) => c.id === country.id)) {
          set({ comparisonCountries: [...state.comparisonCountries, country] })
        }
      },

      removeFromComparison: (countryId) => {
        set((state) => ({
          comparisonCountries: state.comparisonCountries.filter((c) => c.id !== countryId),
        }))
      },

      clearComparison: () => set({ comparisonCountries: [] }),

      isInComparison: (countryId) => {
        return get().comparisonCountries.some((c) => c.id === countryId)
      },

      // UI actions
      setShowStatistics: (show) => set({ showStatistics: show }),
      setShowComparison: (show) => set({ showComparison: show }),
      setShowFavorites: (show) => set({ showFavorites: show }),

      // Spin actions
      setIsSpinning: (spinning) => set({ isSpinning: spinning }),
      setSpinRotation: (rotation) => set({ spinRotation: rotation }),
      setSelectedResult: (result) => set({ selectedResult: result }),
      incrementSpinCount: () => set((state) => ({ totalSpins: state.totalSpins + 1 })),

      // Getters
      getFilteredCountries: () => {
        const state = get()
        return state.selectedCountries
      },

      getSelectedCount: () => get().selectedCountries.length,
      getTotalCount: () => {
        const state = get()
        return getCountriesByRegion(state.selectedRegion).length
      },
    }),
    {
      name: "country-wheel-store",
      partialize: (state) => ({
        selectedRegion: state.selectedRegion,
        selectedCountries: state.selectedCountries,
        displayMode: state.displayMode,
        viewMode: state.viewMode,
        favoriteCountries: state.favoriteCountries,
        comparisonCountries: state.comparisonCountries,
        totalSpins: state.totalSpins,
      }),
    },
  ),
)
