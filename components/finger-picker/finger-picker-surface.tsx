"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { FingerPickerMode, FingerPickerPhase, FingerPickerPlayer } from "@/types/finger-picker-types"
import { FINGER_PICKER_COLORS, FINGER_PICKER_EMOJIS } from "@/types/finger-picker-types"

export type LiveFinger = {
  pointerId: number
  x: number
  y: number
  color: string
  label: string
  emoji: string
  sticky: boolean
  playerId?: string
}

type LuckySpot = { x: number; y: number }

type Props = {
  phase: FingerPickerPhase
  countdownValue: number | string
  mode: FingerPickerMode
  winnerIds: number[]
  eliminatedLabels: string[]
  players: FingerPickerPlayer[]
  luckySpot: LuckySpot | null
  teamMap?: Record<number, "A" | "B">
  onFingersChange: (fingers: LiveFinger[]) => void
  disabled?: boolean
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function FingerPickerSurface({
  phase,
  countdownValue,
  mode,
  winnerIds,
  eliminatedLabels,
  players,
  luckySpot,
  teamMap,
  onFingersChange,
  disabled,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null)
  const [fingers, setFingers] = useState<LiveFinger[]>([])
  const fingersRef = useRef(fingers)
  fingersRef.current = fingers

  const emit = useCallback((next: LiveFinger[]) => {
    setFingers(next)
    onFingersChange(next)
  }, [onFingersChange])

  const frozen = phase === "countdown" || phase === "picking" || phase === "result" || phase === "fastest-countdown"

  const toLocal = (event: React.PointerEvent) => {
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const nextMeta = (index: number) => {
    const roster = players.filter((item) => !item.eliminated && !eliminatedLabels.includes(item.name))
    const player = roster[index]
    return {
      color: player?.color || FINGER_PICKER_COLORS[index % FINGER_PICKER_COLORS.length],
      label: player?.name || `Finger ${index + 1}`,
      emoji: player?.emoji || FINGER_PICKER_EMOJIS[index % FINGER_PICKER_EMOJIS.length],
      playerId: player?.id,
    }
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    const allowTouchWindow = phase === "fastest-countdown" && countdownValue === "TOUCH!"
    if (frozen && !allowTouchWindow) return
    const point = toLocal(event)
    if (event.pointerType === "mouse") {
      const hit = fingersRef.current.find((item) => item.sticky && dist(item, point) < 36)
      if (hit) {
        emit(fingersRef.current.filter((item) => item.pointerId !== hit.pointerId))
        return
      }
      if (fingersRef.current.length >= 10) return
      const meta = nextMeta(fingersRef.current.length)
      emit([
        ...fingersRef.current,
        { pointerId: event.pointerId + 10_000 + Date.now() % 1000, x: point.x, y: point.y, sticky: true, ...meta },
      ])
      return
    }
    if (fingersRef.current.length >= 10) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const meta = nextMeta(fingersRef.current.length)
    emit([...fingersRef.current, { pointerId: event.pointerId, x: point.x, y: point.y, sticky: false, ...meta }])
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (frozen && !(phase === "fastest-countdown" && countdownValue === "TOUCH!")) return
    const point = toLocal(event)
    const idx = fingersRef.current.findIndex((item) => item.pointerId === event.pointerId && !item.sticky)
    if (idx < 0) return
    const next = [...fingersRef.current]
    next[idx] = { ...next[idx], ...point }
    emit(next)
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (frozen && !(phase === "fastest-countdown" && countdownValue === "TOUCH!")) return
    emit(fingersRef.current.filter((item) => item.pointerId !== event.pointerId || item.sticky))
  }

  useEffect(() => {
    if (phase !== "idle" && phase !== "lucky-preview") return
    const filtered = fingersRef.current.filter((item) => !eliminatedLabels.includes(item.label))
    if (filtered.length !== fingersRef.current.length) emit(filtered)
  }, [eliminatedLabels, emit, phase, players])

  const overlay =
    phase === "countdown" || phase === "fastest-countdown"
      ? String(countdownValue)
      : phase === "picking"
        ? "…"
        : phase === "lucky-preview"
          ? "Lucky spot"
          : null

  return (
    <div
      ref={boardRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative h-[min(70vh,560px)] w-full touch-none select-none overflow-hidden rounded-2xl border-2 border-violet-300 bg-gradient-to-br from-violet-950 via-fuchsia-900 to-slate-900 shadow-inner"
      style={{ touchAction: "none" }}
      role="application"
      aria-label="Finger picker board"
    >
      <p className="pointer-events-none absolute left-3 top-3 z-10 max-w-[70%] text-xs font-medium text-white/80 sm:text-sm">
        {mode === "fastest" && phase === "idle"
          ? "Press Start, wait for TOUCH, then put fingers down."
          : "Touch and hold (phone) or click to place markers (desktop). 2–10 players."}
      </p>
      {luckySpot && (
        <div
          className="pointer-events-none absolute z-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-amber-300 bg-amber-300/20 shadow-[0_0_40px_rgba(251,191,36,0.55)]"
          style={{ left: luckySpot.x, top: luckySpot.y }}
        />
      )}
      {fingers.map((finger) => {
        const isWin = winnerIds.includes(finger.pointerId)
        const team = teamMap?.[finger.pointerId]
        return (
          <div
            key={finger.pointerId}
            className={`absolute z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 text-center shadow-lg transition-transform ${
              isWin ? "scale-125 border-white ring-4 ring-amber-300" : "border-white/70"
            }`}
            style={{ left: finger.x, top: finger.y, backgroundColor: finger.color }}
          >
            <span className="text-xl leading-none">{finger.emoji}</span>
            <span className="max-w-[4.5rem] truncate px-1 text-[10px] font-bold text-white drop-shadow">{finger.label}</span>
            {team && <span className="text-[9px] font-bold text-white">Team {team}</span>}
          </div>
        )
      })}
      {overlay && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/25">
          <p className="font-spin-display text-7xl font-black text-white drop-shadow-lg sm:text-8xl">{overlay}</p>
        </div>
      )}
    </div>
  )
}

export function clearStickyFingers(fingers: LiveFinger[]) {
  return fingers.filter((item) => !item.sticky)
}
