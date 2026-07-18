"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, GitCompare, Eye, List, Type, Shuffle, RotateCcw, Brain, BarChart3, Plus, X } from "lucide-react"
import { getStatesByCountry, availableCountries, type State } from "@/data/states"
import { useStateWheelStore } from "@/stores/state-wheel-store"
import { useWheelManagerStore, type StateWheelData } from "@/stores/wheel-manager-store"
import StateStatisticsModal from "./state-statistics-modal"
import StateComparisonModal from "./state-comparison-modal"
import StateFavoritesModal from "./state-favorites-modal"

interface StateInputPanelProps {
  activeTab?: 'manual' | 'ai'
  onTabChange?: (tab: 'manual' | 'ai') => void
}

export default function StateInputPanel({ activeTab: externalActiveTab, onTabChange }: StateInputPanelProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>(externalActiveTab || 'manual')
  const [showStateList, setShowStateList] = useState(true)
  const [selectedState, setSelectedState] = useState<State | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<State[]>([])
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const getCurrentWheel = useWheelManagerStore((state) => state.getCurrentWheel)
  const updateWheelData = useWheelManagerStore((state) => state.updateWheelData)

  // Client-side only rendering to prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    selectedCountry,
    selectedStates,
    displayMode,
    viewMode,
    favoriteStates,
    comparisonStates,
    showStatistics,
    showComparison,
    showFavorites,
    setSelectedCountry,
    setDisplayMode,
    setViewMode,
    setSelectedStates,
    toggleState,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToComparison,
    removeFromComparison,
    isInComparison,
    setShowStatistics,
    setShowComparison,
    setShowFavorites
  } = useStateWheelStore()

  // Ensure arrays are always defined with fallbacks
  const allStatesForCountry = getStatesByCountry(selectedCountry)
  const selectedStatesArray = selectedStates ?? []
  const favoriteStatesArray = favoriteStates ?? []
  const comparisonStatesArray = comparisonStates ?? []

  // Tab management
  const handleTabChange = (tab: 'manual' | 'ai') => {
    setActiveTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  // Initialize with all states selected for the current country
  useEffect(() => {
    if (selectedStatesArray.length === 0) {
      const allStatesForCountry = getStatesByCountry(selectedCountry)
      setSelectedStates(allStatesForCountry)
    }
  }, [selectedCountry, selectedStatesArray.length])

  useEffect(() => {
    if (!mounted) return

    const wheel = getCurrentWheel()
    if (!wheel || wheel.toolType !== "state-wheel") return

    const data = wheel.data as StateWheelData
    const wheelStates = data.selectedStates ?? []
    const hasSameStates =
      wheelStates.length === selectedStatesArray.length &&
      wheelStates.every((state, index) => state.id === selectedStatesArray[index]?.id)

    if (
      data.selectedCountry === selectedCountry &&
      data.displayMode === displayMode &&
      data.viewMode === viewMode &&
      hasSameStates
    ) {
      return
    }

    updateWheelData("state-wheel", wheel.id, {
      ...data,
      selectedCountry,
      selectedStates: selectedStatesArray,
      displayMode,
      viewMode,
    })
  }, [
    mounted,
    selectedCountry,
    selectedStatesArray,
    displayMode,
    viewMode,
    getCurrentWheel,
    updateWheelData,
  ])

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)
  };

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

  const handleShowStatistics = (state: State) => {
    setShowStatistics(true)
  }

  const selectedCountryData = availableCountries.find((c) => c.id === selectedCountry)

  // AI Suggestions Logic
  const generateAISuggestions = () => {
    setIsGeneratingSuggestions(true)
    
    // Simulate AI processing delay
    setTimeout(() => {
      const allStatesForCountry = getStatesByCountry(selectedCountry)
      
      // AI logic: Generate suggestions based on various criteria
      const suggestions: State[] = []
      
      // 1. Popular states (high population)
      const popularStates = allStatesForCountry
        .filter(state => state.population && state.population > 5000000)
        .sort((a, b) => (b.population || 0) - (a.population || 0))
        .slice(0, 5)
      
      // 2. Large states (high area)
      const largeStates = allStatesForCountry
        .filter(state => state.area && state.area > 200000)
        .sort((a, b) => (b.area || 0) - (a.area || 0))
        .slice(0, 3)
      
      // 3. States with interesting capitals
      const interestingCapitals = allStatesForCountry
        .filter(state => state.capital && state.capital.length > 0)
        .slice(0, 4)
      
      // 4. Random selection for variety
      const randomStates = allStatesForCountry
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
      
      // Combine and deduplicate suggestions
      const allSuggestions = [...popularStates, ...largeStates, ...interestingCapitals, ...randomStates]
      const uniqueSuggestions = allSuggestions.filter((state, index, self) => 
        index === self.findIndex(s => s.id === state.id)
      ).slice(0, 8) // Limit to 8 suggestions
      
      setAiSuggestions(uniqueSuggestions)
      setIsGeneratingSuggestions(false)
      
      // Auto-select AI suggestions
      setSelectedStates(uniqueSuggestions)
      
    }, 2000) // 2 second delay to simulate AI processing
  }

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
                className={`${favoriteStatesArray.length > 0 ? "text-red-500" : "text-gray-400"}`}
                onClick={() => setShowFavorites(true)}
                title="Favorites"
              >
                <Heart className="w-4 h-4" />
                {mounted && favoriteStatesArray.length > 0 && <span className="ml-1 text-xs">{favoriteStatesArray.length}</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`${comparisonStatesArray.length > 0 ? "text-blue-500" : "text-gray-400"}`}
                onClick={() => setShowComparison(true)}
                title="Comparison"
              >
                <GitCompare className="w-4 h-4" />
                {mounted && comparisonStatesArray.length > 0 && <span className="ml-1 text-xs">{comparisonStatesArray.length}</span>}
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              title="Preview"
              onClick={() => setShowStateList(!showStateList)}
              className={showStateList ? "bg-gray-200" : ""}
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
            <Button variant="ghost" size="sm" title="Shuffle" onClick={() => setSelectedStates([...selectedStatesArray].sort(() => Math.random() - 0.5))}>
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Sort A-Z" onClick={() => setSelectedStates([...selectedStatesArray].sort((a, b) => a.name.localeCompare(b.name)))}>
              <RotateCcw className="w-4 h-4" />
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
            {/* Country Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Country:</label>
              <Select value={selectedCountry} onValueChange={handleCountrySelect}>
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

            {/* Selected Count */}
            <div className="mb-6">
              <div
                className="w-full flex items-center justify-between p-3 h-auto bg-transparent border rounded-md cursor-pointer"
                onClick={() => setShowStateList(!showStateList)}
                tabIndex={0}
                role="button"
              >
                <span className="font-medium">
                  {selectedStatesArray.length} selected of {allStatesForCountry.length}
                </span>
                <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedStates(allStatesForCountry)
                    }}
                    className="text-xs"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedStates([])
                    }}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                  {/* ChevronDown is not defined in the new_code, so it's removed */}
                </div>
              </div>
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
                    onChange={(e) => setDisplayMode(e.target.value as "flag" | "name" | "both" )}
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
                    onChange={(e) => setDisplayMode(e.target.value as "flag" | "name" | "both" )}
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
                    onChange={(e) => setDisplayMode(e.target.value as "flag" | "name" | "both" )}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Name</span>
                </label>
              </div>
            </div>

            {/* State List (when expanded) */}
            {showStateList && (
              <div className="mt-4">
                <div className="p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {allStatesForCountry.map((state) => (
                      <div
                        key={state.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedStatesArray.some((s: State) => s.id === state.id)}
                            onCheckedChange={() => {
                              const isSelected = selectedStatesArray.some((s: State) => s.id === state.id)
                              setSelectedStates(isSelected
                                ? selectedStatesArray.filter((s: State) => s.id !== state.id)
                                : [...selectedStatesArray, state]
                              )
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          {state.flag && <span className="text-2xl">{state.flag}</span>}
                          <div className="flex-1">
                            <div className="font-medium text-sm">{state.name}</div>
                            <div className="text-xs text-gray-500">
                              {state.capital && `${state.capital} • `}
                              {state.abbreviation && `${state.abbreviation} • `}
                              {state.country}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShowStatistics(state)}
                            title="Statistics"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(state)}
                            title={(favoriteStatesArray || []).some((s) => s.id === state.id) ? "Remove from favorites" : "Add to favorites"}
                            className={
                              (favoriteStatesArray || []).some((s) => s.id === state.id) ? "text-red-500 hover:text-red-700" : "text-gray-400 hover:text-red-500"
                            }
                          >
                            <Heart className={`w-4 h-4 ${((favoriteStatesArray || []).some((s) => s.id === state.id)) ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleComparison(state)}
                            title={(comparisonStatesArray || []).some((s) => s.id === state.id) ? "Remove from comparison" : "Add to comparison"}
                            disabled={(comparisonStatesArray || []).some((s) => s.id === state.id) && (comparisonStatesArray || []).length >= 4}
                            className={
                              (comparisonStatesArray || []).some((s) => s.id === state.id)
                                ? "text-blue-500 hover:text-blue-700"
                                : "text-gray-400 hover:text-blue-500"
                            }
                          >
                            {(comparisonStatesArray || []).some((s) => s.id === state.id) ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* View Mode Display */}
            {viewMode === "list" && (
              <div className="mt-4">
                <div className="p-4">
                  <h4 className="font-semibold mb-3">List View</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {(selectedStatesArray || []).map((state) => (
                      <div key={state.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        {state.flag && <span className="text-lg">{state.flag}</span>}
                        <span className="text-sm font-medium truncate">{state.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {viewMode === "text" && (
              <div className="mt-4">
                <div className="p-4">
                  <h4 className="font-semibold mb-3">Text Mode</h4>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="text-sm leading-relaxed">
                      {(selectedStatesArray || []).map((state, index) => (
                        <span key={state.id}>
                          {state.name}
                          {index < (selectedStatesArray || []).length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(selectedStatesArray || []).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🏛️</div>
                <p className="font-medium">No states selected</p>
                <p className="text-sm">Choose a country and select states to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* AI Tab Content */}
        {activeTab === 'ai' && (
          <div>
            {/* Country Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Country:</label>
              <Select value={selectedCountry} onValueChange={handleCountrySelect}>
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

            {/* AI State Suggestions */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">AI State Suggestions</label>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                  onClick={generateAISuggestions}
                  disabled={isGeneratingSuggestions}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {isGeneratingSuggestions ? "Generating..." : "Get AI Suggestions"}
                </Button>
              </div>
              {isGeneratingSuggestions ? (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                  <div className="text-center">
                    <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-purple-700 font-medium">AI is generating suggestions...</p>
                    <p className="text-xs text-purple-600 mt-1">Please wait a moment.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                  {aiSuggestions.length > 0 ? (
                    <div>
                      <div className="text-center mb-3">
                        <Brain className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                        <p className="text-sm text-purple-700 font-medium">AI Suggestions Generated!</p>
                        <p className="text-xs text-purple-600">Based on population, size, and diversity</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {aiSuggestions.map((state) => (
                          <div key={state.id} className="flex items-center space-x-2 p-2 bg-white rounded border border-purple-200">
                            <span className="text-lg">{state.flag}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{state.name}</div>
                              {state.population && (
                                <div className="text-xs text-purple-600">
                                  {state.population.toLocaleString()} people
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAiSuggestions([])}
                          className="text-xs text-purple-600 border-purple-300 hover:bg-purple-50"
                        >
                          Clear Suggestions
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-purple-700 font-medium">AI will suggest states based on your preferences</p>
                      <p className="text-xs text-purple-600 mt-1">Click the button above to get intelligent recommendations</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected States for AI */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">States for AI Wheel</label>
                <span className="text-sm text-gray-500">{selectedStatesArray.length} selected</span>
              </div>
              <div className="bg-white border rounded-lg p-3 max-h-32 overflow-y-auto">
                {selectedStatesArray.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No states selected for AI wheel</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedStatesArray.slice(0, 8).map((state) => (
                      <div key={state.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <span className="text-lg">{state.flag}</span>
                        <span className="text-sm font-medium truncate">{state.name}</span>
                      </div>
                    ))}
                    {selectedStatesArray.length > 8 && (
                      <div className="text-xs text-gray-500 col-span-2 text-center">
                        +{selectedStatesArray.length - 8} more states
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Display Mode for AI */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">AI Wheel Display:</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="aiDisplayMode"
                    value="both"
                    checked={displayMode === "both"}
                    onChange={(e) => setDisplayMode(e.target.value as "flag" | "name" | "both")}
                    className="text-purple-600"
                  />
                  <span className="text-sm">Flag & Name</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="aiDisplayMode"
                    value="flag"
                    checked={displayMode === "flag"}
                    onChange={(e) => setDisplayMode(e.target.value as "flag" | "name" | "both")}
                    className="text-purple-600"
                  />
                  <span className="text-sm">Flag</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="aiDisplayMode"
                    value="name"
                    checked={displayMode === "name"}
                    onChange={(e) => setDisplayMode(e.target.value as "flag" | "name" | "both")}
                    className="text-purple-600"
                  />
                  <span className="text-sm">Name</span>
                </label>
              </div>
            </div>

            {/* AI Features Info */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">🤖 AI Features</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Intelligent state recommendations</li>
                <li>• AI-powered spinning with insights</li>
                <li>• Smart result analysis</li>
                <li>• Personalized suggestions</li>
              </ul>
            </div>

            {/* AI Insights about Selected States */}
            {selectedStatesArray.length > 0 && (
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-3">🧠 AI Analysis</h4>
                <div className="space-y-2 text-sm text-purple-700">
                  {(() => {
                    const totalPopulation = selectedStatesArray.reduce((sum, state) => sum + (state.population || 0), 0)
                    const totalArea = selectedStatesArray.reduce((sum, state) => sum + (state.area || 0), 0)
                    const avgPopulation = totalPopulation / selectedStatesArray.length
                    const statesWithCapitals = selectedStatesArray.filter(state => state.capital).length
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span>Total States Selected:</span>
                          <span className="font-medium">{selectedStatesArray.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Population:</span>
                          <span className="font-medium">{totalPopulation.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Population:</span>
                          <span className="font-medium">{Math.round(avgPopulation).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Area:</span>
                          <span className="font-medium">{totalArea.toLocaleString()} km²</span>
                        </div>
                        <div className="flex justify-between">
                          <span>States with Capitals:</span>
                          <span className="font-medium">{statesWithCapitals}</span>
                        </div>
                        <div className="mt-3 p-2 bg-white rounded border border-purple-200">
                          <p className="text-xs text-purple-600">
                            <strong>AI Insight:</strong> {selectedStatesArray.length > 5 
                              ? "You've selected a diverse mix of states! This will create an interesting and varied wheel experience." 
                              : "Consider adding more states for a more dynamic wheel experience."
                            }
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <StateStatisticsModal isOpen={showStatistics} onClose={() => setShowStatistics(false)} state={selectedState} />

      <StateComparisonModal isOpen={showComparison} onClose={() => setShowComparison(false)} />

      <StateFavoritesModal isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
    </>
  )
}

