"use client"

import { motion } from "framer-motion"
import type { WheelItem, WheelSettings } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Target, Volume2, VolumeX, Maximize, Minimize, RotateCcw } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"

interface WheelDisplayProps {
  enabledItems: WheelItem[]
  segmentAngle: number
  wheelRotation: number
  settings: WheelSettings
  isSpinning: boolean
  spinWheel: () => void
  selectedItem: WheelItem | null
  currentTool: string
  gameMode: string
  bingoCard: any
  memoryChallenge: any
  collectionProgress: WheelItem[]
  sequenceTarget: WheelItem[]
  sequenceProgress: WheelItem[]
  setShowResults: (show: boolean) => void
  isFullscreen: boolean
  onToggleFullscreen?: () => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  onRotationFrame?: (rotationDegrees: number) => void
  results?: WheelItem[]
  showStats?: boolean
}

export function WheelDisplay({
  enabledItems,
  segmentAngle,
  wheelRotation,
  settings,
  isSpinning,
  spinWheel,
  selectedItem,
  currentTool,
  gameMode,
  bingoCard,
  memoryChallenge,
  collectionProgress,
  sequenceTarget,
  sequenceProgress,
  setShowResults,
  isFullscreen,
  onToggleFullscreen,
  soundEnabled,
  setSoundEnabled,
  onRotationFrame,
  results = [],
  showStats = true,
}: WheelDisplayProps) {
  const wheelSize = 680
  const radius = wheelSize / 2
  const imageRadius = radius * 0.625
  const thumbW = Math.round(wheelSize * 0.1875)
  const thumbH = Math.round(wheelSize * 0.145)
  const { settings: storeSettings } = useSettingsStore()
  const soundGloballyOff = !storeSettings.confettiSound.enableSound
  const spinDurationSec = Math.max(
    0.5,
    storeSettings.spinBehavior?.spinningDuration || 10,
  )
  // Same ease-out curve as wheel-canvas (Yes-No / Letter / Number)
  const speedMultiplier = (storeSettings.spinBehavior?.spinningSpeedLevel ?? 10) / 5
  const spinEase = (t: number) => 1 - Math.pow(1 - t, 2 + speedMultiplier)

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
          : "relative flex w-full max-w-[680px] flex-col items-center"
      }
    >
      <div
        className="relative mx-auto"
        style={{ width: "min(100%, 680px)", aspectRatio: "1 / 1" }}
      >
        <motion.div
          className="relative h-full w-full overflow-hidden rounded-full shadow-lg"
          style={{
            backgroundColor: settings.backgroundColor,
          }}
          animate={{ rotate: wheelRotation }}
          transition={{ duration: spinDurationSec, ease: spinEase }}
          onUpdate={(latest) => {
            if (!isSpinning || !onRotationFrame) return
            if (typeof latest.rotate === "number") onRotationFrame(latest.rotate)
          }}
        >
          {enabledItems.map((item, index) => {
            const startAngle = index * segmentAngle
            const endAngle = (index + 1) * segmentAngle
            const midAngle = (startAngle + endAngle) / 2

            const imageX = Math.cos(((midAngle - 90) * Math.PI) / 180) * imageRadius
            const imageY = Math.sin(((midAngle - 90) * Math.PI) / 180) * imageRadius

            const centerX = radius
            const centerY = radius

            const startX = centerX + radius * Math.cos(((startAngle - 90) * Math.PI) / 180)
            const startY = centerY + radius * Math.sin(((startAngle - 90) * Math.PI) / 180)
            const endX = centerX + radius * Math.cos(((endAngle - 90) * Math.PI) / 180)
            const endY = centerY + radius * Math.sin(((endAngle - 90) * Math.PI) / 180)

            const largeArcFlag = segmentAngle > 180 ? 1 : 0

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              "Z",
            ].join(" ")

            let isHighlighted = false
            if (gameMode === "bingo" && bingoCard) {
              isHighlighted = bingoCard.cells.some((cell: WheelItem) => cell?.id === item.id)
            } else if (gameMode === "memory" && memoryChallenge) {
              isHighlighted =
                memoryChallenge.targetImages.some((target: WheelItem) => target.id === item.id) &&
                memoryChallenge.isActive
            } else if (gameMode === "collection") {
              isHighlighted = !collectionProgress.some((collected) => collected.id === item.id)
            } else if (gameMode === "sequence" && sequenceTarget.length > 0) {
              isHighlighted = sequenceTarget[sequenceProgress.length]?.id === item.id
            }

            return (
              <div key={item.id} className="absolute inset-0">
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d={pathData}
                    fill={
                      isHighlighted
                        ? "#fbbf24"
                        : item.color ||
                          (index % 2 === 0 ? settings.wheelColor : "#8fbc8f")
                    }
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>

                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `calc(50% + ${(imageX / wheelSize) * 100}%)`,
                    top: `calc(50% + ${(imageY / wheelSize) * 100}%)`,
                    transform: `translate(-50%, -50%) rotate(${midAngle + 90}deg)`,
                    width: `${(thumbW / wheelSize) * 100}%`,
                    height: `${(thumbH / wheelSize) * 100}%`,
                  }}
                >
                  {settings.mysteryMode ? (
                    <div className="flex h-full w-full items-center justify-center rounded bg-white p-2 shadow-md">
                      <span className="text-xl font-bold text-gray-800">?</span>
                    </div>
                  ) : currentTool === "image" && item.imageUrl ? (
                    <div
                      className={`h-full w-full rounded bg-white p-1 shadow-md ${
                        isHighlighted ? "ring-2 ring-yellow-400" : ""
                      }`}
                    >
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.text}
                        className="h-full w-full rounded object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center rounded bg-white p-2 shadow-md ${
                        isHighlighted ? "ring-2 ring-yellow-400" : ""
                      }`}
                    >
                      <span
                        className="text-center text-xs font-semibold leading-tight text-gray-800"
                        style={{ transform: `rotate(-${midAngle + 90}deg)` }}
                      >
                        {item.text}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          <button
            type="button"
            className="absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-gray-900 text-lg font-bold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={spinWheel}
            disabled={isSpinning || enabledItems.length === 0}
          >
            SPIN
          </button>
        </motion.div>

        {/* Pointer (fixed, not rotating) */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1">
          <div className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 -translate-y-1 rotate-180 border-b-[20px] border-l-[12px] border-r-[12px] border-b-red-500 border-l-transparent border-r-transparent drop-shadow-md" />
        </div>

        {/* Wheel chrome — sound / fullscreen (Yes-No / Color / Letter parity) */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-col space-y-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setSoundEnabled(!soundEnabled)
            }}
            className="h-10 w-10 bg-white/90 p-0 shadow-md hover:bg-white"
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
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFullscreen()
              }}
              className="h-10 w-10 bg-white/90 p-0 shadow-md hover:bg-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {isSpinning && (
          <div className="absolute right-4 top-4 z-20 animate-pulse rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
            Spinning...
          </div>
        )}
      </div>

      <button
        type="button"
        className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-8 py-3 text-lg font-bold text-white shadow-lg"
        onClick={spinWheel}
        disabled={isSpinning || enabledItems.length === 0}
      >
        <Target className="h-6 w-6 text-pink-200" />
        SPIN THE WHEEL
      </button>

      {showStats && (
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
          <span>Total spin = {results.length}</span>
          <RotateCcw className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
