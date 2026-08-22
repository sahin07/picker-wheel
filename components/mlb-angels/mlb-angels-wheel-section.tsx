"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Confetti from "react-confetti"
import {
  BarChart3,
  Copy,
  Gamepad2,
  Maximize2,
  Minimize2,
  Palette,
  Share2,
  Trophy,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import PickerResultsModal from "@/components/picker-results-modal"
import { WheelCanvas, resolveNumberFromRotation, type WheelCanvasHandle } from "@/components/wheel-canvas"
import { getAllMlbAngelsNicknames } from "@/data/mlb-angels-nicknames"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore, type MlbAngelsWheelData } from "@/stores/wheel-manager-store"
import type { MlbAngelsActionMode, MlbAngelsNicknameEntry, MlbAngelsSpinResult } from "@/types/mlb-angels-types"

const ANGELS_COLORS = ["#BA0021", "#003263", "#C4CED4", "#862633", "#FFFFFF"]

type Props = {
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  removeWinnerAfterSpin?: boolean
  actionMode?: MlbAngelsActionMode
  onActionModeChange?: (mode: MlbAngelsActionMode) => void
  onOpenAchievements?: () => void
  onOpenThemeSelector?: () => void
  onOpenAnalytics?: () => void
  onOpenSocialHub?: () => void
  onOpenGameModes?: () => void
  onSpinCompleted?: () => void
  totalPoints?: number
  isGameActive?: boolean
  currentGameMode?: string
  currentTheme?: string
  themes?: { id: string; name: string; colors?: string[] }[]
}

