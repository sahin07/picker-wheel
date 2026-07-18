"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, AlertTriangle, CheckCircle, Info, Copy } from "lucide-react"
import { simulateColorBlindness, type ColorBlindnessSimulation } from "@/lib/ai-color-utils"

interface ColorBlindnessSimulatorProps {
  color?: string;
  onColorChange?: (color: string) => void;
}

export function ColorBlindnessSimulator({ color = "#FF0000", onColorChange }: ColorBlindnessSimulatorProps) {
  const [inputColor, setInputColor] = useState(color)
  const [simulation, setSimulation] = useState<ColorBlindnessSimulation | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (inputColor) {
      analyzeColor(inputColor)
    }
  }, [inputColor])

  const analyzeColor = (hexColor: string) => {
    setIsAnalyzing(true)
    
    // Simulate AI processing time
    setTimeout(() => {
      const result = simulateColorBlindness(hexColor)
      setSimulation(result)
      setIsAnalyzing(false)
    }, 500)
  }

  const handleColorChange = (newColor: string) => {
    setInputColor(newColor)
    if (onColorChange) {
      onColorChange(newColor)
    }
  }

  const copyColor = (colorHex: string) => {
    navigator.clipboard.writeText(colorHex)
  }

  const colorTypes = [
    {
      name: "Normal Vision",
      color: inputColor,
      description: "How the color appears to people with normal color vision"
    },
    {
      name: "Protanopia",
      color: simulation?.protanopia || inputColor,
      description: "Red-green color blindness (difficulty distinguishing red and green)"
    },
    {
      name: "Deuteranopia",
      color: simulation?.deuteranopia || inputColor,
      description: "Another form of red-green color blindness"
    },
    {
      name: "Tritanopia",
      color: simulation?.tritanopia || inputColor,
      description: "Blue-yellow color blindness (difficulty distinguishing blue and yellow)"
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-500" />
          Color Blindness Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Input */}
        <div className="space-y-2">
          <Label htmlFor="color-input">Test Color</Label>
          <div className="flex gap-2">
            <Input
              id="color-input"
              type="color"
              value={inputColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-16 h-10 p-1"
            />
            <Input
              value={inputColor}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#FF0000"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyColor(inputColor)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Accessibility Status */}
        {simulation && (
          <div className="p-3 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              {simulation.accessibility.isAccessible ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
              <span className="font-medium">
                Accessibility: {simulation.accessibility.isAccessible ? "Good" : "Needs Improvement"}
              </span>
            </div>
            
            {simulation.accessibility.suggestions.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Suggestions:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  {simulation.accessibility.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Color Simulations */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">How this color appears to different people:</h3>
          
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-500">Analyzing color...</span>
            </div>
          ) : (
            <div className="grid gap-3">
              {colorTypes.map((type) => (
                <div key={type.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                    style={{ backgroundColor: type.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{type.name}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2"
                        onClick={() => copyColor(type.color)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">{type.description}</p>
                    <p className="text-xs font-mono text-gray-400">{type.color}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Educational Information */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-sm text-blue-800 mb-2">About Color Blindness</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• <strong>Protanopia:</strong> Difficulty distinguishing red and green colors</p>
            <p>• <strong>Deuteranopia:</strong> Another form of red-green color blindness</p>
            <p>• <strong>Tritanopia:</strong> Difficulty distinguishing blue and yellow colors</p>
            <p>• Approximately 8% of men and 0.5% of women have some form of color blindness</p>
          </div>
        </div>

        {/* Tips for Designers */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-sm text-green-800 mb-2">Design Tips</h4>
          <div className="text-xs text-green-700 space-y-1">
            <p>• Use high contrast ratios (at least 4.5:1 for normal text)</p>
            <p>• Don't rely solely on color to convey information</p>
            <p>• Test your designs with color blindness simulators</p>
            <p>• Consider using patterns or textures in addition to colors</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 