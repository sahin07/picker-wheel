"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import Confetti from "react-confetti"
import { Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WheelCanvas, resolveNumberFromRotation } from "@/components/wheel-canvas"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore, type PrizeWheelData, type PrizeWheelEntry } from "@/stores/wheel-manager-store"

type Props = {
  currentTheme?: string; onSpinCompleted?: () => void; isFullscreen?: boolean
  onToggleFullscreen?: () => void; removeWinnerAfterSpin?: boolean; showResultsButton?: boolean
}
const EMPTY: PrizeWheelData = {
  entries: [], viewMode: "wheel", actionMode: "normal", isSpinning: false,
  spinRotation: 0, selectedResult: null, totalSpins: 0, recentResults: [], spinHistory: [],
}

export default function PrizeWheelSection({
  currentTheme = "classic", onSpinCompleted, isFullscreen = false,
  onToggleFullscreen, removeWinnerAfterSpin = false, showResultsButton = true,
}: Props) {
  const wheel = useWheelManagerStore((state) => {
    const prizeWheels = state.wheelsByTool["prize-wheel"] || []
    return (
      prizeWheels.find((item) => item.id === state.currentWheelId) ||
      prizeWheels[0] ||
      null
    )
  })
  const rawData = (wheel?.data as PrizeWheelData | undefined) ?? EMPTY
  const data: PrizeWheelData = {
    ...EMPTY,
    ...rawData,
    entries: Array.isArray(rawData.entries) ? rawData.entries : [],
    recentResults: Array.isArray(rawData.recentResults) ? rawData.recentResults : [],
    spinHistory: Array.isArray(rawData.spinHistory) ? rawData.spinHistory : [],
  }
  const { settings } = useSettingsStore()
  const [rotation, setRotation] = useState(data.currentRotation || 0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedResult, setSelectedResult] = useState<PrizeWheelEntry | null>(null)
  const [muted, setMuted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 })
  const pendingWinner = useRef<PrizeWheelEntry | null>(null)
  const finalRotation = useRef(rotation)
  const audio = useRef<SpinAudioController | null>(null)
  const activeEntries = useMemo(
    () => data.entries.filter((entry) => entry.enabled !== false && entry.name.trim()),
    [data.entries],
  )
  const canvasItems = useMemo(() => activeEntries.map((entry) => ({
    value: entry.name, weight: 1, color: entry.color, id: entry.id,
  })), [activeEntries])

  const updateData = useCallback((partial: Partial<PrizeWheelData>) => {
    if (!wheel) return
    const latest = useWheelManagerStore.getState().getCurrentWheel()
    const latestRaw = (latest?.data as PrizeWheelData | undefined) ?? data
    const latestData: PrizeWheelData = {
      ...EMPTY,
      ...latestRaw,
      entries: Array.isArray(latestRaw.entries) ? latestRaw.entries : [],
      recentResults: Array.isArray(latestRaw.recentResults) ? latestRaw.recentResults : [],
      spinHistory: Array.isArray(latestRaw.spinHistory) ? latestRaw.spinHistory : [],
    }
    useWheelManagerStore.getState().updateWheelData("prize-wheel", wheel.id, { ...latestData, ...partial })
  }, [data, wheel])

  useEffect(() => {
    const resize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    resize(); window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])
  useEffect(() => {
    const open = () => setShowResults(true)
    window.addEventListener("open-prize-results", open)
    return () => window.removeEventListener("open-prize-results", open)
  }, [])
  useEffect(() => { setSelectedResult(null); setRotation(data.currentRotation || 0) }, [wheel?.id])
  useEffect(() => () => audio.current?.stop(), [])
  useEffect(() => {
    if (!selectedResult || isSpinning) return
    if (settings.confettiSound?.enableConfetti !== false) setShowConfetti(true)
    if (settings.confettiSound?.enableSound && !muted) {
      const winAudio = new Audio("/sound-win.mp3")
      winAudio.volume = settings.confettiSound.soundVolume || 0.5
      winAudio.play().catch(() => {})
    }
    const timer = window.setTimeout(() => setShowConfetti(false), 5000)
    return () => window.clearTimeout(timer)
  }, [isSpinning, muted, selectedResult, settings.confettiSound])

  const handleSpinComplete = useCallback(() => {
    const result = pendingWinner.current
    pendingWinner.current = null; audio.current?.stop(); setIsSpinning(false)
    if (!result || !wheel) return
    setSelectedResult(result)
    const latest = (useWheelManagerStore.getState().getCurrentWheel()?.data as PrizeWheelData | undefined) ?? data
    const latestEntries = Array.isArray(latest.entries) ? latest.entries : data.entries
    const spinRecord = {
      id: `spin-${Date.now()}`, timestamp: new Date(), result: result.name,
      options: activeEntries.map((entry) => entry.name), mode: "manual" as const,
      theme: currentTheme, spinDuration: settings.spinBehavior?.spinningDuration ?? 10,
    }
    updateData({
      entries: removeWinnerAfterSpin
        ? latestEntries.map((entry) => entry.id === result.id ? { ...entry, enabled: false } : entry)
        : latestEntries,
      selectedResult: result, totalSpins: (latest.totalSpins || 0) + 1,
      recentResults: [...(latest.recentResults || []), result].slice(-10),
      spinHistory: [...(latest.spinHistory || []), spinRecord].slice(-50),
      currentRotation: finalRotation.current, isSpinning: false,
    })
    onSpinCompleted?.()
  }, [activeEntries, currentTheme, data, onSpinCompleted, removeWinnerAfterSpin, settings.spinBehavior?.spinningDuration, updateData, wheel])

  const spin = () => {
    if (isSpinning || !canvasItems.length) return
    const next = rotation + 3600 + Math.random() * 360
    const resolved = resolveNumberFromRotation(next, canvasItems)
    if (!resolved) return
    pendingWinner.current = activeEntries[resolved.index] || null
    finalRotation.current = next; setSelectedResult(null); setIsSpinning(true); setRotation(next)
    updateData({ isSpinning: true, spinRotation: next })
    if (settings.confettiSound?.enableSound && !muted) {
      audio.current ??= createSpinAudioController()
      audio.current.startWhoosh("/wheel-sound.mp3", settings.confettiSound.soundVolume || 0.5)
    }
  }

  return (
    <div className="relative">
      {showConfetti && typeof document !== "undefined" && createPortal(
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
          <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={400} recycle={false} />
        </div>, document.body)}
      <div className="relative flex flex-col items-center">
        <div className="relative w-full max-w-[680px]">
          <button type="button" className="block w-full" onClick={spin}
            disabled={isSpinning || !canvasItems.length} aria-label="Spin prize wheel">
            <WheelCanvas numbers={canvasItems} isSpinning={isSpinning} settings={settings}
              rotation={rotation} size={680}
              onRotationFrame={(frame, count) => {
                if (!muted && settings.confettiSound?.enableSound)
                  audio.current?.syncFrame(frame, count, settings.confettiSound.soundVolume || 0.5)
              }}
              onSpinComplete={handleSpinComplete} />
          </button>
          {showResultsButton && <Button type="button" variant="outline" size="sm"
            onClick={() => setShowResults(true)}
            className="absolute left-2 top-2 z-10 border-amber-500 bg-white text-xs text-amber-800 shadow-sm">
            Results ({data.recentResults?.length || 0})
          </Button>}
          <div className="absolute bottom-2 left-2 z-20 flex flex-col gap-2 sm:bottom-4 sm:left-4">
            <Button type="button" variant="ghost" size="sm" onClick={() => setMuted((value) => !value)}
              className="h-9 w-9 bg-white/90 p-0 shadow-md" title={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            {onToggleFullscreen && <Button type="button" variant="ghost" size="sm" onClick={onToggleFullscreen}
              className="h-9 w-9 bg-white/90 p-0 shadow-md" title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>}
          </div>
        </div>
        <Button type="button" onClick={spin} disabled={isSpinning || !canvasItems.length}
          className="mt-6 bg-gradient-to-r from-amber-500 to-rose-500 px-8 py-3 text-lg font-semibold text-white shadow-lg">
          {isSpinning ? "Spinning..." : "SPIN PRIZE WHEEL"}
        </Button>
        {selectedResult && !isSpinning && <div className="mb-4 mt-5 max-w-md rounded-xl border-2 border-amber-300 bg-amber-50 p-5 text-center shadow-sm">
          {selectedResult.imageUrl && <Image src={selectedResult.imageUrl} alt="" width={144} height={96}
            unoptimized className="mx-auto mb-3 h-24 w-36 rounded-lg object-contain" />}
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Selected prize</p>
          <p className="mt-1 text-2xl font-bold text-amber-950">{selectedResult.name}</p>
          {selectedResult.winMessage && <p className="mt-2 text-sm text-slate-700">{selectedResult.winMessage}</p>}
        </div>}
        {!canvasItems.length && <p className="mt-4 text-sm text-slate-500">Add and enable at least one prize to spin.</p>}
      </div>
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent>
          <DialogHeader><DialogTitle>Prize wheel results</DialogTitle>
            <DialogDescription>Your latest selected prizes, newest first.</DialogDescription></DialogHeader>
          <ol className="max-h-80 space-y-2 overflow-y-auto">
            {[...(data.recentResults || [])].reverse().map((result: PrizeWheelEntry, index) => <li
              key={`${result.id}-${index}`} className="flex items-center gap-3 rounded-lg border px-3 py-2">
              {result.imageUrl && <Image src={result.imageUrl} alt="" width={40} height={40} unoptimized className="h-10 w-10 rounded object-cover" />}
              <span className="min-w-0 flex-1"><span className="block font-medium">{result.name}</span>
                {result.winMessage && <span className="block truncate text-xs text-slate-500">{result.winMessage}</span>}</span>
            </li>)}
            {!data.recentResults?.length && <li className="py-8 text-center text-sm text-slate-500">No results yet.</li>}
          </ol>
        </DialogContent>
      </Dialog>
    </div>
  )
}
