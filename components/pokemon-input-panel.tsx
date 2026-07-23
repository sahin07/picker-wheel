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
  Heart,
  GitCompare,
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
import { PokemonTab } from "@/components/pokemon/tabs/pokemon-tab"
import { AITab } from "@/components/pokemon/tabs/ai-tab"
import { StatsTab } from "@/components/pokemon/tabs/stats-tab"
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
  GenerationFilter,
  Pokemon,
  SpinResult,
  UserPreferences,
} from "@/types/pokemon-types"

type SidebarTab = "inputs" | "text" | "style" | "other"
type InputsSubTab = "manual" | "ai" | "stats"

const SIDEBAR_TABS: { id: SidebarTab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <List className="h-4 w-4" /> },
  { id: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { id: "style", label: "Style", icon: <Palette className="h-4 w-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="h-4 w-4" /> },
]

export interface PokemonInputPanelProps {
  forceUpdate?: number

  selectedGeneration: GenerationFilter
  selectedPokemon: string[]
  displayMode: DisplayMode
  showTitle: boolean
  actionMode: ActionMode
  onActionModeChange?: (mode: ActionMode) => void
  customPokemon: Pokemon[]
  favoritePokemon: Pokemon[]
  comparisonPokemon: Pokemon[]

  onGenerationChange: (generation: GenerationFilter) => void
  onPokemonToggle: (pokemonId: string) => void
  onClearAll: () => void
  onDisplayModeChange: (mode: DisplayMode) => void
  onShowTitleToggle: () => void
  onPreviewPokemon: (pokemon?: Pokemon) => void
  getGenerationCount: () => { selected: number; available: number }
  onShufflePokemon: () => void
  onSortPokemonAZ: () => void
  onSortPokemonZA?: () => void
  onAddRandomPokemon: () => void
  onOpenFavorites: () => void
  onOpenComparison: () => void
  addToFavorites: (pokemon: Pokemon) => void
  removeFromFavorites: (pokemonId: string) => void
  isFavorite: (pokemonId: string) => boolean
  addToComparison: (pokemon: Pokemon) => void
  removeFromComparison: (pokemonId: string) => void
  isInComparison: (pokemonId: string) => boolean
  onEnhancedDetails?: (pokemon: Pokemon) => void
  onManualSelect: (pokemon: Pokemon) => void
  onDeleteCustomPokemon: (pokemonId: string) => void

  aiMode: AIMode
  aiQuery: string
  aiResponse: string
  aiLoading: boolean
  aiChatHistory: ChatMessage[]
  aiRecommendations: Pokemon[]
  userPreferences: UserPreferences
  aiRecommendedPokemon: string[]
  onAiModeChange: (mode: AIMode) => void
  onAiQueryChange: (query: string) => void
  onAiQuerySubmit: () => void
  onUserPreferencesChange: (preferences: UserPreferences) => void
  onPokemonChange: (pokemon: Set<string>) => void
  onAiResponseChange: (response: string) => void
  getAllPokemon: () => Pokemon[]
  getFilteredPokemon: () => Pokemon[]
  onAddCustomPokemon: (pokemon: {
    id: string
    name: string
    type: string[]
    generation: string
    emoji: string
    isCustom: true
  }) => void

  pokemonStats: Record<string, number>
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
  onImportPokemonText?: (text: string) => void
}

export default function PokemonInputPanel({
  forceUpdate = 0,
  selectedGeneration,
  selectedPokemon,
  displayMode,
  showTitle,
  actionMode,
  onActionModeChange,
  customPokemon,
  favoritePokemon,
  comparisonPokemon,
  onGenerationChange,
  onPokemonToggle,
  onClearAll,
  onDisplayModeChange,
  onShowTitleToggle,
  onPreviewPokemon,
  getGenerationCount,
  onShufflePokemon,
  onSortPokemonAZ,
  onSortPokemonZA,
  onAddRandomPokemon,
  onOpenFavorites,
  onOpenComparison,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  addToComparison,
  removeFromComparison,
  isInComparison,
  onEnhancedDetails,
  onManualSelect,
  onDeleteCustomPokemon,
  aiMode,
  aiQuery,
  aiResponse,
  aiLoading,
  aiChatHistory,
  aiRecommendations,
  userPreferences,
  aiRecommendedPokemon,
  onAiModeChange,
  onAiQueryChange,
  onAiQuerySubmit,
  onUserPreferencesChange,
  onPokemonChange,
  onAiResponseChange,
  getAllPokemon,
  getFilteredPokemon,
  onAddCustomPokemon,
  pokemonStats,
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
  onImportPokemonText,
}: PokemonInputPanelProps) {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("inputs")
  const [inputsSubTab, setInputsSubTab] = useState<InputsSubTab>("manual")
  const [bulkText, setBulkText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const { settings, updateSettings } = useSettingsStore()
  const { showToast } = useToast()

  const setActionModeSynced = (mode: ActionMode) => {
    onActionModeChange?.(mode)
    updateSettings({
      spinBehavior: {
        ...settings.spinBehavior,
        removeWinnerAfterSpin: mode === "elimination",
      },
    } as any)
  }

  const removeDuplicatePokemon = () => {
    const all = getAllPokemon()
    const seen = new Set<string>()
    const unique: string[] = []
    for (const id of selectedPokemon) {
      const name = (all.find((p) => p.id === id)?.name || "").trim().toLowerCase()
      const key = name || id
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(id)
    }
    if (unique.length !== selectedPokemon.length) {
      onPokemonChange(new Set(unique))
    }
  }

  const deleteBlankPokemon = () => {
    const all = getAllPokemon()
    const cleaned = selectedPokemon.filter((id) => {
      const pokemon = all.find((p) => p.id === id)
      return Boolean(pokemon?.name?.trim())
    })
    if (cleaned.length !== selectedPokemon.length) {
      onPokemonChange(new Set(cleaned))
    }
  }

  const exportText = useMemo(() => {
    return getFilteredPokemon()
      .map((p) => p.name)
      .join("\n")
  }, [getFilteredPokemon, selectedPokemon, selectedGeneration, forceUpdate])

  const giveawayEntries = useMemo(
    () =>
      getFilteredPokemon().map((p) => ({
        id: p.id,
        name: p.name,
        weight: 1,
      })),
    [getFilteredPokemon, selectedPokemon, selectedGeneration, forceUpdate],
  )

  const applyBulkText = () => {
    if (onImportPokemonText) {
      onImportPokemonText(bulkText)
      return
    }
    const names = bulkText
      .split("\n")
      .map((line) => line.trim().toLowerCase())
      .filter(Boolean)
    if (names.length === 0) return
    const nameSet = new Set(names)
    const matched = getAllPokemon()
      .filter((p) => nameSet.has(p.name.trim().toLowerCase()))
      .map((p) => p.id)
    onPokemonChange(new Set(matched))
    showToast(`Selected ${matched.length} Pokémon by name`, "success")
  }

  const pokemonTabProps = {
    selectedGeneration,
    selectedPokemon,
    displayMode,
    showTitle,
    customPokemon,
    onGenerationChange,
    onPokemonToggle,
    onClearAll,
    onDisplayModeChange,
    onShowTitleToggle,
    onPreviewPokemon,
    onDeleteCustomPokemon,
    getGenerationCount,
    onShufflePokemon,
    onSortPokemonAZ,
    onAddRandomPokemon,
    onEnhancedDetails,
    onManualSelect,
    actionMode,
    onOpenFavorites,
    onOpenComparison,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToComparison,
    removeFromComparison,
    isInComparison,
    favoritePokemon,
    comparisonPokemon,
  }

  return (
    <div className="flex max-h-[min(70vh,36rem)] min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-white shadow-sm lg:max-h-none">
      <div className="flex shrink-0 items-center justify-between gap-1 border-b bg-slate-50/80 px-2 py-2 sm:gap-2 sm:px-3">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
            Pokémon Controls
          </p>
          <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 sm:px-2 sm:text-xs">
            {selectedPokemon.length} selected
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-7 w-7 p-0 sm:h-8 sm:w-8 ${favoritePokemon.length ? "text-red-500" : ""}`}
            title="Favorites"
            onClick={onOpenFavorites}
          >
            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-7 w-7 p-0 sm:h-8 sm:w-8 ${comparisonPokemon.length ? "text-blue-500" : ""}`}
            title="Comparison"
            onClick={onOpenComparison}
          >
            <GitCompare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 sm:h-8 sm:w-8"
            title="Shuffle"
            onClick={onShufflePokemon}
          >
            <Shuffle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
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
            onSortZA={onSortPokemonZA ?? onSortPokemonAZ}
            onShuffle={onShufflePokemon}
            onEqualize={() => {}}
            onDeleteBlanks={deleteBlankPokemon}
            onRemoveDuplicates={removeDuplicatePokemon}
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
                setBulkText(getFilteredPokemon().map((p) => p.name).join("\n"))
              }
              setSidebarTab(tab.id)
            }}
            className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors ${
              sidebarTab === tab.id
                ? "border-b-2 border-amber-500 bg-amber-50/50 text-amber-800"
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
                Elimination removes the winning Pokémon after each spin. Manual lets you type a
                name under the wheel. Synced with the Game Mode controls.
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
              <PokemonTab
                key={`pokemon-tab-${selectedPokemon.length}-${forceUpdate}`}
                {...pokemonTabProps}
              />
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
                selectedPokemon={new Set(selectedPokemon)}
                onModeChange={onAiModeChange}
                onQueryChange={onAiQueryChange}
                onQuerySubmit={onAiQuerySubmit}
                onPreferencesChange={onUserPreferencesChange}
                onPokemonChange={onPokemonChange}
                onResponseChange={onAiResponseChange}
                getAllPokemon={getAllPokemon}
                getFilteredPokemon={getFilteredPokemon}
                onGenerationChange={(generation) =>
                  onGenerationChange(generation as GenerationFilter)
                }
                aiRecommendedPokemon={aiRecommendedPokemon}
                onAddCustomPokemon={onAddCustomPokemon}
              />
            )}

            {inputsSubTab === "stats" && (
              <StatsTab
                pokemonStats={pokemonStats}
                allResults={allResults}
                getAllPokemon={getAllPokemon}
              />
            )}
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-slate-700">Pokémon list</Label>
              <p className="mt-1 text-xs text-slate-500">
                One Pokémon name per line. Matching names from the catalog are selected.
              </p>
            </div>
            <Textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={12}
              placeholder={"Pikachu\nCharizard\nBulbasaur"}
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
                  setBulkText(getFilteredPokemon().map((p) => p.name).join("\n"))
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
                  a.download = "pokemon-list.txt"
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
                        ? "border-amber-400 bg-amber-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pokemon-display"
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
              <Switch
                checked={showTitle}
                onCheckedChange={() => onShowTitleToggle()}
              />
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
                    className="rounded-lg border border-slate-200 p-2 text-left hover:border-amber-300 hover:bg-amber-50/40"
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
                          ? "border-amber-400 bg-amber-50"
                          : locked
                            ? "cursor-not-allowed border-slate-100 opacity-50"
                            : "border-slate-200 hover:border-amber-300 hover:bg-amber-50/40"
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
                  id="pokemon-confetti"
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
                  id="pokemon-sound"
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
                  className="w-full accent-amber-500"
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
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            <SidebarOtherOptions
              toolLabel="Pokémon"
              resultsCount={resultsCount}
              exportFileName="pokemon-list.txt"
              exportText={exportText}
              entries={giveawayEntries}
              onImportText={(text) => {
                setBulkText(text)
                setSidebarTab("text")
                showToast("Pasted into Text tab — tap Apply text", "info")
              }}
              onRemoveDuplicates={removeDuplicatePokemon}
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
