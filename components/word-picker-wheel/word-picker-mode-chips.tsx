"use client"

import {
  WORD_PICKER_CHALLENGE_MODES,
  type WordPickerChallengeMode,
} from "@/lib/word-picker-modes"

type WordPickerModeChipsProps = {
  activeMode: WordPickerChallengeMode
  onChange: (mode: WordPickerChallengeMode) => void
}

export function WordPickerModeChips({ activeMode, onChange }: WordPickerModeChipsProps) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-sky-800">
        Challenge modes
      </p>
      <ul className="flex flex-wrap justify-center gap-2">
        {WORD_PICKER_CHALLENGE_MODES.map((mode) => {
          const active = activeMode === mode.id
          return (
            <li key={mode.id}>
              <button
                type="button"
                aria-pressed={active}
                title={mode.description}
                onClick={() => onChange(mode.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-sky-400 hover:bg-sky-50"
                }`}
              >
                {mode.label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
