"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import Confetti from "react-confetti"
import { Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PickerResultsModal from "@/components/picker-results-modal"
import { WheelFeatureActions } from "@/components/wheel-feature-actions"
import { WheelCanvas, resolveNumberFromRotation, type WheelCanvasHandle } from "@/components/wheel-canvas"
import { getAllDemonSlayerEntries } from "@/data/demon-slayer-characters"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore, type DemonSlayerWheelData } from "@/stores/wheel-manager-store"
import type { ActionMode, DemonSlayerEntry, SpinResult } from "@/types/demon-slayer-types"

type ThemeLike = { id: string; colors: string[] }

type Props = {
  currentTheme?: string
  themes?: ThemeLike[]
  onSpinCompleted?: () => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  removeWinnerAfterSpin?: boolean
  actionMode?: ActionMode
  onActionModeChange?: (mode: ActionMode) => void
  isGameActive?: boolean
  currentGameModeName?: string
  onOpenAchievements?: () => void
  onOpenThemeSelector?: () => void
  onOpenAnalytics?: () => void
  onOpenSocialHub?: () => void
  onOpenGameModes?: () => void
  totalPoints?: number
}

export default function DemonSlayerWheelSection({
  currentTheme = "classic", themes = PICKER_WHEEL_THEMES, onSpinCompleted, isFullscreen = false,
  onToggleFullscreen, removeWinnerAfterSpin = false,
  actionMode = "normal", onActionModeChange,
  isGameActive = false, currentGameModeName,
  onOpenAchievements, onOpenThemeSelector, onOpenAnalytics, onOpenSocialHub, onOpenGameModes,
  totalPoints = 0,
}: Props) {
  const wheel = useWheelManagerStore((state) =>
    (state.wheelsByTool["demon-slayer-wheel"] || []).find((item) => item.id === state.currentWheelId) || null)
  const data = wheel?.data as DemonSlayerWheelData | undefined
  const { settings } = useSettingsStore()
  const [rotation, setRotation] = useState(data?.rotation || 0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<DemonSlayerEntry | null>(null)
  const [muted, setMuted] = useState(false)
  const [manualName, setManualName] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [confettiBurst, setConfettiBurst] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 })
  const [wheelSize, setWheelSize] = useState(680)
  const pendingWinner = useRef<DemonSlayerEntry | null>(null)
  const finalRotation = useRef(rotation)
  const audio = useRef<SpinAudioController | null>(null)
  const canvasHandle = useRef<WheelCanvasHandle>(null)
  const wheelBoxRef = useRef<HTMLDivElement>(null)
  const soundEnabled = settings.confettiSound?.enableSound !== false
  // Match Fortnite/LoL: STOP is always available while spinning (Settings "Manually Stop" is also honored when true).
  const allowManualStop = true
  const spinDuration = settings.spinBehavior?.spinningDuration ?? 10
  const allEntries = useMemo(() => [...getAllDemonSlayerEntries(), ...(data?.customCharacters || [])], [data?.customCharacters])
  const activeEntries = useMemo(() => {
    const selected = new Set(data?.selectedCharacters || [])
    const ordered = data?.characterOrder || []
    const byId = new Map(allEntries.map((item) => [item.id, item]))
    const first = ordered.map((id) => byId.get(id)).filter(Boolean) as DemonSlayerEntry[]
    const included = new Set(first.map((item) => item.id))
    return [...first, ...allEntries.filter((item) => selected.has(item.id) && !included.has(item.id))]
      .filter((item) => selected.has(item.id))
  }, [allEntries, data?.characterOrder, data?.selectedCharacters])
  const modalResults = useMemo(
    () =>
      (data?.recentResults || []).slice(0, 10).map((result) => ({
        id: result.id,
        name: result.name,
        emoji: result.emoji,
        image: result.imageUrl,
      })),
    [data?.recentResults],
  )
  const theme = themes.find((item) => item.id === currentTheme) || PICKER_WHEEL_THEMES.find((item) => item.id === currentTheme) || PICKER_WHEEL_THEMES[0]
  const colors = data?.paletteColors?.length
    ? data.paletteColors
    : (settings.appearance?.toolColors?.length ? settings.appearance.toolColors : theme.colors)
  const canvasItems = useMemo(() => activeEntries.map((item, index) => ({
    id: item.id,
    value: data?.displayMode === "emoji" ? item.emoji
      : data?.displayMode === "name" ? item.name : `${item.emoji} ${item.name}`,
    weight: 1,
    color: colors[index % colors.length],
  })), [activeEntries, colors, data?.displayMode])

  const updateData = useCallback((partial: Partial<DemonSlayerWheelData>) => {
    if (!wheel || !data) return
    const latest = useWheelManagerStore.getState().getCurrentWheel()?.data as DemonSlayerWheelData | undefined
    useWheelManagerStore.getState().updateWheelData("demon-slayer-wheel", wheel.id, { ...(latest || data), ...partial })
  }, [data, wheel])

  useEffect(() => {
    const resize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      const width = wheelBoxRef.current?.clientWidth || Math.min(window.innerWidth - 32, 680)
      setWheelSize(Math.max(280, Math.min(680, Math.floor(width))))
    }
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])
  useEffect(() => {
    const open = () => setShowResults(true)
    window.addEventListener("open-demon-slayer-results", open)
    return () => window.removeEventListener("open-demon-slayer-results", open)
  }, [])
  useEffect(() => () => audio.current?.stop(), [])
  useEffect(() => { setWinner(null); setRotation(data?.rotation || 0) }, [wheel?.id])

  const handleSpinComplete = useCallback(() => {
    const result = pendingWinner.current
    pendingWinner.current = null; audio.current?.stop(); setIsSpinning(false)
    if (!result || !data) return
    setWinner(result)
    const spinResult: SpinResult = { character: result, timestamp: new Date() }
    const selectedCharacters = removeWinnerAfterSpin
      ? data.selectedCharacters.filter((id) => id !== result.id)
      : data.selectedCharacters
    updateData({
      selectedCharacters,
      characterOrder: removeWinnerAfterSpin
        ? data.characterOrder.filter((id) => id !== result.id)
        : data.characterOrder,
      selectedResult: spinResult,
      totalSpins: (data.totalSpins || 0) + 1,
      recentResults: [result, ...(data.recentResults || [])].slice(0, 10),
      spinHistory: [{
        id: `demon-slayer-spin-${Date.now()}`, timestamp: new Date(), result: result.name,
        options: activeEntries.map((item) => item.name), mode: "manual",
        theme: currentTheme, spinDuration,
      }, ...(data.spinHistory || [])].slice(0, 50),
      rotation: finalRotation.current,
      isSpinning: false,
    })
    if (settings.confettiSound?.enableConfetti !== false) setConfettiBurst((value) => value + 1)
    if (soundEnabled && !muted) {
      const win = new Audio("/sound-win.mp3")
      win.volume = settings.confettiSound?.soundVolume || 0.5
      void win.play().catch(() => {})
    }
    onSpinCompleted?.()
  }, [activeEntries, currentTheme, data, muted, onSpinCompleted, removeWinnerAfterSpin, settings.confettiSound, soundEnabled, spinDuration, updateData])

  const spin = () => {
    if (isSpinning || !canvasItems.length) return
    const next = rotation + 3600 + Math.random() * 360
    const resolved = resolveNumberFromRotation(next, canvasItems)
    if (!resolved) return
    pendingWinner.current = activeEntries[resolved.index] || null
    finalRotation.current = next; setWinner(null); setIsSpinning(true); setRotation(next)
    updateData({ isSpinning: true, rotation: next })
    if (soundEnabled && !muted) {
      audio.current ??= createSpinAudioController()
      audio.current.startWhoosh("/wheel-sound.mp3", settings.confettiSound?.soundVolume || 0.5)
    }
  }

  const handleManualStop = () => {
    if (!isSpinning || !allowManualStop) return
    const current = canvasHandle.current?.abortSpin() ?? rotation
    const resolved = resolveNumberFromRotation(current, canvasItems)
    if (!resolved) return
    pendingWinner.current = activeEntries[resolved.index] || null
    finalRotation.current = current
    setRotation(current)
    handleSpinComplete()
  }

  const addManualEntry = () => {
    const name = manualName.trim()
    if (!name || !data) return
    if (allEntries.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      const existing = allEntries.find((item) => item.name.toLowerCase() === name.toLowerCase())
      if (existing && !data.selectedCharacters.includes(existing.id)) {
        updateData({
          selectedCharacters: [...data.selectedCharacters, existing.id],
          characterOrder: [...(data.characterOrder || data.selectedCharacters), existing.id],
        })
      }
      setManualName("")
      return
    }
    const item: DemonSlayerEntry = {
      id: `demon-slayer-custom-${Date.now()}`, name, emoji: "✨", category: ["main"], custom: true,
      preview: `/placeholder.svg?text=${encodeURIComponent(name)}`,
    }
    updateData({
      customCharacters: [...(data.customCharacters || []), item],
      selectedCharacters: [...data.selectedCharacters, item.id],
      characterOrder: [...(data.characterOrder || data.selectedCharacters), item.id],
    })
    setManualName("")
  }

  return <div className={isFullscreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4 overflow-auto bg-white p-3 sm:space-y-6 sm:p-4"
    : "relative flex w-full min-w-0 max-w-full flex-col items-center space-y-4 sm:space-y-6"}>
    {confettiBurst > 0 && typeof document !== "undefined" && createPortal(
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
        <Confetti key={confettiBurst} width={windowSize.width} height={windowSize.height}
          numberOfPieces={350} recycle={false} onConfettiComplete={() => setConfettiBurst(0)} />
      </div>, document.body)}

      <div className="relative mx-auto flex w-full max-w-[680px] flex-col items-center">
      <div ref={wheelBoxRef} className={`relative w-full max-w-[680px] overflow-visible ${!isSpinning && canvasItems.length ? "cursor-pointer" : ""}`}>
        <button type="button" className="block w-full" onClick={spin}
          disabled={isSpinning || !canvasItems.length} aria-label="Spin Demon Slayer character wheel">
          <WheelCanvas ref={canvasHandle} numbers={canvasItems} isSpinning={isSpinning} settings={settings}
            rotation={rotation} size={wheelSize}
            onRotationFrame={(frame, count) => {
              if (!muted && soundEnabled)
                audio.current?.syncFrame(frame, count, settings.confettiSound?.soundVolume || 0.5)
            }}
            onSpinComplete={handleSpinComplete} />
        </button>
        <div className="absolute bottom-2 left-2 z-20 flex flex-col gap-2 sm:bottom-4 sm:left-4">
          <Button type="button" variant="ghost" size="sm" onClick={(event) => { event.stopPropagation(); setMuted((value) => !value) }}
            className="h-9 w-9 bg-white/90 p-0 shadow-md" title={!soundEnabled ? "Global sound disabled" : muted ? "Unmute" : "Mute"}>
            {!soundEnabled || muted
              ? <VolumeX className={`h-5 w-5 ${!soundEnabled ? "text-gray-400" : ""}`} />
              : <Volume2 className="h-5 w-5" />}
          </Button>
          {onToggleFullscreen && <Button type="button" variant="ghost" size="sm"
            onClick={(event) => { event.stopPropagation(); onToggleFullscreen() }}
            className="h-9 w-9 bg-white/90 p-0 shadow-md" title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>}
        </div>
        {isSpinning && allowManualStop && (
          <Button type="button" size="sm" onClick={(event) => { event.stopPropagation(); handleManualStop() }}
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white hover:bg-red-600">
            STOP
          </Button>
        )}
        {isSpinning && (
          <div className="absolute right-2 top-2 z-20 animate-pulse rounded-full bg-violet-600 px-2 py-1 text-xs font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
            Spinning... ({spinDuration}s)
          </div>
        )}
      </div>
    </div>

    {winner && !isSpinning && (
      <div className="w-full max-w-md rounded-xl border-2 border-violet-300 bg-violet-50 p-5 text-center shadow-sm">
        {winner.imageUrl && <Image src={winner.imageUrl} alt="" width={112} height={112} unoptimized className="mx-auto mb-3 h-28 w-28 rounded-lg object-cover" />}
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Selected</p>
        <p className="mt-1 text-2xl font-bold text-violet-950">{winner.emoji} {winner.name}</p>
      </div>
    )}

    <Button type="button" onClick={spin} disabled={isSpinning || !canvasItems.length}
      className="w-full max-w-sm bg-gradient-to-r from-violet-700 to-rose-600 px-6 py-3 text-base font-semibold text-white shadow-lg sm:px-12 sm:text-lg">
      {isSpinning
        ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Spinning...</span>
        : `SPIN Demon Slayer WHEEL (${activeEntries.length})`}
    </Button>

    {actionMode === "manual" && (
      <div className="flex min-w-0 items-center gap-2">
        <Input value={manualName} onChange={(event) => setManualName(event.target.value)}
          placeholder="Type entry name..." className="min-w-0 w-40 text-sm sm:w-48"
          onKeyDown={(event) => { if (event.key === "Enter" && manualName.trim()) addManualEntry() }} />
        <Button onClick={addManualEntry} disabled={!manualName.trim()} size="sm"
          className="shrink-0 bg-green-500 text-white hover:bg-green-600">Add</Button>
      </div>
    )}

    {onActionModeChange && (
      <div className="mt-2 w-full max-w-md rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-rose-50 p-3 sm:mt-4 sm:p-4">
        <label className="mb-2 flex items-center text-sm font-semibold text-violet-800 sm:mb-3">
          <span className="mr-2 h-2 w-2 rounded-full bg-violet-500" />Game Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {([
            { value: "normal" as const, icon: "🎯", label: "Normal" },
            { value: "elimination" as const, icon: "❌", label: "Elimination" },
            { value: "manual" as const, icon: "📝", label: "Manual" },
          ]).map((mode) => (
            <label key={mode.value}
              className={`flex cursor-pointer flex-col items-center space-y-1 rounded-lg p-2 sm:space-y-2 sm:p-3 ${
                actionMode === mode.value
                  ? "bg-gradient-to-br from-violet-700 to-rose-600 text-white shadow-lg"
                  : "border border-violet-200 bg-white hover:bg-violet-50"
              }`}>
              <input type="radio" name="demonSlayerActionMode" value={mode.value} className="sr-only"
                checked={actionMode === mode.value}
                onChange={() => onActionModeChange(mode.value)} />
              <span className="text-sm">{mode.icon}</span>
              <span className={`text-[10px] font-semibold sm:text-xs ${actionMode === mode.value ? "text-white" : "text-violet-700"}`}>
                {mode.label}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-2 rounded-lg bg-violet-50 p-2 text-center text-[11px] text-violet-600 sm:mt-3 sm:text-xs">
          {actionMode === "normal" && "All entries available for each spin"}
          {actionMode === "elimination" && "Winner is removed after each spin (syncs with Settings → Remove Winner)"}
          {actionMode === "manual" && "Add custom entries by typing names under the wheel"}
        </div>
      </div>
    )}

    <div className="flex justify-center">
      <div className="rounded-lg bg-gradient-to-r from-violet-700 to-rose-600 px-4 py-2 text-white shadow-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">{data?.totalSpins || 0}</div>
          <div className="text-sm opacity-90">Total Spins</div>
        </div>
      </div>
    </div>
    {!canvasItems.length && <p className="text-sm text-slate-500">Enable at least one Demon Slayer entry to spin.</p>}

    {isGameActive && currentGameModeName && (
      <div className="w-full max-w-md rounded-lg border-2 border-violet-300 bg-gradient-to-r from-violet-100 to-rose-100 p-2.5 sm:p-3">
        <p className="text-xs font-semibold text-violet-800 sm:text-sm">Playing: {currentGameModeName}</p>
      </div>
    )}

    <WheelFeatureActions
      totalPoints={totalPoints}
      onOpenAchievements={onOpenAchievements}
      onOpenThemeSelector={onOpenThemeSelector}
      onOpenAnalytics={onOpenAnalytics}
      onOpenSocialHub={onOpenSocialHub}
      onOpenGameModes={onOpenGameModes}
    />

    <PickerResultsModal
      isOpen={showResults}
      onClose={() => setShowResults(false)}
      results={modalResults}
    />
  </div>
}
