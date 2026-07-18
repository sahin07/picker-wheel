"use client"

import { useState, useMemo, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ListChecks,
  Type,
  Palette,
  MoreVertical,
  Plus,
  Minus,
  Copy,
  EyeOff,
  Trash2,
  MoreHorizontal,
  Shuffle,
  RotateCcw,
  Eye,
} from "lucide-react"
import {
  BULK_COLOR_SWATCHES,
  LETTER_COLOR_PALETTES,
  STYLE_OPTIONS,
} from "@/lib/letter-picker-constants"
import type {
  LetterSlice,
  LetterSidebarTab,
  StyleOption,
  LetterOption,
} from "@/types/letter-picker"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSettingsStore } from "@/stores/settings-store"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import ConfirmationDialog from "@/components/confirmation-dialog"

interface InputPanelProps {
  letterSlices: LetterSlice[]
  activeCount: number
  resultsCount: number
  sidebarTab: LetterSidebarTab
  setSidebarTab: (tab: LetterSidebarTab) => void
  styleOption: StyleOption
  letterOption: LetterOption
  showTitleModal: boolean
  setShowTitleModal: (show: boolean) => void
  onStyleOptionChange: (value: StyleOption) => void
  onLetterOptionChange: (value: LetterOption) => void
  onHideInputs: () => void
  onShuffleLetters: () => void
  onSortSlicesZA: () => void
  onEqualizeWeights: () => void
  onRemoveBlanks: () => void
  onRemoveDuplicates: () => void
  onClearAllSlices: () => void
  onResetWheel: () => void
  onResetToAlphabet: () => void
  updateSlice: (id: string, patch: Partial<LetterSlice>) => void
  addSlice: (text?: string) => void
  removeSlices: (ids: string[]) => void
  setSlicesFromText: (text: string) => void
  applyColorPalette: (colors: readonly string[]) => void
  duplicateSlices: (ids: string[]) => void
  setEnabledForIds: (ids: string[], enabled: boolean) => void
  adjustWeightForIds: (ids: string[], delta: number) => void
  setColorForIds: (ids: string[], color: string) => void
  getProbability: (slice: LetterSlice) => number
  getTextEditorValue: () => string
  onViewResults?: () => void
  onOpenSettings?: () => void
  onToggleFullscreen?: () => void
  /** normal | elimination — synced with Manage/Header "Remove winner" */
  actionMode?: "normal" | "elimination"
  onActionModeChange?: (mode: "normal" | "elimination") => void
}

