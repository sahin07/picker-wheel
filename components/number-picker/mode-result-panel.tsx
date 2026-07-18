"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DICE_PIPS, type ModeResult } from "@/lib/number-picker-mode-results"

interface ModeResultPanelProps {
  result: ModeResult
  /** Recent bingo calls like B12, I23 */
  bingoHistory?: string[]
  resultTitle?: string
}

function DiceFace({ value }: { value: number }) {
  const face = Math.min(6, Math.max(1, value))
  const pips = DICE_PIPS[face] ?? DICE_PIPS[1]
  return (
    <div
      className="relative mx-auto grid h-24 w-24 grid-cols-3 grid-rows-3 gap-1 rounded-2xl border-2 border-slate-800 bg-white p-2 shadow-md"
      aria-label={`Dice showing ${face}`}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3)
        const col = i % 3
        const on = pips.some(([r, c]) => r === row && c === col)
        return (
          <span
            key={i}
            className={`flex items-center justify-center ${on ? "" : "invisible"}`}
          >
            <span className="h-3.5 w-3.5 rounded-full bg-slate-900" />
          </span>
        )
      })}
    </div>
  )
}

export function ModeResultPanel({ result, bingoHistory = [], resultTitle }: ModeResultPanelProps) {
  const [revealAnswer, setRevealAnswer] = useState(false)

  useEffect(() => {
    setRevealAnswer(false)
  }, [result.number, result.variant, result.math?.expression])

  if (result.variant === "bingo") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 to-orange-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Bingo call</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-rose-600 text-2xl font-black text-white shadow">
            {result.bingoLetter}
          </span>
          <span className="text-5xl font-black text-rose-900">{result.number}</span>
        </div>
        <p className="mt-3 text-lg font-semibold text-rose-800">{result.bingoCall}</p>
        <p className="mt-1 text-sm text-rose-700/80">{result.detail}</p>
        {result.remainingLabel && (
          <Badge variant="secondary" className="mt-3">
            {result.remainingLabel}
          </Badge>
        )}
        {bingoHistory.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-rose-700">Recent calls</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {bingoHistory.map((call, i) => (
                <span
                  key={`${call}-${i}`}
                  className="rounded-md bg-white/80 px-2 py-0.5 text-xs font-semibold text-rose-800 ring-1 ring-rose-200"
                >
                  {call}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (result.variant === "dice") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center shadow-lg">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-orange-700">Board game roll</p>
        <DiceFace value={result.number} />
        <h3 className="mt-4 text-xl font-bold text-orange-900">{result.headline}</h3>
        <p className="mt-1 text-sm text-orange-800/80">{result.detail}</p>
      </div>
    )
  }

  if (result.variant === "math") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-cyan-300 bg-gradient-to-br from-cyan-50 to-sky-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Math practice</p>
        <p className="mt-1 text-sm text-cyan-700/80">Spun number: {result.number}</p>
        <h3 className="mt-3 text-2xl font-bold text-cyan-950">{result.math?.prompt}</h3>
        <p className="mt-2 text-sm text-cyan-800/80">{result.hint}</p>
        {!revealAnswer ? (
          <Button
            type="button"
            variant="outline"
            className="mt-4 border-cyan-400 text-cyan-800 hover:bg-cyan-100"
            onClick={() => setRevealAnswer(true)}
          >
            Reveal answer
          </Button>
        ) : (
          <p className="mt-4 text-3xl font-black text-cyan-700">
            {result.math?.answer}
          </p>
        )}
      </div>
    )
  }

  if (result.variant === "fitness") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-lime-400 bg-gradient-to-br from-lime-50 to-green-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-lime-800">Fitness challenge</p>
        <p className="mt-3 text-4xl font-black text-lime-900">{result.number}</p>
        <h3 className="mt-2 text-lg font-bold text-lime-900">{result.headline}</h3>
        <p className="mt-1 text-sm text-lime-800/80">{result.detail}</p>
      </div>
    )
  }

  if (result.variant === "team") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-teal-300 bg-gradient-to-br from-teal-50 to-emerald-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Team assignment</p>
        <div
          className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-black text-white shadow-lg"
          style={{ backgroundColor: result.teamColor }}
        >
          {result.number}
        </div>
        <h3 className="mt-3 text-xl font-bold text-teal-900">{result.headline}</h3>
        <p className="mt-1 text-sm text-teal-800/80">{result.detail}</p>
      </div>
    )
  }

  if (result.variant === "classroom") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-sky-300 bg-gradient-to-br from-sky-50 to-blue-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Classroom</p>
        <h3 className="mt-2 text-3xl font-black text-sky-900">{result.headline}</h3>
        <p className="mt-2 text-base font-medium text-sky-800">{result.detail}</p>
        {result.remainingLabel && (
          <Badge variant="secondary" className="mt-3">
            {result.remainingLabel}
          </Badge>
        )}
      </div>
    )
  }

  if (result.variant === "prize") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Prize drawing</p>
        <h3 className="mt-2 text-2xl font-black text-amber-900">{result.headline}</h3>
        <p className="mt-2 text-base text-amber-800">{result.detail}</p>
        {result.remainingLabel && (
          <Badge variant="secondary" className="mt-3">
            {result.remainingLabel}
          </Badge>
        )}
      </div>
    )
  }

  if (result.variant === "seating") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Seating</p>
        <h3 className="mt-2 text-3xl font-black text-indigo-900">{result.headline}</h3>
        <p className="mt-2 text-sm text-indigo-800/80">{result.detail}</p>
        {result.remainingLabel && (
          <Badge variant="secondary" className="mt-3">
            {result.remainingLabel}
          </Badge>
        )}
      </div>
    )
  }

  if (result.variant === "lucky") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Lucky number</p>
        <p className="mt-3 text-5xl font-black text-yellow-600">{result.number}</p>
        <h3 className="mt-2 text-lg font-bold text-yellow-900">{result.headline}</h3>
        <p className="mt-1 text-sm text-yellow-800/80">{result.detail}</p>
      </div>
    )
  }

  if (result.variant === "fortune") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Fortune number</p>
        <p className="mt-3 text-5xl font-black text-violet-700">{result.number}</p>
        <h3 className="mt-2 text-lg font-bold text-violet-900">{result.headline}</h3>
        <p className="mt-2 text-sm leading-relaxed text-violet-800/90">{result.detail}</p>
        {result.hint && <p className="mt-2 text-xs text-violet-600/70">{result.hint}</p>}
      </div>
    )
  }

  // Fallback
  return (
    <div className="w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center shadow-lg">
      <h3 className="mb-2 text-lg font-semibold text-green-800">
        {resultTitle || result.headline}
      </h3>
      <p className="text-2xl font-bold text-green-900">{result.number}</p>
      <p className="mt-2 text-sm text-green-800/80">{result.detail}</p>
    </div>
  )
}
