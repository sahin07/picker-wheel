"use client"

import { useCallback, useEffect, useMemo, useState, type RefObject } from "react"
import { Button } from "@/components/ui/button"
import PickerResultsModal from "@/components/picker-results-modal"
import { useWheelManagerStore, type FortniteWheelData } from "@/stores/wheel-manager-store"
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
import { WheelComponent } from "@/components/fortnite/wheel-component"
import type { ActionMode, DisplayMode, Skin, SpinResult } from "@/types/fortnite-types"
import type { WheelTheme } from "@/lib/picker-wheel-themes"
import { useSettingsStore } from "@/stores/settings-store"

export interface FortniteWheelSectionProps {
  isReady: boolean
  skins: Skin[]
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
  manualSkinName: string
  onManualSkinNameChange: (value: string) => void
  onAddManualSkin: () => void

  spinResult: SpinResult | null

  resultsCount?: number
  onViewResultDetails?: () => void
  /** When false, parent owns the Results control (NBA/MLB column pattern). Default true. */
  showResultsButton?: boolean

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
}

export default function FortniteWheelSection({
  isReady,
  skins,
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
  manualSkinName,
  onManualSkinNameChange,
  onAddManualSkin,
  spinResult,
  resultsCount: resultsCountProp,
  onViewResultDetails,
  showResultsButton = true,
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
}: FortniteWheelSectionProps) {
  const wheel = useWheelManagerStore(
    useCallback((state) => {
      const wheels = state.wheelsByTool[state.currentTool] || []
      return wheels.find((w) => w.id === state.currentWheelId) || null
    }, []),
  )
  const data = (wheel?.data as FortniteWheelData | undefined) ?? {
    recentResults: [],
    totalSpins: 0,
  }
  const resultsCount = resultsCountProp ?? data.recentResults?.length ?? 0

  const [showResultsModal, setShowResultsModal] = useState(false)

  const handleOpenResultsModal = useCallback(() => {
    setShowResultsModal(true)
  }, [])

  const handleCloseResultsModal = useCallback(() => {
    setShowResultsModal(false)
  }, [])

  useEffect(() => {
    const openResults = () => setShowResultsModal(true)
    window.addEventListener("open-fortnite-results", openResults)
    return () => window.removeEventListener("open-fortnite-results", openResults)
  }, [])

  const modalResults = useMemo(
    () =>
      (data.recentResults || []).slice(0, 5).map((result: { id?: string; name?: string; emoji?: string; timestamp?: number | Date }) => ({
        id: result.id,
        name: result.name,
        emoji: result.emoji,
        timestamp: result.timestamp,
      })),
    [data.recentResults],
  )

  const soundEnabled = useSettingsStore(
    (s) => s.settings.confettiSound?.enableSound ?? true,
  )

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
      {/* Results — same placement as NBA/MLB (section top-left, not on wheel face) */}
      {showResultsButton && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleOpenResultsModal}
          className="absolute left-2 top-2 z-10 border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50 sm:left-4 sm:top-4 sm:px-3"
        >
          Results
          {resultsCount > 0 && (
            <span className="ml-2 rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-700">
              {resultsCount}
            </span>
          )}
        </Button>
      )}

      <div className="relative mx-auto flex w-full max-w-[680px] flex-col items-center">
        <div
          className={`relative w-full max-w-[680px] overflow-visible ${
            !isSpinning && skins.length > 0 && isReady ? "cursor-pointer" : ""
          }`}
          onClick={!isSpinning && skins.length > 0 && isReady ? onSpin : undefined}
        >
          {!isReady ? (
            <div className="mx-auto flex aspect-square w-full max-w-[680px] items-center justify-center rounded-full bg-gray-100">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <p className="text-gray-600">Loading skins...</p>
              </div>
            </div>
          ) : (
            <WheelComponent
              key={wheelKey}
              skins={skins}
              rotation={rotation}
              isSpinning={isSpinning}
              spinDuration={spinDuration}
              wheelRef={wheelRef as RefObject<HTMLDivElement>}
              displayMode={displayMode}
              currentTheme={currentTheme}
              themes={themes}
              onSpinCompleted={onSpinCompleted}
            />
          )}

          {/* Mute / fullscreen — same as NBA */}
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
            <div className="absolute right-2 top-2 z-20 animate-pulse rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
              Spinning...
            </div>
          )}
        </div>

        <PickerResultsModal
          isOpen={showResultsModal}
          onClose={handleCloseResultsModal}
          results={modalResults}
        />
      </div>

      {/* Result card */}
      {spinResult && !isSpinning && (
        <div className="mb-2 w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-4 text-center shadow-lg sm:mb-4 sm:p-6">
          <h3 className="mb-2 text-base font-semibold text-green-800 sm:text-lg">
            🎉 Selected Skin!
          </h3>
          <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4 sm:gap-3">
            <span className="text-3xl sm:text-4xl">{spinResult.skin.emoji}</span>
            <div className="min-w-0 text-left">
              <p className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                {spinResult.skin.name}
              </p>
              <p className="text-xs text-gray-600 sm:text-sm">
                {spinResult.skin.rarity} · {spinResult.skin.season}
              </p>
            </div>
          </div>
          {onViewResultDetails && (
            <Button
              type="button"
              onClick={onViewResultDetails}
              variant="outline"
              size="sm"
              className="border-green-300 bg-white text-green-700 hover:bg-gray-50"
            >
              📊 View Skin Details
            </Button>
          )}
        </div>
      )}

      {isGameActive && currentGameModeName && (
        <div className="mb-2 w-full max-w-md rounded-lg border-2 border-purple-300 bg-gradient-to-r from-purple-100 to-pink-100 p-2.5 sm:mb-4 sm:p-3">
          <p className="text-xs font-semibold text-purple-800 sm:text-sm">
            🎮 Playing: {currentGameModeName}
          </p>
        </div>
      )}

      <Button
        type="button"
        onClick={onSpin}
        disabled={isSpinning || skins.length === 0 || !isReady}
        className="w-full max-w-sm bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl sm:px-12 sm:text-lg"
      >
        {isSpinning ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Spinning...</span>
          </div>
        ) : (
          "🎯 SPIN THE WHEEL"
        )}
      </Button>

      {skins.length === 0 && isReady && (
        <p className="mt-4 text-center text-gray-500">Select some skins to start spinning!</p>
      )}

      {/* Game Mode — same card layout as NBA */}
      <div className="mt-4 w-full max-w-md rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-3 sm:mt-6 sm:p-4">
        <label className="mb-2 flex items-center text-sm font-semibold text-red-800 sm:mb-3">
          <span className="mr-2 h-2 w-2 rounded-full bg-red-500" />
          Game Mode
        </label>

        {actionMode === "manual" && (
          <div className="mb-3 flex min-w-0 items-center gap-2">
            <input
              value={manualSkinName}
              onChange={(e) => onManualSkinNameChange(e.target.value)}
              placeholder="Type skin name..."
              className="min-w-0 flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && manualSkinName.trim()) onAddManualSkin()
              }}
            />
            <Button
              onClick={onAddManualSkin}
              disabled={!manualSkinName.trim()}
              size="sm"
              className="shrink-0 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add
            </Button>
          </div>
        )}

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
                  ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25"
                  : "border border-red-200 bg-white hover:border-red-300 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50"
              }`}
            >
              <input
                type="radio"
                name="fortniteActionMode"
                value={mode.value}
                checked={actionMode === mode.value}
                onChange={handleActionModeChange}
                className="sr-only"
              />
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  actionMode === mode.value ? "bg-white/20" : "bg-red-100"
                }`}
              >
                <span className="text-sm">{mode.icon}</span>
              </div>
              <span
                className={`text-[10px] font-semibold sm:text-xs ${
                  actionMode === mode.value ? "text-white" : "text-red-700"
                }`}
              >
                {mode.label}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-2 rounded-lg bg-red-50 p-2 text-center text-[11px] text-red-600 sm:mt-3 sm:text-xs">
          {actionMode === "normal" && "🎯 All skins available for each spin"}
          {actionMode === "elimination" && "❌ Selected skin is removed after each spin"}
          {actionMode === "manual" && "📝 Add custom skins by typing names"}
        </div>
      </div>

      <div className="mb-2 mt-4 grid w-full grid-cols-5 gap-1.5 sm:mt-6 sm:gap-2">
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
            className="h-auto min-w-0 border-red-300 bg-red-50 px-1.5 py-1.5 text-[10px] text-red-700 hover:bg-red-100 sm:px-2 sm:text-xs"
          >
            <Gamepad2 className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
            <span className="truncate">Games</span>
          </Button>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <span>Total spins: {displaySpinCount}</span>
      </div>
    </div>
  )
}
