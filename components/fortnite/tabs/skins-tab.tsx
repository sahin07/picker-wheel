"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, List, RotateCcw, Shuffle, MoreHorizontal, X, Heart, GitCompare, Plus, Info } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fortniteSkins } from "@/data/fortnite-skins"
import { rarityColors, rarityIcons } from "@/lib/rarity-config"
import type { Skin, DisplayMode, RarityFilter } from "@/types/fortnite-types"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useEffect, useRef, useState } from "react"

interface SkinsTabProps {
  selectedRarity?: RarityFilter
  selectedSkins?: string[] // Changed from Set<string> to string[]
  displayMode?: DisplayMode
  showTitle?: boolean
  onRarityChange?: (rarity: RarityFilter) => void
  onSkinToggle?: (skinId: string) => void
  onClearAll?: () => void
  onDisplayModeChange?: (mode: DisplayMode) => void
  onShowTitleToggle?: () => void
  onPreviewSkin?: (skin?: Skin) => void // Updated to accept optional skin parameter
  getRarityCount?: () => { selected: number; available: number }
  onShuffleSkins?: () => void
  onSortSkinsAZ?: () => void
  onAddRandomSkins?: () => void
  // Favorites and Comparison props
  onOpenFavorites?: () => void
  onOpenComparison?: () => void
  addToFavorites?: (skin: Skin) => void
  removeFromFavorites?: (skinId: string) => void
  isFavorite?: (skinId: string) => boolean
  addToComparison?: (skin: Skin) => void
  removeFromComparison?: (skinId: string) => void
  isInComparison?: (skinId: string) => boolean
  favoriteSkins?: Skin[]
  comparisonSkins?: Skin[]
  // Enhanced Details prop
  onEnhancedDetails?: (skin: Skin) => void
  // Manual selection prop
  onManualSelect?: (skin: Skin) => void
  actionMode?: "normal" | "elimination" | "manual"
  // Custom skins props
  customSkins?: Skin[]
  onDeleteCustomSkin?: (skinId: string) => void
}

