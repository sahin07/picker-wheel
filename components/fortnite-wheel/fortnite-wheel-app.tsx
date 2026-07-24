"use client"

import { useState, useRef, useEffect, useCallback, Suspense, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { PanelRightOpen } from "lucide-react"
import Confetti from "react-confetti"
import Header from "@/components/header"
import ToolBreadcrumbs from "@/components/tool-breadcrumbs"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import { useWheelManagerStore, type FortniteWheelData } from "@/stores/wheel-manager-store"
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
import {
  createSpinAudioController,
  type SpinAudioController,
} from "@/lib/wheel-spin-audio"
import {
  applyWheelRotation,
  computeSpinEndRotation,
  computeSpinFrame,
  getSpinDurationMs,
  pickSegmentIndex,
} from "@/lib/wheel-spin-animation"

// Import components
import FortniteWheelSection from "@/components/fortnite-wheel-section"
import FortniteInputPanel from "@/components/fortnite-input-panel"
import { SkinPreviewDialog } from "@/components/fortnite/dialogs/skin-preview-dialog"
import { MultiSkinPreviewDialog } from "@/components/fortnite/dialogs/multi-skin-preview-dialog"
import FortniteFavoritesModal from "@/components/fortnite/dialogs/fortnite-favorites-modal"
import FortniteComparisonModal from "@/components/fortnite/dialogs/fortnite-comparison-modal"
import EnhancedSkinDetailsModal from "@/components/fortnite/dialogs/enhanced-skin-details-modal"
import { FortniteWheelPopularTemplates } from "@/components/fortnite-wheel/fortnite-wheel-popular-templates"
import { FORTNITE_WHEEL_SHORT_TITLE } from "@/lib/fortnite-wheel-seo"
import type { FortniteWheelDeepLink } from "@/lib/fortnite-wheel-spokes"
import {
  applyFortniteWheelUseCase,
  getFortniteWheelUseCase,
  fortniteWheelUseCaseFromTemplate,
  type FortniteWheelUseCaseId,
} from "@/lib/fortnite-wheel-use-cases"

// Import types and data
import { fortniteSkins } from "@/data/fortnite-skins"
import type { Skin, SpinResult, DisplayMode, ActionMode, RarityFilter } from "@/types/fortnite-types"

type FortniteWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: FortniteWheelDeepLink
}

