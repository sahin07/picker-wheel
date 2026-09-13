"use client"

import Link from "next/link"
import { Trophy } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RAFFLE_SPIN_WHEEL_PATH } from "@/lib/raffle-spin-wheel-seo"
import type { RaffleSharedResult } from "@/lib/raffle-share"

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

export function RaffleResultView({
  result,
  onOpenSettings,
}: {
  result: RaffleSharedResult
  onOpenSettings?: () => void
}) {
  const latest = result.draws[result.draws.length - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header onOpenSettings={onOpenSettings} />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <Badge className="mb-3 bg-amber-700 text-white hover:bg-amber-700">Shared raffle results</Badge>
          <h1 className="font-spin-display text-3xl font-bold text-slate-900 sm:text-4xl">
            {result.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Published {formatTimestamp(result.createdAt)} · {result.draws.length} winner
            {result.draws.length === 1 ? "" : "s"}
          </p>
        </div>

        {latest && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white">
              <Trophy className="h-7 w-7" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Latest winner
            </p>
            <p className="mt-2 font-spin-display text-3xl font-bold text-slate-900">{latest.name}</p>
            {latest.prizeLabel ? (
              <p className="mt-1 font-medium text-amber-800">{latest.prizeLabel}</p>
            ) : null}
            <p className="mt-2 text-xs text-slate-500">
              Draw #{latest.drawNumber} · {formatTimestamp(latest.timestamp)}
            </p>
          </div>
        )}

        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-spin-display text-xl font-bold text-slate-900">Full draw order</h2>
          <ol className="space-y-2">
            {result.draws.map((draw) => (
              <li
                key={`${draw.drawNumber}-${draw.timestamp}-${draw.name}`}
                className="flex items-start justify-between gap-3 rounded-lg border border-amber-100 bg-amber-50/40 px-3 py-2.5"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    <span className="text-amber-800">#{draw.drawNumber}</span> {draw.name}
                  </p>
                  {draw.prizeLabel ? (
                    <p className="text-sm text-amber-800">{draw.prizeLabel}</p>
                  ) : null}
                </div>
                <p className="shrink-0 text-xs text-slate-500">{formatTimestamp(draw.timestamp)}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button className="bg-amber-700 hover:bg-amber-800" asChild>
            <Link href={RAFFLE_SPIN_WHEEL_PATH}>Run your own raffle</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          This page is a snapshot of draw outcomes. It does not re-spin or change the recorded winners.
        </p>
      </main>
      <Footer />
    </div>
  )
}
