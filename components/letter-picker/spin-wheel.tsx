"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Palette,
  BarChart3,
  Users,
  Gamepad2,
  Trophy,
  RotateCcw,
} from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { WheelCanvas } from "@/components/wheel-canvas"
import { LetterModeResultPanel } from "@/components/letter-picker/letter-mode-result-panel"
import type { LetterSlice } from "@/types/letter-picker"
import type { LetterModeResult } from "@/lib/letter-picker-mode-results"

const WHEEL_SIZE = 680

interface SpinWheelProps {
  slices: LetterSlice[]
  rotation: number
  isSpinning: boolean
  isFullscreen: boolean
  muted: boolean
  onMutedChange: (muted: boolean) => void
  highlightIndex?: number | null
  manuallyStop?: boolean
  totalSpins?: number
  winnerLabel?: string | null
  /** Mode-specific result card (classroom, phonics, etc.) */
  modeResult?: LetterModeResult | null
  mysteryResult?: boolean
  mysteryRevealed?: boolean
  onRevealMystery?: () => void
  onSpin: () => void
  showResultsButton?: boolean
  onShowAllResults?: () => void
  onToggleFullscreen: () => void
  onOpenThemes?: () => void
  onOpenAnalytics?: () => void
  onOpenSocial?: () => void
  onOpenGames?: () => void
  onOpenAchievements?: () => void
  themesUnlocked?: number
  analyticsCount?: number
  achievementPoints?: number
  isGameActive?: boolean
  currentGameMode?: string
  onRotationFrame?: (rotationDegrees: number, segmentCount: number) => void
  onSpinComplete?: () => void
}

