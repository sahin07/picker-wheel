"use client"

import { useState, useRef, useEffect, useCallback, type ReactNode, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import type { PokemonWheelDeepLink } from "@/lib/pokemon-wheel-spokes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PanelRightOpen } from "lucide-react"
import Confetti from "react-confetti"
import Header from "@/components/header"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import PokemonWheelSection from "@/components/pokemon-wheel-section"
import PokemonInputPanel from "@/components/pokemon-input-panel"
import { PokemonWheelPopularTemplates } from "@/components/pokemon-wheel/pokemon-wheel-popular-templates"
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
import { SocialProfile } from "@/lib/picker-wheel-social"
import { GameMode } from "@/lib/picker-wheel-game-modes"
import { useGameSession } from "@/hooks/use-game-session"
import PickerResultsModal from "@/components/picker-results-modal"
import PokemonFavoritesModal from "@/components/pokemon/dialogs/pokemon-favorites-modal"
import PokemonComparisonModal from "@/components/pokemon/dialogs/pokemon-comparison-modal"
import PokemonPreviewModal from "@/components/pokemon/dialogs/pokemon-preview-modal"
import { PokemonMultiPreviewDialog } from "@/components/pokemon/dialogs/pokemon-multi-preview-dialog"
import { pokemonData } from "@/data/pokemon-data"
import type { Pokemon, SpinResult, ActionMode, GenerationFilter } from "@/types/pokemon-types"
import { POKEMON_WHEEL_SHORT_TITLE } from "@/lib/pokemon-wheel-seo"
import {
  applyWheelRotation,
  computeSpinEndRotation,
  computeSpinFrame,
  getSpinDurationMs,
  pickSegmentIndex,
} from "@/lib/wheel-spin-animation"
import {
  createSpinAudioController,
  type SpinAudioController,
} from "@/lib/wheel-spin-audio"
import {
  applyPokemonWheelUseCase,
  getPokemonWheelUseCase,
  pokemonWheelUseCaseFromTemplate,
  type PokemonWheelUseCaseId,
} from "@/lib/pokemon-wheel-use-cases"

type PokemonWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: PokemonWheelDeepLink
}

