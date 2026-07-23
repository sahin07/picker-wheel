"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { WheelCanvas } from "@/components/wheel-canvas"
import { useSettingsStore } from "@/stores/settings-store"

const WHEEL_SIZE = 680

export type YesNoCanvasItem = {
  value: string
  weight: number
  color: string
  id: string
  key?: string
}

interface WheelDisplayProps {
  items: YesNoCanvasItem[]
  rotation: number
  isSpinning: boolean
  highlightIndex?: number | null
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  onSpin: () => void
  onRotationFrame?: (rotationDegrees: number, segmentCount: number) => void
  onSpinComplete?: () => void
  manuallyStop?: boolean
}

export function WheelDisplay({
  items,
  rotation,
  isSpinning,
  highlightIndex = null,
  soundEnabled,
  setSoundEnabled,
  isFullscreen = false,
  onToggleFullscreen,
  onSpin,
  onRotationFrame,
  onSpinComplete,
  manuallyStop = false,
}: WheelDisplayProps) {
  const { settings } = useSettingsStore()
  const soundGloballyOff = !settings.confettiSound.enableSound
  const canClickSpin = !isSpinning || manuallyStop

  return (
    <div className="relative mx-auto flex w-full max-w-[680px] flex-col items-center">
      <div
        className="relative w-full max-w-[680px] cursor-pointer overflow-visible"
        onClick={canClickSpin ? onSpin : undefined}
      >
        <WheelCanvas
          numbers={items}
          isSpinning={isSpinning}
          settings={settings}
          rotation={rotation}
          size={WHEEL_SIZE}
          highlightIndex={highlightIndex}
          onRotationFrame={onRotationFrame}
          onSpinComplete={onSpinComplete}
        />

        <div className="absolute bottom-2 left-2 z-20 flex flex-col space-y-2 sm:bottom-4 sm:left-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setSoundEnabled(!soundEnabled)
            }}
            className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white sm:h-10 sm:w-10"
            title={
              soundGloballyOff ? "Global sound disabled" : soundEnabled ? "Mute" : "Unmute"
            }
          >
            {soundGloballyOff || !soundEnabled ? (
              <VolumeX className={`h-5 w-5 ${soundGloballyOff ? "text-gray-400" : ""}`} />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          {onToggleFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFullscreen()
              }}
              className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white sm:h-10 sm:w-10"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {isSpinning && (
          <div className="absolute right-2 top-2 z-20 animate-pulse rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
            {manuallyStop ? "Click to Stop!" : "Spinning..."}
          </div>
        )}
      </div>
    </div>
  )
}
