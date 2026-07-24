import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Grid3X3, Play, Trophy, Users, CheckCircle } from "lucide-react"

import type { Metadata } from "next"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_URL = `${HOME_SITE_URL}/game-instructions/spin-bingo`
const PAGE_TITLE = "Spin Bingo | Picker Wheel Game Instructions"
const PAGE_DESCRIPTION = "Learn Spin Bingo—mark off bingo card items by spinning the picker wheel."

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

export default function SpinBingoInstructionsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Grid3X3 className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl font-bold text-gray-900">Spin Bingo</h1>
          </div>
          <p className="text-xl text-gray-600">Mark off items on your bingo card by spinning</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* How to Play */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-green-500" />
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>You need at least <strong>9 options</strong> on your wheel</li>
                <li>Click <strong>'Games'</strong> → Select <strong>'Spin Bingo'</strong></li>
                <li>A 3x3 bingo card is created with 9 random options</li>
                <li>Spin the wheel - if it lands on a card item, it gets marked</li>
                <li>Get <strong>3 marked items</strong> in a row, column, or diagonal to win!</li>
                <li>Win patterns: horizontal, vertical, or diagonal lines</li>
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
                <li>More wheel options = better variety on bingo card</li>
                <li>Watch for potential winning patterns</li>
                <li>Reset anytime to get a new bingo card</li>
                <li>Track your bingo wins in game statistics</li>
                <li>Use AI-Powered mode to generate diverse options</li>
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
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Bingo Card with Months</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-2 bg-white rounded text-center">Jan</div>
                  <div className="p-2 bg-white rounded text-center">Feb</div>
                  <div className="p-2 bg-white rounded text-center">Mar</div>
                  <div className="p-2 bg-white rounded text-center">Apr</div>
                  <div className="p-2 bg-white rounded text-center">May</div>
                  <div className="p-2 bg-white rounded text-center">Jun</div>
                  <div className="p-2 bg-white rounded text-center">Jul</div>
                  <div className="p-2 bg-white rounded text-center">Aug</div>
                  <div className="p-2 bg-white rounded text-center">Sep</div>
                </div>
                <p className="text-sm text-green-700 mt-2">Winning pattern: Jan-Feb-Mar (first row)</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Another Win Pattern</h4>
                <p className="text-sm text-blue-700">Jan-Apr-Jul (first column) or Jan-May-Sep (diagonal)</p>
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
                <h4 className="font-semibold">3x3 Bingo Card</h4>
                <p className="text-sm text-gray-600">Classic bingo layout with 9 cells</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Multiple Win Patterns</h4>
                <p className="text-sm text-gray-600">Horizontal, vertical, and diagonal wins</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Random Card Generation</h4>
                <p className="text-sm text-gray-600">Each game creates a unique bingo card</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Win Tracking</h4>
                <p className="text-sm text-gray-600">Track your bingo wins and streaks</p>
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