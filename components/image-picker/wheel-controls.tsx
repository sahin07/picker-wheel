"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import type { WheelItem } from "@/lib/types"
import { AnimatePresence, motion } from "framer-motion"

interface WheelControlsProps {
  selectedItem: WheelItem | null
  currentTool: string
  onShare?: () => void
  isSpinning?: boolean
}

/** Result banner under the wheel (sound/fullscreen live on WheelDisplay chrome). */
export function WheelControls({
  selectedItem,
  currentTool,
  onShare,
  isSpinning = false,
}: WheelControlsProps) {
  return (
    <AnimatePresence>
      {selectedItem && !isSpinning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center shadow-lg"
        >
          <h3 className="mb-2 text-lg font-semibold text-green-800">🎉 Image picked!</h3>
          {currentTool === "image" && selectedItem.imageUrl ? (
            <div className="mb-2 flex flex-col items-center space-y-2">
              <img
                src={selectedItem.imageUrl || "/placeholder.svg"}
                alt={selectedItem.text}
                className="h-24 w-24 rounded border-2 border-white object-cover shadow"
              />
              <p className="text-xl font-bold text-green-900">{selectedItem.text}</p>
            </div>
          ) : (
            <p className="mb-2 text-2xl font-bold text-green-900">{selectedItem.text}</p>
          )}
          {onShare && (
            <Button variant="outline" size="sm" className="mt-1 gap-1.5" onClick={onShare}>
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
