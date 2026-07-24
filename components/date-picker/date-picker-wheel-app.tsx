"use client"

import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  RotateCcw,
  Share2,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Download,
  X,
  Sparkles,
  Palette,
  BarChart3,
  Users,
  Gamepad2,
  Trophy,
} from "lucide-react"
import { format, eachDayOfInterval, parse, isValid, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import Header from "@/components/header"
import ToolBreadcrumbs from "@/components/tool-breadcrumbs"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useSettings } from "@/contexts/settings-context"
import Confetti from "react-confetti"
import { cn } from "@/lib/utils"
import { DATE_PICKER_SHORT_TITLE } from "@/lib/date-picker-seo"
import {
  buildDatePresetEntries,
  getDatePickerUseCase,
  type DatePickerUseCaseId,
} from "@/lib/date-picker-use-cases"
import type { DatePickerDeepLink } from "@/lib/date-picker-spokes"
import { DatePickerPopularWheels } from "@/components/date-picker/date-picker-popular-wheels"
import { DatePickerSidebar } from "@/components/date-picker/date-picker-sidebar"
import { ThemeSelector } from "@/components/yes-no-picker-wheel/theme-selector"
import {
  AchievementsDisplay,
  type Achievement,
} from "@/components/yes-no-picker-wheel/achievements-display"
import { ChallengesDisplay } from "@/components/yes-no-picker-wheel/challenges-display"
import { GameSelectionDialog } from "@/components/image-picker/game-selection-dialog"
import { BingoCard } from "@/components/image-picker/games/bingo-card"
import { MemoryChallenge } from "@/components/image-picker/games/memory-challenge"
import { SequenceMatch } from "@/components/image-picker/games/sequence-match"
import { GameStatusBar } from "@/components/image-picker/games/game-status-bar"
import { useGameModes } from "@/hooks/use-game-modes"
import { initializeAchievements, checkAchievements } from "@/lib/achievement-system"
import { initializeChallenges, checkChallenges, type Challenge } from "@/lib/decision-challenges"
import { WHEEL_THEMES, type WheelTheme, checkThemeUnlocks } from "@/lib/wheel-themes"
import {
  analyzeSpinData,
  type SpinRecord as AnalyticsSpinRecord,
} from "@/lib/picker-wheel-analytics"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { WheelCanvas, resolveNumberFromRotation } from "@/components/wheel-canvas"
import type { WheelItem } from "@/lib/types"

const WHEEL_SIZE = 680

interface DateEntry {
  id: string
  date: Date
  formatted: string
}

interface DateRangeEntry {
  id: string
  from: Date
  to: Date
  label: string
  dates: DateEntry[]
}

interface SpinResult {
  date: string
  timestamp: Date
  eliminated: boolean
  wheelName: string
}

interface DateWheelData {
  singleDates: DateEntry[]
  dateRanges: DateRangeEntry[]
  allDates: DateEntry[]
  selectedDays: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  dateFormat: string
  wheelTitle: string
  wheelDescription: string
  resultTitle: string
  totalSpins: number
  lastResult: any
  recentResults: any[]
  spinHistory: SpinResult[]
  currentResult: string | null
}

type DatePickerWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: DatePickerDeepLink
}

