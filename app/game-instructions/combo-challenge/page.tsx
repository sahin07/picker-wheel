import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Flame, Play, Trophy, Users, CheckCircle, Target, Zap, TrendingUp } from "lucide-react"

import type { Metadata } from "next"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_URL = `${HOME_SITE_URL}/game-instructions/combo-challenge`
const PAGE_TITLE = "Combo Challenge | Picker Wheel Game Instructions"
const PAGE_DESCRIPTION = "Learn Combo Challenge—chain spins for bigger rewards."

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Spinifywheel",
    type: "website",
    images: [{ url: HOME_OG_IMAGE_URL, width: 1200, height: 630, alt: PAGE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [HOME_OG_IMAGE_URL],
  },
}

export default function ComboChallengeInstructionsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-900">Combo Challenge</h1>
          </div>
          <p className="text-xl text-gray-600">Chain spins for massive rewards!</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
              Hard Difficulty
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              +1000 Points
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* How to Play */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-orange-500" />
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>You need at least <strong>3 options</strong> on your wheel</li>
                <li>Click <strong>'Games'</strong> → Select <strong>'Combo Challenge'</strong></li>
                <li>Start spinning to build your <strong>combo multiplier</strong></li>
                <li>Each consecutive spin increases your multiplier:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>1st spin: 1x multiplier</li>
                    <li>2nd spin: 2x multiplier</li>
                    <li>3rd spin: 3x multiplier</li>
                    <li>4th spin: 5x multiplier</li>
                    <li>5th+ spin: 10x multiplier</li>
                  </ul>
                </li>
                <li>Keep spinning to maintain your combo streak</li>
                <li>If you get the same result twice in a row, your combo <strong>breaks</strong></li>
                <li>Try to achieve the highest combo streak for maximum points!</li>
              </ol>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li>Start with a small wheel to increase variety</li>
                <li>Pay attention to your last result to avoid repeats</li>
                <li>Don't rush - think about your next spin</li>
                <li>Use the combo counter to track your progress</li>
                <li>Practice with different wheel sizes</li>
                <li>Focus on maintaining the streak over speed</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Combo System */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Combo System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2">Combo Multipliers</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 1st spin: 1x (10 points)</li>
                    <li>• 2nd spin: 2x (20 points)</li>
                    <li>• 3rd spin: 3x (30 points)</li>
                    <li>• 4th spin: 5x (50 points)</li>
                    <li>• 5th+ spin: 10x (100 points)</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Combo Bonuses</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 5-spin combo: +50 bonus</li>
                    <li>• 10-spin combo: +100 bonus</li>
                    <li>• 15-spin combo: +200 bonus</li>
                    <li>• 20-spin combo: +500 bonus</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <h4 className="font-semibold text-orange-800 mb-2">Combo Breakers</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Same result twice in a row</li>
                    <li>• Taking too long between spins</li>
                    <li>• Missing the spin target</li>
                    <li>• Combo resets to 1x</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">Perfect Combos</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• All different results</li>
                    <li>• No repeated outcomes</li>
                    <li>• Maximum variety bonus</li>
                    <li>• Extra combo points</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              Game Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Example 1: Perfect Combo</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">1</span>
                    <span>Spin 1: Pizza → 10 points (1x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">2</span>
                    <span>Spin 2: Movie → 20 points (2x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">3</span>
                    <span>Spin 3: Book → 30 points (3x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">4</span>
                    <span>Spin 4: Park → 50 points (5x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">5</span>
                    <span>Spin 5: Game → 100 points (10x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs">🏆</span>
                    <span>5-spin combo bonus: +50 points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">→</span>
                    <span>Total: 260 points</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Example 2: Combo Break</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">1</span>
                    <span>Spin 1: Pizza → 10 points (1x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">2</span>
                    <span>Spin 2: Movie → 20 points (2x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs">3</span>
                    <span>Spin 3: Pizza → 10 points (1x) - COMBO BROKEN!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">→</span>
                    <span>Total: 40 points</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Combo Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Beginner Strategy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use 4-6 wheel options</li>
                  <li>• Focus on avoiding repeats</li>
                  <li>• Take your time between spins</li>
                  <li>• Aim for 3-5 spin combos</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Advanced Strategy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use 8+ wheel options</li>
                  <li>• Develop spin patterns</li>
                  <li>• Balance speed and variety</li>
                  <li>• Aim for 10+ spin combos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Game Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Progressive Multipliers
                </h4>
                <p className="text-sm text-gray-600">Each spin increases your point multiplier</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Combo Streaks
                </h4>
                <p className="text-sm text-gray-600">Build and maintain combo chains for bonuses</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Variety Rewards
                </h4>
                <p className="text-sm text-gray-600">Bonus points for different results</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Combo Bonuses
                </h4>
                <p className="text-sm text-gray-600">Extra rewards for milestone combos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Link href="/game-instructions">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </Link>
          <Link href="/">
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Play Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 