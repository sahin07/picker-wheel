"use client"

import { useEffect, useRef, type RefObject } from "react"
import type { DisplayMode, LoLChampion } from "@/types/lol-types"
import { roleColors, popularityColors } from "@/constants/lol-config"
import { PICKER_WHEEL_THEMES, type WheelTheme } from "@/lib/picker-wheel-themes"
import { applyWheelRotation } from "@/lib/wheel-spin-animation"

/** Match Fortnite/Pokémon pillar wheel size */
export const LOL_WHEEL_SIZE = 680

interface WheelComponentProps {
  items: LoLChampion[]
  rotation: number
  isSpinning: boolean
  spinDuration?: number
  wheelRef: RefObject<HTMLDivElement | null>
  displayMode?: DisplayMode
  currentTheme?: string
  themes?: WheelTheme[]
  onManualSelect?: (champion: LoLChampion) => void
  actionMode?: "normal" | "elimination" | "manual"
  onSpinClick?: () => void
  onSpinCompleted?: () => void
}

export function WheelComponent({
  items,
  rotation,
  isSpinning,
  wheelRef,
  displayMode = "emoji-name",
  currentTheme = "classic",
  themes = PICKER_WHEEL_THEMES,
  onManualSelect,
  actionMode = "normal",
  onSpinCompleted,
}: WheelComponentProps) {
  const segmentAngle = items.length > 0 ? 360 / items.length : 0
  const wheelSize = LOL_WHEEL_SIZE
  const centerX = wheelSize / 2
  const centerY = wheelSize / 2
  const radius = Math.min(centerX, centerY) - 50 // ~290

  const prevIsSpinningRef = useRef(isSpinning)
  const themeColors =
    themes.find((t) => t.id === currentTheme)?.colors ??
    PICKER_WHEEL_THEMES.find((t) => t.id === "classic")?.colors ??
    []

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

  if (items.length === 0) {
    return (
      <div className="relative w-full max-w-[680px]">
        <div ref={wheelRef}>
          <svg
            viewBox={`0 0 ${wheelSize} ${wheelSize}`}
            className="h-auto w-full max-w-[680px] drop-shadow-2xl"
          >
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="3"
            />
            <text
              x={centerX}
              y={centerY - 20}
              fill="#6b7280"
              fontSize="18"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
            >
              No Champions Selected
            </text>
            <text
              x={centerX}
              y={centerY + 10}
              fill="#9ca3af"
              fontSize="14"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Select champions to start spinning
            </text>
            <circle
              cx={centerX}
              cy={centerY + 80}
              r="40"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="2"
            />
            <text
              x={centerX}
              y={centerY + 80}
              fill="white"
              fontSize="14"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
            >
              SPIN
            </text>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[680px]">
      <div ref={wheelRef} style={{ transformOrigin: "center center" }}>
        <svg
          viewBox={`0 0 ${wheelSize} ${wheelSize}`}
          className="h-auto w-full max-w-[680px] drop-shadow-2xl"
        >
          <defs>
            <filter id="lol-glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="lol-strongGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {items.map((champion, index) => {
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
            const textX =
              centerX + textRadius * Math.cos((textAngle * Math.PI) / 180)
            const textY =
              centerY + textRadius * Math.sin((textAngle * Math.PI) / 180)

            const roleColor =
              roleColors[champion.role as keyof typeof roleColors] || "#6B7280"
            // Prefer selected wheel theme (Style tab / Themes chip); fall back to role tint
            const baseColor =
              themeColors.length > 0
                ? themeColors[index % themeColors.length]
                : roleColor
            const fillColor = baseColor || roleColor
            const popularityColor =
              popularityColors[
                champion.popularity as keyof typeof popularityColors
              ] || "#6B7280"

            const isSTier = champion.popularity === "S-tier"

            return (
              <g key={champion.id}>
                <path
                  d={pathData}
                  fill={fillColor}
                  stroke={isSTier ? popularityColor : "#ffffff"}
                  strokeWidth={isSTier ? "3" : "2"}
                  opacity={0.9}
                  filter={
                    isSTier
                      ? "url(#lol-strongGlow)"
                      : champion.communityFavorite
                        ? "url(#lol-glow)"
                        : undefined
                  }
                  style={{
                    cursor: actionMode === "manual" ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (actionMode === "manual" && onManualSelect) {
                      onManualSelect(champion)
                    }
                  }}
                />
                {isSTier && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke={popularityColor}
                    strokeWidth="1"
                    opacity={0.6}
                    transform={`scale(0.8) translate(${centerX * 0.2}, ${
                      centerY * 0.2
                    })`}
                  />
                )}
                {displayMode === "emoji-name" && (
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    {champion.emoji}{" "}
                    {champion.name.length > 8
                      ? champion.name.substring(0, 6) + "..."
                      : champion.name}
                  </text>
                )}

                {displayMode === "emoji" && (
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="28"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    {champion.emoji}
                  </text>
                )}

                {displayMode === "name" && (
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    {champion.name.length > 12
                      ? champion.name.substring(0, 10) + "..."
                      : champion.name}
                  </text>
                )}
              </g>
            )
          })}

          <circle
            cx={centerX}
            cy={centerY}
            r="40"
            fill="#1f2937"
            stroke="#ffffff"
            strokeWidth="4"
          />
          <text
            x={centerX}
            y={centerY}
            fill="white"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            SPIN
          </text>
        </svg>
      </div>

      <div className="absolute top-1/2 right-6 -translate-y-1/2 sm:right-8">
        <div className="h-0 w-0 border-b-[20px] border-r-[40px] border-t-[20px] border-b-transparent border-r-red-600 border-t-transparent" />
      </div>
    </div>
  )
}
