"use client"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Trophy, Maximize, Minimize } from "lucide-react"
import type { WheelItem, WheelSettings } from "@/lib/types"
import { AnimatePresence, motion } from "framer-motion"
import { useSettings } from "@/contexts/settings-context"
import { useState } from "react"

interface WheelControlsProps {
  settings: WheelSettings
  selectedItem: WheelItem | null
  currentTool: string
  setShowResults: (show: boolean) => void
  isFullscreen: boolean
  setIsFullscreen: (fullscreen: boolean) => void
  toolMuted: boolean
  setToolMuted: (muted: boolean) => void
}

export function WheelControls({ settings, selectedItem, currentTool, setShowResults, isFullscreen, setIsFullscreen, toolMuted, setToolMuted }: WheelControlsProps) {
  const { settings: globalSettings, updateSettings } = useSettings();
  const muted = !globalSettings.confettiSound.enableSound;
  return (
    <>
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center p-4 bg-green-100 rounded-lg border-2 border-green-300"
          >
            <h3 className="text-lg font-semibold text-green-800">Result:</h3>
            {currentTool === "image" && selectedItem.imageUrl ? (
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={selectedItem.imageUrl || "/placeholder.svg"}
                  alt={selectedItem.text}
                  className="w-24 h-24 object-cover rounded border-2 border-green-300"
                />
                <p className="text-lg font-bold text-green-900">{selectedItem.text}</p>
              </div>
            ) : (
              <p className="text-2xl font-bold text-green-900">{selectedItem.text}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={
        (isFullscreen
          ? "fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-white/90 rounded-lg p-2 shadow-lg flex items-center space-x-4"
          : "flex items-center space-x-4 mt-4"
        )
      }>
        <Button
          variant="outline"
          size="sm"
          title="Mute/Unmute Sound (Global & Tool)"
          onClick={() => {
            const willMute = muted || toolMuted ? false : true;
            updateSettings({ confettiSound: { ...globalSettings.confettiSound, enableSound: !willMute } });
            setToolMuted(!willMute);
          }}
        >
          {(muted || toolMuted) ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowResults(true)}>
          <Trophy className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </Button>
      </div>
    </>
  )
}
