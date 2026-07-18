"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Trophy } from "lucide-react"

interface ResultsDisplayProps {
  results: { yes: number; no: number; maybe: number }
  lastResult: string | null
  mode: "yes-no" | "yes-no-maybe"
  activeTab: string
  aiContext: string
  streak: { type: string; count: number }
  achievements: (string | { title: string; description?: string; icon?: string; progress?: number; maxProgress?: number; unlocked?: boolean })[]
  showStats: boolean
  totalSpins: number
}

export function ResultsDisplay({
  results,
  lastResult,
  mode,
  activeTab,
  aiContext,
  streak,
  achievements,
  showStats,
  totalSpins,
}: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Results with animations */}
      <div className="flex space-x-4">
        <Card
          className={`relative z-30 bg-gradient-to-br from-green-500 to-green-600 text-white transform transition-all duration-300 ${lastResult === "YES" ? "scale-110 shadow-lg shadow-green-500/50" : ""}`}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{results.yes}</div>
            <div className="text-sm">YES</div>
          </CardContent>
        </Card>

        {mode === "yes-no-maybe" && (
          <Card
            className={`relative z-30 bg-gradient-to-br from-gray-500 to-gray-600 text-white transform transition-all duration-300 ${lastResult === "MAYBE" ? "scale-110 shadow-lg shadow-gray-500/50" : ""}`}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold">{results.maybe}</div>
              <div className="text-sm">MAYBE</div>
            </CardContent>
          </Card>
        )}

        <Card
          className={`relative z-30 bg-gradient-to-br from-orange-500 to-orange-600 text-white transform transition-all duration-300 ${lastResult === "NO" ? "scale-110 shadow-lg shadow-orange-500/50" : ""}`}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{results.no}</div>
            <div className="text-sm">NO</div>
          </CardContent>
        </Card>
      </div>

      {/* Last Result with celebration */}
      {lastResult && (
        <div className="text-center">
          <Badge
            variant="secondary"
            className={`text-xl px-6 py-3 animate-bounce text-white ${
              activeTab === "ai"
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-gradient-to-r from-purple-500 to-pink-500"
            }`}
          >
            🎉 Last Result: {lastResult} 🎉
          </Badge>
        </div>
      )}

      {/* AI Context Display */}
      {activeTab === "ai" && aiContext && lastResult && (
        <Card className="relative z-30 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-purple-700">
              <Brain className="h-4 w-4" />
              AI Insight for "{lastResult}"
            </h3>
            <p className="text-sm text-purple-600">{aiContext}</p>
          </CardContent>
        </Card>
      )}

      {/* Streak Display */}
      {streak.count > 1 && (
        <div className="text-center">
          <Badge variant="outline" className="text-lg px-4 py-2 border-yellow-400 text-yellow-600">
            🔥 {streak.count}x {streak.type} Streak!
          </Badge>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card className="relative z-30 bg-gradient-to-r from-yellow-100 to-orange-100">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              Achievements Unlocked!
            </h3>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary" className="bg-yellow-200 text-yellow-800">
                  {typeof achievement === 'string' ? achievement : achievement.title || 'Achievement'}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {showStats && totalSpins > 0 && (
        <Card className="relative z-30 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">📊 Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Total Spins: {totalSpins}</div>
              <div>Yes Rate: {((results.yes / totalSpins) * 100).toFixed(1)}%</div>
              <div>No Rate: {((results.no / totalSpins) * 100).toFixed(1)}%</div>
              {mode === "yes-no-maybe" && <div>Maybe Rate: {((results.maybe / totalSpins) * 100).toFixed(1)}%</div>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 