"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Confetti from "react-confetti"
import {
  BarChart3,
  Gamepad2,
  Maximize2,
  Minimize2,
  Palette,
  Trophy,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { WheelCanvas, resolveNumberFromRotation } from "@/components/wheel-canvas"
import { buildProbabilityStats } from "@/lib/giveaway-utils"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { useSettingsStore } from "@/stores/settings-store"
import {
  useWheelManagerStore,
  type WeightedWheelData,
  type WeightedWheelEntry,
} from "@/stores/wheel-manager-store"

interface WeightedWheelSectionProps {
  onOpenAchievements?: () => void
  onOpenThemeSelector?: () => void
  onOpenAnalytics?: () => void
  onOpenSocialHub?: () => void
  onOpenGameModes?: () => void
  totalPoints?: number
  currentTheme?: string
  themes?: any[]
  spinHistory?: any[]
  currentUser?: any
  isGameActive?: boolean
  currentGameMode?: string
  onSpinCompleted?: () => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  removeWinnerAfterSpin?: boolean
  showResultsButton?: boolean
}

const EMPTY_DATA: WeightedWheelData = {
  entries: [],
  viewMode: "wheel",
  actionMode: "normal",
  isSpinning: false,
  spinRotation: 0,
  selectedResult: null,
  totalSpins: 0,
  currentRotation: 0,
  recentResults: [],
  spinHistory: [],
}

export default function WeightedWheelSection({
  onOpenAchievements,
  onOpenThemeSelector,
  onOpenAnalytics,
  onOpenSocialHub,
  onOpenGameModes,
  totalPoints = 0,
  currentTheme = "classic",
  isGameActive = false,
  currentGameMode,
  onSpinCompleted,
  isFullscreen = false,
  onToggleFullscreen,
  removeWinnerAfterSpin = false,
  showResultsButton = true,
}: WeightedWheelSectionProps) {
  const wheel = useWheelManagerStore((state) => {
    const wheels = state.wheelsByTool[state.currentTool] || []
    return wheels.find((item) => item.id === state.currentWheelId) || null
  })
  const data = (wheel?.data as WeightedWheelData | undefined) ?? EMPTY_DATA
  const { settings } = useSettingsStore()
  const [rotation, setRotation] = useState(data.currentRotation || 0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedResult, setSelectedResult] = useState<WeightedWheelEntry | null>(null)
  const [muted, setMuted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 })
  const pendingWinnerRef = useRef<WeightedWheelEntry | null>(null)
  const finalRotationRef = useRef(rotation)
  const audioRef = useRef<SpinAudioController | null>(null)

  const activeEntries = useMemo(
    () => (data.entries || []).filter((entry) => entry.enabled !== false && entry.name.trim()),
    [data.entries],
  )
  const probabilityStats = useMemo(
    () => buildProbabilityStats(activeEntries),
    [activeEntries],
  )
  const canvasItems = useMemo(
    () =>
      activeEntries.map((entry, index) => {
        const probability = probabilityStats[index]?.probability ?? 0
        return {
          value:
            activeEntries.length <= 8
              ? `${entry.name} (${probability.toFixed(probability < 10 ? 1 : 0)}%)`
              : entry.name,
          weight: Math.max(1, entry.weight || 1),
          color: entry.color,
          id: entry.id,
        }
      }),
    [activeEntries, probabilityStats],
  )

  const updateData = useCallback(
    (partial: Partial<WeightedWheelData>) => {
      if (!wheel) return
      const latest = useWheelManagerStore.getState().getCurrentWheel()
      const latestData = (latest?.data as WeightedWheelData | undefined) ?? data
      useWheelManagerStore
        .getState()
        .updateWheelData("weighted-wheel", wheel.id, { ...latestData, ...partial })
    },
    [data, wheel],
  )

  useEffect(() => {
    const resize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  useEffect(() => {
    const open = () => setShowResults(true)
    window.addEventListener("open-weighted-results", open)
    return () => window.removeEventListener("open-weighted-results", open)
  }, [])

  useEffect(() => {
    setSelectedResult(null)
    setRotation(data.currentRotation || 0)
  }, [wheel?.id])

  useEffect(() => {
    if (!selectedResult || isSpinning) return
    if (settings.confettiSound?.enableConfetti !== false) setShowConfetti(true)
    if (settings.confettiSound?.enableSound && !muted) {
      const audio = new Audio("/sound-win.mp3")
      audio.volume = settings.confettiSound.soundVolume || 0.5
      audio.play().catch(() => {})
    }
    const timeout = window.setTimeout(() => setShowConfetti(false), 5000)
    return () => window.clearTimeout(timeout)
  }, [isSpinning, muted, selectedResult, settings.confettiSound])

  useEffect(
    () => () => {
      audioRef.current?.stop()
    },
    [],
  )

  const handleSpinComplete = useCallback(() => {
    const result = pendingWinnerRef.current
    pendingWinnerRef.current = null
    audioRef.current?.stop()
    setIsSpinning(false)
    if (!result || !wheel) return

    setSelectedResult(result)
    const latestWheel = useWheelManagerStore.getState().getCurrentWheel()
    const latestData = (latestWheel?.data as WeightedWheelData | undefined) ?? data
    const spinRecord = {
      id: `spin-${Date.now()}`,
      timestamp: new Date(),
      result: result.name,
      options: activeEntries.map((entry) => entry.name),
      mode: "manual" as const,
      theme: currentTheme,
      spinDuration: settings.spinBehavior?.spinningDuration ?? 10,
    }
    const recentResults = [...(latestData.recentResults || []), result].slice(-10)
    const spinHistory = [...(latestData.spinHistory || []), spinRecord].slice(-50)
    const entries = removeWinnerAfterSpin
      ? (latestData.entries || []).map((entry) =>
          entry.id === result.id ? { ...entry, enabled: false } : entry,
        )
      : latestData.entries

    updateData({
      entries,
      selectedResult: result,
      totalSpins: (latestData.totalSpins || 0) + 1,
      recentResults,
      spinHistory,
      currentRotation: finalRotationRef.current,
      isSpinning: false,
    })
    onSpinCompleted?.()
  }, [
    activeEntries,
    currentTheme,
    data,
    onSpinCompleted,
    removeWinnerAfterSpin,
    settings.spinBehavior?.spinningDuration,
    updateData,
    wheel,
  ])

  const handleSpin = () => {
    if (isSpinning || canvasItems.length === 0) return
    const finalRotation = rotation + 360 * 10 + Math.random() * 360
    const resolved = resolveNumberFromRotation(finalRotation, canvasItems)
    if (!resolved) return
    pendingWinnerRef.current = activeEntries[resolved.index] || null
    finalRotationRef.current = finalRotation
    setSelectedResult(null)
    setIsSpinning(true)
    setRotation(finalRotation)
    updateData({ isSpinning: true, spinRotation: finalRotation })

    if (settings.confettiSound?.enableSound && !muted) {
      audioRef.current ??= createSpinAudioController()
      audioRef.current.startWhoosh(
        "/wheel-sound.mp3",
        settings.confettiSound.soundVolume || 0.5,
      )
    }
  }

  return (
    <div className="relative">
      {showConfetti &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={400}
              recycle={false}
              gravity={0.3}
            />
          </div>,
          document.body,
        )}

      <div className="relative flex flex-col items-center">
        <div className="relative w-full max-w-[680px]">
          <button
            type="button"
            className="block w-full"
            onClick={handleSpin}
            disabled={isSpinning || canvasItems.length === 0}
            aria-label="Spin weighted wheel"
          >
            <WheelCanvas
              numbers={canvasItems}
              isSpinning={isSpinning}
              settings={settings}
              rotation={rotation}
              size={680}
              onRotationFrame={(frame, count) => {
                if (!muted && settings.confettiSound?.enableSound) {
                  audioRef.current?.syncFrame(
                    frame,
                    count,
                    settings.confettiSound.soundVolume || 0.5,
                  )
                }
              }}
              onSpinComplete={handleSpinComplete}
            />
          </button>

          {showResultsButton && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowResults(true)}
              className="absolute left-2 top-2 z-10 border-violet-500 bg-white text-xs text-violet-700 shadow-sm sm:left-4 sm:top-4"
            >
              Results ({data.recentResults?.length || 0})
            </Button>
          )}

          <div className="absolute bottom-2 left-2 z-20 flex flex-col gap-2 sm:bottom-4 sm:left-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMuted((value) => !value)}
              className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white"
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            {onToggleFullscreen && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning || canvasItems.length === 0}
          className="mt-6 bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:from-violet-700 hover:to-blue-700"
        >
          {isSpinning ? "Spinning..." : "SPIN WHEEL"}
        </Button>

        {selectedResult && !isSpinning && (
          <div className="mb-4 mt-5 rounded-xl border-2 border-violet-300 bg-violet-50 p-5 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">
              Selected
            </p>
            <p className="mt-1 text-2xl font-bold text-violet-950">{selectedResult.name}</p>
          </div>
        )}

        {isGameActive && currentGameMode && (
          <p className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">
            Playing: {currentGameMode}
          </p>
        )}

        <div className="mb-4 mt-6 flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onOpenAchievements}>
            <Trophy className="mr-1 h-3.5 w-3.5" /> Achievements ({totalPoints})
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenThemeSelector}>
            <Palette className="mr-1 h-3.5 w-3.5" /> Themes
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenAnalytics}>
            <BarChart3 className="mr-1 h-3.5 w-3.5" /> Analytics
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenSocialHub}>
            <Users className="mr-1 h-3.5 w-3.5" /> Social
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenGameModes}>
            <Gamepad2 className="mr-1 h-3.5 w-3.5" /> Games
          </Button>
        </div>

        {canvasItems.length === 0 && (
          <p className="mt-3 text-center text-sm text-slate-500">
            Add and enable at least one entry to spin.
          </p>
        )}
      </div>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weighted wheel results</DialogTitle>
            <DialogDescription>Your most recent outcomes, newest first.</DialogDescription>
          </DialogHeader>
          <ol className="max-h-80 space-y-2 overflow-y-auto">
            {[...(data.recentResults || [])].reverse().map((result, index) => (
              <li
                key={`${result.id || result.name}-${index}`}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <span className="font-medium text-slate-800">{result.name || String(result)}</span>
                <span className="text-xs text-slate-500">#{data.recentResults.length - index}</span>
              </li>
            ))}
            {!data.recentResults?.length && (
              <li className="py-8 text-center text-sm text-slate-500">No results yet.</li>
            )}
          </ol>
        </DialogContent>
      </Dialog>
    </div>
  )
}
