"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  Eye,
  Link2,
  Check,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import {
  BULK_COLOR_SWATCHES,
  LETTER_COLOR_PALETTES,
  LETTER_WHEEL_COLORS,
} from "@/lib/letter-picker-constants"
import type { CustomWheelOption } from "@/lib/custom-wheel"
import { createOptionId } from "@/lib/custom-wheel"
import { useSettingsStore } from "@/stores/settings-store"
import { cn } from "@/lib/utils"

type SidebarTab = "list" | "text" | "style" | "other"

const TABS: { id: SidebarTab; label: string; icon: ReactNode }[] = [
  { id: "list", label: "List", icon: <ListChecks className="w-4 h-4" /> },
  { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
  { id: "style", label: "Style", icon: <Palette className="w-4 h-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="w-4 h-4" /> },
]

function parseTextToOptions(text: string): CustomWheelOption[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  return lines.map((line, i) => {
    let name = line
    let weight = 1
    const m1 = line.match(/^(\d+)\s*[,|\t]\s*(.+)$/)
    const m2 = line.match(/^(.+?)\s*[,|\t]\s*(\d+)$/)
    if (m1) {
      weight = Math.max(1, parseInt(m1[1], 10) || 1)
      name = m1[2].trim()
    } else if (m2) {
      name = m2[1].trim()
      weight = Math.max(1, parseInt(m2[2], 10) || 1)
    }
    return {
      id: createOptionId(),
      name,
      weight,
      enabled: true,
      color: LETTER_WHEEL_COLORS[i % LETTER_WHEEL_COLORS.length],
    }
  })
}

type Props = {
  options: CustomWheelOption[]
  onChange: (options: CustomWheelOption[]) => void
  resultsCount?: number
  onCopyShare?: () => void
  shareCopied?: boolean
}

export default function CustomWheelInputPanel({
  options,
  onChange,
  resultsCount = 0,
  onCopyShare,
  shareCopied,
}: Props) {
  const { settings, updateSettings } = useSettingsStore()
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("list")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [newTextInput, setNewTextInput] = useState("")
  const [textDraft, setTextDraft] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const activeOptions = useMemo(
    () => options.filter((o) => o.enabled !== false && o.name.trim()),
    [options],
  )

  const totalWeight = useMemo(
    () => activeOptions.reduce((sum, o) => sum + Math.max(1, o.weight ?? 1), 0),
    [activeOptions],
  )

  const getProbability = (option: CustomWheelOption) => {
    if (option.enabled === false || totalWeight <= 0) return 0
    return (Math.max(1, option.weight ?? 1) / totalWeight) * 100
  }

  const getTextEditorValue = () =>
    options
      .map((o) => ((o.weight ?? 1) !== 1 ? `${o.weight}, ${o.name}` : o.name))
      .join("\n")

  const filteredOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.name.toLowerCase().includes(q))
  }, [options, searchQuery])

  const allSelected = options.length > 0 && selectedIds.length === options.length
  const selectedCount = selectedIds.length
  const textValue = textDraft ?? getTextEditorValue()

  const patchOption = (id: string, patch: Partial<CustomWheelOption>) => {
    onChange(options.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  }

  const applyText = (raw: string) => {
    const next = parseTextToOptions(raw)
    if (next.length >= 1) onChange(next)
  }

  const handleAdd = () => {
    if (!newTextInput.trim()) return
    onChange([
      ...options,
      {
        id: createOptionId(),
        name: newTextInput.trim(),
        color: LETTER_WHEEL_COLORS[options.length % LETTER_WHEEL_COLORS.length],
        weight: 1,
        enabled: true,
      },
    ])
    setNewTextInput("")
  }

  const removeByIds = (ids: string[]) => {
    if (options.length - ids.length < 2) return
    onChange(options.filter((o) => !ids.includes(o.id)))
  }

  const duplicateByIds = (ids: string[]) => {
    const extras: CustomWheelOption[] = []
    options.forEach((o) => {
      if (ids.includes(o.id)) {
        extras.push({ ...o, id: createOptionId(), name: `${o.name} copy` })
      }
    })
    onChange([...options, ...extras])
  }

  const setEnabledForIds = (ids: string[], enabled: boolean) => {
    onChange(options.map((o) => (ids.includes(o.id) ? { ...o, enabled } : o)))
  }

  const adjustWeightForIds = (ids: string[], delta: number) => {
    onChange(
      options.map((o) =>
        ids.includes(o.id) ? { ...o, weight: Math.max(1, (o.weight ?? 1) + delta) } : o,
      ),
    )
  }

  const setColorForIds = (ids: string[], color: string) => {
    onChange(options.map((o) => (ids.includes(o.id) ? { ...o, color } : o)))
  }

  const applyColorPalette = (colors: string[]) => {
    onChange(
      options.map((o, i) => ({
        ...o,
        color: colors[i % colors.length],
      })),
    )
  }

  const shuffle = () => {
    const next = [...options]
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    onChange(next)
  }

  const sortZA = () => {
    onChange([...options].sort((a, b) => b.name.localeCompare(a.name)))
  }

  const equalize = () => {
    onChange(options.map((o) => ({ ...o, weight: 1 })))
  }

  const removeBlanks = () => {
    const next = options.filter((o) => o.name.trim())
    if (next.length >= 2) onChange(next)
  }

  const removeDuplicates = () => {
    const seen = new Set<string>()
    const next: CustomWheelOption[] = []
    for (const o of options) {
      const key = o.name.trim().toLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      next.push(o)
    }
    if (next.length >= 2) onChange(next)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50/80">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">INPUTS</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            {activeOptions.length} active
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setSidebarTab("list")} title="List">
            <Eye className="w-4 h-4" />
          </Button>
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

      <div className="p-3">
        {sidebarTab === "list" && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Add an option..."
                className="flex-1 h-9"
                value={newTextInput}
                onChange={(e) => setNewTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <Button
                size="sm"
                className="h-9 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleAdd}
                disabled={!newTextInput.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  allSelected ? setSelectedIds([]) : setSelectedIds(options.map((o) => o.id))
                }
                className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                  selectedCount > 0
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {selectedCount > 0 ? `${selectedCount} selected` : `Slices (${options.length})`}
              </button>

              <div className="flex items-center gap-0.5 border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  disabled={selectedCount === 0}
                  onClick={() => adjustWeightForIds(selectedIds, -1)}
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  disabled={selectedCount === 0}
                  onClick={() => adjustWeightForIds(selectedIds, 1)}
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  disabled={selectedCount === 0}
                  onClick={() => duplicateByIds(selectedIds)}
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
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </Button>
              </div>

              {selectedCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    removeByIds(selectedIds)
                    setSelectedIds([])
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}

              <SlicesManageMenu
                settings={settings}
                onUpdateSettings={updateSettings}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSortZA={sortZA}
                onShuffle={shuffle}
                onEqualize={equalize}
                onDeleteBlanks={removeBlanks}
                onRemoveDuplicates={removeDuplicates}
                onClearAll={() => {
                  if (options.length > 2) {
                    onChange(options.slice(0, 2).map((o) => ({ ...o, name: o.name || "Option" })))
                  }
                }}
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              {BULK_COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  title="Apply color"
                  className="w-5 h-5 rounded-full border border-black/10 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setColorForIds(selectedCount > 0 ? selectedIds : options.map((o) => o.id), color)
                  }
                />
              ))}
            </div>

            <div className="max-h-[420px] overflow-y-auto space-y-1.5 pr-1">
              {filteredOptions.map((option) => {
                const selected = selectedIds.includes(option.id)
                const enabled = option.enabled !== false
                const pct = Math.round(getProbability(option))
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md border px-1.5 py-1",
                      enabled ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60",
                      selected && "ring-1 ring-emerald-400",
                    )}
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(option.id)
                            ? prev.filter((x) => x !== option.id)
                            : [...prev, option.id],
                        )
                      }
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Input
                      value={option.name}
                      onChange={(e) => patchOption(option.id, { name: e.target.value })}
                      className="h-8 flex-1 min-w-0 text-sm font-medium"
                    />
                    <div className="flex items-center border rounded-md overflow-hidden shrink-0">
                      <button
                        type="button"
                        className="h-8 w-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                        disabled={(option.weight ?? 1) <= 1}
                        onClick={() =>
                          patchOption(option.id, { weight: Math.max(1, (option.weight ?? 1) - 1) })
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={option.weight ?? 1}
                        onChange={(e) =>
                          patchOption(option.id, {
                            weight: Math.max(1, parseInt(e.target.value, 10) || 1),
                          })
                        }
                        className="w-9 h-8 text-center text-xs border-x outline-none"
                      />
                      <button
                        type="button"
                        className="h-8 w-7 flex items-center justify-center text-slate-500 hover:bg-slate-50"
                        onClick={() => patchOption(option.id, { weight: (option.weight ?? 1) + 1 })}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 w-8 text-right tabular-nums shrink-0">
                      {enabled ? `${pct}%` : "—"}
                    </span>
                    <label className="relative shrink-0 cursor-pointer" title="Color">
                      <span
                        className="block w-5 h-5 rounded-full border border-black/10"
                        style={{ backgroundColor: option.color || "#4ade80" }}
                      />
                      <input
                        type="color"
                        value={option.color || "#4ade80"}
                        onChange={(e) => patchOption(option.id, { color: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => patchOption(option.id, { enabled: !enabled })}
                        >
                          {enabled ? "Disable" : "Enable"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateByIds([option.id])}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            removeByIds([option.id])
                            setSelectedIds((prev) => prev.filter((id) => id !== option.id))
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

            {filteredOptions.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-8">
                {searchQuery.trim()
                  ? "No slices match your search."
                  : "Add names or options above to build your wheel."}
              </p>
            )}
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              One option per line. Supports <code className="bg-slate-100 px-1 rounded">3, Name</code>{" "}
              for weights.
            </p>
            <Textarea
              value={textValue}
              onChange={(e) => setTextDraft(e.target.value)}
              onBlur={() => {
                if (textDraft !== null) {
                  applyText(textDraft)
                  setTextDraft(null)
                }
              }}
              className="min-h-[320px] font-mono text-sm"
              placeholder={"Alice\nBob\nCharlie"}
            />
            <Button
              size="sm"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                if (textDraft !== null) {
                  applyText(textDraft)
                  setTextDraft(null)
                }
              }}
            >
              Apply text
            </Button>
          </div>
        )}

        {sidebarTab === "style" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs text-slate-500">Color palettes</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  const palette =
                    LETTER_COLOR_PALETTES[Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)]
                  applyColorPalette(palette.colors)
                }}
              >
                Randomize
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
              {LETTER_COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => applyColorPalette(palette.colors)}
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
        )}

        {sidebarTab === "other" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Share this wheel with a packed link (works on Vercel, no database). Recent spins:{" "}
              {resultsCount}
            </p>
            {onCopyShare ? (
              <Button variant="outline" className="w-full" onClick={onCopyShare}>
                {shareCopied ? <Check className="mr-1.5 h-4 w-4" /> : <Link2 className="mr-1.5 h-4 w-4" />}
                {shareCopied ? "Link copied" : "Copy share link"}
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const blob = new Blob([getTextEditorValue()], { type: "text/csv" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "options.csv"
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              Export CSV
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
