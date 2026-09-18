"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import Confetti from "react-confetti"
import { FileText, PanelRightOpen, Sparkles } from "lucide-react"
import Header from "@/components/header"
import ToolBreadcrumbs from "@/components/tool-breadcrumbs"
import EnhancedWheelSection from "@/components/enhanced-wheel-section"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import { SearchParamsSync } from "@/components/search-params-sync"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToastProvider, useToast } from "@/contexts/toast-context"
import { useGameSession } from "@/hooks/use-game-session"
import {
  PICKER_WHEEL_ACHIEVEMENTS,
  checkAchievementUnlocks,
  type Achievement,
} from "@/lib/picker-wheel-achievements"
import { analyzeSpinData, type SpinRecord } from "@/lib/picker-wheel-analytics"
import { type GameMode } from "@/lib/picker-wheel-game-modes"
import { type SocialProfile } from "@/lib/picker-wheel-social"
import {
  PICKER_WHEEL_THEMES,
  checkThemeUnlocks,
  type WheelTheme,
} from "@/lib/picker-wheel-themes"
import { WORD_PICKER_WHEEL_SHORT_TITLE } from "@/lib/word-picker-wheel-seo"
import {
  applyWordPickerUseCase,
  getWordPickerUseCase,
  wordPickerUseCaseFromTemplate,
  type WordPickerUseCaseId,
} from "@/lib/word-picker-wheel-use-cases"
import type { WordPickerDeepLink } from "@/lib/word-picker-wheel-spokes"
import { getWordPickerSpokePathForUseCase } from "@/lib/word-picker-wheel-spokes"
import {
  getWordPickerMode,
  pickExtraWords,
  wordPickerModeFromParam,
  type WordPickerChallengeMode,
} from "@/lib/word-picker-modes"
import {
  parseWordPickerSearchParams,
} from "@/lib/word-picker-share"
import { useSettingsStore } from "@/stores/settings-store"
import { useEnhancedWheelStore } from "@/stores/enhanced-wheel-store"
import { useWheelManagerStore, type WordPickerWheelData } from "@/stores/wheel-manager-store"
import PickerWheelInputPanel from "@/components/picker-wheel/input-panel"
import { WordPickerPopularTemplates } from "./word-picker-popular-templates"
import { WordPickerModeChips } from "./word-picker-mode-chips"
import { WordPickerVocabCard } from "./word-picker-vocab-card"
import { WordPickerAdvancedControls } from "./word-picker-advanced-controls"
import {
  pickWeightedWords,
  WORD_PICKER_WINNER_COUNTS,
  type WordPickerWinnerCount,
} from "@/lib/word-picker-multi"
import { isWordPickerEmbedParam } from "@/lib/word-picker-embed"

const WORD_COLORS = ["#0ea5e9", "#22c55e", "#a855f7", "#f59e0b", "#ec4899", "#14b8a6"] as const

const PickerResultsModal = dynamic(() => import("@/components/picker-results-modal"), {
  ssr: false,
})
const AIInputPanel = dynamic(() => import("@/components/ai-input-panel"), { ssr: false })
const PickerWheelAchievementsDisplay = dynamic(
  () => import("@/components/picker-wheel-achievements-display"),
  { ssr: false },
)
const PickerWheelThemeSelector = dynamic(
  () => import("@/components/picker-wheel-theme-selector"),
  { ssr: false },
)
const PickerWheelAnalyticsDisplay = dynamic(
  () => import("@/components/picker-wheel-analytics-display"),
  { ssr: false },
)
const PickerWheelSocialHub = dynamic(() => import("@/components/picker-wheel-social-hub"), {
  ssr: false,
})
const PickerWheelGameModes = dynamic(() => import("@/components/picker-wheel-game-modes"), {
  ssr: false,
})
const PickerWheelGameStatus = dynamic(() => import("@/components/picker-wheel-game-status"), {
  ssr: false,
})

const EMPTY_RESULTS: unknown[] = []
const EMPTY_OPTIONS: WordPickerWheelData["options"] = []

export type WordPickerWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: WordPickerDeepLink
}

