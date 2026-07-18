"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { YesNoPickerWheel } from "@/components/yes-no-picker-wheel"
import SettingsPanel from "@/components/settings-panel"
import { useSettingsStore } from "@/stores/settings-store"
import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { ToolPageTitle } from "@/components/tool-favorite-star"

export default function YesNoPickerWheelPage() {
  const [showSettings, setShowSettings] = useState(false)
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()

  useEffect(() => {
    // Load settings on mount
    loadSettings()
  }, [loadSettings])

  return (
    <SettingsProvider>
      <ToastProvider>
        <div
          className="min-h-screen transition-colors duration-300"
          style={{
            backgroundColor: settings.appearance.backgroundColor,
            backgroundImage: settings.appearance.backgroundImage
              ? `url(${settings.appearance.backgroundImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {settings.appearance.bannerLogo && (
            <div className="text-center py-4">
              <img
                src={settings.appearance.bannerLogo || "/placeholder.svg"}
                alt="Banner Logo"
                className="h-16 mx-auto object-contain"
              />
            </div>
          )}

          <Header onOpenSettings={() => setShowSettings(true)} />

          <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <ToolPageTitle title="Yes or No Picker Wheel" toolType="yes-no-picker-wheel" />
              <p className="text-gray-600">Make decisions with AI assistance or manual input</p>
            </div>

            <div>
              <YesNoPickerWheel />
            </div>
          </main>

          <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
      </ToastProvider>
    </SettingsProvider>
  )
} 