"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
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
import { RAFFLE_SPIN_WHEEL_SHORT_TITLE } from "@/lib/raffle-spin-wheel-seo"
import type { RaffleSpinWheelDeepLink } from "@/lib/raffle-spin-wheel-spokes"
import {
  getRaffleSpokePathForUseCase,
  RAFFLE_SPIN_WHEEL_POPULAR_SPOKE_LINKS,
} from "@/lib/raffle-spin-wheel-spokes"
import {
  applyRaffleSpinWheelUseCase,
  getRaffleSpinWheelUseCase,
  raffleSpinWheelUseCaseFromTemplate,
  type RaffleSpinWheelUseCaseId,
} from "@/lib/raffle-spin-wheel-use-cases"
import {
  DEFAULT_RAFFLE_PRIZE_PLACES,
  buildRaffleDrawRecords,
  getActiveRaffleParticipants,
  pickWeightedRaffleWinners,
  prizeLabelForDraw,
  type RaffleWinnerCountPreset,
} from "@/lib/raffle-draw"
import {
  buildTicketOptions,
  expandWeightsAsTicketOptions,
} from "@/lib/raffle-tickets"
import { useSettingsStore } from "@/stores/settings-store"
import { useEnhancedWheelStore } from "@/stores/enhanced-wheel-store"
import { useWheelManagerStore, type RaffleSpinWheelData } from "@/stores/wheel-manager-store"
import type { RaffleDrawRecord, RafflePrizePlace } from "@/types/raffle-spin-wheel-types"
import PickerWheelInputPanel from "@/components/picker-wheel/input-panel"
import { RafflePopularTemplates } from "./raffle-popular-templates"
import { RaffleDrawControls } from "./raffle-draw-controls"
import { RaffleWinnerScreen } from "./raffle-winner-screen"

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
const EMPTY_DRAWS: RaffleDrawRecord[] = []
const EMPTY_LOCKED: string[] = []
const EMPTY_OPTIONS: RaffleSpinWheelData["options"] = []

export type RaffleSpinWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  shortTitle?: string
  toolSubtitle?: string
  deepLink?: RaffleSpinWheelDeepLink
}

