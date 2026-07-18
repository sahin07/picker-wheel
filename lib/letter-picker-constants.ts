import type { LetterSlice } from "@/types/letter-picker"

export const LETTER_OPTIONS = {
  alphabet: {
    label: "Full Alphabet",
    example: "A-Z",
  },
  vowels: {
    label: "Vowels Only",
    example: "A, E, I, O, U",
  },
  consonants: {
    label: "Consonants Only",
    example: "B, C, D, F, G...",
  },
  custom: {
    label: "Custom Letters",
    example: "Enter your own",
  },
} as const

export const STYLE_OPTIONS = {
  uppercase: "Uppercase (A, B, C)",
  lowercase: "Lowercase (a, b, c)",
  mixed: "Mixed Case (A, b, C)",
} as const

export const DEFAULT_WHEEL_TITLE = "Random Letter Picker"
export const DEFAULT_WHEEL_DESCRIPTION =
  "Generate random letters instantly for word games, Scrabble practice, classroom activities, and creative writing."

/** Warm A–Z palette inspired by common random-letter wheels */
export const LETTER_WHEEL_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
]

export const LETTER_COLOR_PALETTES = [
  {
    name: "Default",
    colors: ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#06b6d4", "#8b5cf6"],
  },
  {
    name: "Warm",
    colors: ["#dc2626", "#ea580c", "#d97706", "#ca8a04", "#b45309", "#9a3412"],
  },
  {
    name: "Fresh",
    colors: ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#14b8a6", "#2dd4bf"],
  },
  {
    name: "Ocean",
    colors: ["#0ea5e9", "#06b6d4", "#0284c7", "#0369a1", "#1d4ed8", "#3b82f6"],
  },
  {
    name: "Candy",
    colors: ["#ec4899", "#f472b6", "#a855f7", "#c084fc", "#f43f5e", "#fb7185"],
  },
  {
    name: "Mono",
    colors: ["#111827", "#374151", "#6b7280", "#9ca3af", "#d1d5db", "#4b5563"],
  },
  {
    name: "Sunset",
    colors: ["#f97316", "#ea580c", "#dc2626", "#be123c", "#9f1239", "#7f1d1d"],
  },
  {
    name: "Forest",
    colors: ["#166534", "#15803d", "#16a34a", "#4d7c0f", "#65a30d", "#84cc16"],
  },
  {
    name: "Royal",
    colors: ["#4c1d95", "#5b21b6", "#6d28d9", "#7c3aed", "#8b5cf6", "#a78bfa"],
  },
  {
    name: "Classic",
    colors: ["#4ade80", "#fbbf24", "#f97316", "#84cc16", "#eab308", "#22c55e"],
  },
] as const

export const BULK_COLOR_SWATCHES = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
]

export const SOUND_PRESETS = [
  { id: "classic", label: "Classic Click" },
  { id: "tick", label: "Tick Tock" },
  { id: "whoosh", label: "Whoosh" },
  { id: "chime", label: "Win Chime" },
] as const

export const ACHIEVEMENTS = [
  {
    id: "first-spin",
    title: "First Spin",
    description: "Complete your first letter spin",
    icon: "🎯",
    progress: 0,
    maxProgress: 1,
    unlocked: false,
  },
  {
    id: "alphabet-explorer",
    title: "Alphabet Explorer",
    description: "Spin 10 different letters",
    icon: "🔤",
    progress: 0,
    maxProgress: 10,
    unlocked: false,
  },
  {
    id: "word-master",
    title: "Word Master",
    description: "Find 50 words in challenges",
    icon: "📚",
    progress: 0,
    maxProgress: 50,
    unlocked: false,
  },
  {
    id: "streak-5",
    title: "Hot Streak",
    description: "Complete 5 challenges in a row",
    icon: "🔥",
    progress: 0,
    maxProgress: 5,
    unlocked: false,
  },
] as const

export function createLetterId() {
  return `letter-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createDefaultAlphabetSlices(): LetterSlice[] {
  return Array.from({ length: 26 }, (_, i) => {
    const text = String.fromCharCode(65 + i)
    return {
      id: createLetterId() + `-${text}`,
      text,
      weight: 1,
      enabled: true,
      color: LETTER_WHEEL_COLORS[i % LETTER_WHEEL_COLORS.length],
    }
  })
}

export function lettersToSlices(letters: string[], colors = LETTER_WHEEL_COLORS): LetterSlice[] {
  return letters.map((text, i) => ({
    id: createLetterId() + `-${i}`,
    text,
    weight: 1,
    enabled: true,
    color: colors[i % colors.length],
  }))
}

export function applyPaletteToSlices(slices: LetterSlice[], colors: readonly string[]): LetterSlice[] {
  return slices.map((slice, i) => ({
    ...slice,
    color: colors[i % colors.length],
  }))
}

export function parseTextToSlices(text: string, existing?: LetterSlice[]): LetterSlice[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.map((line, i) => {
    // Supports "3, A" or "A, 3" or plain "A"
    let weight = 1
    let value = line

    const csvMatch = line.match(/^(\d+)\s*[,|]\s*(.+)$/) || line.match(/^(.+?)\s*[,|]\s*(\d+)$/)
    if (csvMatch) {
      if (/^\d+$/.test(csvMatch[1])) {
        weight = Math.max(1, parseInt(csvMatch[1], 10) || 1)
        value = csvMatch[2].trim()
      } else {
        value = csvMatch[1].trim()
        weight = Math.max(1, parseInt(csvMatch[2], 10) || 1)
      }
    }

    const prev = existing?.[i]
    return {
      id: prev?.id || createLetterId() + `-${i}`,
      text: value,
      weight,
      enabled: prev?.enabled ?? true,
      color: prev?.color || LETTER_WHEEL_COLORS[i % LETTER_WHEEL_COLORS.length],
    }
  })
}

export function slicesToText(slices: LetterSlice[]): string {
  return slices
    .map((s) => (s.weight !== 1 ? `${s.weight}, ${s.text}` : s.text))
    .join("\n")
}
