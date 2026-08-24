export type FingerPickerActionMode = "normal" | "elimination"

export type FingerPickerMode =
  | "roulette"
  | "who-goes-first"
  | "elimination"
  | "last-finger"
  | "tournament"
  | "multiple"
  | "team-battle"
  | "truth-or-dare"
  | "fastest"
  | "lucky"
  | "dont-get-picked"
  | "random-player"

export type FingerPickerPhase =
  | "idle"
  | "lucky-preview"
  | "fastest-countdown"
  | "countdown"
  | "picking"
  | "result"

export type FingerPickerPlayer = {
  id: string
  name: string
  emoji: string
  color: string
  eliminated: boolean
}

export type FingerPickerHistoryItem = {
  id: string
  at: string
  mode: FingerPickerMode
  names: string[]
  message: string
}

export const FINGER_PICKER_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
] as const

export const FINGER_PICKER_EMOJIS = [
  "👆",
  "🫵",
  "🖐️",
  "✌️",
  "🤙",
  "👍",
  "🤘",
  "🖖",
  "👌",
  "💪",
] as const
