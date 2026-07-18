"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Palette,
  ListChecks,
  Image as ImageIcon,
  Brain,
  Eye,
  EyeOff,
  Shuffle,
  BarChart3,
  Maximize2,
  Minimize2,
  MoreVertical,
  Trophy,
  Target,
  History,
} from "lucide-react"
import { ColorWheelControls } from "@/components/color-picker-wheel/color-wheel-controls"
import { ManualControls } from "@/components/color-picker-wheel/manual-controls"
import { ImageControls } from "@/components/color-picker-wheel/image-controls"
import { ColorOutputDisplay } from "@/components/color-picker-wheel/color-output-display"
import { AIPaletteGenerator } from "@/components/color-picker-wheel/ai-palette-generator"
import { EnhancedColorNaming } from "@/components/color-picker-wheel/enhanced-color-naming"
import { ColorBlindnessSimulator } from "@/components/color-picker-wheel/color-blindness-simulator"
import { AIColorAnalysis } from "@/components/color-picker-wheel/ai-color-analysis"
import { AIColorLearning } from "@/components/color-picker-wheel/ai-color-learning"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { useSettingsStore } from "@/stores/settings-store"
import type { WheelSettings } from "@/types/settings"
import type { ColorResultShowMode } from "@/lib/color-formats"

export type ColorPickerModeTab = "color-wheel" | "manual" | "image" | "ai"
export type ColorPickerSidebarTab = ColorPickerModeTab | "other"
export type ColorResultActionMode = "normal" | "elimination"

export type ColorListItem = {
  id: string
  color: string
  name: string
  enabled: boolean
}

export type ColorSpinResult = {
  color: string
  name?: string
  hex?: string
  rgb?: string
  rgba?: string
  complementary?: { hex: string; rgb: string; rgba?: string }
} | null

