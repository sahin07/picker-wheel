export type Pokemon = {
  id: string
  name: string
  type: string[]
  generation: string
  emoji: string
  region: string
  isLegendary: boolean
  isStarter: boolean
  /** Mythical entries (separate from box legendaries when both flags are used). */
  isMythical?: boolean
  /** Eevee + Eeveelutions for the Eeveelution wheel template. */
  isEeveelution?: boolean
  popularity: "low" | "medium" | "high"
  preview: string
}

export type SpinResult = {
  pokemon: Pokemon
  timestamp: Date
}

export type DisplayMode = "emoji-name" | "emoji" | "name"
export type ActionMode = "normal" | "elimination" | "manual"
export type GenerationFilter =
  | "all"
  | "gen1"
  | "gen2"
  | "gen3"
  | "gen4"
  | "gen5"
  | "gen6"
  | "gen7"
  | "gen8"
  | "gen9"

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
