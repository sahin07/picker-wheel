"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"
import { WheelDisplay } from "@/components/yes-no-picker-wheel/wheel-display"
import { ResultsDisplay } from "@/components/yes-no-picker-wheel/results-display"
import { TitleModal } from "@/components/yes-no-picker-wheel/title-modal"
import { YesNoPickerSidebar } from "@/components/yes-no-picker-wheel/yes-no-picker-sidebar"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useYesNoWheelStore } from "@/stores/yes-no-wheel-store"
import { useSettingsStore } from "@/stores/settings-store"
import { Sparkles, Palette, BarChart3, Users, Gamepad2, Trophy, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AchievementsDisplay, Achievement } from "@/components/yes-no-picker-wheel/achievements-display"
import { initializeAchievements, checkAchievements } from "@/lib/achievement-system"
import { ChallengesDisplay } from "@/components/yes-no-picker-wheel/challenges-display"
import { initializeChallenges, checkChallenges, type Challenge } from "@/lib/decision-challenges"
import { ThemeSelector } from "@/components/yes-no-picker-wheel/theme-selector"
import { WHEEL_THEMES, WheelTheme, checkThemeUnlocks } from "@/lib/wheel-themes"
import { SpinHistory, SpinRecord } from "@/components/yes-no-picker-wheel/spin-history"
import type { YesNoActionMode, YesNoOptionKey } from "@/components/yes-no-picker-wheel/yes-no-picker-sidebar"
import { YesNoPickerUseCases } from "@/components/yes-no-picker-wheel/yes-no-picker-use-cases"
import {
  getYesNoPickerUseCase,
  type YesNoPickerUseCaseId,
} from "@/lib/yes-no-picker-use-cases"
import type { YesNoPickerDeepLink } from "@/lib/yes-no-picker-spokes"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import PickerWheelGameModes from "@/components/picker-wheel-game-modes"
import {
  analyzeSpinData,
  type SpinRecord as AnalyticsSpinRecord,
} from "@/lib/picker-wheel-analytics"
import { resolveNumberFromRotation } from "@/components/wheel-canvas"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import type { YesNoCanvasItem } from "@/components/yes-no-picker-wheel/wheel-display"
import Confetti from "react-confetti"

export type YesNoPickerWheelProps = {
  /** Bump from Header → Games to open game modes */
  openGamesSignal?: number
  /** Bump to open achievements modal */
  openAchievementsSignal?: number
  /** Header / shared Settings panel opener */
  onOpenSettings?: () => void
  /** Spoke pages apply a one-shot preset on mount (canonical path, no query). */
  deepLink?: YesNoPickerDeepLink
}

