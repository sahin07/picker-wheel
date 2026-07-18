"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Palette, Copy, RefreshCw, Heart, Star } from "lucide-react"
import { generateIntelligentColorName } from "@/lib/ai-color-utils"

interface EnhancedColorNamingProps {
  color?: string;
  onNameChange?: (name: string) => void;
  currentName?: string;
}

export function EnhancedColorNaming({ color = "#FF0000", onNameChange, currentName }: EnhancedColorNamingProps) {
  const [inputColor, setInputColor] = useState(color)
  const [selectedContext, setSelectedContext] = useState("nature")
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [favoriteNames, setFavoriteNames] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedName, setSelectedName] = useState(currentName || "")

  const contexts = [
    { value: "nature", label: "Nature & Environment", icon: "🌿" },
    { value: "emotions", label: "Emotions & Feelings", icon: "💭" },
    { value: "seasons", label: "Seasons & Time", icon: "🍂" },
    { value: "food", label: "Food & Flavors", icon: "🍎" },
    { value: "places", label: "Places & Locations", icon: "🌍" }
  ]

  useEffect(() => {
    if (inputColor) {
      generateNames(inputColor, selectedContext)
    }
  }, [inputColor, selectedContext])

  const generateNames = (hexColor: string, context: string) => {
    setIsGenerating(true)
    
    // Generate multiple names for variety
    setTimeout(() => {
      const names = []
      for (let i = 0; i < 5; i++) {
        names.push(generateIntelligentColorName(hexColor, context))
      }
      setGeneratedNames(names)
      setIsGenerating(false)
    }, 800)
  }

  const handleColorChange = (newColor: string) => {
    setInputColor(newColor)
  }

  const handleContextChange = (context: string) => {
    setSelectedContext(context)
  }

  const toggleFavorite = (name: string) => {
    setFavoriteNames(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    )
  }

  const selectName = (name: string) => {
    setSelectedName(name)
    if (onNameChange) {
      onNameChange(name)
    }
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
  }

  const regenerateNames = () => {
    generateNames(inputColor, selectedContext)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Enhanced Color Naming
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Input */}
        <div className="space-y-2">
          <Label htmlFor="color-input">Color to Name</Label>
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
          </div>
        </div>

        {/* Context Selection */}
        <div className="space-y-2">
          <Label htmlFor="context">Naming Context</Label>
          <Select value={selectedContext} onValueChange={handleContextChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select context" />
            </SelectTrigger>
            <SelectContent>
              {contexts.map((context) => (
                <SelectItem key={context.value} value={context.value}>
                  <span className="flex items-center gap-2">
                    <span>{context.icon}</span>
                    {context.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Selection */}
        {selectedName && (
          <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                  style={{ backgroundColor: inputColor }}
                />
                <div>
                  <p className="font-medium text-sm">Selected Name:</p>
                  <p className="text-lg font-semibold text-purple-800">{selectedName}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyName(selectedName)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Generated Names */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">AI-Generated Names</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={regenerateNames}
              disabled={isGenerating}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>
          
          {isGenerating ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              <span className="ml-2 text-sm text-gray-500">Generating names...</span>
            </div>
          ) : (
            <div className="grid gap-2">
              {generatedNames.map((name, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded border border-white shadow-sm"
                      style={{ backgroundColor: inputColor }}
                    />
                    <span className="font-medium">{name}</span>
                    {favoriteNames.includes(name) && (
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => toggleFavorite(name)}
                    >
                      <Heart className={`h-4 w-4 ${favoriteNames.includes(name) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => copyName(name)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => selectName(name)}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Names */}
        {favoriteNames.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Favorite Names
            </h3>
            <div className="flex flex-wrap gap-2">
              {favoriteNames.map((name, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-red-50 text-red-700 border-red-200 cursor-pointer hover:bg-red-100"
                  onClick={() => selectName(name)}
                >
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Context Information */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-sm text-blue-800 mb-2">About Context-Aware Naming</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• <strong>Nature:</strong> Names inspired by natural elements, plants, and landscapes</p>
            <p>• <strong>Emotions:</strong> Names that reflect feelings and psychological associations</p>
            <p>• <strong>Seasons:</strong> Names connected to seasonal changes and time periods</p>
            <p>• <strong>Food:</strong> Names inspired by edible items and culinary experiences</p>
            <p>• <strong>Places:</strong> Names derived from geographical locations and destinations</p>
          </div>
        </div>

        {/* Tips */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-sm text-green-800 mb-2">Tips for Better Color Names</h4>
          <div className="text-xs text-green-700 space-y-1">
            <p>• Try different contexts to find the perfect name</p>
            <p>• Save your favorite names for future reference</p>
            <p>• Consider the emotional impact of color names</p>
            <p>• Use names that resonate with your target audience</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 