import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart3 } from "lucide-react"
import { typeColors } from "@/constants/type-config"
import type { Pokemon, SpinResult } from "@/types/pokemon-types"

interface StatsTabProps {
  pokemonStats?: Record<string, number>
  allResults?: SpinResult[]
  getAllPokemon?: () => Pokemon[]
}

export function StatsTab({ 
  pokemonStats = {}, 
  allResults = [], 
  getAllPokemon = () => [] 
}: StatsTabProps) {
  const getTypeStats = () => {
    const allPokemon = getAllPokemon()
    const typeCounts: Record<string, number> = {}
    
    allPokemon.forEach(pokemon => {
      pokemon.type.forEach(type => {
        typeCounts[type] = (typeCounts[type] || 0) + 1
      })
    })
    
    return typeCounts
  }

  const getGenerationStats = () => {
    const allPokemon = getAllPokemon()
    const genCounts: Record<string, number> = {}
    
    allPokemon.forEach(pokemon => {
      genCounts[pokemon.generation] = (genCounts[pokemon.generation] || 0) + 1
    })
    
    return genCounts
  }

  const getSpecialStats = () => {
    const allPokemon = getAllPokemon()
    return {
      legendary: allPokemon.filter(p => p.isLegendary).length,
      starter: allPokemon.filter(p => p.isStarter).length,
      highPopularity: allPokemon.filter(p => p.popularity === "high").length,
      mediumPopularity: allPokemon.filter(p => p.popularity === "medium").length,
      lowPopularity: allPokemon.filter(p => p.popularity === "low").length,
    }
  }

  const getRegionStats = () => {
    const allPokemon = getAllPokemon()
    const regionCounts: Record<string, number> = {}
    
    allPokemon.forEach(pokemon => {
      regionCounts[pokemon.region] = (regionCounts[pokemon.region] || 0) + 1
    })
    
    return regionCounts
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <BarChart3 className="w-5 h-5" />
          Pokemon Collection Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generation Distribution */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800">Generation Distribution</h4>
          <div className="space-y-2">
            {Object.entries(getGenerationStats()).map(([generation, count]) => (
              <div key={generation} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm capitalize text-gray-700">
                    {generation === "gen1" ? "Gen 1" : 
                     generation === "gen2" ? "Gen 2" :
                     generation === "gen3" ? "Gen 3" :
                     generation === "gen4" ? "Gen 4" :
                     generation === "gen5" ? "Gen 5" :
                     generation === "gen6" ? "Gen 6" :
                     generation === "gen7" ? "Gen 7" :
                     generation === "gen8" ? "Gen 8" : generation}
                  </span>
                </div>
                <Badge variant="outline" className="text-gray-600">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Type Distribution */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800">Type Distribution</h4>
          <div className="space-y-2">
            {Object.entries(getTypeStats()).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: typeColors[type as keyof typeof typeColors] || '#666' }}
                  ></span>
                  <span className="text-sm capitalize text-gray-700">{type}</span>
                </div>
                <Badge variant="outline" className="text-gray-600">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Special Pokemon Stats */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800">Special Pokemon</h4>
          <div className="space-y-2">
            {(() => {
              const specialStats = getSpecialStats()
              return (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">⭐ Legendary</span>
                    <Badge variant="outline">{specialStats.legendary}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">🌱 Starter</span>
                    <Badge variant="outline">{specialStats.starter}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">🔥 High Popularity</span>
                    <Badge variant="outline">{specialStats.highPopularity}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">⚡ Medium Popularity</span>
                    <Badge variant="outline">{specialStats.mediumPopularity}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">💧 Low Popularity</span>
                    <Badge variant="outline">{specialStats.lowPopularity}</Badge>
                  </div>
                </>
              )
            })()}
          </div>
        </div>

        {/* Region Distribution */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800">Region Distribution</h4>
          <div className="space-y-2">
            {Object.entries(getRegionStats()).map(([region, count]) => (
              <div key={region} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{region}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Spin History */}
        <div>
          <h4 className="font-semibold text-sm mb-3 text-gray-800">Recent Activity</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Spins</span>
              <Badge variant="outline">{allResults.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Unique Pokemon Hit</span>
              <Badge variant="outline">{new Set(allResults.map((r) => r.pokemon.id)).size}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <Badge variant="outline">
                {allResults.length > 0
                  ? Math.round((new Set(allResults.map((r) => r.pokemon.id)).size / allResults.length) * 100)
                  : 0}
                %
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Legendary Pokemon Hit</span>
              <Badge variant="outline">
                {allResults.filter(r => r.pokemon.isLegendary).length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Starter Pokemon Hit</span>
              <Badge variant="outline">
                {allResults.filter(r => r.pokemon.isStarter).length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Most Common Types in Results */}
        {allResults.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3 text-gray-800">Most Common Types in Results</h4>
            <div className="space-y-2">
              {(() => {
                const typeResults: Record<string, number> = {}
                allResults.forEach(result => {
                  result.pokemon.type.forEach(type => {
                    typeResults[type] = (typeResults[type] || 0) + 1
                  })
                })
                
                const sortedTypes = Object.entries(typeResults)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                
                return sortedTypes.map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: typeColors[type as keyof typeof typeColors] || '#666' }}
                      ></span>
                      <span className="text-sm capitalize text-gray-700">{type}</span>
                    </div>
                    <Badge variant="outline" className="text-gray-600">
                      {count}
                    </Badge>
                  </div>
                ))
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
