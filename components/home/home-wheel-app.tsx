"use client"

import { useState, useEffect, useRef, useMemo, type ReactNode } from "react"
import Header from "@/components/header"
import EnhancedWheelSection from "@/components/enhanced-wheel-section"
import PickerWheelInputPanel from "@/components/picker-wheel/input-panel"
import AIInputPanel from "@/components/ai-input-panel"
import TemplateSection from "@/components/template-section"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import { Button } from "@/components/ui/button"
import { Sparkles, FileText } from "lucide-react"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useEnhancedWheelStore } from "@/stores/enhanced-wheel-store"
import { useSettingsStore } from "@/stores/settings-store"
import { ToastProvider } from "@/contexts/toast-context"
import { GameSelectionDialog } from "@/components/picker-wheel-games/game-selection-dialog"
import { GameStatusBar } from "@/components/picker-wheel-games/game-status-bar"
import { BingoCard } from "@/components/picker-wheel-games/bingo-card"
import { usePickerWheelGames } from "@/hooks/use-picker-wheel-games"
import PickerWheelAchievementsDisplay from "@/components/picker-wheel-achievements-display"
import PickerWheelThemeSelector from "@/components/picker-wheel-theme-selector"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import PickerWheelGameModes from "@/components/picker-wheel-game-modes"
import { PICKER_WHEEL_ACHIEVEMENTS, checkAchievementUnlocks } from "@/lib/picker-wheel-achievements"
import { PICKER_WHEEL_THEMES, checkThemeUnlocks } from "@/lib/picker-wheel-themes"
import { analyzeSpinData, SpinRecord } from "@/lib/picker-wheel-analytics"
import { SocialProfile, calculateLevel } from "@/lib/picker-wheel-social"
import { GameMode } from "@/lib/picker-wheel-game-modes"
import { useGameSession } from "@/hooks/use-game-session"
import PickerWheelGameStatus from "@/components/picker-wheel-game-status"
import { PickerWheelCustomizationPanel } from '@/components/picker-wheel-customization-panel'
import { loadCustomization, applyCustomization } from '@/lib/picker-wheel-customization'
import Confetti from "react-confetti"
import PickerResultsModal from "@/components/picker-results-modal"
import { Badge } from "@/components/ui/badge"
import { ToolFavoriteStar } from "@/components/tool-favorite-star"
import { HOME_SHORT_TITLE } from "@/lib/home-seo"

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
}

