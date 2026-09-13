import type {
  RaffleDrawRecord,
  RaffleParticipant,
  RafflePrizePlace,
} from "@/types/raffle-spin-wheel-types"

export const RAFFLE_WINNER_COUNT_PRESETS = [1, 3, 5, 10] as const
export type RaffleWinnerCountPreset = (typeof RAFFLE_WINNER_COUNT_PRESETS)[number]

export const DEFAULT_RAFFLE_PRIZE_PLACES: RafflePrizePlace[] = [
  { place: 1, label: "1st Prize" },
  { place: 2, label: "2nd Prize" },
  { place: 3, label: "3rd Prize" },
  { place: 4, label: "4th Prize" },
  { place: 5, label: "5th Prize" },
  { place: 6, label: "6th Prize" },
  { place: 7, label: "7th Prize" },
  { place: 8, label: "8th Prize" },
  { place: 9, label: "9th Prize" },
  { place: 10, label: "10th Prize" },
]

export function getActiveRaffleParticipants(
  options: RaffleParticipant[],
  lockedIds: readonly string[] = [],
): RaffleParticipant[] {
  const locked = new Set(lockedIds)
  return options.filter(
    (option) =>
      option.enabled !== false &&
      String(option.name || "").trim().length > 0 &&
      !locked.has(option.id),
  )
}

/** Weighted draw without replacement — same odds model as giveaway-utils. */
export function pickWeightedRaffleWinners(
  options: RaffleParticipant[],
  count: number,
  lockedIds: readonly string[] = [],
): RaffleParticipant[] {
  const pool = getActiveRaffleParticipants(options, lockedIds).map((entry) => ({
    ...entry,
    weight: Math.max(1, entry.weight ?? 1),
  }))
  const winners: RaffleParticipant[] = []
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

export function buildRaffleDrawRecords(
  winners: RaffleParticipant[],
  startingDrawNumber: number,
  prizePlaces: readonly RafflePrizePlace[] = DEFAULT_RAFFLE_PRIZE_PLACES,
): RaffleDrawRecord[] {
  const now = Date.now()
  return winners.map((winner, index) => {
    const drawNumber = startingDrawNumber + index
    const prize = prizePlaces.find((item) => item.place === drawNumber)
    return {
      drawNumber,
      name: winner.name,
      optionId: winner.id,
      timestamp: new Date(now + index).toISOString(),
      prizeLabel: prize?.label,
      locked: true,
    }
  })
}

export function prizeLabelForDraw(
  drawNumber: number,
  prizePlaces: readonly RafflePrizePlace[] = DEFAULT_RAFFLE_PRIZE_PLACES,
): string | undefined {
  return prizePlaces.find((item) => item.place === drawNumber)?.label
}
