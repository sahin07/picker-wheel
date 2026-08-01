"use client"

import { useState, useEffect, useCallback, useRef, useMemo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWheelPicker } from "@/hooks/use-wheel-picker"
import { useGameModes } from "@/hooks/use-game-modes"
import Header from "@/components/header"
import ToolBreadcrumbs from "@/components/tool-breadcrumbs"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { WheelDisplay } from "@/components/image-picker/wheel-display"
import { WheelControls } from "@/components/image-picker/wheel-controls"
import { ImagePickerSidebar } from "@/components/image-picker/image-picker-sidebar"
import { GameStatusBar } from "@/components/image-picker/games/game-status-bar"
import { BingoCard } from "@/components/image-picker/games/bingo-card"
import { MemoryChallenge } from "@/components/image-picker/games/memory-challenge"
import { SequenceMatch } from "@/components/image-picker/games/sequence-match"
import { ResultsDialog } from "@/components/image-picker/results-dialog"
import { TitleModal } from "@/components/image-picker/title-modal"
import { GameSelectionDialog } from "@/components/image-picker/game-selection-dialog"
import {
  AchievementsDisplay,
  type Achievement,
} from "@/components/yes-no-picker-wheel/achievements-display"
import { ChallengesDisplay } from "@/components/yes-no-picker-wheel/challenges-display"
import { ThemeSelector } from "@/components/yes-no-picker-wheel/theme-selector"
import { initializeAchievements, checkAchievements } from "@/lib/achievement-system"
import { initializeChallenges, checkChallenges, type Challenge } from "@/lib/decision-challenges"
import { WHEEL_THEMES, type WheelTheme, checkThemeUnlocks } from "@/lib/wheel-themes"
import {
  analyzeSpinData,
  type SpinRecord as AnalyticsSpinRecord,
} from "@/lib/picker-wheel-analytics"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import Confetti from "react-confetti"
import { useSettings } from "@/contexts/settings-context"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { IMAGE_PICKER_SHORT_TITLE } from "@/lib/image-picker-seo"
import {
  getImagePickerUseCase,
  type ImagePickerUseCaseId,
} from "@/lib/image-picker-use-cases"
import type { ImagePickerDeepLink } from "@/lib/image-picker-spokes"
import { ImagePickerPopularWheels } from "@/components/image-picker/image-picker-popular-wheels"
import type { WheelItem } from "@/lib/types"
import {
  Gamepad2,
  Share2,
  Eye,
  Palette,
  BarChart3,
  Users,
  Trophy,
  Sparkles,
} from "lucide-react"

// Helper: Default sample images
const SAMPLE_IMAGES: WheelItem[] = [
  {
    id: "sample-1",
    text: "Sample Image 1",
    enabled: true,
    count: 0,
    imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+1",
  },
  {
    id: "sample-2",
    text: "Sample Image 2",
    enabled: true,
    count: 0,
    imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+2",
  },
  {
    id: "sample-3",
    text: "Sample Image 3",
    enabled: true,
    count: 0,
    imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+3",
  },
  {
    id: "sample-4",
    text: "Sample Image 4",
    enabled: true,
    count: 0,
    imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+4",
  },
];

type ImagePickerWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: ImagePickerDeepLink
}

