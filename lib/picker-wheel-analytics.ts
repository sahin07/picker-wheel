export interface SpinRecord {
  id: string
  timestamp: Date
  result: string
  options: string[]
  mode: 'manual' | 'ai' | 'template'
  theme: string
  spinDuration: number
  userQuestion?: string
}

/** Persist/rehydrate may store timestamps as ISO strings. */
function asDate(value: Date | string | number): Date | null {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export interface AnalyticsData {
  totalSpins: number
  uniqueResults: number
  mostSelectedOptions: Array<{
    option: string
    count: number
    percentage: number
  }>
  leastSelectedOptions: Array<{
    option: string
    count: number
    percentage: number
  }>
  spinHistory: SpinRecord[]
  dailyStats: Array<{
    date: string
    spins: number
    uniqueResults: number
  }>
  weeklyStats: Array<{
    week: string
    spins: number
    uniqueResults: number
    mostUsedTheme: string
  }>
  monthlyStats: Array<{
    month: string
    spins: number
    uniqueResults: number
    averageSpinDuration: number
  }>
  themeUsage: Array<{
    theme: string
    usageCount: number
    percentage: number
  }>
  modeUsage: Array<{
    mode: string
    usageCount: number
    percentage: number
  }>
  decisionPatterns: {
    timeOfDay: Array<{
      hour: number
      spins: number
    }>
    dayOfWeek: Array<{
      day: string
      spins: number
    }>
    spinFrequency: {
      averageSpinsPerDay: number
      maxSpinsInDay: number
      longestStreak: number
      currentStreak: number
    }
  }
  insights: string[]
}

export function analyzeSpinData(spinHistory: SpinRecord[]): AnalyticsData {
  if (spinHistory.length === 0) {
    return {
      totalSpins: 0,
      uniqueResults: 0,
      mostSelectedOptions: [],
      leastSelectedOptions: [],
      spinHistory: [],
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: [],
      themeUsage: [],
      modeUsage: [],
      decisionPatterns: {
        timeOfDay: [],
        dayOfWeek: [],
        spinFrequency: {
          averageSpinsPerDay: 0,
          maxSpinsInDay: 0,
          longestStreak: 0,
          currentStreak: 0
        }
      },
      insights: []
    }
  }

  // Count results
  const resultCounts = new Map<string, number>()
  const themeCounts = new Map<string, number>()
  const modeCounts = new Map<string, number>()
  const timeOfDayCounts = new Map<number, number>()
  const dayOfWeekCounts = new Map<string, number>()
  const dailyCounts = new Map<string, number>()

  spinHistory.forEach(record => {
    // Count results
    resultCounts.set(record.result, (resultCounts.get(record.result) || 0) + 1)
    
    // Count themes
    themeCounts.set(record.theme, (themeCounts.get(record.theme) || 0) + 1)
    
    // Count modes
    modeCounts.set(record.mode, (modeCounts.get(record.mode) || 0) + 1)

    const timestamp = asDate(record.timestamp as Date | string | number)
    if (!timestamp) return
    
    // Count time of day
    const hour = timestamp.getHours()
    timeOfDayCounts.set(hour, (timeOfDayCounts.get(hour) || 0) + 1)
    
    // Count day of week
    const day = timestamp.toLocaleDateString('en-US', { weekday: 'long' })
    dayOfWeekCounts.set(day, (dayOfWeekCounts.get(day) || 0) + 1)
    
    // Count daily
    const date = timestamp.toLocaleDateString()
    dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1)
  })

  // Calculate most and least selected options
  const sortedResults = Array.from(resultCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([option, count]) => ({
      option,
      count,
      percentage: (count / spinHistory.length) * 100
    }))

  const mostSelectedOptions = sortedResults.slice(0, 5)
  const leastSelectedOptions = sortedResults.slice(-5).reverse()

  // Calculate theme usage
  const themeUsage = Array.from(themeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([theme, count]) => ({
      theme,
      usageCount: count,
      percentage: (count / spinHistory.length) * 100
    }))

  // Calculate mode usage
  const modeUsage = Array.from(modeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([mode, count]) => ({
      mode,
      usageCount: count,
      percentage: (count / spinHistory.length) * 100
    }))

  // Calculate time of day patterns
  const timeOfDay = Array.from(timeOfDayCounts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([hour, spins]) => ({ hour, spins }))

  // Calculate day of week patterns
  const dayOfWeek = Array.from(dayOfWeekCounts.entries())
    .map(([day, spins]) => ({ day, spins }))

  // Calculate daily stats
  const dailyStats = Array.from(dailyCounts.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, spins]) => ({
      date,
      spins,
      uniqueResults: new Set(
        spinHistory
          .filter((record) => {
            const ts = asDate(record.timestamp as Date | string | number)
            return ts ? ts.toLocaleDateString() === date : false
          })
          .map(record => record.result)
      ).size
    }))

  // Calculate weekly stats
  const weeklyStats = calculateWeeklyStats(spinHistory)

  // Calculate monthly stats
  const monthlyStats = calculateMonthlyStats(spinHistory)

  // Calculate spin frequency
  const spinFrequency = calculateSpinFrequency(dailyStats)

  // Generate insights
  const insights = generateInsights({
    totalSpins: spinHistory.length,
    mostSelectedOptions,
    leastSelectedOptions,
    themeUsage,
    modeUsage,
    timeOfDay,
    dayOfWeek,
    spinFrequency
  })

  return {
    totalSpins: spinHistory.length,
    uniqueResults: resultCounts.size,
    mostSelectedOptions,
    leastSelectedOptions,
    spinHistory,
    dailyStats,
    weeklyStats,
    monthlyStats,
    themeUsage,
    modeUsage,
    decisionPatterns: {
      timeOfDay,
      dayOfWeek,
      spinFrequency
    },
    insights
  }
}

