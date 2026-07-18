"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Star, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { useWheelManagerStore, FortniteWheelData } from "@/stores/wheel-manager-store"
import { rarityColors, rarityIcons } from "@/lib/rarity-config"
import { getEnhancedSkinInfo } from "@/data/enhanced-fortnite-skins"

interface FortniteComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FortniteComparisonModal({ isOpen, onClose }: FortniteComparisonModalProps) {
  // Subscribe to the current wheel using a Zustand selector
  const wheel = useWheelManagerStore(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  });
  const data = (wheel?.data as FortniteWheelData) ?? { comparisonSkins: [] }
  const { comparisonSkins } = data
  const { updateWheelData } = useWheelManagerStore()

  const removeFromComparison = (skinId: string) => {
    if (!wheel) return;
    updateWheelData("fortnite-wheel", wheel.id, {
      ...data,
      comparisonSkins: comparisonSkins.filter(s => s.id !== skinId)
    })
  }

  if (!comparisonSkins || comparisonSkins.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Skin Comparison</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎮</div>
            <p className="font-medium">No skins selected for comparison</p>
            <p className="text-sm">Add skins to the comparison list to see their stats side by side</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Skin Comparison ({comparisonSkins?.length || 0}/4)</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparisonSkins?.map((skin) => {
            const enhancedInfo = getEnhancedSkinInfo(skin.id)
            
            return (
              <div key={skin.id} className="bg-white border rounded-lg p-4 shadow-sm">
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
                    onClick={() => removeFromComparison(skin.id)}
                    className="text-gray-400 hover:text-red-500"
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

                {/* Enhanced Information */}
                {enhancedInfo && (
                  <>
                    {/* Popularity & Rating */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span>Popularity</span>
                        </div>
                        <span className="font-medium">{enhancedInfo.popularity}/100</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>Rating</span>
                        </div>
                        <span className="font-medium">{enhancedInfo.communityRating.toFixed(1)}/5</span>
                      </div>
                    </div>

                    {/* Price & Release */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3 text-green-500" />
                          <span>Price</span>
                        </div>
                        <span className="font-medium">
                          {enhancedInfo.shopPrice > 0 ? `${enhancedInfo.shopPrice} V-Bucks` : 'Free'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-blue-500" />
                          <span>Released</span>
                        </div>
                        <span className="font-medium">{enhancedInfo.releaseDate}</span>
                      </div>
                    </div>

                    {/* Usage Rate */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Usage Rate</span>
                        <span className="font-medium">{enhancedInfo.usageRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${enhancedInfo.usageRate}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Special Properties */}
                    <div className="space-y-1 mb-3">
                      {enhancedInfo.isOG && (
                        <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          ⚡ OG Skin
                        </div>
                      )}
                      {enhancedInfo.isSweaty && (
                        <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          🔥 Popular with Sweats
                        </div>
                      )}
                      {enhancedInfo.isLimited && (
                        <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          ⏰ Limited Availability
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {enhancedInfo.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}

                {/* Fallback Description */}
                {!enhancedInfo && (
                  <div className="text-xs text-gray-600 mb-2">
                    {skin.description || "A legendary Fortnite skin"}
                  </div>
                )}

                {/* Collaboration Info */}
                {skin.collaboration && (
                  <div className="text-xs text-gray-600 mb-2">
                    Collaboration: {skin.collaboration}
                  </div>
                )}

                {/* Battle Pass Info */}
                {skin.battlePass && (
                  <div className="text-xs text-gray-600">
                    Battle Pass: {skin.battlePass}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
