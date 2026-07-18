import { Achievement } from "@/components/yes-no-picker-wheel/achievements-display"

// Predefined achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Decision Master Achievements
  {
    id: "first-decision",
    title: "First Decision",
    description: "Make your first decision with the wheel",
    icon: "target",
    category: "decision",
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    rarity: "common",
    points: 10
  },
  {
    id: "quick-decider",
    title: "Quick Decider",
    description: "Make 10 decisions in 5 minutes",
    icon: "zap",
    category: "decision",
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    rarity: "rare",
    points: 25
  },
  {
    id: "decision-master",
    title: "Decision Master",
    description: "Make 100 total decisions",
    icon: "trophy",
    category: "decision",
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    rarity: "epic",
    points: 50
  },
  {
    id: "balanced-mind",
    title: "Balanced Mind",
    description: "Get 5 alternating Yes/No results in a row",
    icon: "target",
    category: "decision",
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    rarity: "rare",
    points: 30
  },
  {
    id: "yes-person",
    title: "Yes Person",
    description: "Get 10 Yes results in a row",
    icon: "heart",
    category: "decision",
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    rarity: "epic",
    points: 40
  },
  {
    id: "no-person",
    title: "No Person",
    description: "Get 10 No results in a row",
    icon: "target",
    category: "decision",
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    rarity: "epic",
    points: 40
  },

  // Streak Achievements
  {
    id: "streak-starter",
    title: "Streak Starter",
    description: "Achieve a 3-day decision streak",
    icon: "trendingUp",
    category: "streak",
    progress: 0,
    maxProgress: 3,
    unlocked: false,
    rarity: "common",
    points: 15
  },
  {
    id: "streak-master",
    title: "Streak Master",
    description: "Achieve a 7-day decision streak",
    icon: "trendingUp",
    category: "streak",
    progress: 0,
    maxProgress: 7,
    unlocked: false,
    rarity: "rare",
    points: 35
  },
  {
    id: "streak-legend",
    title: "Streak Legend",
    description: "Achieve a 30-day decision streak",
    icon: "trophy",
    category: "streak",
    progress: 0,
    maxProgress: 30,
    unlocked: false,
    rarity: "legendary",
    points: 100
  },

  // Time-based Achievements
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Make 5 decisions before 9 AM",
    icon: "sun",
    category: "time",
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    rarity: "rare",
    points: 25
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Make 5 decisions after 10 PM",
    icon: "moon",
    category: "time",
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    rarity: "rare",
    points: 25
  },
  {
    id: "coffee-break",
    title: "Coffee Break",
    description: "Make decisions during typical coffee break hours (9-11 AM)",
    icon: "coffee",
    category: "time",
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    rarity: "common",
    points: 20
  },
  {
    id: "weekend-warrior",
    title: "Weekend Warrior",
    description: "Make 20 decisions on weekends",
    icon: "star",
    category: "time",
    progress: 0,
    maxProgress: 20,
    unlocked: false,
    rarity: "rare",
    points: 30
  },

  // AI Achievements
  {
    id: "ai-curious",
    title: "AI Curious",
    description: "Use AI Assistant mode for the first time",
    icon: "brain",
    category: "ai",
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    rarity: "common",
    points: 15
  },
  {
    id: "ai-enthusiast",
    title: "AI Enthusiast",
    description: "Use AI Assistant mode 10 times",
    icon: "brain",
    category: "ai",
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    rarity: "rare",
    points: 30
  },
  {
    id: "ai-master",
    title: "AI Master",
    description: "Use AI Assistant mode 50 times",
    icon: "brain",
    category: "ai",
    progress: 0,
    maxProgress: 50,
    unlocked: false,
    rarity: "epic",
    points: 60
  },
  {
    id: "ai-legend",
    title: "AI Legend",
    description: "Use AI Assistant mode 100 times",
    icon: "trophy",
    category: "ai",
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    rarity: "legendary",
    points: 150
  },

  // Special Achievements
  {
    id: "century-club",
    title: "Century Club",
    description: "Reach 100 total spins",
    icon: "award",
    category: "special",
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    rarity: "epic",
    points: 75
  },
  {
    id: "maybe-explorer",
    title: "Maybe Explorer",
    description: "Get 5 Maybe results (requires Yes/No/Maybe mode)",
    icon: "sparkles",
    category: "special",
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    rarity: "rare",
    points: 35
  },
  {
    id: "theme-collector",
    title: "Theme Collector",
    description: "Try all 5 wheel themes",
    icon: "star",
    category: "special",
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    rarity: "rare",
    points: 30
  },
  {
    id: "decision-philosopher",
    title: "Decision Philosopher",
    description: "Make decisions for 7 consecutive days",
    icon: "brain",
    category: "special",
    progress: 0,
    maxProgress: 7,
    unlocked: false,
    rarity: "epic",
    points: 50
  }
]

