import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Star, Play, Trophy, Users, CheckCircle, Timer } from "lucide-react"

import type { Metadata } from "next"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_URL = `${HOME_SITE_URL}/game-instructions/collection-race`
const PAGE_TITLE = "Collection Race | Picker Wheel Game Instructions"
const PAGE_DESCRIPTION = "Learn Collection Race—collect all unique wheel items as fast as possible."

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

export default function CollectionRaceInstructionsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">Collection Race</h1>
          </div>
          <p className="text-xl text-gray-600">Collect all unique items as fast as possible</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* How to Play */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-yellow-500" />
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Add your options to the wheel</li>
                <li>Click <strong>'Games'</strong> → Select <strong>'Collection Race'</strong></li>
                <li>Spin the wheel to collect items</li>
                <li>Each unique item you land on gets added to your collection</li>
                <li>Collect all unique items to win!</li>
                <li>No time limit - focus on efficiency</li>
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
                <li>More wheel options = longer collection time</li>
                <li>Try to remember which items you've already collected</li>
                <li>No penalty for landing on the same item multiple times</li>
                <li>Perfect for learning all your options</li>
                <li>Use this mode to explore your wheel thoroughly</li>
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
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Wheel has: Red, Blue, Green, Yellow, Purple</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">1</span>
                    <span>Spin 1: Red → Collected (1/5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs">-</span>
                    <span>Spin 2: Red → Already collected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">2</span>
                    <span>Spin 3: Blue → Collected (2/5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">3</span>
                    <span>Spin 4: Green → Collected (3/5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">4</span>
                    <span>Spin 5: Yellow → Collected (4/5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs">5</span>
                    <span>Spin 6: Purple → Collected (5/5) → WIN!</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Strategy Tip</h4>
                <p className="text-sm text-blue-700">Keep track of your progress. The game shows how many items you've collected out of the total.</p>
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
                <h4 className="font-semibold">No Time Limit</h4>
                <p className="text-sm text-gray-600">Take your time to collect all items</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Progress Tracking</h4>
                <p className="text-sm text-gray-600">See how many items you've collected</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Duplicate Protection</h4>
                <p className="text-sm text-gray-600">No penalty for landing on same item</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Wheel Exploration</h4>
                <p className="text-sm text-gray-600">Perfect way to discover all your options</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-orange-500" />
              Strategy Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">For Small Wheels (3-5 items)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Quick completion</li>
                  <li>• Good for beginners</li>
                  <li>• Easy to track progress</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">For Large Wheels (6-10 items)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Longer challenge</li>
                  <li>• More variety</li>
                  <li>• Better for exploration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Perfect For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Learning Your Options</h4>
                <p className="text-sm text-gray-600">Discover all the items on your wheel</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Relaxed Gaming</h4>
                <p className="text-sm text-gray-600">No pressure, just collection fun</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Wheel Testing</h4>
                <p className="text-sm text-gray-600">Test new wheel configurations</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Family Fun</h4>
                <p className="text-sm text-gray-600">Great for all ages and skill levels</p>
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