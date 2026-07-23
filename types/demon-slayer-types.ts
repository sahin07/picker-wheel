export type DemonSlayerCategory =
  | "main"
  | "hashira"
  | "demon"
  | "upper_rank"
  | "lower_rank"
  | "corps"
  | "breathing"
  | "nichirin"

export type DemonSlayerEntry = {
  id: string
  name: string
  emoji: string
  preview?: string
  category: DemonSlayerCategory[]
  breathingStyle?: string
  rank?: string
  custom?: boolean
  imageUrl?: string
}

export type DisplayMode = "emoji-name" | "emoji" | "name"
export type ActionMode = "normal" | "elimination" | "manual"

export type SpinResult = {
  character: DemonSlayerEntry
  timestamp: Date
}
