"use client"

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { PanelRightOpen } from "lucide-react"
import Header from "@/components/header"
import ToolBreadcrumbs from "@/components/tool-breadcrumbs"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import PickerWheelAchievementsDisplay from "@/components/picker-wheel-achievements-display"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelGameModes from "@/components/picker-wheel-game-modes"
import PickerWheelGameStatus from "@/components/picker-wheel-game-status"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import PickerWheelThemeSelector from "@/components/picker-wheel-theme-selector"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToastProvider } from "@/contexts/toast-context"
import { useGameSession } from "@/hooks/use-game-session"
import {
  PICKER_WHEEL_ACHIEVEMENTS,
  checkAchievementUnlocks,
} from "@/lib/picker-wheel-achievements"
import { analyzeSpinData, type SpinRecord } from "@/lib/picker-wheel-analytics"
import { type GameMode } from "@/lib/picker-wheel-game-modes"
import { type SocialProfile } from "@/lib/picker-wheel-social"
import {
  PICKER_WHEEL_THEMES,
  checkThemeUnlocks,
} from "@/lib/picker-wheel-themes"
import { FORTUNE_WHEEL_SHORT_TITLE } from "@/lib/fortune-wheel-seo"
import type { FortuneWheelDeepLink } from "@/lib/fortune-wheel-spokes"
import {
  applyFortuneWheelUseCase,
  fortuneWheelUseCaseFromTemplate,
  getFortuneWheelUseCase,
  type FortuneWheelUseCaseId,
} from "@/lib/fortune-wheel-use-cases"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore, type FortuneWheelData } from "@/stores/wheel-manager-store"
import FortuneInputPanel from "./fortune-input-panel"
import FortuneWheelSection from "./fortune-wheel-section"
import { FortuneWheelPopularTemplates } from "./fortune-wheel-popular-templates"

const EMPTY_ENTRIES: any[] = []
const EMPTY_RESULTS: any[] = []

export type FortuneWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: FortuneWheelDeepLink
}

