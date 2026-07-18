"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Palette, Image, Volume2, Sparkles } from "lucide-react"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spinSpeed: number[]
  spinDuration: number[]
  enableSound: boolean
  enableConfetti: boolean
  backgroundColor: string
  backgroundImage?: string
  onSpinSpeedChange: (value: number[]) => void
  onSpinDurationChange: (value: number[]) => void
  onSoundChange: (value: boolean) => void
  onConfettiChange: (value: boolean) => void
  onBackgroundColorChange: (value: string) => void
  onBackgroundImageChange?: (value: string) => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  spinSpeed,
  spinDuration,
  enableSound,
  enableConfetti,
  backgroundColor,
  backgroundImage = "",
  onSpinSpeedChange,
  onSpinDurationChange,
  onSoundChange,
  onConfettiChange,
  onBackgroundColorChange,
  onBackgroundImageChange,
}: SettingsDialogProps) {
  const presetColors = [
    "#f8fafc", // Light gray
    "#ffffff", // White
    "#1e293b", // Dark blue
    "#0f172a", // Darker blue
    "#fef3c7", // Light yellow
    "#fce7f3", // Light pink
    "#dbeafe", // Light blue
    "#dcfce7", // Light green
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-800 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Wheel Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Spin Speed */}
          <div>
            <Label className="text-sm font-medium mb-2 block text-gray-800">Spin Speed</Label>
            <Slider value={spinSpeed} onValueChange={onSpinSpeedChange} max={10} min={1} step={1} className="w-full" />
            <div className="text-xs text-gray-600 mt-1">Level {spinSpeed[0]}</div>
          </div>

          {/* Spin Duration */}
          <div>
            <Label className="text-sm font-medium mb-2 block text-gray-800">Spin Duration</Label>
            <Slider
              value={spinDuration}
              onValueChange={onSpinDurationChange}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">{spinDuration[0]} seconds</div>
          </div>

          {/* Sound Settings */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-600" />
              <Label htmlFor="sound" className="text-gray-800">
                Enable Sound
              </Label>
            </div>
            <Switch id="sound" checked={enableSound} onCheckedChange={onSoundChange} />
          </div>

          {/* Confetti Settings */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gray-600" />
              <Label htmlFor="confetti" className="text-gray-800">
                Enable Confetti
              </Label>
            </div>
            <Switch id="confetti" checked={enableConfetti} onCheckedChange={onConfettiChange} />
          </div>

          {/* Background Color */}
          <div>
            <Label className="text-sm font-medium mb-2 block text-gray-800">Background Color</Label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    backgroundColor === color ? "border-blue-500 scale-110" : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onBackgroundColorChange(color)}
                  title={color}
                />
              ))}
            </div>
            <Input
              type="color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="w-full h-10"
            />
          </div>

          {/* Background Image */}
          {onBackgroundImageChange && (
            <div>
              <Label className="text-sm font-medium mb-2 block text-gray-800 flex items-center gap-2">
                <Image className="w-4 h-4" />
                Background Image URL
              </Label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={backgroundImage}
                onChange={(e) => onBackgroundImageChange(e.target.value)}
                className="w-full"
              />
              {backgroundImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBackgroundImageChange("")}
                  className="mt-2"
                >
                  Clear Image
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
