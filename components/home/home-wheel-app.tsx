"use client"

import { useState, useEffect, useRef, useMemo, type ReactNode } from "react"
import dynamic from "next/dynamic"
import Header from "@/components/header"
import ToolBreadcrumbs from "@/components/tool-breadcrumbs"
import EnhancedWheelSection from "@/components/enhanced-wheel-section"
import { HomeNamePickerTemplates } from "@/components/home/home-name-picker-templates"
import { Button } from "@/components/ui/button"
import { Sparkles, FileText } from "lucide-react"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useEnhancedWheelStore } from "@/stores/enhanced-wheel-store"
import { useSettingsStore } from "@/stores/settings-store"
import { ToastProvider } from "@/contexts/toast-context"
import { usePickerWheelGames } from "@/hooks/use-picker-wheel-games"
import type { Achievement } from "@/lib/picker-wheel-achievements"
import type { WheelTheme } from "@/lib/picker-wheel-themes"
import type { SpinRecord } from "@/lib/picker-wheel-analytics"
import type { SocialProfile } from "@/lib/picker-wheel-social"
import { useGameSession } from "@/hooks/use-game-session"
import { loadCustomization, applyCustomization } from "@/lib/picker-wheel-customization"
import { Badge } from "@/components/ui/badge"
import { ToolFavoriteStar } from "@/components/tool-favorite-star"
import { HOME_SHORT_TITLE } from "@/lib/home-seo"
import {
  getHomeNameTemplate,
  type HomeNameTemplateId,
} from "@/lib/home-name-templates-data"
import type { HomeNameDeepLink } from "@/lib/home-name-picker-spokes"

/** Deferred chunks — keep first paint light for LCP / mobile ranking */
const Confetti = dynamic(() => import("react-confetti"), { ssr: false })
const AIInputPanel = dynamic(() => import("@/components/ai-input-panel"), { ssr: false })
const SettingsPanel = dynamic(() => import("@/components/settings-panel"), { ssr: false })
const PickerWheelInputPanel = dynamic(
  () => import("@/components/picker-wheel/input-panel"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[320px] animate-pulse rounded-lg border bg-gray-50" />
    ),
  },
)
const TemplateSection = dynamic(() => import("@/components/template-section"))
const Footer = dynamic(() => import("@/components/footer"))
const GameStatusBar = dynamic(
  () =>
    import("@/components/picker-wheel-games/game-status-bar").then((m) => ({
      default: m.GameStatusBar,
    })),
  { ssr: false },
)
const GameSelectionDialog = dynamic(
  () =>
    import("@/components/picker-wheel-games/game-selection-dialog").then((m) => ({
      default: m.GameSelectionDialog,
    })),
  { ssr: false },
)
const BingoCard = dynamic(
  () =>
    import("@/components/picker-wheel-games/bingo-card").then((m) => ({
      default: m.BingoCard,
    })),
  { ssr: false },
)
const PickerWheelAchievementsDisplay = dynamic(
  () => import("@/components/picker-wheel-achievements-display"),
  { ssr: false },
)
const PickerWheelThemeSelector = dynamic(
  () => import("@/components/picker-wheel-theme-selector"),
  { ssr: false },
)
const PickerWheelAnalyticsDisplay = dynamic(
  () => import("@/components/picker-wheel-analytics-display"),
  { ssr: false },
)
const PickerWheelSocialHub = dynamic(() => import("@/components/picker-wheel-social-hub"), {
  ssr: false,
})
const PickerWheelGameStatus = dynamic(() => import("@/components/picker-wheel-game-status"), {
  ssr: false,
})
const PickerResultsModal = dynamic(() => import("@/components/picker-results-modal"), {
  ssr: false,
})

export interface WheelOption {
  id: string
  name: string
  image?: string
  color?: string
  weight?: number
  enabled?: boolean
}

type HomeWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: HomeNameDeepLink
}

