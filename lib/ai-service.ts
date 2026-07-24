// AI Service for Live API Integration
export interface AIResponse {
  message: string
  recommendedSkins?: string[]
  analysis?: {
    collectionInsights: string[]
    recommendations: string[]
    rarityDistribution: Record<string, number>
    collaborationCount: number
  }
  generatedSkins?: {
    theme?: string
    count: number
    skins: string[]
  }
}

export interface SmartWeightingData {
  id: string
  name: string
  weight: number
}

export interface AIInputRequest {
  prompt: string
  count: number
  category: string
}

export type AIProvider = "ollama" | "openai" | "gemini" | "openrouter"

export interface AIConfig {
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
  baseUrl?: string
}

class AIService {
  private config: AIConfig
  private baseUrl: string

  constructor(config: AIConfig) {
    this.config = config
    this.baseUrl =
      config.baseUrl ||
      process.env.AI_API_URL ||
      process.env.NEXT_PUBLIC_AI_API_URL ||
      "https://api.openai.com/v1/chat/completions"
  }

  async generateResponse(
    query: string,
    context: {
      currentSkins: any[]
      userPreferences: any
      chatHistory: any[]
      mode: 'chat' | 'analysis' | 'generator'
    }
  ): Promise<AIResponse> {
    try {
      const prompt = this.buildPrompt(query, context)
      
      console.log('AI Service: Making request to:', this.baseUrl)
      console.log('AI Service: API Key present:', !!this.config.apiKey)
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (this.config.apiKey) {
        headers.Authorization = `Bearer ${this.config.apiKey}`
      }
      // OpenRouter ranking / attribution headers (safe for OpenAI-compatible too)
      if (this.baseUrl.includes("openrouter.ai")) {
        headers["HTTP-Referer"] =
          process.env.NEXT_PUBLIC_SITE_URL || "https://spinifywheel.com"
        headers["X-Title"] = "Picker Wheel"
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(context.mode)
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      })

      console.log('AI Service: Response status:', response.status)
      console.log('AI Service: Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('AI Service: Error response body:', errorText)
        throw new Error(`AI API Error: ${response.status} - ${errorText}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text()
        console.error('AI Service: Non-JSON response:', errorText)
        throw new Error('AI API returned non-JSON response')
      }

      const data = await response.json()
      const aiMessage = data.choices[0]?.message?.content

      if (!aiMessage) {
        console.error('AI Service: No message in response:', data)
        throw new Error('No response from AI service')
      }

      return this.parseAIResponse(aiMessage, context.mode)
    } catch (error) {
      console.error('AI Service Error:', error)
      return this.getFallbackResponse(query, context)
    }
  }

  protected buildPrompt(query: string, context: any): string {
    const { currentSkins, userPreferences, chatHistory, mode } = context
    
    let prompt = `Query: ${query}\n\n`
    prompt += `Current Mode: ${mode}\n\n`
    
    if (currentSkins.length > 0) {
      prompt += `Current Skins (${currentSkins.length}): ${currentSkins.map(s => s.name).join(', ')}\n\n`
    }
    
    if (userPreferences) {
      prompt += `User Preferences: ${JSON.stringify(userPreferences)}\n\n`
    }
    
    if (chatHistory.length > 0) {
      prompt += `Recent Chat History:\n${chatHistory.slice(-3).map(msg => `${msg.role}: ${msg.message}`).join('\n')}\n\n`
    }

    return prompt
  }

  protected getSystemPrompt(mode: string): string {
    const basePrompt =
      "You are an AI assistant for a picker wheel application. You help users generate options, analyze choices, and create engaging content."

    switch (mode) {
      case "chat":
        return `${basePrompt}
        - Provide helpful, engaging responses
        - Suggest specific options when asked for recommendations
        - Be conversational and friendly
        - Include emojis and formatting when useful`

      case "analysis":
        return `${basePrompt}
        - Analyze scenarios and compare options
        - Provide insights, patterns, and recommendations
        - Be specific and practical`

      case "generator":
        return `${basePrompt}
        - Generate creative picker wheel options from the user's prompt
        - When asked for JSON arrays, return ONLY valid JSON with no markdown or extra text
        - Keep option names short, distinct, and user-friendly`

      default:
        return basePrompt
    }
  }

  protected parseAIResponse(response: string, mode: string): AIResponse {
    try {
      // Try to parse structured response
      if (response.includes('```json')) {
        const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1])
        }
      }

      // Fallback to simple text parsing
      return {
        message: response,
        recommendedSkins: this.extractSkinNames(response),
        analysis: mode === 'analysis' ? this.parseAnalysis(response) : undefined,
        generatedSkins: mode === 'generator' ? this.parseGeneratedSkins(response) : undefined
      }
    } catch (error) {
      console.error('Error parsing AI response:', error)
      return {
        message: response,
        recommendedSkins: this.extractSkinNames(response)
      }
    }
  }

  private extractSkinNames(text: string): string[] {
    const skins: string[] = []
    
    // Extract from bullet points and lists (most common format)
    const bulletMatches = text.match(/\*\s*([^:]+?)(?:\s*\([^)]+\))?/g)
    if (bulletMatches) {
      bulletMatches.forEach(match => {
        const skinName = match.replace(/\*\s*/, '').replace(/\s*\([^)]+\)/, '').trim()
        if (skinName && skinName.length > 2) {
          skins.push(skinName)
        }
      })
    }
    
    // Extract from numbered lists
    const numberedMatches = text.match(/\d+\.\s*([^:]+?)(?:\s*\([^)]+\))?/g)
    if (numberedMatches) {
      numberedMatches.forEach(match => {
        const skinName = match.replace(/\d+\.\s*/, '').replace(/\s*\([^)]+\)/, '').trim()
        if (skinName && skinName.length > 2) {
          skins.push(skinName)
        }
      })
    }
    
    // Extract from dash lists
    const dashMatches = text.match(/-\s*([^:]+?)(?:\s*\([^)]+\))?/g)
    if (dashMatches) {
      dashMatches.forEach(match => {
        const skinName = match.replace(/-\s*/, '').replace(/\s*\([^)]+\)/, '').trim()
        if (skinName && skinName.length > 2) {
          skins.push(skinName)
        }
      })
    }
    
    // Extract from lines that look like character names (capitalized words)
    const nameMatches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g)
    if (nameMatches) {
      nameMatches.forEach(match => {
        // Filter out common words that aren't character names
        const commonWords = ['Original', 'Later', 'Additions', 'Team', 'Villains', 'Notable', 'Characters', 'Marvel', 'Girl', 'Phoenix', 'Archangel', 'Shadowcat', 'Multiple', 'Man', 'Star', 'Trek', 'Crossover', 'Comic', 'Era', 'Type', 'Female', 'Male', 'List', 'Exhaustive', 'Franchise', 'Roster', 'Costumes', 'Aliases', 'Years', 'Focus', 'Specific', 'Let', 'Know']
        if (!commonWords.includes(match) && match.length > 2) {
          skins.push(match)
        }
      })
    }
    
    // Also check for specific known patterns
    const skinPatterns = [
      // Marvel skins
      /Iron Man|Deadpool|Wolverine|Thor|Storm|Mystique|Black Widow|Captain America|Spider-Man|Doctor Strange|Star-Lord/gi,
      // DC skins
      /Batman|Superman|Harley|Catwoman|Joker|Wonder Woman|Flash|Aquaman/gi,
      // Anime skins
      /Goku|Vegeta|Naruto|Sakura|Ichigo|Luffy|Zoro|Sanji/gi,
      // Star Wars skins
      /Mandalorian|Boba Fett|Kylo|Luke|Leia|Han Solo|Chewbacca/gi,
      // Other popular skins
      /Golden Peely|The Foundation|Galactus|Thanos|Midas|Raven|Ghoul Trooper|Skull Trooper/gi
    ]
    
    skinPatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        skins.push(...matches.map(m => m.trim()))
      }
    })
    
    return [...new Set(skins)] // Remove duplicates
  }

  private parseAnalysis(text: string): any {
      return {
      collectionInsights: this.extractInsights(text),
      recommendations: this.extractRecommendations(text),
      rarityDistribution: {},
      collaborationCount: 0
    }
  }

  private parseGeneratedSkins(text: string): any {
      return {
      theme: this.extractTheme(text),
      count: this.extractCount(text),
      skins: this.extractSkinNames(text)
    }
  }

  private extractInsights(text: string): string[] {
    const insights: string[] = []
    if (text.includes('love crossover')) insights.push('Collaboration preference detected')
    if (text.includes('collector')) insights.push('Collector behavior identified')
    if (text.includes('rare')) insights.push('Rarity focus observed')
    return insights
  }

  private extractRecommendations(text: string): string[] {
    const recommendations: string[] = []
    if (text.includes('add more')) recommendations.push('Consider adding more variety')
    if (text.includes('balance')) recommendations.push('Balance your collection')
    return recommendations
  }

  private extractTheme(text: string): string {
    if (text.includes('Marvel')) return 'Marvel'
    if (text.includes('DC')) return 'DC'
    if (text.includes('Anime')) return 'Anime'
    if (text.includes('Star Wars')) return 'Star Wars'
    return 'Mixed'
  }

  private extractCount(text: string): number {
    const countMatch = text.match(/(\d+)\s*skins?/i)
    return countMatch ? parseInt(countMatch[1]) : 10
  }

  protected getFallbackResponse(query: string, context: any): AIResponse {
    const queryLower = query.toLowerCase()

    if (context.mode === "generator") {
      const promptMatch = query.match(/prompt:\s*"([^"]+)"/i)
      const countMatch = query.match(/exactly\s+(\d+)/i)
      const categoryMatch = query.match(/category:\s*(\w+)/i)
      const topic = promptMatch?.[1] || "random ideas"
      const count = Math.min(Number(countMatch?.[1] || 8), 12)
      const category = categoryMatch?.[1] || "general"

      const categoryOptions: Record<string, string[]> = {
        food: ["Pizza", "Burger", "Sushi", "Tacos", "Pasta", "Salad", "Sandwich", "Curry", "Ramen", "Steak"],
        activities: ["Movie Night", "Hiking", "Board Games", "Cooking", "Reading", "Gym", "Park Walk", "Video Games"],
        general: ["Option A", "Option B", "Option C", "Option D", "Option E", "Option F", "Option G", "Option H"],
      }

      const pool = categoryOptions[category] || categoryOptions.general
      const options = Array.from({ length: count }, (_, index) => {
        if (index === 0) return topic
        return pool[index % pool.length]
      })

      return {
        message: JSON.stringify(options),
      }
    }

    if (queryLower.includes("yankees") || queryLower.includes("new york")) {
      return {
        message: "🏟️ The New York Yankees are one of baseball's most storied franchises! With 27 World Series championships, they're the most successful team in MLB history. Their home at Yankee Stadium and legendary players like Babe Ruth, Lou Gehrig, and Derek Jeter make them a perennial powerhouse.",
        recommendedSkins: ['New York Yankees']
      }
    }
    
    if (queryLower.includes('dodgers') || queryLower.includes('los angeles')) {
      return {
        message: "🌴 The Los Angeles Dodgers are a powerhouse in the National League! With 7 World Series titles and a rich history dating back to Brooklyn, they're known for their strong pitching staff and star-studded lineup. Dodger Stadium is one of baseball's most iconic venues.",
        recommendedSkins: ['Los Angeles Dodgers']
      }
    }
    
    if (queryLower.includes('red sox') || queryLower.includes('boston')) {
      return {
        message: "🧦 The Boston Red Sox are one of baseball's most beloved teams! Playing at historic Fenway Park since 1912, they've won 9 World Series championships. The Red Sox have a passionate fan base and a rich tradition of excellence.",
        recommendedSkins: ['Boston Red Sox']
      }
    }
    
    if (queryLower.includes('cubs') || queryLower.includes('chicago')) {
      return {
        message: "🐻 The Chicago Cubs are one of baseball's most historic franchises! Playing at beautiful Wrigley Field since 1914, they ended their 108-year championship drought in 2016. The Cubs have one of the most loyal fan bases in sports.",
        recommendedSkins: ['Chicago Cubs']
      }
    }
    
    if (queryLower.includes('giants') || queryLower.includes('san francisco')) {
      return {
        message: "⚾ The San Francisco Giants are a modern dynasty! With 3 World Series titles in 5 years (2010, 2012, 2014), they've established themselves as one of baseball's elite teams. Oracle Park offers stunning views of San Francisco Bay.",
        recommendedSkins: ['San Francisco Giants']
      }
    }
    
    if (queryLower.includes('cardinals') || queryLower.includes('st. louis')) {
      return {
        message: "🐦 The St. Louis Cardinals are one of baseball's most successful franchises! With 11 World Series championships, they're second only to the Yankees. Busch Stadium and the passionate Cardinal Nation make St. Louis a baseball paradise.",
        recommendedSkins: ['St. Louis Cardinals']
      }
    }
    
    return {
      message: `⚾ I understand you're asking about "${query}". I can help with MLB team recommendations, analysis, and baseball insights! Try asking about specific teams, predictions, or baseball history.`
    }
  }
}

