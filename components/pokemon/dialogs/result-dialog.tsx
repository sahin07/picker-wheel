import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Copy, Star, TrendingUp, Calendar, Users, RotateCcw } from "lucide-react"
import { typeColors } from "@/constants/type-config"
import type { SpinResult } from "@/types/pokemon-types"

interface ResultDialogProps {
  results: SpinResult[]
  onClose: () => void
  open: boolean
  wheelName?: string
}

export function ResultDialog({ results, onClose, open, wheelName }: ResultDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800 flex items-center gap-2">
            📊 Spin Results ({results.length} spins)
            {wheelName && (
              <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700">
                🎯 {wheelName}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        {results.length > 0 ? (
          <div className="space-y-4">
            {/* Results List */}
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                  {/* Main Result Row */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-2xl">{result.pokemon.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {result.pokemon.name}
                        {(result as any).wheelName && (
                          <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700">
                            {(result as any).wheelName}
                          </Badge>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {result.pokemon.type.map((type) => (
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
                        <Badge variant="outline" className="text-gray-600 text-xs">
                          {result.pokemon.generation === "gen1" ? "Gen 1" : 
                           result.pokemon.generation === "gen2" ? "Gen 2" :
                           result.pokemon.generation === "gen3" ? "Gen 3" :
                           result.pokemon.generation === "gen4" ? "Gen 4" :
                           result.pokemon.generation === "gen5" ? "Gen 5" :
                           result.pokemon.generation === "gen6" ? "Gen 6" :
                           result.pokemon.generation === "gen7" ? "Gen 7" :
                           result.pokemon.generation === "gen8" ? "Gen 8" : result.pokemon.generation}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      #{results.length - index}
                    </div>
                  </div>

                  {/* Pokemon Details */}
                  <div className="space-y-2 pt-3 border-t border-gray-200">
                    {/* Special Properties */}
                    <div className="flex items-center gap-2">
                      {result.pokemon.isLegendary && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
                          ⭐ Legendary
                        </Badge>
                      )}
                      {result.pokemon.isStarter && (
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          🌱 Starter
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-gray-600 text-xs">
                        {result.pokemon.region}
                      </Badge>
                    </div>

                    {/* Popularity & Rating */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span>Popularity</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {result.pokemon.popularity === "high" && (
                            <>
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            </>
                          )}
                          {result.pokemon.popularity === "medium" && (
                            <>
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <Star className="w-3 h-3 text-gray-300" />
                              <Star className="w-3 h-3 text-gray-300" />
                            </>
                          )}
                          {result.pokemon.popularity === "low" && (
                            <>
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <Star className="w-3 h-3 text-gray-300" />
                              <Star className="w-3 h-3 text-gray-300" />
                              <Star className="w-3 h-3 text-gray-300" />
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-blue-500" />
                          <span>Spin Time</span>
                        </div>
                        <span className="text-xs text-gray-600">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {/* Type Effectiveness (if available) */}
                    {result.pokemon.type.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Types: </span>
                        {result.pokemon.type.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spins:</span>
                  <span className="font-medium">{results.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unique Pokemon:</span>
                  <span className="font-medium">{new Set(results.map(r => r.pokemon.id)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Legendary Pokemon:</span>
                  <span className="font-medium">{results.filter(r => r.pokemon.isLegendary).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Starter Pokemon:</span>
                  <span className="font-medium">{results.filter(r => r.pokemon.isStarter).length}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const text = results.map((result, index) => 
                    `${index + 1}. ${result.pokemon.name} (${result.pokemon.type.join(", ")}) - ${new Date(result.timestamp).toLocaleString()}`
                  ).join('\n')
                  navigator.clipboard.writeText(text)
                }}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Results
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const text = `Pokemon Picker Wheel Results:\n${results.map((result, index) => 
                    `${index + 1}. ${result.pokemon.name}`
                  ).join('\n')}`
                  navigator.clipboard.writeText(text)
                }}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <RotateCcw className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No results yet. Spin the wheel to see results here!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
