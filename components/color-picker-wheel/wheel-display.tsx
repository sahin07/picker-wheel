"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Trophy, Share2 } from "lucide-react"

interface WheelDisplayProps {
  segments: Array<{
    label: string
    color: string
    angle: number
    startAngle: number
  }>
  wheelBackground: string
  rotation: number
  isSpinning: boolean
  wheelShake: boolean
  showParticles: boolean
  activeTab: string
  onSpin: () => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  showStats: boolean
  setShowStats: (show: boolean) => void
  onShare: () => void
  lastResult: any
  wheelTheme: string
  setWheelTheme: (theme: string) => void
  isFullScreen?: boolean
}

export function WheelDisplay({
  segments,
  wheelBackground,
  rotation,
  isSpinning,
  wheelShake,
  showParticles,
  activeTab,
  onSpin,
  soundEnabled,
  setSoundEnabled,
  showStats,
  setShowStats,
  onShare,
  lastResult,
  wheelTheme,
  setWheelTheme,
  isFullScreen = false
}: WheelDisplayProps) {
  const [showThemeSelector, setShowThemeSelector] = useState(false)

  const themes = [
    { name: "classic", label: "Classic" },
    { name: "neon", label: "Neon" },
    { name: "ocean", label: "Ocean" },
    { name: "sunset", label: "Sunset" },
    { name: "forest", label: "Forest" }
  ]

  return (
    <div className="relative">
      {/* Main Wheel */}
      <div className="relative">
        <div
          className={`w-[600px] h-[600px] rounded-full transition-transform duration-300 ${
            wheelShake ? "animate-pulse" : ""
          }`}
          style={{
            background: wheelBackground,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "none" : "transform 0.3s ease-out"
          }}
        >
          {/* Wheel segments for manual/image mode */}
          {segments.length > 0 && activeTab !== "color-wheel" && (
            <svg
              className="w-full h-full absolute inset-0"
              viewBox="0 0 100 100"
              style={{ transform: "rotate(-90deg)" }}
            >
              {segments.map((segment, index) => {
                const centerAngle = segment.startAngle + segment.angle / 2;
                const textRadius = 42; // Increased radius for text positioning
                const textX = 50 + textRadius * Math.cos((centerAngle * Math.PI) / 180);
                const textY = 50 + textRadius * Math.sin((centerAngle * Math.PI) / 180);
                
                return (
                  <g key={index}>
                    <path
                      d={`M 50 50 L ${50 + 50 * Math.cos((segment.startAngle * Math.PI) / 180)} ${50 + 50 * Math.sin((segment.startAngle * Math.PI) / 180)} A 50 50 0 0 1 ${50 + 50 * Math.cos(((segment.startAngle + segment.angle) * Math.PI) / 180)} ${50 + 50 * Math.sin(((segment.startAngle + segment.angle) * Math.PI) / 180)} Z`}
                      fill={segment.color}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    {/* Text label - Horizontal orientation */}
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-bold fill-white"
                      style={{
                        fontSize: "2.5px",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                        transform: `rotate(${centerAngle}deg)`,
                        transformOrigin: `${textX}px ${textY}px`
                      }}
                    >
                      {segment.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {/* Center Spin Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={onSpin}
              disabled={isSpinning}
              className={`w-20 h-20 rounded-full bg-black text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 ${
                isSpinning ? "animate-spin" : ""
              }`}
            >
              {isSpinning ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                "SPIN"
              )}
            </Button>
          </div>
        </div>

        {/* Fixed Pointer - Outside the rotating wheel */}
        <svg 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-50 drop-shadow-2xl" 
          width="40" 
          height="40" 
          viewBox="0 0 40 40"
          style={{filter: 'drop-shadow(0 0 4px white)'}}
        >
          <polygon 
            points="0,0 40,0 20,40" 
            fill="#ffffff" 
            stroke="#000000" 
            strokeWidth="2"
          />
        </svg>

        {/* Particles effect */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex justify-center space-x-4 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="hover:scale-110 transition-transform"
          title={soundEnabled ? "Mute Sound" : "Unmute Sound"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowStats(!showStats)}
          className="hover:scale-110 transition-transform"
          title={showStats ? "Hide Stats" : "Show Stats"}
        >
          <Trophy className="h-4 w-4" />
        </Button>

        {lastResult && (
          <Button
            variant="outline"
            size="icon"
            onClick={onShare}
            className="hover:scale-110 transition-transform"
            title="Share Result"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Theme selector */}
      {showThemeSelector && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border rounded-lg shadow-lg p-2 z-20">
          <div className="grid grid-cols-1 gap-1">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => {
                  setWheelTheme(theme.name)
                  setShowThemeSelector(false)
                }}
                className={`px-3 py-1 text-sm rounded ${
                  wheelTheme === theme.name
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 