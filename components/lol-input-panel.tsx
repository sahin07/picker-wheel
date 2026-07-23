"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  EyeOff,
  List,
  Brain,
  BarChart3,
  MoreVertical,
  History,
  Shuffle,
  Trophy,
  Type,
  Palette,
} from "lucide-react"
import {
  ChampionsTab,
  CustomChampionsCard,
} from "@/components/tabs/champions-tab"
import { AITab } from "@/components/tabs/ai-tab"
import { StatsTab } from "@/components/tabs/stats-tab"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { useSettingsStore } from "@/stores/settings-store"
import { useToast } from "@/contexts/toast-context"
import { PICKER_WHEEL_THEMES, type WheelTheme } from "@/lib/picker-wheel-themes"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import type { WheelSettings } from "@/types/settings"
import type {
  ActionMode,
  AIMode,
  ChatMessage,
  DisplayMode,
  LoLChampion,
  RoleFilter,
  SpinResult,
  UserPreferences,
} from "@/types/lol-types"

type SidebarTab = "inputs" | "text" | "style" | "other"
type InputsSubTab = "manual" | "ai" | "stats"

const SIDEBAR_TABS: { id: SidebarTab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <List className="h-4 w-4" /> },
  { id: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { id: "style", label: "Style", icon: <Palette className="h-4 w-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="h-4 w-4" /> },
]

export interface LolInputPanelProps {
  forceUpdate?: number

  selectedRole: RoleFilter
  selectedChampions: string[]
  displayMode: DisplayMode
  showTitle: boolean
  actionMode: ActionMode
  onActionModeChange?: (mode: ActionMode) => void
  customChampions?: LoLChampion[]

  onRoleChange: (role: RoleFilter) => void
  onChampionToggle: (championId: string) => void
  onClearAll: () => void
  onDisplayModeChange: (mode: DisplayMode) => void
  onShowTitleToggle: () => void
  onPreviewChampion: (champion: LoLChampion) => void
  getRoleCount: () => { selected: number; available: number }
  onShuffleChampions?: () => void
  onSortChampionsAZ?: () => void
  onSortChampionsZA?: () => void
  onDeleteCustomChampion?: (championId: string) => void

  aiMode: AIMode
  aiQuery: string
  aiResponse: string
  aiLoading: boolean
  aiChatHistory: ChatMessage[]
  aiRecommendations: LoLChampion[]
  userPreferences: UserPreferences
  onAiModeChange: (mode: AIMode) => void
  onAiQueryChange: (query: string) => void
  onAiQuerySubmit: () => void
  onUserPreferencesChange: (preferences: UserPreferences) => void
  onChampionsChange: (champions: Set<string>) => void
  onAiResponseChange: (response: string) => void
  getAllChampions: () => LoLChampion[]
  getFilteredChampions: () => LoLChampion[]

  championStats: Record<string, number>
  allResults: SpinResult[]

  resultsCount?: number
  themes?: WheelTheme[]
  currentTheme?: string
  onThemeChange?: (themeId: string) => void
  onApplyPalette?: (colors: readonly string[]) => void
  onHideInputs?: () => void
  onViewHistory?: () => void
  onOpenAchievements?: () => void
  onOpenSettings?: () => void
  onToggleFullscreen?: () => void
  onOpenAnalytics?: () => void
  onImportChampionsText?: (text: string) => void
}

export default function LolInputPanel({
  forceUpdate = 0,
  selectedRole,
  selectedChampions,
  displayMode,
  showTitle,
  actionMode,
  onActionModeChange,
  customChampions = [],
  onRoleChange,
  onChampionToggle,
  onClearAll,
  onDisplayModeChange,
  onShowTitleToggle,
  onPreviewChampion,
  getRoleCount,
  onShuffleChampions,
  onSortChampionsAZ,
  onSortChampionsZA,
  onDeleteCustomChampion,
  aiMode,
  aiQuery,
  aiResponse,
  aiLoading,
  aiChatHistory,
  aiRecommendations,
  userPreferences,
  onAiModeChange,
  onAiQueryChange,
  onAiQuerySubmit,
  onUserPreferencesChange,
  onChampionsChange,
  onAiResponseChange,
  getAllChampions,
  getFilteredChampions,
  championStats,
  allResults,
  resultsCount = 0,
  themes = PICKER_WHEEL_THEMES,
  currentTheme = "classic",
  onThemeChange,
  onApplyPalette,
  onHideInputs,
  onViewHistory,
  onOpenAchievements,
  onOpenSettings,
  onToggleFullscreen,
  onOpenAnalytics,
  onImportChampionsText,
}: LolInputPanelProps) {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("inputs")
  const [inputsSubTab, setInputsSubTab] = useState<InputsSubTab>("manual")
  const [bulkText, setBulkText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const { settings, updateSettings } = useSettingsStore()
  const { showToast } = useToast()

  const selectedSet = useMemo(
    () => new Set(selectedChampions),
    [selectedChampions, forceUpdate],
  )

  const setActionModeSynced = (mode: ActionMode) => {
    onActionModeChange?.(mode)
    // Keep store in sync when parent handler is missing; otherwise parent syncActionMode writes this.
    if (!onActionModeChange) {
      const latest = useSettingsStore.getState().settings
      updateSettings({
        spinBehavior: {
          ...latest.spinBehavior,
          removeWinnerAfterSpin: mode === "elimination",
        },
      } as any)
    }
  }

  const removeDuplicateChampions = () => {
    const all = getAllChampions()
    const seen = new Set<string>()
    const unique: string[] = []
    for (const id of selectedChampions) {
      const name = (all.find((c) => c.id === id)?.name || "").trim().toLowerCase()
      const key = name || id
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(id)
    }
    if (unique.length !== selectedChampions.length) {
      onChampionsChange(new Set(unique))
    }
  }

  const deleteBlankChampions = () => {
    const all = getAllChampions()
    const cleaned = selectedChampions.filter((id) => {
      const champion = all.find((c) => c.id === id)
      return Boolean(champion?.name?.trim())
    })
    if (cleaned.length !== selectedChampions.length) {
      onChampionsChange(new Set(cleaned))
    }
  }

  const exportText = useMemo(() => {
    return getFilteredChampions()
      .map((c) => c.name)
      .join("\n")
  }, [getFilteredChampions, selectedChampions, selectedRole, forceUpdate])

  const giveawayEntries = useMemo(
    () =>
      getFilteredChampions().map((c) => ({
        id: c.id,
        name: c.name,
        weight: 1,
      })),
    [getFilteredChampions, selectedChampions, selectedRole, forceUpdate],
  )

  const applyBulkText = () => {
    onImportChampionsText?.(bulkText)
  }

  return (
    <div className="flex max-h-[min(70vh,36rem)] min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-white shadow-sm lg:max-h-none">
      <div className="flex shrink-0 items-center justify-between gap-1 border-b bg-slate-50/80 px-2 py-2 sm:gap-2 sm:px-3">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
            LoL Controls
          </p>
          <span className="shrink-0 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 sm:px-2 sm:text-xs">
            {selectedChampions.length} selected
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {onOpenAchievements && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 sm:h-8 sm:w-8"
              title="Achievements"
              onClick={onOpenAchievements}
            >
              <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
          {onViewHistory && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="relative h-7 w-7 p-0 sm:h-8 sm:w-8"
              title={`Spin History (${resultsCount})`}
              onClick={onViewHistory}
            >
              <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {resultsCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-0.5 text-[10px] text-white">
                  {resultsCount}
                </span>
              )}
            </Button>
          )}
          {onShuffleChampions && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 sm:h-8 sm:w-8"
              title="Shuffle"
              onClick={onShuffleChampions}
            >
              <Shuffle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
          {onHideInputs && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 sm:h-8 sm:w-8"
              title="Hide"
              onClick={onHideInputs}
            >
              <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
          <SlicesManageMenu
            settings={settings as unknown as WheelSettings}
            onUpdateSettings={(partial) => {
              updateSettings(partial as any)
              if (partial.spinBehavior && "removeWinnerAfterSpin" in partial.spinBehavior) {
                setActionModeSynced(
                  partial.spinBehavior.removeWinnerAfterSpin ? "elimination" : "normal",
                )
              }
            }}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSortZA={onSortChampionsZA ?? (() => {})}
            onShuffle={onShuffleChampions ?? (() => {})}
            onEqualize={() => {}}
            onDeleteBlanks={deleteBlankChampions}
            onRemoveDuplicates={removeDuplicateChampions}
            onClearAll={onClearAll}
          />
        </div>
      </div>

      <div className="flex shrink-0 overflow-x-auto border-b">
        {SIDEBAR_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (tab.id === "text") {
                setBulkText(getFilteredChampions().map((c) => c.name).join("\n"))
              }
              setSidebarTab(tab.id)
            }}
            className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors ${
              sidebarTab === tab.id
                ? "border-b-2 border-blue-600 bg-blue-50/50 text-blue-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2.5 sm:p-3">
        {sidebarTab === "inputs" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Action Mode</Label>
              <Select
                value={actionMode}
                onValueChange={(v) => setActionModeSynced(v as ActionMode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal Mode</SelectItem>
                  <SelectItem value="elimination">Elimination Mode</SelectItem>
                  <SelectItem value="manual">Manual Mode</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Elimination removes the winning champion after each spin. Manual lets you
                type a champion under the wheel. Synced with the Game Mode controls.
              </p>
            </div>

            <div className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
              <Button
                type="button"
                size="sm"
                variant={inputsSubTab === "manual" ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setInputsSubTab("manual")}
              >
                Manual
              </Button>
              <Button
                type="button"
                size="sm"
                variant={inputsSubTab === "ai" ? "default" : "ghost"}
                className="flex-1 gap-1"
                onClick={() => setInputsSubTab("ai")}
              >
                <Brain className="h-3.5 w-3.5" />
                AI
              </Button>
              <Button
                type="button"
                size="sm"
                variant={inputsSubTab === "stats" ? "default" : "ghost"}
                className="flex-1 gap-1"
                onClick={() => setInputsSubTab("stats")}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Stats
              </Button>
            </div>

            {inputsSubTab === "manual" && (
              <>
                <ChampionsTab
                  key={`champions-tab-${selectedChampions.length}-${forceUpdate}`}
                  selectedRole={selectedRole}
                  selectedChampions={selectedSet}
                  displayMode={displayMode}
                  showTitle={showTitle}
                  onRoleChange={onRoleChange}
                  onChampionToggle={onChampionToggle}
                  onClearAll={onClearAll}
                  onDisplayModeChange={onDisplayModeChange}
                  onShowTitleToggle={onShowTitleToggle}
                  onPreviewChampion={onPreviewChampion}
                  getRoleCount={getRoleCount}
                />
                <div className="mt-4">
                  <CustomChampionsCard
                    customChampions={customChampions}
                    selectedChampions={selectedSet}
                    onChampionToggle={onChampionToggle}
                    onPreviewChampion={onPreviewChampion}
                    onDeleteCustomChampion={onDeleteCustomChampion}
                  />
                </div>
              </>
            )}

            {inputsSubTab === "ai" && (
              <AITab
                aiMode={aiMode}
                aiQuery={aiQuery}
                aiResponse={aiResponse}
                aiLoading={aiLoading}
                aiChatHistory={aiChatHistory}
                aiRecommendations={aiRecommendations}
                userPreferences={userPreferences}
                selectedItems={selectedSet}
                onModeChange={onAiModeChange}
                onQueryChange={onAiQueryChange}
                onQuerySubmit={onAiQuerySubmit}
                onPreferencesChange={onUserPreferencesChange}
                onItemsChange={onChampionsChange}
                onResponseChange={onAiResponseChange}
                onFilterChange={(filter) => onRoleChange(filter as RoleFilter)}
                getAllItems={getAllChampions}
                getFilteredItems={getFilteredChampions}
              />
            )}

            {inputsSubTab === "stats" && (
              <StatsTab
                championStats={championStats}
                allResults={allResults}
                getAllChampions={getAllChampions}
              />
            )}
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-slate-700">Champion list</Label>
              <p className="mt-1 text-xs text-slate-500">
                One champion name per line. Matching names from the catalog are selected.
              </p>
            </div>
            <Textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={12}
              placeholder={"Ahri\nJinx\nThresh"}
              className="font-mono text-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={applyBulkText}>
                Apply text
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setBulkText(getFilteredChampions().map((c) => c.name).join("\n"))
                }
              >
                Load current
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const blob = new Blob([exportText], { type: "text/plain" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "lol-champions.txt"
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                Export
              </Button>
            </div>
          </div>
        )}

        {sidebarTab === "style" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Display Options</Label>
              <div className="grid gap-2">
                {(
                  [
                    { value: "emoji-name" as const, label: "Emoji & Name" },
                    { value: "emoji" as const, label: "Emoji Only" },
                    { value: "name" as const, label: "Name Only" },
                  ]
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                      displayMode === opt.value
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="lol-display"
                      value={opt.value}
                      checked={displayMode === opt.value}
                      onChange={() => onDisplayModeChange(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-slate-800">Show title</p>
                <p className="text-xs text-slate-500">Wheel title above the spinner</p>
              </div>
              <Switch checked={showTitle} onCheckedChange={() => onShowTitleToggle()} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">Color palettes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const palette =
                      LETTER_COLOR_PALETTES[
                        Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)
                      ]
                    onApplyPalette?.(palette.colors)
                    showToast("Palette applied", "success")
                  }}
                >
                  Randomize
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LETTER_COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => {
                      onApplyPalette?.(palette.colors)
                      showToast("Palette applied", "success")
                    }}
                    className="rounded-lg border border-slate-200 p-2 text-left hover:border-blue-300 hover:bg-blue-50/40"
                  >
                    <span className="mb-1 block text-xs font-semibold text-slate-800">
                      {palette.name}
                    </span>
                    <span className="flex gap-0.5">
                      {palette.colors.slice(0, 6).map((c) => (
                        <span
                          key={`${palette.name}-${c}`}
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">Themes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const unlocked = themes.filter((t) => t.unlocked)
                    const pool = unlocked.length > 0 ? unlocked : themes
                    const next = pool[Math.floor(Math.random() * pool.length)]
                    if (next) onThemeChange?.(next.id)
                  }}
                >
                  Randomize
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => {
                  const locked = !theme.unlocked
                  const active = currentTheme === theme.id
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      disabled={locked}
                      onClick={() => {
                        if (!locked) onThemeChange?.(theme.id)
                      }}
                      className={`rounded-lg border p-2 text-left transition-colors ${
                        active
                          ? "border-blue-400 bg-blue-50"
                          : locked
                            ? "cursor-not-allowed border-slate-100 opacity-50"
                            : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/40"
                      }`}
                      title={locked ? `Locked — ${theme.description}` : theme.description}
                    >
                      <span className="mb-1 flex items-center justify-between gap-1">
                        <span className="block truncate text-xs font-semibold text-slate-800">
                          {theme.name}
                        </span>
                        {locked && (
                          <span className="shrink-0 text-[10px] text-slate-400">Locked</span>
                        )}
                      </span>
                      <span className="flex gap-0.5">
                        {theme.colors.slice(0, 6).map((c) => (
                          <span
                            key={`${theme.id}-${c}`}
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
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
                <Switch
                  id="lol-confetti"
                  checked={settings.confettiSound?.enableConfetti ?? true}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      confettiSound: {
                        ...settings.confettiSound,
                        enableConfetti: checked,
                      },
                    } as any)
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Sound</p>
                  <p className="text-xs text-slate-500">Play spin / result sounds</p>
                </div>
                <Switch
                  id="lol-sound"
                  checked={settings.confettiSound?.enableSound ?? true}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      confettiSound: {
                        ...settings.confettiSound,
                        enableSound: checked,
                      },
                    } as any)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-800">
                  Spinning duration: {settings.spinBehavior?.spinningDuration ?? 10}s
                </Label>
                <input
                  type="range"
                  min={3}
                  max={25}
                  step={1}
                  value={settings.spinBehavior?.spinningDuration ?? 10}
                  onChange={(e) =>
                    updateSettings({
                      spinBehavior: {
                        ...settings.spinBehavior,
                        spinningDuration: Number(e.target.value),
                      },
                    } as any)
                  }
                  className="w-full accent-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-800">
                  Spinning speed level: {settings.spinBehavior?.spinningSpeedLevel ?? 10}
                </Label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={settings.spinBehavior?.spinningSpeedLevel ?? 10}
                  onChange={(e) =>
                    updateSettings({
                      spinBehavior: {
                        ...settings.spinBehavior,
                        spinningSpeedLevel: Number(e.target.value),
                      },
                    } as any)
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <SidebarOtherOptions
              toolLabel="LoL Champions"
              resultsCount={resultsCount}
              exportFileName="lol-champions.txt"
              exportText={exportText}
              entries={giveawayEntries}
              onImportText={(text) => {
                setBulkText(text)
                setSidebarTab("text")
                showToast("Pasted into Text tab — tap Apply text", "info")
              }}
              onRemoveDuplicates={removeDuplicateChampions}
              onViewResults={onViewHistory}
              onOpenSettings={onOpenSettings}
              onToggleFullscreen={onToggleFullscreen}
              onOpenAI={() => {
                setSidebarTab("inputs")
                setInputsSubTab("ai")
              }}
              onOpenAnalytics={onOpenAnalytics}
            />
          </div>
        )}
      </div>
    </div>
  )
}
