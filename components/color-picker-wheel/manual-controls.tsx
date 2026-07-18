"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw, Settings, Volume2, VolumeX, Plus, Trash2, Edit3, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ManualControlsProps {
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

export function ManualControls({
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
}: ManualControlsProps) {
  const [newColorName, setNewColorName] = useState("")
  const [newColorValue, setNewColorValue] = useState("#FF0000")

  // Different color palettes for each section
  const pwColors = [
    { name: "Red", color: "#FF0000" },
    { name: "Orange", color: "#FFA500" },
    { name: "Yellow", color: "#FFFF00" },
    { name: "Green", color: "#008000" },
    { name: "Blue", color: "#0000FF" },
    { name: "Purple", color: "#800080" },
    { name: "Black", color: "#000000" },
    { name: "White", color: "#FFFFFF" }
  ]

  const pwColors2 = [
    { name: "Crimson", color: "#DC143C" },
    { name: "Coral", color: "#FF7F50" },
    { name: "Gold", color: "#FFD700" },
    { name: "Lime", color: "#32CD32" },
    { name: "Navy", color: "#000080" },
    { name: "Violet", color: "#8A2BE2" },
    { name: "Gray", color: "#808080" },
    { name: "Silver", color: "#C0C0C0" }
  ]

  const basicColors = [
    { name: "Pink", color: "#FFC0CB" },
    { name: "Brown", color: "#A52A2A" },
    { name: "Teal", color: "#008080" },
    { name: "Indigo", color: "#4B0082" },
    { name: "Maroon", color: "#800000" },
    { name: "Olive", color: "#808000" },
    { name: "Cyan", color: "#00FFFF" },
    { name: "Magenta", color: "#FF00FF" }
  ]

  const themeColors = {
    "Birthday": [
      { name: "Pink", color: "#FFB6C1" },
      { name: "Blue", color: "#87CEEB" },
      { name: "Yellow", color: "#F0E68C" },
      { name: "Purple", color: "#DDA0DD" },
      { name: "Green", color: "#98FB98" },
      { name: "Brown", color: "#DEB887" },
      { name: "Gray", color: "#D3D3D3" },
      { name: "Orange", color: "#FFA07A" }
    ],
    "Coffee Shop": [
      { name: "Brown", color: "#8B4513" },
      { name: "Cream", color: "#F5F5DC" },
      { name: "Dark Red", color: "#8B0000" },
      { name: "Beige", color: "#F5F5DC" },
      { name: "Dark Brown", color: "#654321" },
      { name: "Light Brown", color: "#D2B48C" },
      { name: "Coffee", color: "#6F4E37" },
      { name: "Mocha", color: "#967969" }
    ],
    "Creamy": [
      { name: "Ivory", color: "#FFFFF0" },
      { name: "Beige", color: "#F5F5DC" },
      { name: "Wheat", color: "#F5DEB3" },
      { name: "Bisque", color: "#FFE4C4" },
      { name: "Cream", color: "#FFFDD0" },
      { name: "Pearl", color: "#F0EAD6" },
      { name: "Vanilla", color: "#F3E5AB" },
      { name: "Almond", color: "#EFDECD" }
    ],
    "Forest": [
      { name: "Dark Green", color: "#006400" },
      { name: "Forest Green", color: "#228B22" },
      { name: "Olive", color: "#808000" },
      { name: "Sage", color: "#9CAF88" },
      { name: "Moss", color: "#8A9A5B" },
      { name: "Pine", color: "#2F4F4F" },
      { name: "Brown", color: "#8B4513" },
      { name: "Black", color: "#000000" }
    ],
    "Fun Fair": [
      { name: "Red", color: "#FF0000" },
      { name: "Orange", color: "#FFA500" },
      { name: "Yellow", color: "#FFFF00" },
      { name: "Green", color: "#00FF00" },
      { name: "Blue", color: "#0000FF" },
      { name: "Purple", color: "#800080" },
      { name: "Pink", color: "#FFC0CB" },
      { name: "Light Blue", color: "#87CEEB" }
    ],
    "Nature": [
      { name: "Teal", color: "#008080" },
      { name: "Green", color: "#228B22" },
      { name: "Yellow Green", color: "#9ACD32" },
      { name: "Brown", color: "#8B4513" },
      { name: "Tan", color: "#D2B48C" },
      { name: "Gray", color: "#808080" },
      { name: "Olive", color: "#808000" },
      { name: "Sage", color: "#9CAF88" }
    ],
    "Neon": [
      { name: "Neon Red", color: "#FF1744" },
      { name: "Neon Orange", color: "#FF6F00" },
      { name: "Neon Yellow", color: "#FFEB3B" },
      { name: "Neon Green", color: "#00E676" },
      { name: "Neon Blue", color: "#2196F3" },
      { name: "Neon Purple", color: "#9C27B0" },
      { name: "Neon Pink", color: "#E91E63" },
      { name: "Neon Cyan", color: "#00BCD4" }
    ],
    "Ocean": [
      { name: "Deep Blue", color: "#000080" },
      { name: "Ocean Blue", color: "#006994" },
      { name: "Turquoise", color: "#40E0D0" },
      { name: "Coral", color: "#FF7F50" },
      { name: "Sand", color: "#F4A460" },
      { name: "Seafoam", color: "#98FF98" },
      { name: "Navy", color: "#000080" },
      { name: "Aqua", color: "#00FFFF" }
    ],
    "Soft": [
      { name: "Soft Pink", color: "#FFB6C1" },
      { name: "Soft Yellow", color: "#F0E68C" },
      { name: "Soft Green", color: "#98FB98" },
      { name: "Soft Blue", color: "#87CEEB" },
      { name: "Soft Purple", color: "#DDA0DD" },
      { name: "Soft Gray", color: "#D3D3D3" },
      { name: "Soft Orange", color: "#FFA07A" },
      { name: "Soft Mint", color: "#98FF98" }
    ],
    "Space": [
      { name: "Black", color: "#000000" },
      { name: "Dark Orange", color: "#FF8C00" },
      { name: "Dark Blue", color: "#000080" },
      { name: "Dark Purple", color: "#4B0082" },
      { name: "Dark Gray", color: "#404040" },
      { name: "Navy", color: "#000080" },
      { name: "Charcoal", color: "#36454F" },
      { name: "Deep Space", color: "#1C1C1C" }
    ]
  }

  const addCustomColor = () => {
    if (newColorName.trim() && newColorValue) {
      const newColor = {
        id: Date.now().toString(),
        color: newColorValue,
        name: newColorName.trim(),
        enabled: true
      }
      setCustomColors([...customColors, newColor])
      setNewColorName("")
      setNewColorValue("#FF0000")
    }
  }

  const addColorsFromPalette = (palette: Array<{ name: string, color: string }>) => {
    const newColors = palette.map(color => ({
      id: Date.now().toString() + Math.random(),
      color: color.color,
      name: color.name,
      enabled: true
    }))
    setCustomColors([...customColors, ...newColors])
  }

  const toggleColorEnabled = (id: string) => {
    setCustomColors(customColors.map(color =>
      color.id === id ? { ...color, enabled: !color.enabled } : color
    ))
  }

  const deleteColor = (id: string) => {
    setCustomColors(customColors.filter(color => color.id !== id))
  }

  const updateColorName = (id: string, newName: string) => {
    setCustomColors(customColors.map(color =>
      color.id === id ? { ...color, name: newName } : color
    ))
  }

  return (
    <div className="space-y-4">
      {/* Custom Color Picker Section */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Custom Color</h3>
        </div>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label htmlFor="colorName" className="text-sm font-medium">Color Name</Label>
            <Input
              id="colorName"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Enter color name..."
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="colorPicker" className="text-sm font-medium">Choose Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="colorPicker"
                type="color"
                value={newColorValue}
                onChange={(e) => setNewColorValue(e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={newColorValue}
                onChange={(e) => setNewColorValue(e.target.value)}
                placeholder="#FF0000"
                className="flex-1"
              />
            </div>
          </div>
          <Button onClick={addCustomColor} disabled={!newColorName.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* PW Colors Section */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">PW Colors</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Insert All <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addColorsFromPalette(pwColors)}>
                Insert All Colors
              </DropdownMenuItem>
              {pwColors.map((color) => (
                <DropdownMenuItem key={color.name} onClick={() => addColorsFromPalette([color])}>
                  {color.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {pwColors.map((color) => (
            <div key={color.name} className="text-center">
              <div
                className="w-8 h-8 rounded border-2 border-gray-300 mx-auto cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color.color }}
                onClick={() => addColorsFromPalette([color])}
                title={color.name}
              />
              <p className="text-xs mt-1 text-gray-600">{color.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PW Colors 2 Section */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">PW Colors 2</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Insert All <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addColorsFromPalette(pwColors2)}>
                Insert All Colors
              </DropdownMenuItem>
              {pwColors2.map((color) => (
                <DropdownMenuItem key={color.name} onClick={() => addColorsFromPalette([color])}>
                  {color.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {pwColors2.map((color) => (
            <div key={color.name} className="text-center">
              <div
                className="w-8 h-8 rounded border-2 border-gray-300 mx-auto cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color.color }}
                onClick={() => addColorsFromPalette([color])}
                title={color.name}
              />
              <p className="text-xs mt-1 text-gray-600">{color.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Colors Section */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Basic Colors</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Insert All <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => addColorsFromPalette(basicColors)}>
                Insert All Colors
              </DropdownMenuItem>
              {basicColors.map((color) => (
                <DropdownMenuItem key={color.name} onClick={() => addColorsFromPalette([color])}>
                  {color.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {basicColors.map((color) => (
            <div key={color.name} className="text-center">
              <div
                className="w-8 h-8 rounded border-2 border-gray-300 mx-auto cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color.color }}
                onClick={() => addColorsFromPalette([color])}
                title={color.name}
              />
              <p className="text-xs mt-1 text-gray-600">{color.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Colors Section */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Theme Colors</h3>
        </div>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {Object.entries(themeColors).map(([themeName, colors]) => (
            <div key={themeName} className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{themeName}</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Insert All <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => addColorsFromPalette(colors)}>
                      Insert All Colors
                    </DropdownMenuItem>
                    {colors.map((color) => (
                      <DropdownMenuItem key={color.name} onClick={() => addColorsFromPalette([color])}>
                        {color.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <div key={color.name} className="text-center">
                    <div
                      className="w-6 h-6 rounded border border-gray-300 mx-auto cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.color }}
                      onClick={() => addColorsFromPalette([color])}
                      title={color.name}
                    />
                    <p className="text-xs mt-1 text-gray-600">{color.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Colors List */}
      {customColors.length > 0 && (
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-semibold mb-3">Current Colors</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {customColors.map((color) => (
              <div key={color.id} className="flex items-center gap-3 p-2 border rounded">
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color.color }}
                />
                <Input
                  value={color.name}
                  onChange={(e) => updateColorName(color.id, e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleColorEnabled(color.id)}
                  className={color.enabled ? "bg-green-100" : "bg-gray-100"}
                >
                  {color.enabled ? "Enabled" : "Disabled"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteColor(color.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 