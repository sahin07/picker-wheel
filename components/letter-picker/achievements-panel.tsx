import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy } from "lucide-react"
import type { Achievement } from "@/types/letter-picker"

interface AchievementsPanelProps {
  achievements: Achievement[]
  /** Cap list length; omit or pass 0 to show all */
  maxItems?: number
}

export function AchievementsPanel({ achievements, maxItems = 3 }: AchievementsPanelProps) {
  const list = maxItems > 0 ? achievements.slice(0, maxItems) : achievements

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {list.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3">
              <div className={`text-2xl ${achievement.unlocked ? "grayscale-0" : "grayscale"}`}>{achievement.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{achievement.title}</div>
                <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 