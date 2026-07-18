import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SpinResult } from "@/types/letter-picker"

interface ResultsHistoryProps {
  results: SpinResult[]
}

export function ResultsHistory({ results }: ResultsHistoryProps) {
  if (results.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {results
            .slice(-5)
            .reverse()
            .map((result, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg">{result.letter}</span>
                  {result.challengeCompleted && (
                    <Badge variant="secondary" className="text-xs">
                      {result.wordsFound?.length} words
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {result.timestamp instanceof Date 
                    ? result.timestamp.toLocaleTimeString() 
                    : new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
} 