"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { typeColors } from "@/constants/type-config"
import type { Pokemon } from "@/types/pokemon-types"

interface PokemonMultiPreviewDialogProps {
  pokemon: Pokemon[]
  isOpen: boolean
  onClose: () => void
}

export function PokemonMultiPreviewDialog({ pokemon, isOpen, onClose }: PokemonMultiPreviewDialogProps) {
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎯 Wheel Preview
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {pokemon.length} Pokemon
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            These are all the Pokemon currently on your wheel:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pokemon.map((poke, index) => (
              <div 
                key={poke.id} 
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{poke.emoji}</span>
                  <div className="flex items-center gap-1">
                    {poke.isLegendary && <span className="text-xs text-yellow-600">⭐</span>}
                    {poke.isStarter && <span className="text-xs text-green-600">🌱</span>}
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">
                  {poke.name}
                </h4>
                <div className="flex items-center gap-1 mb-2">
                  {poke.type.map((type) => (
                    <span
                      key={type}
                      className="text-xs px-1 rounded text-white"
                      style={{ backgroundColor: typeColors[type as keyof typeof typeColors] }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {poke.region} • {poke.generation}
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  Position: {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          {pokemon.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎯</div>
              <p>No Pokemon selected for the wheel</p>
              <p className="text-sm">Select some Pokemon to see them here</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
