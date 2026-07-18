export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  progress: number
  maxProgress: number
  completed: boolean
  completedAt?: Date
  unlockRequirements: {
    totalSpins?: number
    uniqueResults?: number
    perfectMemoryRounds?: number
    bingoWins?: number
    fastestMemoryTime?: number
    consecutiveDays?: number
    totalOptions?: number
    aiGeneratedOptions?: number
    mysterySpins?: number
  }
}

export const PICKER_WHEEL_ACHIEVEMENTS: Achievement[] = [
  // Beginner Achievements
  {
    id: 'first-spin',
    title: 'First Spin',
    description: 'Complete your first wheel spin',
    icon: '🎯',
    rarity: 'common',
    points: 10,
    progress: 0,
    maxProgress: 1,
    completed: false,
    unlockRequirements: { totalSpins: 1 }
  },
  {
    id: 'spinner-novice',
    title: 'Spinner Novice',
    description: 'Complete 10 wheel spins',
    icon: '🎲',
    rarity: 'common',
    points: 25,
    progress: 0,
    maxProgress: 10,
    completed: false,
    unlockRequirements: { totalSpins: 10 }
  },
  {
    id: 'option-collector',
    title: 'Option Collector',
    description: 'Create a wheel with 10 or more options',
    icon: '📝',
    rarity: 'common',
    points: 30,
    progress: 0,
    maxProgress: 10,
    completed: false,
    unlockRequirements: { totalOptions: 10 }
  },
  {
    id: 'ai-explorer',
    title: 'AI Explorer',
    description: 'Use AI to generate options for the first time',
    icon: '🤖',
    rarity: 'common',
    points: 40,
    progress: 0,
    maxProgress: 1,
    completed: false,
    unlockRequirements: { aiGeneratedOptions: 1 }
  },
  // Intermediate Achievements
  {
    id: 'spinner-apprentice',
    title: 'Spinner Apprentice',
    description: 'Complete 50 wheel spins',
    icon: '🎪',
    rarity: 'rare',
    points: 75,
    progress: 0,
    maxProgress: 50,
    completed: false,
    unlockRequirements: { totalSpins: 50 }
  },
  {
    id: 'memory-master',
    title: 'Memory Master',
    description: 'Complete a memory challenge game',
    icon: '🧠',
    rarity: 'rare',
    points: 100,
    progress: 0,
    maxProgress: 1,
    completed: false,
    unlockRequirements: { perfectMemoryRounds: 1 }
  },
  {
    id: 'bingo-champion',
    title: 'Bingo Champion',
    description: 'Win your first bingo game',
    icon: '🎰',
    rarity: 'rare',
    points: 120,
    progress: 0,
    maxProgress: 1,
    completed: false,
    unlockRequirements: { bingoWins: 1 }
  },
  {
    id: 'diversity-champion',
    title: 'Diversity Champion',
    description: 'Get 20 different unique results',
    icon: '🌈',
    rarity: 'rare',
    points: 150,
    progress: 0,
    maxProgress: 20,
    completed: false,
    unlockRequirements: { uniqueResults: 20 }
  },
  // Advanced Achievements
  {
    id: 'spinner-expert',
    title: 'Spinner Expert',
    description: 'Complete 200 wheel spins',
    icon: '🎭',
    rarity: 'epic',
    points: 300,
    progress: 0,
    maxProgress: 200,
    completed: false,
    unlockRequirements: { totalSpins: 200 }
  },
  {
    id: 'memory-legend',
    title: 'Memory Legend',
    description: 'Complete 5 perfect memory challenge rounds',
    icon: '🧠⚡',
    rarity: 'epic',
    points: 400,
    progress: 0,
    maxProgress: 5,
    completed: false,
    unlockRequirements: { perfectMemoryRounds: 5 }
  },
  {
    id: 'bingo-master',
    title: 'Bingo Master',
    description: 'Win 5 bingo games',
    icon: '🎰🏆',
    rarity: 'epic',
    points: 350,
    progress: 0,
    maxProgress: 5,
    completed: false,
    unlockRequirements: { bingoWins: 5 }
  },
  // Legendary Achievements
  {
    id: 'spinner-legend',
    title: 'Spinner Legend',
    description: 'Complete 1000 wheel spins',
    icon: '👑',
    rarity: 'legendary',
    points: 1000,
    progress: 0,
    maxProgress: 1000,
    completed: false,
    unlockRequirements: { totalSpins: 1000 }
  },
  {
    id: 'game-master',
    title: 'Game Master',
    description: 'Win all game modes at least once',
    icon: '🎮👑',
    rarity: 'legendary',
    points: 750,
    progress: 0,
    maxProgress: 4,
    completed: false,
    unlockRequirements: { 
      perfectMemoryRounds: 1, 
      bingoWins: 1 
    }
  },
  {
    id: 'wheel-creator',
    title: 'Wheel Creator',
    description: 'Create a wheel with 50 or more options',
    icon: '🎨👑',
    rarity: 'legendary',
    points: 900,
    progress: 0,
    maxProgress: 50,
    completed: false,
    unlockRequirements: { totalOptions: 50 }
  }
]

