"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Confetti from "react-confetti"
import Image from "next/image"
import { Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WheelCanvas, resolveNumberFromRotation } from "@/components/wheel-canvas"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { useSettingsStore } from "@/stores/settings-store"
import {
  useWheelManagerStore,
  type FortuneWheelData,
  type FortuneWheelEntry,
  type FortuneWheelEntryKind,
} from "@/stores/wheel-manager-store"

type Props = {
  currentTheme?: string
  onSpinCompleted?: () => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  removeWinnerAfterSpin?: boolean
  showResultsButton?: boolean
  actionMode?: "normal" | "elimination" | "manual"
}

const EMPTY: FortuneWheelData = {
  entries: [],
  viewMode: "wheel",
  actionMode: "normal",
  isSpinning: false,
  spinRotation: 0,
  selectedResult: null,
  totalSpins: 0,
  recentResults: [],
  spinHistory: [],
}

const RESULT_STYLES: Record<FortuneWheelEntryKind, { box: string; label: string; copy: string }> = {
  bankrupt: { box: "border-slate-700 bg-slate-950 text-white", label: "text-slate-300", copy: "BANKRUPT" },
  lose_turn: { box: "border-red-400 bg-red-50 text-red-950", label: "text-red-700", copy: "LOSE A TURN" },
  cash: { box: "border-emerald-400 bg-emerald-50 text-emerald-950", label: "text-emerald-700", copy: "CASH WEDGE" },
  prize: { box: "border-amber-400 bg-amber-50 text-amber-950", label: "text-amber-700", copy: "PRIZE WEDGE" },
  special: { box: "border-violet-400 bg-violet-50 text-violet-950", label: "text-violet-700", copy: "SPECIAL WEDGE" },
}

const DEFAULT_RESULT_STYLE = {
  box: "border-violet-400 bg-violet-50 text-violet-950",
  label: "text-violet-700",
  copy: "RESULT",
}

const resultStyle = (kind?: FortuneWheelEntryKind) => kind ? RESULT_STYLES[kind] : DEFAULT_RESULT_STYLE