function FortuneWheelAppInner({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: FortuneWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [actionMode, setActionMode] = useState<"normal" | "elimination" | "manual">("normal")
  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES)
  const [achievements, setAchievements] = useState(PICKER_WHEEL_ACHIEVEMENTS)
  const [totalPoints, setTotalPoints] = useState(0)
  const [currentUser] = useState<SocialProfile | undefined>()
  const [currentTheme, setCurrentTheme] = useState("classic")
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [activeUseCaseId, setActiveUseCaseId] = useState<FortuneWheelUseCaseId | null>(
    deepLink?.useCaseId ?? null,
  )
  const [mounted, setMounted] = useState(false)
  const [sidebarMaxHeight, setSidebarMaxHeight] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const lastApplied = useRef<FortuneWheelUseCaseId | null>(null)
  const lastGameSpin = useRef<string | null>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const { settings, loadFromDatabase: loadSettings, updateSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore(
    (state) => state.settings.spinBehavior?.removeWinnerAfterSpin,
  )
  const { setCurrentTool, getCurrentWheel, createNewWheel, updateWheelData } = useWheelManagerStore()
  const {
    currentSession,
    isGameActive: isAdvancedGameActive,
    startGame: startAdvancedGame,
    endGame: endAdvancedGame,
    restartGame: restartAdvancedGame,
    recordSpin,
    getGameScore,
    getGameStats,
  } = useGameSession()

  const viewMode = useWheelManagerStore((state) => {
    const wheel =
      state.wheelsByTool["fortune-wheel"]?.find((item) => item.id === state.currentWheelId) ||
      state.wheelsByTool["fortune-wheel"]?.[0]
    return (wheel?.data as FortuneWheelData | undefined)?.viewMode || "wheel"
  })
  const entries = useWheelManagerStore((state) => {
    const wheel =
      state.wheelsByTool["fortune-wheel"]?.find((item) => item.id === state.currentWheelId) ||
      state.wheelsByTool["fortune-wheel"]?.[0]
    const list = (wheel?.data as FortuneWheelData | undefined)?.entries
    return Array.isArray(list) ? list : EMPTY_ENTRIES
  })
  const recentResults = useWheelManagerStore((state) => {
    const wheel =
      state.wheelsByTool["fortune-wheel"]?.find((item) => item.id === state.currentWheelId) ||
      state.wheelsByTool["fortune-wheel"]?.[0]
    const list = (wheel?.data as FortuneWheelData | undefined)?.recentResults
    return Array.isArray(list) ? list : EMPTY_RESULTS
  })

  const safeSpinHistory = useMemo(
    () =>
      spinHistory.map((record) => {
        const parsed = record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp)
        return { ...record, timestamp: Number.isNaN(parsed.getTime()) ? new Date(0) : parsed }
      }),
    [spinHistory],
  )

  const applyPreset = useCallback((id: FortuneWheelUseCaseId) => {
    if (!getFortuneWheelUseCase(id) || !applyFortuneWheelUseCase(id)) return
    setActiveUseCaseId(id)
    lastApplied.current = id
  }, [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const initialize = async () => {
      await loadSettings()
      await new Promise<void>((resolve) => {
        const persist = useWheelManagerStore.persist
        if (persist?.hasHydrated?.()) return resolve()
        let done = false
        const finish = () => {
          if (!done) {
            done = true
            unsubscribe?.()
            resolve()
          }
        }
        const unsubscribe = persist?.onFinishHydration?.(finish)
        window.setTimeout(finish, 800)
      })
      setCurrentTool("fortune-wheel")
      let wheel = getCurrentWheel()
      if (!wheel) {
        createNewWheel("fortune-wheel", "My Fortune Wheel")
        wheel = getCurrentWheel()
      }
      const preset = deepLink?.useCaseId || fortuneWheelUseCaseFromTemplate(searchParams.get("template"))
      if (preset) applyPreset(preset)
      const latest = getCurrentWheel()?.data as FortuneWheelData | undefined
      if (latest?.currentTheme) setCurrentTheme(latest.currentTheme)
      if (latest?.spinHistory) setSpinHistory(latest.spinHistory)
      if (latest?.actionMode) setActionMode(latest.actionMode)
      if (Array.isArray(latest?.achievements) && latest.achievements.length) {
        setAchievements(latest.achievements)
        setTotalPoints(
          latest.achievements
            .filter((item: { completed?: boolean }) => item.completed)
            .reduce((sum: number, item: { points?: number }) => sum + (item.points || 0), 0),
        )
      }
      if (Array.isArray(latest?.themes) && latest.themes.length) setThemes(latest.themes)
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

  useEffect(() => {
    const el = leftColRef.current
    if (!el || !showInputs || isFullscreen || viewMode !== "wheel") {
      setSidebarMaxHeight(null)
      return
    }
    const sync = () => {
      if (typeof window === "undefined") return
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setSidebarMaxHeight(Math.round(el.getBoundingClientRect().height))
      } else {
        setSidebarMaxHeight(null)
      }
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener("resize", sync)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", sync)
    }
  }, [mounted, showInputs, isFullscreen, viewMode, actionMode, currentTheme, entries.length])

  const syncActionMode = useCallback(
    (mode: "normal" | "elimination" | "manual") => {
      setActionMode(mode)
      const wheel = getCurrentWheel()
      if (wheel) {
        updateWheelData("fortune-wheel", wheel.id, {
          ...(wheel.data as FortuneWheelData),
          actionMode: mode,
        })
      }
      if (mode !== "manual") {
        const latest = useSettingsStore.getState().settings
        updateSettings({
          spinBehavior: { ...latest.spinBehavior, removeWinnerAfterSpin: mode === "elimination" },
        } as any)
      }
    },
    [getCurrentWheel, updateSettings, updateWheelData],
  )

  const selectTheme = useCallback(
    (themeId: string) => {
      setCurrentTheme(themeId)
      const wheel = getCurrentWheel()
      if (wheel) {
        updateWheelData("fortune-wheel", wheel.id, {
          ...(wheel.data as FortuneWheelData),
          currentTheme: themeId,
        })
      }
    },
    [getCurrentWheel, updateWheelData],
  )

  const resetWheelForGame = useCallback(() => {
    const current = getCurrentWheel()
    if (!current) return
    lastGameSpin.current = null
    updateWheelData("fortune-wheel", current.id, {
      ...(current.data as FortuneWheelData),
      totalSpins: 0,
      spinHistory: [],
      recentResults: [],
      selectedResult: null,
    })
    setSpinHistory([])
  }, [getCurrentWheel, updateWheelData])

  const handleSpinCompleted = useCallback(() => {
    const current = getCurrentWheel()
    if (!current) return
    const wheelData = current.data as FortuneWheelData
    if (wheelData.spinHistory) setSpinHistory(wheelData.spinHistory)

    const resultName = wheelData.selectedResult?.name
    if (isAdvancedGameActive && currentSession && resultName && lastGameSpin.current !== resultName) {
      lastGameSpin.current = resultName
      window.setTimeout(() => recordSpin(resultName), 100)
    }

    window.setTimeout(() => {
      const latestWheel = getCurrentWheel()
      if (!latestWheel) return
      const latest = latestWheel.data as FortuneWheelData
      const totalSpinsFromWheel = latest.totalSpins || 0
      const results = latest.recentResults || []
      const stats = {
        totalSpins: totalSpinsFromWheel,
        uniqueResults: new Set(results.map((item) => item.name)).size,
        perfectMemoryRounds: 0,
        bingoWins: 0,
        fastestMemoryTime: 0,
        consecutiveDays: 1,
        totalOptions: Array.isArray(latest.entries)
          ? latest.entries.filter((entry) => entry.enabled !== false).length
          : 0,
        aiGeneratedOptions: 0,
        mysterySpins: 0,
      }

      const updatedAchievements = checkAchievementUnlocks(achievements, stats)
      const newlyCompleted = updatedAchievements.filter(
        (item) => item.completed && !achievements.find((prev) => prev.id === item.id)?.completed,
      )
      let points = totalPoints
      if (newlyCompleted.length > 0) {
        setAchievements(updatedAchievements)
        const gained = newlyCompleted.reduce((sum, item) => sum + item.points, 0)
        points += gained
        setTotalPoints((prev) => prev + gained)
      }

      const updatedThemes = checkThemeUnlocks(themes, {
        totalSpins: totalSpinsFromWheel,
        totalPoints: points,
      })
      const newlyUnlockedThemes = updatedThemes.filter(
        (item) => item.unlocked && !themes.find((prev) => prev.id === item.id)?.unlocked,
      )
      if (newlyUnlockedThemes.length > 0) setThemes(updatedThemes)

      if (newlyCompleted.length > 0 || newlyUnlockedThemes.length > 0) {
        updateWheelData("fortune-wheel", latestWheel.id, {
          ...latest,
          achievements: newlyCompleted.length > 0 ? updatedAchievements : achievements,
          themes: newlyUnlockedThemes.length > 0 ? updatedThemes : themes,
        })
      }
    }, 120)
  }, [
    achievements,
    currentSession,
    getCurrentWheel,
    isAdvancedGameActive,
    recordSpin,
    themes,
    totalPoints,
    updateWheelData,
  ])

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
            onOpenGames={() => setShowGameModes(true)}
          />
        )}
        <main className="w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          {!isFullscreen && (
            <>
              <div className="mb-4 text-center">
                <ToolPageTitle
                  title={shortTitle ?? FORTUNE_WHEEL_SHORT_TITLE}
                  toolType="fortune-wheel"
                />
                <p className="text-gray-600">
                  {toolSubtitle ?? "A dramatic equal-odds game-show spinner"}
                </p>
              </div>
              <FortuneWheelPopularTemplates />
              {activeUseCaseId && getFortuneWheelUseCase(activeUseCaseId) && (
                <div className="mb-4 flex justify-center sm:justify-start">
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800">
                    Template: {getFortuneWheelUseCase(activeUseCaseId)!.label}
                  </span>
                </div>
              )}
            </>
          )}

          {currentSession && (
            <PickerWheelGameStatus
              session={currentSession}
              onEndGame={() => {
                endAdvancedGame()
                setTotalPoints((prev) => prev + getGameScore())
                void getGameStats()
              }}
              onRestartGame={() => {
                setTotalPoints((prev) => prev + getGameScore())
                void getGameStats()
                resetWheelForGame()
                restartAdvancedGame()
              }}
            />
          )}

          <div
            id="fortune-spin-wheel"
            className="mb-6 grid min-w-0 items-start gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-3 lg:gap-8"
          >
            {viewMode === "wheel" ? (
              <>
                <div
                  ref={leftColRef}
                  className={`relative min-w-0 overflow-x-hidden bg-white p-3 sm:p-6 ${
                    isFullscreen || !showInputs
                      ? "lg:col-span-3"
                      : "rounded-lg border shadow-sm lg:col-span-2"
                  }`}
                >
                  {!isFullscreen && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.dispatchEvent(new Event("open-fortune-results"))}
                      className="absolute left-2 top-2 z-10 border-violet-500 bg-white text-xs text-violet-800 shadow-sm sm:left-4 sm:top-4"
                    >
                      Results{" "}
                      {!!recentResults.length && (
                        <Badge variant="secondary" className="ml-2">
                          {recentResults.length}
                        </Badge>
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
                    <FortuneWheelSection
                      currentTheme={currentTheme}
                      onSpinCompleted={handleSpinCompleted}
                      isFullscreen={isFullscreen}
                      onToggleFullscreen={() => setIsFullscreen((value) => !value)}
                      removeWinnerAfterSpin={actionMode === "elimination"}
                      showResultsButton={false}
                      actionMode={actionMode}
                      isGameActive={isAdvancedGameActive}
                      currentGameModeName={currentSession?.gameMode?.name}
                      onOpenAchievements={() => setShowAchievements(true)}
                      onOpenThemeSelector={() => setShowThemeSelector(true)}
                      onOpenAnalytics={() => setShowAnalytics(true)}
                      onOpenSocialHub={() => setShowSocialHub(true)}
                      onOpenGameModes={() => setShowGameModes(true)}
                      totalPoints={totalPoints}
                    />
                  </div>
                </div>
                {showInputs && !isFullscreen && (
                  <div className="min-w-0 self-start lg:col-span-1">
                    <FortuneInputPanel
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
                      desktopMaxHeight={sidebarMaxHeight}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="min-w-0 lg:col-span-3">
                <FortuneInputPanel
                  actionMode={actionMode}
                  onActionModeChange={syncActionMode}
                  onOpenSettings={() => setShowSettings(true)}
                  onToggleFullscreen={() => setIsFullscreen((value) => !value)}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  onOpenAchievements={() => setShowAchievements(true)}
                  onThemeChange={selectTheme}
                  currentTheme={currentTheme}
                  themes={themes}
                />
                {!entries.length && (
                  <p className="mt-3 text-center text-sm text-slate-500">
                    Add wedges to build your wheel.
                  </p>
                )}
              </div>
            )}
          </div>
          {!isFullscreen && (
            <>
              <ToolBreadcrumbs />
              {seoIntro}
            </>
          )}
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
          isVisible={showThemeSelector}
          onClose={() => setShowThemeSelector(false)}
        />
        <PickerWheelAnalyticsDisplay
          analytics={{
            ...(showAnalytics ? analyzeSpinData(safeSpinHistory) : analyzeSpinData([])),
            totalSpins: (getCurrentWheel()?.data as FortuneWheelData | undefined)?.totalSpins || 0,
            uniqueResults: new Set(recentResults.map((item) => item.name)).size,
          }}
          isVisible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
        <PickerWheelSocialHub
          isVisible={showSocialHub}
          onClose={() => setShowSocialHub(false)}
          currentUser={currentUser}
          onShareWheel={() => {
            void navigator.clipboard?.writeText(window.location.href)
          }}
        />
        <PickerWheelGameModes
          isVisible={showGameModes}
          onClose={() => setShowGameModes(false)}
          userPoints={totalPoints}
          onStartGame={(gameMode: GameMode) => {
            resetWheelForGame()
            startAdvancedGame(gameMode)
            setShowGameModes(false)
          }}
        />
      </div>
    </ToastProvider>
  )
}

export default function FortuneWheelApp(props: FortuneWheelAppProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#a8b5a0]" />}>
      <FortuneWheelAppInner {...props} />
    </Suspense>
  )
}
