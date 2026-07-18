import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { WheelItem } from "@/lib/types"

interface ResultsDialogProps {
  showResults: boolean
  setShowResults: (show: boolean) => void
  results: WheelItem[]
  currentTool: string
}

export function ResultsDialog({ showResults, setShowResults, results, currentTool }: ResultsDialogProps) {
  return (
    <Dialog open={showResults} onOpenChange={setShowResults}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Spin Results History</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No results yet. Spin the wheel!</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  {currentTool === "image" && result.imageUrl && (
                    <img
                      src={result.imageUrl || "/placeholder.svg"}
                      alt={result.text}
                      className="w-8 h-8 object-cover rounded border"
                    />
                  )}
                  <span>{result.text}</span>
                </div>
                <Badge variant="outline">#{results.length - index}</Badge>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
