import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Zap, Play, Trophy, Users, CheckCircle, AlertTriangle } from "lucide-react"

export const metadata = {
  title: 'Sequence Match - Picker Wheel Game Instructions',
  description: 'Learn how to play Sequence Match mode in our Picker Wheel tool. Spin items in the correct order to win!',
  keywords: 'picker wheel, sequence match, sequence game, wheel spinner, decision maker, pattern matching',
}

export default function SequenceMatchInstructionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-900">Sequence Match</h1>
          </div>
          <p className="text-xl text-gray-600">Spin items in the correct order to win</p>
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
                <li>Click <strong>'Games'</strong> → Select <strong>'Sequence Match'</strong></li>
                <li>The game creates a target sequence of <strong>3-5 items</strong></li>
                <li>You must spin items in the exact order shown</li>
                <li>Spin the wheel - if it matches the next item in sequence, progress!</li>
                <li>Complete the entire sequence in order to win!</li>
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
                <li>Memorize the target sequence carefully</li>
                <li>One wrong spin = game over</li>
                <li>Focus on the next item you need</li>
                <li>Practice with shorter sequences first</li>
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
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Target Sequence: Apple → Banana → Orange</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">1</span>
                    <span>Spin 1: Apple → Correct! (1/3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">2</span>
                    <span>Spin 2: Banana → Correct! (2/3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">3</span>
                    <span>Spin 3: Orange → Correct! (3/3) → WIN!</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">What Happens If You Make a Mistake</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">1</span>
                    <span>Spin 1: Apple → Correct! (1/3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs">✗</span>
                    <span>Spin 2: Grape → Wrong! Expected Banana → GAME OVER</span>
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
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">3-5 Item Sequences</h4>
                <p className="text-sm text-gray-600">Variable difficulty based on wheel size</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Exact Order Required</h4>
                <p className="text-sm text-gray-600">No mistakes allowed - precision matters</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Memory Challenge</h4>
                <p className="text-sm text-gray-600">Test your memory and focus skills</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Progressive Difficulty</h4>
                <p className="text-sm text-gray-600">Longer sequences = harder challenges</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Strategy Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Beginner Strategy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Start with 3-item sequences</li>
                  <li>• Take time to memorize</li>
                  <li>• Focus on accuracy</li>
                  <li>• Use mnemonic devices</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Advanced Strategy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Try 4-5 item sequences</li>
                  <li>• Quick memorization</li>
                  <li>• Pattern recognition</li>
                  <li>• Speed and accuracy balance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Techniques */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Memory Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Visual Association</h4>
                <p className="text-sm text-gray-600">Create mental images connecting the items</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Story Method</h4>
                <p className="text-sm text-gray-600">Create a story using all the items in order</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Acronym Creation</h4>
                <p className="text-sm text-gray-600">Use first letters to create a word</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Repetition</h4>
                <p className="text-sm text-gray-600">Repeat the sequence mentally</p>
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