const TABS: { id: LetterSidebarTab; label: string; icon: ReactNode }[] = [
  { id: "list", label: "List", icon: <ListChecks className="w-4 h-4" /> },
  { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
  { id: "style", label: "Style", icon: <Palette className="w-4 h-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="w-4 h-4" /> },
]

export function InputPanel({
  letterSlices,
  activeCount,
  resultsCount,
  sidebarTab,
  setSidebarTab,
  styleOption,
  letterOption,
  setShowTitleModal,
  onStyleOptionChange,
  onLetterOptionChange,
  onHideInputs,
  onShuffleLetters,
  onSortSlicesZA,
  onEqualizeWeights,
  onRemoveBlanks,
  onRemoveDuplicates,
  onClearAllSlices,
  onResetWheel,
  onResetToAlphabet,
  updateSlice,
  addSlice,
  removeSlices,
  setSlicesFromText,
  applyColorPalette,
  duplicateSlices,
  setEnabledForIds,
  adjustWeightForIds,
  setColorForIds,
  getProbability,
  getTextEditorValue,
  onViewResults,
  onOpenSettings,
  onToggleFullscreen,
  actionMode = "normal",
  onActionModeChange,
}: InputPanelProps) {
  const { settings, updateSettings } = useSettingsStore()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [textDraft, setTextDraft] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  // Defer color inputs until after mount — browser extensions (e.g. ColorPick) inject
  // nodes into <input type="color"> and cause React hydration mismatches.
  const [colorPickersReady, setColorPickersReady] = useState(false)
  useEffect(() => {
    setColorPickersReady(true)
  }, [])

  const filteredSlices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return letterSlices
    return letterSlices.filter((s) => s.text.toLowerCase().includes(q))
  }, [letterSlices, searchQuery])

  const allSelected = letterSlices.length > 0 && selectedIds.length === letterSlices.length
  const selectedCount = selectedIds.length

  const textValue = textDraft ?? getTextEditorValue()

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(letterSlices.map((s) => s.id))
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const targetIds = selectedIds.length > 0 ? selectedIds : letterSlices.map((s) => s.id)

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50/80">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">A-Z</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            {activeCount} active
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setShowTitleModal(true)} title="Edit title">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onShuffleLetters} title="Shuffle">
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onHideInputs} title="Hide">
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs: List / Text / Style */}
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

      <div className="p-3">
        {sidebarTab === "list" && (
          <div className="space-y-3">
            {onActionModeChange && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Action Mode</Label>
                <Select
                  value={actionMode}
                  onValueChange={(value: "normal" | "elimination") => onActionModeChange(value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Mode</SelectItem>
                    <SelectItem value="elimination">Elimination Mode</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-slate-400">
                  Synced with Manage → Remove winner (Header Settings)
                </p>
              </div>
            )}

            {/* Bulk toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleSelectAll}
                className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                  selectedCount > 0
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {selectedCount > 0 ? `${selectedCount} selected` : `Slices (${letterSlices.length})`}
              </button>

              <div className="flex items-center gap-0.5 border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  disabled={selectedCount === 0}
                  onClick={() => adjustWeightForIds(selectedIds, -1)}
                  title="Decrease weight"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  disabled={selectedCount === 0}
                  onClick={() => adjustWeightForIds(selectedIds, 1)}
                  title="Increase weight"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  disabled={selectedCount === 0}
                  onClick={() => duplicateSlices(selectedIds)}
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  disabled={selectedCount === 0}
                  onClick={() => {
                    setEnabledForIds(selectedIds, false)
                    setSelectedIds([])
                  }}
                  title="Hide selected"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </Button>
              </div>

              {selectedCount > 0 && (
                <>
                  <button
                    type="button"
                    className="text-xs text-slate-500 hover:text-slate-700"
                    onClick={() => setSelectedIds([])}
                  >
                    Clear selection
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      removeSlices(selectedIds)
                      setSelectedIds([])
                    }}
                    title="Delete selected"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}

              <Button variant="outline" size="sm" className="h-7 ml-auto" onClick={() => addSlice()}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add
              </Button>

              <SlicesManageMenu
                settings={settings}
                onUpdateSettings={updateSettings}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSortZA={onSortSlicesZA}
                onShuffle={onShuffleLetters}
                onEqualize={onEqualizeWeights}
                onDeleteBlanks={onRemoveBlanks}
                onRemoveDuplicates={onRemoveDuplicates}
                onClearAll={() => setShowClearConfirm(true)}
              />
            </div>

            {/* Bulk colors */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              {BULK_COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  title="Apply color to selected"
                  className="w-5 h-5 rounded-full border border-black/10 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => setColorForIds(selectedCount > 0 ? selectedIds : targetIds, color)}
                />
              ))}
            </div>

            {/* Letter rows */}
            <div className="max-h-[420px] overflow-y-auto space-y-1.5 pr-1">
              {filteredSlices.map((slice) => {
                const selected = selectedIds.includes(slice.id)
                const pct = Math.round(getProbability(slice))
                return (
                  <div
                    key={slice.id}
                    className={`flex items-center gap-1.5 rounded-md border px-1.5 py-1 ${
                      slice.enabled ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60"
                    } ${selected ? "ring-1 ring-emerald-400" : ""}`}
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => toggleSelect(slice.id)}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Input
                      value={slice.text}
                      onChange={(e) => updateSlice(slice.id, { text: e.target.value })}
                      className="h-8 flex-1 min-w-0 text-sm font-medium"
                    />
                    <div className="flex items-center border rounded-md overflow-hidden shrink-0">
                      <button
                        type="button"
                        className="h-8 w-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                        disabled={slice.weight <= 1}
                        onClick={() => updateSlice(slice.id, { weight: Math.max(1, slice.weight - 1) })}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={slice.weight}
                        onChange={(e) =>
                          updateSlice(slice.id, { weight: Math.max(1, parseInt(e.target.value, 10) || 1) })
                        }
                        className="w-9 h-8 text-center text-xs border-x outline-none"
                      />
                      <button
                        type="button"
                        className="h-8 w-7 flex items-center justify-center text-slate-500 hover:bg-slate-50"
                        onClick={() => updateSlice(slice.id, { weight: slice.weight + 1 })}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 w-8 text-right tabular-nums shrink-0">
                      {slice.enabled ? `${pct}%` : "—"}
                    </span>
                    <label className="relative shrink-0 cursor-pointer" title="Color">
                      <span
                        className="block w-5 h-5 rounded-full border border-black/10"
                        style={{ backgroundColor: slice.color }}
                      />
                      {colorPickersReady ? (
                        <input
                          type="color"
                          value={slice.color}
                          onChange={(e) => updateSlice(slice.id, { color: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          suppressHydrationWarning
                        />
                      ) : null}
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => updateSlice(slice.id, { enabled: !slice.enabled })}>
                          {slice.enabled ? "Disable" : "Enable"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateSlices([slice.id])}>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            removeSlices([slice.id])
                            setSelectedIds((prev) => prev.filter((id) => id !== slice.id))
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </div>

            {filteredSlices.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-8">
                {searchQuery.trim() ? "No slices match your search." : "Add letters above to build your wheel."}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={onResetToAlphabet}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset A–Z
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={onResetWheel}>
                Clear results
              </Button>
            </div>
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              One letter per line. Supports <code className="bg-slate-100 px-1 rounded">3, A</code> or{" "}
              <code className="bg-slate-100 px-1 rounded">A, 3</code> for weights.
            </p>
            <Textarea
              value={textValue}
              onChange={(e) => setTextDraft(e.target.value)}
              onBlur={() => {
                if (textDraft !== null) {
                  setSlicesFromText(textDraft)
                  setTextDraft(null)
                }
              }}
              className="min-h-[320px] font-mono text-sm"
              placeholder={"A\nB\nC\nD\nE"}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  if (textDraft !== null) {
                    setSlicesFromText(textDraft)
                    setTextDraft(null)
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
                  a.download = "letters.csv"
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
            <div>
              <Label className="text-xs text-slate-500 mb-2 block">Letter case</Label>
              <Select value={styleOption} onValueChange={(v) => onStyleOptionChange(v as StyleOption)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STYLE_OPTIONS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-slate-500 mb-2 block">Preset set</Label>
              <Select value={letterOption} onValueChange={(v) => onLetterOptionChange(v as LetterOption)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alphabet">Full Alphabet (A–Z)</SelectItem>
                  <SelectItem value="vowels">Vowels only</SelectItem>
                  <SelectItem value="consonants">Consonants only</SelectItem>
                  <SelectItem value="custom">Custom list</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-slate-500">Color palettes</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    const palette =
                      LETTER_COLOR_PALETTES[Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)]
                    applyColorPalette(palette.colors)
                    updateSettings({
                      appearance: {
                        ...settings.appearance,
                        toolColors: [...palette.colors],
                      },
                    })
                  }}
                >
                  Randomize
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {LETTER_COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => {
                      applyColorPalette(palette.colors)
                      updateSettings({
                        appearance: {
                          ...settings.appearance,
                          toolColors: [...palette.colors],
                        },
                      })
                    }}
                    className="flex flex-col gap-1.5 p-2 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors text-left"
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
          </div>
        )}

        {sidebarTab === "other" && (
          <SidebarOtherOptions
            toolLabel="A-Z"
            resultsCount={resultsCount}
            exportFileName="letters.csv"
            exportText={getTextEditorValue()}
            entries={letterSlices.map((s) => ({
              id: s.id,
              name: s.text,
              weight: s.weight,
              enabled: s.enabled,
            }))}
            onImportText={(text) => {
              setSlicesFromText(text)
              setTextDraft(null)
            }}
            onRemoveDuplicates={onRemoveDuplicates}
            onViewResults={onViewResults}
            onOpenSettings={onOpenSettings}
            onToggleFullscreen={onToggleFullscreen}
          />
        )}
      </div>

      <ConfirmationDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          onClearAllSlices()
          setSelectedIds([])
        }}
        title="Clear All Slices"
        message="Are you sure you want to remove all slices from this wheel? This action cannot be undone."
        confirmText="Clear All"
      />
    </div>
  )
}
