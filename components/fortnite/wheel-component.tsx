import type { RefObject } from "react"
import { useEffect, useRef } from "react"
import type { Skin, DisplayMode } from "@/types/fortnite-types"
import { rarityColors } from "@/lib/rarity-config"
import { PICKER_WHEEL_THEMES, type WheelTheme } from "@/lib/picker-wheel-themes"

interface WheelComponentProps {
  skins: Skin[]
  rotation: number
  isSpinning: boolean
  spinDuration: number
  wheelRef: RefObject<HTMLDivElement>
  displayMode: DisplayMode
  currentTheme?: string
  themes?: WheelTheme[]
  onSpinCompleted?: () => void
}

export function WheelComponent({ skins, rotation, isSpinning, spinDuration, wheelRef, displayMode, currentTheme = 'classic', themes = PICKER_WHEEL_THEMES, onSpinCompleted }: WheelComponentProps) {
  const segmentAngle = skins.length > 0 ? 360 / skins.length : 0
  const radius = 300 // Increased from 200 to 300 for larger wheel
  const centerX = 350 // Increased from 250 to 350
  const centerY = 350 // Increased from 250 to 350
  const wheelSize = 700 // Increased from 500 to 700
  
  // Track previous spinning state to detect when spin completes
  const prevIsSpinningRef = useRef(isSpinning)
  
  // Call onSpinCompleted when spin animation finishes
  useEffect(() => {
    if (prevIsSpinningRef.current && !isSpinning && onSpinCompleted) {
      console.log('Fortnite wheel spin completed - calling onSpinCompleted')
      onSpinCompleted()
    }
    prevIsSpinningRef.current = isSpinning
  }, [isSpinning, onSpinCompleted])

  // Get theme data
  const currentThemeData = themes.find(t => t.id === currentTheme)
  const themeColors = currentThemeData?.colors || ['#4ade80', '#fbbf24', '#f97316', '#84cc16', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
  const themeEffects = currentThemeData?.effects || {
    particles: false,
    glow: false,
    sparkle: false,
    rainbow: false,
    gradient: false
  }

  // Debug theme data
  console.log('WheelComponent theme debug:', {
    currentTheme,
    themeName: currentThemeData?.name,
    themeColors: themeColors.slice(0, 3),
    themeEffects,
    skinsCount: skins.length
  })

  // Helper function to adjust color brightness
  const adjustBrightness = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }

  // Show empty wheel when no skins are selected
  if (skins.length === 0) {
    return (
      <div className="relative">
        <div ref={wheelRef}>
          <svg width={wheelSize} height={wheelSize} className="drop-shadow-2xl">
            {/* Empty wheel circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="3"
            />
            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 20}
              fill="#6b7280"
              fontSize="18"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
            >
              No Skins Selected
            </text>
            <text
              x={centerX}
              y={centerY + 10}
              fill="#9ca3af"
              fontSize="14"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Select skins to start spinning
            </text>
            {/* Center spin button */}
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
    <div className="relative">
      <div
        ref={wheelRef}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? `transform ${spinDuration}s cubic-bezier(0.23, 1, 0.32, 1)` : "none",
        }}
      >
        <svg width={wheelSize} height={wheelSize} className="drop-shadow-2xl">
          {skins.map((skin, index) => {
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

            // Use theme colors instead of rarity colors
            const themeColor = themeColors[index % themeColors.length]
            const fillColor = themeEffects.gradient ? `url(#gradient-${index})` : themeColor

            // Debug first few segments
            if (index < 3) {
              console.log(`Segment ${index} (${skin.name}):`, {
                themeColor,
                fillColor,
                themeIndex: index % themeColors.length
              })
            }

            return (
              <g key={skin.id}>
                <defs>
                  {themeEffects.gradient && (
                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={themeColor} />
                      <stop offset="100%" stopColor={adjustBrightness(themeColor, -20)} />
                    </linearGradient>
                  )}
                </defs>
                <path 
                  d={pathData} 
                  fill={fillColor} 
                  stroke="#ffffff" 
                  strokeWidth="3" 
                  opacity={0.9}
                  filter={themeEffects.glow ? "drop-shadow(0 0 8px currentColor)" : undefined}
                />
                
                {/* Render based on display mode */}
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
                  >
                    {skin.emoji} {skin.name.length > 8 ? skin.name.substring(0, 6) + "..." : skin.name}
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
                  >
                    {skin.emoji}
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
                  >
                    {skin.name.length > 12 ? skin.name.substring(0, 10) + "..." : skin.name}
                  </text>
                )}
              </g>
            )
          })}

          {/* Center circle */}
          <circle cx={centerX} cy={centerY} r="60" fill="#1f2937" stroke="#ffffff" strokeWidth="4" />
          <text
            x={centerX}
            y={centerY}
            fill="white"
            fontSize="20"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            SPIN
          </text>
        </svg>
      </div>

      {/* Pointer - pointing left towards wheel (3 o'clock position) */}
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
        <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-r-[40px] border-t-transparent border-b-transparent border-r-red-600"></div>
      </div>
    </div>
  )
}