export function SpinWheel({
  slices,
  rotation,
  isSpinning,
  isFullscreen,
  muted,
  onMutedChange,
  highlightIndex = null,
  manuallyStop = false,
  totalSpins = 0,
  winnerLabel = null,
  modeResult = null,
  mysteryResult = false,
  mysteryRevealed = true,
  onRevealMystery,
  onSpin,
  showResultsButton = true,
  onShowAllResults,
  onToggleFullscreen,
  onOpenThemes,
  onOpenAnalytics,
  onOpenSocial,
  onOpenGames,
  onOpenAchievements,
  themesUnlocked = 0,
  analyticsCount = 0,
  achievementPoints = 0,
  isGameActive = false,
  currentGameMode,
  onRotationFrame,
  onSpinComplete,
}: SpinWheelProps) {
  const { settings } = useSettingsStore()
  const soundGloballyOff = !settings.confettiSound.enableSound

  const canvasItems = useMemo(
    () =>
      (slices || [])
        .filter((s) => s.enabled && s.text.trim().length > 0)
        .map((s) => ({
          value: s.text,
          weight: Math.max(1, s.weight || 1),
          color: s.color,
          id: s.id,
        })),
    [slices],
  )

  const canClickSpin = !isSpinning || manuallyStop

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center space-y-6 overflow-auto bg-white p-4"
          : "relative flex flex-col items-center space-y-4"
      }
    >
      <div className="relative w-full max-w-[680px]">
        {showResultsButton && !isFullscreen && onShowAllResults && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShowAllResults}
            className="absolute left-0 top-0 z-10 border-blue-500 bg-white px-3 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50"
          >
            Results
            {totalSpins > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {totalSpins}
              </Badge>
            )}
          </Button>
        )}

        <div
          className="relative mx-auto cursor-pointer"
          style={{ width: "min(100%, 680px)" }}
          onClick={canClickSpin ? onSpin : undefined}
        >
          <WheelCanvas
            numbers={canvasItems}
            isSpinning={isSpinning}
            settings={settings}
            rotation={rotation}
            size={WHEEL_SIZE}
            highlightIndex={highlightIndex}
            onRotationFrame={onRotationFrame}
            onSpinComplete={onSpinComplete}
          />

          <div className="absolute bottom-4 left-4 z-20 flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onMutedChange(!muted)
              }}
              className="h-10 w-10 bg-white/90 p-0 shadow-md hover:bg-white"
              title={soundGloballyOff ? "Global sound disabled" : muted ? "Unmute" : "Mute"}
            >
              {soundGloballyOff || muted ? (
                <VolumeX className={`h-5 w-5 ${soundGloballyOff ? "text-gray-400" : ""}`} />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFullscreen()
              }}
              className="h-10 w-10 bg-white/90 p-0 shadow-md hover:bg-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>

          {isSpinning && (
            <div className="absolute right-4 top-4 z-20 animate-pulse rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
              {manuallyStop ? "Click to Stop!" : "Spinning..."}
            </div>
          )}
        </div>
      </div>

      {(modeResult || winnerLabel) && !isSpinning && (
        modeResult ? (
          <div
            onClick={() => {
              if (mysteryResult && !mysteryRevealed) onRevealMystery?.()
            }}
          >
            <LetterModeResultPanel
              result={modeResult}
              mysteryHidden={!!mysteryResult && !mysteryRevealed}
            />
          </div>
        ) : (
          <div
            className={`w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center shadow-lg ${
              mysteryResult && !mysteryRevealed ? "cursor-pointer" : ""
            }`}
            onClick={() => {
              if (mysteryResult && !mysteryRevealed) onRevealMystery?.()
            }}
          >
            <h3 className="mb-2 text-lg font-semibold text-green-800">🎉 Winner!</h3>
            <p className="text-2xl font-bold text-green-900">
              {mysteryResult && !mysteryRevealed ? "?" : winnerLabel}
            </p>
            {mysteryResult && !mysteryRevealed && (
              <p className="mt-2 text-xs text-green-700">Click to reveal result</p>
            )}
          </div>
        )
      )}

      {isGameActive && currentGameMode && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-purple-300 bg-purple-100 p-2">
          <Gamepad2 className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">Playing: {currentGameMode}</span>
        </div>
      )}

      <Button
        onClick={onSpin}
        disabled={(!isSpinning && canvasItems.length === 0) || (isSpinning && !manuallyStop)}
        className={`px-12 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl ${
          settings.display.spinButtonAnimation
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
          "🎯 SPIN THE WHEEL"
        )}
      </Button>

      {canvasItems.length === 0 && (
        <p className="text-center text-gray-500">Add some letters to start spinning!</p>
      )}

      {settings.display.showSpinCount && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Total spin = {totalSpins}</span>
          <RotateCcw className="h-4 w-4" />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        {onOpenThemes && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenThemes}
            className="relative border-purple-500 px-3 py-1 text-xs text-purple-600 hover:border-purple-600 hover:bg-purple-50"
          >
            <Palette className="mr-2 h-4 w-4" />
            Themes
            {themesUnlocked > 3 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {themesUnlocked}
              </Badge>
            )}
          </Button>
        )}
        {onOpenAnalytics && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAnalytics}
            className="relative border-green-500 px-3 py-1 text-xs text-green-600 hover:border-green-600 hover:bg-green-50"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
            {analyticsCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {analyticsCount}
              </Badge>
            )}
          </Button>
        )}
        {onOpenSocial && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSocial}
            className="relative border-orange-500 px-3 py-1 text-xs text-orange-600 hover:border-orange-600 hover:bg-orange-50"
          >
            <Users className="mr-2 h-4 w-4" />
            Social
          </Button>
        )}
        {onOpenGames && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenGames}
            className="relative border-red-500 px-3 py-1 text-xs text-red-600 hover:border-red-600 hover:bg-red-50"
          >
            <Gamepad2 className="mr-2 h-4 w-4" />
            Games
            <Badge variant="secondary" className="ml-2 text-xs">
              5
            </Badge>
          </Button>
        )}
        {onOpenAchievements && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAchievements}
            className="relative border-yellow-500 px-3 py-1 text-xs text-yellow-600 hover:border-yellow-600 hover:bg-yellow-50"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Achievements
            <Badge variant="secondary" className="ml-2 text-xs">
              {achievementPoints}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  )
}
