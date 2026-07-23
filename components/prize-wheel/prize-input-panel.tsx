"use client"

import { useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { EyeOff, ImagePlus, List, MoreVertical, Palette, Plus, Shuffle, Trash2, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { useToast } from "@/contexts/toast-context"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore, type PrizeWheelData, type PrizeWheelEntry } from "@/stores/wheel-manager-store"
import type { WheelSettings } from "@/types/settings"

type Tab = "inputs" | "text" | "style" | "other"
type ActionMode = "normal" | "elimination" | "manual"
const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <List className="h-4 w-4" /> },
  { id: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { id: "style", label: "Style", icon: <Palette className="h-4 w-4" /> },
  { id: "other", label: "Other", icon: <MoreVertical className="h-4 w-4" /> },
]
const COLORS = ["#f59e0b", "#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f97316"]
type Props = {
  actionMode?: ActionMode; onActionModeChange?: (mode: ActionMode) => void; onHideInputs?: () => void
  onOpenSettings?: () => void; onToggleFullscreen?: () => void; onOpenAnalytics?: () => void
  onThemeChange?: (themeId: string) => void; currentTheme?: string; themes?: typeof PICKER_WHEEL_THEMES
}

export default function PrizeInputPanel({
  actionMode = "normal", onActionModeChange, onHideInputs, onOpenSettings,
  onToggleFullscreen, onOpenAnalytics, onThemeChange, currentTheme = "classic",
  themes = PICKER_WHEEL_THEMES,
}: Props) {
  const [tab, setTab] = useState<Tab>("inputs")
  const [bulkText, setBulkText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const { settings, updateSettings } = useSettingsStore()
  const { showToast } = useToast()
  const wheel = useWheelManagerStore((state) =>
    (state.wheelsByTool[state.currentTool] || []).find((item) => item.id === state.currentWheelId) || null)
  const data = (wheel?.data as PrizeWheelData | undefined) ?? {
    entries: [], viewMode: "wheel", isSpinning: false, spinRotation: 0,
    selectedResult: null, totalSpins: 0, recentResults: [],
  }
  const entries = data.entries || []
  const exportText = entries.map((entry) => entry.winMessage ? `${entry.name} | ${entry.winMessage}` : entry.name).join("\n")
  const filtered = searchQuery.trim()
    ? entries.filter((entry) => entry.name.toLowerCase().includes(searchQuery.trim().toLowerCase())) : entries
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const setData = (partial: Partial<PrizeWheelData>) => {
    if (wheel) useWheelManagerStore.getState().updateWheelData("prize-wheel", wheel.id, { ...data, ...partial })
  }
  const setEntries = (next: PrizeWheelEntry[]) => setData({ entries: next })
  const updateEntry = (id: string, patch: Partial<PrizeWheelEntry>) =>
    setEntries(entries.map((entry) => entry.id === id ? { ...entry, ...patch } : entry))
  const addEntry = () => setEntries([...entries, {
    id: `prize-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: `Prize ${entries.length + 1}`, color: COLORS[entries.length % COLORS.length], enabled: true,
  }])
  const shuffle = () => setEntries([...entries].sort(() => Math.random() - 0.5))
  const clear = () => { setEntries([]); showToast("Cleared all prizes", "success") }
  const removeBlanks = () => setEntries(entries.filter((entry) => entry.name.trim()))
  const removeDuplicates = () => {
    const seen = new Set<string>()
    setEntries(entries.filter((entry) => {
      const key = entry.name.trim().toLowerCase()
      if (!key || seen.has(key)) return false
      seen.add(key); return true
    }))
  }
  const applyPalette = (colors: readonly string[]) => {
    setEntries(entries.map((entry, index) => ({ ...entry, color: colors[index % colors.length] })))
    showToast("Palette applied", "success")
  }
  const applyBulkText = () => {
    const next = bulkText.split(/\r?\n/).reduce<PrizeWheelEntry[]>((all, line, index) => {
      const [namePart, ...messageParts] = line.split("|")
      const name = namePart.trim()
      if (name) all.push({
        id: `prize-${Date.now()}-${index}`, name, winMessage: messageParts.join("|").trim() || undefined,
        color: entries[index]?.color || COLORS[index % COLORS.length], enabled: true,
      })
      return all
    }, [])
    if (!next.length) return showToast("Add at least one prize", "error")
    setEntries(next); showToast(`Applied ${next.length} prizes`, "success")
  }
  const syncActionMode = (mode: ActionMode) => {
    setData({ actionMode: mode }); onActionModeChange?.(mode)
    if (mode !== "manual") updateSettings({ spinBehavior: {
      ...settings.spinBehavior, removeWinnerAfterSpin: mode === "elimination",
    } } as any)
  }

  return <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
    <div className="flex items-center justify-between gap-2 border-b bg-slate-50/80 px-3 py-2">
      <div><p className="text-sm font-semibold text-slate-800">Prize Controls</p>
        <p className="text-xs text-slate-500">{entries.filter((entry) => entry.enabled !== false).length} active prizes</p></div>
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={shuffle} title="Shuffle"><Shuffle className="h-4 w-4" /></Button>
        {onHideInputs && <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onHideInputs} title="Hide inputs"><EyeOff className="h-4 w-4" /></Button>}
        <SlicesManageMenu settings={settings as unknown as WheelSettings}
          onUpdateSettings={(partial) => {
            updateSettings(partial as any)
            if (partial.spinBehavior && "removeWinnerAfterSpin" in partial.spinBehavior)
              syncActionMode(partial.spinBehavior.removeWinnerAfterSpin ? "elimination" : "normal")
          }}
          searchQuery={searchQuery} onSearchQueryChange={setSearchQuery}
          onSortZA={() => setEntries([...entries].sort((a, b) => b.name.localeCompare(a.name)))}
          onShuffle={shuffle} onEqualize={() => showToast("Prize entries always use equal odds", "success")}
          onDeleteBlanks={removeBlanks} onRemoveDuplicates={removeDuplicates} onClearAll={clear} />
      </div>
    </div>
    <div className="flex shrink-0 overflow-x-auto border-b">{TABS.map((item) => <button key={item.id}
      type="button" onClick={() => { if (item.id === "text") setBulkText(exportText); setTab(item.id) }}
      className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium ${tab === item.id ? "border-b-2 border-amber-500 bg-amber-50 text-amber-800" : "text-slate-500"}`}>
      {item.icon}{item.label}</button>)}</div>
    <div className="min-h-0 flex-1 overflow-y-auto p-3">
      {tab === "inputs" && <div className="space-y-4">
        <div className="space-y-2"><Label>Action Mode</Label>
          <Select value={actionMode} onValueChange={(value) => syncActionMode(value as ActionMode)}>
            <SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="elimination">Elimination — remove winner</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select></div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          All enabled prizes have equal odds. Need unequal probabilities?{" "}
          <Link href="/weighted-wheel-spinner" className="font-semibold underline">Use Weighted Wheel Spinner.</Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" onClick={addEntry}><Plus className="mr-1 h-4 w-4" /> Add</Button>
          <Button size="sm" variant="outline" onClick={shuffle}><Shuffle className="mr-1 h-4 w-4" /> Shuffle</Button>
          <Button size="sm" variant="outline" className="text-red-600" onClick={clear}>Clear</Button>
        </div>
        <div className="space-y-3">{filtered.map((entry) => <div key={entry.id}
          className={`space-y-2 rounded-lg border p-2 ${entry.enabled === false ? "bg-slate-50 opacity-60" : "bg-white"}`}>
          <div className="flex items-center gap-2">
            <Input value={entry.name} onChange={(event) => updateEntry(entry.id, { name: event.target.value })}
              className="h-8 min-w-0 flex-1 font-medium" />
            <label className="relative shrink-0 cursor-pointer" title="Color"><span className="block h-6 w-6 rounded-full border"
              style={{ backgroundColor: entry.color || COLORS[0] }} /><input type="color" value={entry.color || COLORS[0]}
              onChange={(event) => updateEntry(entry.id, { color: event.target.value })} className="absolute inset-0 opacity-0" /></label>
            <Switch checked={entry.enabled !== false} onCheckedChange={(enabled) => updateEntry(entry.id, { enabled })} />
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500"
              onClick={() => setEntries(entries.filter((item) => item.id !== entry.id))}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <Input value={entry.winMessage || ""} onChange={(event) => updateEntry(entry.id, { winMessage: event.target.value })}
            className="h-8 text-xs" placeholder="Optional winner message" />
          <div className="flex items-center gap-2">
            {entry.imageUrl && <Image src={entry.imageUrl} alt="" width={40} height={40} unoptimized className="h-10 w-10 rounded object-cover" />}
            <label className="flex cursor-pointer items-center rounded-md border px-2 py-1.5 text-xs hover:bg-slate-50">
              <ImagePlus className="mr-1 h-4 w-4" /> {entry.imageUrl ? "Replace image" : "Add image"}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  if (entry.imageUrl?.startsWith("blob:")) URL.revokeObjectURL(entry.imageUrl)
                  updateEntry(entry.id, { imageUrl: URL.createObjectURL(file) })
                }
                event.currentTarget.value = ""
              }} />
            </label>
            {entry.imageUrl && <Button type="button" variant="ghost" size="sm" className="h-8 text-xs"
              onClick={() => { if (entry.imageUrl?.startsWith("blob:")) URL.revokeObjectURL(entry.imageUrl); updateEntry(entry.id, { imageUrl: undefined }) }}>
              Remove image</Button>}
          </div>
        </div>)}</div>
      </div>}
      {tab === "text" && <div className="space-y-3">
        <div><Label>Bulk prizes</Label><p className="mt-1 text-xs text-slate-500">One per line: <code>Name</code> or <code>Name | message</code>.</p></div>
        <Textarea value={bulkText} onChange={(event) => setBulkText(event.target.value)} rows={16}
          className="font-mono text-sm" placeholder={"Gift Card | Congratulations!\nFree Sample\nBonus Item | Please visit the host desk."} />
        <div className="flex gap-2"><Button onClick={applyBulkText}>Apply</Button>
          <Button variant="outline" onClick={() => setBulkText(exportText)}>Load current</Button></div>
      </div>}
      {tab === "style" && <div className="space-y-5">
        <div><Label>Color palettes</Label><div className="mt-2 grid grid-cols-2 gap-2">
          {LETTER_COLOR_PALETTES.map((palette) => <button key={palette.name} type="button" onClick={() => applyPalette(palette.colors)}
            className="rounded-lg border p-2 text-left hover:border-amber-300"><span className="block text-xs font-semibold">{palette.name}</span>
            <span className="mt-1 flex gap-0.5">{palette.colors.slice(0, 6).map((color) => <span key={color}
              className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />)}</span></button>)}
        </div></div>
        <div><Label>Themes</Label><div className="mt-2 grid grid-cols-2 gap-2">{themes.map((theme) => <button key={theme.id}
          type="button" disabled={!theme.unlocked} onClick={() => onThemeChange?.(theme.id)}
          className={`rounded-lg border p-2 text-left text-xs font-semibold ${currentTheme === theme.id ? "border-amber-400 bg-amber-50" : ""} disabled:opacity-40`}>
          {theme.name}</button>)}</div></div>
      </div>}
      {tab === "other" && <SidebarOtherOptions toolLabel="Prize entries" resultsCount={data.recentResults?.length || 0}
        exportFileName="prize-wheel.txt" exportText={exportText}
        entries={entries.map((entry) => ({ ...entry, weight: 1, enabled: entry.enabled !== false }))}
        onImportText={(text) => { setBulkText(text); setTab("text") }} onRemoveDuplicates={removeDuplicates}
        onViewResults={() => window.dispatchEvent(new Event("open-prize-results"))}
        onOpenSettings={onOpenSettings} onToggleFullscreen={onToggleFullscreen} onOpenAnalytics={onOpenAnalytics} />}
    </div>
  </div>
}
