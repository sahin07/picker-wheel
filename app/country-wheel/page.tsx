"use client"

import { useState, useEffect, useRef } from "react"
import Header from "@/components/header"
import CountryWheelSection from "@/components/country-wheel-section"
import CountryAIWheelSection from "@/components/country-ai-wheel-section"
import CountryInputPanel from "@/components/country-input-panel"
import SettingsPanel from "@/components/settings-panel"
import { useSettingsStore } from "@/stores/settings-store"
import { useCountryWheelStore } from "@/stores/country-wheel-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { ToastProvider } from "@/contexts/toast-context"
import PickerWheelAchievementsDisplay from "@/components/picker-wheel-achievements-display"
import PickerWheelThemeSelector from "@/components/picker-wheel-theme-selector"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import PickerWheelGameModes from "@/components/picker-wheel-game-modes"
import PickerWheelGameStatus from "@/components/picker-wheel-game-status"
import { PICKER_WHEEL_ACHIEVEMENTS, checkAchievementUnlocks } from "@/lib/picker-wheel-achievements"
import { PICKER_WHEEL_THEMES, checkThemeUnlocks } from "@/lib/picker-wheel-themes"
import { analyzeSpinData, SpinRecord } from "@/lib/picker-wheel-analytics"
import { SocialProfile, calculateLevel } from "@/lib/picker-wheel-social"
import { GameMode } from "@/lib/picker-wheel-game-modes"
import { useGameSession } from "@/hooks/use-game-session"
import { Button } from "@/components/ui/button"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { getCountriesByRegion } from "@/data/countries"

