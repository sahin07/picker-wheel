"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Trash2 } from "lucide-react"

export type ColorHistoryItem = {
  color: string
  name: string
  hex: string
  rgb: string
  rgba?: string
  timestamp: Date
}

type ColorResultsHistoryProps = {
  results: ColorHistoryItem[]
  isVisible: boolean
  onClose: () => void
  onClear?: () => void
  modeLabel?: string
}

export function ColorResultsHistory({
  results,
  isVisible,
  onClose,
  onClear,
  modeLabel = "Color",
}: ColorResultsHistoryProps) {
  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Color Spin History
          </DialogTitle>
          <DialogDescription>
            Recent spins for {modeLabel} mode ({results.length} recorded).
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2">
          {onClear && results.length > 0 && (
            <Button type="button" variant="outline" size="sm" onClick={onClear}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[50vh] pr-3">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No spins yet — spin the wheel to build history.
            </p>
          ) : (
            <ul className="space-y-2">
              {results.map((item, index) => (
                <li
                  key={`${item.hex}-${index}-${String(item.timestamp)}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-full border border-slate-200 shadow-sm"
                    style={{ backgroundColor: item.color || item.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {item.name || item.hex}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {item.hex}
                      {item.rgb ? ` · rgb(${item.rgb})` : ""}
                      {item.rgba ? ` · ${item.rgba}` : ""}
                    </p>
                  </div>
                  <time className="shrink-0 text-[11px] text-slate-400">
                    {item.timestamp instanceof Date
                      ? item.timestamp.toLocaleTimeString()
                      : new Date(item.timestamp).toLocaleTimeString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
