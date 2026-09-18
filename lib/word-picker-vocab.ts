import { estimateSyllables } from "@/lib/word-picker-multi"

export type WordVocabEntry = {
  word: string
  partOfSpeech?: string
  definition?: string
  pronunciation?: string
  example?: string
  synonyms?: string[]
  antonyms?: string[]
  related?: string[]
  letterCount: number
  syllableHint?: number
  source: "curated" | "api" | "basic"
}

const CURATED: Record<
  string,
  Omit<WordVocabEntry, "word" | "letterCount" | "source" | "syllableHint">
> = {
  adventure: {
    partOfSpeech: "noun",
    definition: "An exciting or unusual experience.",
    pronunciation: "/ədˈvenCHər/",
    example: "Their mountain hike became a real adventure.",
    synonyms: ["expedition", "quest", "journey"],
    related: ["explore", "map", "risk"],
  },
  dream: {
    partOfSpeech: "noun",
    definition: "A series of thoughts or images during sleep, or a hoped-for goal.",
    pronunciation: "/driːm/",
    example: "She followed her dream of becoming a writer.",
    synonyms: ["vision", "ambition", "wish"],
    related: ["sleep", "hope", "imagine"],
  },
  forest: {
    partOfSpeech: "noun",
    definition: "A large area covered chiefly with trees and undergrowth.",
    pronunciation: "/ˈfôrəst/",
    example: "They camped overnight in the forest.",
    synonyms: ["woods", "woodland"],
    related: ["tree", "trail", "wildlife"],
  },
  secret: {
    partOfSpeech: "noun",
    definition: "Something kept hidden or unexplained.",
    pronunciation: "/ˈsiːkrɪt/",
    example: "He kept the surprise party a secret.",
    synonyms: ["mystery", "confidence"],
    related: ["whisper", "hidden", "code"],
  },
  jump: {
    partOfSpeech: "verb",
    definition: "To push yourself off the ground using your legs.",
    pronunciation: "/dʒʌmp/",
    example: "The cat can jump onto the fence.",
    synonyms: ["leap", "hop", "spring"],
    related: ["run", "bounce", "height"],
  },
  analyze: {
    partOfSpeech: "verb",
    definition: "To examine something carefully in order to understand it.",
    pronunciation: "/ˈænəlaɪz/",
    example: "Students analyze the poem’s imagery.",
    synonyms: ["examine", "study", "inspect"],
    related: ["evidence", "detail", "conclude"],
  },
  courage: {
    partOfSpeech: "noun",
    definition: "The ability to do something that frightens you; bravery.",
    pronunciation: "/ˈkɜːrɪdʒ/",
    example: "It took courage to speak in front of the class.",
    synonyms: ["bravery", "valor", "nerve"],
    antonyms: ["fear", "cowardice"],
    related: ["brave", "challenge", "hero"],
  },
  whisper: {
    partOfSpeech: "verb",
    definition: "To speak very softly using one's breath.",
    pronunciation: "/ˈwɪspər/",
    example: "Please whisper so you do not wake the baby.",
    synonyms: ["murmur", "mutter"],
    related: ["quiet", "secret", "soft"],
  },
  mirror: {
    partOfSpeech: "noun",
    definition: "A surface that reflects a clear image.",
    pronunciation: "/ˈmɪrər/",
    example: "She checked her hair in the mirror.",
    synonyms: ["looking glass", "reflector"],
    related: ["reflect", "glass", "image"],
  },
  dragon: {
    partOfSpeech: "noun",
    definition: "A mythical monster like a giant reptile, often said to breathe fire.",
    pronunciation: "/ˈdræɡən/",
    example: "The story begins with a dragon guarding a cave.",
    synonyms: ["serpent", "wyrm"],
    related: ["fantasy", "fire", "castle"],
  },
  friendship: {
    partOfSpeech: "noun",
    definition: "A relationship of mutual affection between people.",
    pronunciation: "/ˈfrendʃɪp/",
    example: "Their friendship lasted through many years.",
    synonyms: ["companionship", "bond"],
    related: ["friend", "trust", "kindness"],
  },
  pumpkin: {
    partOfSpeech: "noun",
    definition: "A large round orange fruit of a vine, often used at Halloween.",
    pronunciation: "/ˈpʌmpkɪn/",
    example: "We carved a pumpkin for Halloween.",
    synonyms: ["squash"],
    related: ["autumn", "Halloween", "orange"],
  },
  resilient: {
    partOfSpeech: "adjective",
    definition: "Able to recover quickly from difficulties.",
    pronunciation: "/rɪˈzɪliənt/",
    example: "The team stayed resilient after a tough loss.",
    synonyms: ["tough", "adaptable", "strong"],
    antonyms: ["fragile", "brittle"],
    related: ["recover", "persist", "strength"],
  },
  pizza: {
    partOfSpeech: "noun",
    definition: "A dish of baked dough topped with tomato, cheese, and other ingredients.",
    pronunciation: "/ˈpiːtsə/",
    example: "We ordered pizza for the party.",
    synonyms: ["pie"],
    related: ["cheese", "slice", "oven"],
  },
  elephant: {
    partOfSpeech: "noun",
    definition: "A very large mammal with a trunk and tusks.",
    pronunciation: "/ˈelɪfənt/",
    example: "The elephant sprayed water with its trunk.",
    related: ["trunk", "safari", "herd"],
  },
  midnight: {
    partOfSpeech: "noun",
    definition: "Twelve o'clock at night.",
    pronunciation: "/ˈmɪdnaɪt/",
    example: "The clock struck midnight.",
    synonyms: ["night", "dead of night"],
    related: ["moon", "dark", "clock"],
  },
}

