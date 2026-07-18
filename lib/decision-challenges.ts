export interface Challenge {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "achievement" | "special"
  category: "spins" | "streaks" | "decisions" | "ai" | "time" | "variety"
  requirements: {
    spins?: number
    streak?: number
    decisions?: string[]
    aiUsage?: number
    timeSpent?: number // in minutes
    uniqueResults?: number
  }
  rewards: {
    points: number
    theme?: string
    badge?: string
    specialEffect?: string
  }
  progress: number
  maxProgress: number
  completed: boolean
  completedAt?: Date
  expiresAt?: Date
  rarity: "common" | "rare" | "epic" | "legendary"
}

export const DAILY_CHALLENGES: Challenge[] = [
  {
    id: "daily-spinner",
    title: "Daily Spinner",
    description: "Spin the wheel 5 times today",
    type: "daily",
    category: "spins",
    requirements: { spins: 5 },
    rewards: { points: 50, theme: "sunset" },
    progress: 0,
    maxProgress: 5,
    completed: false,
    rarity: "common"
  },
  {
    id: "yes-streak",
    title: "Yes Man",
    description: "Get 3 'Yes' results in a row",
    type: "daily",
    category: "streaks",
    requirements: { streak: 3 },
    rewards: { points: 100, badge: "yes-man" },
    progress: 0,
    maxProgress: 3,
    completed: false,
    rarity: "rare"
  },
  {
    id: "ai-explorer",
    title: "AI Explorer",
    description: "Use AI mode 2 times today",
    type: "daily",
    category: "ai",
    requirements: { aiUsage: 2 },
    rewards: { points: 75, specialEffect: "neon-glow" },
    progress: 0,
    maxProgress: 2,
    completed: false,
    rarity: "common"
  }
]

export const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: "weekly-master",
    title: "Decision Master",
    description: "Make 50 decisions this week",
    type: "weekly",
    category: "spins",
    requirements: { spins: 50 },
    rewards: { points: 500, theme: "galaxy", badge: "decision-master" },
    progress: 0,
    maxProgress: 50,
    completed: false,
    rarity: "epic"
  },
  {
    id: "balanced-decider",
    title: "Balanced Decider",
    description: "Get equal Yes and No results (at least 10 each)",
    type: "weekly",
    category: "decisions",
    requirements: { decisions: ["yes", "no"] },
    rewards: { points: 300, theme: "yin-yang" },
    progress: 0,
    maxProgress: 20,
    completed: false,
    rarity: "rare"
  },
  {
    id: "ai-enthusiast",
    title: "AI Enthusiast",
    description: "Use AI mode 10 times this week",
    type: "weekly",
    category: "ai",
    requirements: { aiUsage: 10 },
    rewards: { points: 400, badge: "ai-enthusiast", specialEffect: "matrix-rain" },
    progress: 0,
    maxProgress: 10,
    completed: false,
    rarity: "epic"
  }
]

export const ACHIEVEMENT_CHALLENGES: Challenge[] = [
  {
    id: "century-club",
    title: "Century Club",
    description: "Reach 100 total spins",
    type: "achievement",
    category: "spins",
    requirements: { spins: 100 },
    rewards: { points: 1000, theme: "golden", badge: "century-club" },
    progress: 0,
    maxProgress: 100,
    completed: false,
    rarity: "legendary"
  },
  {
    id: "streak-master",
    title: "Streak Master",
    description: "Achieve a 10-result streak",
    type: "achievement",
    category: "streaks",
    requirements: { streak: 10 },
    rewards: { points: 800, theme: "fire", badge: "streak-master" },
    progress: 0,
    maxProgress: 10,
    completed: false,
    rarity: "legendary"
  },
  {
    id: "variety-seeker",
    title: "Variety Seeker",
    description: "Get all three results (Yes, No, Maybe) in one session",
    type: "achievement",
    category: "variety",
    requirements: { uniqueResults: 3 },
    rewards: { points: 200, theme: "rainbow", badge: "variety-seeker" },
    progress: 0,
    maxProgress: 3,
    completed: false,
    rarity: "rare"
  }
]

export const SPECIAL_CHALLENGES: Challenge[] = [
  {
    id: "midnight-decider",
    title: "Midnight Decider",
    description: "Make a decision between 11 PM and 1 AM",
    type: "special",
    category: "time",
    requirements: { timeSpent: 1 },
    rewards: { points: 150, theme: "midnight", badge: "night-owl" },
    progress: 0,
    maxProgress: 1,
    completed: false,
    rarity: "rare"
  },
  {
    id: "weekend-warrior",
    title: "Weekend Warrior",
    description: "Use the wheel on both Saturday and Sunday",
    type: "special",
    category: "time",
    requirements: { timeSpent: 2 },
    rewards: { points: 250, theme: "weekend", badge: "weekend-warrior" },
    progress: 0,
    maxProgress: 2,
    completed: false,
    rarity: "epic"
  }
]

