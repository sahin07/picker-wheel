export type RaffleActionMode = "normal" | "elimination"

export type RaffleParticipant = {
  id: string
  name: string
  image?: string
  color?: string
  weight?: number
  enabled?: boolean
}

export type RafflePrizePlace = {
  place: number
  label: string
}

export type RaffleDrawRecord = {
  drawNumber: number
  name: string
  optionId?: string
  timestamp: string
  prizeLabel?: string
  locked?: boolean
}
