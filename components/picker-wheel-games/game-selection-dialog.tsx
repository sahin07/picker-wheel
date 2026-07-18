"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, HelpCircle, Play, RotateCcw, Target, Grid3X3, Brain, Star, Zap } from "lucide-react"
import Link from "next/link"

interface GameStats {
  bingoWins: number
  memoryWins: number
  totalSpins: number
  perfectMemoryRounds: number
  fastestMemoryRounds: number
  fastestBingo: number
  currentStreak: number
}

interface GameSelectionDialogProps {
  showGames: boolean
  setShowGames: (show: boolean) => void
  gameStats: GameStats
  gameMode: string
  setGameMode: (mode: string) => void
  resetGame: () => void
}

const GAME_MODES = [
  {
    id: "normal",
    name: "Normal Spin",
    description: "Classic wheel spinning for random decisions",
    icon: Target,
    color: "text-blue-500",
    instructionUrl: "/game-instructions/normal-spin"
  },
  {
    id: "bingo",
    name: "Spin Bingo",
    description: "Mark off items on your bingo card by spinning",
    icon: Grid3X3,
    color: "text-green-500",
    instructionUrl: "/game-instructions/spin-bingo"
  },
  {
    id: "memory",
    name: "Memory Challenge",
    description: "Remember and find target items before time runs out",
    icon: Brain,
    color: "text-purple-500",
    instructionUrl: "/game-instructions/memory-challenge"
  },
  {
    id: "collection",
    name: "Collection Race",
    description: "Collect all unique items as fast as possible",
    icon: Star,
    color: "text-yellow-500",
    instructionUrl: "/game-instructions/collection-race"
  },
  {
    id: "sequence",
    name: "Sequence Match",
    description: "Spin items in the correct order to win",
    icon: Zap,
    color: "text-orange-500",
    instructionUrl: "/game-instructions/sequence-match"
  }
]

export function GameSelectionDialog({
  showGames,
  setShowGames,
  gameStats,
  gameMode,
  setGameMode,
  resetGame,
}: GameSelectionDialogProps) {
  return (
    <Dialog open={showGames} onOpenChange={setShowGames}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Spin Games & Challenges
            </div>
            <Link href="/game-instructions">
              <Button variant="outline" size="sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                How to Play
              </Button>
            </Link>
          </DialogTitle>
        </DialogHeader>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-600">Bingo Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{gameStats.bingoWins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-600">Memory Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{gameStats.memoryWins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-600">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{gameStats.currentStreak}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-600">Total Spins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{gameStats.totalSpins}</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAME_MODES.map((mode) => {
            const Icon = mode.icon
            return (
              <Card
                key={mode.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  gameMode === mode.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className="w-6 h-6 text-blue-600" />
                    <CardTitle className="text-lg">{mode.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{mode.description}</p>
                  
                  <div className="flex items-center justify-between">
                    {gameMode === mode.id ? (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Available
                      </Badge>
                    )}
                    
                    <div className="flex gap-2">
                      <Link href={mode.instructionUrl}>
                        <Button variant="ghost" size="sm"><HelpCircle className="w-3 h-3" /></Button>
                      </Link>
                      <Button size="sm" onClick={() => { setGameMode(mode.id); setShowGames(false); }}>
                        <Play className="w-3 h-3 mr-1" />Play
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center mt-6">
          <Button onClick={resetGame} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Game Stats
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 