export function initializeChallenges(storedChallenges: any[] = []): Challenge[] {
  const allChallenges = [
    ...DAILY_CHALLENGES.map(c => ({ ...c, expiresAt: getDailyExpiry() })),
    ...WEEKLY_CHALLENGES.map(c => ({ ...c, expiresAt: getWeeklyExpiry() })),
    ...ACHIEVEMENT_CHALLENGES,
    ...SPECIAL_CHALLENGES
  ]

  // Merge with stored challenges to preserve progress
  const mergedChallenges = allChallenges.map(challenge => {
    const stored = storedChallenges.find(s => s.id === challenge.id)
    if (stored) {
      return {
        ...challenge,
        progress: stored.progress || 0,
        completed: stored.completed || false,
        completedAt: stored.completedAt ? new Date(stored.completedAt) : undefined,
        expiresAt: stored.expiresAt ? new Date(stored.expiresAt) : undefined
      }
    }
    return challenge
  })

  return mergedChallenges
}

export function checkChallenges(
  currentChallenges: Challenge[],
  totalSpins: number,
  results: { yes: number; no: number; maybe: number },
  streak: { type: string; count: number },
  activeTab: string,
  recentResults: string[],
  aiUsageCount: number,
  decisionDates: Date[]
): { updatedChallenges: Challenge[]; newlyCompleted: string[]; totalPoints: number } {
  const updatedChallenges = currentChallenges.map(challenge => {
    if (challenge.completed) return challenge

    let progress = 0
    let completed = false

    switch (challenge.category) {
      case "spins":
        if (challenge.requirements.spins) {
          progress = Math.min(totalSpins, challenge.requirements.spins)
          completed = totalSpins >= challenge.requirements.spins
        }
        break

      case "streaks":
        if (challenge.requirements.streak) {
          progress = Math.min(streak.count, challenge.requirements.streak)
          completed = streak.count >= challenge.requirements.streak
        }
        break

      case "decisions":
        if (challenge.requirements.decisions) {
          const yesCount = results.yes
          const noCount = results.no
          const total = yesCount + noCount
          if (challenge.id === "balanced-decider") {
            const minRequired = Math.min(yesCount, noCount) * 2
            progress = Math.min(minRequired, challenge.maxProgress)
            completed = yesCount >= 10 && noCount >= 10
          }
        }
        break

      case "ai":
        if (challenge.requirements.aiUsage) {
          progress = Math.min(aiUsageCount, challenge.requirements.aiUsage)
          completed = aiUsageCount >= challenge.requirements.aiUsage
        }
        break

      case "variety":
        if (challenge.requirements.uniqueResults) {
          const uniqueResults = new Set(recentResults).size
          progress = Math.min(uniqueResults, challenge.requirements.uniqueResults)
          completed = uniqueResults >= challenge.requirements.uniqueResults
        }
        break

      case "time":
        // Time-based challenges are handled separately
        break
    }

    return {
      ...challenge,
      progress,
      completed: completed || challenge.completed,
      completedAt: completed && !challenge.completed ? new Date() : challenge.completedAt
    }
  })

  const newlyCompleted = updatedChallenges
    .filter(c => c.completed && !currentChallenges.find(oc => oc.id === c.id)?.completed)
    .map(c => c.id)

  const totalPoints = updatedChallenges
    .filter(c => c.completed)
    .reduce((sum, c) => sum + c.rewards.points, 0)

  return { updatedChallenges, newlyCompleted, totalPoints }
}

export function getDailyExpiry(): Date {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
}

export function getWeeklyExpiry(): Date {
  const now = new Date()
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + (7 - nextWeek.getDay()))
  nextWeek.setHours(0, 0, 0, 0)
  return nextWeek
}

export function getChallengeRewards(challenge: Challenge): string[] {
  const rewards = []
  if (challenge.rewards.theme) rewards.push(`Theme: ${challenge.rewards.theme}`)
  if (challenge.rewards.badge) rewards.push(`Badge: ${challenge.rewards.badge}`)
  if (challenge.rewards.specialEffect) rewards.push(`Effect: ${challenge.rewards.specialEffect}`)
  rewards.push(`${challenge.rewards.points} points`)
  return rewards
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "common": return "text-gray-600"
    case "rare": return "text-blue-600"
    case "epic": return "text-purple-600"
    case "legendary": return "text-yellow-600"
    default: return "text-gray-600"
  }
}

export function getRarityBgColor(rarity: string): string {
  switch (rarity) {
    case "common": return "bg-gray-100"
    case "rare": return "bg-blue-100"
    case "epic": return "bg-purple-100"
    case "legendary": return "bg-yellow-100"
    default: return "bg-gray-100"
  }
} 