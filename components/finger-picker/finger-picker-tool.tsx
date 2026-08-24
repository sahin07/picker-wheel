"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Confetti from "react-confetti"
import { PanelRightOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WheelFeatureActions } from "@/components/wheel-feature-actions"
import { SearchParamsSync } from "@/components/search-params-sync"
import { playFingerTone, vibrateFinger } from "@/lib/finger-picker-audio"
import {
  applyFingerPickerUseCase,
  fingerPickerUseCaseFromTemplate,
  type FingerPickerUseCaseId,
} from "@/lib/finger-picker-use-cases"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore, type FingerPickerData } from "@/stores/wheel-manager-store"
import type {
  FingerPickerActionMode,
  FingerPickerHistoryItem,
  FingerPickerMode,
  FingerPickerPhase,
  FingerPickerPlayer,
} from "@/types/finger-picker-types"
import { FingerPickerGamesDialog } from "./finger-picker-games-dialog"
import { FingerPickerPopularTemplates } from "./finger-picker-popular-templates"
import { FingerPickerSidebar } from "./finger-picker-sidebar"
import { FingerPickerSurface, type LiveFinger } from "./finger-picker-surface"
import type { FingerPickerDeepLink } from "@/lib/finger-picker-spokes"

const TRUTH_OR_DARE = [
  "Truth: last app you opened",
  "Dare: swap seats for one round",
  "Truth: worst snack opinion",
  "Dare: do a 5-second dance",
  "Truth: favorite game in this group",
]

function shufflePick<T>(list: T[], count: number): T[] {
  const copy = [...list].sort(() => Math.random() - 0.5)
  return copy.slice(0, Math.max(1, Math.min(count, copy.length)))
}

function resultCopy(mode: FingerPickerMode, names: string[]): { title: string; message: string } {
  const joined = names.join(", ")
  if (mode === "dont-get-picked") return { title: `${joined} got picked!`, message: "Don't get picked — you're it." }
  if (mode === "truth-or-dare") {
    const prompt = TRUTH_OR_DARE[Math.floor(Math.random() * TRUTH_OR_DARE.length)]
    return { title: `${joined} is up!`, message: prompt }
  }
  if (mode === "who-goes-first") return { title: `${joined} goes first!`, message: "First turn is settled." }
  if (mode === "team-battle") return { title: "Teams are set", message: joined }
  return { title: `${joined} wins!`, message: "Random finger selected." }
}

