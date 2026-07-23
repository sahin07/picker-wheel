"use client"

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useSearchParams } from "next/navigation"
import { PanelRightOpen } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import PickerWheelAchievementsDisplay from "@/components/picker-wheel-achievements-display"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelGameModes from "@/components/picker-wheel-game-modes"
import PickerWheelGameStatus from "@/components/picker-wheel-game-status"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import PickerWheelThemeSelector from "@/components/picker-wheel-theme-selector"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToastProvider } from "@/contexts/toast-context"
import { useGameSession } from "@/hooks/use-game-session"
import {
  PICKER_WHEEL_ACHIEVEMENTS,
} from "@/lib/picker-wheel-achievements"
import { analyzeSpinData, type SpinRecord } from "@/lib/picker-wheel-analytics"
import type { GameMode } from "@/lib/picker-wheel-game-modes"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { WEIGHTED_WHEEL_SHORT_TITLE } from "@/lib/weighted-wheel-seo"
import type { WeightedWheelDeepLink } from "@/lib/weighted-wheel-spokes"
import {
  applyWeightedWheelUseCase,
  getWeightedWheelUseCase,
  weightedWheelUseCaseFromTemplate,
  type WeightedWheelUseCaseId,
} from "@/lib/weighted-wheel-use-cases"
import { useSettingsStore } from "@/stores/settings-store"
import {
  useWheelManagerStore,
  type WeightedWheelData,
} from "@/stores/wheel-manager-store"
import WeightedInputPanel from "./weighted-input-panel"
import WeightedWheelSection from "./weighted-wheel-section"
import { WeightedWheelPopularTemplates } from "./weighted-wheel-popular-templates"

const EMPTY_ENTRIES: any[] = []
const EMPTY_RESULTS: any[] = []

export interface WeightedWheelAppProps {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: WeightedWheelDeepLink
  variant?: "weighted" | "rigged"
}

