import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Brain, Play, Trophy, Users, CheckCircle, Clock } from "lucide-react"

export const metadata = {
  title: 'Memory Challenge - Picker Wheel Game Instructions',
  description: 'Learn how to play Memory Challenge mode in our Picker Wheel tool. Remember and find target items before time runs out!',
  keywords: 'picker wheel, memory challenge, memory game, wheel spinner, decision maker, brain training',
}

export default function MemoryChallengeInstructionsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold text-gray-900">Memory Challenge</h1>
          </div>
          <p className="text-xl text-gray-600">Remember and find target items before time runs out</p>
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
                <li>Click <strong>'Games'</strong> → Select <strong>'Memory Challenge'</strong></li>
                <li>The game shows you <strong>3-5 target items</strong> to remember</li>
                <li>You have <strong>60 seconds</strong> to find all target items</li>
                <li>Spin the wheel - if it lands on a target item, it's found</li>
                <li>Find all target items before time runs out to win!</li>
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
                <li>Pay attention to the target items shown at the start</li>
                <li>Focus on finding items quickly - time is limited</li>
                <li>Don't worry about non-target items</li>
                <li>Practice improves memory and speed</li>
                <li>Use fewer wheel options for easier challenges</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Target Items: Pizza, Movie, Park</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin lands on Pizza → Found!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs">✗</span>
                    <span>Spin lands on Book → Not a target, keep spinning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin lands on Movie → Found!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span>Spin lands on Park → Found! All 3 targets collected!</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Time Management</h4>
                <p className="text-sm text-blue-700">You have 60 seconds to find all targets. Watch the timer and focus on speed!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">60-Second Timer</h4>
                <p className="text-sm text-gray-600">Race against time to find all targets</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">3-5 Target Items</h4>
                <p className="text-sm text-gray-600">Variable difficulty based on wheel size</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Memory Training</h4>
                <p className="text-sm text-gray-600">Improve your memory and focus skills</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Score Tracking</h4>
                <p className="text-sm text-gray-600">Track your fastest completion times</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Strategy Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Beginner Strategy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Start with 3-4 wheel options</li>
                  <li>• Take time to memorize targets</li>
                  <li>• Focus on accuracy over speed</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Advanced Strategy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use 5+ wheel options</li>
                  <li>• Quick memorization techniques</li>
                  <li>• Balance speed and accuracy</li>
                </ul>
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