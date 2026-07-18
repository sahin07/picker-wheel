export type Pokemon = {
  id: string
  name: string
  type: string[]
  generation: string
  emoji: string
  region: string
  isLegendary: boolean
  isStarter: boolean
  popularity: "low" | "medium" | "high"
  preview: string
}

export type SpinResult = {
  pokemon: Pokemon
  timestamp: Date
}

export type DisplayMode = "emoji-name" | "emoji" | "name"
export type ActionMode = "normal" | "elimination" | "manual"
export type GenerationFilter = "all" | "gen1" | "gen2" | "gen3" | "gen4" | "gen5" | "gen6" | "gen7" | "gen8"

export type UserPreferences = {
  favoriteTypes: string[]
  preferredGeneration: string
  playStyle: string
  favoriteRegions: string[]
}

export type AIMode = "chat" | "analysis" | "generator"

export type ChatMessage = {
  role: "user" | "ai"
  message: string
  timestamp: Date
}
