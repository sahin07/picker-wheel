import type { RefObject } from "react"
import { useEffect, useRef } from "react"
import type { Skin, DisplayMode } from "@/types/fortnite-types"
import { rarityColors } from "@/lib/rarity-config"
import { PICKER_WHEEL_THEMES, type WheelTheme } from "@/lib/picker-wheel-themes"
import { applyWheelRotation } from "@/lib/wheel-spin-animation"

/** Match NBA/MLB pillar canvas size */
export const FORTNITE_WHEEL_SIZE = 680

interface WheelComponentProps {
  skins: Skin[]
  rotation: number
  isSpinning: boolean
  spinDuration?: number
  wheelRef: RefObject<HTMLDivElement>
  displayMode: DisplayMode
  currentTheme?: string
  themes?: WheelTheme[]
  onSpinCompleted?: () => void
}

export function WheelComponent({
  skins,
  rotation,
  isSpinning,
  wheelRef,
  displayMode,
  currentTheme = "classic",
  themes = PICKER_WHEEL_THEMES,
  onSpinCompleted,
}: WheelComponentProps) {
  const segmentAngle = skins.length > 0 ? 360 / skins.length : 0
  const wheelSize = FORTNITE_WHEEL_SIZE
  const centerX = wheelSize / 2
  const centerY = wheelSize / 2
  // Same inset as NBA/MLB canvas: Math.min(center) - 20
  const radius = Math.min(centerX, centerY) - 20

  const prevIsSpinningRef = useRef(isSpinning)

  // When idle, sync prop rotation to DOM. During spin, parent drives via wheelRef.
  useEffect(() => {
    if (isSpinning) return
    applyWheelRotation(wheelRef.current, rotation)
  }, [rotation, isSpinning, wheelRef])

  useEffect(() => {
    if (prevIsSpinningRef.current && !isSpinning && onSpinCompleted) {
      onSpinCompleted()
    }
    prevIsSpinningRef.current = isSpinning
  }, [isSpinning, onSpinCompleted])

  const currentThemeData = themes.find((t) => t.id === currentTheme)
  const themeColors = currentThemeData?.colors || [
    "#4ade80",
    "#fbbf24",
    "#f97316",
    "#84cc16",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
  ]

  // NBA pointer geometry (3 o'clock): depth 20, half-height 15
  const pointerPoints = [
    `${centerX + radius - 20},${centerY}`,
    `${centerX + radius},${centerY - 15}`,
    `${centerX + radius},${centerY + 15}`,
  ].join(" ")

  if (skins.length === 0) {
    return (
      <div className="relative w-full max-w-[680px]">
        <svg
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${wheelSize} ${wheelSize}`}
          className="aspect-square h-auto w-full max-w-full drop-shadow-lg"
        >
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="#f9fafb"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <text
            x={centerX}
            y={centerY}
            fill="#9ca3af"
            fontSize="16"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            No skins selected
          </text>
        </svg>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[680px]">
      <div
        ref={wheelRef}
        style={{
          transformOrigin: "center center",
          transition: "none",
        }}
      >
        <svg
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${wheelSize} ${wheelSize}`}
          className="aspect-square h-auto w-full max-w-full drop-shadow-lg"
        >
          {skins.map((skin, index) => {
            // Same as NBA/MLB canvas: 0° at 3 o'clock, angles increase clockwise
            // (SVG y-down + cos/sin makes positive degrees appear clockwise on screen)
            const startAngle = index * segmentAngle
            const endAngle = (index + 1) * segmentAngle
            const startAngleRad = (startAngle * Math.PI) / 180
            const endAngleRad = (endAngle * Math.PI) / 180

            const x1 = centerX + radius * Math.cos(startAngleRad)
            const y1 = centerY + radius * Math.sin(startAngleRad)
            const x2 = centerX + radius * Math.cos(endAngleRad)
            const y2 = centerY + radius * Math.sin(endAngleRad)
            const largeArcFlag = segmentAngle > 180 ? 1 : 0

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ")

            const textAngle = startAngle + segmentAngle / 2
            const textRadius = radius * 0.7
            const textX = centerX + textRadius * Math.cos((textAngle * Math.PI) / 180)
            const textY = centerY + textRadius * Math.sin((textAngle * Math.PI) / 180)

            const baseColor =
              themeColors[index % themeColors.length] ||
              rarityColors[(skin.rarity || "Common").toLowerCase() as keyof typeof rarityColors] ||
              "#4ade80"

            return (
              <g key={skin.id}>
                <path d={pathData} fill={baseColor} stroke="none" />
                {displayMode === "emoji-name" && (
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  >
                    {skin.emoji}{" "}
                    {skin.name.length > 8 ? `${skin.name.substring(0, 6)}...` : skin.name}
                  </text>
                )}
                {displayMode === "emoji" && (
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="22"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  >
                    {skin.emoji}
                  </text>
                )}
                {displayMode === "name" && (
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  >
                    {skin.name.length > 12 ? `${skin.name.substring(0, 10)}...` : skin.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Fixed hub + pointer — same as NBA (hub does not spin with slices) */}
      <svg
        className="pointer-events-none absolute inset-0 h-auto w-full"
        width={wheelSize}
        height={wheelSize}
        viewBox={`0 0 ${wheelSize} ${wheelSize}`}
        aria-hidden
      >
        <defs>
          <linearGradient id="fortnite-pointer-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <circle cx={centerX} cy={centerY} r="40" fill="#1a202c" stroke="#111827" strokeWidth="2" />
        <text
          x={centerX}
          y={centerY - 6}
          fill="white"
          fontSize="18"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          🎯
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          fill="white"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          SPIN
        </text>
        <polygon points={pointerPoints} fill="url(#fortnite-pointer-grad)" />
      </svg>
    </div>
  )
}