export function YesNoPickerWheel({
  openGamesSignal = 0,
  openAchievementsSignal = 0,
  onOpenSettings,
  deepLink,
}: YesNoPickerWheelProps = {}) {
  const searchParams = useSearchParams()
  const lastUrlKeyRef = useRef<string>("")
  const deepLinkAppliedRef = useRef(false)
  const [isClient, setIsClient] = useState(false)
  const { settings: globalSettings, updateSettings } = useSettings()
  const { settings: localSettings, updateSettings: updateLocalSettings } = useSettingsStore()
  const { getCurrentWheel, updateWheelData, setCurrentTool, createNewWheel, currentWheelId } = useWheelManagerStore()
  const toolType = 'yes-no-picker-wheel';
  const prevWheelId = useRef<string | null>(null)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize enhanced achievements, challenges, themes, and spin history
  useEffect(() => {
    if (!isClient) return
    setEnhancedAchievements(initializeAchievements([]))
    setChallenges(initializeChallenges([]))
    setThemes(WHEEL_THEMES)
    setSpinHistory([])
  }, [isClient])

  // Initialize tool and wheel
  useEffect(() => {
    if (!isClient) return
    
    setCurrentTool("yes-no-picker-wheel")
    if (typeof window !== "undefined") {
      const wheel = getCurrentWheel()
      if (!wheel) {
        const newWheelId = createNewWheel("yes-no-picker-wheel", "Yes or No Wheel")
        console.log('Created new yes/no picker wheel with ID:', newWheelId)
        
        // Check the created wheel data
        setTimeout(() => {
          const createdWheel = getCurrentWheel()
          console.log('Created wheel data:', createdWheel?.data)
        }, 100)
      } else {
        console.log('Existing wheel found:', wheel.id, wheel.data)
      }
    }
  }, [setCurrentTool, getCurrentWheel, createNewWheel, isClient])

  // State management - use default values directly
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual")
  const [mode, setMode] = useState<"yes-no" | "yes-no-maybe">("yes-no")
  const [inputSets, setInputSets] = useState(1)
  const [userQuestion, setUserQuestion] = useState("")
  const [aiAdvice, setAiAdvice] = useState("")
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTitle, setShowTitle] = useState(true)
  const [actionMode, setActionMode] = useState<YesNoActionMode>("normal")
  const [eliminatedOptions, setEliminatedOptions] = useState<YesNoOptionKey[]>([])
  const [confettiEnabled, setConfettiEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(globalSettings.confettiSound.enableSound)
  const [wheelTheme, setWheelTheme] = useState("classic")
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Title and description state
  const [wheelTitle, setWheelTitle] = useState("Yes or No Picker Wheel")
  const [wheelDescription, setWheelDescription] = useState("Make decisions with a simple spin of the wheel")
  const [resultTitle, setResultTitle] = useState("Your decision")
  const [showTitleModal, setShowTitleModal] = useState(false)
  const [optionLabels, setOptionLabels] = useState({ yes: "YES", no: "NO", maybe: "MAYBE" })
  const [customColors, setCustomColors] = useState<{ yes: string; no: string; maybe: string } | null>(
    null,
  )

  // Results and statistics
  const [results, setResults] = useState({ yes: 0, no: 0, maybe: 0 })
  const [lastResult, setLastResult] = useState<string | null>(null)
  const [totalSpins, setTotalSpins] = useState(0)
  const [streak, setStreak] = useState({ type: "", count: 0 })
  const [achievements, setAchievements] = useState<string[]>([])
  const [aiContext, setAiContext] = useState("")

  // Enhanced Achievement System
  const [enhancedAchievements, setEnhancedAchievements] = useState<Achievement[]>([])
  const [showAchievements, setShowAchievements] = useState(false)
  const [recentResults, setRecentResults] = useState<string[]>([])
  const [decisionDates, setDecisionDates] = useState<Date[]>([])
  const [usedThemes, setUsedThemes] = useState<string[]>([])
  const [aiUsageCount, setAiUsageCount] = useState(0)

  // Decision Challenges System
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [showChallenges, setShowChallenges] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)

  // Theme System
  const [themes, setThemes] = useState<WheelTheme[]>(WHEEL_THEMES)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [newlyUnlockedThemes, setNewlyUnlockedThemes] = useState<string[]>([])

  // Spin History System
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [showSpinHistory, setShowSpinHistory] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [activeUseCaseId, setActiveUseCaseId] = useState<YesNoPickerUseCaseId | null>(null)

  // Header → Games / Achievements
  useEffect(() => {
    if (openGamesSignal > 0) setShowGameModes(true)
  }, [openGamesSignal])

  useEffect(() => {
    if (openAchievementsSignal > 0) setShowAchievements(true)
  }, [openAchievementsSignal])

  const openSettings = () => {
    if (onOpenSettings) onOpenSettings()
  }

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const isSpinningRef = useRef(false)
  const currentRotationRef = useRef(0)
  const finalRotationRef = useRef(0)
  const pendingWinnerRef = useRef<{ index: number; result: string } | null>(null)
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const spinAudioRef = useRef<SpinAudioController | null>(null)
  const finishSpinRef = useRef<() => void>(() => {})
  const canvasItemsRef = useRef<YesNoCanvasItem[]>([])
  const isUpdatingRef = useRef(false)

  // Temporarily disable wheel store updates to prevent infinite re-renders
  // useEffect(() => {
  //   if (!isClient || !wheelId || isUpdatingRef.current) return;
    
  //   const timeoutId = setTimeout(() => {
  //     wheelManager.updateWheelData(toolType, wheelId, {
  //       activeTab, mode, inputSets, userQuestion, aiAdvice, showStats, confettiEnabled,
  //       wheelTheme, results, lastResult, totalSpins, streak, achievements, aiContext, wheelTitle, wheelDescription
  //     });
  //   }, 100); // Debounce for 100ms
    
  //   return () => clearTimeout(timeoutId);
  // }, [activeTab, mode, inputSets, userQuestion, aiAdvice, showStats, confettiEnabled,
  //     wheelTheme, results, lastResult, totalSpins, streak, achievements, aiContext, wheelTitle, wheelDescription, wheelId, isClient]);

  // Load wheel data when switching wheels
  useEffect(() => {
    if (!isClient) return
    
    const wheel = getCurrentWheel()
    if (!wheel) return
    
    // Check if this is a different wheel (wheel switching)
    if (prevWheelId.current !== wheel.id) {
      console.log('Switching to yes/no wheel:', wheel.id, wheel.name, wheel.data)
      
      // Reset all states first
      setLastResult(null)
      setIsSpinning(false)
      setRotation(0)
      setHighlightIndex(null)
      setShowConfetti(false)
      isSpinningRef.current = false
      pendingWinnerRef.current = null
      currentRotationRef.current = 0
      finalRotationRef.current = 0
      
      if (wheel.data && Object.keys(wheel.data).length > 0) {
        const d = wheel.data as any;
        console.log('Loading wheel data:', d)
        
        setActiveTab(d.activeTab === "ai" ? "ai" : "manual");
        setMode(d.mode || "yes-no");
        setInputSets(d.inputSets || 1);
        setUserQuestion(d.userQuestion || "");
        setAiAdvice(d.aiAdvice || "");
        setShowStats(d.showStats || false);
        setConfettiEnabled(d.confettiEnabled ?? true);
        setWheelTheme(d.wheelTheme || "classic");
        setWheelTitle(d.wheelTitle || "Yes or No Picker Wheel");
        setWheelDescription(d.wheelDescription || "Make decisions with a simple spin of the wheel");
        setResultTitle(d.resultTitle || "Your decision");
        setActionMode(d.actionMode || "normal");
        setEliminatedOptions(d.eliminatedOptions || []);
        setOptionLabels(d.optionLabels || { yes: "YES", no: "NO", maybe: "MAYBE" });
        setResults(d.results || { yes: 0, no: 0, maybe: 0 });
        setLastResult(d.lastResult || null);
        setTotalSpins(d.totalSpins || 0);
        setStreak(d.streak || { type: "", count: 0 });
        setAchievements(d.achievements || []);
        setAiContext(d.aiContext || "");
        
        // Load enhanced achievement data
        setEnhancedAchievements(initializeAchievements(d.enhancedAchievements || []));
        setRecentResults(d.recentResults || []);
        setDecisionDates(d.decisionDates ? d.decisionDates.map((date: string) => new Date(date)) : []);
        setUsedThemes(d.usedThemes || []);
        setAiUsageCount(d.aiUsageCount || 0);
        
        // Load challenges data
        setChallenges(initializeChallenges(d.challenges || []));
        setTotalPoints(d.totalPoints || 0);
        
        // Load themes data
        setThemes(d.themes || WHEEL_THEMES);
        
        // Load spin history data
        setSpinHistory(d.spinHistory ? d.spinHistory.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        })) : []);
        
        console.log('Loaded existing wheel data for wheel:', wheel.id)
      } else {
        // Wheel exists but has no data, set defaults
        console.log('No data found for wheel:', wheel.id, 'setting defaults')
        
        setActiveTab("manual");
        setMode("yes-no");
        setInputSets(1);
        setUserQuestion("");
        setAiAdvice("");
        setShowStats(false);
        setConfettiEnabled(true);
        setWheelTheme("classic");
        setWheelTitle("Yes or No Picker Wheel");
        setWheelDescription("Make decisions with a simple spin of the wheel");
        setResults({ yes: 0, no: 0, maybe: 0 });
        setLastResult(null);
        setTotalSpins(0);
        setStreak({ type: "", count: 0 });
        setAchievements([]);
        setAiContext("");
        
        // Reset challenges data
        setChallenges(initializeChallenges([]));
        setTotalPoints(0);
        
        // Reset themes data
        setThemes(WHEEL_THEMES);
        
        console.log('Set default data for existing wheel with no data')
      }
      
      prevWheelId.current = wheel.id
    }
  }, [getCurrentWheel, currentWheelId, isClient])

  // Unified sync for all wheel data
  const syncWheelData = useCallback((data: any) => {
    const wheel = getCurrentWheel()
    if (wheel) {
      updateWheelData("yes-no-picker-wheel", wheel.id, data)
    }
  }, [getCurrentWheel, updateWheelData])

  const syncEliminationWithSettings = useCallback((enabled: boolean) => {
    setActionMode(enabled ? "elimination" : "normal")
    const latest = useSettingsStore.getState().settings
    updateLocalSettings({
      spinBehavior: {
        ...latest.spinBehavior,
        removeWinnerAfterSpin: enabled,
      },
    })
    if (!enabled) {
      setEliminatedOptions([])
    }
  }, [updateLocalSettings])

  const applyUseCasePreset = useCallback(
    (id: YesNoPickerUseCaseId, overrides?: Omit<YesNoPickerDeepLink, "mode">) => {
      const useCase = getYesNoPickerUseCase(id)
      if (!useCase || isSpinningRef.current) return

      const c = useCase.config
      setActiveUseCaseId(id)
      setShowInputs(true)
      setShowTitle(true)

      // Wheel behavior
      setMode(c.mode)
      setActiveTab(c.controlMode)
      setInputSets(c.inputSets)
      setOptionLabels({ ...c.optionLabels, ...overrides?.optionLabels })
      setWheelTitle(overrides?.toolTitle ?? c.toolTitle)
      setWheelDescription(overrides?.toolDescription ?? c.toolDescription)
      setResultTitle(overrides?.resultTitle ?? c.resultTitle)

      // Fresh spin state for the new mode
      setEliminatedOptions([])
      setLastResult(null)
      setHighlightIndex(null)
      setResults({ yes: 0, no: 0, maybe: 0 })
      setStreak({ type: "", count: 0 })
      setAiAdvice("")
      setAiContext("")
      if (c.controlMode !== "ai") {
        setUserQuestion("")
      }

      syncEliminationWithSettings(c.elimination)

      // Nudge wheel angle so the new slices are obviously loaded
      const nudge = (currentRotationRef.current + 15) % 360
      currentRotationRef.current = nudge
      finalRotationRef.current = nudge
      setRotation(nudge)
    },
    [syncEliminationWithSettings],
  )

  // Spoke deep link — apply once on mount (letter-spoke pattern)
  useEffect(() => {
    if (!isClient || !deepLink || deepLinkAppliedRef.current || isSpinningRef.current) return
    if (!getYesNoPickerUseCase(deepLink.mode)) return

    deepLinkAppliedRef.current = true
    const { mode, ...overrides } = deepLink
    applyUseCasePreset(mode, overrides)
  }, [isClient, deepLink, applyUseCasePreset])

  // Popular Yes/No Wheels / deep links: ?mode=date-night
  useEffect(() => {
    if (!isClient || isSpinningRef.current) return
    const key = searchParams.toString()
    if (!key || key === lastUrlKeyRef.current) return
    lastUrlKeyRef.current = key

    const mode = searchParams.get("mode") as YesNoPickerUseCaseId | null
    if (mode && getYesNoPickerUseCase(mode)) {
      applyUseCasePreset(mode)
    }
  }, [searchParams, isClient, applyUseCasePreset])

  // Keep Action Mode ↔ Manage/Header "Remove winner" in sync
  useEffect(() => {
    const wantElimination = !!localSettings.spinBehavior?.removeWinnerAfterSpin
    const wantMode: YesNoActionMode = wantElimination ? "elimination" : "normal"
    if (actionMode !== wantMode) {
      setActionMode(wantMode)
    }
  }, [localSettings.spinBehavior?.removeWinnerAfterSpin])

  // Escape exits fullscreen
  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFullscreen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isFullscreen])

  // Save wheel data whenever important state changes
  useEffect(() => {
    const wheel = getCurrentWheel()
    if (wheel && isClient) {
      const wheelData = {
        activeTab,
        mode,
        inputSets,
        userQuestion,
        aiAdvice,
        showStats,
        confettiEnabled,
        wheelTheme,
        results,
        lastResult,
        totalSpins,
        streak,
        achievements,
        aiContext,
        wheelTitle,
        wheelDescription,
        resultTitle,
        actionMode,
        eliminatedOptions,
        optionLabels,
        enhancedAchievements,
        recentResults,
        decisionDates: decisionDates.map(date => date.toISOString()),
        usedThemes,
        aiUsageCount,
        challenges,
        totalPoints,
        themes,
        spinHistory: spinHistory.map(record => ({
          ...record,
          timestamp: record.timestamp.toISOString()
        })),
      }
      
      console.log('Saving wheel data for wheel:', wheel.id, wheelData)
      console.log('Current wheel data before save:', wheel.data)
      syncWheelData(wheelData)
      
      // Verify the data was saved
      setTimeout(() => {
        const updatedWheel = getCurrentWheel()
        console.log('Wheel data after save:', updatedWheel?.data)
      }, 100)
    }
  }, [activeTab, mode, inputSets, userQuestion, aiAdvice, showStats, confettiEnabled,
      wheelTheme, results, lastResult, totalSpins, streak, achievements, aiContext, 
      wheelTitle, wheelDescription, resultTitle, actionMode, eliminatedOptions, optionLabels,
      enhancedAchievements, recentResults, decisionDates, 
      usedThemes, aiUsageCount, challenges, totalPoints, themes, spinHistory, syncWheelData, isClient])

  const resolveOptionKey = (label: string): YesNoOptionKey | null => {
    if (label === optionLabels.yes) return "yes"
    if (label === optionLabels.no) return "no"
    if (label === optionLabels.maybe) return "maybe"
    const lower = label.toLowerCase()
    if (lower === "yes") return "yes"
    if (lower === "no") return "no"
    if (lower === "maybe") return "maybe"
    return null
  }

  // Canvas wheel items (same style as letter/number WheelCanvas)
  const canvasItems = (() => {
    const currentTheme = themes.find((t) => t.id === wheelTheme) || themes[0]
    const themeColors = customColors ?? currentTheme.colors
    const unitKeys: YesNoOptionKey[] =
      mode === "yes-no" ? ["yes", "no"] : ["yes", "no", "maybe"]
    const eliminate =
      actionMode === "elimination" || !!localSettings.spinBehavior?.removeWinnerAfterSpin
    const activeKeys = eliminate
      ? unitKeys.filter((k) => !eliminatedOptions.includes(k))
      : unitKeys
    // Never revive eliminated options; empty wheel means round is over
    const keys = activeKeys
    const items: YesNoCanvasItem[] = []
    if (keys.length === 0) return items
    const total = Math.max(1, keys.length * inputSets)
    for (let i = 0; i < total; i++) {
      const key = keys[i % keys.length]
      items.push({
        id: `${key}-${i}`,
        key,
        value: optionLabels[key],
        weight: 1,
        color: themeColors[key],
      })
    }
    return items
  })()
  canvasItemsRef.current = canvasItems

  const unitKeysForMode: YesNoOptionKey[] =
    mode === "yes-no" ? ["yes", "no"] : ["yes", "no", "maybe"]
  const activeOptionCount = unitKeysForMode.filter((k) => !eliminatedOptions.includes(k)).length
  const activePaletteColors = customColors
    ? [customColors.yes, customColors.no, customColors.maybe]
    : null
  const manuallyStop = !!localSettings.spinBehavior?.manuallyStop

  // AI advice generation
  const generateAdvice = async () => {
    if (!userQuestion.trim()) return;

    setIsGeneratingAdvice(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const advice = `Based on your question "${userQuestion}", I've analyzed the situation and created a decision wheel with ${inputSets} set(s) of options. The wheel will help you make an informed decision by considering multiple perspectives.`;
      
      setAiAdvice(advice);
      setAiContext(advice);
    } catch (error) {
      console.error("Error generating AI advice:", error);
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  const finishSpinWithWinner = (result: string, index: number) => {
    spinAudioRef.current?.stop()
    isSpinningRef.current = false
    setIsSpinning(false)
    setHighlightIndex(index)

    const soundCfg = useSettingsStore.getState().settings.confettiSound
    const soundOn = soundCfg?.enableSound !== false && soundEnabled
    if (soundOn) {
      try {
        const audio = new Audio("/sound-win.mp3")
        audio.volume = soundCfg?.soundVolume ?? 0.5
        void audio.play()
      } catch {
        // ignore autoplay errors
      }
    }

    const confettiOn =
      (soundCfg?.enableConfetti !== false) && confettiEnabled
    if (confettiOn) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }

    const optionKey = resolveOptionKey(result)
    const nextResults = optionKey
      ? { ...results, [optionKey]: results[optionKey] + 1 }
      : results

    setLastResult(result)
    if (optionKey) {
      setResults(nextResults)
    }
    setTotalSpins((prev) => prev + 1)

    setStreak((prev) => {
      if (prev.type === result) {
        return { type: result, count: prev.count + 1 }
      }
      return { type: result, count: 1 }
    })

    const durationMs = Math.max(0.5, localSettings.spinBehavior?.spinningDuration || 10) * 1000
    const spinRecord: SpinRecord = {
      id: Date.now().toString(),
      timestamp: new Date(),
      result,
      rotation: finalRotationRef.current,
      duration: durationMs,
      mode,
      activeTab,
      userQuestion: userQuestion || undefined,
      aiAdvice: aiAdvice || undefined,
      wheelTheme,
      streak: { type: result, count: 1 },
      totalSpins: totalSpins + 1,
      results: nextResults,
    }
    setSpinHistory((prev) => [spinRecord, ...prev.slice(0, 99)])

    const eliminate =
      actionMode === "elimination" ||
      !!useSettingsStore.getState().settings.spinBehavior?.removeWinnerAfterSpin
    if (eliminate && optionKey) {
      const unitKeys: YesNoOptionKey[] =
        mode === "yes-no" ? ["yes", "no"] : ["yes", "no", "maybe"]
      const stillActive = unitKeys.filter((k) => !eliminatedOptions.includes(k))
      // Keep at least one option on the wheel
      if (stillActive.length > 1) {
        setEliminatedOptions((prev) => (prev.includes(optionKey) ? prev : [...prev, optionKey]))
      }
    }

    setRecentResults((prev) => [...prev.slice(-9), result])
    setDecisionDates((prev) => [...prev, new Date()])

    if (!usedThemes.includes(wheelTheme)) {
      setUsedThemes((prev) => [...prev, wheelTheme])
    }
    if (activeTab === "ai") {
      setAiUsageCount((prev) => prev + 1)
    }

    setEnhancedAchievements((prevAchievements) => {
      const { updatedAchievements } = checkAchievements(
        prevAchievements,
        totalSpins + 1,
        nextResults,
        { type: result, count: 1 },
        activeTab,
        [...recentResults.slice(-9), result],
        usedThemes.includes(wheelTheme) ? usedThemes : [...usedThemes, wheelTheme],
        [...decisionDates, new Date()],
      )
      return updatedAchievements
    })

    setChallenges((prevChallenges) => {
      const { updatedChallenges, totalPoints: newTotalPoints } = checkChallenges(
        prevChallenges,
        totalSpins + 1,
        nextResults,
        { type: result, count: 1 },
        activeTab,
        [...recentResults.slice(-9), result],
        aiUsageCount + (activeTab === "ai" ? 1 : 0),
        [...decisionDates, new Date()],
      )
      setTotalPoints(newTotalPoints)
      return updatedChallenges
    })

    setThemes((prevThemes) => {
      const { updatedThemes, newlyUnlocked } = checkThemeUnlocks(
        prevThemes,
        totalSpins + 1,
        nextResults,
        usedThemes.includes(wheelTheme) ? usedThemes : [...usedThemes, wheelTheme],
        totalPoints,
        challenges.filter((c) => c.completed).length,
      )
      if (newlyUnlocked.length > 0) setNewlyUnlockedThemes(newlyUnlocked)
      return updatedThemes
    })
  }

  const finishSpin = () => {
    if (!isSpinningRef.current) return
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current)
      spinTimeoutRef.current = null
    }

    const lockedRotation = finalRotationRef.current
    currentRotationRef.current = lockedRotation
    setRotation(lockedRotation)

    const pending = pendingWinnerRef.current
    pendingWinnerRef.current = null
    if (pending) {
      finishSpinWithWinner(pending.result, pending.index)
      return
    }

    const resolved = resolveNumberFromRotation(lockedRotation, canvasItemsRef.current)
    if (!resolved) {
      isSpinningRef.current = false
      setIsSpinning(false)
      spinAudioRef.current?.stop()
      return
    }
    finishSpinWithWinner(String(resolved.value), resolved.index)
  }
  finishSpinRef.current = finishSpin

  const spinWheel = () => {
    if (isSpinning || isSpinningRef.current || canvasItems.length === 0) return

    isSpinningRef.current = true
    setIsSpinning(true)
    setHighlightIndex(null)
    setLastResult(null)
    pendingWinnerRef.current = null

    if (localSettings.confettiSound?.enableSound !== false && soundEnabled) {
      try {
        if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
        spinAudioRef.current.startWhoosh(
          "/wheel-sound.mp3",
          localSettings.confettiSound.soundVolume || 0.5,
        )
      } catch {
        // ignore
      }
    }

    const baseRotation = localSettings.display?.randomInitialAngle ? Math.random() * 360 : 0
    const finalRotation =
      currentRotationRef.current + baseRotation + 10 * 360 + Math.random() * 360
    finalRotationRef.current = finalRotation
    setRotation(finalRotation)

    const resolved = resolveNumberFromRotation(finalRotation, canvasItems)
    if (resolved) {
      pendingWinnerRef.current = { index: resolved.index, result: String(resolved.value) }
    }

    const durationMs = Math.max(0.5, localSettings.spinBehavior?.spinningDuration || 10) * 1000
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    spinTimeoutRef.current = setTimeout(() => {
      finishSpinRef.current()
    }, durationMs + 80)
  }

  const handleManualStop = () => {
    if (!localSettings.spinBehavior?.manuallyStop) return
    if (!isSpinningRef.current) return
    const stoppedAt = currentRotationRef.current
    finalRotationRef.current = stoppedAt
    const resolved = resolveNumberFromRotation(stoppedAt, canvasItemsRef.current)
    if (resolved) {
      pendingWinnerRef.current = { index: resolved.index, result: String(resolved.value) }
    }
    finishSpinRef.current()
  }

  const handleRotationFrame = (rotationDegrees: number, segmentCount: number) => {
    currentRotationRef.current = rotationDegrees
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

  const onSpinAction = !isSpinning ? spinWheel : handleManualStop

  // Reset function
  const resetWheel = () => {
    setResults({ yes: 0, no: 0, maybe: 0 });
    setLastResult(null);
    setTotalSpins(0);
    setStreak({ type: "", count: 0 });
    setAchievements([]);
    setAiAdvice("");
    setAiContext("");
    setUserQuestion("");
    setRotation(0);
    currentRotationRef.current = 0
    finalRotationRef.current = 0
    setHighlightIndex(null);
    setEliminatedOptions([]);
    setOptionLabels({ yes: "YES", no: "NO", maybe: "MAYBE" });
    
    // Reset enhanced achievement data
    setEnhancedAchievements(initializeAchievements([]));
    setRecentResults([]);
    setDecisionDates([]);
    setUsedThemes([]);
    setAiUsageCount(0);
    
    // Reset challenges data
    setChallenges(initializeChallenges([]));
    setTotalPoints(0);
    
    // Reset themes data
    setThemes(WHEEL_THEMES);
    setNewlyUnlockedThemes([]);
    
    // Reset spin history data
    setSpinHistory([]);
    
    // Force save wheel data after reset
    setTimeout(() => {
      const wheel = getCurrentWheel()
      if (wheel && isClient) {
        const wheelData = {
          activeTab,
          mode,
          inputSets,
          userQuestion: "",
          aiAdvice: "",
          showStats,
          confettiEnabled,
          wheelTheme,
          results: { yes: 0, no: 0, maybe: 0 },
          lastResult: null,
          totalSpins: 0,
          streak: { type: "", count: 0 },
          achievements: [],
          aiContext: "",
          wheelTitle,
          wheelDescription,
          enhancedAchievements: [],
          recentResults: [],
          decisionDates: [],
          usedThemes: [],
          aiUsageCount: 0,
          challenges: [],
          totalPoints: 0,
          themes: WHEEL_THEMES,
        }
        console.log('Force saving wheel data after reset:', wheelData)
        syncWheelData(wheelData)
      }
    }, 100)
  };

  // Shuffle wheel function
  const shuffleWheel = () => {
    const shuffled = Math.random() * 360
    currentRotationRef.current = shuffled
    finalRotationRef.current = shuffled
    setRotation(shuffled)
    setHighlightIndex(null)
  };

  const applySoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled)
    const latest = useSettingsStore.getState().settings
    updateLocalSettings({
      confettiSound: {
        ...latest.confettiSound,
        enableSound: enabled,
      },
    })
    // Keep legacy context in sync if used elsewhere
    updateSettings({
      confettiSound: {
        ...globalSettings.confettiSound,
        enableSound: enabled,
      },
    })
  }

  const applyConfettiEnabled = (enabled: boolean) => {
    setConfettiEnabled(enabled)
    const latest = useSettingsStore.getState().settings
    updateLocalSettings({
      confettiSound: {
        ...latest.confettiSound,
        enableConfetti: enabled,
      },
    })
  }

  // Share function
  const shareResult = () => {
    if (lastResult) {
      const text = `I just got "${lastResult}" on the Yes/No Picker Wheel! 🎯`;
      if (navigator.share) {
        navigator.share({ text });
      } else {
        navigator.clipboard.writeText(text);
        // Show toast notification
      }
    }
  };

  // Replay function for spin history
  const replaySpin = (spin: SpinRecord) => {
    if (isSpinningRef.current) return
    setMode(spin.mode)
    setActiveTab(spin.activeTab)
    setWheelTheme(spin.wheelTheme)
    setUserQuestion(spin.userQuestion || "")
    setAiAdvice(spin.aiAdvice || "")

    isSpinningRef.current = true
    setIsSpinning(true)
    setHighlightIndex(null)
    setLastResult(null)
    pendingWinnerRef.current = { index: 0, result: spin.result }

    const finalRotation = currentRotationRef.current + 4 * 360 + (spin.rotation % 360)
    finalRotationRef.current = finalRotation
    setRotation(finalRotation)

    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    spinTimeoutRef.current = setTimeout(() => {
      finishSpinRef.current()
    }, 2080)
  };

  // Keyboard shortcut for Ctrl + Enter to spin
  useEffect(() => {
    if (!isClient) return
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!isSpinningRef.current) spinWheel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isClient]);

  // Sync local toggles with Header Settings (zustand store)
  useEffect(() => {
    setSoundEnabled(localSettings.confettiSound?.enableSound !== false)
    setConfettiEnabled(localSettings.confettiSound?.enableConfetti !== false)
  }, [
    localSettings.confettiSound?.enableSound,
    localSettings.confettiSound?.enableConfetti,
  ])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
      spinAudioRef.current?.stop()
    };
  }, []);

  // Don't leave spinning stuck after HMR
  useEffect(() => {
    setIsSpinning(false)
    isSpinningRef.current = false
  }, []);

    // Don't render until client is ready
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 overflow-auto bg-white p-4"
          : "relative w-full"
      }
    >
      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
          numberOfPieces={400}
          recycle={false}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 1000,
          }}
        />
      )}

      <div className="relative z-10 w-full">
        {!isFullscreen && (
          <>
            <YesNoPickerUseCases
              activeId={activeUseCaseId}
              onSelectPreset={applyUseCasePreset}
            />
            {activeUseCaseId && (
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className="bg-slate-800 text-white hover:bg-slate-800">
                  Mode: {getYesNoPickerUseCase(activeUseCaseId)?.label}
                </Badge>
                {(actionMode === "elimination" ||
                  !!localSettings.spinBehavior?.removeWinnerAfterSpin) && (
                  <Badge variant="secondary">
                    {Math.max(activeOptionCount, 0)} left on wheel
                  </Badge>
                )}
                {getYesNoPickerUseCase(activeUseCaseId)?.config.controlMode === "ai" && (
                  <Badge variant="outline" className="border-purple-300 text-purple-700">
                    AI mode
                  </Badge>
                )}
              </div>
            )}
          </>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Wheel column (left) */}
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
                onClick={() => setShowSpinHistory(true)}
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

            <div className="flex flex-col items-center space-y-6 pt-8">
              {!activeUseCaseId &&
                (actionMode === "elimination" ||
                  !!localSettings.spinBehavior?.removeWinnerAfterSpin) &&
                eliminatedOptions.length > 0 &&
                !isFullscreen && (
                  <Badge variant="secondary">
                    {Math.max(activeOptionCount, 0)} left on wheel
                  </Badge>
                )}

              <WheelDisplay
                items={canvasItems}
                rotation={rotation}
                isSpinning={isSpinning}
                highlightIndex={highlightIndex}
                soundEnabled={soundEnabled}
                setSoundEnabled={applySoundEnabled}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen((v) => !v)}
                onSpin={onSpinAction}
                onRotationFrame={handleRotationFrame}
                onSpinComplete={handleCanvasSpinComplete}
                manuallyStop={manuallyStop}
              />

              {lastResult && !isSpinning && (
                <div className="w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center shadow-lg">
                  <h3 className="mb-2 text-lg font-semibold text-green-800">
                    🎉 {resultTitle || "Winner!"}
                  </h3>
                  <p className="text-2xl font-bold text-green-900">{lastResult}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-1.5"
                    onClick={shareResult}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </Button>
                </div>
              )}

              {canvasItems.length === 0 && (
                <p className="text-center text-sm text-slate-500">
                  No options left — pick a mode again or turn off Elimination and Reset.
                </p>
              )}

              <Button
                onClick={onSpinAction}
                disabled={
                  (!isSpinning && canvasItems.length === 0) ||
                  (isSpinning && !manuallyStop)
                }
                className={`px-12 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl ${
                  activeTab === "ai"
                    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700"
                    : localSettings.display?.spinButtonAnimation
                      ? "animate-pulse bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSpinning ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {manuallyStop ? "Click Wheel to Stop" : "Spinning..."}
                  </span>
                ) : activeTab === "ai" ? (
                  "🧠 SPIN WITH AI"
                ) : (
                  "🎯 SPIN THE WHEEL"
                )}
              </Button>

              {localSettings.display?.showSpinCount && (
                <div className="text-sm text-gray-500">Total spins: {totalSpins}</div>
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
                  onClick={() => setShowGameModes(true)}
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
              </div>
            </div>
          </div>

          {/* Sidebar column */}
          {!isFullscreen && (
          <div className="space-y-4 lg:col-span-1">
            <ResultsDisplay
              results={results}
              lastResult={lastResult}
              mode={mode}
              activeTab={activeTab}
              aiContext={aiContext}
              streak={streak}
              showStats={showStats}
              totalSpins={totalSpins}
              optionLabels={optionLabels}
            />

            {showInputs ? (
            <YesNoPickerSidebar
              controlMode={activeTab === "ai" ? "ai" : "manual"}
              setControlMode={(m) => setActiveTab(m === "ai" ? "ai" : "manual")}
              mode={mode}
              setMode={(m) => {
                setMode(m)
                setActiveUseCaseId(null)
                if (m === "yes-no") {
                  setEliminatedOptions((prev) => prev.filter((k) => k !== "maybe"))
                }
              }}
              actionMode={
                actionMode === "elimination" ||
                !!localSettings.spinBehavior?.removeWinnerAfterSpin
                  ? "elimination"
                  : "normal"
              }
              onActionModeChange={(m) => {
                setActiveUseCaseId(null)
                syncEliminationWithSettings(m === "elimination")
              }}
              inputSets={inputSets}
              setInputSets={(n) => {
                setActiveUseCaseId(null)
                setInputSets(n)
              }}
              userQuestion={userQuestion}
              setUserQuestion={setUserQuestion}
              questionPlaceholder={
                activeUseCaseId
                  ? getYesNoPickerUseCase(activeUseCaseId)?.config.questionPlaceholder
                  : undefined
              }
              onGenerateAdvice={generateAdvice}
              isGeneratingAdvice={isGeneratingAdvice}
              aiAdvice={aiAdvice}
              showTitle={showTitle}
              setShowTitle={setShowTitle}
              wheelTitle={wheelTitle}
              setWheelTitle={setWheelTitle}
              wheelDescription={wheelDescription}
              setWheelDescription={setWheelDescription}
              resultTitle={resultTitle}
              setResultTitle={setResultTitle}
              optionLabels={optionLabels}
              setOptionLabels={setOptionLabels}
              onApplyPalette={(colors) => {
                setCustomColors({
                  yes: colors[0] ?? "#22c55e",
                  no: colors[1] ?? colors[0] ?? "#eab308",
                  maybe: colors[2] ?? colors[1] ?? colors[0] ?? "#f97316",
                })
              }}
              activePaletteColors={activePaletteColors}
              confettiEnabled={confettiEnabled}
              setConfettiEnabled={applyConfettiEnabled}
              soundEnabled={soundEnabled}
              setSoundEnabled={applySoundEnabled}
              showStats={showStats}
              setShowStats={setShowStats}
              onShuffle={shuffleWheel}
              onReset={resetWheel}
              onHideInputs={() => setShowInputs(false)}
              onViewHistory={() => setShowSpinHistory(true)}
              onOpenAchievements={() => setShowAchievements(true)}
              onOpenChallenges={() => setShowChallenges(true)}
              onOpenSettings={openSettings}
              onToggleFullscreen={() => setIsFullscreen((v) => !v)}
              onOpenAI={() => {
                setActiveTab("ai")
                setShowInputs(true)
              }}
              onOpenThemes={() => setShowThemeSelector(true)}
              resultsCount={totalSpins}
              historyCount={spinHistory.length}
              totalPoints={totalPoints}
              activeCount={Math.max(activeOptionCount, 0) * inputSets}
              eliminatedCount={eliminatedOptions.length}
            />
            ) : (
              <Button variant="outline" onClick={() => setShowInputs(true)}>
                Show inputs
              </Button>
            )}
          </div>
          )}
        </div>
      </div>

      <AchievementsDisplay
        achievements={enhancedAchievements}
        totalSpins={totalSpins}
        results={results}
        streak={streak}
        activeTab={activeTab}
        isVisible={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <ChallengesDisplay
        challenges={challenges}
        totalSpins={totalSpins}
        results={results}
        streak={streak}
        activeTab={activeTab}
        isVisible={showChallenges}
        onClose={() => setShowChallenges(false)}
      />

      <ThemeSelector
        themes={themes}
        currentTheme={wheelTheme}
        onThemeChange={(id) => {
          setWheelTheme(id)
          setCustomColors(null)
        }}
        isVisible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      <SpinHistory
        spinHistory={spinHistory}
        isVisible={showSpinHistory}
        onClose={() => setShowSpinHistory(false)}
        onReplay={replaySpin}
        currentMode={mode}
        currentActiveTab={activeTab}
      />

      <PickerWheelAnalyticsDisplay
        analytics={analyzeSpinData(
          spinHistory.map(
            (s): AnalyticsSpinRecord => ({
              id: s.id,
              timestamp: s.timestamp,
              result: s.result,
              options:
                s.mode === "yes-no"
                  ? [optionLabels.yes, optionLabels.no]
                  : [optionLabels.yes, optionLabels.no, optionLabels.maybe],
              mode: s.activeTab,
              theme: s.wheelTheme,
              spinDuration: s.duration,
              userQuestion: s.userQuestion,
            }),
          ),
        )}
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      <PickerWheelSocialHub
        isVisible={showSocialHub}
        onClose={() => setShowSocialHub(false)}
        onShareWheel={shareResult}
      />

      <PickerWheelGameModes
        isVisible={showGameModes}
        onClose={() => setShowGameModes(false)}
        userPoints={totalPoints}
        onStartGame={() => {
          setShowGameModes(false)
          setShowChallenges(true)
        }}
      />

      <TitleModal
        showTitleModal={showTitleModal}
        setShowTitleModal={setShowTitleModal}
        wheelTitle={wheelTitle}
        setWheelTitle={setWheelTitle}
        wheelDescription={wheelDescription}
        setWheelDescription={setWheelDescription}
      />
    </div>
  )
}
 