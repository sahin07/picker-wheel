"use client"
import { motion } from "framer-motion"
import type { WheelItem, WheelSettings } from "@/lib/types"
import { Target, Volume2, VolumeX, Maximize, Minimize, RotateCcw } from "lucide-react"
import { useState } from "react"
import { useSettings } from "@/contexts/settings-context"

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
  bingoCard: any // Simplified for now, will use proper type later
  memoryChallenge: any // Simplified for now
  collectionProgress: WheelItem[]
  sequenceTarget: WheelItem[]
  sequenceProgress: WheelItem[]
  setShowResults: (show: boolean) => void
  isFullscreen: boolean
  results?: WheelItem[] // Add results prop
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
  results = [], // Default to empty array
}: WheelDisplayProps) {
  const wheelSize = 480 // Increased from 384 for a larger wheel
  const radius = wheelSize / 2
  const imageRadius = radius * 0.625 // 120px for 384px wheel, scales with new size

  const { settings: globalSettings, updateSettings } = useSettings();
  const muted = !globalSettings.confettiSound.enableSound;

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 bg-white flex flex-col items-center justify-center' : 'relative flex flex-col items-center'}>
      <motion.div
        className="rounded-full relative overflow-hidden shadow-lg"
        style={{ width: wheelSize, height: wheelSize, backgroundColor: settings.backgroundColor }}
        animate={{ rotate: wheelRotation }}
        transition={{ duration: settings.spinDuration, ease: "easeOut" }}
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
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d={pathData}
                  fill={isHighlighted ? "#fbbf24" : index % 2 === 0 ? settings.wheelColor : "#8fbc8f"}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </svg>

              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: `calc(50% + ${imageX}px)`,
                  top: `calc(50% + ${imageY}px)`,
                  transform: `translate(-50%, -50%) rotate(${midAngle + 90}deg)`,
                  width: "90px",
                  height: "70px",
                }}
              >
                {settings.mysteryMode ? (
                  <div className="bg-white rounded p-2 shadow-md flex items-center justify-center w-full h-full">
                    <span className="text-gray-800 font-bold text-xl">?</span>
                  </div>
                ) : currentTool === "image" && item.imageUrl ? (
                  <div
                    className={`bg-white rounded shadow-md p-1 w-full h-full ${isHighlighted ? "ring-2 ring-yellow-400" : ""}`}
                  >
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.text}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ) : (
                  <div
                    className={`bg-white rounded shadow-md p-2 flex items-center justify-center w-full h-full ${isHighlighted ? "ring-2 ring-yellow-400" : ""}`}
                  >
                    <span
                      className="text-gray-800 font-semibold text-xs text-center leading-tight"
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
        {/* Center SPIN button (restored) */}
        <button
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg border-4 border-white focus:outline-none focus:ring-2 focus:ring-blue-400 z-20"
          onClick={spinWheel}
          disabled={isSpinning || enabledItems.length === 0}
        >
          SPIN
        </button>
      </motion.div>
      {/* New gradient SPIN THE WHEEL button (already present) */}
      <button
        className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg rounded-lg px-8 py-3 flex items-center gap-2 shadow-lg mt-4"
        onClick={spinWheel}
        disabled={isSpinning || enabledItems.length === 0}
      >
        <Target className="w-6 h-6 text-pink-200" />
        SPIN THE WHEEL
      </button>

      {/* Spin Count Display */}
      <div className="mt-4 text-sm text-gray-500 flex items-center space-x-2">
        <span>Total spin = {results.length}</span>
        <RotateCcw className="w-4 h-4" />
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-md absolute left-1/2 -translate-x-1/2 -top-3 rotate-180"></div>
      </div>
    </div>
  )
}
