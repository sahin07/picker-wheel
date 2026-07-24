import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Target, Play, Trophy, Users, CheckCircle } from "lucide-react"

import type { Metadata } from "next"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_URL = `${HOME_SITE_URL}/game-instructions/normal-spin`
const PAGE_TITLE = "Normal Spin | Picker Wheel Game Instructions"
const PAGE_DESCRIPTION = "Learn how to play Normal Spin mode—classic wheel spinning for random decisions with text and image options."

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

export default function NormalSpinInstructionsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900">Normal Spin</h1>
          </div>
          <p className="text-xl text-gray-600">Classic wheel spinning for random decisions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* How to Play */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-500" />
                How to Play
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Add your options to the wheel (text or images)</li>
                <li>Click <strong>'SPIN THE WHEEL'</strong> to spin</li>
                <li>The wheel will randomly select one option</li>
                <li>View your result and spin history</li>
                <li>Perfect for making quick decisions!</li>
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
                <li>Use AI-Powered mode to generate options quickly</li>
                <li>Add up to 10 options for variety</li>
                <li>Enable sound effects for more excitement</li>
                <li>Use templates for common scenarios</li>
                <li>Save your favorite wheel configurations</li>
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
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Choosing Lunch</h4>
                <p className="text-sm text-blue-700">Pizza, Burger, Salad, Sushi, Tacos</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Picking Activities</h4>
                <p className="text-sm text-green-700">Movie, Park, Museum, Shopping, Hiking</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Deciding Dinner</h4>
                <p className="text-sm text-purple-700">Italian, Chinese, Mexican, Indian, Thai</p>
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
                <h4 className="font-semibold">Text & Image Support</h4>
                <p className="text-sm text-gray-600">Add both text options and images to your wheel</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Spin History</h4>
                <p className="text-sm text-gray-600">Track all your previous spins and results</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Customizable Settings</h4>
                <p className="text-sm text-gray-600">Adjust spin speed, sound effects, and appearance</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Multiple Wheels</h4>
                <p className="text-sm text-gray-600">Create and switch between different wheel configurations</p>
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