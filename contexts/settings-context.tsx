"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { WheelSettings } from "@/types/settings"
import { defaultSettings } from "@/types/settings"

interface SettingsContextType {
  settings: WheelSettings
  updateSettings: (newSettings: Partial<WheelSettings>) => void
  saveToDatabase: () => Promise<void>
  loadFromDatabase: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<WheelSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("wheelSettings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Error loading settings from localStorage:", error)
      }
    }
  }, [])

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("wheelSettings", JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<WheelSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      spinBehavior: { ...prev.spinBehavior, ...newSettings.spinBehavior },
      display: { ...prev.display, ...newSettings.display },
      appearance: { ...prev.appearance, ...newSettings.appearance },
      confettiSound: { ...prev.confettiSound, ...newSettings.confettiSound },
    }))
  }

  const saveToDatabase = async () => {
    try {
      // This would be your API call to save to database
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      console.log("Settings saved to database successfully")
    } catch (error) {
      console.error("Error saving to database:", error)
      // For now, we'll just show an alert
      alert("Settings saved locally. Database save will be implemented with backend.")
    }
  }

  const loadFromDatabase = async () => {
    try {
      // This would be your API call to load from database
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...defaultSettings, ...data })
      }
    } catch (error) {
      console.error("Error loading from database:", error)
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, saveToDatabase, loadFromDatabase }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
