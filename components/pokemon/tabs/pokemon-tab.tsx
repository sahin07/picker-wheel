"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, List, X, Heart, GitCompare, Plus, RotateCcw, Shuffle, MoreHorizontal, Info } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { pokemonData } from "@/data/pokemon-data"
import { generationColors, generationNames, typeColors } from "@/constants/type-config"
import type { Pokemon, DisplayMode, GenerationFilter } from "@/types/pokemon-types"

interface PokemonTabProps {
  selectedGeneration: GenerationFilter
  selectedPokemon: string[]
  displayMode: DisplayMode
  showTitle: boolean
  customPokemon?: Pokemon[]
  onGenerationChange: (generation: GenerationFilter) => void
  onPokemonToggle: (pokemonId: string) => void
  onClearAll: () => void
  onDisplayModeChange: (mode: DisplayMode) => void
  onShowTitleToggle: () => void
  onPreviewPokemon: (pokemon: Pokemon) => void
  onDeleteCustomPokemon?: (pokemonId: string) => void
  getGenerationCount: () => { selected: number; available: number }
  // New functionality props (like Fortnite)
  onShufflePokemon?: () => void
  onSortPokemonAZ?: () => void
  onAddRandomPokemon?: () => void
  // Enhanced Details prop
  onEnhancedDetails?: (pokemon: Pokemon) => void
  // Manual selection prop
  onManualSelect?: (pokemon: Pokemon) => void
  actionMode?: "normal" | "elimination" | "manual"
  // Favorites and Comparison props
  onOpenFavorites?: () => void
  onOpenComparison?: () => void
  addToFavorites?: (pokemon: Pokemon) => void
  removeFromFavorites?: (pokemonId: string) => void
  isFavorite?: (pokemonId: string) => boolean
  addToComparison?: (pokemon: Pokemon) => void
  removeFromComparison?: (pokemonId: string) => void
  isInComparison?: (pokemonId: string) => boolean
  favoritePokemon?: Pokemon[]
  comparisonPokemon?: Pokemon[]
}