function PokemonWheelAppInner({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: PokemonWheelAppProps) {
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
  const { settings, updateSettings, loadFromDatabase: loadSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore(
    (s) => s.settings.spinBehavior?.removeWinnerAfterSpin,
  )
  const searchParams = useSearchParams()
  const [activeUseCaseId, setActiveUseCaseId] = useState<PokemonWheelUseCaseId | null>(
    deepLink?.useCaseId ?? null,
  )
  const deepLinkAppliedRef = useRef(false)

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
  const [actionMode, setActionMode] = useState<ActionMode>("normal")

  // Refs
  const wheelRef = useRef<HTMLDivElement>(null)
  const spinAnimationRef = useRef<number | null>(null)
  const spinAudioRef = useRef<SpinAudioController | null>(null)
  const rotationRef = useRef(0)
  const mutedRef = useRef(muted)
  mutedRef.current = muted
  const [rotation, setRotation] = useState(0)
  const confettiRef = useRef<number | undefined>(undefined)

  // Keep Action Mode in sync with Manage → Remove winner (and reverse)
  useEffect(() => {
    if (actionMode === "manual") return
    const wantMode: ActionMode = removeWinnerAfterSpin ? "elimination" : "normal"
    if (actionMode !== wantMode) {
      setActionMode(wantMode)
      const wheel = getCurrentWheel()
      if (wheel) {
        updateWheelData("pokemon-wheel", wheel.id, {
          ...wheel.data,
          actionMode: wantMode,
        })
      }
    }
  }, [removeWinnerAfterSpin, actionMode, getCurrentWheel, updateWheelData])

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
          createNewWheel("pokemon-wheel", "Pokémon Wheel", id, now, now)
          
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

          if (typeof wheelData.rotation === "number") {
            setRotation(wheelData.rotation)
            rotationRef.current = wheelData.rotation
            applyWheelRotation(wheelRef.current, wheelData.rotation)
          }

          if (wheelData.actionMode) {
            setActionMode(wheelData.actionMode)
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

      if (wheelData.actionMode) {
        setActionMode(wheelData.actionMode)
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

  const syncActionMode = useCallback(
    (mode: ActionMode) => {
      setActionMode(mode)
      const wheel = getCurrentWheel()
      if (wheel) {
        updateWheelData("pokemon-wheel", wheel.id, {
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

  const applyUseCasePreset = useCallback((id: PokemonWheelUseCaseId) => {
    const useCase = getPokemonWheelUseCase(id)
    if (!useCase || !applyPokemonWheelUseCase(id)) return
    setActiveUseCaseId(id)
    const ids = useCase.config.pokemon.map((p) => p.id)
    setSelectedPokemon(ids)
    setForceUpdate((p) => p + 1)
  }, [])

  // Spoke deepLink + pillar ?template= / ?generation=
  useEffect(() => {
    if (deepLinkAppliedRef.current) return
    const timer = window.setTimeout(() => {
      if (deepLinkAppliedRef.current) return
      const applyId = (id: PokemonWheelUseCaseId) => {
        applyUseCasePreset(id)
        deepLinkAppliedRef.current = true
      }
      if (deepLink) {
        applyId(deepLink.useCaseId)
        return
      }
      const id = pokemonWheelUseCaseFromTemplate(
        searchParams.get("template"),
        searchParams.get("generation"),
      )
      if (id) applyId(id)
    }, 150)
    return () => window.clearTimeout(timer)
  }, [deepLink, searchParams, applyUseCasePreset])

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
    setSelectedPokemon([])
    updateCurrentWheelData({ selectedPokemon: [] })
    setForceUpdate((prev) => prev + 1)
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

  const openPokemonResults = useCallback(() => {
    setShowAllResults(true)
  }, [])

  const completeSpinAtRotation = (finalRotation: number, spinDurationMs: number) => {
    spinAudioRef.current?.stop()

    const availablePokemon = getFilteredPokemon()
    if (availablePokemon.length === 0) {
      setIsSpinning(false)
      updateCurrentWheelData({ isSpinning: false })
      return
    }

    const soundVolume = settings.confettiSound?.soundVolume || 0.5
    const soundOn =
      settings.confettiSound?.enableSound !== false && !mutedRef.current

    const selectedIndex = pickSegmentIndex(finalRotation, availablePokemon.length)
    const selectedPokemonResult = availablePokemon[selectedIndex]
    if (!selectedPokemonResult) {
      setIsSpinning(false)
      updateCurrentWheelData({ isSpinning: false })
      return
    }

    if (actionMode === "elimination") {
      const newSelected = selectedPokemon.filter((id) => id !== selectedPokemonResult.id)
      setSelectedPokemon(newSelected)
      setForceUpdate((prev) => prev + 1)
      updateCurrentWheelData({ selectedPokemon: newSelected })
    }

    const result: SpinResult = {
      pokemon: selectedPokemonResult,
      timestamp: new Date(),
    }

    setSpinResult(result)
    setRotation(finalRotation)
    rotationRef.current = finalRotation
    applyWheelRotation(wheelRef.current, finalRotation)

    const currentWheel = getCurrentWheel()
    const newTotalSpins = displaySpinCount + 1
    const spinRecord = {
      id: `spin-${Date.now()}`,
      timestamp: new Date(),
      result: selectedPokemonResult.name,
      options: availablePokemon.map((p) => p.name),
      mode: actionMode,
      theme: currentTheme,
      spinDuration: spinDurationMs / 1000,
      wheelName: currentWheel?.name || "Pokémon Wheel",
    }
    const newSpinHistory = [...spinHistory, spinRecord]

    updateCurrentWheelData({
      isSpinning: false,
      rotation: finalRotation,
      selectedResult: result,
      totalSpins: newTotalSpins,
      spinHistory: newSpinHistory,
      recentResults: [
        result,
        ...((currentWheel?.data as any)?.recentResults || []),
      ].slice(0, 50),
    })

    setSpinHistory(newSpinHistory)
    setDisplaySpinCount(newTotalSpins)
    setIsSpinning(false)

    if (settings.confettiSound?.enableConfetti !== false) {
      setShowConfetti(true)
      window.setTimeout(() => setShowConfetti(false), 5000)
    }

    if (soundOn) {
      try {
        const audio = new Audio("/sound-win.mp3")
        audio.volume = soundVolume
        void audio.play()
      } catch {
        // ignore
      }
    }

    openPokemonResults()
  }

  const spinWheel = () => {
    const availablePokemon = getFilteredPokemon()
    if (availablePokemon.length === 0 || isSpinning) return

    if (spinAnimationRef.current) {
      cancelAnimationFrame(spinAnimationRef.current)
      spinAnimationRef.current = null
    }
    spinAudioRef.current?.stop()

    const duration = getSpinDurationMs(settings.spinBehavior?.spinningDuration)
    const speedLevel = settings.spinBehavior?.spinningSpeedLevel
    const startRotation = rotationRef.current || rotation || 0
    const endRotation = computeSpinEndRotation(startRotation, {
      randomInitialAngle: settings.display?.randomInitialAngle,
    })
    const startTime = Date.now()
    const soundVolume = settings.confettiSound?.soundVolume || 0.5
    const soundOn =
      settings.confettiSound?.enableSound !== false && !mutedRef.current

    setIsSpinning(true)
    setShowConfetti(false)
    updateCurrentWheelData({ isSpinning: true })
    applyWheelRotation(wheelRef.current, startRotation)

    if (soundOn) {
      try {
        if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
        spinAudioRef.current.startWhoosh("/wheel-sound.mp3", soundVolume)
      } catch {
        // ignore
      }
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const { rotation: newRotation, done } = computeSpinFrame(
        startRotation,
        endRotation,
        elapsed,
        duration,
        speedLevel,
      )

      rotationRef.current = newRotation
      applyWheelRotation(wheelRef.current, newRotation)

      if (soundOn && availablePokemon.length > 0) {
        try {
          if (!spinAudioRef.current) {
            spinAudioRef.current = createSpinAudioController()
          }
          spinAudioRef.current.syncFrame(
            newRotation,
            availablePokemon.length,
            soundVolume,
            null,
          )
        } catch {
          // ignore
        }
      }

      if (!done) {
        spinAnimationRef.current = requestAnimationFrame(animate)
      } else {
        spinAnimationRef.current = null
        completeSpinAtRotation(newRotation, duration)
      }
    }

    spinAnimationRef.current = requestAnimationFrame(animate)
  }

  const handleManualStop = () => {
    if (!isSpinning) return
    if (spinAnimationRef.current) {
      cancelAnimationFrame(spinAnimationRef.current)
      spinAnimationRef.current = null
    }
    completeSpinAtRotation(
      rotationRef.current,
      getSpinDurationMs(settings.spinBehavior?.spinningDuration),
    )
  }

  // Sound and confetti functions (legacy helpers kept for confetti particles)
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

  const handleSpinCompleted = () => {
    const wheelData = getCurrentWheelData()
    if (!wheelData || !wheelData.selectedResult) return

    // Record spin for game session with delay to ensure data is updated
    if (currentSession && currentSession.isActive) {
      const pokemonName =
        wheelData.selectedResult?.pokemon?.name ||
        wheelData.selectedResult?.name
      if (!pokemonName) return
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
        uniqueResults: new Set(
          recentResults.map((r: any) => r?.pokemon?.name || r?.name).filter(Boolean),
        ).size,
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

  const handleSortPokemonZA = () => {
    const wheelData = getCurrentWheelData()
    if (!wheelData) return

    const pokemonArray = Array.from(wheelData.selectedPokemon || [])
    const allPokemon = getAllPokemon()
    const allPokemonWithCustom = [...allPokemon, ...(wheelData.customPokemon || [])]

    const sortedPokemon = pokemonArray.sort((a, b) => {
      const pokemonA = allPokemonWithCustom.find((pokemon) => pokemon.id === a)
      const pokemonB = allPokemonWithCustom.find((pokemon) => pokemon.id === b)
      return (pokemonB?.name || "").localeCompare(pokemonA?.name || "")
    })

    updateCurrentWheelData({ selectedPokemon: sortedPokemon })
    setForceUpdate((prev) => prev + 1)
  }

  const handleImportPokemonText = (text: string) => {
    const names = text
      .split(/\n/)
      .map((n) => n.trim().toLowerCase())
      .filter(Boolean)
    if (names.length === 0) return

    const all = getAllPokemon()
    const matched = all.filter((p) => names.includes(p.name.toLowerCase()))
    if (matched.length === 0) return

    const ids = matched.map((p) => p.id)
    setSelectedPokemon(ids)
    setForceUpdate((p) => p + 1)
    updateCurrentWheelData({ selectedPokemon: ids })
  }

  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId)
    updateCurrentWheelData({ currentTheme: themeId })
  }

  const handleApplyPalette = (colors: readonly string[]) => {
    setThemes((prev) =>
      prev.map((t) =>
        t.id === currentTheme ? { ...t, colors: [...colors] } : t,
      ),
    )
    setForceUpdate((p) => p + 1)
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
  const handleManualSelect = (pokemon: Pokemon) => {
    if (actionMode !== "manual") return

    const result: SpinResult = {
      pokemon,
      timestamp: new Date(),
    }

    setSpinResult(result)
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      const currentData = currentWheel.data as any
      updateWheelData("pokemon-wheel", currentWheel.id, {
        ...currentData,
        selectedResult: result,
        totalSpins: (currentData.totalSpins || 0) + 1,
        recentResults: [...(currentData.recentResults || []), result].slice(-50),
      })
      setDisplaySpinCount((currentData.totalSpins || 0) + 1)
    }

    setShowAllResults(true)
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

  const recentResultsCount =
    (wheelData.recentResults?.length ?? 0) || spinHistory.length

  const modalResults = (wheelData.recentResults || []).slice(0, 20).map(
    (result: any, index: number) => {
      const pokemon = result?.pokemon || result
      return {
        id: pokemon?.id || `result-${index}`,
        name: pokemon?.name || "Unknown",
        emoji: pokemon?.emoji || "🎮",
        type: Array.isArray(pokemon?.type) ? pokemon.type.join(" · ") : pokemon?.type,
        generation: pokemon?.generation,
        region: pokemon?.region,
        wheelName: "Pokémon Wheel",
      }
    },
  )

  return (
    <>
      {showConfetti && typeof window !== "undefined" && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={400}
          recycle={false}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 1000 }}
        />
      )}

      <div
        className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
        style={{
          backgroundColor: settings.appearance.backgroundColor,
          backgroundImage: settings.appearance.backgroundImage
            ? `url(${settings.appearance.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <audio className="hidden" preload="auto" />

        <Header
          onOpenSettings={() => setShowSettings(true)}
          onOpenGames={() => setShowGameModes(true)}
        />

        <main className="w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-4 text-center">
            <ToolPageTitle
              title={shortTitle ?? POKEMON_WHEEL_SHORT_TITLE}
              toolType="pokemon-wheel"
            />
            <p className="text-gray-600">
              {toolSubtitle ?? "Pick a random Pokemon by wheel"}
            </p>
          </div>

          <PokemonWheelPopularTemplates />

          {activeUseCaseId && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge className="bg-slate-800 text-white hover:bg-slate-800">
                Template: {getPokemonWheelUseCase(activeUseCaseId)?.label}
              </Badge>
              <Badge variant="secondary">
                {getPokemonWheelUseCase(activeUseCaseId)?.config.pokemon.length} Pokemon ready
              </Badge>
            </div>
          )}

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
                  updateWheelData("pokemon-wheel", currentWheel.id, {
                    ...currentWheel.data,
                    selectedResult: null,
                    isSpinning: false,
                    recentResults: [],
                    totalSpins: 0,
                    spinHistory: [],
                  })
                }
                setDisplaySpinCount(0)
                restartAdvancedGame()
              }}
            />
          )}

          <div className="mb-6 grid min-w-0 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            <div
              className={`relative min-w-0 overflow-x-hidden bg-white p-3 sm:p-6 ${
                isFullscreen || !showInputs
                  ? "lg:col-span-3"
                  : "rounded-lg border shadow-sm lg:col-span-2"
              }`}
            >
              {/* Results — same placement as Fortnite/NBA (column top-left) */}
              {!isFullscreen && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openPokemonResults}
                  className="absolute left-2 top-2 z-10 border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50 sm:left-4 sm:top-4 sm:px-3"
                >
                  Results
                  {recentResultsCount > 0 && (
                    <span className="ml-2 rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-700">
                      {recentResultsCount}
                    </span>
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
                <PokemonWheelSection
                  pokemon={getFilteredPokemon()}
                  rotation={rotation}
                  isSpinning={isSpinning || !!wheelData.isSpinning}
                  spinDuration={settings.spinBehavior?.spinningDuration ?? 10}
                  wheelRef={wheelRef}
                  displayMode={wheelData.displayMode || "emoji-name"}
                  currentTheme={currentTheme}
                  themes={themes}
                  wheelKey={`wheel-${wheelData.selectedPokemon?.length || 0}-${forceUpdate}-${currentTheme}`}
                  onSpinCompleted={handleSpinCompleted}
                  muted={muted}
                  onToggleMute={() => setMuted((m) => !m)}
                  displaySpinCount={displaySpinCount}
                  onSpin={spinWheel}
                  onManualStop={handleManualStop}
                  actionMode={actionMode}
                  onActionModeChange={syncActionMode}
                  manualPokemonName={manualPokemonName}
                  onManualPokemonNameChange={setManualPokemonName}
                  onAddManualPokemon={handleAddManualPokemon}
                  spinResult={spinResult}
                  selectedResult={wheelData.selectedResult}
                  isGameActive={isAdvancedGameActive}
                  currentGameModeName={currentSession?.gameMode?.name}
                  onOpenAchievements={() => setShowAchievements(true)}
                  onOpenThemeSelector={() => setShowThemeSelector(true)}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  onOpenSocialHub={() => setShowSocialHub(true)}
                  onOpenGameModes={() => setShowGameModes(true)}
                  totalPoints={totalPoints}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen((v) => !v)}
                  soundEnabled={settings.confettiSound?.enableSound !== false}
                />
              </div>
            </div>

            {showInputs && !isFullscreen && (
              <div className="min-w-0 self-start lg:col-span-1">
                <PokemonInputPanel
                  forceUpdate={forceUpdate}
                  selectedGeneration={wheelData.selectedGeneration || "all"}
                  selectedPokemon={selectedPokemon}
                  displayMode={wheelData.displayMode || "emoji-name"}
                  showTitle={wheelData.showTitle ?? true}
                  actionMode={actionMode}
                  onActionModeChange={syncActionMode}
                  customPokemon={wheelData.customPokemon || customPokemon}
                  favoritePokemon={wheelData.favoritePokemon || []}
                  comparisonPokemon={wheelData.comparisonPokemon || []}
                  onGenerationChange={handleGenerationChange}
                  onPokemonToggle={handlePokemonToggle}
                  onClearAll={clearAllPokemon}
                  onDisplayModeChange={(mode) => updateCurrentWheelData({ displayMode: mode })}
                  onShowTitleToggle={() =>
                    updateCurrentWheelData({ showTitle: !(wheelData.showTitle ?? true) })
                  }
                  onPreviewPokemon={(pokemon) => {
                    if (pokemon) {
                      setPreviewPokemon(pokemon)
                    } else {
                      handlePreviewAllPokemon()
                    }
                  }}
                  getGenerationCount={getGenerationCount}
                  onShufflePokemon={handleShufflePokemon}
                  onSortPokemonAZ={handleSortPokemonAZ}
                  onSortPokemonZA={handleSortPokemonZA}
                  onAddRandomPokemon={handleAddRandomPokemon}
                  onOpenFavorites={() => setShowFavoritesModal(true)}
                  onOpenComparison={() => setShowComparisonModal(true)}
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                  isFavorite={isFavorite}
                  addToComparison={addToComparison}
                  removeFromComparison={removeFromComparison}
                  isInComparison={isInComparison}
                  onEnhancedDetails={(pokemon) => setPreviewPokemon(pokemon)}
                  onManualSelect={handleManualSelect}
                  onDeleteCustomPokemon={handleDeleteCustomPokemon}
                  aiMode={aiMode}
                  aiQuery={aiQuery}
                  aiResponse={aiResponse}
                  aiLoading={aiLoading}
                  aiChatHistory={aiChatHistory}
                  aiRecommendations={aiRecommendations}
                  userPreferences={userPreferences}
                  aiRecommendedPokemon={aiRecommendedPokemon}
                  onAiModeChange={setAiMode}
                  onAiQueryChange={setAiQuery}
                  onAiQuerySubmit={handleAiQuery}
                  onUserPreferencesChange={setUserPreferences}
                  onPokemonChange={(pokemon) => {
                    const ids = Array.from(pokemon)
                    setSelectedPokemon(ids)
                    updateCurrentWheelData({ selectedPokemon: ids })
                  }}
                  onAiResponseChange={setAiResponse}
                  getAllPokemon={getAllPokemon}
                  getFilteredPokemon={getFilteredPokemon}
                  onAddCustomPokemon={handleAddCustomPokemon}
                  pokemonStats={wheelData.pokemonStats || pokemonStats}
                  allResults={wheelData.recentResults || []}
                  resultsCount={recentResultsCount}
                  themes={themes}
                  currentTheme={currentTheme}
                  onThemeChange={handleThemeSelect}
                  onApplyPalette={handleApplyPalette}
                  onHideInputs={() => setShowInputs(false)}
                  onViewHistory={openPokemonResults}
                  onOpenAchievements={() => setShowAchievements(true)}
                  onOpenSettings={() => setShowSettings(true)}
                  onToggleFullscreen={() => setIsFullscreen((v) => !v)}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  onImportPokemonText={handleImportPokemonText}
                />
              </div>
            )}
          </div>

          {seoIntro}
          {seoSections}
        </main>

        <Footer />

        <PickerResultsModal
          isOpen={showAllResults}
          onClose={() => setShowAllResults(false)}
          results={modalResults}
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
            const newFavorites = (wheelData.favoritePokemon || []).filter(
              (p: Pokemon) => p.id !== pokemonId,
            )
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

        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

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
          onThemeSelect={handleThemeSelect}
        />

        <PickerWheelAnalyticsDisplay
          isVisible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          analytics={(() => {
            const currentWheel = getCurrentWheel()
            const data = currentWheel?.data as any
            const totalSpinsFromWheel = data?.totalSpins || 0
            const recentResults = data?.recentResults || []

            const spinRecords: SpinRecord[] = recentResults.map((result: any, index: number) => ({
              id: `spin-${Date.now()}-${index}`,
              timestamp: new Date(Date.now() - (recentResults.length - index - 1) * 1000),
              result: result.pokemon?.name || result.name,
              options:
                data.selectedPokemon?.map((pokemonId: string) => {
                  const pokemon = getAllPokemon().find((p) => p.id === pokemonId)
                  return pokemon?.name || pokemonId
                }) || [],
              mode: "manual",
              theme: currentTheme,
              spinDuration: settings.spinBehavior?.spinningDuration ?? 10,
              userQuestion: undefined,
            }))

            const analyticsData = analyzeSpinData(spinRecords)
            return {
              ...analyticsData,
              totalSpins: totalSpinsFromWheel,
              uniqueResults: new Set(
                recentResults.map((r: any) => r.pokemon?.name || r.name),
              ).size,
            }
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
          onStartGame={(gameMode: GameMode) => {
            const currentWheel = getCurrentWheel()
            if (currentWheel) {
              const { updateWheelData } = useWheelManagerStore.getState()
              updateWheelData("pokemon-wheel", currentWheel.id, {
                ...currentWheel.data,
                totalSpins: 0,
                spinHistory: [],
                recentResults: [],
                selectedResult: null,
              })
            }
            setDisplaySpinCount(0)
            startAdvancedGame(gameMode)
            setShowGameModes(false)
          }}
          userPoints={totalPoints}
        />
      </div>
    </>
  )
}

export default function PokemonWheelApp(props: PokemonWheelAppProps) {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-50" />}>
        <PokemonWheelAppInner {...props} />
      </Suspense>
    </ToastProvider>
  )
}