export default function CountryWheelPage() {
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
  const { viewMode, selectedCountries } = useCountryWheelStore()
  const { setCurrentTool, getCurrentWheel, createNewWheel, updateWheelData } = useWheelManagerStore();

  // Listen to spin results from the wheel store
  const [lastSpinResult, setLastSpinResult] = useState<any>(null);

  useEffect(() => {
    setCurrentTool("country-wheel");
    const initializeApp = async () => {
      try {
        await loadSettings()
        // Client-only: create wheel if none exists, or backfill all countries if empty
        if (typeof window !== "undefined") {
          let wheel = getCurrentWheel();
          if (!wheel) {
            const id = `country-wheel-${Date.now()}`;
            const now = new Date().toISOString();
            createNewWheel("country-wheel", "My Country Wheel", id, now, now);
            wheel = getCurrentWheel();
          }

          if (wheel?.toolType === "country-wheel") {
            const wheelData = wheel.data as any;
            if (!wheelData.selectedCountries?.length) {
              const region = wheelData.selectedRegion || "all";
              updateWheelData("country-wheel", wheel.id, {
                ...wheelData,
                selectedRegion: region,
                selectedCountries: getCountriesByRegion(region),
              });
            }
          }
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
          }
          
          if (wheelData.spinHistory) {
            setSpinHistory(wheelData.spinHistory)
          } else {
            setSpinHistory([])
          }
        }
      } catch (error) {
        console.error("Error initializing country wheel:", error)
      }
    }
    initializeApp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for spin results from wheel components
  useEffect(() => {
    const currentWheel = getCurrentWheel();
    if (currentWheel?.data) {
      const wheelData = currentWheel.data as any;
      if (wheelData.selectedResult && wheelData.selectedResult !== lastSpinResult) {
        const result = wheelData.selectedResult;
        setLastSpinResult(result);
      
        // Process the spin result for analytics and achievements
        if (result && result.name) {
          const totalSpins = spinHistory.length + 1;
          const uniqueResults = new Set([...spinHistory.map(r => r.result), result.name]).size;
          
          // Record the spin for analytics
          const newSpinRecord: SpinRecord = {
            id: Date.now().toString(),
            timestamp: new Date(),
            result: result.name,
            options: selectedCountries.map((country: any) => country.name),
            mode: activeTab === 'ai' ? 'ai' : 'manual',
            theme: currentTheme,
            spinDuration: 3,
            userQuestion: undefined
          };
          
          const updatedSpinHistory = [...spinHistory, newSpinRecord];
          setSpinHistory(updatedSpinHistory);
          
          // Get game stats
          const stats = {
            totalSpins,
            uniqueResults,
            perfectMemoryRounds: 0,
            bingoWins: 0,
            fastestMemoryTime: 0,
            consecutiveDays: 1,
            totalOptions: selectedCountries.length,
            aiGeneratedOptions: activeTab === 'ai' ? selectedCountries.length : 0,
            mysterySpins: 0
          };

          const updatedAchievements = checkAchievementUnlocks(achievements, stats);
          const newlyCompleted = updatedAchievements.filter(a => 
            a.completed && !achievements.find(oa => oa.id === a.id)?.completed
          );

          if (newlyCompleted.length > 0) {
            setAchievements(updatedAchievements);
            const newPoints = newlyCompleted.reduce((sum, a) => sum + a.points, 0);
            setTotalPoints(prev => prev + newPoints);

            // Check for theme unlocks
            const updatedThemes = checkThemeUnlocks(themes, {
              totalSpins,
              totalPoints: totalPoints + newPoints
            });
            const newlyUnlockedThemes = updatedThemes.filter(t => 
              t.unlocked && !themes.find(ot => ot.id === t.id)?.unlocked
            );
            
            if (newlyUnlockedThemes.length > 0) {
              setThemes(updatedThemes);
            }

            // Save achievements, themes, and spin history to wheel data
            if (currentWheel) {
              updateWheelData("country-wheel", currentWheel.id, {
                ...currentWheel.data,
                achievements: updatedAchievements,
                themes: updatedThemes,
                spinHistory: updatedSpinHistory
              });
            }
          } else {
            // Save spin history even if no new achievements
            if (currentWheel) {
              updateWheelData("country-wheel", currentWheel.id, {
                ...currentWheel.data,
                spinHistory: updatedSpinHistory
              });
            }
          }
        }
      }
    }
  }, [getCurrentWheel, lastSpinResult, spinHistory, achievements, themes, totalPoints, activeTab, currentTheme, selectedCountries, updateWheelData]);

  // Handle advanced game spin recording - REMOVED DUPLICATE LOGIC
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
      updateWheelData("country-wheel", currentWheel.id, {
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
            <ToolPageTitle title="Country Picker Wheel" toolType="country-wheel" />
            <p className="text-gray-600">Pick a random country by wheel</p>
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
                }
              }}
              onRestartGame={() => {
                // Reset wheel data to prevent localStorage persistence issues
                const currentWheel = getCurrentWheel();
                if (currentWheel) {
                  updateWheelData("country-wheel", currentWheel.id, {
                    ...currentWheel.data,
                    totalSpins: 0,
                    spinHistory: [],
                    recentResults: [],
                    selectedResult: null
                  });
                }
                
                // Add current game points to total points before restarting
                const gameScore = getGameScore()
                setTotalPoints(prev => prev + gameScore)
                
                // Save game stats
                const gameStats = getGameStats()
                if (gameStats) {
                }
                
                // Restart the game
                restartAdvancedGame()
              }}
            />
          )}

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
            {viewMode === "wheel" ? (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Conditional Wheel Section */}
                {activeTab === 'manual' ? (
                  <CountryWheelSection 
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
                  <CountryAIWheelSection 
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
                <CountryInputPanel onTabChange={setActiveTab} activeTab={activeTab} />
              </div>
            ) : (
              <div className="grid lg:grid-cols-1 gap-8">
                <CountryInputPanel onTabChange={setActiveTab} activeTab={activeTab} />
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
            const currentWheel = getCurrentWheel();
            const wheelData = currentWheel?.data as any;
            const totalSpinsFromWheel = wheelData?.totalSpins || 0;
            
            const analyticsData = analyzeSpinData(spinHistory);
            // Override totalSpins with the value from wheel data to ensure consistency
            return {
              ...analyticsData,
              totalSpins: totalSpinsFromWheel
            };
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
            // Reset wheel data to prevent localStorage persistence issues
            const currentWheel = getCurrentWheel();
            if (currentWheel) {
              updateWheelData("country-wheel", currentWheel.id, {
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
      </div>
    </ToastProvider>
  )
}
