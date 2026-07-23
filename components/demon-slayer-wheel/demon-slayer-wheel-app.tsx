"use client"

import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { PanelRightOpen } from "lucide-react"
import Footer from "@/components/footer"
import Header from "@/components/header"
import PickerWheelAchievementsDisplay from "@/components/picker-wheel-achievements-display"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelGameModes from "@/components/picker-wheel-game-modes"
import PickerWheelGameStatus from "@/components/picker-wheel-game-status"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import PickerWheelThemeSelector from "@/components/picker-wheel-theme-selector"
import SettingsPanel from "@/components/settings-panel"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToastProvider } from "@/contexts/toast-context"
import { useGameSession } from "@/hooks/use-game-session"
import type { DemonSlayerWheelDeepLink } from "@/lib/demon-slayer-wheel-spokes"
import { DEMON_SLAYER_WHEEL_SHORT_TITLE } from "@/lib/demon-slayer-wheel-seo"
import {
  applyDemonSlayerWheelUseCase, getDemonSlayerWheelUseCase, demonSlayerWheelUseCaseFromTemplate,
  type DemonSlayerWheelUseCaseId,
} from "@/lib/demon-slayer-wheel-use-cases"
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
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore, type DemonSlayerWheelData } from "@/stores/wheel-manager-store"
import type { ActionMode } from "@/types/demon-slayer-types"
import DemonSlayerInputPanel from "./demon-slayer-input-panel"
import { DemonSlayerWheelPopularTemplates } from "./demon-slayer-wheel-popular-templates"
import DemonSlayerWheelSection from "./demon-slayer-wheel-section"

export type DemonSlayerWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: DemonSlayerWheelDeepLink
  showFooter?: boolean
}

