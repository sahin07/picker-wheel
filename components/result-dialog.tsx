"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NumberResult {
  id: string
  value: number | string
  timestamp: Date
  mode: "normal" | "elimination"
}

interface ResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: NumberResult | null
  resultTitle: string
  /** Optional secondary line (e.g. fortune blurb). */
  resultMessage?: string | null
  /** Override the large display (e.g. bingo "B12"). */
  displayValue?: string | number | null
}

export function ResultDialog({
  open,
  onOpenChange,
  result,
  resultTitle,
  resultMessage,
  displayValue,
}: ResultDialogProps) {
  if (!result) return null

  const shown = displayValue ?? result.value

  const shareResult = () => {
    const text = resultMessage
      ? `${resultTitle}: ${shown} — ${resultMessage}`
      : `${resultTitle}: ${shown}`
    if (navigator.share) {
      navigator.share({
        title: resultTitle,
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const copyResult = () => {
    navigator.clipboard.writeText(String(shown))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl">{resultTitle}</DialogTitle>
        </DialogHeader>

        <div className="py-8">
          <div className="text-6xl font-bold text-blue-600 mb-4">{shown}</div>

          {resultMessage && (
            <p className="mx-auto mb-4 max-w-sm text-sm leading-relaxed text-slate-600">
              {resultMessage}
            </p>
          )}

          <div className="flex justify-center space-x-2 mb-4">
            <Badge variant={result.mode === "elimination" ? "destructive" : "default"}>
              {result.mode === "elimination" ? "Eliminated" : "Normal"}
            </Badge>
            <Badge variant="outline">{(result.timestamp instanceof Date ? result.timestamp : new Date(result.timestamp)).toLocaleTimeString()}</Badge>
          </div>
        </div>

        <div className="flex justify-center space-x-2">
          <Button onClick={shareResult} variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={copyResult} variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 