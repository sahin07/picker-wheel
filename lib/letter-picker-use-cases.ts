import type { LetterOption, StyleOption } from "@/types/letter-picker"
import type { LetterPickerSeoPreset } from "@/lib/letter-picker-seo"

export type LetterPickerUseCaseId =
  | "classroom"
  | "alphabet-practice"
  | "phonics"
  | "spelling"
  | "word-games"
  | "creative-writing"
  | "icebreaker"
  | "family-games"
  | "esl"
  | "quiz"

export interface LetterPickerUseCaseConfig {
  /** Built-in letter set or SEO-style half-alphabet / Scrabble */
  preset: LetterOption | LetterPickerSeoPreset
  style: StyleOption
  /** Syncs with Manage → Remove winner */
  elimination: boolean
  toolTitle: string
  toolDescription: string
}

export interface LetterPickerUseCase {
  id: LetterPickerUseCaseId
  label: string
  description: string
  accent: "sky" | "amber" | "rose" | "lime" | "orange" | "teal" | "indigo" | "cyan" | "yellow" | "violet"
  config: LetterPickerUseCaseConfig
}

export const LETTER_PICKER_USE_CASES: LetterPickerUseCase[] = [
  {
    id: "classroom",
    label: "Classroom learning",
    description: "Pick a letter of the day or student prompt with no repeats.",
    accent: "sky",
    config: {
      preset: "alphabet",
      style: "uppercase",
      elimination: true,
      toolTitle: "Classroom Letter Picker",
      toolDescription: "Spin for the next classroom letter without repeating winners.",
    },
  },
  {
    id: "alphabet-practice",
    label: "Alphabet practice",
    description: "Full A–Z wheel for early learners and letter recognition.",
    accent: "lime",
    config: {
      preset: "alphabet",
      style: "uppercase",
      elimination: false,
      toolTitle: "Alphabet Practice Wheel",
      toolDescription: "Spin the A–Z wheel to practice letter recognition.",
    },
  },
  {
    id: "phonics",
    label: "Phonics games",
    description: "Vowel-focused spins for sounds, blends, and decoding drills.",
    accent: "rose",
    config: {
      preset: "vowels",
      style: "uppercase",
      elimination: false,
      toolTitle: "Phonics Vowel Wheel",
      toolDescription: "Spin A E I O U for phonics and vowel practice.",
    },
  },
  {
    id: "spelling",
    label: "Spelling activities",
    description: "Consonant starters for spelling bees and word lists.",
    accent: "amber",
    config: {
      preset: "consonants",
      style: "uppercase",
      elimination: false,
      toolTitle: "Spelling Letter Wheel",
      toolDescription: "Spin a consonant to start the next spelling word.",
    },
  },
  {
    id: "word-games",
    label: "Word games",
    description: "Scrabble-style letter weights for word-building play.",
    accent: "orange",
    config: {
      preset: "scrabble",
      style: "uppercase",
      elimination: false,
      toolTitle: "Word Game Letter Wheel",
      toolDescription: "Spin Scrabble-weighted letters for word games.",
    },
  },
  {
    id: "creative-writing",
    label: "Creative writing prompts",
    description: "Mixed-case letters that must start a story or character name.",
    accent: "violet",
    config: {
      preset: "alphabet",
      style: "mixed",
      elimination: false,
      toolTitle: "Writing Prompt Letter Wheel",
      toolDescription: "Spin a letter that must start your next writing prompt.",
    },
  },
  {
    id: "icebreaker",
    label: "Icebreaker games",
    description: "Quick A–Z spins for share-a-favorite that starts with…",
    accent: "cyan",
    config: {
      preset: "alphabet",
      style: "uppercase",
      elimination: true,
      toolTitle: "Icebreaker Letter Wheel",
      toolDescription: "Spin a letter for icebreaker shares and group games.",
    },
  },
  {
    id: "family-games",
    label: "Family games",
    description: "Lowercase letters for party rounds and travel games.",
    accent: "teal",
    config: {
      preset: "alphabet",
      style: "lowercase",
      elimination: false,
      toolTitle: "Family Letter Game Wheel",
      toolDescription: "Spin lowercase letters for family and party games.",
    },
  },
  {
    id: "esl",
    label: "ESL lessons",
    description: "A–M focus for shorter vocabulary and pronunciation drills.",
    accent: "indigo",
    config: {
      preset: "a-m",
      style: "uppercase",
      elimination: false,
      toolTitle: "ESL Letter Practice Wheel",
      toolDescription: "Spin A–M letters for ESL vocabulary warm-ups.",
    },
  },
  {
    id: "quiz",
    label: "Quiz games",
    description: "N–Z category initials with elimination for fair turns.",
    accent: "yellow",
    config: {
      preset: "n-z",
      style: "uppercase",
      elimination: true,
      toolTitle: "Quiz Letter Wheel",
      toolDescription: "Spin N–Z letters for quiz categories without repeats.",
    },
  },
]

export function getLetterPickerUseCase(id: string): LetterPickerUseCase | undefined {
  return LETTER_PICKER_USE_CASES.find((u) => u.id === id)
}
