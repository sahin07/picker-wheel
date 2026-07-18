"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { GAME_MODES } from "@/lib/constants"
import { RotateCcw, Clock, Target, Brain, Star, Zap } from "lucide-react"

interface GameStats {
  bingoWins: number
  memoryWins: number
  totalSpins: number
  perfectMemoryRounds: number
  fastestMemoryRounds: number
  fastestBingo: number
  currentStreak: number
}

interface GameStatusBarProps {
  gameMode: string
  isGameActive: boolean
  gameTimer: number
  gameStats: GameStats
  resetGame: () => void
  bingoCard?: any
  memoryChallenge?: any
  collectionProgress?: any[]
  sequenceTarget?: any[]
  sequenceProgress?: any[]
}

export function GameStatusBar({
  gameMode,
  isGameActive,
  gameTimer,
  gameStats,
  resetGame,
  bingoCard,
  memoryChallenge,
  collectionProgress = [],
  sequenceTarget = [],
  sequenceProgress = [],
}: GameStatusBarProps) {
  const getGameIcon = () => {
    switch (gameMode) {
      case "bingo":
        return <Target className="w-4 h-4" />
      case "memory":
        return <Brain className="w-4 h-4" />
      case "collection":
        return <Star className="w-4 h-4" />
      case "sequence":
        return <Zap className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getGameProgress = () => {
    switch (gameMode) {
      case "bingo":
        if (!bingoCard) return null
        const markedCount = bingoCard.markedCells.filter(Boolean).length
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">Bingo Progress:</span>
            <Badge variant="secondary">
              {markedCount}/9 marked
            </Badge>
          </div>
        )
      
      case "memory":
        if (!memoryChallenge) return null
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">Memory Progress:</span>
            <Badge variant="secondary">
              {memoryChallenge.foundOptions.length}/{memoryChallenge.targetOptions.length} found
            </Badge>
          </div>
        )
      
      case "collection":
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">Collection Progress:</span>
            <Badge variant="secondary">
              {collectionProgress.length} collected
            </Badge>
          </div>
        )
      
      case "sequence":
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">Sequence Progress:</span>
            <Badge variant="secondary">
              {sequenceProgress.length}/{sequenceTarget.length} correct
            </Badge>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getGameIcon()}
              <span className="font-medium">
                {GAME_MODES.find((mode) => mode.id === gameMode)?.name}
              </span>
            </div>

            {isGameActive && gameTimer > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-mono">
                  {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, "0")}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span>Streak: {gameStats.currentStreak}</span>
            </div>

            {getGameProgress()}
          </div>

          <Button variant="outline" onClick={resetGame}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Game
          </Button>
        </div>

        {/* Game-specific status */}
        {gameMode === "bingo" && bingoCard && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Bingo Challenge:</strong> Mark off 3 items in a row, column, or diagonal to win!
            </div>
          </div>
        )}

        {gameMode === "memory" && memoryChallenge && (
          <div className="mt-3 p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-800">
              <strong>Memory Challenge:</strong> Remember and find all target items before time runs out!
              {memoryChallenge.timeRemaining > 0 && (
                <span className="ml-2">Time remaining: {memoryChallenge.timeRemaining}s</span>
              )}
            </div>
          </div>
        )}

        {gameMode === "collection" && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
            <div className="text-sm text-yellow-800">
              <strong>Collection Race:</strong> Collect all unique items as fast as possible!
            </div>
          </div>
        )}

        {gameMode === "sequence" && sequenceTarget.length > 0 && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-green-800">
              <strong>Sequence Match:</strong> Spin items in the correct order to win!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 