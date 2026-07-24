"use client"

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { PanelRightOpen } from "lucide-react"
import Header from "@/components/header"
import ToolBreadcrumbs from "@/components/tool-breadcrumbs"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToastProvider } from "@/contexts/toast-context"
import { analyzeSpinData, type SpinRecord } from "@/lib/picker-wheel-analytics"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { FORTUNE_WHEEL_SHORT_TITLE } from "@/lib/fortune-wheel-seo"
import type { FortuneWheelDeepLink } from "@/lib/fortune-wheel-spokes"
import {
  applyFortuneWheelUseCase, fortuneWheelUseCaseFromTemplate, getFortuneWheelUseCase, type FortuneWheelUseCaseId,
} from "@/lib/fortune-wheel-use-cases"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore, type FortuneWheelData } from "@/stores/wheel-manager-store"
import FortuneInputPanel from "./fortune-input-panel"
import FortuneWheelSection from "./fortune-wheel-section"
import { FortuneWheelPopularTemplates } from "./fortune-wheel-popular-templates"

const EMPTY_ENTRIES: any[] = []
const EMPTY_RESULTS: any[] = []
export type FortuneWheelAppProps = {
  seoIntro?: ReactNode; seoSections?: ReactNode; shortTitle?: string; toolSubtitle?: string; deepLink?: FortuneWheelDeepLink
}
function FortuneWheelAppInner({ seoIntro, seoSections, shortTitle, toolSubtitle, deepLink }: FortuneWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [actionMode, setActionMode] = useState<"normal" | "elimination" | "manual">("normal")
  const [themes] = useState(PICKER_WHEEL_THEMES)
  const [currentTheme, setCurrentTheme] = useState("classic")
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [activeUseCaseId, setActiveUseCaseId] = useState<FortuneWheelUseCaseId | null>(deepLink?.useCaseId ?? null)
  const searchParams = useSearchParams()
  const lastApplied = useRef<FortuneWheelUseCaseId | null>(null)
  const { settings, loadFromDatabase: loadSettings, updateSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore((state) => state.settings.spinBehavior?.removeWinnerAfterSpin)
  const { setCurrentTool, getCurrentWheel, createNewWheel, updateWheelData } = useWheelManagerStore()
  const viewMode = useWheelManagerStore((state) => {
    const wheel = state.wheelsByTool[state.currentTool]?.find((item) => item.id === state.currentWheelId)
    return ((wheel?.data as FortuneWheelData | undefined)?.viewMode || "wheel")
  })
  const entries = useWheelManagerStore((state) => {
    const wheel = state.wheelsByTool[state.currentTool]?.find((item) => item.id === state.currentWheelId)
    return (wheel?.data as FortuneWheelData | undefined)?.entries ?? EMPTY_ENTRIES
  })
  const recentResults = useWheelManagerStore((state) => {
    const wheel = state.wheelsByTool[state.currentTool]?.find((item) => item.id === state.currentWheelId)
    return (wheel?.data as FortuneWheelData | undefined)?.recentResults ?? EMPTY_RESULTS
  })
  const safeSpinHistory = useMemo(() => spinHistory.map((record) => {
    const parsed = record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp)
    return { ...record, timestamp: Number.isNaN(parsed.getTime()) ? new Date(0) : parsed }
  }), [spinHistory])
  const applyPreset = useCallback((id: FortuneWheelUseCaseId) => {
    if (!getFortuneWheelUseCase(id) || !applyFortuneWheelUseCase(id)) return
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
      setCurrentTool("fortune-wheel")
      let wheel = getCurrentWheel()
      if (!wheel) { createNewWheel("fortune-wheel", "My Fortune Wheel"); wheel = getCurrentWheel() }
      const preset = deepLink?.useCaseId || fortuneWheelUseCaseFromTemplate(searchParams.get("template"))
      if (preset) applyPreset(preset)
      const latest = getCurrentWheel()?.data as FortuneWheelData | undefined
      if (latest?.currentTheme) setCurrentTheme(latest.currentTheme)
      if (latest?.spinHistory) setSpinHistory(latest.spinHistory)
      if (latest?.actionMode) setActionMode(latest.actionMode)
    }
    initialize().catch((error) => console.error("Error initializing fortune wheel:", error))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const preset = deepLink?.useCaseId || fortuneWheelUseCaseFromTemplate(searchParams.get("template"))
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
    if (wheel) updateWheelData("fortune-wheel", wheel.id, { ...(wheel.data as FortuneWheelData), actionMode: mode })
    if (mode !== "manual") {
      const latest = useSettingsStore.getState().settings
      updateSettings({ spinBehavior: { ...latest.spinBehavior, removeWinnerAfterSpin: mode === "elimination" } } as any)
    }
  }, [getCurrentWheel, updateSettings, updateWheelData])
  const selectTheme = (themeId: string) => {
    setCurrentTheme(themeId)
    const wheel = getCurrentWheel()
    if (wheel) updateWheelData("fortune-wheel", wheel.id, { ...(wheel.data as FortuneWheelData), currentTheme: themeId })
  }
  const handleSpinCompleted = () => {
    const data = getCurrentWheel()?.data as FortuneWheelData | undefined
    if (data?.spinHistory) setSpinHistory(data.spinHistory)
  }
  return <ToastProvider><div className={`min-h-screen transition-colors ${isFullscreen ? "fixed inset-0 z-50 overflow-auto" : ""}`}
    style={{ backgroundColor: settings.appearance.backgroundColor || "#a8b5a0", backgroundImage: settings.appearance.backgroundImage ? `url(${settings.appearance.backgroundImage})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
    {!isFullscreen && <Header onOpenSettings={() => setShowSettings(true)} />}
    <main className="w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      {!isFullscreen && <><div className="mb-4 text-center"><ToolPageTitle title={shortTitle ?? FORTUNE_WHEEL_SHORT_TITLE} toolType="fortune-wheel" />
        <p className="text-gray-600">{toolSubtitle ?? "A dramatic equal-odds game-show spinner"}</p></div>
        <FortuneWheelPopularTemplates />
        {activeUseCaseId && getFortuneWheelUseCase(activeUseCaseId) && <div className="mb-4 flex justify-center sm:justify-start"><span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800">Template: {getFortuneWheelUseCase(activeUseCaseId)!.label}</span></div>}</>}
      <div id="fortune-spin-wheel" className="mb-6 grid min-w-0 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {viewMode === "wheel" ? <><div className={`relative min-w-0 overflow-x-hidden bg-white p-3 sm:p-6 ${isFullscreen || !showInputs ? "lg:col-span-3" : "rounded-lg border shadow-sm lg:col-span-2"}`}>
          {!isFullscreen && <Button variant="outline" size="sm" onClick={() => window.dispatchEvent(new Event("open-fortune-results"))}
            className="absolute left-2 top-2 z-10 border-violet-500 bg-white text-xs text-violet-800 shadow-sm sm:left-4 sm:top-4">Results {!!recentResults.length && <Badge variant="secondary" className="ml-2">{recentResults.length}</Badge>}</Button>}
          {!showInputs && <div className="mb-3 flex justify-end pt-8"><Button variant="outline" size="sm" onClick={() => setShowInputs(true)}><PanelRightOpen className="mr-1 h-4 w-4" /> Show controls</Button></div>}
          <div className={isFullscreen ? undefined : "pt-8"}><FortuneWheelSection currentTheme={currentTheme} onSpinCompleted={handleSpinCompleted}
            isFullscreen={isFullscreen} onToggleFullscreen={() => setIsFullscreen((value) => !value)}
            removeWinnerAfterSpin={actionMode === "elimination"} showResultsButton={false} actionMode={actionMode} /></div>
        </div>
        {showInputs && !isFullscreen && <div className="min-w-0 self-start"><FortuneInputPanel actionMode={actionMode} onActionModeChange={syncActionMode}
          onHideInputs={() => setShowInputs(false)} onOpenSettings={() => setShowSettings(true)}
          onToggleFullscreen={() => setIsFullscreen((value) => !value)} onOpenAnalytics={() => setShowAnalytics(true)}
          onThemeChange={selectTheme} currentTheme={currentTheme} themes={themes} /></div>}</>
        : <div className="min-w-0 lg:col-span-3"><FortuneInputPanel actionMode={actionMode} onActionModeChange={syncActionMode}
          onOpenSettings={() => setShowSettings(true)} onToggleFullscreen={() => setIsFullscreen((value) => !value)}
          onOpenAnalytics={() => setShowAnalytics(true)} onThemeChange={selectTheme} currentTheme={currentTheme} themes={themes} />
          {!entries.length && <p className="mt-3 text-center text-sm text-slate-500">Add wedges to build your wheel.</p>}</div>}
      </div>
      {!isFullscreen && (<><ToolBreadcrumbs />{seoIntro}</>)}{!isFullscreen && seoSections}
    </main>
    {!isFullscreen && <Footer />}
    <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    <PickerWheelAnalyticsDisplay analytics={{ ...(showAnalytics ? analyzeSpinData(safeSpinHistory) : analyzeSpinData([])),
      totalSpins: (getCurrentWheel()?.data as FortuneWheelData | undefined)?.totalSpins || 0 }}
      isVisible={showAnalytics} onClose={() => setShowAnalytics(false)} />
  </div></ToastProvider>
}
export default function FortuneWheelApp(props: FortuneWheelAppProps) {
  return <Suspense fallback={<div className="min-h-screen bg-[#a8b5a0]" />}><FortuneWheelAppInner {...props} /></Suspense>
}