function FortniteWheelAppInner({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: FortniteWheelAppProps) {
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
      return []
    }

    const selectedSkinsIds = selectedSkins
    
    
    // Get selected predefined skins that match the current rarity filter (case-insensitive)
    const selectedPredefinedSkins = allPredefinedSkins.filter((skin) => 
      selectedSkinsIds.includes(skin.id) && 
      (selectedRarity === "all" || skin.rarity.toLowerCase() === selectedRarity.toLowerCase())
    )
    
    // Get selected custom skins
    const selectedCustomSkins = customSkins.filter((skin) => selectedSkinsIds.includes(skin.id))
    
    
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
  const [allResults, setAllResults] = useState<SpinResult[]>([])
  const [showInputs, setShowInputs] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTitle, setShowTitle] = useState(true)
  const [title, setTitle] = useState("Fortnite Skins Picker Wheel")
  const [description, setDescription] = useState("Pick a random Fortnite skin by wheel")
  const [previewSkin, setPreviewSkin] = useState<Skin | null>(null)
  const [showMultiSkinPreview, setShowMultiSkinPreview] = useState(false)
  const [showFavoritesModal, setShowFavoritesModal] = useState(false)
  const [showComparisonModal, setShowComparisonModal] = useState(false)

  const [showPreview, setShowPreview] = useState(false)
  const [showEnhancedDetails, setShowEnhancedDetails] = useState(false)
  const [enhancedDetailsSkin, setEnhancedDetailsSkin] = useState<Skin | null>(null)
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

  const [activeUseCaseId, setActiveUseCaseId] = useState<FortniteWheelUseCaseId | null>(
    deepLink?.useCaseId ?? null,
  )
  const deepLinkAppliedRef = useRef(false)
  const searchParams = useSearchParams()

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
  const { settings, loadFromDatabase: loadSettings, updateSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore(
    (s) => s.settings.spinBehavior?.removeWinnerAfterSpin,
  )
  const { setCurrentTool, createNewWheel, getCurrentWheel, updateWheelData, currentWheelId } = useWheelManagerStore()

  const wheel = useWheelManagerStore(
    useCallback((state) => {
      const wheels = state.wheelsByTool[state.currentTool] || []
      return wheels.find((w) => w.id === state.currentWheelId) || null
    }, []),
  )
  const recentResultsCount =
    ((wheel?.data as FortniteWheelData | undefined)?.recentResults?.length ?? 0)
  const favoriteSkins = ((wheel?.data as FortniteWheelData | undefined)?.favoriteSkins ??
    []) as Skin[]
  const comparisonSkins = ((wheel?.data as FortniteWheelData | undefined)?.comparisonSkins ??
    []) as Skin[]

  const activeUseCase = activeUseCaseId ? getFortniteWheelUseCase(activeUseCaseId) : null
  const customOnlyMode = Boolean(activeUseCase?.config.customOnly)

  const openFortniteResults = () => {
    window.dispatchEvent(new Event("open-fortnite-results"))
  }

  // Keep Game Mode in sync with Manage → Remove winner (and reverse), like NBA/MLB
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

  const applyUseCasePreset = useCallback((id: FortniteWheelUseCaseId) => {
    const useCase = getFortniteWheelUseCase(id)
    if (!useCase || !applyFortniteWheelUseCase(id)) return
    setActiveUseCaseId(id)
    setSelectedRarity(useCase.config.selectedRarity)
    const skinIds = useCase.config.skins.map((s) => s.id)
    setSelectedSkins(skinIds)
    setSkinOrder(skinIds)
    setDisplayMode(useCase.config.displayMode)
    if (useCase.config.customOnly) {
      setCustomSkins(useCase.config.skins)
    }
    setForceUpdate((p) => p + 1)
  }, [])

  // Spoke deepLink + pillar ?template= / ?rarity=
  useEffect(() => {
    if (deepLinkAppliedRef.current) return
    const timer = window.setTimeout(() => {
      if (deepLinkAppliedRef.current) return
      const applyId = (id: FortniteWheelUseCaseId) => {
        applyUseCasePreset(id)
        deepLinkAppliedRef.current = true
      }
      if (deepLink) {
        applyId(deepLink.useCaseId)
        return
      }
      const id = fortniteWheelUseCaseFromTemplate(
        searchParams.get("template"),
        searchParams.get("rarity"),
      )
      if (id) applyId(id)
    }, 150)
    return () => window.clearTimeout(timer)
  }, [deepLink, searchParams, applyUseCasePreset])

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
  
  // Client-side spin count display to avoid hydration issues
  const [displaySpinCount, setDisplaySpinCount] = useState(totalSpins)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const wheelRef = useRef<HTMLDivElement>(null)
  const spinAnimationRef = useRef<number | null>(null)
  const spinAudioRef = useRef<SpinAudioController | null>(null)
  const mutedRef = useRef(muted)

  useEffect(() => {
    mutedRef.current = muted
  }, [muted])

  useEffect(() => {
    return () => {
      if (spinAnimationRef.current) cancelAnimationFrame(spinAnimationRef.current)
      spinAudioRef.current?.stop()
    }
  }, [])

  const [rotation, setRotation] = useState(0)
  const rotationRef = useRef(0)

  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

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
    
    const currentWheel = getCurrentWheel()
    
    if (currentWheel?.data && isInitialized) {
      const wheelData = currentWheel.data as any
      
      
      // Update local state to match current wheel data
      if (wheelData.selectedSkins) {
        setSelectedSkins(wheelData.selectedSkins)
        setSkinOrder(wheelData.selectedSkins)
      } else {
        setSelectedSkins([])
        setSkinOrder([])
      }
      if (wheelData.totalSpins !== undefined) {
        setTotalSpins(wheelData.totalSpins)
      }
      if (wheelData.spinHistory) {
        setSpinHistory(wheelData.spinHistory)
      }
      if (wheelData.customSkins) {
        setCustomSkins(wheelData.customSkins)
      } else {
        setCustomSkins([])
      }
      if (wheelData.selectedRarity) {
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
        // Force a re-render when wheel ID changes
        setForceUpdate(prev => prev + 1)
      }
    )
    
    return unsubscribe
  }, [])

  // Confetti is triggered from handleSpin on live completion only
  // (avoid firing on page reload with a persisted spinResult)

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
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as FortniteWheelData

          if (wheelData.isSpinning) {
            updateWheelData("fortnite-wheel", currentWheel.id, {
              ...wheelData,
              isSpinning: false,
            })
          }
          setIsSpinning(false)

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
          
          if (wheelData.showTitle !== undefined) {
            setShowTitle(wheelData.showTitle)
          }

          if (wheelData.customSkins) {
            setCustomSkins(wheelData.customSkins)
          }

          if (wheelData.selectedRarity) {
            setSelectedRarity(wheelData.selectedRarity)
          }

          if (wheelData.selectedSkins && wheelData.selectedSkins.length > 0) {
            let selectedSkinsData = wheelData.selectedSkins as string[] | Array<{ id: string }>
            if (
              selectedSkinsData.length > 0 &&
              typeof selectedSkinsData[0] === "object" &&
              selectedSkinsData[0] !== null &&
              "id" in selectedSkinsData[0]
            ) {
              const normalized = (selectedSkinsData as Array<{ id: string }>).map(
                (skin) => skin.id,
              )
              selectedSkinsData = normalized
              updateWheelData("fortnite-wheel", currentWheel.id, {
                ...currentWheel.data,
                selectedSkins: normalized,
                skinOrder: normalized,
              })
            }
            setSelectedSkins(selectedSkinsData as string[])
            setSkinOrder(selectedSkinsData as string[])
          } else {
            // Auto-select all skins on first load
            const allSkins = Object.values(fortniteSkins).flat() as unknown as Skin[]
            const allSkinIds = allSkins.map(skin => skin.id)
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
            // Statistics are already stored in wheel data, no need to set local state
            // They will be displayed in the header dropdown automatically
          } else {
          }

          // Load spin history if available
          if (wheelData.spinHistory) {
            setSpinHistory(wheelData.spinHistory)
          } else {
            setSpinHistory([])
          }

          // Load total spins if available
          if (wheelData.totalSpins !== undefined) {
            setTotalSpins(wheelData.totalSpins)
          } else {
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
    setCurrentTheme(themeId)
    
    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        currentTheme: themeId
      })
    }
  }

  const handleApplyPalette = (colors: readonly string[]) => {
    setThemes((prev) =>
      prev.map((t) =>
        t.id === currentTheme ? { ...t, colors: [...colors] } : t,
      ),
    )
    setForceUpdate((p) => p + 1)
  }

  // Callback to update spin history when a spin is completed
  const handleSpinCompleted = () => {
    
    // Record spin for game session if active
    if (isAdvancedGameActive && currentSession) {
      // Small delay to ensure wheel data is fully updated (like MLB does)
      setTimeout(() => {
        // Get the result directly from the wheel data (like MLB does)
        const currentWheel = getCurrentWheel();
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as any;
          
          if (wheelData.selectedResult) {
            recordSpin(wheelData.selectedResult.name);
          } else {
          }
        } else {
        }
      }, 100); // Small delay to ensure state is updated (same as MLB)
    } else {
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

  const completeSpinAtRotation = (finalRotation: number, spinDurationMs: number) => {
    spinAudioRef.current?.stop()

    const skins = getFilteredSkins()
    if (skins.length === 0) {
      setIsSpinning(false)
      return
    }

    const soundVolume = settings.confettiSound?.soundVolume || 0.5
    const soundOn =
      settings.confettiSound?.enableSound !== false && !mutedRef.current

    const selectedIndex = pickSegmentIndex(finalRotation, skins.length)
    const selectedSkin = skins[selectedIndex]
    if (!selectedSkin) {
      setIsSpinning(false)
      return
    }

    if (actionMode === "elimination") {
      const newSelected = selectedSkins.filter((id) => id !== selectedSkin.id)
      setSelectedSkins(newSelected)
      setSkinOrder(newSelected)
      setForceUpdate((prev) => prev + 1)
      const currentWheel = getCurrentWheel()
      if (currentWheel) {
        updateWheelData("fortnite-wheel", currentWheel.id, {
          ...currentWheel.data,
          selectedSkins: newSelected,
          skinOrder: newSelected,
        })
      }
    }

    setSpinResult({ skin: selectedSkin, timestamp: new Date() })
    setAllResults((prev) => [
      ...prev,
      { skin: selectedSkin, timestamp: new Date() },
    ])
    setRotation(finalRotation)
    applyWheelRotation(wheelRef.current, finalRotation)

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

    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      const spinRecord: SpinRecord = {
        id: `spin-${Date.now()}`,
        timestamp: new Date(),
        result: selectedSkin.name,
        options: skins.map((s) => s.name),
        mode: "manual",
        theme: currentTheme,
        spinDuration: settings.spinBehavior.spinningDuration,
        userQuestion: undefined,
      }

      const newSpinHistory = [...spinHistory, spinRecord]
      const wheelData = currentWheel.data as Record<string, unknown>
      const newTotalSpins = totalSpins + 1
      const currentStats = (wheelData.statistics as Record<string, unknown>) || {
        totalSpins: 0,
        uniqueSkinsSpun: 0,
        spinStreak: 0,
        totalSpinTime: 0,
        spinResultsByRarity: {},
      }

      const allSpunSkins = new Set<string>()
      if (Array.isArray(wheelData.spinHistory)) {
        ;(wheelData.spinHistory as Array<{ result?: string }>).forEach((spin) => {
          if (spin.result) allSpunSkins.add(spin.result)
        })
      }
      allSpunSkins.add(selectedSkin.name)

      const spinResultsByRarity = {
        ...((currentStats.spinResultsByRarity as Record<string, number>) || {}),
      }
      const skinRarity = selectedSkin.rarity.toLowerCase()
      spinResultsByRarity[skinRarity] = (spinResultsByRarity[skinRarity] || 0) + 1
      const mostSpunRarity = Object.entries(spinResultsByRarity).sort(
        ([, a], [, b]) => (b as number) - (a as number),
      )[0]?.[0]

      const updatedStats = {
        ...currentStats,
        totalSpins: newTotalSpins,
        uniqueSkinsSpun: allSpunSkins.size,
        mostSpunSkin: selectedSkin.name,
        mostSpunRarity,
        lastSpinDate: new Date().toISOString(),
        firstSpinDate:
          (currentStats.firstSpinDate as string) || new Date().toISOString(),
        spinStreak: ((currentStats.spinStreak as number) || 0) + 1,
        totalSpinTime:
          ((currentStats.totalSpinTime as number) || 0) + spinDurationMs / 1000,
        favoriteRarity: mostSpunRarity,
        spinResultsByRarity,
        spinHistory: newSpinHistory,
      }

      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        spinHistory: newSpinHistory,
        selectedResult: selectedSkin,
        totalSpins: newTotalSpins,
        rotation: finalRotation,
        recentResults: [
          selectedSkin,
          ...(((currentWheel.data as FortniteWheelData).recentResults) || []),
        ].slice(0, 10),
        statistics: updatedStats,
      })
      setSpinHistory(newSpinHistory)
      setTotalSpins(newTotalSpins)
    }

    setIsSpinning(false)
    openFortniteResults()
  }

  const handleSpin = () => {
    if (isSpinning || getFilteredSkins().length === 0) return

    if (spinAnimationRef.current) {
      cancelAnimationFrame(spinAnimationRef.current)
      spinAnimationRef.current = null
    }
    spinAudioRef.current?.stop()

    const skins = getFilteredSkins()
    const duration = getSpinDurationMs(settings.spinBehavior?.spinningDuration)
    const speedLevel = settings.spinBehavior?.spinningSpeedLevel
    const startRotation = rotation || 0
    const endRotation = computeSpinEndRotation(startRotation, {
      randomInitialAngle: settings.display?.randomInitialAngle,
    })
    const startTime = Date.now()
    const soundVolume = settings.confettiSound?.soundVolume || 0.5
    const soundOn =
      settings.confettiSound?.enableSound !== false && !mutedRef.current

    setIsSpinning(true)
    applyWheelRotation(wheelRef.current, startRotation)

    if (soundOn) {
      try {
        if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
        spinAudioRef.current.startWhoosh("/wheel-sound.mp3", soundVolume)
      } catch {
        // ignore
      }
    }

    const finishSpin = (finalRotation: number) => {
      completeSpinAtRotation(finalRotation, duration)
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

      if (soundOn && skins.length > 0) {
        try {
          if (!spinAudioRef.current) {
            spinAudioRef.current = createSpinAudioController()
          }
          spinAudioRef.current.syncFrame(
            newRotation,
            skins.length,
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
        finishSpin(newRotation)
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

  const handleClearAll = () => {
    clearAllSkins()
  }

  const handleImportSkinsText = (text: string) => {
    const names = text
      .split(/[\n,]+/)
      .map((n) => n.trim().toLowerCase())
      .filter(Boolean)
    if (names.length === 0) return

    const all = getAllSkins()
    const matched = all.filter((s) => names.includes(s.name.toLowerCase()))
    if (matched.length === 0) return

    const ids = matched.map((s) => s.id)
    setSelectedSkins(ids)
    setSkinOrder(ids)
    setSelectedRarity("all")
    setForceUpdate((p) => p + 1)

    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins: ids,
        skinOrder: ids,
        selectedRarity: "all",
      })
    }
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
      }
    }
  }

  const handleShuffleSkins = () => {
    shuffleSkins()
    // Toast notification will be handled by the toast context
  }

  const handleSortSkinsAZ = () => {
    sortSkinsAZ()
  }

  const handleSortSkinsZA = () => {
    sortSkinsZA()
  }

  const handleAddRandomSkins = () => {
    addRandomSkins()
    // Toast notification will be handled by the toast context
  }

  const handleAddManualSkin = () => {
    if (!manualSkinName.trim()) {
      return
    }

    // Check if skin with this name already exists
    const allSkins = getAllSkins()
    const skinExists = allSkins.some(skin => skin.name.toLowerCase() === manualSkinName.trim().toLowerCase())
    if (skinExists) {
      return
    }

    
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
    
  }

  const handleDeleteCustomSkin = (skinId: string) => {
    
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
    
  }



  const handleRarityChange = (rarity: RarityFilter) => {
    setSelectedRarity(rarity)
    
    // Get all predefined skins (same as in getFilteredSkins)
    const allPredefinedSkins = Object.values(fortniteSkins).flat() as unknown as Skin[]
    
    // Auto-select all skins of the chosen rarity
    if (rarity === "all") {
      // Select all skins from all rarities
      const allSkinIds = allPredefinedSkins.map(skin => skin.id)
      setSelectedSkins(allSkinIds)
      setSkinOrder(allSkinIds)
    } else {
      // Select only skins of the chosen rarity
      const raritySkinIds = allPredefinedSkins
        .filter(skin => skin.rarity.toLowerCase() === rarity.toLowerCase())
        .map(skin => skin.id)
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
    
    const newSelected = selectedSkins.includes(skinId) 
      ? selectedSkins.filter(id => id !== skinId)
      : [...selectedSkins, skinId]
    
    
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
    
  }

  const clearAllSkins = () => {
    
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
    
  }

  const shuffleSkins = () => {
    // Shuffle the selected skins by updating the skinOrder
    const skinsArray = Array.from(selectedSkins)
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
    
  }

  const sortSkinsAZ = () => {
    const skinsArray = [...selectedSkins]
    const allSkinsWithCustom = [...getAllSkins(), ...customSkins]

    const sortedSkins = skinsArray.sort((a, b) => {
      const skinA = allSkinsWithCustom.find((skin) => skin.id === a)
      const skinB = allSkinsWithCustom.find((skin) => skin.id === b)
      return (skinA?.name || "").localeCompare(skinB?.name || "")
    })

    setSelectedSkins(sortedSkins)
    setSkinOrder(sortedSkins)

    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins: sortedSkins,
        skinOrder: sortedSkins,
      })
    }

    setForceUpdate((prev) => prev + 1)
  }

  const sortSkinsZA = () => {
    const skinsArray = [...selectedSkins]
    const allSkinsWithCustom = [...getAllSkins(), ...customSkins]

    const sortedSkins = skinsArray.sort((a, b) => {
      const skinA = allSkinsWithCustom.find((skin) => skin.id === a)
      const skinB = allSkinsWithCustom.find((skin) => skin.id === b)
      return (skinB?.name || "").localeCompare(skinA?.name || "")
    })

    setSelectedSkins(sortedSkins)
    setSkinOrder(sortedSkins)

    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedSkins: sortedSkins,
        skinOrder: sortedSkins,
      })
    }

    setForceUpdate((prev) => prev + 1)
  }

  const addRandomSkins = () => {
    // Add 5 random skins from all available skins (including custom skins)
    const allSkins = getAllSkins()
    const allSkinsWithCustom = [...allSkins, ...customSkins]
    const currentSelected = Array.from(selectedSkins)
    const availableSkins = allSkinsWithCustom.filter(skin => !currentSelected.includes(skin.id))
    
    
    if (availableSkins.length === 0) {
      return
    }
    
    const randomSkins = availableSkins
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, availableSkins.length))
      .map(skin => skin.id)
    
    
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
    
  }

  const getRarityCount = () => {
    const filtered = getFilteredSkins()
    const available = selectedRarity === "all" ? getAllSkins().length : (fortniteSkins[selectedRarity] || []).length
    return { selected: selectedSkins.length, available }
  }

  const handleAiQuerySubmit = () => {
    handleAiQuery()
  }

  const handleManualSelect = (skin: Skin) => {
    if (actionMode !== "manual") return

    const result: SpinResult = {
      skin,
      timestamp: new Date(),
    }

    setSpinResult(result)
    setAllResults((prev) => [...prev, result])

    const currentWheel = getCurrentWheel()
    if (currentWheel) {
      const currentData = currentWheel.data as FortniteWheelData
      updateWheelData("fortnite-wheel", currentWheel.id, {
        ...currentData,
        selectedResult: skin,
        totalSpins: (currentData.totalSpins || 0) + 1,
        recentResults: [skin, ...(currentData.recentResults || [])].slice(0, 10),
      })
    }

    openFortniteResults()
  }



  // Favorites and Comparison Helper Functions
  const addToFavorites = (skin: Skin) => {
    const currentWheel = getCurrentWheel()
    if (!currentWheel) return
    const data = currentWheel.data as FortniteWheelData
    const existing = (data.favoriteSkins ?? []) as Skin[]
    if (existing.some((s) => s.id === skin.id)) return
    updateWheelData("fortnite-wheel", currentWheel.id, {
      ...data,
      favoriteSkins: [...existing, skin],
    })
  }

  const removeFromFavorites = (skinId: string) => {
    const currentWheel = getCurrentWheel()
    if (!currentWheel) return
    const data = currentWheel.data as FortniteWheelData
    updateWheelData("fortnite-wheel", currentWheel.id, {
      ...data,
      favoriteSkins: ((data.favoriteSkins ?? []) as Skin[]).filter(
        (skin) => skin.id !== skinId,
      ),
    })
  }

  const isFavorite = (skinId: string) => {
    return favoriteSkins.some((skin) => skin.id === skinId)
  }

  const addToComparison = (skin: Skin) => {
    const currentWheel = getCurrentWheel()
    if (!currentWheel) return
    const data = currentWheel.data as FortniteWheelData
    const existing = (data.comparisonSkins ?? []) as Skin[]
    if (existing.length >= 4 || existing.some((s) => s.id === skin.id)) return
    updateWheelData("fortnite-wheel", currentWheel.id, {
      ...data,
      comparisonSkins: [...existing, skin],
    })
  }

  const removeFromComparison = (skinId: string) => {
    const currentWheel = getCurrentWheel()
    if (!currentWheel) return
    const data = currentWheel.data as FortniteWheelData
    updateWheelData("fortnite-wheel", currentWheel.id, {
      ...data,
      comparisonSkins: ((data.comparisonSkins ?? []) as Skin[]).filter(
        (skin) => skin.id !== skinId,
      ),
    })
  }

  const isInComparison = (skinId: string) => {
    return comparisonSkins.some((skin) => skin.id === skinId)
  }

  // Enhanced Details Handler
  const handleEnhancedDetails = (skin: Skin) => {
    setEnhancedDetailsSkin(skin)
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
      return [...prev, skinWithPreview]
    })

    // Add to selected skins so it appears on the wheel
    setSelectedSkins(prev => {
      if (prev.includes(customSkin.id)) return prev
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
        <Header
          onOpenSettings={() => setShowSettings(true)}
          onOpenGames={() => setShowGameModes(true)}
        />

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
              // Add current game points to total points before restarting
              const gameScore = getGameScore()
              setTotalPoints(prev => prev + gameScore)
              
              // Save game stats
              const gameStats = getGameStats()
              if (gameStats) {
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

        <main className="w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-4 text-center">
            <ToolPageTitle
              title={shortTitle ?? FORTNITE_WHEEL_SHORT_TITLE}
              toolType="fortnite-wheel"
            />
            <p className="text-gray-600">
              {toolSubtitle ?? "Pick a random Fortnite skin by wheel"}
            </p>
          </div>

          <FortniteWheelPopularTemplates />

          {activeUseCaseId && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge className="bg-slate-800 text-white hover:bg-slate-800">
                Template: {getFortniteWheelUseCase(activeUseCaseId)?.label}
              </Badge>
              <Badge variant="secondary">
                {getFortniteWheelUseCase(activeUseCaseId)?.config.skins.length} skins ready
              </Badge>
            </div>
          )}

          <div className="mb-6 grid min-w-0 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-3 lg:gap-8">
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
                  onClick={openFortniteResults}
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
                <FortniteWheelSection
                  isReady={isInitialized && isDataLoaded}
                  skins={getFilteredSkins()}
                  rotation={rotation}
                  isSpinning={isSpinning}
                  spinDuration={settings.spinBehavior?.spinningDuration ?? 10}
                  wheelRef={wheelRef}
                  displayMode={displayMode}
                  currentTheme={currentTheme}
                  themes={themes}
                  wheelKey={`fortnite-wheel-${currentTheme}-${selectedRarity}-${Array.isArray(selectedSkins) ? selectedSkins.join(",") : ""}-${forceUpdate}`}
                  onSpinCompleted={handleSpinCompleted}
                  muted={muted}
                  onToggleMute={() => setMuted((m) => !m)}
                  displaySpinCount={displaySpinCount}
                  onSpin={handleSpin}
                  onManualStop={handleManualStop}
                  actionMode={actionMode}
                  onActionModeChange={syncActionMode}
                  manualSkinName={manualSkinName}
                  onManualSkinNameChange={setManualSkinName}
                  onAddManualSkin={handleAddManualSkin}
                  spinResult={spinResult}
                  resultsCount={recentResultsCount}
                  onViewResultDetails={() => {
                    if (spinResult?.skin) handleEnhancedDetails(spinResult.skin)
                  }}
                  showResultsButton={false}
                  isGameActive={isAdvancedGameActive}
                  currentGameModeName={currentSession?.gameMode?.name}
                  onOpenAchievements={() => setShowAchievements(true)}
                  onOpenThemeSelector={() => setShowThemeSelector(true)}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  onOpenSocialHub={() => setShowSocialHub(true)}
                  onOpenGameModes={() => setShowGameModes(true)}
                  totalPoints={totalPoints}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen((f) => !f)}
                />
              </div>
            </div>

            {showInputs && !isFullscreen && (
              <div className="min-w-0 self-start lg:col-span-1">
                <FortniteInputPanel
                  forceUpdate={forceUpdate}
                  selectedRarity={selectedRarity}
                  selectedSkins={selectedSkins}
                  displayMode={displayMode}
                  showTitle={showTitle}
                  actionMode={actionMode}
                  onActionModeChange={syncActionMode}
                  customSkins={customSkins}
                  favoriteSkins={favoriteSkins}
                  comparisonSkins={comparisonSkins}
                  customOnlyMode={customOnlyMode}
                  activeTemplateId={activeUseCaseId}
                  onRarityChange={handleRarityChange}
                  onSkinToggle={handleSkinToggle}
                  onClearAll={handleClearAll}
                  onDisplayModeChange={setDisplayMode}
                  onShowTitleToggle={() => {
                    const next = !showTitle
                    setShowTitle(next)
                    const currentWheel = getCurrentWheel()
                    if (currentWheel) {
                      updateWheelData("fortnite-wheel", currentWheel.id, {
                        ...currentWheel.data,
                        showTitle: next,
                      })
                    }
                  }}
                  onPreviewSkin={handlePreviewSkin}
                  getRarityCount={getRarityCount}
                  onShuffleSkins={handleShuffleSkins}
                  onSortSkinsAZ={handleSortSkinsAZ}
                  onSortSkinsZA={handleSortSkinsZA}
                  onAddRandomSkins={handleAddRandomSkins}
                  onOpenFavorites={() => setShowFavoritesModal(true)}
                  onOpenComparison={() => setShowComparisonModal(true)}
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                  isFavorite={isFavorite}
                  addToComparison={addToComparison}
                  removeFromComparison={removeFromComparison}
                  isInComparison={isInComparison}
                  onEnhancedDetails={handleEnhancedDetails}
                  onManualSelect={handleManualSelect}
                  onDeleteCustomSkin={handleDeleteCustomSkin}
                  aiMode={aiMode}
                  aiQuery={aiQuery}
                  aiResponse={aiResponse}
                  aiLoading={aiLoading}
                  aiChatHistory={aiChatHistory}
                  aiRecommendations={aiRecommendations}
                  userPreferences={userPreferences}
                  aiRecommendedSkins={aiRecommendedSkins}
                  onAiModeChange={setAiMode}
                  onAiQueryChange={setAiQuery}
                  onAiQuerySubmit={handleAiQuerySubmit}
                  onUserPreferencesChange={setUserPreferences}
                  onAiSkinsChange={(skins) => {
                    const newSelectedSkins = Array.from(skins || new Set())
                    setSelectedSkins(newSelectedSkins)
                    const currentWheel = getCurrentWheel()
                    if (currentWheel) {
                      updateWheelData("fortnite-wheel", currentWheel.id, {
                        ...currentWheel.data,
                        selectedSkins: newSelectedSkins,
                        skinOrder: newSelectedSkins,
                      })
                    }
                  }}
                  onAiResponseChange={setAiResponse}
                  getAllSkins={getAllSkins}
                  getFilteredSkins={getFilteredSkins}
                  onAddCustomSkin={handleAddCustomSkin}
                  skinStats={skinStats}
                  allResults={allResults}
                  resultsCount={recentResultsCount}
                  themes={themes}
                  currentTheme={currentTheme}
                  onThemeChange={handleThemeSelect}
                  onApplyPalette={handleApplyPalette}
                  onHideInputs={() => setShowInputs(false)}
                  onViewHistory={openFortniteResults}
                  onOpenAchievements={() => setShowAchievements(true)}
                  onOpenSettings={() => setShowSettings(true)}
                  onToggleFullscreen={() => setIsFullscreen((f) => !f)}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  onImportSkinsText={handleImportSkinsText}
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

      </div>
  )
}

export default function FortniteWheelApp(props: FortniteWheelAppProps) {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-50" />}>
        <FortniteWheelAppInner {...props} />
      </Suspense>
    </ToastProvider>
  )
}