function DemonSlayerWheelAppInner({ seoIntro, seoSections, shortTitle, toolSubtitle, deepLink, showFooter = true }: DemonSlayerWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [actionMode, setActionMode] = useState<ActionMode>("normal")
  const [currentTheme, setCurrentTheme] = useState("classic")
  const [showAchievements, setShowAchievements] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [achievements, setAchievements] = useState(PICKER_WHEEL_ACHIEVEMENTS)
  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES)
  const [totalPoints, setTotalPoints] = useState(0)
  const [currentUser, setCurrentUser] = useState<SocialProfile | undefined>()
  const [, setStoreReady] = useState(0)
  const [activeUseCaseId, setActiveUseCaseId] = useState<DemonSlayerWheelUseCaseId | null>(deepLink?.useCaseId ?? null)
  const lastApplied = useRef<DemonSlayerWheelUseCaseId | null>(null)
  const lastGameSpin = useRef<string | null>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const [sidebarMaxHeight, setSidebarMaxHeight] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const { settings, loadFromDatabase: loadSettings, updateSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore((state) => state.settings.spinBehavior?.removeWinnerAfterSpin)
  const { getCurrentWheel, updateWheelData } = useWheelManagerStore()
  const wheel = useWheelManagerStore((state) =>
    (state.wheelsByTool["demon-slayer-wheel"] || []).find((item) => item.id === state.currentWheelId) || null)
  const data = wheel?.data as DemonSlayerWheelData | undefined

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

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const el = leftColRef.current
    if (!el || !showInputs || isFullscreen) {
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
  }, [mounted, showInputs, isFullscreen, actionMode, currentTheme, data?.selectedCharacters?.length])

  const applyPreset = useCallback((id: DemonSlayerWheelUseCaseId) => {
    if (!getDemonSlayerWheelUseCase(id) || !applyDemonSlayerWheelUseCase(id)) return
    setActiveUseCaseId(id); lastApplied.current = id
  }, [])

  useEffect(() => {
    void loadSettings()
    let finished = false
    const initialize = () => {
      if (finished) return
      const store = useWheelManagerStore.getState()
      store.setCurrentTool("demon-slayer-wheel")
      let current = store.getCurrentWheel()
      if (!current) {
        store.createNewWheel("demon-slayer-wheel", "Demon Slayer Spin Wheel")
        current = store.getCurrentWheel()
      }
      const preset = deepLink?.useCaseId || demonSlayerWheelUseCaseFromTemplate(searchParams.get("template"))
      if (preset) applyPreset(preset)
      const latest = store.getCurrentWheel()?.data as DemonSlayerWheelData | undefined
      if (latest?.currentTheme) setCurrentTheme(latest.currentTheme)
      if (latest?.actionMode) setActionMode(latest.actionMode)
      if (Array.isArray(latest?.achievements) && latest.achievements.length) {
        setAchievements(latest.achievements)
        setTotalPoints(
          latest.achievements.filter((item: { completed?: boolean }) => item.completed)
            .reduce((sum: number, item: { points?: number }) => sum + (item.points || 0), 0),
        )
      }
      if (Array.isArray(latest?.themes) && latest.themes.length) setThemes(latest.themes)
      setStoreReady((value) => value + 1)
    }
    const persist = useWheelManagerStore.persist
    let unsubscribe: (() => void) | undefined
    if (persist?.hasHydrated?.()) initialize()
    else {
      unsubscribe = persist?.onFinishHydration?.(initialize)
      window.setTimeout(initialize, 800)
    }
    return () => { finished = true; unsubscribe?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const preset = deepLink?.useCaseId || demonSlayerWheelUseCaseFromTemplate(searchParams.get("template"))
    if (!preset || lastApplied.current === preset) return
    const timer = window.setTimeout(() => applyPreset(preset), 0)
    return () => window.clearTimeout(timer)
  }, [applyPreset, deepLink?.useCaseId, searchParams])

  useEffect(() => {
    if (actionMode === "manual") return
    const next: ActionMode = removeWinnerAfterSpin ? "elimination" : "normal"
    if (actionMode !== next) setActionMode(next)
  }, [actionMode, removeWinnerAfterSpin])

  const syncActionMode = useCallback((mode: ActionMode) => {
    setActionMode(mode)
    const current = getCurrentWheel()
    if (current) updateWheelData("demon-slayer-wheel", current.id, { ...(current.data as DemonSlayerWheelData), actionMode: mode })
    if (mode !== "manual") {
      const latest = useSettingsStore.getState().settings
      updateSettings({ spinBehavior: { ...latest.spinBehavior, removeWinnerAfterSpin: mode === "elimination" } } as any)
    }
  }, [getCurrentWheel, updateSettings, updateWheelData])

  const selectTheme = useCallback((themeId: string) => {
    setCurrentTheme(themeId)
    const current = getCurrentWheel()
    if (current) updateWheelData("demon-slayer-wheel", current.id, { ...(current.data as DemonSlayerWheelData), currentTheme: themeId })
  }, [getCurrentWheel, updateWheelData])

  const handleSpinCompleted = useCallback(() => {
    const current = getCurrentWheel()
    if (!current) return
    const wheelData = current.data as DemonSlayerWheelData
    const resultName = wheelData.selectedResult?.character?.name

    if (isAdvancedGameActive && currentSession && resultName && lastGameSpin.current !== resultName) {
      lastGameSpin.current = resultName
      window.setTimeout(() => recordSpin(resultName), 100)
    }

    window.setTimeout(() => {
      const latestWheel = getCurrentWheel()
      if (!latestWheel) return
      const latest = latestWheel.data as DemonSlayerWheelData
      const totalSpinsFromWheel = latest.totalSpins || 0
      const recentResults = latest.recentResults || []
      const stats = {
        totalSpins: totalSpinsFromWheel,
        uniqueResults: new Set(recentResults.map((item) => item.name)).size,
        perfectMemoryRounds: 0,
        bingoWins: 0,
        fastestMemoryTime: 0,
        consecutiveDays: 1,
        totalOptions: latest.selectedCharacters?.length || 0,
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
        updateWheelData("demon-slayer-wheel", latestWheel.id, {
          ...latest,
          achievements: newlyCompleted.length > 0 ? updatedAchievements : achievements,
          themes: newlyUnlockedThemes.length > 0 ? updatedThemes : themes,
        })
      }
    }, 120)
  }, [
    achievements, currentSession, getCurrentWheel, isAdvancedGameActive,
    recordSpin, themes, totalPoints, updateWheelData,
  ])

  const resetWheelForGame = useCallback(() => {
    const current = getCurrentWheel()
    if (!current) return
    lastGameSpin.current = null
    updateWheelData("demon-slayer-wheel", current.id, {
      ...(current.data as DemonSlayerWheelData),
      totalSpins: 0,
      spinHistory: [],
      recentResults: [],
      selectedResult: null,
    })
  }, [getCurrentWheel, updateWheelData])

  if (!mounted) return <div className="min-h-[720px] bg-violet-100" aria-busy="true" />

  return <ToastProvider><div className={`min-h-screen transition-colors ${isFullscreen ? "fixed inset-0 z-50 overflow-auto" : ""}`}
    style={{ backgroundColor: settings.appearance.backgroundColor || "#ddd6fe",
      backgroundImage: settings.appearance.backgroundImage ? `url(${settings.appearance.backgroundImage})` : undefined,
      backgroundSize: "cover", backgroundPosition: "center" }}>
    {settings.appearance.bannerLogo && !isFullscreen && (
      <div className="py-4 text-center">
        <img src={settings.appearance.bannerLogo || "/placeholder.svg"} alt="Banner Logo"
          className="mx-auto h-16 object-contain" />
      </div>
    )}
    {!isFullscreen && <Header
      onOpenSettings={() => setShowSettings(true)}
      onOpenGames={() => setShowGameModes(true)}
    />}
    <main className="w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      {!isFullscreen && <><div className="mb-4 text-center">
        <ToolPageTitle title={shortTitle ?? DEMON_SLAYER_WHEEL_SHORT_TITLE} toolType="demon-slayer-wheel" />
        <p className="text-gray-600">{toolSubtitle ?? "Pick a random Demon Slayer character with equal odds"}</p>
      </div>
      <DemonSlayerWheelPopularTemplates />
      {activeUseCaseId && getDemonSlayerWheelUseCase(activeUseCaseId) && <div className="mb-4 flex justify-center sm:justify-start">
        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-800">
          Template: {getDemonSlayerWheelUseCase(activeUseCaseId)!.label}</span></div>}</>}

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

      <div id="ds-wheel-tool" className="mb-6 grid min-w-0 items-start gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        <div
          ref={leftColRef}
          className={`relative min-w-0 overflow-x-hidden bg-white p-3 sm:p-6 ${isFullscreen || !showInputs ? "lg:col-span-3" : "rounded-lg border shadow-sm lg:col-span-2"}`}
        >
          {!isFullscreen && <Button type="button" variant="outline" size="sm"
            onClick={() => window.dispatchEvent(new Event("open-demon-slayer-results"))}
            className="absolute left-2 top-2 z-10 border-violet-500 bg-white text-xs text-violet-800 shadow-sm sm:left-4 sm:top-4">
            Results {!!data?.recentResults?.length && <Badge variant="secondary" className="ml-2">{data.recentResults.length}</Badge>}
          </Button>}
          {!showInputs && <div className="mb-3 flex justify-end pt-8"><Button variant="outline" size="sm" onClick={() => setShowInputs(true)}>
            <PanelRightOpen className="mr-1 h-4 w-4" /> Show controls</Button></div>}
          <div className={isFullscreen ? undefined : "pt-8"}><DemonSlayerWheelSection currentTheme={currentTheme}
            themes={themes}
            onSpinCompleted={handleSpinCompleted}
            isFullscreen={isFullscreen} onToggleFullscreen={() => setIsFullscreen((value) => !value)}
            removeWinnerAfterSpin={actionMode === "elimination"}
            actionMode={actionMode}
            onActionModeChange={syncActionMode}
            isGameActive={isAdvancedGameActive}
            currentGameModeName={currentSession?.gameMode?.name}
            onOpenAchievements={() => setShowAchievements(true)}
            onOpenThemeSelector={() => setShowThemeSelector(true)}
            onOpenAnalytics={() => setShowAnalytics(true)}
            onOpenSocialHub={() => setShowSocialHub(true)}
            onOpenGameModes={() => setShowGameModes(true)}
            totalPoints={totalPoints} /></div>
        </div>
        {showInputs && !isFullscreen && (
          <div className="min-w-0 self-start lg:col-span-1">
            <DemonSlayerInputPanel
          actionMode={actionMode} onActionModeChange={syncActionMode} onApplyTemplate={applyPreset}
          onHideInputs={() => setShowInputs(false)} onOpenSettings={() => setShowSettings(true)}
          onToggleFullscreen={() => setIsFullscreen((value) => !value)}
          onThemeChange={selectTheme} currentTheme={currentTheme}
          themes={themes}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenAnalytics={() => setShowAnalytics(true)}
          onViewHistory={() => window.dispatchEvent(new Event("open-demon-slayer-results"))}
          resultsCount={data?.recentResults?.length || 0}
          desktopMaxHeight={sidebarMaxHeight} />
          </div>
        )}
      </div>
      {!isFullscreen && seoIntro}{!isFullscreen && seoSections}
    </main>
    {!isFullscreen && showFooter && <Footer />}
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
      analytics={(() => {
        const wheelData = getCurrentWheel()?.data as DemonSlayerWheelData | undefined
        const recentResults = wheelData?.recentResults || []
        const selectedNames = (wheelData?.selectedCharacters || [])
          .map((id) => recentResults.find((item) => item.id === id)?.name || id)
        const spinRecords: SpinRecord[] = recentResults.map((result, index) => ({
          id: `demon-slayer-spin-${index}`,
          timestamp: new Date(Date.now() - (recentResults.length - index - 1) * 1000),
          result: result.name,
          options: selectedNames,
          mode: "manual",
          theme: currentTheme,
          spinDuration: 3,
        }))
        const analyticsData = analyzeSpinData(spinRecords)
        return {
          ...analyticsData,
          totalSpins: wheelData?.totalSpins || 0,
          uniqueResults: new Set(recentResults.map((item) => item.name)).size,
        }
      })()}
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
  </div></ToastProvider>
}

export default function DemonSlayerWheelApp(props: DemonSlayerWheelAppProps) {
  return <Suspense fallback={<div className="min-h-screen bg-violet-100" />}>
    <DemonSlayerWheelAppInner {...props} />
  </Suspense>
}
