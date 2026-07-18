import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface YesNoWheelData {
  activeTab: string
  mode: "yes-no" | "yes-no-maybe"
  inputSets: number
  userQuestion: string
  aiAdvice: string
  showStats: boolean
  confettiEnabled: boolean
  soundEnabled: boolean
  wheelTheme: string
  results: { yes: number; no: number; maybe: number }
  lastResult: string | null
  totalSpins: number
  streak: { type: string; count: number }
  achievements: string[]
  aiContext: string
  isSpinning: boolean
  rotation: number
  wheelShake: boolean
  showParticles: boolean
  showConfetti: boolean
}

const defaultYesNoWheelData: YesNoWheelData = {
  activeTab: "manual",
  mode: "yes-no",
  inputSets: 1,
  userQuestion: "",
  aiAdvice: "",
  showStats: false,
  confettiEnabled: true,
  soundEnabled: true,
  wheelTheme: "classic",
  results: { yes: 0, no: 0, maybe: 0 },
  lastResult: null,
  totalSpins: 0,
  streak: { type: "", count: 0 },
  achievements: [],
  aiContext: "",
  isSpinning: false,
  rotation: 0,
  wheelShake: false,
  showParticles: false,
  showConfetti: false,
}

interface YesNoWheelStore {
  data: YesNoWheelData
  updateData: (updates: Partial<YesNoWheelData>) => void
  resetData: () => void
  saveToDatabase: () => Promise<void>
  loadFromDatabase: () => Promise<void>
}

export const useYesNoWheelStore = create<YesNoWheelStore>()(
  persist(
    (set, get) => ({
      data: defaultYesNoWheelData,

      updateData: (updates) => {
        set((state) => ({
          data: { ...state.data, ...updates },
        }))
      },

      resetData: () => {
        set({ data: defaultYesNoWheelData })
      },

      saveToDatabase: async () => {
        try {
          const response = await fetch("/api/tools/yes-no-picker-wheel/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolType: "yes-no-picker-wheel",
              data: get().data,
              timestamp: new Date().toISOString(),
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to save yes-no wheel data")
          }

          console.log("Yes/No wheel data saved to database successfully")
        } catch (error) {
          console.error("Error saving yes-no wheel data to database:", error)
          throw error
        }
      },

      loadFromDatabase: async () => {
        try {
          const response = await fetch("/api/tools/yes-no-picker-wheel/data")
          if (response.ok) {
            const data = await response.json()
            if (data.data) {
              set({ data: { ...defaultYesNoWheelData, ...data.data } })
            }
          }
        } catch (error) {
          console.error("Error loading yes-no wheel data from database:", error)
        }
      },
    }),
    {
      name: "yes-no-wheel-data",
      partialize: (state) => ({ data: state.data }),
    },
  ),
) 