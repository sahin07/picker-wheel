import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WheelSettings {
  spinBehavior: {
    spinningSpeedLevel: number
    spinningDuration: number
    manuallyStop: boolean
    mysterySpin: boolean
    removeWinnerAfterSpin: boolean
    mysteryResult: boolean
  }
  display: {
    showSpinCount: boolean
    randomInitialAngle: boolean
    initialSpinning: boolean
    spinButtonAnimation: boolean
  }
  appearance: {
    toolColors: string[]
    backgroundColor: string
    backgroundImage?: string
    spinButtonStyle: string
    bannerLogo?: string
  }
  confettiSound: {
    enableConfetti: boolean
    enableSound: boolean
    soundVolume: number
  }
}

export const defaultSettings: WheelSettings = {
  spinBehavior: {
    spinningSpeedLevel: 10,
    spinningDuration: 10,
    manuallyStop: false,
    mysterySpin: false,
    removeWinnerAfterSpin: false,
    mysteryResult: false,
  },
  display: {
    showSpinCount: true,
    randomInitialAngle: true,
    initialSpinning: false,
    spinButtonAnimation: true,
  },
  appearance: {
    toolColors: ["#4ade80", "#fbbf24", "#f97316", "#84cc16", "#eab308", "#22c55e"],
    backgroundColor: "#a8b5a0",
    spinButtonStyle: "default",
  },
  confettiSound: {
    enableConfetti: true,
    enableSound: true,
    soundVolume: 0.5,
  },
}

interface SettingsStore {
  settings: WheelSettings
  updateSettings: (newSettings: Partial<WheelSettings>) => void
  resetSettings: () => void
  saveToDatabase: () => Promise<void>
  loadFromDatabase: () => Promise<void>
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
            spinBehavior: { ...state.settings.spinBehavior, ...newSettings.spinBehavior },
            display: { ...state.settings.display, ...newSettings.display },
            appearance: { ...state.settings.appearance, ...newSettings.appearance },
            confettiSound: { ...state.settings.confettiSound, ...newSettings.confettiSound },
          },
        }))
      },

      resetSettings: () => {
        set({ settings: defaultSettings })
      },

      saveToDatabase: async () => {
        try {
          const response = await fetch("/api/tools/picker-wheel/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolType: "picker-wheel",
              settings: get().settings,
              timestamp: new Date().toISOString(),
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to save settings")
          }

          console.log("Settings saved to database successfully")
        } catch (error) {
          console.error("Error saving settings to database:", error)
          throw error
        }
      },

      loadFromDatabase: async () => {
        try {
          const response = await fetch("/api/tools/picker-wheel/settings")
          if (response.ok) {
            const data = await response.json()
            if (data.settings) {
              const incoming = data.settings as Partial<WheelSettings>
              set((state) => ({
                settings: {
                  ...defaultSettings,
                  ...state.settings,
                  ...incoming,
                  spinBehavior: {
                    ...defaultSettings.spinBehavior,
                    ...state.settings.spinBehavior,
                    ...incoming.spinBehavior,
                  },
                  display: {
                    ...defaultSettings.display,
                    ...state.settings.display,
                    ...incoming.display,
                  },
                  appearance: {
                    ...defaultSettings.appearance,
                    ...state.settings.appearance,
                    ...incoming.appearance,
                  },
                  confettiSound: {
                    ...defaultSettings.confettiSound,
                    ...state.settings.confettiSound,
                    ...incoming.confettiSound,
                  },
                },
              }))
            }
          }
        } catch (error) {
          console.error("Error loading settings from database:", error)
        }
      },
    }),
    {
      name: "picker-wheel-settings",
      version: 4,
      migrate: (persistedState: unknown) => {
        const state = persistedState as { settings?: WheelSettings } | undefined
        if (!state?.settings?.spinBehavior) {
          return state as { settings: WheelSettings }
        }

        if (state.settings.spinBehavior.spinningDuration === 4) {
          state.settings.spinBehavior.spinningDuration = 10
        } else if (state.settings.spinBehavior.spinningDuration === 8) {
          state.settings.spinBehavior.spinningDuration = 10
        }

        if (state.settings.spinBehavior.spinningSpeedLevel < 10) {
          state.settings.spinBehavior.spinningSpeedLevel = 10
        }

        state.settings.spinBehavior.removeWinnerAfterSpin =
          state.settings.spinBehavior.removeWinnerAfterSpin ?? false
        state.settings.spinBehavior.mysteryResult =
          state.settings.spinBehavior.mysteryResult ?? false

        return state as { settings: WheelSettings }
      },
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
)
