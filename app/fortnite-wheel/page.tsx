"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import { Settings, Share2, Maximize, EyeOff, Eye, Volume2, VolumeX, RotateCcw, Sparkles, BarChart3, Trophy, Palette, Users, Gamepad2, Shuffle, X } from "lucide-react"
import Confetti from "react-confetti"
import Header from "@/components/header"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
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

// Import components
import { WheelComponent } from "@/components/fortnite/wheel-component"
import { SkinsTab } from "@/components/fortnite/tabs/skins-tab"
import { AITab } from "@/components/fortnite/tabs/ai-tab"
import { StatsTab } from "@/components/fortnite/tabs/stats-tab"
import { ResultDialog } from "@/components/fortnite/dialogs/result-dialog"
import { ResultsHistoryDialog } from "@/components/fortnite/dialogs/results-history-dialog"
import { SkinPreviewDialog } from "@/components/fortnite/dialogs/skin-preview-dialog"
import { MultiSkinPreviewDialog } from "@/components/fortnite/dialogs/multi-skin-preview-dialog"
import FortniteFavoritesModal from "@/components/fortnite/dialogs/fortnite-favorites-modal"
import FortniteComparisonModal from "@/components/fortnite/dialogs/fortnite-comparison-modal"
import EnhancedSkinDetailsModal from "@/components/fortnite/dialogs/enhanced-skin-details-modal"

// Import types and data
import { fortniteSkins } from "@/data/fortnite-skins"
import { getEnhancedSkinInfo, type EnhancedSkinInfo } from "@/data/enhanced-fortnite-skins"
import { rarityColors } from "@/lib/rarity-config"
import type { Skin, SpinResult, DisplayMode, ActionMode, RarityFilter } from "@/types/fortnite-types"

