"use client"

import { Suspense, useState, useEffect, useCallback, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import ToolBreadcrumbs from "@/components/tool-breadcrumbs"
import Footer from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { ColorPickerWheel } from "@/components/color-picker-wheel"
import { ColorPickerUseCases } from "@/components/color-picker-wheel/color-picker-use-cases"
import SettingsPanel from "@/components/settings-panel"
import { useSettingsStore } from "@/stores/settings-store"
import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import {
  COLOR_PICKER_SHORT_TITLE,
  parseColorPickerSeoCombo,
  parseColorPickerSeoTab,
} from "@/lib/color-picker-seo"
import type { ColorPickerDeepLink } from "@/lib/color-picker-spokes"
import {
  getColorPickerUseCase,
  getColorPickerUseCaseByPalette,
  type ColorPickerUseCaseId,
} from "@/lib/color-picker-use-cases"
import type { ColorPickerModeTab } from "@/components/color-picker-wheel/color-picker-sidebar"

type ColorPickerWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  deepLink?: ColorPickerDeepLink
  shortTitle?: string
  toolSubtitle?: string
}

function ColorPickerWheelAppInner({
  seoIntro,
  seoSections,
  deepLink,
  shortTitle,
  toolSubtitle,
}: ColorPickerWheelAppProps) {
  const searchParams = useSearchParams()
  const [showSettings, setShowSettings] = useState(false)
  const [openGamesSignal, setOpenGamesSignal] = useState(0)
  const [openAchievementsSignal, setOpenAchievementsSignal] = useState(0)
  const [activeUseCaseId, setActiveUseCaseId] = useState<ColorPickerUseCaseId | null>(null)
  const [appliedDeepLink, setAppliedDeepLink] = useState<ColorPickerDeepLink | undefined>(deepLink)
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()

  const queryTab = parseColorPickerSeoTab(searchParams.get("tab"))
  const queryCombo = parseColorPickerSeoCombo(searchParams.get("combo"))

  const resolvedDeepLink: ColorPickerDeepLink = {
    ...appliedDeepLink,
    tab: appliedDeepLink?.tab ?? queryTab ?? undefined,
    combination: appliedDeepLink?.combination ?? queryCombo ?? undefined,
  }

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // Sync strip highlight from spoke / URL deep link
  useEffect(() => {
    setAppliedDeepLink(deepLink)
    const fromPalette = getColorPickerUseCaseByPalette(deepLink?.palette)
    setActiveUseCaseId(fromPalette?.id ?? null)
  }, [deepLink])

  const applyUseCasePreset = useCallback((id: ColorPickerUseCaseId) => {
    const useCase = getColorPickerUseCase(id)
    if (!useCase) return
    setActiveUseCaseId(id)
    setAppliedDeepLink({ ...useCase.config })
  }, [])

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
                alt="Color Picker Wheel banner"
                className="mx-auto h-16 object-contain"
              />
            </div>
          )}

          <Header
            onOpenSettings={() => setShowSettings(true)}
            onOpenGames={() => setOpenGamesSignal((n) => n + 1)}
          />

          <main className="w-full px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-4 text-center">
              <ToolPageTitle
                title={shortTitle ?? COLOR_PICKER_SHORT_TITLE}
                toolType="color-picker-wheel"
              />
              <p className="text-gray-600">
                {toolSubtitle ?? "Pick a random color by wheel"}
              </p>
            </div>

            <ColorPickerUseCases
              activeId={activeUseCaseId}
              onSelectPreset={applyUseCasePreset}
            />

            {activeUseCaseId && (
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className="bg-slate-800 text-white hover:bg-slate-800">
                  Palette: {getColorPickerUseCase(activeUseCaseId)?.label}
                </Badge>
                <Badge variant="secondary">Manual list loaded</Badge>
              </div>
            )}

            <ColorPickerWheel
              onOpenSettings={() => setShowSettings(true)}
              openGamesSignal={openGamesSignal}
              openAchievementsSignal={openAchievementsSignal}
              initialTab={resolvedDeepLink.tab as ColorPickerModeTab | undefined}
              initialCombination={resolvedDeepLink.combination}
              deepLink={resolvedDeepLink}
            />

            <ToolBreadcrumbs />
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

export default function ColorPickerWheelApp(props: ColorPickerWheelAppProps) {
  return (
    <Suspense
      fallback={<div className="min-h-[480px] animate-pulse rounded-lg bg-slate-100" />}
    >
      <ColorPickerWheelAppInner {...props} />
    </Suspense>
  )
}
