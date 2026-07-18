import { Card, CardContent } from "@/components/ui/card"
import { Zap, Users, Shuffle, Share2, Settings, Download } from "lucide-react"

const features = [
  {
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    title: "Quick & Easy",
    description: "Create custom wheels in seconds. Just add your options and spin!",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: "Perfect for Groups",
    description: "Great for classrooms, meetings, parties, and team activities.",
  },
  {
    icon: <Shuffle className="w-8 h-8 text-green-500" />,
    title: "Truly Random",
    description: "Fair and unbiased results every time with our random algorithm.",
  },
  {
    icon: <Share2 className="w-8 h-8 text-purple-500" />,
    title: "Share Anywhere",
    description: "Share your wheels with friends, students, or colleagues instantly.",
  },
  {
    icon: <Settings className="w-8 h-8 text-gray-500" />,
    title: "Customizable",
    description: "Personalize colors, sounds, and wheel behavior to your liking.",
  },
  {
    icon: <Download className="w-8 h-8 text-red-500" />,
    title: "Save & Load",
    description: "Save your favorite wheels and load them anytime you need.",
  },
]

export default function FeatureSection() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose Picker Wheel?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
