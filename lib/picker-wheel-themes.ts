export interface WheelTheme {
  id: string
  name: string
  description: string
  colors: string[]
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
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockRequirement?: {
    achievementId?: string
    totalSpins?: number
    totalPoints?: number
  }
  unlocked: boolean
}

export const PICKER_WHEEL_THEMES: WheelTheme[] = [
  // Default Theme
  {
    id: 'classic',
    name: 'Classic',
    description: 'The original wheel design with vibrant colors',
    colors: ['#4ade80', '#fbbf24', '#f97316', '#84cc16', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
    effects: {
      particles: false,
      glow: false,
      sparkle: false,
      rainbow: false,
      gradient: false
    },
    animations: {
      spinSpeed: 1,
      bounce: false,
      pulse: false,
      shake: false
    },
    rarity: 'common',
    unlocked: true
  },
  // Common Themes
  {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Calming blue tones inspired by the sea',
    colors: ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#1e40af', '#1d4ed8', '#2563eb'],
    effects: {
      particles: true,
      glow: false,
      sparkle: false,
      rainbow: false,
      gradient: false
    },
    animations: {
      spinSpeed: 1.2,
      bounce: false,
      pulse: true,
      shake: false
    },
    rarity: 'common',
    unlocked: true
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm colors of a beautiful sunset',
    colors: ['#f97316', '#ea580c', '#dc2626', '#b91c1c', '#991b1b', '#7c2d12', '#92400e', '#a16207'],
    effects: {
      particles: false,
      glow: true,
      sparkle: false,
      rainbow: false,
      gradient: true
    },
    animations: {
      spinSpeed: 1,
      bounce: false,
      pulse: false,
      shake: false
    },
    rarity: 'common',
    unlocked: true
  },
  // Rare Themes
  {
    id: 'forest',
    name: 'Forest Magic',
    description: 'Natural green tones with mystical effects',
    colors: ['#16a34a', '#15803d', '#166534', '#14532d', '#052e16', '#064e3b', '#065f46', '#047857'],
    effects: {
      particles: true,
      glow: true,
      sparkle: true,
      rainbow: false,
      gradient: false
    },
    animations: {
      spinSpeed: 1.1,
      bounce: true,
      pulse: false,
      shake: false
    },
    rarity: 'rare',
    unlockRequirement: {
      totalSpins: 50
    },
    unlocked: false
  },
  {
    id: 'cosmic',
    name: 'Cosmic Space',
    description: 'Deep space colors with stellar effects',
    colors: ['#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81', '#1e1b4b', '#0f172a', '#020617'],
    effects: {
      particles: true,
      glow: true,
      sparkle: true,
      rainbow: false,
      gradient: true
    },
    animations: {
      spinSpeed: 1.3,
      bounce: false,
      pulse: true,
      shake: false
    },
    rarity: 'rare',
    unlockRequirement: {
      totalSpins: 100
    },
    unlocked: false
  },
  // Epic Themes
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Magical northern lights with rainbow effects',
    colors: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#0d9488', '#0f766e', '#115e59'],
    effects: {
      particles: true,
      glow: true,
      sparkle: true,
      rainbow: true,
      gradient: true
    },
    animations: {
      spinSpeed: 1.2,
      bounce: true,
      pulse: true,
      shake: false
    },
    rarity: 'epic',
    unlockRequirement: {
      totalPoints: 500
    },
    unlocked: false
  },
  {
    id: 'neon',
    name: 'Neon Cyberpunk',
    description: 'Bright neon colors with futuristic effects',
    colors: ['#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#a855f7', '#9333ea', '#7c3aed'],
    effects: {
      particles: true,
      glow: true,
      sparkle: true,
      rainbow: false,
      gradient: true
    },
    animations: {
      spinSpeed: 1.4,
      bounce: false,
      pulse: true,
      shake: true
    },
    rarity: 'epic',
    unlockRequirement: {
      totalPoints: 750
    },
    unlocked: false
  },
  // Legendary Themes
  {
    id: 'phoenix',
    name: 'Phoenix Rising',
    description: 'Legendary fire theme with epic animations',
    colors: ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a', '#f97316', '#ea580c', '#c2410c'],
    effects: {
      particles: true,
      glow: true,
      sparkle: true,
      rainbow: true,
      gradient: true
    },
    animations: {
      spinSpeed: 1.5,
      bounce: true,
      pulse: true,
      shake: true
    },
    rarity: 'legendary',
    unlockRequirement: {
      totalPoints: 1000
    },
    unlocked: false
  },
  {
    id: 'dragon',
    name: 'Dragon Scales',
    description: 'Mythical dragon theme with powerful effects',
    colors: ['#059669', '#047857', '#065f46', '#064e3b', '#052e16', '#a16207', '#92400e', '#78350f'],
    effects: {
      particles: true,
      glow: true,
      sparkle: true,
      rainbow: true,
      gradient: true
    },
    animations: {
      spinSpeed: 1.6,
      bounce: true,
      pulse: true,
      shake: true
    },
    rarity: 'legendary',
    unlockRequirement: {
      totalPoints: 1500
    },
    unlocked: false
  }
]

export function checkThemeUnlocks(
  themes: WheelTheme[],
  stats: {
    totalSpins: number
    totalPoints: number
  }
): WheelTheme[] {
  return themes.map(theme => {
    if (theme.unlocked) return theme

    const req = theme.unlockRequirement
    if (!req) return theme

    let shouldUnlock = false

    if (req.totalSpins && stats.totalSpins >= req.totalSpins) {
      shouldUnlock = true
    }

    if (req.totalPoints && stats.totalPoints >= req.totalPoints) {
      shouldUnlock = true
    }

    return {
      ...theme,
      unlocked: shouldUnlock
    }
  })
} 