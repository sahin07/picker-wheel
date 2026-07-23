"use client"

import type { RefObject } from "react"
import { useEffect, useRef } from "react"
import type { Pokemon, DisplayMode } from "@/types/pokemon-types"
import { PICKER_WHEEL_THEMES, type WheelTheme } from "@/lib/picker-wheel-themes"
import { applyWheelRotation } from "@/lib/wheel-spin-animation"

/** Match Fortnite/NBA/MLB pillar wheel size */
export const POKEMON_WHEEL_SIZE = 680

interface WheelComponentProps {
  pokemon: Pokemon[]
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
  pokemon,
  rotation,
  isSpinning,
  wheelRef,
  displayMode,
  currentTheme = "classic",
  themes = PICKER_WHEEL_THEMES,
  onSpinCompleted,
}: WheelComponentProps) {
  const segmentAngle = pokemon.length > 0 ? 360 / pokemon.length : 0
  const wheelSize = POKEMON_WHEEL_SIZE
  const centerX = wheelSize / 2
  const centerY = wheelSize / 2
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

  const pointerPoints = [
    `${centerX + radius - 20},${centerY}`,
    `${centerX + radius},${centerY - 15}`,
    `${centerX + radius},${centerY + 15}`,
  ].join(" ")

  if (pokemon.length === 0) {
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
            No Pokémon selected
          </text>
        </svg>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[680px]">
      <div
        ref={wheelRef}
        className="aspect-square w-full"
        style={{ transformOrigin: "center center" }}
      >
        <svg
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${wheelSize} ${wheelSize}`}
          className="aspect-square h-auto w-full max-w-full drop-shadow-lg"
        >
          {pokemon.map((poke, index) => {
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
            const segmentColor = themeColors[index % themeColors.length]

            const label =
              displayMode === "emoji"
                ? poke.emoji
                : displayMode === "name"
                  ? poke.name.length > 12
                    ? `${poke.name.slice(0, 10)}…`
                    : poke.name
                  : `${poke.emoji} ${poke.name.length > 8 ? `${poke.name.slice(0, 6)}…` : poke.name}`

            return (
              <g key={poke.id}>
                <path
                  d={pathData}
                  fill={segmentColor}
                  stroke="#ffffff"
                  strokeWidth="2"
                  opacity={0.95}
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize={displayMode === "emoji" ? 28 : displayMode === "name" ? 14 : 15}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                >
                  {label}
                </text>
              </g>
            )
          })}

          <circle
            cx={centerX}
            cy={centerY}
            r="48"
            fill="#1f2937"
            stroke="#ffffff"
            strokeWidth="4"
          />
          <text
            x={centerX}
            y={centerY}
            fill="white"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            SPIN
          </text>

          {/* Pointer at 3 o'clock — same as Fortnite/NBA */}
          <polygon points={pointerPoints} fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
        </svg>
      </div>
    </div>
  )
}
