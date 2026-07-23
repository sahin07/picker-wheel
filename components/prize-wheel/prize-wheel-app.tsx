"use client"

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { PanelRightOpen } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToastProvider } from "@/contexts/toast-context"
import { analyzeSpinData, type SpinRecord } from "@/lib/picker-wheel-analytics"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { PRIZE_WHEEL_SHORT_TITLE } from "@/lib/prize-wheel-seo"
import type { PrizeWheelDeepLink } from "@/lib/prize-wheel-spokes"
import {
  applyPrizeWheelUseCase, getPrizeWheelUseCase, prizeWheelUseCaseFromTemplate,
  type PrizeWheelUseCaseId,
} from "@/lib/prize-wheel-use-cases"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore, type PrizeWheelData } from "@/stores/wheel-manager-store"
import PrizeInputPanel from "./prize-input-panel"
import PrizeWheelSection from "./prize-wheel-section"
import { PrizeWheelPopularTemplates } from "./prize-wheel-popular-templates"

const EMPTY_ENTRIES: any[] = []
const EMPTY_RESULTS: any[] = []
export type PrizeWheelAppProps = {
  seoIntro?: ReactNode; seoSections?: ReactNode; shortTitle?: string
  toolSubtitle?: string; deepLink?: PrizeWheelDeepLink
}

