"use client"

import { Suspense, useState, useEffect, type ReactNode } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { YesNoPickerWheel } from "@/components/yes-no-picker-wheel"
import SettingsPanel from "@/components/settings-panel"
import { useSettingsStore } from "@/stores/settings-store"
import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { YES_NO_PICKER_SHORT_TITLE } from "@/lib/yes-no-picker-seo"
import type { YesNoPickerDeepLink } from "@/lib/yes-no-picker-spokes"

type YesNoPickerWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  deepLink?: YesNoPickerDeepLink
  shortTitle?: string
  toolSubtitle?: string
}

export default function YesNoPickerWheelApp({
  seoIntro,
  seoSections,
  deepLink,
  shortTitle,
  toolSubtitle,
}: YesNoPickerWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [openGamesSignal, setOpenGamesSignal] = useState(0)
  const [openAchievementsSignal, setOpenAchievementsSignal] = useState(0)
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()
  const { setCurrentTool, getCurrentWheel, createNewWheel } = useWheelManagerStore()

  useEffect(() => {
    loadSettings()
    setCurrentTool("yes-no-picker-wheel")
    if (typeof window !== "undefined") {
      const wheel = getCurrentWheel()
      if (!wheel) {
        createNewWheel("yes-no-picker-wheel", shortTitle ?? "Yes or No Wheel")
      }
    }
  }, [loadSettings, setCurrentTool, getCurrentWheel, createNewWheel, shortTitle])

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
            <div className="py-4 text-center">
              <img
                src={settings.appearance.bannerLogo || "/placeholder.svg"}
                alt="Yes or No Wheel for random decisions"
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
              <ToolPageTitle
                title={shortTitle ?? YES_NO_PICKER_SHORT_TITLE}
                toolType="yes-no-picker-wheel"
              />
              <p className="text-gray-600">
                {toolSubtitle ?? "Spin the Yes or No Wheel to make a quick, fair decision"}
              </p>
            </div>

            <Suspense
              fallback={<div className="min-h-[480px] animate-pulse rounded-lg bg-slate-100" />}
            >
              <YesNoPickerWheel
                openGamesSignal={openGamesSignal}
                openAchievementsSignal={openAchievementsSignal}
                onOpenSettings={() => setShowSettings(true)}
                deepLink={deepLink}
              />
            </Suspense>

            {seoIntro}
            {seoSections}
          </main>

          <Footer />

          <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
      </ToastProvider>
    </SettingsProvider>
  )
}
