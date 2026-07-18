import type { RefObject } from "react"
import { useEffect, useRef, useState } from "react"
import type { Pokemon, DisplayMode } from "@/types/pokemon-types"
import { typeColors } from "@/constants/type-config"
import { PICKER_WHEEL_THEMES, type WheelTheme } from "@/lib/picker-wheel-themes"

interface WheelComponentProps {
  pokemon: Pokemon[]
  rotation: number
  isSpinning: boolean
  spinDuration: number
  wheelRef: RefObject<HTMLDivElement>
  displayMode: DisplayMode
  currentTheme?: string
  themes?: WheelTheme[]
  onSpinCompleted?: () => void
}

export function WheelComponent({ pokemon, rotation, isSpinning, spinDuration, wheelRef, displayMode, currentTheme = 'classic', themes = PICKER_WHEEL_THEMES, onSpinCompleted }: WheelComponentProps) {
  const segmentAngle = pokemon.length > 0 ? 360 / pokemon.length : 0
  const radius = 300 // Reverted back to original size
  const centerX = 350 // Reverted back to original size
  const centerY = 350 // Reverted back to original size
  const wheelSize = 700 // Reverted back to original size
  
  // Track previous spinning state to detect when spin completes
  const prevIsSpinningRef = useRef(isSpinning)
  const [currentRotation, setCurrentRotation] = useState(0)
  const animationRef = useRef<number>()
  
  // Animation loop for spinning (like Fortnite wheel)
  useEffect(() => {
    if (!isSpinning) return
    
    const startRotation = currentRotation
    const startTime = Date.now()
    const duration = spinDuration * 1000
    const targetRotation = rotation

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const newRotation = startRotation + (targetRotation - startRotation) * easeOut
      setCurrentRotation(newRotation)
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setCurrentRotation(targetRotation)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSpinning, rotation, spinDuration])
  
  // Call onSpinCompleted when spin animation finishes
  useEffect(() => {
    if (prevIsSpinningRef.current && !isSpinning && onSpinCompleted) {
      console.log('Pokemon wheel spin completed - calling onSpinCompleted')
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

  // Show empty wheel when no Pokemon are selected
  if (pokemon.length === 0) {
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
              No Pokemon Selected
            </text>
            <text
              x={centerX}
              y={centerY + 10}
              fill="#9ca3af"
              fontSize="14"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Select Pokemon to start spinning
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
          transform: `rotate(${isSpinning ? currentRotation : rotation}deg)`,
        }}
      >
        <svg width={wheelSize} height={wheelSize} className="drop-shadow-2xl">
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

            // Use theme colors for the segment (cycle through theme colors)
            const themeColorIndex = index % themeColors.length
            const segmentColor = themeColors[themeColorIndex]

            return (
              <g key={poke.id}>
                <path 
                  d={pathData} 
                  fill={segmentColor} 
                  stroke="#ffffff" 
                  strokeWidth="2" 
                  opacity={0.9} 
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
                    {poke.emoji} {poke.name.length > 8 ? poke.name.substring(0, 6) + "..." : poke.name}
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
                    {poke.emoji}
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
                    {poke.name.length > 12 ? poke.name.substring(0, 10) + "..." : poke.name}
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
