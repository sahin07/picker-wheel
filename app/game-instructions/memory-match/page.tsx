import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Brain, Play, Trophy, Users, CheckCircle, Target, Zap, Clock } from "lucide-react"

import type { Metadata } from "next"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_URL = `${HOME_SITE_URL}/game-instructions/memory-match`
const PAGE_TITLE = "Memory Match | Picker Wheel Game Instructions"
const PAGE_DESCRIPTION = "Learn Memory Match—remember and match wheel results."

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

export default function MemoryMatchInstructionsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">Memory Match</h1>
          </div>
          <p className="text-xl text-gray-600">Remember and match wheel results!</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              Expert Difficulty
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              +800 Points
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
                <li>Click <strong>'Games'</strong> → Select <strong>'Memory Match'</strong></li>
                <li>The game shows you a <strong>sequence of 3-5 results</strong> to remember</li>
                <li>Study the sequence carefully - you only see it once!</li>
                <li>Spin the wheel and try to <strong>match the sequence</strong> exactly</li>
                <li>For each correct match in order:
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>1st match: 50 points</li>
                    <li>2nd match: 100 points</li>
                    <li>3rd match: 200 points</li>
                    <li>4th match: 400 points</li>
                    <li>5th match: 800 points</li>
                  </ul>
                </li>
                <li>Complete the entire sequence to win bonus points!</li>
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
                <li>Use mnemonic devices to remember the sequence</li>
                <li>Create a story or pattern from the results</li>
                <li>Focus on the first and last items first</li>
                <li>Practice with shorter sequences initially</li>
                <li>Don't rush - accuracy is more important than speed</li>
                <li>Use visual associations for each result</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Memory Techniques */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Memory Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2">Story Method</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Create a story with the items</li>
                    <li>• Example: "Pizza went to Movie, then to Park"</li>
                    <li>• Visualize the story in your mind</li>
                    <li>• Easy to remember and recall</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Acronym Method</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Create acronyms from first letters</li>
                    <li>• Example: "PMP" for Pizza, Movie, Park</li>
                    <li>• Quick to remember</li>
                    <li>• Good for short sequences</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <h4 className="font-semibold text-orange-800 mb-2">Chunking Method</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Break sequence into smaller chunks</li>
                    <li>• Remember 2-3 items at a time</li>
                    <li>• Combine chunks when recalling</li>
                    <li>• Reduces cognitive load</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-purple-800 mb-2">Visual Method</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Create mental images for each item</li>
                    <li>• Place images in familiar locations</li>
                    <li>• Walk through the location to recall</li>
                    <li>• Very effective for longer sequences</li>
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
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Example 1: Perfect Match</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">📋</span>
                    <span>Target Sequence: Pizza → Movie → Park</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 1: Pizza → Match! (50 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 2: Movie → Match! (100 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 3: Park → Match! (200 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs">🏆</span>
                    <span>Perfect Sequence Bonus: +200 points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">→</span>
                    <span>Total: 550 points</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Example 2: Partial Match</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">📋</span>
                    <span>Target Sequence: Pizza → Movie → Park</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin 1: Pizza → Match! (50 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs">✗</span>
                    <span>Spin 2: Book → Wrong! (0 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs">✗</span>
                    <span>Spin 3: Game → Wrong! (0 points)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">→</span>
                    <span>Total: 50 points</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Levels */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Difficulty Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-2">Beginner</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 3-item sequences</li>
                  <li>• 4-6 wheel options</li>
                  <li>• Longer study time</li>
                  <li>• Basic scoring</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-2">Intermediate</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• 4-item sequences</li>
                  <li>• 6-8 wheel options</li>
                  <li>• Standard study time</li>
                  <li>• Bonus multipliers</li>
                </ul>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <h4 className="font-semibold text-red-800 mb-2">Expert</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• 5-item sequences</li>
                  <li>• 8+ wheel options</li>
                  <li>• Short study time</li>
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
                  <Brain className="w-4 h-4 text-purple-500" />
                  Progressive Scoring
                </h4>
                <p className="text-sm text-gray-600">Each correct match earns more points</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  Study Time
                </h4>
                <p className="text-sm text-gray-600">Limited time to memorize the sequence</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Perfect Bonuses
                </h4>
                <p className="text-sm text-gray-600">Extra points for completing the full sequence</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Brain Training
                </h4>
                <p className="text-sm text-gray-600">Improve memory and cognitive skills</p>
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