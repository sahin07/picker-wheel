"use client"

import { useEffect, useState, type ReactNode } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ToolBreadcrumbs from "@/components/tool-breadcrumbs"
import SettingsPanel from "@/components/settings-panel"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { FINGER_PICKER_SHORT_TITLE } from "@/lib/finger-picker-seo"
import type { FingerPickerDeepLink } from "@/lib/finger-picker-spokes"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { FingerPickerTool } from "./finger-picker-tool"

type Props = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  deepLink?: FingerPickerDeepLink
  shortTitle?: string
  toolSubtitle?: string
  showFooter?: boolean
}

export default function FingerPickerApp({
  seoIntro,
  seoSections,
  deepLink,
  shortTitle,
  toolSubtitle,
  showFooter = true,
}: Props) {
  const [showSettings, setShowSettings] = useState(false)
  const [openGamesSignal, setOpenGamesSignal] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()
  const { setCurrentTool, getCurrentWheel, createNewWheel } = useWheelManagerStore()

  useEffect(() => {
    void loadSettings()
    setCurrentTool("finger-picker")
    if (!getCurrentWheel() || getCurrentWheel()?.toolType !== "finger-picker") {
      const wheels = useWheelManagerStore.getState().wheelsByTool["finger-picker"] || []
      if (wheels.length === 0) createNewWheel("finger-picker", shortTitle ?? "Finger Picker")
      else useWheelManagerStore.getState().setCurrentWheel(wheels[0].id)
    }
  }, [createNewWheel, getCurrentWheel, loadSettings, setCurrentTool, shortTitle])

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onFs)
    return () => document.removeEventListener("fullscreenchange", onFs)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen().catch(() => {})
  }

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
          {!isFullscreen && (
            <Header
              onOpenSettings={() => setShowSettings(true)}
              onOpenGames={() => setOpenGamesSignal((n) => n + 1)}
            />
          )}
          <main className="w-full px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
            {!isFullscreen && (
              <div className="mb-4 text-center">
                <ToolPageTitle title={shortTitle ?? FINGER_PICKER_SHORT_TITLE} toolType="finger-picker" />
                <p className="text-gray-600">
                  {toolSubtitle ?? "Everyone puts a finger on the screen — one is chosen at random"}
                </p>
              </div>
            )}
            <FingerPickerTool
              openGamesSignal={openGamesSignal}
              onOpenSettings={() => setShowSettings(true)}
              deepLink={deepLink}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
            {!isFullscreen && <ToolBreadcrumbs />}
            {!isFullscreen && seoIntro}
            {!isFullscreen && seoSections}
          </main>
          {showFooter && !isFullscreen && <Footer />}
          <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
      </ToastProvider>
    </SettingsProvider>
  )
}
