export interface SocialProfile {
  id: string
  username: string
  avatar?: string
  level: number
  totalPoints: number
  totalSpins: number
  achievements: number
  themes: number
  joinDate: Date
  lastActive: Date
  bio?: string
  isPublic: boolean
}

export interface SharedWheel {
  id: string
  name: string
  description?: string
  options: string[]
  theme: string
  creatorId: string
  creatorName: string
  createdAt: Date
  spins: number
  likes: number
  isPublic: boolean
  tags: string[]
  category: 'food' | 'entertainment' | 'decisions' | 'games' | 'other'
}

export interface CommunityChallenge {
  id: string
  title: string
  description: string
  options: string[]
  theme: string
  startDate: Date
  endDate: Date
  participants: number
  totalSpins: number
  isActive: boolean
  category: 'daily' | 'weekly' | 'monthly' | 'special'
  rewards: {
    points: number
    achievements: string[]
    themes: string[]
  }
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar?: string
  score: number
  metric: 'points' | 'spins' | 'achievements' | 'streak'
  change?: number // rank change from previous period
}

export interface SocialActivity {
  id: string
  userId: string
  username: string
  avatar?: string
  type: 'achievement' | 'theme_unlock' | 'challenge_complete' | 'wheel_share' | 'streak'
  title: string
  description: string
  timestamp: Date
  data?: any
}

export interface SocialStats {
  totalUsers: number
  totalSpins: number
  activeToday: number
  challengesCompleted: number
  wheelsShared: number
  topCategories: Array<{
    category: string
    count: number
  }>
}

// Mock data for demonstration
export const MOCK_SOCIAL_PROFILES: SocialProfile[] = [
  {
    id: '1',
    username: 'WheelMaster',
    level: 15,
    totalPoints: 2500,
    totalSpins: 150,
    achievements: 12,
    themes: 8,
    joinDate: new Date('2024-01-15'),
    lastActive: new Date(),
    bio: 'Professional decision maker and wheel enthusiast!',
    isPublic: true
  },
  {
    id: '2',
    username: 'SpinQueen',
    level: 12,
    totalPoints: 1800,
    totalSpins: 120,
    achievements: 10,
    themes: 6,
    joinDate: new Date('2024-02-01'),
    lastActive: new Date(),
    bio: 'Making decisions one spin at a time 🎯',
    isPublic: true
  },
  {
    id: '3',
    username: 'DecisionPro',
    level: 8,
    totalPoints: 1200,
    totalSpins: 80,
    achievements: 7,
    themes: 4,
    joinDate: new Date('2024-02-15'),
    lastActive: new Date(),
    bio: 'New to the wheel game but loving it!',
    isPublic: true
  }
]

export const MOCK_SHARED_WHEELS: SharedWheel[] = [
  {
    id: '1',
    name: 'Weekend Movie Night',
    description: 'Perfect for choosing what to watch this weekend',
    options: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Documentary'],
    theme: 'neon',
    creatorId: '1',
    creatorName: 'WheelMaster',
    createdAt: new Date('2024-03-01'),
    spins: 45,
    likes: 12,
    isPublic: true,
    tags: ['entertainment', 'movies', 'weekend'],
    category: 'entertainment'
  },
  {
    id: '2',
    name: 'Lunch Decision Maker',
    description: 'Can\'t decide what to eat? Let the wheel decide!',
    options: ['Pizza', 'Burger', 'Sushi', 'Pasta', 'Salad', 'Tacos', 'Chinese', 'Indian'],
    theme: 'ocean',
    creatorId: '2',
    creatorName: 'SpinQueen',
    createdAt: new Date('2024-03-02'),
    spins: 78,
    likes: 23,
    isPublic: true,
    tags: ['food', 'lunch', 'hungry'],
    category: 'food'
  },
  {
    id: '3',
    name: 'Workout Motivation',
    description: 'Random workout to keep things interesting',
    options: ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Pilates', 'Dance', 'Swimming', 'Running'],
    theme: 'forest',
    creatorId: '3',
    creatorName: 'DecisionPro',
    createdAt: new Date('2024-03-03'),
    spins: 32,
    likes: 8,
    isPublic: true,
    tags: ['fitness', 'workout', 'health'],
    category: 'other'
  }
]