type Props = {
  openGamesSignal?: number
  onOpenSettings?: () => void
  deepLink?: FingerPickerDeepLink
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export function FingerPickerTool({
  openGamesSignal = 0,
  onOpenSettings,
  deepLink,
  isFullscreen,
  onToggleFullscreen,
}: Props) {
  const [showInputs, setShowInputs] = useState(true)
  const [showGames, setShowGames] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [phase, setPhase] = useState<FingerPickerPhase>("idle")
  const [countdownValue, setCountdownValue] = useState<number | string>(3)
  const [fingers, setFingers] = useState<LiveFinger[]>([])
  const [winnerIds, setWinnerIds] = useState<number[]>([])
  const [teamMap, setTeamMap] = useState<Record<number, "A" | "B">>({})
  const [luckySpot, setLuckySpot] = useState<{ x: number; y: number } | null>(null)
  const [headline, setHeadline] = useState("")
  const [subhead, setSubhead] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [boardNonce, setBoardNonce] = useState(0)
  const leftColRef = useRef<HTMLDivElement>(null)
  const [sidebarMaxHeight, setSidebarMaxHeight] = useState<number | null>(null)
  const fingersRef = useRef<LiveFinger[]>([])
  fingersRef.current = fingers
  const deepLinkApplied = useRef(false)
  const timers = useRef<number[]>([])

  const { updateSettings } = useSettingsStore()
  const removeWinnerAfterSpin = useSettingsStore((state) => state.settings.spinBehavior?.removeWinnerAfterSpin)
  const wheel = useWheelManagerStore((state) =>
    (state.wheelsByTool["finger-picker"] || []).find((item) => item.id === state.currentWheelId) || null)
  const updateWheelData = useWheelManagerStore((state) => state.updateWheelData)
  const addToGlobalSpinHistory = useWheelManagerStore((state) => state.addToGlobalSpinHistory)
  const data = (wheel?.data || {}) as Partial<FingerPickerData>
  const mode = (data.mode || "roulette") as FingerPickerMode
  const actionMode = (data.actionMode || "normal") as FingerPickerActionMode
  const winnerCount = data.winnerCount || 1
  const players = Array.isArray(data.players) ? data.players : []
  const eliminatedIds = Array.isArray(data.eliminatedIds) ? data.eliminatedIds : []
  const recentResults = Array.isArray(data.recentResults) ? data.recentResults : []
  const soundEnabled = data.soundEnabled !== false
  const vibrationEnabled = data.vibrationEnabled !== false

  const patch = useCallback((partial: Partial<FingerPickerData>) => {
    if (!wheel) return
    updateWheelData("finger-picker", wheel.id, partial)
  }, [updateWheelData, wheel])

  const applyPreset = useCallback((id: FingerPickerUseCaseId) => {
    applyFingerPickerUseCase(id)
    setPhase("idle")
    setWinnerIds([])
    setTeamMap({})
    setHeadline("")
    setLuckySpot(null)
  }, [])

  useEffect(() => {
    if (openGamesSignal > 0) setShowGames(true)
  }, [openGamesSignal])

  useEffect(() => {
    if (!deepLink?.useCaseId || deepLinkApplied.current) return
    applyPreset(deepLink.useCaseId)
    deepLinkApplied.current = true
  }, [applyPreset, deepLink])

  useEffect(() => {
    const want: FingerPickerActionMode = removeWinnerAfterSpin ? "elimination" : "normal"
    if (actionMode !== want) patch({ actionMode: want })
  }, [actionMode, patch, removeWinnerAfterSpin])

  useEffect(() => {
    const el = leftColRef.current
    if (!el || !showInputs || isFullscreen) {
      setSidebarMaxHeight(null)
      return
    }
    const sync = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setSidebarMaxHeight(Math.round(el.getBoundingClientRect().height))
      } else setSidebarMaxHeight(null)
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener("resize", sync)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", sync)
    }
  }, [showInputs, isFullscreen, fingers.length, phase])

  useEffect(() => () => {
    timers.current.forEach((id) => window.clearTimeout(id))
  }, [])

  const onSearch = useCallback((params: URLSearchParams) => {
    const fromQuery = fingerPickerUseCaseFromTemplate(params.get("template") || params.get("mode"))
    if (fromQuery) applyPreset(fromQuery)
  }, [applyPreset])

  const setActionMode = (next: FingerPickerActionMode) => {
    patch({ actionMode: next })
    updateSettings({ spinBehavior: { ...useSettingsStore.getState().settings.spinBehavior, removeWinnerAfterSpin: next === "elimination" } })
  }

  const eliminatedLabels = players.filter((item) => item.eliminated || eliminatedIds.includes(item.id)).map((item) => item.name)

  const runPick = useCallback((pool: LiveFinger[]) => {
    const active = pool.filter((item) => !eliminatedLabels.includes(item.label))
    if (active.length < 1) return
    setPhase("picking")
    if (soundEnabled) playFingerTone("tick")
    const pickTimer = window.setTimeout(() => {
      if (mode === "team-battle") {
        const mapped: Record<number, "A" | "B"> = {}
        const shuffled = [...active].sort(() => Math.random() - 0.5)
        shuffled.forEach((item, index) => {
          mapped[item.pointerId] = index % 2 === 0 ? "A" : "B"
        })
        setTeamMap(mapped)
        setWinnerIds(active.map((item) => item.pointerId))
        const a = shuffled.filter((_, index) => index % 2 === 0).map((item) => item.label)
        const b = shuffled.filter((_, index) => index % 2 === 1).map((item) => item.label)
        const names = [`Team A: ${a.join(", ")}`, `Team B: ${b.join(", ")}`]
        finish(names, active.map((item) => item.pointerId), "team-battle")
        return
      }
      const count = mode === "multiple" ? Math.max(2, winnerCount) : winnerCount
      const winners = shufflePick(active, count)
      const names = winners.map((item) => item.label)
      finish(names, winners.map((item) => item.pointerId), mode)
    }, 700)
    timers.current.push(pickTimer)
  }, [eliminatedLabels, mode, soundEnabled, winnerCount])

  const finish = (names: string[], ids: number[], usedMode: FingerPickerMode) => {
    const copy = resultCopy(usedMode, names)
    setWinnerIds(ids)
    setHeadline(copy.title)
    setSubhead(copy.message)
    setPhase("result")
    setShowConfetti(true)
    if (soundEnabled) playFingerTone(usedMode === "dont-get-picked" ? "out" : "win")
    if (vibrationEnabled) vibrateFinger([40, 60, 80])
    const record: FingerPickerHistoryItem = {
      id: `fp-${Date.now()}`,
      at: new Date().toISOString(),
      mode: usedMode,
      names,
      message: copy.message,
    }
    const nextPlayers: FingerPickerPlayer[] = players.map((player) =>
      actionMode === "elimination" && names.includes(player.name) ? { ...player, eliminated: true } : player,
    )
    const nextEliminated = [
      ...eliminatedIds,
      ...players.filter((player) => actionMode === "elimination" && names.includes(player.name)).map((player) => player.id),
    ]
    patch({
      lastResult: record,
      recentResults: [record, ...recentResults].slice(0, 40),
      totalPicks: (data.totalPicks || 0) + 1,
      players: nextPlayers,
      eliminatedIds: nextEliminated,
    })
    addToGlobalSpinHistory({
      date: record.at,
      timestamp: new Date(),
      eliminated: actionMode === "elimination",
      wheelName: "Finger Picker",
      toolType: "finger-picker",
    })
    window.setTimeout(() => setShowConfetti(false), 2800)
  }

  const startCountdownThenPick = () => {
    const pool = fingersRef.current
    if (pool.length < 2 && mode !== "lucky") return
    let n = data.countdownSeconds || 3
    setPhase("countdown")
    setCountdownValue(n)
    const tick = () => {
      if (soundEnabled) playFingerTone("tick")
      if (vibrationEnabled) vibrateFinger(20)
      if (n <= 1) {
        if (soundEnabled) playFingerTone("go")
        runPick(pool)
        return
      }
      n -= 1
      setCountdownValue(n)
      timers.current.push(window.setTimeout(tick, 700))
    }
    timers.current.push(window.setTimeout(tick, 700))
  }

  const startFastest = () => {
    let n = 3
    setPhase("fastest-countdown")
    setCountdownValue(n)
    setFingers([])
    setBoardNonce((value) => value + 1)
    const tick = () => {
      if (soundEnabled) playFingerTone("tick")
      if (n <= 1) {
        setCountdownValue("TOUCH!")
        if (soundEnabled) playFingerTone("go")
        timers.current.push(window.setTimeout(() => {
          runPick(fingersRef.current)
        }, 1400))
        return
      }
      n -= 1
      setCountdownValue(n)
      timers.current.push(window.setTimeout(tick, 700))
    }
    timers.current.push(window.setTimeout(tick, 400))
  }

  const startLucky = () => {
    setPhase("lucky-preview")
    setLuckySpot({ x: 80 + Math.random() * 280, y: 80 + Math.random() * 280 })
    timers.current.push(window.setTimeout(() => setPhase("idle"), 1600))
  }

  const onStart = () => {
    if (mode === "fastest") startFastest()
    else if (mode === "lucky" && !luckySpot) startLucky()
    else startCountdownThenPick()
  }

  const playAgain = () => {
    setPhase("idle")
    setWinnerIds([])
    setTeamMap({})
    setHeadline("")
    setSubhead("")
    setLuckySpot(mode === "lucky" ? luckySpot : null)
  }

  const share = () => {
    const text = `${headline} ${subhead}`.trim()
    if (navigator.share) void navigator.share({ title: "Finger Picker", text, url: window.location.href }).catch(() => {})
    else void navigator.clipboard.writeText(`${text} ${window.location.href}`)
  }

  const restoreAll = () => {
    patch({
      players: players.map((item) => ({ ...item, eliminated: false })),
      eliminatedIds: [],
    })
  }

  return (
    <div>
      {!isFullscreen && <FingerPickerPopularTemplates />}
      <SearchParamsSync onChange={onSearch} />
      <div className={`grid gap-4 ${showInputs && !isFullscreen ? "lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]" : ""}`}>
        <div ref={leftColRef} id="fp-board" className="relative">
          <FingerPickerSurface
            key={boardNonce}
            phase={phase}
            countdownValue={countdownValue}
            mode={mode}
            winnerIds={winnerIds}
            eliminatedLabels={eliminatedLabels}
            players={players}
            luckySpot={luckySpot}
            teamMap={teamMap}
            onFingersChange={setFingers}
          />
          {showConfetti && <Confetti recycle={false} numberOfPieces={180} />}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Button type="button" className="bg-violet-600 hover:bg-violet-700" onClick={onStart} disabled={phase !== "idle" && phase !== "lucky-preview" && phase !== "result"}>
              {mode === "fastest" ? "Start fastest finger" : "Pick"}
            </Button>
            <Button type="button" variant="outline" onClick={playAgain}>Re-pick</Button>
            {actionMode === "elimination" && (
              <Button type="button" variant="outline" onClick={restoreAll}>Restore all</Button>
            )}
            <Button type="button" variant="outline" onClick={onToggleFullscreen}>Fullscreen</Button>
          </div>
          {headline && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
              <p className="font-spin-display text-2xl font-bold text-slate-900">🎉 {headline}</p>
              <p className="mt-1 text-sm text-slate-600">{subhead}</p>
              <p className="mt-1 text-xs text-slate-500">{fingers.filter((item) => winnerIds.includes(item.pointerId)).map((item) => `#${item.label}`).join(" · ")}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Button type="button" size="sm" onClick={playAgain}>Play again</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  if (actionMode !== "elimination") setActionMode("elimination")
                }}>Remove winner</Button>
                <Button type="button" size="sm" variant="outline" onClick={share}>Share result</Button>
              </div>
            </div>
          )}
          <WheelFeatureActions onOpenGameModes={() => setShowGames(true)} />
        </div>
        {showInputs && !isFullscreen && (
          <FingerPickerSidebar
            actionMode={actionMode}
            onActionModeChange={setActionMode}
            winnerCount={winnerCount}
            onWinnerCountChange={(n) => patch({ winnerCount: n })}
            players={players}
            onPlayersChange={(next) => patch({ players: next })}
            onApplyTemplate={applyPreset}
            activeUseCaseId={mode}
            onHideInputs={() => setShowInputs(false)}
            onOpenSettings={onOpenSettings}
            onToggleFullscreen={onToggleFullscreen}
            onViewHistory={() => setShowHistory(true)}
            resultsCount={recentResults.length}
            soundEnabled={soundEnabled}
            vibrationEnabled={vibrationEnabled}
            onSoundChange={(value) => patch({ soundEnabled: value })}
            onVibrationChange={(value) => patch({ vibrationEnabled: value })}
            currentTheme={data.currentTheme}
            onThemeChange={(id) => patch({ currentTheme: id })}
            desktopMaxHeight={sidebarMaxHeight}
          />
        )}
      </div>
      {!showInputs && !isFullscreen && (
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setShowInputs(true)}>
          <PanelRightOpen className="mr-1 h-4 w-4" /> Show panel
        </Button>
      )}
      <FingerPickerGamesDialog open={showGames} onOpenChange={setShowGames} onSelect={applyPreset} />
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowHistory(false)}>
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-4" onClick={(event) => event.stopPropagation()}>
            <p className="font-semibold">Selection history</p>
            <ul className="mt-3 space-y-2 text-sm">
              {recentResults.length === 0 && <li className="text-slate-500">No picks yet.</li>}
              {recentResults.map((item) => (
                <li key={item.id} className="rounded-lg border p-2">
                  <span className="font-medium">{item.names.join(", ")}</span>
                  <span className="block text-xs text-slate-500">{item.message}</span>
                </li>
              ))}
            </ul>
            <Button type="button" className="mt-3 w-full" variant="outline" onClick={() => setShowHistory(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}