export function PokemonTab({
  selectedGeneration,
  selectedPokemon,
  displayMode,
  showTitle,
  customPokemon = [],
  onGenerationChange,
  onPokemonToggle,
  onClearAll,
  onDisplayModeChange,
  onShowTitleToggle,
  onPreviewPokemon,
  onDeleteCustomPokemon,
  getGenerationCount,
  // New functionality props (like Fortnite)
  onShufflePokemon,
  onSortPokemonAZ,
  onAddRandomPokemon,
  // Enhanced Details prop
  onEnhancedDetails,
  // Manual selection prop
  onManualSelect,
  actionMode = "normal",
  // Favorites and Comparison props
  onOpenFavorites,
  onOpenComparison,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  addToComparison,
  removeFromComparison,
  isInComparison,
  favoritePokemon = [],
  comparisonPokemon = [],
}: PokemonTabProps) {
  const renderPokemonList = () => {
    const generations = selectedGeneration === "all" ? Object.keys(pokemonData) : [selectedGeneration]

    return (
      <div className="space-y-4">
        {/* Regular Pokemon Sections */}
        {generations.map((generationKey) => {
          const pokemon = pokemonData[generationKey as keyof typeof pokemonData] || []
          const generationColor = generationColors[generationKey as keyof typeof generationColors]
          const generationName = generationNames[generationKey as keyof typeof generationNames]

          return (
            <div key={generationKey}>
              <h4 className="font-semibold text-sm mb-2 capitalize flex items-center gap-2 text-gray-800">
                <span style={{ color: generationColor }}>●</span>
                {generationName} ({pokemon.length})
              </h4>
              <div className="space-y-2">
                {pokemon.map((poke) => (
                  <div key={poke.id} className="flex items-center space-x-2">
                                         <Checkbox
                       id={poke.id}
                       checked={selectedPokemon.includes(poke.id)}
                       onCheckedChange={() => onPokemonToggle(poke.id)}
                     />
                                         <Label 
                       htmlFor={poke.id} 
                       className={`flex items-center space-x-2 cursor-pointer ${
                         actionMode === "manual" ? "hover:bg-blue-50 p-1 rounded" : ""
                       }`}
                       onClick={() => {
                         if (actionMode === "manual" && onManualSelect) {
                           onManualSelect(poke)
                         }
                       }}
                     >
                       <span className="text-lg">{poke.emoji}</span>
                       <div className="flex flex-col">
                         <span className="text-sm font-medium text-gray-800">{poke.name}</span>
                         <div className="flex items-center gap-1">
                           {poke.type.map((type) => (
                             <span
                               key={type}
                               className="text-xs px-1 rounded text-white"
                               style={{ backgroundColor: typeColors[type as keyof typeof typeColors] }}
                             >
                               {type}
                             </span>
                           ))}
                           {poke.isLegendary && <span className="text-xs text-yellow-600">⭐</span>}
                           {poke.isStarter && <span className="text-xs text-green-600">🌱</span>}
                         </div>
                       </div>
                     </Label>
                                         <div className="flex items-center space-x-1 ml-auto">
                       <Button variant="ghost" size="sm" onClick={() => onPreviewPokemon(poke)} title="Preview">
                         <Eye className="w-3 h-3" />
                       </Button>
                       {onEnhancedDetails && (
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           onClick={() => onEnhancedDetails(poke)} 
                           title="Enhanced Details"
                           className="text-purple-500 hover:text-purple-700"
                         >
                           <Info className="w-3 h-3" />
                         </Button>
                       )}
                       {addToFavorites && removeFromFavorites && isFavorite && (
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => isFavorite(poke.id) ? removeFromFavorites(poke.id) : addToFavorites(poke)}
                           title={isFavorite(poke.id) ? "Remove from favorites" : "Add to favorites"}
                           className={isFavorite(poke.id) ? "text-red-500 hover:text-red-700" : "text-gray-400 hover:text-red-500"}
                         >
                           <Heart className={`w-3 h-3 ${isFavorite(poke.id) ? "fill-current" : ""}`} />
                         </Button>
                       )}
                                                                       <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            console.log('Comparison button clicked for:', poke.name)
                            console.log('isInComparison:', isInComparison?.(poke.id))
                            console.log('addToComparison exists:', !!addToComparison)
                            console.log('removeFromComparison exists:', !!removeFromComparison)
                            if (isInComparison?.(poke.id)) {
                              removeFromComparison?.(poke.id)
                            } else {
                              addToComparison?.(poke)
                            }
                          }}
                          title={isInComparison?.(poke.id) ? "Remove from comparison" : "Add to comparison"}
                                                      disabled={!isInComparison?.(poke.id) && comparisonPokemon.length >= 8}
                          className={isInComparison?.(poke.id) ? "text-blue-500 hover:text-blue-700" : "text-gray-400 hover:text-blue-500"}
                        >
                          {isInComparison?.(poke.id) ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </Button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Custom Pokemon Card */}
      {customPokemon && customPokemon.length > 0 && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <span className="text-purple-600">🎨</span>
              Custom Pokemon ({customPokemon.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {customPokemon.map((poke) => (
                <div
                  key={poke.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                                         <Checkbox
                       id={`custom-${poke.id}`}
                       checked={selectedPokemon.includes(poke.id)}
                       onCheckedChange={() => onPokemonToggle(poke.id)}
                     />
                    <span className="text-2xl">🎮</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{poke.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          Common
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Custom
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreviewPokemon(poke)}
                      className="h-8 w-8 p-0 hover:bg-gray-200"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteCustomPokemon?.(poke.id)}
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

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-800">POKEMON</h3>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {getGenerationCount().selected}
              </Badge>
              {/* Favorites and Comparison Buttons */}
              {onOpenFavorites && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${favoritePokemon.length > 0 ? "text-red-500" : "text-gray-400"}`}
                  onClick={onOpenFavorites}
                  title="Favorites"
                >
                  <Heart className="w-4 h-4" />
                  {favoritePokemon.length > 0 && <span className="ml-1 text-xs">{favoritePokemon.length}</span>}
                </Button>
              )}
              {onOpenComparison && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${comparisonPokemon.length > 0 ? "text-blue-500" : "text-gray-400"}`}
                  onClick={onOpenComparison}
                  title="Comparison"
                >
                  <GitCompare className="w-4 h-4" />
                  {comparisonPokemon.length > 0 && <span className="ml-1 text-xs">{comparisonPokemon.length}</span>}
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Input Control Buttons (like Fortnite wheel) */}
              <Button 
                variant="ghost" 
                size="sm" 
                title="Preview All Wheel Pokemon" 
                onClick={() => {
                  console.log('Preview button clicked')
                  // Call the parent's preview all function
                  if (onPreviewPokemon) {
                    // Pass undefined to indicate preview all (like Fortnite)
                    onPreviewPokemon(undefined as any)
                  }
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
              {onShufflePokemon && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    console.log('Shuffle button clicked')
                    onShufflePokemon()
                  }} 
                  title="Shuffle"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
              {onAddRandomPokemon && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="Add Random Pokemon" 
                  onClick={() => {
                    console.log('Add Random Pokemon button clicked')
                    onAddRandomPokemon()
                  }}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              )}
              {onSortPokemonAZ && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem 
                      onClick={() => {
                        console.log('Sort A-Z button clicked')
                        onSortPokemonAZ()
                      }}
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Sort A-Z
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Generation Selection */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block text-gray-800">Select Generation & Filter Pokemon:</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedGeneration === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => onGenerationChange("all")}
                className="text-xs"
              >
                All Pokemon
              </Button>
              {Object.keys(generationColors).map((generation) => (
                <Button
                  key={generation}
                  variant={selectedGeneration === generation ? "default" : "outline"}
                  size="sm"
                  onClick={() => onGenerationChange(generation as GenerationFilter)}
                  className="text-xs"
                  style={{
                    backgroundColor:
                      selectedGeneration === generation
                        ? generationColors[generation as keyof typeof generationColors]
                        : undefined,
                  }}
                >
                  {generation.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Pokemon Count and Clear */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              {getGenerationCount().selected} selected of {getGenerationCount().available} Pokemon
            </span>
            <Button variant="ghost" size="sm" onClick={onClearAll} className="text-red-600">
              Clear All
            </Button>
          </div>

          {/* Pokemon List */}
          <div className="max-h-64 overflow-y-auto mb-4">{renderPokemonList()}</div>

          <Separator className="my-4" />

          {/* Display Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-800">Show:</Label>
            <RadioGroup value={displayMode} onValueChange={(value) => onDisplayModeChange(value as DisplayMode)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emoji-name" id="emoji-name" />
                <Label htmlFor="emoji-name" className="text-gray-700">
                  Emoji & Name
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emoji" id="emoji" />
                <Label htmlFor="emoji" className="text-gray-700">
                  Emoji Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="name" />
                <Label htmlFor="name" className="text-gray-700">
                  Name Only
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
