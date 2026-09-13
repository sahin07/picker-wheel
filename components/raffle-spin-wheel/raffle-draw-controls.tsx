"use client"

import { useMemo, useState } from "react"
import { Check, Copy, Download, Lock, QrCode, Share2, Ticket, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DEFAULT_RAFFLE_PRIZE_PLACES,
  RAFFLE_WINNER_COUNT_PRESETS,
  type RaffleWinnerCountPreset,
} from "@/lib/raffle-draw"
import { buildRaffleResultShareUrl } from "@/lib/raffle-share"
import {
  RAFFLE_TICKET_COUNT_MAX,
  RAFFLE_TICKET_COUNT_MIN,
  clampRaffleTicketCount,
  downloadRaffleTextFile,
  raffleDrawsToCsv,
  raffleShareQrUrl,
} from "@/lib/raffle-tickets"
import type { RaffleDrawRecord, RafflePrizePlace } from "@/types/raffle-spin-wheel-types"

type RaffleDrawControlsProps = {
  activeCount: number
  winnerCount: RaffleWinnerCountPreset
  onWinnerCountChange: (count: RaffleWinnerCountPreset) => void
  lockWinners: boolean
  onLockWinnersChange: (value: boolean) => void
  onDraw: () => void
  drawing?: boolean
  drawHistory: RaffleDrawRecord[]
  prizePlaces: RafflePrizePlace[]
  onPrizePlacesChange: (places: RafflePrizePlace[]) => void
  onClearHistory: () => void
  onOpenWinnerScreen: () => void
  onGenerateTickets: (count: number, prefix: string) => void
  onExpandWeightsAsTickets: () => void
  resultTitle?: string
}

