import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Copy, Star, TrendingUp, Calendar, DollarSign, Users, RotateCcw } from "lucide-react"
import { rarityColors, rarityIcons } from "@/lib/rarity-config"
import type { SpinResult } from "@/types/fortnite-types"
import { getEnhancedSkinInfo } from "@/data/enhanced-fortnite-skins"

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
                    <div className="text-2xl">{result.skin.emoji}</div>
                                         <div className="flex-1">
                       <h4 className="font-semibold text-gray-800">
                         {result.skin.name}
                         {(result as any).wheelName && (
                           <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700">
                             {(result as any).wheelName}
                           </Badge>
                         )}
                       </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          style={{
                            backgroundColor: rarityColors[(result.skin.rarity || 'Common').toLowerCase() as keyof typeof rarityColors],
                          }}
                          className="text-white text-xs"
                        >
                          {rarityIcons[(result.skin.rarity || 'Common').toLowerCase() as keyof typeof rarityIcons]} {result.skin.rarity || 'Common'}
                        </Badge>
                        <Badge variant="outline" className="text-gray-600 text-xs">
                          {result.skin.season}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      #{results.length - index}
                    </div>
                  </div>

                  {/* Enhanced Details */}
                  {(() => {
                    const enhancedInfo = getEnhancedSkinInfo(result.skin.id)
                    if (enhancedInfo) {
                      return (
                        <div className="space-y-2 pt-3 border-t border-gray-200">
                          {/* Popularity & Rating */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3 text-green-500" />
                                <span>Popularity</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < enhancedInfo.popularity ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span>Rating</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < enhancedInfo.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                ))}
                                <span className="text-xs text-gray-600">({enhancedInfo.rating}/5)</span>
                              </div>
                            </div>
                          </div>

                          {/* Price & Release */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            {enhancedInfo.priceRange && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="w-3 h-3 text-green-500" />
                                  <span>Price</span>
                                </div>
                                <span className="text-xs text-gray-600">{enhancedInfo.priceRange}</span>
                              </div>
                            )}
                            
                            {enhancedInfo.releaseDate && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-blue-500" />
                                  <span>Released</span>
                                </div>
                                <span className="text-xs text-gray-600">{enhancedInfo.releaseDate}</span>
                              </div>
                            )}
                          </div>

                          {/* Special Properties */}
                          <div className="flex flex-wrap gap-1">
                            {enhancedInfo.isOG && (
                              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                                ⚡ OG
                              </Badge>
                            )}
                            {enhancedInfo.isSweaty && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                                🔥 Sweaty
                              </Badge>
                            )}
                            {enhancedInfo.isLimited && (
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                                ⏰ Limited
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">📊 Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Spins:</span>
                  <span className="font-semibold ml-2">{results.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Unique Skins:</span>
                  <span className="font-semibold ml-2">
                    {new Set(results.map(r => r.skin.id)).size}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Most Recent:</span>
                  <span className="font-semibold ml-2">{results[0]?.skin.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">First Spin:</span>
                  <span className="font-semibold ml-2">{results[results.length - 1]?.skin.name}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Results
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy Summary
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Spins Yet</h3>
            <p className="text-gray-600">Spin the wheel to see your results here!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
