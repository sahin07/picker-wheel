"use client"

import { Suspense, useState, useEffect, type ReactNode } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { NumberPickerWheel } from "@/components/number-picker-wheel"
import SettingsPanel from "@/components/settings-panel"
import { useSettingsStore } from "@/stores/settings-store"
import { ToastProvider } from "@/contexts/toast-context"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { NUMBER_PICKER_SHORT_TITLE } from "@/lib/number-picker-seo"

type NumberPickerWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
}

export default function NumberPickerWheelApp({
  seoIntro,
  seoSections,
}: NumberPickerWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [openGamesSignal, setOpenGamesSignal] = useState(0)
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()
  const { setCurrentTool, getCurrentWheel, createNewWheel } = useWheelManagerStore()

  useEffect(() => {
    loadSettings()

    setCurrentTool("number-picker-wheel")
    if (typeof window !== "undefined") {
      const wheel = getCurrentWheel()
      if (!wheel) {
        createNewWheel("number-picker-wheel", "My Number Picker Wheel")
      }
    }
  }, [loadSettings, setCurrentTool, getCurrentWheel, createNewWheel])

  return (
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
          <div className="py-4 text-center">
            <img
              src={settings.appearance.bannerLogo || "/placeholder.svg"}
              alt="Random Number Picker Wheel with customizable number range"
              className="mx-auto h-16 object-contain"
            />
          </div>
        )}

        <Header
          onOpenSettings={() => setShowSettings(true)}
          onOpenGames={() => setOpenGamesSignal((n) => n + 1)}
        />

        <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 text-center">
            <ToolPageTitle title={NUMBER_PICKER_SHORT_TITLE} toolType="number-picker-wheel" />
            <p className="text-gray-600">
              Spin the Random Number Picker Wheel to select a number
            </p>
          </div>

          <Suspense fallback={<div className="min-h-[480px] animate-pulse rounded-lg bg-slate-100" />}>
            <NumberPickerWheel openGamesSignal={openGamesSignal} />
          </Suspense>

          {seoIntro}
          {seoSections}
        </main>

        <Footer />

        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </div>
    </ToastProvider>
  )
}
