import { GameMode } from "./picker-wheel-game-modes"

export interface GameSession {
  id: string
  gameMode: GameMode
  startTime: Date
  endTime?: Date
  isActive: boolean
  currentSpin: number
  totalSpins: number
  score: number
  timeRemaining?: number
  gameData: any
  results: GameResult[]
}

export interface GameResult {
  spinNumber: number
  result: string
  timestamp: Date
  points: number
  bonus?: number
}

export interface GameSessionManager {
  currentSession: GameSession | null
  startGame: (gameMode: GameMode) => GameSession
  endGame: () => void
  recordSpin: (result: string, points: number, bonus?: number) => void
  getGameProgress: () => {
    currentSpin: number
    totalSpins: number
    progress: number
    timeRemaining?: number
    score: number
  }
  isGameComplete: () => boolean
  getGameScore: () => number
}

// Game mode specific logic
export function createGameSession(gameMode: GameMode): GameSession {
  const randomValue = Math.random()
  const range = gameMode.maxSpins - gameMode.minSpins + 1
  const totalSpins = Math.floor(randomValue * range + gameMode.minSpins)

  const session = {
    id: `game_${Date.now()}`,
    gameMode,
    startTime: new Date(),
    isActive: true,
    currentSpin: 0,
    totalSpins,
    score: 0,
    timeRemaining: gameMode.timeLimit || undefined,
    gameData: {},
    results: []
  }

  return session
}

export function calculateSpinPoints(
  gameMode: GameMode,
  spinNumber: number,
  result: string,
  previousResults: GameResult[]
): { points: number; bonus: number } {
  let points = 0
  let bonus = 0

  switch (gameMode.id) {
    case 'roulette':
    case 'wheel-roulette':
      // Roulette: Bet on outcomes, win 2x points for correct predictions
      const betAmount = 10
      const isCorrectPrediction = Math.random() > 0.5 // Simulate prediction
      points = isCorrectPrediction ? betAmount * 2 : 0
      break

    case 'speed':
    case 'speed-challenge':
      // Speed: Faster completion = higher score
      const basePoints = 20
      const timeBonus = Math.max(0, 60 - (spinNumber * 2)) // Bonus for speed
      points = basePoints + timeBonus
      break

    case 'memory':
    case 'memory-match':
      // Memory: Remember and match previous results
      if (previousResults.length > 0) {
        const lastResult = previousResults[previousResults.length - 1]
        if (result === lastResult.result) {
          points = 50 // Bonus for matching
          bonus = 25
        } else {
          points = 10 // Base points
        }
      } else {
        points = 10
      }
      break

    case 'combo':
    case 'combo-challenge':
      // Combo: Chain consecutive spins for multiplier
      const comboMultiplier = Math.min(previousResults.length + 1, 5)
      points = 15 * comboMultiplier
      bonus = comboMultiplier > 1 ? (comboMultiplier - 1) * 10 : 0
      break

    case 'precision':
    case 'precision-mode':
      // Precision: Hit specific targets for bonus points
      const targetSegments = ['target1', 'target2', 'target3'] // Simulate targets
      const isTargetHit = targetSegments.includes(result)
      points = isTargetHit ? 40 : 15
      bonus = isTargetHit ? 20 : 0
      break

    default:
      points = 10
  }

  return { points, bonus }
}

export function checkGameCompletion(session: GameSession): boolean {
  if (session.currentSpin >= session.totalSpins) {
    return true
  }

  if (session.timeRemaining !== undefined && session.timeRemaining <= 0) {
    return true
  }

  return false
}

export function updateGameTimer(session: GameSession): GameSession {
  if (session.timeRemaining !== undefined && session.isActive) {
    // Calculate remaining time by subtracting 1 second from current remaining time
    const remaining = Math.max(0, session.timeRemaining - 1)
    
    return {
      ...session,
      timeRemaining: remaining
    }
  }
  
  return session
}

export function getGameModeInstructions(gameMode: GameMode): string[] {
  switch (gameMode.id) {
    case 'roulette':
    case 'wheel-roulette':
      return [
        "Click 'Bet' to place a bet on the next outcome",
        "Choose your bet amount and prediction",
        "Win 2x your bet for correct predictions",
        "Try to maximize your winnings!"
      ]
    
    case 'speed':
    case 'speed-challenge':
      return [
        "Complete all spins as quickly as possible",
        "Faster completion = higher score",
        "Watch the timer - don't run out of time!",
        "Focus on speed and accuracy"
      ]
    
    case 'memory':
    case 'memory-match':
      return [
        "Remember the sequence of results",
        "Match previous results for bonus points",
        "Pay attention to the order",
        "Test your memory skills!"
      ]
    
    case 'combo':
    case 'combo-challenge':
      return [
        "Chain consecutive spins for multipliers",
        "Don't break the combo chain",
        "Higher combos = bigger rewards",
        "Build up your multiplier!"
      ]
    
    case 'precision':
    case 'precision-mode':
      return [
        "Hit specific target segments",
        "Target hits give bonus points",
        "Aim for precision over speed",
        "Perfect your accuracy!"
      ]
    
    default:
      return ["Complete the game to earn points!"]
  }
}

export function getGameModeTips(gameMode: GameMode): string[] {
  switch (gameMode.id) {
    case 'roulette':
    case 'wheel-roulette':
      return [
        "Start with small bets to learn the pattern",
        "Watch for streaks in the results",
        "Don't bet more than you can afford to lose"
      ]
    
    case 'speed':
    case 'speed-challenge':
      return [
        "Plan your spins ahead of time",
        "Don't rush too much - accuracy matters",
        "Use the remaining time wisely"
      ]
    
    case 'memory':
    case 'memory-match':
      return [
        "Create mental associations for results",
        "Focus on the most recent results first",
        "Take your time to remember correctly"
      ]
    
    case 'combo':
    case 'combo-challenge':
      return [
        "Maintain steady rhythm for combos",
        "Don't pause too long between spins",
        "Build momentum for higher multipliers"
      ]
    
    case 'precision':
    case 'precision-mode':
      return [
        "Study the wheel layout first",
        "Focus on target segments",
        "Practice your timing"
      ]
    
    default:
      return ["Have fun and try your best!"]
  }
} 