export default function MlbAngelsWheelSection({
  isFullscreen = false,
  onToggleFullscreen,
  removeWinnerAfterSpin = false,
  actionMode = "normal",
  onActionModeChange,
  onOpenAchievements,
  onOpenThemeSelector,
  onOpenAnalytics,
  onOpenSocialHub,
  onOpenGameModes,
  onSpinCompleted,
  totalPoints = 0,
  isGameActive = false,
  currentGameMode,
  currentTheme = "classic",
  themes = PICKER_WHEEL_THEMES,
}: Props) {
  const wheel = useWheelManagerStore((state) =>
    (state.wheelsByTool["mlb-angels-wheel"] || []).find((item) => item.id === state.currentWheelId) || null)
  const data = wheel?.data as MlbAngelsWheelData | undefined
  const { settings } = useSettingsStore()
  const [rotation, setRotation] = useState(data?.rotation || 0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<MlbAngelsNicknameEntry | null>(null)
  const [muted, setMuted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [confettiBurst, setConfettiBurst] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 })
  const [wheelSize, setWheelSize] = useState(680)
  const pendingWinner = useRef<MlbAngelsNicknameEntry | null>(null)
  const finalRotation = useRef(rotation)
  const audio = useRef<SpinAudioController | null>(null)
  const canvasHandle = useRef<WheelCanvasHandle>(null)
  const wheelBoxRef = useRef<HTMLDivElement>(null)
  const soundEnabled = settings.confettiSound?.enableSound !== false
  const spinDuration = settings.spinBehavior?.spinningDuration ?? 10

  const allEntries = useMemo(() => getAllMlbAngelsNicknames(), [])
  const activeEntries = useMemo(() => {
    const selected = new Set(data?.selectedNicknameIds || [])
    const ordered = data?.nicknameOrder || []
    const byId = new Map(allEntries.map((item) => [item.id, item]))
    const first = ordered.map((id) => byId.get(id)).filter(Boolean) as MlbAngelsNicknameEntry[]
    const included = new Set(first.map((item) => item.id))
    return [
      ...first,
      ...allEntries.filter((item) => selected.has(item.id) && !included.has(item.id)),
    ].filter((item) => selected.has(item.id))
  }, [allEntries, data?.nicknameOrder, data?.selectedNicknameIds])

  const themeColors =
    themes.find((item) => item.id === currentTheme)?.colors ||
    PICKER_WHEEL_THEMES.find((item) => item.id === currentTheme)?.colors
  const colors = data?.paletteColors?.length
    ? data.paletteColors
    : themeColors?.length
      ? themeColors
      : ANGELS_COLORS
  const displayMode = data?.displayMode || "nickname-name"

  const canvasItems = useMemo(
    () =>
      activeEntries.map((item, index) => ({
        id: item.id,
        value:
          displayMode === "nickname"
            ? item.nickname
            : displayMode === "name"
              ? item.playerName
              : `${item.emoji} ${item.nickname}`,
        weight: 1,
        color: colors[index % colors.length],
      })),
    [activeEntries, colors, displayMode],
  )

  const modalResults = useMemo(
    () =>
      (data?.recentResults || []).slice(0, 10).map((result) => ({
        id: result.id,
        name: result.nickname,
        emoji: result.emoji,
        text: `${result.playerName} · ${result.position}`,
      })),
    [data?.recentResults],
  )

  const updateData = useCallback(
    (partial: Partial<MlbAngelsWheelData>) => {
      if (!wheel || !data) return
      const latest = useWheelManagerStore.getState().getCurrentWheel()?.data as MlbAngelsWheelData | undefined
      useWheelManagerStore.getState().updateWheelData("mlb-angels-wheel", wheel.id, {
        ...(latest || data),
        ...partial,
      })
    },
    [data, wheel],
  )

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
    window.addEventListener("open-angels-results", open)
    return () => window.removeEventListener("open-angels-results", open)
  }, [])

  useEffect(() => () => audio.current?.stop(), [])
  useEffect(() => {
    setWinner(null)
    setRotation(data?.rotation || 0)
  }, [wheel?.id, data?.rotation])

  const handleSpinComplete = useCallback(() => {
    const result = pendingWinner.current
    pendingWinner.current = null
    audio.current?.stop()
    setIsSpinning(false)
    if (!result || !data) return
    setWinner(result)
    const spinResult: MlbAngelsSpinResult = { entry: result, timestamp: new Date() }
    const selectedNicknameIds = removeWinnerAfterSpin
      ? data.selectedNicknameIds.filter((id) => id !== result.id)
      : data.selectedNicknameIds
    updateData({
      selectedNicknameIds,
      nicknameOrder: removeWinnerAfterSpin
        ? data.nicknameOrder.filter((id) => id !== result.id)
        : data.nicknameOrder,
      selectedResult: spinResult,
      totalSpins: (data.totalSpins || 0) + 1,
      recentResults: [result, ...(data.recentResults || [])].slice(0, 10),
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
  }, [data, muted, onSpinCompleted, removeWinnerAfterSpin, settings.confettiSound, soundEnabled, updateData])

  const spin = () => {
    if (isSpinning || !canvasItems.length) return
    const next = rotation + 3600 + Math.random() * 360
    const resolved = resolveNumberFromRotation(next, canvasItems)
    if (!resolved) return
    pendingWinner.current = activeEntries[resolved.index] || null
    finalRotation.current = next
    setWinner(null)
    setIsSpinning(true)
    setRotation(next)
    updateData({ isSpinning: true, rotation: next })
    if (soundEnabled && !muted) {
      audio.current ??= createSpinAudioController()
      audio.current.startWhoosh("/wheel-sound.mp3", settings.confettiSound?.soundVolume || 0.5)
    }
  }

  const handleManualStop = () => {
    if (!isSpinning) return
    const current = canvasHandle.current?.abortSpin() ?? rotation
    const resolved = resolveNumberFromRotation(current, canvasItems)
    if (!resolved) return
    pendingWinner.current = activeEntries[resolved.index] || null
    finalRotation.current = current
    setRotation(current)
    handleSpinComplete()
  }

  const shareResult = async (entry: MlbAngelsNicknameEntry) => {
    const text = `Angels nickname: ${entry.nickname} (${entry.playerName}) — ${entry.meaning}`
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Angels Nickname Wheel", text })
        return
      }
      await navigator.clipboard.writeText(text)
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4 overflow-auto bg-white p-3 sm:space-y-6 sm:p-4"
          : "relative flex w-full min-w-0 max-w-full flex-col items-center space-y-4 sm:space-y-6"
      }
    >
      {confettiBurst > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            <Confetti
              key={confettiBurst}
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={350}
              recycle={false}
              onConfettiComplete={() => setConfettiBurst(0)}
            />
          </div>,
          document.body,
        )}

      <div className="relative mx-auto flex w-full max-w-[680px] flex-col items-center">
        <div
          ref={wheelBoxRef}
          className={`relative w-full max-w-[680px] overflow-visible ${!isSpinning && canvasItems.length ? "cursor-pointer" : ""}`}
        >
          <button
            type="button"
            className="block w-full"
            onClick={spin}
            disabled={isSpinning || !canvasItems.length}
            aria-label="Spin Angels nickname wheel"
          >
            <WheelCanvas
              ref={canvasHandle}
              numbers={canvasItems}
              isSpinning={isSpinning}
              settings={settings}
              rotation={rotation}
              size={wheelSize}
              onRotationFrame={(frame, count) => {
                if (!muted && soundEnabled) {
                  audio.current?.syncFrame(frame, count, settings.confettiSound?.soundVolume || 0.5)
                }
              }}
              onSpinComplete={handleSpinComplete}
            />
          </button>
          <div className="absolute bottom-2 left-2 z-20 flex flex-col gap-2 sm:bottom-4 sm:left-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(event) => {
                event.stopPropagation()
                setMuted((value) => !value)
              }}
              className="h-9 w-9 bg-white/90 p-0 shadow-md"
              title={!soundEnabled ? "Global sound disabled" : muted ? "Unmute" : "Mute"}
            >
              {!soundEnabled || muted ? (
                <VolumeX className={`h-5 w-5 ${!soundEnabled ? "text-gray-400" : ""}`} />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            {onToggleFullscreen && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation()
                  onToggleFullscreen()
                }}
                className="h-9 w-9 bg-white/90 p-0 shadow-md"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            )}
          </div>
          {isSpinning && (
            <>
              <Button
                type="button"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation()
                  handleManualStop()
                }}
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white hover:bg-red-700"
              >
                STOP
              </Button>
              <div className="absolute right-2 top-2 z-20 animate-pulse rounded-full bg-red-700 px-2 py-1 text-xs font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
                Spinning... ({spinDuration}s)
              </div>
            </>
          )}
        </div>
      </div>

      {winner && !isSpinning && (
        <div className="w-full max-w-lg rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-slate-50 p-5 shadow-sm">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-red-800">
            {winner.emoji} Selected Nickname
          </p>
          <p className="mt-1 text-center text-2xl font-bold text-slate-900">{winner.nickname}</p>
          <p className="mt-2 text-center text-lg font-semibold text-slate-800">{winner.playerName}</p>
          <dl className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between gap-4 border-b border-red-100 pb-2">
              <dt className="font-medium text-slate-700">Position</dt>
              <dd>{winner.position}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-red-100 pb-2">
              <dt className="font-medium text-slate-700">Years with Angels</dt>
              <dd>{winner.yearsWithAngels}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Why this nickname</dt>
              <dd className="mt-1 leading-relaxed">{winner.meaning}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Famous moment</dt>
              <dd className="mt-1 leading-relaxed">{winner.famousMoment}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => void shareResult(winner)}>
              <Share2 className="mr-1 h-4 w-4" /> Share
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                void navigator.clipboard.writeText(
                  `${winner.nickname} — ${winner.playerName}: ${winner.meaning}`,
                )
              }
            >
              <Copy className="mr-1 h-4 w-4" /> Copy
            </Button>
          </div>
        </div>
      )}

      {isGameActive && currentGameMode && (
        <div className="mb-2 w-full max-w-md rounded-lg border-2 border-purple-300 bg-gradient-to-r from-purple-100 to-pink-100 p-2.5 sm:mb-4 sm:p-3">
          <p className="text-xs font-semibold text-purple-800 sm:text-sm">
            🎮 Playing: {currentGameMode}
          </p>
        </div>
      )}

      <Button
        type="button"
        onClick={spin}
        disabled={isSpinning || !canvasItems.length}
        className="w-full max-w-sm bg-gradient-to-r from-red-700 to-slate-900 px-6 py-3 text-base font-semibold text-white shadow-lg sm:px-12 sm:text-lg"
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Spinning...
          </span>
        ) : (
          `SPIN ANGELS NICKNAME (${activeEntries.length})`
        )}
      </Button>

      {onActionModeChange && (
        <div className="mt-2 w-full max-w-md rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-slate-50 p-3 sm:mt-4 sm:p-4">
          <label className="mb-2 flex items-center text-sm font-semibold text-red-900 sm:mb-3">
            <span className="mr-2 h-2 w-2 rounded-full bg-red-600" />
            Game Mode
          </label>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {(
              [
                { value: "normal" as const, icon: "🎯", label: "Normal" },
                { value: "elimination" as const, icon: "❌", label: "Elimination" },
              ]
            ).map((mode) => (
              <label
                key={mode.value}
                className={`flex cursor-pointer flex-col items-center space-y-1 rounded-lg p-2 sm:space-y-2 sm:p-3 ${
                  actionMode === mode.value
                    ? "bg-gradient-to-br from-red-700 to-slate-900 text-white shadow-lg"
                    : "border border-red-200 bg-white hover:bg-red-50"
                }`}
              >
                <input
                  type="radio"
                  name="angelsActionMode"
                  value={mode.value}
                  className="sr-only"
                  checked={actionMode === mode.value}
                  onChange={() => onActionModeChange(mode.value)}
                />
                <span className="text-sm">{mode.icon}</span>
                <span
                  className={`text-[10px] font-semibold sm:text-xs ${
                    actionMode === mode.value ? "text-white" : "text-red-800"
                  }`}
                >
                  {mode.label}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-2 rounded-lg bg-red-50/80 p-2 text-center text-[11px] text-red-800 sm:mt-3 sm:text-xs">
            {actionMode === "normal"
              ? "All nicknames stay on the wheel after each spin"
              : "Winner is removed after each spin (syncs with Settings → Remove Winner)"}
          </div>
        </div>
      )}

      <div className="mb-2 mt-4 grid w-full max-w-md grid-cols-5 gap-1.5 sm:mb-4 sm:mt-6 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenAchievements}
          className="h-auto min-w-0 border-yellow-300 bg-yellow-50 px-1.5 py-1.5 text-[10px] text-yellow-700 hover:bg-yellow-100 sm:px-2 sm:text-xs"
        >
          <Trophy className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Achievements ({totalPoints})</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenThemeSelector}
          className="h-auto min-w-0 border-purple-300 bg-purple-50 px-1.5 py-1.5 text-[10px] text-purple-700 hover:bg-purple-100 sm:px-2 sm:text-xs"
        >
          <Palette className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Themes</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenAnalytics}
          className="h-auto min-w-0 border-green-300 bg-green-50 px-1.5 py-1.5 text-[10px] text-green-700 hover:bg-green-100 sm:px-2 sm:text-xs"
        >
          <BarChart3 className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Analytics</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenSocialHub}
          className="h-auto min-w-0 border-orange-300 bg-orange-50 px-1.5 py-1.5 text-[10px] text-orange-700 hover:bg-orange-100 sm:px-2 sm:text-xs"
        >
          <Users className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Social</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenGameModes}
          className="h-auto min-w-0 border-red-300 bg-red-50 px-1.5 py-1.5 text-[10px] text-red-700 hover:bg-red-100 sm:px-2 sm:text-xs"
        >
          <Gamepad2 className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Games</span>
        </Button>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <span>Total spins: {data?.totalSpins || 0}</span>
      </div>

      {!canvasItems.length && (
        <p className="text-sm text-slate-500">Enable at least one Angels nickname to spin.</p>
      )}

      <PickerResultsModal isOpen={showResults} onClose={() => setShowResults(false)} results={modalResults} />
    </div>
  )
}
