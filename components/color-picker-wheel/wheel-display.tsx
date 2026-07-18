"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"

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
  isFullScreen?: boolean
  onToggleFullscreen?: () => void
  wheelTheme?: string
}

const THEME_RING: Record<string, string> = {
  classic: "ring-slate-200",
  neon: "ring-fuchsia-400 shadow-[0_0_24px_rgba(232,121,249,0.45)]",
  ocean: "ring-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.35)]",
  sunset: "ring-orange-400 shadow-[0_0_24px_rgba(251,146,60,0.4)]",
  forest: "ring-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.35)]",
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
  isFullScreen = false,
  onToggleFullscreen,
  wheelTheme = "classic",
}: WheelDisplayProps) {
  const { settings } = useSettingsStore()
  const soundGloballyOff = !settings.confettiSound.enableSound
  const canClickSpin = !isSpinning
  const ringClass = THEME_RING[wheelTheme] || THEME_RING.classic

  return (
    <div className="relative w-full max-w-[680px]">
      <div
        className={`relative mx-auto cursor-pointer ${canClickSpin ? "" : "cursor-default"}`}
        style={{ width: "min(100%, 680px)" }}
        onClick={canClickSpin ? onSpin : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (canClickSpin && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault()
            onSpin()
          }
        }}
        aria-label={isSpinning ? "Wheel spinning" : "Spin the color wheel"}
      >
        <div
          className={`relative aspect-square w-full rounded-full ring-4 transition-shadow duration-300 ${ringClass} ${
            wheelShake ? "animate-pulse" : ""
          }`}
          style={{
            background: wheelBackground,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "none" : "transform 0.3s ease-out",
          }}
        >
          {segments.length > 0 && activeTab !== "color-wheel" && (
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              style={{ transform: "rotate(-90deg)" }}
            >
              {segments.map((segment, index) => {
                const centerAngle = segment.startAngle + segment.angle / 2
                const textRadius = 42
                const textX = 50 + textRadius * Math.cos((centerAngle * Math.PI) / 180)
                const textY = 50 + textRadius * Math.sin((centerAngle * Math.PI) / 180)

                return (
                  <g key={index}>
                    <path
                      d={`M 50 50 L ${50 + 50 * Math.cos((segment.startAngle * Math.PI) / 180)} ${50 + 50 * Math.sin((segment.startAngle * Math.PI) / 180)} A 50 50 0 0 1 ${50 + 50 * Math.cos(((segment.startAngle + segment.angle) * Math.PI) / 180)} ${50 + 50 * Math.sin(((segment.startAngle + segment.angle) * Math.PI) / 180)} Z`}
                      fill={segment.color}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-xs font-bold"
                      style={{
                        fontSize: "2.5px",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                        transform: `rotate(${centerAngle}deg)`,
                        transformOrigin: `${textX}px ${textY}px`,
                      }}
                    >
                      {segment.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                if (canClickSpin) onSpin()
              }}
              disabled={isSpinning}
              className={`h-20 w-20 rounded-full bg-black font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 ${
                isSpinning ? "animate-spin" : ""
              }`}
            >
              {isSpinning ? (
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white" />
              ) : (
                "SPIN"
              )}
            </Button>
          </div>
        </div>

        <svg
          className="absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-1 drop-shadow-2xl"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          style={{ filter: "drop-shadow(0 0 4px white)" }}
          aria-hidden
        >
          <polygon points="0,0 40,0 20,40" fill="#ffffff" stroke="#000000" strokeWidth="2" />
        </svg>

        {showParticles && (
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-2 w-2 animate-ping rounded-full bg-yellow-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-20 flex flex-col space-y-2">
          <Button
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
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFullscreen()
              }}
              className="h-10 w-10 bg-white/90 p-0 shadow-md hover:bg-white"
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {isSpinning && (
          <div className="absolute right-4 top-4 z-20 animate-pulse rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
            Spinning...
          </div>
        )}
      </div>
    </div>
  )
}
