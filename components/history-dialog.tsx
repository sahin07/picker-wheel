"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Download, Share2 } from "lucide-react"

interface NumberResult {
  id: string
  value: number | string
  timestamp: Date
  mode: "normal" | "elimination"
}

interface HistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  results: NumberResult[]
  onClearResults: () => void
}

export function HistoryDialog({ open, onOpenChange, results, onClearResults }: HistoryDialogProps) {
  const downloadResults = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Result,Mode,Timestamp\n" +
      results.map((r) => `${r.value},${r.mode},${r.timestamp.toISOString()}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "number_picker_results.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareResults = () => {
    const text = `Number Picker Results:\n${results.map((r) => `${r.value} (${r.mode})`).join(", ")}`
    if (navigator.share) {
      navigator.share({
        title: "Number Picker Results",
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Results History ({results.length} results)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button onClick={downloadResults} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
              <Button onClick={shareResults} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            <Button onClick={onClearResults} variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-2">
              {results.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No results yet. Spin the wheel to see your history!
                </p>
              ) : (
                results
                  .slice()
                  .reverse()
                  .map((result, index) => (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl font-bold text-blue-600">{result.value}</div>
                        <div className="space-y-1">
                          <Badge variant={result.mode === "elimination" ? "destructive" : "default"}>
                            {result.mode}
                          </Badge>
                          <div className="text-xs text-muted-foreground">{result.timestamp.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">#{results.length - index}</div>
                    </div>
                  ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
} 