export default function FortuneWheelSection({
  currentTheme = "classic",
  onSpinCompleted,
  isFullscreen = false,
  onToggleFullscreen,
  removeWinnerAfterSpin = false,
  showResultsButton = true,
  actionMode = "normal",
}: Props) {
  const wheel = useWheelManagerStore(
    (state) =>
      (state.wheelsByTool[state.currentTool] || []).find((item) => item.id === state.currentWheelId) || null,
  )
  const data = (wheel?.data as FortuneWheelData | undefined) ?? EMPTY
  const confettiEnabled = useSettingsStore(
    (state) => state.settings.confettiSound?.enableConfetti !== false,
  )
  const soundEnabled = useSettingsStore((state) => !!state.settings.confettiSound?.enableSound)
  const soundVolume = useSettingsStore((state) => state.settings.confettiSound?.soundVolume ?? 0.5)
  const mysteryResult = useSettingsStore((state) => !!state.settings.spinBehavior?.mysteryResult)
  const spinningDuration = useSettingsStore((state) => state.settings.spinBehavior?.spinningDuration ?? 10)
  const settings = useSettingsStore((state) => state.settings)
  const [rotation, setRotation] = useState(data.currentRotation || 0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedResult, setSelectedResult] = useState<FortuneWheelEntry | null>(null)
  const [mysteryRevealed, setMysteryRevealed] = useState(true)
  const [muted, setMuted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiBurstId, setConfettiBurstId] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 })
  const pendingWinner = useRef<FortuneWheelEntry | null>(null)
  const finalRotation = useRef(rotation)
  const audio = useRef<SpinAudioController | null>(null)
  const shouldCelebrateRef = useRef(false)

  const themeColors = useMemo(
    () => PICKER_WHEEL_THEMES.find((theme) => theme.id === currentTheme)?.colors,
    [currentTheme],
  )

  const activeEntries = useMemo(
    () => data.entries.filter((entry) => entry.enabled !== false && entry.name.trim()),
    [data.entries],
  )

  const canvasItems = useMemo(
    () =>
      activeEntries.map((entry, index) => ({
        value: entry.name,
        weight: 1,
        color: entry.color || themeColors?.[index % (themeColors?.length || 1)] || "#7c3aed",
        id: entry.id,
      })),
    [activeEntries, themeColors],
  )

  const updateData = useCallback(
    (partial: Partial<FortuneWheelData>) => {
      if (!wheel) return
      const latest = useWheelManagerStore.getState().getCurrentWheel()
      const latestData = (latest?.data as FortuneWheelData | undefined) ?? data
      useWheelManagerStore.getState().updateWheelData("fortune-wheel", wheel.id, { ...latestData, ...partial })
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
    window.addEventListener("open-fortune-results", open)
    return () => window.removeEventListener("open-fortune-results", open)
  }, [])

  useEffect(() => {
    setSelectedResult(null)
    setMysteryRevealed(true)
    setShowConfetti(false)
    shouldCelebrateRef.current = false
    setRotation(data.currentRotation || 0)
  }, [wheel?.id])

  useEffect(() => () => audio.current?.stop(), [])

  useEffect(() => {
    if (!selectedResult || isSpinning) return
    if (mysteryResult && !mysteryRevealed) return
    if (!shouldCelebrateRef.current) return
    shouldCelebrateRef.current = false

    const allowConfetti =
      confettiEnabled &&
      selectedResult.kind !== "bankrupt" &&
      selectedResult.kind !== "lose_turn"

    if (allowConfetti) {
      setShowConfetti(false)
      const start = window.setTimeout(() => {
        setConfettiBurstId((id) => id + 1)
        setShowConfetti(true)
      }, 0)
      const stop = window.setTimeout(() => setShowConfetti(false), 5500)
      if (soundEnabled && !muted) {
        const winAudio = new Audio("/sound-win.mp3")
        winAudio.volume = soundVolume
        winAudio.play().catch(() => {})
      }
      return () => {
        window.clearTimeout(start)
        window.clearTimeout(stop)
      }
    }

    if (soundEnabled && !muted) {
      const winAudio = new Audio("/sound-win.mp3")
      winAudio.volume = soundVolume
      winAudio.play().catch(() => {})
    }
  }, [
    confettiEnabled,
    isSpinning,
    muted,
    mysteryResult,
    mysteryRevealed,
    selectedResult,
    soundEnabled,
    soundVolume,
  ])

  const commitResult = useCallback(
    (result: FortuneWheelEntry) => {
      if (!wheel) return
      shouldCelebrateRef.current = true
      setSelectedResult(result)
      setMysteryRevealed(!mysteryResult)
      const latest =
        (useWheelManagerStore.getState().getCurrentWheel()?.data as FortuneWheelData | undefined) ?? data
      const spinRecord = {
        id: `spin-${Date.now()}`,
        timestamp: new Date(),
        result: result.name,
        options: activeEntries.map((entry) => entry.name),
        mode: actionMode === "manual" ? ("manual" as const) : ("spin" as const),
        theme: currentTheme,
        spinDuration: spinningDuration,
      }
      updateData({
        entries: removeWinnerAfterSpin
          ? latest.entries.map((entry) => (entry.id === result.id ? { ...entry, enabled: false } : entry))
          : latest.entries,
        selectedResult: result,
        totalSpins: (latest.totalSpins || 0) + 1,
        recentResults: [...(latest.recentResults || []), result].slice(-10),
        spinHistory: [...(latest.spinHistory || []), spinRecord].slice(-50),
        currentRotation: finalRotation.current,
        isSpinning: false,
      })
      onSpinCompleted?.()
    },
    [
      actionMode,
      activeEntries,
      currentTheme,
      data,
      mysteryResult,
      onSpinCompleted,
      removeWinnerAfterSpin,
      spinningDuration,
      updateData,
      wheel,
    ],
  )

  const handleSpinComplete = useCallback(() => {
    const result = pendingWinner.current
    pendingWinner.current = null
    audio.current?.stop()
    setIsSpinning(false)
    if (!result) return
    commitResult(result)
  }, [commitResult])

  const spin = () => {
    if (isSpinning || !canvasItems.length || actionMode === "manual") return
    const next = rotation + 4320 + Math.random() * 360
    const resolved = resolveNumberFromRotation(next, canvasItems)
    if (!resolved) return
    pendingWinner.current = activeEntries[resolved.index] || null
    finalRotation.current = next
    setSelectedResult(null)
    setMysteryRevealed(true)
    setShowConfetti(false)
    shouldCelebrateRef.current = false
    setIsSpinning(true)
    setRotation(next)
    updateData({ isSpinning: true, spinRotation: next })
    if (soundEnabled && !muted) {
      audio.current ??= createSpinAudioController()
      audio.current.startWhoosh("/wheel-sound.mp3", soundVolume)
    }
  }

  const pickManual = (entry: FortuneWheelEntry) => {
    if (isSpinning) return
    setShowConfetti(false)
    finalRotation.current = rotation
    commitResult(entry)
  }

  const selectedStyle = selectedResult ? resultStyle(selectedResult.kind) : null
  const showHiddenResult = !!selectedResult && mysteryResult && !mysteryRevealed

  return (
    <div className="relative">
      {showConfetti &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            <Confetti
              key={confettiBurstId}
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={400}
              recycle={false}
            />
          </div>,
          document.body,
        )}
      <div className="relative flex flex-col items-center">
        <div className="relative w-full max-w-[680px]">
          <button
            type="button"
            className="block w-full"
            onClick={spin}
            disabled={isSpinning || !canvasItems.length || actionMode === "manual"}
            aria-label="Spin fortune wheel"
          >
            <WheelCanvas
              numbers={canvasItems}
              isSpinning={isSpinning}
              settings={settings}
              rotation={rotation}
              size={680}
              onRotationFrame={(frame, count) => {
                if (!muted && soundEnabled) {
                  audio.current?.syncFrame(frame, count, soundVolume)
                }
              }}
              onSpinComplete={handleSpinComplete}
            />
          </button>
          {showResultsButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResults(true)}
              className="absolute left-2 top-2 z-10 border-violet-500 bg-white text-xs text-violet-800 shadow-sm"
            >
              Results ({data.recentResults?.length || 0})
            </Button>
          )}
          <div className="absolute bottom-2 left-2 z-20 flex flex-col gap-2 sm:bottom-4 sm:left-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMuted((value) => !value)}
              className="h-9 w-9 bg-white/90 p-0 shadow-md"
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            {onToggleFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                className="h-9 w-9 bg-white/90 p-0 shadow-md"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {actionMode === "manual" ? (
          <div className="mt-6 w-full max-w-md space-y-3">
            <p className="text-center text-sm text-slate-600">
              Manual mode — tap a wedge to select it without spinning.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {activeEntries.map((entry) => (
                <Button
                  key={entry.id}
                  type="button"
                  variant="outline"
                  className="h-auto whitespace-normal py-2 text-left"
                  style={{ borderColor: entry.color }}
                  onClick={() => pickManual(entry)}
                >
                  {entry.name}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Button
            onClick={spin}
            disabled={isSpinning || !canvasItems.length}
            className="mt-6 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 px-8 py-3 text-lg font-semibold text-white shadow-lg"
          >
            {isSpinning ? "Spinning..." : "SPIN THE FORTUNE WHEEL"}
          </Button>
        )}

        {selectedResult && selectedStyle && !isSpinning && (
          <div
            className={`mb-4 mt-5 max-w-md rounded-xl border-2 p-5 text-center shadow-md ${selectedStyle.box} ${
              showHiddenResult ? "cursor-pointer" : ""
            }`}
            onClick={() => {
              if (showHiddenResult) setMysteryRevealed(true)
            }}
            onKeyDown={(event) => {
              if (showHiddenResult && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault()
                setMysteryRevealed(true)
              }
            }}
            role={showHiddenResult ? "button" : undefined}
            tabIndex={showHiddenResult ? 0 : undefined}
          >
            <p className={`text-sm font-semibold uppercase tracking-widest ${selectedStyle.label}`}>
              {showHiddenResult ? "MYSTERY RESULT" : selectedStyle.copy}
            </p>
            {!showHiddenResult && selectedResult.imageUrl && (
              <Image
                src={selectedResult.imageUrl}
                alt=""
                width={160}
                height={160}
                unoptimized
                className="mx-auto mt-3 h-32 w-32 rounded-lg object-cover"
              />
            )}
            <p className="mt-1 text-3xl font-black">{showHiddenResult ? "?" : selectedResult.name}</p>
            {showHiddenResult ? (
              <p className="mt-2 text-sm opacity-90">Tap to reveal</p>
            ) : (
              selectedResult.winMessage && <p className="mt-2 text-sm opacity-90">{selectedResult.winMessage}</p>
            )}
          </div>
        )}
        {!canvasItems.length && (
          <p className="mt-4 text-sm text-slate-500">Add and enable at least one wedge to spin.</p>
        )}
      </div>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fortune wheel results</DialogTitle>
            <DialogDescription>Your latest wedges, newest first.</DialogDescription>
          </DialogHeader>
          <ol className="max-h-80 space-y-2 overflow-y-auto">
            {[...(data.recentResults || [])].reverse().map((result: FortuneWheelEntry, index) => {
              const style = resultStyle(result.kind)
              return (
                <li key={`${result.id}-${index}`} className={`rounded-lg border px-3 py-2 ${style.box}`}>
                  <span className="block font-medium">{result.name}</span>
                  {result.winMessage && (
                    <span className="block truncate text-xs opacity-75">{result.winMessage}</span>
                  )}
                </li>
              )
            })}
            {!data.recentResults?.length && (
              <li className="py-8 text-center text-sm text-slate-500">No results yet.</li>
            )}
          </ol>
        </DialogContent>
      </Dialog>
    </div>
  )
}
