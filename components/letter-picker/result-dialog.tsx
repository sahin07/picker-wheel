"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share } from "lucide-react"
import type { SpinResult } from "@/types/letter-picker"

interface ResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentResult: string
  lastResult?: SpinResult
}

export function ResultDialog({ open, onOpenChange, currentResult, lastResult }: ResultDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Result</DialogTitle>
        </DialogHeader>
        <div className="text-center py-8">
          <div className="text-6xl font-bold text-green-600 mb-4">{currentResult}</div>
          <p className="text-gray-600">Selected Letter</p>
          {lastResult?.challengeCompleted && (
            <div className="mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Challenge Completed! 🎉
              </Badge>
              <p className="text-sm text-gray-600 mt-2">Found {lastResult.wordsFound?.length} words</p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={() => onOpenChange(false)}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 