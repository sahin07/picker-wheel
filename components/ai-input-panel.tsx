"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Sparkles, 
  Brain, 
  Zap, 
  Loader2, 
  Wand2, 
  Target, 
  TrendingUp,
  HelpCircle,
  RefreshCw
} from "lucide-react"
import { useEnhancedWheelStore } from "@/stores/enhanced-wheel-store"
import { useToast } from "@/contexts/toast-context"
import { aiService, type AIInputRequest, type SmartWeightingData } from "@/lib/ai-service"

export default function AIInputPanel() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [count, setCount] = useState(8)
  const [category, setCategory] = useState("general")
  const [enableSmartWeighting, setEnableSmartWeighting] = useState(false)
  const [smartWeights, setSmartWeights] = useState<SmartWeightingData[]>([])
  const [showMysterySpin, setShowMysterySpin] = useState(false)

  const { 
    addOption, 
    clearAllOptions, 
    getCurrentWheelData,
    updateCurrentWheelData,
    syncWithCurrentWheel,
    forceUpdate
  } = useEnhancedWheelStore()
  
  const { showToast } = useToast()

  // Generate contextual inputs using AI
  const handleGenerateInputs = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a prompt first!", "warning")
      return
    }

    setIsGenerating(true)
    
    try {
      // Call the AI API endpoint
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Generate exactly ${count} creative options for a picker wheel based on this prompt: "${prompt.trim()}". Category: ${category}. 
          
          IMPORTANT: Return ONLY a valid JSON array of strings, like this example:
          ["Option 1", "Option 2", "Option 3"]
          
          Do not include any other text, explanations, or formatting. Just the JSON array.`,
          context: {
            currentSkins: [],
            userPreferences: {},
            chatHistory: [],
            mode: 'generator'
          }
        })
      })

                    const result = await response.json()
       console.log('Full API Response:', result)
       
       if (result.success && result.data) {
         // Handle different response formats
         let aiMessage = ''
         let options: string[] = []
         
         // Check if it's a simple message or complex object
         if (typeof result.data === 'string') {
           aiMessage = result.data
         } else if (result.data.message) {
           aiMessage = result.data.message
         } else if (Array.isArray(result.data)) {
           // Direct array response
           options = result.data.map((item: any) => 
             typeof item === 'string' ? item : item.name || item.description || 'Unknown'
           )
         }
         
         // If we don't have options yet, try to parse from message
         if (options.length === 0 && aiMessage) {
           // Try to extract options from the AI response
           try {
             console.log('AI Response:', aiMessage)
             
             // First, try to parse the entire response as JSON
             try {
               const parsed = JSON.parse(aiMessage.trim())
               if (Array.isArray(parsed)) {
                 options = parsed
               }
             } catch (e) {
               // If that fails, look for JSON array in the response
               const jsonMatch = aiMessage.match(/\[.*\]/s)
               if (jsonMatch) {
                 options = JSON.parse(jsonMatch[0])
               } else {
                 // Fallback: split by lines and clean up
                 options = aiMessage
                   .split('\n')
                   .map(line => line.trim())
                   .filter(line => line && 
                     !line.startsWith('```') && 
                     !line.startsWith('*') && 
                     !line.startsWith('-') &&
                     !line.startsWith('Here') &&
                     !line.startsWith('Generated') &&
                     line.length > 0)
                   .slice(0, count)
               }
             }
             
             // Ensure we have the right number of options
             if (options.length < count) {
               const remaining = count - options.length
               for (let i = 0; i < remaining; i++) {
                 options.push(`Generated Option ${options.length + 1}`)
               }
             }
             
             console.log('Parsed options:', options)
           } catch (parseError) {
             console.error('Parse error:', parseError)
             // If parsing fails, create simple numbered options
             options = Array.from({ length: count }, (_, i) => `Option ${i + 1}`)
           }
         }

         // Clear existing options and add new AI-generated ones
         clearAllOptions()
         
         options.forEach(option => {
           addOption(option)
         })
         
         showToast(`Generated ${options.length} options!`, "success")
         
         // Apply smart weighting if enabled
         if (enableSmartWeighting && options.length > 0) {
           await handleSmartWeighting()
         }
       } else {
         console.error('Invalid API response:', result)
         showToast("Invalid response from AI service", "error")
       }
    } catch (error) {
      console.error('AI Generation Error:', error)
      showToast("Error generating options. Please try again.", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  // Apply smart weighting based on past results
  const handleSmartWeighting = async () => {
    setIsAnalyzing(true)
    
    try {
      const currentData = getCurrentWheelData()
      const pastResults = currentData.recentResults || []
      const currentOptions = currentData.options || []
      
      // Extract option names (strings) from option objects
      const optionNames = currentOptions.map((option: any) => 
        typeof option === 'string' ? option : option.name || option.id || 'Unknown'
      )
      
      // Call AI API for smart weighting
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Analyze these options and suggest weights based on popularity and user preferences: ${optionNames.join(', ')}. 
          
          Consider factors like:
          - Popularity and appeal
          - Seasonal relevance
          - User engagement potential
          - Balance and variety
          
          Return ONLY a JSON array of weight objects, like this example:
          [{"optionId": "option1", "weight": 1.2}, {"optionId": "option2", "weight": 0.8}]
          
          Weights should be between 0.1 and 3.0, where:
          - 0.1-0.5: Very low chance
          - 0.6-0.9: Below average
          - 1.0: Normal chance
          - 1.1-1.5: Above average
          - 1.6-2.0: High chance
          - 2.1-3.0: Very high chance`,
          context: {
            currentSkins: currentOptions,
            userPreferences: {},
            chatHistory: [],
            mode: 'analysis'
          }
        })
      })

      const result = await response.json()
      
      if (result.success && result.data) {
        // Parse weights from AI response
        const aiMessage = result.data.message
        let weights: any[] = []
        
        try {
          console.log('Smart Weighting AI Response:', aiMessage)
          
          // First, try to parse the entire response as JSON
          try {
            const parsed = JSON.parse(aiMessage.trim())
            if (Array.isArray(parsed)) {
              weights = parsed
            }
          } catch (e) {
            // If that fails, look for JSON array in the response
            const jsonMatch = aiMessage.match(/\[.*\]/s)
            if (jsonMatch) {
              weights = JSON.parse(jsonMatch[0])
            } else {
              // Fallback: create equal weights with option IDs
              weights = optionNames.map((name, index) => ({
                optionId: name,
                weight: 1.0
              }))
            }
          }
          
          // Validate and normalize weights
          weights = weights.map((weight, index) => {
            if (typeof weight === 'number') {
              return {
                optionId: optionNames[index] || `option${index + 1}`,
                weight: Math.max(0.1, Math.min(3.0, weight))
              }
            } else if (weight && typeof weight.weight === 'number') {
              return {
                optionId: weight.optionId || optionNames[index] || `option${index + 1}`,
                weight: Math.max(0.1, Math.min(3.0, weight.weight))
              }
            } else {
              return {
                optionId: optionNames[index] || `option${index + 1}`,
                weight: 1.0
              }
            }
          })
          
          console.log('Parsed weights:', weights)
        } catch (parseError) {
          console.error('Weight parsing error:', parseError)
          // Fallback: equal weights
          weights = optionNames.map((name, index) => ({
            optionId: name,
            weight: 1.0
          }))
        }
        
        setSmartWeights(weights)
        
        // Update wheel data with smart weights
        updateCurrentWheelData((data: any) => ({
          ...data,
          smartWeights: weights
        }))
        
        showToast("Smart weighting applied based on past results!", "success")
      } else {
        showToast("Error applying smart weighting", "error")
      }
    } catch (error) {
      console.error('Smart Weighting Error:', error)
      showToast("Error applying smart weighting", "error")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Generate mystery spin options
  const handleMysterySpin = async () => {
    setIsGenerating(true)
    
    try {
      // Call AI API for mystery spin options
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Generate exactly ${count} random mystery options for a picker wheel in the ${category} category. Make them fun, surprising, and unexpected! 

IMPORTANT: Return ONLY a valid JSON array of strings, like this example:
["Mystery Option 1", "Mystery Option 2", "Mystery Option 3"]

Make the options creative and exciting. For example:
- If category is "food": ["Secret Recipe", "Chef's Surprise", "Mystery Ingredient"]
- If category is "activities": ["Hidden Adventure", "Secret Mission", "Mystery Challenge"]
- If category is "general": ["Random Surprise", "Mystery Box", "Secret Pick"]

Do not include any other text, explanations, or formatting. Just the JSON array.`,
          context: {
            currentSkins: [],
            userPreferences: {},
            chatHistory: [],
            mode: 'generator'
          }
        })
      })

      const result = await response.json()
      
      if (result.success && result.data) {
        // Parse the AI response to extract options
        const aiMessage = result.data.message
        let options: string[] = []
        
        try {
          console.log('Mystery Spin AI Response:', aiMessage)
          
          // First, try to parse the entire response as JSON
          try {
            const parsed = JSON.parse(aiMessage.trim())
            if (Array.isArray(parsed)) {
              options = parsed
            }
          } catch (e) {
            // If that fails, look for JSON array in the response
            const jsonMatch = aiMessage.match(/\[.*\]/s)
            if (jsonMatch) {
              options = JSON.parse(jsonMatch[0])
            } else {
              // Fallback: create mystery options based on category
              const mysteryOptions = {
                'food': ['🍕 Chef\'s Surprise', '🍜 Mystery Dish', '🍰 Secret Recipe', '🥘 Hidden Ingredient', '🍖 Random Meat', '🥗 Mystery Salad', '🍝 Secret Sauce', '🍪 Mystery Dessert'],
                'activities': ['🎮 Hidden Adventure', '🏃 Secret Mission', '🎯 Mystery Challenge', '🎨 Random Art', '🎵 Secret Song', '📚 Mystery Book', '🎪 Random Circus', '🏖️ Secret Beach'],
                'date-night': ['💕 Secret Date', '🌹 Mystery Romance', '🎭 Hidden Theater', '🍷 Secret Wine', '🎪 Mystery Show', '💎 Random Jewelry', '🌙 Secret Moon', '🎨 Mystery Art'],
                'writing': ['✍️ Secret Story', '📝 Mystery Poem', '🎭 Hidden Script', '📚 Random Book', '✒️ Mystery Pen', '📖 Secret Chapter', '🎪 Random Scene', '📜 Mystery Scroll'],
                'general': ['🎁 Random Surprise', '📦 Mystery Box', '🎲 Secret Pick', '🎪 Random Show', '🎭 Mystery Act', '🎨 Secret Art', '🎵 Random Song', '🎪 Mystery Game']
              }
              
              const categoryOptions = mysteryOptions[category as keyof typeof mysteryOptions] || mysteryOptions.general
              options = Array.from({ length: count }, (_, i) => categoryOptions[i % categoryOptions.length])
            }
          }
          
          console.log('Parsed mystery options:', options)
        } catch (parseError) {
          console.error('Mystery parse error:', parseError)
          // Fallback: create mystery options
          options = Array.from({ length: count }, (_, i) => `🎲 Mystery Option ${i + 1}`)
        }
        
        // Clear existing options and add mystery options
        clearAllOptions()
        
        options.forEach(option => {
          addOption(option)
        })
        
        setShowMysterySpin(true)
        showToast(`🎲 ${options.length} Mystery options generated! The wheel is now full of surprises! 🎲`, "success")
      } else {
        showToast("Error generating mystery spin options", "error")
      }
    } catch (error) {
      console.error('Mystery Spin Error:', error)
      showToast("Error generating mystery spin options", "error")
    } finally {
      setIsGenerating(false)
    }
  }

  // Quick preset prompts
  const quickPrompts = [
    { text: "💕 Date night ideas", category: "date-night", emoji: "💕", color: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100" },
    { text: "🍕 Lunch options", category: "food", emoji: "🍕", color: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100" },
    { text: "✍️ Creative writing prompts", category: "writing", emoji: "✍️", color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100" },
    { text: "🎮 Fun activities", category: "activities", emoji: "🎮", color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" }
  ]

  const handleQuickPrompt = (promptText: string, promptCategory: string) => {
    setPrompt(promptText)
    setCategory(promptCategory)
  }

  return (
    <div className="space-y-6">
      {/* AI Input Generation */}
      <Card>
        <CardHeader>
                     <CardTitle className="flex items-center gap-2">
             <div className="flex items-center gap-2">
               <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
               <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                 ✨ AI-Powered Input Generation ✨
               </span>
             </div>
           </CardTitle>
          <CardDescription>
            Let AI generate contextual options based on your prompt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Prompts */}
          <div>
            <Label className="text-sm font-medium text-purple-700">🎯 Quick Prompts</Label>
            <div className="flex flex-wrap gap-2 mt-2">
                             {quickPrompts.map((quickPrompt, index) => (
                 <Button
                   key={index}
                   variant="outline"
                   size="sm"
                   onClick={() => handleQuickPrompt(quickPrompt.text.replace(quickPrompt.emoji + " ", ""), quickPrompt.category)}
                   className={`text-xs ${quickPrompt.color} border-2 font-medium transition-all duration-200 hover:scale-105`}
                 >
                   <span className="mr-1">{quickPrompt.emoji}</span>
                   {quickPrompt.text.replace(quickPrompt.emoji + " ", "")}
                 </Button>
               ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <Label htmlFor="prompt" className="text-sm font-medium">
              Custom Prompt
            </Label>
                         <Textarea
               id="prompt"
               placeholder="✨ e.g., Generate 10 ideas for a weekend getaway... ✨"
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               className="mt-1 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50"
               rows={3}
             />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="count" className="text-sm font-medium">
                Number of Options
              </Label>
                             <Select value={count.toString()} onValueChange={(value) => setCount(parseInt(value))}>
                 <SelectTrigger className="mt-1 border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {[4, 6, 8, 10, 12].map(num => (
                     <SelectItem key={num} value={num.toString()}>
                       🔢 {num} options
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
                             <Select value={category} onValueChange={setCategory}>
                 <SelectTrigger className="mt-1 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="general">🌍 General</SelectItem>
                   <SelectItem value="date-night">💕 Date Night</SelectItem>
                   <SelectItem value="food">🍕 Food & Dining</SelectItem>
                   <SelectItem value="writing">✍️ Creative Writing</SelectItem>
                   <SelectItem value="activities">🎮 Activities</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>

          {/* Generate Button */}
                     <Button 
             onClick={handleGenerateInputs}
             disabled={isGenerating || !prompt.trim()}
             className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 text-lg transition-all duration-300 hover:scale-105 shadow-lg"
           >
             {isGenerating ? (
               <>
                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                 <span className="animate-pulse">✨ Generating Magic... ✨</span>
               </>
             ) : (
               <>
                 <Wand2 className="mr-2 h-5 w-5" />
                 🚀 Generate Options 🚀
               </>
             )}
           </Button>
        </CardContent>
      </Card>

      {/* Smart Weighting */}
      <Card>
        <CardHeader>
                     <CardTitle className="flex items-center gap-2">
             <div className="flex items-center gap-2">
               <Brain className="h-6 w-6 text-blue-500 animate-pulse" />
               <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold">
                 🧠 Smart Weighting 🧠
               </span>
             </div>
           </CardTitle>
          <CardDescription>
            Adjust option weights based on past results and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
                     <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
             <Switch
               id="smart-weighting"
               checked={enableSmartWeighting}
               onCheckedChange={setEnableSmartWeighting}
               className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-cyan-600"
             />
             <Label htmlFor="smart-weighting" className="text-blue-700 font-semibold">
               🎯 Enable Smart Weighting
             </Label>
           </div>

          {enableSmartWeighting && (
            <div className="space-y-3">
                             <Button 
                 onClick={handleSmartWeighting}
                 disabled={isAnalyzing}
                 variant="outline"
                 size="sm"
                 className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 font-bold shadow-lg transition-all duration-300 hover:scale-105"
               >
                 {isAnalyzing ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     🔍 Analyzing Magic...
                   </>
                 ) : (
                   <>
                     <Target className="mr-2 h-4 w-4" />
                     🎯 Analyze Past Results
                   </>
                 )}
               </Button>

                             {smartWeights.length > 0 && (
                 <div className="space-y-2">
                   <Label className="text-sm font-medium">Smart Weights Applied</Label>
                   <div className="space-y-1">
                     {smartWeights.map((weight, index) => {
                       const weightValue = weight.weight || 1.0
                       const getWeightColor = (w: number) => {
                         if (w >= 2.0) return 'bg-red-100 text-red-800'
                         if (w >= 1.5) return 'bg-orange-100 text-orange-800'
                         if (w >= 1.1) return 'bg-green-100 text-green-800'
                         if (w <= 0.5) return 'bg-gray-100 text-gray-800'
                         if (w <= 0.9) return 'bg-yellow-100 text-yellow-800'
                         return 'bg-blue-100 text-blue-800'
                       }
                       
                       return (
                         <div key={index} className="flex items-center justify-between text-sm">
                           <span className="truncate flex-1">
                             {weight.optionId || `Option ${index + 1}`}
                           </span>
                           <Badge 
                             variant="secondary" 
                             className={`ml-2 ${getWeightColor(weightValue)}`}
                           >
                             {weightValue.toFixed(2)}x
                           </Badge>
                         </div>
                       )
                     })}
                   </div>
                   <div className="text-xs text-gray-500 mt-2">
                     <p>• Red: Very high chance (2.0x+)</p>
                     <p>• Orange: High chance (1.5x+)</p>
                     <p>• Green: Above average (1.1x+)</p>
                     <p>• Blue: Normal chance (1.0x)</p>
                     <p>• Yellow: Below average (0.9x-)</p>
                     <p>• Gray: Very low chance (0.5x-)</p>
                   </div>
                 </div>
               )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mystery Spin */}
      <Card>
        <CardHeader>
                     <CardTitle className="flex items-center gap-2">
             <div className="flex items-center gap-2">
               <HelpCircle className="h-6 w-6 text-orange-500 animate-pulse" />
               <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">
                 🎲 Mystery Spin 🎲
               </span>
             </div>
           </CardTitle>
          <CardDescription>
            Generate surprise options for an exciting mystery spin
          </CardDescription>
        </CardHeader>
        <CardContent>
                     <Button 
             onClick={handleMysterySpin}
             disabled={isGenerating}
             variant="outline"
             className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 font-bold py-3 text-lg shadow-lg transition-all duration-300 hover:scale-105"
           >
             {isGenerating ? (
               <>
                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                 <span className="animate-pulse">🎲 Creating Mystery...</span>
               </>
             ) : (
               <>
                 <Zap className="mr-2 h-5 w-5" />
                 🎲 Generate Mystery Spin 🎲
               </>
             )}
           </Button>
          
                     {showMysterySpin && (
             <div className="mt-3 p-4 bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-lg shadow-lg">
               <div className="flex items-center gap-2">
                 <span className="text-2xl">🎲</span>
                 <p className="text-sm text-orange-800 font-semibold">
                   ✨ Mystery spin options are ready! The wheel now contains surprise options! ✨
                 </p>
                 <span className="text-2xl">🎲</span>
               </div>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  )
} 