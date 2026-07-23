"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
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
import { useWheelManagerStore, type CountryWheelData } from "@/stores/wheel-manager-store"
import { regions, type Country } from "@/data/countries"
import { useState, useEffect, type ReactNode } from "react"
import CountryStatisticsModal from "./country-statistics-modal"
import CountryComparisonModal from "./country-comparison-modal"
import CountryFavoritesModal from "./country-favorites-modal"
import { getCountriesByRegion } from "@/data/countries"
import CountryAIAnalysis from "./country-ai-analysis"
import CountryAISuggestions from "./country-ai-suggestions"
import { useSettingsStore } from "@/stores/settings-store"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import { useToast } from "@/contexts/toast-context"
import { CountryFlagImage } from "@/components/country-flag-image"
import CountryResultsModal from "./country-results-modal"
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

interface CountryInputPanelProps {
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

export default function CountryInputPanel({
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
}: CountryInputPanelProps) {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("inputs")
  const [bulkText, setBulkText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const { settings, updateSettings } = useSettingsStore()
  const { showToast } = useToast()
  const [hasMounted, setHasMounted] = useState(false);
  const wheelManager = useWheelManagerStore();
  const wheel = wheelManager.getCurrentWheel();
  const actionMode: ActionMode = externalActionMode || "normal"

  const data = (wheel?.data as CountryWheelData) ?? {
    selectedRegion: "all",
    selectedCountries: [],
    displayMode: "name",
    viewMode: "wheel",
    favoriteCountries: [],
    comparisonCountries: [],
    isSpinning: false,
    spinRotation: 0,
    selectedResult: null,
    totalSpins: 0,
    showStatistics: false,
    showComparison: false,
    showFavorites: false,
  }

  const setData = (partial: Partial<CountryWheelData>) => {
    if (!wheel) return
    wheelManager.updateWheelData("country-wheel", wheel.id, { ...data, ...partial })
  }

  const {
    selectedRegion,
    selectedCountries: rawSelectedCountries,
    displayMode,
    viewMode,
    favoriteCountries: rawFavoriteCountries,
    comparisonCountries: rawComparisonCountries,
  } = data

  // Ensure arrays are always defined with fallbacks
  const selectedCountries = rawSelectedCountries ?? []
  const favoriteCountries = rawFavoriteCountries ?? []
  const comparisonCountries = rawComparisonCountries ?? []

  // Actions
  const setSelectedRegion = (region: string) =>
    setData({ selectedRegion: region, selectedCountries: getCountriesByRegion(region) })
  const setDisplayMode = (mode: "flag" | "name" | "both") => setData({ displayMode: mode })
  const setViewMode = (mode: "wheel" | "list" | "text") => setData({ viewMode: mode })
  const setSelectedCountries = (countries: Country[]) => {
    console.log('Input Panel Debug - Setting selected countries:', countries.map(c => c.name));
    setData({ selectedCountries: countries })
  }

  const toggleCountry = (country: Country) => {
    const isSelected = selectedCountries.some((c) => c.id === country.id)
    if (isSelected) {
      setSelectedCountries(selectedCountries.filter((c) => c.id !== country.id))
    } else {
      setSelectedCountries([...selectedCountries, country])
    }
  }

  const shuffleCountries = () => {
    const shuffled = [...selectedCountries].sort(() => Math.random() - 0.5)
    setSelectedCountries(shuffled)
  }

  const sortCountriesZA = () => {
    const sorted = [...selectedCountries].sort((a, b) => b.name.localeCompare(a.name))
    setSelectedCountries(sorted)
  }

  const clearAllCountries = () => {
    setSelectedCountries([])
    showToast("Cleared all countries", "success")
  }

  const removeDuplicateCountries = () => {
    const seen = new Set<string>()
    const unique = selectedCountries.filter((c) => {
      const key = c.name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    setSelectedCountries(unique)
    showToast("Duplicates removed", "success")
  }

  const deleteBlankCountries = () => {
    const cleaned = selectedCountries.filter((c) => c.name?.trim())
    setSelectedCountries(cleaned)
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

  const addToFavorites = (country: Country) => {
    if (!favoriteCountries.some((c) => c.id === country.id)) {
      setData({ favoriteCountries: [...favoriteCountries, country] })
    }
  }

  const removeFromFavorites = (countryId: string) => {
    setData({ favoriteCountries: favoriteCountries.filter((c) => c.id !== countryId) })
  }

  const isFavorite = (countryId: string) => favoriteCountries.some((c) => c.id === countryId)

  const addToComparison = (country: Country) => {
    if (comparisonCountries.length < 4 && !comparisonCountries.some((c) => c.id === country.id)) {
      setData({ comparisonCountries: [...comparisonCountries, country] })
    }
  }

  const removeFromComparison = (countryId: string) => {
    setData({ comparisonCountries: comparisonCountries.filter((c) => c.id !== countryId) })
  }

  const isInComparison = (countryId: string) => comparisonCountries.some((c) => c.id === countryId)

  const [showCountryList, setShowCountryList] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [showStatistics, setShowStatistics] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [internalActiveTab, setInternalActiveTab] = useState<'manual' | 'ai'>('manual')
  
  // Use external tab if provided, otherwise use internal state
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab
  
  const handleTabChange = (tab: 'manual' | 'ai') => {
    if (onTabChange) {
      onTabChange(tab)
    } else {
      setInternalActiveTab(tab)
    }
  }

  useEffect(() => {
    if (!wheel || wheel.toolType !== "country-wheel") return;
    const data = wheel.data as CountryWheelData;
    const region = data.selectedRegion || "all";
    const currentCountries = data.selectedCountries ?? [];

    // Backfill when region is set but countries are empty (e.g. first visit / old persisted wheels)
    if (currentCountries.length === 0) {
      wheelManager.updateWheelData("country-wheel", wheel.id, {
        ...data,
        selectedRegion: region,
        selectedCountries: getCountriesByRegion(region),
      });
    }
  }, [wheel, wheelManager]);

  useEffect(() => { setHasMounted(true); }, []);
  if (!hasMounted) return null;

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId)
  }

  const handleShowStatistics = (country: Country) => {
    setSelectedCountry(country)
    setShowStatistics(true)
  }

  const handleToggleFavorite = (country: Country) => {
    if (isFavorite(country.id)) {
      removeFromFavorites(country.id)
    } else {
      addToFavorites(country)
    }
  }

  const handleToggleComparison = (country: Country) => {
    if (isInComparison(country.id)) {
      removeFromComparison(country.id)
    } else {
      addToComparison(country)
    }
  }

  const getRegionIcon = (regionId: string) => {
    switch (regionId) {
      case "all":
        return "🌍"
      case "Europe":
        return "🇪🇺"
      case "Asia":
        return "🌏"
      case "Africa":
        return "🌍"
      case "North America":
        return "🌎"
      case "South America":
        return "🌎"
      case "Oceania":
        return "🌏"
      default:
        return "🌍"
    }
  }

  const getRegionColor = (regionId: string) => {
    switch (regionId) {
      case "all":
        return "bg-red-500"
      case "Europe":
        return "bg-blue-500"
      case "Asia":
        return "bg-green-500"
      case "Africa":
        return "bg-yellow-500"
      case "North America":
        return "bg-red-500"
      case "South America":
        return "bg-orange-500"
      case "Oceania":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get total countries for the selected region with null check
  const totalCountriesInRegion = getCountriesByRegion(selectedRegion)?.length ?? 0
  const recentResultsCount = (data as any).recentResults?.length || 0
  const filteredSelectedCountries = searchQuery.trim()
    ? selectedCountries.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        c.capital?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        c.region?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : selectedCountries

  const allCountries = getCountriesByRegion("all")
  const exportText = selectedCountries.map((c) => c.name).join("\n")

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
      showToast("Add at least one country name", "error")
      return
    }
    const matched: Country[] = []
    const unmatched: string[] = []
    for (const name of names) {
      const found = allCountries.find(
        (c) => c.name.toLowerCase() === name.toLowerCase(),
      )
      if (found) {
        if (!matched.some((m) => m.id === found.id)) matched.push(found)
      } else {
        unmatched.push(name)
      }
    }
    if (matched.length === 0) {
      showToast("No matching countries found", "error")
      return
    }
    setSelectedCountries(matched)
    if (unmatched.length > 0) {
      showToast(`Applied ${matched.length}; skipped ${unmatched.length} unknown`, "info")
    } else {
      showToast(`Applied ${matched.length} countries`, "success")
    }
  }

  return (
    <>
      <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="flex shrink-0 items-center justify-between gap-1 border-b bg-slate-50/80 px-2 py-2 sm:gap-2 sm:px-3">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">Country Controls</p>
            <span className="shrink-0 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 sm:px-2 sm:text-xs">
              {selectedCountries.length} selected
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`h-7 w-7 p-0 sm:h-8 sm:w-8 ${favoriteCountries.length > 0 ? "text-red-500" : ""}`}
              onClick={() => setShowFavorites(true)}
              title="Favorites"
            >
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`h-7 w-7 p-0 sm:h-8 sm:w-8 ${comparisonCountries.length > 0 ? "text-blue-500" : ""}`}
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
              onClick={shuffleCountries}
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
              onSortZA={sortCountriesZA}
              onShuffle={shuffleCountries}
              onEqualize={() => showToast("Countries use equal slice weights", "info")}
              onDeleteBlanks={deleteBlankCountries}
              onRemoveDuplicates={removeDuplicateCountries}
              onClearAll={clearAllCountries}
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
                  setBulkText(selectedCountries.map((c) => c.name).join("\n"))
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
          {sidebarTab === "inputs" && (
            <div>
              <div className="mb-4 space-y-2">
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
                  Elimination removes the winning country after each spin. Synced with Manage → Remove
                  winner.
                </p>
              </div>

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
            {/* Region Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Region:</label>
              <div className="grid grid-cols-2 gap-3">
                {regions.map((region) => (
                  <Button
                    key={region.id}
                    variant={selectedRegion === region.id ? "default" : "outline"}
                    className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                      selectedRegion === region.id ? "bg-gray-800 text-white" : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => handleRegionSelect(region.id)}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${getRegionColor(region.id)}`}>
                      <span className="text-white text-sm">{getRegionIcon(region.id)}</span>
                    </div>
                    <span className="text-xs font-medium">{region.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Selected Count */}
            <div className="mb-6">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between p-3 h-auto bg-transparent"
                onClick={() => setShowCountryList(!showCountryList)}
              >
                <span className="font-medium">
                  {selectedCountries.length} selected of {totalCountriesInRegion}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCountryList ? "rotate-180" : ""}`} />
              </Button>
            </div>

            {/* Display Mode */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Show:</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="displayMode"
                    value="both"
                    checked={displayMode === "both"}
                    onChange={(e) => setDisplayMode(e.target.value as "flag" | "name" | "both")}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Flag & Name</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="displayMode"
                    value="flag"
                    checked={displayMode === "flag"}
                    onChange={(e) => setDisplayMode(e.target.value as "flag" | "name" | "both")}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Flag</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="displayMode"
                    value="name"
                    checked={displayMode === "name"}
                    onChange={(e) => setDisplayMode(e.target.value as "flag" | "name" | "both")}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Name</span>
                </label>
              </div>
            </div>

            {/* Country List (when expanded) */}
            {showCountryList && (
              <Card className="mt-4">
                <CardContent className="p-4 max-h-64 overflow-y-auto">
                  {searchQuery.trim() && (
                    <p className="mb-2 text-xs text-slate-500">
                      Showing {filteredSelectedCountries.length} of {selectedCountries.length} matching “{searchQuery.trim()}”
                    </p>
                  )}
                  <div className="space-y-2">
                    {filteredSelectedCountries.map((country) => (
                      <div
                        key={country.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border"
                      >
                        <div className="flex min-w-0 items-center space-x-3">
                          <Checkbox
                            checked={selectedCountries.some((c) => c.id === country.id)}
                            onCheckedChange={() => toggleCountry(country)}
                            aria-label={`Toggle ${country.name}`}
                          />
                          <CountryFlagImage
                            country={country}
                            width={40}
                            imgClassName="h-6 w-9 rounded-sm object-cover border border-slate-200"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-sm">{country.name}</div>
                            <div className="text-xs text-gray-500">
                              {country.capital} • {country.region}
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShowStatistics(country)}
                            title="Statistics"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(country)}
                            title={isFavorite(country.id) ? "Remove from favorites" : "Add to favorites"}
                            className={
                              isFavorite(country.id)
                                ? "text-red-500 hover:text-red-700"
                                : "text-gray-400 hover:text-red-500"
                            }
                          >
                            <Heart className={`w-4 h-4 ${isFavorite(country.id) ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleComparison(country)}
                            title={isInComparison(country.id) ? "Remove from comparison" : "Add to comparison"}
                            disabled={!isInComparison(country.id) && comparisonCountries.length >= 4}
                            className={
                              isInComparison(country.id)
                                ? "text-blue-500 hover:text-blue-700"
                                : "text-gray-400 hover:text-blue-500"
                            }
                          >
                            {isInComparison(country.id) ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredSelectedCountries.length === 0 && (
                      <p className="py-4 text-center text-sm text-slate-500">
                        {searchQuery.trim() ? "No countries match your search." : "No countries selected."}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* View Mode Display */}
            {viewMode === "list" && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">List View</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {filteredSelectedCountries.map((country) => (
                      <div key={country.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <CountryFlagImage
                          country={country}
                          width={40}
                          imgClassName="h-5 w-7 rounded-sm object-cover border border-slate-200"
                        />
                        <span className="text-sm font-medium truncate">{country.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {viewMode === "text" && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Text Mode</h4>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="text-sm leading-relaxed">
                      {filteredSelectedCountries.map((country, index) => (
                        <span key={country.id}>
                          {country.name}
                          {index < filteredSelectedCountries.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedCountries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🌍</div>
                <p className="font-medium">No countries selected</p>
                <p className="text-sm">Choose a region above to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* AI Tab Content */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            {/* AI Region Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">AI Region Focus:</label>
              <div className="grid grid-cols-2 gap-3">
                {regions.map((region) => (
                  <Button
                    key={region.id}
                    variant={selectedRegion === region.id ? "default" : "outline"}
                    className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                      selectedRegion === region.id ? "bg-purple-600 text-white" : "bg-white hover:bg-purple-50 border-purple-200"
                    }`}
                    onClick={() => handleRegionSelect(region.id)}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${getRegionColor(region.id)}`}>
                      <span className="text-white text-sm">{getRegionIcon(region.id)}</span>
                    </div>
                    <span className="text-xs font-medium">{region.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* AI Selected Count */}
            <div className="mb-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between p-3 h-auto bg-transparent border-purple-200"
                onClick={() => setShowCountryList(!showCountryList)}
              >
                <span className="font-medium">
                  {selectedCountries.length} selected of {totalCountriesInRegion}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCountryList ? "rotate-180" : ""}`} />
              </Button>
            </div>

            {/* Country Selector for AI Analysis */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Country for AI Analysis:</label>
              <Select 
                value={selectedCountry?.id || ''} 
                onValueChange={(value) => {
                  const country = getCountriesByRegion('all').find(c => c.id === value)
                  setSelectedCountry(country || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a country to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {getCountriesByRegion('all').map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      <div className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CountryAIAnalysis
              selectedCountry={selectedCountry}
              onAddToFavorites={addToFavorites}
              onAddToComparison={addToComparison}
            />
            <CountryAISuggestions
              selectedCountries={selectedCountries}
              onAddCountries={(newCountries) => {
                const existingIds = selectedCountries.map((c) => c.id)
                const uniqueNewCountries = newCountries.filter(
                  (c) => !existingIds.includes(c.id),
                )
                setSelectedCountries([...selectedCountries, ...uniqueNewCountries])
              }}
              onAddToFavorites={addToFavorites}
            />
          </div>
              )}
            </div>
          )}

          {sidebarTab === "text" && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-slate-700">Country list</Label>
                <p className="mt-1 text-xs text-slate-500">
                  One country name per line. Matching names from the catalog are selected.
                </p>
              </div>
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={12}
                placeholder={"France\nJapan\nBrazil"}
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
                    setBulkText(selectedCountries.map((c) => c.name).join("\n"))
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
                    a.download = "countries.txt"
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
                      { value: "both" as const, label: "Flag & Name" },
                      { value: "flag" as const, label: "Flag Only" },
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
                        name="country-display"
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
                    id="country-confetti"
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
                    id="country-sound"
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
                toolLabel="Countries"
                resultsCount={(data as any).recentResults?.length || 0}
                exportFileName="countries.txt"
                exportText={exportText}
                entries={selectedCountries.map((c) => ({
                  id: c.id,
                  name: c.name,
                  weight: 1,
                }))}
                onImportText={(text) => {
                  setBulkText(text)
                  setSidebarTab("text")
                  showToast("Pasted into Text tab — tap Apply text", "info")
                }}
                onRemoveDuplicates={removeDuplicateCountries}
                onViewResults={openHistory}
                onOpenSettings={onOpenSettings}
                onToggleFullscreen={onToggleFullscreen}
                onOpenAI={() => {
                  setSidebarTab("inputs")
                  handleTabChange("ai")
                }}
                onOpenAnalytics={onOpenAnalytics}
              />
            </div>
          )}
        </div>
      </div>

      <CountryStatisticsModal
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
        country={selectedCountry}
      />
      <CountryComparisonModal isOpen={showComparison} onClose={() => setShowComparison(false)} />
      <CountryFavoritesModal isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
      <CountryResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={(data as any).recentResults || []}
      />
    </>
  )
}
