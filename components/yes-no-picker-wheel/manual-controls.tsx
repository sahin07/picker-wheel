"use client"

import { Button } from "@/components/ui/button"
import { Eye, RotateCcw, Settings } from "lucide-react"

interface ManualControlsProps {
  mode: "yes-no" | "yes-no-maybe"
  setMode: (mode: "yes-no" | "yes-no-maybe") => void
  inputSets: number
  setInputSets: (sets: number) => void
  showStats: boolean
  setShowStats: (show: boolean) => void
  onReset: () => void
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  confettiEnabled: boolean
  setConfettiEnabled: (enabled: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
}

export function ManualControls({
  mode,
  setMode,
  inputSets,
  setInputSets,
  showStats,
  setShowStats,
  onReset,
  showSettings,
  setShowSettings,
  confettiEnabled,
  setConfettiEnabled,
  soundEnabled,
  setSoundEnabled,
}: ManualControlsProps) {
  return (
    <div className="space-y-4 mt-4">
      <div className="mb-4">
        <h3 className="font-semibold">MANUAL INPUTS</h3>
      </div>

      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Mode</label>
        <div className="flex space-x-2">
          <Button
            variant={mode === "yes-no" ? "default" : "outline"}
            onClick={() => setMode("yes-no")}
            className="relative z-30 flex-1 hover:scale-105 transition-transform"
          >
            YES or NO
          </Button>
          <Button
            variant={mode === "yes-no-maybe" ? "default" : "outline"}
            onClick={() => setMode("yes-no-maybe")}
            className="relative z-30 flex-1 hover:scale-105 transition-transform"
          >
            YES NO or MAYBE
          </Button>
        </div>
      </div>

      {/* Number of Input Sets */}
      <div>
        <label className="block text-sm font-medium mb-2">Number of Input Sets</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <Button
              key={num}
              variant={inputSets === num ? "default" : "outline"}
              onClick={() => setInputSets(num)}
              className="relative z-30 w-12 h-12 hover:scale-110 transition-transform"
            >
              {num}
            </Button>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-4 pt-4 border-t space-y-4">
          <h4 className="font-medium">🎛️ Tool Settings</h4>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={confettiEnabled}
                  onChange={(e) => setConfettiEnabled(e.target.checked)}
                />
                <span>Confetti Effects</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                <span>Sound Effects</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 