"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Star, Trash2, Plus } from "lucide-react"
import { typeColors } from "@/constants/type-config"
import type { Pokemon } from "@/types/pokemon-types"

interface PokemonFavoritesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  favoritePokemon: Pokemon[]
  onAddFavorite: (pokemon: Pokemon) => void
  onRemoveFavorite: (pokemonId: string) => void
  getAllPokemon: () => Pokemon[]
}

export default function PokemonFavoritesModal({
  open,
  onOpenChange,
  favoritePokemon,
  onAddFavorite,
  onRemoveFavorite,
  getAllPokemon,
}: PokemonFavoritesModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddSection, setShowAddSection] = useState(false)

  const filteredPokemon = getAllPokemon().filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pokemon.type.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    pokemon.generation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddToFavorites = (pokemon: Pokemon) => {
    if (!favoritePokemon.find(fav => fav.id === pokemon.id)) {
      onAddFavorite(pokemon)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Pokemon Favorites ({favoritePokemon.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Favorites */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Your Favorites</h3>
            {favoritePokemon.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {favoritePokemon.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{pokemon.emoji}</span>
                        <span className="font-medium text-gray-800">{pokemon.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFavorite(pokemon.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {pokemon.type.map((type) => (
                        <Badge
                          key={type}
                          style={{
                            backgroundColor: typeColors[type as keyof typeof typeColors] || '#666',
                          }}
                          className="text-white text-xs"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{pokemon.generation === "gen1" ? "Gen 1" : 
                            pokemon.generation === "gen2" ? "Gen 2" :
                            pokemon.generation === "gen3" ? "Gen 3" :
                            pokemon.generation === "gen4" ? "Gen 4" :
                            pokemon.generation === "gen5" ? "Gen 5" :
                            pokemon.generation === "gen6" ? "Gen 6" :
                            pokemon.generation === "gen7" ? "Gen 7" :
                            pokemon.generation === "gen8" ? "Gen 8" : pokemon.generation}</span>
                      <span>•</span>
                      <span>{pokemon.region}</span>
                      {pokemon.isLegendary && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-600">⭐ Legendary</span>
                        </>
                      )}
                      {pokemon.isStarter && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">🌱 Starter</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No favorite Pokemon yet. Add some Pokemon to your favorites!</p>
              </div>
            )}
          </div>

          {/* Add New Favorites */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Add to Favorites</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddSection(!showAddSection)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {showAddSection ? "Hide" : "Show"}
              </Button>
            </div>

            {showAddSection && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search Pokemon by name, type, or generation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                  {filteredPokemon
                    .filter((pokemon) => !favoritePokemon.find(fav => fav.id === pokemon.id))
                    .slice(0, 30)
                    .map((pokemon) => (
                      <div
                        key={pokemon.id}
                        className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAddToFavorites(pokemon)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{pokemon.emoji}</span>
                          <span className="font-medium text-gray-800">{pokemon.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {pokemon.type.map((type) => (
                            <Badge
                              key={type}
                              style={{
                                backgroundColor: typeColors[type as keyof typeof typeColors] || '#666',
                              }}
                              className="text-white text-xs"
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>{pokemon.generation === "gen1" ? "Gen 1" : 
                                pokemon.generation === "gen2" ? "Gen 2" :
                                pokemon.generation === "gen3" ? "Gen 3" :
                                pokemon.generation === "gen4" ? "Gen 4" :
                                pokemon.generation === "gen5" ? "Gen 5" :
                                pokemon.generation === "gen6" ? "Gen 6" :
                                pokemon.generation === "gen7" ? "Gen 7" :
                                pokemon.generation === "gen8" ? "Gen 8" : pokemon.generation}</span>
                          <span>•</span>
                          <span>{pokemon.region}</span>
                          {pokemon.isLegendary && (
                            <>
                              <span>•</span>
                              <span className="text-yellow-600">⭐</span>
                            </>
                          )}
                          {pokemon.isStarter && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">🌱</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {filteredPokemon.filter((pokemon) => !favoritePokemon.find(fav => fav.id === pokemon.id)).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>All Pokemon are already in your favorites!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
