"use client"

import { useEffect, useState } from "react"
import { Check, Share2, Trophy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { buildRaffleResultShareUrl } from "@/lib/raffle-share"
import type { RaffleDrawRecord } from "@/types/raffle-spin-wheel-types"

type RaffleWinnerScreenProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  draws: RaffleDrawRecord[]
  resultTitle?: string
  fullHistory?: RaffleDrawRecord[]
}

function formatTimestamp(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function RaffleWinnerScreen({
  open,
  onOpenChange,
  draws,
  resultTitle = "Raffle Results",
  fullHistory,
}: RaffleWinnerScreenProps) {
  const [pulse, setPulse] = useState(false)
  const [copied, setCopied] = useState(false)
  const latest = draws[draws.length - 1]
  const multi = draws.length > 1

  useEffect(() => {
    if (!open) return
    setPulse(true)
    const timer = window.setTimeout(() => setPulse(false), 900)
    return () => window.clearTimeout(timer)
  }, [open, latest?.timestamp])

  if (!latest) return null

  const shareHistory = fullHistory && fullHistory.length > 0 ? fullHistory : draws

  const shareResults = async () => {
    const url = buildRaffleResultShareUrl(resultTitle, shareHistory)
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden border-amber-200 bg-gradient-to-b from-amber-50 via-white to-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">Raffle winner</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center px-2 pb-2 pt-4 text-center">
          <div
            className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition-transform duration-700 ${
              pulse ? "scale-110" : "scale-100"
            }`}
          >
            <Trophy className="h-8 w-8" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Winner!</p>
          <h3
            className={`mt-2 font-spin-display text-3xl font-bold text-slate-900 transition-all duration-700 sm:text-4xl ${
              pulse ? "scale-105" : "scale-100"
            }`}
          >
            {latest.name}
          </h3>
          {latest.prizeLabel ? (
            <p className="mt-2 text-base font-medium text-amber-800">{latest.prizeLabel}</p>
          ) : null}
          <p className="mt-2 text-xs text-slate-500">
            Draw #{latest.drawNumber} · {formatTimestamp(latest.timestamp)}
          </p>
        </div>

        {multi && (
          <div className="mx-2 mb-3 max-h-40 space-y-1.5 overflow-y-auto rounded-lg border bg-white p-3 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              This draw batch
            </p>
            {draws.map((draw) => (
              <div key={`${draw.drawNumber}-${draw.timestamp}`} className="text-sm text-slate-700">
                <span className="font-semibold text-amber-800">#{draw.drawNumber}</span> {draw.name}
                {draw.prizeLabel ? <span className="text-slate-500"> — {draw.prizeLabel}</span> : null}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 pb-2">
          <Button className="bg-amber-700 hover:bg-amber-800" onClick={() => onOpenChange(false)}>
            Continue raffle
          </Button>
          <Button variant="outline" onClick={shareResults}>
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
            {copied ? "Link copied" : "Share results"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
