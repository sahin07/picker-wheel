"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Brain, Target, BarChart3 } from "lucide-react"
import type { Pokemon, AIMode, ChatMessage, UserPreferences } from "@/types/pokemon-types"
import { EmojiSelectionModal } from "@/components/pokemon/emoji-selection-modal"

interface CustomPokemon {
  id: string
  name: string
  type: string[]
  generation: string
  emoji: string
  isCustom: true
}

interface AITabProps {
  aiMode?: AIMode
  aiQuery?: string
  aiResponse?: string
  aiLoading?: boolean
  aiChatHistory?: ChatMessage[]
  aiRecommendations?: Pokemon[]
  userPreferences?: UserPreferences
  selectedPokemon?: Set<string>
  onModeChange?: (mode: AIMode) => void
  onQueryChange?: (query: string) => void
  onQuerySubmit?: () => void
  onPreferencesChange?: (preferences: UserPreferences) => void
  onPokemonChange?: (pokemon: Set<string>) => void
  onResponseChange?: (response: string) => void
  getAllPokemon?: () => Pokemon[]
  getFilteredPokemon?: () => Pokemon[]
  onGenerationChange?: (generation: string) => void
  aiRecommendedPokemon?: string[] // New prop for AI recommended Pokemon names
  onAddCustomPokemon?: (pokemon: CustomPokemon) => void // New prop for adding custom Pokemon
}

