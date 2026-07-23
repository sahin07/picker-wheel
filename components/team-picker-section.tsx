"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTeamPickerStore, type Team } from "@/stores/team-picker-store"
import { useSettingsStore } from "@/stores/settings-store"
import { useToast } from "@/contexts/toast-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Crown,
  Users,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings as SettingsIcon,
  Palette,
  BarChart3,
  Gamepad2,
  Trophy,
} from "lucide-react"
import {
  WheelCanvas,
  resolveNumberFromRotation,
} from "@/components/wheel-canvas"
import {
  createSpinAudioController,
  type SpinAudioController,
} from "@/lib/wheel-spin-audio"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import PickerWheelGameModes from "@/components/picker-wheel-game-modes"
import { AchievementsDisplay, type Achievement } from "@/components/yes-no-picker-wheel/achievements-display"
import { initializeAchievements } from "@/lib/achievement-system"
import { ThemeSelector } from "@/components/yes-no-picker-wheel/theme-selector"
import { WHEEL_THEMES, type WheelTheme } from "@/lib/wheel-themes"
import {
  analyzeSpinData,
  type SpinRecord as AnalyticsSpinRecord,
} from "@/lib/picker-wheel-analytics"

const WHEEL_SIZE = 680

type TeamCanvasItem = {
  value: string
  weight: number
  color: string
  id: string
  team: Team
}