function calculateWeeklyStats(spinHistory: SpinRecord[]) {
  const weeklyData = new Map<string, {
    spins: number
    uniqueResults: Set<string>
    themeCounts: Map<string, number>
  }>()

  spinHistory.forEach(record => {
    const timestamp = asDate(record.timestamp as Date | string | number)
    if (!timestamp) return
    const weekStart = getWeekStart(timestamp)
    const weekKey = weekStart.toLocaleDateString()
    
    if (!weeklyData.has(weekKey)) {
      weeklyData.set(weekKey, {
        spins: 0,
        uniqueResults: new Set(),
        themeCounts: new Map()
      })
    }
    
    const weekData = weeklyData.get(weekKey)!
    weekData.spins++
    weekData.uniqueResults.add(record.result)
    weekData.themeCounts.set(record.theme, (weekData.themeCounts.get(record.theme) || 0) + 1)
  })

  return Array.from(weeklyData.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([week, data]) => ({
      week,
      spins: data.spins,
      uniqueResults: data.uniqueResults.size,
      mostUsedTheme: Array.from(data.themeCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown'
    }))
}

function calculateMonthlyStats(spinHistory: SpinRecord[]) {
  const monthlyData = new Map<string, {
    spins: number
    uniqueResults: Set<string>
    totalDuration: number
  }>()

  spinHistory.forEach(record => {
    const timestamp = asDate(record.timestamp as Date | string | number)
    if (!timestamp) return
    const monthKey = timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, {
        spins: 0,
        uniqueResults: new Set(),
        totalDuration: 0
      })
    }
    
    const monthData = monthlyData.get(monthKey)!
    monthData.spins++
    monthData.uniqueResults.add(record.result)
    monthData.totalDuration += record.spinDuration
  })

  return Array.from(monthlyData.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([month, data]) => ({
      month,
      spins: data.spins,
      uniqueResults: data.uniqueResults.size,
      averageSpinDuration: data.totalDuration / data.spins
    }))
}

function calculateSpinFrequency(dailyStats: Array<{ date: string; spins: number }>) {
  if (dailyStats.length === 0) {
    return {
      averageSpinsPerDay: 0,
      maxSpinsInDay: 0,
      longestStreak: 0,
      currentStreak: 0
    }
  }

  const totalSpins = dailyStats.reduce((sum, day) => sum + day.spins, 0)
  const averageSpinsPerDay = totalSpins / dailyStats.length
  const maxSpinsInDay = Math.max(...dailyStats.map(day => day.spins))

  // Calculate streaks
  let longestStreak = 0
  let currentStreak = 0
  let tempStreak = 0

  dailyStats.forEach(day => {
    if (day.spins > 0) {
      tempStreak++
      currentStreak = tempStreak
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  })

  return {
    averageSpinsPerDay: Math.round(averageSpinsPerDay * 100) / 100,
    maxSpinsInDay,
    longestStreak,
    currentStreak
  }
}

function generateInsights(data: any): string[] {
  const insights: string[] = []

  // Most selected insight
  if (data.mostSelectedOptions.length > 0) {
    const top = data.mostSelectedOptions[0]
    insights.push(`You seem to favor "${top.option}" - it was selected ${top.count} times (${top.percentage.toFixed(1)}% of spins)`)
  }

  // Theme preference insight
  if (data.themeUsage.length > 0) {
    const favoriteTheme = data.themeUsage[0]
    insights.push(`Your favorite theme is "${favoriteTheme.theme}" - used ${favoriteTheme.usageCount} times`)
  }

  // Time pattern insight
  if (data.timeOfDay.length > 0) {
    const peakHour = data.timeOfDay.reduce((max: any, current: any) => 
      current.spins > max.spins ? current : max
    )
    insights.push(`You're most active around ${peakHour.hour}:00 - ${peakHour.spins} spins during this hour`)
  }

  // Day pattern insight
  if (data.dayOfWeek.length > 0) {
    const peakDay = data.dayOfWeek.reduce((max: any, current: any) => 
      current.spins > max.spins ? current : max
    )
    insights.push(`You prefer making decisions on ${peakDay.day}s - ${peakDay.spins} spins`)
  }

  // Streak insight
  if (data.spinFrequency.currentStreak > 0) {
    insights.push(`You're on a ${data.spinFrequency.currentStreak}-day spinning streak!`)
  }

  // Consistency insight
  if (data.totalSpins > 10) {
    const consistency = (data.uniqueResults / data.totalSpins) * 100
    if (consistency > 80) {
      insights.push("You're very consistent with your choices - high variety in results")
    } else if (consistency < 50) {
      insights.push("You tend to stick with familiar choices - consider trying new options")
    }
  }

  return insights.slice(0, 5) // Limit to 5 insights
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(d.setDate(diff))
}

export function exportAnalyticsData(analytics: AnalyticsData): string {
  const data = {
    summary: {
      totalSpins: analytics.totalSpins,
      uniqueResults: analytics.uniqueResults,
      dateRange: analytics.spinHistory.length > 0 ? {
        start: analytics.spinHistory[0].timestamp,
        end: analytics.spinHistory[analytics.spinHistory.length - 1].timestamp
      } : null
    },
    topChoices: analytics.mostSelectedOptions,
    patterns: analytics.decisionPatterns,
    insights: analytics.insights
  }

  return JSON.stringify(data, null, 2)
} 