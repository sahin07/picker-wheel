import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ColorWheelData {
  activeTab: string
  inputMethod: "color-wheel" | "manual" | "image"
  colorCombination: string
  spinningPointerMode: "manual" | "random"
  selectedColor: string
  customColors: Array<{
    id: string
    color: string
    name: string
    enabled: boolean
  }>
  showStats: boolean
  confettiEnabled: boolean
  soundEnabled: boolean
  wheelTheme: string
  results: Array<{
    color: string
    name: string
    hex: string
    rgb: string
    timestamp: Date
  }>
  lastResult: {
    color: string
    name: string
    hex: string
    rgb: string
  } | null
  totalSpins: number
  resultShowMode: {
    color: boolean
    text: boolean
    hex: boolean
    rgb: boolean
  }
  isSpinning: boolean
  rotation: number
  wheelShake: boolean
  showParticles: boolean
  showConfetti: boolean
  wheelTitle: string
  wheelDescription: string
}

const defaultColorWheelData: ColorWheelData = {
  activeTab: "color-wheel",
  inputMethod: "color-wheel",
  colorCombination: "complementary",
  spinningPointerMode: "random",
  selectedColor: "#FF0000",
  customColors: [],
  showStats: false,
  confettiEnabled: true,
  soundEnabled: true,
  wheelTheme: "classic",
  results: [],
  lastResult: null,
  totalSpins: 0,
  resultShowMode: {
    color: true,
    text: true,
    hex: true,
    rgb: true
  },
  isSpinning: false,
  rotation: 0,
  wheelShake: false,
  showParticles: false,
  showConfetti: false,
  wheelTitle: "Color Picker Wheel",
  wheelDescription: "Pick a random color by wheel",
}

interface ColorWheelStore {
  data: ColorWheelData
  updateData: (updates: Partial<ColorWheelData>) => void
  resetData: () => void
  saveToDatabase: () => Promise<void>
  loadFromDatabase: () => Promise<void>
}

export const useColorWheelStore = create<ColorWheelStore>()(
  persist(
    (set, get) => ({
      data: defaultColorWheelData,

      updateData: (updates) => {
        set((state) => ({
          data: { ...state.data, ...updates },
        }))
      },

      resetData: () => {
        set({ data: defaultColorWheelData })
      },

      saveToDatabase: async () => {
        try {
          const response = await fetch("/api/tools/color-picker-wheel/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolType: "color-picker-wheel",
              data: get().data,
              timestamp: new Date().toISOString(),
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to save color wheel data")
          }

          console.log("Color wheel data saved to database successfully")
        } catch (error) {
          console.error("Error saving color wheel data to database:", error)
          throw error
        }
      },

      loadFromDatabase: async () => {
        try {
          const response = await fetch("/api/tools/color-picker-wheel/data")
          if (response.ok) {
            const data = await response.json()
            if (data.data) {
              set({ data: { ...defaultColorWheelData, ...data.data } })
            }
          }
        } catch (error) {
          console.error("Error loading color wheel data from database:", error)
        }
      },
    }),
    {
      name: "color-wheel-data",
      partialize: (state) => ({ data: state.data }),
    },
  ),
) 