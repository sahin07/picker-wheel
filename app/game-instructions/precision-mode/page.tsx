import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Crown, Play, Trophy, Users, CheckCircle, Target, Zap, Crosshair } from "lucide-react"

import type { Metadata } from "next"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_URL = `${HOME_SITE_URL}/game-instructions/precision-mode`
const PAGE_TITLE = "Precision Mode | Picker Wheel Game Instructions"
const PAGE_DESCRIPTION = "Learn Precision Mode—hit specific targets for maximum points."

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

export default function PrecisionModeInstructionsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">Precision Mode</h1>
          </div>
          <p className="text-xl text-gray-600">Hit specific targets for maximum points!</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              Expert Difficulty
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              +750 Points
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* How to Play */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-red-500" />
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>You need at least <strong>4 options</strong> on your wheel</li>
                <li>Click <strong>'Games'</strong> → Select <strong>'Precision Mode'</strong></li>
                <li>The game assigns you <strong>specific targets</strong> to hit</li>
                <li>You have <strong>12-25 spins</strong> to hit all targets</li>
                <li>Each target has different point values:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Easy targets: 25 points</li>
                    <li>Medium targets: 50 points</li>
                    <li>Hard targets: 100 points</li>
                    <li>Expert targets: 200 points</li>
                  </ul>
                </li>
                <li>Hit targets in the correct order for <strong>bonus multipliers</strong></li>
                <li>Complete all targets to win the precision bonus!</li>
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
                <li>Study the target sequence before starting</li>
                <li>Focus on one target at a time</li>
                <li>Use the wheel's visual segments to aim</li>
                <li>Don't rush - precision over speed</li>
                <li>Practice with smaller wheels first</li>
                <li>Learn the wheel's spin patterns</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Target System */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-blue-500" />
              Target System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2">Easy Targets</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Common wheel segments</li>
                    <li>• 25 points each</li>
                    <li>• High probability</li>
                    <li>• Good for beginners</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Medium Targets</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Moderate difficulty</li>
                    <li>• 50 points each</li>
                    <li>• Balanced challenge</li>
                    <li>• Intermediate skill</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <h4 className="font-semibold text-orange-800 mb-2">Hard Targets</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Difficult segments</li>
                    <li>• 100 points each</li>
                    <li>• Low probability</li>
                    <li>• Advanced skill</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <h4 className="font-semibold text-red-800 mb-2">Expert Targets</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Very difficult segments</li>
                    <li>• 200 points each</li>
                    <li>• Very low probability</li>
                    <li>• Expert skill only</li>
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
                <h4 className="font-semibold text-green-800 mb-2">Example 1: Perfect Precision</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">🎯</span>
                    <span>Target Sequence: Pizza (Easy) → Movie (Medium) → Book (Hard)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 1: Pizza → Hit! (25 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 2: Movie → Hit! (50 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 3: Book → Hit! (100 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs">🏆</span>
                    <span>Perfect Precision Bonus: +200 points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">→</span>
                    <span>Total: 375 points</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Example 2: Partial Success</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">🎯</span>
                    <span>Target Sequence: Pizza (Easy) → Movie (Medium) → Book (Hard)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 1: Pizza → Hit! (25 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs">✗</span>
                    <span>Spin 2: Game → Miss! (0 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs">✗</span>
                    <span>Spin 3: Park → Miss! (0 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">→</span>
                    <span>Total: 25 points</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aiming Techniques */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Aiming Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2">Visual Aiming</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Use wheel segments as guides</li>
                    <li>• Count segments from pointer</li>
                    <li>• Visualize the target location</li>
                    <li>• Practice with visual markers</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Timing Method</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Learn wheel spin timing</li>
                    <li>• Count rotations</li>
                    <li>• Use consistent spin force</li>
                    <li>• Develop muscle memory</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <h4 className="font-semibold text-orange-800 mb-2">Pattern Recognition</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Study wheel behavior</li>
                    <li>• Identify spin patterns</li>
                    <li>• Predict landing zones</li>
                    <li>• Adapt to wheel physics</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">Calibration</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Test with known targets</li>
                    <li>• Adjust aim based on results</li>
                    <li>• Fine-tune your technique</li>
                    <li>• Build consistency</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Levels */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-blue-500" />
              Difficulty Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-2">Beginner</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 3 easy targets</li>
                  <li>• 15 spins allowed</li>
                  <li>• Large wheel segments</li>
                  <li>• Basic scoring</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-2">Intermediate</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• 4 mixed targets</li>
                  <li>• 12 spins allowed</li>
                  <li>• Medium wheel segments</li>
                  <li>• Bonus multipliers</li>
                </ul>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <h4 className="font-semibold text-red-800 mb-2">Expert</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• 5 hard targets</li>
                  <li>• 10 spins allowed</li>
                  <li>• Small wheel segments</li>
                  <li>• Maximum bonuses</li>
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
                  <Crosshair className="w-4 h-4 text-red-500" />
                  Target System
                </h4>
                <p className="text-sm text-gray-600">Multiple difficulty levels with different point values</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Precision Bonuses
                </h4>
                <p className="text-sm text-gray-600">Extra points for hitting targets in order</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Crown className="w-4 h-4 text-purple-500" />
                  Skill Progression
                </h4>
                <p className="text-sm text-gray-600">Improve accuracy and precision over time</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Challenge Modes
                </h4>
                <p className="text-sm text-gray-600">Different target arrangements and difficulties</p>
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