"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronDown,
  List,
  Type,
  Heart,
  GitCompare,
  BarChart3,
  Plus,
  X,
  Brain,
  MoreVertical,
  Palette,
  Trophy,
  History,
  Shuffle,
  EyeOff,
} from "lucide-react"
import { useWheelManagerStore, type StateWheelData } from "@/stores/wheel-manager-store"
import { getStatesByCountry, availableCountries, type State } from "@/data/states"
import { useState, useEffect, type ReactNode } from "react"
import StateStatisticsModal from "./state-statistics-modal"
import StateComparisonModal from "./state-comparison-modal"
import StateFavoritesModal from "./state-favorites-modal"
import StateResultsModal from "./state-results-modal"
import { useSettingsStore } from "@/stores/settings-store"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import { useToast } from "@/contexts/toast-context"
import { Checkbox } from "@/components/ui/checkbox"
import type { WheelSettings } from "@/types/settings"

type ActionMode = "normal" | "elimination" | "manual"

type SidebarTab = "inputs" | "text" | "style" | "other"

const SIDEBAR_TABS: { id: SidebarTab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <List className="h-4 w-4" /> },
  { id: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { id: "style", label: "Style", icon: <Palette className="h-4 w-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="h-4 w-4" /> },
]

interface StateInputPanelProps {
  activeTab?: "manual" | "ai"
  onTabChange?: (tab: "manual" | "ai") => void
  onOpenSettings?: () => void
  onToggleFullscreen?: () => void
  onOpenAnalytics?: () => void
  onOpenAchievements?: () => void
  onViewHistory?: () => void
  onHideInputs?: () => void
  actionMode?: ActionMode
  onActionModeChange?: (mode: ActionMode) => void
  onThemeChange?: (themeId: string) => void
  onApplyPalette?: (colors: readonly string[]) => void
  currentTheme?: string
  themes?: typeof PICKER_WHEEL_THEMES
}

export default function StateInputPanel({
  activeTab: externalActiveTab,
  onTabChange,
  onOpenSettings,
  onToggleFullscreen,
  onOpenAnalytics,
  onOpenAchievements,
  onViewHistory,
  onHideInputs,
  actionMode: externalActionMode,
  onActionModeChange,
  onThemeChange,
  onApplyPalette,
  currentTheme = "classic",
  themes = PICKER_WHEEL_THEMES,
}: StateInputPanelProps) {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("inputs")
  const [bulkText, setBulkText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const { settings, updateSettings } = useSettingsStore()
  const { showToast } = useToast()
  const [hasMounted, setHasMounted] = useState(false)
  const wheelManager = useWheelManagerStore()
  const wheel = wheelManager.getCurrentWheel()
  const actionMode: ActionMode = externalActionMode || "normal"

  const data = (wheel?.data as StateWheelData) ?? {
    selectedCountry: "us",
    selectedStates: [],
    displayMode: "name" as const,
    viewMode: "wheel" as const,
    favoriteStates: [],
    comparisonStates: [],
    isSpinning: false,
    spinRotation: 0,
    selectedResult: null,
    totalSpins: 0,
    showStatistics: false,
    showComparison: false,
    showFavorites: false,
    recentResults: [],
  }

  const setData = (partial: Partial<StateWheelData>) => {
    if (!wheel) return
    wheelManager.updateWheelData("state-wheel", wheel.id, { ...data, ...partial })
  }

  const {
    selectedCountry,
    selectedStates: rawSelectedStates,
    displayMode,
    viewMode,
    favoriteStates: rawFavoriteStates,
    comparisonStates: rawComparisonStates,
  } = data

  // Ensure arrays are always defined with fallbacks
  const selectedStates = rawSelectedStates ?? []
  const favoriteStates = rawFavoriteStates ?? []
  const comparisonStates = rawComparisonStates ?? []

  // All states for the current country
  const allStatesForCountry = getStatesByCountry(selectedCountry)

  // Actions
  const setSelectedCountry = (country: string) => {
    const newStates = getStatesByCountry(country)
    setData({ selectedCountry: country, selectedStates: newStates })
  }
  const setDisplayMode = (mode: "flag" | "name" | "both") => setData({ displayMode: mode })
  const setViewMode = (mode: "wheel" | "list" | "text") => setData({ viewMode: mode })
  const setSelectedStates = (states: State[]) => setData({ selectedStates: states })

  const toggleState = (state: State) => {
    const isSelected = selectedStates.some((s) => s.id === state.id)
    if (isSelected) {
      setSelectedStates(selectedStates.filter((s) => s.id !== state.id))
    } else {
      setSelectedStates([...selectedStates, state])
    }
  }

  const shuffleStates = () => {
    const shuffled = [...selectedStates].sort(() => Math.random() - 0.5)
    setSelectedStates(shuffled)
  }

  const sortStatesZA = () => {
    const sorted = [...selectedStates].sort((a, b) => b.name.localeCompare(a.name))
    setSelectedStates(sorted)
  }

  const clearAllStates = () => {
    setSelectedStates([])
    showToast("Cleared all states", "success")
  }

  const removeDuplicateStates = () => {
    const seen = new Set<string>()
    const unique = selectedStates.filter((s) => {
      const key = s.name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    setSelectedStates(unique)
    showToast("Duplicates removed", "success")
  }

  const deleteBlankStates = () => {
    const cleaned = selectedStates.filter((s) => s.name?.trim())
    setSelectedStates(cleaned)
    showToast("Blank entries removed", "success")
  }

  const setActionModeSynced = (mode: ActionMode) => {
    onActionModeChange?.(mode)
    if (mode === "elimination" || mode === "normal") {
      const latest = useSettingsStore.getState().settings
      updateSettings({
        spinBehavior: {
          ...latest.spinBehavior,
          removeWinnerAfterSpin: mode === "elimination",
        },
      } as any)
    }
  }

  // Favorites
  const addToFavorites = (state: State) => {
    if (!favoriteStates.some((s) => s.id === state.id)) {
      setData({ favoriteStates: [...favoriteStates, state] })
    }
  }
  const removeFromFavorites = (stateId: string) => {
    setData({ favoriteStates: favoriteStates.filter((s) => s.id !== stateId) })
  }
  const isFavorite = (stateId: string) => favoriteStates.some((s) => s.id === stateId)

  // Comparison
  const addToComparison = (state: State) => {
    if (comparisonStates.length < 4 && !comparisonStates.some((s) => s.id === state.id)) {
      setData({ comparisonStates: [...comparisonStates, state] })
    }
  }
  const removeFromComparison = (stateId: string) => {
    setData({ comparisonStates: comparisonStates.filter((s) => s.id !== stateId) })
  }
  const isInComparison = (stateId: string) => comparisonStates.some((s) => s.id === stateId)

  const [showStateList, setShowStateList] = useState(true)
  const [selectedState, setSelectedState] = useState<State | null>(null)
  const [showStatistics, setShowStatistics] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [internalActiveTab, setInternalActiveTab] = useState<"manual" | "ai">("manual")

  // Use external tab if provided, otherwise use internal state
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab

  const handleTabChange = (tab: "manual" | "ai") => {
    if (onTabChange) {
      onTabChange(tab)
    } else {
      setInternalActiveTab(tab)
    }
  }

  // Backfill states when empty (first visit / old persisted wheel)
  useEffect(() => {
    if (!wheel || wheel.toolType !== "state-wheel") return
    const d = wheel.data as StateWheelData
    const country = d.selectedCountry || "us"
    const current = d.selectedStates ?? []
    if (current.length === 0) {
      wheelManager.updateWheelData("state-wheel", wheel.id, {
        ...d,
        selectedCountry: country,
        selectedStates: getStatesByCountry(country),
      })
    }
  }, [wheel, wheelManager])

  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) return null

  const handleShowStatistics = (state: State) => {
    setSelectedState(state)
    setShowStatistics(true)
  }

  const handleToggleFavorite = (state: State) => {
    if (isFavorite(state.id)) {
      removeFromFavorites(state.id)
    } else {
      addToFavorites(state)
    }
  }

  const handleToggleComparison = (state: State) => {
    if (isInComparison(state.id)) {
      removeFromComparison(state.id)
    } else {
      addToComparison(state)
    }
  }

  const recentResultsCount = (data as any).recentResults?.length || 0
  const filteredSelectedStates = searchQuery.trim()
    ? selectedStates.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          s.capital?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          s.abbreviation?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : selectedStates

  const exportText = selectedStates.map((s) => s.name).join("\n")

  const openHistory = () => {
    if (onViewHistory) onViewHistory()
    else setShowResults(true)
  }

  const applyBulkText = () => {
    const names = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    if (names.length === 0) {
      showToast("Add at least one state name", "error")
      return
    }
    // Search across all available countries
    const allStates = availableCountries.flatMap((c) => getStatesByCountry(c.id))
    const matched: State[] = []
    const unmatched: string[] = []
    for (const name of names) {
      const found = allStates.find((s) => s.name.toLowerCase() === name.toLowerCase())
      if (found) {
        if (!matched.some((m) => m.id === found.id)) matched.push(found)
      } else {
        unmatched.push(name)
      }
    }
    if (matched.length === 0) {
      showToast("No matching states found", "error")
      return
    }
    setSelectedStates(matched)
    if (unmatched.length > 0) {
      showToast(`Applied ${matched.length}; skipped ${unmatched.length} unknown`, "info")
    } else {
      showToast(`Applied ${matched.length} states`, "success")
    }
  }

  const selectedCountryData = availableCountries.find((c) => c.id === selectedCountry)

  return (
    <>
      <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
        {/* Header toolbar */}
        <div className="flex shrink-0 items-center justify-between gap-1 border-b bg-slate-50/80 px-2 py-2 sm:gap-2 sm:px-3">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">State Controls</p>
            <span className="shrink-0 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 sm:px-2 sm:text-xs">
              {selectedStates.length} selected
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`h-7 w-7 p-0 sm:h-8 sm:w-8 ${favoriteStates.length > 0 ? "text-red-500" : ""}`}
              onClick={() => setShowFavorites(true)}
              title="Favorites"
            >
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`h-7 w-7 p-0 sm:h-8 sm:w-8 ${comparisonStates.length > 0 ? "text-blue-500" : ""}`}
              onClick={() => setShowComparison(true)}
              title="Comparison"
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="relative h-7 w-7 p-0 sm:h-8 sm:w-8"
              title={`Spin History (${recentResultsCount})`}
              onClick={openHistory}
            >
              <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {recentResultsCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-0.5 text-[10px] text-white">
                  {recentResultsCount}
                </span>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 sm:h-8 sm:w-8"
              title="Shuffle"
              onClick={shuffleStates}
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
              onSortZA={sortStatesZA}
              onShuffle={shuffleStates}
              onEqualize={() => showToast("States use equal slice weights", "info")}
              onDeleteBlanks={deleteBlankStates}
              onRemoveDuplicates={removeDuplicateStates}
              onClearAll={clearAllStates}
            />
          </div>
        </div>

        {/* Sidebar tab nav */}
        <div className="flex shrink-0 overflow-x-auto border-b">
          {SIDEBAR_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === "text") {
                  setBulkText(selectedStates.map((s) => s.name).join("\n"))
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

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3">
          {/* ── INPUTS TAB ── */}
          {sidebarTab === "inputs" && (
            <div>
              {/* Action Mode */}
              <div className="mb-4 space-y-2">
                <Label className="text-sm font-medium text-slate-700">Action Mode</Label>
                <Select value={actionMode} onValueChange={(v) => setActionModeSynced(v as ActionMode)}>
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
                  Elimination removes the winning state after each spin. Synced with Manage → Remove winner.
                </p>
              </div>

              {/* View mode */}
              <div className="mb-4 space-y-2">
                <Label className="text-sm font-medium text-slate-700">View</Label>
                <div className="flex gap-2">
                  {(["wheel", "list", "text"] as const).map((mode) => (
                    <Button
                      key={mode}
                      type="button"
                      size="sm"
                      variant={viewMode === mode ? "default" : "outline"}
                      className="flex-1 capitalize"
                      onClick={() => setViewMode(mode)}
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Manual / AI toggle */}
              <div className="mb-4 flex space-x-2">
                <Button
                  variant={activeTab === "manual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTabChange("manual")}
                  className={activeTab === "manual" ? "bg-gray-800 text-white" : ""}
                >
                  Manual
                </Button>
                <Button
                  variant={activeTab === "ai" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTabChange("ai")}
                  className={
                    activeTab === "ai"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "border-purple-300 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:bg-purple-50"
                  }
                >
                  <Brain
                    className={`mr-2 h-4 w-4 ${activeTab === "ai" ? "text-white" : "text-purple-600"}`}
                  />
                  AI-Powered
                </Button>
              </div>

              {activeTab === "manual" && (
                <div>
                  {/* Country Selector */}
                  <div className="mb-6">
                    <label className="mb-3 block text-sm font-medium text-gray-700">Select Country:</label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {selectedCountryData && (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{selectedCountryData.flag}</span>
                              <span>{selectedCountryData.name}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableCountries.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{country.flag}</span>
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected count expand */}
                  <div className="mb-6">
                    <Button
                      variant="outline"
                      className="flex h-auto w-full items-center justify-between bg-transparent p-3"
                      onClick={() => setShowStateList(!showStateList)}
                    >
                      <span className="font-medium">
                        {selectedStates.length} selected of {allStatesForCountry.length}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${showStateList ? "rotate-180" : ""}`}
                      />
                    </Button>
                  </div>

                  {/* Display Mode */}
                  <div className="mb-6">
                    <label className="mb-3 block text-sm font-medium text-gray-700">Show:</label>
                    <div className="flex space-x-4">
                      {(["both", "flag", "name"] as const).map((val) => (
                        <label key={val} className="flex cursor-pointer items-center space-x-2">
                          <input
                            type="radio"
                            name="stateDisplayMode"
                            value={val}
                            checked={displayMode === val}
                            onChange={() => setDisplayMode(val)}
                            className="text-blue-600"
                          />
                          <span className="text-sm capitalize">
                            {val === "both" ? "Flag & Name" : val === "flag" ? "Flag" : "Name"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* State List (expanded) */}
                  {showStateList && (
                    <Card className="mt-4">
                      <CardContent className="max-h-64 overflow-y-auto p-4">
                        {searchQuery.trim() && (
                          <p className="mb-2 text-xs text-slate-500">
                            Showing {filteredSelectedStates.length} of {selectedStates.length} matching &quot;{searchQuery.trim()}&quot;
                          </p>
                        )}
                        <div className="space-y-2">
                          {filteredSelectedStates.map((state) => (
                            <div
                              key={state.id}
                              className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                            >
                              <div className="flex min-w-0 items-center space-x-3">
                                <Checkbox
                                  checked={selectedStates.some((s) => s.id === state.id)}
                                  onCheckedChange={() => toggleState(state)}
                                  aria-label={`Toggle ${state.name}`}
                                />
                                {state.flag && <span className="text-2xl">{state.flag}</span>}
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium">{state.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {state.capital && `${state.capital} • `}
                                    {state.abbreviation && `${state.abbreviation} • `}
                                    {state.country}
                                  </div>
                                </div>
                              </div>
                              <div className="flex shrink-0 items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleShowStatistics(state)}
                                  title="Statistics"
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <BarChart3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleFavorite(state)}
                                  title={isFavorite(state.id) ? "Remove from favorites" : "Add to favorites"}
                                  className={
                                    isFavorite(state.id)
                                      ? "text-red-500 hover:text-red-700"
                                      : "text-gray-400 hover:text-red-500"
                                  }
                                >
                                  <Heart
                                    className={`h-4 w-4 ${isFavorite(state.id) ? "fill-current" : ""}`}
                                  />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleComparison(state)}
                                  title={
                                    isInComparison(state.id)
                                      ? "Remove from comparison"
                                      : "Add to comparison"
                                  }
                                  disabled={!isInComparison(state.id) && comparisonStates.length >= 4}
                                  className={
                                    isInComparison(state.id)
                                      ? "text-blue-500 hover:text-blue-700"
                                      : "text-gray-400 hover:text-blue-500"
                                  }
                                >
                                  {isInComparison(state.id) ? (
                                    <X className="h-4 w-4" />
                                  ) : (
                                    <Plus className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                          {filteredSelectedStates.length === 0 && (
                            <p className="py-4 text-center text-sm text-slate-500">
                              {searchQuery.trim()
                                ? "No states match your search."
                                : "No states selected."}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* View Mode display */}
                  {viewMode === "list" && (
                    <Card className="mt-4">
                      <CardContent className="p-4">
                        <h4 className="mb-3 font-semibold">List View</h4>
                        <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto md:grid-cols-3">
                          {filteredSelectedStates.map((state) => (
                            <div key={state.id} className="flex items-center space-x-2 rounded p-2 hover:bg-gray-50">
                              {state.flag && <span className="text-lg">{state.flag}</span>}
                              <span className="truncate text-sm font-medium">{state.name}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {viewMode === "text" && (
                    <Card className="mt-4">
                      <CardContent className="p-4">
                        <h4 className="mb-3 font-semibold">Text Mode</h4>
                        <div className="max-h-64 overflow-y-auto">
                          <div className="text-sm leading-relaxed">
                            {filteredSelectedStates.map((state, index) => (
                              <span key={state.id}>
                                {state.name}
                                {index < filteredSelectedStates.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedStates.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      <div className="mb-2 text-4xl">🏛️</div>
                      <p className="font-medium">No states selected</p>
                      <p className="text-sm">Choose a country above to get started!</p>
                    </div>
                  )}
                </div>
              )}

              {/* AI Tab Content */}
              {activeTab === "ai" && (
                <div className="space-y-6">
                  {/* Country Selector for AI */}
                  <div className="mb-4">
                    <label className="mb-3 block text-sm font-medium text-gray-700">
                      AI Country Focus:
                    </label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {selectedCountryData && (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{selectedCountryData.flag}</span>
                              <span>{selectedCountryData.name}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableCountries.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{country.flag}</span>
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* AI selected count */}
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      className="flex h-auto w-full items-center justify-between border-purple-200 bg-transparent p-3"
                      onClick={() => setShowStateList(!showStateList)}
                    >
                      <span className="font-medium">
                        {selectedStates.length} selected of {allStatesForCountry.length}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${showStateList ? "rotate-180" : ""}`}
                      />
                    </Button>
                  </div>

                  {/* AI Features Info */}
                  <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                    <h4 className="mb-2 font-semibold text-purple-800">🤖 AI Features</h4>
                    <ul className="space-y-1 text-sm text-purple-700">
                      <li>• Intelligent state recommendations</li>
                      <li>• AI-powered spinning with insights</li>
                      <li>• Smart result analysis</li>
                      <li>• Personalized suggestions</li>
                    </ul>
                  </div>

                  {/* AI Insights */}
                  {selectedStates.length > 0 && (
                    <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                      <h4 className="mb-3 font-semibold text-purple-800">🧠 AI Analysis</h4>
                      <div className="space-y-2 text-sm text-purple-700">
                        <div className="flex justify-between">
                          <span>Total States Selected:</span>
                          <span className="font-medium">{selectedStates.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Population:</span>
                          <span className="font-medium">
                            {selectedStates
                              .reduce((sum, s) => sum + (s.population || 0), 0)
                              .toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Area:</span>
                          <span className="font-medium">
                            {selectedStates
                              .reduce((sum, s) => sum + (s.area || 0), 0)
                              .toLocaleString()}{" "}
                            km²
                          </span>
                        </div>
                        <div className="mt-3 rounded border border-purple-200 bg-white p-2">
                          <p className="text-xs text-purple-600">
                            <strong>AI Insight:</strong>{" "}
                            {selectedStates.length > 5
                              ? "You've selected a diverse mix of states! This will create an interesting and varied wheel experience."
                              : "Consider adding more states for a more dynamic wheel experience."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── TEXT TAB ── */}
          {sidebarTab === "text" && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-slate-700">State list</Label>
                <p className="mt-1 text-xs text-slate-500">
                  One state name per line. Matching names from the catalog are selected.
                </p>
              </div>
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={12}
                placeholder={"California\nTexas\nNew York"}
                className="font-mono text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={applyBulkText}>
                  Apply text
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBulkText(selectedStates.map((s) => s.name).join("\n"))}
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
                    a.download = "states.txt"
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  Export
                </Button>
              </div>
            </div>
          )}

          {/* ── STYLE TAB ── */}
          {sidebarTab === "style" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Display Options</Label>
                <div className="grid gap-2">
                  {(
                    [
                      { value: "both" as const, label: "Flag & Name" },
                      { value: "flag" as const, label: "Flag Only" },
                      { value: "name" as const, label: "Name Only" },
                    ] as const
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
                        name="state-display"
                        value={opt.value}
                        checked={displayMode === opt.value}
                        onChange={() => setDisplayMode(opt.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
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
                        LETTER_COLOR_PALETTES[Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)]
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

          {/* ── OTHER OPTIONS TAB ── */}
          {sidebarTab === "other" && (
            <div className="space-y-4">
              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Confetti</p>
                    <p className="text-xs text-slate-500">Celebrate each spin result</p>
                  </div>
                  <Switch
                    id="state-confetti"
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
                    id="state-sound"
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
                toolLabel="States"
                resultsCount={recentResultsCount}
                exportFileName="states.txt"
                exportText={exportText}
                entries={selectedStates.map((s) => ({
                  id: s.id,
                  name: s.name,
                  weight: 1,
                }))}
                onImportText={(text) => {
                  setBulkText(text)
                  setSidebarTab("text")
                  showToast("Pasted into Text tab — tap Apply text", "info")
                }}
                onRemoveDuplicates={removeDuplicateStates}
                onViewResults={openHistory}
                onOpenSettings={onOpenSettings}
                onToggleFullscreen={onToggleFullscreen}
                onOpenAnalytics={onOpenAnalytics}
                onOpenAI={() => {
                  setSidebarTab("inputs")
                  handleTabChange("ai")
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <StateStatisticsModal
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
        state={selectedState}
      />
      <StateComparisonModal isOpen={showComparison} onClose={() => setShowComparison(false)} />
      <StateFavoritesModal isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
      <StateResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={(data as any).recentResults || []}
      />
    </>
  )
}
