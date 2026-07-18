export type LetterOption = "alphabet" | "vowels" | "consonants" | "custom"
export type StyleOption = "uppercase" | "lowercase" | "mixed"
export type SpinMode = "normal" | "elimination" | "challenge"
export type ChallengeMode = "word-building" | "story-mode" | "rhyme-time" | "quick-fire"
export type LetterSidebarTab = "list" | "text" | "style" | "other"

export interface LetterSlice {
  id: string
  text: string
  weight: number
  enabled: boolean
  color: string
}

export interface SpinResult {
  id?: string
  letter: string
  timestamp: Date
  mode: SpinMode
  challengeCompleted?: boolean
  wordsFound?: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  maxProgress: number
  unlocked: boolean
}

export interface AIResponse {
  encouragement: string
  challenge?: string
  hints: string[]
  examples: string[]
  story?: string
}
