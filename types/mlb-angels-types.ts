export type MlbAngelsNicknameEra = "legend" | "current" | "all-time"

export type MlbAngelsNicknameEntry = {
  id: string
  nickname: string
  playerName: string
  position: string
  yearsWithAngels: string
  meaning: string
  famousMoment: string
  emoji: string
  era: MlbAngelsNicknameEra[]
}

export type MlbAngelsDisplayMode = "nickname-name" | "nickname" | "name"
export type MlbAngelsActionMode = "normal" | "elimination"

export type MlbAngelsSpinResult = {
  entry: MlbAngelsNicknameEntry
  timestamp: Date
}
