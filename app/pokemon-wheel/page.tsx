"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
import { WheelComponent } from "@/components/pokemon/wheel-component"
import { PokemonTab } from "@/components/pokemon/tabs/pokemon-tab"
import { AITab } from "@/components/pokemon/tabs/ai-tab"
import { StatsTab } from "@/components/pokemon/tabs/stats-tab"
import { ResultDialog } from "@/components/pokemon/dialogs/result-dialog"
import PokemonFavoritesModal from "@/components/pokemon/dialogs/pokemon-favorites-modal"
import PokemonComparisonModal from "@/components/pokemon/dialogs/pokemon-comparison-modal"
import PokemonPreviewModal from "@/components/pokemon/dialogs/pokemon-preview-modal"
import { PokemonMultiPreviewDialog } from "@/components/pokemon/dialogs/pokemon-multi-preview-dialog"

// Import types and data
import { pokemonData } from "@/data/pokemon-data"
import { typeColors } from "@/constants/type-config"
import type { Pokemon, SpinResult, DisplayMode, ActionMode, GenerationFilter } from "@/types/pokemon-types"

export default function PokemonPicker() {
  // Wheel Manager Store
  const { 
    setCurrentTool, 
    createNewWheel, 
    getCurrentWheel, 
    updateWheelData, 
    loadFromDatabase: loadWheelManager, 
    currentWheelId 
  } = useWheelManagerStore()

  // Settings Store
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()

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

  // Local state
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [displaySpinCount, setDisplaySpinCount] = useState(0)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confetti, setConfetti] = useState<any[]>([])
  const [spinResult, setSpinResult] = useState<any>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinHistory, setSpinHistory] = useState<any[]>([])
  const [manualPokemonName, setManualPokemonName] = useState("")
  const [selectedPokemon, setSelectedPokemon] = useState<string[]>([])
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [showFavoritesModal, setShowFavoritesModal] = useState(false)
  const [showComparisonModal, setShowComparisonModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAllResults, setShowAllResults] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [muted, setMuted] = useState(false)
  const [previewPokemon, setPreviewPokemon] = useState<Pokemon | null>(null)
  const [showMultiPokemonPreview, setShowMultiPokemonPreview] = useState(false)
  // Favorites and Comparison state - using wheel store directly

  // Tool features state
  const [achievements, setAchievements] = useState(PICKER_WHEEL_ACHIEVEMENTS)
  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES)
  const [currentTheme, setCurrentTheme] = useState('classic')
  const [totalPoints, setTotalPoints] = useState(0)
  
  // Debug: Log theme unlock requirements
  useEffect(() => {
    console.log('🎨 Available themes and their unlock requirements:')
    themes.forEach(theme => {
      if (!theme.unlocked && theme.unlockRequirement) {
        console.log(`🎨 ${theme.name} (${theme.rarity}):`, theme.unlockRequirement)
      }
    })
    console.log('🎨 Current total points:', totalPoints)
  }, [themes, totalPoints])
  const [currentUser, setCurrentUser] = useState<SocialProfile | undefined>()
  const lastProcessedResult = useRef<string>('')
  const lastSpinRecorded = useRef<string>('')
  const lastGameSpinRecorded = useRef<string>('')

  // AI Features
  const [aiRecommendations, setAiRecommendations] = useState<Pokemon[]>([])
  const [aiRecommendedPokemon, setAiRecommendedPokemon] = useState<string[]>([])
  const [pokemonStats, setPokemonStats] = useState<Record<string, number>>({})
  const [aiQuery, setAiQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ role: "user" | "ai"; message: string; timestamp: Date }>>([])
  const [aiMode, setAiMode] = useState<"chat" | "analysis" | "generator">("chat")
  const [userPreferences, setUserPreferences] = useState({
    favoriteTypes: [] as string[],
    preferredGeneration: "all" as string,
    playStyle: "casual" as string,
    favoriteRegions: [] as string[],
  })

  // Custom Pokemon state
  const [customPokemon, setCustomPokemon] = useState<Pokemon[]>([])
  
  // Action Mode state (like Fortnite wheel)
  const [actionMode, setActionMode] = useState<"normal" | "elimination" | "manual">("normal")

  // Refs
  const wheelRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const confettiRef = useRef<number>()

  // Initialize tool and load data
  useEffect(() => {
    const initializeTool = async () => {
      try {
        // Set current tool first (like Fortnite wheel does)
        setCurrentTool("pokemon-wheel")
        
        // Load settings
        await loadSettings()
        
        // Check if wheel exists, create if not
        const wheel = getCurrentWheel()
        
        if (!wheel) {
          const id = `pokemon-wheel-${Date.now()}`
          const now = new Date().toISOString()
          createNewWheel("pokemon-wheel", "Pokemon Picker Wheel", id, now, now)
          
          // Get the newly created wheel
          const newWheel = getCurrentWheel()
          
          if (newWheel?.data) {
            // Auto-select all Pokemon on first load
            const allPokemon = getAllPokemon()
            const allPokemonIds = allPokemon.map(pokemon => pokemon.id)
            
            updateWheelData("pokemon-wheel", newWheel.id, {
              ...newWheel.data,
              selectedPokemon: allPokemonIds,
              selectedGeneration: "all",
              displayMode: "emoji-name",
              actionMode: "normal"
            })
          }
        } else {
          // Load existing wheel data (like Fortnite wheel)
          const wheelData = wheel.data as any
          console.log('Loading existing wheel data:', wheelData)
          
          if (wheelData.totalSpins !== undefined) {
            console.log('Loading totalSpins from wheel data:', wheelData.totalSpins)
            setDisplaySpinCount(wheelData.totalSpins)
          }
          
          if (wheelData.spinHistory) {
            console.log('Loading existing spin history from wheel data:', wheelData.spinHistory.length, 'spins')
            setSpinHistory(wheelData.spinHistory)
          }
          
          if (wheelData.customPokemon) {
            console.log('Loading customPokemon from wheel data:', wheelData.customPokemon.length, 'Pokemon')
            // Custom Pokemon are already included in getFilteredPokemon via wheelData.customPokemon
          } else {
            console.log('No customPokemon in wheel data')
          }
          
          if (wheelData.selectedPokemon) {
            console.log('Loading selectedPokemon from wheel data:', wheelData.selectedPokemon.length, 'Pokemon')
            setSelectedPokemon(wheelData.selectedPokemon)
          } else {
            console.log('No selectedPokemon in wheel data')
          }
          
          if (wheelData.favoritePokemon) {
            console.log('Loading favoritePokemon from wheel data:', wheelData.favoritePokemon.length, 'Pokemon')
          } else {
            console.log('No favoritePokemon in wheel data')
          }
          
          if (wheelData.comparisonPokemon) {
            console.log('Loading comparisonPokemon from wheel data:', wheelData.comparisonPokemon.length, 'Pokemon')
          } else {
            console.log('No comparisonPokemon in wheel data')
          }
        }
        
        // Always set as loaded after initialization
        setIsDataLoaded(true)
        setIsInitialized(true)
        
      } catch (error) {
        console.error("Error initializing Pokemon wheel:", error)
        setIsDataLoaded(true)
        setIsInitialized(true)
      }
    }

    initializeTool()
  }, [setCurrentTool, loadSettings, getCurrentWheel, createNewWheel, updateWheelData])

  // Save data to wheel manager store whenever it changes (like Fortnite wheel)
  useEffect(() => {
    const currentWheel = getCurrentWheel()
    if (currentWheel && isInitialized) {
      updateWheelData("pokemon-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedPokemon,
        totalSpins: displaySpinCount,
        spinHistory,
        customPokemon,
        selectedGeneration: getCurrentWheelData()?.selectedGeneration || "all",
        displayMode: getCurrentWheelData()?.displayMode || "emoji-name",
        actionMode: getCurrentWheelData()?.actionMode || "normal",
        achievements,
        themes,
        currentTheme
      })
    }
  }, [selectedPokemon, displaySpinCount, spinHistory, customPokemon, achievements, themes, currentTheme, isInitialized])

  // Listen for wheel changes and update local state (like Fortnite wheel)
  useEffect(() => {
    console.log('Wheel change effect triggered - currentWheelId:', currentWheelId, 'isInitialized:', isInitialized)
    
    const currentWheel = getCurrentWheel()
    console.log('getCurrentWheel() returned:', currentWheel)
    
    if (currentWheel?.data && isInitialized) {
      const wheelData = currentWheel.data as any
      
      console.log('Wheel changed, loading data from wheel:', currentWheel.id)
      console.log('Wheel data:', wheelData)
      
      // Update local state to match current wheel data
      if (wheelData.selectedPokemon) {
        console.log('Loading selectedPokemon from wheel data:', wheelData.selectedPokemon.length, 'Pokemon')
        setSelectedPokemon(wheelData.selectedPokemon)
      } else {
        console.log('No selectedPokemon in wheel data, clearing selection')
        setSelectedPokemon([])
      }
      
      if (wheelData.totalSpins !== undefined) {
        console.log('Loading totalSpins from wheel data:', wheelData.totalSpins)
        setDisplaySpinCount(wheelData.totalSpins)
      }
      
      if (wheelData.spinHistory) {
        console.log('Loading spinHistory from wheel data:', wheelData.spinHistory.length, 'spins')
        setSpinHistory(wheelData.spinHistory)
      }
      
      if (wheelData.customPokemon) {
        console.log('Loading customPokemon from wheel data:', wheelData.customPokemon.length, 'Pokemon')
        setCustomPokemon(wheelData.customPokemon)
      } else {
        console.log('No customPokemon in wheel data, clearing custom Pokemon')
        setCustomPokemon([])
      }
      
      if (wheelData.achievements) {
        console.log('Loading achievements from wheel data:', wheelData.achievements.length, 'achievements')
        setAchievements(wheelData.achievements)
      }
      
      if (wheelData.themes) {
        console.log('Loading themes from wheel data:', wheelData.themes.length, 'themes')
        setThemes(wheelData.themes)
      }
      
      if (wheelData.currentTheme) {
        console.log('Loading currentTheme from wheel data:', wheelData.currentTheme)
        setCurrentTheme(wheelData.currentTheme)
      }
      
      // Force wheel component to re-render with new data
      setForceUpdate(prev => prev + 1)
    }
  }, [currentWheelId, isInitialized])

  // Subscribe to wheel manager store changes (like Fortnite wheel)
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

  // Helper functions - like Fortnite wheel
  const getCurrentWheelData = () => {
    const wheel = getCurrentWheel()
    return wheel?.data as any
  }

  const updateCurrentWheelData = (updates: Partial<any>) => {
    const wheel = getCurrentWheel()
    if (wheel) {
      updateWheelData("pokemon-wheel", wheel.id, { ...wheel.data, ...updates })
    }
  }

  const getAllPokemon = (): Pokemon[] => {
    const allPredefinedPokemon = Object.values(pokemonData).flat() as Pokemon[]
    return [...allPredefinedPokemon, ...customPokemon]
  }

  const getFilteredPokemon = useCallback((): Pokemon[] => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return []

    // For wheel display, show ALL selected Pokemon regardless of generation
    const allPredefinedPokemon = Object.values(pokemonData).flat() as Pokemon[]
    const customPokemonFromWheel = wheelData.customPokemon || []
    const allPokemon = [...allPredefinedPokemon, ...customPokemonFromWheel]

    // Use wheel data selectedPokemon to preserve order
    const selectedIds = wheelData.selectedPokemon || []
    
    // Create a map for quick lookup
    const pokemonMap = new Map(allPokemon.map(pokemon => [pokemon.id, pokemon]))
    
    // Return Pokemon in the order they appear in selectedPokemon
    const result = selectedIds
      .map(id => pokemonMap.get(id))
      .filter((pokemon): pokemon is Pokemon => pokemon !== undefined)
    
    return result
  }, [pokemonData])

  const handleGenerationChange = (generation: GenerationFilter) => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    const newSelected: string[] = []
    if (generation === "all") {
      getAllPokemon().forEach((pokemon) => newSelected.push(pokemon.id))
    } else {
      (pokemonData[generation] || []).forEach((pokemon) => newSelected.push(pokemon.id))
    }

    // Update both local state and wheel data
    setSelectedPokemon(newSelected)
    updateCurrentWheelData({
      selectedGeneration: generation,
      selectedPokemon: newSelected
    })
  }

  const handlePokemonToggle = (pokemonId: string) => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    const newSelected = [...(wheelData.selectedPokemon || [])]
    const index = newSelected.indexOf(pokemonId)
    if (index > -1) {
      newSelected.splice(index, 1)
    } else {
      newSelected.push(pokemonId)
    }

    // Update both local state and wheel data
    setSelectedPokemon(newSelected)
    updateCurrentWheelData({ selectedPokemon: newSelected })
  }

  const clearAllPokemon = () => {
    updateCurrentWheelData({ selectedPokemon: [] })
  }

    // Favorites and Comparison functions - use wheel store directly
  const addToFavorites = (pokemon: Pokemon) => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    const newFavorites = [...(wheelData.favoritePokemon || []), pokemon]
    updateCurrentWheelData({ favoritePokemon: newFavorites })
    setForceUpdate(prev => prev + 1) // Force re-render to update UI
  }

  const removeFromFavorites = (pokemonId: string) => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    const newFavorites = (wheelData.favoritePokemon || []).filter(p => p.id !== pokemonId)
    updateCurrentWheelData({ favoritePokemon: newFavorites })
    setForceUpdate(prev => prev + 1) // Force re-render to update UI
  }

  const isFavorite = (pokemonId: string) => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return false

    return (wheelData.favoritePokemon || []).some(p => p.id === pokemonId)
  }

  const addToComparison = (pokemon: Pokemon) => {
    console.log('addToComparison called with:', pokemon.name)
    const wheelData = getCurrentWheelData()
    console.log('wheelData:', wheelData)
    if (!wheelData) {
      console.log('No wheelData found, returning')
      return
    }

    const currentComparison = wheelData.comparisonPokemon || []
    console.log('Current comparison:', currentComparison.length, 'Pokemon')
    console.log('Comparison Pokemon names:', currentComparison.map(p => p.name))
    
    // Check if Pokemon is already in comparison
    if (currentComparison.some(p => p.id === pokemon.id)) {
      console.log('Pokemon already in comparison, returning')
      return // Already in comparison, don't add again
    }
    
    // Check if we've reached the limit
    if (currentComparison.length >= 8) {
      console.log('Comparison limit reached (8), returning')
      return // Maximum 8 Pokemon allowed
    }
    
    const newComparison = [...currentComparison, pokemon]
    console.log('Adding Pokemon to comparison, new count:', newComparison.length)
    updateCurrentWheelData({ comparisonPokemon: newComparison })
    setForceUpdate(prev => prev + 1) // Force re-render to update UI
    console.log('addToComparison completed')
  }

  const removeFromComparison = (pokemonId: string) => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    const newComparison = (wheelData.comparisonPokemon || []).filter(p => p.id !== pokemonId)
    updateCurrentWheelData({ comparisonPokemon: newComparison })
    setForceUpdate(prev => prev + 1) // Force re-render to update UI
  }

  const isInComparison = (pokemonId: string) => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return false

    return (wheelData.comparisonPokemon || []).some(p => p.id === pokemonId)
  }

  const spinWheel = () => {
    console.log('🎯 spinWheel called')
    const availablePokemon = getFilteredPokemon()
    console.log('🎯 availablePokemon:', availablePokemon.length, availablePokemon.map(p => p.name))
    if (availablePokemon.length === 0) {
      console.log('🎯 No Pokemon available, spin blocked')
      return
    }

    if (isSpinning) {
      console.log('🎯 Already spinning, spin blocked')
      return
    }

    console.log('🎯 Starting spin...')
    setIsSpinning(true)
    setShowConfetti(false) // Reset confetti for new spin

    // Calculate rotation for smooth animation with better randomization (like Fortnite wheel)
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    const currentRotation = wheelData.rotation || 0
    const baseRotation = currentRotation + (360 * 5) // Add 5 full rotations to current position
    const randomFinalAngle = Math.random() * 360 // Random final position
    const finalRotation = baseRotation + randomFinalAngle + (Math.random() * 10) // Add extra randomness

    updateCurrentWheelData({ isSpinning: true })
    updateCurrentWheelData({ rotation: finalRotation })

    // Calculate result based on final wheel position and triangle pointer
    // Triangle is at 3 o'clock position (0 degrees), so we need to calculate which segment is under it
    const normalizedRotation = finalRotation % 360
    const angleUnderPointer = (360 - normalizedRotation) % 360 // Convert to clockwise from 3 o'clock
    const segmentAngle = 360 / availablePokemon.length
    const selectedIndex = Math.floor(angleUnderPointer / segmentAngle) % availablePokemon.length
    const selectedPokemonResult = availablePokemon[selectedIndex]

    // Handle elimination mode IMMEDIATELY before setTimeout (like Fortnite wheel)
    if (wheelData?.actionMode === "elimination") {
      console.log('🎯 ELIMINATION MODE: Processing elimination immediately...')
      console.log('🎯 Before elimination - selectedPokemon:', selectedPokemon.length, 'Pokemon')
      console.log('🎯 Pokemon to eliminate:', selectedPokemonResult.name, 'ID:', selectedPokemonResult.id)
      
      // Remove the selected Pokemon from available options IMMEDIATELY
      const newSelected = selectedPokemon.filter(id => id !== selectedPokemonResult.id)
      console.log('🎯 After elimination - newSelected:', newSelected.length, 'Pokemon')
      
      // Update state immediately
      setSelectedPokemon(newSelected)
      setForceUpdate(prev => prev + 1) // Force re-render
      
      // Update wheel data immediately
      updateCurrentWheelData({ selectedPokemon: newSelected })
      console.log('🎯 Wheel data updated with elimination')
      
      console.log(`🎯 Elimination mode: Removed ${selectedPokemonResult.name} from available options. Remaining: ${newSelected.length} Pokemon`)
    }

    setTimeout(() => {
      console.log('🎯 Setting spin result...')
      
      // Set result based on triangle position (like Fortnite wheel)
      const result: SpinResult = {
        pokemon: selectedPokemonResult,
        timestamp: new Date(),
      }
      
      setSpinResult(result)
      
      // Call spin completed callback for game sessions
      setTimeout(() => {
        handleSpinCompleted()
      }, 100) // Small delay to ensure state is updated
      
      // Update wheel data (like Fortnite wheel)
      const currentWheel = getCurrentWheel()
      if (currentWheel) {
        const spinRecord = {
          id: `spin-${Date.now()}`,
          timestamp: new Date(),
          result: selectedPokemonResult.name,
          options: availablePokemon.map(p => p.name),
          mode: wheelData?.actionMode || "normal",
          theme: currentTheme,
          spinDuration: Math.max(4, settings.spinBehavior.spinningDuration / 5),
          userQuestion: undefined,
          wheelName: currentWheel.name || "Pokemon Picker Wheel"
        }
        
        const newSpinHistory = [...spinHistory, spinRecord]
        const newTotalSpins = displaySpinCount + 1
        
        updateCurrentWheelData({
          isSpinning: false,
          selectedResult: result,
          totalSpins: newTotalSpins,
          spinHistory: newSpinHistory
        })
        
        setSpinHistory(newSpinHistory)
        setDisplaySpinCount(newTotalSpins)
      }
      
      setIsSpinning(false)
      console.log('🎯 Spin completed, result:', selectedPokemonResult?.name)

    }, Math.max(4, settings.spinBehavior.spinningDuration / 5) * 1000)
  }

  // Sound and confetti functions (like Fortnite wheel)
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

  // Sound and confetti effects (like Fortnite wheel)
  useEffect(() => {
    if (isSpinning && settings.confettiSound.enableSound && !muted) {
      playSpinSound()
    }
  }, [isSpinning, settings.confettiSound.enableSound, settings.confettiSound.soundVolume, muted])

  // Show confetti and play win sound when spin completes (like Fortnite wheel)
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

  // Trigger confetti effect (like Fortnite wheel)
  useEffect(() => {
    if (spinResult && !isSpinning && settings.confettiSound.enableConfetti) {
      createConfetti()
    }
  }, [spinResult, isSpinning, settings.confettiSound.enableConfetti])

  const handleSpinCompleted = () => {
    const wheelData = getCurrentWheelData()
    if (!wheelData || !wheelData.selectedResult) return

    // Record spin for game session with delay to ensure data is updated
    if (currentSession && currentSession.isActive) {
      const pokemonName = wheelData.selectedResult.pokemon.name
      const currentTime = Date.now()
      
      // Prevent duplicate spin recordings with more robust checking
      if (lastGameSpinRecorded.current !== pokemonName) {
        console.log('🎮 Recording spin for game session:', pokemonName)
        lastGameSpinRecorded.current = pokemonName
        
        setTimeout(() => {
          recordSpin(pokemonName)
        }, 100)
      } else {
        console.log('🎮 Game spin already recorded for this Pokemon, skipping duplicate:', pokemonName)
      }
    }

    // Achievement and Theme unlocking logic (like Fortnite wheel)
    setTimeout(() => {
      const currentWheel = getCurrentWheel()
      if (!currentWheel) return

      const wheelData = currentWheel.data as any
      const totalSpinsFromWheel = wheelData.totalSpins || 0
      const recentResults = wheelData.recentResults || []
      
      // Calculate stats for achievement checking
      const stats = {
        totalSpins: totalSpinsFromWheel,
        uniqueResults: new Set(recentResults.map((r: any) => r.pokemon.name)).size,
        totalOptions: getFilteredPokemon().length,
        aiGeneratedOptions: 0,
        mysterySpins: 0
      }

      // Check for achievement unlocks
      const updatedAchievements = checkAchievementUnlocks(achievements, stats)
      const newlyCompleted = updatedAchievements.filter(a => 
        a.completed && !achievements.find(oa => oa.id === a.id)?.completed
      )

      // Always check for theme unlocks on every spin
      const updatedThemes = checkThemeUnlocks(themes, {
        totalSpins: totalSpinsFromWheel,
        totalPoints: totalPoints
      })
      const newlyUnlockedThemes = updatedThemes.filter(t => 
        t.unlocked && !themes.find(ot => ot.id === t.id)?.unlocked
      )
      
      if (newlyUnlockedThemes.length > 0) {
        setThemes(updatedThemes)
        console.log('🎨 New themes unlocked:', newlyUnlockedThemes.map(t => t.name))
      }

      if (newlyCompleted.length > 0) {
        setAchievements(updatedAchievements)
        const newPoints = newlyCompleted.reduce((sum, a) => sum + a.points, 0)
        setTotalPoints(prev => prev + newPoints)

        // Save achievements, themes to wheel data
        const { updateWheelData } = useWheelManagerStore.getState()
        updateWheelData("pokemon-wheel", currentWheel.id, {
          ...currentWheel.data,
          achievements: updatedAchievements,
          themes: updatedThemes
        })
      } else if (newlyUnlockedThemes.length > 0) {
        // Save themes even if no achievements were unlocked
        const { updateWheelData } = useWheelManagerStore.getState()
        updateWheelData("pokemon-wheel", currentWheel.id, {
          ...currentWheel.data,
          themes: updatedThemes
        })
      }
    }, 500) // Delay to ensure spin data is fully updated
  }

  const handleAddManualPokemon = () => {
    if (!manualPokemonName.trim()) {
      console.log('Manual Pokemon name is empty')
      return
    }

    // Check if Pokemon with this name already exists
    const allPokemon = getAllPokemon()
    const pokemonExists = allPokemon.some(pokemon => pokemon.name.toLowerCase() === manualPokemonName.trim().toLowerCase())
    if (pokemonExists) {
      console.log('Pokemon with this name already exists:', manualPokemonName)
      return
    }

    console.log('Adding manual Pokemon:', manualPokemonName)
    
    // Create a custom Pokemon object
    const customPokemon: Pokemon = {
      id: `manual-${Date.now()}`,
      name: manualPokemonName.trim(),
      emoji: "🎮", // Default emoji for custom Pokemon
      type: ["Custom"],
      generation: "gen1",
      region: "Custom",
      isLegendary: false,
      isStarter: false,
      popularity: "medium",
      preview: "/placeholder.svg?height=100&width=100&text=Custom"
    }

    // Add to selected Pokemon (local state)
    const newSelected = [...selectedPokemon, customPokemon.id]
    setSelectedPokemon(newSelected)
    
    // Force re-render to update UI
    setForceUpdate(prev => prev + 1)
    
    // Update wheel data
    const wheelData = getCurrentWheelData()
    if (wheelData) {
      const currentCustomPokemon = wheelData.customPokemon || []
      const customPokemonExists = currentCustomPokemon.some((pokemon: Pokemon) => pokemon.id === customPokemon.id)
      
      updateCurrentWheelData({
        selectedPokemon: newSelected,
        customPokemon: customPokemonExists ? currentCustomPokemon : [...currentCustomPokemon, customPokemon]
      })
    }
    
    console.log('Custom Pokemon added successfully:', customPokemon.name)

    // Reset input
    setManualPokemonName("")
  }

  const handleDeleteCustomPokemon = (pokemonId: string) => {
    console.log('Deleting custom Pokemon:', pokemonId)
    
    // Remove from selected Pokemon (local state)
    const newSelected = selectedPokemon.filter(id => id !== pokemonId)
    setSelectedPokemon(newSelected)
    
    // Update wheel data
    const wheelData = getCurrentWheelData()
    if (wheelData) {
      const currentCustomPokemon = wheelData.customPokemon || []
      const updatedCustomPokemon = currentCustomPokemon.filter((pokemon: Pokemon) => pokemon.id !== pokemonId)
      
      updateCurrentWheelData({
        selectedPokemon: newSelected,
        customPokemon: updatedCustomPokemon
      })
    }
    
    // Force re-render
    setForceUpdate(prev => prev + 1)
    
    console.log('Custom Pokemon deleted successfully:', pokemonId)
  }

  // Show confetti when spin completes
  useEffect(() => {
    if (spinResult && !isSpinning) {
      setShowConfetti(true)
    }
  }, [spinResult, isSpinning])

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
            currentPokemon: getFilteredPokemon(),
            userPreferences,
            chatHistory: aiChatHistory.slice(-5), // Last 5 messages for context
            mode: aiMode
          }
        })
      })

      const result = await response.json()

      if (result.success && result.data) {
        const aiResponse = result.data.message
        const recommendedPokemon = result.data.recommendedSkins || []

        console.log('AI Response received:', aiResponse)
        console.log('Recommended Pokemon from AI:', recommendedPokemon)

        // Add AI response to chat history
        const aiChatEntry = {
          role: "ai" as const,
          message: aiResponse,
          timestamp: new Date(),
        }
        setAiChatHistory((prev) => [...prev, aiChatEntry])
        setAiResponse(aiResponse)

        // Set recommended Pokemon for display in the list
        if (recommendedPokemon.length > 0) {
          console.log('AI recommended Pokemon:', recommendedPokemon)
          setAiRecommendedPokemon(recommendedPokemon)
        } else {
          setAiRecommendedPokemon([])
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
        setAiRecommendedPokemon([]) // Clear recommendations on fallback
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
      setAiRecommendedPokemon([]) // Clear recommendations on error
    }

    setAiLoading(false)
    setAiQuery("")
  }

  // Function to handle adding custom Pokemon from AI recommendations
  const handleAddCustomPokemon = (customPokemon: {
    id: string
    name: string
    type: string[]
    generation: string
    emoji: string
    isCustom: true
  }) => {
    console.log('Adding custom Pokemon:', customPokemon)
    
    // Convert to Pokemon type with preview
    const pokemonWithPreview: Pokemon = {
      id: customPokemon.id,
      name: customPokemon.name,
      type: customPokemon.type,
      generation: customPokemon.generation,
      emoji: customPokemon.emoji,
      region: "Custom",
      isLegendary: false,
      isStarter: false,
      popularity: "medium",
      preview: `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(customPokemon.name)}`
    }
    
    // Add to custom Pokemon
    setCustomPokemon(prev => {
      const exists = prev.some(pokemon => pokemon.id === customPokemon.id)
      if (exists) return prev
      console.log('Adding to customPokemon:', pokemonWithPreview)
      return [...prev, pokemonWithPreview]
    })

    // Add to selected Pokemon so it appears on the wheel
    setSelectedPokemon(prev => {
      if (prev.includes(customPokemon.id)) return prev
      console.log('Adding to selectedPokemon:', customPokemon.id)
      return [...prev, customPokemon.id]
    })

    // Update wheel data
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      const currentCustomPokemon = (currentWheel.data as any).customPokemon || []
      const customPokemonExists = currentCustomPokemon.some((pokemon: Pokemon) => pokemon.id === customPokemon.id)
      
      const updatedCustomPokemon = customPokemonExists ? currentCustomPokemon : [...currentCustomPokemon, pokemonWithPreview]
      
      updateWheelData("pokemon-wheel", currentWheel.id, {
        ...currentWheel.data,
        customPokemon: updatedCustomPokemon,
        selectedPokemon: [...(currentWheel.data.selectedPokemon || []), customPokemon.id]
      })
    }

    // Force wheel update
    setForceUpdate(prev => prev + 1)
    
    console.log('Custom Pokemon added, forceUpdate:', forceUpdate + 1)
  }

  // Fallback response function
  const getFallbackResponse = (userMessage: string): string => {
    const query = userMessage.toLowerCase()
    
    if (query.includes("legendary") || query.includes("legendaries")) {
      return "🌟 Here are some legendary Pokemon I recommend: Mewtwo, Rayquaza, Arceus, Dialga, Palkia, Giratina, Kyogre, Groudon, and Lugia! These are some of the most powerful and rare Pokemon in the franchise."
    }
    
    if (query.includes("starter") || query.includes("starters")) {
      return "🔥 Great starter Pokemon choices: Charizard, Blastoise, Venusaur, Typhlosion, Feraligatr, Meganium, Blaziken, Swampert, Sceptile, and many more! Each generation has amazing starter Pokemon."
    }
    
    if (query.includes("rare") || query.includes("rarest")) {
      return "💎 The rarest Pokemon include: Mew, Celebi, Jirachi, Deoxys, Shaymin, Arceus, Victini, Keldeo, Meloetta, and Genesect! These mythical Pokemon are extremely rare and powerful."
    }
    
    if (query.includes("fire") || query.includes("fire type")) {
      return "🔥 Excellent Fire type Pokemon: Charizard, Arcanine, Typhlosion, Blaziken, Infernape, Emboar, Delphox, Incineroar, and Cinderace! Fire types are known for their high attack power."
    }
    
    if (query.includes("water") || query.includes("water type")) {
      return "💧 Great Water type Pokemon: Blastoise, Gyarados, Vaporeon, Feraligatr, Swampert, Empoleon, Samurott, Greninja, and Inteleon! Water types are versatile and strong."
    }
    
    if (query.includes("grass") || query.includes("grass type")) {
      return "🌱 Fantastic Grass type Pokemon: Venusaur, Exeggutor, Meganium, Sceptile, Torterra, Serperior, Chesnaught, Decidueye, and Rillaboom! Grass types are great for status effects."
    }
    
    return `🤖 I understand you're asking about "${userMessage}". I can help with Pokemon recommendations, type analysis, collection tips, and wheel strategies. Try asking "what are the rarest Pokemon?" or "tell me about legendary Pokemon"!`
  }

  const extractPokemonNames = (text: string): string[] => {
    const allPokemon = getAllPokemon()
    const pokemonNames: string[] = []
    
    // Extract names from various formats
    const patterns = [
      /\*\*([^*]+)\*\*/g,  // **Name**
      /\*([^*]+)\*/g,      // *Name*
      /`([^`]+)`/g,        // `Name`
      /"([^"]+)"/g,        // "Name"
      /'([^']+)'/g,        // 'Name'
      /^[-•*]\s*([^\n]+)/gm, // List items
      /^\d+\.\s*([^\n]+)/gm, // Numbered lists
    ]
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const name = match.replace(/[*-`"'•]/g, '').trim()
          if (name && allPokemon.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            pokemonNames.push(name)
          }
        })
      }
    })
    
    // Also check for capitalized names that might be Pokemon
    const words = text.split(/\s+/)
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '')
      if (cleanWord && /^[A-Z]/.test(cleanWord) && allPokemon.some(p => p.name.toLowerCase() === cleanWord.toLowerCase())) {
        pokemonNames.push(cleanWord)
      }
    })
    
    return [...new Set(pokemonNames)]
  }

  const handleAddRecommendedPokemon = (pokemonName: string) => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    const pokemon = getAllPokemon().find(p => p.name.toLowerCase() === pokemonName.toLowerCase())
    if (pokemon && !wheelData.selectedPokemon.includes(pokemon.id)) {
      const newSelected = [...wheelData.selectedPokemon, pokemon.id]
      updateCurrentWheelData({ selectedPokemon: newSelected })
    }
  }

  const handleAddAllRecommended = () => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    const newSelected = [...wheelData.selectedPokemon]
    aiRecommendedPokemon.forEach(name => {
      const pokemon = getAllPokemon().find(p => p.name.toLowerCase() === name.toLowerCase())
      if (pokemon && !newSelected.includes(pokemon.id)) {
        newSelected.push(pokemon.id)
      }
    })
    updateCurrentWheelData({ selectedPokemon: newSelected })
  }

  // New functionality handlers (like Fortnite wheel)
  const handleShufflePokemon = () => {
    console.log('Shuffle Pokemon button clicked')
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    // Shuffle the selected Pokemon by updating the order
    const pokemonArray = Array.from(wheelData.selectedPokemon || [])
    console.log('Shuffling Pokemon:', pokemonArray.length, 'Pokemon')
    const shuffled = pokemonArray.sort(() => Math.random() - 0.5)
    
    // Update wheel data with shuffled order
    updateCurrentWheelData({ selectedPokemon: shuffled })
    
    // Force re-render to update UI
    setForceUpdate(prev => prev + 1)
    
    console.log('Pokemon shuffled successfully')
    console.log('New selectedPokemon order:', shuffled)
  }

  const handleSortPokemonAZ = () => {
    console.log('Sort A-Z button clicked')
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    // Sort Pokemon alphabetically by name
    const pokemonArray = Array.from(wheelData.selectedPokemon || [])
    console.log('Sorting Pokemon A-Z:', pokemonArray.length, 'Pokemon')
    
    // Get all Pokemon including custom Pokemon
    const allPokemon = getAllPokemon()
    const allPokemonWithCustom = [...allPokemon, ...(wheelData.customPokemon || [])]
    
    const sortedPokemon = pokemonArray.sort((a, b) => {
      const pokemonA = allPokemonWithCustom.find(pokemon => pokemon.id === a)
      const pokemonB = allPokemonWithCustom.find(pokemon => pokemon.id === b)
      return (pokemonA?.name || '').localeCompare(pokemonB?.name || '')
    })
    
    // Update wheel data with sorted order
    updateCurrentWheelData({ selectedPokemon: sortedPokemon })
    
    // Force re-render to update UI
    setForceUpdate(prev => prev + 1)
    
    console.log('Pokemon sorted A-Z successfully')
    console.log('New selectedPokemon order:', sortedPokemon)
  }

  const handleAddRandomPokemon = () => {
    console.log('Add random Pokemon button clicked')
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    // Add 5 random Pokemon from all available Pokemon (including custom Pokemon)
    const allPokemon = getAllPokemon()
    const allPokemonWithCustom = [...allPokemon, ...(wheelData.customPokemon || [])]
    const currentSelected = Array.from(wheelData.selectedPokemon || [])
    const availablePokemon = allPokemonWithCustom.filter(pokemon => !currentSelected.includes(pokemon.id))
    
    console.log('Adding random Pokemon. Available:', availablePokemon.length, 'Current selected:', currentSelected.length)
    console.log('All Pokemon count:', allPokemonWithCustom.length)
    console.log('Current selected Pokemon IDs:', currentSelected)
    console.log('Available Pokemon IDs:', availablePokemon.map(p => p.id))
    console.log('Available Pokemon names:', availablePokemon.map(p => p.name))
    
    if (availablePokemon.length === 0) {
      console.log('No available Pokemon to add')
      return
    }
    
    const randomPokemon = availablePokemon
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, availablePokemon.length))
      .map(pokemon => pokemon.id)
    
    console.log('Random Pokemon to add:', randomPokemon)
    console.log('New selected Pokemon will be:', [...currentSelected, ...randomPokemon])
    
    const newSelectedPokemon = [...currentSelected, ...randomPokemon]
    updateCurrentWheelData({ selectedPokemon: newSelectedPokemon })
    
    // Update local state to match wheel data
    setSelectedPokemon(newSelectedPokemon)
    
    // Force re-render to update UI
    setForceUpdate(prev => prev + 1)
    
    console.log('Added', randomPokemon.length, 'random Pokemon')
  }

  // Manual select functionality (like Fortnite wheel)
  const handleManualSelect = (pokemonName: string) => {
    if (!pokemonName.trim()) {
      console.log('Manual Pokemon name is empty')
      return
    }

    // Check if Pokemon with this name already exists
    const allPokemon = getAllPokemon()
    const pokemonExists = allPokemon.some(pokemon => pokemon.name.toLowerCase() === pokemonName.trim().toLowerCase())
    if (pokemonExists) {
      console.log('Pokemon with this name already exists:', pokemonName)
      return
    }

    console.log('Adding manual Pokemon:', pokemonName)
    
    // Create a custom Pokemon object
    const customPokemon: Pokemon = {
      id: `manual-${Date.now()}`,
      name: pokemonName.trim(),
      emoji: "🎮", // Default emoji for custom Pokemon
      type: ["Normal"],
      generation: "gen1",
      region: "Custom",
      isLegendary: false,
      isStarter: false,
      popularity: "medium",
      preview: "" // Empty preview for custom Pokemon
    }

    // Add to custom Pokemon state (avoid duplicates)
    setCustomPokemon(prev => {
      const exists = prev.some(pokemon => pokemon.id === customPokemon.id)
      return exists ? prev : [...prev, customPokemon]
    })

    // Add to selected Pokemon
    const newSelected = [...selectedPokemon, customPokemon.id]
    setSelectedPokemon(newSelected)
    
    // Force re-render to update UI
    setForceUpdate(prev => prev + 1)
    
    // Update wheel data
    const { getCurrentWheel, updateWheelData } = useWheelManagerStore.getState()
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      // Get current custom Pokemon from wheel data to avoid duplicates
      const currentCustomPokemon = (currentWheel.data as any).customPokemon || []
      const customPokemonExists = currentCustomPokemon.some((pokemon: Pokemon) => pokemon.id === customPokemon.id)
      
      updateWheelData("pokemon-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedPokemon: newSelected,
        customPokemon: customPokemonExists ? currentCustomPokemon : [...currentCustomPokemon, customPokemon]
      })
    }

    console.log('Custom Pokemon added successfully:', customPokemon.name)
  }

  // Preview all Pokemon functionality (like Fortnite)
  const handlePreviewAllPokemon = () => {
    console.log('Preview all Pokemon button clicked')
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    const currentWheelPokemon = getFilteredPokemon()
    if (currentWheelPokemon.length > 0) {
      // Show multi-Pokemon preview for all wheel Pokemon
      setShowMultiPokemonPreview(true)
      console.log('Preview showing current wheel Pokemon:', currentWheelPokemon.length, 'Pokemon')
    }
  }

  const getGenerationCount = () => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return { selected: 0, available: 0 }

    const filtered = getFilteredPokemon()
    const available = wheelData.selectedGeneration === "all" 
      ? getAllPokemon().length 
      : (pokemonData[wheelData.selectedGeneration] || []).length
    return { selected: wheelData.selectedPokemon?.length || 0, available }
  }

  // Get current wheel data - like Fortnite wheel
  const wheelData = getCurrentWheelData()
  
  // Show loading screen
  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Pokemon wheel...</p>
        </div>
      </div>
    )
  }

  // If no wheel data, show loading
  if (!wheelData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Pokemon wheel...</p>
        </div>
      </div>
    )
  }

  return (
    <ToastProvider>
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

        {/* Audio */}
        <audio ref={audioRef} src="/sound-win.mp3" preload="auto" />

        {/* Header */}
        <Header onOpenSettings={() => setShowSettings(true)} />

        <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <ToolPageTitle title="Pokemon Picker Wheel" toolType="pokemon-wheel" />
            <p className="text-gray-600">Pick a random Pokemon by wheel</p>
          </div>

          {/* Game Status Bar - Moved to top of tool container */}
          {currentSession && (
            <div className="mb-6">
              <PickerWheelGameStatus
                session={currentSession}
                onEndGame={() => {
                  endAdvancedGame()
                  // Add game points to total points (like Fortnite wheel)
                  const gameScore = getGameScore()
                  setTotalPoints(prev => prev + gameScore)
                  
                  // Save game stats
                  const gameStats = getGameStats()
                  if (gameStats) {
                    console.log('Game completed:', gameStats)
                  }
                }}
                onRestartGame={() => {
                  // Add current game points to total points before restarting (like Fortnite wheel)
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
                    updateWheelData("pokemon-wheel", currentWheel.id, {
                      ...currentWheel.data,
                      selectedResult: null,
                      isSpinning: false
                    })
                  }
                  
                  restartAdvancedGame()
                }}
              />
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex flex-col items-center space-y-6">

                  {/* Wheel */}
                  <div className="relative">
                    <WheelComponent
                      key={`wheel-${wheelData.selectedPokemon?.length || 0}-${forceUpdate}`}
                      pokemon={getFilteredPokemon()}
                      rotation={wheelData.rotation || 0}
                      isSpinning={wheelData.isSpinning || false}
                      spinDuration={Math.max(4, settings.spinBehavior.spinningDuration / 5)}
                      wheelRef={wheelRef}
                      displayMode={wheelData.displayMode || "emoji-name"}
                      currentTheme={currentTheme}
                      themes={themes}
                      onSpinCompleted={handleSpinCompleted}
                    />

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

                  {/* Spin Button */}
                  <Button
                    size="lg"
                    onClick={spinWheel}
                    disabled={wheelData.isSpinning || getFilteredPokemon().length === 0}
                    className="px-8 py-3 text-lg bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600"
                  >
                    {wheelData.isSpinning ? "Spinning..." : `⚡ SPIN THE WHEEL (${getFilteredPokemon().length} Pokemon)`}
                  </Button>

                  {/* Quick Input Field for Manual Mode */}
                  {wheelData.actionMode === "manual" && (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={manualPokemonName}
                        onChange={(e) => setManualPokemonName(e.target.value)}
                        placeholder="Type Pokemon name..."
                        className="w-32 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && manualPokemonName.trim()) {
                            handleAddManualPokemon()
                          }
                        }}
                      />
                      <Button
                        onClick={handleAddManualPokemon}
                        disabled={!manualPokemonName.trim()}
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
                    <RadioGroup
                      value={wheelData.actionMode || "normal"}
                      onValueChange={(value) => updateCurrentWheelData({ actionMode: value })}
                      className="flex space-x-4"
                    >
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
                      {wheelData.actionMode === "normal" && "🎯 All Pokemon available for each spin"}
                      {wheelData.actionMode === "elimination" && "❌ Selected Pokemon is removed after each spin"}
                      {wheelData.actionMode === "manual" && "📝 Add custom Pokemon by typing names"}
                    </div>
                  </div>

                  {/* Current Result Display */}
                  {wheelData.selectedResult && (
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 rounded-lg p-4 text-center">
                      <h3 className="text-lg font-bold text-green-800 mb-2">🎉 Current Result:</h3>
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-3xl">{wheelData.selectedResult.pokemon.emoji}</span>
                        <div>
                          <p className="text-xl font-semibold text-gray-800">{wheelData.selectedResult.pokemon.name}</p>
                          <p className="text-sm text-gray-600">{wheelData.selectedResult.pokemon.type.join(" ")}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => setShowAllResults(true)}
                      variant="outline"
                      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Results ({spinHistory.length})
                    </Button>
                    <Button
                      onClick={() => {
                        updateCurrentWheelData({ 
                          recentResults: [],
                          selectedResult: null,
                          totalSpins: 0
                        })
                        setDisplaySpinCount(0)
                      }}
                      variant="outline"
                      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
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

              {/* Inputs Section */}
              {showInputs && (
                <div className="lg:col-span-1">
                  <Tabs defaultValue="pokemon" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                      <TabsTrigger 
                        value="pokemon"
                        className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 transition-all duration-200"
                      >
                        Pokemon
                      </TabsTrigger>
                      <TabsTrigger 
                        value="ai"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 transition-all duration-200"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        AI
                      </TabsTrigger>
                      <TabsTrigger 
                        value="stats"
                        className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 transition-all duration-200"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Stats
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pokemon">
                      <PokemonTab
                        selectedGeneration={wheelData.selectedGeneration || "all"}
                        selectedPokemon={selectedPokemon}
                        displayMode={wheelData.displayMode || "emoji-name"}
                        showTitle={wheelData.showTitle || false}
                        customPokemon={wheelData.customPokemon || []}
                        onGenerationChange={handleGenerationChange}
                        onPokemonToggle={handlePokemonToggle}
                        onClearAll={clearAllPokemon}
                        onDisplayModeChange={(mode) => updateCurrentWheelData({ displayMode: mode })}
                        onShowTitleToggle={() => updateCurrentWheelData({ showTitle: !wheelData.showTitle })}
                        onPreviewPokemon={(pokemon) => {
                          if (pokemon) {
                            // Preview single Pokemon
                            setPreviewPokemon(pokemon)
                          } else {
                            // Preview all Pokemon
                            handlePreviewAllPokemon()
                          }
                        }}
                        onDeleteCustomPokemon={handleDeleteCustomPokemon}
                        getGenerationCount={getGenerationCount}
                        // Favorites and Comparison props
                        onOpenFavorites={() => setShowFavoritesModal(true)}
                        onOpenComparison={() => setShowComparisonModal(true)}
                        addToFavorites={addToFavorites}
                        removeFromFavorites={removeFromFavorites}
                        isFavorite={isFavorite}
                        addToComparison={addToComparison}
                        removeFromComparison={removeFromComparison}
                        isInComparison={isInComparison}
                        favoritePokemon={wheelData.favoritePokemon || []}
                        comparisonPokemon={wheelData.comparisonPokemon || []}
                        // New functionality props (like Fortnite)
                        onShufflePokemon={handleShufflePokemon}
                        onSortPokemonAZ={handleSortPokemonAZ}
                        onAddRandomPokemon={handleAddRandomPokemon}
                        // Action Mode props (like Fortnite)
                        actionMode={actionMode}
                        onActionModeChange={setActionMode}
                        onManualSelect={handleManualSelect}
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
                        selectedPokemon={new Set(selectedPokemon)}
                        onModeChange={setAiMode}
                        onQueryChange={setAiQuery}
                        onQuerySubmit={handleAiQuery}
                        onPreferencesChange={setUserPreferences}
                        onPokemonChange={(pokemon) => setSelectedPokemon(Array.from(pokemon))}
                        onResponseChange={setAiResponse}
                        getAllPokemon={getAllPokemon}
                        getFilteredPokemon={getFilteredPokemon}
                        onGenerationChange={handleGenerationChange}
                        aiRecommendedPokemon={aiRecommendedPokemon}
                        onAddCustomPokemon={handleAddCustomPokemon}
                      />
                    </TabsContent>

                    <TabsContent value="achievements">
                      <PickerWheelAchievementsDisplay
                        achievements={achievements}
                        totalPoints={totalPoints}
                        onAchievementClick={(achievement) => {
                          console.log('Achievement clicked:', achievement)
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="themes">
                      <PickerWheelThemeSelector
                        themes={themes}
                        currentTheme={currentTheme}
                        onThemeSelect={(theme) => {
                          setCurrentTheme(theme)
                          console.log('Theme selected:', theme)
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="analytics">
                      <PickerWheelAnalyticsDisplay
                        spinData={wheelData.spinHistory || []}
                        totalSpins={displaySpinCount}
                        onExportData={() => {
                          console.log('Export analytics data')
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="social">
                      <PickerWheelSocialHub
                        currentUser={currentUser}
                        onProfileUpdate={(profile) => {
                          setCurrentUser(profile)
                          console.log('Profile updated:', profile)
                        }}
                        onShareResult={(result) => {
                          console.log('Share result:', result)
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="games">
                      <PickerWheelGameModes
                        currentSession={currentSession}
                        isGameActive={isAdvancedGameActive}
                        onStartGame={startAdvancedGame}
                        onEndGame={endAdvancedGame}
                        onRestartGame={restartAdvancedGame}
                        gameProgress={getGameProgress()}
                        gameScore={getGameScore()}
                        gameStats={getGameStats()}
                      />
                    </TabsContent>

                    <TabsContent value="stats">
                      <StatsTab
                        pokemonStats={wheelData.pokemonStats || {}}
                        allResults={wheelData.recentResults || []}
                        getAllPokemon={getAllPokemon}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Hide Inputs Button */}
        {!isFullscreen && (
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-4 right-4 bg-transparent"
            onClick={() => setShowInputs(!showInputs)}
          >
            {showInputs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        )}

        {/* Modals */}
        <ResultDialog
          results={wheelData.recentResults || []}
          onClose={() => setShowAllResults(false)}
          open={showAllResults}
          wheelName="Pokemon Wheel"
        />

        <PokemonFavoritesModal
          open={showFavoritesModal}
          onOpenChange={setShowFavoritesModal}
          favoritePokemon={wheelData.favoritePokemon || []}
          onAddFavorite={(pokemon) => {
            const newFavorites = [...(wheelData.favoritePokemon || []), pokemon]
            updateCurrentWheelData({ favoritePokemon: newFavorites })
          }}
          onRemoveFavorite={(pokemonId) => {
            const newFavorites = (wheelData.favoritePokemon || []).filter(p => p.id !== pokemonId)
            updateCurrentWheelData({ favoritePokemon: newFavorites })
          }}
          getAllPokemon={getAllPokemon}
        />

        <PokemonComparisonModal
          isOpen={showComparisonModal}
          onClose={() => setShowComparisonModal(false)}
          comparisonPokemon={wheelData.comparisonPokemon || []}
          onRemoveFromComparison={removeFromComparison}
        />

        <PokemonPreviewModal
          isOpen={!!previewPokemon}
          onClose={() => setPreviewPokemon(null)}
          pokemon={previewPokemon}
          isFavorite={previewPokemon ? isFavorite(previewPokemon.id) : false}
          isInComparison={previewPokemon ? isInComparison(previewPokemon.id) : false}
          onAddToFavorites={addToFavorites}
          onRemoveFromFavorites={removeFromFavorites}
          onAddToComparison={addToComparison}
          onRemoveFromComparison={removeFromComparison}
          comparisonCount={(wheelData.comparisonPokemon || []).length}
        />

        <PokemonMultiPreviewDialog
          pokemon={getFilteredPokemon()}
          isOpen={showMultiPokemonPreview}
          onClose={() => setShowMultiPokemonPreview(false)}
        />

        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        <PickerWheelAchievementsDisplay
          isVisible={showAchievements}
          onClose={() => setShowAchievements(false)}
          achievements={achievements}
          totalPoints={totalPoints}
        />

        <PickerWheelThemeSelector
          isVisible={showThemeSelector}
          onClose={() => setShowThemeSelector(false)}
          themes={themes}
          currentTheme={currentTheme}
          onThemeSelect={setCurrentTheme}
        />

        <PickerWheelAnalyticsDisplay
          isVisible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          analytics={(() => {
            const currentWheel = getCurrentWheel();
            const wheelData = currentWheel?.data as any;
            const totalSpinsFromWheel = wheelData?.totalSpins || 0;
            const recentResults = wheelData?.recentResults || [];
            
            const spinRecords: SpinRecord[] = recentResults.map((result: any, index: number) => ({
              id: `spin-${Date.now()}-${index}`,
              timestamp: new Date(Date.now() - (recentResults.length - index - 1) * 1000),
              result: result.pokemon.name,
              options: wheelData.selectedPokemon?.map((pokemonId: string) => {
                const pokemon = getAllPokemon().find(p => p.id === pokemonId);
                return pokemon?.name || pokemonId;
              }) || [],
              mode: wheelData.actionMode === "normal" ? "manual" : wheelData.actionMode === "elimination" ? "manual" : "manual",
              theme: currentTheme,
              spinDuration: 3,
              userQuestion: undefined
            }));
            
            const analyticsData = analyzeSpinData(spinRecords);
            return {
              ...analyticsData,
              totalSpins: totalSpinsFromWheel,
              uniqueResults: new Set(recentResults.map((r: any) => r.pokemon.name)).size
            };
          })()}
        />

        <PickerWheelSocialHub
          isVisible={showSocialHub}
          onClose={() => setShowSocialHub(false)}
          currentUser={currentUser}
        />

        <PickerWheelGameModes
          isVisible={showGameModes}
          onClose={() => setShowGameModes(false)}
          onStartGame={(gameMode) => {
            console.log('🎮 Starting game mode:', gameMode.name)
            console.log('🎮 Game mode details:', gameMode)
            const session = startAdvancedGame(gameMode)
            console.log('🎮 Game session created:', session)
            console.log('🎮 Current session after start:', currentSession)
            console.log('🎮 Is game active:', isAdvancedGameActive)
            setShowGameModes(false)
          }}
          userPoints={totalPoints}
        />

        <Footer />
      </div>
    </ToastProvider>
  )
}