function InnerImagePickerWheelPage({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: ImagePickerWheelAppProps) {
  // Move all logic and hooks here
  const [showSettings, setShowSettings] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showGames, setShowGames] = useState(false)
  const [showTitleModal, setShowTitleModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [confettiEnabled, setConfettiEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showTitle, setShowTitle] = useState(false)
  const isSpinningRef = useRef(false)
  const wheelRotationRef = useRef(0)
  const spinAudioRef = useRef<SpinAudioController | null>(null)
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activePaletteColors, setActivePaletteColors] = useState<string[] | null>(null)
  const [activeUseCaseId, setActiveUseCaseId] = useState<ImagePickerUseCaseId | null>(
    deepLink?.preset ?? null,
  )
  const deepLinkAppliedRef = useRef(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showChallenges, setShowChallenges] = useState(false)
  const [wheelTheme, setWheelTheme] = useState("classic")
  const [themes, setThemes] = useState<WheelTheme[]>(WHEEL_THEMES)
  const [usedThemes, setUsedThemes] = useState<string[]>(["classic"])
  const [enhancedAchievements, setEnhancedAchievements] = useState<Achievement[]>(() =>
    initializeAchievements([]),
  )
  const [challenges, setChallenges] = useState<Challenge[]>(() => initializeChallenges([]))
  const [imageStreak, setImageStreak] = useState({ type: "", count: 0 })
  const [recentResultLabels, setRecentResultLabels] = useState<string[]>([])
  const [decisionDates, setDecisionDates] = useState<Date[]>([])
  const { settings, loadFromDatabase: loadSettings, updateSettings: updateLocalSettings } = useSettingsStore()
  const { getCurrentWheel, updateWheelData, setCurrentTool, createNewWheel, currentWheelId } = useWheelManagerStore();
  const { settings: globalSettings, updateSettings } = useSettings();
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(SAMPLE_IMAGES.map(img => ({ ...img })));
  // Always derive enabledItems from wheelItems
  const enabledItems = wheelItems.filter(item => item.enabled !== false);
  const prevWheelId = useRef<string | null>(null);
  const skipNextSaveRef = useRef(false);

  // Switch wheel functionality (like number picker tool)
  useEffect(() => {
    setCurrentTool("image-picker-wheel")
    void loadSettings()
    if (typeof window !== "undefined") {
      const wheel = getCurrentWheel()
      if (!wheel) {
        createNewWheel("image-picker-wheel", "My Image Picker Wheel")
      }
    }
  }, [setCurrentTool, getCurrentWheel, createNewWheel, loadSettings])

  // Unified sync for all item actions
  const syncWheelItems = useCallback((items: WheelItem[]) => {
    setWheelItems(items);
    const wheel = getCurrentWheel();
    if (wheel) {
      updateWheelData(wheel.toolType, wheel.id, { wheelItems: items });
    }
  }, [getCurrentWheel, updateWheelData]);

  // Add custom item
  const handleAddCustomItem = () => {
    if (!customInput.trim()) return;
    const newItem: WheelItem = {
      id: `custom-${Date.now()}`,
      text: customInput.trim(),
      enabled: true,
      count: 0,
    };
    syncWheelItems([...wheelItems, newItem]);
    setCustomInput("");
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    syncWheelItems(wheelItems.filter(item => item.id !== id));
  };

  // Toggle item enabled
  const handleToggleItem = (id: string) => {
    syncWheelItems(wheelItems.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  // Reset counts
  const handleResetCounts = () => {
    syncWheelItems(wheelItems.map(item => ({ ...item, count: 0 })));
  };

  // Remove all items
  const handleRemoveAll = () => {
    syncWheelItems([]);
  };

  // Enable all inputs
  const enableAllInputs = () => {
    syncWheelItems(wheelItems.map(item => ({ ...item, enabled: true })));
  };

  // Disable all inputs
  const disableAllInputs = () => {
    syncWheelItems(wheelItems.map(item => ({ ...item, enabled: false })));
  };

  // Image upload
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newItems: WheelItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newItems.push({
        id: `uploaded-${Date.now()}-${i}`,
        text: file.name,
        enabled: true,
        count: 0,
        imageUrl: url,
        imageFile: file,
      });
    }
    syncWheelItems([...wheelItems, ...newItems]);
  }, [wheelItems, syncWheelItems]);

  // WheelPickerWebsite logic from new context
  const { currentTool, numberRange, setNumberRange, settings: wheelSettings, setSettings, isSpinning, setIsSpinning, selectedItem, setSelectedItem, wheelRotation, setWheelRotation, results, setResults, customInput, setCustomInput, wheelTitle, setWheelTitle, wheelDescription, setWheelDescription, fileInputRef } = useWheelPicker();

  const applyUseCasePreset = useCallback(
    (id: ImagePickerUseCaseId) => {
      const useCase = getImagePickerUseCase(id)
      if (!useCase || isSpinningRef.current) return

      const nextItems = useCase.items.map((item) => ({ ...item }))
      setActiveUseCaseId(id)
      setWheelTitle(useCase.toolTitle)
      setWheelDescription(useCase.toolDescription)
      setSelectedItem(null)
      setResults([])
      syncWheelItems(nextItems)
    },
    [setWheelTitle, setWheelDescription, setSelectedItem, setResults, syncWheelItems],
  )

  useEffect(() => {
    if (!wheelTitle) setWheelTitle("Image Picker Wheel")
    if (!wheelDescription) setWheelDescription("Randomly pick a picture by wheel")
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSoundEnabled(settings.confettiSound?.enableSound !== false)
    setConfettiEnabled(settings.confettiSound?.enableConfetti !== false)
  }, [settings.confettiSound?.enableSound, settings.confettiSound?.enableConfetti])

  // Header Settings → Mystery Spin ↔ tool mystery mode
  useEffect(() => {
    const mysteryOn = !!settings.spinBehavior?.mysterySpin
    if (!!wheelSettings.mysteryMode !== mysteryOn) {
      setSettings({ ...wheelSettings, mysteryMode: mysteryOn })
    }
  }, [settings.spinBehavior?.mysterySpin]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep Action Mode ↔ Manage/Header "Remove winner" in sync (Yes-No / Letter parity)
  useEffect(() => {
    const wantElimination = !!settings.spinBehavior?.removeWinnerAfterSpin
    const current = (wheelSettings.actionMode as string) || "normal"
    if (wantElimination && current !== "elimination") {
      setSettings({ ...wheelSettings, actionMode: "elimination" })
    } else if (!wantElimination && current === "elimination") {
      setSettings({ ...wheelSettings, actionMode: "normal" })
    }
  }, [settings.spinBehavior?.removeWinnerAfterSpin]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleActionModeChange = useCallback(
    (mode: "normal" | "elimination" | "accumulation") => {
      setSettings({ ...wheelSettings, actionMode: mode })
      const latest = useSettingsStore.getState().settings
      updateLocalSettings({
        spinBehavior: {
          ...latest.spinBehavior,
          removeWinnerAfterSpin: mode === "elimination",
        },
      })
    },
    [wheelSettings, setSettings, updateLocalSettings],
  )

  useEffect(() => {
    wheelRotationRef.current = wheelRotation
  }, [wheelRotation])

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
      spinAudioRef.current?.stop()
    }
  }, [])

  const applySoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled)
    const latest = useSettingsStore.getState().settings
    updateLocalSettings({
      confettiSound: {
        ...latest.confettiSound,
        enableSound: enabled,
      },
    })
    updateSettings({
      confettiSound: {
        ...globalSettings.confettiSound,
        enableSound: enabled,
      },
    })
  }

  const shuffleWheel = () => {
    const shuffled = [...wheelItems]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    syncWheelItems(shuffled)
  }

  const applyPalette = (colors: string[]) => {
    if (!colors.length) return
    setActivePaletteColors(colors)
    syncWheelItems(
      wheelItems.map((item, i) => ({
        ...item,
        color: colors[i % colors.length],
      })),
    )
    // Also tint the alternating base color for items without explicit slots
    setSettings({
      ...wheelSettings,
      wheelColor: colors[0] || wheelSettings.wheelColor,
    })
  }

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId)
    if (!theme) return
    setWheelTheme(themeId)
    if (!usedThemes.includes(themeId)) {
      setUsedThemes((prev) => [...prev, themeId])
    }
    const colors = [theme.colors.yes, theme.colors.no, theme.colors.maybe]
    applyPalette(colors)
    setSettings({
      ...wheelSettings,
      wheelColor: theme.colors.yes,
      backgroundColor: theme.colors.maybe || wheelSettings.backgroundColor,
    })
  }

  const shareResult = async () => {
    const text = selectedItem
      ? `I just got "${selectedItem.text}" on the Image Picker Wheel! 🖼️`
      : `Try the Image Picker Wheel — upload pictures and spin! ${typeof window !== "undefined" ? window.location.href : ""}`
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ text, title: "Image Picker Wheel" })
        return
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      }
    } catch {
      // ignore cancel
    }
  }

  // Load / switch wheel data when My Wheels selection changes (single source of truth)
  useEffect(() => {
    if (!currentWheelId) return
    const wheel = getCurrentWheel()
    if (!wheel || wheel.id !== currentWheelId) return

    // Skip redundant reload of the same wheel
    if (prevWheelId.current === wheel.id) return
    prevWheelId.current = wheel.id
    skipNextSaveRef.current = true

    const data = wheel.data as
      | {
          wheelItems?: WheelItem[]
          recentResults?: WheelItem[]
          lastResult?: WheelItem | null
        }
      | undefined

    const loadedItems = Array.isArray(data?.wheelItems) ? data!.wheelItems! : []
    const loadedResults = Array.isArray(data?.recentResults) ? data!.recentResults! : []
    const loadedSelected = data?.lastResult ?? null

    const createdMs = Date.parse(wheel.createdAt || "") || 0
    const isFreshWheel = Date.now() - createdMs < 30_000

    // Prefer saved slices; for a brand-new empty / placeholder wheel seed sample images
    const hasRealImages = loadedItems.some((item) => !!item.imageUrl)
    const nextItems =
      loadedItems.length > 0 && (hasRealImages || !isFreshWheel)
        ? loadedItems
        : isFreshWheel
          ? SAMPLE_IMAGES.map((img) => ({ ...img }))
          : loadedItems

    setWheelItems(nextItems)
    setResults(loadedResults)
    setSelectedItem(loadedSelected)
    if (!deepLink?.preset) {
      setActiveUseCaseId(null)
    }
  }, [currentWheelId, getCurrentWheel, setResults, setSelectedItem, deepLink?.preset])

  // Spoke pages: apply dedicated image template after the wheel is ready
  useEffect(() => {
    if (!deepLink?.preset || deepLinkAppliedRef.current || isSpinningRef.current) return
    if (!currentWheelId) return
    deepLinkAppliedRef.current = true
    applyUseCasePreset(deepLink.preset)
    if (deepLink.toolTitle) setWheelTitle(deepLink.toolTitle)
    if (deepLink.toolDescription) setWheelDescription(deepLink.toolDescription)
  }, [
    deepLink,
    currentWheelId,
    applyUseCasePreset,
    setWheelTitle,
    setWheelDescription,
  ])

  // Persist wheel data when slices / results change
  useEffect(() => {
    const wheel = getCurrentWheel()
    if (!wheel || wheel.id !== currentWheelId) return
    if (prevWheelId.current !== wheel.id) return
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }

    updateWheelData("image-picker-wheel", wheel.id, {
      wheelItems,
      totalSpins: results.length,
      lastResult: selectedItem,
      recentResults: results.slice(-10),
    })
  }, [wheelItems, results, selectedItem, currentWheelId, getCurrentWheel, updateWheelData])

  const {
    gameMode,
    setGameMode,
    bingoCard,
    createBingoCard,
    memoryChallenge,
    startMemoryChallenge,
    collectionProgress,
    startCollectionRace,
    sequenceTarget,
    sequenceProgress,
    startSequenceMatch,
    gameTimer,
    isGameActive,
    gameStats,
    setGameStats,
    handleGameSpin,
    resetGame,
  } = useGameModes({
    enabledItems,
    selectedItem,
    setSelectedItem,
  })

  const spinWheel = () => {
    if (isSpinning || isSpinningRef.current || enabledItems.length === 0) return

    isSpinningRef.current = true
    setIsSpinning(true)

    const soundCfg = useSettingsStore.getState().settings.confettiSound
    const soundOn = soundCfg?.enableSound !== false && soundEnabled
    const volume = soundCfg?.soundVolume || 0.5

    if (soundOn) {
      try {
        if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
        spinAudioRef.current.startWhoosh("/wheel-sound.mp3", volume)
      } catch {
        // ignore autoplay
      }
    }

    const itemsAtSpin = enabledItems
    const angle = 360 / itemsAtSpin.length
    // Match Yes-No / Letter: ~10 full turns so angular speed feels the same over global duration
    const randomRotation = 10 * 360 + Math.random() * 360
    const finalRotation = wheelRotationRef.current + randomRotation
    wheelRotationRef.current = finalRotation
    setWheelRotation(finalRotation)

    // Match Yes-No / Letter / Color: Header Settings → Spinning Duration
    const durationSec = Math.max(
      0.5,
      useSettingsStore.getState().settings.spinBehavior?.spinningDuration || 10,
    )
    const durationMs = durationSec * 1000
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    spinTimeoutRef.current = setTimeout(() => {
      spinAudioRef.current?.stop()

      const normalizedRotation = ((finalRotation % 360) + 360) % 360
      const normalizedAngle = (360 - normalizedRotation) % 360
      const segmentIndex = Math.floor(normalizedAngle / angle) % itemsAtSpin.length
      const selected = itemsAtSpin[segmentIndex]

      setSelectedItem(selected)
      setResults((prev) => [selected, ...prev])
      setGameStats((prev) => ({ ...prev, totalSpins: prev.totalSpins + 1 }))
      handleGameSpin(selected)
      const eliminate =
        wheelSettings.actionMode === "elimination" ||
        !!useSettingsStore.getState().settings.spinBehavior?.removeWinnerAfterSpin
      if (eliminate) {
        setWheelItems((prev) => {
          const stillActive = prev.filter((item) => item.enabled !== false)
          // Keep at least one option on the wheel
          if (stillActive.length <= 1) return prev
          return prev.map((item) =>
            item.id === selected.id ? { ...item, enabled: false } : item,
          )
        })
      } else if (wheelSettings.actionMode === "accumulation") {
        setWheelItems((prev) =>
          prev.map((item) =>
            item.id === selected.id ? { ...item, count: item.count + 1 } : item,
          ),
        )
      }

      const label = selected.text
      const nextRecent = [...recentResultLabels.slice(-9), label]
      const nextDates = [...decisionDates, new Date()]
      const nextStreak =
        imageStreak.type === label
          ? { type: label, count: imageStreak.count + 1 }
          : { type: label, count: 1 }
      const nextTotalSpins = results.length + 1
      const stubResults = { yes: nextTotalSpins, no: 0, maybe: 0 }

      setRecentResultLabels(nextRecent)
      setDecisionDates(nextDates)
      setImageStreak(nextStreak)

      const { updatedAchievements } = checkAchievements(
        enhancedAchievements,
        nextTotalSpins,
        stubResults,
        nextStreak,
        "manual",
        nextRecent,
        usedThemes.includes(wheelTheme) ? usedThemes : [...usedThemes, wheelTheme],
        nextDates,
      )
      setEnhancedAchievements(updatedAchievements)

      const { updatedChallenges, totalPoints: pts } = checkChallenges(
        challenges,
        nextTotalSpins,
        stubResults,
        nextStreak,
        "manual",
        nextRecent,
        0,
        nextDates,
      )
      setChallenges(updatedChallenges)
      setTotalPoints(pts)

      const { updatedThemes } = checkThemeUnlocks(
        themes,
        nextTotalSpins,
        stubResults,
        usedThemes.includes(wheelTheme) ? usedThemes : [...usedThemes, wheelTheme],
        pts,
        updatedChallenges.filter((c) => c.completed).length,
      )
      setThemes(updatedThemes)

      if (soundOn) {
        try {
          const audio = new Audio("/sound-win.mp3")
          audio.volume = volume
          void audio.play()
        } catch {
          // ignore
        }
      }

      const confettiOn = soundCfg?.enableConfetti !== false && confettiEnabled
      if (confettiOn) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }

      isSpinningRef.current = false
      setIsSpinning(false)
    }, durationMs + 80)
  }

  const handleRotationFrame = (rotationDegrees: number) => {
    wheelRotationRef.current = rotationDegrees
    const soundCfg = useSettingsStore.getState().settings.confettiSound
    if (soundCfg?.enableSound === false || !soundEnabled || enabledItems.length <= 0) return
    try {
      if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
      spinAudioRef.current.syncFrame(
        rotationDegrees,
        enabledItems.length,
        soundCfg?.soundVolume || 0.5,
        null,
      )
    } catch {
      // ignore
    }
  }

  // Always calculate enabledItems and segmentAngle from current wheelItems
  // enabledItems is now always derived from wheelItems
  // (do not redeclare enabledItems)
  const segmentAngle = enabledItems.length > 0 ? 360 / enabledItems.length : 0;
  const eliminatedCount = wheelItems.filter((item) => item.enabled === false).length

  const imageAnalytics = useMemo(
    () =>
      analyzeSpinData(
        results.map(
          (r, i): AnalyticsSpinRecord => ({
            id: `${r.id}-${i}-${String(r.text)}`,
            timestamp: decisionDates[i] || new Date(),
            result: r.text,
            options: enabledItems.map((item) => item.text),
            mode: "manual",
            theme: wheelTheme,
            spinDuration:
              Math.max(0.5, settings.spinBehavior?.spinningDuration || 10) * 1000,
          }),
        ),
      ),
    [results, decisionDates, enabledItems, wheelTheme, settings.spinBehavior?.spinningDuration],
  )

  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isFullscreen])

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: settings.appearance?.backgroundColor,
        backgroundImage: settings.appearance?.backgroundImage
          ? `url(${settings.appearance.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
          numberOfPieces={400}
          recycle={false}
          style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 1000 }}
        />
      )}
      <Header onOpenSettings={() => setShowSettings(true)} onOpenGames={() => setShowGames(true)} />
      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4 text-center">
          <ToolPageTitle
            title={shortTitle ?? IMAGE_PICKER_SHORT_TITLE}
            toolType="image-picker-wheel"
          />
          <p className="text-gray-600">
            {toolSubtitle ?? "Upload pictures and select one visually at random"}
          </p>
        </div>

        {!isFullscreen && (
          <>
            <ImagePickerPopularWheels
              activeId={activeUseCaseId}
              onSelectPreset={applyUseCasePreset}
            />
            {activeUseCaseId && (
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className="bg-slate-800 text-white hover:bg-slate-800">
                  Template: {getImagePickerUseCase(activeUseCaseId)?.label}
                </Badge>
                <Badge variant="secondary">{enabledItems.length} images on wheel</Badge>
              </div>
            )}
          </>
        )}

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
            enabledItems={enabledItems}
            sequenceTarget={sequenceTarget}
            sequenceProgress={sequenceProgress}
          />
        )}

        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div
            className={`relative overflow-hidden bg-white p-4 sm:p-6 ${
              isFullscreen
                ? "lg:col-span-3"
                : "rounded-lg border shadow-sm lg:col-span-2"
            }`}
          >
            {!isFullscreen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResults(true)}
                className="absolute left-4 top-4 z-10 border-blue-500 bg-white px-3 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50"
              >
                Results
                {results.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {results.length}
                  </Badge>
                )}
              </Button>
            )}

            <div className="flex flex-col items-center space-y-6 pt-8">
              {(wheelSettings.actionMode === "elimination" ||
                !!settings.spinBehavior?.removeWinnerAfterSpin) &&
                eliminatedCount > 0 &&
                !isFullscreen && (
                  <Badge variant="secondary">
                    {Math.max(enabledItems.length, 0)} left on wheel
                  </Badge>
                )}

              <WheelDisplay
                enabledItems={enabledItems}
                segmentAngle={segmentAngle}
                wheelRotation={wheelRotation}
                settings={wheelSettings}
                isSpinning={isSpinning}
                spinWheel={spinWheel}
                selectedItem={selectedItem}
                currentTool={currentTool}
                gameMode={gameMode}
                bingoCard={bingoCard}
                memoryChallenge={memoryChallenge}
                collectionProgress={collectionProgress}
                sequenceTarget={sequenceTarget}
                sequenceProgress={sequenceProgress}
                setShowResults={setShowResults}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen((v) => !v)}
                soundEnabled={soundEnabled}
                setSoundEnabled={applySoundEnabled}
                onRotationFrame={handleRotationFrame}
                results={results}
                showStats={showStats}
              />

              <WheelControls
                selectedItem={selectedItem}
                currentTool={currentTool}
                onShare={shareResult}
                isSpinning={isSpinning}
              />

              {enabledItems.length === 0 && (
                <p className="text-center text-sm text-slate-500">
                  No images on the wheel — upload pictures in Inputs, then spin.
                </p>
              )}

              {!showInputs && !isFullscreen && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setShowInputs(true)}
                >
                  <Eye className="h-4 w-4" />
                  Show controls
                </Button>
              )}

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowThemeSelector(true)}
                  className="relative border-purple-500 px-3 py-1 text-xs text-purple-600 hover:border-purple-600 hover:bg-purple-50"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Themes
                  {themes.filter((t) => t.unlocked).length > 3 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {themes.filter((t) => t.unlocked).length}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnalytics(true)}
                  className="relative border-green-500 px-3 py-1 text-xs text-green-600 hover:border-green-600 hover:bg-green-50"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                  {results.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {results.length}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSocialHub(true)}
                  className="relative border-orange-500 px-3 py-1 text-xs text-orange-600 hover:border-orange-600 hover:bg-orange-50"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Social
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGames(true)}
                  className="relative border-red-500 px-3 py-1 text-xs text-red-600 hover:border-red-600 hover:bg-red-50"
                >
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Games
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAchievements(true)}
                  className="relative border-yellow-500 px-3 py-1 text-xs text-yellow-600 hover:border-yellow-600 hover:bg-yellow-50"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Achievements
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {totalPoints}
                  </Badge>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChallenges(true)}
                  className="relative border-sky-500 px-3 py-1 text-xs text-sky-600 hover:border-sky-600 hover:bg-sky-50"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Challenges
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareResult}
                  className="relative border-slate-400 px-3 py-1 text-xs text-slate-600 hover:border-slate-500 hover:bg-slate-50"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {!isFullscreen && showInputs && (
            <div className="space-y-6 lg:col-span-1">
              {gameMode === "bingo" && bingoCard && (
                <BingoCard bingoCard={bingoCard} currentTool={currentTool} />
              )}
              {gameMode === "memory" && memoryChallenge && (
                <MemoryChallenge memoryChallenge={memoryChallenge} currentTool={currentTool} />
              )}
              {gameMode === "sequence" && sequenceTarget.length > 0 && (
                <SequenceMatch
                  sequenceTarget={sequenceTarget}
                  sequenceProgress={sequenceProgress}
                  currentTool={currentTool}
                />
              )}
              <ImagePickerSidebar
                wheelItems={wheelItems}
                enabledItems={enabledItems}
                syncWheelItems={syncWheelItems}
                wheelSettings={wheelSettings}
                setWheelSettings={setSettings}
                actionMode={
                  (wheelSettings.actionMode as "normal" | "elimination" | "accumulation") ||
                  "normal"
                }
                onActionModeChange={handleActionModeChange}
                wheelTitle={wheelTitle}
                setWheelTitle={setWheelTitle}
                wheelDescription={wheelDescription}
                setWheelDescription={setWheelDescription}
                showTitle={showTitle}
                setShowTitle={setShowTitle}
                handleImageUpload={handleImageUpload}
                fileInputRef={fileInputRef}
                enableAllInputs={enableAllInputs}
                disableAllInputs={disableAllInputs}
                resetCounts={handleResetCounts}
                removeAllInputs={handleRemoveAll}
                showStats={showStats}
                setShowStats={setShowStats}
                onApplyPalette={applyPalette}
                activePaletteColors={activePaletteColors}
                onShuffle={shuffleWheel}
                onHideInputs={() => setShowInputs(false)}
                onOpenTitleModal={() => setShowTitleModal(true)}
                onViewResults={() => setShowResults(true)}
                onOpenGames={() => setShowGames(true)}
                onOpenAchievements={() => setShowAchievements(true)}
                onOpenChallenges={() => setShowChallenges(true)}
                onOpenThemes={() => setShowThemeSelector(true)}
                onOpenAnalytics={() => setShowAnalytics(true)}
                onToggleFullscreen={() => setIsFullscreen((v) => !v)}
                resultsCount={results.length}
                historyCount={results.length}
                totalPoints={totalPoints}
              />
            </div>
          )}
        </div>
      </main>

      <ToolBreadcrumbs />
          {seoIntro}
      {seoSections}

      <GameSelectionDialog
        showGames={showGames}
        setShowGames={setShowGames}
        gameStats={gameStats}
        gameMode={gameMode}
        setGameMode={setGameMode}
        enabledItems={enabledItems}
        createBingoCard={createBingoCard}
        startMemoryChallenge={startMemoryChallenge}
        startCollectionRace={startCollectionRace}
        startSequenceMatch={startSequenceMatch}
        resetGame={resetGame}
      />
      <TitleModal
        showTitleModal={showTitleModal}
        setShowTitleModal={setShowTitleModal}
        wheelTitle={wheelTitle}
        setWheelTitle={setWheelTitle}
        wheelDescription={wheelDescription}
        setWheelDescription={setWheelDescription}
      />
      <ResultsDialog
        showResults={showResults}
        setShowResults={setShowResults}
        results={results}
        currentTool={currentTool}
      />

      <ThemeSelector
        themes={themes}
        currentTheme={wheelTheme}
        onThemeChange={applyTheme}
        isVisible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      <PickerWheelAnalyticsDisplay
        analytics={imageAnalytics}
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      <PickerWheelSocialHub
        isVisible={showSocialHub}
        onClose={() => setShowSocialHub(false)}
        onShareWheel={shareResult}
      />

      <AchievementsDisplay
        achievements={enhancedAchievements}
        totalSpins={results.length}
        results={{ yes: results.length, no: 0, maybe: 0 }}
        streak={imageStreak}
        activeTab="manual"
        isVisible={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <ChallengesDisplay
        challenges={challenges}
        totalSpins={results.length}
        results={{ yes: results.length, no: 0, maybe: 0 }}
        streak={imageStreak}
        activeTab="manual"
        isVisible={showChallenges}
        onClose={() => setShowChallenges(false)}
      />

      <Footer />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

export default function ImagePickerWheelApp(props: ImagePickerWheelAppProps) {
  return (
    <SettingsProvider>
      <ToastProvider>
        <InnerImagePickerWheelPage {...props} />
      </ToastProvider>
    </SettingsProvider>
  )
}