export default function FortniteSkinsPicker() {
  // State management - back to simple approach
  const [selectedRarity, setSelectedRarity] = useState<RarityFilter>("all")
  const [selectedSkins, setSelectedSkins] = useState<string[]>([])
  const [skinOrder, setSkinOrder] = useState<string[]>([])
  const [totalSpins, setTotalSpins] = useState(0)
  const [spinHistory, setSpinHistory] = useState<any[]>([])
  const [customSkins, setCustomSkins] = useState<Skin[]>([])

  // Helper functions
  const getFilteredSkins = (): Skin[] => {
    const allPredefinedSkins = Object.values(fortniteSkins).flat() as unknown as Skin[]

    if (!selectedSkins || selectedSkins.length === 0) {
      console.log('getFilteredSkins: No selected skins')
      return []
    }

    const selectedSkinsIds = selectedSkins instanceof Set 
      ? Array.from(selectedSkins) 
      : selectedSkins.map(item => typeof item === 'string' ? item : item.id || item)
    
    console.log('getFilteredSkins: selectedSkinsIds:', selectedSkinsIds)
    console.log('getFilteredSkins: customSkins count:', customSkins.length)
    
    // Get selected predefined skins that match the current rarity filter (case-insensitive)
    const selectedPredefinedSkins = allPredefinedSkins.filter((skin) => 
      selectedSkinsIds.includes(skin.id) && 
      (selectedRarity === "all" || skin.rarity.toLowerCase() === selectedRarity.toLowerCase())
    )
    
    // Get selected custom skins
    const selectedCustomSkins = customSkins.filter((skin) => selectedSkinsIds.includes(skin.id))
    
    console.log('getFilteredSkins: selectedPredefinedSkins count:', selectedPredefinedSkins.length)
    console.log('getFilteredSkins: selectedCustomSkins count:', selectedCustomSkins.length)
    console.log('getFilteredSkins: selectedCustomSkins:', selectedCustomSkins.map(s => s.name))
    
    // Combine predefined and custom skins
    const allSelectedSkins = [...selectedPredefinedSkins, ...selectedCustomSkins]
    
    // Sort according to skinOrder if available, but ensure custom skins are always included
    let orderedSkins = allSelectedSkins
    if (skinOrder && skinOrder.length > 0) {
      // Get skins that are in skinOrder
      const orderedSkinsFromOrder = skinOrder
        .map(skinId => allSelectedSkins.find(skin => skin.id === skinId))
        .filter(skin => skin !== undefined) as Skin[]
      
      // Get custom skins that might not be in skinOrder
      const customSkinsNotInOrder = selectedCustomSkins.filter(skin => 
        !skinOrder.includes(skin.id)
      )
      
      // Combine ordered skins with custom skins not in order
      orderedSkins = [...orderedSkinsFromOrder, ...customSkinsNotInOrder]
    }
    
    console.log('getFilteredSkins: returning total skins:', orderedSkins.length)
    console.log('getFilteredSkins: final skin names:', orderedSkins.map(s => s.name))
    return orderedSkins
  }

  const getAllSkins = (): Skin[] => {
    const allSkins = Object.values(fortniteSkins).flat() as unknown as Skin[]
    return [...allSkins, ...customSkins]
  }

  // Local state
  const [forceUpdate, setForceUpdate] = useState(0)
  const [displayMode, setDisplayMode] = useState<DisplayMode>("emoji-name")
  const [actionMode, setActionMode] = useState<ActionMode>("normal")
  const [isSpinning, setIsSpinning] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [allResults, setAllResults] = useState<SpinResult[]>([])
  const [showInputs, setShowInputs] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAllResults, setShowAllResults] = useState(false)
  const [showTitle, setShowTitle] = useState(true)
  const [title, setTitle] = useState("Fortnite Skins Picker Wheel")
  const [description, setDescription] = useState("Pick a random Fortnite skin by wheel")
  const [manualInput, setManualInput] = useState("")
  const [previewSkin, setPreviewSkin] = useState<Skin | null>(null)
  const [showMultiSkinPreview, setShowMultiSkinPreview] = useState(false)
  const [showFavoritesModal, setShowFavoritesModal] = useState(false)
  const [showComparisonModal, setShowComparisonModal] = useState(false)

  const [enhancedSkinDetails, setEnhancedSkinDetails] = useState<EnhancedSkinInfo | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showEnhancedDetails, setShowEnhancedDetails] = useState(false)
  const [favoriteSkins, setFavoriteSkins] = useState<Skin[]>([])
  const [comparisonSkins, setComparisonSkins] = useState<Skin[]>([])
  const [enhancedSkinData, setEnhancedSkinData] = useState<EnhancedSkinInfo | null>(null)
  const [enhancedSkinDataMap, setEnhancedSkinDataMap] = useState<Record<string, EnhancedSkinInfo>>({})
  const [enhancedDetailsSkin, setEnhancedDetailsSkin] = useState<Skin | null>(null)
  const [selectedSkinForResult, setSelectedSkinForResult] = useState<Skin | null>(null)
  const [manualSkinName, setManualSkinName] = useState("")

  // Tool features state
  const [showAchievements, setShowAchievements] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [achievements, setAchievements] = useState(PICKER_WHEEL_ACHIEVEMENTS)
  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES)
  const [currentTheme, setCurrentTheme] = useState('classic')
  const [totalPoints, setTotalPoints] = useState(0)
  const [currentUser, setCurrentUser] = useState<SocialProfile | undefined>()
  const lastProcessedResult = useRef<string>('')

  // Game session management
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

  // Global settings store
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()
  const { setCurrentTool, createNewWheel, getCurrentWheel, updateWheelData, loadFromDatabase: loadWheelManager, currentWheelId } = useWheelManagerStore()

  // AI Features
  const [aiRecommendations, setAiRecommendations] = useState<Skin[]>([])
  const [aiRecommendedSkins, setAiRecommendedSkins] = useState<string[]>([])
  const [skinStats, setSkinStats] = useState<Record<string, number>>({})
  const [aiQuery, setAiQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ role: "user" | "ai"; message: string; timestamp: Date }>>([])
  const [aiMode, setAiMode] = useState<"chat" | "analysis" | "generator">("chat")
  const [userPreferences, setUserPreferences] = useState({
    favoriteGenres: [] as string[],
    preferredRarity: "all" as string,
    playStyle: "casual" as string,
    favoriteCollabs: [] as string[],
  })

  // Sound and confetti state
  const [muted, setMuted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confetti, setConfetti] = useState<Array<{
    x: number
    y: number
    color: string
    velocity: { x: number; y: number }
  }>>([])
  const confettiRef = useRef<number | null>(null)
  
  // Client-side spin count display to avoid hydration issues
  const [displaySpinCount, setDisplaySpinCount] = useState(totalSpins)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const wheelRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)

  // Removed problematic useEffect that was causing infinite re-render loop

  // Save data to wheel manager store whenever it changes (like home page does)
  useEffect(() => {
    const currentWheel = getCurrentWheel()
    if (currentWheel && isInitialized) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins,
        skinOrder,
        totalSpins,
        spinHistory,
        customSkins,
        selectedRarity
      })
    }
  }, [selectedSkins, skinOrder, totalSpins, spinHistory, customSkins, selectedRarity, isInitialized])

  // Listen for wheel changes and update local state
  useEffect(() => {
    console.log('Wheel change effect triggered - currentWheelId:', currentWheelId, 'isInitialized:', isInitialized)
    
    const currentWheel = getCurrentWheel()
    console.log('getCurrentWheel() returned:', currentWheel)
    
    if (currentWheel?.data && isInitialized) {
      const wheelData = currentWheel.data as any
      
      console.log('Wheel changed, loading data from wheel:', currentWheel.id)
      console.log('Wheel data:', wheelData)
      
      // Update local state to match current wheel data
      if (wheelData.selectedSkins) {
        console.log('Loading selectedSkins from wheel data:', wheelData.selectedSkins)
        setSelectedSkins(wheelData.selectedSkins)
        setSkinOrder(wheelData.selectedSkins)
      } else {
        console.log('No selectedSkins in wheel data, clearing selection')
        setSelectedSkins([])
        setSkinOrder([])
      }
      if (wheelData.totalSpins !== undefined) {
        console.log('Loading totalSpins from wheel data:', wheelData.totalSpins)
        setTotalSpins(wheelData.totalSpins)
      }
      if (wheelData.spinHistory) {
        console.log('Loading spinHistory from wheel data:', wheelData.spinHistory.length, 'spins')
        setSpinHistory(wheelData.spinHistory)
      }
      if (wheelData.customSkins) {
        console.log('Loading customSkins from wheel data:', wheelData.customSkins.length, 'skins')
        setCustomSkins(wheelData.customSkins)
      } else {
        console.log('No customSkins in wheel data, clearing custom skins')
        setCustomSkins([])
      }
      if (wheelData.selectedRarity) {
        console.log('Loading selectedRarity from wheel data:', wheelData.selectedRarity)
        setSelectedRarity(wheelData.selectedRarity)
      }
      
      // Mark data as loaded
      setIsDataLoaded(true)
      
      // Force wheel component to re-render with new data
      setForceUpdate(prev => prev + 1)
    }
  }, [currentWheelId, isInitialized])

  // Subscribe to wheel manager store changes
  useEffect(() => {
    const unsubscribe = useWheelManagerStore.subscribe(
      (state) => {
        console.log('Wheel manager store subscription triggered - new currentWheelId:', state.currentWheelId)
        // Force a re-render when wheel ID changes
        setForceUpdate(prev => prev + 1)
      }
    )
    
    return unsubscribe
  }, [])

  // Sound and confetti effects
  useEffect(() => {
    if (isSpinning && settings.confettiSound.enableSound && !muted) {
      playSpinSound()
    }
  }, [isSpinning, settings.confettiSound.enableSound, settings.confettiSound.soundVolume, muted])

  // Show confetti and play win sound when spin completes
  useEffect(() => {
    if (spinResult && !isSpinning) {
      setShowConfetti(true)
      // Play win sound if global sound is enabled and not locally muted
      if (settings.confettiSound?.enableSound && !muted) {
        const audio = new Audio("/sound-win.mp3")
        audio.volume = settings.confettiSound.soundVolume || 0.5
        audio.play().catch((error) => {
          console.error('Error playing sound:', error)
        })
      }
    }
  }, [spinResult, isSpinning, settings.confettiSound?.enableSound, settings.confettiSound?.soundVolume, muted])

  // Trigger confetti effect
  useEffect(() => {
    if (spinResult && !isSpinning && settings.confettiSound.enableConfetti) {
      createConfetti()
    }
  }, [spinResult, isSpinning, settings.confettiSound.enableConfetti])

  // Update display spin count to avoid hydration issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentWheel = getCurrentWheel()
      const wheelData = currentWheel?.data as any
      setDisplaySpinCount(wheelData?.totalSpins ?? totalSpins)
    }
  }, [totalSpins, getCurrentWheel])

  // Initialize the app
  useEffect(() => {
    setCurrentTool("fortnite-wheel");
    const initializeApp = async () => {
      try {
        await loadSettings()
        if (typeof window !== "undefined") {
          const wheel = getCurrentWheel();
          if (!wheel) {
            const id = `fortnite-wheel-${Date.now()}`;
            const now = new Date().toISOString();
            createNewWheel("fortnite-wheel", "Fortnite Skins Picker Wheel", id, now, now);
          }
        }

        const currentWheel = getCurrentWheel()
        console.log('Current wheel:', currentWheel);
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as any;
          console.log('Wheel data:', {
            selectedSkins: wheelData.selectedSkins,
            selectedSkinsType: typeof wheelData.selectedSkins,
            isArray: Array.isArray(wheelData.selectedSkins),
            length: wheelData.selectedSkins?.length,
            firstItem: wheelData.selectedSkins?.[0]
          });
          
          // Load data from wheel manager store (like home page does)
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
            setThemes(PICKER_WHEEL_THEMES)
          }
          
          if (wheelData.currentTheme) {
            setCurrentTheme(wheelData.currentTheme)
          }
          
          if (wheelData.customSkins) {
            setCustomSkins(wheelData.customSkins)
          }

          if (wheelData.selectedRarity) {
            console.log('Loading selectedRarity from wheel data:', wheelData.selectedRarity)
            setSelectedRarity(wheelData.selectedRarity)
          } else {
            console.log('No selectedRarity in wheel data, using default: all')
          }

          if (wheelData.selectedSkins && wheelData.selectedSkins.length > 0) {
            // Check if selectedSkins is in old format (array of objects) and convert to new format (array of strings)
            let selectedSkinsData = wheelData.selectedSkins;
            if (Array.isArray(selectedSkinsData) && selectedSkinsData.length > 0 && typeof selectedSkinsData[0] === 'object' && selectedSkinsData[0].id) {
              console.log('Converting old selectedSkins format (objects) to new format (strings)');
              selectedSkinsData = selectedSkinsData.map(skin => skin.id);
              // Update the wheel data with the new format
              updateWheelData("fortnite-wheel", currentWheel.id, {
                ...currentWheel.data,
                selectedSkins: selectedSkinsData,
                skinOrder: selectedSkinsData
              });
            }
            setSelectedSkins(selectedSkinsData)
            setSkinOrder(selectedSkinsData)
          } else {
            // Auto-select all skins on first load
            console.log('No selected skins found, auto-selecting all skins')
            const allSkins = Object.values(fortniteSkins).flat() as unknown as Skin[]
            const allSkinIds = allSkins.map(skin => skin.id)
            console.log('Auto-selecting skins:', allSkinIds.length, 'skins')
            setSelectedSkins(allSkinIds)
            setSkinOrder(allSkinIds)
            
            // Update wheel data with all skins selected
            updateWheelData("fortnite-wheel", currentWheel.id, {
              ...currentWheel.data,
              selectedSkins: allSkinIds,
              selectedRarity: "all",
              displayMode: "emoji-name",
              actionMode: "normal",
              skinOrder: allSkinIds
            })
            
            // Mark data as loaded immediately
            setIsDataLoaded(true)
          }

          // Load existing statistics if available
          if (wheelData.statistics) {
            console.log('Loading existing statistics from wheel data:', wheelData.statistics)
            // Statistics are already stored in wheel data, no need to set local state
            // They will be displayed in the header dropdown automatically
          } else {
            console.log('No existing statistics found, will be created on first spin')
          }

          // Load spin history if available
          if (wheelData.spinHistory) {
            console.log('Loading existing spin history from wheel data:', wheelData.spinHistory.length, 'spins')
            setSpinHistory(wheelData.spinHistory)
          } else {
            console.log('No existing spin history found')
            setSpinHistory([])
          }

          // Load total spins if available
          if (wheelData.totalSpins !== undefined) {
            console.log('Loading total spins from wheel data:', wheelData.totalSpins)
            setTotalSpins(wheelData.totalSpins)
          } else {
            console.log('No total spins found, starting from 0')
            setTotalSpins(0)
          }
          
          // Mark data as loaded
          setIsDataLoaded(true)
        } else {
          // Auto-select all skins on first load
          const allSkins = Object.values(fortniteSkins).flat() as unknown as Skin[]
          const allSkinIds = allSkins.map(skin => skin.id)
          setSelectedSkins(allSkinIds)
          setSkinOrder(allSkinIds)
          setIsDataLoaded(true)
        }
        
        generateAIRecommendations()
        initializeStats()
        
        setIsInitialized(true)
      } catch (error) {
        console.error("Error initializing Fortnite wheel:", error)
        // Fallback: ensure we have some data even if initialization fails
        const allSkins = Object.values(fortniteSkins).flat() as unknown as Skin[]
        const allSkinIds = allSkins.map(skin => skin.id)
        setSelectedSkins(allSkinIds)
        setSkinOrder(allSkinIds)
        setIsDataLoaded(true)
        setIsInitialized(true)
      }
    }
    initializeApp()
  }, []);



  // Handle theme selection
  const handleThemeSelect = (themeId: string) => {
    console.log('Fortnite Theme selected:', themeId)
    setCurrentTheme(themeId)
    
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        currentTheme: themeId
      })
    }
  }

  // Callback to update spin history when a spin is completed
  const handleSpinCompleted = () => {
    console.log('handleSpinCompleted called - Game active:', isAdvancedGameActive, 'Session:', !!currentSession);
    
    // Record spin for game session if active
    if (isAdvancedGameActive && currentSession) {
      // Small delay to ensure wheel data is fully updated (like MLB does)
      setTimeout(() => {
        // Get the result directly from the wheel data (like MLB does)
        const currentWheel = getCurrentWheel();
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as any;
          
          if (wheelData.selectedResult) {
            console.log('Recording spin for game session:', wheelData.selectedResult.name);
            recordSpin(wheelData.selectedResult.name);
          } else {
            console.log('No selectedResult found in wheel data');
          }
        } else {
          console.log('No current wheel or wheel data found');
        }
      }, 100); // Small delay to ensure state is updated (same as MLB)
    } else {
      console.log('Game session recording skipped - conditions not met');
    }
  };

  const generateAIRecommendations = () => {
    const allSkins = getAllSkins()
    const recommendations = allSkins
      .filter(
        (skin) =>
          skin.season.includes("Marvel") ||
          skin.season.includes("DC") ||
          skin.season.includes("Star Wars") ||
          skin.rarity === "Legendary" ||
          skin.rarity === "Mythic",
      )
      .slice(0, 6)
    setAiRecommendations(recommendations)
  }

  const initializeStats = () => {
    const stats: Record<string, number> = {}
    Object.keys(fortniteSkins).forEach((rarity) => {
      stats[rarity] = fortniteSkins[rarity as keyof typeof fortniteSkins].length
    })
    setSkinStats(stats)
  }



  const handleSpin = () => {
    if (isSpinning || getFilteredSkins().length === 0) {
      console.log('Spin blocked:', { isSpinning, skinsLength: getFilteredSkins().length })
      return
    }

    console.log('Starting spin...')
    setIsSpinning(true)
    const skins = getFilteredSkins()
    
    // Calculate rotation for smooth animation with better randomization
    const currentRotation = rotation || 0
    const baseRotation = currentRotation + (360 * 5) // Add 5 full rotations to current position
    const randomFinalAngle = Math.random() * 360 // Random final position
    const finalRotation = baseRotation + randomFinalAngle + (Math.random() * 10) // Add extra randomness
    
    console.log('Rotation calculation:', {
      currentRotation,
      baseRotation,
      randomFinalAngle,
      finalRotation,
      skinsCount: skins.length
    })
    
    setRotation(finalRotation)
    
    // Calculate result based on final wheel position and triangle pointer
    // Triangle is at 3 o'clock position (0 degrees), so we need to calculate which segment is under it
    const normalizedRotation = finalRotation % 360
    const angleUnderPointer = (360 - normalizedRotation) % 360 // Convert to clockwise from 3 o'clock
    const segmentAngle = 360 / skins.length
    const selectedIndex = Math.floor(angleUnderPointer / segmentAngle) % skins.length
    const selectedSkin = skins[selectedIndex]
    
    // Handle elimination mode IMMEDIATELY before setTimeout
    if (actionMode === "elimination") {
      console.log('ELIMINATION MODE: Processing elimination immediately...')
      console.log('Before elimination - selectedSkins:', selectedSkins.length, 'skins')
      console.log('Skin to eliminate:', selectedSkin.name, 'ID:', selectedSkin.id)
      
      // Remove the selected skin from available options IMMEDIATELY
      const newSelected = selectedSkins.filter(id => id !== selectedSkin.id)
      console.log('After elimination - newSelected:', newSelected.length, 'skins')
      
      // Update state immediately
      setSelectedSkins(newSelected)
      setSkinOrder(newSelected)
      setForceUpdate(prev => prev + 1) // Force re-render
      
      // Update wheel data immediately
      const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
      const currentWheel = getCurrentWheel()
      if (currentWheel) {
        updateWheelData("fortnite-wheel", currentWheel.id, {
          ...currentWheel.data,
          selectedSkins: newSelected,
          skinOrder: newSelected
        })
        console.log('Wheel data updated with elimination')
      }
      
      console.log(`Elimination mode: Removed ${selectedSkin.name} from available options. Remaining: ${newSelected.length} skins`)
    }
    
    setTimeout(() => {
      
      console.log('Spin result calculation:', {
        finalRotation,
        normalizedRotation,
        angleUnderPointer,
        segmentAngle,
        selectedIndex,
        selectedSkin: selectedSkin?.name
      })
      
      // Set result based on triangle position
      setSpinResult({
        skin: selectedSkin,
        timestamp: new Date()
      })
      
      // Call spin completed callback for game sessions
      setTimeout(() => {
        handleSpinCompleted()
      }, 100) // Small delay to ensure state is updated
      
      // Update wheel data
      const currentWheel = getCurrentWheel()
      if (currentWheel) {
        const spinRecord: SpinRecord = {
          id: `spin-${Date.now()}`,
          timestamp: new Date(),
          result: selectedSkin.name,
          options: skins.map(s => s.name),
          mode: "manual",
          theme: currentTheme,
          spinDuration: settings.spinBehavior.spinningDuration,
          userQuestion: undefined,
          wheelName: currentWheel.name // Add wheel name to spin record
        }
        
            const newSpinHistory = [...spinHistory, spinRecord]
    const wheelData = currentWheel.data as any
        const newTotalSpins = totalSpins + 1
        
        // Calculate enhanced statistics
        const currentStats = wheelData.statistics || {
          totalSpins: 0,
          uniqueSkinsSpun: 0,
          mostSpunSkin: undefined,
          mostSpunRarity: undefined,
          averageSpinsPerSession: 0,
          lastSpinDate: undefined,
          firstSpinDate: undefined,
          spinStreak: 0,
          totalSpinTime: 0,
          favoriteRarity: undefined,
          skinCountByRarity: {},
          spinResultsByRarity: {}
        }
        
        // Track unique skins spun - get all previously spun skins from spin history
        const allSpunSkins = new Set<string>()
        
        // Add current spin history skins from the actual spin history
        if (wheelData.spinHistory && Array.isArray(wheelData.spinHistory)) {
          wheelData.spinHistory.forEach((spin: any) => {
            if (spin.result) {
              allSpunSkins.add(spin.result)
            }
          })
        }
        
        // Add current spin result
        allSpunSkins.add(selectedSkin.name)
        
        const uniqueSkinsSpun = allSpunSkins.size
        
        // Track spin results by rarity
        const spinResultsByRarity = { ...currentStats.spinResultsByRarity }
        const skinRarity = selectedSkin.rarity.toLowerCase()
        spinResultsByRarity[skinRarity] = (spinResultsByRarity[skinRarity] || 0) + 1
        
        // Find most spun rarity
        const mostSpunRarity = Object.entries(spinResultsByRarity)
          .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0]
        
        // Calculate skin count by rarity for current selection
        const skinCountByRarity: Record<string, number> = {}
        const allPredefinedSkins = Object.values(fortniteSkins).flat() as unknown as Skin[]
        const selectedSkinsData = allPredefinedSkins.filter(skin => selectedSkins.includes(skin.id))
        selectedSkinsData.forEach(skin => {
          const rarity = skin.rarity.toLowerCase()
          skinCountByRarity[rarity] = (skinCountByRarity[rarity] || 0) + 1
        })
        
        // Update statistics
        const updatedStats = {
          ...currentStats,
          totalSpins: newTotalSpins,
          uniqueSkinsSpun,
          mostSpunSkin: selectedSkin.name, // For now, just track the latest
          mostSpunRarity,
          averageSpinsPerSession: newTotalSpins, // Simplified for now
          lastSpinDate: new Date().toISOString(),
          firstSpinDate: currentStats.firstSpinDate || new Date().toISOString(),
          spinStreak: currentStats.spinStreak + 1, // Simplified streak calculation
          totalSpinTime: currentStats.totalSpinTime + 4, // Assuming 4 second spins
          favoriteRarity: mostSpunRarity,
          skinCountByRarity,
          spinResultsByRarity,
          spinHistory: newSpinHistory // Include the spin history in statistics
        }
        
        updateWheelData("fortnite-wheel", currentWheel.id, {
          ...currentWheel.data,
          spinHistory: newSpinHistory,
          selectedResult: selectedSkin,
          totalSpins: newTotalSpins,
          statistics: updatedStats
        })
        setSpinHistory(newSpinHistory)
        setTotalSpins(newTotalSpins)
      }
      
      setIsSpinning(false)
      console.log('Spin completed, result:', selectedSkin?.name)
      
      // Handle different action modes
      if (actionMode === "manual") {
        // Manual mode: Don't automatically spin, let user choose
        console.log('Manual mode: User should manually select a skin')
      } else if (actionMode === "normal") {
        // Normal mode: All skins remain available for next spin
        console.log('Normal mode: All skins remain available for next spin')
      }
      // Elimination mode is handled immediately above, before setTimeout
      
      // Force reset spinning state after a short delay as fallback
      setTimeout(() => {
        if (isSpinning) {
          console.log('Force resetting spinning state')
          setIsSpinning(false)
        }
      }, 500)
    }, 4000) // Fixed 4 second duration
  }

  // Sound and confetti functions
  const playSpinSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(settings.confettiSound.soundVolume * 0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.log("Audio not supported")
    }
  }

  const createConfetti = () => {
    const colors = settings.appearance.toolColors
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * 450,
      y: Math.random() * 450,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * -10 - 5,
      },
    }))

    setConfetti(newConfetti)

    const animateConfetti = () => {
      setConfetti((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            velocity: {
              x: particle.velocity.x * 0.99,
              y: particle.velocity.y + 0.3,
            },
          }))
          .filter((particle) => particle.y < 500),
      )

      if (confetti.length > 0) {
        confettiRef.current = requestAnimationFrame(animateConfetti)
      }
    }

    confettiRef.current = requestAnimationFrame(animateConfetti)

    setTimeout(() => {
      setConfetti([])
      if (confettiRef.current) {
        cancelAnimationFrame(confettiRef.current)
      }
    }, 3000)
  }

  const handleClearAll = () => {
    clearAllSkins()
  }

  const handlePreviewSkin = (skin?: Skin) => {
    if (skin) {
      // Preview single skin
      setPreviewSkin(skin)
      setShowPreview(true)
    } else {
      // Preview all current wheel skins
      const currentWheelSkins = getFilteredSkins()
      if (currentWheelSkins.length > 0) {
        // Show multi-skin preview for all wheel skins
        setShowMultiSkinPreview(true)
        console.log('Preview showing current wheel skins:', currentWheelSkins.length, 'skins')
      }
    }
  }

  const handleShuffleSkins = () => {
    console.log('Shuffle skins button clicked')
    shuffleSkins()
    // Toast notification will be handled by the toast context
    console.log('Skins shuffled successfully!')
  }

  const handleSortSkinsAZ = () => {
    console.log('Sort A-Z button clicked')
    sortSkinsAZ()
    // Toast notification will be handled by the toast context
    console.log('Skins sorted alphabetically!')
  }

  const handleAddRandomSkins = () => {
    console.log('Add random skins button clicked')
    addRandomSkins()
    // Toast notification will be handled by the toast context
    console.log('Random skins added successfully!')
  }

  const handleAddManualSkin = () => {
    if (!manualSkinName.trim()) {
      console.log('Manual skin name is empty')
      return
    }

    // Check if skin with this name already exists
    const allSkins = getAllSkins()
    const skinExists = allSkins.some(skin => skin.name.toLowerCase() === manualSkinName.trim().toLowerCase())
    if (skinExists) {
      console.log('Skin with this name already exists:', manualSkinName)
      return
    }

    console.log('Adding manual skin:', manualSkinName)
    
    // Create a custom skin object
    const customSkin: Skin = {
      id: `manual-${Date.now()}`,
      name: manualSkinName.trim(),
      emoji: "🎮", // Default emoji for custom skins
      rarity: "Common",
      season: "Custom",
      preview: "" // Empty preview for custom skins
    }

    // Add to custom skins state (avoid duplicates)
    setCustomSkins(prev => {
      const exists = prev.some(skin => skin.id === customSkin.id)
      return exists ? prev : [...prev, customSkin]
    })

    // Add to selected skins
    const newSelected = [...selectedSkins, customSkin.id]
    setSelectedSkins(newSelected)
    setSkinOrder(newSelected)
    
    // Force re-render to update UI
    setForceUpdate(prev => prev + 1)
    
    // Update wheel data
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      // Get current custom skins from wheel data to avoid duplicates
      const currentCustomSkins = (currentWheel.data as any).customSkins || []
      const customSkinExists = currentCustomSkins.some((skin: Skin) => skin.id === customSkin.id)
      
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins: newSelected,
        skinOrder: newSelected,
        customSkins: customSkinExists ? currentCustomSkins : [...currentCustomSkins, customSkin]
      })
    }

    // Reset input
    setManualSkinName("")
    
    console.log('Custom skin added successfully:', customSkin.name)
  }

  const handleDeleteCustomSkin = (skinId: string) => {
    console.log('Deleting custom skin:', skinId)
    
    // Remove from custom skins state
    setCustomSkins(prev => prev.filter(skin => skin.id !== skinId))
    
    // Remove from selected skins
    const newSelected = selectedSkins.filter(id => id !== skinId)
    setSelectedSkins(newSelected)
    setSkinOrder(newSelected)
    
    // Update wheel data
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      const currentCustomSkins = (currentWheel.data as any).customSkins || []
      const updatedCustomSkins = currentCustomSkins.filter((skin: Skin) => skin.id !== skinId)
      
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins: newSelected,
        skinOrder: newSelected,
        customSkins: updatedCustomSkins
      })
    }
    
    // Force re-render
    setForceUpdate(prev => prev + 1)
    
    console.log('Custom skin deleted successfully:', skinId)
  }



  const handleRarityChange = (rarity: RarityFilter) => {
    console.log('handleRarityChange called with rarity:', rarity)
    setSelectedRarity(rarity)
    
    // Get all predefined skins (same as in getFilteredSkins)
    const allPredefinedSkins = Object.values(fortniteSkins).flat() as unknown as Skin[]
    
    // Auto-select all skins of the chosen rarity
    if (rarity === "all") {
      // Select all skins from all rarities
      const allSkinIds = allPredefinedSkins.map(skin => skin.id)
      console.log('Auto-selecting all skins:', allSkinIds.length, 'skins')
      setSelectedSkins(allSkinIds)
      setSkinOrder(allSkinIds)
    } else {
      // Select only skins of the chosen rarity
      const raritySkinIds = allPredefinedSkins
        .filter(skin => skin.rarity.toLowerCase() === rarity.toLowerCase())
        .map(skin => skin.id)
      console.log(`Auto-selecting ${rarity} skins:`, raritySkinIds.length, 'skins')
      setSelectedSkins(raritySkinIds)
      setSkinOrder(raritySkinIds)
    }
    
    // Force re-render to update wheel
    setForceUpdate(prev => prev + 1)
    
    // Save to wheel data (like MLB wheel)
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedRarity: rarity,
        selectedSkins: rarity === "all" 
          ? allPredefinedSkins.map(skin => skin.id)
          : allPredefinedSkins
              .filter(skin => skin.rarity.toLowerCase() === rarity.toLowerCase())
              .map(skin => skin.id),
        skinOrder: rarity === "all"
          ? allPredefinedSkins.map(skin => skin.id)
          : allPredefinedSkins
              .filter(skin => skin.rarity.toLowerCase() === rarity.toLowerCase())
              .map(skin => skin.id)
      })
    }
  }

  const handleSkinToggle = (skinId: string) => {
    console.log('=== handleSkinToggle called ===')
    console.log('skinId:', skinId)
    console.log('Current selectedSkins:', selectedSkins)
    console.log('selectedSkins type:', typeof selectedSkins)
    console.log('selectedSkins length:', selectedSkins?.length)
    console.log('selectedSkins is array:', Array.isArray(selectedSkins))
    console.log('selectedSkins includes skinId:', selectedSkins?.includes(skinId))
    
    const newSelected = selectedSkins.includes(skinId) 
      ? selectedSkins.filter(id => id !== skinId)
      : [...selectedSkins, skinId]
    
    console.log('New selectedSkins will be:', newSelected)
    console.log('New selectedSkins length:', newSelected.length)
    console.log('New selectedSkins is array:', Array.isArray(newSelected))
    
    setSelectedSkins(newSelected)
    setSkinOrder(newSelected)
    
    // Save to wheel data (like home page does)
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins: newSelected,
        skinOrder: newSelected
      })
    }
    
    console.log('After handleSkinToggle - getFilteredSkins returns:', getFilteredSkins().map(s => s.name))
    console.log('=== handleSkinToggle end ===')
  }

  const clearAllSkins = () => {
    console.log('=== clearAllSkins called ===')
    console.log('Before clear - selectedSkins length:', selectedSkins.length)
    
    setSelectedSkins([])
    setSkinOrder([])
    setSelectedRarity("all") // Reset to "All Skins" filter
    
    // Force re-render to update UI
    setForceUpdate(prev => prev + 1)
    
    // Save to wheel data (like MLB wheel)
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins: [],
        skinOrder: [],
        selectedRarity: "all"
      })
    }
    
    console.log('After clear - selectedSkins should be empty')
    console.log('=== clearAllSkins end ===')
  }

  const shuffleSkins = () => {
    // Shuffle the selected skins by updating the skinOrder
    const skinsArray = Array.from(selectedSkins)
    console.log('Shuffling skins:', skinsArray.length, 'skins')
    const shuffled = skinsArray.sort(() => Math.random() - 0.5)
    
    // Update both selectedSkins and skinOrder with shuffled order
    setSelectedSkins(shuffled)
    setSkinOrder(shuffled)
    
    // Update wheel data with shuffled order
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins: shuffled,
        skinOrder: shuffled
      })
    }
    
    // Force re-render to update UI
    setForceUpdate(prev => prev + 1)
    
    console.log('Skins shuffled successfully')
  }

  const sortSkinsAZ = () => {
    // Sort skins alphabetically by name (including custom skins)
    const skinsArray = Array.from(selectedSkins)
    console.log('Sorting skins A-Z:', skinsArray.length, 'skins')
    
    // Get all skins including custom skins
    const allSkins = getAllSkins()
    const allSkinsWithCustom = [...allSkins, ...customSkins]
    
    const sortedSkins = skinsArray.sort((a, b) => {
      const skinA = allSkinsWithCustom.find(skin => skin.id === a)
      const skinB = allSkinsWithCustom.find(skin => skin.id === b)
      return (skinA?.name || '').localeCompare(skinB?.name || '')
    })
    
    // Update both selectedSkins and skinOrder with sorted order
    setSelectedSkins(sortedSkins)
    setSkinOrder(sortedSkins)
    
    // Update wheel data with sorted order
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins: sortedSkins,
        skinOrder: sortedSkins
      })
    }
    
    // Force re-render to update UI
    setForceUpdate(prev => prev + 1)
    
    console.log('Skins sorted A-Z successfully')
    console.log('New selectedSkins order:', sortedSkins)
    console.log('New skinOrder:', sortedSkins)
    console.log('Wheel key will be:', `fortnite-wheel-${currentTheme}-${sortedSkins.join(',')}-${forceUpdate + 1}`)
    console.log('getFilteredSkins will now return:', getFilteredSkins().map(s => s.name))
  }

  const addRandomSkins = () => {
    console.log('addRandomSkins function called')
    // Add 5 random skins from all available skins (including custom skins)
    const allSkins = getAllSkins()
    const allSkinsWithCustom = [...allSkins, ...customSkins]
    const currentSelected = Array.from(selectedSkins)
    const availableSkins = allSkinsWithCustom.filter(skin => !currentSelected.includes(skin.id))
    
    console.log('Adding random skins. Available:', availableSkins.length, 'Current selected:', currentSelected.length)
    console.log('All skins count:', allSkinsWithCustom.length)
    console.log('Current selected skin IDs:', currentSelected)
    console.log('Available skin IDs:', availableSkins.map(s => s.id))
    console.log('Available skin names:', availableSkins.map(s => s.name))
    
    if (availableSkins.length === 0) {
      console.log('No available skins to add')
      return
    }
    
    const randomSkins = availableSkins
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, availableSkins.length))
      .map(skin => skin.id)
    
    console.log('Random skins to add:', randomSkins)
    console.log('New selected skins will be:', [...currentSelected, ...randomSkins])
    
    const newSelectedSkins = [...currentSelected, ...randomSkins]
    setSelectedSkins(newSelectedSkins)
    // Update skinOrder to include new skins at the end
    setSkinOrder(newSelectedSkins)
    
    // Update wheel data with new selection
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins: newSelectedSkins,
        skinOrder: newSelectedSkins
      })
    }
    
    // Force re-render to update UI
    setForceUpdate(prev => prev + 1)
    
    console.log('Added', randomSkins.length, 'random skins')
  }

  const addManualSkin = () => {
    if (!manualInput.trim()) return

    const customSkin: Skin = {
      id: `custom-${Date.now()}`,
      name: manualInput.trim(),
      rarity: "Common",
      emoji: "🎮",
      season: "Custom",
      preview: "/placeholder.svg?height=100&width=100&text=Custom",
    }

    // Add to selected skins directly since we can't modify the original data
    const newSelected = new Set(selectedSkins)
    newSelected.add(customSkin.id)
    setSelectedSkins(newSelected)

    setManualInput("")
  }

  const spinWheel = () => {
    const availableSkins = getFilteredSkins()
    if (availableSkins.length === 0) return

    setIsSpinning(true)

    const spins = 8 + Math.random() * 4  // Increased from 5+5 to 8+4 for longer spinning
    const randomAngle = Math.random() * 360
    const finalRotation = rotation + spins * 360 + randomAngle

    setRotation(finalRotation)

    // Increased duration - make it spin longer
    const spinDuration = Math.max(4000, settings.spinBehavior.spinningDuration * 200)  // Minimum 4 seconds, double the original duration
    
    setTimeout(() => {
      // Calculate which segment the pointer is pointing to (pointer is at 12 o'clock = 0 degrees)
      const finalAngle = finalRotation % 360
      const segmentAngle = 360 / availableSkins.length
      
      // Debug: Log the calculation
      console.log('Final rotation:', finalRotation)
      console.log('Final angle:', finalAngle)
      console.log('Segment angle:', segmentAngle)
      console.log('Available skins:', availableSkins.length)
      
      // When wheel rotates clockwise, segments move clockwise
      // Segment 0 starts at 0°, Segment 1 starts at segmentAngle°, etc.
      // After rotation, the segment that was at 0° is now at finalAngle°
      // To find which segment is now at 0° (12 o'clock), we need to find
      // which segment was originally at (360 - finalAngle)°
      let selectedIndex = Math.floor((360 - finalAngle) / segmentAngle)
      // Ensure the index is within bounds
      selectedIndex = ((selectedIndex % availableSkins.length) + availableSkins.length) % availableSkins.length
      const selectedSkin = availableSkins[selectedIndex]
      
      console.log('Selected index:', selectedIndex)
      console.log('Selected skin:', selectedSkin?.name)
      
      const result: SpinResult = {
        skin: selectedSkin,
        timestamp: new Date(),
      }

      setSpinResult(result)
      setAllResults((prev) => [...prev, result])
      setIsSpinning(false)
      setShowResultDialog(true) // Show the result dialog

      // Update wheel data with result and increment totalSpins (like MLB wheel)
      const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
      const currentWheel = getCurrentWheel()
      if (currentWheel) {
        const currentData = currentWheel.data as any
        updateWheelData("fortnite-wheel", currentWheel.id, {
          ...currentData,
          selectedResult: result,
          isSpinning: false,
          totalSpins: (currentData.totalSpins || 0) + 1,
          recentResults: [result, ...(currentData.recentResults || [])].slice(0, 10), // Keep last 10
          rotation: finalRotation
        })
      }

      // Call spin completed handler for achievements and analytics (but not for spin history)
      // handleSpinCompleted() // Removed to prevent duplication

      // Handle different action modes
      if (actionMode === "elimination") {
        console.log('ELIMINATION MODE: Starting elimination process...')
        console.log('Before elimination - selectedSkins:', selectedSkins.length, 'skins')
        console.log('Skin to eliminate:', selectedSkin.name, 'ID:', selectedSkin.id)
        
        // Remove the selected skin from available options IMMEDIATELY
        const newSelected = selectedSkins.filter(id => id !== selectedSkin.id)
        console.log('After elimination - newSelected:', newSelected.length, 'skins')
        
        // Update state immediately
        setSelectedSkins(newSelected)
        setSkinOrder(newSelected)
        setForceUpdate(prev => prev + 1) // Force re-render
        
        // Update wheel data immediately
        const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
        const currentWheel = getCurrentWheel()
        if (currentWheel) {
          updateWheelData("fortnite-wheel", currentWheel.id, {
            ...currentWheel.data,
            selectedSkins: newSelected,
            skinOrder: newSelected
          })
          console.log('Wheel data updated with elimination')
        }
        
        console.log(`Elimination mode: Removed ${selectedSkin.name} from available options. Remaining: ${newSelected.length} skins`)
        
        // Force immediate re-render
        setTimeout(() => {
          console.log('Forcing wheel re-render after elimination')
          console.log('Current getFilteredSkins count:', getFilteredSkins().length)
          console.log('getFilteredSkins includes eliminated skin?', getFilteredSkins().some(s => s.id === selectedSkin.id))
        }, 50)
      } else if (actionMode === "manual") {
        // Manual mode: Don't automatically spin, let user choose
        console.log('Manual mode: User should manually select a skin')
      } else {
        // Normal mode: All skins remain available for next spin
        console.log('Normal mode: All skins remain available for next spin')
      }
    }, spinDuration)
  }

  const getRarityCount = () => {
    const filtered = getFilteredSkins()
    const available = selectedRarity === "all" ? getAllSkins().length : (fortniteSkins[selectedRarity] || []).length
    return { selected: selectedSkins.length, available }
  }

  const handleAiQuerySubmit = () => {
    handleAiQuery()
  }

  // Manual mode: Allow user to manually select a skin
  const handleManualSelect = (skin: Skin) => {
    if (actionMode === "manual") {
      const result: SpinResult = {
        skin: skin,
        timestamp: new Date(),
      }
      
      setSpinResult(result)
      setAllResults((prev) => [...prev, result])
      
      // Update wheel data
      const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
      const currentWheel = getCurrentWheel()
      if (currentWheel) {
        const currentData = currentWheel.data as any
        updateWheelData("fortnite-wheel", currentWheel.id, {
          ...currentData,
          selectedResult: result,
          totalSpins: (currentData.totalSpins || 0) + 1,
          recentResults: [result, ...(currentData.recentResults || [])].slice(0, 10)
        })
      }
      
      console.log(`Manual mode: Selected ${skin.name}`)
    }
  }



  // Favorites and Comparison Helper Functions
  const addToFavorites = (skin: Skin) => {
    const newFavorites = [...favoriteSkins, skin]
    setFavoriteSkins(newFavorites)
    
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        favoriteSkins: newFavorites
      })
    }
  }

  const removeFromFavorites = (skinId: string) => {
    const newFavorites = favoriteSkins.filter(skin => skin.id !== skinId)
    setFavoriteSkins(newFavorites)
    
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        favoriteSkins: newFavorites
      })
    }
  }

  const isFavorite = (skinId: string) => {
    return favoriteSkins.some(skin => skin.id === skinId)
  }

  const addToComparison = (skin: Skin) => {
    if (comparisonSkins.length < 4) {
      const newComparison = [...comparisonSkins, skin]
      setComparisonSkins(newComparison)
      
      const currentWheel = getCurrentWheel()
      if (currentWheel) {
        updateWheelData("fortnite-wheel", currentWheel.id, {
          ...currentWheel.data,
          comparisonSkins: newComparison
        })
      }
    }
  }

  const removeFromComparison = (skinId: string) => {
    const newComparison = comparisonSkins.filter(skin => skin.id !== skinId)
    setComparisonSkins(newComparison)
    
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        comparisonSkins: newComparison
      })
    }
  }

  const isInComparison = (skinId: string) => {
    return comparisonSkins.some(skin => skin.id === skinId)
  }

  // Enhanced Details Handler
  const handleEnhancedDetails = (skin: Skin) => {
    const enhancedInfo = getEnhancedSkinInfo(skin.id)
    setEnhancedDetailsSkin(skin)
    setEnhancedSkinDetails(enhancedInfo)
    setShowEnhancedDetails(true)
  }

  // Function to handle adding custom skins from AI recommendations
  const handleAddCustomSkin = (customSkin: {
    id: string
    name: string
    rarity: string
    season: string
    emoji: string
    isCustom: true
  }) => {
    console.log('Adding custom skin:', customSkin)
    
    // Convert to Skin type with preview
    const skinWithPreview: Skin = {
      id: customSkin.id,
      name: customSkin.name,
      rarity: customSkin.rarity,
      season: customSkin.season,
      emoji: customSkin.emoji,
      preview: `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(customSkin.name)}`
    }
    
    // Add to custom skins
    setCustomSkins(prev => {
      const exists = prev.some(skin => skin.id === customSkin.id)
      if (exists) return prev
      console.log('Adding to customSkins:', skinWithPreview)
      return [...prev, skinWithPreview]
    })

    // Add to selected skins so it appears on the wheel
    setSelectedSkins(prev => {
      if (prev.includes(customSkin.id)) return prev
      console.log('Adding to selectedSkins:', customSkin.id)
      return [...prev, customSkin.id]
    })

    // Update wheel data
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      const currentCustomSkins = (currentWheel.data as any).customSkins || []
      const customSkinExists = currentCustomSkins.some((skin: Skin) => skin.id === customSkin.id)
      
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        customSkins: customSkinExists ? currentCustomSkins : [...currentCustomSkins, customSkin]
      })
    }

    // Force wheel update
    setForceUpdate(prev => prev + 1)
    
    console.log('Custom skin added, forceUpdate:', forceUpdate + 1)
  }



  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return

    setAiLoading(true)
    const userMessage = aiQuery.trim()

    // Add user message to chat history
    const newChatEntry = {
      role: "user" as const,
      message: userMessage,
      timestamp: new Date(),
    }
    setAiChatHistory((prev) => [...prev, newChatEntry])

    try {
      // Call live AI API
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          context: {
            currentSkins: getFilteredSkins(),
            userPreferences,
            chatHistory: aiChatHistory.slice(-5), // Last 5 messages for context
            mode: aiMode
          }
        })
      })

      const result = await response.json()

      if (result.success && result.data) {
        const aiResponse = result.data.message
        const recommendedSkins = result.data.recommendedSkins || []

        console.log('AI Response received:', aiResponse)
        console.log('Recommended skins from AI:', recommendedSkins)

        // Add AI response to chat history
        const aiChatEntry = {
          role: "ai" as const,
          message: aiResponse,
          timestamp: new Date(),
        }
        setAiChatHistory((prev) => [...prev, aiChatEntry])
        setAiResponse(aiResponse)

        // Set recommended skins for display in the list
        if (recommendedSkins.length > 0) {
          console.log('AI recommended skins:', recommendedSkins)
          setAiRecommendedSkins(recommendedSkins)
        } else {
          setAiRecommendedSkins([])
        }
      } else {
        // Fallback to rule-based response
        const fallbackResponse = getFallbackResponse(userMessage)
        const aiChatEntry = {
          role: "ai" as const,
          message: fallbackResponse,
          timestamp: new Date(),
        }
        setAiChatHistory((prev) => [...prev, aiChatEntry])
        setAiResponse(fallbackResponse)
        setAiRecommendedSkins([]) // Clear recommendations on fallback
      }
    } catch (error) {
      console.error('AI API Error:', error)
      // Fallback to rule-based response
      const fallbackResponse = getFallbackResponse(userMessage)
      const aiChatEntry = {
        role: "ai" as const,
        message: fallbackResponse,
        timestamp: new Date(),
      }
      setAiChatHistory((prev) => [...prev, aiChatEntry])
      setAiResponse(fallbackResponse)
      setAiRecommendedSkins([]) // Clear recommendations on error
    }

    setAiLoading(false)
    setAiQuery("")
  }

  // Fallback response function
  const getFallbackResponse = (userMessage: string): string => {
    const query = userMessage.toLowerCase()
    
    if (query.includes("rare") || query.includes("legendary") || query.includes("rarest")) {
      return "💎 Here are the rarest skins! I've added all Mythic and Legendary tier skins to your wheel: Golden Peely, The Foundation, Galactus, and more! These have the highest prestige and are extremely exclusive!"
    }
    
    if (query.includes("anime") || query.includes("collaborations")) {
      return "🍥 Anime collaborations are amazing! I've added all anime skins to your wheel: Naruto, Goku, Vegeta, and more! These crossover skins are incredibly popular!"
    }
    
    if (query.includes("marvel") || query.includes("superhero")) {
      return "🦸‍♂️ Marvel skins are epic! I've added all Marvel collaboration skins to your wheel: Iron Man, Deadpool, Wolverine, Thor, and more!"
    }
    
    return `🤖 I understand you're asking about "${userMessage}". I can help with skin recommendations, rarity analysis, collection tips, and wheel strategies. Try asking "what are the rarest skins?" or "tell me about anime collaborations"!`
  }

  const getCollaborationStats = () => {
    const allSkins = getAllSkins()
    const collaborationSkins = allSkins.filter(
      (skin) =>
        skin.season.includes("Marvel") ||
        skin.season.includes("DC") ||
        skin.season.includes("Star Wars") ||
        skin.season.includes("Anime") ||
        skin.season.includes("Dragon Ball"),
    )
    return {
      total: collaborationSkins.length,
    }
  }

  // Check achievements and record analytics when result changes
  useEffect(() => {
    if (spinResult && spinResult.skin.name !== lastProcessedResult.current) {
      lastProcessedResult.current = spinResult.skin.name
      const totalSpins = allResults.length + 1
      const uniqueResults = new Set(allResults.map(r => r.skin.name)).size
      
      // Record the spin for analytics
      const newSpinRecord: SpinRecord = {
        id: Date.now().toString(),
        timestamp: new Date(),
        result: spinResult.skin.name,
        options: getFilteredSkins().map(skin => skin.name),
        mode: actionMode === "normal" ? "manual" : actionMode === "elimination" ? "manual" : "manual",
        theme: currentTheme,
        spinDuration: settings.spinBehavior.spinningDuration / 10,
        userQuestion: undefined
      }
      
      // const updatedSpinHistory = [...spinHistory, newSpinRecord]
      // setSpinHistory(updatedSpinHistory) // Removed to prevent duplication
      
      // Get game stats
      const stats = {
        totalSpins,
        uniqueResults,
        perfectMemoryRounds: 0,
        bingoWins: 0,
        fastestMemoryTime: 0,
        consecutiveDays: 1,
        totalOptions: getFilteredSkins().length,
        aiGeneratedOptions: 0,
        mysterySpins: 0
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
          updateWheelData("fortnite-wheel", currentWheel.id, {
            ...currentWheel.data,
            achievements: updatedAchievements,
            themes: updatedThemes
            // spinHistory: updatedSpinHistory // Removed to prevent duplication
          })
        }
      } else {
        // Save spin history even if no new achievements
        const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
        const currentWheel = getCurrentWheel()
        if (currentWheel) {
          updateWheelData("fortnite-wheel", currentWheel.id, {
            ...currentWheel.data
            // spinHistory: updatedSpinHistory // Removed to prevent duplication
          })
        }
      }
    }
  }, [spinResult, achievements, themes, totalPoints, allResults, actionMode, currentTheme, settings.spinBehavior.spinningDuration])

  return (
    <ToastProvider>
      <div 
        className={`min-h-screen transition-colors duration-300 ${isFullscreen ? "fixed inset-0 z-50" : ""}`} 
        style={{ 
          backgroundColor: settings.appearance.backgroundColor,
          backgroundImage: settings.appearance.backgroundImage
            ? `url(${settings.appearance.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Header onOpenSettings={() => setShowSettings(true)} />

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
                updateWheelData("fortnite-wheel", currentWheel.id, {
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

        {/* Full Page Confetti */}
        {showConfetti && typeof window !== 'undefined' && (
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight} 
            numberOfPieces={400} 
            recycle={false} 
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
          />
        )}

        <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <ToolPageTitle title="Fortnite Skins Picker Wheel" toolType="fortnite-wheel" />
            <p className="text-gray-600">Pick a random Fortnite skin by wheel</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    {!isInitialized || !isDataLoaded ? (
                      <div className="flex items-center justify-center w-[700px] h-[700px] bg-gray-100 rounded-full">
                        <div className="text-center">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading skins...</p>
                        </div>
                      </div>
                    ) : (
                      <WheelComponent
                        key={`fortnite-wheel-${currentTheme}-${selectedRarity}-${Array.isArray(selectedSkins) ? selectedSkins.join(',') : ''}-${forceUpdate}`}
                        skins={getFilteredSkins()}
                        rotation={rotation}
                        isSpinning={isSpinning}
                        spinDuration={Math.max(4, settings.spinBehavior.spinningDuration / 5)}
                        wheelRef={wheelRef as React.RefObject<HTMLDivElement>}
                        displayMode={displayMode}
                        currentTheme={currentTheme}
                        themes={themes}
                        onSpinCompleted={handleSpinCompleted}
                      />
                    )}

                    {isSpinning && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                        Spinning...
                      </div>
                    )}

                    {isAdvancedGameActive && currentSession?.gameMode && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300 p-2">
                        <p className="text-xs font-semibold text-purple-800">
                          🎮 Playing: {currentSession.gameMode.name}
                        </p>
                      </div>
                    )}

                    {/* Mute Button */}
                    <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMuted((m) => !m)}
                        className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-md"
                        title={settings.confettiSound?.enableSound ? (muted ? "Unmute" : "Mute") : "Global sound disabled"}
                      >
                        {!settings.confettiSound?.enableSound ? (
                          <VolumeX className="w-5 h-5 text-gray-400" />
                        ) : muted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </Button>
                    </div>

                    {/* Confetti Display - Removed from here */}
                  </div>

                  {/* Spin Count Display */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {displaySpinCount}
                        </div>
                        <div className="text-sm opacity-90">Total Spins</div>
                      </div>
                    </div>
                  </div>

                  {/* Spin Controls */}
                  <div className="flex flex-col items-center space-y-4">
                    {/* Spin Button */}
                    <Button
                      onClick={handleSpin}
                      disabled={isSpinning || getFilteredSkins().length === 0}
                      className="font-bold py-3 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    >
                      {isSpinning ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Spinning...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>🎯 SPIN THE WHEEL</span>
                        </div>
                      )}
                    </Button>

                    {/* Quick Input Field for Manual Mode */}
                    {actionMode === "manual" && (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={manualSkinName}
                          onChange={(e) => setManualSkinName(e.target.value)}
                          placeholder="Type skin name..."
                          className="w-32 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && manualSkinName.trim()) {
                              handleAddManualSkin()
                            }
                          }}
                        />
                        <Button
                          onClick={handleAddManualSkin}
                          disabled={!manualSkinName.trim()}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Add
                        </Button>
                      </div>
                    )}

                    {/* Mode Selection */}
                    <div className="flex flex-col items-center space-y-2">
                      <Label className="text-sm font-medium text-gray-800">Mode:</Label>
                      <RadioGroup value={actionMode} onValueChange={(value) => setActionMode(value as ActionMode)} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal" className="text-sm">Normal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="elimination" id="elimination" />
                          <Label htmlFor="elimination" className="text-sm">Elimination</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="manual" id="manual" />
                          <Label htmlFor="manual" className="text-sm">Manual</Label>
                        </div>
                      </RadioGroup>
                      
                      {/* Mode Description */}
                      <div className="text-xs text-gray-600 text-center mt-2">
                        {actionMode === "normal" && "🎯 All skins available for each spin"}
                        {actionMode === "elimination" && "❌ Selected skin is removed after each spin"}
                        {actionMode === "manual" && "📝 Add custom skins by typing names"}
                      </div>
                    </div>

                    {/* Current Result Display */}
                    {spinResult && (
                      <div className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 rounded-lg p-4 text-center">
                        <h3 className="text-lg font-bold text-green-800 mb-2">🎉 Current Result:</h3>
                        <div className="flex items-center justify-center space-x-3">
                          <span className="text-3xl">{spinResult.skin.emoji}</span>
                          <div>
                            <p className="text-xl font-semibold text-gray-800">{spinResult.skin.name}</p>
                            <p className="text-sm text-gray-600">{spinResult.skin.season}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => setShowResults(true)}
                        variant="outline"
                        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Results ({spinHistory.length})
                      </Button>
                      <Button
                        onClick={() => {
                          setSpinHistory([])
                          setSpinResult(null)
                          setAllResults([])
                          setIsSpinning(false) // Force reset spinning state
                        }}
                        variant="outline"
                        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>



                  <div className="flex flex-wrap items-center gap-2 justify-center mt-6 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAchievements(true)}
                      className="text-xs px-3 py-1 bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    >
                      <Trophy className="w-3 h-3 mr-1" />
                      Achievements ({totalPoints})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowThemeSelector(true)}
                      className="text-xs px-3 py-1 bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
                    >
                      <Palette className="w-3 h-3 mr-1" />
                      Themes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAnalytics(true)}
                      className="text-xs px-3 py-1 bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Analytics
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSocialHub(true)}
                      className="text-xs px-3 py-1 bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Social
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGameModes(true)}
                      className="text-xs px-3 py-1 bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <Gamepad2 className="w-3 h-3 mr-1" />
                      Games
                    </Button>
                  </div>
                </div>
              </div>

              {showInputs && (
                <div className="lg:col-span-1">
                  <Tabs defaultValue="skins" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="skins">Skins</TabsTrigger>
                      <TabsTrigger value="ai">AI</TabsTrigger>
                      <TabsTrigger value="stats">Stats</TabsTrigger>
                    </TabsList>
                    <TabsContent value="skins">
                      <SkinsTab
                        key={`skins-tab-${selectedSkins.length}-${forceUpdate}`}
                        selectedRarity={selectedRarity}
                        selectedSkins={selectedSkins}
                        displayMode={displayMode}
                        showTitle={showTitle}
                        onRarityChange={handleRarityChange}
                        onSkinToggle={handleSkinToggle}
                        onClearAll={handleClearAll}
                        onDisplayModeChange={setDisplayMode}
                        onShowTitleToggle={() => setShowTitle(!showTitle)}
                        onPreviewSkin={handlePreviewSkin}
                        getRarityCount={getRarityCount}
                        onShuffleSkins={handleShuffleSkins}
                        onSortSkinsAZ={handleSortSkinsAZ}
                        onAddRandomSkins={handleAddRandomSkins}
                        onOpenFavorites={() => setShowFavoritesModal(true)}
                        onOpenComparison={() => setShowComparisonModal(true)}
                        addToFavorites={addToFavorites}
                        removeFromFavorites={removeFromFavorites}
                        isFavorite={isFavorite}
                        addToComparison={addToComparison}
                        removeFromComparison={removeFromComparison}
                        isInComparison={isInComparison}
                        favoriteSkins={favoriteSkins}
                        comparisonSkins={comparisonSkins}
                        onEnhancedDetails={handleEnhancedDetails}
                        onManualSelect={handleManualSelect}
                        actionMode={actionMode}
                        customSkins={customSkins}
                        onDeleteCustomSkin={handleDeleteCustomSkin}
                      />
                    </TabsContent>
                    <TabsContent value="ai">
                                              <AITab
                          aiMode={aiMode}
                          aiQuery={aiQuery}
                          aiResponse={aiResponse}
                          aiLoading={aiLoading}
                          aiChatHistory={aiChatHistory}
                          aiRecommendations={aiRecommendations}
                          userPreferences={userPreferences}
                          selectedSkins={new Set(selectedSkins)}
                          onModeChange={setAiMode}
                          onQueryChange={setAiQuery}
                          onQuerySubmit={handleAiQuerySubmit}
                          onPreferencesChange={setUserPreferences}
                          onSkinsChange={(skins) => {
                            const newSelectedSkins = Array.from(skins || new Set())
                            setSelectedSkins(newSelectedSkins)
                            
                            // Update wheel data when AI changes skins
                            const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
                            const currentWheel = getCurrentWheel()
                            if (currentWheel) {
                              updateWheelData("fortnite-wheel", currentWheel.id, {
                                ...currentWheel.data,
                                selectedSkins: newSelectedSkins,
                                skinOrder: newSelectedSkins
                              })
                            }
                          }}
                          onResponseChange={setAiResponse}
                          getAllSkins={getAllSkins}
                          getFilteredSkins={getFilteredSkins}
                          onRarityChange={setSelectedRarity}
                          aiRecommendedSkins={aiRecommendedSkins}
                          onAddCustomSkin={handleAddCustomSkin}
                        />
                    </TabsContent>
                    <TabsContent value="stats">
                      <StatsTab
                        skinStats={skinStats}
                        allResults={allResults}
                        getAllSkins={getAllSkins}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
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
            
            const spinRecords: SpinRecord[] = recentResults.map((result: any, index: number) => ({
              id: `spin-${Date.now()}-${index}`,
              timestamp: new Date(Date.now() - (recentResults.length - index - 1) * 1000),
              result: result.name,
              options: wheelData.selectedSkins?.map((skinId: string) => {
                const skin = getFilteredSkins().find(s => s.id === skinId);
                return skin?.name || skinId;
              }) || [],
              mode: actionMode === "normal" ? "manual" : actionMode === "elimination" ? "manual" : "manual",
              theme: currentTheme,
              spinDuration: 3,
              userQuestion: undefined
            }));
            
            const analyticsData = analyzeSpinData(spinRecords);
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
            console.log('Share wheel functionality')
          }}
        />

        <PickerWheelGameModes
          isVisible={showGameModes}
          onClose={() => setShowGameModes(false)}
          userPoints={totalPoints}
          onStartGame={(gameMode: GameMode) => {
            const currentWheel = getCurrentWheel();
            if (currentWheel) {
              const { updateWheelData } = useWheelManagerStore.getState();
              updateWheelData("fortnite-wheel", currentWheel.id, {
                ...currentWheel.data,
                totalSpins: 0,
                spinHistory: [],
                recentResults: [],
                selectedResult: null
              });
            }
            startAdvancedGame(gameMode);
            setShowGameModes(false);
          }}
        />

        {/* Results Dialog */}
        <ResultDialog
          open={showResults}
          onClose={() => setShowResults(false)}
          wheelName="All Wheels"
          results={(() => {
            // Get all Fortnite wheels and combine their results
            const { wheelsByTool } = useWheelManagerStore.getState()
            const allFortniteWheels = wheelsByTool["fortnite-wheel"] || []
            
            const allResults: any[] = []
            
            allFortniteWheels.forEach((wheel: any) => {
              const wheelData = wheel.data as any
              if (wheelData.spinHistory && Array.isArray(wheelData.spinHistory)) {
                wheelData.spinHistory.forEach((spinRecord: any) => {
                  const skin = getFilteredSkins().find(skin => skin.name === spinRecord.result) || {
                    id: spinRecord.result,
                    name: spinRecord.result,
                    emoji: '🎯',
                    rarity: 'Common',
                    season: 'Unknown',
                    preview: ''
                  }
                  
                  allResults.push({
                    skin,
                    timestamp: new Date(spinRecord.timestamp),
                    wheelName: spinRecord.wheelName || wheel.name // Use stored wheel name or fallback to wheel name
                  })
                })
              }
            })
            
            // Sort by timestamp (most recent first)
            return allResults.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          })()}
        />

        {/* Skin Preview Dialog */}
        <SkinPreviewDialog
          skin={showPreview ? previewSkin : null}
          onClose={() => setShowPreview(false)}
        />

        {/* Multi-Skin Preview Dialog */}
        <MultiSkinPreviewDialog
          skins={getFilteredSkins()}
          isOpen={showMultiSkinPreview}
          onClose={() => setShowMultiSkinPreview(false)}
        />



        {/* Enhanced Skin Details Modal */}
        <EnhancedSkinDetailsModal
          isOpen={showEnhancedDetails}
          onClose={() => setShowEnhancedDetails(false)}
          skin={enhancedDetailsSkin}
        />

        {/* Favorites Modal */}
        <FortniteFavoritesModal
          isOpen={showFavoritesModal}
          onClose={() => setShowFavoritesModal(false)}
        />

        {/* Comparison Modal */}
        <FortniteComparisonModal
          isOpen={showComparisonModal}
          onClose={() => setShowComparisonModal(false)}
        />

        <PickerWheelGameStatus
          isVisible={isAdvancedGameActive}
          currentSession={currentSession}
          onEndGame={endAdvancedGame}
          onRestartGame={restartAdvancedGame}
          getGameProgress={getGameProgress}
          isGameComplete={isGameComplete}
          getGameScore={getGameScore}
          getGameResults={getGameResults}
          getGameStats={getGameStats}
        />

        {!isFullscreen && (
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-4 right-4 bg-white/90 hover:bg-white shadow-md"
            onClick={() => setShowInputs(!showInputs)}
          >
            {showInputs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </ToastProvider>
  )
}