function basicEntry(word: string): WordVocabEntry {
  const clean = word.trim()
  return {
    word: clean,
    letterCount: clean.replace(/[^a-zA-Z]/g, "").length,
    syllableHint: estimateSyllables(clean),
    source: "basic",
  }
}

export function getCuratedVocab(word: string): WordVocabEntry | null {
  const key = word.trim().toLowerCase()
  const hit = CURATED[key]
  if (!hit) return null
  return {
    word: word.trim(),
    letterCount: word.trim().replace(/[^a-zA-Z]/g, "").length,
    syllableHint: estimateSyllables(word),
    source: "curated",
    ...hit,
  }
}

type FreeDictMeaning = {
  partOfSpeech?: string
  definitions?: Array<{
    definition?: string
    example?: string
    synonyms?: string[]
    antonyms?: string[]
  }>
  synonyms?: string[]
  antonyms?: string[]
}

type FreeDictResponse = Array<{
  word?: string
  phonetic?: string
  phonetics?: Array<{ text?: string }>
  meanings?: FreeDictMeaning[]
}>

export async function fetchWordVocab(word: string): Promise<WordVocabEntry> {
  const clean = word.trim()
  if (!clean) return basicEntry(word)

  const curated = getCuratedVocab(clean)
  if (curated?.definition) return curated

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean.toLowerCase())}`,
      { signal: controller.signal },
    )
    if (!res.ok) return curated ?? basicEntry(clean)
    const data = (await res.json()) as FreeDictResponse
    const entry = data[0]
    const meaning = entry?.meanings?.[0]
    const def = meaning?.definitions?.[0]
    const pronunciation =
      entry?.phonetic ||
      entry?.phonetics?.find((p) => p.text)?.text ||
      curated?.pronunciation
    const synonyms = (def?.synonyms || meaning?.synonyms || curated?.synonyms || []).slice(0, 6)
    const antonyms = (def?.antonyms || meaning?.antonyms || curated?.antonyms || []).slice(0, 4)

    return {
      word: clean,
      letterCount: clean.replace(/[^a-zA-Z]/g, "").length,
      syllableHint: estimateSyllables(clean),
      partOfSpeech: meaning?.partOfSpeech || curated?.partOfSpeech,
      definition: def?.definition || curated?.definition,
      pronunciation,
      example: def?.example || curated?.example,
      synonyms,
      antonyms,
      related: curated?.related || synonyms.slice(0, 3),
      source: "api",
    }
  } catch {
    return curated ?? basicEntry(clean)
  } finally {
    clearTimeout(timer)
  }
}
