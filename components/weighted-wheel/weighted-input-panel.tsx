"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  EyeOff,
  List,
  Minus,
  MoreVertical,
  Palette,
  Plus,
  Shuffle,
  Trash2,
  Type,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { useToast } from "@/contexts/toast-context"
import { buildProbabilityStats } from "@/lib/giveaway-utils"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { useSettingsStore } from "@/stores/settings-store"
import {
  useWheelManagerStore,
  type WeightedWheelData,
  type WeightedWheelEntry,
} from "@/stores/wheel-manager-store"
import type { WheelSettings } from "@/types/settings"

type SidebarTab = "inputs" | "text" | "style" | "other"
type ActionMode = "normal" | "elimination" | "manual"

const TABS: { id: SidebarTab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <List className="h-4 w-4" /> },
  { id: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { id: "style", label: "Style", icon: <Palette className="h-4 w-4" /> },
  { id: "other", label: "Other", icon: <MoreVertical className="h-4 w-4" /> },
]

const FALLBACK_COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#14b8a6",
  "#22c55e",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#ec4899",
]

interface WeightedInputPanelProps {
  actionMode?: ActionMode
  onActionModeChange?: (mode: ActionMode) => void
  onHideInputs?: () => void
  onOpenSettings?: () => void
  onToggleFullscreen?: () => void
  onOpenAnalytics?: () => void
  onOpenAchievements?: () => void
  onThemeChange?: (themeId: string) => void
  onApplyPalette?: (colors: readonly string[]) => void
  currentTheme?: string
  themes?: typeof PICKER_WHEEL_THEMES
}

