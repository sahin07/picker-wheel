export type JjkCategory =
  | "main"
  | "student"
  | "teacher"
  | "villain"
  | "cursed_spirit"
  | "grade_1"
  | "special_grade"
  | "technique"
  | "domain"

export type JjkEntry = {
  id: string
  name: string
  emoji: string
  preview?: string
  category: JjkCategory[]
  clan?: string
  school?: string
  custom?: boolean
  imageUrl?: string
}

export type DisplayMode = "emoji-name" | "emoji" | "name"
export type ActionMode = "normal" | "elimination" | "manual"

export type SpinResult = {
  character: JjkEntry
  timestamp: Date
}
