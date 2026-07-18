"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  TrendingUp, 
  Heart, 
  Target,
  Sparkles,
  BarChart3,
  Clock,
  Star,
  Plus
} from "lucide-react"
import { analyzeColorPersonality, generateColorName, type ColorPersonality } from "@/lib/ai-color-utils"

interface AIColorLearningProps {
  results: Array<{
    color: string
    name: string
    hex: string
    rgb: string
    timestamp: Date
  }>
  onAddColor?: (color: string, name?: string) => void
}

interface ColorPreference {
  color: string
  frequency: number
  lastUsed: Date
  personality: string
}

export function AIColorLearning({ results, onAddColor }: AIColorLearningProps) {
  const [preferences, setPreferences] = useState<ColorPreference[]>([])
  const [personality, setPersonality] = useState<ColorPersonality | null>(null)
  const [insights, setInsights] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (results.length > 0) {
      analyzePreferences()
    }
  }, [results])

  const analyzePreferences = () => {
    // Count color frequency
    const colorCount: { [key: string]: number } = {}
    const colorLastUsed: { [key: string]: Date } = {}
    
    results.forEach(result => {
      colorCount[result.color] = (colorCount[result.color] || 0) + 1
      if (!colorLastUsed[result.color] || result.timestamp > colorLastUsed[result.color]) {
        colorLastUsed[result.color] = result.timestamp
      }
    })

    // Create preferences array
    const prefs: ColorPreference[] = Object.keys(colorCount).map(color => ({
      color,
      frequency: colorCount[color],
      lastUsed: colorLastUsed[color],
      personality: getColorPersonality(color)
    }))

    // Sort by frequency
    prefs.sort((a, b) => b.frequency - a.frequency)
    setPreferences(prefs)

    // Analyze overall personality
    const colors = results.map(r => r.color)
    const personalityAnalysis = analyzeColorPersonality(colors)
    setPersonality(personalityAnalysis)

    // Generate insights
    generateInsights(prefs, personalityAnalysis)
  }

  const getColorPersonality = (color: string): string => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min
    const sum = max + min
    const l = sum / 2

    if (diff === 0) return "Neutral"
    if (l < 128) return "Dark"
    if (l > 192) return "Light"
    
    const sat = diff / (l < 128 ? sum : (510 - sum)) * 100
    
    if (sat < 20) return "Muted"
    if (sat > 80) return "Vibrant"
    
    return "Balanced"
  }

  const generateInsights = (prefs: ColorPreference[], personality: ColorPersonality) => {
    const insights: string[] = []
    
    // Most used color
    if (prefs.length > 0) {
      const topColor = prefs[0]
      insights.push(`Your favorite color is ${topColor.color} (used ${topColor.frequency} times)`)
    }

    // Personality insights
    insights.push(`You have a ${personality.type.toLowerCase()} color personality`)
    insights.push(personality.description)

    // Trend insights
    if (prefs.length >= 3) {
      const recentColors = prefs.slice(0, 3)
      const avgPersonality = recentColors.reduce((sum, p) => {
        if (p.personality === "Vibrant") return sum + 1
        if (p.personality === "Muted") return sum - 1
        return sum
      }, 0) / recentColors.length

      if (avgPersonality > 0.5) {
        insights.push("You're trending toward more vibrant colors recently")
      } else if (avgPersonality < -0.5) {
        insights.push("You're trending toward more muted colors recently")
      } else {
        insights.push("You're maintaining a balanced color approach")
      }
    }

    // Variety insights
    const uniqueColors = new Set(results.map(r => r.color)).size
    if (uniqueColors >= results.length * 0.8) {
      insights.push("You love experimenting with diverse color combinations")
    } else if (uniqueColors <= results.length * 0.3) {
      insights.push("You prefer sticking to your favorite colors")
    } else {
      insights.push("You have a good balance of variety and consistency")
    }

    setInsights(insights)
  }

  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  const getFrequencyColor = (frequency: number, maxFrequency: number) => {
    const percentage = (frequency / maxFrequency) * 100
    if (percentage >= 80) return "text-red-600"
    if (percentage >= 60) return "text-orange-600"
    if (percentage >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  if (results.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200">
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Color Learning</h3>
          <p className="text-gray-500">Start spinning to build your color profile!</p>
        </CardContent>
      </Card>
    )
  }

  const maxFrequency = Math.max(...preferences.map(p => p.frequency))

  return (
    <div className="space-y-4">
      {/* Main Learning Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Brain className="h-5 w-5" />
            AI Color Learning
            <Badge variant="secondary" className="ml-auto">
              <TrendingUp className="h-3 w-3 mr-1" />
              Learning
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Personality Summary */}
          {personality && (
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-700">Your Color Personality</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <Badge variant="outline" className="capitalize">
                    {personality.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 italic">"{personality.description}"</p>
                <div className="flex flex-wrap gap-1">
                  {personality.traits.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-gray-700">AI Insights</span>
            </div>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-700">Your Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Spins:</span>
                <div className="font-semibold text-gray-800">{results.length}</div>
              </div>
              <div>
                <span className="text-gray-600">Unique Colors:</span>
                <div className="font-semibold text-gray-800">{preferences.length}</div>
              </div>
              <div>
                <span className="text-gray-600">Most Used:</span>
                <div className="font-semibold text-gray-800">
                  {preferences[0]?.color || "N/A"}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Variety Score:</span>
                <div className="font-semibold text-gray-800">
                  {Math.round((preferences.length / results.length) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Preferences */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Heart className="h-5 w-5" />
            Your Color Preferences
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="ml-auto"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </CardTitle>
        </CardHeader>
        {showDetails && (
          <CardContent className="space-y-3">
            {preferences.slice(0, 10).map((pref, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                <div
                  className="w-8 h-8 rounded border-2 border-white shadow-sm"
                  style={{ backgroundColor: pref.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">{pref.color}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${getFrequencyColor(pref.frequency, maxFrequency)}`}>
                        {pref.frequency}x
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {pref.personality}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Progress 
                      value={(pref.frequency / maxFrequency) * 100} 
                      className="flex-1 mr-2" 
                    />
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(pref.lastUsed)}
                    </div>
                  </div>
                </div>
                {onAddColor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddColor(pref.color, generateColorName(pref.color))}
                    className="h-8 w-8 p-0"
                    title="Add to wheel"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  )
} 