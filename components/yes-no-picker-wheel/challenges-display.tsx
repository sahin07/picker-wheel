"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Target, Star, Zap, Clock, Calendar, Award, Lock, CheckCircle, 
  TrendingUp, Moon, Sun, Coffee, Heart, Gift, Crown, Flame
} from "lucide-react"
import { Challenge, getChallengeRewards, getRarityColor, getRarityBgColor } from "@/lib/decision-challenges"

interface ChallengesDisplayProps {
  challenges: Challenge[]
  totalSpins: number
  results: { yes: number; no: number; maybe: number }
  streak: { type: string; count: number }
  activeTab: string
  isVisible: boolean
  onClose: () => void
}

export function ChallengesDisplay({ 
  challenges, totalSpins, results, streak, activeTab, isVisible, onClose 
}: ChallengesDisplayProps) {
  const [activeCategory, setActiveCategory] = useState("daily")
  const [showNewlyCompleted, setShowNewlyCompleted] = useState(false)

  const completedChallenges = challenges.filter(c => c.completed)
  const totalPoints = completedChallenges.reduce((sum, c) => sum + c.rewards.points, 0)
  const newlyCompleted = challenges.filter(c => c.completed && c.completedAt && 
    new Date().getTime() - c.completedAt.getTime() < 60000) // Show for 1 minute

  useEffect(() => {
    if (newlyCompleted.length > 0) {
      setShowNewlyCompleted(true)
      const timer = setTimeout(() => setShowNewlyCompleted(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [newlyCompleted])

  const getCategoryChallenges = (category: string) => {
    return challenges.filter(c => c.type === category)
  }

  const getChallengeIcon = (challenge: Challenge) => {
    switch (challenge.category) {
      case "spins": return <Target className="h-4 w-4" />
      case "streaks": return <TrendingUp className="h-4 w-4" />
      case "decisions": return <Award className="h-4 w-4" />
      case "ai": return <Zap className="h-4 w-4" />
      case "time": return <Clock className="h-4 w-4" />
      case "variety": return <Star className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "daily": return <Sun className="h-4 w-4" />
      case "weekly": return <Calendar className="h-4 w-4" />
      case "achievement": return <Crown className="h-4 w-4" />
      case "special": return <Gift className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common": return <Star className="h-3 w-3" />
      case "rare": return <Star className="h-3 w-3" />
      case "epic": return <Flame className="h-3 w-3" />
      case "legendary": return <Crown className="h-3 w-3" />
      default: return <Star className="h-3 w-3" />
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              Decision Challenges
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>Completed: {completedChallenges.length}/{challenges.length}</span>
            <span>Total Points: {totalPoints}</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Newly Completed Notification */}
          {showNewlyCompleted && newlyCompleted.length > 0 && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 m-4 rounded">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">
                  Challenge Completed!
                </span>
              </div>
              <p className="text-green-700 mt-1">
                {newlyCompleted[0].title} - {newlyCompleted[0].rewards.points} points earned!
              </p>
            </div>
          )}

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-4 p-4">
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="achievement" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="special" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Special
              </TabsTrigger>
            </TabsList>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {["daily", "weekly", "achievement", "special"].map(category => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {getCategoryChallenges(category).map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                  {getCategoryChallenges(category).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No {category} challenges available
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )

  function ChallengeCard({ challenge }: { challenge: Challenge }) {
    const progress = (challenge.progress / challenge.maxProgress) * 100
    const rewards = getChallengeRewards(challenge)

    return (
      <Card className={`${getRarityBgColor(challenge.rarity)} border-2 ${
        challenge.completed ? 'border-green-500' : 'border-gray-200'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getChallengeIcon(challenge)}
                <h3 className={`font-semibold ${getRarityColor(challenge.rarity)}`}>
                  {challenge.title}
                </h3>
                {challenge.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
                <Badge variant="outline" className={getRarityColor(challenge.rarity)}>
                  {getRarityIcon(challenge.rarity)}
                  <span className="ml-1 capitalize">{challenge.rarity}</span>
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress: {challenge.progress}/{challenge.maxProgress}</span>
                  <span className={getRarityColor(challenge.rarity)}>
                    {challenge.rewards.points} points
                  </span>
                </div>
                
                <Progress 
                  value={progress} 
                  className="h-2"
                  style={{
                    '--progress-background': challenge.completed ? '#10b981' : '#e5e7eb'
                  } as React.CSSProperties}
                />
              </div>

              {challenge.completed && (
                <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                  <p className="text-sm text-green-800 font-medium">Rewards:</p>
                  <ul className="text-xs text-green-700 mt-1">
                    {rewards.map((reward, index) => (
                      <li key={index}>• {reward}</li>
                    ))}
                  </ul>
                  {challenge.completedAt && (
                    <p className="text-xs text-green-600 mt-2">
                      Completed: {challenge.completedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {challenge.expiresAt && !challenge.completed && (
                <div className="mt-2 text-xs text-gray-500">
                  Expires: {challenge.expiresAt.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
} 