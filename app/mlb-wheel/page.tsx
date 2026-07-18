"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Header from "@/components/header"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import MLBWheelSection from "@/components/mlb-wheel-section"
import MLBInputPanel from "@/components/mlb-input-panel"
import SettingsPanel from "@/components/settings-panel"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
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
import { mlbTeams, type ActionMode, type MLBTeam } from "@/data/mlb-teams"

export default function MLBWheelPage() {
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual')
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
  const [currentUser, setCurrentUser] = useState<SocialProfile | undefined>()
  
  // Mode feature state
  const [actionMode, setActionMode] = useState<ActionMode>("normal")
  
  const { setCurrentTool, createNewWheel, getCurrentWheel, updateWheelData, loadFromDatabase: loadWheelManager } = useWheelManagerStore()
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()

  // Subscribe to the current wheel using a Zustand selector - optimized
  const wheel = useWheelManagerStore(useCallback(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  }, []));
  const data = wheel?.data as any

  // Initialize the app
  useEffect(() => {
    setCurrentTool("mlb-wheel");
    const initializeApp = async () => {
      try {
        await loadSettings()
        // Client-only: create wheel if none exists
        if (typeof window !== "undefined") {
          const wheel = getCurrentWheel();
          if (!wheel) {
            const id = `mlb-wheel-${Date.now()}`;
            const now = new Date().toISOString();
            createNewWheel("mlb-wheel", "MLB Picker Wheel", id, now, now);
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
        }
      } catch (error) {
        console.error("Error initializing MLB wheel:", error)
      }
    }
    initializeApp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for spin results from the wheel store
  const [lastSpinResult, setLastSpinResult] = useState<any>(null);

  useEffect(() => {
    const currentWheel = getCurrentWheel();
    if (currentWheel?.data) {
      const wheelData = currentWheel.data as any;
      if (wheelData.selectedResult && wheelData.selectedResult !== lastSpinResult) {
        const result = wheelData.selectedResult;
        setLastSpinResult(result);
      
        // Process the spin result for analytics and achievements
        if (result && result.name) {
          // Calculate stats for achievements using recent results
          const totalSpins = wheelData.totalSpins || 0;
          const recentResults = wheelData.recentResults || [];
          const uniqueResults = new Set(recentResults.map((r: any) => r.name)).size;
          
          const stats = {
            totalSpins,
            uniqueResults,
            perfectMemoryRounds: 0,
            bingoWins: 0,
            fastestMemoryTime: 0,
            consecutiveDays: 1,
            totalOptions: wheelData.selectedTeams?.length || 0,
            aiGeneratedOptions: activeTab === 'ai' ? wheelData.selectedTeams?.length || 0 : 0,
            mysterySpins: 0
          };

          // Check for achievement unlocks
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

            // Save achievements and themes to wheel data
            if (currentWheel) {
              updateWheelData("mlb-wheel", currentWheel.id, {
                ...currentWheel.data,
                achievements: updatedAchievements,
                themes: updatedThemes
              });
            }
          }
        }
      }
    }
  }, [getCurrentWheel, lastSpinResult, achievements, themes, totalPoints, activeTab, currentTheme, updateWheelData]);

  // Handle theme selection - optimized with useCallback
  const handleThemeSelect = useCallback((themeId: string) => {
    console.log('Theme selected:', themeId)
    setCurrentTheme(themeId)
    
    // Save theme selection to wheel data immediately
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("mlb-wheel", currentWheel.id, {
        ...currentWheel.data,
        currentTheme: themeId
      })
    }
  }, [getCurrentWheel, updateWheelData])

  // Callback when a spin is completed - optimized with useCallback
  const handleSpinCompleted = useCallback(() => {
    // Record spin for game session if active
    if (isAdvancedGameActive && currentSession) {
      // Small delay to ensure wheel data is fully updated
      setTimeout(() => {
        // Get the result directly from the wheel data (like country wheel does)
        const currentWheel = getCurrentWheel();
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as any;
          
          if (wheelData.selectedResult) {
            console.log('Recording spin for game session:', wheelData.selectedResult.name);
            recordSpin(wheelData.selectedResult.name);
          }
        }
      }, 100); // Small delay to ensure state is updated
    }
  }, [isAdvancedGameActive, currentSession, getCurrentWheel, recordSpin]);

  // Handle elimination mode when a team is selected - optimized with useCallback
  const handleEliminationMode = useCallback((selectedTeam: MLBTeam) => {
    if (actionMode === "elimination") {
      console.log('ELIMINATION MODE: Removing team from available options...')
      console.log('Team to eliminate:', selectedTeam.name, 'ID:', selectedTeam.id)
      
      // Remove the selected team from available options
      const currentWheel = getCurrentWheel()
      if (currentWheel) {
        const currentData = currentWheel.data as any
        const newSelected = currentData.selectedTeams.filter((team: MLBTeam) => team.id !== selectedTeam.id)
        console.log('After elimination - remaining teams:', newSelected.length)
        
        updateWheelData("mlb-wheel", currentWheel.id, {
          ...currentData,
          selectedTeams: newSelected
        })
        
        console.log(`Elimination mode: Removed ${selectedTeam.name} from available options. Remaining: ${newSelected.length} teams`)
      }
    }
  }, [actionMode, getCurrentWheel, updateWheelData])

  // Handle manual team addition - optimized with useCallback
  const handleAddManualTeam = useCallback((teamName: string) => {
    console.log('MANUAL MODE: Adding custom team...')
    console.log('Team name to add:', teamName)
    
    // Create a custom MLB team
    const customTeam: MLBTeam = {
      id: `manual-${Date.now()}`,
      name: teamName.trim(),
      abbreviation: teamName.trim().substring(0, 3).toUpperCase(),
      city: "Custom City",
      league: "American",
      division: "Custom",
      logo: "⚾",
      primaryColor: "#666666",
      secondaryColor: "#999999",
      founded: new Date().getFullYear(),
      championships: 0,
      homeVenue: "Custom Stadium",
      manager: "Custom Manager",
      owner: "Custom Owner"
    }
    
    // Add the custom team to the wheel
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      const currentData = currentWheel.data as any
      
      // Check if team already exists (case-insensitive)
      const existingTeam = currentData.selectedTeams.find((team: MLBTeam) => 
        team.name.toLowerCase() === teamName.toLowerCase()
      )
      
      if (existingTeam) {
        console.log(`Team "${teamName}" already exists in the wheel`)
        return
      }
      
      const newSelected = [...currentData.selectedTeams, customTeam]
      console.log('After manual addition - total teams:', newSelected.length)
      
      updateWheelData("mlb-wheel", currentWheel.id, {
        ...currentData,
        selectedTeams: newSelected
      })
      
      console.log(`Manual mode: Added "${teamName}" to available options. Total: ${newSelected.length} teams`)
    }
  }, [getCurrentWheel, updateWheelData])

  // Immediate synchronization with wheel data changes
  useEffect(() => {
    const currentWheel = getCurrentWheel();
    if (currentWheel?.data) {
      const wheelData = currentWheel.data as any;
      
      // Sync current theme from wheel data
      if (wheelData.currentTheme && wheelData.currentTheme !== currentTheme) {
        setCurrentTheme(wheelData.currentTheme);
      }
      
      // Sync achievements from wheel data
      if (wheelData.achievements && JSON.stringify(wheelData.achievements) !== JSON.stringify(achievements)) {
        setAchievements(wheelData.achievements);
        const points = wheelData.achievements
          .filter((a: any) => a.completed)
          .reduce((sum: number, a: any) => sum + a.points, 0);
        setTotalPoints(points);
      }
      
      // Sync themes from wheel data
      if (wheelData.themes && JSON.stringify(wheelData.themes) !== JSON.stringify(themes)) {
        setThemes(wheelData.themes);
      }
    }
  }, [getCurrentWheel, currentTheme, achievements, themes]);







  return (
    <ToastProvider>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: settings.appearance.backgroundColor,
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

        <Header 
          onOpenSettings={() => setShowSettings(true)} 
        />

        <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <ToolPageTitle title="MLB Picker Wheel" toolType="mlb-wheel" />
            <p className="text-gray-600">Pick a random MLB team by wheel</p>
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
                  updateWheelData("mlb-wheel", currentWheel.id, {
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

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
            {data?.viewMode === "wheel" ? (
              <div className="grid lg:grid-cols-2 gap-8">
                                                   <MLBWheelSection 
                    key={`mlb-wheel-${currentTheme}`}
                    onOpenAchievements={() => setShowAchievements(true)}
                    onOpenThemeSelector={() => setShowThemeSelector(true)}
                    onOpenAnalytics={() => setShowAnalytics(true)}
                    onOpenSocialHub={() => setShowSocialHub(true)}
                    onOpenGameModes={() => setShowGameModes(true)}
                    totalPoints={totalPoints}
                    currentTheme={currentTheme}
                    themes={themes}
                    currentUser={currentUser}
                    isGameActive={isAdvancedGameActive}
                    currentGameMode={currentSession?.gameMode.name}
                    onSpinCompleted={handleSpinCompleted}
                    actionMode={actionMode}
                    onEliminationMode={handleEliminationMode}
                    onActionModeChange={setActionMode}
                    onAddManualTeam={handleAddManualTeam}
                  />
                <MLBInputPanel 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  actionMode={actionMode}
                  onActionModeChange={setActionMode}
                  onEliminationMode={handleEliminationMode}
                />
              </div>
            ) : (
              <div className="grid lg:grid-cols-1 gap-8">
                <MLBInputPanel 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  actionMode={actionMode}
                  onActionModeChange={setActionMode}
                  onEliminationMode={handleEliminationMode}
                />
              </div>
            )}
          </div>
        </main>

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
            const currentWheel = getCurrentWheel();
            const wheelData = currentWheel?.data as any;
            const totalSpinsFromWheel = wheelData?.totalSpins || 0;
            const recentResults = wheelData?.recentResults || [];
            
            // Create spin records from recent results for analytics
            const spinRecords: SpinRecord[] = recentResults.map((result: any, index: number) => ({
              id: `spin-${Date.now()}-${index}`,
              timestamp: new Date(Date.now() - (recentResults.length - index - 1) * 1000), // Approximate timestamps
              result: result.name,
              options: wheelData.selectedTeams?.map((team: any) => team.name) || [],
              mode: activeTab === 'ai' ? 'ai' : 'manual',
              theme: currentTheme,
              spinDuration: 3,
              userQuestion: undefined
            }));
            
            const analyticsData = analyzeSpinData(spinRecords);
            // Ensure analytics shows the correct data from wheel
            return {
              ...analyticsData,
              totalSpins: totalSpinsFromWheel,
              uniqueResults: new Set(recentResults.map((r: any) => r.name)).size
            };
          })()}
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
               updateWheelData("mlb-wheel", currentWheel.id, {
                 ...currentWheel.data,
                 totalSpins: 0,
                 spinHistory: [],
                 recentResults: [],
                 selectedResult: null
               });
             }
             
                           // Start the game
              startAdvancedGame(gameMode)
              setShowGameModes(false)
           }}
         />
      </div>
    </ToastProvider>
  )
} 