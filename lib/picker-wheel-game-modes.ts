export interface GameMode {
  id: string
  name: string
  description: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  minSpins: number
  maxSpins: number
  timeLimit?: number // in seconds
  rewards: {
    points: number
    achievements: string[]
    themes: string[]
  }
  rules: string[]
  isActive: boolean
  category: 'daily' | 'weekly' | 'special' | 'tournament'
}

export interface GameSession {
  id: string
  gameModeId: string
  startTime: Date
  endTime?: Date
  spins: number
  score: number
  completed: boolean
  results: GameResult[]
  bonusMultiplier: number
}

export interface GameResult {
  spinNumber: number
  result: string
  points: number
  bonus: number
  timestamp: Date
}

export interface Tournament {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  participants: number
  maxParticipants: number
  entryFee: number
  prizePool: {
    first: number
    second: number
    third: number
  }
  gameMode: string
  isActive: boolean
  leaderboard: TournamentEntry[]
}

export interface TournamentEntry {
  userId: string
  username: string
  score: number
  rank: number
  completedAt?: Date
}

export interface DailyChallenge {
  id: string
  title: string
  description: string
  objective: string
  targetValue: number
  currentValue: number
  reward: {
    points: number
    achievements: string[]
  }
  expiresAt: Date
  isCompleted: boolean
}

// Advanced Game Modes
export const ADVANCED_GAME_MODES: GameMode[] = [
  {
    id: 'wheel-roulette',
    name: 'Wheel Roulette',
    description: 'Bet on wheel outcomes and win big!',
    icon: '🎰',
    difficulty: 'medium',
    minSpins: 5,
    maxSpins: 20,
    rewards: {
      points: 300,
      achievements: ['roulette_master'],
      themes: ['neon']
    },
    rules: [
      'Bet points on specific outcomes',
      'Win 2x points for correct predictions',
      'Lose bet amount for wrong predictions',
      'Chain wins for bonus multipliers'
    ],
    isActive: true,
    category: 'special'
  },
  {
    id: 'speed-challenge',
    name: 'Speed Challenge',
    description: 'Make decisions under pressure!',
    icon: '⚡',
    difficulty: 'hard',
    minSpins: 10,
    maxSpins: 30,
    timeLimit: 60, // 60 seconds
    rewards: {
      points: 500,
      achievements: ['speed_demon'],
      themes: ['phoenix']
    },
    rules: [
      'Complete spins within time limit',
      'Faster completion = higher score',
      'Bonus points for accuracy',
      'Time penalties for mistakes'
    ],
    isActive: true,
    category: 'daily'
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Remember and match wheel results!',
    icon: '🧠',
    difficulty: 'expert',
    minSpins: 8,
    maxSpins: 16,
    rewards: {
      points: 800,
      achievements: ['memory_master'],
      themes: ['aurora']
    },
    rules: [
      'Remember the sequence of results',
      'Match previous results for points',
      'Chain matches for multipliers',
      'One mistake ends the game'
    ],
    isActive: true,
    category: 'weekly'
  },
  {
    id: 'combo-challenge',
    name: 'Combo Challenge',
    description: 'Chain spins for massive rewards!',
    icon: '🔥',
    difficulty: 'hard',
    minSpins: 15,
    maxSpins: 50,
    rewards: {
      points: 1000,
      achievements: ['combo_king'],
      themes: ['dragon']
    },
    rules: [
      'Chain consecutive spins',
      'Combo multiplier increases with each spin',
      'Breaking combo resets multiplier',
      'Perfect combos unlock special rewards'
    ],
    isActive: true,
    category: 'special'
  },
  {
    id: 'precision-mode',
    name: 'Precision Mode',
    description: 'Hit specific targets for maximum points!',
    icon: '🎯',
    difficulty: 'expert',
    minSpins: 12,
    maxSpins: 25,
    rewards: {
      points: 750,
      achievements: ['precision_expert'],
      themes: ['cosmic']
    },
    rules: [
      'Target specific wheel segments',
      'Hit targets for bonus points',
      'Miss targets lose points',
      'Perfect accuracy unlocks special rewards'
    ],
    isActive: true,
    category: 'weekly'
  }
]

