"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  Star, 
  Zap, 
  Clock, 
  Target, 
  Brain, 
  Sparkles, 
  Award,
  Lock,
  CheckCircle,
  TrendingUp,
  Moon,
  Sun,
  Coffee,
  Heart
} from "lucide-react"

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "decision" | "streak" | "time" | "ai" | "special"
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: Date
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
}

interface AchievementsDisplayProps {
  achievements: Achievement[]
  totalSpins: number
  results: { yes: number; no: number; maybe: number }
  streak: { type: string; count: number }
  activeTab: string
  isVisible: boolean
  onClose: () => void
}

const getAchievementIcon = (icon: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    trophy: <Trophy className="h-6 w-6" />,
    star: <Star className="h-6 w-6" />,
    zap: <Zap className="h-6 w-6" />,
    clock: <Clock className="h-6 w-6" />,
    target: <Target className="h-6 w-6" />,
    brain: <Brain className="h-6 w-6" />,
    sparkles: <Sparkles className="h-6 w-6" />,
    award: <Award className="h-6 w-6" />,
    moon: <Moon className="h-6 w-6" />,
    sun: <Sun className="h-6 w-6" />,
    coffee: <Coffee className="h-6 w-6" />,
    heart: <Heart className="h-6 w-6" />,
  }
  return icons[icon] || <Trophy className="h-6 w-6" />
}

const getRarityColor = (rarity: string) => {
  const colors = {
    common: "bg-gray-100 text-gray-800",
    rare: "bg-blue-100 text-blue-800",
    epic: "bg-purple-100 text-purple-800",
    legendary: "bg-yellow-100 text-yellow-800"
  }
  return colors[rarity as keyof typeof colors] || colors.common
}

export function AchievementsDisplay({ 
  achievements, 
  totalSpins, 
  results, 
  streak, 
  activeTab, 
  isVisible, 
  onClose 
}: AchievementsDisplayProps) {
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([])

  // Check for newly unlocked achievements
  useEffect(() => {
    const unlocked = achievements.filter(a => a.unlocked && !newlyUnlocked.includes(a.id))
    if (unlocked.length > 0) {
      setNewlyUnlocked(prev => [...prev, ...unlocked.map(a => a.id)])
      // Auto-clear after 3 seconds
      setTimeout(() => {
        setNewlyUnlocked([])
      }, 3000)
    }
  }, [achievements])

  if (!isVisible) return null

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Achievements
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>🏆 {unlockedCount}/{achievements.length} Unlocked</span>
            <span>⭐ {totalPoints} Points</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          {/* New Achievement Notifications */}
          {newlyUnlocked.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 font-semibold">
                <CheckCircle className="h-5 w-5" />
                New Achievement{newlyUnlocked.length > 1 ? 's' : ''} Unlocked!
              </div>
              <div className="mt-2 space-y-1">
                {achievements
                  .filter(a => newlyUnlocked.includes(a.id))
                  .map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-2 text-sm">
                      {getAchievementIcon(achievement.icon)}
                      <span className="font-medium">{achievement.title}</span>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Achievement Categories */}
          <div className="grid gap-6">
            {/* Decision Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Decision Master
              </h3>
              <div className="grid gap-3">
                {achievements
                  .filter(a => a.category === "decision")
                  .map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
              </div>
            </div>

            {/* Streak Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Streak Champion
              </h3>
              <div className="grid gap-3">
                {achievements
                  .filter(a => a.category === "streak")
                  .map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
              </div>
            </div>

            {/* Time-based Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Master
              </h3>
              <div className="grid gap-3">
                {achievements
                  .filter(a => a.category === "time")
                  .map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
              </div>
            </div>

            {/* AI Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Assistant
              </h3>
              <div className="grid gap-3">
                {achievements
                  .filter(a => a.category === "ai")
                  .map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
              </div>
            </div>

            {/* Special Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Special Events
              </h3>
              <div className="grid gap-3">
                {achievements
                  .filter(a => a.category === "special")
                  .map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100

  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${
      achievement.unlocked 
        ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-md' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${
          achievement.unlocked 
            ? 'bg-gradient-to-r from-green-100 to-blue-100' 
            : 'bg-gray-100'
        }`}>
          {achievement.unlocked ? (
            getAchievementIcon(achievement.icon)
          ) : (
            <Lock className="h-6 w-6 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold ${
              achievement.unlocked ? 'text-gray-900' : 'text-gray-600'
            }`}>
              {achievement.title}
            </h4>
            <Badge className={getRarityColor(achievement.rarity)}>
              {achievement.rarity}
            </Badge>
            {achievement.unlocked && (
              <Badge className="bg-green-100 text-green-800">
                +{achievement.points} pts
              </Badge>
            )}
          </div>
          
          <p className={`text-sm mb-2 ${
            achievement.unlocked ? 'text-gray-700' : 'text-gray-500'
          }`}>
            {achievement.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{achievement.progress}/{achievement.maxProgress}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="mt-2 text-xs text-gray-500">
              Unlocked: {achievement.unlockedAt.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 