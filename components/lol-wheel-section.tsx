"use client"

import type { RefObject } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Trophy,
  Palette,
  BarChart3,
  Users,
  Gamepad2,
} from "lucide-react"
import { WheelComponent, LOL_WHEEL_SIZE } from "@/components/lol-wheel-component"
import type { ActionMode, DisplayMode, LoLChampion, SpinResult } from "@/types/lol-types"
import type { WheelTheme } from "@/lib/picker-wheel-themes"
import { useSettingsStore } from "@/stores/settings-store"

export { LOL_WHEEL_SIZE }

export interface LolWheelSectionProps {
  champions: LoLChampion[]
  rotation: number
  isSpinning: boolean
  spinDuration: number
  wheelRef: RefObject<HTMLDivElement | null>
  displayMode: DisplayMode
  currentTheme?: string
  themes?: WheelTheme[]
  wheelKey?: string
  onSpinCompleted?: () => void

  muted: boolean
  onToggleMute: () => void

  displaySpinCount: number
  onSpin: () => void
  onManualStop?: () => void

  actionMode: ActionMode
  onActionModeChange: (mode: ActionMode) => void
  manualChampionName: string
  onManualChampionNameChange: (value: string) => void
  onAddManualChampion: () => void

  spinResult?: SpinResult | null
  selectedResult?: SpinResult | null

  isGameActive?: boolean
  currentGameModeName?: string

  onOpenAchievements?: () => void
  onOpenThemeSelector?: () => void
  onOpenAnalytics?: () => void
  onOpenSocialHub?: () => void
  onOpenGameModes?: () => void
  totalPoints?: number

  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  soundEnabled?: boolean
}