export function RaffleDrawControls({
  activeCount,
  winnerCount,
  onWinnerCountChange,
  lockWinners,
  onLockWinnersChange,
  onDraw,
  drawing = false,
  drawHistory,
  prizePlaces,
  onPrizePlacesChange,
  onClearHistory,
  onOpenWinnerScreen,
  onGenerateTickets,
  onExpandWeightsAsTickets,
  resultTitle = "Raffle Results",
}: RaffleDrawControlsProps) {
  const [showPrizes, setShowPrizes] = useState(false)
  const [showTickets, setShowTickets] = useState(false)
  const [ticketCount, setTicketCount] = useState("24")
  const [ticketPrefix, setTicketPrefix] = useState("Ticket")
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const editablePlaces = useMemo(
    () => (prizePlaces.length > 0 ? prizePlaces : DEFAULT_RAFFLE_PRIZE_PLACES).slice(0, 10),
    [prizePlaces],
  )

  const openShare = () => {
    const url = buildRaffleResultShareUrl(resultTitle, drawHistory)
    if (!url) return
    setShareUrl(url)
    setCopied(false)
    setShareOpen(true)
  }

  const copyShareUrl = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const exportCsv = () => {
    if (drawHistory.length === 0) return
    const stamp = new Date().toISOString().slice(0, 10)
    downloadRaffleTextFile(`raffle-winners-${stamp}.csv`, raffleDrawsToCsv(drawHistory))
  }

  return (
    <div className="mb-5 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-700" />
          <p className="text-sm font-semibold text-amber-950">Raffle draw controls</p>
        </div>
        <Badge variant="secondary">{activeCount} in pool</Badge>
      </div>

      <div className="mb-3 space-y-1.5">
        <Label className="text-xs text-slate-600">Winners to draw</Label>
        <div className="flex flex-wrap gap-2">
          {RAFFLE_WINNER_COUNT_PRESETS.map((count) => (
            <Button
              key={count}
              type="button"
              size="sm"
              variant={winnerCount === count ? "default" : "outline"}
              className={
                winnerCount === count
                  ? "bg-amber-700 hover:bg-amber-800"
                  : "border-amber-200 text-amber-900"
              }
              onClick={() => onWinnerCountChange(count)}
            >
              {count}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={lockWinners ? "default" : "outline"}
          className={lockWinners ? "bg-slate-800 hover:bg-slate-900" : ""}
          onClick={() => onLockWinnersChange(!lockWinners)}
        >
          <Lock className="mr-1.5 h-3.5 w-3.5" />
          {lockWinners ? "Lock winners on" : "Lock winners off"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setShowPrizes((v) => !v)}>
          {showPrizes ? "Hide prizes" : "Custom prizes"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setShowTickets((v) => !v)}>
          <Ticket className="mr-1.5 h-3.5 w-3.5" />
          {showTickets ? "Hide tickets" : "Ticket tools"}
        </Button>
        {drawHistory.length > 0 && (
          <>
            <Button type="button" size="sm" variant="outline" onClick={onOpenWinnerScreen}>
              Winner screen
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={openShare}>
              <Share2 className="mr-1.5 h-3.5 w-3.5" />
              Share results
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={exportCsv}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={onClearHistory}>
              Clear history
            </Button>
          </>
        )}
      </div>

      {showPrizes && (
        <div className="mb-3 grid gap-2 rounded-lg border bg-white p-3 sm:grid-cols-2">
          {editablePlaces.map((place, index) => (
            <div key={place.place} className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-xs font-semibold text-slate-500">#{place.place}</span>
              <Input
                value={place.label}
                className="h-8"
                onChange={(event) => {
                  const next = editablePlaces.map((item, i) =>
                    i === index ? { ...item, label: event.target.value } : item,
                  )
                  onPrizePlacesChange(next)
                }}
              />
            </div>
          ))}
        </div>
      )}

      {showTickets && (
        <div className="mb-3 space-y-3 rounded-lg border bg-white p-3">
          <p className="text-xs text-slate-500">
            Build numbered tickets, or expand weights into duplicate slices so every ticket is visible
            on the wheel.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Ticket count</Label>
              <Input
                type="number"
                min={RAFFLE_TICKET_COUNT_MIN}
                max={RAFFLE_TICKET_COUNT_MAX}
                value={ticketCount}
                className="h-8"
                onChange={(event) => setTicketCount(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Prefix</Label>
              <Input
                value={ticketPrefix}
                className="h-8"
                placeholder="Ticket"
                onChange={(event) => setTicketPrefix(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className="bg-amber-700 hover:bg-amber-800"
              onClick={() =>
                onGenerateTickets(clampRaffleTicketCount(Number(ticketCount)), ticketPrefix)
              }
            >
              Generate tickets
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={onExpandWeightsAsTickets}>
              Expand weights as tickets
            </Button>
          </div>
        </div>
      )}

      <Button
        type="button"
        className="w-full bg-amber-700 hover:bg-amber-800 sm:w-auto"
        disabled={drawing || activeCount === 0 || winnerCount > activeCount}
        onClick={onDraw}
      >
        Draw {winnerCount} winner{winnerCount === 1 ? "" : "s"}
      </Button>
      {winnerCount > activeCount && activeCount > 0 && (
        <p className="mt-2 text-xs text-rose-600">
          Need at least {winnerCount} active entrants for this draw.
        </p>
      )}

      {drawHistory.length > 0 && (
        <div className="mt-4 max-h-48 space-y-1.5 overflow-y-auto rounded-lg border bg-white p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Raffle history
          </p>
          {drawHistory.map((draw) => (
            <div
              key={`${draw.drawNumber}-${draw.optionId || draw.name}-${draw.timestamp}`}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="truncate text-slate-800">
                <span className="font-semibold text-amber-800">Draw #{draw.drawNumber}</span>
                {" → "}
                {draw.name}
                {draw.prizeLabel ? (
                  <span className="text-slate-500"> · {draw.prizeLabel}</span>
                ) : null}
              </span>
              {draw.locked ? <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" /> : null}
            </div>
          ))}
        </div>
      )}

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Share raffle results</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            Anyone with this link can view the recorded draw order. It does not include your remaining
            entrant list.
          </p>
          <textarea
            readOnly
            value={shareUrl}
            className="h-28 w-full rounded-md border p-2 text-xs font-mono"
          />
          {shareUrl ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <QrCode className="h-3.5 w-3.5" />
                Scan to open results
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={raffleShareQrUrl(shareUrl)}
                alt="QR code for shared raffle results"
                className="rounded-lg border bg-white"
                width={220}
                height={220}
              />
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button className="bg-amber-700 hover:bg-amber-800" onClick={copyShareUrl}>
              {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer")
              }}
            >
              Open preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
