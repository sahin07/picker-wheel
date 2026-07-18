"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Pokemon } from "@/types/pokemon-types"
import { typeColors } from "@/constants/type-config"

interface PokemonComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  comparisonPokemon?: Pokemon[]
  onRemoveFromComparison?: (pokemonId: string) => void
}

export default function PokemonComparisonModal({ 
  isOpen, 
  onClose, 
  comparisonPokemon = [],
  onRemoveFromComparison 
}: PokemonComparisonModalProps) {
  if (comparisonPokemon.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-blue-600">🔍</span>
              Pokemon Comparison
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-600">No Pokemon selected for comparison</p>
            <p className="text-sm text-gray-500 mt-2">
              Add Pokemon to comparison to see their stats side by side
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-blue-600">🔍</span>
            Pokemon Comparison ({comparisonPokemon.length}/4)
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparisonPokemon.map((pokemon) => (
            <Card key={pokemon.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{pokemon.emoji}</span>
                    <span className="text-sm">{pokemon.name}</span>
                  </CardTitle>
                  {onRemoveFromComparison && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFromComparison(pokemon.id)}
                      className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Types */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Types</h4>
                  <div className="flex flex-wrap gap-1">
                    {pokemon.type.map((type) => (
                      <Badge
                        key={type}
                        className="text-xs"
                        style={{ backgroundColor: typeColors[type as keyof typeof typeColors] }}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Generation */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Generation</h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {pokemon.generation.replace('gen', 'Generation ')}
                  </p>
                </div>

                {/* Region */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Region</h4>
                  <p className="text-sm text-gray-600">{pokemon.region}</p>
                </div>

                {/* Special Properties */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Properties</h4>
                  <div className="flex flex-wrap gap-1">
                    {pokemon.isLegendary && (
                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                        ⭐ Legendary
                      </Badge>
                    )}
                    {pokemon.isStarter && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        🌱 Starter
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                      {pokemon.popularity} Popularity
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
