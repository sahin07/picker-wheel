"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Target,
  Grid3X3,
  Brain,
  Star,
  Zap,
  Gamepad2,
  Flame,
  Clock,
  Crown,
} from "lucide-react"

const GAME_MODES = [
  {
    id: "normal",
    name: "Normal Spin",
    description: "Classic wheel spinning for random decisions",
    icon: Target,
    color: "text-blue-500",
    url: "/game-instructions/normal-spin",
  },
  {
    id: "bingo",
    name: "Spin Bingo",
    description: "Mark off items on your bingo card by spinning",
    icon: Grid3X3,
    color: "text-green-500",
    url: "/game-instructions/spin-bingo",
  },
  {
    id: "memory",
    name: "Memory Challenge",
    description: "Remember and find target items before time runs out",
    icon: Brain,
    color: "text-purple-500",
    url: "/game-instructions/memory-challenge",
  },
  {
    id: "collection",
    name: "Collection Race",
    description: "Collect all unique items as fast as possible",
    icon: Star,
    color: "text-yellow-500",
    url: "/game-instructions/collection-race",
  },
  {
    id: "sequence",
    name: "Sequence Match",
    description: "Spin items in the correct order to win",
    icon: Zap,
    color: "text-orange-500",
    url: "/game-instructions/sequence-match",
  },
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
    points: "+300 points",
  },
  {
    id: "speed",
    name: "Speed Challenge",
    description: "Make decisions under pressure!",
    icon: Clock,
    color: "text-orange-500",
    url: "/game-instructions/speed-challenge",
    difficulty: "Hard",
    points: "+500 points",
  },
  {
    id: "memory-match",
    name: "Memory Match",
    description: "Remember and match wheel results!",
    icon: Brain,
    color: "text-red-500",
    url: "/game-instructions/memory-match",
    difficulty: "Expert",
    points: "+800 points",
  },
  {
    id: "combo",
    name: "Combo Challenge",
    description: "Chain spins for massive rewards!",
    icon: Flame,
    color: "text-orange-500",
    url: "/game-instructions/combo-challenge",
    difficulty: "Hard",
    points: "+1000 points",
  },
  {
    id: "precision",
    name: "Precision Mode",
    description: "Hit specific targets for maximum points!",
    icon: Crown,
    color: "text-red-500",
    url: "/game-instructions/precision-mode",
    difficulty: "Expert",
    points: "+750 points",
  },
]

export default function GameInstructionsHubClient() {
  return (
    <div className="py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Game Instructions</h1>
          <p className="text-xl text-gray-600">Learn how to play each game mode</p>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
            Advanced Game Modes
          </h2>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ADVANCED_GAME_MODES.map((mode) => {
              const Icon = mode.icon
              return (
                <Link key={mode.id} href={mode.url}>
                  <Card className="cursor-pointer border-2 border-gray-200 transition-shadow hover:border-purple-300 hover:shadow-lg">
                    <CardHeader className="text-center">
                      <Icon className={`mx-auto mb-4 h-12 w-12 ${mode.color}`} />
                      <CardTitle className="text-xl">{mode.name}</CardTitle>
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            mode.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : mode.difficulty === "Hard"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {mode.difficulty}
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          {mode.points}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="mb-4 text-gray-600">{mode.description}</p>
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

        <div className="mb-12">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
            Classic Game Modes
          </h2>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {GAME_MODES.map((mode) => {
              const Icon = mode.icon
              return (
                <Link key={mode.id} href={mode.url}>
                  <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                    <CardHeader className="text-center">
                      <Icon className={`mx-auto mb-4 h-12 w-12 ${mode.color}`} />
                      <CardTitle className="text-xl">{mode.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="mb-4 text-gray-600">{mode.description}</p>
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
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Picker Wheel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
