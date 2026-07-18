import type { LetterPickerUseCaseId } from "@/lib/letter-picker-use-cases"

export type LetterModeResultVariant = LetterPickerUseCaseId

export interface LetterModeResult {
  variant: LetterModeResultVariant
  letter: string
  headline: string
  detail: string
  prompt?: string
  hint?: string
  chips?: string[]
  remainingLabel?: string
  /** Scrabble tile points */
  points?: number
  phoneme?: string
  exampleWord?: string
  shareText: string
}

const LETTER_EXAMPLES: Record<string, string> = {
  A: "apple",
  B: "ball",
  C: "cat",
  D: "dog",
  E: "egg",
  F: "fish",
  G: "goat",
  H: "hat",
  I: "igloo",
  J: "jam",
  K: "kite",
  L: "lion",
  M: "moon",
  N: "nest",
  O: "octopus",
  P: "pig",
  Q: "queen",
  R: "rabbit",
  S: "sun",
  T: "tree",
  U: "umbrella",
  V: "van",
  W: "whale",
  X: "x-ray",
  Y: "yellow",
  Z: "zebra",
}

const VOWEL_PHONEMES: Record<string, { phoneme: string; tip: string }> = {
  A: { phoneme: "/æ/ or /eɪ/", tip: "Short a as in apple, or long a as in cake." },
  E: { phoneme: "/ɛ/ or /iː/", tip: "Short e as in egg, or long e as in bee." },
  I: { phoneme: "/ɪ/ or /aɪ/", tip: "Short i as in igloo, or long i as in ice." },
  O: { phoneme: "/ɒ/ or /oʊ/", tip: "Short o as in octopus, or long o as in open." },
  U: { phoneme: "/ʌ/ or /juː/", tip: "Short u as in umbrella, or long u as in unicorn." },
}

const ICEBREAKER_TOPICS = [
  "food",
  "movie",
  "animal",
  "place",
  "hobby",
  "song",
  "book",
  "color",
] as const

const FAMILY_CHALLENGES = [
  "Name 3 things that start with this letter — race the clock!",
  "Act out a word that starts with this letter — others guess.",
  "Sing a song title that starts with this letter.",
  "Draw something that starts with this letter in 30 seconds.",
  "Tell a one-sentence story using this letter five times.",
] as const

const ESL_PROMPTS = [
  "Say the letter sound out loud three times.",
  "Write two vocabulary words that start with this letter.",
  "Use a word with this letter in a full sentence.",
  "Find an object in the room that starts with this letter.",
] as const

const QUIZ_CATEGORIES = [
  "country",
  "animal",
  "food",
  "famous person",
  "city",
  "sport",
  "movie",
  "brand",
] as const

const WRITING_PROMPTS = [
  (L: string) => `Write a character whose name starts with “${L}”.`,
  (L: string) => `Describe a place that starts with “${L}” in three sentences.`,
  (L: string) => `Start a story with a sentence that begins with “${L}”.`,
  (L: string) => `Invent a magical object whose name starts with “${L}”.`,
  (L: string) => `Write a dialogue where someone argues about something starting with “${L}”.`,
]

function normalizeLetter(raw: string): string {
  const ch = (raw || "").trim().charAt(0)
  return ch ? ch.toUpperCase() : "?"
}

function displayLetter(raw: string): string {
  const ch = (raw || "").trim().charAt(0)
  return ch || "?"
}

function letterIndex(letter: string): number {
  const code = letter.toUpperCase().charCodeAt(0)
  if (code >= 65 && code <= 90) return code - 65
  return 0
}

function exampleWord(letter: string): string {
  return LETTER_EXAMPLES[letter.toUpperCase()] || "word"
}

export function scrabblePoints(letter: string): number {
  return scrabblePointValue(letter)
}

/** Official English Scrabble point values (not tile counts). */
function scrabblePointValue(letter: string): number {
  const L = letter.toUpperCase()
  if ("AEILNORSTU".includes(L)) return 1
  if ("DG".includes(L)) return 2
  if ("BCMP".includes(L)) return 3
  if ("FHVWY".includes(L)) return 4
  if (L === "K") return 5
  if ("JX".includes(L)) return 8
  if ("QZ".includes(L)) return 10
  return 1
}