function WeightedWheelAppInner({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: WeightedWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showThemes, setShowThemes] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocial, setShowSocial] = useState(false)
  const [showGames, setShowGames] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [actionMode, setActionMode] = useState<"normal" | "elimination" | "manual">("normal")
  const [achievements] = useState(PICKER_WHEEL_ACHIEVEMENTS)
  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES)
  const [currentTheme, setCurrentTheme] = useState("classic")
  const [totalPoints, setTotalPoints] = useState(0)
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [activeUseCaseId, setActiveUseCaseId] = useState<WeightedWheelUseCaseId | null>(
    deepLink?.useCaseId ?? null,
  )
  const searchParams = useSearchParams()
  const lastAppliedRef = useRef<WeightedWheelUseCaseId | null>(null)

  const { settings, loadFromDatabase: loadSettings, updateSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore(
    (state) => state.settings.spinBehavior?.removeWinnerAfterSpin,
  )
  const { setCurrentTool, getCurrentWheel, createNewWheel, updateWheelData } =
    useWheelManagerStore()
  const viewMode = useWheelManagerStore((state) => {
    const wheel = state.wheelsByTool[state.currentTool]?.find(
      (item) => item.id === state.currentWheelId,
    )
    return ((wheel?.data as WeightedWheelData | undefined)?.viewMode || "wheel")
  })
  const entries = useWheelManagerStore((state) => {
    const wheel = state.wheelsByTool[state.currentTool]?.find(
      (item) => item.id === state.currentWheelId,
    )
    return (wheel?.data as WeightedWheelData | undefined)?.entries ?? EMPTY_ENTRIES
  })
  const recentResults = useWheelManagerStore((state) => {
    const wheel = state.wheelsByTool[state.currentTool]?.find(
      (item) => item.id === state.currentWheelId,
    )
    return (wheel?.data as WeightedWheelData | undefined)?.recentResults ?? EMPTY_RESULTS
  })

  const {
    currentSession,
    isGameActive,
    startGame,
    endGame,
    restartGame,
    recordSpin,
    getGameScore,
    getGameStats,
  } = useGameSession()

  const applyPreset = useCallback((id: WeightedWheelUseCaseId) => {
    if (!getWeightedWheelUseCase(id) || !applyWeightedWheelUseCase(id)) return
    setActiveUseCaseId(id)
    lastAppliedRef.current = id
  }, [])

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadSettings()
        await new Promise<void>((resolve) => {
          const persist = useWheelManagerStore.persist
          if (persist?.hasHydrated?.()) return resolve()
          let done = false
          const finish = () => {
            if (done) return
            done = true
            unsubscribe?.()
            resolve()
          }
          const unsubscribe = persist?.onFinishHydration?.(finish)
          window.setTimeout(finish, 800)
        })
        setCurrentTool("weighted-wheel")
        let wheel = getCurrentWheel()
        if (!wheel) {
          createNewWheel("weighted-wheel", "My Weighted Wheel")
          wheel = getCurrentWheel()
        }
        const preset =
          deepLink?.useCaseId || weightedWheelUseCaseFromTemplate(searchParams.get("template"))
        if (preset) {
          applyPreset(preset)
        } else if (wheel?.toolType === "weighted-wheel") {
          const data = wheel.data as WeightedWheelData
          if (!data.entries?.length) applyPreset("custom")
        }
        const latest = getCurrentWheel()?.data as WeightedWheelData | undefined
        if (latest?.currentTheme) setCurrentTheme(latest.currentTheme)
        if (latest?.themes) setThemes(latest.themes)
        if (latest?.spinHistory) setSpinHistory(latest.spinHistory)
        if (latest?.actionMode) setActionMode(latest.actionMode)
      } catch (error) {
        console.error("Error initializing weighted wheel:", error)
      }
    }
    initialize()
    // Initialization intentionally runs once after persisted storage hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const preset =
      deepLink?.useCaseId || weightedWheelUseCaseFromTemplate(searchParams.get("template"))
    if (!preset || lastAppliedRef.current === preset) return
    const timer = window.setTimeout(() => applyPreset(preset), 0)
    return () => window.clearTimeout(timer)
  }, [applyPreset, deepLink?.useCaseId, searchParams])

  useEffect(() => {
    if (actionMode === "manual") return
    const next = removeWinnerAfterSpin ? "elimination" : "normal"
    if (actionMode !== next) setActionMode(next)
  }, [actionMode, removeWinnerAfterSpin])

  const syncActionMode = useCallback(
    (mode: "normal" | "elimination" | "manual") => {
      setActionMode(mode)
      const wheel = getCurrentWheel()
      if (wheel) {
        updateWheelData("weighted-wheel", wheel.id, {
          ...(wheel.data as WeightedWheelData),
          actionMode: mode,
        })
      }
      if (mode !== "manual") {
        const latest = useSettingsStore.getState().settings
        updateSettings({
          spinBehavior: {
            ...latest.spinBehavior,
            removeWinnerAfterSpin: mode === "elimination",
          },
        } as any)
      }
    },
    [getCurrentWheel, updateSettings, updateWheelData],
  )

  const handleSpinCompleted = () => {
    const data = getCurrentWheel()?.data as WeightedWheelData | undefined
    if (data?.spinHistory) setSpinHistory(data.spinHistory)
    if (isGameActive && currentSession && data?.selectedResult) {
      recordSpin(data.selectedResult.name)
    }
  }

  const resetSessionWheel = () => {
    const wheel = getCurrentWheel()
    if (!wheel) return
    updateWheelData("weighted-wheel", wheel.id, {
      ...(wheel.data as WeightedWheelData),
      totalSpins: 0,
      spinHistory: [],
      recentResults: [],
      selectedResult: null,
    })
    setSpinHistory([])
  }

  const selectTheme = (themeId: string) => {
    setCurrentTheme(themeId)
    const wheel = getCurrentWheel()
    if (wheel) {
      updateWheelData("weighted-wheel", wheel.id, {
        ...(wheel.data as WeightedWheelData),
        currentTheme: themeId,
      })
    }
  }

  return (
    <ToastProvider>
      <div
        className={`min-h-screen transition-colors ${isFullscreen ? "fixed inset-0 z-50 overflow-auto" : ""}`}
        style={{
          backgroundColor: settings.appearance.backgroundColor || "#a8b5a0",
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
            onOpenGames={() => setShowGames(true)}
          />
        )}
        <main className="w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          {!isFullscreen && (
            <>
              <div className="mb-4 text-center">
                <ToolPageTitle
                  title={shortTitle ?? WEIGHTED_WHEEL_SHORT_TITLE}
                  toolType="weighted-wheel"
                />
                <p className="text-gray-600">
                  {toolSubtitle ?? "Set custom probabilities and spin"}
                </p>
              </div>
              <WeightedWheelPopularTemplates />
              {activeUseCaseId && getWeightedWheelUseCase(activeUseCaseId) && (
                <div className="mb-4 flex justify-center sm:justify-start">
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800">
                    Template: {getWeightedWheelUseCase(activeUseCaseId)!.label}
                  </span>
                </div>
              )}
            </>
          )}

          {currentSession && (
            <PickerWheelGameStatus
              session={currentSession}
              onEndGame={() => {
                endGame()
                setTotalPoints((value) => value + getGameScore())
                getGameStats()
              }}
              onRestartGame={() => {
                resetSessionWheel()
                restartGame()
              }}
            />
          )}

          <div
            id="weighted-spin-wheel"
            className="mb-6 grid min-w-0 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-3 lg:gap-8"
          >
            {viewMode === "wheel" ? (
              <>
                <div
                  className={`relative min-w-0 overflow-x-hidden bg-white p-3 sm:p-6 ${
                    isFullscreen || !showInputs
                      ? "lg:col-span-3"
                      : "rounded-lg border shadow-sm lg:col-span-2"
                  }`}
                >
                  {!isFullscreen && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.dispatchEvent(new Event("open-weighted-results"))}
                      className="absolute left-2 top-2 z-10 border-violet-500 bg-white text-xs text-violet-700 shadow-sm sm:left-4 sm:top-4"
                    >
                      Results
                      {!!recentResults.length && (
                        <Badge variant="secondary" className="ml-2">{recentResults.length}</Badge>
                      )}
                    </Button>
                  )}
                  {!showInputs && (
                    <div className="mb-3 flex justify-end pt-8">
                      <Button variant="outline" size="sm" onClick={() => setShowInputs(true)}>
                        <PanelRightOpen className="mr-1 h-4 w-4" /> Show controls
                      </Button>
                    </div>
                  )}
                  <div className={isFullscreen ? undefined : "pt-8"}>
                    <WeightedWheelSection
                      onOpenAchievements={() => setShowAchievements(true)}
                      onOpenThemeSelector={() => setShowThemes(true)}
                      onOpenAnalytics={() => setShowAnalytics(true)}
                      onOpenSocialHub={() => setShowSocial(true)}
                      onOpenGameModes={() => setShowGames(true)}
                      totalPoints={totalPoints}
                      currentTheme={currentTheme}
                      themes={themes}
                      spinHistory={spinHistory}
                      isGameActive={isGameActive}
                      currentGameMode={currentSession?.gameMode.name}
                      onSpinCompleted={handleSpinCompleted}
                      isFullscreen={isFullscreen}
                      onToggleFullscreen={() => setIsFullscreen((value) => !value)}
                      removeWinnerAfterSpin={!!removeWinnerAfterSpin}
                      showResultsButton={false}
                    />
                  </div>
                </div>
                {showInputs && !isFullscreen && (
                  <div className="min-w-0 self-start">
                    <WeightedInputPanel
                      actionMode={actionMode}
                      onActionModeChange={syncActionMode}
                      onHideInputs={() => setShowInputs(false)}
                      onOpenSettings={() => setShowSettings(true)}
                      onToggleFullscreen={() => setIsFullscreen((value) => !value)}
                      onOpenAnalytics={() => setShowAnalytics(true)}
                      onOpenAchievements={() => setShowAchievements(true)}
                      onThemeChange={selectTheme}
                      currentTheme={currentTheme}
                      themes={themes}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="min-w-0 lg:col-span-3">
                <WeightedInputPanel
                  actionMode={actionMode}
                  onActionModeChange={syncActionMode}
                  onOpenSettings={() => setShowSettings(true)}
                  onToggleFullscreen={() => setIsFullscreen((value) => !value)}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  onThemeChange={selectTheme}
                  currentTheme={currentTheme}
                  themes={themes}
                />
                {!entries.length && (
                  <p className="mt-3 text-center text-sm text-slate-500">Add entries to build your wheel.</p>
                )}
              </div>
            )}
          </div>

          {!isFullscreen && seoIntro}
          {!isFullscreen && seoSections}
        </main>
        {!isFullscreen && <Footer />}

        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        <PickerWheelAchievementsDisplay
          achievements={achievements}
          totalPoints={totalPoints}
          isVisible={showAchievements}
          onClose={() => setShowAchievements(false)}
        />
        <PickerWheelThemeSelector
          themes={themes}
          currentTheme={currentTheme}
          onThemeSelect={selectTheme}
          isVisible={showThemes}
          onClose={() => setShowThemes(false)}
        />
        <PickerWheelAnalyticsDisplay
          analytics={{
            ...(showAnalytics
              ? analyzeSpinData(spinHistory)
              : analyzeSpinData([])),
            totalSpins:
              (getCurrentWheel()?.data as WeightedWheelData | undefined)?.totalSpins || 0,
          }}
          isVisible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
        <PickerWheelSocialHub
          isVisible={showSocial}
          onClose={() => setShowSocial(false)}
          onShareWheel={() => {}}
        />
        <PickerWheelGameModes
          isVisible={showGames}
          onClose={() => setShowGames(false)}
          userPoints={totalPoints}
          onStartGame={(mode: GameMode) => {
            resetSessionWheel()
            startGame(mode)
            setShowGames(false)
          }}
        />
      </div>
    </ToastProvider>
  )
}

export default function WeightedWheelApp(props: WeightedWheelAppProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#a8b5a0]" />}>
      <WeightedWheelAppInner {...props} />
    </Suspense>
  )
}
