"use client"

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
  type ReactNode,
} from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CountryWheelSection from "@/components/country-wheel-section"
import CountryAIWheelSection from "@/components/country-ai-wheel-section"
import CountryInputPanel from "@/components/country-input-panel"
import SettingsPanel from "@/components/settings-panel"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { ToastProvider } from "@/contexts/toast-context"
import PickerWheelAchievementsDisplay from "@/components/picker-wheel-achievements-display"
import PickerWheelThemeSelector from "@/components/picker-wheel-theme-selector"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import PickerWheelGameModes from "@/components/picker-wheel-game-modes"
import PickerWheelGameStatus from "@/components/picker-wheel-game-status"
import {
  PICKER_WHEEL_ACHIEVEMENTS,
  checkAchievementUnlocks,
} from "@/lib/picker-wheel-achievements"
import { PICKER_WHEEL_THEMES, checkThemeUnlocks } from "@/lib/picker-wheel-themes"
import { analyzeSpinData, SpinRecord } from "@/lib/picker-wheel-analytics"
import { SocialProfile } from "@/lib/picker-wheel-social"
import { GameMode } from "@/lib/picker-wheel-game-modes"
import { useGameSession } from "@/hooks/use-game-session"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PanelRightOpen } from "lucide-react"
import { getCountriesByRegion } from "@/data/countries"
import { CountryWheelPopularTemplates } from "@/components/country-wheel/country-wheel-popular-templates"
import type { CountryWheelDeepLink } from "@/lib/country-wheel-spokes"
import { COUNTRY_WHEEL_SHORT_TITLE } from "@/lib/country-wheel-seo"
import {
  applyCountryWheelUseCase,
  countryWheelUseCaseFromTemplate,
  getCountryWheelUseCase,
  type CountryWheelUseCaseId,
} from "@/lib/country-wheel-use-cases"

/** Stable empty fallback — selectors must not return a fresh [] each snapshot. */
const EMPTY_SELECTED_COUNTRIES: any[] = []
const EMPTY_RECENT_RESULTS: any[] = []

type CountryWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: CountryWheelDeepLink
}