function WordPickerWheelAppInner({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: WordPickerWheelAppProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [useAIInput, setUseAIInput] = useState(false)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sidebarMaxHeight, setSidebarMaxHeight] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>(PICKER_WHEEL_ACHIEVEMENTS)
  const [themes, setThemes] = useState<WheelTheme[]>(PICKER_WHEEL_THEMES)
  const [currentTheme, setCurrentTheme] = useState("classic")
  const [totalPoints, setTotalPoints] = useState(0)
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [currentUser] = useState<SocialProfile | undefined>()
  const [actionMode, setActionMode] = useState<"normal" | "elimination">("normal")
  const [challengeMode, setChallengeMode] = useState<WordPickerChallengeMode>("one")
  const [challengeWords, setChallengeWords] = useState<string[]>([])
  const [showVocabCard, setShowVocabCard] = useState(false)
  const [winnerCount, setWinnerCount] = useState<WordPickerWinnerCount>(1)
  const [embedMode, setEmbedMode] = useState(false)
  const [activeUseCaseId, setActiveUseCaseId] = useState<WordPickerUseCaseId | null>(
    deepLink?.useCaseId ?? null,
  )
  const [toolReady, setToolReady] = useState(false)
  const deepLinkAppliedRef = useRef(false)
  const deepLinkWordsAppliedRef = useRef(false)
  const lastChallengeSpinRef = useRef<string | null>(null)
  const lastGameSpinRef = useRef<string | null>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()
  const { settings, loadFromDatabase: loadSettings, updateSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore(
    (state) => state.settings.spinBehavior.removeWinnerAfterSpin,
  )
  const { setCurrentTool, createNewWheel, updateWheelData, getCurrentWheel } = useWheelManagerStore()
  const { selectedResult, replaceOptions, removeOptionsByIds } =
    useEnhancedWheelStore()
  const {
    currentSession,
    isGameActive: isAdvancedGameActive,
    startGame: startAdvancedGame,
    endGame: endAdvancedGame,
    restartGame: restartAdvancedGame,
    recordSpin,
    getGameScore,
  } = useGameSession()

  const wordWheel = useWheelManagerStore((state) => {
    return (
      state.wheelsByTool["word-picker-wheel"]?.find((item) => item.id === state.currentWheelId) ||
      state.wheelsByTool["word-picker-wheel"]?.[0] ||
      null
    )
  })

  const wordData = (wordWheel?.data as WordPickerWheelData | undefined) || null
  const options = Array.isArray(wordData?.options) ? wordData!.options : EMPTY_OPTIONS
  const recentResults = Array.isArray(wordData?.recentResults)
    ? wordData!.recentResults
    : EMPTY_RESULTS

  const allWheelResults = useMemo(() => {
    if (Array.isArray(recentResults) && recentResults.length > 0) return recentResults
    return selectedResult ? [selectedResult] : []
  }, [recentResults, selectedResult])

  const syncEliminationWithSettings = useCallback(
    (enabled: boolean) => {
      setActionMode(enabled ? "elimination" : "normal")
      const latest = useSettingsStore.getState().settings
      updateSettings({
        spinBehavior: {
          ...latest.spinBehavior,
          removeWinnerAfterSpin: enabled,
        },
      })
    },
    [updateSettings],
  )

  useEffect(() => {
    const next = removeWinnerAfterSpin ? "elimination" : "normal"
    if (actionMode !== next) setActionMode(next)
  }, [actionMode, removeWinnerAfterSpin])

  const loadWordsOntoWheel = useCallback(
    (words: string[], label?: string) => {
      if (words.length === 0) {
        showToast("No words to load.", "warning")
        return
      }
      const timestamp = Date.now()
      replaceOptions(
        words.map((name, index) => ({
          id: `word-import-${timestamp}-${index}`,
          name,
          color: WORD_COLORS[index % WORD_COLORS.length],
          weight: 1,
          enabled: true,
        })),
      )
      const wheel = getCurrentWheel()
      if (wheel?.toolType === "word-picker-wheel") {
        updateWheelData("word-picker-wheel", wheel.id, {
          ...wheel.data,
          lastResult: null,
          recentResults: [],
          selectedResult: null,
          ...(label ? { toolTitle: label } : {}),
        })
      }
      setChallengeWords([])
      setShowVocabCard(false)
      lastChallengeSpinRef.current = null
      showToast(`Loaded ${words.length} words.`, "success")
    },
    [getCurrentWheel, replaceOptions, showToast, updateWheelData],
  )

  const applyChallengeMode = useCallback(
    (mode: WordPickerChallengeMode) => {
      setChallengeMode(mode)
      lastChallengeSpinRef.current = null
      const config = getWordPickerMode(mode)
      if (config?.forcesElimination) {
        syncEliminationWithSettings(true)
      }
      showToast(`Mode: ${config?.label || mode}`, "info")
    },
    [showToast, syncEliminationWithSettings],
  )

  const applyPreset = useCallback(
    (id: WordPickerUseCaseId) => {
      const useCase = getWordPickerUseCase(id)
      if (!useCase || !applyWordPickerUseCase(id)) return
      setActiveUseCaseId(id)
      syncEliminationWithSettings(useCase.config.elimination)
      if (useCase.config.elimination) setChallengeMode("elimination")
      setChallengeWords([])
      setShowVocabCard(false)
      lastChallengeSpinRef.current = null
      showToast(`Loaded: ${useCase.label}`, "success")
    },
    [showToast, syncEliminationWithSettings],
  )

  useEffect(() => {
    const el = leftColRef.current
    if (!el || !showInputs || isFullscreen) {
      setSidebarMaxHeight(null)
      return
    }
    const sync = () => {
      if (typeof window === "undefined") return
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setSidebarMaxHeight(Math.round(el.getBoundingClientRect().height))
      } else {
        setSidebarMaxHeight(null)
      }
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener("resize", sync)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", sync)
    }
  }, [showInputs, isFullscreen, actionMode, currentTheme, options.length, useAIInput])

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      await loadSettings()
      if (cancelled) return
      setCurrentTool("word-picker-wheel")
      const wheels = useWheelManagerStore.getState().wheelsByTool["word-picker-wheel"] || []
      if (wheels.length === 0) {
        createNewWheel("word-picker-wheel", "My Word Wheel")
      }

      const wheel = useWheelManagerStore.getState().getCurrentWheel()
      const data = wheel?.data as WordPickerWheelData | undefined
      if (data?.activeUseCaseId) {
        setActiveUseCaseId(data.activeUseCaseId as WordPickerUseCaseId)
      }
      if (Array.isArray(data?.achievements) && data.achievements.length > 0) {
        setAchievements(data.achievements as Achievement[])
        setTotalPoints(
          (data.achievements as Achievement[])
            .filter((item) => item.completed)
            .reduce((sum, item) => sum + (item.points || 0), 0),
        )
      }
      if (Array.isArray(data?.themes) && data.themes.length > 0) {
        setThemes(data.themes as WheelTheme[])
      }
      if (data?.currentTheme) setCurrentTheme(data.currentTheme)
      if (Array.isArray(data?.spinHistory)) {
        setSpinHistory(
          data.spinHistory.map((record: any) => ({
            ...record,
            timestamp: new Date(record.timestamp),
          })),
        )
      }

      const latest = useSettingsStore.getState().settings
      setActionMode(latest.spinBehavior.removeWinnerAfterSpin ? "elimination" : "normal")
      if (!cancelled) setToolReady(true)
    }
    void init()
    return () => {
      cancelled = true
    }
  }, [createNewWheel, loadSettings, setCurrentTool])

  useEffect(() => {
    if (!toolReady || !deepLink || deepLinkAppliedRef.current) return
    deepLinkAppliedRef.current = true
    applyWordPickerUseCase(deepLink.useCaseId)
    setActiveUseCaseId(deepLink.useCaseId)
    syncEliminationWithSettings(deepLink.config.elimination)
    if (deepLink.config.defaultMode) {
      setChallengeMode(deepLink.config.defaultMode)
    } else if (deepLink.config.elimination) {
      setChallengeMode("elimination")
    }
    lastChallengeSpinRef.current = null
  }, [deepLink, syncEliminationWithSettings, toolReady])

  const onSearchParams = useCallback(
    (params: URLSearchParams) => {
      setEmbedMode(isWordPickerEmbedParam(params.get("embed")))

      const deep = parseWordPickerSearchParams(params)
      const mode = wordPickerModeFromParam(deep.mode)
      if (mode) setChallengeMode(mode)

      const countParam = Number(params.get("count") || "")
      if (
        WORD_PICKER_WINNER_COUNTS.includes(countParam as WordPickerWinnerCount)
      ) {
        setWinnerCount(countParam as WordPickerWinnerCount)
      }

      const template = wordPickerUseCaseFromTemplate(deep.template)
      if (template) {
        const spokePath = getWordPickerSpokePathForUseCase(template)
        if (
          spokePath &&
          typeof window !== "undefined" &&
          window.location.pathname !== spokePath &&
          window.location.pathname.includes("spin-word-picker-wheel")
        ) {
          window.location.replace(`${spokePath}${window.location.search}`)
          return
        }
        applyPreset(template)
      }

      if (deep.words && deep.words.length > 0 && !deepLinkWordsAppliedRef.current) {
        deepLinkWordsAppliedRef.current = true
        loadWordsOntoWheel(deep.words, "Shared word list")
        setActiveUseCaseId(null)
      }
    },
    [applyPreset, loadWordsOntoWheel],
  )

  const handlePickMany = useCallback(() => {
    const winners = pickWeightedWords(options as any, winnerCount)
    if (winners.length === 0) {
      showToast("No words available to pick.", "warning")
      return
    }
    const names = winners.map((item) => item.name)
    setChallengeWords(names)
    setShowVocabCard(true)
    setShowConfetti(true)
    window.setTimeout(() => setShowConfetti(false), 2500)

    const wheel = getCurrentWheel()
    if (wheel?.toolType === "word-picker-wheel") {
      const stamp = new Date().toISOString()
      updateWheelData("word-picker-wheel", wheel.id, {
        ...wheel.data,
        lastResult: winners[0],
        selectedResult: winners[0],
        recentResults: [
          ...names.map((name, index) => ({
            id: winners[index]?.id || `multi-${index}`,
            name,
            timestamp: stamp,
          })),
          ...(Array.isArray((wheel.data as WordPickerWheelData).recentResults)
            ? (wheel.data as WordPickerWheelData).recentResults!
            : []),
        ].slice(0, 50),
      })
    }

    if (actionMode === "elimination") {
      removeOptionsByIds(winners.map((item) => item.id))
    }

    showToast(
      winners.length === 1 ? `Word: ${names[0]}` : `Picked ${names.length} words`,
      "success",
    )
  }, [
    actionMode,
    getCurrentWheel,
    options,
    removeOptionsByIds,
    showToast,
    updateWheelData,
    winnerCount,
  ])

  useEffect(() => {
    if (!isFullscreen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFullscreen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isFullscreen])

  const toggleFullscreen = () => setIsFullscreen((value) => !value)

  const handleThemeSelect = useCallback(
    (themeId: string) => {
      setCurrentTheme(themeId)
      const theme =
        themes.find((item) => item.id === themeId) ||
        PICKER_WHEEL_THEMES.find((item) => item.id === themeId)
      if (theme?.colors?.length) {
        const latest = useSettingsStore.getState().settings
        updateSettings({
          appearance: {
            ...latest.appearance,
            toolColors: [...theme.colors],
          },
        })
      }
      const wheel = getCurrentWheel()
      if (!wheel || wheel.toolType !== "word-picker-wheel") return
      const nextOptions = (
        Array.isArray((wheel.data as WordPickerWheelData).options)
          ? (wheel.data as WordPickerWheelData).options
          : []
      ).map((option, index) => ({
        ...option,
        color: theme?.colors?.length ? theme.colors[index % theme.colors.length] : option.color,
      }))
      updateWheelData("word-picker-wheel", wheel.id, {
        ...wheel.data,
        currentTheme: themeId,
        options: nextOptions,
      })
    },
    [getCurrentWheel, themes, updateSettings, updateWheelData],
  )

  const resetWheelForGame = useCallback(() => {
    const wheel = getCurrentWheel()
    if (!wheel || wheel.toolType !== "word-picker-wheel") return
    lastGameSpinRef.current = null
    updateWheelData("word-picker-wheel", wheel.id, {
      ...wheel.data,
      totalSpins: 0,
      spinHistory: [],
      recentResults: [],
      selectedResult: null,
      lastResult: null,
    })
    setSpinHistory([])
  }, [getCurrentWheel, updateWheelData])

  const handleSpinCompleted = useCallback(() => {
    const wheel = getCurrentWheel()
    if (!wheel || wheel.toolType !== "word-picker-wheel") return
    const data = wheel.data as WordPickerWheelData
    const storeResult = useEnhancedWheelStore.getState().selectedResult
    const resultName =
      data.selectedResult?.name || data.lastResult?.name || storeResult?.name
    if (!resultName) return

    const spinKey = `${resultName}::${data.totalSpins || 0}::${challengeMode}`
    if (lastChallengeSpinRef.current !== spinKey) {
      lastChallengeSpinRef.current = spinKey
      const pool = (Array.isArray(data.options) ? data.options : [])
        .filter((item) => item.enabled !== false)
        .map((item) => item.name)
        .filter(Boolean)
      const modeConfig = getWordPickerMode(challengeMode)
      const extraCount = Math.max(0, (modeConfig?.wordCount || 1) - 1)
      const extras = pickExtraWords(pool, resultName, extraCount)
      const nextWords = [resultName, ...extras]
      setChallengeWords(nextWords)
      setShowVocabCard(true)
    }

    if (Array.isArray(data.spinHistory)) {
      setSpinHistory(
        data.spinHistory.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp),
        })),
      )
    }

    if (isAdvancedGameActive && currentSession && lastGameSpinRef.current !== resultName) {
      lastGameSpinRef.current = resultName
      window.setTimeout(() => recordSpin(resultName), 80)
    }

    const results = Array.isArray(data.recentResults) ? data.recentResults : []
    const stats = {
      totalSpins: data.totalSpins || 0,
      uniqueResults: new Set(results.map((item: any) => item.name)).size,
      perfectMemoryRounds: 0,
      bingoWins: 0,
      fastestMemoryTime: 0,
      consecutiveDays: 1,
      totalOptions: Array.isArray(data.options)
        ? data.options.filter((item) => item.enabled !== false).length
        : 0,
      aiGeneratedOptions: 0,
      mysterySpins: 0,
    }
    const updatedAchievements = checkAchievementUnlocks(achievements, stats)
    const newlyCompleted = updatedAchievements.filter(
      (item) => item.completed && !achievements.find((prev) => prev.id === item.id)?.completed,
    )
    if (newlyCompleted.length > 0) {
      const gained = newlyCompleted.reduce((sum, item) => sum + (item.points || 0), 0)
      const nextPoints = totalPoints + gained
      setAchievements(updatedAchievements)
      setTotalPoints(nextPoints)
      const updatedThemes = checkThemeUnlocks(themes, {
        totalSpins: stats.totalSpins,
        totalPoints: nextPoints,
      })
      setThemes(updatedThemes)
      updateWheelData("word-picker-wheel", wheel.id, {
        ...data,
        achievements: updatedAchievements,
        themes: updatedThemes,
      })
    }
  }, [
    achievements,
    challengeMode,
    currentSession,
    getCurrentWheel,
    isAdvancedGameActive,
    recordSpin,
    themes,
    totalPoints,
    updateWheelData,
  ])

  const wheelSection = (
    <EnhancedWheelSection
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
      currentGameMode={currentSession?.gameMode?.name}
      onSpinCompleted={handleSpinCompleted}
      isFullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
      onConfettiChange={setShowConfetti}
    />
  )

  return (
    <>
      <SearchParamsSync onChange={onSearchParams} />
      {showConfetti && settings.confettiSound?.enableConfetti !== false && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
          numberOfPieces={typeof window !== "undefined" && window.innerWidth < 640 ? 160 : 320}
          recycle={false}
          gravity={0.3}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 9999, pointerEvents: "none" }}
        />
      )}

      <div
        className={
          isFullscreen
            ? "fixed inset-0 z-50 overflow-auto bg-white"
            : "min-h-screen overflow-x-hidden transition-colors duration-300"
        }
        style={
          isFullscreen
            ? undefined
            : {
                backgroundColor: settings.appearance.backgroundColor,
                backgroundImage: settings.appearance.backgroundImage
                  ? `url(${settings.appearance.backgroundImage})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
        }
      >
        {!isFullscreen && !embedMode && (
          <Header
            onOpenSettings={() => setShowSettings(true)}
            onOpenGames={() => setShowGameModes(true)}
          />
        )}

        {isFullscreen ? (
          <div className="flex min-h-full flex-col items-center justify-center p-3 sm:p-4">
            {wheelSection}
          </div>
        ) : (
          <main id="spin-word-picker-wheel" className="w-full px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
            {!embedMode && (
              <div className="mb-3 text-center sm:mb-4">
                <ToolPageTitle
                  toolType="word-picker-wheel"
                  title={shortTitle ?? WORD_PICKER_WHEEL_SHORT_TITLE}
                />
                <p className="mt-1 px-2 text-sm text-gray-600">
                  {toolSubtitle ??
                    "Random word spinner for writing, classrooms, vocabulary, and games"}
                </p>
              </div>
            )}

            {isAdvancedGameActive && currentSession && !embedMode && (
              <div className="mb-4">
                <PickerWheelGameStatus
                  session={currentSession}
                  onEndGame={() => {
                    endAdvancedGame()
                    setTotalPoints((prev) => prev + getGameScore())
                  }}
                  onRestartGame={restartAdvancedGame}
                />
              </div>
            )}

            {!embedMode && <WordPickerPopularTemplates />}
            {!embedMode && (
              <WordPickerModeChips activeMode={challengeMode} onChange={applyChallengeMode} />
            )}
            {!embedMode && (
              <WordPickerAdvancedControls
                activeCount={options.filter((item) => item.enabled !== false).length}
                winnerCount={winnerCount}
                onWinnerCountChange={setWinnerCount}
                onPickMany={handlePickMany}
                currentWords={options.map((item) => item.name).filter(Boolean)}
                onLoadPack={(words, name) => {
                  loadWordsOntoWheel(words, name)
                  setActiveUseCaseId(null)
                }}
                onFilterApply={(words) => {
                  if (words.length === 0) {
                    showToast("No words match those filters.", "warning")
                    return
                  }
                  loadWordsOntoWheel(words, "Filtered words")
                }}
                showAiPresets={useAIInput}
                onAiPreset={(preset) => {
                  loadWordsOntoWheel([...preset.fallbackWords], preset.label)
                  setActiveUseCaseId(null)
                  setUseAIInput(true)
                  setShowInputs(true)
                  showToast(`Loaded ${preset.label}. Refine with AI if you want.`, "success")
                }}
              />
            )}
            {activeUseCaseId && (
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                <Badge className="bg-sky-700 text-white hover:bg-sky-700">
                  Pack: {getWordPickerUseCase(activeUseCaseId)?.label}
                </Badge>
                <Badge variant="secondary">
                  {getWordPickerUseCase(activeUseCaseId)?.config.category}
                </Badge>
                <Badge variant="secondary">Mode: {getWordPickerMode(challengeMode)?.label}</Badge>
                {actionMode === "elimination" && (
                  <Badge variant="secondary">No-repeat on</Badge>
                )}
                {settings.spinBehavior.mysterySpin && (
                  <Badge variant="secondary">Mystery wheel</Badge>
                )}
                {settings.spinBehavior.mysteryResult && (
                  <Badge variant="secondary">Mystery result</Badge>
                )}
              </div>
            )}

            {showVocabCard && challengeWords.length > 0 && (
              <WordPickerVocabCard
                words={challengeWords}
                mode={challengeMode}
                onCopy={(text) => {
                  void navigator.clipboard?.writeText(text).then(
                    () => showToast("Copied!", "success"),
                    () => showToast("Could not copy.", "error"),
                  )
                }}
                onClose={() => setShowVocabCard(false)}
              />
            )}

            <div className="mb-4 flex justify-center">
              <div className="flex flex-wrap justify-center rounded-lg bg-gray-100 p-1">
                <Button
                  variant={!useAIInput ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUseAIInput(false)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Manual Input
                </Button>
                <Button
                  variant={useAIInput ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setUseAIInput(true)
                    setShowInputs(true)
                  }}
                  className={`flex items-center gap-2 ${
                    useAIInput
                      ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-600 hover:to-pink-600"
                      : "bg-white"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span
                    className={
                      useAIInput
                        ? "text-white"
                        : "bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"
                    }
                  >
                    AI-Powered
                  </span>
                </Button>
              </div>
            </div>

            <div className="mb-8 grid min-w-0 items-start gap-6 lg:grid-cols-3 lg:gap-8">
              <div
                ref={leftColRef}
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
                    onClick={() => setShowResultsModal(true)}
                    className="absolute left-2 top-2 z-10 border-sky-500 bg-white px-2 py-1 text-xs text-sky-700 shadow-sm hover:bg-sky-50 sm:left-4 sm:top-4 sm:px-3"
                  >
                    Results
                    {allWheelResults.length > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {allWheelResults.length}
                      </Badge>
                    )}
                  </Button>
                )}
                {!showInputs && (
                  <div className="mb-3 flex justify-end pt-8">
                    <Button variant="outline" size="sm" onClick={() => setShowInputs(true)}>
                      <PanelRightOpen className="mr-1.5 h-4 w-4" />
                      Show controls
                    </Button>
                  </div>
                )}
                <div className={`flex justify-center ${isFullscreen ? "" : "pt-8 sm:pt-4"}`}>
                  {wheelSection}
                </div>
              </div>

              {showInputs && !isFullscreen ? (
                useAIInput ? (
                  <div className="min-w-0 self-start lg:col-span-1">
                    <AIInputPanel />
                  </div>
                ) : (
                  <div className="min-w-0 self-start lg:col-span-1">
                    <PickerWheelInputPanel
                      toolType="word-picker-wheel"
                      onViewResults={() => setShowResultsModal(true)}
                      onOpenSettings={() => setShowSettings(true)}
                      onOpenAI={() => setUseAIInput(true)}
                      onOpenAnalytics={() => setShowAnalytics(true)}
                      onHideInputs={() => setShowInputs(false)}
                      onToggleFullscreen={toggleFullscreen}
                      actionMode={actionMode}
                      onActionModeChange={(mode) =>
                        syncEliminationWithSettings(mode === "elimination")
                      }
                      desktopMaxHeight={sidebarMaxHeight}
                    />
                  </div>
                )
              ) : null}
            </div>

            {showResultsModal && (
              <PickerResultsModal
                isOpen={showResultsModal}
                onClose={() => setShowResultsModal(false)}
                results={allWheelResults}
              />
            )}

            {!embedMode && (
              <>
                <ToolBreadcrumbs />
                {seoIntro}
                {seoSections}
              </>
            )}
          </main>
        )}

        {!isFullscreen && !embedMode && <Footer />}
        {showSettings && !embedMode && (
          <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
        )}
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
          analytics={{
            ...analyzeSpinData(spinHistory),
            totalSpins: wordData?.totalSpins || 0,
            uniqueResults: new Set(
              allWheelResults.map((r: any) => r.name).filter(Boolean),
            ).size,
          }}
          isVisible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
        <PickerWheelSocialHub
          isVisible={showSocialHub}
          onClose={() => setShowSocialHub(false)}
          currentUser={currentUser}
          onShareWheel={() => {
            void navigator.clipboard?.writeText(window.location.href)
            showToast("Link copied!", "success")
          }}
        />
        <PickerWheelGameModes
          isVisible={showGameModes}
          onClose={() => setShowGameModes(false)}
          userPoints={totalPoints}
          onStartGame={(gameMode: GameMode) => {
            resetWheelForGame()
            startAdvancedGame(gameMode)
            setShowGameModes(false)
          }}
        />
      </div>
    </>
  )
}

export default function WordPickerWheelApp(props: WordPickerWheelAppProps) {
  return (
    <ToastProvider>
      <WordPickerWheelAppInner {...props} />
    </ToastProvider>
  )
}
