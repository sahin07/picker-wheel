"use client"

import { useState, useEffect, useCallback, useRef, type ReactNode, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import ToolBreadcrumbs from "@/components/tool-breadcrumbs"
import Footer from "@/components/footer"
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
import { SocialProfile } from "@/lib/picker-wheel-social"
import { GameMode } from "@/lib/picker-wheel-game-modes"
import { useGameSession } from "@/hooks/use-game-session"
import PickerWheelGameStatus from "@/components/picker-wheel-game-status"
import { type ActionMode, type MLBTeam } from "@/data/mlb-teams"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PanelRightOpen } from "lucide-react"
import { MlbWheelPopularTemplates } from "@/components/mlb-wheel/mlb-wheel-popular-templates"
import { MLB_WHEEL_SHORT_TITLE } from "@/lib/mlb-wheel-seo"
import type { MlbWheelDeepLink } from "@/lib/mlb-wheel-spokes"
import {
  applyMlbWheelUseCase,
  getMlbWheelUseCase,
  mlbWheelUseCaseFromTemplate,
  type MlbWheelUseCaseId,
} from "@/lib/mlb-wheel-use-cases"

type MlbWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: MlbWheelDeepLink
}

function MlbWheelAppInner({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: MlbWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual')
  const [showInputs, setShowInputs] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
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
  const [activeUseCaseId, setActiveUseCaseId] = useState<MlbWheelUseCaseId | null>(
    deepLink?.useCaseId ?? null,
  )
  const deepLinkAppliedRef = useRef(false)
  const searchParams = useSearchParams()
  
  const { setCurrentTool, createNewWheel, getCurrentWheel, updateWheelData, loadFromDatabase: loadWheelManager } = useWheelManagerStore()
  const { settings, updateSettings, loadFromDatabase: loadSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore(
    (s) => s.settings.spinBehavior?.removeWinnerAfterSpin,
  )

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

          // Never keep Spinning… across page load
          if (wheelData.isSpinning) {
            updateWheelData("mlb-wheel", currentWheel.id, {
              ...wheelData,
              isSpinning: false,
            })
          }

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

  const applyUseCasePreset = useCallback((id: MlbWheelUseCaseId) => {
    if (!applyMlbWheelUseCase(id)) return
    setActiveUseCaseId(id)
  }, [])

  // Spoke deepLink + pillar ?template= / ?league=
  useEffect(() => {
    if (deepLinkAppliedRef.current) return
    const timer = window.setTimeout(() => {
      if (deepLinkAppliedRef.current) return
      const applyId = (id: MlbWheelUseCaseId) => {
        applyUseCasePreset(id)
        deepLinkAppliedRef.current = true
      }
      if (deepLink) {
        applyId(deepLink.useCaseId)
        return
      }
      const id = mlbWheelUseCaseFromTemplate(
        searchParams.get("template"),
        searchParams.get("league"),
      )
      if (id) applyId(id)
    }, 150)
    return () => window.clearTimeout(timer)
  }, [deepLink, searchParams, applyUseCasePreset])

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

  // Keep Action Mode in sync with Manage → Remove winner (and reverse), like Team Picker
  useEffect(() => {
    if (actionMode === "manual") return
    const wantMode: ActionMode = removeWinnerAfterSpin ? "elimination" : "normal"
    if (actionMode !== wantMode) {
      setActionMode(wantMode)
    }
  }, [removeWinnerAfterSpin, actionMode])

  const syncActionMode = useCallback(
    (mode: ActionMode) => {
      setActionMode(mode)
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
    [updateSettings],
  )

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
      <div
        className="min-h-screen overflow-x-hidden transition-colors duration-300"
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
              alt="MLB Picker Wheel banner"
              className="h-16 mx-auto object-contain"
            />
          </div>
        )}

        <Header 
          onOpenSettings={() => setShowSettings(true)}
          onOpenGames={() => setShowGameModes(true)}
        />

        <main className="w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-4 text-center">
            <ToolPageTitle
              title={shortTitle ?? MLB_WHEEL_SHORT_TITLE}
              toolType="mlb-wheel"
            />
            <p className="text-gray-600">
              {toolSubtitle ?? "Pick a random MLB team by wheel"}
            </p>
          </div>

          <MlbWheelPopularTemplates />

          {activeUseCaseId && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge className="bg-slate-800 text-white hover:bg-slate-800">
                Template: {getMlbWheelUseCase(activeUseCaseId)?.label}
              </Badge>
              <Badge variant="secondary">
                {getMlbWheelUseCase(activeUseCaseId)?.config.teams.length} teams ready
              </Badge>
            </div>
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

          <div className="mb-6 grid min-w-0 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {data?.viewMode === "wheel" ? (
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
                      onClick={() => window.dispatchEvent(new Event("open-mlb-results"))}
                      className="absolute left-2 top-2 z-10 border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50 sm:left-4 sm:top-4 sm:px-3"
                    >
                      Results
                      {(data?.recentResults?.length || 0) > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {data.recentResults.length}
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
                      onActionModeChange={syncActionMode}
                      onAddManualTeam={handleAddManualTeam}
                      isFullscreen={isFullscreen}
                      onToggleFullscreen={() => setIsFullscreen((v) => !v)}
                      showResultsButton={false}
                    />
                  </div>
                </div>
                {showInputs && !isFullscreen && (
                <div className="min-w-0 self-start lg:col-span-1">
                <MLBInputPanel 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  actionMode={actionMode}
                  onActionModeChange={syncActionMode}
                  onEliminationMode={handleEliminationMode}
                  onHideInputs={() => setShowInputs(false)}
                  onOpenAchievements={() => setShowAchievements(true)}
                  onViewHistory={() => {
                    window.dispatchEvent(new Event("open-mlb-results"))
                  }}
                  onOpenSettings={() => setShowSettings(true)}
                  onToggleFullscreen={() => setIsFullscreen((v) => !v)}
                  onOpenAI={() => setActiveTab("ai")}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  historyCount={data?.recentResults?.length || data?.totalSpins || 0}
                />
                </div>
                )}
              </>
            ) : (
              <div className="lg:col-span-3">
                <MLBInputPanel 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  actionMode={actionMode}
                  onActionModeChange={syncActionMode}
                  onEliminationMode={handleEliminationMode}
                  onHideInputs={() => setShowInputs(false)}
                  onOpenAchievements={() => setShowAchievements(true)}
                  onViewHistory={() => {
                    window.dispatchEvent(new Event("open-mlb-results"))
                  }}
                  onOpenSettings={() => setShowSettings(true)}
                  onToggleFullscreen={() => setIsFullscreen((v) => !v)}
                  onOpenAI={() => setActiveTab("ai")}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  historyCount={(data as any)?.totalSpins || 0}
                />
              </div>
            )}
          </div>

          <ToolBreadcrumbs />
          {seoIntro}
          {seoSections}
        </main>

        <Footer />

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
  )
}

export default function MlbWheelApp(props: MlbWheelAppProps) {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-50" />}>
        <MlbWheelAppInner {...props} />
      </Suspense>
    </ToastProvider>
  )
} 