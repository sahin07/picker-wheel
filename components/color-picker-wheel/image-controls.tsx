"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Settings, Volume2, VolumeX, Upload, Plus, Trash2, Edit3 } from "lucide-react"

interface ImageControlsProps {
  customColors: Array<{
    id: string
    color: string
    name: string
    enabled: boolean
  }>
  setCustomColors: (colors: Array<{
    id: string
    color: string
    name: string
    enabled: boolean
  }>) => void
  onReset: () => void
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  confettiEnabled: boolean
  setConfettiEnabled: (enabled: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  resultShowMode: {
    color: boolean
    text: boolean
    hex: boolean
    rgb: boolean
  }
  setResultShowMode: (mode: {
    color: boolean
    text: boolean
    hex: boolean
    rgb: boolean
  }) => void
}

export function ImageControls({
  customColors,
  setCustomColors,
  onReset,
  showSettings,
  setShowSettings,
  confettiEnabled,
  setConfettiEnabled,
  soundEnabled,
  setSoundEnabled,
  resultShowMode,
  setResultShowMode
}: ImageControlsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<Array<{ color: string; name: string }>>([])
  const [editingColor, setEditingColor] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulated color extraction from image
  const extractColorsFromImage = (imageUrl: string) => {
    // In a real implementation, you would use a color extraction library
    // For now, we'll simulate with some random colors
    const simulatedColors = [
      { color: "#FF6B6B", name: "Coral Red" },
      { color: "#4ECDC4", name: "Turquoise" },
      { color: "#45B7D1", name: "Sky Blue" },
      { color: "#96CEB4", name: "Mint Green" },
      { color: "#FFEAA7", name: "Cream Yellow" },
      { color: "#DDA0DD", name: "Plum Purple" }
    ]
    setExtractedColors(simulatedColors)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setSelectedImage(imageUrl)
        extractColorsFromImage(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const addColorFromImage = (color: { color: string; name: string }) => {
    const newColorObj = {
      id: Date.now().toString(),
      color: color.color,
      name: color.name,
      enabled: true
    }
    setCustomColors([...customColors, newColorObj])
  }

  const addAllColorsFromImage = () => {
    const newColors = extractedColors.map(color => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      color: color.color,
      name: color.name,
      enabled: true
    }))
    setCustomColors([...customColors, ...newColors])
  }

  const removeColor = (id: string) => {
    setCustomColors(customColors.filter(color => color.id !== id))
  }

  const toggleColor = (id: string) => {
    setCustomColors(customColors.map(color => 
      color.id === id ? { ...color, enabled: !color.enabled } : color
    ))
  }

  const updateColorName = (id: string, name: string) => {
    setCustomColors(customColors.map(color => 
      color.id === id ? { ...color, name } : color
    ))
    setEditingColor(null)
  }

  return (
    <div className="space-y-4">
      {/* Image Upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              New Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          {selectedImage && (
            <div className="mt-3">
              <img
                src={selectedImage}
                alt="Uploaded"
                className="max-w-full h-32 object-cover rounded border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extracted Colors */}
      {extractedColors.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Extracted Colors</span>
              <Button
                variant="outline"
                size="sm"
                onClick={addAllColorsFromImage}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Insert All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {extractedColors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => addColorFromImage(color)}
                >
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color.color }}
                  />
                  <span className="text-sm font-medium">{color.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Colors List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Image Colors ({customColors.filter(c => c.enabled).length} enabled)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {customColors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No colors extracted yet. Upload an image to get started!</p>
            ) : (
              customColors.map((color) => (
                <div
                  key={color.id}
                  className={`flex items-center gap-3 p-2 rounded border ${
                    color.enabled ? 'bg-white' : 'bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={color.enabled}
                    onChange={() => toggleColor(color.id)}
                    className="w-4 h-4"
                  />
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color.color }}
                  />
                  {editingColor === color.id ? (
                    <Input
                      value={color.name}
                      onChange={(e) => updateColorName(color.id, e.target.value)}
                      onBlur={() => setEditingColor(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingColor(null)}
                      className="flex-1"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 font-medium">{color.name}</span>
                  )}
                  <code className="text-sm text-gray-600">{color.color}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingColor(color.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColor(color.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Result Show Mode */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Result Show Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-color-image"
              checked={resultShowMode.color}
              onChange={(e) => setResultShowMode({ ...resultShowMode, color: e.target.checked })}
              disabled
            />
            <Label htmlFor="show-color-image">Color (mandatory)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-text-image"
              checked={resultShowMode.text}
              onChange={(e) => setResultShowMode({ ...resultShowMode, text: e.target.checked })}
            />
            <Label htmlFor="show-text-image">Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-hex-image"
              checked={resultShowMode.hex}
              onChange={(e) => setResultShowMode({ ...resultShowMode, hex: e.target.checked })}
            />
            <Label htmlFor="show-hex-image">HEX</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-rgb-image"
              checked={resultShowMode.rgb}
              onChange={(e) => setResultShowMode({ ...resultShowMode, rgb: e.target.checked })}
            />
            <Label htmlFor="show-rgb-image">RGB</Label>
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