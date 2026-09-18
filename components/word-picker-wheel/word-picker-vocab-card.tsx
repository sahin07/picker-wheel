"use client"

import { useEffect, useState } from "react"
import { Copy, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  STORY_ROLE_LABELS,
  challengePromptForMode,
  type WordPickerChallengeMode,
} from "@/lib/word-picker-modes"
import { fetchWordVocab, type WordVocabEntry } from "@/lib/word-picker-vocab"

type WordPickerVocabCardProps = {
  words: string[]
  mode: WordPickerChallengeMode
  onCopy?: (text: string) => void
  onClose?: () => void
}

export function WordPickerVocabCard({ words, mode, onCopy, onClose }: WordPickerVocabCardProps) {
  const primary = words[0] || ""
  const [vocab, setVocab] = useState<WordVocabEntry | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!primary) {
      setVocab(null)
      return
    }
    let cancelled = false
    setLoading(true)
    void fetchWordVocab(primary).then((entry) => {
      if (!cancelled) {
        setVocab(entry)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [primary])

  if (words.length === 0) return null

  const prompt = challengePromptForMode(mode, words)
  const copyText =
    words.length === 1
      ? primary
      : mode === "story"
        ? words.map((w, i) => `${STORY_ROLE_LABELS[i] || `Word ${i + 1}`}: ${w}`).join("\n")
        : words.join(", ")

  return (
    <div className="mx-auto mb-4 w-full max-w-lg rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
            {mode === "one" || mode === "elimination" ? "Word result" : "Challenge result"}
          </p>
          {mode === "story" && words.length >= 3 ? (
            <ul className="mt-2 space-y-1">
              {words.slice(0, 3).map((word, index) => (
                <li key={`${word}-${index}`} className="text-lg font-bold text-slate-900">
                  <span className="text-sm font-semibold text-sky-700">
                    {STORY_ROLE_LABELS[index]}:{" "}
                  </span>
                  {word}
                </li>
              ))}
            </ul>
          ) : words.length > 1 ? (
            <p className="mt-1 text-2xl font-bold text-slate-900">{words.join(" · ")}</p>
          ) : (
            <p className="mt-1 text-3xl font-bold text-slate-900">{primary}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => onCopy?.(copyText)}
          >
            <Copy className="mr-1 h-3.5 w-3.5" />
            Copy
          </Button>
          {onClose && (
            <Button type="button" size="sm" variant="ghost" className="h-8" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <p className="rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-700 ring-1 ring-sky-100">
        {prompt}
      </p>

      {(mode === "one" || mode === "elimination" || mode === "drawing" || mode === "acting") && (
        <div className="mt-4 border-t border-sky-100 pt-3">
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Looking up word…
            </p>
          ) : vocab ? (
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex flex-wrap items-center gap-2">
                {vocab.partOfSpeech && (
                  <Badge variant="secondary" className="capitalize">
                    {vocab.partOfSpeech}
                  </Badge>
                )}
                <Badge variant="outline">{vocab.letterCount} letters</Badge>
                {typeof vocab.syllableHint === "number" && vocab.syllableHint > 0 && (
                  <Badge variant="outline">~{vocab.syllableHint} syllables</Badge>
                )}
                <Badge variant="outline">
                  {vocab.letterCount <= 4
                    ? "Easy"
                    : vocab.letterCount <= 7
                      ? "Intermediate"
                      : "Advanced"}
                </Badge>
                {vocab.pronunciation && (
                  <span className="text-xs text-slate-500">{vocab.pronunciation}</span>
                )}
              </div>
              {vocab.definition && (
                <p>
                  <span className="font-semibold text-slate-900">Definition · </span>
                  {vocab.definition}
                </p>
              )}
              {vocab.example && (
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-900">Example · </span>
                  {vocab.example}
                </p>
              )}
              {vocab.synonyms && vocab.synonyms.length > 0 && (
                <p>
                  <span className="font-semibold text-slate-900">Synonyms · </span>
                  {vocab.synonyms.join(", ")}
                </p>
              )}
              {vocab.antonyms && vocab.antonyms.length > 0 && (
                <p>
                  <span className="font-semibold text-slate-900">Antonyms · </span>
                  {vocab.antonyms.join(", ")}
                </p>
              )}
              {vocab.related && vocab.related.length > 0 && (
                <p>
                  <span className="font-semibold text-slate-900">Related · </span>
                  {vocab.related.join(", ")}
                </p>
              )}
              {!vocab.definition && (
                <p className="text-xs text-slate-500">
                  No dictionary entry found — still great for prompts and games.
                </p>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
