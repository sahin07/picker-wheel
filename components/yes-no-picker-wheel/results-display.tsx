"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain } from "lucide-react"

interface ResultsDisplayProps {
  results: { yes: number; no: number; maybe: number }
  lastResult: string | null
  mode: "yes-no" | "yes-no-maybe"
  activeTab: string
  aiContext: string
  streak: { type: string; count: number }
  showStats: boolean
  totalSpins: number
  optionLabels?: { yes: string; no: string; maybe: string }
}

export function ResultsDisplay({
  results,
  lastResult,
  mode,
  activeTab,
  aiContext,
  streak,
  showStats,
  totalSpins,
  optionLabels = { yes: "YES", no: "NO", maybe: "MAYBE" },
}: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Card
          className={`relative z-30 transform bg-gradient-to-br from-green-500 to-green-600 text-white transition-all duration-300 ${
            lastResult === optionLabels.yes ? "scale-110 shadow-lg shadow-green-500/50" : ""
          }`}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{results.yes}</div>
            <div className="text-sm">{optionLabels.yes}</div>
          </CardContent>
        </Card>

        {mode === "yes-no-maybe" && (
          <Card
            className={`relative z-30 transform bg-gradient-to-br from-gray-500 to-gray-600 text-white transition-all duration-300 ${
              lastResult === optionLabels.maybe ? "scale-110 shadow-lg shadow-gray-500/50" : ""
            }`}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold">{results.maybe}</div>
              <div className="text-sm">{optionLabels.maybe}</div>
            </CardContent>
          </Card>
        )}

        <Card
          className={`relative z-30 transform bg-gradient-to-br from-orange-500 to-orange-600 text-white transition-all duration-300 ${
            lastResult === optionLabels.no ? "scale-110 shadow-lg shadow-orange-500/50" : ""
          }`}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{results.no}</div>
            <div className="text-sm">{optionLabels.no}</div>
          </CardContent>
        </Card>
      </div>

      {lastResult && (
        <div className="text-center">
          <Badge
            variant="secondary"
            className="animate-bounce bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-xl text-white"
          >
            Last Result: {lastResult}
          </Badge>
        </div>
      )}

      {activeTab === "ai" && aiContext && lastResult && (
        <Card className="relative z-30 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-purple-700">
              <Brain className="h-4 w-4" />
              AI Insight for &quot;{lastResult}&quot;
            </h3>
            <p className="text-sm text-purple-600">{aiContext}</p>
          </CardContent>
        </Card>
      )}

      {streak.count > 1 && (
        <div className="text-center">
          <Badge variant="outline" className="border-yellow-400 px-4 py-2 text-lg text-yellow-600">
            {streak.count}x {streak.type} Streak!
          </Badge>
        </div>
      )}

      {showStats && totalSpins > 0 && (
        <Card className="relative z-30 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <h3 className="mb-2 font-semibold">Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Total Spins: {totalSpins}</div>
              <div>
                {optionLabels.yes} Rate: {((results.yes / totalSpins) * 100).toFixed(1)}%
              </div>
              <div>
                {optionLabels.no} Rate: {((results.no / totalSpins) * 100).toFixed(1)}%
              </div>
              {mode === "yes-no-maybe" && (
                <div>
                  {optionLabels.maybe} Rate: {((results.maybe / totalSpins) * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
