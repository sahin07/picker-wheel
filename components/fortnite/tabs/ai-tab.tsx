"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Brain, Target, BarChart3 } from "lucide-react"
import type { Skin, AIMode, ChatMessage, UserPreferences } from "@/types/fortnite-types"
import { EmojiSelectionModal } from "@/components/fortnite/emoji-selection-modal"


interface CustomSkin {
  id: string
  name: string
  rarity: string
  season: string
  emoji: string
  isCustom: true
}

interface AITabProps {
  aiMode?: AIMode
  aiQuery?: string
  aiResponse?: string
  aiLoading?: boolean
  aiChatHistory?: ChatMessage[]
  aiRecommendations?: Skin[]
  userPreferences?: UserPreferences
  selectedSkins?: Set<string>
  onModeChange?: (mode: AIMode) => void
  onQueryChange?: (query: string) => void
  onQuerySubmit?: () => void
  onPreferencesChange?: (preferences: UserPreferences) => void
  onSkinsChange?: (skins: Set<string>) => void
  onResponseChange?: (response: string) => void
  getAllSkins?: () => Skin[]
  getFilteredSkins?: () => Skin[]
  onRarityChange?: (rarity: string) => void
  aiRecommendedSkins?: string[] // New prop for AI recommended skin names
  onAddCustomSkin?: (skin: CustomSkin) => void // New prop for adding custom skins
}

