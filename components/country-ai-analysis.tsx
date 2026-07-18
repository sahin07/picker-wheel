'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Globe, 
  TrendingUp, 
  MapPin, 
  Plane, 
  Lightbulb, 
  Star,
  Plus,
  Heart
} from 'lucide-react'
import { Country } from '@/data/countries'
import { generateCountryAnalysis, CountryAnalysis } from '@/lib/ai-country-utils'

interface CountryAIAnalysisProps {
  selectedCountry: Country | null
  onAddToFavorites?: (country: Country) => void
  onAddToComparison?: (country: Country) => void
}

export default function CountryAIAnalysis({ 
  selectedCountry, 
  onAddToFavorites,
  onAddToComparison 
}: CountryAIAnalysisProps) {
  const [analysis, setAnalysis] = useState<CountryAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!selectedCountry) return
    
    setIsAnalyzing(true)
    // Simulate AI processing time
    setTimeout(() => {
      const result = generateCountryAnalysis(selectedCountry)
      setAnalysis(result)
      setIsAnalyzing(false)
    }, 1500)
  }

  if (!selectedCountry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Country Analysis
          </CardTitle>
          <CardDescription>
            Select a country to get AI-powered insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Choose a country from the list to analyze</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle>AI Country Analysis</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {onAddToFavorites && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToFavorites(selectedCountry)}
                className="text-red-500 hover:text-red-600"
              >
                <Heart className="h-4 w-4 mr-1" />
                Favorite
              </Button>
            )}
            {onAddToComparison && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToComparison(selectedCountry)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Compare
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          AI-powered insights for {selectedCountry.flag} {selectedCountry.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <div className="text-center py-6">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Country
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Compatibility Score */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">AI Compatibility Score</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {analysis.compatibility}/100
                </Badge>
              </div>
              <Progress value={analysis.compatibility} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">
                Based on cultural, economic, and geographic factors
              </p>
            </div>

            {/* Analysis Tabs */}
            <Tabs defaultValue="insights" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="funfacts">Fun Facts</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-blue-600" />
                        Cultural Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {analysis.insights.cultural.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Economic Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {analysis.insights.economic.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-orange-600" />
                        Geographic Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {analysis.insights.geographic.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Plane className="h-4 w-4 text-purple-600" />
                        Travel Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {analysis.insights.travel.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="funfacts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      Fun Facts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.funFacts.map((fact, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                          <span className="text-lg">{selectedCountry.flag}</span>
                          <span className="text-sm">{fact}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Country Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Capital:</span> {selectedCountry.capital}
                      </div>
                      <div>
                        <span className="font-medium">Population:</span> {selectedCountry.population.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Area:</span> {selectedCountry.area.toLocaleString()} km²
                      </div>
                      <div>
                        <span className="font-medium">Currency:</span> {selectedCountry.currency}
                      </div>
                      <div>
                        <span className="font-medium">Language:</span> {selectedCountry.language}
                      </div>
                      <div>
                        <span className="font-medium">Timezone:</span> {selectedCountry.timezone}
                      </div>
                      {selectedCountry.gdp && (
                        <div>
                          <span className="font-medium">GDP:</span> ${selectedCountry.gdp}B
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 