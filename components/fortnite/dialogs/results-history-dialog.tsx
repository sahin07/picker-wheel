"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, Share2 } from "lucide-react"
import { rarityColors } from "@/lib/rarity-config"
import type { SpinResult } from "@/types/fortnite-types"

interface ResultsHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  results: SpinResult[]
  onClearResults: () => void
}

export function ResultsHistoryDialog({ open, onOpenChange, results, onClearResults }: ResultsHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-800">🏆 Spin Results History</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {results.length === 0 ? (
            <p className="text-center text-gray-500">No results yet. Spin the wheel to get started!</p>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{results.length} spins completed</span>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={onClearResults}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={result.skin.preview || "/placeholder.svg"}
                        alt={result.skin.name}
                        className="w-12 h-12 rounded border"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{result.skin.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{
                              backgroundColor:
                                rarityColors[result.skin.rarity.toLowerCase() as keyof typeof rarityColors],
                            }}
                            className="text-white text-xs"
                          >
                            {result.skin.rarity}
                          </Badge>
                          <span className="text-xs text-gray-500">{result.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
