export type WordPickerChallengeMode =
  | "one"
  | "three"
  | "five"
  | "story"
  | "drawing"
  | "acting"
  | "definition"
  | "spelling"
  | "speed"
  | "elimination"

export type WordPickerModeConfig = {
  id: WordPickerChallengeMode
  label: string
  description: string
  /** When true, syncs Action Mode to elimination */
  forcesElimination: boolean
  wordCount: number
}

export const WORD_PICKER_CHALLENGE_MODES: WordPickerModeConfig[] = [
  {
    id: "one",
    label: "One Word",
    description: "Spin for a single random word",
    forcesElimination: false,
    wordCount: 1,
  },
  {
    id: "three",
    label: "Three Words",
    description: "Get 3 words to use together",
    forcesElimination: false,
    wordCount: 3,
  },
  {
    id: "five",
    label: "Five Words",
    description: "Get 5 words for a bigger challenge",
    forcesElimination: false,
    wordCount: 5,
  },
  {
    id: "story",
    label: "Story",
    description: "Character + setting + object",
    forcesElimination: false,
    wordCount: 3,
  },
  {
    id: "drawing",
    label: "Drawing",
    description: "A word to sketch or doodle",
    forcesElimination: false,
    wordCount: 1,
  },
  {
    id: "acting",
    label: "Acting",
    description: "A word to act out or describe",
    forcesElimination: false,
    wordCount: 1,
  },
  {
    id: "definition",
    label: "Definition",
    description: "Guess the meaning of the word",
    forcesElimination: false,
    wordCount: 1,
  },
  {
    id: "spelling",
    label: "Spelling",
    description: "Hear/see the word and spell it",
    forcesElimination: false,
    wordCount: 1,
  },
  {
    id: "speed",
    label: "Speed",
    description: "Explain, draw, or act within 60 seconds",
    forcesElimination: false,
    wordCount: 1,
  },
  {
    id: "elimination",
    label: "Elimination",
    description: "Remove each word after it is selected",
    forcesElimination: true,
    wordCount: 1,
  },
]

export function getWordPickerMode(
  id: string | null | undefined,
): WordPickerModeConfig | undefined {
  return WORD_PICKER_CHALLENGE_MODES.find((mode) => mode.id === id)
}

export function wordPickerModeFromParam(
  value: string | null | undefined,
): WordPickerChallengeMode | null {
  if (!value) return null
  return getWordPickerMode(value)?.id ?? null
}

/** Pick additional words from the pool (excluding the spun winner). */
export function pickExtraWords(
  pool: string[],
  exclude: string,
  count: number,
): string[] {
  const available = pool
    .map((w) => w.trim())
    .filter((w) => w && w.toLowerCase() !== exclude.toLowerCase())
  const shuffled = [...available]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.max(0, count))
}

export function challengePromptForMode(
  mode: WordPickerChallengeMode,
  words: string[],
): string {
  const joined = words.join(", ")
  switch (mode) {
    case "three":
      return `Use all three words in one sentence or short scene: ${joined}.`
    case "five":
      return `Use all five words in one short story or paragraph: ${joined}.`
    case "story":
      return words.length >= 3
        ? `Write a mini-story with character “${words[0]}”, setting “${words[1]}”, and object “${words[2]}”.`
        : `Write a mini-story using: ${joined}.`
    case "drawing":
      return `Draw or sketch: ${words[0] || joined}.`
    case "acting":
      return `Act out or describe without saying the word: ${words[0] || joined}.`
    case "definition":
      return `Guess the definition of “${words[0] || joined}” before revealing the vocab card.`
    case "spelling":
      return `Spell “${words[0] || joined}” out loud or on paper, then check.`
    case "speed":
      return `You have 60 seconds to explain, draw, or act out: ${words[0] || joined}.`
    case "elimination":
      return `Selected word (removed from wheel): ${words[0] || joined}.`
    default:
      return `Your random word: ${words[0] || joined}.`
  }
}

export const STORY_ROLE_LABELS = ["Character", "Setting", "Object"] as const
