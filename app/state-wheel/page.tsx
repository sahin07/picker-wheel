"use client"

import { useState, useEffect, useRef } from "react"
import Header from "@/components/header"
import StateWheelSection from "@/components/state-wheel-section"
import StateAIWheelSection from "@/components/state-ai-wheel-section"
import StateInputPanel from "@/components/state-input-panel"
import SettingsPanel from "@/components/settings-panel"
import { useSettingsStore } from "@/stores/settings-store"
import { useStateWheelStore } from "@/stores/state-wheel-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { ToastProvider } from "@/contexts/toast-context"
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
import { Button } from "@/components/ui/button"
import { ToolPageTitle } from "@/components/tool-favorite-star"

export default function StateWheelPage() {
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual')
  const [showAchievements, setShowAchievements] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [achievements, setAchievements] = useState(PICKER_WHEEL_ACHIEVEMENTS)
  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES)
  const [currentTheme, setCurrentTheme] = useState('classic')
  const [totalPoints, setTotalPoints] = useState(0)
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [currentUser, setCurrentUser] = useState<SocialProfile | undefined>()
  const lastProcessedResult = useRef<string>('')
  
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

  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()
  const { viewMode } = useStateWheelStore()
  const { setCurrentTool, getCurrentWheel, createNewWheel, updateWheelData } = useWheelManagerStore();

  // Listen to spin results from the wheel store
  const [lastSpinResult, setLastSpinResult] = useState<any>(null);

  // Listen for changes in wheel data and update spinHistory
  useEffect(() => {
    const unsubscribe = useWheelManagerStore.subscribe(
      (state) => {
        const currentWheel = state.getCurrentWheel();
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as any;
          if (wheelData.spinHistory && wheelData.spinHistory.length !== spinHistory.length) {
            setSpinHistory(wheelData.spinHistory);
          }
        }
      }
    );

    return unsubscribe;
  }, [spinHistory.length]);

  useEffect(() => {
    setCurrentTool("state-wheel");
    const initializeApp = async () => {
      try {
        await loadSettings()
        // Initialize with all states selected
        // Client-only: create wheel if none exists
        if (typeof window !== "undefined") {
          const wheel = getCurrentWheel();
          if (!wheel) {
            const id = `state-wheel-${Date.now()}`;
            const now = new Date().toISOString();
            createNewWheel("state-wheel", "My State Wheel", id, now, now);
          }
        }

        // Load achievements and themes from wheel data
        const currentWheel = getCurrentWheel()
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as any; // Use any for now to avoid type issues
          
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
          }
          
          if (wheelData.spinHistory) {
            setSpinHistory(wheelData.spinHistory)
          } else {
            setSpinHistory([])
          }
        }
      } catch (error) {
        console.error("Error initializing state wheel:", error)
      }
    }
    initializeApp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle spin results and game session integration - REMOVED DUPLICATE LOGIC
  // The handleSpinCompleted callback will handle all spin recording

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

  // Poll for spin history updates (fallback mechanism)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentWheel = getCurrentWheel();
      if (currentWheel?.data) {
        const wheelData = currentWheel.data as any;
        if (wheelData.spinHistory && wheelData.spinHistory.length !== spinHistory.length) {
          setSpinHistory(wheelData.spinHistory);
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [spinHistory.length, getCurrentWheel]);

  // Handle theme selection
  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId);
    
    // Save theme selection to wheel data
    const currentWheel = getCurrentWheel();
    if (currentWheel) {
      updateWheelData("state-wheel", currentWheel.id, {
        ...currentWheel.data,
        currentTheme: themeId
      });
    }
  };

  return (
    <ToastProvider>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: "#a8b5a0", // Sage green background like in screenshot
          backgroundImage: settings.appearance.backgroundImage
            ? `url(${settings.appearance.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {settings.appearance.bannerLogo && (
          <div className="text-center py-4">
            <img
              src={settings.appearance.bannerLogo || "/placeholder.svg"}
              alt="Banner Logo"
              className="h-16 mx-auto object-contain"
            />
          </div>
        )}

        <Header onOpenSettings={() => setShowSettings(true)} />

        <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <ToolPageTitle title="State Picker Wheel" toolType="state-wheel" />
            <p className="text-gray-600">Pick a random state from a country</p>
          </div>

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
                  // Game completed successfully
                }
              }}
              onRestartGame={() => {
                // Add current game points to total points before restarting
                const gameScore = getGameScore()
                setTotalPoints(prev => prev + gameScore)
                
                // Save game stats
                const gameStats = getGameStats()
                if (gameStats) {
                  // Game completed successfully
                }
                
                // Reset wheel data before restarting game
                const currentWheel = getCurrentWheel();
                if (currentWheel) {
                  updateWheelData("state-wheel", currentWheel.id, {
                    ...currentWheel.data,
                    totalSpins: 0,
                    spinHistory: [],
                    recentResults: [],
                    selectedResult: null,
                  });
                }
                
                // Restart the game
                restartAdvancedGame()
              }}
            />
          )}

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
            {viewMode === "wheel" ? (
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  {activeTab === 'manual' ? (
                    <StateWheelSection 
                      onOpenAchievements={() => setShowAchievements(true)}
                      onOpenThemeSelector={() => setShowThemeSelector(true)}
                      onOpenAnalytics={() => setShowAnalytics(true)}
                      onOpenSocialHub={() => setShowSocialHub(true)}
                      onOpenGameModes={() => setShowGameModes(true)}
                      totalPoints={totalPoints}
                      currentTheme={currentTheme}
                      themes={themes}
                      spinHistory={spinHistory}
                      currentUser={currentUser}
                      isGameActive={isAdvancedGameActive}
                      currentGameMode={currentSession?.gameMode.name}
                      onSpinCompleted={handleSpinCompleted}
                    />
                  ) : (
                    <StateAIWheelSection 
                      onOpenAchievements={() => setShowAchievements(true)}
                      onOpenThemeSelector={() => setShowThemeSelector(true)}
                      onOpenAnalytics={() => setShowAnalytics(true)}
                      onOpenSocialHub={() => setShowSocialHub(true)}
                      onOpenGameModes={() => setShowGameModes(true)}
                      totalPoints={totalPoints}
                      currentTheme={currentTheme}
                      themes={themes}
                      spinHistory={spinHistory}
                      currentUser={currentUser}
                      isGameActive={isAdvancedGameActive}
                      currentGameMode={currentSession?.gameMode.name}
                      onSpinCompleted={handleSpinCompleted}
                    />
                  )}
                </div>
                <StateInputPanel onTabChange={setActiveTab} activeTab={activeTab} />
              </div>
            ) : (
              <div className="grid lg:grid-cols-1 gap-8">
                <StateInputPanel onTabChange={setActiveTab} activeTab={activeTab} />
              </div>
            )}
          </div>
        </main>

        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

        <PickerWheelAchievementsDisplay
          achievements={achievements}
          totalPoints={totalPoints}
          isVisible={showAchievements}
          onClose={() => {
            setShowAchievements(false);
          }}
        />

        <PickerWheelThemeSelector
          themes={themes}
          currentTheme={currentTheme}
          onThemeSelect={handleThemeSelect}
          isVisible={showThemeSelector}
          onClose={() => {
            setShowThemeSelector(false);
          }}
        />

        <PickerWheelAnalyticsDisplay
          analytics={(() => {
            const analyticsData = analyzeSpinData(spinHistory);
            return analyticsData;
          })()}
          isVisible={showAnalytics}
          onClose={() => {
            setShowAnalytics(false);
          }}
        />

        <PickerWheelSocialHub
          isVisible={showSocialHub}
          onClose={() => {
            setShowSocialHub(false);
          }}
          currentUser={currentUser}
          onShareWheel={() => {
            // TODO: Implement wheel sharing functionality
          }}
        />

        <PickerWheelGameModes
          isVisible={showGameModes}
          onClose={() => {
            setShowGameModes(false);
          }}
          userPoints={totalPoints}
          onStartGame={(gameMode: GameMode) => {
            // Reset wheel data before starting new game
            const currentWheel = getCurrentWheel();
            if (currentWheel) {
              updateWheelData("state-wheel", currentWheel.id, {
                ...currentWheel.data,
                totalSpins: 0,
                spinHistory: [],
                recentResults: [],
                selectedResult: null,
              });
            }
            
            startAdvancedGame(gameMode)
            setShowGameModes(false)
          }}
        />
      </div>
    </ToastProvider>
  )
}