function RaffleSpinWheelAppInner({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: RaffleSpinWheelAppProps) {
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
  const [actionMode, setActionMode] = useState<"normal" | "elimination">("elimination")
  const [winnerCount, setWinnerCount] = useState<RaffleWinnerCountPreset>(1)
  const [lockWinners, setLockWinners] = useState(true)
  const [winnerScreenOpen, setWinnerScreenOpen] = useState(false)
  const [winnerBatch, setWinnerBatch] = useState<RaffleDrawRecord[]>([])
  const [activeUseCaseId, setActiveUseCaseId] = useState<RaffleSpinWheelUseCaseId | null>(
    deepLink?.useCaseId ?? null,
  )
  const [toolReady, setToolReady] = useState(false)
  const deepLinkAppliedRef = useRef(false)
  const lastSyncedSpinIdRef = useRef<string | null>(null)
  const lastGameSpinRef = useRef<string | null>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()
  const pathname = usePathname()
  const { settings, loadFromDatabase: loadSettings, updateSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore(
    (state) => state.settings.spinBehavior.removeWinnerAfterSpin,
  )
  const { setCurrentTool, createNewWheel, updateWheelData, getCurrentWheel } = useWheelManagerStore()
  const { selectedResult, removeOptionsByIds, replaceOptions } = useEnhancedWheelStore()
  const {
    currentSession,
    isGameActive: isAdvancedGameActive,
    startGame: startAdvancedGame,
    endGame: endAdvancedGame,
    restartGame: restartAdvancedGame,
    recordSpin,
    getGameScore,
  } = useGameSession()

  const raffleWheel = useWheelManagerStore((state) => {
    return (
      state.wheelsByTool["raffle-spin-wheel"]?.find((item) => item.id === state.currentWheelId) ||
      state.wheelsByTool["raffle-spin-wheel"]?.[0] ||
      null
    )
  })

  const raffleData = (raffleWheel?.data as RaffleSpinWheelData | undefined) || null
  const options = Array.isArray(raffleData?.options) ? raffleData!.options : EMPTY_OPTIONS
  const recentResults = Array.isArray(raffleData?.recentResults)
    ? raffleData!.recentResults
    : EMPTY_RESULTS
  const drawHistory = Array.isArray(raffleData?.drawHistory) ? raffleData!.drawHistory : EMPTY_DRAWS
  const lockedWinnerIds = Array.isArray(raffleData?.lockedWinnerIds)
    ? raffleData!.lockedWinnerIds
    : EMPTY_LOCKED
  const prizePlaces: RafflePrizePlace[] = Array.isArray(raffleData?.prizePlaces)
    ? raffleData!.prizePlaces
    : DEFAULT_RAFFLE_PRIZE_PLACES

  const activePool = useMemo(
    () => getActiveRaffleParticipants(options as any, lockedWinnerIds),
    [options, lockedWinnerIds],
  )

  const allWheelResults = useMemo(() => {
    if (drawHistory.length > 0) {
      return drawHistory.map((draw) => ({
        id: draw.optionId || `draw-${draw.drawNumber}`,
        name: draw.prizeLabel ? `${draw.name} (${draw.prizeLabel})` : draw.name,
        timestamp: draw.timestamp,
      }))
    }
    if (Array.isArray(recentResults) && recentResults.length > 0) return recentResults
    return selectedResult ? [selectedResult] : []
  }, [drawHistory, recentResults, selectedResult])

  const patchRaffleData = useCallback(
    (patch: Partial<RaffleSpinWheelData>) => {
      const wheel = getCurrentWheel()
      if (!wheel || wheel.toolType !== "raffle-spin-wheel") return
      updateWheelData("raffle-spin-wheel", wheel.id, {
        ...wheel.data,
        ...patch,
      })
    },
    [getCurrentWheel, updateWheelData],
  )

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

  // Keep Action Mode in sync with Header Settings / Manage → Remove winner
  useEffect(() => {
    const next = removeWinnerAfterSpin ? "elimination" : "normal"
    if (actionMode !== next) setActionMode(next)
  }, [actionMode, removeWinnerAfterSpin])

  // Highlight active setup from spoke URL (Fortnite/Prize pattern)
  useEffect(() => {
    if (deepLink?.useCaseId) {
      setActiveUseCaseId(deepLink.useCaseId)
      return
    }
    const match = RAFFLE_SPIN_WHEEL_POPULAR_SPOKE_LINKS.find((item) => item.href === pathname)
    if (match) setActiveUseCaseId(match.useCaseId)
  }, [deepLink?.useCaseId, pathname])

  const openWinnerScreen = useCallback(
    (batch: RaffleDrawRecord[]) => {
      if (batch.length === 0) return
      setWinnerBatch(batch)
      setWinnerScreenOpen(true)
      setShowConfetti(true)
      window.setTimeout(() => setShowConfetti(false), 3500)
    },
    [],
  )

  const commitDraws = useCallback(
    (winners: ReturnType<typeof pickWeightedRaffleWinners>, shouldLock: boolean) => {
      if (winners.length === 0) {
        showToast("No eligible entrants left to draw.", "error")
        return
      }

      const starting = (drawHistory[drawHistory.length - 1]?.drawNumber || 0) + 1
      const records = buildRaffleDrawRecords(winners, starting, prizePlaces).map((record) => ({
        ...record,
        locked: shouldLock,
      }))
      const nextHistory = [...drawHistory, ...records]
      const nextLocked = shouldLock
        ? Array.from(
            new Set([
              ...lockedWinnerIds,
              ...winners.map((winner) => winner.id).filter(Boolean),
            ]),
          )
        : lockedWinnerIds

      patchRaffleData({
        drawHistory: nextHistory,
        lockedWinnerIds: nextLocked,
        lastResult: winners[winners.length - 1],
        selectedResult: winners[winners.length - 1],
        recentResults: [
          ...records.map((record) => ({
            id: record.optionId,
            name: record.name,
            timestamp: record.timestamp,
          })),
          ...(Array.isArray(recentResults) ? recentResults : []),
        ].slice(0, 50),
      })

      if (shouldLock) {
        removeOptionsByIds(winners.map((winner) => winner.id))
        // Keep elimination aligned when locking multi-draws
        if (!settings.spinBehavior.removeWinnerAfterSpin) {
          syncEliminationWithSettings(true)
        }
      }

      openWinnerScreen(records)
      showToast(
        winners.length === 1
          ? `Winner: ${winners[0].name}`
          : `Drew ${winners.length} winners`,
        "success",
      )
    },
    [
      drawHistory,
      lockedWinnerIds,
      openWinnerScreen,
      patchRaffleData,
      prizePlaces,
      recentResults,
      removeOptionsByIds,
      settings.spinBehavior.removeWinnerAfterSpin,
      showToast,
      syncEliminationWithSettings,
    ],
  )

  const handleMultiDraw = useCallback(() => {
    const winners = pickWeightedRaffleWinners(options as any, winnerCount, lockedWinnerIds)
    commitDraws(winners, lockWinners)
  }, [commitDraws, lockWinners, lockedWinnerIds, options, winnerCount])

  const handleGenerateTickets = useCallback(
    (count: number, prefix: string) => {
      const tickets = buildTicketOptions(count, prefix)
      replaceOptions(tickets as any)
      patchRaffleData({
        drawHistory: [],
        lockedWinnerIds: [],
        lastResult: null,
        selectedResult: null,
        recentResults: [],
      })
      lastSyncedSpinIdRef.current = null
      showToast(`Generated ${tickets.length} tickets.`, "success")
    },
    [patchRaffleData, replaceOptions, showToast],
  )

  const handleExpandWeightsAsTickets = useCallback(() => {
    const expanded = expandWeightsAsTicketOptions(options as any)
    if (expanded.length === 0) {
      showToast("Add entrants before expanding weights.", "warning")
      return
    }
    replaceOptions(expanded as any)
    patchRaffleData({
      drawHistory: [],
      lockedWinnerIds: [],
      lastResult: null,
      selectedResult: null,
      recentResults: [],
    })
    lastSyncedSpinIdRef.current = null
    showToast(`Expanded to ${expanded.length} equal tickets.`, "success")
  }, [options, patchRaffleData, replaceOptions, showToast])

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

  // Sync manual wheel spins into raffle draw history + optional lock bookkeeping
  useEffect(() => {
    if (!selectedResult?.id || !selectedResult?.name) return
    if (lastSyncedSpinIdRef.current === selectedResult.id) return
    if (drawHistory.some((draw) => draw.optionId === selectedResult.id)) {
      lastSyncedSpinIdRef.current = selectedResult.id
      return
    }

    lastSyncedSpinIdRef.current = selectedResult.id
    const drawNumber = (drawHistory[drawHistory.length - 1]?.drawNumber || 0) + 1
    const shouldLock = !!settings.spinBehavior.removeWinnerAfterSpin || lockWinners
    const record: RaffleDrawRecord = {
      drawNumber,
      name: selectedResult.name,
      optionId: selectedResult.id,
      timestamp: new Date().toISOString(),
      prizeLabel: prizeLabelForDraw(drawNumber, prizePlaces),
      locked: shouldLock,
    }
    const nextLocked =
      shouldLock && selectedResult.id
        ? Array.from(new Set([...lockedWinnerIds, selectedResult.id]))
        : lockedWinnerIds

    patchRaffleData({
      drawHistory: [...drawHistory, record],
      lockedWinnerIds: nextLocked,
    })
    openWinnerScreen([record])
  }, [
    drawHistory,
    lockWinners,
    lockedWinnerIds,
    openWinnerScreen,
    patchRaffleData,
    prizePlaces,
    selectedResult,
    settings.spinBehavior.removeWinnerAfterSpin,
  ])

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      await loadSettings()
      if (cancelled) return
      setCurrentTool("raffle-spin-wheel")
      const wheels = useWheelManagerStore.getState().wheelsByTool["raffle-spin-wheel"] || []
      if (wheels.length === 0) {
        createNewWheel("raffle-spin-wheel", "My Raffle")
      }
      const latest = useSettingsStore.getState().settings
      if (!latest.spinBehavior.removeWinnerAfterSpin) {
        syncEliminationWithSettings(true)
      } else {
        setActionMode("elimination")
      }

      const wheel = useWheelManagerStore.getState().getCurrentWheel()
      const data = wheel?.data as RaffleSpinWheelData | undefined
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

      if (!cancelled) setToolReady(true)
    }
    void init()
    return () => {
      cancelled = true
    }
  }, [createNewWheel, loadSettings, setCurrentTool, syncEliminationWithSettings])

  useEffect(() => {
    if (!toolReady || !deepLink || deepLinkAppliedRef.current) return
    deepLinkAppliedRef.current = true
    applyRaffleSpinWheelUseCase(deepLink.useCaseId)
    setActiveUseCaseId(deepLink.useCaseId)
    syncEliminationWithSettings(deepLink.config.elimination)
    lastSyncedSpinIdRef.current = null
  }, [deepLink, syncEliminationWithSettings, toolReady])

  const onSearchParams = useCallback(
    (params: URLSearchParams) => {
      const template = raffleSpinWheelUseCaseFromTemplate(params.get("template"))
      if (!template) return
      const spokePath = getRaffleSpokePathForUseCase(template)
      // Legacy ?template= → dedicated spoke slug
      if (typeof window !== "undefined" && window.location.pathname !== spokePath) {
        window.location.replace(spokePath)
        return
      }
      const useCase = getRaffleSpinWheelUseCase(template)
      if (!useCase) return
      applyRaffleSpinWheelUseCase(template)
      setActiveUseCaseId(template)
      syncEliminationWithSettings(useCase.config.elimination)
      lastSyncedSpinIdRef.current = null
    },
    [syncEliminationWithSettings],
  )

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
      const theme = themes.find((item) => item.id === themeId) || PICKER_WHEEL_THEMES.find((item) => item.id === themeId)
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
      if (!wheel || wheel.toolType !== "raffle-spin-wheel") return
      const nextOptions = (Array.isArray((wheel.data as RaffleSpinWheelData).options)
        ? (wheel.data as RaffleSpinWheelData).options
        : []
      ).map((option, index) => ({
        ...option,
        color: theme?.colors?.length ? theme.colors[index % theme.colors.length] : option.color,
      }))
      updateWheelData("raffle-spin-wheel", wheel.id, {
        ...wheel.data,
        currentTheme: themeId,
        options: nextOptions,
      })
    },
    [getCurrentWheel, themes, updateSettings, updateWheelData],
  )

  const resetWheelForGame = useCallback(() => {
    const wheel = getCurrentWheel()
    if (!wheel || wheel.toolType !== "raffle-spin-wheel") return
    lastGameSpinRef.current = null
    lastSyncedSpinIdRef.current = null
    updateWheelData("raffle-spin-wheel", wheel.id, {
      ...wheel.data,
      totalSpins: 0,
      spinHistory: [],
      recentResults: [],
      selectedResult: null,
      lastResult: null,
      drawHistory: [],
      lockedWinnerIds: [],
    })
    setSpinHistory([])
  }, [getCurrentWheel, updateWheelData])

  const handleSpinCompleted = useCallback(() => {
    const wheel = getCurrentWheel()
    if (!wheel || wheel.toolType !== "raffle-spin-wheel") return
    const data = wheel.data as RaffleSpinWheelData
    const resultName = data.selectedResult?.name || data.lastResult?.name
    if (!resultName) return

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
      updateWheelData("raffle-spin-wheel", wheel.id, {
        ...data,
        achievements: updatedAchievements,
        themes: updatedThemes,
      })
    }
  }, [
    achievements,
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
        {!isFullscreen && (
          <Header
            onOpenSettings={() => setShowSettings(true)}
            onOpenGames={() => setShowGameModes(true)}
          />
        )}

        {isFullscreen ? (
          <div className="flex min-h-full flex-col items-center justify-center p-3 sm:p-4">{wheelSection}</div>
        ) : (
          <main className="w-full px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-3 text-center sm:mb-4">
              <ToolPageTitle
                toolType="raffle-spin-wheel"
                title={shortTitle ?? RAFFLE_SPIN_WHEEL_SHORT_TITLE}
              />
              <p className="mt-1 px-2 text-sm text-gray-600">
                {toolSubtitle ?? "Serious random drawing for raffles, contests, and giveaways"}
              </p>
            </div>

            {isAdvancedGameActive && currentSession && (
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

            <RafflePopularTemplates />
            {activeUseCaseId && (
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                <Badge className="bg-amber-700 text-white hover:bg-amber-700">
                  Setup: {getRaffleSpinWheelUseCase(activeUseCaseId)?.label}
                </Badge>
                {actionMode === "elimination" && (
                  <Badge variant="secondary">Elimination on</Badge>
                )}
                {lockWinners && <Badge variant="secondary">Lock winners</Badge>}
                {settings.spinBehavior.mysterySpin && (
                  <Badge variant="secondary">Mystery wheel</Badge>
                )}
                {settings.spinBehavior.mysteryResult && (
                  <Badge variant="secondary">Mystery result</Badge>
                )}
              </div>
            )}

            <RaffleDrawControls
              activeCount={activePool.length}
              winnerCount={winnerCount}
              onWinnerCountChange={setWinnerCount}
              lockWinners={lockWinners}
              onLockWinnersChange={setLockWinners}
              onDraw={handleMultiDraw}
              drawHistory={drawHistory}
              prizePlaces={prizePlaces}
              onPrizePlacesChange={(places) => patchRaffleData({ prizePlaces: places })}
              resultTitle={shortTitle ?? RAFFLE_SPIN_WHEEL_SHORT_TITLE}
              onGenerateTickets={handleGenerateTickets}
              onExpandWeightsAsTickets={handleExpandWeightsAsTickets}
              onClearHistory={() => {
                patchRaffleData({ drawHistory: [], lockedWinnerIds: [] })
                lastSyncedSpinIdRef.current = null
                showToast("Raffle history cleared.", "info")
              }}
              onOpenWinnerScreen={() => {
                if (drawHistory.length === 0) return
                openWinnerScreen(drawHistory.slice(-Math.max(1, winnerCount)))
              }}
            />

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
                    className="absolute left-2 top-2 z-10 border-amber-500 bg-white px-2 py-1 text-xs text-amber-700 shadow-sm hover:bg-amber-50 sm:left-4 sm:top-4 sm:px-3"
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
                      toolType="raffle-spin-wheel"
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

            <RaffleWinnerScreen
              open={winnerScreenOpen}
              onOpenChange={setWinnerScreenOpen}
              draws={winnerBatch}
              resultTitle={shortTitle ?? RAFFLE_SPIN_WHEEL_SHORT_TITLE}
              fullHistory={drawHistory}
            />

            <ToolBreadcrumbs />
            {seoIntro}
            {seoSections}
          </main>
        )}

        {!isFullscreen && <Footer />}
        {showSettings && <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />}
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
            ...analyzeSpinData(
              spinHistory.length > 0
                ? spinHistory
                : drawHistory.map((draw, index) => ({
                    id: `raffle-draw-${draw.drawNumber}-${index}`,
                    timestamp: new Date(draw.timestamp),
                    result: draw.name,
                    options: options.map((option) => option.name),
                    mode: "manual" as const,
                    theme: currentTheme,
                    spinDuration: settings.spinBehavior?.spinningDuration || 3,
                  })),
            ),
            totalSpins: raffleData?.totalSpins || drawHistory.length || 0,
            uniqueResults: new Set(
              (drawHistory.length > 0 ? drawHistory.map((d) => d.name) : allWheelResults.map((r: any) => r.name)).filter(
                Boolean,
              ),
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

export default function RaffleSpinWheelApp(props: RaffleSpinWheelAppProps) {
  return (
    <ToastProvider>
      <RaffleSpinWheelAppInner {...props} />
    </ToastProvider>
  )
}
