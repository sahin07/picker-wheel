export interface WheelItem {
  id: string
  text: string
  enabled: boolean
  count: number
  color?: string
  imageUrl?: string
  imageFile?: File
}

export interface WheelSettings {
  spinSpeed: number
  spinDuration: number
  enableManualStop: boolean
  mysteryMode: boolean
  enableConfetti: boolean
  enableSound: boolean
  wheelColor: string
  backgroundColor: string
  actionMode: "normal" | "elimination" | "accumulation"
}

export interface NumberRange {
  min: number
  max: number
  step: number
  duplicates: boolean
}

export interface BingoCard {
  id: string
  cells: (WheelItem | null)[]
  markedCells: boolean[]
  isWinner: boolean
}

export interface MemoryChallenge {
  id: string
  targetImages: WheelItem[]
  foundImages: WheelItem[]
  timeLimit: number
  timeRemaining: number
  isActive: boolean
  isCompleted: boolean
  score: number
}

export interface GameStats {
  bingoWins: number
  memoryWins: number
  totalSpins: number
  perfectMemoryRounds: number
  fastestMemoryRounds: number
  fastestBingo: number
  currentStreak: number
}