export function AITab({
  aiMode = "chat",
  aiQuery = "",
  aiResponse = "",
  aiLoading = false,
  aiChatHistory = [],
  aiRecommendations = [],
  userPreferences = {
    favoriteTypes: [],
    preferredGeneration: "all",
    playStyle: "casual",
    favoriteRegions: [],
  },
  selectedPokemon = new Set(),
  onModeChange,
  onQueryChange,
  onQuerySubmit,
  onPreferencesChange,
  onPokemonChange,
  onResponseChange,
  getAllPokemon,
  getFilteredPokemon,
  onGenerationChange,
  aiRecommendedPokemon = [],
  onAddCustomPokemon,
}: AITabProps) {
  const [showEmojiModal, setShowEmojiModal] = useState(false)
  const [pendingPokemonName, setPendingPokemonName] = useState("")

  const handleQuickQuestion = (question: string) => {
    onQueryChange(question)
    setTimeout(() => onQuerySubmit(), 100)
  }

  const generateCollectionAnalysis = () => {
    if (!getFilteredPokemon) return

    const selectedPokemonArray = getFilteredPokemon()
    if (selectedPokemonArray.length === 0) {
      onResponseChange("❌ No Pokemon selected! Please add some Pokemon to your wheel first.")
      return
    }

    // Calculate type distribution
    const typeDistribution = selectedPokemonArray.reduce(
      (acc, pokemon) => {
        pokemon.type.forEach(type => {
          acc[type] = (acc[type] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>
    )

    // Calculate generation distribution
    const generationDistribution = selectedPokemonArray.reduce(
      (acc, pokemon) => {
        acc[pokemon.generation] = (acc[pokemon.generation] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    // Count legendary and starter Pokemon
    const legendaryCount = selectedPokemonArray.filter(pokemon => pokemon.isLegendary).length
    const starterCount = selectedPokemonArray.filter(pokemon => pokemon.isStarter).length
    const customCount = selectedPokemonArray.filter(pokemon => (pokemon as any).isCustom).length

    // Find most common types
    const sortedTypes = Object.entries(typeDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)

    // Find most common generation
    const sortedGenerations = Object.entries(generationDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)

    let analysis = "🔍 **Collection Analysis:**\n\n"
    analysis += `📊 You have ${selectedPokemonArray.length} Pokemon selected\n`
    analysis += `🌟 ${legendaryCount} legendary Pokemon (${Math.round((legendaryCount / selectedPokemonArray.length) * 100)}%)\n`
    analysis += `🌱 ${starterCount} starter Pokemon (${Math.round((starterCount / selectedPokemonArray.length) * 100)}%)\n`
    if (customCount > 0) {
      analysis += `✨ ${customCount} custom Pokemon (${Math.round((customCount / selectedPokemonArray.length) * 100)}%)\n`
    }
    analysis += `\n`

    // Type analysis
    if (sortedTypes.length > 0) {
      analysis += `🎨 **Type Distribution:**\n`
      sortedTypes.forEach(([type, count]) => {
        analysis += `• ${type}: ${count} Pokemon (${Math.round((count / selectedPokemonArray.length) * 100)}%)\n`
      })
      analysis += `\n`
    }

    // Generation analysis
    if (sortedGenerations.length > 0) {
      analysis += `📅 **Generation Distribution:**\n`
      sortedGenerations.forEach(([gen, count]) => {
        const genName = gen === 'gen1' ? 'Kanto (Gen 1)' : 
                       gen === 'gen2' ? 'Johto (Gen 2)' :
                       gen === 'gen3' ? 'Hoenn (Gen 3)' :
                       gen === 'gen4' ? 'Sinnoh (Gen 4)' :
                       gen === 'gen5' ? 'Unova (Gen 5)' :
                       gen === 'gen6' ? 'Kalos (Gen 6)' :
                       gen === 'gen7' ? 'Alola (Gen 7)' :
                       gen === 'gen8' ? 'Galar (Gen 8)' : gen
        analysis += `• ${genName}: ${count} Pokemon (${Math.round((count / selectedPokemonArray.length) * 100)}%)\n`
      })
      analysis += `\n`
    }

    // Insights and recommendations
    analysis += `💡 **Insights & Recommendations:**\n\n`

    if (legendaryCount > selectedPokemonArray.length * 0.3) {
      analysis += "⭐ You love legendary Pokemon! Your collection has a high concentration of rare and powerful Pokemon.\n"
    }

    if (starterCount > selectedPokemonArray.length * 0.4) {
      analysis += "🌱 You're a starter Pokemon enthusiast! Your collection shows strong preference for starter Pokemon.\n"
    }

    if (Object.keys(typeDistribution).length < 5) {
      analysis += "🎨 Consider adding more type diversity to your collection for better coverage!\n"
    }

    if (Object.keys(generationDistribution).length < 3) {
      analysis += "📅 Try exploring Pokemon from different generations for more variety!\n"
    }

    if (customCount > 0) {
      analysis += "✨ Great creativity with custom Pokemon! Your personal touch makes the collection unique.\n"
    }

    // Balance recommendations
    const fireCount = typeDistribution['Fire'] || 0
    const waterCount = typeDistribution['Water'] || 0
    const grassCount = typeDistribution['Grass'] || 0

    if (fireCount > waterCount + grassCount) {
      analysis += "🔥 Your collection is fire-heavy! Consider adding more Water and Grass types for balance.\n"
    } else if (waterCount > fireCount + grassCount) {
      analysis += "💧 Your collection is water-heavy! Consider adding more Fire and Grass types for balance.\n"
    } else if (grassCount > fireCount + waterCount) {
      analysis += "🌱 Your collection is grass-heavy! Consider adding more Fire and Water types for balance.\n"
    }

    onResponseChange(analysis)
  }

  // Generator functions
  const generateMetaLoadout = () => {
    if (!getAllPokemon) return

    const allPokemon = getAllPokemon()
    const legendaryPokemon = allPokemon.filter(p => p.isLegendary).slice(0, 8)
    const starterPokemon = allPokemon.filter(p => p.isStarter).slice(0, 4)
    const strongPokemon = allPokemon.filter(p => 
      !p.isLegendary && !p.isStarter && 
      (p.type.includes('Dragon') || p.type.includes('Psychic') || p.type.includes('Steel'))
    ).slice(0, 4)

    const metaLoadout = [...legendaryPokemon, ...starterPokemon, ...strongPokemon].slice(0, 12)
    
    let response = "🎯 **META Loadout Generated:**\n\n"
    response += "This loadout focuses on the most powerful and competitive Pokemon:\n\n"
    
    metaLoadout.forEach((pokemon, index) => {
      const category = legendaryPokemon.includes(pokemon) ? "🌟 Legendary" :
                      starterPokemon.includes(pokemon) ? "🌱 Starter" : "⚔️ Strong"
      response += `${index + 1}. ${pokemon.name} (${pokemon.type.join(', ')}) - ${category}\n`
    })
    
    response += "\n💡 **Strategy:** This loadout provides maximum power with legendary Pokemon, reliable starters, and strong type coverage."
    
    onResponseChange(response)
  }

  const generateThemedCollection = () => {
    if (!getAllPokemon) return

    const allPokemon = getAllPokemon()
    const themes = [
      {
        name: "🔥 Fire Warriors",
        pokemon: allPokemon.filter(p => p.type.includes('Fire')).slice(0, 8)
      },
      {
        name: "💧 Ocean Guardians", 
        pokemon: allPokemon.filter(p => p.type.includes('Water')).slice(0, 8)
      },
      {
        name: "🌱 Nature's Army",
        pokemon: allPokemon.filter(p => p.type.includes('Grass')).slice(0, 8)
      },
      {
        name: "⚡ Electric Storm",
        pokemon: allPokemon.filter(p => p.type.includes('Electric')).slice(0, 8)
      },
      {
        name: "🐉 Dragon Legends",
        pokemon: allPokemon.filter(p => p.type.includes('Dragon')).slice(0, 8)
      }
    ]

    const randomTheme = themes[Math.floor(Math.random() * themes.length)]
    
    let response = `🎨 **Themed Collection: ${randomTheme.name}**\n\n`
    response += "A cohesive collection with a specific theme:\n\n"
    
    randomTheme.pokemon.forEach((pokemon, index) => {
      response += `${index + 1}. ${pokemon.name} (${pokemon.type.join(', ')})\n`
    })
    
    response += `\n✨ **Theme Benefits:** All Pokemon share the ${randomTheme.name.split(' ')[1]} type, creating powerful synergies and consistent strategies.`
    
    onResponseChange(response)
  }

  const generateBalancedMix = () => {
    if (!getAllPokemon) return

    const allPokemon = getAllPokemon()
    const types = ['Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Psychic', 'Dragon']
    
    const balancedMix = types.map(type => {
      const typePokemon = allPokemon.filter(p => p.type.includes(type))
      return typePokemon[Math.floor(Math.random() * typePokemon.length)]
    }).filter(Boolean).slice(0, 8)
    
    let response = "⚖️ **Balanced Mix Generated:**\n\n"
    response += "A well-rounded collection with diverse type coverage:\n\n"
    
    balancedMix.forEach((pokemon, index) => {
      response += `${index + 1}. ${pokemon.name} (${pokemon.type.join(', ')})\n`
    })
    
    response += "\n🎯 **Balance Benefits:** This mix provides excellent type coverage, counters for most situations, and no major weaknesses."
    
    onResponseChange(response)
  }

  const generateSurpriseMe = () => {
    if (!getAllPokemon) return

    const allPokemon = getAllPokemon()
    const surpriseCategories = [
      allPokemon.filter(p => p.isLegendary),
      allPokemon.filter(p => p.isStarter),
      allPokemon.filter(p => p.type.includes('Ghost')),
      allPokemon.filter(p => p.type.includes('Fairy')),
      allPokemon.filter(p => p.type.includes('Steel')),
      allPokemon.filter(p => p.type.includes('Dark'))
    ]

    const randomCategory = surpriseCategories[Math.floor(Math.random() * surpriseCategories.length)]
    const surprisePokemon = randomCategory.slice(0, 6)
    
    const categoryNames = ['Legendary', 'Starter', 'Ghost', 'Fairy', 'Steel', 'Dark']
    const categoryName = categoryNames[surpriseCategories.indexOf(randomCategory)]
    
    let response = `🎲 **Surprise Collection: ${categoryName} Pokemon!**\n\n`
    response += "A random themed collection for you:\n\n"
    
    surprisePokemon.forEach((pokemon, index) => {
      response += `${index + 1}. ${pokemon.name} (${pokemon.type.join(', ')})\n`
    })
    
    response += `\n🎉 **Surprise Factor:** You got a ${categoryName.toLowerCase()} themed collection! This unexpected mix might just be your new favorite!`
    
    onResponseChange(response)
  }

  const generateCustomRequest = () => {
    if (!getAllPokemon || !aiQuery.trim()) return

    const allPokemon = getAllPokemon()
    const query = aiQuery.toLowerCase()
    let filteredPokemon = allPokemon

    // Parse custom request
    if (query.includes('legendary')) {
      filteredPokemon = filteredPokemon.filter(p => p.isLegendary)
    }
    if (query.includes('starter')) {
      filteredPokemon = filteredPokemon.filter(p => p.isStarter)
    }
    if (query.includes('fire')) {
      filteredPokemon = filteredPokemon.filter(p => p.type.includes('Fire'))
    }
    if (query.includes('water')) {
      filteredPokemon = filteredPokemon.filter(p => p.type.includes('Water'))
    }
    if (query.includes('grass')) {
      filteredPokemon = filteredPokemon.filter(p => p.type.includes('Grass'))
    }
    if (query.includes('electric')) {
      filteredPokemon = filteredPokemon.filter(p => p.type.includes('Electric'))
    }
    if (query.includes('dragon')) {
      filteredPokemon = filteredPokemon.filter(p => p.type.includes('Dragon'))
    }
    if (query.includes('psychic')) {
      filteredPokemon = filteredPokemon.filter(p => p.type.includes('Psychic'))
    }
    if (query.includes('ghost')) {
      filteredPokemon = filteredPokemon.filter(p => p.type.includes('Ghost'))
    }
    if (query.includes('fairy')) {
      filteredPokemon = filteredPokemon.filter(p => p.type.includes('Fairy'))
    }
    if (query.includes('steel')) {
      filteredPokemon = filteredPokemon.filter(p => p.type.includes('Steel'))
    }
    if (query.includes('dark')) {
      filteredPokemon = filteredPokemon.filter(p => p.type.includes('Dark'))
    }

    const selectedPokemon = filteredPokemon.slice(0, 8)
    
    if (selectedPokemon.length === 0) {
      onResponseChange("❌ No Pokemon found matching your request. Try a different search term!")
      return
    }

    let response = `🎯 **Custom Collection: "${aiQuery}"**\n\n`
    response += "Generated based on your specific request:\n\n"
    
    selectedPokemon.forEach((pokemon, index) => {
      response += `${index + 1}. ${pokemon.name} (${pokemon.type.join(', ')})\n`
    })
    
    response += `\n✨ **Custom Match:** Found ${selectedPokemon.length} Pokemon that match your "${aiQuery}" request!`
    
    onResponseChange(response)
  }

  // Helper function to process AI recommendations - show ALL names
  const processAiRecommendations = (recommendedNames: string[]) => {
    if (!getAllPokemon) return []
    
    return recommendedNames.map(name => {
      // Clean up the Pokemon name (remove parentheses, etc.)
      const cleanName = name.replace(/\s*\([^)]+\)/g, '').trim()
      
      const pokemon = getAllPokemon().find(p => {
        const pokemonNameLower = p.name.toLowerCase()
        const cleanNameLower = cleanName.toLowerCase()
        
        // Exact match
        if (pokemonNameLower === cleanNameLower) return true
        
        // Contains match
        if (pokemonNameLower.includes(cleanNameLower) || cleanNameLower.includes(pokemonNameLower)) return true
        
        // Partial word match
        const pokemonWords = pokemonNameLower.split(/\s+/)
        const cleanWords = cleanNameLower.split(/\s+/)
        
        return pokemonWords.some(word => cleanWords.includes(word)) ||
               cleanWords.some(word => pokemonWords.includes(word))
      })
      
      return {
        recommendedName: name,
        cleanName: cleanName,
        isAvailable: !!pokemon,
        pokemon: pokemon
      }
    })
  }

  // Function to add a single Pokemon to the wheel
  const addPokemonToWheel = (pokemonId: string) => {
    if (!onPokemonChange) return
    
    const newSelected = new Set(selectedPokemon)
    newSelected.add(pokemonId)
    onPokemonChange(newSelected)
    
    // Show feedback
    const pokemon = getAllPokemon?.().find(p => p.id === pokemonId)
    if (pokemon && onResponseChange) {
      onResponseChange(`✅ Added ${pokemon.name} to your wheel!`)
    }
  }

  // Function to add a custom Pokemon with emoji selection
  const addCustomPokemon = (pokemonName: string) => {
    setPendingPokemonName(pokemonName)
    setShowEmojiModal(true)
  }

  // Function to handle emoji selection and add custom Pokemon
  const handleEmojiConfirm = (emoji: string) => {
    // Create a custom Pokemon with selected emoji
    const customPokemon: CustomPokemon = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: pendingPokemonName,
      type: ["Normal"],
      generation: "gen1",
      emoji: emoji,
      isCustom: true
    }
    
    // Add to custom Pokemon and wheel
    if (onAddCustomPokemon) {
      onAddCustomPokemon(customPokemon)
    }
    
    // Add to selected Pokemon
    if (onPokemonChange) {
      const newSelected = new Set(selectedPokemon)
      newSelected.add(customPokemon.id)
      onPokemonChange(newSelected)
    }
    
    // Show feedback
    if (onResponseChange) {
      onResponseChange(`✅ Added custom Pokemon "${pendingPokemonName}" with ${emoji} to your wheel!`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Brain className="w-5 h-5" />
          AI Assistant
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            🆓 Gemini
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Mode Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={aiMode === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("chat")}
            className="flex-1"
          >
            💬 Chat
          </Button>
          <Button
            variant={aiMode === "analysis" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("analysis")}
            className="flex-1"
          >
            📊 Analysis
          </Button>
          <Button
            variant={aiMode === "generator" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("generator")}
            className="flex-1"
          >
            ✨ Generator
          </Button>
        </div>

        {/* AI Chat Mode */}
        {aiMode === "chat" && (
          <div className="space-y-4">
            {/* Chat History */}
            <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-2">
              {aiChatHistory.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">
                  <p>👋 Hi! I'm your AI Pokemon assistant!</p>
                  <p>Ask me anything about Pokemon!</p>
                </div>
              ) : (
                aiChatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                                         <div
                       className={`max-w-[80%] p-2 rounded-lg text-sm ${
                         chat.role === "user" ? "bg-blue-500 text-white" : "bg-white border text-gray-800"
                       }`}
                     >
                       <p className="whitespace-pre-wrap">{chat.message}</p>
                       <span className="text-xs opacity-70">
                         {typeof chat.timestamp === 'string' 
                           ? new Date(chat.timestamp).toLocaleTimeString() 
                           : chat.timestamp instanceof Date 
                             ? chat.timestamp.toLocaleTimeString()
                             : new Date().toLocaleTimeString()
                         }
                       </span>
                     </div>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border p-2 rounded-lg text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      AI is thinking...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask me about Pokemon, get recommendations, or request analysis..."
                value={aiQuery}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && onQuerySubmit()}
                className="flex-1"
              />
              <Button onClick={onQuerySubmit} disabled={aiLoading || !aiQuery.trim()} size="sm">
                {aiLoading ? "⏳" : "🚀"}
              </Button>
            </div>

            {/* AI Recommendations List */}
            {aiRecommendedPokemon.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <Label className="text-sm font-medium text-gray-800">
                    📋 AI Recommended Pokemon:
                  </Label>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                  {(() => {
                    const allRecommendations = processAiRecommendations(aiRecommendedPokemon)
                    const availablePokemon = allRecommendations.filter(p => p.isAvailable)
                    const unavailablePokemon = allRecommendations.filter(p => !p.isAvailable)
                    
                    if (allRecommendations.length === 0) {
                      return (
                        <div className="text-center text-gray-500 text-sm py-2">
                          🤔 No specific Pokemon found in the AI response. Try asking for specific Pokemon names!
                        </div>
                      )
                    }
                   
                    return (
                      <div className="space-y-2">
                        {/* Available Pokemon */}
                        {availablePokemon.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2 border">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="text-sm font-medium">{item.recommendedName}</span>
                              <span className="text-xs text-gray-500">({item.pokemon?.name})</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addPokemonToWheel(item.pokemon!.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Add to Wheel
                            </Button>
                          </div>
                        ))}
                        
                        {/* Unavailable Pokemon */}
                        {unavailablePokemon.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-2 border">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">❌</span>
                              <span className="text-sm text-gray-600">{item.recommendedName}</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addCustomPokemon(item.recommendedName)}
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              Add Custom
                            </Button>
                          </div>
                        ))}
                        
                        {/* Summary */}
                        {availablePokemon.length > 0 && (
                          <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
                            💡 Click "Add to Wheel" to add individual Pokemon to your collection
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Quick Questions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">Quick Questions:</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Recommend legendary Pokemon for me",
                  "What are the rarest Pokemon?",
                  "Tell me about starter Pokemon",
                  "What are my chances of getting legendary?",
                  "Help me choose the best Pokemon",
                ].map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs bg-transparent"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Mode */}
        {aiMode === "analysis" && (
          <div className="space-y-4">
            <div className="text-center">
              <Button onClick={generateCollectionAnalysis} className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze My Collection
              </Button>
            </div>

            {aiResponse && aiMode === "analysis" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-gray-800 whitespace-pre-wrap">{aiResponse}</div>
              </div>
            )}

            {/* Quick Analysis Buttons */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">Quick Analysis:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    if (!getFilteredPokemon) return
                    const pokemon = getFilteredPokemon()
                    const legendaryCount = pokemon.filter(p => p.isLegendary).length
                    onResponseChange(`🌟 You have ${legendaryCount} legendary Pokemon in your collection! ${legendaryCount > 0 ? 'Impressive collection of rare Pokemon!' : 'Consider adding some legendary Pokemon for power!'}`)
                  }}
                >
                  🏆 Legendary Count
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    if (!getFilteredPokemon) return
                    const pokemon = getFilteredPokemon()
                    const starterCount = pokemon.filter(p => p.isStarter).length
                    onResponseChange(`🌱 You have ${starterCount} starter Pokemon in your collection! ${starterCount > 0 ? 'Great starter Pokemon collection!' : 'Starter Pokemon are always reliable choices!'}`)
                  }}
                >
                  🌱 Starter Count
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    if (!getFilteredPokemon) return
                    const pokemon = getFilteredPokemon()
                    const types = new Set(pokemon.flatMap(p => p.type))
                    onResponseChange(`🎨 Your collection has ${types.size} different types: ${Array.from(types).join(', ')}. ${types.size >= 8 ? 'Excellent type diversity!' : 'Consider adding more type variety!'}`)
                  }}
                >
                  🎨 Type Diversity
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    if (!getFilteredPokemon) return
                    const pokemon = getFilteredPokemon()
                    const generations = new Set(pokemon.map(p => p.generation))
                    const genNames = Array.from(generations).map(gen => 
                      gen === 'gen1' ? 'Kanto' : 
                      gen === 'gen2' ? 'Johto' :
                      gen === 'gen3' ? 'Hoenn' :
                      gen === 'gen4' ? 'Sinnoh' :
                      gen === 'gen5' ? 'Unova' :
                      gen === 'gen6' ? 'Kalos' :
                      gen === 'gen7' ? 'Alola' :
                      gen === 'gen8' ? 'Galar' : gen
                    )
                    onResponseChange(`📅 Your collection spans ${generations.size} generations: ${genNames.join(', ')}. ${generations.size >= 3 ? 'Great generational diversity!' : 'Try exploring different generations!'}`)
                  }}
                >
                  📅 Generation Span
                </Button>
              </div>
            </div>

            {/* User Preferences */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-800">Set Your Preferences:</Label>

              <div>
                <Label className="text-xs text-gray-600">Favorite Types:</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"].map((type) => (
                    <Button
                      key={type}
                      variant={userPreferences.favoriteTypes.includes(type) ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        const newTypes = userPreferences.favoriteTypes.includes(type)
                          ? userPreferences.favoriteTypes.filter((t) => t !== type)
                          : [...userPreferences.favoriteTypes, type]
                        onPreferencesChange({ ...userPreferences, favoriteTypes: newTypes })
                      }}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-600">Play Style:</Label>
                <RadioGroup
                  value={userPreferences.playStyle}
                  onValueChange={(value) => onPreferencesChange({ ...userPreferences, playStyle: value })}
                  className="flex gap-4 mt-1"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="casual" id="casual" />
                    <Label htmlFor="casual" className="text-xs">
                      Casual
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="competitive" id="competitive" />
                    <Label htmlFor="competitive" className="text-xs">
                      Competitive
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="collector" id="collector" />
                    <Label htmlFor="collector" className="text-xs">
                      Collector
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {/* AI Generator Mode */}
        {aiMode === "generator" && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h4 className="font-semibold text-sm text-gray-800">AI Pokemon Generator</h4>
              <p className="text-xs text-gray-600">Generate custom wheel configurations</p>
            </div>

                         <div className="space-y-3">
               <Button variant="outline" className="w-full justify-start bg-transparent" onClick={generateMetaLoadout}>
                 🎯 Generate META Loadout
               </Button>

               <Button
                 variant="outline"
                 className="w-full justify-start bg-transparent"
                 onClick={generateThemedCollection}
               >
                 🎨 Generate Themed Collection
               </Button>

               <Button variant="outline" className="w-full justify-start bg-transparent" onClick={generateBalancedMix}>
                 ⚖️ Generate Balanced Mix
               </Button>

               <Button
                 variant="outline"
                 className="w-full justify-start bg-transparent"
                 onClick={generateSurpriseMe}
               >
                 🎲 Surprise Me!
               </Button>
             </div>

            {/* Custom Generator Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">Custom Request:</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 'only legendary' or 'fire type Pokemon'"
                  value={aiQuery}
                  onChange={(e) => onQueryChange(e.target.value)}
                  className="flex-1"
                />
                                 <Button size="sm" disabled={!aiQuery.trim()} onClick={generateCustomRequest}>
                   Generate
                 </Button>
              </div>
            </div>

            {/* AI Response Display */}
            {aiResponse && aiMode === "generator" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-sm text-gray-800">{aiResponse}</div>
              </div>
            )}
          </div>
        )}

        {/* AI Recommendations List */}
        {aiRecommendedPokemon.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <Label className="text-sm font-medium text-gray-800">
                📋 AI Recommended Pokemon:
              </Label>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              {(() => {
                const allRecommendations = processAiRecommendations(aiRecommendedPokemon)
                const availablePokemon = allRecommendations.filter(p => p.isAvailable)
                const unavailablePokemon = allRecommendations.filter(p => !p.isAvailable)
                
                if (allRecommendations.length === 0) {
                  return (
                    <div className="text-center text-gray-500 text-sm py-2">
                      🤔 No specific Pokemon found in the AI response. Try asking for specific Pokemon names!
                    </div>
                  )
                }
               
                return (
                  <div className="space-y-2">
                    {/* Available Pokemon */}
                    {availablePokemon.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2 border">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✅</span>
                          <span className="text-sm font-medium">{item.recommendedName}</span>
                          <span className="text-xs text-gray-500">({item.pokemon?.name})</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addPokemonToWheel(item.pokemon!.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Add to Wheel
                        </Button>
                      </div>
                    ))}
                    
                    {/* Unavailable Pokemon */}
                    {unavailablePokemon.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-2 border">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">❌</span>
                          <span className="text-sm text-gray-600">{item.recommendedName}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addCustomPokemon(item.recommendedName)}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Add Custom
                        </Button>
                      </div>
                    ))}
                    
                    {/* Summary */}
                    {availablePokemon.length > 0 && (
                      <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
                        💡 Click "Add to Wheel" to add individual Pokemon to your collection
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* Smart Recommendations (always visible) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-gray-800">
              <Target className="w-4 h-4" />
              Smart Recommendations
            </h4>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                const smartRecommendations = ["bulbasaur", "charmander", "squirtle", "charizard"]
                const newSelected = new Set(selectedPokemon)
                smartRecommendations.forEach(id => newSelected.add(id))
                onPokemonChange(newSelected)
                onResponseChange(`✅ Added all Smart Recommendations to your wheel!`)
              }}
            >
              Add All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Always show default recommendations */}
            {[
              { id: "bulbasaur", name: "Bulbasaur", emoji: "🌱" },
              { id: "charmander", name: "Charmander", emoji: "🔥" },
              { id: "squirtle", name: "Squirtle", emoji: "💧" },
              { id: "charizard", name: "Charizard", emoji: "🐉" }
            ].map((pokemon) => {
              const isSelected = selectedPokemon.has(pokemon.id)
              return (
                <Button
                  key={pokemon.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 text-xs ${
                    isSelected 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "bg-transparent hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    console.log('Smart Recommendation clicked:', pokemon.name, pokemon.id)
                    const newSelected = new Set(selectedPokemon)
                    
                    if (isSelected) {
                      newSelected.delete(pokemon.id)
                      onPokemonChange(newSelected)
                      onResponseChange(`❌ Removed ${pokemon.name} from your wheel!`)
                    } else {
                      newSelected.add(pokemon.id)
                      onPokemonChange(newSelected)
                      onResponseChange(`✅ Added ${pokemon.name} to your wheel!`)
                    }
                  }}
                >
                  <span>{pokemon.emoji}</span>
                  <span className="truncate">{pokemon.name}</span>
                  {isSelected && <span className="text-xs">✓</span>}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Emoji Selection Modal */}
        <EmojiSelectionModal
          isOpen={showEmojiModal}
          onClose={() => setShowEmojiModal(false)}
          onConfirm={handleEmojiConfirm}
          pokemonName={pendingPokemonName}
        />
      </CardContent>
    </Card>
  )
}