export default function TeamPickerSection({
  onConfettiChange,
  isFullscreen = false,
  onToggleFullscreen,
  showResultsButton = true,
  onHistoryCountChange,
  openGamesSignal = 0,
  wheelId = null,
}: {
  showActionButtons?: boolean
  onConfettiChange?: (show: boolean) => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  /** When false, parent renders the Results chip (Yes/No layout). */
  showResultsButton?: boolean
  onHistoryCountChange?: (count: number) => void
  openGamesSignal?: number
  wheelId?: string | null
}) {
  const {
    teams,
    resultTitle,
    exportToCSV,
    clearTeams,
    showGenderInResult,
    setShowGenderInResult,
    showLabelInResult,
    setShowLabelInResult,
    pickRepresentatives,
    setPickRepresentatives,
    actionMode,
    setActionMode,
    eliminatedTeams,
    eliminateTeam,
    getAvailableTeams,
    restoreAllTeams,
    selectedTeam,
    setSelectedTeam,
  } = useTeamPickerStore()

  const { settings, updateSettings } = useSettingsStore()
  const { showToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [muted, setMuted] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  /** Local result banner (same pattern as Yes/No lastResult) */
  const [lastResult, setLastResult] = useState<Team | null>(null)
  const [spinHistory, setSpinHistory] = useState<
    { team: Team; timestamp: Date; durationMs: number }[]
  >([])
  const [showResultsDialog, setShowResultsDialog] = useState(false)
  const [showThemes, setShowThemes] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocial, setShowSocial] = useState(false)
  const [showGames, setShowGames] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [themes] = useState<WheelTheme[]>(WHEEL_THEMES)
  const [wheelTheme, setWheelTheme] = useState("classic")
  const [achievements] = useState<Achievement[]>(() => initializeAchievements([]))

  const currentRotationRef = useRef(0)
  const finalRotationRef = useRef(0)
  const isSpinningRef = useRef(false)
  const finishLockRef = useRef(false)
  const pendingWinnerRef = useRef<{ index: number; team: Team } | null>(null)
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const spinAudioRef = useRef<SpinAudioController | null>(null)
  const finishSpinRef = useRef<() => void>(() => {})
  const availableTeamsRef = useRef<Team[]>([])
  const canvasItemsRef = useRef<TeamCanvasItem[]>([])

  const availableTeams = useMemo(() => {
    if (typeof getAvailableTeams === "function") return getAvailableTeams()
    return teams.filter((t) => !eliminatedTeams.includes(t.id))
  }, [teams, eliminatedTeams, getAvailableTeams])

  availableTeamsRef.current = availableTeams

  const canvasItems: TeamCanvasItem[] = useMemo(
    () =>
      availableTeams.map((team) => ({
        value: team.mascot ? `${team.mascot} ${team.name}` : team.name,
        weight: 1,
        color: team.color,
        id: team.id,
        team,
      })),
    [availableTeams],
  )
  canvasItemsRef.current = canvasItems

  const soundEnabled = !muted
  const soundGloballyOff = !settings.confettiSound?.enableSound
  const manuallyStop = !!settings.spinBehavior?.manuallyStop
  const canClickSpin = (!isSpinning || manuallyStop) && canvasItems.length > 0

  useEffect(() => {
    onHistoryCountChange?.(spinHistory.length)
  }, [spinHistory.length, onHistoryCountChange])

  useEffect(() => {
    if (openGamesSignal > 0) setShowGames(true)
  }, [openGamesSignal])

  // Reset local spin UI when My Wheels switches instances
  useEffect(() => {
    if (!wheelId) return
    setLastResult(null)
    setSpinHistory([])
    setIsSpinning(false)
    setRotation(0)
    setHighlightIndex(null)
    isSpinningRef.current = false
    pendingWinnerRef.current = null
    finishLockRef.current = false
    currentRotationRef.current = 0
    finalRotationRef.current = 0
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current)
      spinTimeoutRef.current = null
    }
    spinAudioRef.current?.stop()
  }, [wheelId])

  useEffect(() => {
    const openGroups = () => setShowModal(true)
    const openResults = () => setShowResultsDialog(true)
    const openAchievements = () => setShowAchievements(true)
    window.addEventListener("open-groups-board", openGroups)
    window.addEventListener("open-team-results", openResults)
    window.addEventListener("open-team-achievements", openAchievements)
    return () => {
      window.removeEventListener("open-groups-board", openGroups)
      window.removeEventListener("open-team-results", openResults)
      window.removeEventListener("open-team-achievements", openAchievements)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
      spinAudioRef.current?.stop()
    }
  }, [])

  // Clear result when teams are regenerated / cleared
  useEffect(() => {
    setLastResult(null)
    setHighlightIndex(null)
  }, [teams])

  const finishSpinWithWinner = useCallback(
    (team: Team, index: number) => {
      if (finishLockRef.current) return
      finishLockRef.current = true

      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current)
        spinTimeoutRef.current = null
      }
      spinAudioRef.current?.stop()
      isSpinningRef.current = false
      setIsSpinning(false)
      setHighlightIndex(index)
      setLastResult(team)
      setSelectedTeam(team)
      const durationMs =
        Math.max(0.5, settings.spinBehavior?.spinningDuration || 10) * 1000
      setSpinHistory((prev) =>
        [{ team, timestamp: new Date(), durationMs }, ...prev].slice(0, 50),
      )

      if (
        actionMode === "elimination" ||
        !!settings.spinBehavior?.removeWinnerAfterSpin
      ) {
        eliminateTeam(team.id)
      }

      if (settings.confettiSound?.enableConfetti !== false) {
        onConfettiChange?.(true)
        setTimeout(() => onConfettiChange?.(false), 5000)
      }

      if (settings.confettiSound?.enableSound && soundEnabled) {
        try {
          const audio = new Audio("/sound-win.mp3")
          audio.volume = settings.confettiSound.soundVolume || 0.5
          void audio.play()
        } catch {
          // ignore
        }
      }
    },
    [
      actionMode,
      eliminateTeam,
      onConfettiChange,
      setSelectedTeam,
      settings.confettiSound,
      settings.spinBehavior?.spinningDuration,
      soundEnabled,
    ],
  )

  const finishSpin = useCallback(() => {
    const pending = pendingWinnerRef.current
    pendingWinnerRef.current = null
    if (pending) {
      finishSpinWithWinner(pending.team, pending.index)
      return
    }

    const resolved = resolveNumberFromRotation(
      finalRotationRef.current,
      canvasItemsRef.current,
    )
    if (!resolved) {
      isSpinningRef.current = false
      setIsSpinning(false)
      spinAudioRef.current?.stop()
      return
    }
    const item = canvasItemsRef.current[resolved.index]
    if (item?.team) finishSpinWithWinner(item.team, resolved.index)
  }, [finishSpinWithWinner])

  finishSpinRef.current = finishSpin

  const spinWheel = () => {
    if (isSpinning || isSpinningRef.current || canvasItems.length === 0) return

    finishLockRef.current = false
    isSpinningRef.current = true
    setIsSpinning(true)
    setHighlightIndex(null)
    setLastResult(null)
    setSelectedTeam(null)
    pendingWinnerRef.current = null

    if (settings.confettiSound?.enableSound !== false && soundEnabled) {
      try {
        if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
        spinAudioRef.current.startWhoosh(
          "/wheel-sound.mp3",
          settings.confettiSound.soundVolume || 0.5,
        )
      } catch {
        // ignore
      }
    }

    const baseRotation = settings.display?.randomInitialAngle ? Math.random() * 360 : 0
    const finalRotation =
      currentRotationRef.current + baseRotation + 10 * 360 + Math.random() * 360
    finalRotationRef.current = finalRotation
    setRotation(finalRotation)

    const resolved = resolveNumberFromRotation(finalRotation, canvasItems)
    if (resolved) {
      const item = canvasItems[resolved.index]
      if (item?.team) {
        pendingWinnerRef.current = { index: resolved.index, team: item.team }
      }
    }

    const durationMs =
      Math.max(0.5, settings.spinBehavior?.spinningDuration || 10) * 1000
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    spinTimeoutRef.current = setTimeout(() => {
      finishSpinRef.current()
    }, durationMs + 80)
  }

  const handleManualStop = () => {
    if (!manuallyStop || !isSpinningRef.current) return
    const stoppedAt = currentRotationRef.current
    finalRotationRef.current = stoppedAt
    const resolved = resolveNumberFromRotation(stoppedAt, canvasItemsRef.current)
    if (resolved) {
      const item = canvasItemsRef.current[resolved.index]
      if (item?.team) {
        pendingWinnerRef.current = { index: resolved.index, team: item.team }
      }
    }
    finishSpinRef.current()
  }

  const onSpinAction = !isSpinning ? spinWheel : handleManualStop

  const shareResult = useCallback(() => {
    const team = lastResult
    if (!team) {
      showToast("Spin the wheel first to share a result.", "info")
      return
    }
    const members =
      team.members?.length > 0
        ? ` (${team.members.map((m) => m.name).join(", ")})`
        : ""
    const text = `We picked ${team.mascot ? `${team.mascot} ` : ""}${team.name}${members} on Team Picker Wheel!`
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: "Team Picker Wheel", text }).catch(() => {})
      return
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(text).then(() => {
        showToast("Result copied to clipboard!", "success")
      })
      return
    }
    showToast(text, "info")
  }, [lastResult, showToast])

  const applyTheme = useCallback(
    (themeId: string) => {
      setWheelTheme(themeId)
      const theme = themes.find((t) => t.id === themeId)
      if (!theme) return
      const colors = [theme.colors.yes, theme.colors.no, theme.colors.maybe]
      updateSettings({
        appearance: {
          ...settings.appearance,
          toolColors: colors,
        },
      })
      if (teams.length > 0) {
        useTeamPickerStore.setState({
          teams: teams.map((team, i) => ({
            ...team,
            color: colors[i % colors.length],
          })),
        })
      }
      showToast(`Theme: ${theme.name}`, "success")
      setShowThemes(false)
    },
    [settings.appearance, showToast, teams, themes, updateSettings],
  )

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

  const emptyMessage =
    teams.length === 0
      ? "Generate teams from the Inputs tab to start spinning"
      : availableTeams.length === 0
        ? "All teams eliminated — restore to spin again"
        : null

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center space-y-6 overflow-auto bg-white p-4"
          : "relative flex w-full flex-col items-center space-y-6"
      }
    >
      {showResultsButton && !isFullscreen && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowResultsDialog(true)}
          className="absolute left-0 top-0 z-10 border-blue-500 bg-white px-3 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50"
        >
          Results
          {spinHistory.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {spinHistory.length}
            </Badge>
          )}
        </Button>
      )}

      <div className="relative mx-auto flex w-full max-w-[680px] flex-col items-center">
        <div
          className={`relative w-full max-w-[680px] overflow-visible ${canClickSpin ? "cursor-pointer" : ""}`}
          onClick={canClickSpin ? onSpinAction : undefined}
        >
          <WheelCanvas
            numbers={canvasItems}
            isSpinning={isSpinning}
            settings={settings}
            rotation={rotation}
            size={WHEEL_SIZE}
            highlightIndex={highlightIndex}
            onRotationFrame={handleRotationFrame}
            onSpinComplete={() => finishSpinRef.current()}
          />

          <div className="absolute bottom-2 left-2 z-20 flex flex-col space-y-2 sm:bottom-4 sm:left-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setMuted((m) => !m)
              }}
              className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white sm:h-10 sm:w-10"
              title={
                soundGloballyOff
                  ? "Global sound disabled"
                  : muted
                    ? "Unmute"
                    : "Mute"
              }
            >
              {soundGloballyOff || muted ? (
                <VolumeX
                  className={`h-5 w-5 ${soundGloballyOff ? "text-gray-400" : ""}`}
                />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            {onToggleFullscreen && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFullscreen()
                }}
                className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white sm:h-10 sm:w-10"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>

          {isSpinning && (
            <div className="absolute right-2 top-2 z-20 animate-pulse rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
              {manuallyStop ? "Click to Stop!" : "Spinning..."}
            </div>
          )}
        </div>
      </div>

      {lastResult && !isSpinning && (
        <div className="w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-green-800">
            {resultTitle || "Selected Team"}
          </h3>
          {lastResult.mascot && (
            <div className="mb-2 text-5xl" aria-hidden>
              {lastResult.mascot}
            </div>
          )}
          <p className="text-2xl font-bold text-green-900">{lastResult.name}</p>
          <p className="mt-1 text-sm text-green-700">
            {lastResult.members?.length || 0} members
            {lastResult.members?.length
              ? ` — ${lastResult.members.map((m) => m.name).join(", ")}`
              : ""}
          </p>
          {lastResult.representative && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium text-amber-800">
              <Crown className="h-4 w-4" />
              Rep: {lastResult.representative.name}
            </p>
          )}
          <Button
            type="button"
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

      {availableTeams.length === 0 && teams.length > 0 && (
        <div className="w-full max-w-sm rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="mb-2 text-sm font-medium text-red-800">All teams eliminated</p>
          <Button type="button" size="sm" variant="outline" onClick={restoreAllTeams}>
            Restore All Teams
          </Button>
        </div>
      )}

      <Button
        type="button"
        onClick={onSpinAction}
        disabled={
          (!isSpinning && canvasItems.length === 0) || (isSpinning && !manuallyStop)
        }
        className={`px-12 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl ${
          settings.display?.spinButtonAnimation
            ? "animate-pulse bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isSpinning ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>{manuallyStop ? "Click Wheel to Stop" : "Spinning..."}</span>
          </div>
        ) : (
          "SPIN THE WHEEL"
        )}
      </Button>

      {emptyMessage && (
        <p className="text-center text-sm text-gray-500">{emptyMessage}</p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowThemes(true)}
          className="relative border-purple-500 px-3 py-1 text-xs text-purple-600 hover:border-purple-600 hover:bg-purple-50"
        >
          <Palette className="mr-2 h-4 w-4" />
          Themes
        </Button>
        <Button
          type="button"
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
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSocial(true)}
          className="relative border-orange-500 px-3 py-1 text-xs text-orange-600 hover:border-orange-600 hover:bg-orange-50"
        >
          <Users className="mr-2 h-4 w-4" />
          Social
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowGames(true)}
          className="relative border-red-500 px-3 py-1 text-xs text-red-600 hover:border-red-600 hover:bg-red-50"
        >
          <Gamepad2 className="mr-2 h-4 w-4" />
          Games
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAchievements(true)}
          className="relative border-yellow-500 px-3 py-1 text-xs text-yellow-600 hover:border-yellow-600 hover:bg-yellow-50"
        >
          <Trophy className="mr-2 h-4 w-4" />
          Achievements
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={shareResult}
          disabled={!lastResult}
          className="relative border-sky-500 px-3 py-1 text-xs text-sky-600 hover:border-sky-600 hover:bg-sky-50 disabled:opacity-50"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {teams.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setShowModal(true)}
            >
              Open Groups Board
            </Button>
            {eliminatedTeams.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={restoreAllTeams}
              >
                Restore All ({eliminatedTeams.length})
              </Button>
            )}
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
              const isEliminated = eliminatedTeams.includes(team.id)
              return (
                <Card
                  key={team.id}
                  className={`border p-3 shadow-sm ${isEliminated ? "opacity-50 grayscale" : ""}`}
                  style={{ borderColor: isEliminated ? "#cbd5e1" : team.color }}
                >
                  {team.mascot && (
                    <div className="mb-1 text-center text-3xl" aria-hidden>
                      {team.mascot}
                    </div>
                  )}
                  <div
                    className="mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-white"
                    style={{ backgroundColor: team.color }}
                  >
                    <Badge variant="secondary" className="bg-white/25 text-white">
                      {team.members.length}
                    </Badge>
                    <span className="truncate">{team.name}</span>
                    {isEliminated && (
                      <span className="ml-auto text-[10px] uppercase tracking-wide">
                        Out
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center gap-2 rounded px-2 py-1 text-sm ${
                          team.representative?.id === member.id
                            ? "border border-amber-300 bg-amber-50"
                            : "bg-slate-50"
                        }`}
                      >
                        {team.representative?.id === member.id && (
                          <Crown className="h-3.5 w-3.5 text-amber-600" />
                        )}
                        <span className="font-medium text-slate-800">{member.name}</span>
                        {member.gender && showGenderInResult && (
                          <Badge variant="outline" className="text-[10px]">
                            {member.gender === "male" ? "♂" : "♀"}
                          </Badge>
                        )}
                        {member.label && showLabelInResult && (
                          <Badge variant="secondary" className="text-[10px]">
                            {member.label}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Results ({spinHistory.length})</DialogTitle>
          </DialogHeader>
          {spinHistory.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No spins yet. Generate teams and spin the wheel.
            </p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {spinHistory.map((entry, i) => (
                <div
                  key={`${entry.team.id}-${i}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <span className="text-2xl" aria-hidden>
                    {entry.team.mascot || "🎯"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">
                      {entry.team.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {(entry.team.members || []).map((m) => m.name).join(", ") ||
                        "No members"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    #{spinHistory.length - i}
                  </Badge>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={spinHistory.length === 0}
              onClick={() => setSpinHistory([])}
            >
              Clear Results
            </Button>
            <Button type="button" size="sm" onClick={() => setShowResultsDialog(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2 pr-8">
              <span>Groups Board</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon">
                    <SettingsIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={exportToCSV}>
                    <Download className="mr-2 h-4 w-4" /> Download Result (.csv)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setPickRepresentatives?.(!pickRepresentatives)
                    }
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    {pickRepresentatives
                      ? "Hide Representatives"
                      : "Pick Representatives"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setShowGenderInResult?.(!showGenderInResult)
                    }
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {showGenderInResult ? "Hide Gender" : "Show Gender"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowLabelInResult?.(!showLabelInResult)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {showLabelInResult ? "Hide Label" : "Show Label"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card
                key={team.id}
                className="border p-3"
                style={{ borderColor: team.color }}
              >
                {team.mascot && (
                  <div className="mb-1 text-center text-3xl" aria-hidden>
                    {team.mascot}
                  </div>
                )}
                <div
                  className="mb-2 flex items-center gap-2 rounded px-2 py-1 text-sm font-semibold text-white"
                  style={{ backgroundColor: team.color }}
                >
                  <Badge variant="secondary" className="bg-white/25 text-white">
                    {team.members.length}
                  </Badge>
                  {team.name}
                </div>
                <div className="space-y-1">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-2 rounded px-2 py-1 text-sm ${
                        team.representative?.id === member.id
                          ? "border border-amber-300 bg-amber-50"
                          : "bg-slate-50"
                      }`}
                    >
                      {team.representative?.id === member.id && (
                        <Crown className="h-3.5 w-3.5 text-amber-600" />
                      )}
                      {member.name}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-center gap-3 border-t pt-4">
            <Button type="button" onClick={() => setShowModal(false)}>
              Done
            </Button>
            <Button type="button" variant="outline" onClick={clearTeams}>
              Remove All Groups
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ThemeSelector
        themes={themes}
        currentTheme={wheelTheme}
        onThemeChange={applyTheme}
        isVisible={showThemes}
        onClose={() => setShowThemes(false)}
      />

      <PickerWheelAnalyticsDisplay
        analytics={analyzeSpinData(
          spinHistory.map(
            (entry, i): AnalyticsSpinRecord => ({
              id: `${entry.team.id}-${i}`,
              timestamp: entry.timestamp,
              result: entry.team.name,
              options: teams.map((x) => x.name),
              mode: "team-picker",
              theme: wheelTheme,
              spinDuration: entry.durationMs,
            }),
          ),
        )}
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      <PickerWheelSocialHub
        isVisible={showSocial}
        onClose={() => setShowSocial(false)}
        onShareWheel={shareResult}
      />

      <PickerWheelGameModes
        isVisible={showGames}
        onClose={() => setShowGames(false)}
        userPoints={spinHistory.length * 10}
        onStartGame={() => {
          setShowGames(false)
          showToast("Start a spin from the wheel to play!", "info")
        }}
      />

      <AchievementsDisplay
        achievements={achievements}
        totalSpins={spinHistory.length}
        results={{ yes: spinHistory.length, no: 0, maybe: 0 }}
        streak={{ type: lastResult?.name || "", count: spinHistory.length > 0 ? 1 : 0 }}
        activeTab="manual"
        isVisible={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
    </div>
  )
}
