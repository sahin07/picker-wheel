import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import type { WheelItem } from "@/lib/types"

interface SequenceMatchProps {
  sequenceTarget: WheelItem[]
  sequenceProgress: WheelItem[]
  currentTool: string
}

export function SequenceMatch({ sequenceTarget, sequenceProgress, currentTool }: SequenceMatchProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Sequence Match
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">Spin in this order:</div>
          <div className="flex space-x-2 overflow-x-auto">
            {sequenceTarget.map((item, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden ${
                  index < sequenceProgress.length
                    ? "border-green-500 bg-green-100"
                    : index === sequenceProgress.length
                      ? "border-yellow-500 bg-yellow-100"
                      : "border-gray-300"
                }`}
              >
                {currentTool === "image" && item.imageUrl ? (
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.text}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-semibold">
                    {item.text}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-sm">
            Progress: {sequenceProgress.length}/{sequenceTarget.length}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