export default function LolWheelSection({
  champions,
  rotation,
  isSpinning,
  spinDuration,
  wheelRef,
  displayMode,
  currentTheme = "classic",
  themes = [],
  wheelKey,
  onSpinCompleted,
  muted,
  onToggleMute,
  displaySpinCount,
  onSpin,
  onManualStop,
  actionMode,
  onActionModeChange,
  manualChampionName,
  onManualChampionNameChange,
  onAddManualChampion,
  spinResult,
  selectedResult,
  isGameActive = false,
  currentGameModeName,
  onOpenAchievements,
  onOpenThemeSelector,
  onOpenAnalytics,
  onOpenSocialHub,
  onOpenGameModes,
  totalPoints = 0,
  isFullscreen = false,
  onToggleFullscreen,
  soundEnabled: soundEnabledProp,
}: LolWheelSectionProps) {
  const soundFromStore = useSettingsStore(
    (s) => s.settings.confettiSound?.enableSound ?? true,
  )
  const soundEnabled = soundEnabledProp ?? soundFromStore

  const currentResult = selectedResult ?? spinResult ?? null

  const handleActionModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onActionModeChange(event.target.value as ActionMode)
  }

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4 overflow-auto bg-white p-3 sm:space-y-6 sm:p-4"
          : "relative flex w-full min-w-0 max-w-full flex-col items-center space-y-4 sm:space-y-6"
      }
    >
      <div className="relative mx-auto flex w-full max-w-[680px] flex-col items-center">
        <div
          className={`relative w-full max-w-[680px] overflow-visible ${
            !isSpinning && champions.length > 0 ? "cursor-pointer" : ""
          }`}
          onClick={!isSpinning && champions.length > 0 ? onSpin : undefined}
        >
          <WheelComponent
            key={wheelKey}
            items={champions}
            rotation={rotation}
            isSpinning={isSpinning}
            spinDuration={spinDuration}
            wheelRef={wheelRef as RefObject<HTMLDivElement>}
            displayMode={displayMode}
            currentTheme={currentTheme}
            themes={themes}
            onSpinCompleted={onSpinCompleted}
          />

          <div className="absolute bottom-2 left-2 z-20 flex flex-col space-y-2 sm:bottom-4 sm:left-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleMute()
              }}
              className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white sm:h-10 sm:w-10"
              title={
                !soundEnabled
                  ? "Global sound disabled"
                  : muted
                    ? "Unmute"
                    : "Mute"
              }
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
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFullscreen()
                }}
                className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white sm:h-10 sm:w-10"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            )}
          </div>

          {isSpinning && onManualStop && (
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onManualStop()
              }}
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white hover:bg-red-600"
              size="sm"
            >
              STOP
            </Button>
          )}

          {isSpinning && (
            <div className="absolute right-2 top-2 z-20 animate-pulse rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
              Spinning...
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{displaySpinCount}</div>
            <div className="text-sm opacity-90">Total Spins</div>
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={onSpin}
        disabled={isSpinning || champions.length === 0}
        className="w-full max-w-sm bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl sm:px-12 sm:text-lg"
      >
        {isSpinning ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Spinning...</span>
          </div>
        ) : (
          `⚔️ SPIN THE WHEEL (${champions.length} Champions)`
        )}
      </Button>

      {champions.length === 0 && (
        <p className="mt-2 text-center text-gray-500">Select some champions to start spinning!</p>
      )}

      {actionMode === "manual" && (
        <div className="flex min-w-0 items-center gap-2">
          <Input
            value={manualChampionName}
            onChange={(e) => onManualChampionNameChange(e.target.value)}
            placeholder="Type champion name..."
            className="min-w-0 w-40 text-sm sm:w-48"
            onKeyDown={(e) => {
              if (e.key === "Enter" && manualChampionName.trim()) onAddManualChampion()
            }}
          />
          <Button
            onClick={onAddManualChampion}
            disabled={!manualChampionName.trim()}
            size="sm"
            className="shrink-0 bg-green-500 text-white hover:bg-green-600"
          >
            Add
          </Button>
        </div>
      )}

      <div className="mt-2 w-full max-w-md rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:mt-4 sm:p-4">
        <label className="mb-2 flex items-center text-sm font-semibold text-blue-800 sm:mb-3">
          <span className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
          Game Mode
        </label>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {(
            [
              { value: "normal" as const, icon: "🎯", label: "Normal" },
              { value: "elimination" as const, icon: "❌", label: "Elimination" },
              { value: "manual" as const, icon: "📝", label: "Manual" },
            ] as const
          ).map((mode) => (
            <label
              key={mode.value}
              className={`flex cursor-pointer flex-col items-center space-y-1 rounded-lg p-2 transition-all duration-200 sm:space-y-2 sm:p-3 ${
                actionMode === mode.value
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                  : "border border-blue-200 bg-white hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50"
              }`}
            >
              <input
                type="radio"
                name="lolActionMode"
                value={mode.value}
                checked={actionMode === mode.value}
                onChange={handleActionModeChange}
                className="sr-only"
              />
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  actionMode === mode.value ? "bg-white/20" : "bg-blue-100"
                }`}
              >
                <span className="text-sm">{mode.icon}</span>
              </div>
              <span
                className={`text-[10px] font-semibold sm:text-xs ${
                  actionMode === mode.value ? "text-white" : "text-blue-700"
                }`}
              >
                {mode.label}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-2 rounded-lg bg-blue-50 p-2 text-center text-[11px] text-blue-600 sm:mt-3 sm:text-xs">
          {actionMode === "normal" && "🎯 All champions available for each spin"}
          {actionMode === "elimination" && "❌ Selected champion is removed after each spin"}
          {actionMode === "manual" && "📝 Add custom champions by typing names"}
        </div>
      </div>

      {currentResult && !isSpinning && (
        <div className="w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-4 text-center shadow-lg sm:p-6">
          <h3 className="mb-2 text-base font-semibold text-green-800 sm:text-lg">
            🎉 Current Result:
          </h3>
          <div className="mb-1 flex items-center justify-center gap-2 sm:gap-3">
            <span className="text-3xl sm:text-4xl">{currentResult.champion.emoji}</span>
            <div className="min-w-0 text-left">
              <p className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                {currentResult.champion.name}
              </p>
              <p className="text-xs capitalize text-gray-600 sm:text-sm">
                {currentResult.champion.role}
                {" · "}
                {currentResult.champion.difficulty} difficulty
                {" · "}
                {currentResult.champion.playStyle} playstyle
              </p>
              <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                {currentResult.champion.popularity} · {currentResult.champion.region} — fair pick
                for challenges, drafts, and streams.
              </p>
            </div>
          </div>
        </div>
      )}

      {isGameActive && currentGameModeName && (
        <div className="w-full max-w-md rounded-lg border-2 border-purple-300 bg-gradient-to-r from-purple-100 to-pink-100 p-2.5 sm:p-3">
          <p className="text-xs font-semibold text-purple-800 sm:text-sm">
            🎮 Playing: {currentGameModeName}
          </p>
        </div>
      )}

      <div className="mb-2 mt-2 grid w-full grid-cols-5 gap-1.5 sm:mt-4 sm:gap-2">
        {onOpenAchievements && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAchievements}
            className="h-auto min-w-0 border-yellow-300 bg-yellow-50 px-1.5 py-1.5 text-[10px] text-yellow-700 hover:bg-yellow-100 sm:px-2 sm:text-xs"
          >
            <Trophy className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
            <span className="truncate">Achievements ({totalPoints})</span>
          </Button>
        )}
        {onOpenThemeSelector && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenThemeSelector}
            className="h-auto min-w-0 border-purple-300 bg-purple-50 px-1.5 py-1.5 text-[10px] text-purple-700 hover:bg-purple-100 sm:px-2 sm:text-xs"
          >
            <Palette className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
            <span className="truncate">Themes</span>
          </Button>
        )}
        {onOpenAnalytics && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAnalytics}
            className="h-auto min-w-0 border-green-300 bg-green-50 px-1.5 py-1.5 text-[10px] text-green-700 hover:bg-green-100 sm:px-2 sm:text-xs"
          >
            <BarChart3 className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
            <span className="truncate">Analytics</span>
          </Button>
        )}
        {onOpenSocialHub && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSocialHub}
            className="h-auto min-w-0 border-orange-300 bg-orange-50 px-1.5 py-1.5 text-[10px] text-orange-700 hover:bg-orange-100 sm:px-2 sm:text-xs"
          >
            <Users className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
            <span className="truncate">Social</span>
          </Button>
        )}
        {onOpenGameModes && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenGameModes}
            className="h-auto min-w-0 border-blue-300 bg-blue-50 px-1.5 py-1.5 text-[10px] text-blue-700 hover:bg-blue-100 sm:px-2 sm:text-xs"
          >
            <Gamepad2 className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
            <span className="truncate">Games</span>
          </Button>
        )}
      </div>
    </div>
  )
}
