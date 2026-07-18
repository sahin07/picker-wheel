"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy } from "lucide-react"
import { GAME_MODES } from "@/lib/constants"
import type { BingoCard, MemoryChallenge, WheelItem, GameStats } from "@/lib/types"

interface GameStatusBarProps {
  gameMode: string
  isGameActive: boolean
  gameTimer: number
  gameStats: GameStats
  resetGame: () => void
  bingoCard: BingoCard | null
  memoryChallenge: MemoryChallenge | null
  collectionProgress: WheelItem[]
  enabledItems: WheelItem[]
  sequenceTarget: WheelItem[]
  sequenceProgress: WheelItem[]
}

export function GameStatusBar({
  gameMode,
  isGameActive,
  gameTimer,
  gameStats,
  resetGame,
  bingoCard,
  memoryChallenge,
  collectionProgress,
  enabledItems,
  sequenceTarget,
  sequenceProgress,
}: GameStatusBarProps) {
  return (
    <div className="mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {GAME_MODES.find((mode) => mode.id === gameMode)?.name}
              </Badge>
              {isGameActive && gameTimer > 0 && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-lg">
                    {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Streak: {gameStats.currentStreak}</span>
              </div>
            </div>
            <Button variant="outline" onClick={resetGame}>
              Reset Game
            </Button>
          </div>

          {gameMode === "bingo" && bingoCard && (
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <span>Progress: {bingoCard.markedCells.filter(Boolean).length}/9</span>
                {bingoCard.isWinner && (
                  <Badge variant="default" className="bg-green-500">
                    🎉 BINGO! 🎉
                  </Badge>
                )}
              </div>
            </div>
          )}

          {gameMode === "memory" && memoryChallenge && (
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <span>
                  Found: {memoryChallenge.foundImages.length}/{memoryChallenge.targetImages.length}
                </span>
                <span>Score: {memoryChallenge.score}</span>
                {memoryChallenge.isCompleted && (
                  <Badge variant="default" className="bg-green-500">
                    🧠 Perfect Memory! 🧠
                  </Badge>
                )}
              </div>
            </div>
          )}

          {gameMode === "collection" && (
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <span>
                  Collected: {collectionProgress.length}/{enabledItems.length}
                </span>
                <Progress value={(collectionProgress.length / enabledItems.length) * 100} className="w-32" />
                {collectionProgress.length === enabledItems.length && (
                  <Badge variant="default" className="bg-green-500">
                    🌟 Complete! 🌟
                  </Badge>
                )}
              </div>
            </div>
          )}

          {gameMode === "sequence" && (
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <span>
                  Sequence: {sequenceProgress.length}/{sequenceTarget.length}
                </span>
                <Progress value={(sequenceProgress.length / sequenceTarget.length) * 100} className="w-32" />
                {sequenceProgress.length === sequenceTarget.length && (
                  <Badge variant="default" className="bg-green-500">
                    ⚡ Perfect Sequence! ⚡
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