// Alternative AI providers
export class AnthropicService extends AIService {
  constructor(config: AIConfig) {
    super(config)
    this.baseUrl = 'https://api.anthropic.com/v1/messages'
  }

  async generateResponse(query: string, context: any): Promise<AIResponse> {
    // Anthropic Claude implementation
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: this.config.maxTokens,
        messages: [
          {
            role: 'user',
            content: this.buildPrompt(query, context)
          }
        ]
      })
    })

    const data = await response.json()
    return this.parseAIResponse(data.content[0].text, context.mode)
  }
}

export class OllamaService extends AIService {
  constructor(config: AIConfig) {
    super({
      ...config,
      model: config.model.startsWith("gemini") ? "llama3.2" : config.model,
      baseUrl:
        config.baseUrl ||
        process.env.AI_API_URL ||
        process.env.NEXT_PUBLIC_AI_API_URL ||
        "http://localhost:11434/v1/chat/completions",
    })
  }
}

export class GoogleAIService extends AIService {
  private geminiModel: string

  constructor(config: AIConfig) {
    super(config)
    this.geminiModel =
      config.model === "gemini-1.5-flash"
        ? "gemini-2.0-flash"
        : config.model || "gemini-2.0-flash"
    this.baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent`
  }

  async generateResponse(query: string, context: any): Promise<AIResponse> {
    try {
      console.log('GoogleAIService: Making request to:', this.baseUrl)
      console.log('GoogleAIService: API Key present:', !!this.config.apiKey)
      
      const response = await fetch(`${this.baseUrl}?key=${this.config.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${this.getSystemPrompt(context.mode)}\n\n${this.buildPrompt(query, context)}`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: this.config.maxTokens,
            temperature: this.config.temperature,
          },
        }),
      })

      console.log('GoogleAIService: Response status:', response.status)
      console.log('GoogleAIService: Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('GoogleAIService: Error response body:', errorText)
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text()
        console.error('GoogleAIService: Non-JSON response:', errorText)
        throw new Error('Gemini API returned non-JSON response')
      }

      const data = await response.json()
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('GoogleAIService: Invalid response structure:', data)
        throw new Error('Invalid Gemini response structure')
      }

      const aiText = data.candidates[0].content.parts[0].text
      console.log('GoogleAIService: AI response text:', aiText)
      
      return this.parseAIResponse(aiText, context.mode)
    } catch (error) {
      console.error('GoogleAIService Error:', error)
      // Return fallback response instead of throwing
      return this.getFallbackResponse(query, context)
    }
  }
}

function getAIConfig(): AIConfig {
  return {
    apiKey: process.env.AI_API_KEY || process.env.NEXT_PUBLIC_AI_API_KEY || "",
    model:
      process.env.AI_MODEL ||
      process.env.NEXT_PUBLIC_AI_MODEL ||
      "nvidia/nemotron-3-ultra-550b-a55b:free",
    maxTokens: Number(
      process.env.AI_MAX_TOKENS || process.env.NEXT_PUBLIC_AI_MAX_TOKENS || 500
    ),
    temperature: Number(
      process.env.AI_TEMPERATURE || process.env.NEXT_PUBLIC_AI_TEMPERATURE || 0.7
    ),
    baseUrl: process.env.AI_API_URL || process.env.NEXT_PUBLIC_AI_API_URL,
  }
}

export function createAIService(): AIService {
  const provider = (
    process.env.AI_PROVIDER ||
    process.env.NEXT_PUBLIC_AI_PROVIDER ||
    "openrouter"
  ).toLowerCase() as AIProvider
  const config = getAIConfig()

  switch (provider) {
    case "gemini":
      return new GoogleAIService(config)
    case "openai":
      return new AIService({
        ...config,
        baseUrl:
          config.baseUrl || "https://api.openai.com/v1/chat/completions",
      })
    case "openrouter":
      return new AIService({
        ...config,
        model: config.model || "nvidia/nemotron-3-ultra-550b-a55b:free",
        baseUrl:
          config.baseUrl || "https://openrouter.ai/api/v1/chat/completions",
      })
    case "ollama":
      return new OllamaService(config)
    default:
      return new AIService({
        ...config,
        model: config.model || "nvidia/nemotron-3-ultra-550b-a55b:free",
        baseUrl:
          config.baseUrl || "https://openrouter.ai/api/v1/chat/completions",
      })
  }
}

// Default: OpenRouter free models. Set AI_PROVIDER=ollama for local, or gemini/openai as needed.
export const aiService = createAIService()