"use client"

import { useEffect, useState } from "react"
import { Bookmark, Filter, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  WORD_PICKER_WINNER_COUNTS,
  type WordPickerWinnerCount,
} from "@/lib/word-picker-multi"
import {
  deleteSavedWordPack,
  listSavedWordPacks,
  saveWordPack,
  toggleFavoriteWordPack,
  type SavedWordPack,
} from "@/lib/word-picker-saved-packs"
import {
  WORD_AI_PRESETS,
  filterWords,
  type WordListFilter,
} from "@/lib/word-picker-import"

type WordPickerAdvancedControlsProps = {
  activeCount: number
  winnerCount: WordPickerWinnerCount
  onWinnerCountChange: (count: WordPickerWinnerCount) => void
  onPickMany: () => void
  currentWords: string[]
  onLoadPack: (words: string[], name: string) => void
  onFilterApply: (words: string[]) => void
  onAiPreset?: (preset: (typeof WORD_AI_PRESETS)[number]) => void
  showAiPresets?: boolean
}

/**
 * Word-picker-only controls above the wheel.
 * Import / Share / Embed / Equalize live in the right sidebar (Other / Manage) — do not duplicate here.
 */
export function WordPickerAdvancedControls({
  activeCount,
  winnerCount,
  onWinnerCountChange,
  onPickMany,
  currentWords,
  onLoadPack,
  onFilterApply,
  onAiPreset,
  showAiPresets = false,
}: WordPickerAdvancedControlsProps) {
  const [packName, setPackName] = useState("")
  const [packs, setPacks] = useState<SavedWordPack[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [startsWith, setStartsWith] = useState("")
  const [minLength, setMinLength] = useState("")
  const [maxLength, setMaxLength] = useState("")
  const [query, setQuery] = useState("")

  const refreshPacks = () => setPacks(listSavedWordPacks())

  useEffect(() => {
    refreshPacks()
  }, [])

  const applyFilter = () => {
    const filter: WordListFilter = {
      startsWith: startsWith || undefined,
      minLength: minLength ? Number(minLength) : undefined,
      maxLength: maxLength ? Number(maxLength) : undefined,
      query: query || undefined,
    }
    onFilterApply(filterWords(currentWords, filter))
  }

  return (
    <div className="mb-4 space-y-3 rounded-xl border border-sky-100 bg-sky-50/40 p-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-800">
          Pick words
        </span>
        {WORD_PICKER_WINNER_COUNTS.map((count) => (
          <Button
            key={count}
            type="button"
            size="sm"
            variant={winnerCount === count ? "default" : "outline"}
            className={winnerCount === count ? "bg-sky-600 hover:bg-sky-700" : ""}
            onClick={() => onWinnerCountChange(count)}
          >
            {count}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={activeCount === 0 || winnerCount > activeCount}
          onClick={onPickMany}
        >
          Pick {winnerCount}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowFilters((value) => !value)}
        >
          <Filter className="mr-1.5 h-4 w-4" />
          Length / letter filter
        </Button>
      </div>

      {showFilters && (
        <div className="mx-auto grid max-w-2xl gap-3 rounded-lg border bg-white p-3 sm:grid-cols-4">
          <div>
            <Label className="text-xs">Starts with</Label>
            <Input
              value={startsWith}
              maxLength={1}
              className="mt-1 h-8"
              onChange={(e) => setStartsWith(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Min length</Label>
            <Input
              type="number"
              min={1}
              value={minLength}
              className="mt-1 h-8"
              onChange={(e) => setMinLength(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Max length</Label>
            <Input
              type="number"
              min={1}
              value={maxLength}
              className="mt-1 h-8"
              onChange={(e) => setMaxLength(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Contains</Label>
            <Input
              value={query}
              className="mt-1 h-8"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 sm:col-span-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setStartsWith("")
                setMinLength("")
                setMaxLength("")
                setQuery("")
                onFilterApply(currentWords)
              }}
            >
              Reset
            </Button>
            <Button type="button" size="sm" onClick={applyFilter}>
              Apply filter
            </Button>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-2">
        <Input
          value={packName}
          placeholder="Save pack name"
          className="h-8 max-w-[180px] bg-white"
          onChange={(e) => setPackName(e.target.value)}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const saved = saveWordPack({
              name: packName || `Word pack ${packs.length + 1}`,
              words: currentWords,
            })
            if (!saved) return
            setPackName("")
            refreshPacks()
          }}
        >
          <Bookmark className="mr-1.5 h-4 w-4" />
          Save pack
        </Button>
      </div>

      {packs.length > 0 && (
        <ul className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2">
          {packs.slice(0, 12).map((pack) => (
            <li
              key={pack.id}
              className="flex items-center gap-1 rounded-lg border bg-white px-2 py-1 text-sm"
            >
              <button
                type="button"
                className="font-medium text-sky-800 hover:underline"
                onClick={() => onLoadPack(pack.words, pack.name)}
              >
                {pack.name} ({pack.words.length})
              </button>
              <button
                type="button"
                aria-label={pack.favorite ? "Unfavorite" : "Favorite"}
                className={pack.favorite ? "text-amber-500" : "text-slate-400"}
                onClick={() => {
                  toggleFavoriteWordPack(pack.id)
                  refreshPacks()
                }}
              >
                <Star className="h-3.5 w-3.5" fill={pack.favorite ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                aria-label="Delete pack"
                className="text-slate-400 hover:text-rose-600"
                onClick={() => {
                  deleteSavedWordPack(pack.id)
                  refreshPacks()
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {showAiPresets && onAiPreset && (
        <div className="flex flex-wrap justify-center gap-2">
          {WORD_AI_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              variant="outline"
              size="sm"
              className="border-violet-200 bg-violet-50 text-violet-800"
              onClick={() => onAiPreset(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