function PrizeWheelAppInner({ seoIntro, seoSections, shortTitle, toolSubtitle, deepLink }: PrizeWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [actionMode, setActionMode] = useState<"normal" | "elimination" | "manual">("normal")
  const [themes] = useState(PICKER_WHEEL_THEMES)
  const [currentTheme, setCurrentTheme] = useState("classic")
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [activeUseCaseId, setActiveUseCaseId] = useState<PrizeWheelUseCaseId | null>(deepLink?.useCaseId ?? null)
  const searchParams = useSearchParams()
  const lastApplied = useRef<PrizeWheelUseCaseId | null>(null)
  const { settings, loadFromDatabase: loadSettings, updateSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore((state) => state.settings.spinBehavior?.removeWinnerAfterSpin)
  const { setCurrentTool, getCurrentWheel, createNewWheel, updateWheelData } = useWheelManagerStore()
  const viewMode = useWheelManagerStore((state) => {
    const wheel = state.wheelsByTool[state.currentTool]?.find((item) => item.id === state.currentWheelId)
    return ((wheel?.data as PrizeWheelData | undefined)?.viewMode || "wheel")
  })
  const entries = useWheelManagerStore((state) => {
    const wheel = state.wheelsByTool[state.currentTool]?.find((item) => item.id === state.currentWheelId)
    return (wheel?.data as PrizeWheelData | undefined)?.entries ?? EMPTY_ENTRIES
  })
  const recentResults = useWheelManagerStore((state) => {
    const wheel = state.wheelsByTool[state.currentTool]?.find((item) => item.id === state.currentWheelId)
    return (wheel?.data as PrizeWheelData | undefined)?.recentResults ?? EMPTY_RESULTS
  })
  const safeSpinHistory = useMemo(() => spinHistory.map((record) => ({
    ...record, timestamp: record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp),
  })), [spinHistory])

  const applyPreset = useCallback((id: PrizeWheelUseCaseId) => {
    if (!getPrizeWheelUseCase(id) || !applyPrizeWheelUseCase(id)) return
    setActiveUseCaseId(id); lastApplied.current = id
  }, [])
  useEffect(() => {
    const initialize = async () => {
      await loadSettings()
      await new Promise<void>((resolve) => {
        const persist = useWheelManagerStore.persist
        if (persist?.hasHydrated?.()) return resolve()
        let done = false
        const finish = () => { if (!done) { done = true; unsubscribe?.(); resolve() } }
        const unsubscribe = persist?.onFinishHydration?.(finish)
        window.setTimeout(finish, 800)
      })
      setCurrentTool("prize-wheel")
      let wheel = getCurrentWheel()
      if (!wheel) { createNewWheel("prize-wheel", "My Prize Wheel"); wheel = getCurrentWheel() }
      const preset = deepLink?.useCaseId || prizeWheelUseCaseFromTemplate(searchParams.get("template"))
      if (preset) applyPreset(preset)
      else if (wheel?.toolType === "prize-wheel" && !(wheel.data as PrizeWheelData).entries?.length) applyPreset("custom")
      const latest = getCurrentWheel()?.data as PrizeWheelData | undefined
      if (latest?.currentTheme) setCurrentTheme(latest.currentTheme)
      if (latest?.spinHistory) setSpinHistory(latest.spinHistory)
      if (latest?.actionMode) setActionMode(latest.actionMode)
    }
    initialize().catch((error) => console.error("Error initializing prize wheel:", error))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const preset = deepLink?.useCaseId || prizeWheelUseCaseFromTemplate(searchParams.get("template"))
    if (!preset || lastApplied.current === preset) return
    const timer = window.setTimeout(() => applyPreset(preset), 0)
    return () => window.clearTimeout(timer)
  }, [applyPreset, deepLink?.useCaseId, searchParams])
  useEffect(() => {
    if (actionMode === "manual") return
    const next = removeWinnerAfterSpin ? "elimination" : "normal"
    if (actionMode !== next) setActionMode(next)
  }, [actionMode, removeWinnerAfterSpin])

  const syncActionMode = useCallback((mode: "normal" | "elimination" | "manual") => {
    setActionMode(mode)
    const wheel = getCurrentWheel()
    if (wheel) updateWheelData("prize-wheel", wheel.id, { ...(wheel.data as PrizeWheelData), actionMode: mode })
    if (mode !== "manual") {
      const latest = useSettingsStore.getState().settings
      updateSettings({ spinBehavior: { ...latest.spinBehavior, removeWinnerAfterSpin: mode === "elimination" } } as any)
    }
  }, [getCurrentWheel, updateSettings, updateWheelData])
  const selectTheme = (themeId: string) => {
    setCurrentTheme(themeId)
    const wheel = getCurrentWheel()
    if (wheel) updateWheelData("prize-wheel", wheel.id, { ...(wheel.data as PrizeWheelData), currentTheme: themeId })
  }
  const handleSpinCompleted = () => {
    const data = getCurrentWheel()?.data as PrizeWheelData | undefined
    if (data?.spinHistory) setSpinHistory(data.spinHistory)
  }

  return <ToastProvider><div className={`min-h-screen transition-colors ${isFullscreen ? "fixed inset-0 z-50 overflow-auto" : ""}`}
    style={{ backgroundColor: settings.appearance.backgroundColor || "#a8b5a0",
      backgroundImage: settings.appearance.backgroundImage ? `url(${settings.appearance.backgroundImage})` : undefined,
      backgroundSize: "cover", backgroundPosition: "center" }}>
    {!isFullscreen && <Header onOpenSettings={() => setShowSettings(true)} />}
    <main className="w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      {!isFullscreen && <><div className="mb-4 text-center">
        <ToolPageTitle title={shortTitle ?? PRIZE_WHEEL_SHORT_TITLE} toolType="prize-wheel" />
        <p className="text-gray-600">{toolSubtitle ?? "Create an equal-odds prize experience"}</p>
      </div>
      <PrizeWheelPopularTemplates />
      {activeUseCaseId && getPrizeWheelUseCase(activeUseCaseId) && <div className="mb-4 flex justify-center sm:justify-start">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
          Template: {getPrizeWheelUseCase(activeUseCaseId)!.label}</span></div>}</>}
      <div id="prize-spin-wheel" className="mb-6 grid min-w-0 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {viewMode === "wheel" ? <>
          <div className={`relative min-w-0 overflow-x-hidden bg-white p-3 sm:p-6 ${isFullscreen || !showInputs ? "lg:col-span-3" : "rounded-lg border shadow-sm lg:col-span-2"}`}>
            {!isFullscreen && <Button type="button" variant="outline" size="sm"
              onClick={() => window.dispatchEvent(new Event("open-prize-results"))}
              className="absolute left-2 top-2 z-10 border-amber-500 bg-white text-xs text-amber-800 shadow-sm sm:left-4 sm:top-4">
              Results {!!recentResults.length && <Badge variant="secondary" className="ml-2">{recentResults.length}</Badge>}</Button>}
            {!showInputs && <div className="mb-3 flex justify-end pt-8"><Button variant="outline" size="sm" onClick={() => setShowInputs(true)}>
              <PanelRightOpen className="mr-1 h-4 w-4" /> Show controls</Button></div>}
            <div className={isFullscreen ? undefined : "pt-8"}><PrizeWheelSection currentTheme={currentTheme}
              onSpinCompleted={handleSpinCompleted} isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen((value) => !value)}
              removeWinnerAfterSpin={actionMode === "elimination"} showResultsButton={false} /></div>
          </div>
          {showInputs && !isFullscreen && <div className="min-w-0 self-start"><PrizeInputPanel actionMode={actionMode}
            onActionModeChange={syncActionMode} onHideInputs={() => setShowInputs(false)}
            onOpenSettings={() => setShowSettings(true)} onToggleFullscreen={() => setIsFullscreen((value) => !value)}
            onOpenAnalytics={() => setShowAnalytics(true)} onThemeChange={selectTheme}
            currentTheme={currentTheme} themes={themes} /></div>}
        </> : <div className="min-w-0 lg:col-span-3"><PrizeInputPanel actionMode={actionMode}
          onActionModeChange={syncActionMode} onOpenSettings={() => setShowSettings(true)}
          onToggleFullscreen={() => setIsFullscreen((value) => !value)} onOpenAnalytics={() => setShowAnalytics(true)}
          onThemeChange={selectTheme} currentTheme={currentTheme} themes={themes} />
          {!entries.length && <p className="mt-3 text-center text-sm text-slate-500">Add prizes to build your wheel.</p>}</div>}
      </div>
      {!isFullscreen && seoIntro}{!isFullscreen && seoSections}
    </main>
    {!isFullscreen && <Footer />}
    <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    <PickerWheelAnalyticsDisplay analytics={{ ...(showAnalytics ? analyzeSpinData(safeSpinHistory) : analyzeSpinData([])),
      totalSpins: (getCurrentWheel()?.data as PrizeWheelData | undefined)?.totalSpins || 0 }}
      isVisible={showAnalytics} onClose={() => setShowAnalytics(false)} />
  </div></ToastProvider>
}

export default function PrizeWheelApp(props: PrizeWheelAppProps) {
  return <Suspense fallback={<div className="min-h-screen bg-[#a8b5a0]" />}><PrizeWheelAppInner {...props} /></Suspense>
}