export function AITab({
  aiMode = "chat",
  aiQuery = "",
  aiResponse = "",
  aiLoading = false,
  aiChatHistory = [],
  aiRecommendations = [],
  userPreferences = {
    favoriteGenres: [],
    preferredRarity: "all",
    playStyle: "casual",
    favoriteCollabs: [],
  },
  selectedSkins = new Set(),
  onModeChange,
  onQueryChange,
  onQuerySubmit,
  onPreferencesChange,
  onSkinsChange,
  onResponseChange,
  getAllSkins,
  getFilteredSkins,
  onRarityChange,
  aiRecommendedSkins = [],
  onAddCustomSkin,
}: AITabProps) {
  const [showEmojiModal, setShowEmojiModal] = useState(false)
  const [pendingSkinName, setPendingSkinName] = useState("")


  const handleQuickQuestion = (question: string) => {
    onQueryChange(question)
    setTimeout(() => onQuerySubmit(), 100)
  }

  // Helper function to process AI recommendations - show ALL names
  const processAiRecommendations = (recommendedNames: string[]) => {
    if (!getAllSkins) return []
    
    return recommendedNames.map(name => {
      // Clean up the skin name (remove parentheses, etc.)
      const cleanName = name.replace(/\s*\([^)]+\)/g, '').trim()
      
      const skin = getAllSkins().find(s => {
        const skinNameLower = s.name.toLowerCase()
        const cleanNameLower = cleanName.toLowerCase()
        
        // Exact match
        if (skinNameLower === cleanNameLower) return true
        
        // Contains match
        if (skinNameLower.includes(cleanNameLower) || cleanNameLower.includes(skinNameLower)) return true
        
        // Partial word match
        const skinWords = skinNameLower.split(/\s+/)
        const cleanWords = cleanNameLower.split(/\s+/)
        
        return skinWords.some(word => cleanWords.includes(word)) ||
               cleanWords.some(word => skinWords.includes(word))
      })
      
      return {
        recommendedName: name,
        cleanName: cleanName,
        isAvailable: !!skin,
        skin: skin
      }
    })
  }

  // Function to add a single skin to the wheel
  const addSkinToWheel = (skinId: string) => {
    if (!onSkinsChange) return
    
    const newSelected = new Set(selectedSkins)
    newSelected.add(skinId)
    onSkinsChange(newSelected)
    
    // Show feedback
    const skin = getAllSkins?.().find(s => s.id === skinId)
    if (skin && onResponseChange) {
      onResponseChange(`✅ Added ${skin.name} to your wheel!`)
    }
  }

  // Function to add a custom skin with emoji selection
  const addCustomSkin = (skinName: string) => {
    setPendingSkinName(skinName)
    setShowEmojiModal(true)
  }

  // Function to handle emoji selection and add custom skin
  const handleEmojiConfirm = (emoji: string) => {
    // Create a custom skin with selected emoji
    const customSkin: CustomSkin = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: pendingSkinName,
      rarity: "Epic",
      season: "Custom",
      emoji: emoji,
      isCustom: true
    }
    
    // Add to custom skins and wheel
    if (onAddCustomSkin) {
      onAddCustomSkin(customSkin)
    }
    
    // Add to selected skins
    if (onSkinsChange) {
      const newSelected = new Set(selectedSkins)
      newSelected.add(customSkin.id)
      onSkinsChange(newSelected)
    }
    
    // Show feedback
    if (onResponseChange) {
      onResponseChange(`✅ Added custom skin "${pendingSkinName}" with ${emoji} to your wheel!`)
    }
  }

  const generateAiAnalysis = () => {
    const selectedSkinsArray = getFilteredSkins()
    const rarityDistribution = selectedSkinsArray.reduce(
      (acc, skin) => {
        acc[skin.rarity] = (acc[skin.rarity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const collabCount = selectedSkinsArray.filter(
      (skin) =>
        skin.season.includes("Marvel") ||
        skin.season.includes("DC") ||
        skin.season.includes("Star Wars") ||
        skin.season.includes("Anime") ||
        skin.season.includes("Dragon Ball"),
    ).length

    let analysis = "🔍 **Collection Analysis:**\n\n"
    analysis += `📊 You have ${selectedSkinsArray.length} skins selected\n`
    analysis += `🦸 ${collabCount} collaboration skins (${Math.round((collabCount / selectedSkinsArray.length) * 100)}%)\n`
    analysis += `💎 ${rarityDistribution.Mythic || 0} Mythic, ${rarityDistribution.Legendary || 0} Legendary skins\n\n`

    if (collabCount > selectedSkinsArray.length * 0.3) {
      analysis +=
        "🎯 **Insight:** You love crossover content! Your collection shows strong preference for collaboration skins.\n"
    }

    if ((rarityDistribution.Legendary || 0) + (rarityDistribution.Mythic || 0) > selectedSkinsArray.length * 0.2) {
      analysis += "⭐ **Insight:** You're a collector of rare items! High-tier skins dominate your selection.\n"
    }

    // Enhanced AI recommendations with auto-selection
    let recommendation = ""
    if (collabCount < 5) {
      recommendation = "Add more collaboration skins for prestige!"
      // Auto-add collaboration skins
      const collabSkins = getAllSkins().filter(
        (skin) =>
          skin.season.includes("Marvel") ||
          skin.season.includes("DC") ||
          skin.season.includes("Star Wars") ||
          skin.season.includes("Anime") ||
          skin.season.includes("Dragon Ball"),
      )
      const newSelected = collabSkins.map(skin => skin.id)
      onSkinsChange(new Set(newSelected))
      if (onRarityChange) {
        onRarityChange("all")
      }
    } else if (rarityDistribution.Common > selectedSkinsArray.length * 0.5) {
      recommendation = "Balance with more legendary skins!"
      // Auto-add legendary skins
      const legendarySkins = getAllSkins().filter((skin) => skin.rarity === "Legendary" || skin.rarity === "Mythic")
      const newSelected = legendarySkins.map(skin => skin.id)
      onSkinsChange(new Set(newSelected))
      if (onRarityChange) {
        onRarityChange("all")
      }
    } else {
      recommendation = "Perfect collection balance! You have great taste!"
    }

    analysis += `\n💡 **AI Recommendation:** ${recommendation}`

    onResponseChange(analysis)
  }

  const generateMetaLoadout = () => {
    const metaSkins = getAllSkins()
      .filter((skin) => skin.season.includes("Marvel") || skin.season.includes("DC") || skin.rarity === "Legendary")
      .slice(0, 10)
    const newSelected = metaSkins.map(skin => skin.id)
    onSkinsChange(new Set(newSelected))
    // Reset rarity filter to show all selected skins
    if (onRarityChange) {
      onRarityChange("all")
    }
    onResponseChange("🎯 Generated META loadout: Top-tier collaboration and legendary skins for maximum prestige!")
  }

  const generateThemedCollection = () => {
    const themes = ["Marvel", "DC", "Anime", "Star Wars"]
    const randomTheme = themes[Math.floor(Math.random() * themes.length)]
    const themedSkins = getAllSkins().filter(
      (skin) => skin.season.includes(randomTheme) || (randomTheme === "Anime" && skin.season.includes("Dragon Ball")),
    )
    const newSelected = themedSkins.map(skin => skin.id)
    onSkinsChange(new Set(newSelected))
    // Reset rarity filter to show all selected skins
    if (onRarityChange) {
      onRarityChange("all")
    }
    onResponseChange(`🎨 Generated ${randomTheme} themed collection! Perfect for fans of this universe.`)
  }

  const generateBalancedMix = () => {
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]
    const balancedSkins: Skin[] = []
    rarities.forEach((rarity) => {
      const skinsOfRarity = getAllSkins().filter((skin) => skin.rarity === rarity)
      const count = rarity === "Mythic" ? 1 : rarity === "Legendary" ? 3 : 5
      balancedSkins.push(...skinsOfRarity.slice(0, count))
    })
    const newSelected = balancedSkins.map(skin => skin.id)
    onSkinsChange(new Set(newSelected))
    // Reset rarity filter to show all selected skins
    if (onRarityChange) {
      onRarityChange("all")
    }
    onResponseChange("⚖️ Generated balanced collection: Perfect mix of all rarities for exciting spins!")
  }

  const generateSurpriseSelection = () => {
    const allSkins = getAllSkins()
    const surpriseCount = Math.floor(Math.random() * 15) + 10 // 10-25 skins
    const shuffled = [...allSkins].sort(() => Math.random() - 0.5)
    const surpriseSkins = shuffled.slice(0, surpriseCount)
    const newSelected = surpriseSkins.map(skin => skin.id)
    onSkinsChange(new Set(newSelected))
    // Reset rarity filter to show all selected skins
    if (onRarityChange) {
      onRarityChange("all")
    }
    onResponseChange(`🎲 Generated surprise selection: ${surpriseCount} random skins for maximum unpredictability!`)
  }

  const handleCustomGenerator = () => {
    const query = aiQuery.toLowerCase()
    let customSkins: Skin[] = []

    if (query.includes("villain") || query.includes("bad")) {
      customSkins = getAllSkins().filter(
        (skin) =>
          skin.name.includes("Joker") ||
          skin.name.includes("Thanos") ||
          skin.name.includes("Galactus") ||
          skin.name.includes("Kylo"),
      )
    } else if (query.includes("hero") || query.includes("good")) {
      customSkins = getAllSkins().filter(
        (skin) =>
          (skin.season.includes("Marvel") && !skin.name.includes("Thanos")) ||
          skin.name.includes("Batman") ||
          skin.name.includes("Superman"),
      )
    } else if (query.includes("female") || query.includes("girl")) {
      customSkins = getAllSkins().filter(
        (skin) =>
          skin.name.includes("Harley") ||
          skin.name.includes("Storm") ||
          skin.name.includes("Mystique") ||
          skin.name.includes("Catwoman") ||
          skin.name.includes("Sakura"),
      )
    } else {
      customSkins = getAllSkins()
        .sort(() => Math.random() - 0.5)
        .slice(0, 8)
    }

    const newSelected = customSkins.map(skin => skin.id)
    onSkinsChange(new Set(newSelected))
    // Reset rarity filter to show all selected skins
    if (onRarityChange) {
      onRarityChange("all")
    }
    onResponseChange(`🎯 Custom selection based on "${aiQuery}": Found ${customSkins.length} matching skins!`)
    onQueryChange("")
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
                  <p>👋 Hi! I'm your AI skin assistant!</p>
                  <p>Ask me anything about Fortnite skins!</p>
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
                      <span className="text-xs opacity-70">{chat.timestamp.toLocaleTimeString()}</span>
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
                placeholder="Ask me about skins, get recommendations, or request analysis..."
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
            {aiRecommendedSkins.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <Label className="text-sm font-medium text-gray-800">
                    📋 AI Recommended Skins:
                  </Label>
                </div>
                
                                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                   {(() => {
                     const allRecommendations = processAiRecommendations(aiRecommendedSkins)
                     const availableSkins = allRecommendations.filter(s => s.isAvailable)
                     const unavailableSkins = allRecommendations.filter(s => !s.isAvailable)
                     
                     if (allRecommendations.length === 0) {
                       return (
                         <div className="text-center text-gray-500 text-sm py-2">
                           🤔 No specific skins found in the AI response. Try asking for specific skin names!
                         </div>
                       )
                     }
                    
                    return (
                      <div className="space-y-2">
                        {/* Available Skins */}
                        {availableSkins.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-white rounded-lg p-2 border">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600">✅</span>
                              <span className="text-sm font-medium">{item.recommendedName}</span>
                              <span className="text-xs text-gray-500">({item.skin?.name})</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addSkinToWheel(item.skin!.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Add to Wheel
                            </Button>
                          </div>
                        ))}
                        
                        {/* Unavailable Skins */}
                        {unavailableSkins.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-2 border">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">❌</span>
                              <span className="text-sm text-gray-600">{item.recommendedName}</span>
                            </div>
                                                         <Button
                               size="sm"
                               onClick={() => addCustomSkin(item.recommendedName)}
                               className="bg-orange-600 hover:bg-orange-700 text-white"
                             >
                               Add Custom
                             </Button>
                          </div>
                        ))}
                        
                        {/* Summary */}
                        {availableSkins.length > 0 && (
                          <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
                            💡 Click "Add to Wheel" to add individual skins to your collection
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
                  "Recommend Marvel skins for me",
                  "What are the rarest skins?",
                  "Tell me about anime collaborations",
                  "What are my chances of getting legendary?",
                  "Help me choose the best skins",
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
              <Button onClick={generateAiAnalysis} className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze My Collection
              </Button>
            </div>

            {aiResponse && aiMode === "analysis" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-gray-800 whitespace-pre-wrap">{aiResponse}</div>
              </div>
            )}

            {/* User Preferences */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-800">Set Your Preferences:</Label>

              <div>
                <Label className="text-xs text-gray-600">Favorite Collaborations:</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["Marvel", "DC", "Star Wars", "Anime", "Music", "Gaming"].map((collab) => (
                    <Button
                      key={collab}
                      variant={userPreferences.favoriteCollabs.includes(collab) ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        const newCollabs = userPreferences.favoriteCollabs.includes(collab)
                          ? userPreferences.favoriteCollabs.filter((c) => c !== collab)
                          : [...userPreferences.favoriteCollabs, collab]
                        onPreferencesChange({ ...userPreferences, favoriteCollabs: newCollabs })
                      }}
                    >
                      {collab}
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
              <h4 className="font-semibold text-sm text-gray-800">AI Skin Generator</h4>
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
                onClick={generateSurpriseSelection}
              >
                🎲 Surprise Me!
              </Button>
            </div>

            {/* Custom Generator Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">Custom Request:</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 'only villains' or 'blue colored skins'"
                  value={aiQuery}
                  onChange={(e) => onQueryChange(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" disabled={!aiQuery.trim()} onClick={handleCustomGenerator}>
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

        {/* AI Recommendations (always visible) */}
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-800">
            <Target className="w-4 h-4" />
            Smart Recommendations
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {aiRecommendations.slice(0, 4).map((skin) => (
              <Button
                key={skin.id}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs bg-transparent"
                onClick={() => {
                  const newSelected = new Set(selectedSkins)
                  newSelected.add(skin.id)
                  onSkinsChange(newSelected)
                  // Show feedback
                  onResponseChange(`✅ Added ${skin.name} to your wheel!`)
                }}
              >
                <span>{skin.emoji}</span>
                <span className="truncate">{skin.name}</span>
              </Button>
            ))}
          </div>
                 </div>
               </CardContent>

        {/* Emoji Selection Modal */}
        <EmojiSelectionModal
          isOpen={showEmojiModal}
          onClose={() => setShowEmojiModal(false)}
          onConfirm={handleEmojiConfirm}
          skinName={pendingSkinName}
        />
      </Card>
    )
  }