const TABS: { id: ColorPickerSidebarTab; label: string; icon: ReactNode }[] = [
  { id: "color-wheel", label: "Color Wheel", icon: <Palette className="h-4 w-4" /> },
  { id: "manual", label: "Manual", icon: <ListChecks className="h-4 w-4" /> },
  { id: "image", label: "Image", icon: <ImageIcon className="h-4 w-4" /> },
  { id: "ai", label: "AI-Powered", icon: <Brain className="h-4 w-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="h-4 w-4" /> },
]

export type ColorPickerSidebarProps = {
  activeTab: ColorPickerModeTab
  setActiveTab: (tab: ColorPickerModeTab) => void
  resultActionMode: ColorResultActionMode
  setResultActionMode: (mode: ColorResultActionMode) => void
  eliminatedCount: number
  onRestoreEliminated: () => void
  activeCount: number
  colorCombination: string
  setColorCombination: (v: string) => void
  spinningPointerMode: "manual" | "random"
  setSpinningPointerMode: (v: "manual" | "random") => void
  selectedColor: string
  setSelectedColor: (v: string) => void
  customColors: ColorListItem[]
  setCustomColors: (
    colors:
      | ColorListItem[]
      | ((prev: ColorListItem[]) => ColorListItem[]),
  ) => void
  onReset: () => void
  confettiEnabled: boolean
  setConfettiEnabled: (v: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (v: boolean) => void
  resultShowMode: ColorResultShowMode
  setResultShowMode: (v: ColorResultShowMode) => void
  colorAlpha: number
  setColorAlpha: (alpha: number) => void
  lastResult: ColorSpinResult
  results: Array<{ color: string; name?: string }>
  onOpenTitleModal: () => void
  onShuffle: () => void
  onHideInputs: () => void
  showStats: boolean
  setShowStats: (v: boolean) => void
  isFullScreen: boolean
  onToggleFullscreen: () => void
  onAddAiColors: (colors: string[], names?: string[]) => void
  onUpdateLastResultName: (name: string) => void
  onAddSingleColor: (color: string, name?: string) => void
  onViewResults?: () => void
  onOpenAnalytics?: () => void
  onOpenSettings?: () => void
  onOpenAchievements?: () => void
  onOpenChallenges?: () => void
  resultsCount?: number
  historyCount?: number
  totalPoints?: number
}

export function ColorPickerSidebar({
  activeTab,
  setActiveTab,
  resultActionMode,
  setResultActionMode,
  eliminatedCount,
  onRestoreEliminated,
  activeCount,
  colorCombination,
  setColorCombination,
  spinningPointerMode,
  setSpinningPointerMode,
  selectedColor,
  setSelectedColor,
  customColors,
  setCustomColors,
  onReset,
  confettiEnabled,
  setConfettiEnabled,
  soundEnabled,
  setSoundEnabled,
  resultShowMode,
  setResultShowMode,
  colorAlpha,
  setColorAlpha,
  lastResult,
  results,
  onOpenTitleModal,
  onShuffle,
  onHideInputs,
  showStats,
  setShowStats,
  isFullScreen,
  onToggleFullscreen,
  onAddAiColors,
  onUpdateLastResultName,
  onAddSingleColor,
  onViewResults,
  onOpenAnalytics,
  onOpenSettings,
  onOpenAchievements,
  onOpenChallenges,
  resultsCount = 0,
  historyCount = 0,
  totalPoints = 0,
}: ColorPickerSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarTab, setSidebarTab] = useState<ColorPickerSidebarTab>(activeTab)
  const { settings, updateSettings } = useSettingsStore()

  useEffect(() => {
    if (sidebarTab !== "other") {
      setSidebarTab(activeTab)
    }
  }, [activeTab])

  const selectTab = (tab: ColorPickerSidebarTab) => {
    setSidebarTab(tab)
    if (tab !== "other") {
      setActiveTab(tab)
    }
  }

  const exportText = useMemo(
    () =>
      customColors
        .map((c) => `${c.name || "Color"},${c.color},${c.enabled ? "on" : "off"}`)
        .join("\n"),
    [customColors],
  )

  const exportEntries = useMemo(
    () =>
      customColors.map((c) => ({
        id: c.id,
        name: c.name || c.color,
        weight: 1,
        enabled: c.enabled,
      })),
    [customColors],
  )

  const importColorsFromText = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) return

    const next: ColorListItem[] = lines.map((line, i) => {
      const parts = line.split(/[,|\t]/).map((p) => p.trim())
      const maybeHex = parts.find((p) => /^#?[0-9a-fA-F]{3,8}$/.test(p))
      const hex = maybeHex
        ? maybeHex.startsWith("#")
          ? maybeHex
          : `#${maybeHex}`
        : `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0")}`
      const name = parts[0] && parts[0] !== maybeHex ? parts[0] : hex
      const enabled = !parts.some((p) => /^(off|false|0)$/i.test(p))
      return {
        id: `${Date.now()}-${i}`,
        color: hex,
        name,
        enabled,
      }
    })
    setCustomColors(next)
    setActiveTab("manual")
    setSidebarTab("manual")
  }

  const sortColorsZA = () => {
    setCustomColors(
      [...customColors].sort((a, b) =>
        b.name.localeCompare(a.name, undefined, { sensitivity: "base" }),
      ),
    )
  }

  const equalizeColors = () => {
    setCustomColors(customColors.map((c) => ({ ...c, enabled: true })))
  }

  const deleteBlankColors = () => {
    setCustomColors(
      customColors.filter((c) => c.name.trim().length > 0 || c.color.trim().length > 0),
    )
  }

  const removeDuplicateColors = () => {
    const seen = new Set<string>()
    setCustomColors(
      customColors.filter((c) => {
        const key = c.color.trim().toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }),
    )
  }

  const clearAllColors = () => {
    setCustomColors([])
    onReset()
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b bg-slate-50/80 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-800">Color Controls</p>
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {activeCount} active
          </span>
          {eliminatedCount > 0 && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {eliminatedCount} out
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {onOpenAchievements && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Achievements"
              onClick={onOpenAchievements}
            >
              <Trophy className="h-4 w-4" />
            </Button>
          )}
          {onOpenChallenges && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 p-0"
              title={`Challenges (${totalPoints} pts)`}
              onClick={onOpenChallenges}
            >
              <Target className="h-4 w-4" />
              {totalPoints > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-500 px-0.5 text-[10px] text-white">
                  {totalPoints}
                </span>
              )}
            </Button>
          )}
          {onViewResults && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 p-0"
              title={`Spin History (${historyCount})`}
              onClick={onViewResults}
            >
              <History className="h-4 w-4" />
              {historyCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-0.5 text-[10px] text-white">
                  {historyCount}
                </span>
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Modify title & description"
            onClick={onOpenTitleModal}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Shuffle"
            onClick={onShuffle}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={showStats ? "Hide stats" : "Show stats"}
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={isFullScreen ? "Exit full screen" : "Full screen"}
            onClick={onToggleFullscreen}
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Hide"
            onClick={onHideInputs}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
          <SlicesManageMenu
            settings={settings as unknown as WheelSettings}
            onUpdateSettings={(partial) => {
              updateSettings(partial as any)
              if (partial.spinBehavior && "removeWinnerAfterSpin" in partial.spinBehavior) {
                setResultActionMode(
                  partial.spinBehavior.removeWinnerAfterSpin ? "elimination" : "normal",
                )
              }
            }}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSortZA={sortColorsZA}
            onShuffle={onShuffle}
            onEqualize={equalizeColors}
            onDeleteBlanks={deleteBlankColors}
            onRemoveDuplicates={removeDuplicateColors}
            onClearAll={clearAllColors}
          />
        </div>
      </div>

      <div className="flex overflow-x-auto border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => selectTab(tab.id)}
            className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors ${
              sidebarTab === tab.id
                ? "border-b-2 border-emerald-600 bg-emerald-50/50 text-emerald-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-h-[70vh] space-y-4 overflow-y-auto p-3">
        {sidebarTab !== "other" && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Action Mode</Label>
            <div className="flex items-center gap-2">
              <Select
                value={resultActionMode}
                onValueChange={(value: ColorResultActionMode) => {
                  setResultActionMode(value)
                  updateSettings({
                    spinBehavior: {
                      ...settings.spinBehavior,
                      removeWinnerAfterSpin: value === "elimination",
                    },
                  } as any)
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="elimination">Elimination</SelectItem>
                </SelectContent>
              </Select>
              {resultActionMode === "elimination" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 shrink-0 text-xs"
                  onClick={onRestoreEliminated}
                  title="Restore all eliminated colors"
                >
                  Restore All
                </Button>
              )}
            </div>
          </div>
        )}

        {sidebarTab === "color-wheel" && (
          <>
            <ColorOutputDisplay
              selectedColor={selectedColor}
              colorCombination={colorCombination}
              lastResult={lastResult}
              colorAlpha={colorAlpha}
            />
            <ColorWheelControls
              colorCombination={colorCombination}
              setColorCombination={setColorCombination}
              spinningPointerMode={spinningPointerMode}
              setSpinningPointerMode={setSpinningPointerMode}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              onReset={onReset}
              confettiEnabled={confettiEnabled}
              setConfettiEnabled={setConfettiEnabled}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              resultShowMode={resultShowMode}
              setResultShowMode={setResultShowMode}
              colorAlpha={colorAlpha}
              setColorAlpha={setColorAlpha}
            />
          </>
        )}

        {sidebarTab === "manual" && (
          <ManualControls
            customColors={customColors}
            setCustomColors={setCustomColors}
            onReset={onReset}
            showSettings={false}
            setShowSettings={() => {}}
            confettiEnabled={confettiEnabled}
            setConfettiEnabled={setConfettiEnabled}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            resultShowMode={resultShowMode}
            setResultShowMode={setResultShowMode}
          />
        )}

        {sidebarTab === "image" && (
          <ImageControls
            customColors={customColors}
            setCustomColors={setCustomColors}
            onReset={onReset}
            showSettings={false}
            setShowSettings={() => {}}
            confettiEnabled={confettiEnabled}
            setConfettiEnabled={setConfettiEnabled}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            resultShowMode={resultShowMode}
            setResultShowMode={setResultShowMode}
            colorAlpha={colorAlpha}
            setColorAlpha={setColorAlpha}
          />
        )}

        {sidebarTab === "ai" && (
          <div className="space-y-6">
            <AIPaletteGenerator onAddColors={onAddAiColors} />
            <EnhancedColorNaming
              color={lastResult?.color || "#FF0000"}
              onNameChange={onUpdateLastResultName}
              currentName={lastResult?.name}
            />
            <ColorBlindnessSimulator
              color={lastResult?.color || "#FF0000"}
              onColorChange={() => {}}
            />
            <AIColorAnalysis
              colors={results.map((r) => r.color)}
              onAddColor={onAddSingleColor}
            />
            <AIColorLearning results={results} onAddColor={onAddSingleColor} />
          </div>
        )}

        {sidebarTab === "other" && (
          <div className="space-y-4">
            <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Confetti</p>
                  <p className="text-xs text-slate-500">Celebrate each spin result</p>
                </div>
                <Switch checked={confettiEnabled} onCheckedChange={setConfettiEnabled} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Sound</p>
                  <p className="text-xs text-slate-500">Play spin / result sounds</p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={(checked) => setSoundEnabled(checked)}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Show stats</p>
                  <p className="text-xs text-slate-500">Show results panel stats</p>
                </div>
                <Switch checked={showStats} onCheckedChange={setShowStats} />
              </div>
            </div>

            <SidebarOtherOptions
              toolLabel="Color Picker Wheel"
              resultsCount={resultsCount}
              exportFileName="color-picker-colors.csv"
              exportText={exportText}
              entries={exportEntries}
              onImportText={importColorsFromText}
              onRemoveDuplicates={removeDuplicateColors}
              onViewResults={onViewResults}
              onOpenSettings={onOpenSettings}
              onOpenAnalytics={onOpenAnalytics || onViewResults}
              onToggleFullscreen={onToggleFullscreen}
              onOpenAI={() => {
                setActiveTab("ai")
                setSidebarTab("ai")
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
