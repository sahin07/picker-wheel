export interface WheelTheme {
  id: string
  name: string
  description: string
  colors: {
    yes: string
    no: string
    maybe: string
  }
  effects: {
    particles: boolean
    glow: boolean
    sparkle: boolean
    rainbow: boolean
    gradient: boolean
  }
  animations: {
    spinSpeed: number
    bounce: boolean
    pulse: boolean
    shake: boolean
  }
  rarity: "common" | "rare" | "epic" | "legendary"
  unlocked: boolean
  unlockRequirement?: string
}

export const WHEEL_THEMES: WheelTheme[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional green and yellow design",
    colors: { yes: "#22c55e", no: "#eab308", maybe: "#f97316" },
    effects: { particles: false, glow: false, sparkle: false, rainbow: false, gradient: false },
    animations: { spinSpeed: 1, bounce: false, pulse: false, shake: false },
    rarity: "common",
    unlocked: true
  },
  {
    id: "neon",
    name: "Neon",
    description: "Bright neon colors with glow effects",
    colors: { yes: "#00ff88", no: "#ff0088", maybe: "#8800ff" },
    effects: { particles: true, glow: true, sparkle: false, rainbow: false, gradient: false },
    animations: { spinSpeed: 1.2, bounce: false, pulse: true, shake: false },
    rarity: "common",
    unlocked: true
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Calming blue and teal tones",
    colors: { yes: "#0ea5e9", no: "#f59e0b", maybe: "#10b981" },
    effects: { particles: false, glow: false, sparkle: false, rainbow: false, gradient: true },
    animations: { spinSpeed: 0.8, bounce: false, pulse: false, shake: false },
    rarity: "common",
    unlocked: true
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm orange and purple gradients",
    colors: { yes: "#f97316", no: "#ef4444", maybe: "#8b5cf6" },
    effects: { particles: false, glow: false, sparkle: false, rainbow: false, gradient: true },
    animations: { spinSpeed: 1, bounce: false, pulse: false, shake: false },
    rarity: "common",
    unlocked: true
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural green and brown palette",
    colors: { yes: "#16a34a", no: "#dc2626", maybe: "#ca8a04" },
    effects: { particles: false, glow: false, sparkle: false, rainbow: false, gradient: false },
    animations: { spinSpeed: 0.9, bounce: false, pulse: false, shake: false },
    rarity: "common",
    unlocked: true
  },
  {
    id: "galaxy",
    name: "Galaxy",
    description: "Cosmic purple and blue with star particles",
    colors: { yes: "#8b5cf6", no: "#06b6d4", maybe: "#ec4899" },
    effects: { particles: true, glow: true, sparkle: true, rainbow: false, gradient: true },
    animations: { spinSpeed: 1.3, bounce: false, pulse: true, shake: false },
    rarity: "rare",
    unlocked: false,
    unlockRequirement: "Spin 50 times"
  },
  {
    id: "fire",
    name: "Fire",
    description: "Burning red and orange with flame effects",
    colors: { yes: "#dc2626", no: "#ea580c", maybe: "#f59e0b" },
    effects: { particles: true, glow: true, sparkle: false, rainbow: false, gradient: true },
    animations: { spinSpeed: 1.4, bounce: true, pulse: true, shake: true },
    rarity: "rare",
    unlocked: false,
    unlockRequirement: "Get 10 'No' results"
  },
  {
    id: "ice",
    name: "Ice",
    description: "Frozen blue and white with crystal effects",
    colors: { yes: "#0ea5e9", no: "#64748b", maybe: "#e2e8f0" },
    effects: { particles: true, glow: true, sparkle: true, rainbow: false, gradient: true },
    animations: { spinSpeed: 0.7, bounce: false, pulse: false, shake: false },
    rarity: "rare",
    unlocked: false,
    unlockRequirement: "Get 10 'Yes' results"
  },
  {
    id: "rainbow",
    name: "Rainbow",
    description: "Colorful rainbow with animated effects",
    colors: { yes: "#ef4444", no: "#f59e0b", maybe: "#10b981" },
    effects: { particles: true, glow: true, sparkle: true, rainbow: true, gradient: true },
    animations: { spinSpeed: 1.5, bounce: true, pulse: true, shake: true },
    rarity: "epic",
    unlocked: false,
    unlockRequirement: "Use all 5 basic themes"
  },
  {
    id: "golden",
    name: "Golden",
    description: "Luxurious gold and silver design",
    colors: { yes: "#fbbf24", no: "#f59e0b", maybe: "#d97706" },
    effects: { particles: true, glow: true, sparkle: true, rainbow: false, gradient: true },
    animations: { spinSpeed: 1.1, bounce: false, pulse: true, shake: false },
    rarity: "epic",
    unlocked: false,
    unlockRequirement: "Earn 100 points"
  },
  {
    id: "matrix",
    name: "Matrix",
    description: "Digital green with code rain effects",
    colors: { yes: "#10b981", no: "#059669", maybe: "#047857" },
    effects: { particles: true, glow: true, sparkle: false, rainbow: false, gradient: false },
    animations: { spinSpeed: 1.6, bounce: false, pulse: true, shake: false },
    rarity: "legendary",
    unlocked: false,
    unlockRequirement: "Complete 25 challenges"
  },
  {
    id: "cosmic",
    name: "Cosmic",
    description: "Infinite space with nebula effects",
    colors: { yes: "#8b5cf6", no: "#ec4899", maybe: "#06b6d4" },
    effects: { particles: true, glow: true, sparkle: true, rainbow: true, gradient: true },
    animations: { spinSpeed: 1.8, bounce: true, pulse: true, shake: true },
    rarity: "legendary",
    unlocked: false,
    unlockRequirement: "Unlock all other themes"
  }
]

export function getThemeById(id: string): WheelTheme | undefined {
  return WHEEL_THEMES.find(theme => theme.id === id)
}

export function getUnlockedThemes(): WheelTheme[] {
  return WHEEL_THEMES.filter(theme => theme.unlocked)
}

export function unlockTheme(themeId: string, themes: WheelTheme[]): WheelTheme[] {
  return themes.map(theme => 
    theme.id === themeId ? { ...theme, unlocked: true } : theme
  )
}

export function checkThemeUnlocks(
  currentThemes: WheelTheme[],
  totalSpins: number,
  results: { yes: number; no: number; maybe: number },
  usedThemes: string[],
  totalPoints: number,
  completedChallenges: number
): { updatedThemes: WheelTheme[]; newlyUnlocked: string[] } {
  const updatedThemes = [...currentThemes]
  const newlyUnlocked: string[] = []

  // Check each theme's unlock requirements
  updatedThemes.forEach(theme => {
    if (theme.unlocked) return

    let shouldUnlock = false
    switch (theme.id) {
      case "galaxy":
        shouldUnlock = totalSpins >= 50
        break
      case "fire":
        shouldUnlock = results.no >= 10
        break
      case "ice":
        shouldUnlock = results.yes >= 10
        break
      case "rainbow":
        shouldUnlock = usedThemes.length >= 5
        break
      case "golden":
        shouldUnlock = totalPoints >= 100
        break
      case "matrix":
        shouldUnlock = completedChallenges >= 25
        break
      case "cosmic":
        shouldUnlock = updatedThemes.filter(t => t.unlocked).length >= updatedThemes.length - 1
        break
    }

    if (shouldUnlock) {
      theme.unlocked = true
      newlyUnlocked.push(theme.id)
    }
  })

  return { updatedThemes, newlyUnlocked }
} 