export function buildLetterModeResult(
  modeId: LetterPickerUseCaseId | null | undefined,
  rawLetter: string,
  remainingCount?: number,
): LetterModeResult | null {
  if (!modeId) return null
  const letter = displayLetter(rawLetter)
  const upper = normalizeLetter(rawLetter)
  const idx = letterIndex(upper)
  const word = exampleWord(upper)
  const remaining =
    typeof remainingCount === "number" && remainingCount >= 0 ? remainingCount : undefined
  const remLabel =
    remaining != null
      ? `${remaining} letter${remaining === 1 ? "" : "s"} left on the wheel`
      : undefined

  switch (modeId) {
    case "classroom": {
      return {
        variant: "classroom",
        letter,
        headline: `Letter of the turn: ${letter}`,
        detail: `Use “${letter}” for the next question, helper pick, or board example.`,
        prompt: `Students: think of a word that starts with ${letter}.`,
        remainingLabel: remLabel,
        chips: remLabel ? [remLabel] : undefined,
        exampleWord: word,
        shareText: `Classroom letter: ${letter}`,
      }
    }
    case "alphabet-practice": {
      return {
        variant: "alphabet-practice",
        letter,
        headline: letter,
        detail: `${upper} as in ${word}`,
        prompt: `Say the letter name and the sound for “${letter}”.`,
        hint: `Trace it in the air, then find “${word}” around you.`,
        exampleWord: word,
        shareText: `${letter} as in ${word}`,
      }
    }
    case "phonics": {
      const vowel = VOWEL_PHONEMES[upper] || {
        phoneme: "/?/",
        tip: "Practice the vowel sound in a short word.",
      }
      return {
        variant: "phonics",
        letter,
        headline: `Vowel: ${letter}`,
        detail: vowel.tip,
        phoneme: vowel.phoneme,
        prompt: `Say ${vowel.phoneme} and invent a word with ${letter}.`,
        exampleWord: word,
        shareText: `Phonics vowel ${letter} (${vowel.phoneme})`,
      }
    }
    case "spelling": {
      return {
        variant: "spelling",
        letter,
        headline: `Spell with ${letter}`,
        detail: `Spell a word that starts with “${letter}” out loud or on paper.`,
        prompt: `Starter letter: ${letter}`,
        hint: `Example starter: ${word}`,
        exampleWord: word,
        shareText: `Spelling starter: ${letter}`,
      }
    }
    case "word-games": {
      const points = scrabblePointValue(upper)
      return {
        variant: "word-games",
        letter,
        headline: `Draw: ${letter}`,
        detail: `Worth ${points} point${points === 1 ? "" : "s"} in Scrabble-style play.`,
        points,
        prompt: `Build a word that uses “${letter}”.`,
        hint: `Tile weight on this wheel also favors common letters.`,
        shareText: `${letter} (${points} pts)`,
      }
    }
    case "creative-writing": {
      const makePrompt = WRITING_PROMPTS[idx % WRITING_PROMPTS.length]
      const prompt = makePrompt(letter)
      return {
        variant: "creative-writing",
        letter,
        headline: `Writing seed: ${letter}`,
        detail: prompt,
        prompt,
        hint: "Write for 2–5 minutes, then share a favorite line.",
        shareText: prompt,
      }
    }
    case "icebreaker": {
      const topic = ICEBREAKER_TOPICS[idx % ICEBREAKER_TOPICS.length]
      const prompt = `Share your favorite ${topic} that starts with “${letter}”.`
      return {
        variant: "icebreaker",
        letter,
        headline: `Icebreaker: ${letter}`,
        detail: prompt,
        prompt,
        remainingLabel: remLabel,
        chips: remLabel ? [remLabel] : undefined,
        shareText: prompt,
      }
    }
    case "family-games": {
      const challenge = FAMILY_CHALLENGES[idx % FAMILY_CHALLENGES.length]
      return {
        variant: "family-games",
        letter,
        headline: `Family round: ${letter}`,
        detail: challenge,
        prompt: challenge,
        hint: "Everyone plays — then spin again for the next round.",
        shareText: `${letter}: ${challenge}`,
      }
    }
    case "esl": {
      const drill = ESL_PROMPTS[idx % ESL_PROMPTS.length]
      return {
        variant: "esl",
        letter,
        headline: `ESL focus: ${letter}`,
        detail: drill,
        prompt: drill,
        hint: `${upper} as in ${word}`,
        exampleWord: word,
        phoneme: upper,
        shareText: `ESL letter ${letter}: ${drill}`,
      }
    }
    case "quiz": {
      const category = QUIZ_CATEGORIES[idx % QUIZ_CATEGORIES.length]
      const prompt = `Name a ${category} that starts with “${letter}”.`
      return {
        variant: "quiz",
        letter,
        headline: `Quiz letter: ${letter}`,
        detail: prompt,
        prompt,
        remainingLabel: remLabel,
        chips: remLabel ? [remLabel] : undefined,
        hint: "First correct answer scores a point — then spin again.",
        shareText: prompt,
      }
    }
    default:
      return null
  }
}