// Achievement checking logic
export function checkAchievements(
  currentAchievements: Achievement[],
  totalSpins: number,
  results: { yes: number; no: number; maybe: number },
  streak: { type: string; count: number },
  activeTab: string,
  recentResults: string[],
  usedThemes: string[],
  decisionDates: Date[]
): { updatedAchievements: Achievement[]; newlyUnlocked: string[] } {
  const updatedAchievements = [...currentAchievements]
  const newlyUnlocked: string[] = []

  // Helper function to update achievement progress
  const updateAchievement = (id: string, progress: number, unlocked: boolean = false) => {
    const achievement = updatedAchievements.find(a => a.id === id)
    if (achievement) {
      const wasUnlocked = achievement.unlocked
      achievement.progress = Math.min(progress, achievement.maxProgress)
      if (unlocked && !wasUnlocked) {
        achievement.unlocked = true
        achievement.unlockedAt = new Date()
        newlyUnlocked.push(id)
      }
    }
  }

  // Check decision-based achievements
  updateAchievement("first-decision", totalSpins, totalSpins >= 1)
  updateAchievement("decision-master", totalSpins, totalSpins >= 100)
  updateAchievement("century-club", totalSpins, totalSpins >= 100)

  // Check streak achievements
  updateAchievement("streak-starter", streak.count, streak.count >= 3)
  updateAchievement("streak-master", streak.count, streak.count >= 7)
  updateAchievement("streak-legend", streak.count, streak.count >= 30)

  // Check AI usage achievements
  const aiUsageCount = decisionDates.filter(date => 
    // This would need to be tracked separately in the main component
    // For now, we'll use a placeholder
    false
  ).length

  updateAchievement("ai-curious", aiUsageCount, aiUsageCount >= 1)
  updateAchievement("ai-enthusiast", aiUsageCount, aiUsageCount >= 10)
  updateAchievement("ai-master", aiUsageCount, aiUsageCount >= 50)
  updateAchievement("ai-legend", aiUsageCount, aiUsageCount >= 100)

  // Check Maybe results (if in Yes/No/Maybe mode)
  updateAchievement("maybe-explorer", results.maybe, results.maybe >= 5)

  // Check theme usage
  updateAchievement("theme-collector", usedThemes.length, usedThemes.length >= 5)

  // Check time-based achievements
  const earlyDecisions = decisionDates.filter(date => 
    date.getHours() < 9
  ).length
  const nightDecisions = decisionDates.filter(date => 
    date.getHours() >= 22
  ).length
  const coffeeBreakDecisions = decisionDates.filter(date => 
    date.getHours() >= 9 && date.getHours() <= 11
  ).length

  updateAchievement("early-bird", earlyDecisions, earlyDecisions >= 5)
  updateAchievement("night-owl", nightDecisions, nightDecisions >= 5)
  updateAchievement("coffee-break", coffeeBreakDecisions, coffeeBreakDecisions >= 10)

  // Check consecutive days
  const uniqueDays = new Set(decisionDates.map(date => 
    date.toDateString()
  )).size
  updateAchievement("decision-philosopher", uniqueDays, uniqueDays >= 7)

  // Check alternating results
  let alternatingCount = 0
  for (let i = 1; i < recentResults.length; i++) {
    if (recentResults[i] !== recentResults[i - 1]) {
      alternatingCount++
    } else {
      alternatingCount = 0
    }
  }
  updateAchievement("balanced-mind", alternatingCount, alternatingCount >= 5)

  // Check consecutive Yes/No results
  let consecutiveYes = 0
  let consecutiveNo = 0
  for (const result of recentResults) {
    if (result === "yes") {
      consecutiveYes++
      consecutiveNo = 0
    } else if (result === "no") {
      consecutiveNo++
      consecutiveYes = 0
    }
  }
  updateAchievement("yes-person", consecutiveYes, consecutiveYes >= 10)
  updateAchievement("no-person", consecutiveNo, consecutiveNo >= 10)

  return { updatedAchievements, newlyUnlocked }
}

// Initialize achievements from stored data
export function initializeAchievements(storedAchievements: any[]): Achievement[] {
  if (!storedAchievements || storedAchievements.length === 0) {
    return ACHIEVEMENTS
  }

  // Merge stored achievements with default ones
  return ACHIEVEMENTS.map(defaultAchievement => {
    const stored = storedAchievements.find(a => a.id === defaultAchievement.id)
    if (stored) {
      return {
        ...defaultAchievement,
        progress: stored.progress || 0,
        unlocked: stored.unlocked || false,
        unlockedAt: stored.unlockedAt ? new Date(stored.unlockedAt) : undefined
      }
    }
    return defaultAchievement
  })
} 