"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Star, Calendar, DollarSign, Users, TrendingUp, Info, BookOpen, Zap, Shield, Heart } from "lucide-react"
import { EnhancedSkinInfo, getEnhancedSkinInfo } from "@/data/enhanced-fortnite-skins"
import { rarityColors, rarityIcons } from "@/lib/rarity-config"
import type { Skin } from "@/types/fortnite-types"

interface EnhancedSkinDetailsModalProps {
  skin: Skin | null
  isOpen: boolean
  onClose: () => void
}

export default function EnhancedSkinDetailsModal({ skin, isOpen, onClose }: EnhancedSkinDetailsModalProps) {
  if (!skin) return null

  // Get enhanced data if available
  const enhancedData = getEnhancedSkinInfo(skin.id)
  
  // If no enhanced data available, show basic information
  if (!enhancedData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <span className="text-3xl">{skin.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold">{skin.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    style={{ backgroundColor: rarityColors[skin.rarity.toLowerCase() as keyof typeof rarityColors] || "#6B7280" }}
                    className="text-white"
                  >
                    {rarityIcons[skin.rarity.toLowerCase() as keyof typeof rarityIcons] || "⭐"} {skin.rarity}
                  </Badge>
                  <Badge variant="outline">{skin.season}</Badge>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-4 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p className="font-medium">Enhanced information not available</p>
              <p className="text-sm">This skin doesn't have detailed statistics and information yet.</p>
            </div>
            
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Name</div>
                  <div className="text-sm text-gray-600">{skin.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Rarity</div>
                  <div className="text-sm text-gray-600">{skin.rarity}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Season</div>
                  <div className="text-sm text-gray-600">{skin.season}</div>
                </div>
                {skin.description && (
                  <div>
                    <div className="text-sm font-medium">Description</div>
                    <div className="text-sm text-gray-600">{skin.description}</div>
                  </div>
                )}
                {skin.collaboration && (
                  <div>
                    <div className="text-sm font-medium">Collaboration</div>
                    <div className="text-sm text-gray-600">{skin.collaboration}</div>
                  </div>
                )}
                {skin.battlePass && (
                  <div>
                    <div className="text-sm font-medium">Battle Pass</div>
                    <div className="text-sm text-gray-600">{skin.battlePass}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    if (dateString === "Always Available") return dateString
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRarityColor = (rarity: string) => {
    return rarityColors[rarity.toLowerCase() as keyof typeof rarityColors] || "#6B7280"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <span className="text-3xl">{enhancedData.emoji}</span>
            <div>
              <h2 className="text-2xl font-bold">{enhancedData.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  style={{ backgroundColor: getRarityColor(enhancedData.rarity) }}
                  className="text-white"
                >
                  {rarityIcons[enhancedData.rarity.toLowerCase() as keyof typeof rarityIcons]} {enhancedData.rarity}
                </Badge>
                <Badge variant="outline">{enhancedData.season}</Badge>
                {enhancedData.collaboration && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {enhancedData.collaboration}
                  </Badge>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Description</span>
                </CardTitle>
              </CardHeader>
                             <CardContent>
                 <p className="text-gray-700 mb-3">{enhancedData.description}</p>
                 <p className="text-gray-600 text-sm">{enhancedData.detailedDescription}</p>
               </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                                         <span className="text-sm font-medium">Popularity</span>
                     <span className="text-sm text-gray-600">{enhancedData.popularity}/100</span>
                   </div>
                   <Progress value={enhancedData.popularity} className="h-2" />
                 </div>
                 
                 <div>
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-medium">Usage Rate</span>
                     <span className="text-sm text-gray-600">{enhancedData.usageRate}%</span>
                   </div>
                   <Progress value={enhancedData.usageRate} className="h-2" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="text-center p-3 bg-blue-50 rounded-lg">
                     <div className="text-2xl font-bold text-blue-600">{enhancedData.rarityPercentage}%</div>
                     <div className="text-xs text-gray-600">Rarity</div>
                   </div>
                   <div className="text-center p-3 bg-green-50 rounded-lg">
                     <div className="text-2xl font-bold text-green-600">{enhancedData.shopAppearances}</div>
                     <div className="text-xs text-gray-600">Shop Appearances</div>
                   </div>
                 </div>
              </CardContent>
            </Card>

            {/* Community Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Community Rating</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex space-x-1">
                                         {renderStars(enhancedData.communityRating)}
                  </div>
                                     <span className="text-lg font-semibold">{enhancedData.communityRating.toFixed(1)}</span>
                   <span className="text-sm text-gray-600">({enhancedData.reviewCount.toLocaleString()} reviews)</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {enhancedData.tags.map((tag, index) => (
                     <Badge key={index} variant="outline" className="text-xs">
                       {tag}
                     </Badge>
                   ))}
                 </div>
              </CardContent>
            </Card>

            {/* Lore and Background */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Lore & Background</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                                     <h4 className="font-semibold mb-2">Lore</h4>
                   <p className="text-sm text-gray-700">{enhancedData.lore}</p>
                 </div>
                 <Separator />
                 <div>
                   <h4 className="font-semibold mb-2">Background</h4>
                   <p className="text-sm text-gray-700">{enhancedData.background}</p>
                 </div>
                 <Separator />
                 <div>
                   <h4 className="font-semibold mb-2">Trivia</h4>
                   <ul className="text-sm text-gray-700 space-y-1">
                     {enhancedData.trivia.map((fact, index) => (
                       <li key={index} className="flex items-start space-x-2">
                         <span className="text-blue-500 mt-1">•</span>
                         <span>{fact}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                                         <div className="text-sm font-medium">Release Date</div>
                     <div className="text-xs text-gray-600">{formatDate(enhancedData.releaseDate)}</div>
                   </div>
                 </div>
                 
                 <div className="flex items-center space-x-2">
                   <Calendar className="w-4 h-4 text-gray-500" />
                   <div>
                     <div className="text-sm font-medium">Last Seen</div>
                     <div className="text-xs text-gray-600">{enhancedData.lastSeenInShop}</div>
                   </div>
                 </div>

                 <div className="flex items-center space-x-2">
                   <DollarSign className="w-4 h-4 text-gray-500" />
                   <div>
                     <div className="text-sm font-medium">Price</div>
                     <div className="text-xs text-gray-600">
                       {enhancedData.shopPrice > 0 ? `${enhancedData.shopPrice} V-Bucks` : 'Free'}
                     </div>
                   </div>
                 </div>

                 {enhancedData.battlePassTier && (
                   <div className="flex items-center space-x-2">
                     <Shield className="w-4 h-4 text-gray-500" />
                     <div>
                       <div className="text-sm font-medium">Battle Pass</div>
                       <div className="text-xs text-gray-600">
                         Tier {enhancedData.battlePassTier} - {enhancedData.battlePassSeason}
                       </div>
                     </div>
                   </div>
                 )}
              </CardContent>
            </Card>

            {/* Set Information */}
            <Card>
              <CardHeader>
                <CardTitle>Set Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                                 <div>
                   <div className="text-sm font-medium">Set</div>
                   <div className="text-xs text-gray-600">{enhancedData.set}</div>
                 </div>
                 <div>
                   <div className="text-sm font-medium">Series</div>
                   <div className="text-xs text-gray-600">{enhancedData.series}</div>
                 </div>
                 <div>
                   <div className="text-sm font-medium">Collection</div>
                   <div className="text-xs text-gray-600">{enhancedData.collection}</div>
                 </div>
              </CardContent>
            </Card>

            {/* Cosmetic Items */}
                         {(enhancedData.backbling || enhancedData.pickaxe || enhancedData.glider || enhancedData.emote) && (
               <Card>
                 <CardHeader>
                   <CardTitle>Cosmetic Items</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-2">
                   {enhancedData.backbling && (
                     <div className="flex items-center space-x-2">
                       <span className="text-sm">🎒</span>
                       <span className="text-xs">{enhancedData.backbling}</span>
                     </div>
                   )}
                   {enhancedData.pickaxe && (
                     <div className="flex items-center space-x-2">
                       <span className="text-sm">⛏️</span>
                       <span className="text-xs">{enhancedData.pickaxe}</span>
                     </div>
                   )}
                   {enhancedData.glider && (
                     <div className="flex items-center space-x-2">
                       <span className="text-sm">🪂</span>
                       <span className="text-xs">{enhancedData.glider}</span>
                     </div>
                   )}
                   {enhancedData.emote && (
                     <div className="flex items-center space-x-2">
                       <span className="text-sm">💃</span>
                       <span className="text-xs">{enhancedData.emote}</span>
                     </div>
                   )}
                 </CardContent>
               </Card>
             )}

            {/* Special Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Properties</CardTitle>
              </CardHeader>
              <CardContent>
                                 <div className="space-y-2">
                   {enhancedData.isOG && (
                     <div className="flex items-center space-x-2">
                       <Zap className="w-4 h-4 text-yellow-500" />
                       <span className="text-xs">OG Skin</span>
                     </div>
                   )}
                   {enhancedData.isSweaty && (
                     <div className="flex items-center space-x-2">
                       <TrendingUp className="w-4 h-4 text-red-500" />
                       <span className="text-xs">Popular with Sweats</span>
                     </div>
                   )}
                   {enhancedData.isLimited && (
                     <div className="flex items-center space-x-2">
                       <Calendar className="w-4 h-4 text-orange-500" />
                       <span className="text-xs">Limited Availability</span>
                     </div>
                   )}
                   {enhancedData.isExclusive && (
                     <div className="flex items-center space-x-2">
                       <Shield className="w-4 h-4 text-purple-500" />
                       <span className="text-xs">Exclusive</span>
                     </div>
                   )}
                 </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                                 <div>
                   <div className="text-sm font-medium">Model Complexity</div>
                   <div className="text-xs text-gray-600">{enhancedData.modelComplexity}</div>
                 </div>
                 <div>
                   <div className="text-sm font-medium">Animation Quality</div>
                   <div className="text-xs text-gray-600">{enhancedData.animationQuality}</div>
                 </div>
                 <div>
                   <div className="text-sm font-medium">Hitbox Size</div>
                   <div className="text-xs text-gray-600">{enhancedData.hitboxSize}</div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
