"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Target, Grid3X3, Brain, Star, Zap, Gamepad2, Flame, Clock, Crown } from "lucide-react"

const GAME_MODES = [
  {
    id: "normal",
    name: "Normal Spin",
    description: "Classic wheel spinning for random decisions",
    icon: Target,
    color: "text-blue-500",
    url: "/game-instructions/normal-spin"
  },
  {
    id: "bingo",
    name: "Spin Bingo",
    description: "Mark off items on your bingo card by spinning",
    icon: Grid3X3,
    color: "text-green-500",
    url: "/game-instructions/spin-bingo"
  },
  {
    id: "memory",
    name: "Memory Challenge",
    description: "Remember and find target items before time runs out",
    icon: Brain,
    color: "text-purple-500",
    url: "/game-instructions/memory-challenge"
  },
  {
    id: "collection",
    name: "Collection Race",
    description: "Collect all unique items as fast as possible",
    icon: Star,
    color: "text-yellow-500",
    url: "/game-instructions/collection-race"
  },
  {
    id: "sequence",
    name: "Sequence Match",
    description: "Spin items in the correct order to win",
    icon: Zap,
    color: "text-orange-500",
    url: "/game-instructions/sequence-match"
  }
]

const ADVANCED_GAME_MODES = [
  {
    id: "roulette",
    name: "Wheel Roulette",
    description: "Bet on wheel outcomes and win big!",
    icon: Gamepad2,
    color: "text-purple-500",
    url: "/game-instructions/wheel-roulette",
    difficulty: "Medium",
    points: "+300 points"
  },
  {
    id: "speed",
    name: "Speed Challenge",
    description: "Make decisions under pressure!",
    icon: Clock,
    color: "text-orange-500",
    url: "/game-instructions/speed-challenge",
    difficulty: "Hard",
    points: "+500 points"
  },
  {
    id: "memory-match",
    name: "Memory Match",
    description: "Remember and match wheel results!",
    icon: Brain,
    color: "text-red-500",
    url: "/game-instructions/memory-match",
    difficulty: "Expert",
    points: "+800 points"
  },
  {
    id: "combo",
    name: "Combo Challenge",
    description: "Chain spins for massive rewards!",
    icon: Flame,
    color: "text-orange-500",
    url: "/game-instructions/combo-challenge",
    difficulty: "Hard",
    points: "+1000 points"
  },
  {
    id: "precision",
    name: "Precision Mode",
    description: "Hit specific targets for maximum points!",
    icon: Crown,
    color: "text-red-500",
    url: "/game-instructions/precision-mode",
    difficulty: "Expert",
    points: "+750 points"
  }
]

export default function GameInstructionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Game Instructions</h1>
          <p className="text-xl text-gray-600">Learn how to play each game mode</p>
        </div>

        {/* Advanced Game Modes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Advanced Game Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {ADVANCED_GAME_MODES.map((mode) => {
              const Icon = mode.icon
              return (
                <Link key={mode.id} href={mode.url}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 hover:border-purple-300">
                    <CardHeader className="text-center">
                      <Icon className={`w-12 h-12 mx-auto mb-4 ${mode.color}`} />
                      <CardTitle className="text-xl">{mode.name}</CardTitle>
                      <div className="flex items-center justify-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          mode.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          mode.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {mode.difficulty}
                        </span>
                        <span className="text-sm text-green-600 font-semibold">{mode.points}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 mb-4">{mode.description}</p>
                      <Button variant="outline" className="w-full">
                        How to Play
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Classic Game Modes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Classic Game Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {GAME_MODES.map((mode) => {
              const Icon = mode.icon
              return (
                <Link key={mode.id} href={mode.url}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <Icon className={`w-12 h-12 mx-auto mb-4 ${mode.color}`} />
                      <CardTitle className="text-xl">{mode.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 mb-4">{mode.description}</p>
                      <Button variant="outline" className="w-full">
                        Click to view
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Picker Wheel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 