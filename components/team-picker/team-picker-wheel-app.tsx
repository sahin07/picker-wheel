"use client"

import { useState, useEffect, useCallback, useRef, type ReactNode, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import GeminiAIChat from "@/components/gemini-ai-chat"
import { Badge } from "@/components/ui/badge"
import { useSettingsStore } from "@/stores/settings-store"
import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useTeamPickerStore } from "@/stores/team-picker-store"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { TeamPickerTool } from "@/components/team-picker/team-picker-tool"
import { TeamPickerPopularTemplates } from "@/components/team-picker/team-picker-popular-templates"
import { TEAM_PICKER_SHORT_TITLE } from "@/lib/team-picker-seo"
import type { TeamPickerDeepLink } from "@/lib/team-picker-spokes"
import {
  applyTeamPickerUseCase,
  getTeamPickerUseCase,
  teamPickerUseCaseFromTemplate,
  type TeamPickerUseCaseId,
} from "@/lib/team-picker-use-cases"

type TeamPickerWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  /** Spoke pages: apply matching team settings after My Wheels hydrate */
  deepLink?: TeamPickerDeepLink
}

function TeamPickerWheelAppInner({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: TeamPickerWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [openGamesSignal, setOpenGamesSignal] = useState(0)
  const [activeUseCaseId, setActiveUseCaseId] = useState<TeamPickerUseCaseId | null>(
    deepLink?.useCaseId ?? null,
  )
  const deepLinkAppliedRef = useRef(false)
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()
  const { setCurrentTool, getCurrentWheel, createNewWheel } = useWheelManagerStore()
  const searchParams = useSearchParams()

  useEffect(() => {
    loadSettings()
    setCurrentTool("team-picker")
    if (typeof window !== "undefined") {
      const wheel = getCurrentWheel()
      if (!wheel) {
        createNewWheel("team-picker", shortTitle ?? "Team Picker Wheel")
      }
    }
  }, [loadSettings, setCurrentTool, getCurrentWheel, createNewWheel, shortTitle])

  const applyUseCasePreset = useCallback((id: TeamPickerUseCaseId) => {
    if (!applyTeamPickerUseCase(id)) return
    setActiveUseCaseId(id)
  }, [])

  // Spoke deepLink + pillar ?template= / ?groups= after My Wheels hydrate
  useEffect(() => {
    const onHydrated = () => {
      if (deepLinkAppliedRef.current) return

      const applyId = (id: TeamPickerUseCaseId) => {
        const { participants, teams } = useTeamPickerStore.getState()
        if (participants.length > 0 || teams.length > 0) {
          setActiveUseCaseId(id)
          deepLinkAppliedRef.current = true
          return
        }
        applyUseCasePreset(id)
        deepLinkAppliedRef.current = true
      }

      if (deepLink) {
        applyId(deepLink.useCaseId)
        return
      }

      const groupsRaw = searchParams.get("groups")
      const template = searchParams.get("template")
      if (!template && !groupsRaw) return

      const groups = groupsRaw ? Number.parseInt(groupsRaw, 10) : NaN
      const id = teamPickerUseCaseFromTemplate(
        template,
        Number.isFinite(groups) ? groups : null,
      )
      if (!id) return
      applyId(id)
    }
    window.addEventListener("team-picker-hydrated", onHydrated)
    return () => window.removeEventListener("team-picker-hydrated", onHydrated)
  }, [deepLink, searchParams, applyUseCasePreset])

  return (
    <div
      className="min-h-screen overflow-x-hidden transition-colors duration-300"
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
            alt="Team Picker Wheel banner"
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
            title={shortTitle ?? TEAM_PICKER_SHORT_TITLE}
            toolType="team-picker"
          />
          <p className="text-gray-600">
            {toolSubtitle ??
              "Split names into random teams — balance by size, gender, or label"}
          </p>
        </div>

        <TeamPickerPopularTemplates />

        {activeUseCaseId && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <Badge className="bg-slate-800 text-white hover:bg-slate-800">
              Template: {getTeamPickerUseCase(activeUseCaseId)?.label}
            </Badge>
            <Badge variant="secondary">
              {getTeamPickerUseCase(activeUseCaseId)?.config.groups} groups ready
            </Badge>
          </div>
        )}

        <TeamPickerTool
          onOpenSettings={() => setShowSettings(true)}
          openGamesSignal={openGamesSignal}
        />

        {seoIntro}
        {seoSections}
      </main>

      <Footer />

      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <GeminiAIChat hideFloatingButton />
    </div>
  )
}

export default function TeamPickerWheelApp(props: TeamPickerWheelAppProps) {
  return (
    <SettingsProvider>
      <ToastProvider>
        <Suspense
          fallback={<div className="min-h-screen animate-pulse bg-slate-50" />}
        >
          <TeamPickerWheelAppInner {...props} />
        </Suspense>
      </ToastProvider>
    </SettingsProvider>
  )
}
