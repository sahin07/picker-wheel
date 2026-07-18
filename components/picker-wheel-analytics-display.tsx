"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Target, 
  Download,
  Lightbulb,
  Activity,
  Palette,
  Settings
} from "lucide-react"
import { AnalyticsData, exportAnalyticsData } from "@/lib/picker-wheel-analytics"

interface PickerWheelAnalyticsDisplayProps {
  analytics: AnalyticsData
  isVisible: boolean
  onClose: () => void
}

export default function PickerWheelAnalyticsDisplay({
  analytics,
  isVisible,
  onClose
}: PickerWheelAnalyticsDisplayProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const handleExport = () => {
    const data = exportAnalyticsData(analytics)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wheel-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function StatCard({ title, value, subtitle, icon: Icon }: {
    title: string
    value: string | number
    subtitle?: string
    icon: any
  }) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
            <Icon className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  function TopChoicesChart() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Most Selected Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.mostSelectedOptions.map((item, index) => (
              <div key={item.option} className="flex items-center gap-3">
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{item.option}</span>
                    <span className="text-sm text-gray-600">{item.count} times</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                  <span className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  function TimePatternsChart() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time of Day Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2">
            {analytics.decisionPatterns.timeOfDay.map((item) => (
              <div key={item.hour} className="text-center">
                <div className="text-xs font-medium">{item.hour}:00</div>
                <div className="text-lg font-bold text-blue-600">{item.spins}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  function DayPatternsChart() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Day of Week Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.decisionPatterns.dayOfWeek.map((item) => (
              <div key={item.day} className="flex items-center justify-between">
                <span className="font-medium">{item.day}</span>
                <div className="flex items-center gap-2">
                  <Progress value={(item.spins / Math.max(...analytics.decisionPatterns.dayOfWeek.map(d => d.spins))) * 100} className="w-20 h-2" />
                  <span className="text-sm text-gray-600">{item.spins}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  function ThemeUsageChart() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.themeUsage.slice(0, 5).map((item) => (
              <div key={item.theme} className="flex items-center justify-between">
                <span className="font-medium">{item.theme}</span>
                <div className="flex items-center gap-2">
                  <Progress value={item.percentage} className="w-20 h-2" />
                  <span className="text-sm text-gray-600">{item.usageCount}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  function InsightsSection() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">{insight}</p>
              </div>
            ))}
            {analytics.insights.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Not enough data to generate insights yet. Keep spinning to see personalized insights!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  function StreakSection() {
    const { spinFrequency } = analytics.decisionPatterns
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Spin Frequency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{spinFrequency.currentStreak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{spinFrequency.longestStreak}</div>
              <div className="text-sm text-gray-600">Longest Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{spinFrequency.averageSpinsPerDay}</div>
              <div className="text-sm text-gray-600">Avg/Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{spinFrequency.maxSpinsInDay}</div>
              <div className="text-sm text-gray-600">Max/Day</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              Analytics Dashboard
            </div>
            <Button onClick={handleExport} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Spins"
                value={analytics.totalSpins}
                icon={BarChart3}
              />
              <StatCard
                title="Unique Results"
                value={analytics.uniqueResults}
                subtitle={`${((analytics.uniqueResults / analytics.totalSpins) * 100).toFixed(1)}% variety`}
                icon={Target}
              />
              <StatCard
                title="Current Streak"
                value={analytics.decisionPatterns.spinFrequency.currentStreak}
                subtitle="days"
                icon={TrendingUp}
              />
              <StatCard
                title="Avg Spins/Day"
                value={analytics.decisionPatterns.spinFrequency.averageSpinsPerDay}
                icon={Activity}
              />
            </div>

            {/* Top Choices and Streak */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopChoicesChart />
              <StreakSection />
            </div>

            {/* Insights */}
            <InsightsSection />
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimePatternsChart />
              <DayPatternsChart />
            </div>
            <ThemeUsageChart />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6 mt-6">
            <InsightsSection />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopChoicesChart />
              <StreakSection />
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Weekly Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.weeklyStats.map((week) => (
                    <div key={week.week} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Week of {week.week}</div>
                        <div className="text-sm text-gray-600">
                          {week.spins} spins • {week.uniqueResults} unique results
                        </div>
                      </div>
                      <Badge variant="outline">{week.mostUsedTheme}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.monthlyStats.map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{month.month}</div>
                        <div className="text-sm text-gray-600">
                          {month.spins} spins • {month.uniqueResults} unique results
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {month.averageSpinDuration.toFixed(1)}s avg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 