function InnerDatePickerWheelPage({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: DatePickerWheelAppProps) {
  // Global settings and stores
  const [showSettings, setShowSettings] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const { settings, loadFromDatabase: loadSettings, updateSettings } = useSettingsStore()
  const { getCurrentWheel, updateWheelData, setCurrentTool, createNewWheel, currentWheelId, globalSpinHistory, addToGlobalSpinHistory, clearGlobalSpinHistory } = useWheelManagerStore()
  const { settings: globalSettings, updateSettings: updateLocalSettings } = useSettings()
  const prevWheelId = useRef<string | null>(null)
  const skipNextSaveRef = useRef(false)
  const deepLinkAppliedRef = useRef(false)
  const isSpinningRef = useRef(false)
  const wheelRotationRef = useRef(0)
  const finalRotationRef = useRef(0)
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const spinAudioRef = useRef<SpinAudioController | null>(null)
  const pendingWinnerRef = useRef<{ index: number; dateId: string; formatted: string } | null>(null)
  const finishSpinRef = useRef<() => void>(() => {})
  const allDatesRef = useRef<DateEntry[]>([])

  // Local state
  const [dateFormat, setDateFormat] = useState("30/10/2022")
  const [singleDates, setSingleDates] = useState<DateEntry[]>([])
  const [dateRanges, setDateRanges] = useState<DateRangeEntry[]>([])
  const [allDates, setAllDates] = useState<DateEntry[]>([])
  const [selectedDays, setSelectedDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  })
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentResult, setCurrentResult] = useState<string | null>(null)
  const [spinHistory, setSpinHistory] = useState<SpinResult[]>([])
  const [actionMode, setActionMode] = useState<"normal" | "elimination">("normal")

  // Keep Action Mode ↔ Manage/Header "Remove winner" in sync
  useEffect(() => {
    const wantElimination = !!settings.spinBehavior?.removeWinnerAfterSpin
    setActionMode((current) => {
      const next = wantElimination ? "elimination" : "normal"
      return current === next ? current : next
    })
  }, [settings.spinBehavior?.removeWinnerAfterSpin])

  const handleActionModeChange = useCallback(
    (mode: "normal" | "elimination") => {
      setActionMode(mode)
      const latest = useSettingsStore.getState().settings
      updateSettings({
        spinBehavior: {
          ...latest.spinBehavior,
          removeWinnerAfterSpin: mode === "elimination",
        },
      })
    },
    [updateSettings],
  )
  const [showTitle, setShowTitle] = useState(false)
  const [wheelTitle, setWheelTitle] = useState("")
  const [wheelDescription, setWheelDescription] = useState("")
  const [resultTitle, setResultTitle] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mysteryResultRevealed, setMysteryResultRevealed] = useState(true)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [activeUseCaseId, setActiveUseCaseId] = useState<DatePickerUseCaseId | null>(
    deepLink?.preset ?? null,
  )
  const [activePaletteColors, setActivePaletteColors] = useState<string[] | null>(null)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showChallenges, setShowChallenges] = useState(false)
  const [showGames, setShowGames] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [enhancedAchievements, setEnhancedAchievements] = useState<Achievement[]>(() =>
    initializeAchievements([]),
  )
  const [challenges, setChallenges] = useState<Challenge[]>(() => initializeChallenges([]))
  const [dateStreak, setDateStreak] = useState<{ type: string; count: number }>({
    type: "",
    count: 0,
  })
  const [recentResultLabels, setRecentResultLabels] = useState<string[]>([])
  const [decisionDates, setDecisionDates] = useState<Date[]>([])
  const [selectedGameItem, setSelectedGameItem] = useState<WheelItem | null>(null)
  const [wheelTheme, setWheelTheme] = useState("default")
  const [themes, setThemes] = useState<WheelTheme[]>(WHEEL_THEMES)
  const [usedThemes, setUsedThemes] = useState<string[]>(["default"])

  const soundGloballyOff = settings.confettiSound?.enableSound === false
  const mysterySpin = !!settings.spinBehavior?.mysterySpin
  const mysteryResult = !!settings.spinBehavior?.mysteryResult

  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [isRangeMode, setIsRangeMode] = useState(false)

  const [inputMode, setInputMode] = useState<"manual" | "ai">("manual")
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Switch wheel functionality
  useEffect(() => {
    setCurrentTool("date-picker-wheel")
    void loadSettings()
    if (typeof window !== "undefined") {
      const wheel = getCurrentWheel()
      if (!wheel) {
        createNewWheel("date-picker-wheel", "My Date Picker Wheel")
      }
    }
  }, [setCurrentTool, getCurrentWheel, createNewWheel, loadSettings])

  useEffect(() => {
    wheelRotationRef.current = wheelRotation
  }, [wheelRotation])

  useEffect(() => {
    allDatesRef.current = allDates
  }, [allDates])

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
      spinAudioRef.current?.stop()
    }
  }, [])

  // Restore Style palette from Header Settings when available
  useEffect(() => {
    const colors = settings.appearance?.toolColors
    if (Array.isArray(colors) && colors.length > 0 && !activePaletteColors) {
      setActivePaletteColors(colors)
    }
  }, [settings.appearance?.toolColors]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSoundEnabled(settings.confettiSound?.enableSound !== false)
  }, [settings.confettiSound?.enableSound])

  const applySoundEnabled = useCallback(
    (enabled: boolean) => {
      setSoundEnabled(enabled)
      const latest = useSettingsStore.getState().settings
      updateSettings({
        confettiSound: {
          ...latest.confettiSound,
          enableSound: enabled,
        },
      })
      updateLocalSettings({
        confettiSound: {
          ...globalSettings.confettiSound,
          enableSound: enabled,
        },
      })
    },
    [updateSettings, updateLocalSettings, globalSettings.confettiSound],
  )

  // Unified sync for all wheel data
  const syncWheelData = useCallback((data: Partial<DateWheelData>) => {
    const wheel = getCurrentWheel()
    if (wheel) {
      updateWheelData("date-picker-wheel", wheel.id, data)
    }
  }, [getCurrentWheel, updateWheelData])

  // Load wheel data when My Wheels selection changes (single source of truth)
  useEffect(() => {
    if (!currentWheelId) return
    const wheel = getCurrentWheel()
    if (!wheel || wheel.id !== currentWheelId) return

    // Skip redundant reload of the same wheel
    if (prevWheelId.current === wheel.id) return
    prevWheelId.current = wheel.id
    skipNextSaveRef.current = true

    // Reset transient spin UI
    setCurrentResult(null)
    setIsSpinning(false)
    isSpinningRef.current = false
    setWheelRotation(0)
    wheelRotationRef.current = 0

    if (wheel.data && Object.keys(wheel.data).length > 0) {
      const data = wheel.data as DateWheelData

      const hasExistingData =
        (data.singleDates && data.singleDates.length > 0) ||
        (data.dateRanges && data.dateRanges.length > 0) ||
        (data.allDates && data.allDates.length > 0)

      if (hasExistingData) {
        setSingleDates(data.singleDates || [])
        setDateRanges(data.dateRanges || [])
        setAllDates(data.allDates || [])
        setSelectedDays(
          data.selectedDays || {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          },
        )
        setDateFormat(data.dateFormat || "30/10/2022")
        setWheelTitle(data.wheelTitle || "")
        setWheelDescription(data.wheelDescription || "")
        setResultTitle(data.resultTitle || "")
        setSpinHistory(data.spinHistory || [])
        setCurrentResult(data.currentResult || null)
        if (!deepLink?.preset) setActiveUseCaseId(null)
      } else if (deepLink?.preset) {
        setDateRanges([])
        setSpinHistory(data.spinHistory || [])
        setCurrentResult(null)
      } else {
        const defaultDates = generateDefaultDates()
        setSingleDates(defaultDates)
        setDateRanges([])
        setAllDates([])
        setSelectedDays(
          data.selectedDays || {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          },
        )
        setDateFormat(data.dateFormat || "30/10/2022")
        setWheelTitle(data.wheelTitle || "")
        setWheelDescription(data.wheelDescription || "")
        setResultTitle(data.resultTitle || "")
        setSpinHistory(data.spinHistory || [])
        setCurrentResult(data.currentResult || null)
        setActiveUseCaseId(null)
      }
    } else if (deepLink?.preset) {
      setDateRanges([])
      setSpinHistory([])
      setCurrentResult(null)
    } else {
      const defaultDates = generateDefaultDates()
      setSingleDates(defaultDates)
      setDateRanges([])
      setAllDates([])
      setSelectedDays({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      })
      setDateFormat("30/10/2022")
      setWheelTitle("")
      setWheelDescription("")
      setResultTitle("")
      setSpinHistory([])
      setCurrentResult(null)
      setActiveUseCaseId(null)
    }
  }, [getCurrentWheel, currentWheelId, deepLink?.preset])

  // Persist wheel data when dates / results change (skip the load tick)
  useEffect(() => {
    const wheel = getCurrentWheel()
    if (!wheel || wheel.id !== currentWheelId) return
    if (prevWheelId.current !== wheel.id) return
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }

    syncWheelData({
      singleDates,
      dateRanges,
      allDates,
      selectedDays,
      dateFormat,
      wheelTitle,
      wheelDescription,
      resultTitle,
      totalSpins: spinHistory.length,
      lastResult: currentResult,
      recentResults: spinHistory.slice(-10),
      spinHistory,
      currentResult,
    })
  }, [
    singleDates,
    dateRanges,
    allDates,
    selectedDays,
    dateFormat,
    wheelTitle,
    wheelDescription,
    resultTitle,
    spinHistory,
    currentResult,
    currentWheelId,
    syncWheelData,
    getCurrentWheel,
  ])


  // Date format options
  const dateFormats = [
    "October 30, 2022",
    "10/30/2022",
    "10-30-2022",
    "Sunday, October 30, 2022",
    "30/10/2022",
    "30-10-2022",
    "30 October 2022",
    "Sunday, 30 October 2022",
  ]

  const dateFormatOptions = [
    { value: "October 30, 2022", label: "October 30, 2022" },
    { value: "10/30/2022", label: "10/30/2022" },
    { value: "10-30-2022", label: "10-30-2022" },
    { value: "Sunday, October 30, 2022", label: "Sunday, October 30, 2022" },
    { value: "30/10/2022", label: "30/10/2022" },
    { value: "30-10-2022", label: "30-10-2022" },
    { value: "30 October 2022", label: "30 October 2022" },
    { value: "Sunday, 30 October 2022", label: "Sunday, 30 October 2022" },
  ]

  // Generate default dates (current date to next 8 days)
  const generateDefaultDates = () => {
    const defaultDates: DateEntry[] = []
    const today = new Date()
    
    for (let i = 0; i < 9; i++) { // 9 days total (today + 8 next days)
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      if (shouldIncludeDate(date)) {
        defaultDates.push({
          id: Math.random().toString(36).substr(2, 9),
          date,
          formatted: formatDate(date, dateFormat),
        })
      }
    }
    
    return defaultDates
  }

  // Format date according to selected format
  const formatDate = (date: Date, formatType: string) => {
    switch (formatType) {
      case "October 30, 2022":
        return format(date, "MMMM d, yyyy")
      case "10/30/2022":
        return format(date, "MM/dd/yyyy")
      case "10-30-2022":
        return format(date, "MM-dd-yyyy")
      case "Sunday, October 30, 2022":
        return format(date, "EEEE, MMMM d, yyyy")
      case "30/10/2022":
        return format(date, "dd/MM/yyyy")
      case "30-10-2022":
        return format(date, "dd-MM-yyyy")
      case "30 October 2022":
        return format(date, "d MMMM yyyy")
      case "Sunday, 30 October 2022":
        return format(date, "EEEE, d MMMM yyyy")
      default:
        return format(date, "dd/MM/yyyy")
    }
  }

  // Check if date should be included based on day of week
  const shouldIncludeDate = (date: Date) => {
    const dayOfWeek = format(date, "EEEE").toLowerCase()
    return selectedDays[dayOfWeek as keyof typeof selectedDays]
  }

  const applyUseCasePreset = useCallback(
    (id: DatePickerUseCaseId) => {
      const useCase = getDatePickerUseCase(id)
      if (!useCase || isSpinningRef.current) return

      const entries = buildDatePresetEntries(useCase.config).map(({ date }) => ({
        id: Math.random().toString(36).substr(2, 9),
        date,
        formatted: formatDate(date, dateFormat),
      }))

      setActiveUseCaseId(id)
      setSelectedDays({ ...useCase.config.selectedDays })
      setDateRanges([])
      setSingleDates(entries)
      setAllDates(entries)
      setWheelTitle(useCase.config.toolTitle)
      setWheelDescription(useCase.config.toolDescription)
      setShowTitle(true)
      setCurrentResult(null)
      setSpinHistory([])
    },
    [dateFormat],
  )

  const applyPalette = useCallback(
    (colors: string[]) => {
      if (!colors.length) return
      setActivePaletteColors(colors)
      const latest = useSettingsStore.getState().settings
      updateSettings({
        appearance: {
          ...latest.appearance,
          toolColors: colors,
        },
      })
    },
    [updateSettings],
  )

  const applyTheme = useCallback(
    (themeId: string) => {
      const theme = themes.find((t) => t.id === themeId)
      if (!theme) return
      setWheelTheme(themeId)
      if (!usedThemes.includes(themeId)) {
        setUsedThemes((prev) => [...prev, themeId])
      }
      applyPalette([theme.colors.yes, theme.colors.no, theme.colors.maybe])
    },
    [themes, usedThemes, applyPalette],
  )

  const dateWheelItems: WheelItem[] = useMemo(
    () =>
      allDates.map((d) => ({
        id: d.id,
        text: d.formatted,
        enabled: true,
        count: 0,
      })),
    [allDates],
  )

  const dateCanvasItems = useMemo(() => {
    const colors =
      activePaletteColors && activePaletteColors.length > 0
        ? activePaletteColors
        : settings.appearance?.toolColors?.length
          ? settings.appearance.toolColors
          : ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316", "#ec4899"]
    return allDates.map((d, i) => ({
      id: d.id,
      value: d.formatted,
      color: colors[i % colors.length],
    }))
  }, [allDates, activePaletteColors, settings.appearance?.toolColors])

  const wheelCanvasSettings = useMemo(
    () => ({
      ...settings,
      appearance: {
        ...settings.appearance,
        toolColors:
          activePaletteColors && activePaletteColors.length > 0
            ? activePaletteColors
            : settings.appearance?.toolColors,
      },
      spinBehavior: {
        ...settings.spinBehavior,
        mysterySpin,
      },
    }),
    [settings, activePaletteColors, mysterySpin],
  )

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
    setGameStats,
    createBingoCard,
    startMemoryChallenge,
    startCollectionRace,
    startSequenceMatch,
    handleGameSpin,
    resetGame,
  } = useGameModes({
    enabledItems: dateWheelItems,
    selectedItem: selectedGameItem,
    setSelectedItem: setSelectedGameItem,
  })

  const shareResult = async () => {
    const text = currentResult
      ? `I just got "${currentResult}" on the Date Picker Wheel! 📅`
      : `Try the Date Picker Wheel — spin a fair random date! ${typeof window !== "undefined" ? window.location.href : ""}`
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ text, title: "Date Picker Wheel" })
        return
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      }
    } catch {
      // ignore cancel
    }
  }

  const dateAnalytics = useMemo(
    () =>
      analyzeSpinData(
        spinHistory.map(
          (r, i): AnalyticsSpinRecord => ({
            id: `${r.date}-${i}-${r.timestamp.getTime()}`,
            timestamp: decisionDates[i] || r.timestamp,
            result: r.date,
            options: allDates.map((d) => d.formatted),
            mode: "manual",
            theme: wheelTheme,
            spinDuration:
              Math.max(0.5, settings.spinBehavior?.spinningDuration || 10) * 1000,
          }),
        ),
      ),
    [spinHistory, decisionDates, allDates, wheelTheme, settings.spinBehavior?.spinningDuration],
  )

  useEffect(() => {
    const { updatedThemes } = checkThemeUnlocks(
      themes,
      spinHistory.length,
      { yes: spinHistory.length, no: 0, maybe: 0 },
      usedThemes,
      totalPoints,
      challenges.filter((c) => c.completed).length,
    )
    setThemes(updatedThemes)
  }, [spinHistory.length, usedThemes, totalPoints, challenges]) // eslint-disable-line react-hooks/exhaustive-deps

  // Spoke pages: apply dedicated date template after the wheel is ready
  useEffect(() => {
    if (!deepLink?.preset || deepLinkAppliedRef.current || isSpinningRef.current) return
    if (!currentWheelId) return
    deepLinkAppliedRef.current = true
    applyUseCasePreset(deepLink.preset)
    if (deepLink.toolTitle) setWheelTitle(deepLink.toolTitle)
    if (deepLink.toolDescription) setWheelDescription(deepLink.toolDescription)
  }, [deepLink, currentWheelId, applyUseCasePreset])

  // Add single date
  const addSingleDate = (date: Date) => {
    if (!shouldIncludeDate(date)) return

    const newDate: DateEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date,
      formatted: formatDate(date, dateFormat),
    }

    setSingleDates((prev) => [...prev, newDate])
  }

  // Add date range
  const addDateRange = (from: Date, to: Date) => {
    const datesInRange = eachDayOfInterval({ start: from, end: to })
    const validDates = datesInRange.filter(shouldIncludeDate)

    if (validDates.length === 0) return

    const dateEntries: DateEntry[] = validDates.map((date) => ({
      id: Math.random().toString(36).substr(2, 9),
      date,
      formatted: formatDate(date, dateFormat),
    }))

    const rangeEntry: DateRangeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      from,
      to,
      label: `${formatDate(from, dateFormat)} - ${formatDate(to, dateFormat)}`,
      dates: dateEntries,
    }

    setDateRanges((prev) => [...prev, rangeEntry])
  }

  // Remove single date
  const removeSingleDate = (id: string) => {
    setSingleDates((prev) => prev.filter((date) => date.id !== id))
  }

  // Remove date range
  const removeDateRange = (id: string) => {
    setDateRanges((prev) => prev.filter((range) => range.id !== id))
  }

  // Clear all dates
  const clearAllDates = () => {
    setSingleDates([])
    setDateRanges([])
  }

  const dayKey = (date: Date) => startOfDay(date).getTime()

  const shuffleArray = <T,>(items: T[]): T[] => {
    const next = [...items]
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    return next
  }

  const sortDatesZA = () => {
    setSingleDates((prev) =>
      [...prev].sort((a, b) =>
        b.formatted.localeCompare(a.formatted, undefined, { sensitivity: "base" }),
      ),
    )
    setDateRanges((prev) =>
      [...prev]
        .map((range) => ({
          ...range,
          dates: [...range.dates].sort((a, b) =>
            b.formatted.localeCompare(a.formatted, undefined, { sensitivity: "base" }),
          ),
        }))
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }) * -1),
    )
  }

  const shuffleDates = () => {
    setSingleDates((prev) => shuffleArray(prev))
    setDateRanges((prev) =>
      shuffleArray(prev).map((range) => ({
        ...range,
        dates: shuffleArray(range.dates),
      })),
    )
  }

  const removeDuplicateDates = () => {
    const seen = new Set<number>()
    setSingleDates((prev) =>
      prev.filter((entry) => {
        const key = dayKey(entry.date)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }),
    )
    setDateRanges((prev) =>
      prev
        .map((range) => ({
          ...range,
          dates: range.dates.filter((entry) => {
            const key = dayKey(entry.date)
            if (seen.has(key)) return false
            seen.add(key)
            return true
          }),
        }))
        .filter((range) => range.dates.length > 0),
    )
  }

  const parseImportedDate = (line: string): Date | null => {
    const trimmed = line.trim()
    if (!trimmed) return null

    const patterns = [
      "MMMM d, yyyy",
      "MM/dd/yyyy",
      "MM-dd-yyyy",
      "EEEE, MMMM d, yyyy",
      "dd/MM/yyyy",
      "dd-MM-yyyy",
      "d MMMM yyyy",
      "EEEE, d MMMM yyyy",
      "yyyy-MM-dd",
      "M/d/yyyy",
      "d/M/yyyy",
    ]

    for (const pattern of patterns) {
      const parsed = parse(trimmed, pattern, new Date())
      if (isValid(parsed)) return startOfDay(parsed)
    }

    const native = new Date(trimmed)
    if (isValid(native) && !Number.isNaN(native.getTime())) return startOfDay(native)
    return null
  }

  const importDatesFromText = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) return

    const next: DateEntry[] = []
    const seen = new Set<number>()
    for (const line of lines) {
      const date = parseImportedDate(line)
      if (!date || !shouldIncludeDate(date)) continue
      const key = dayKey(date)
      if (seen.has(key)) continue
      seen.add(key)
      next.push({
        id: Math.random().toString(36).substr(2, 9),
        date,
        formatted: formatDate(date, dateFormat),
      })
    }
    if (next.length === 0) return
    setSingleDates(next)
    setDateRanges([])
    setInputMode("manual")
  }

  const resetSpinHistory = () => {
    setSpinHistory([])
  }

  const removeDate = (id: string) => {
    // Remove from single dates
    setSingleDates(prev => prev.filter(date => date.id !== id))
    // Remove from date ranges
    setDateRanges(prev => 
      prev.map(range => ({
        ...range,
        dates: range.dates.filter(date => date.id !== id)
      })).filter(range => range.dates.length > 0)
    )
  }

  // Handle day of week selection change
  const handleDaySelectionChange = (day: string, checked: boolean) => {
    setSelectedDays(prev => ({ ...prev, [day]: checked }))
    
    // Show feedback to user about filtering
    if (!checked) {
      const dayName = day.charAt(0).toUpperCase() + day.slice(1)
      console.log(`${dayName} dates will be filtered out from the wheel`)
    }
  }

  // Get preview of dates that would be affected by day filter
  const getFilteredDatesPreview = () => {
    const allDateEntries = [...singleDates, ...dateRanges.flatMap((range) => range.dates)]
    const includedDates = allDateEntries.filter(date => shouldIncludeDate(date.date))
    const excludedDates = allDateEntries.filter(date => !shouldIncludeDate(date.date))
    
    return { includedDates, excludedDates }
  }

  // Update all dates when single dates, ranges, or selected days change
  useEffect(() => {
    const allDateEntries: DateEntry[] = [...singleDates, ...dateRanges.flatMap((range) => range.dates)]
    // Filter dates based on selected days of the week
    const filteredDates = allDateEntries.filter(date => shouldIncludeDate(date.date))
    setAllDates(filteredDates)
  }, [singleDates, dateRanges, selectedDays])

  // Update date formats when format changes
  useEffect(() => {
    setSingleDates((prev) =>
      prev.map((date) => ({
        ...date,
        formatted: formatDate(date.date, dateFormat),
      })),
    )

    setDateRanges((prev) =>
      prev.map((range) => ({
        ...range,
        label: `${formatDate(range.from, dateFormat)} - ${formatDate(range.to, dateFormat)}`,
        dates: range.dates.map((date) => ({
          ...date,
          formatted: formatDate(date.date, dateFormat),
        })),
      })),
    )
  }, [dateFormat])

  const finishSpinWithWinner = (selectedDate: DateEntry) => {
    spinAudioRef.current?.stop()
    setCurrentResult(selectedDate.formatted)
    setSelectedGameItem({
      id: selectedDate.id,
      text: selectedDate.formatted,
      enabled: true,
      count: 0,
    })
    setIsSpinning(false)
    isSpinningRef.current = false

    const eliminate =
      actionMode === "elimination" ||
      !!useSettingsStore.getState().settings.spinBehavior?.removeWinnerAfterSpin

    const currentWheel = getCurrentWheel()
    const result: SpinResult = {
      date: selectedDate.formatted,
      timestamp: new Date(),
      eliminated: eliminate,
      wheelName: currentWheel?.name || "Unknown Wheel",
    }
    setSpinHistory((prev) => [result, ...prev])
    addToGlobalSpinHistory({
      date: selectedDate.formatted,
      timestamp: new Date(),
      eliminated: eliminate,
      wheelName: currentWheel?.name || "Unknown Wheel",
      toolType: "date-picker-wheel",
    })

    const label = selectedDate.formatted
    const nextRecent = [...recentResultLabels.slice(-9), label]
    const nextDates = [...decisionDates, new Date()]
    const nextStreak =
      dateStreak.type === label
        ? { type: label, count: dateStreak.count + 1 }
        : { type: label, count: 1 }
    const nextTotalSpins = spinHistory.length + 1
    const stubResults = { yes: nextTotalSpins, no: 0, maybe: 0 }

    setRecentResultLabels(nextRecent)
    setDecisionDates(nextDates)
    setDateStreak(nextStreak)
    handleGameSpin({
      id: selectedDate.id,
      text: selectedDate.formatted,
      enabled: true,
      count: 0,
    })
    setGameStats((prev) => ({ ...prev, totalSpins: prev.totalSpins + 1 }))

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

    if (eliminate && allDatesRef.current.length > 1) {
      const dateToRemove = selectedDate
      const singleDateIndex = singleDates.findIndex((d) => d.id === dateToRemove.id)
      if (singleDateIndex !== -1) {
        setSingleDates((prev) => prev.filter((d) => d.id !== dateToRemove.id))
      } else {
        setDateRanges((prev) =>
          prev
            .map((range) => ({
              ...range,
              dates: range.dates.filter((d) => d.id !== dateToRemove.id),
            }))
            .filter((range) => range.dates.length > 0),
        )
      }
    }

    const soundCfg = useSettingsStore.getState().settings.confettiSound
    const soundOn = soundCfg?.enableSound !== false && soundEnabled
    if (soundOn) {
      try {
        const audio = new Audio("/sound-win.mp3")
        audio.volume = soundCfg?.soundVolume || 0.5
        void audio.play()
      } catch {
        // ignore
      }
    }
    if (soundCfg?.enableConfetti !== false) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }

  const finishSpin = () => {
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current)
      spinTimeoutRef.current = null
    }

    const lockedRotation = finalRotationRef.current
    wheelRotationRef.current = lockedRotation
    setWheelRotation(lockedRotation)

    const pending = pendingWinnerRef.current
    pendingWinnerRef.current = null
    if (pending) {
      const selected =
        allDatesRef.current.find((d) => d.id === pending.dateId) ||
        allDatesRef.current[pending.index]
      if (selected) {
        finishSpinWithWinner(selected)
        return
      }
    }

    const resolved = resolveNumberFromRotation(lockedRotation, dateCanvasItems)
    if (!resolved) {
      setIsSpinning(false)
      isSpinningRef.current = false
      spinAudioRef.current?.stop()
      return
    }
    const selected = allDatesRef.current[resolved.index]
    if (selected) finishSpinWithWinner(selected)
    else {
      setIsSpinning(false)
      isSpinningRef.current = false
      spinAudioRef.current?.stop()
    }
  }
  finishSpinRef.current = finishSpin

  const spinWheel = () => {
    if (allDates.length === 0 || isSpinningRef.current) return

    isSpinningRef.current = true
    setIsSpinning(true)
    setCurrentResult(null)
    setMysteryResultRevealed(!useSettingsStore.getState().settings.spinBehavior?.mysteryResult)
    pendingWinnerRef.current = null

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

    const finalRotation = wheelRotationRef.current + 10 * 360 + Math.random() * 360
    finalRotationRef.current = finalRotation
    setWheelRotation(finalRotation)

    const resolved = resolveNumberFromRotation(finalRotation, dateCanvasItems)
    if (resolved) {
      const selected = allDates[resolved.index]
      if (selected) {
        pendingWinnerRef.current = {
          index: resolved.index,
          dateId: selected.id,
          formatted: selected.formatted,
        }
      }
    }

    const durationMs =
      Math.max(0.5, useSettingsStore.getState().settings.spinBehavior?.spinningDuration || 10) * 1000
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    spinTimeoutRef.current = setTimeout(() => {
      finishSpinRef.current()
    }, durationMs + 80)
  }

  const handleRotationFrame = (rotationDegrees: number, segmentCount: number) => {
    wheelRotationRef.current = rotationDegrees
    const soundCfg = useSettingsStore.getState().settings.confettiSound
    if (soundCfg?.enableSound === false || !soundEnabled || segmentCount <= 0) return
    try {
      if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
      spinAudioRef.current.syncFrame(
        rotationDegrees,
        segmentCount,
        soundCfg?.soundVolume || 0.5,
        null,
      )
    } catch {
      // ignore
    }
  }

  const handleCanvasSpinComplete = () => {
    finishSpinRef.current()
  }

  const handleManualStop = () => {
    const latest = useSettingsStore.getState().settings
    if (!latest.spinBehavior?.manuallyStop) return
    if (!isSpinningRef.current) return

    const stoppedAt = wheelRotationRef.current
    finalRotationRef.current = stoppedAt
    const resolved = resolveNumberFromRotation(stoppedAt, dateCanvasItems)
    if (resolved) {
      const selected = allDatesRef.current[resolved.index]
      if (selected) {
        pendingWinnerRef.current = {
          index: resolved.index,
          dateId: selected.id,
          formatted: selected.formatted,
        }
      }
    }
    finishSpinRef.current()
  }

  const manuallyStop = !!settings.spinBehavior?.manuallyStop
  const canClickSpin = !isSpinning || manuallyStop
  const handleSpinClick = () => {
    if (isSpinning) handleManualStop()
    else spinWheel()
  }

  // Generate dates using AI
  const generateAIDates = async (prompt: string) => {
    setIsGenerating(true)

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate contextual dates based on prompt
      const suggestions = generateDateSuggestions(prompt)
      const generatedDates: DateEntry[] = []

      suggestions.forEach((dateStr) => {
        try {
          const date = new Date(dateStr)
          if (!isNaN(date.getTime()) && shouldIncludeDate(date)) {
            generatedDates.push({
              id: Math.random().toString(36).substr(2, 9),
              date,
              formatted: formatDate(date, dateFormat),
            })
          }
        } catch (error) {
          console.error("Error parsing date:", dateStr)
        }
      })

      setSingleDates((prev) => [...prev, ...generatedDates])
      setAiPrompt("")
    } catch (error) {
      console.error("Error generating dates:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate date suggestions based on prompt
  const generateDateSuggestions = (prompt: string): string[] => {
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1

    const promptLower = prompt.toLowerCase()

    if (promptLower.includes("holiday") || promptLower.includes("christmas")) {
      return [
        `${currentYear}-12-25`,
        `${nextYear}-12-25`,
        `${currentYear}-12-24`,
        `${currentYear}-01-01`,
        `${nextYear}-01-01`,
      ]
    }

    if (promptLower.includes("summer") || promptLower.includes("vacation")) {
      return [
        `${currentYear}-06-15`,
        `${currentYear}-07-04`,
        `${currentYear}-07-15`,
        `${currentYear}-08-01`,
        `${currentYear}-08-15`,
      ]
    }

    if (promptLower.includes("weekend") || promptLower.includes("saturday") || promptLower.includes("sunday")) {
      const dates = []
      const today = new Date()
      for (let i = 0; i < 10; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        if (date.getDay() === 0 || date.getDay() === 6) {
          // Sunday or Saturday
          dates.push(date.toISOString().split("T")[0])
        }
      }
      return dates.slice(0, 5)
    }

    if (promptLower.includes("birthday") || promptLower.includes("anniversary")) {
      return [
        `${currentYear}-02-14`,
        `${currentYear}-05-15`,
        `${currentYear}-09-20`,
        `${currentYear}-11-10`,
        `${nextYear}-03-25`,
      ]
    }

    if (promptLower.includes("meeting") || promptLower.includes("work") || promptLower.includes("business")) {
      const dates = []
      const today = new Date()
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        if (date.getDay() >= 1 && date.getDay() <= 5) {
          // Monday to Friday
          dates.push(date.toISOString().split("T")[0])
        }
      }
      return dates.slice(0, 5)
    }

    // Default: generate random dates in the next 3 months
    const dates = []
    const today = new Date()
    for (let i = 0; i < 5; i++) {
      const randomDays = Math.floor(Math.random() * 90) + 1
      const date = new Date(today)
      date.setDate(today.getDate() + randomDays)
      dates.push(date.toISOString().split("T")[0])
    }
    return dates
  }

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-white" : "min-h-screen transition-colors duration-300"}
      style={isFullscreen ? {} : {
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
          width={window.innerWidth} 
          height={window.innerHeight} 
          numberOfPieces={400} 
          recycle={false} 
          style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1000 }} 
        />
      )}
      {!isFullscreen && <Header onOpenSettings={() => setShowSettings(true)} onOpenGames={() => setShowGames(true)} />}
      
      <main className={isFullscreen ? "h-full flex flex-col items-center justify-center p-4" : "w-full px-3 py-4 sm:px-6 sm:py-8 lg:px-8"}>
        {!isFullscreen && (
          <>
            <div className="mb-4 text-center">
              <ToolPageTitle
                title={
                  showTitle && wheelTitle
                    ? wheelTitle
                    : (shortTitle ?? DATE_PICKER_SHORT_TITLE)
                }
                toolType="date-picker-wheel"
              />
              <p className="text-gray-600">
                {showTitle && wheelDescription
                  ? wheelDescription
                  : (toolSubtitle ?? "Randomly select dates for your events and activities")}
              </p>
            </div>

            <DatePickerPopularWheels
              activeId={activeUseCaseId}
              onSelectPreset={applyUseCasePreset}
            />
            {activeUseCaseId && (
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className="bg-slate-800 text-white hover:bg-slate-800">
                  Template: {getDatePickerUseCase(activeUseCaseId)?.label}
                </Badge>
                <Badge variant="secondary">{allDates.length} dates on wheel</Badge>
              </div>
            )}
          </>
        )}

        <div className={isFullscreen ? "w-full max-w-4xl mx-auto" : "w-full"}>
          <div
            className={
              isFullscreen
                ? "flex flex-col items-center"
                : "mb-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8"
            }
          >
            {/* Wheel Section — white card shell matches Letter / Image */}
            <div
              className={
                isFullscreen
                  ? "fixed inset-0 z-50 flex w-full flex-col items-center justify-center overflow-auto bg-white p-4"
                  : `relative self-start overflow-x-hidden rounded-lg border bg-white p-3 shadow-sm sm:p-6 ${
                      showInputs ? "lg:col-span-2" : "lg:col-span-3"
                    }`
              }
            >
              {!isFullscreen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResults(true)}
                  className="absolute left-4 top-4 z-10 border-blue-500 bg-white px-3 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50"
                >
                  Results
                  {spinHistory.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {spinHistory.length}
                    </Badge>
                  )}
                </Button>
              )}

              <div
                className={
                  isFullscreen
                    ? "flex flex-col items-center space-y-6"
                    : "relative flex flex-col items-center space-y-4 pt-6"
                }
              >
                <div className="relative mx-auto flex w-full max-w-[680px] flex-col items-center">
                  <div
                    className="relative w-full max-w-[680px] cursor-pointer overflow-visible"
                    onClick={canClickSpin ? handleSpinClick : undefined}
                  >
                    <WheelCanvas
                      numbers={dateCanvasItems}
                      isSpinning={isSpinning}
                      settings={wheelCanvasSettings}
                      rotation={wheelRotation}
                      size={WHEEL_SIZE}
                      onRotationFrame={handleRotationFrame}
                      onSpinComplete={handleCanvasSpinComplete}
                    />

                    <div className="absolute bottom-4 left-4 z-20 flex flex-col space-y-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          applySoundEnabled(!soundEnabled)
                        }}
                        className="h-10 w-10 bg-white/90 p-0 shadow-md hover:bg-white"
                        title={
                          soundGloballyOff
                            ? "Global sound disabled"
                            : soundEnabled
                              ? "Mute"
                              : "Unmute"
                        }
                      >
                        {soundGloballyOff || !soundEnabled ? (
                          <VolumeX
                            className={`h-5 w-5 ${soundGloballyOff ? "text-gray-400" : ""}`}
                          />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsFullscreen(!isFullscreen)
                        }}
                        className="h-10 w-10 bg-white/90 p-0 shadow-md hover:bg-white"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? (
                          <Minimize className="h-5 w-5" />
                        ) : (
                          <Maximize className="h-5 w-5" />
                        )}
                      </Button>
                    </div>

                    {isSpinning && (
                      <div className="absolute right-4 top-4 z-20 animate-pulse rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
                        {manuallyStop ? "Click to Stop!" : "Spinning..."}
                      </div>
                    )}
                  </div>
                </div>

                {currentResult && !isSpinning && (
                  <div
                    className={`w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center shadow-lg ${
                      mysteryResult && !mysteryResultRevealed ? "cursor-pointer" : ""
                    }`}
                    onClick={() => {
                      if (mysteryResult && !mysteryResultRevealed) {
                        setMysteryResultRevealed(true)
                      }
                    }}
                  >
                    <h3 className="mb-2 text-lg font-semibold text-green-800">
                      {resultTitle || "Selected Date:"}
                    </h3>
                    <p className="text-2xl font-bold text-green-900">
                      {mysteryResult && !mysteryResultRevealed ? "?" : currentResult}
                    </p>
                    {mysteryResult && !mysteryResultRevealed && (
                      <p className="mt-2 text-xs text-green-700">Click to reveal result</p>
                    )}
                  </div>
                )}

                {isGameActive && gameMode !== "normal" && (
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-purple-300 bg-purple-100 p-2">
                    <Gamepad2 className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Playing: {gameMode}</span>
                  </div>
                )}

                <Button
                  onClick={handleSpinClick}
                  disabled={(!isSpinning && allDates.length === 0) || (isSpinning && !manuallyStop)}
                  className={`px-12 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl ${
                    settings.display?.spinButtonAnimation
                      ? "animate-pulse bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isSpinning ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>{manuallyStop ? "Click Wheel to Stop" : "Spinning..."}</span>
                    </div>
                  ) : (
                    "🎯 SPIN THE WHEEL"
                  )}
                </Button>

                {allDates.length === 0 && (
                  <p className="text-center text-gray-500">Add some dates to start spinning!</p>
                )}

                {settings.display?.showSpinCount !== false && (
                  <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>Total spin = {spinHistory.length}</span>
                      <RotateCcw className="h-4 w-4" />
                    </div>
                    {(() => {
                      const allDateEntries = [
                        ...singleDates,
                        ...dateRanges.flatMap((range) => range.dates),
                      ]
                      const filteredCount = allDateEntries.filter((date) =>
                        shouldIncludeDate(date.date),
                      ).length
                      const totalCount = allDateEntries.length
                      const excludedCount = totalCount - filteredCount
                      return (
                        excludedCount > 0 && (
                          <div className="mt-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-800">
                            Day filter active: {filteredCount}/{totalCount} dates
                          </div>
                        )
                      )
                    })()}
                  </div>
                )}

                {!isFullscreen && (
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
                      {spinHistory.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {spinHistory.length}
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
                      <Badge variant="secondary" className="ml-2 text-xs">
                        5
                      </Badge>
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
                )}
              </div>

              {gameMode !== "normal" && (
                <div className="mt-4">
                  <GameStatusBar
                    gameMode={gameMode}
                    gameTimer={gameTimer}
                    isGameActive={isGameActive}
                    bingoCard={bingoCard}
                    memoryChallenge={memoryChallenge}
                    collectionProgress={collectionProgress}
                    sequenceProgress={sequenceProgress}
                    sequenceTarget={sequenceTarget}
                    gameStats={gameStats}
                    enabledItems={dateWheelItems}
                    resetGame={resetGame}
                  />
                </div>
              )}
            </div>



            {/* Inputs Section — Inputs | Text | Style | Other Options */}
            {!isFullscreen && showInputs && (
              <div className="space-y-6 self-start lg:col-span-1">
                {gameMode === "bingo" && bingoCard && (
                  <BingoCard bingoCard={bingoCard} currentTool="date" />
                )}
                {gameMode === "memory" && memoryChallenge && (
                  <MemoryChallenge memoryChallenge={memoryChallenge} currentTool="date" />
                )}
                {gameMode === "sequence" && sequenceTarget.length > 0 && (
                  <SequenceMatch
                    sequenceTarget={sequenceTarget}
                    sequenceProgress={sequenceProgress}
                    currentTool="date"
                  />
                )}
                <DatePickerSidebar
                allDatesCount={allDates.length}
                singleDates={singleDates}
                dateRanges={dateRanges}
                dateFormats={dateFormats}
                dateFormat={dateFormat}
                setDateFormat={setDateFormat}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                handleDaySelectionChange={handleDaySelectionChange}
                shouldIncludeDate={shouldIncludeDate}
                actionMode={actionMode}
                onActionModeChange={handleActionModeChange}
                inputMode={inputMode}
                setInputMode={setInputMode}
                aiPrompt={aiPrompt}
                setAiPrompt={setAiPrompt}
                isGenerating={isGenerating}
                generateAIDates={generateAIDates}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
                isRangeMode={isRangeMode}
                setIsRangeMode={setIsRangeMode}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                addSingleDate={addSingleDate}
                addDateRange={addDateRange}
                removeSingleDate={removeSingleDate}
                removeDateRange={removeDateRange}
                clearAllDates={clearAllDates}
                resetSpinHistory={resetSpinHistory}
                wheelTitle={wheelTitle}
                setWheelTitle={setWheelTitle}
                wheelDescription={wheelDescription}
                setWheelDescription={setWheelDescription}
                resultTitle={resultTitle}
                setResultTitle={setResultTitle}
                showTitle={showTitle}
                setShowTitle={setShowTitle}
                resultsCount={spinHistory.length}
                onViewResults={() => setShowResults(true)}
                onOpenSettings={() => setShowSettings(true)}
                onToggleFullscreen={() => setIsFullscreen(true)}
                onHideInputs={() => setShowInputs(false)}
                onApplyPalette={applyPalette}
                activePaletteColors={activePaletteColors}
                onOpenThemes={() => setShowThemeSelector(true)}
                onSortZA={sortDatesZA}
                onShuffle={shuffleDates}
                onRemoveDuplicates={removeDuplicateDates}
                onImportText={importDatesFromText}
              />
              </div>
            )}
            {!isFullscreen && !showInputs && (
              <div className="flex justify-center lg:justify-start">
                <Button variant="outline" size="sm" onClick={() => setShowInputs(true)}>
                  Show Date Controls
                </Button>
              </div>
            )}
          </div>
        </div>

        <ThemeSelector
          themes={themes}
          currentTheme={wheelTheme}
          onThemeChange={applyTheme}
          isVisible={showThemeSelector}
          onClose={() => setShowThemeSelector(false)}
        />

        <PickerWheelAnalyticsDisplay
          analytics={dateAnalytics}
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
          totalSpins={spinHistory.length}
          results={{ yes: spinHistory.length, no: 0, maybe: 0 }}
          streak={dateStreak}
          activeTab="manual"
          isVisible={showAchievements}
          onClose={() => setShowAchievements(false)}
        />

        <ChallengesDisplay
          challenges={challenges}
          totalSpins={spinHistory.length}
          results={{ yes: spinHistory.length, no: 0, maybe: 0 }}
          streak={dateStreak}
          activeTab="manual"
          isVisible={showChallenges}
          onClose={() => setShowChallenges(false)}
        />

        <GameSelectionDialog
          showGames={showGames}
          setShowGames={setShowGames}
          gameStats={gameStats}
          gameMode={gameMode}
          setGameMode={setGameMode}
          enabledItems={dateWheelItems}
          createBingoCard={createBingoCard}
          startMemoryChallenge={startMemoryChallenge}
          startCollectionRace={startCollectionRace}
          startSequenceMatch={startSequenceMatch}
          resetGame={resetGame}
        />

        {/* Results Modal */}
        <Dialog open={showResults} onOpenChange={setShowResults}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Spin Results History</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {globalSpinHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No results yet. Start spinning!</p>
              ) : (
                globalSpinHistory.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.date}</span>
                        <span className="text-xs text-gray-500">({result.wheelName})</span>
                        <span className="text-xs text-blue-500">[{result.toolType}]</span>
                        {result.eliminated && (
                          <Badge variant="secondary" className="ml-2">
                            Eliminated
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{format(result.timestamp, "MMM d, HH:mm")}</span>
                  </div>
                ))
              )}
            </div>

                                <div className="flex justify-between pt-4 border-t">
                      <Button variant="outline" onClick={() => clearGlobalSpinHistory()} disabled={globalSpinHistory.length === 0}>
                        Clear All History
                      </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const text = globalSpinHistory
                      .map(
                        (r) =>
                          `${r.date}\t${format(r.timestamp, "yyyy-MM-dd HH:mm")}\t${r.wheelName}\t${r.toolType}${
                            r.eliminated ? "\teliminated" : ""
                          }`,
                      )
                      .join("\n")
                    const blob = new Blob([text || ""], { type: "text/plain;charset=utf-8" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "date-picker-results.txt"
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  disabled={globalSpinHistory.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" onClick={() => setShowResults(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


      </main>

      {!isFullscreen && (
        <>
          <ToolBreadcrumbs />
          {seoIntro}
          {seoSections}
          <Footer />
        </>
      )}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

export default function DatePickerWheelApp(props: DatePickerWheelAppProps) {
  return (
    <SettingsProvider>
      <ToastProvider>
        <InnerDatePickerWheelPage {...props} />
      </ToastProvider>
    </SettingsProvider>
  )
} 