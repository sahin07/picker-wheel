"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, X, Star, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { useWheelManagerStore, FortniteWheelData } from "@/stores/wheel-manager-store"
import { rarityColors, rarityIcons } from "@/lib/rarity-config"
import { getEnhancedSkinInfo } from "@/data/enhanced-fortnite-skins"

interface FortniteFavoritesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FortniteFavoritesModal({ isOpen, onClose }: FortniteFavoritesModalProps) {
  // Subscribe to the current wheel using a Zustand selector
  const wheel = useWheelManagerStore(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  });
  const data = (wheel?.data as FortniteWheelData) ?? { favoriteSkins: [] }
  const { favoriteSkins } = data
  const { updateWheelData } = useWheelManagerStore()

  const removeFromFavorites = (skinId: string) => {
    if (!wheel) return;
    updateWheelData("fortnite-wheel", wheel.id, {
      ...data,
      favoriteSkins: favoriteSkins.filter(s => s.id !== skinId)
    })
  }

  if (!favoriteSkins || favoriteSkins.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Favorite Skins</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎮</div>
            <p className="font-medium">No favorite skins yet</p>
            <p className="text-sm">Click the heart icon next to skins to add them to your favorites</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Favorite Skins ({favoriteSkins?.length || 0})</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteSkins?.map((skin) => (
            <div key={skin.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{skin.emoji}</span>
                  <div>
                    <div className="font-semibold text-sm">{skin.name}</div>
                    <div className="text-xs text-gray-500">{skin.season}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromFavorites(skin.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Rarity */}
              <div className="mb-3">
                <Badge
                  style={{
                    backgroundColor: rarityColors[skin.rarity.toLowerCase() as keyof typeof rarityColors],
                  }}
                  className="text-white text-xs"
                >
                  {rarityIcons[skin.rarity.toLowerCase() as keyof typeof rarityIcons]} {skin.rarity}
                </Badge>
              </div>

              {/* Season */}
              <div className="bg-blue-50 rounded p-2 mb-3">
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-600">{skin.season}</div>
                  <div className="text-xs text-gray-600">Season</div>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-gray-600 mb-2">
                {skin.description || "A legendary Fortnite skin"}
              </div>

              {/* Collaboration Info */}
              {skin.collaboration && (
                <div className="text-xs text-gray-600 mb-2">
                  Collaboration: {skin.collaboration}
                </div>
              )}

              {/* Battle Pass Info */}
              {skin.battlePass && (
                <div className="text-xs text-gray-600 mb-2">
                  Battle Pass: {skin.battlePass}
                </div>
              )}

              {/* Enhanced Details */}
              {(() => {
                const enhancedInfo = getEnhancedSkinInfo(skin.id)
                if (enhancedInfo) {
                  return (
                    <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                      {/* Popularity & Rating */}
                      <div className="flex items-center justify-between text-xs">
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
                      
                      {/* Rating */}
                      <div className="flex items-center justify-between text-xs">
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

                      {/* Price Range */}
                      {enhancedInfo.priceRange && (
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 text-green-500" />
                            <span>Price</span>
                          </div>
                          <span className="text-xs text-gray-600">{enhancedInfo.priceRange}</span>
                        </div>
                      )}

                      {/* Release Date */}
                      {enhancedInfo.releaseDate && (
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-blue-500" />
                            <span>Released</span>
                          </div>
                          <span className="text-xs text-gray-600">{enhancedInfo.releaseDate}</span>
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              })()}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
