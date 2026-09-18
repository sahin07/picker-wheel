export const WORD_PICKER_WINNER_COUNTS = [1, 2, 3, 5, 10] as const
export type WordPickerWinnerCount = (typeof WORD_PICKER_WINNER_COUNTS)[number]

export type WeightedWordOption = {
  id: string
  name: string
  weight?: number
  enabled?: boolean
}

/** Weighted draw without replacement (same model as raffle). */
export function pickWeightedWords(
  options: WeightedWordOption[],
  count: number,
): WeightedWordOption[] {
  const pool = options
    .filter((item) => item.enabled !== false && String(item.name || "").trim())
    .map((item) => ({ ...item, weight: Math.max(1, item.weight ?? 1) }))
  const winners: WeightedWordOption[] = []
  const limit = Math.max(0, Math.min(count, pool.length))

  for (let i = 0; i < limit; i++) {
    const total = pool.reduce((sum, entry) => sum + (entry.weight ?? 1), 0)
    let roll = Math.random() * total
    let index = 0
    for (let j = 0; j < pool.length; j++) {
      roll -= pool[j].weight ?? 1
      if (roll <= 0) {
        index = j
        break
      }
    }
    winners.push(pool[index])
    pool.splice(index, 1)
  }

  return winners
}

export function estimateSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "")
  if (!clean) return 0
  if (clean.length <= 3) return 1
  const groups = clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").match(/[aeiouy]{1,2}/g)
  return Math.max(1, groups?.length || 1)
}
