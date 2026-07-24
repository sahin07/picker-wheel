import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Gamepad2, Play, Trophy, Users, CheckCircle, Target, Zap, DollarSign } from "lucide-react"

import type { Metadata } from "next"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_URL = `${HOME_SITE_URL}/game-instructions/wheel-roulette`
const PAGE_TITLE = "Wheel Roulette | Picker Wheel Game Instructions"
const PAGE_DESCRIPTION = "Learn Wheel Roulette—bet on wheel outcomes in roulette-style rounds."

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Picker Wheel",
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

export default function WheelRouletteInstructionsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold text-gray-900">Wheel Roulette</h1>
          </div>
          <p className="text-xl text-gray-600">Bet on wheel outcomes and win big!</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              Medium Difficulty
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              +300 Points
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* How to Play */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-purple-500" />
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>You need at least <strong>3 options</strong> on your wheel</li>
                <li>Click <strong>'Games'</strong> → Select <strong>'Wheel Roulette'</strong></li>
                <li>You start with <strong>100 points</strong> to bet with</li>
                <li>Before each spin, <strong>bet points</strong> on specific outcomes</li>
                <li>Choose your <strong>betting strategy</strong>:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Single bet: Bet on one specific outcome</li>
                    <li>Multiple bet: Bet on several outcomes</li>
                    <li>High-risk: Bet more points for bigger rewards</li>
                  </ul>
                </li>
                <li>Spin the wheel - if it lands on your bet, you win <strong>2x points</strong>!</li>
                <li>Continue until you run out of points or reach the target score</li>
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
                <li>Start with small bets to understand the pattern</li>
                <li>Observe which outcomes appear more frequently</li>
                <li>Don't bet all your points at once</li>
                <li>Use the "hot" and "cold" numbers strategy</li>
                <li>Keep track of your betting history</li>
                <li>Set a stop-loss limit to avoid losing everything</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Betting Strategies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Betting Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2">Conservative Strategy</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Bet 10-20% of your points per spin</li>
                    <li>• Focus on high-probability outcomes</li>
                    <li>• Aim for steady, small wins</li>
                    <li>• Best for beginners</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Balanced Strategy</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Bet 25-40% of your points per spin</li>
                    <li>• Mix single and multiple bets</li>
                    <li>• Adapt based on recent results</li>
                    <li>• Good for intermediate players</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <h4 className="font-semibold text-orange-800 mb-2">Aggressive Strategy</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Bet 50-70% of your points per spin</li>
                    <li>• Target low-probability, high-reward outcomes</li>
                    <li>• Use Martingale betting system</li>
                    <li>• High risk, high reward</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">Pattern Recognition</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Track which numbers appear most/least</li>
                    <li>• Bet against "cold" numbers</li>
                    <li>• Follow "hot" number streaks</li>
                    <li>• Advanced strategy for experts</li>
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
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Example 1: Conservative Play</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Start with 100 points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">→</span>
                    <span>Bet 15 points on "Pizza"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Wheel lands on "Pizza" → Win 30 points (2x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Total: 115 points (100 - 15 + 30)</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Example 2: High-Risk Play</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Start with 100 points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs">→</span>
                    <span>Bet 50 points on "Movie"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs">✗</span>
                    <span>Wheel lands on "Book" → Lose 50 points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs">✗</span>
                    <span>Total: 50 points (100 - 50)</span>
                  </div>
                </div>
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
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Starting Points
                </h4>
                <p className="text-sm text-gray-600">Begin with 100 points to bet with</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  2x Multiplier
                </h4>
                <p className="text-sm text-gray-600">Win double your bet on correct predictions</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Multiple Betting Options
                </h4>
                <p className="text-sm text-gray-600">Bet on single or multiple outcomes</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-purple-500" />
                  Risk Management
                </h4>
                <p className="text-sm text-gray-600">Control your betting strategy and risk level</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              Risk Management Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Never Bet Everything</h4>
                <p className="text-sm text-gray-600">Always keep some points in reserve for recovery</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Set Stop-Loss Limits</h4>
                <p className="text-sm text-gray-600">Decide in advance when to stop if you're losing</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Track Your Performance</h4>
                <p className="text-sm text-gray-600">Monitor your win/loss ratio and adjust strategy</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Take Breaks</h4>
                <p className="text-sm text-gray-600">Step away if you're on a losing streak</p>
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