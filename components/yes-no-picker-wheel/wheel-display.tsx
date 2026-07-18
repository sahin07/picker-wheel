"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Maximize2, Minimize2, Share2 } from "lucide-react"
import { useState } from "react"

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
  lastResult: string | null
  wheelTheme: string
  setWheelTheme: (theme: string) => void
  themeEffects?: {
    particles: boolean
    glow: boolean
    sparkle: boolean
    rainbow: boolean
    gradient: boolean
  }
  themeAnimations?: {
    spinSpeed: number
    bounce: boolean
    pulse: boolean
    shake: boolean
  }
}

// Theme colors are now handled by the parent component

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
  themeEffects,
  themeAnimations,
}: WheelDisplayProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(err => {
        console.log('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch(err => {
        console.log('Error attempting to exit fullscreen:', err)
      })
    }
  }
  return (
    <div className="flex flex-col items-center space-y-4 relative z-20">
      <style jsx>{`
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="relative">
        {/* Particle Effects */}
        {(showParticles || themeEffects?.particles) && (
          <div className="absolute inset-0 pointer-events-none z-0">
            {[...Array(themeEffects?.particles ? 30 : 20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full animate-ping ${
                  themeEffects?.sparkle ? 'bg-yellow-300' : 'bg-white'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Wheel */}
        <div
          className={`relative w-[500px] h-[500px] rounded-full overflow-hidden shadow-2xl transition-all duration-3000 ease-out ${
            wheelShake || themeAnimations?.shake ? "animate-pulse" : ""
          } ${isSpinning ? "shadow-2xl shadow-purple-500/50" : ""} ${
            activeTab === "ai" ? "ring-4 ring-purple-300 ring-opacity-50" : ""
          } ${themeAnimations?.bounce ? "animate-bounce" : ""} ${
            themeAnimations?.pulse ? "animate-pulse" : ""
          }`}
          style={{
            transform: `rotate(${rotation}deg) ${wheelShake || themeAnimations?.shake ? "scale(1.05)" : "scale(1)"}`,
            background: wheelBackground,
            boxShadow: isSpinning ? "0 0 50px rgba(168, 85, 247, 0.5)" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            filter: themeEffects?.glow ? "drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))" : "none",
          }}
        >
          {/* Segment Labels */}
          {segments.map((segment, index) => {
            const segmentCenter = segment.startAngle + segment.angle / 2
            const radius = 187 // Distance from center (increased for larger wheel)
            const radian = (segmentCenter * Math.PI) / 180
            const x = Math.cos(radian - Math.PI / 2) * radius
            const y = Math.sin(radian - Math.PI / 2) * radius

            return (
                             <div
                 key={`${segment.label}-${index}`}
                 className="absolute text-white font-bold text-xl drop-shadow-lg pointer-events-none"
                 style={{
                   left: "50%",
                   top: "50%",
                   transform: `translate(${x - 25}px, ${y - 12}px)`,
                   width: "50px",
                   height: "25px",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   fontSize: segments.length > 6 ? "18px" : "22px",
                 }}
               >
                {segment.label}
              </div>
            )
          })}

          {/* Glowing ring effect when spinning */}
          {(isSpinning || themeEffects?.glow) && (
            <div className={`absolute inset-0 rounded-full border-4 border-white/30 ${
              themeEffects?.rainbow ? 'animate-pulse' : 'animate-pulse'
            }`} style={{
              borderColor: themeEffects?.rainbow ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
              background: themeEffects?.rainbow ? 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)' : 'transparent',
              backgroundSize: themeEffects?.rainbow ? '400% 400%' : 'auto',
              animation: themeEffects?.rainbow ? 'rainbow 2s ease-in-out infinite' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}></div>
          )}
        </div>

        {/* Center Spin Button */}
        <Button
          onClick={onSpin}
          disabled={isSpinning}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full ${
            activeTab === "ai"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          } text-white font-bold text-2xl z-10 shadow-lg transition-all duration-300 ${
            isSpinning ? "scale-95" : "hover:scale-110"
          }`}
        >
          {isSpinning ? "🌟" : activeTab === "ai" ? "🧠" : "SPIN"}
        </Button>

        {/* Pointer */}
        <svg 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-50 drop-shadow-2xl" 
          width="40" 
          height="40" 
          viewBox="0 0 40 40"
          style={{filter: 'drop-shadow(0 0 4px white)'}}
        >
          <polygon 
            points="0,0 40,0 20,40" 
            fill="#dc2626" 
            stroke="#ffffff" 
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-2">
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
          onClick={toggleFullscreen}
          className="hover:scale-110 transition-transform"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
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

      {/* Theme selector moved to main component */}
    </div>
  )
} 