export function SkinsTab({
  selectedRarity = "all",
  selectedSkins = [],
  displayMode = "emoji-name",
  showTitle = true,
  onRarityChange,
  onSkinToggle,
  onClearAll,
  onDisplayModeChange,
  onShowTitleToggle,
  onPreviewSkin,
  getRarityCount,
  onShuffleSkins,
  onSortSkinsAZ,
  onAddRandomSkins,
  onOpenFavorites,
  onOpenComparison,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  addToComparison,
  removeFromComparison,
  isInComparison,
  favoriteSkins = [],
  comparisonSkins = [],
  onEnhancedDetails,
  onManualSelect,
  actionMode = "normal",
  customSkins = [],
  onDeleteCustomSkin,
}: SkinsTabProps) {
  console.log('=== SkinsTab Component Props ===')
  console.log('selectedSkins:', selectedSkins)
  console.log('selectedSkins type:', typeof selectedSkins)
  console.log('selectedSkins length:', selectedSkins?.length)
  console.log('selectedRarity:', selectedRarity)
  console.log('selectedRarity type:', typeof selectedRarity)
  console.log('onSkinToggle exists:', !!onSkinToggle)
  console.log('=== End SkinsTab Props ===')
  
  const { getCurrentWheel, updateWheelData } = useWheelManagerStore()
  const scrollContainerRef = useRef<HTMLDivElement>(null)



  // Preserve scroll position when component re-renders
  const [savedScrollTop, setSavedScrollTop] = useState<number>(0)
  const [lastChangedSkinId, setLastChangedSkinId] = useState<string | null>(null)
  
  // Save scroll position before any state changes
  const saveScrollPosition = (skinId: string) => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      setSavedScrollTop(scrollContainer.scrollTop)
      setLastChangedSkinId(skinId)
    }
  }
  
  // Restore scroll position after render, but only if the changed skin is visible
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer && savedScrollTop > 0 && lastChangedSkinId) {
      // Check if the changed skin is currently visible in the scroll container
      const skinElement = scrollContainer.querySelector(`[data-skin-id="${lastChangedSkinId}"]`)
      if (skinElement) {
        const skinRect = skinElement.getBoundingClientRect()
        const containerRect = scrollContainer.getBoundingClientRect()
        
        // Only restore scroll if the skin is visible in the container
        if (skinRect.top >= containerRect.top && skinRect.bottom <= containerRect.bottom) {
          setTimeout(() => {
            if (scrollContainer) {
              scrollContainer.scrollTop = savedScrollTop
            }
          }, 0)
        }
      }
      setLastChangedSkinId(null) // Reset after checking
    }
  }, [selectedSkins, customSkins, savedScrollTop, lastChangedSkinId])

  const renderSkinsList = () => {
    const rarities = selectedRarity === "all" 
      ? Object.keys(fortniteSkins) 
      : Object.keys(fortniteSkins).filter(key => key.toLowerCase() === selectedRarity.toLowerCase())
    
    console.log('=== renderSkinsList ===')
    console.log('selectedRarity:', selectedRarity)
    console.log('Object.keys(fortniteSkins):', Object.keys(fortniteSkins))
    console.log('rarities:', rarities)
    console.log('fortniteSkins keys:', Object.keys(fortniteSkins))
    console.log('=== end renderSkinsList ===')

    return (
      <div className="space-y-4">
        {rarities.map((rarityKey) => {
          const skins = fortniteSkins[rarityKey as keyof typeof fortniteSkins] || []
          const rarityColor = rarityColors[rarityKey as keyof typeof rarityColors]
          const rarityIcon = rarityIcons[rarityKey as keyof typeof rarityIcons]
          
          console.log(`Rendering rarity ${rarityKey}:`, skins.length, 'skins')
          console.log('Skin names:', skins.map(s => s.name))

          return (
            <div key={rarityKey}>
              <h4 className="font-semibold text-sm mb-2 capitalize flex items-center gap-2 text-gray-800">
                <span style={{ color: rarityColor }}>{rarityIcon}</span>
                {rarityKey} ({skins.length})
              </h4>
              <div className="space-y-2">
                {skins.map((skin) => (
                  <div key={skin.id} data-skin-id={skin.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={skin.id}
                      checked={selectedSkins?.includes(skin.id) || false}
                      onCheckedChange={(checked) => {
                        console.log('=== CHECKBOX CLICKED ===')
                        console.log('Skin:', skin.id, skin.name)
                        console.log('Checked:', checked)
                        console.log('onSkinToggle function exists:', !!onSkinToggle)
                        saveScrollPosition(skin.id)
                        onSkinToggle?.(skin.id)
                        console.log('=== CHECKBOX CLICK END ===')
                      }}
                    />
                    <Label 
                      htmlFor={skin.id} 
                      className={`flex items-center space-x-2 cursor-pointer ${
                        actionMode === "manual" ? "hover:bg-blue-50 p-1 rounded" : ""
                      }`}
                      onClick={() => {
                        if (actionMode === "manual" && onManualSelect) {
                          onManualSelect(skin)
                        }
                      }}
                    >
                      <span className="text-lg">{skin.emoji}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">{skin.name}</span>
                        <span className="text-xs text-gray-500">{skin.season}</span>
                      </div>
                    </Label>
                    <div className="flex items-center space-x-1 ml-auto">
                      <Button variant="ghost" size="sm" onClick={() => onPreviewSkin?.(skin)} title="Preview">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEnhancedDetails?.(skin)} 
                        title="Enhanced Details"
                        className="text-purple-500 hover:text-purple-700"
                      >
                        <Info className="w-3 h-3" />
                      </Button>
                      {addToFavorites && removeFromFavorites && isFavorite && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => isFavorite(skin.id) ? removeFromFavorites(skin.id) : addToFavorites(skin)}
                          title={isFavorite(skin.id) ? "Remove from favorites" : "Add to favorites"}
                          className={isFavorite(skin.id) ? "text-red-500 hover:text-red-700" : "text-gray-400 hover:text-red-500"}
                        >
                          <Heart className={`w-3 h-3 ${isFavorite(skin.id) ? "fill-current" : ""}`} />
                        </Button>
                      )}
                      {addToComparison && removeFromComparison && isInComparison && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => isInComparison(skin.id) ? removeFromComparison(skin.id) : addToComparison(skin)}
                          title={isInComparison(skin.id) ? "Remove from comparison" : "Add to comparison"}
                          disabled={!isInComparison(skin.id) && comparisonSkins.length >= 4}
                          className={isInComparison(skin.id) ? "text-blue-500 hover:text-blue-700" : "text-gray-400 hover:text-blue-500"}
                        >
                          {isInComparison(skin.id) ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        
        {/* Custom Skins Section */}
        {customSkins.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 capitalize flex items-center gap-2 text-gray-800">
              <span style={{ color: "#8B5CF6" }}>🎮</span>
              Custom ({customSkins.length})
            </h4>
            <div className="space-y-2">
              {customSkins.map((skin) => (
                <div key={skin.id} data-skin-id={skin.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={skin.id}
                    checked={selectedSkins?.includes(skin.id) || false}
                    onCheckedChange={() => {
                      saveScrollPosition(skin.id)
                      onSkinToggle?.(skin.id)
                    }}
                  />
                  <Label 
                    htmlFor={skin.id} 
                    className={`flex items-center space-x-2 cursor-pointer ${
                      actionMode === "manual" ? "hover:bg-blue-50 p-1 rounded" : ""
                    }`}
                    onClick={() => {
                      if (actionMode === "manual" && onManualSelect) {
                        onManualSelect(skin)
                      }
                    }}
                  >
                    <span className="text-lg">{skin.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">{skin.name}</span>
                      <span className="text-xs text-gray-500">{skin.season}</span>
                    </div>
                  </Label>
                  <div className="flex items-center space-x-1 ml-auto">
                    <Button variant="ghost" size="sm" onClick={() => onPreviewSkin?.(skin)} title="Preview">
                      <Eye className="w-3 h-3" />
                    </Button>
                    {onDeleteCustomSkin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteCustomSkin(skin.id)}
                        title="Delete Custom Skin"
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-800">SKINS</h3>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {getRarityCount?.()?.selected || 0}
              </Badge>
              {/* Favorites and Comparison Buttons */}
              {onOpenFavorites && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${favoriteSkins.length > 0 ? "text-red-500" : "text-gray-400"}`}
                  onClick={onOpenFavorites}
                  title="Favorites"
                >
                  <Heart className="w-4 h-4" />
                  {favoriteSkins.length > 0 && <span className="ml-1 text-xs">{favoriteSkins.length}</span>}
                </Button>
              )}
              {onOpenComparison && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${comparisonSkins.length > 0 ? "text-blue-500" : "text-gray-400"}`}
                  onClick={onOpenComparison}
                  title="Comparison"
                >
                  <GitCompare className="w-4 h-4" />
                  {comparisonSkins.length > 0 && <span className="ml-1 text-xs">{comparisonSkins.length}</span>}
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Input Control Buttons (like home page) */}
              <Button 
                variant="ghost" 
                size="sm" 
                title="Preview All Wheel Skins" 
                onClick={() => {
                  console.log('Preview button clicked')
                  if (onPreviewSkin) {
                    onPreviewSkin()
                  }
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
              {onShuffleSkins && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    console.log('Shuffle button clicked')
                    onShuffleSkins()
                  }} 
                  title="Shuffle"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
              {onAddRandomSkins && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="Add Random Skins" 
                  onClick={() => {
                    console.log('Add Random Skins button clicked')
                    onAddRandomSkins()
                  }}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onClearAll?.()}>
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </DropdownMenuItem>
                  {onSortSkinsAZ && (
                    <DropdownMenuItem 
                      onClick={() => {
                        console.log('Sort A-Z button clicked')
                        onSortSkinsAZ()
                      }}
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Sort A-Z
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Rarity Selection */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block text-gray-800">Select Rarity & Filter Skins:</Label>
            <div key={`rarity-buttons-${selectedRarity}`} className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedRarity === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  console.log('All Skins button clicked')
                  onRarityChange?.("all")
                }}
                className={`text-xs ${selectedRarity === "all" ? "bg-gray-800 text-white" : "bg-white text-gray-700"}`}
              >
                All Skins
              </Button>
              {Object.keys(rarityColors).map((rarity) => {
                const isSelected = selectedRarity === rarity;
                console.log(`Rarity button ${rarity}: selectedRarity=${selectedRarity}, rarity=${rarity}, isSelected=${isSelected}, comparison=${selectedRarity === rarity}`);
                return (
                  <Button
                    key={`${rarity}-${selectedRarity}`}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      console.log(`${rarity} button clicked`)
                      onRarityChange?.(rarity as RarityFilter)
                    }}
                    className={`text-xs ${isSelected ? "text-white" : "bg-white text-gray-700"}`}
                    style={{
                      backgroundColor:
                        isSelected ? rarityColors[rarity as keyof typeof rarityColors] : undefined,
                      borderColor: rarityColors[rarity as keyof typeof rarityColors],
                    }}
                  >
                    {rarityIcons[rarity as keyof typeof rarityIcons]} {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Skin Count and Clear */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              {getRarityCount?.()?.selected || 0} selected of {getRarityCount?.()?.available || 0} skins
            </span>
            <Button variant="ghost" size="sm" onClick={() => onClearAll?.()} className="text-red-600">
              Clear All
            </Button>
          </div>

          {/* Skins List */}
          <div ref={scrollContainerRef} className="max-h-64 overflow-y-auto">{renderSkinsList()}</div>

        </CardContent>
      </Card>

      {/* Custom Skins Card */}
      {customSkins && customSkins.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="text-purple-600">🎨</span>
              Custom Skins ({customSkins.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {customSkins.map((skin) => (
                <div
                  key={skin.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedSkins.includes(skin.id)}
                      onChange={() => onSkinToggle?.(skin.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-2xl">{skin.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{skin.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {skin.rarity}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {skin.season}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreviewSkin?.(skin)}
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteCustomSkin?.(skin.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display Mode Controls - Moved outside the card container */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-sm font-medium mb-2 block text-gray-800">Display Mode:</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDisplayModeChange?.("emoji-name")}
              className={displayMode === "emoji-name" ? "bg-blue-100 text-blue-700" : ""}
              title="Show Emoji & Name"
            >
              <Eye className="w-4 h-4 mr-1" />
              Emoji & Name
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDisplayModeChange?.("emoji")}
              className={displayMode === "emoji" ? "bg-blue-100 text-blue-700" : ""}
              title="Show Emoji Only"
            >
              🎮 Emoji Only
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDisplayModeChange?.("name")}
              className={displayMode === "name" ? "bg-blue-100 text-blue-700" : ""}
              title="Show Name Only"
            >
              <List className="w-4 h-4 mr-1" />
              Name Only
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onShowTitleToggle?.()}
              className={showTitle ? "bg-blue-100 text-blue-700" : ""}
              title="Toggle Title"
            >
              T Title
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
