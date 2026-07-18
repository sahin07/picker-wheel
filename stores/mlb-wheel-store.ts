import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mlbTeams, getMLBTeamsByLeague, type MLBTeam } from "@/data/mlb-teams"

interface MLBWheelStore {
  // League and team selection
  selectedLeague: "all" | "American" | "National"
  selectedTeams: MLBTeam[]
  displayMode: "logo" | "name" | "both"
  viewMode: "wheel" | "list" | "text"
  
  // Favorites and comparison
  favoriteTeams: MLBTeam[]
  comparisonTeams: MLBTeam[]
  
  // Wheel state
  isSpinning: boolean
  spinRotation: number
  selectedResult: MLBTeam | null
  totalSpins: number
  recentResults: MLBTeam[]
  
  // Modal states
  showStatistics: boolean
  showComparison: boolean
  showFavorites: boolean
  
  // Actions
  setSelectedLeague: (league: "all" | "American" | "National") => void
  setSelectedTeams: (teams: MLBTeam[]) => void
  toggleTeam: (team: MLBTeam) => void
  setDisplayMode: (mode: "logo" | "name" | "both") => void
  setViewMode: (mode: "wheel" | "list" | "text") => void
  
  // Favorites and comparison actions
  addToFavorites: (team: MLBTeam) => void
  removeFromFavorites: (teamId: string) => void
  isFavorite: (teamId: string) => boolean
  addToComparison: (team: MLBTeam) => void
  removeFromComparison: (teamId: string) => void
  isInComparison: (teamId: string) => boolean
  
  // Wheel actions
  setIsSpinning: (spinning: boolean) => void
  setSpinRotation: (rotation: number) => void
  setSelectedResult: (result: MLBTeam | null) => void
  incrementSpinCount: () => void
  addToRecentResults: (result: MLBTeam) => void
  
  // Modal actions
  setShowStatistics: (show: boolean) => void
  setShowComparison: (show: boolean) => void
  setShowFavorites: (show: boolean) => void
  
  // Utility actions
  selectAllTeams: () => void
  clearAllTeams: () => void
  selectLeagueTeams: (league: "American" | "National") => void
  shuffleTeams: () => void
  sortTeamsAlphabetically: () => void
}

export const useMLBWheelStore = create<MLBWheelStore>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedLeague: "all",
      selectedTeams: mlbTeams,
      displayMode: "name",
      viewMode: "wheel",
      favoriteTeams: [],
      comparisonTeams: [],
      isSpinning: false,
      spinRotation: 0,
      selectedResult: null,
      totalSpins: 0,
      recentResults: [],
      showStatistics: false,
      showComparison: false,
      showFavorites: false,

      // League and team selection
      setSelectedLeague: (league) => {
        set({ selectedLeague: league })
        const teams = getMLBTeamsByLeague(league)
        set({ selectedTeams: teams })
      },

      setSelectedTeams: (teams) => {
        set({ selectedTeams: teams })
      },

      toggleTeam: (team) => {
        const { selectedTeams } = get()
        const isSelected = selectedTeams.some(t => t.id === team.id)
        
        if (isSelected) {
          set({ selectedTeams: selectedTeams.filter(t => t.id !== team.id) })
        } else {
          set({ selectedTeams: [...selectedTeams, team] })
        }
      },

      setDisplayMode: (mode) => {
        set({ displayMode: mode })
      },

      setViewMode: (mode) => {
        set({ viewMode: mode })
      },

      // Favorites and comparison
      addToFavorites: (team) => {
        const { favoriteTeams } = get()
        if (!favoriteTeams.some(t => t.id === team.id)) {
          set({ favoriteTeams: [...favoriteTeams, team] })
        }
      },

      removeFromFavorites: (teamId) => {
        const { favoriteTeams } = get()
        set({ favoriteTeams: favoriteTeams.filter(t => t.id !== teamId) })
      },

      isFavorite: (teamId) => {
        const { favoriteTeams } = get()
        return favoriteTeams.some(t => t.id === teamId)
      },

      addToComparison: (team) => {
        const { comparisonTeams } = get()
        if (!comparisonTeams.some(t => t.id === team.id) && comparisonTeams.length < 4) {
          set({ comparisonTeams: [...comparisonTeams, team] })
        }
      },

      removeFromComparison: (teamId) => {
        const { comparisonTeams } = get()
        set({ comparisonTeams: comparisonTeams.filter(t => t.id !== teamId) })
      },

      isInComparison: (teamId) => {
        const { comparisonTeams } = get()
        return comparisonTeams.some(t => t.id === teamId)
      },

      // Wheel actions
      setIsSpinning: (spinning) => {
        set({ isSpinning: spinning })
      },

      setSpinRotation: (rotation) => {
        set({ spinRotation: rotation })
      },

      setSelectedResult: (result) => {
        set({ selectedResult: result })
        if (result) {
          get().addToRecentResults(result)
        }
      },

      incrementSpinCount: () => {
        const { totalSpins } = get()
        set({ totalSpins: totalSpins + 1 })
      },

      addToRecentResults: (result) => {
        const { recentResults } = get()
        const updatedResults = [result, ...recentResults].slice(0, 10) // Keep last 10
        set({ recentResults: updatedResults })
      },

      clearRecentResults: () => {
        set({ recentResults: [] })
      },

      // Modal actions
      setShowStatistics: (show) => {
        set({ showStatistics: show })
      },

      setShowComparison: (show) => {
        set({ showComparison: show })
      },

      setShowFavorites: (show) => {
        set({ showFavorites: show })
      },

      // Utility actions
      selectAllTeams: () => {
        const { selectedLeague } = get()
        const teams = getMLBTeamsByLeague(selectedLeague)
        set({ selectedTeams: teams })
      },

      clearAllTeams: () => {
        set({ selectedTeams: [] })
      },

      selectLeagueTeams: (league) => {
        const teams = getMLBTeamsByLeague(league)
        set({ selectedTeams: teams, selectedLeague: league })
      },

      shuffleTeams: () => {
        const { selectedTeams } = get()
        const shuffled = [...selectedTeams].sort(() => Math.random() - 0.5)
        set({ selectedTeams: shuffled })
      },

      sortTeamsAlphabetically: () => {
        const { selectedTeams } = get()
        const sorted = [...selectedTeams].sort((a, b) => a.name.localeCompare(b.name))
        set({ selectedTeams: sorted })
      },
    }),
    {
      name: "mlb-wheel-store",
      partialize: (state) => ({
        selectedLeague: state.selectedLeague,
        selectedTeams: state.selectedTeams,
        displayMode: state.displayMode,
        viewMode: state.viewMode,
        favoriteTeams: state.favoriteTeams,
        comparisonTeams: state.comparisonTeams,
        totalSpins: state.totalSpins,
        recentResults: state.recentResults,
      }),
    },
  ),
) 