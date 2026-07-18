'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Brain, 
  Globe, 
  TrendingUp, 
  MapPin, 
  Plane, 
  GraduationCap, 
  Briefcase,
  Plus,
  Sparkles,
  Target
} from 'lucide-react'
import { Country } from '@/data/countries'
import { 
  suggestCountriesByCategory, 
  generateTravelRecommendations,
  generateIntelligentCountrySuggestions,
  analyzeCountryPreferences,
  CountrySuggestion,
  TravelRecommendation
} from '@/lib/ai-country-utils'

interface CountryAISuggestionsProps {
  selectedCountries: Country[]
  onAddCountries?: (countries: Country[]) => void
  onAddToFavorites?: (country: Country) => void
}

export default function CountryAISuggestions({ 
  selectedCountries, 
  onAddCountries,
  onAddToFavorites 
}: CountryAISuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState('travel')
  const [selectedBudget, setSelectedBudget] = useState<'low' | 'medium' | 'high'>('medium')
  const [selectedContext, setSelectedContext] = useState<'travel' | 'education' | 'business' | 'culture'>('travel')
  const [suggestions, setSuggestions] = useState<CountrySuggestion | null>(null)
  const [travelRecommendations, setTravelRecommendations] = useState<TravelRecommendation | null>(null)
  const [intelligentSuggestions, setIntelligentSuggestions] = useState<Country[]>([])
  const [preferences, setPreferences] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const categories = [
    { id: 'culture', name: 'Culture', icon: Globe, description: 'Cultural diversity and heritage' },
    { id: 'economy', name: 'Economy', icon: TrendingUp, description: 'Economic opportunities' },
    { id: 'geography', name: 'Geography', icon: MapPin, description: 'Natural beauty and landscapes' },
    { id: 'travel', name: 'Travel', icon: Plane, description: 'Tourist-friendly destinations' },
    { id: 'education', name: 'Education', icon: GraduationCap, description: 'Educational opportunities' },
    { id: 'business', name: 'Business', icon: Briefcase, description: 'Business environment' }
  ]

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true)
    setTimeout(() => {
      const result = suggestCountriesByCategory(selectedCategory)
      setSuggestions(result)
      setIsGenerating(false)
    }, 1000)
  }

  const handleGenerateTravelRecommendations = async () => {
    setIsGenerating(true)
    setTimeout(() => {
      const result = generateTravelRecommendations([], selectedBudget)
      setTravelRecommendations(result)
      setIsGenerating(false)
    }, 1000)
  }

  const handleGenerateIntelligentSuggestions = async () => {
    setIsGenerating(true)
    setTimeout(() => {
      const result = generateIntelligentCountrySuggestions([], selectedCountries, selectedContext)
      setIntelligentSuggestions(result)
      
      // Also analyze current preferences
      const prefAnalysis = analyzeCountryPreferences(selectedCountries)
      setPreferences(prefAnalysis)
      
      setIsGenerating(false)
    }, 1000)
  }

  const handleAddAllCountries = (countries: Country[]) => {
    if (onAddCountries) {
      onAddCountries(countries)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Country Suggestions
        </CardTitle>
        <CardDescription>
          Get intelligent country recommendations based on your preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="category" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="travel">Travel</TabsTrigger>
            <TabsTrigger value="intelligent">Smart Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="category" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Category:</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateSuggestions} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Suggestions
                  </>
                )}
              </Button>

              {suggestions && (
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      {categories.find(c => c.id === suggestions.category)?.name} Suggestions
                    </CardTitle>
                    <CardDescription>{suggestions.reason}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {suggestions.countries.map((country) => (
                        <div key={country.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span className="font-medium text-sm">{country.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddCountries?.([country])}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button 
                      onClick={() => handleAddAllCountries(suggestions.countries)}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add All to Selection
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="travel" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Level:</label>
                <Select value={selectedBudget} onValueChange={(value: 'low' | 'medium' | 'high') => setSelectedBudget(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Budget</SelectItem>
                    <SelectItem value="medium">Medium Budget</SelectItem>
                    <SelectItem value="high">High Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateTravelRecommendations} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plane className="h-4 w-4 mr-2" />
                    Get Travel Recommendations
                  </>
                )}
              </Button>

              {travelRecommendations && (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-blue-600" />
                      Travel Recommendations
                    </CardTitle>
                    <CardDescription>{travelRecommendations.reason}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {travelRecommendations.countries.map((country) => (
                        <div key={country.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span className="font-medium text-sm">{country.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddCountries?.([country])}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Best Time to Visit:</h4>
                        <p className="text-sm text-gray-600">{travelRecommendations.bestTime}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-2">
                          {travelRecommendations.highlights.map((highlight, index) => (
                            <Badge key={index} variant="secondary">{highlight}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">Travel Tips:</h4>
                        <ul className="space-y-1">
                          {travelRecommendations.tips.map((tip, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleAddAllCountries(travelRecommendations.countries)}
                      className="w-full"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add All to Selection
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="intelligent" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Context:</label>
                <Select value={selectedContext} onValueChange={(value: 'travel' | 'education' | 'business' | 'culture') => setSelectedContext(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateIntelligentSuggestions} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Smart Suggestions
                  </>
                )}
              </Button>

              {intelligentSuggestions.length > 0 && (
                <div className="space-y-4">
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-green-600" />
                        Smart Suggestions
                      </CardTitle>
                      <CardDescription>Based on your current selections and {selectedContext} context</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {intelligentSuggestions.map((country) => (
                          <div key={country.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{country.flag}</span>
                              <span className="font-medium text-sm">{country.name}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAddCountries?.([country])}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={() => handleAddAllCountries(intelligentSuggestions)}
                        className="w-full mt-4"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add All to Selection
                      </Button>
                    </CardContent>
                  </Card>

                  {preferences && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Your Preferences Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Preferred Regions:</h4>
                          <div className="flex flex-wrap gap-2">
                            {preferences.preferredRegions.map((region, index) => (
                              <Badge key={index} variant="outline">{region}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Characteristics:</h4>
                          <div className="flex flex-wrap gap-2">
                            {preferences.preferredCharacteristics.map((char, index) => (
                              <Badge key={index} variant="secondary">{char}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">AI Recommendations:</h4>
                          <ul className="space-y-1">
                            {preferences.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 