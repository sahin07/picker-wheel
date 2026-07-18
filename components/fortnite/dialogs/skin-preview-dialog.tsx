import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { rarityColors, rarityIcons } from "@/lib/rarity-config"
import type { Skin } from "@/types/fortnite-types"

interface SkinPreviewDialogProps {
  skin: Skin | null
  onClose: () => void
}

export function SkinPreviewDialog({ skin, onClose }: SkinPreviewDialogProps) {
  return (
    <Dialog open={!!skin} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Skin Preview</DialogTitle>
        </DialogHeader>
        {skin && (
          <div className="text-center space-y-4">
            <div
              className="w-32 h-32 mx-auto rounded-lg border-2 flex items-center justify-center text-4xl bg-gray-100"
              style={{ borderColor: rarityColors[(skin.rarity || 'Common').toLowerCase() as keyof typeof rarityColors] }}
            >
              {skin.emoji}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{skin.name}</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge
                  style={{
                    backgroundColor: rarityColors[(skin.rarity || 'Common').toLowerCase() as keyof typeof rarityColors],
                  }}
                  className="text-white"
                >
                  {rarityIcons[(skin.rarity || 'Common').toLowerCase() as keyof typeof rarityIcons]} {skin.rarity || 'Common'}
                </Badge>
                <Badge variant="outline" className="text-gray-600">
                  {skin.season}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                This skin belongs to the {skin.season} collection and has {skin.rarity.toLowerCase()} rarity.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
