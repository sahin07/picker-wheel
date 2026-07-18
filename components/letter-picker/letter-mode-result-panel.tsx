"use client"

import { Badge } from "@/components/ui/badge"
import type { LetterModeResult } from "@/lib/letter-picker-mode-results"

interface LetterModeResultPanelProps {
  result: LetterModeResult
  mysteryHidden?: boolean
}

function LetterHero({
  letter,
  accentClass,
}: {
  letter: string
  accentClass: string
}) {
  return (
    <div
      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-4xl font-black text-white shadow-lg ${accentClass}`}
    >
      {letter}
    </div>
  )
}

export function LetterModeResultPanel({
  result,
  mysteryHidden = false,
}: LetterModeResultPanelProps) {
  if (mysteryHidden) {
    return (
      <div className="w-full max-w-md cursor-pointer rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center shadow-lg">
        <h3 className="mb-2 text-lg font-semibold text-green-800">🎉 Winner!</h3>
        <p className="text-2xl font-bold text-green-900">?</p>
        <p className="mt-2 text-xs text-green-700">Click to reveal result</p>
      </div>
    )
  }

  const { variant } = result

  if (variant === "classroom") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-sky-300 bg-gradient-to-br from-sky-50 to-blue-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Classroom</p>
        <LetterHero letter={result.letter} accentClass="bg-sky-600" />
        <h3 className="mt-3 text-xl font-bold text-sky-900">{result.headline}</h3>
        <p className="mt-2 text-sm text-sky-800">{result.detail}</p>
        {result.prompt && (
          <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-sm font-medium text-sky-900 ring-1 ring-sky-200">
            {result.prompt}
          </p>
        )}
        {result.remainingLabel && (
          <Badge variant="secondary" className="mt-3">
            {result.remainingLabel}
          </Badge>
        )}
      </div>
    )
  }

  if (variant === "alphabet-practice") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-lime-400 bg-gradient-to-br from-lime-50 to-green-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-lime-800">
          Alphabet practice
        </p>
        <p className="mt-3 text-6xl font-black text-lime-900">{result.letter}</p>
        <h3 className="mt-2 text-lg font-bold text-lime-900">{result.detail}</h3>
        {result.prompt && <p className="mt-2 text-sm text-lime-800/90">{result.prompt}</p>}
        {result.hint && <p className="mt-2 text-xs text-lime-700/80">{result.hint}</p>}
      </div>
    )
  }

  if (variant === "phonics") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 to-orange-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Phonics</p>
        <LetterHero letter={result.letter} accentClass="bg-rose-600" />
        <p className="mt-3 font-mono text-lg font-semibold text-rose-800">{result.phoneme}</p>
        <h3 className="mt-1 text-xl font-bold text-rose-900">{result.headline}</h3>
        <p className="mt-2 text-sm text-rose-800/90">{result.detail}</p>
        {result.prompt && (
          <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-sm font-medium text-rose-900 ring-1 ring-rose-200">
            {result.prompt}
          </p>
        )}
        {result.exampleWord && (
          <p className="mt-2 text-xs text-rose-700">Example: {result.exampleWord}</p>
        )}
      </div>
    )
  }

  if (variant === "spelling") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Spelling</p>
        <LetterHero letter={result.letter} accentClass="bg-amber-600" />
        <h3 className="mt-3 text-xl font-bold text-amber-900">{result.headline}</h3>
        <p className="mt-2 text-sm text-amber-800">{result.detail}</p>
        {result.hint && <p className="mt-2 text-xs text-amber-700/80">{result.hint}</p>}
      </div>
    )
  }

  if (variant === "word-games") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Word games</p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <LetterHero letter={result.letter} accentClass="bg-orange-600" />
          <div className="rounded-xl border-2 border-orange-400 bg-white px-4 py-3 text-center shadow">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-orange-600">
              Points
            </p>
            <p className="text-3xl font-black text-orange-900">{result.points ?? 1}</p>
          </div>
        </div>
        <h3 className="mt-3 text-lg font-bold text-orange-900">{result.headline}</h3>
        <p className="mt-1 text-sm text-orange-800/90">{result.detail}</p>
        {result.prompt && <p className="mt-2 text-sm font-medium text-orange-900">{result.prompt}</p>}
      </div>
    )
  }

  if (variant === "creative-writing") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
          Creative writing
        </p>
        <LetterHero letter={result.letter} accentClass="bg-violet-600" />
        <h3 className="mt-3 text-lg font-bold text-violet-900">{result.headline}</h3>
        <p className="mt-3 rounded-lg bg-white/80 px-3 py-3 text-left text-sm leading-relaxed text-violet-900 ring-1 ring-violet-200">
          {result.prompt || result.detail}
        </p>
        {result.hint && <p className="mt-2 text-xs text-violet-700/80">{result.hint}</p>}
      </div>
    )
  }

  if (variant === "icebreaker") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-cyan-300 bg-gradient-to-br from-cyan-50 to-sky-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Icebreaker</p>
        <LetterHero letter={result.letter} accentClass="bg-cyan-600" />
        <h3 className="mt-3 text-xl font-bold text-cyan-900">{result.headline}</h3>
        <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-sm font-medium text-cyan-900 ring-1 ring-cyan-200">
          {result.prompt || result.detail}
        </p>
        {result.remainingLabel && (
          <Badge variant="secondary" className="mt-3">
            {result.remainingLabel}
          </Badge>
        )}
      </div>
    )
  }

  if (variant === "family-games") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-teal-300 bg-gradient-to-br from-teal-50 to-emerald-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Family games</p>
        <LetterHero letter={result.letter} accentClass="bg-teal-600" />
        <h3 className="mt-3 text-xl font-bold text-teal-900">{result.headline}</h3>
        <p className="mt-3 text-sm font-medium leading-relaxed text-teal-900">
          {result.prompt || result.detail}
        </p>
        {result.hint && <p className="mt-2 text-xs text-teal-700/80">{result.hint}</p>}
      </div>
    )
  }

  if (variant === "esl") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">ESL lesson</p>
        <LetterHero letter={result.letter} accentClass="bg-indigo-600" />
        <h3 className="mt-3 text-xl font-bold text-indigo-900">{result.headline}</h3>
        <p className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-sm font-medium text-indigo-900 ring-1 ring-indigo-200">
          {result.prompt || result.detail}
        </p>
        {result.hint && <p className="mt-2 text-xs text-indigo-700/80">{result.hint}</p>}
      </div>
    )
  }

  if (variant === "quiz") {
    return (
      <div className="w-full max-w-md rounded-xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Quiz</p>
        <LetterHero letter={result.letter} accentClass="bg-yellow-500" />
        <h3 className="mt-3 text-xl font-bold text-yellow-900">{result.headline}</h3>
        <p className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-sm font-semibold text-yellow-950 ring-1 ring-yellow-300">
          {result.prompt || result.detail}
        </p>
        {result.hint && <p className="mt-2 text-xs text-yellow-800/80">{result.hint}</p>}
        {result.remainingLabel && (
          <Badge variant="secondary" className="mt-3">
            {result.remainingLabel}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center shadow-lg">
      <h3 className="mb-2 text-lg font-semibold text-green-800">🎉 Winner!</h3>
      <p className="text-2xl font-bold text-green-900">{result.letter}</p>
      <p className="mt-2 text-sm text-green-800/80">{result.detail}</p>
    </div>
  )
}
