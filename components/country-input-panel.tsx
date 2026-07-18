"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, Eye, List, Type, Heart, GitCompare, BarChart3, Plus, X, Brain } from "lucide-react"
import { useWheelManagerStore, type CountryWheelData } from "@/stores/wheel-manager-store"
import { regions, type Country } from "@/data/countries"
import { useState, useEffect } from "react"
import CountryStatisticsModal from "./country-statistics-modal"
import CountryComparisonModal from "./country-comparison-modal"
import CountryFavoritesModal from "./country-favorites-modal"
import { getCountriesByRegion } from "@/data/countries"
import CountryAIAnalysis from "./country-ai-analysis"
import CountryAISuggestions from "./country-ai-suggestions"

interface CountryInputPanelProps {
  activeTab?: 'manual' | 'ai'
  onTabChange?: (tab: 'manual' | 'ai') => void
}

export default function CountryInputPanel({ activeTab: externalActiveTab, onTabChange }: CountryInputPanelProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const wheelManager = useWheelManagerStore();
  const wheel = wheelManager.getCurrentWheel();

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

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-4">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-800">INPUTS</h3>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`${favoriteCountries.length > 0 ? "text-red-500" : "text-gray-400"}`}
                onClick={() => setShowFavorites(true)}
                title="Favorites"
              >
                <Heart className="w-4 h-4" />
                {favoriteCountries.length > 0 && <span className="ml-1 text-xs">{favoriteCountries.length}</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`${comparisonCountries.length > 0 ? "text-blue-500" : "text-gray-400"}`}
                onClick={() => setShowComparison(true)}
                title="Comparison"
              >
                <GitCompare className="w-4 h-4" />
                {comparisonCountries.length > 0 && <span className="ml-1 text-xs">{comparisonCountries.length}</span>}
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              title="Preview"
              onClick={() => setShowCountryList(!showCountryList)}
              className={showCountryList ? "bg-gray-200" : ""}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="List View"
              onClick={() => setViewMode(viewMode === "list" ? "wheel" : "list")}
              className={viewMode === "list" ? "bg-gray-200" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Text Mode"
              onClick={() => setViewMode(viewMode === "text" ? "wheel" : "text")}
              className={viewMode === "text" ? "bg-gray-200" : ""}
            >
              <Type className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === 'manual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTabChange('manual')}
            className={activeTab === 'manual' ? 'bg-gray-800 text-white' : ''}
          >
            Manual
          </Button>
          <Button
            variant={activeTab === 'ai' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTabChange('ai')}
            className={activeTab === 'ai' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent border-purple-300 hover:bg-purple-50'}
          >
            <Brain className={`w-4 h-4 mr-2 ${activeTab === 'ai' ? 'text-white' : 'text-purple-600'}`} />
            AI-Powered
          </Button>
        </div>

        {/* Manual Tab Content */}
        {activeTab === 'manual' && (
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
                  <div className="space-y-2">
                    {selectedCountries.map((country) => (
                      <div
                        key={country.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{country.flag}</span>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{country.name}</div>
                            <div className="text-xs text-gray-500">
                              {country.capital} • {country.region}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
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
                    {selectedCountries.map((country) => (
                      <div key={country.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <span className="text-lg">{country.flag}</span>
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
                      {selectedCountries.map((country, index) => (
                        <span key={country.id}>
                          {country.name}
                          {index < selectedCountries.length - 1 ? ", " : ""}
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
                // Append new countries to existing ones, avoiding duplicates
                const existingIds = selectedCountries.map(c => c.id);
                const uniqueNewCountries = newCountries.filter(c => !existingIds.includes(c.id));
                console.log('AI Debug - Adding countries:', newCountries);
                console.log('AI Debug - Existing countries:', selectedCountries);
                console.log('AI Debug - Unique new countries:', uniqueNewCountries);
                setSelectedCountries([...selectedCountries, ...uniqueNewCountries]);
              }}
              onAddToFavorites={addToFavorites}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <CountryStatisticsModal
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
        country={selectedCountry}
      />
      <CountryComparisonModal isOpen={showComparison} onClose={() => setShowComparison(false)} />
      <CountryFavoritesModal isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
    </>
  )
}
