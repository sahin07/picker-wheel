"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trophy, Lock, CheckCircle, Star, Zap, Crown, Gem } from "lucide-react"
import { Achievement, getAchievementRewards } from "@/lib/picker-wheel-achievements"

interface PickerWheelAchievementsDisplayProps {
  achievements: Achievement[]
  totalPoints: number
  isVisible: boolean
  onClose: () => void
}

export default function PickerWheelAchievementsDisplay({
  achievements,
  totalPoints,
  isVisible,
  onClose
}: PickerWheelAchievementsDisplayProps) {
  const [activeTab, setActiveTab] = useState("unlocked")

  const unlockedAchievements = achievements.filter(a => a.completed)
  const lockedAchievements = achievements.filter(a => !a.completed)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-600'
      case 'epic': return 'text-blue-600'
      case 'rare': return 'text-green-600'
      case 'common': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-purple-50'
      case 'epic': return 'bg-blue-50'
      case 'rare': return 'bg-green-50'
      case 'common': return 'bg-gray-50'
      default: return 'bg-gray-50'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-3 w-3" />
      case 'epic': return <Gem className="h-3 w-3" />
      case 'rare': return <Star className="h-3 w-3" />
      case 'common': return <Trophy className="h-3 w-3" />
      default: return <Trophy className="h-3 w-3" />
    }
  }

  function AchievementCard({ achievement }: { achievement: Achievement }) {
    const progress = (achievement.progress / achievement.maxProgress) * 100
    const rewards = getAchievementRewards(achievement)

    return (
      <Card className={`${getRarityBgColor(achievement.rarity)} border-2 ${
        achievement.completed ? 'border-green-500' : 'border-gray-200'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <h3 className={`font-semibold ${getRarityColor(achievement.rarity)}`}>
                  {achievement.title}
                </h3>
                {achievement.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
                <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                  {getRarityIcon(achievement.rarity)}
                  <span className="ml-1 capitalize">{achievement.rarity}</span>
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress: {achievement.progress}/{achievement.maxProgress}</span>
                  <span className={getRarityColor(achievement.rarity)}>
                    {achievement.points} points
                  </span>
                </div>
                
                <Progress 
                  value={progress} 
                  className="h-2"
                  style={{
                    '--progress-background': achievement.completed ? '#10b981' : '#e5e7eb'
                  } as React.CSSProperties}
                />
              </div>

              {achievement.completed && (
                <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                  <p className="text-sm text-green-800 font-medium">Rewards:</p>
                  <ul className="text-xs text-green-700 mt-1">
                    {rewards.map((reward, index) => (
                      <li key={index}>• {reward}</li>
                    ))}
                  </ul>
                  {achievement.completedAt && (
                    <p className="text-xs text-green-600 mt-2">
                      Completed: {new Date(achievement.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isVisible} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Achievements
            <Badge variant="secondary" className="ml-2">
              {totalPoints} points
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unlocked" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Unlocked ({unlockedAchievements.length})
            </TabsTrigger>
            <TabsTrigger value="locked" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Locked ({lockedAchievements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unlocked" className="space-y-4 mt-4">
            {unlockedAchievements.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No achievements unlocked yet!</p>
                <p className="text-sm">Keep spinning the wheel to unlock achievements.</p>
              </div>
            ) : (
              unlockedAchievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-4 mt-4">
            {lockedAchievements.length === 0 ? (
              <div className="text-center text-green-500 py-8">
                <Trophy className="h-12 w-12 mx-auto mb-4" />
                <p>All achievements unlocked!</p>
                <p className="text-sm">Congratulations on completing all achievements!</p>
              </div>
            ) : (
              lockedAchievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 