export default function WeightedInputPanel({
  actionMode = "normal",
  onActionModeChange,
  onHideInputs,
  onOpenSettings,
  onToggleFullscreen,
  onOpenAnalytics,
  onThemeChange,
  onApplyPalette,
  currentTheme = "classic",
  themes = PICKER_WHEEL_THEMES,
}: WeightedInputPanelProps) {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("inputs")
  const [bulkText, setBulkText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const { settings, updateSettings } = useSettingsStore()
  const { showToast } = useToast()
  const wheel = useWheelManagerStore((state) => {
    const wheels = state.wheelsByTool[state.currentTool] || []
    return wheels.find((item) => item.id === state.currentWheelId) || null
  })
  const data = (wheel?.data as WeightedWheelData | undefined) ?? {
    entries: [],
    viewMode: "wheel",
    actionMode: "normal",
    isSpinning: false,
    spinRotation: 0,
    selectedResult: null,
    totalSpins: 0,
    recentResults: [],
  }
  const entries = data.entries || []
  const stats = useMemo(() => buildProbabilityStats(entries), [entries])
  const percentages = useMemo(
    () => new Map(stats.map((stat) => [stat.name, stat.probability])),
    [stats],
  )
  const exportText = entries.map((entry) => `${entry.name}, ${entry.weight}`).join("\n")
  const filteredEntries = searchQuery.trim()
    ? entries.filter((entry) => entry.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : entries

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const setData = (partial: Partial<WeightedWheelData>) => {
    if (!wheel) return
    useWheelManagerStore
      .getState()
      .updateWheelData("weighted-wheel", wheel.id, { ...data, ...partial })
  }
  const setEntries = (next: WeightedWheelEntry[]) => setData({ entries: next })
  const updateEntry = (id: string, patch: Partial<WeightedWheelEntry>) =>
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)))
  const addEntry = () =>
    setEntries([
      ...entries,
      {
        id: `weighted-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: `Option ${entries.length + 1}`,
        weight: 1,
        color: FALLBACK_COLORS[entries.length % FALLBACK_COLORS.length],
        enabled: true,
      },
    ])
  const equalize = () => {
    setEntries(entries.map((entry) => ({ ...entry, weight: 1 })))
    showToast("All entries now have equal odds", "success")
  }
  const shuffle = () => setEntries([...entries].sort(() => Math.random() - 0.5))
  const clear = () => {
    setEntries([])
    showToast("Cleared all entries", "success")
  }
  const removeBlanks = () => setEntries(entries.filter((entry) => entry.name.trim()))
  const removeDuplicates = () => {
    const seen = new Set<string>()
    setEntries(
      entries.filter((entry) => {
        const key = entry.name.trim().toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }),
    )
  }
  const sortZA = () => setEntries([...entries].sort((a, b) => b.name.localeCompare(a.name)))
  const applyPalette = (colors: readonly string[]) => {
    setEntries(
      entries.map((entry, index) => ({ ...entry, color: colors[index % colors.length] })),
    )
    onApplyPalette?.(colors)
    showToast("Palette applied", "success")
  }
  const applyBulkText = () => {
    const parsed = bulkText
      .split(/\r?\n/)
      .reduce<WeightedWheelEntry[]>((result, line, index) => {
        const comma = line.lastIndexOf(",")
        const name = (comma >= 0 ? line.slice(0, comma) : line).trim()
        const parsedWeight = comma >= 0 ? Number(line.slice(comma + 1).trim()) : 1
        if (!name) return result
        result.push({
          id: `weighted-${Date.now()}-${index}`,
          name,
          weight: Math.max(1, Number.isFinite(parsedWeight) ? parsedWeight : 1),
          color: entries[index]?.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
          enabled: true,
        })
        return result
      }, [])
    if (!parsed.length) {
      showToast("Add at least one entry", "error")
      return
    }
    setEntries(parsed)
    showToast(`Applied ${parsed.length} weighted entries`, "success")
  }
  const syncActionMode = (mode: ActionMode) => {
    setData({ actionMode: mode })
    onActionModeChange?.(mode)
    if (mode !== "manual") {
      updateSettings({
        spinBehavior: {
          ...settings.spinBehavior,
          removeWinnerAfterSpin: mode === "elimination",
        },
      } as any)
    }
  }
  const download = () => {
    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "weighted-wheel.txt"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-slate-50/80 px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">Weighted Controls</p>
          <p className="text-xs text-slate-500">{stats.length} active entries</p>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={shuffle} title="Shuffle">
            <Shuffle className="h-4 w-4" />
          </Button>
          {onHideInputs && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onHideInputs}
              title="Hide inputs"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          )}
          <SlicesManageMenu
            settings={settings as unknown as WheelSettings}
            onUpdateSettings={(partial) => {
              updateSettings(partial as any)
              if (partial.spinBehavior && "removeWinnerAfterSpin" in partial.spinBehavior) {
                syncActionMode(partial.spinBehavior.removeWinnerAfterSpin ? "elimination" : "normal")
              }
            }}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSortZA={sortZA}
            onShuffle={shuffle}
            onEqualize={equalize}
            onDeleteBlanks={removeBlanks}
            onRemoveDuplicates={removeDuplicates}
            onClearAll={clear}
          />
        </div>
      </div>

      <div className="flex shrink-0 overflow-x-auto border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (tab.id === "text") setBulkText(exportText)
              setSidebarTab(tab.id)
            }}
            className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium ${
              sidebarTab === tab.id
                ? "border-b-2 border-violet-600 bg-violet-50 text-violet-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3">
        {sidebarTab === "inputs" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Action Mode</Label>
              <Select value={actionMode} onValueChange={(value) => syncActionMode(value as ActionMode)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="elimination">Elimination</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>View</Label>
              <div className="flex gap-2">
                {(["wheel", "list", "text"] as const).map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    size="sm"
                    variant={data.viewMode === mode ? "default" : "outline"}
                    className="flex-1 capitalize"
                    onClick={() => setData({ viewMode: mode })}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button type="button" size="sm" onClick={addEntry}>
                <Plus className="mr-1 h-4 w-4" /> Add entry
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={equalize}>
                Equalize
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={equalize}>
                Reset equal odds
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={shuffle}>
                <Shuffle className="mr-1 h-4 w-4" /> Shuffle
              </Button>
            </div>

            <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">
                Probability summary
              </p>
              <p className="mt-1 text-xs text-violet-700">
                {stats.length
                  ? `${stats.length} active outcomes · percentages total ${stats.reduce((sum, stat) => sum + stat.probability, 0).toFixed(0)}%`
                  : "Enable at least one named entry."}
              </p>
            </div>

            <div className="space-y-2">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-1.5 rounded-md border px-1.5 py-1 ${
                    entry.enabled === false ? "bg-slate-50 opacity-60" : "bg-white"
                  }`}
                >
                  <Input
                    value={entry.name}
                    onChange={(event) => updateEntry(entry.id, { name: event.target.value })}
                    className="h-8 min-w-0 flex-1 text-sm font-medium"
                  />
                  <div className="flex shrink-0 items-center overflow-hidden rounded-md border">
                    <button
                      type="button"
                      className="flex h-8 w-7 items-center justify-center hover:bg-slate-50"
                      onClick={() => updateEntry(entry.id, { weight: Math.max(1, entry.weight - 1) })}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      step="any"
                      value={entry.weight}
                      onChange={(event) =>
                        updateEntry(entry.id, {
                          weight: Math.max(1, Number(event.target.value) || 1),
                        })
                      }
                      className="h-8 w-10 border-x text-center text-xs outline-none"
                    />
                    <button
                      type="button"
                      className="flex h-8 w-7 items-center justify-center hover:bg-slate-50"
                      onClick={() => updateEntry(entry.id, { weight: entry.weight + 1 })}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-slate-500">
                    {entry.enabled === false ? "—" : `${(percentages.get(entry.name) || 0).toFixed(1)}%`}
                  </span>
                  <label className="relative shrink-0 cursor-pointer" title="Color">
                    <span
                      className="block h-5 w-5 rounded-full border border-black/10"
                      style={{ backgroundColor: entry.color || "#8b5cf6" }}
                    />
                    <input
                      type="color"
                      value={entry.color || "#8b5cf6"}
                      onChange={(event) => updateEntry(entry.id, { color: event.target.value })}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </label>
                  <Switch
                    checked={entry.enabled !== false}
                    onCheckedChange={(enabled) => updateEntry(entry.id, { enabled })}
                    aria-label={`Enable ${entry.name}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 shrink-0 p-0 text-red-500"
                    onClick={() => setEntries(entries.filter((item) => item.id !== entry.id))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" size="sm" className="w-full text-red-600" onClick={clear}>
              Clear all
            </Button>

            {data.viewMode !== "wheel" && (
              <div className="rounded-lg border bg-slate-50 p-3">
                <h3 className="mb-2 text-sm font-semibold capitalize">{data.viewMode} view</h3>
                {data.viewMode === "list" ? (
                  <ul className="space-y-1 text-sm">
                    {stats.map((stat) => (
                      <li key={stat.name} className="flex justify-between">
                        <span>{stat.name}</span><span>{stat.probability.toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="whitespace-pre-wrap text-sm">{exportText || "No entries"}</p>
                )}
              </div>
            )}
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-3">
            <div>
              <Label>Weighted entries</Label>
              <p className="mt-1 text-xs text-slate-500">
                One entry per line in <code>Name, weight</code> format.
              </p>
            </div>
            <Textarea
              value={bulkText}
              onChange={(event) => setBulkText(event.target.value)}
              rows={14}
              className="font-mono text-sm"
              placeholder={"Common, 50\nRare, 15\nLegendary, 5"}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={applyBulkText}>Apply</Button>
              <Button type="button" variant="outline" onClick={() => setBulkText(exportText)}>
                Load current
              </Button>
              <Button type="button" variant="outline" onClick={download}>Export</Button>
            </div>
          </div>
        )}

        {sidebarTab === "style" && (
          <div className="space-y-5">
            <div>
              <Label>Color palettes</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {LETTER_COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => applyPalette(palette.colors)}
                    className="rounded-lg border p-2 text-left hover:border-violet-300 hover:bg-violet-50"
                  >
                    <span className="block text-xs font-semibold">{palette.name}</span>
                    <span className="mt-1 flex gap-0.5">
                      {palette.colors.slice(0, 6).map((color) => (
                        <span key={color} className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Themes</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    disabled={!theme.unlocked}
                    onClick={() => onThemeChange?.(theme.id)}
                    className={`rounded-lg border p-2 text-left ${
                      currentTheme === theme.id ? "border-violet-400 bg-violet-50" : "border-slate-200"
                    } disabled:opacity-40`}
                  >
                    <span className="block truncate text-xs font-semibold">{theme.name}</span>
                    <span className="mt-1 flex gap-0.5">
                      {theme.colors.slice(0, 6).map((color) => (
                        <span key={color} className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {sidebarTab === "other" && (
          <div className="space-y-4">
            <div className="space-y-3 rounded-lg border bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">Confetti</p><p className="text-xs text-slate-500">Celebrate results</p></div>
                <Switch
                  checked={settings.confettiSound?.enableConfetti ?? true}
                  onCheckedChange={(enableConfetti) =>
                    updateSettings({ confettiSound: { ...settings.confettiSound, enableConfetti } } as any)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">Sound</p><p className="text-xs text-slate-500">Play spin and result sounds</p></div>
                <Switch
                  checked={settings.confettiSound?.enableSound ?? true}
                  onCheckedChange={(enableSound) =>
                    updateSettings({ confettiSound: { ...settings.confettiSound, enableSound } } as any)
                  }
                />
              </div>
            </div>
            <SidebarOtherOptions
              toolLabel="Weighted entries"
              resultsCount={data.recentResults?.length || 0}
              exportFileName="weighted-wheel.txt"
              exportText={exportText}
              entries={entries}
              onImportText={(text) => {
                setBulkText(text)
                setSidebarTab("text")
              }}
              onRemoveDuplicates={removeDuplicates}
              onViewResults={() => window.dispatchEvent(new Event("open-weighted-results"))}
              onOpenSettings={onOpenSettings}
              onToggleFullscreen={onToggleFullscreen}
              onOpenAnalytics={onOpenAnalytics}
            />
          </div>
        )}
      </div>
    </div>
  )
}