export const MOCK_COMMUNITY_CHALLENGES: CommunityChallenge[] = [
  {
    id: '1',
    title: 'March Madness: Food Edition',
    description: 'Vote for your favorite cuisine this month!',
    options: ['Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Indian', 'French', 'Thai'],
    theme: 'aurora',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    participants: 156,
    totalSpins: 892,
    isActive: true,
    category: 'monthly',
    rewards: {
      points: 500,
      achievements: ['community_champion'],
      themes: ['phoenix']
    }
  },
  {
    id: '2',
    title: 'Weekend Activity Picker',
    description: 'What should we do this weekend?',
    options: ['Movie Night', 'Game Night', 'Outdoor Adventure', 'Cooking Class', 'Art Workshop', 'Dance Party', 'Book Club', 'Spa Day'],
    theme: 'sunset',
    startDate: new Date('2024-03-08'),
    endDate: new Date('2024-03-10'),
    participants: 89,
    totalSpins: 234,
    isActive: true,
    category: 'weekly',
    rewards: {
      points: 200,
      achievements: ['weekend_warrior'],
      themes: []
    }
  }
]

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: '1', username: 'WheelMaster', score: 2500, metric: 'points', change: 0 },
  { rank: 2, userId: '2', username: 'SpinQueen', score: 1800, metric: 'points', change: 1 },
  { rank: 3, userId: '3', username: 'DecisionPro', score: 1200, metric: 'points', change: -1 },
  { rank: 4, userId: '4', username: 'LuckySpinner', score: 950, metric: 'points', change: 2 },
  { rank: 5, userId: '5', username: 'WheelWizard', score: 800, metric: 'points', change: -1 }
]

export const MOCK_SOCIAL_ACTIVITIES: SocialActivity[] = [
  {
    id: '1',
    userId: '1',
    username: 'WheelMaster',
    type: 'achievement',
    title: 'Unlocked Legendary Achievement!',
    description: 'WheelMaster just unlocked "Decision Master" achievement',
    timestamp: new Date(),
    data: { achievement: 'Decision Master', points: 100 }
  },
  {
    id: '2',
    userId: '2',
    username: 'SpinQueen',
    type: 'theme_unlock',
    title: 'New Theme Unlocked!',
    description: 'SpinQueen unlocked the "Phoenix Rising" theme',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    data: { theme: 'Phoenix Rising' }
  },
  {
    id: '3',
    userId: '3',
    username: 'DecisionPro',
    type: 'challenge_complete',
    title: 'Challenge Completed!',
    description: 'DecisionPro completed "Weekend Activity Picker" challenge',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    data: { challenge: 'Weekend Activity Picker', points: 200 }
  }
]

export const MOCK_SOCIAL_STATS: SocialStats = {
  totalUsers: 1250,
  totalSpins: 45678,
  activeToday: 234,
  challengesCompleted: 89,
  wheelsShared: 156,
  topCategories: [
    { category: 'food', count: 45 },
    { category: 'entertainment', count: 38 },
    { category: 'decisions', count: 32 },
    { category: 'games', count: 28 },
    { category: 'other', count: 13 }
  ]
}

// Helper functions
export function generateShareLink(wheelId: string): string {
  return `${window.location.origin}/shared-wheel/${wheelId}`
}

export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'food': return '🍕'
    case 'entertainment': return '🎬'
    case 'decisions': return '🤔'
    case 'games': return '🎮'
    default: return '🎯'
  }
}

export function getActivityIcon(type: string): string {
  switch (type) {
    case 'achievement': return '🏆'
    case 'theme_unlock': return '🎨'
    case 'challenge_complete': return '✅'
    case 'wheel_share': return '📤'
    case 'streak': return '🔥'
    default: return '🎯'
  }
} 