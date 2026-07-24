import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, Play, Trophy, Users, CheckCircle, Zap, Timer, Target } from "lucide-react"

import type { Metadata } from "next"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_URL = `${HOME_SITE_URL}/game-instructions/speed-challenge`
const PAGE_TITLE = "Speed Challenge | Picker Wheel Game Instructions"
const PAGE_DESCRIPTION = "Learn Speed Challenge—make decisions under pressure."

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

export default function SpeedChallengeInstructionsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-900">Speed Challenge</h1>
          </div>
          <p className="text-xl text-gray-600">Make decisions under pressure!</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
              Hard Difficulty
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              +500 Points
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
                <li>Click <strong>'Games'</strong> → Select <strong>'Speed Challenge'</strong></li>
                <li>You have <strong>60 seconds</strong> to complete as many spins as possible</li>
                <li>The timer starts immediately when the game begins</li>
                <li>Spin the wheel as fast as you can - <strong>speed matters!</strong></li>
                <li>Each spin awards points based on:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Speed bonus: Faster spins = more points</li>
                    <li>Consistency bonus: Similar results = bonus points</li>
                    <li>Variety bonus: Different results = bonus points</li>
                  </ul>
                </li>
                <li>Try to achieve the highest score before time runs out!</li>
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
                <li>Don't wait for the wheel to stop completely</li>
                <li>Click the spin button immediately after each result</li>
                <li>Focus on speed over accuracy initially</li>
                <li>Use keyboard shortcuts if available</li>
                <li>Practice your clicking rhythm</li>
                <li>Stay calm under pressure - panic slows you down</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Scoring System */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Scoring System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2">Base Points</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Each spin: 10 points</li>
                    <li>• Quick spins (under 2s): +5 bonus</li>
                    <li>• Very quick spins (under 1s): +10 bonus</li>
                    <li>• Ultra quick spins (under 0.5s): +20 bonus</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Consistency Bonus</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 3 similar results: +15 points</li>
                    <li>• 5 similar results: +30 points</li>
                    <li>• 10 similar results: +50 points</li>
                    <li>• Streak multiplier: x1.5</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <h4 className="font-semibold text-orange-800 mb-2">Variety Bonus</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• All different results: +25 points</li>
                    <li>• Perfect variety (no repeats): +50 points</li>
                    <li>• Balanced distribution: +20 points</li>
                    <li>• Exploration bonus: +10 points</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">Time Bonus</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Complete under 30s: +100 points</li>
                    <li>• Complete under 45s: +50 points</li>
                    <li>• No time wasted: +25 points</li>
                    <li>• Efficiency bonus: +15 points</li>
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
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Example 1: Speed Focus</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 1: Pizza (0.8s) → 20 points (10 + 10 bonus)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 2: Movie (0.9s) → 20 points (10 + 10 bonus)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 3: Book (0.7s) → 20 points (10 + 10 bonus)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">→</span>
                    <span>Total after 3 spins: 60 points</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Example 2: Variety Strategy</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 1: Pizza (1.2s) → 15 points (10 + 5 bonus)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 2: Movie (1.1s) → 15 points (10 + 5 bonus)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 3: Book (1.0s) → 15 points (10 + 5 bonus)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs">★</span>
                    <span>Variety bonus: +25 points (all different)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">→</span>
                    <span>Total after 3 spins: 70 points</span>
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
              <Zap className="w-5 h-5 text-yellow-500" />
              Speed Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Beginner Strategy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Focus on completing spins quickly</li>
                  <li>• Don't worry about variety initially</li>
                  <li>• Aim for consistent timing</li>
                  <li>• Practice your clicking speed</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Advanced Strategy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Balance speed with variety</li>
                  <li>• Use keyboard shortcuts</li>
                  <li>• Develop muscle memory</li>
                  <li>• Plan your spin timing</li>
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
                  <Timer className="w-4 h-4 text-red-500" />
                  60-Second Timer
                </h4>
                <p className="text-sm text-gray-600">Race against the clock to maximize your score</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Speed Bonuses
                </h4>
                <p className="text-sm text-gray-600">Faster spins earn bonus points</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Multiple Scoring
                </h4>
                <p className="text-sm text-gray-600">Points for speed, consistency, and variety</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  Real-time Feedback
                </h4>
                <p className="text-sm text-gray-600">See your score and time remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              Performance Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Physical Preparation</h4>
                <p className="text-sm text-gray-600">Warm up your clicking finger and maintain good posture</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Mental Focus</h4>
                <p className="text-sm text-gray-600">Stay focused on the task and avoid distractions</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Equipment</h4>
                <p className="text-sm text-gray-600">Use a responsive mouse and stable internet connection</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Practice</h4>
                <p className="text-sm text-gray-600">Regular practice improves speed and accuracy</p>
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