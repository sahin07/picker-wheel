"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { RotateCcw, Volume2, VolumeX } from "lucide-react"
import type { ColorResultShowMode } from "@/lib/color-formats"
import { formatAlpha } from "@/lib/color-formats"

interface ColorWheelControlsProps {
  colorCombination: string
  setColorCombination: (combination: string) => void
  spinningPointerMode: "manual" | "random"
  setSpinningPointerMode: (mode: "manual" | "random") => void
  selectedColor: string
  setSelectedColor: (color: string) => void
  onReset: () => void
  confettiEnabled: boolean
  setConfettiEnabled: (enabled: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  resultShowMode: ColorResultShowMode
  setResultShowMode: (mode: ColorResultShowMode) => void
  colorAlpha: number
  setColorAlpha: (alpha: number) => void
}

export function ColorWheelControls({
  colorCombination,
  setColorCombination,
  spinningPointerMode,
  setSpinningPointerMode,
  selectedColor,
  setSelectedColor,
  onReset,
  confettiEnabled,
  setConfettiEnabled,
  soundEnabled,
  setSoundEnabled,
  resultShowMode,
  setResultShowMode,
  colorAlpha,
  setColorAlpha,
}: ColorWheelControlsProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colorCombinations = [
    { value: "single", label: "Single", description: "One color only." },
    { value: "monochromatic", label: "Monochromatic", description: "Shades of one color." },
    { value: "complementary", label: "Complementary", description: "Opposite colors." },
    { value: "split-complementary", label: "Split-Complementary", description: "Opposite pair with a twist." },
    { value: "analogous", label: "Analogous", description: "Neighboring colors." },
    { value: "triadic", label: "Triadic", description: "Three evenly spaced colors." },
    { value: "tetradic", label: "Tetradic", description: "Two complementary pairs." },
    { value: "square", label: "Square", description: "Four evenly spaced colors." }
  ]

  const spinningModes = [
    { value: "manual", label: "Manual" },
    { value: "random", label: "Random" }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color Combination */}
        <div className="space-y-2">
          <Label htmlFor="color-combination">Choose Output Color Combination</Label>
          <Select value={colorCombination} onValueChange={setColorCombination}>
            <SelectTrigger>
              <SelectValue placeholder="Select color combination" />
            </SelectTrigger>
            <SelectContent>
              {colorCombinations.map((combination) => (
                <SelectItem key={combination.value} value={combination.value}>
                  <div>
                    <div className="font-medium">{combination.label}</div>
                    <div className="text-xs text-gray-500">{combination.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Spinning Pointer Mode */}
        <div className="space-y-2">
          <Label htmlFor="spinning-mode">Set Spinning Pointer Mode</Label>
          <Select value={spinningPointerMode} onValueChange={(value: "manual" | "random") => setSpinningPointerMode(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select spinning mode" />
            </SelectTrigger>
            <SelectContent>
              {spinningModes.map((mode) => (
                <SelectItem key={mode.value} value={mode.value}>
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Interactive Color Wheel */}
      <div className="space-y-2">
        <Label>Primary Color Selection</Label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full border-2 border-gray-300 cursor-pointer relative overflow-hidden"
              style={{
                background: "conic-gradient(from 0deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))"
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2
                const clickX = e.clientX
                const clickY = e.clientY
                
                // Calculate angle from center
                const deltaX = clickX - centerX
                const deltaY = clickY - centerY
                const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
                const normalizedAngle = (angle + 360) % 360
                
                // Convert angle to HSL and then to HEX
                const hue = normalizedAngle
                const saturation = 100
                const lightness = 50
                
                // Convert HSL to HEX
                const h = hue / 360
                const s = saturation / 100
                const l = lightness / 100
                
                const c = (1 - Math.abs(2 * l - 1)) * s
                const x = c * (1 - Math.abs((h * 6) % 2 - 1))
                const m = l - c / 2
                let r = 0, g = 0, b = 0
                
                if (0 <= h && h < 1/6) {
                  r = c; g = x; b = 0
                } else if (1/6 <= h && h < 2/6) {
                  r = x; g = c; b = 0
                } else if (2/6 <= h && h < 3/6) {
                  r = 0; g = c; b = x
                } else if (3/6 <= h && h < 4/6) {
                  r = 0; g = x; b = c
                } else if (4/6 <= h && h < 5/6) {
                  r = x; g = 0; b = c
                } else if (5/6 <= h && h <= 1) {
                  r = c; g = 0; b = x
                }
                
                const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0')
                const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0')
                const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0')
                
                setSelectedColor(`#${rHex}${gHex}${bHex}`)
              }}
            >
              {/* Color pointer indicators based on combination */}
              {(() => {
                const pointers = []
                // Convert HEX to HSL to get the hue
                const hex = selectedColor.replace('#', '')
                const r = parseInt(hex.substr(0, 2), 16) / 255
                const g = parseInt(hex.substr(2, 2), 16) / 255
                const b = parseInt(hex.substr(4, 2), 16) / 255
                const max = Math.max(r, g, b)
                const min = Math.min(r, g, b)
                let baseHue = 0
                
                if (max !== min) {
                  const d = max - min
                  switch (max) {
                    case r:
                      baseHue = (g - b) / d + (g < b ? 6 : 0)
                      break
                    case g:
                      baseHue = (b - r) / d + 2
                      break
                    case b:
                      baseHue = (r - g) / d + 4
                      break
                  }
                  baseHue *= 60
                }
                
                // Always show the primary color pointer
                pointers.push(
                                     <div
                     key="primary"
                     className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                     style={{
                       top: '50%',
                       left: '50%',
                       transform: 'translate(-50%, -50%)',
                       marginTop: '-12px',
                       marginLeft: '-12px'
                     }}
                   />
                )
                
                // Add additional pointers based on color combination
                switch (colorCombination) {
                  case "complementary":
                    pointers.push(
                                             <div
                         key="complementary"
                         className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                         style={{
                           top: '50%',
                           left: '50%',
                           transform: `translate(-50%, -50%) rotate(${(baseHue + 180) % 360}deg) translateY(-12px)`,
                         }}
                       />
                    )
                    break
                  case "split-complementary":
                    pointers.push(
                                             <div
                         key="split1"
                         className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                         style={{
                           top: '50%',
                           left: '50%',
                           transform: `translate(-50%, -50%) rotate(${(baseHue + 150) % 360}deg) translateY(-12px)`,
                         }}
                       />,
                       <div
                         key="split2"
                         className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                         style={{
                           top: '50%',
                           left: '50%',
                           transform: `translate(-50%, -50%) rotate(${(baseHue + 210) % 360}deg) translateY(-12px)`,
                         }}
                       />
                    )
                    break
                  case "triadic":
                    pointers.push(
                                             <div
                         key="triadic1"
                         className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                         style={{
                           top: '50%',
                           left: '50%',
                           transform: `translate(-50%, -50%) rotate(${(baseHue + 120) % 360}deg) translateY(-12px)`,
                         }}
                       />,
                       <div
                         key="triadic2"
                         className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                         style={{
                           top: '50%',
                           left: '50%',
                           transform: `translate(-50%, -50%) rotate(${(baseHue + 240) % 360}deg) translateY(-12px)`,
                         }}
                       />
                    )
                    break
                  case "analogous":
                    pointers.push(
                                             <div
                         key="analogous1"
                         className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                         style={{
                           top: '50%',
                           left: '50%',
                           transform: `translate(-50%, -50%) rotate(${(baseHue - 30 + 360) % 360}deg) translateY(-12px)`,
                         }}
                       />,
                       <div
                         key="analogous2"
                         className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                         style={{
                           top: '50%',
                           left: '50%',
                           transform: `translate(-50%, -50%) rotate(${(baseHue + 30) % 360}deg) translateY(-12px)`,
                         }}
                       />
                    )
                    break
                  case "tetradic":
                  case "square":
                    pointers.push(
                                             <div
                         key="tetradic1"
                         className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                         style={{
                           top: '50%',
                           left: '50%',
                           transform: `translate(-50%, -50%) rotate(${(baseHue + 90) % 360}deg) translateY(-12px)`,
                         }}
                       />,
                       <div
                         key="tetradic2"
                         className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                         style={{
                           top: '50%',
                           left: '50%',
                           transform: `translate(-50%, -50%) rotate(${(baseHue + 180) % 360}deg) translateY(-12px)`,
                         }}
                       />,
                       <div
                         key="tetradic3"
                         className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                         style={{
                           top: '50%',
                           left: '50%',
                           transform: `translate(-50%, -50%) rotate(${(baseHue + 270) % 360}deg) translateY(-12px)`,
                         }}
                       />
                    )
                    break
                }
                
                return pointers
              })()}
            </div>
          </div>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-12 h-12 border rounded cursor-pointer"
          />
          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {selectedColor}
          </code>
        </div>
        <p className="text-xs text-gray-500">Click on the color wheel to select a color</p>
      </div>

      {/* Result Show Mode */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Result Show Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-color"
              checked={resultShowMode.color}
              onChange={(e) => setResultShowMode({ ...resultShowMode, color: e.target.checked })}
              disabled
            />
            <Label htmlFor="show-color">Color (mandatory)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-text"
              checked={resultShowMode.text}
              onChange={(e) => setResultShowMode({ ...resultShowMode, text: e.target.checked })}
            />
            <Label htmlFor="show-text">Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-hex"
              checked={resultShowMode.hex}
              onChange={(e) => setResultShowMode({ ...resultShowMode, hex: e.target.checked })}
            />
            <Label htmlFor="show-hex">HEX</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-rgb"
              checked={resultShowMode.rgb}
              onChange={(e) => setResultShowMode({ ...resultShowMode, rgb: e.target.checked })}
            />
            <Label htmlFor="show-rgb">RGB</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-rgba"
              checked={resultShowMode.rgba}
              onChange={(e) => setResultShowMode({ ...resultShowMode, rgba: e.target.checked })}
            />
            <Label htmlFor="show-rgba">RGBA</Label>
          </div>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="color-alpha">Alpha (opacity)</Label>
              <span className="font-mono text-xs text-slate-500">{formatAlpha(colorAlpha)}</span>
            </div>
            <Slider
              id="color-alpha"
              min={0}
              max={100}
              step={1}
              value={[Math.round(colorAlpha * 100)]}
              onValueChange={(value) => setColorAlpha((value[0] ?? 100) / 100)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Wheel
        </Button>
        <Button
          variant="outline"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-2"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {soundEnabled ? "Mute" : "Unmute"}
        </Button>
      </div>
    </div>
  )
} 