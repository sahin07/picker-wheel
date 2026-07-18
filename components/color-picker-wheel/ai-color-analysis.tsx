"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Palette, 
  Eye, 
  Sparkles, 
  Lightbulb, 
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  Plus
} from "lucide-react"
import { 
  analyzeColors, 
  generateColorName, 
  generateColorStory,
  type ColorAnalysis 
} from "@/lib/ai-color-utils"

interface AIColorAnalysisProps {
  colors: string[]
  onAddColor?: (color: string, name?: string) => void
}

export function AIColorAnalysis({ colors, onAddColor }: AIColorAnalysisProps) {
  const [analysis, setAnalysis] = useState<ColorAnalysis | null>(null)
  const [colorStory, setColorStory] = useState<string>("")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['harmony']))
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  useEffect(() => {
    if (colors.length > 0) {
      const aiAnalysis = analyzeColors(colors)
      setAnalysis(aiAnalysis)
      setColorStory(generateColorStory(colors))
    } else {
      setAnalysis(null)
      setColorStory("")
    }
  }, [colors])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedColor(text)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const getHarmonyColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getHarmonyLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
  }

  if (!analysis || colors.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-dashed border-purple-200">
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Color Analysis</h3>
          <p className="text-gray-500">Spin the wheel to get AI-powered color insights!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main AI Analysis Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Brain className="h-5 w-5" />
            AI Color Analysis
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              Smart
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Color Story */}
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-gray-700">Color Story</span>
            </div>
            <p className="text-gray-600 text-sm italic">"{colorStory}"</p>
          </div>

          {/* Harmony Score */}
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-700">Harmony Score</span>
              </div>
              <Badge 
                variant={analysis.harmony >= 80 ? "default" : analysis.harmony >= 60 ? "secondary" : "destructive"}
                className={getHarmonyColor(analysis.harmony)}
              >
                {analysis.harmony}/100
              </Badge>
            </div>
            <Progress value={analysis.harmony} className="mb-2" />
            <p className="text-sm text-gray-600">
              {getHarmonyLabel(analysis.harmony)} harmony • {analysis.harmony >= 80 ? "Perfect balance" : 
               analysis.harmony >= 60 ? "Good combination" : 
               analysis.harmony >= 40 ? "Interesting contrast" : "Bold choice"}
            </p>
          </div>

          {/* Personality Analysis */}
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">Color Personality</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mood:</span>
                <Badge variant="outline" className="capitalize">
                  {analysis.personality.mood}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Energy:</span>
                <div className="flex items-center gap-2">
                  <Progress value={analysis.personality.energy} className="w-20" />
                  <span className="text-xs text-gray-500">{analysis.personality.energy}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Creativity:</span>
                <div className="flex items-center gap-2">
                  <Progress value={analysis.personality.creativity} className="w-20" />
                  <span className="text-xs text-gray-500">{analysis.personality.creativity}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Check */}
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-indigo-600" />
              <span className="font-medium text-gray-700">Accessibility</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Contrast Ratio:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{analysis.accessibility.contrast / 10}</span>
                  {analysis.accessibility.wcagAAA ? (
                    <CheckCircle className="h-4 w-4 text-green-600" title="WCAG AAA Compliant" />
                  ) : analysis.accessibility.wcagAA ? (
                    <Info className="h-4 w-4 text-yellow-600" title="WCAG AA Compliant" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" title="Below WCAG Standards" />
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant={analysis.accessibility.wcagAA ? "default" : "secondary"} className="text-xs">
                  WCAG AA
                </Badge>
                <Badge variant={analysis.accessibility.wcagAAA ? "default" : "secondary"} className="text-xs">
                  WCAG AAA
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Color Suggestions */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Sparkles className="h-5 w-5" />
            AI Color Suggestions
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('suggestions')}
              className="ml-auto"
            >
              {expandedSections.has('suggestions') ? 'Hide' : 'Show'}
            </Button>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('suggestions') && (
          <CardContent className="space-y-4">
            {/* Complementary Colors */}
            <div>
              <h4 className="font-medium text-green-700 mb-2">Complementary Colors</h4>
              <div className="grid grid-cols-3 gap-2">
                {analysis.suggestions.complementary.map((color, index) => (
                  <div key={index} className="relative group">
                    <div
                      className="w-full h-12 rounded-lg border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                      title={`${generateColorName(color)} - Click to copy`}
                    />
                    {onAddColor && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-1 -right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm"
                        onClick={() => onAddColor(color, generateColorName(color))}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                    {copiedColor === color && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                        Copied!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Analogous Colors */}
            <div>
              <h4 className="font-medium text-green-700 mb-2">Analogous Colors</h4>
              <div className="grid grid-cols-4 gap-2">
                {analysis.suggestions.analogous.map((color, index) => (
                  <div key={index} className="relative group">
                    <div
                      className="w-full h-10 rounded-lg border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                      title={`${generateColorName(color)} - Click to copy`}
                    />
                    {onAddColor && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm"
                        onClick={() => onAddColor(color, generateColorName(color))}
                      >
                        <Plus className="h-2 w-2" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Triadic Colors */}
            <div>
              <h4 className="font-medium text-green-700 mb-2">Triadic Colors</h4>
              <div className="grid grid-cols-2 gap-2">
                {analysis.suggestions.triadic.map((color, index) => (
                  <div key={index} className="relative group">
                    <div
                      className="w-full h-10 rounded-lg border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                      title={`${generateColorName(color)} - Click to copy`}
                    />
                    {onAddColor && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm"
                        onClick={() => onAddColor(color, generateColorName(color))}
                      >
                        <Plus className="h-2 w-2" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Monochromatic Colors */}
            <div>
              <h4 className="font-medium text-green-700 mb-2">Monochromatic Variations</h4>
              <div className="grid grid-cols-4 gap-2">
                {analysis.suggestions.monochromatic.map((color, index) => (
                  <div key={index} className="relative group">
                    <div
                      className="w-full h-10 rounded-lg border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                      title={`${generateColorName(color)} - Click to copy`}
                    />
                    {onAddColor && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm"
                        onClick={() => onAddColor(color, generateColorName(color))}
                      >
                        <Plus className="h-2 w-2" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
} 