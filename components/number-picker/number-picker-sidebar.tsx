"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ListChecks,
  Type,
  Palette,
  MoreVertical,
  Eye,
  EyeOff,
  History,
  RotateCcw,
} from "lucide-react"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import { useSettingsStore } from "@/stores/settings-store"
import type { WheelSettings } from "@/types/settings"

type SidebarTab = "inputs" | "text" | "style" | "other"
type ResultMode = "random-number" | "random-digits"

interface WeightedNumber {
  value: number
  weight: number
}

interface DigitRange {
  from: number
  to: number
}

const TABS: { id: SidebarTab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <ListChecks className="w-4 h-4" /> },
  { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
  { id: "style", label: "Style", icon: <Palette className="w-4 h-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="w-4 h-4" /> },
]

export type NumberPickerSidebarProps = {
  resultMode: ResultMode
  setResultMode: (v: ResultMode) => void
  inputMethod: "range" | "formula"
  setInputMethod: (v: "range" | "formula") => void
  actionMode: "normal" | "elimination"
  setActionMode: (v: "normal" | "elimination") => void
  minValue: number
  setMinValue: (v: number) => void
  maxValue: number
  setMaxValue: (v: number) => void
  interval: number
  setIntervalValue: (v: number) => void
  excludeNumbers: string
  setExcludeNumbers: (v: string) => void
  formula: string
  setFormula: (v: string) => void
  processFormula: () => void
  numDigits: number
  setNumDigits: (v: number) => void
  digitRanges: DigitRange[]
  updateDigitRange: (digitIndex: number, field: "from" | "to", value: number) => void
  autoSpin: boolean
  setAutoSpin: (v: boolean) => void
  numbers: WeightedNumber[]
  setNumbers: (v: WeightedNumber[] | ((prev: WeightedNumber[]) => WeightedNumber[])) => void
  showTitle: boolean
  setShowTitle: (v: boolean) => void
  toolTitle: string
  setToolTitle: (v: string) => void
  toolDescription: string
  setToolDescription: (v: string) => void
  resultTitle: string
  setResultTitle: (v: string) => void
  resultsCount: number
  onViewHistory: () => void
  onToggleFullscreen: () => void
  getDigitPositionLabel: (index: number) => string
  shuffleNumbers: () => void
  resetDigits: () => void
}

export function NumberPickerSidebar(props: NumberPickerSidebarProps) {
  const {
    resultMode,
    setResultMode,
    inputMethod,
    setInputMethod,
    actionMode,
    setActionMode,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    interval,
    setIntervalValue,
    excludeNumbers,
    setExcludeNumbers,
    formula,
    setFormula,
    processFormula,
    numDigits,
    setNumDigits,
    digitRanges,
    updateDigitRange,
    autoSpin,
    setAutoSpin,
    numbers,
    setNumbers,
    showTitle,
    setShowTitle,
    toolTitle,
    setToolTitle,
    toolDescription,
    setToolDescription,
    resultTitle,
    setResultTitle,
    resultsCount,
    onViewHistory,
    onToggleFullscreen,
    getDigitPositionLabel,
    shuffleNumbers,
    resetDigits,
  } = props

  const { settings, updateSettings } = useSettingsStore()
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("inputs")
  const [searchQuery, setSearchQuery] = useState("")
  const [textDraft, setTextDraft] = useState<string | null>(null)

  const getTextEditorValue = () =>
    numbers.map((n) => (n.weight !== 1 ? `${n.weight}, ${n.value}` : String(n.value))).join("\n")

  const textValue = textDraft ?? getTextEditorValue()

  const applyNumbersFromText = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    const parsed: WeightedNumber[] = []
    for (const line of lines) {
      const parts = line.split(/[,|]/).map((p) => p.trim())
      if (parts.length >= 2) {
        const a = Number(parts[0])
        const b = Number(parts[1])
        if (!Number.isNaN(a) && !Number.isNaN(b)) {
          // Support "weight, number" or "number, weight" (weight usually smaller / first if both numeric)
          if (parts[0].length <= 3 && a >= 1 && a <= 100 && b > a) {
            parsed.push({ weight: Math.max(1, a), value: b })
          } else if (parts[1].length <= 3 && b >= 1 && b <= 100) {
            parsed.push({ value: a, weight: Math.max(1, b) })
          } else {
            parsed.push({ weight: Math.max(1, a), value: b })
          }
          continue
        }
      }
      const num = Number(line)
      if (!Number.isNaN(num)) {
        parsed.push({ value: num, weight: 1 })
      }
    }
    if (parsed.length) {
      setNumbers(parsed)
      setResultMode("random-number")
    }
  }

  const filteredNumbers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return numbers
    return numbers.filter((n) => String(n.value).includes(q))
  }, [numbers, searchQuery])

  const sortZA = () => {
    setNumbers([...numbers].sort((a, b) => String(b.value).localeCompare(String(a.value), undefined, { numeric: true })))
  }

  const equalize = () => {
    setNumbers(numbers.map((n) => ({ ...n, weight: 1 })))
  }

  const removeDuplicates = () => {
    const seen = new Set<number>()
    setNumbers(
      numbers.filter((n) => {
        if (seen.has(n.value)) return false
        seen.add(n.value)
        return true
      }),
    )
  }

  const clearAll = () => {
    setNumbers([])
  }

  const exportText = numbers.map((n) => (n.weight !== 1 ? `${n.weight}, ${n.value}` : String(n.value))).join("\n")

  const entries = numbers.map((n) => ({
    id: String(n.value),
    name: String(n.value),
    weight: n.weight,
    enabled: true,
  }))

  const handleImportText = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    const parsed: WeightedNumber[] = []
    for (const line of lines) {
      const parts = line.split(",").map((p) => p.trim())
      if (parts.length >= 2 && !Number.isNaN(Number(parts[0])) && !Number.isNaN(Number(parts[1]))) {
        parsed.push({ weight: Math.max(1, Number(parts[0])), value: Number(parts[1]) })
      } else if (!Number.isNaN(Number(line))) {
        parsed.push({ value: Number(line), weight: 1 })
      }
    }
    if (parsed.length) setNumbers(parsed)
  }

  const applyPalette = (colors: string[]) => {
    updateSettings({
      appearance: {
        ...settings.appearance,
        toolColors: colors,
      },
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50/80">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">INPUTS</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            {resultMode === "random-number" ? `${numbers.length} numbers` : `${numDigits} digits`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={onViewHistory}
            title="History / Results"
          >
            <History className="w-4 h-4" />
            {resultsCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {resultsCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowTitle(!showTitle)}
            title={showTitle ? "Hide title settings" : "Show title settings"}
          >
            {showTitle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          {resultMode === "random-number" && (
            <SlicesManageMenu
              settings={settings as unknown as WheelSettings}
              onUpdateSettings={(partial) => updateSettings(partial as any)}
              onSortZA={sortZA}
              onShuffle={shuffleNumbers}
              onEqualize={equalize}
              onDeleteBlanks={() => {}}
              onRemoveDuplicates={removeDuplicates}
              onClearAll={clearAll}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />
          )}
          {resultMode === "random-digits" && (
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={resetDigits} title="Reset digits">
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex border-b overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (tab.id === "text") setTextDraft(getTextEditorValue())
              setSidebarTab(tab.id)
            }}
            className={`flex-1 min-w-[4.5rem] flex flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors ${
              sidebarTab === tab.id
                ? "text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-3 max-h-[70vh] overflow-y-auto">
        {sidebarTab === "inputs" && (
          <div className="space-y-4">
            {showTitle && (
              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                <div className="space-y-1">
                  <Label className="text-xs">Tool Title</Label>
                  <Input value={toolTitle} onChange={(e) => setToolTitle(e.target.value)} className="h-8" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tool Description</Label>
                  <Textarea
                    value={toolDescription}
                    onChange={(e) => setToolDescription(e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Result Title</Label>
                  <Input value={resultTitle} onChange={(e) => setResultTitle(e.target.value)} className="h-8" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Result Mode</Label>
              <Select value={resultMode} onValueChange={(value: ResultMode) => setResultMode(value)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random-number">Random Number</SelectItem>
                  <SelectItem value="random-digits">Random Digits</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {resultMode === "random-number" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600">Input Method</Label>
                  <Select
                    value={inputMethod}
                    onValueChange={(value: "range" | "formula") => setInputMethod(value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="range">Range Input</SelectItem>
                      <SelectItem value="formula">Formula Input</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inputMethod === "range" ? (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Min</Label>
                        <Input
                          type="number"
                          value={minValue}
                          onChange={(e) => setMinValue(Number.parseInt(e.target.value) || 1)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Max</Label>
                        <Input
                          type="number"
                          value={maxValue}
                          onChange={(e) => setMaxValue(Number.parseInt(e.target.value) || 10)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Interval</Label>
                        <Input
                          type="number"
                          value={interval}
                          onChange={(e) => setIntervalValue(Number.parseInt(e.target.value) || 1)}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Exclude Numbers</Label>
                      <Input
                        placeholder="e.g., 3,7,9"
                        value={excludeNumbers}
                        onChange={(e) => setExcludeNumbers(e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-xs">Formula</Label>
                    <Textarea
                      placeholder="e.g., 1-10, 15, 20-25"
                      value={formula}
                      onChange={(e) => setFormula(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={processFormula} size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Process Formula
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600">Action Mode</Label>
                  <Select
                    value={actionMode}
                    onValueChange={(value: "normal" | "elimination") => setActionMode(value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Mode</SelectItem>
                      <SelectItem value="elimination">Elimination Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {numbers.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-slate-600">
                        Current Numbers ({numbers.length})
                      </Label>
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={shuffleNumbers}>
                        Shuffle
                      </Button>
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-md border bg-slate-50/80 p-2">
                      <div className="flex flex-col gap-1">
                        {filteredNumbers.slice(0, 50).map((item, index) => {
                          const realIndex = numbers.findIndex((n) => n.value === item.value && n.weight === item.weight)
                          const idx = realIndex >= 0 ? realIndex : index
                          return (
                            <div key={`${item.value}-${idx}`} className="flex items-center gap-2">
                              <Badge variant="secondary" className="w-8 justify-center text-xs">
                                {item.value}
                              </Badge>
                              <span className="text-xs text-slate-500">Weight</span>
                              <input
                                type="number"
                                min={1}
                                value={item.weight}
                                onChange={(e) => {
                                  const w = Math.max(1, Number.parseInt(e.target.value) || 1)
                                  setNumbers(numbers.map((n, i) => (i === idx ? { ...n, weight: w } : n)))
                                }}
                                className="h-6 w-14 rounded border px-1 text-xs"
                              />
                            </div>
                          )
                        })}
                        {filteredNumbers.length > 50 && (
                          <Badge variant="outline" className="text-xs">
                            +{filteredNumbers.length - 50} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {resultMode === "random-digits" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600">Number of Digits</Label>
                  <div className="flex gap-1">
                    {[6, 5, 4, 3, 2].map((num) => (
                      <Button
                        key={num}
                        variant={numDigits === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNumDigits(num)}
                        className="flex-1"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600">Digit Ranges</Label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-7 gap-1 text-xs font-medium">
                      <div>Num</div>
                      {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className={i >= numDigits ? "text-muted-foreground" : ""}>
                          {getDigitPositionLabel(5 - i)}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 items-center">
                      <Label className="text-xs">From</Label>
                      {Array.from({ length: 6 }, (_, i) => (
                        <Input
                          key={i}
                          type="number"
                          min="0"
                          max="9"
                          value={digitRanges[5 - i]?.from || 0}
                          onChange={(e) =>
                            updateDigitRange(5 - i, "from", Number.parseInt(e.target.value) || 0)
                          }
                          className="h-8 text-xs"
                          disabled={i >= numDigits}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 items-center">
                      <Label className="text-xs">To</Label>
                      {Array.from({ length: 6 }, (_, i) => (
                        <Input
                          key={i}
                          type="number"
                          min="0"
                          max="9"
                          value={digitRanges[5 - i]?.to || 9}
                          onChange={(e) =>
                            updateDigitRange(5 - i, "to", Number.parseInt(e.target.value) || 9)
                          }
                          className="h-8 text-xs"
                          disabled={i >= numDigits}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch checked={autoSpin} onCheckedChange={setAutoSpin} />
                  <Label className="text-sm">Auto Spinning</Label>
                </div>
              </>
            )}
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              One number per line. Supports weights like{" "}
              <code className="rounded bg-slate-100 px-1">3, 10</code> (weight, number) or{" "}
              <code className="rounded bg-slate-100 px-1">10, 3</code>.
            </p>
            <Textarea
              value={textValue}
              onChange={(e) => setTextDraft(e.target.value)}
              onBlur={() => {
                if (textDraft !== null) {
                  applyNumbersFromText(textDraft)
                  setTextDraft(null)
                }
              }}
              className="min-h-[320px] font-mono text-sm"
              placeholder={"1\n2\n3\n5, 10"}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  if (textDraft !== null) {
                    applyNumbersFromText(textDraft)
                    setTextDraft(null)
                  } else {
                    applyNumbersFromText(getTextEditorValue())
                  }
                }}
              >
                Apply text
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([getTextEditorValue()], { type: "text/csv" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "numbers.csv"
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                CSV
              </Button>
            </div>
          </div>
        )}

        {sidebarTab === "style" && (
          <div className="space-y-4">
            <div className="mb-1 flex items-center justify-between">
              <Label className="text-xs text-slate-500">Color palettes</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  const palette =
                    LETTER_COLOR_PALETTES[Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)]
                  applyPalette([...palette.colors])
                }}
              >
                Randomize
              </Button>
            </div>
            <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto">
              {LETTER_COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => applyPalette([...palette.colors])}
                  className="flex flex-col gap-1.5 rounded-lg border border-slate-200 p-2 text-left transition-colors hover:border-emerald-400 hover:bg-emerald-50/40"
                >
                  <span className="text-xs font-medium text-slate-700">{palette.name}</span>
                  <div className="flex gap-0.5">
                    {palette.colors.slice(0, 6).map((c) => (
                      <span
                        key={c}
                        className="h-3 flex-1 rounded-sm first:rounded-l last:rounded-r"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {sidebarTab === "other" && (
          <SidebarOtherOptions
            toolLabel="Number Picker Wheel"
            resultsCount={resultsCount}
            exportFileName="number-picker-list.txt"
            exportText={exportText}
            entries={entries}
            onImportText={handleImportText}
            onRemoveDuplicates={removeDuplicates}
            onViewResults={onViewHistory}
            onToggleFullscreen={onToggleFullscreen}
          />
        )}
      </div>
    </div>
  )
}
