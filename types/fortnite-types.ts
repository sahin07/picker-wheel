export type Skin = {
  id: string
  name: string
  rarity: string
  emoji: string
  season: string
  preview: string
}

export type SpinResult = {
  skin: Skin
  timestamp: Date
}

export type DisplayMode = "emoji-name" | "emoji" | "name"
export type ActionMode = "normal" | "elimination" | "manual"
export type RarityFilter = "all" | "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic"

export type UserPreferences = {
  favoriteGenres: string[]
  preferredRarity: string
  playStyle: string
  favoriteCollabs: string[]
}

export type AIMode = "chat" | "analysis" | "generator"

export type ChatMessage = {
  role: "user" | "ai"
  message: string
  timestamp: Date
}

export interface AITabProps {
  aiMode: AIMode
  aiQuery: string
  aiResponse: string
  aiLoading: boolean
  aiChatHistory: ChatMessage[]
  aiRecommendations: Skin[]
  userPreferences: UserPreferences
  selectedSkins: Set<string>
  onModeChange: (mode: AIMode) => void
  onQueryChange: (query: string) => void
  onQuerySubmit: () => void
  onPreferencesChange: (preferences: UserPreferences) => void
  onSkinsChange: (skins: Set<string>) => void
  onResponseChange: (response: string) => void
  onRarityChange?: (rarity: RarityFilter) => void
  getAllSkins: () => Skin[]
  getFilteredSkins: () => Skin[]
}
