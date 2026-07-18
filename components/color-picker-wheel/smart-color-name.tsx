"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Palette, 
  Lightbulb, 
  RefreshCw,
  Check,
  Copy
} from "lucide-react"
import { generateColorName } from "@/lib/ai-color-utils"

interface SmartColorNameProps {
  color: string
  onNameChange: (name: string) => void
  currentName?: string
}

export function SmartColorName({ color, onNameChange, currentName }: SmartColorNameProps) {
  const [suggestedNames, setSuggestedNames] = useState<string[]>([])
  const [selectedName, setSelectedName] = useState<string>(currentName || "")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedName, setCopiedName] = useState<string | null>(null)

  useEffect(() => {
    if (color) {
      generateNames()
    }
  }, [color])

  const generateNames = () => {
    setIsGenerating(true)
    // Generate multiple name variations
    const names = []
    for (let i = 0; i < 5; i++) {
      names.push(generateColorName(color))
    }
    // Remove duplicates
    const uniqueNames = [...new Set(names)]
    setSuggestedNames(uniqueNames)
    setIsGenerating(false)
  }

  const selectName = (name: string) => {
    setSelectedName(name)
    onNameChange(name)
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
    setCopiedName(name)
    setTimeout(() => setCopiedName(null), 2000)
  }

  const getColorCategory = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min
    const sum = max + min
    const l = sum / 2

    if (diff === 0) return "Gray"
    if (l < 128) return "Dark"
    if (l > 192) return "Light"
    
    const sat = diff / (l < 128 ? sum : (510 - sum)) * 100
    
    if (sat < 20) return "Muted"
    if (sat > 80) return "Vibrant"
    
    return "Medium"
  }

  const category = getColorCategory(color)

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Sparkles className="h-5 w-5" />
          AI Color Naming
          <Badge variant="secondary" className="ml-auto">
            <Palette className="h-3 w-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Color Display */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
          <div
            className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-700">{color}</span>
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            </div>
            <Label htmlFor="colorName" className="text-xs text-gray-500">
              Color Name
            </Label>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="colorName" className="text-sm font-medium text-gray-700">
            Custom Name
          </Label>
          <div className="flex gap-2">
            <Input
              id="colorName"
              value={selectedName}
              onChange={(e) => {
                setSelectedName(e.target.value)
                onNameChange(e.target.value)
              }}
              placeholder="Enter a name for this color..."
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={generateNames}
              disabled={isGenerating}
              title="Generate new names"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {suggestedNames.map((name, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
                  selectedName === name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
                onClick={() => selectName(name)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium text-gray-700">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedName === name && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyName(name)
                    }}
                    className="h-6 w-6 p-0"
                    title="Copy name"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {copiedName === name && (
                  <div className="absolute -top-8 right-0 bg-black text-white text-xs px-2 py-1 rounded">
                    Copied!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Color Info */}
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Color Analysis</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">Category:</span> {category}
            </div>
            <div>
              <span className="font-medium">Brightness:</span> {getColorCategory(color)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 