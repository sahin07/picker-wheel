/** Parse pasted or uploaded word lists from TXT / CSV content. */
export function parseWordListFile(content: string): string[] {
  const lines = content.split(/\r?\n/)
  const words: string[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line.startsWith("#")) continue

    if (line.includes(",")) {
      const cells = line
        .split(",")
        .map((cell) => cell.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)

      // Header row
      if (cells.length > 0 && /^(name|word)$/i.test(cells[0])) continue

      // word,weight  → keep word only
      if (cells.length === 2 && /^\d+(\.\d+)?$/.test(cells[1])) {
        words.push(cells[0])
        continue
      }

      // Comma-separated word list on one line (or multi-column word CSV)
      for (const cell of cells) {
        if (!/^(name|word|weight)$/i.test(cell)) words.push(cell)
      }
      continue
    }

    words.push(line.replace(/^["']|["']$/g, ""))
  }

  return dedupeWords(words)
}

export function dedupeWords(words: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const word of words) {
    const cleaned = word.trim()
    if (!cleaned) continue
    const key = cleaned.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(cleaned)
  }
  return out
}

export type WordListFilter = {
  startsWith?: string
  minLength?: number
  maxLength?: number
  query?: string
}

export function filterWords(words: string[], filter: WordListFilter): string[] {
  const letter = filter.startsWith?.trim().toLowerCase()
  const q = filter.query?.trim().toLowerCase()
  return words.filter((word) => {
    const lettersOnly = word.replace(/[^a-zA-Z]/g, "")
    const len = lettersOnly.length
    if (filter.minLength != null && len < filter.minLength) return false
    if (filter.maxLength != null && len > filter.maxLength) return false
    if (letter && !word.toLowerCase().startsWith(letter)) return false
    if (q && !word.toLowerCase().includes(q)) return false
    return true
  })
}

export const WORD_AI_PRESETS = [
  {
    id: "writing-words",
    label: "Writing words",
    prompt: "Generate 12 evocative single words for creative writing prompts",
    category: "writing",
    fallbackWords: [
      "Midnight",
      "Promise",
      "Echo",
      "Lantern",
      "Threshold",
      "Whisper",
      "Ember",
      "Harbor",
      "Mirror",
      "Cipher",
      "Drift",
      "Bloom",
    ],
  },
  {
    id: "vocab-classroom",
    label: "Classroom vocab",
    prompt: "Generate 12 intermediate vocabulary words for English class practice",
    category: "classroom",
    fallbackWords: [
      "Analyze",
      "Conclude",
      "Evaluate",
      "Interpret",
      "Justify",
      "Persuade",
      "Sequence",
      "Contrast",
      "Evidence",
      "Hypothesis",
      "Perspective",
      "Summarize",
    ],
  },
  {
    id: "kids-easy",
    label: "Kids easy words",
    prompt: "Generate 12 simple kid-friendly nouns for a preschool word wheel",
    category: "kids",
    fallbackWords: [
      "Apple",
      "Ball",
      "Cat",
      "Duck",
      "Egg",
      "Frog",
      "Goat",
      "Hat",
      "Ice",
      "Jam",
      "Kite",
      "Lion",
    ],
  },
  {
    id: "action-verbs",
    label: "Action verbs",
    prompt: "Generate 12 action verbs good for charades or drawing games",
    category: "games",
    fallbackWords: [
      "Climb",
      "Spin",
      "Whisper",
      "March",
      "Splash",
      "Balance",
      "Stretch",
      "Chase",
      "Build",
      "Hide",
      "Toss",
      "Twirl",
    ],
  },
  {
    id: "story-ingredients",
    label: "Story ingredients",
    prompt: "Generate 12 single words mixing characters, places, and objects for stories",
    category: "writing",
    fallbackWords: [
      "Pirate",
      "Cave",
      "Key",
      "Wizard",
      "Tower",
      "Map",
      "Astronaut",
      "Planet",
      "Robot",
      "Detective",
      "Museum",
      "Clock",
    ],
  },
  {
    id: "funny-words",
    label: "Funny words",
    prompt: "Generate 12 funny or whimsical English words for a party word spinner",
    category: "party",
    fallbackWords: [
      "Flummox",
      "Noodle",
      "Wobble",
      "Giggle",
      "Bonkers",
      "Squish",
      "Doodle",
      "Zap",
      "Quirk",
      "Blurt",
      "Fizz",
      "Whimsy",
    ],
  },
] as const