export function checkAchievementUnlocks(
  achievements: Achievement[],
  stats: {
    totalSpins: number
    uniqueResults: number
    perfectMemoryRounds: number
    bingoWins: number
    fastestMemoryTime: number
    consecutiveDays: number
    totalOptions: number
    aiGeneratedOptions: number
    mysterySpins: number
  }
): Achievement[] {
  return achievements.map(achievement => {
    if (achievement.completed) return achievement

    const reqs = achievement.unlockRequirements
    let progress = 0
    let maxProgress = achievement.maxProgress

    // Calculate progress based on requirements
    if (reqs.totalSpins && stats.totalSpins >= reqs.totalSpins) {
      progress = Math.min(stats.totalSpins, maxProgress)
    } else if (reqs.uniqueResults && stats.uniqueResults >= reqs.uniqueResults) {
      progress = Math.min(stats.uniqueResults, maxProgress)
    } else if (reqs.perfectMemoryRounds && stats.perfectMemoryRounds >= reqs.perfectMemoryRounds) {
      progress = Math.min(stats.perfectMemoryRounds, maxProgress)
    } else if (reqs.bingoWins && stats.bingoWins >= reqs.bingoWins) {
      progress = Math.min(stats.bingoWins, maxProgress)
    } else if (reqs.fastestMemoryTime && stats.fastestMemoryTime <= reqs.fastestMemoryTime) {
      progress = Math.min(reqs.fastestMemoryTime - stats.fastestMemoryTime + reqs.fastestMemoryTime, maxProgress)
    } else if (reqs.consecutiveDays && stats.consecutiveDays >= reqs.consecutiveDays) {
      progress = Math.min(stats.consecutiveDays, maxProgress)
    } else if (reqs.totalOptions && stats.totalOptions >= reqs.totalOptions) {
      progress = Math.min(stats.totalOptions, maxProgress)
    } else if (reqs.aiGeneratedOptions && stats.aiGeneratedOptions >= reqs.aiGeneratedOptions) {
      progress = Math.min(stats.aiGeneratedOptions, maxProgress)
    } else if (reqs.mysterySpins && stats.mysterySpins >= reqs.mysterySpins) {
      progress = Math.min(stats.mysterySpins, maxProgress)
    } else {
      // Calculate partial progress
      if (reqs.totalSpins) progress = Math.min(stats.totalSpins, maxProgress)
      else if (reqs.uniqueResults) progress = Math.min(stats.uniqueResults, maxProgress)
      else if (reqs.perfectMemoryRounds) progress = Math.min(stats.perfectMemoryRounds, maxProgress)
      else if (reqs.bingoWins) progress = Math.min(stats.bingoWins, maxProgress)
      else if (reqs.totalOptions) progress = Math.min(stats.totalOptions, maxProgress)
      else if (reqs.aiGeneratedOptions) progress = Math.min(stats.aiGeneratedOptions, maxProgress)
      else if (reqs.mysterySpins) progress = Math.min(stats.mysterySpins, maxProgress)
    }

    const completed = progress >= maxProgress
    const newlyCompleted = !achievement.completed && completed

    return {
      ...achievement,
      progress,
      completed,
      completedAt: newlyCompleted ? new Date() : achievement.completedAt
    }
  })
}

export function getAchievementRewards(achievement: Achievement): string[] {
  const rewards = [`${achievement.points} points`]
  
  switch (achievement.rarity) {
    case 'legendary':
      rewards.push('Exclusive Legendary Badge')
      rewards.push('Special Wheel Theme Unlock')
      break
    case 'epic':
      rewards.push('Epic Badge')
      rewards.push('Advanced Wheel Effects')
      break
    case 'rare':
      rewards.push('Rare Badge')
      rewards.push('Enhanced Animations')
      break
    case 'common':
      rewards.push('Common Badge')
      break
  }

  return rewards
}

