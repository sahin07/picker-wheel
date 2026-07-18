"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, GitCompare, X } from "lucide-react"
import type { Pokemon } from "@/types/pokemon-types"
import { typeColors } from "@/constants/type-config"

interface PokemonPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  pokemon: Pokemon | null
  isFavorite?: boolean
  isInComparison?: boolean
  onAddToFavorites?: (pokemon: Pokemon) => void
  onRemoveFromFavorites?: (pokemonId: string) => void
  onAddToComparison?: (pokemon: Pokemon) => void
  onRemoveFromComparison?: (pokemonId: string) => void
  comparisonCount?: number
}

export default function PokemonPreviewModal({
  isOpen,
  onClose,
  pokemon,
  isFavorite = false,
  isInComparison = false,
  onAddToFavorites,
  onRemoveFromFavorites,
  onAddToComparison,
  onRemoveFromComparison,
  comparisonCount = 0
}: PokemonPreviewModalProps) {
  if (!pokemon) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="text-4xl">{pokemon.emoji}</span>
            <span className="font-bold">{pokemon.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Pokemon Image Placeholder */}
          <div className="flex justify-center">
            <div className="w-40 h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-6xl shadow-sm border">
              {pokemon.emoji}
            </div>
          </div>

          {/* Pokemon Details */}
          <div className="space-y-4">
            {/* Types */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Types</h4>
              <div className="flex flex-wrap gap-2">
                {pokemon.type.map((type) => (
                  <Badge
                    key={type}
                    className="text-sm px-3 py-1 font-medium"
                    style={{ backgroundColor: typeColors[type as keyof typeof typeColors] }}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Generation & Region */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Generation</h4>
                <p className="text-sm text-gray-600 capitalize font-medium">
                  {pokemon.generation.replace('gen', 'Generation ')}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Region</h4>
                <p className="text-sm text-gray-600 font-medium">{pokemon.region}</p>
              </div>
            </div>

            {/* Special Properties */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Properties</h4>
              <div className="flex flex-wrap gap-2">
                {pokemon.isLegendary && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    ⭐ Legendary
                  </Badge>
                )}
                {pokemon.isStarter && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    🌱 Starter
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                  {pokemon.popularity} Popularity
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
            {onAddToFavorites && onRemoveFromFavorites && (
              <Button
                variant={isFavorite ? "destructive" : "outline"}
                size="sm"
                onClick={() => isFavorite ? onRemoveFromFavorites(pokemon.id) : onAddToFavorites(pokemon)}
                className="w-full justify-start"
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            )}
            
            {onAddToComparison && onRemoveFromComparison && (
              <Button
                variant={isInComparison ? "destructive" : "outline"}
                size="sm"
                onClick={() => isInComparison ? onRemoveFromComparison(pokemon.id) : onAddToComparison(pokemon)}
                disabled={!isInComparison && comparisonCount >= 4}
                className="w-full justify-start"
              >
                {isInComparison ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Remove from Comparison
                  </>
                ) : (
                  <>
                    <GitCompare className="w-4 h-4 mr-2" />
                    Add to Comparison
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="default" size="sm">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