export default function HomeWheelApp({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: HomeWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [useAIInput, setUseAIInput] = useState(false)
  const [showGames, setShowGames] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [activeTemplateId, setActiveTemplateId] = useState<HomeNameTemplateId | null>(
    deepLink?.templateId ?? null,
  )
  const deepLinkAppliedRef = useRef(false)
  
  // Advanced game session management
  const {
    currentSession,
    isGameActive: isAdvancedGameActive,
    startGame: startAdvancedGame,
    endGame: endAdvancedGame,
    restartGame: restartAdvancedGame,
    recordSpin,
    getGameProgress,
    isGameComplete,
    getGameScore,
    getGameResults,
    getGameStats
  } = useGameSession()
  const [themes, setThemes] = useState<WheelTheme[]>([])
  const [currentTheme, setCurrentTheme] = useState('classic')
  const [totalPoints, setTotalPoints] = useState(0)
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [currentUser, setCurrentUser] = useState<SocialProfile | undefined>()
  const lastProcessedResult = useRef<string>('')
  const { setCurrentTool, createNewWheel, getCurrentWheel, currentWheelId } = useWheelManagerStore()
  const { setTemplateOptions, selectedResult, getOptions, getTotalSpins } = useEnhancedWheelStore()
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()

  const applyNameTemplate = (templateId: HomeNameTemplateId) => {
    const template = getHomeNameTemplate(templateId)
    if (!template) return
    setTemplateOptions(template.options)
    setActiveTemplateId(templateId)
  }

  // Apply spoke deep-link once the picker-wheel tool/wheel is ready
  useEffect(() => {
    if (!deepLink?.templateId || deepLinkAppliedRef.current) return
    if (!currentWheelId) return
    deepLinkAppliedRef.current = true
    applyNameTemplate(deepLink.templateId)
  }, [deepLink?.templateId, currentWheelId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Customization state
  const [showCustomization, setShowCustomization] = useState(false)
  const [customization, setCustomization] = useState(() => loadCustomization())
  const [showConfetti, setShowConfetti] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [analyticsSnapshot, setAnalyticsSnapshot] = useState<ReturnType<
    typeof import("@/lib/picker-wheel-analytics").analyzeSpinData
  > | null>(null)

  const pickerWheels = useWheelManagerStore((state) => state.wheelsByTool["picker-wheel"])

  const allWheelResults = useMemo(() => {
    const wheels = pickerWheels || []
    return wheels
      .flatMap((wheel) => {
        const results = (wheel.data as any)?.recentResults || []
        return results.map((result: any) => ({
          ...result,
          wheelId: result.wheelId || wheel.id,
          wheelName: result.wheelName || wheel.name,
        }))
      })
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  }, [pickerWheels])

  // Get current wheel options using the proper getter
  const options = getOptions()

  // Game functionality
  const {
    gameMode,
    setGameMode,
    bingoCard,
    memoryChallenge,
    collectionProgress,
    sequenceTarget,
    sequenceProgress,
    gameTimer,
    isGameActive,
    gameStats,
    handleGameSpin,
    resetGame,
    startGame,
  } = usePickerWheelGames({
    options,
    selectedOption: selectedResult,
    setSelectedOption: () => {}, // This will be handled by the wheel component
  })

  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [
          { PICKER_WHEEL_ACHIEVEMENTS },
          { PICKER_WHEEL_THEMES },
        ] = await Promise.all([
          import("@/lib/picker-wheel-achievements"),
          import("@/lib/picker-wheel-themes"),
        ])

        // Load settings; wheels stay in localStorage via zustand persist
        await loadSettings()

        // Set current tool (restores last wheel for this tool from localStorage)
        setCurrentTool("picker-wheel")

        const {
          isFirstVisit,
          setFirstVisitComplete,
          getCurrentWheel,
          updateWheelName,
        } = useWheelManagerStore.getState()

        if (isFirstVisit) {
          const wheel = getCurrentWheel()
          if (wheel) {
            updateWheelName("picker-wheel", wheel.id, "My First Wheel")
          }
          setFirstVisitComplete()
        } else if (!getCurrentWheel()) {
          createNewWheel("picker-wheel", "My Wheel")
        }

        // Load achievements and themes from wheel data
        const currentWheel = getCurrentWheel()
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as any;
          if (wheelData.achievements) {
            setAchievements(wheelData.achievements)
            const points = wheelData.achievements
              .filter((a: any) => a.completed)
              .reduce((sum: number, a: any) => sum + a.points, 0)
            setTotalPoints(points)
          } else {
            setAchievements(PICKER_WHEEL_ACHIEVEMENTS)
          }
          
          if (wheelData.themes) {
            setThemes(wheelData.themes)
          } else {
            setThemes(PICKER_WHEEL_THEMES)
          }
          
          if (wheelData.currentTheme) {
            setCurrentTheme(wheelData.currentTheme)
          } else {
            setCurrentTheme('classic')
          }
          
          if (wheelData.spinHistory) {
            setSpinHistory(wheelData.spinHistory.map((record: any) => ({
              ...record,
              timestamp: new Date(record.timestamp)
            })))
          }
        } else {
          setAchievements(PICKER_WHEEL_ACHIEVEMENTS)
          setThemes(PICKER_WHEEL_THEMES)
        }
      } catch (error) {
        console.error("Error initializing app:", error)
      }
    }

    initializeApp()
  }, [setCurrentTool, createNewWheel, loadSettings])

  // Handle game spin when result is selected
  useEffect(() => {
    if (selectedResult && gameMode !== "normal" && isGameActive) {
      handleGameSpin(selectedResult)
    }
  }, [selectedResult, gameMode, isGameActive, handleGameSpin])

  // Check achievements and record analytics when result changes
  useEffect(() => {
    const resultName = typeof selectedResult === 'string' ? selectedResult : selectedResult?.name
    if (selectedResult && resultName && resultName !== lastProcessedResult.current) {
      lastProcessedResult.current = resultName
      void (async () => {
        const { checkAchievementUnlocks } = await import("@/lib/picker-wheel-achievements")
        const { checkThemeUnlocks } = await import("@/lib/picker-wheel-themes")

        const totalSpins = getTotalSpins()
        const options = getOptions()
        const uniqueResults = new Set(spinHistory.map(r => r.result)).size
        
        // Record the spin for analytics
        const newSpinRecord: SpinRecord = {
          id: Date.now().toString(),
          timestamp: new Date(),
          result: resultName,
          options: options.map(opt => opt.name),
          mode: 'manual', // This will be updated based on actual mode
          theme: currentTheme,
          spinDuration: 3, // This will be updated with actual duration
          userQuestion: undefined
        }
        
        const updatedSpinHistory = [...spinHistory, newSpinRecord]
        setSpinHistory(updatedSpinHistory)
        
        // Get game stats from the games hook
        const stats = {
          totalSpins,
          uniqueResults,
          perfectMemoryRounds: gameStats?.perfectMemoryRounds || 0,
          bingoWins: gameStats?.bingoWins || 0,
          fastestMemoryTime: gameStats?.fastestMemoryRounds || 0,
          consecutiveDays: 1, // TODO: Implement consecutive days tracking
          totalOptions: options.length,
          aiGeneratedOptions: 0, // TODO: Track AI-generated options
          mysterySpins: 0 // TODO: Track mystery spins
        }

        const updatedAchievements = checkAchievementUnlocks(achievements, stats)
        const newlyCompleted = updatedAchievements.filter(a => 
          a.completed && !achievements.find(oa => oa.id === a.id)?.completed
        )

        if (newlyCompleted.length > 0) {
          setAchievements(updatedAchievements)
          const newPoints = newlyCompleted.reduce((sum, a) => sum + a.points, 0)
          setTotalPoints(prev => prev + newPoints)

          // Check for theme unlocks
          const updatedThemes = checkThemeUnlocks(themes, {
            totalSpins,
            totalPoints: totalPoints + newPoints
          })
          const newlyUnlockedThemes = updatedThemes.filter(t => 
            t.unlocked && !themes.find(ot => ot.id === t.id)?.unlocked
          )
          
          if (newlyUnlockedThemes.length > 0) {
            setThemes(updatedThemes)
          }

          // Save achievements, themes, and spin history to wheel data
          const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
          const currentWheel = getCurrentWheel()
          if (currentWheel) {
            updateWheelData("picker-wheel", currentWheel.id, {
              ...currentWheel.data,
              achievements: updatedAchievements,
              themes: updatedThemes,
              spinHistory: updatedSpinHistory
            })
          }
        } else {
          // Save spin history even if no new achievements
          const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
          const currentWheel = getCurrentWheel()
          if (currentWheel) {
            updateWheelData("picker-wheel", currentWheel.id, {
              ...currentWheel.data,
              spinHistory: updatedSpinHistory
            })
          }
        }
      })()
    }
  }, [selectedResult, achievements, gameStats, themes, totalPoints])

  // Handle advanced game spin recording - REMOVED DUPLICATE LOGIC
  // The handleSpinCompleted callback will handle all spin recording

  // Apply customization on mount
  useEffect(() => {
    applyCustomization(customization)
  }, [customization])

  // Handle theme selection
  const handleThemeSelect = async (themeId: string) => {
    setCurrentTheme(themeId)

    const { PICKER_WHEEL_THEMES } = await import("@/lib/picker-wheel-themes")
    const theme = PICKER_WHEEL_THEMES.find((t) => t.id === themeId)
    if (theme?.colors?.length) {
      const { settings, updateSettings } = useSettingsStore.getState()
      updateSettings({
        appearance: {
          ...settings.appearance,
          toolColors: [...theme.colors],
        },
      })
    }

    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      const options = ((currentWheel.data as any)?.options || []).map((option: any, index: number) => ({
        ...option,
        color: theme?.colors?.length ? theme.colors[index % theme.colors.length] : option.color,
      }))
      updateWheelData("picker-wheel", currentWheel.id, {
        ...currentWheel.data,
        currentTheme: themeId,
        options,
      })
    }
  }

  const handleApplyCustomization = (newCustomization: any) => {
    setCustomization(newCustomization)
    applyCustomization(newCustomization)
  }

  // Callback to update spin history when a spin is completed
  const handleSpinCompleted = () => {
    // Record spin for game session if active
    if (isAdvancedGameActive && currentSession) {
      // Get the result from the wheel data
      const currentWheel = getCurrentWheel();
      if (currentWheel?.data) {
        const wheelData = currentWheel.data as any;
        
        if (wheelData.selectedResult) {
          recordSpin(wheelData.selectedResult.name);
        }
      }
    }

    // Update spin history from wheel data
    const currentWheel = getCurrentWheel();
    if (currentWheel?.data) {
      const wheelData = currentWheel.data as any;
      if (wheelData.spinHistory) {
        setSpinHistory(wheelData.spinHistory);
      }
    }
  };

  // Spin history updates via handleSpinCompleted — no polling

  useEffect(() => {
    if (!isFullscreen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFullscreen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isFullscreen])

  const toggleFullscreen = () => setIsFullscreen((value) => !value)

  const openAnalytics = () => {
    void import("@/lib/picker-wheel-analytics").then(({ analyzeSpinData }) => {
      setAnalyticsSnapshot(analyzeSpinData(spinHistory))
      setShowAnalytics(true)
    })
  }

  const wheelSection = (
    <EnhancedWheelSection
      onOpenAchievements={() => setShowAchievements(true)}
      onOpenThemeSelector={() => setShowThemeSelector(true)}
      onOpenAnalytics={openAnalytics}
      onOpenSocialHub={() => setShowSocialHub(true)}
      onOpenGameModes={() => setShowGames(true)}
      onOpenCustomization={() => setShowCustomization(true)}
      customization={customization}
      totalPoints={totalPoints}
      currentTheme={currentTheme}
      themes={themes}
      spinHistory={spinHistory}
      currentUser={currentUser}
      isGameActive={isAdvancedGameActive}
      currentGameMode={currentSession?.gameMode.name}
      onSpinCompleted={handleSpinCompleted}
      onConfettiChange={setShowConfetti}
      isFullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    />
  )

  return (
    <ToastProvider>
      {showConfetti && settings.confettiSound?.enableConfetti !== false && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
          numberOfPieces={typeof window !== "undefined" && window.innerWidth < 640 ? 160 : 320}
          recycle={false}
          gravity={0.3}
          wind={0.05}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 9999, pointerEvents: "none" }}
        />
      )}
      <div
        className={
          isFullscreen
            ? "fixed inset-0 z-50 overflow-auto bg-white"
            : "min-h-screen overflow-x-hidden transition-colors duration-300"
        }
        style={
          isFullscreen
            ? undefined
            : {
                backgroundColor: settings.appearance.backgroundColor,
                backgroundImage: settings.appearance.backgroundImage
                  ? `url(${settings.appearance.backgroundImage})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
        }
      >
        {!isFullscreen && settings.appearance.bannerLogo && (
          <div className="py-3 text-center sm:py-4">
            <img
              src={settings.appearance.bannerLogo || "/placeholder.svg"}
              alt="Banner Logo"
              className="mx-auto h-12 object-contain sm:h-16"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        {!isFullscreen && (
          <Header
            onOpenSettings={() => setShowSettings(true)}
            onOpenGames={() => setShowGames(true)}
          />
        )}

        {isFullscreen ? (
          <div className="flex min-h-full flex-col items-center justify-center p-3 sm:p-4">
            {wheelSection}
          </div>
        ) : (
        <main className="w-full px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-3 text-center sm:mb-4">
            <div className="flex flex-wrap items-center justify-center gap-2 px-1">
              <p className="font-spin-display text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">
                {shortTitle ?? HOME_SHORT_TITLE}
              </p>
              <ToolFavoriteStar toolType="picker-wheel" />
            </div>
            {toolSubtitle && (
              <p className="mt-1 px-2 text-sm text-gray-600">{toolSubtitle}</p>
            )}
          </div>

          <HomeNamePickerTemplates
            activeId={activeTemplateId}
            onSelectTemplate={(options, templateId) => {
              setTemplateOptions(options)
              if (templateId) setActiveTemplateId(templateId)
            }}
          />
          {activeTemplateId && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <Badge className="bg-slate-800 text-white hover:bg-slate-800">
                Template: {getHomeNameTemplate(activeTemplateId)?.label}
              </Badge>
            </div>
          )}

          {/* Game Status Bar */}
          {gameMode !== "normal" && (
            <GameStatusBar
              gameMode={gameMode}
              isGameActive={isGameActive}
              gameTimer={gameTimer}
              gameStats={gameStats}
              resetGame={resetGame}
              bingoCard={bingoCard}
              memoryChallenge={memoryChallenge}
              collectionProgress={collectionProgress}
              sequenceTarget={sequenceTarget}
              sequenceProgress={sequenceProgress}
            />
          )}

          {/* Advanced Game Modes Status */}
          {currentSession && (
            <PickerWheelGameStatus
              session={currentSession}
              onEndGame={() => {
                endAdvancedGame()
                const gameScore = getGameScore()
                setTotalPoints((prev) => prev + gameScore)
                const gameStats = getGameStats()
                if (gameStats) {
                  console.log("Game completed:", gameStats)
                }
              }}
              onRestartGame={() => {
                const gameScore = getGameScore()
                setTotalPoints((prev) => prev + gameScore)
                const gameStats = getGameStats()
                if (gameStats) {
                  console.log("Game completed:", gameStats)
                }
                const currentWheel = getCurrentWheel()
                if (currentWheel) {
                  const { updateWheelData } = useWheelManagerStore.getState()
                  updateWheelData("picker-wheel", currentWheel.id, {
                    ...currentWheel.data,
                    totalSpins: 0,
                    spinHistory: [],
                    recentResults: [],
                    selectedResult: null,
                  })
                }
                restartAdvancedGame()
              }}
            />
          )}

          {/* Input Mode Toggle */}
          <div className="mb-4 flex justify-center sm:mb-6">
            <div className="flex flex-wrap justify-center rounded-lg bg-gray-100 p-1">
              <Button
                variant={!useAIInput ? "default" : "ghost"}
                size="sm"
                onClick={() => setUseAIInput(false)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Manual Input
              </Button>
              <Button
                variant={useAIInput ? "default" : "ghost"}
                size="sm"
                onClick={() => setUseAIInput(true)}
                className={`flex items-center gap-2 ${
                  useAIInput
                    ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-600 hover:to-pink-600"
                    : "bg-white"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span
                  className={
                    useAIInput
                      ? "text-white"
                      : "bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"
                  }
                >
                  AI-Powered
                </span>
              </Button>
            </div>
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="relative overflow-x-hidden rounded-lg border bg-white p-3 shadow-sm sm:p-6 lg:col-span-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResultsModal(true)}
                className="absolute left-2 top-2 z-10 border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50 sm:left-4 sm:top-4 sm:px-3"
              >
                Results
                {allWheelResults.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {allWheelResults.length}
                  </Badge>
                )}
              </Button>

              <div className="flex justify-center pt-8 sm:pt-4">{wheelSection}</div>

              {gameMode === "bingo" && bingoCard && (
                <div className="mt-6">
                  <BingoCard bingoCard={bingoCard} />
                </div>
              )}
            </div>
            {useAIInput ? (
              <AIInputPanel />
            ) : (
              <PickerWheelInputPanel
                onViewResults={() => setShowResultsModal(true)}
                onOpenSettings={() => setShowSettings(true)}
                onOpenAI={() => setUseAIInput(true)}
                onOpenAnalytics={openAnalytics}
              />
            )}
          </div>

          {showResultsModal && (
            <PickerResultsModal
              isOpen={showResultsModal}
              onClose={() => setShowResultsModal(false)}
              results={allWheelResults}
            />
          )}

          <ToolBreadcrumbs />
          {seoIntro}

          <TemplateSection onSelectTemplate={setTemplateOptions} />

          {seoSections}
        </main>
        )}

        {!isFullscreen && <Footer />}

        {showSettings && (
          <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        )}

        {showGames && (
          <GameSelectionDialog
            showGames={showGames}
            setShowGames={setShowGames}
            gameStats={gameStats}
            gameMode={gameMode}
            setGameMode={startGame}
            resetGame={resetGame}
          />
        )}

        {showAchievements && (
          <PickerWheelAchievementsDisplay
            achievements={achievements}
            totalPoints={totalPoints}
            isVisible={showAchievements}
            onClose={() => setShowAchievements(false)}
          />
        )}

        {showThemeSelector && (
          <PickerWheelThemeSelector
            themes={themes}
            currentTheme={currentTheme}
            onThemeSelect={handleThemeSelect}
            isVisible={showThemeSelector}
            onClose={() => setShowThemeSelector(false)}
          />
        )}

        {showAnalytics && analyticsSnapshot && (
          <PickerWheelAnalyticsDisplay
            analytics={analyticsSnapshot}
            isVisible={showAnalytics}
            onClose={() => setShowAnalytics(false)}
          />
        )}

        {showSocialHub && (
          <PickerWheelSocialHub
            isVisible={showSocialHub}
            onClose={() => setShowSocialHub(false)}
            currentUser={currentUser}
            onShareWheel={() => {
              console.log("Share wheel functionality")
            }}
          />
        )}
      </div>
    </ToastProvider>
  )
}