export default function HomeWheelApp({ seoIntro, seoSections }: HomeWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [useAIInput, setUseAIInput] = useState(false)
  const [showGames, setShowGames] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [achievements, setAchievements] = useState(PICKER_WHEEL_ACHIEVEMENTS)
  
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
  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES)
  const [currentTheme, setCurrentTheme] = useState('classic')
  const [totalPoints, setTotalPoints] = useState(0)
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [currentUser, setCurrentUser] = useState<SocialProfile | undefined>()
  const lastProcessedResult = useRef<string>('')
  const { setCurrentTool, createNewWheel, getCurrentWheel } = useWheelManagerStore()
  const { setTemplateOptions, selectedResult, getOptions, getTotalSpins } = useEnhancedWheelStore()
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()

  // Customization state
  const [showCustomization, setShowCustomization] = useState(false)
  const [customization, setCustomization] = useState(() => loadCustomization())
  const [showConfetti, setShowConfetti] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

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
          }
          
          if (wheelData.themes) {
            setThemes(wheelData.themes)
          } else {
            // Initialize with default themes if none exist
            setThemes(PICKER_WHEEL_THEMES)
          }
          
          if (wheelData.currentTheme) {
            setCurrentTheme(wheelData.currentTheme)
          } else {
            // Set default theme if none exists
            setCurrentTheme('classic')
          }
          
          if (wheelData.spinHistory) {
            setSpinHistory(wheelData.spinHistory.map((record: any) => ({
              ...record,
              timestamp: new Date(record.timestamp)
            })))
          }
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
    }
  }, [selectedResult, achievements, gameStats, themes, totalPoints])

  // Handle advanced game spin recording - REMOVED DUPLICATE LOGIC
  // The handleSpinCompleted callback will handle all spin recording

  // Apply customization on mount
  useEffect(() => {
    applyCustomization(customization)
  }, [customization])

  // Handle theme selection
  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId)

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

  const wheelSection = (
    <EnhancedWheelSection
      onOpenAchievements={() => setShowAchievements(true)}
      onOpenThemeSelector={() => setShowThemeSelector(true)}
      onOpenAnalytics={() => setShowAnalytics(true)}
      onOpenSocialHub={() => setShowSocialHub(true)}
      onOpenGameModes={() => setShowGameModes(true)}
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
      {showConfetti && <Confetti width={typeof window !== 'undefined' ? window.innerWidth : 1920} height={typeof window !== 'undefined' ? window.innerHeight : 1080} numberOfPieces={400} recycle={false} gravity={0.3} wind={0.05} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }} />}
      <div
        className={
          isFullscreen
            ? "fixed inset-0 z-50 bg-white overflow-auto"
            : "min-h-screen transition-colors duration-300 overflow-x-hidden"
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
          <div className="text-center py-4">
            <img
              src={settings.appearance.bannerLogo || "/placeholder.svg"}
              alt="Banner Logo"
              className="h-16 mx-auto object-contain"
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
          <div className="flex min-h-full flex-col items-center justify-center p-4">
            {wheelSection}
          </div>
        ) : (
        <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="font-spin-display text-2xl font-bold text-gray-800 sm:text-3xl">
                {HOME_SHORT_TITLE}
              </p>
              <ToolFavoriteStar toolType="picker-wheel" />
            </div>
          </div>

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
                // Add game points to total points
                const gameScore = getGameScore()
                setTotalPoints(prev => prev + gameScore)
                
                // Save game stats
                const gameStats = getGameStats()
                if (gameStats) {
                  console.log('Game completed:', gameStats)
                }
              }}
              onRestartGame={() => {
                // Add current game points to total points before restarting
                const gameScore = getGameScore()
                setTotalPoints(prev => prev + gameScore)
                
                // Save game stats
                const gameStats = getGameStats()
                if (gameStats) {
                  console.log('Game completed:', gameStats)
                }
                
                // Reset wheel data for restart
                const currentWheel = getCurrentWheel();
                if (currentWheel) {
                  const { updateWheelData } = useWheelManagerStore.getState();
                  updateWheelData("picker-wheel", currentWheel.id, {
                    ...currentWheel.data,
                    totalSpins: 0,
                    spinHistory: [],
                    recentResults: [],
                    selectedResult: null
                  });
                }
                
                // Restart the game
                restartAdvancedGame()
              }}
            />
          )}

          {/* Input Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
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
                <span className={useAIInput ? "text-white" : "bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"}>
                  AI-Powered
                </span>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="relative lg:col-span-2 bg-white rounded-lg shadow-sm border p-6 overflow-hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResultsModal(true)}
                className="absolute top-4 left-4 z-10 text-xs px-3 py-1 bg-white hover:bg-gray-50 shadow-sm border-blue-500 text-blue-600 hover:border-blue-600"
              >
                Results
                {allWheelResults.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {allWheelResults.length}
                  </Badge>
                )}
              </Button>

              {wheelSection}
              
              {/* Game-specific displays */}
              {gameMode === "bingo" && bingoCard && (
                <div className="mt-6">
                  <BingoCard bingoCard={bingoCard} />
                </div>
              )}
            </div>
            {useAIInput ? <AIInputPanel /> : (
              <PickerWheelInputPanel
                onViewResults={() => setShowResultsModal(true)}
                onOpenSettings={() => setShowSettings(true)}
                onOpenAI={() => setUseAIInput(true)}
                onOpenAnalytics={() => setShowAnalytics(true)}
              />
            )}
          </div>

          <PickerResultsModal
            isOpen={showResultsModal}
            onClose={() => setShowResultsModal(false)}
            results={allWheelResults}
          />

          {seoIntro}

          <TemplateSection onSelectTemplate={setTemplateOptions} />

          {seoSections}
        </main>
        )}

        {!isFullscreen && <Footer />}

        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        
        <GameSelectionDialog
          showGames={showGames}
          setShowGames={setShowGames}
          gameStats={gameStats}
          gameMode={gameMode}
          setGameMode={startGame}
          resetGame={resetGame}
        />

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
          analytics={analyzeSpinData(spinHistory)}
          isVisible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />

        <PickerWheelSocialHub
          isVisible={showSocialHub}
          onClose={() => setShowSocialHub(false)}
          currentUser={currentUser}
          onShareWheel={() => {
            // TODO: Implement wheel sharing functionality
            console.log('Share wheel functionality')
          }}
        />

        <PickerWheelGameModes
          isVisible={showGameModes}
          onClose={() => setShowGameModes(false)}
          userPoints={totalPoints}
          onStartGame={(gameMode: GameMode) => {
            // Reset wheel data for new game
            const currentWheel = getCurrentWheel();
            if (currentWheel) {
              const { updateWheelData } = useWheelManagerStore.getState();
              updateWheelData("picker-wheel", currentWheel.id, {
                ...currentWheel.data,
                totalSpins: 0,
                spinHistory: [],
                recentResults: [],
                selectedResult: null
              });
            }
            
            startAdvancedGame(gameMode)
            setShowGameModes(false)
          }}
        />

        {/* Customization Panel - commented out for now
        <PickerWheelCustomizationPanel
          isOpen={showCustomization}
          onClose={() => setShowCustomization(false)}
          onApply={handleApplyCustomization}
        />
        */}
      </div>
    </ToastProvider>
  )
}
