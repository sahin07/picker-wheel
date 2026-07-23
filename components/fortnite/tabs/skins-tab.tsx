"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, List, RotateCcw, Shuffle, MoreHorizontal, X, Heart, GitCompare, Plus, Info } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fortniteSkins } from "@/data/fortnite-skins"
import { rarityColors, rarityIcons } from "@/lib/rarity-config"
import type { Skin, DisplayMode, RarityFilter } from "@/types/fortnite-types"
import { useEffect, useMemo, useRef, useState } from "react"

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
  /** Challenge / weapon wheels — show only custom entries, not catalog rarities */
  customOnlyMode?: boolean
  /** Changes when template URL or spoke loads — resets list tab focus */
  activeTemplateId?: string | null
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
  showDisplayControls = true,
  customOnlyMode = false,
  activeTemplateId = null,
}: SkinsTabProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [savedScrollTop, setSavedScrollTop] = useState<number>(0)
  const [lastChangedSkinId, setLastChangedSkinId] = useState<string | null>(null)
  const [activeListTab, setActiveListTab] = useState("common")

  const customEntriesLabel = (skins: Skin[]) => {
    if (skins.length === 0) return "Custom"
    const category = skins[0]?.rarity
    const sharedCategory =
      category &&
      category !== "Custom" &&
      skins.every((skin) => skin.rarity === category)
    if (sharedCategory) {
      return `${category} (${skins.length})`
    }
    return `Custom (${skins.length})`
  }

  const preferredListTab = useMemo(() => {
    if (customOnlyMode && customSkins.length > 0) return "custom"
    if (selectedRarity !== "all") return selectedRarity.toLowerCase()
    return null
  }, [customOnlyMode, customSkins.length, selectedRarity])

  const rarityKeys = useMemo(() => {
    if (customOnlyMode) return []
    return selectedRarity === "all"
      ? Object.keys(fortniteSkins)
      : Object.keys(fortniteSkins).filter(
          (key) => key.toLowerCase() === selectedRarity.toLowerCase(),
        )
  }, [selectedRarity, customOnlyMode])

  const listTabGroups = useMemo(() => {
    if (customOnlyMode && customSkins.length > 0) {
      return [
        {
          id: "custom",
          label: customEntriesLabel(customSkins),
          skins: customSkins,
          isCustom: true,
        },
      ]
    }

    const groups: { id: string; label: string; skins: Skin[]; isCustom?: boolean }[] = []
    for (const rarityKey of rarityKeys) {
      const skins = fortniteSkins[rarityKey as keyof typeof fortniteSkins] || []
      if (skins.length > 0) {
        const label = rarityKey.charAt(0).toUpperCase() + rarityKey.slice(1)
        groups.push({
          id: rarityKey,
          label: `${label} (${skins.length})`,
          skins,
        })
      }
    }
    if (customSkins.length > 0) {
      groups.push({
        id: "custom",
        label: customEntriesLabel(customSkins),
        skins: customSkins,
        isCustom: true,
      })
    }
    return groups
  }, [rarityKeys, customSkins, customOnlyMode])

  useEffect(() => {
    if (listTabGroups.length === 0) return
    if (preferredListTab && listTabGroups.some((group) => group.id === preferredListTab)) {
      setActiveListTab(preferredListTab)
      return
    }
    if (!listTabGroups.some((group) => group.id === activeListTab)) {
      setActiveListTab(listTabGroups[0].id)
    }
  }, [listTabGroups, preferredListTab, activeTemplateId, activeListTab])
  
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

  const renderSkinRow = (skin: Skin, isCustom = false) => (
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
        className={`flex cursor-pointer items-center space-x-2 ${
          actionMode === "manual" ? "rounded p-1 hover:bg-blue-50" : ""
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
      <div className="ml-auto flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onPreviewSkin?.(skin)} title="Preview">
          <Eye className="h-3 w-3" />
        </Button>
        {!isCustom && onEnhancedDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEnhancedDetails(skin)}
            title="Enhanced Details"
            className="text-purple-500 hover:text-purple-700"
          >
            <Info className="h-3 w-3" />
          </Button>
        )}
        {addToFavorites && removeFromFavorites && isFavorite && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              isFavorite(skin.id) ? removeFromFavorites(skin.id) : addToFavorites(skin)
            }
            title={isFavorite(skin.id) ? "Remove from favorites" : "Add to favorites"}
            className={
              isFavorite(skin.id) ? "text-red-500 hover:text-red-700" : "text-gray-400 hover:text-red-500"
            }
          >
            <Heart className={`h-3 w-3 ${isFavorite(skin.id) ? "fill-current" : ""}`} />
          </Button>
        )}
        {addToComparison && removeFromComparison && isInComparison && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              isInComparison(skin.id) ? removeFromComparison(skin.id) : addToComparison(skin)
            }
            title={isInComparison(skin.id) ? "Remove from comparison" : "Add to comparison"}
            disabled={!isInComparison(skin.id) && comparisonSkins.length >= 4}
            className={
              isInComparison(skin.id) ? "text-blue-500 hover:text-blue-700" : "text-gray-400 hover:text-blue-500"
            }
          >
            {isInComparison(skin.id) ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          </Button>
        )}
        {isCustom && onDeleteCustomSkin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteCustomSkin(skin.id)}
            title="Delete Custom Skin"
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )

  const renderSkinsList = () => {
    if (listTabGroups.length === 0) {
      return <p className="text-sm text-gray-500">No skins in this filter.</p>
    }

    if (listTabGroups.length === 1) {
      const group = listTabGroups[0]
      return (
        <div ref={scrollContainerRef} className="max-h-64 space-y-2 overflow-y-auto">
          {group.skins.map((skin) => renderSkinRow(skin, group.isCustom))}
        </div>
      )
    }

    return (
      <Tabs value={activeListTab} onValueChange={setActiveListTab} className="w-full">
        <TabsList className="mb-2 flex h-auto w-full flex-wrap justify-start gap-1 bg-slate-100 p-1">
          {listTabGroups.map((group) => {
            const icon =
              group.id === "custom"
                ? "🎮"
                : rarityIcons[group.id as keyof typeof rarityIcons]
            const color =
              group.id === "custom"
                ? "#8B5CF6"
                : rarityColors[group.id as keyof typeof rarityColors]
            return (
              <TabsTrigger
                key={group.id}
                value={group.id}
                className="shrink-0 px-2 py-1 text-xs data-[state=active]:bg-white"
              >
                <span className="mr-1" style={{ color }}>
                  {icon}
                </span>
                {group.label}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {listTabGroups.map((group) => (
          <TabsContent
            key={group.id}
            value={group.id}
            ref={group.id === activeListTab ? scrollContainerRef : undefined}
            className="mt-0 max-h-64 space-y-2 overflow-y-auto"
          >
            {group.skins.map((skin) => renderSkinRow(skin, group.isCustom))}
          </TabsContent>
        ))}
      </Tabs>
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

          {/* Rarity Selection — catalog skins only */}
          {!customOnlyMode && (
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block text-gray-800">Select Rarity & Filter Skins:</Label>
            <div key={`rarity-buttons-${selectedRarity}`} className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedRarity === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => onRarityChange?.("all")}
                className={`text-xs ${selectedRarity === "all" ? "bg-gray-800 text-white" : "bg-white text-gray-700"}`}
              >
                All Skins
              </Button>
              {Object.keys(rarityColors).map((rarity) => {
                const isSelected = selectedRarity === rarity
                return (
                  <Button
                    key={`${rarity}-${selectedRarity}`}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => onRarityChange?.(rarity as RarityFilter)}
                    className={`text-xs ${isSelected ? "text-white" : "bg-white text-gray-700"}`}
                    style={{
                      backgroundColor:
                        isSelected ? rarityColors[rarity as keyof typeof rarityColors] : undefined,
                      borderColor: rarityColors[rarity as keyof typeof rarityColors],
                    }}
                  >
                    {rarityIcons[rarity as keyof typeof rarityIcons]} {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </Button>
                )
              })}
            </div>
          </div>
          )}

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
          <div>{renderSkinsList()}</div>

        </CardContent>
      </Card>

      {/* Display Mode Controls - Moved outside the card container */}
      {showDisplayControls && (
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
      )}
    </div>
  )
}
