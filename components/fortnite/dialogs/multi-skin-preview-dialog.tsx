"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Skin } from "@/types/fortnite-types"

interface MultiSkinPreviewDialogProps {
  skins: Skin[]
  isOpen: boolean
  onClose: () => void
}

export function MultiSkinPreviewDialog({ skins, isOpen, onClose }: MultiSkinPreviewDialogProps) {
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎯 Wheel Preview
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {skins.length} skins
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            These are all the skins currently on your wheel:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skins.map((skin, index) => (
              <div 
                key={skin.id} 
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{skin.emoji}</span>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      borderColor: getRarityColor(skin.rarity),
                      color: getRarityColor(skin.rarity)
                    }}
                  >
                    {skin.rarity}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">
                  {skin.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {skin.season}
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  Position: {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          {skins.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎯</div>
              <p>No skins selected for the wheel</p>
              <p className="text-sm">Select some skins to see them here</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getRarityColor(rarity: string): string {
  const colors = {
    Common: "#95a5a6",
    Uncommon: "#27ae60", 
    Rare: "#3498db",
    Epic: "#9b59b6",
    Legendary: "#f39c12",
    Mythic: "#e74c3c"
  }
  return colors[rarity as keyof typeof colors] || "#95a5a6"
}
