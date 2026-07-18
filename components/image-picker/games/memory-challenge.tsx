import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"
import type { MemoryChallenge as MemoryChallengeType } from "@/lib/types"

interface MemoryChallengeProps {
  memoryChallenge: MemoryChallengeType
  currentTool: string
}

export function MemoryChallenge({ memoryChallenge, currentTool }: MemoryChallengeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Memory Challenge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {memoryChallenge.isActive ? "Memorize these images!" : "Find the images you saw!"}
          </div>
          {memoryChallenge.isActive && (
            <div className="grid grid-cols-3 gap-2">
              {memoryChallenge.targetImages.map((item, index) => (
                <div key={index} className="aspect-square border rounded-lg overflow-hidden">
                  {currentTool === "image" && item.imageUrl ? (
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.text}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-semibold bg-gray-100">
                      {item.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>
              Found: {memoryChallenge.foundImages.length}/{memoryChallenge.targetImages.length}
            </span>
            <span>Score: {memoryChallenge.score}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
