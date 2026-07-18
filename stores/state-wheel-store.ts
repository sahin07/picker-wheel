import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getStatesByCountry, type State } from "@/data/states"

interface StateWheelStore {
  // Selected country and states
  selectedCountry: string
  selectedStates: State[]
  displayMode: "flag" | "name" | "both"
  viewMode: "wheel" | "list" | "text"

  // Favorites and comparison
  favoriteStates: State[]
  comparisonStates: State[]

  // Spin state
  isSpinning: boolean
  spinRotation: number
  selectedResult: State | null
  totalSpins: number

  // UI state
  showStatistics: boolean
  showComparison: boolean
  showFavorites: boolean

  // Actions
  setSelectedCountry: (countryCode: string) => void
  setDisplayMode: (mode: "flag" | "name" | "both") => void
  setViewMode: (mode: "wheel" | "list" | "text") => void
  setSelectedStates: (states: State[]) => void
  toggleState: (state: State) => void
  selectAllStates: () => void
  deselectAllStates: () => void
  shuffleStates: () => void
  sortStatesAZ: () => void

  // Favorites actions
  addToFavorites: (state: State) => void
  removeFromFavorites: (stateId: string) => void
  isFavorite: (stateId: string) => boolean
  clearFavorites: () => void

  // Comparison actions
  addToComparison: (state: State) => void
  removeFromComparison: (stateId: string) => void
  clearComparison: () => void
  isInComparison: (stateId: string) => boolean

  // UI actions
  setShowStatistics: (show: boolean) => void
  setShowComparison: (show: boolean) => void
  setShowFavorites: (show: boolean) => void

  // Spin actions
  setIsSpinning: (spinning: boolean) => void
  setSpinRotation: (rotation: number) => void
  setSelectedResult: (result: State | null) => void
  incrementSpinCount: () => void

  // Getters
  getFilteredStates: () => State[]
  getSelectedCount: () => number
  getTotalCount: () => number
}

export const useStateWheelStore = create<StateWheelStore>()(
  persist(
    (set, get) => ({
      // Initial state - default to United States
      selectedCountry: "US",
      selectedStates: getStatesByCountry("US"),
      displayMode: "name",
      viewMode: "wheel",
      favoriteStates: [],
      comparisonStates: [],
      isSpinning: false,
      spinRotation: 0,
      selectedResult: null,
      totalSpins: 0,
      showStatistics: false,
      showComparison: false,
      showFavorites: false,

      // Country and filter actions
      setSelectedCountry: (countryCode) => {
        const countryStates = getStatesByCountry(countryCode)
        set({
          selectedCountry: countryCode,
          selectedStates: countryStates,
        })
      },

      setDisplayMode: (mode) => set({ displayMode: mode }),
      setViewMode: (mode) => set({ viewMode: mode }),

      setSelectedStates: (states) => set({ selectedStates: states }),

      toggleState: (state) => {
        const currentStates = get().selectedStates
        const isSelected = currentStates.some((s) => s.id === state.id)

        if (isSelected) {
          set({
            selectedStates: currentStates.filter((s) => s.id !== state.id),
          })
        } else {
          set({
            selectedStates: [...currentStates, state],
          })
        }
      },

      selectAllStates: () => {
        const state = get()
        const countryStates = getStatesByCountry(state.selectedCountry)
        set({ selectedStates: countryStates })
      },

      deselectAllStates: () => set({ selectedStates: [] }),

      shuffleStates: () => {
        const state = get()
        const shuffled = [...state.selectedStates].sort(() => Math.random() - 0.5)
        set({ selectedStates: shuffled })
      },

      sortStatesAZ: () => {
        const state = get()
        const sorted = [...state.selectedStates].sort((a, b) => a.name.localeCompare(b.name))
        set({ selectedStates: sorted })
      },

      // Favorites actions
      addToFavorites: (state) => {
        const currentFavorites = get().favoriteStates
        if (!currentFavorites.some((s) => s.id === state.id)) {
          set({ favoriteStates: [...currentFavorites, state] })
        }
      },

      removeFromFavorites: (stateId) => {
        set((state) => ({
          favoriteStates: state.favoriteStates.filter((s) => s.id !== stateId),
        }))
      },

      isFavorite: (stateId) => {
        return get().favoriteStates.some((s) => s.id === stateId)
      },

      clearFavorites: () => set({ favoriteStates: [] }),

      // Comparison actions
      addToComparison: (state) => {
        const currentComparison = get().comparisonStates
        if (currentComparison.length < 4 && !currentComparison.some((s) => s.id === state.id)) {
          set({ comparisonStates: [...currentComparison, state] })
        }
      },

      removeFromComparison: (stateId) => {
        set((state) => ({
          comparisonStates: state.comparisonStates.filter((s) => s.id !== stateId),
        }))
      },

      clearComparison: () => set({ comparisonStates: [] }),

      isInComparison: (stateId) => {
        return get().comparisonStates.some((s) => s.id === stateId)
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
      getFilteredStates: () => {
        const state = get()
        return state.selectedStates
      },

      getSelectedCount: () => get().selectedStates.length,
      getTotalCount: () => {
        const state = get()
        return getStatesByCountry(state.selectedCountry).length
      },
    }),
    {
      name: "state-wheel-store",
      partialize: (state) => ({
        selectedCountry: state.selectedCountry,
        selectedStates: state.selectedStates,
        displayMode: state.displayMode,
        viewMode: state.viewMode,
        favoriteStates: state.favoriteStates,
        comparisonStates: state.comparisonStates,
        totalSpins: state.totalSpins,
      }),
    },
  ),
)