function CountryWheelAppInner({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: CountryWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual")
  const [actionMode, setActionMode] = useState<"normal" | "elimination" | "manual">("normal")
  const [showAchievements, setShowAchievements] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [achievements, setAchievements] = useState(PICKER_WHEEL_ACHIEVEMENTS)
  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES)
  const [currentTheme, setCurrentTheme] = useState("classic")
  const [totalPoints, setTotalPoints] = useState(0)
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [currentUser, setCurrentUser] = useState<SocialProfile | undefined>()
  const [activeUseCaseId, setActiveUseCaseId] = useState<CountryWheelUseCaseId | null>(
    deepLink?.useCaseId ?? null,
  )
  const deepLinkAppliedRef = useRef(false)
  const lastAppliedUseCaseRef = useRef<CountryWheelUseCaseId | null>(null)
  const searchParams = useSearchParams()

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

  const { settings, loadFromDatabase: loadSettings, updateSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore(
    (s) => s.settings.spinBehavior?.removeWinnerAfterSpin,
  )
  const { setCurrentTool, getCurrentWheel, createNewWheel, updateWheelData } =
    useWheelManagerStore()

  // Keep sidebar List/Wheel toggle in sync with the active wheel (not the legacy store)
  const viewMode = useWheelManagerStore((state) => {
    const wheels = state.wheelsByTool[state.currentTool]
    const wheel = wheels?.find((w) => w.id === state.currentWheelId)
    return ((wheel?.data as any)?.viewMode as "wheel" | "list" | "text") || "wheel"
  })
  const selectedCountries = useWheelManagerStore((state) => {
    const wheels = state.wheelsByTool[state.currentTool]
    const wheel = wheels?.find((w) => w.id === state.currentWheelId)
    const countries = (wheel?.data as any)?.selectedCountries as any[] | undefined
    return countries ?? EMPTY_SELECTED_COUNTRIES
  })
  const recentResults = useWheelManagerStore((state) => {
    const wheels = state.wheelsByTool[state.currentTool]
    const wheel = wheels?.find((w) => w.id === state.currentWheelId)
    const results = (wheel?.data as any)?.recentResults as any[] | undefined
    return results ?? EMPTY_RECENT_RESULTS
  })

  const [lastSpinResult, setLastSpinResult] = useState<any>(null)

  // Keep Action Mode in sync with Manage → Remove winner (and reverse)
  useEffect(() => {
    if (actionMode === "manual") return
    const wantMode = removeWinnerAfterSpin ? "elimination" : "normal"
    if (actionMode !== wantMode) {
      setActionMode(wantMode)
      const wheel = getCurrentWheel()
      if (wheel) {
        updateWheelData("country-wheel", wheel.id, {
          ...wheel.data,
          actionMode: wantMode,
        })
      }
    }
  }, [removeWinnerAfterSpin, actionMode, getCurrentWheel, updateWheelData])

  const syncActionMode = useCallback(
    (mode: "normal" | "elimination" | "manual") => {
      setActionMode(mode)
      const wheel = getCurrentWheel()
      if (wheel) {
        updateWheelData("country-wheel", wheel.id, {
          ...wheel.data,
          actionMode: mode,
        })
      }
      if (mode === "elimination" || mode === "normal") {
        const latest = useSettingsStore.getState().settings
        updateSettings({
          spinBehavior: {
            ...latest.spinBehavior,
            removeWinnerAfterSpin: mode === "elimination",
          },
        })
      }
    },
    [getCurrentWheel, updateWheelData, updateSettings],
  )

  const applyUseCasePreset = useCallback((id: CountryWheelUseCaseId) => {
    const useCase = getCountryWheelUseCase(id)
    if (!useCase || !applyCountryWheelUseCase(id)) return
    setActiveUseCaseId(id)
    lastAppliedUseCaseRef.current = id
    deepLinkAppliedRef.current = true
  }, [])

  useEffect(() => {
    const id =
      deepLink?.useCaseId ??
      countryWheelUseCaseFromTemplate(searchParams.get("template"))
    if (!id) return
    if (lastAppliedUseCaseRef.current === id && deepLinkAppliedRef.current) return
    const timer = window.setTimeout(() => applyUseCasePreset(id), 0)
    return () => window.clearTimeout(timer)
  }, [deepLink?.useCaseId, searchParams, applyUseCasePreset])

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadSettings()

        await new Promise<void>((resolve) => {
          const api = useWheelManagerStore.persist
          if (api?.hasHydrated?.()) {
            resolve()
            return
          }
          let done = false
          const finish = () => {
            if (done) return
            done = true
            unsub?.()
            resolve()
          }
          const unsub = api?.onFinishHydration?.(finish)
          window.setTimeout(finish, 800)
        })

        setCurrentTool("country-wheel")

        let wheel = getCurrentWheel()
        if (!wheel) {
          createNewWheel("country-wheel", "My Country Picker Wheel")
          wheel = getCurrentWheel()
        }

        const presetId =
          deepLink?.useCaseId ||
          countryWheelUseCaseFromTemplate(searchParams.get("template"))

        if (presetId) {
          // Always re-apply after hydrate so persist cannot leave an empty first paint
          applyUseCasePreset(presetId)
        } else if (wheel?.toolType === "country-wheel") {
          const wheelData = wheel.data as any
          if (!wheelData.selectedCountries?.length) {
            const region = wheelData.selectedRegion || "all"
            updateWheelData("country-wheel", wheel.id, {
              ...wheelData,
              selectedRegion: region,
              selectedCountries: getCountriesByRegion(region),
            })
          }
        }

        const currentWheel = getCurrentWheel()
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as any
          if (wheelData.achievements) {
            setAchievements(wheelData.achievements)
            const points = wheelData.achievements
              .filter((a: any) => a.completed)
              .reduce((sum: number, a: any) => sum + a.points, 0)
            setTotalPoints(points)
          }
          setThemes(wheelData.themes || PICKER_WHEEL_THEMES)
          if (wheelData.currentTheme) setCurrentTheme(wheelData.currentTheme)
          setSpinHistory(wheelData.spinHistory || [])
          if (wheelData.actionMode) setActionMode(wheelData.actionMode)
        }
      } catch (error) {
        console.error("Error initializing country wheel:", error)
      }
    }
    initializeApp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const currentWheel = getCurrentWheel()
    if (currentWheel?.data) {
      const wheelData = currentWheel.data as any
      if (wheelData.selectedResult && wheelData.selectedResult !== lastSpinResult) {
        const result = wheelData.selectedResult
        setLastSpinResult(result)

        if (result && result.name) {
          const totalSpins = spinHistory.length + 1
          const uniqueResults = new Set([
            ...spinHistory.map((r) => r.result),
            result.name,
          ]).size

          const newSpinRecord: SpinRecord = {
            id: Date.now().toString(),
            timestamp: new Date(),
            result: result.name,
            options: selectedCountries.map((country: any) => country.name),
            mode: activeTab === "ai" ? "ai" : "manual",
            theme: currentTheme,
            spinDuration: 3,
            userQuestion: undefined,
          }

          const updatedSpinHistory = [...spinHistory, newSpinRecord]
          setSpinHistory(updatedSpinHistory)

          const stats = {
            totalSpins,
            uniqueResults,
            perfectMemoryRounds: 0,
            bingoWins: 0,
            fastestMemoryTime: 0,
            consecutiveDays: 1,
            totalOptions: selectedCountries.length,
            aiGeneratedOptions: activeTab === "ai" ? selectedCountries.length : 0,
            mysterySpins: 0,
          }

          const updatedAchievements = checkAchievementUnlocks(achievements, stats)
          const newlyCompleted = updatedAchievements.filter(
            (a) => a.completed && !achievements.find((oa) => oa.id === a.id)?.completed,
          )

          if (newlyCompleted.length > 0) {
            setAchievements(updatedAchievements)
            const newPoints = newlyCompleted.reduce((sum, a) => sum + a.points, 0)
            setTotalPoints((prev) => prev + newPoints)

            const updatedThemes = checkThemeUnlocks(themes, {
              totalSpins,
              totalPoints: totalPoints + newPoints,
            })
            const newlyUnlockedThemes = updatedThemes.filter(
              (t) => t.unlocked && !themes.find((ot) => ot.id === t.id)?.unlocked,
            )
            if (newlyUnlockedThemes.length > 0) setThemes(updatedThemes)

            updateWheelData("country-wheel", currentWheel.id, {
              ...currentWheel.data,
              achievements: updatedAchievements,
              themes: newlyUnlockedThemes.length > 0 ? updatedThemes : themes,
              spinHistory: updatedSpinHistory,
            })
          } else {
            updateWheelData("country-wheel", currentWheel.id, {
              ...currentWheel.data,
              spinHistory: updatedSpinHistory,
            })
          }
        }
      }
    }
  }, [
    getCurrentWheel,
    lastSpinResult,
    spinHistory,
    achievements,
    themes,
    totalPoints,
    activeTab,
    currentTheme,
    selectedCountries,
    updateWheelData,
  ])

  const handleSpinCompleted = () => {
    if (isAdvancedGameActive && currentSession) {
      const currentWheel = getCurrentWheel()
      if (currentWheel?.data) {
        const wheelData = currentWheel.data as any
        if (wheelData.selectedResult) {
          recordSpin(wheelData.selectedResult.name)
        }
      }
    }
    const currentWheel = getCurrentWheel()
    if (currentWheel?.data) {
      const wheelData = currentWheel.data as any
      if (wheelData.spinHistory) setSpinHistory(wheelData.spinHistory)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentWheel = getCurrentWheel()
      if (currentWheel?.data) {
        const wheelData = currentWheel.data as any
        if (
          wheelData.spinHistory &&
          wheelData.spinHistory.length !== spinHistory.length
        ) {
          setSpinHistory(wheelData.spinHistory)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [spinHistory.length, getCurrentWheel])

  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId)
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("country-wheel", currentWheel.id, {
        ...currentWheel.data,
        currentTheme: themeId,
      })
    }
  }

  const handleApplyPalette = useCallback((colors: readonly string[]) => {
    setThemes((prev) =>
      prev.map((t) =>
        t.id === currentTheme ? { ...t, colors: [...colors] } : t,
      ),
    )
  }, [currentTheme])

  const wheelSectionProps = {
    onOpenAchievements: () => setShowAchievements(true),
    onOpenThemeSelector: () => setShowThemeSelector(true),
    onOpenAnalytics: () => setShowAnalytics(true),
    onOpenSocialHub: () => setShowSocialHub(true),
    onOpenGameModes: () => setShowGameModes(true),
    totalPoints,
    currentTheme,
    themes,
    spinHistory,
    currentUser,
    isGameActive: isAdvancedGameActive,
    currentGameMode: currentSession?.gameMode.name,
    onSpinCompleted: handleSpinCompleted,
    isFullscreen,
    onToggleFullscreen: () => setIsFullscreen((f) => !f),
    removeWinnerAfterSpin: !!removeWinnerAfterSpin,
  }

  return (
    <ToastProvider>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isFullscreen ? "fixed inset-0 z-50 overflow-auto" : ""
        }`}
        style={{
          backgroundColor: settings.appearance.backgroundColor || "#a8b5a0",
          backgroundImage: settings.appearance.backgroundImage
            ? `url(${settings.appearance.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {settings.appearance.bannerLogo && !isFullscreen && (
          <div className="py-4 text-center">
            <img
              src={settings.appearance.bannerLogo || "/placeholder.svg"}
              alt="Banner Logo"
              className="mx-auto h-16 object-contain"
            />
          </div>
        )}

        {!isFullscreen && (
          <Header
            onOpenSettings={() => setShowSettings(true)}
            onOpenGames={() => setShowGameModes(true)}
          />
        )}

        <main
          className={`w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8 ${isFullscreen ? "py-4" : ""}`}
        >
          {!isFullscreen && (
            <div className="mb-4 text-center">
              <ToolPageTitle
                title={shortTitle ?? COUNTRY_WHEEL_SHORT_TITLE}
                toolType="country-wheel"
              />
              <p className="text-gray-600">
                {toolSubtitle ?? "Pick a random country by wheel"}
              </p>
            </div>
          )}

          {!isFullscreen && <CountryWheelPopularTemplates />}

          {!isFullscreen && activeUseCaseId && getCountryWheelUseCase(activeUseCaseId) && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                Template: {getCountryWheelUseCase(activeUseCaseId)!.label}
              </span>
            </div>
          )}

          {currentSession && (
            <PickerWheelGameStatus
              session={currentSession}
              onEndGame={() => {
                endAdvancedGame()
                setTotalPoints((prev) => prev + getGameScore())
                getGameStats()
              }}
              onRestartGame={() => {
                const currentWheel = getCurrentWheel()
                if (currentWheel) {
                  updateWheelData("country-wheel", currentWheel.id, {
                    ...currentWheel.data,
                    totalSpins: 0,
                    spinHistory: [],
                    recentResults: [],
                    selectedResult: null,
                  })
                }
                setTotalPoints((prev) => prev + getGameScore())
                getGameStats()
                restartAdvancedGame()
              }}
            />
          )}

          <div
            id="country-spin-wheel"
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
                      onClick={() =>
                        window.dispatchEvent(new Event("open-country-results"))
                      }
                      className="absolute left-2 top-2 z-10 border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50 sm:left-4 sm:top-4 sm:px-3"
                    >
                      Results
                      {recentResults.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {recentResults.length}
                        </Badge>
                      )}
                    </Button>
                  )}
                  {!showInputs && (
                    <div className="mb-3 flex justify-end pt-8">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setShowInputs(true)}
                      >
                        <PanelRightOpen className="h-4 w-4" />
                        Show controls
                      </Button>
                    </div>
                  )}
                  <div className={isFullscreen ? undefined : "pt-8"}>
                    {activeTab === "manual" ? (
                      <CountryWheelSection
                        {...wheelSectionProps}
                        showResultsButton={false}
                      />
                    ) : (
                      <CountryAIWheelSection
                        {...wheelSectionProps}
                        showResultsButton={false}
                      />
                    )}
                  </div>
                </div>
                {showInputs && !isFullscreen && (
                  <div className="min-w-0 self-start lg:col-span-1">
                    <CountryInputPanel
                      onTabChange={setActiveTab}
                      activeTab={activeTab}
                      actionMode={actionMode}
                      onActionModeChange={syncActionMode}
                      onHideInputs={() => setShowInputs(false)}
                      onOpenSettings={() => setShowSettings(true)}
                      onToggleFullscreen={() => setIsFullscreen((f) => !f)}
                      onOpenAnalytics={() => setShowAnalytics(true)}
                      onOpenAchievements={() => setShowAchievements(true)}
                      onThemeChange={handleThemeSelect}
                      onApplyPalette={handleApplyPalette}
                      currentTheme={currentTheme}
                      themes={themes}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="min-w-0 self-start lg:col-span-3">
                <CountryInputPanel
                  onTabChange={setActiveTab}
                  activeTab={activeTab}
                  actionMode={actionMode}
                  onActionModeChange={syncActionMode}
                  onOpenSettings={() => setShowSettings(true)}
                  onToggleFullscreen={() => setIsFullscreen((f) => !f)}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  onOpenAchievements={() => setShowAchievements(true)}
                  onThemeChange={handleThemeSelect}
                  onApplyPalette={handleApplyPalette}
                  currentTheme={currentTheme}
                  themes={themes}
                />
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
          onThemeSelect={handleThemeSelect}
          isVisible={showThemeSelector}
          onClose={() => setShowThemeSelector(false)}
        />

        <PickerWheelAnalyticsDisplay
          analytics={(() => {
            const currentWheel = getCurrentWheel()
            const wheelData = currentWheel?.data as any
            const totalSpinsFromWheel = wheelData?.totalSpins || 0
            const analyticsData = analyzeSpinData(spinHistory)
            return { ...analyticsData, totalSpins: totalSpinsFromWheel }
          })()}
          isVisible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />

        <PickerWheelSocialHub
          isVisible={showSocialHub}
          onClose={() => setShowSocialHub(false)}
          currentUser={currentUser}
          onShareWheel={() => {}}
        />

        <PickerWheelGameModes
          isVisible={showGameModes}
          onClose={() => setShowGameModes(false)}
          userPoints={totalPoints}
          onStartGame={(gameMode: GameMode) => {
            const currentWheel = getCurrentWheel()
            if (currentWheel) {
              updateWheelData("country-wheel", currentWheel.id, {
                ...currentWheel.data,
                totalSpins: 0,
                spinHistory: [],
                recentResults: [],
                selectedResult: null,
              })
            }
            startAdvancedGame(gameMode)
            setShowGameModes(false)
          }}
        />
      </div>
    </ToastProvider>
  )
}

export default function CountryWheelApp(props: CountryWheelAppProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#a8b5a0]" />}>
      <CountryWheelAppInner {...props} />
    </Suspense>
  )
}