// Mock Tournaments
export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    name: 'March Madness Tournament',
    description: 'The ultimate wheel spinning championship!',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-22'),
    participants: 45,
    maxParticipants: 64,
    entryFee: 100,
    prizePool: {
      first: 5000,
      second: 2500,
      third: 1000
    },
    gameMode: 'combo-challenge',
    isActive: true,
    leaderboard: [
      { userId: '1', username: 'WheelMaster', score: 8500, rank: 1, completedAt: new Date() },
      { userId: '2', username: 'SpinQueen', score: 7200, rank: 2, completedAt: new Date() },
      { userId: '3', username: 'DecisionPro', score: 6800, rank: 3, completedAt: new Date() }
    ]
  },
  {
    id: '2',
    name: 'Speed Demon Challenge',
    description: 'Who can spin the fastest?',
    startDate: new Date('2024-03-20'),
    endDate: new Date('2024-03-25'),
    participants: 32,
    maxParticipants: 50,
    entryFee: 50,
    prizePool: {
      first: 2000,
      second: 1000,
      third: 500
    },
    gameMode: 'speed-challenge',
    isActive: true,
    leaderboard: [
      { userId: '2', username: 'SpinQueen', score: 4500, rank: 1, completedAt: new Date() },
      { userId: '1', username: 'WheelMaster', score: 4200, rank: 2, completedAt: new Date() },
      { userId: '4', username: 'LuckySpinner', score: 3800, rank: 3, completedAt: new Date() }
    ]
  }
]

// Mock Daily Challenges
export const MOCK_DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: '1',
    title: 'Speed Spinner',
    description: 'Complete 20 spins in under 2 minutes',
    objective: 'Complete spins quickly',
    targetValue: 20,
    currentValue: 0,
    reward: {
      points: 200,
      achievements: ['speed_spinner']
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    isCompleted: false
  },
  {
    id: '2',
    title: 'Perfect Memory',
    description: 'Remember and match 10 consecutive results',
    objective: 'Match results',
    targetValue: 10,
    currentValue: 0,
    reward: {
      points: 300,
      achievements: ['perfect_memory']
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isCompleted: false
  },
  {
    id: '3',
    title: 'Combo Master',
    description: 'Achieve a 15x combo multiplier',
    objective: 'Build combo',
    targetValue: 15,
    currentValue: 0,
    reward: {
      points: 400,
      achievements: ['combo_master']
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isCompleted: false
  }
]

// Game Mode Functions
export function calculateRouletteBet(betAmount: number, prediction: string, result: string): number {
  if (prediction === result) {
    return betAmount * 2
  }
  return -betAmount
}

export function calculateSpeedScore(spins: number, timeUsed: number, accuracy: number): number {
  const baseScore = spins * 100
  const timeBonus = Math.max(0, (60 - timeUsed) * 10)
  const accuracyBonus = accuracy * 50
  return baseScore + timeBonus + accuracyBonus
}

export function calculateMemoryScore(matches: number, totalAttempts: number): number {
  const accuracy = matches / totalAttempts
  const baseScore = matches * 100
  const accuracyBonus = accuracy * 200
  return Math.round(baseScore + accuracyBonus)
}

export function calculateComboScore(comboLength: number, basePoints: number): number {
  const comboMultiplier = Math.pow(1.5, comboLength - 1)
  return Math.round(basePoints * comboMultiplier)
}

export function calculatePrecisionScore(hits: number, misses: number, totalTargets: number): number {
  const accuracy = hits / totalTargets
  const baseScore = hits * 150
  const accuracyBonus = accuracy * 300
  const missPenalty = misses * 50
  return Math.max(0, baseScore + accuracyBonus - missPenalty)
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'text-green-600'
    case 'medium': return 'text-yellow-600'
    case 'hard': return 'text-orange-600'
    case 'expert': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

export function getDifficultyBgColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'bg-green-50'
    case 'medium': return 'bg-yellow-50'
    case 'hard': return 'bg-orange-50'
    case 'expert': return 'bg-red-50'
    default: return 'bg-gray-50'
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function generateTournamentId(): string {
  return `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function isTournamentActive(tournament: Tournament): boolean {
  const now = new Date()
  return tournament.isActive && now >= tournament.startDate && now <= tournament.endDate
}

export function canJoinTournament(tournament: Tournament, userPoints: number): boolean {
  return isTournamentActive(tournament) && 
         tournament.participants < tournament.maxParticipants &&
         userPoints >= tournament.entryFee
} 