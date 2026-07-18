import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WheelOption {
  id: string
  name: string
  image?: string
  color?: string
}

export interface WheelData {
  options: WheelOption[]
  totalSpins: number
  lastResult: WheelOption | null
  createdAt: string
  updatedAt: string
}

interface WheelStore {
  // Wheel Data
  options: WheelOption[]
  totalSpins: number
  lastResult: WheelOption | null

  // Spin State
  isSpinning: boolean
  spinRotation: number
  selectedResult: WheelOption | null

  // Actions
  addOption: (name: string, image?: string) => void
  removeOption: (id: string) => void
  updateOption: (id: string, name: string, image?: string) => void
  duplicateOption: (id: string) => void
  clearAllOptions: () => void
  setTemplateOptions: (templateOptions: string[]) => void

  // Spin Actions
  setIsSpinning: (spinning: boolean) => void
  setSpinRotation: (rotation: number) => void
  setSelectedResult: (result: WheelOption | null) => void
  incrementSpinCount: () => void

  // Database Actions
  saveToDatabase: () => Promise<void>
  loadFromDatabase: () => Promise<void>
}

const defaultColors = ["#4ade80", "#fbbf24", "#f97316", "#84cc16", "#eab308", "#22c55e"]

export const useWheelStore = create<WheelStore>()(
  persist(
    (set, get) => ({
      // Initial State
      options: [
        { id: "1", name: "NO", color: "#fbbf24" },
        { id: "2", name: "sdgsd", color: "#f97316" },
        {
          id: "3",
          name: "bg-ashvaik",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9XiZShtI9A24mtMM1qcsNfJ2zgUvW7.png",
          color: "#4ade80",
        },
        { id: "4", name: "YES", color: "#4ade80" },
      ],
      totalSpins: 0,
      lastResult: null,
      isSpinning: false,
      spinRotation: 0,
      selectedResult: null,

      // Option Management
      addOption: (name, image) => {
        const state = get()
        const newOption: WheelOption = {
          id: Date.now().toString(),
          name: name || (image ? `Image ${state.options.length + 1}` : `Option ${state.options.length + 1}`),
          image,
          color: defaultColors[state.options.length % defaultColors.length],
        }
        set({ options: [...state.options, newOption] })
      },

      removeOption: (id) => {
        set((state) => ({ options: state.options.filter((option) => option.id !== id) }))
      },

      updateOption: (id, name, image) => {
        set((state) => ({
          options: state.options.map((option) =>
            option.id === id ? { ...option, name, image: image || option.image } : option,
          ),
        }))
      },

      duplicateOption: (id) => {
        const state = get()
        const option = state.options.find((opt) => opt.id === id)
        if (option) {
          const newOption = {
            ...option,
            id: Date.now().toString(),
            name: `${option.name} (copy)`,
          }
          set({ options: [...state.options, newOption] })
        }
      },

      clearAllOptions: () => {
        set({ options: [], selectedResult: null, lastResult: null })
      },

      setTemplateOptions: (templateOptions) => {
        const newOptions: WheelOption[] = templateOptions.map((text, index) => ({
          id: `template-${index}`,
          name: text,
          color: defaultColors[index % defaultColors.length],
        }))
        set({ options: newOptions, selectedResult: null, lastResult: null })
      },

      // Spin State Management
      setIsSpinning: (spinning) => set({ isSpinning: spinning }),
      setSpinRotation: (rotation) => set({ spinRotation: rotation }),
      setSelectedResult: (result) => set({ selectedResult: result, lastResult: result }),
      incrementSpinCount: () => set((state) => ({ totalSpins: state.totalSpins + 1 })),

      // Database Operations
      saveToDatabase: async () => {
        try {
          const state = get()
          const wheelData: WheelData = {
            options: state.options,
            totalSpins: state.totalSpins,
            lastResult: state.lastResult,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          const response = await fetch("/api/tools/picker-wheel/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolType: "picker-wheel",
              data: wheelData,
              timestamp: new Date().toISOString(),
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to save wheel data")
          }

          console.log("Wheel data saved to database successfully")
        } catch (error) {
          console.error("Error saving wheel data to database:", error)
          throw error
        }
      },

      loadFromDatabase: async () => {
        try {
          const response = await fetch("/api/tools/picker-wheel/data")
          if (response.ok) {
            const result = await response.json()
            if (result.data) {
              const { options, totalSpins, lastResult } = result.data
              set({
                options: options || [],
                totalSpins: totalSpins || 0,
                lastResult: lastResult || null,
                selectedResult: null,
                isSpinning: false,
                spinRotation: 0,
              })
            }
          }
        } catch (error) {
          console.error("Error loading wheel data from database:", error)
        }
      },
    }),
    {
      name: "picker-wheel-data",
      partialize: (state) => ({
        options: state.options,
        totalSpins: state.totalSpins,
        lastResult: state.lastResult,
      }),
    },
  ),
)
