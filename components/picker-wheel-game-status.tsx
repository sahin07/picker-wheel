"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Gamepad2, 
  Timer, 
  Target, 
  Trophy, 
  X,
  Play,
  Pause,
  RotateCcw
} from "lucide-react"
import { GameSession } from "@/lib/picker-wheel-game-session"

interface PickerWheelGameStatusProps {
  session: GameSession | null
  onEndGame: () => void
  onRestartGame?: () => void
  onPauseGame?: () => void
  onResumeGame?: () => void
}

export default function PickerWheelGameStatus({
  session,
  onEndGame,
  onRestartGame,
  onPauseGame,
  onResumeGame
}: PickerWheelGameStatusProps) {
  if (!session) return null

  const progress = (session.currentSpin / session.totalSpins) * 100
  const isComplete = !session.isActive

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getGameModeIcon = (gameModeId: string) => {
    switch (gameModeId) {
      case 'roulette':
      case 'wheel-roulette': return '🎰'
      case 'speed':
      case 'speed-challenge': return '⚡'
      case 'memory':
      case 'memory-match': return '🧠'
      case 'combo':
      case 'combo-challenge': return '🔥'
      case 'precision':
      case 'precision-mode': return '🎯'
      default: return '🎮'
    }
  }

  return (
    <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getGameModeIcon(session.gameMode.id)}</div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {session.gameMode.name}
                <Badge variant={isComplete ? "outline" : "default"}>
                  {isComplete ? "Complete" : "Active"}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">{session.gameMode.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {session.isActive && (
              <>
                {onPauseGame && (
                  <Button size="sm" variant="outline" onClick={onPauseGame}>
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={onEndGame}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{session.currentSpin}/{session.totalSpins}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-600">
              {Math.round(progress)}% complete
            </div>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {session.score}
            </div>
            <div className="text-xs text-gray-600">Total Score</div>
          </div>

          {/* Time Remaining */}
          {session.timeRemaining !== undefined && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Timer className="h-4 w-4 text-orange-500" />
                <span className="text-lg font-mono">
                  {formatTime(session.timeRemaining)}
                </span>
              </div>
              <div className="text-xs text-gray-600">Time Left</div>
            </div>
          )}

          {/* Current Spin */}
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              #{session.currentSpin + 1}
            </div>
            <div className="text-xs text-gray-600">Next Spin</div>
          </div>
        </div>

        {/* Recent Results */}
        {session.results.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Recent Results</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {session.results.slice(-5).map((result, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-white rounded border text-xs"
                >
                  <span className="font-medium">{result.result}</span>
                  <span className="text-green-600">+{result.points}</span>
                  {result.bonus && (
                    <span className="text-orange-600">+{result.bonus}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Complete Message */}
        {isComplete && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">Game Complete!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Final Score: {session.score} points
            </p>
            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={onRestartGame || onEndGame}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 