"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Palette, Copy, Plus, RefreshCw, Eye } from "lucide-react"
import { generateAIPalette, type AIPaletteResponse } from "@/lib/ai-color-utils"

interface AIPaletteGeneratorProps {
  onAddColors?: (colors: string[], names?: string[]) => void;
}

export function AIPaletteGenerator({ onAddColors }: AIPaletteGeneratorProps) {
  const [mood, setMood] = useState("creative")
  const [style, setStyle] = useState("bright")
  const [purpose, setPurpose] = useState("design")
  const [colorCount, setColorCount] = useState(5)
  const [generatedPalette, setGeneratedPalette] = useState<AIPaletteResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const moods = [
    { value: "calm", label: "Calm & Peaceful" },
    { value: "energetic", label: "Energetic & Vibrant" },
    { value: "professional", label: "Professional & Trustworthy" },
    { value: "creative", label: "Creative & Imaginative" },
    { value: "earthy", label: "Earthy & Natural" },
    { value: "futuristic", label: "Futuristic & Modern" },
    { value: "vintage", label: "Vintage & Classic" },
    { value: "minimalist", label: "Minimalist & Clean" }
  ]

  const styles = [
    { value: "warm", label: "Warm" },
    { value: "cool", label: "Cool" },
    { value: "bright", label: "Bright" },
    { value: "muted", label: "Muted" },
    { value: "bold", label: "Bold" }
  ]

  const purposes = [
    { value: "design", label: "Graphic Design" },
    { value: "web", label: "Web Design" },
    { value: "branding", label: "Branding" },
    { value: "interior", label: "Interior Design" },
    { value: "fashion", label: "Fashion" },
    { value: "art", label: "Art & Illustration" }
  ]

  const generatePalette = () => {
    setIsGenerating(true)
    
    // Simulate AI processing time
    setTimeout(() => {
      const palette = generateAIPalette({
        mood,
        style,
        purpose,
        colorCount
      })
      setGeneratedPalette(palette)
      setIsGenerating(false)
    }, 1000)
  }

  const copyPalette = () => {
    if (generatedPalette) {
      const paletteText = generatedPalette.colors.join(", ")
      navigator.clipboard.writeText(paletteText)
    }
  }

  const addAllColors = () => {
    if (generatedPalette && onAddColors) {
      onAddColors(generatedPalette.colors, generatedPalette.names)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Palette Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mood">Mood & Feeling</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((moodOption) => (
                  <SelectItem key={moodOption.value} value={moodOption.value}>
                    {moodOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Style Preference</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {styles.map((styleOption) => (
                  <SelectItem key={styleOption.value} value={styleOption.value}>
                    {styleOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                {purposes.map((purposeOption) => (
                  <SelectItem key={purposeOption.value} value={purposeOption.value}>
                    {purposeOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="colorCount">Number of Colors</Label>
            <Select value={colorCount.toString()} onValueChange={(value) => setColorCount(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 6, 7, 8].map((count) => (
                  <SelectItem key={count} value={count.toString()}>
                    {count} colors
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generatePalette} 
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating Palette...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Palette
            </>
          )}
        </Button>

        {/* Generated Palette Display */}
        {generatedPalette && (
          <div className="space-y-4 mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{generatedPalette.mood} Palette</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyPalette}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={addAllColors}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add All
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600">{generatedPalette.description}</p>
            <p className="text-xs text-gray-500 italic">{generatedPalette.inspiration}</p>

            {/* Color Swatches */}
            <div className="grid grid-cols-5 gap-2">
              {generatedPalette.colors.map((color, index) => (
                <div key={index} className="space-y-2">
                  <div 
                    className="w-full h-16 rounded-lg border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    title={`${generatedPalette.names[index]} - ${color}`}
                  />
                  <div className="text-center">
                    <p className="text-xs font-medium truncate">{generatedPalette.names[index]}</p>
                    <p className="text-xs text-gray-500 font-mono">{color}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mood Badge */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
                <Palette className="h-3 w-3 mr-1" />
                {generatedPalette.mood} • {style} • {purpose}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 