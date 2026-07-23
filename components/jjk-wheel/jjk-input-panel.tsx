"use client"

import { useMemo, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BarChart3, Brain, Eye, EyeOff, FileText, GitCompare, Heart, History, ImagePlus,
  List, MoreHorizontal, MoreVertical, Palette, Plus, RotateCcw, Shuffle, Trash2, Trophy, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { useToast } from "@/contexts/toast-context"
import { filterByCategory, getAllJjkEntries } from "@/data/jjk-characters"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import { JJK_WHEEL_USE_CASES, type JjkWheelUseCaseId } from "@/lib/jjk-wheel-use-cases"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore, type JjkWheelData } from "@/stores/wheel-manager-store"
import type { ActionMode, DisplayMode, JjkCategory, JjkEntry } from "@/types/jjk-types"
import type { WheelSettings } from "@/types/settings"
import { JjkAiTab } from "./jjk-ai-tab"

type Tab = "inputs" | "text" | "style" | "other"
type InputsSubTab = "manual" | "ai" | "stats"
type CategoryFilter = "all" | JjkCategory

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <List className="h-4 w-4" /> },
  { id: "text", label: "Text", icon: <FileText className="h-4 w-4" /> },
  { id: "style", label: "Style", icon: <Palette className="h-4 w-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="h-4 w-4" /> },
]

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "student", label: "Students" },
  { id: "teacher", label: "Teachers" },
  { id: "villain", label: "Villains" },
  { id: "cursed_spirit", label: "Spirits" },
  { id: "grade_1", label: "Grade 1" },
  { id: "special_grade", label: "Special" },
  { id: "technique", label: "Techniques" },
  { id: "domain", label: "Domains" },
  { id: "main", label: "Main" },
]

type ThemeLike = { id: string; name: string; unlocked: boolean; colors?: string[]; description?: string }

type Props = {
  actionMode: ActionMode
  onActionModeChange: (mode: ActionMode) => void
  onApplyTemplate: (id: JjkWheelUseCaseId) => void
  onHideInputs?: () => void
  onOpenSettings?: () => void
  onToggleFullscreen?: () => void
  onThemeChange?: (id: string) => void
  currentTheme?: string
  themes?: ThemeLike[]
  onOpenAchievements?: () => void
  onOpenAnalytics?: () => void
  onViewHistory?: () => void
  resultsCount?: number
  /** Desktop only: match left wheel column height; keeps inner scroll. */
  desktopMaxHeight?: number | null
}

export default function JjkInputPanel({
  actionMode, onActionModeChange, onApplyTemplate, onHideInputs, onOpenSettings,
  onToggleFullscreen, onThemeChange, currentTheme = "classic",
  themes = PICKER_WHEEL_THEMES, onOpenAchievements, onOpenAnalytics,
  onViewHistory, resultsCount = 0, desktopMaxHeight = null,
}: Props) {
  const [tab, setTab] = useState<Tab>("inputs")
  const [inputsSubTab, setInputsSubTab] = useState<InputsSubTab>("manual")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [query, setQuery] = useState("")
  const [customName, setCustomName] = useState("")
  const [customEmoji, setCustomEmoji] = useState("✨")
  const [bulkText, setBulkText] = useState("")
  const [showFavorites, setShowFavorites] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [previewEntry, setPreviewEntry] = useState<JjkEntry | null>(null)
  const { settings, updateSettings } = useSettingsStore()
  const { showToast } = useToast()
  const wheel = useWheelManagerStore((state) =>
    (state.wheelsByTool["jjk-wheel"] || []).find((item) => item.id === state.currentWheelId) || null)
  const data = wheel?.data as JjkWheelData | undefined
  const selected = data?.selectedCharacters || []
  const custom = data?.customCharacters || []
  const favorites = data?.favoriteCharacters || []
  const comparison = data?.comparisonCharacters || []
  const showTitle = data?.showTitle !== false
  const displayMode = data?.displayMode || "emoji-name"
  const entries = useMemo(() => [...getAllJjkEntries(), ...custom], [custom])
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    return entries.filter((item) => {
      if (categoryFilter !== "all" && !item.category.includes(categoryFilter)) return false
      if (value && !item.name.toLowerCase().includes(value)) return false
      return true
    })
  }, [categoryFilter, entries, query])

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of entries.filter((entry) => selected.includes(entry.id))) {
      for (const category of item.category) counts[category] = (counts[category] || 0) + 1
    }
    return counts
  }, [entries, selected])

  const resultStats = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of data?.recentResults || []) counts[item.name] = (counts[item.name] || 0) + 1
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [data?.recentResults])

  const exportText = entries.filter((item) => selected.includes(item.id)).map((item) => item.name).join("\n")

  const setData = (partial: Partial<JjkWheelData>) => {
    if (!wheel || !data) return
    useWheelManagerStore.getState().updateWheelData("jjk-wheel", wheel.id, { ...data, ...partial })
  }
  const setSelected = (ids: string[]) => setData({ selectedCharacters: ids, characterOrder: ids })
  const toggle = (id: string) => setSelected(selected.includes(id)
    ? selected.filter((item) => item !== id)
    : [...selected, id])
  const shuffle = () => setData({ characterOrder: [...selected].sort(() => Math.random() - 0.5) })
  const sortAZ = () => setData({
    characterOrder: [...selected].sort((a, b) =>
      (entries.find((item) => item.id === a)?.name || a).localeCompare(entries.find((item) => item.id === b)?.name || b)),
  })
  const sortZA = () => setData({
    characterOrder: [...selected].sort((a, b) =>
      (entries.find((item) => item.id === b)?.name || b).localeCompare(entries.find((item) => item.id === a)?.name || a)),
  })
  const addRandom = () => {
    const pool = entries.filter((item) => !selected.includes(item.id))
    if (!pool.length) return showToast("All catalog entries are already selected", "info")
    const pick = pool[Math.floor(Math.random() * pool.length)]
    setSelected([...selected, pick.id])
    showToast(`Added ${pick.name}`, "success")
  }
  const removeDuplicates = () => {
    const seen = new Set<string>()
    const ids = entries.filter((item) => {
      const key = item.name.trim().toLowerCase()
      if (!key || seen.has(key)) return false
      seen.add(key); return selected.includes(item.id)
    }).map((item) => item.id)
    setSelected(ids)
  }
  const addCustom = (preset?: Partial<JjkEntry>) => {
    const name = (preset?.name || customName).trim()
    if (!name) return showToast("Enter a character name", "error")
    if (entries.some((item) => item.name.toLowerCase() === name.toLowerCase()))
      return showToast("That entry already exists", "error")
    const item: JjkEntry = {
      id: preset?.id || `jjk-custom-${Date.now()}`, name,
      emoji: preset?.emoji || customEmoji.trim() || "✨",
      category: preset?.category || ["main"], custom: true,
      preview: `/placeholder.svg?text=${encodeURIComponent(name)}`,
    }
    setData({
      customCharacters: [...custom, item],
      selectedCharacters: [...selected, item.id],
      characterOrder: [...(data?.characterOrder || selected), item.id],
    })
    setCustomName(""); setCustomEmoji("✨")
  }
  const updateCustom = (id: string, patch: Partial<JjkEntry>) =>
    setData({ customCharacters: custom.map((item) => item.id === id ? { ...item, ...patch } : item) })
  const removeCustom = (id: string) => setData({
    customCharacters: custom.filter((item) => item.id !== id),
    selectedCharacters: selected.filter((item) => item !== id),
    characterOrder: (data?.characterOrder || []).filter((item) => item !== id),
  })
  const syncAction = (mode: ActionMode) => {
    onActionModeChange(mode)
    if (mode !== "manual") updateSettings({ spinBehavior: {
      ...settings.spinBehavior, removeWinnerAfterSpin: mode === "elimination",
    } } as any)
  }
  const applyBulkText = () => {
    const names = bulkText.split(/\r?\n/).map((line) => line.trim().toLowerCase()).filter(Boolean)
    if (!names.length) return showToast("Paste one name per line", "error")
    const matched = entries.filter((item) => names.includes(item.name.toLowerCase())).map((item) => item.id)
    setSelected(matched)
    showToast(`Selected ${matched.length} matching entries`, "success")
  }
  const toggleFavorite = (entry: JjkEntry) => {
    const exists = favorites.some((item) => item.id === entry.id)
    setData({
      favoriteCharacters: exists
        ? favorites.filter((item) => item.id !== entry.id)
        : [...favorites, entry],
    })
  }
  const toggleComparison = (entry: JjkEntry) => {
    const exists = comparison.some((item) => item.id === entry.id)
    if (!exists && comparison.length >= 4) return showToast("Compare up to 4 entries", "info")
    setData({
      comparisonCharacters: exists
        ? comparison.filter((item) => item.id !== entry.id)
        : [...comparison, entry],
    })
  }
  const applyPalette = (colors: readonly string[]) => {
    setData({ paletteColors: [...colors] })
    showToast("Palette applied", "success")
  }

  return <div
    className="flex max-h-[min(70vh,36rem)] min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-white shadow-sm"
    style={desktopMaxHeight != null ? { maxHeight: desktopMaxHeight } : undefined}
  >
    <div className="flex shrink-0 items-center justify-between gap-1 border-b bg-violet-50/70 px-2 py-2 sm:gap-2 sm:px-3">
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">JJK Wheel Controls</p>
        <span className="shrink-0 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 sm:px-2 sm:text-xs">
          {selected.length} selected
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Button type="button" variant="ghost" size="sm"
          className={`h-7 w-7 p-0 sm:h-8 sm:w-8 ${favorites.length ? "text-red-500" : ""}`}
          title="Favorites" onClick={() => setShowFavorites(true)}>
          <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm"
          className={`h-7 w-7 p-0 sm:h-8 sm:w-8 ${comparison.length ? "text-blue-500" : ""}`}
          title="Comparison" onClick={() => setShowComparison(true)}>
          <GitCompare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
        {onOpenAchievements && (
          <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 sm:h-8 sm:w-8"
            title="Achievements" onClick={onOpenAchievements}>
            <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        )}
        {onViewHistory && (
          <Button type="button" variant="ghost" size="sm" className="relative h-7 w-7 p-0 sm:h-8 sm:w-8"
            title={`Spin History (${resultsCount})`} onClick={onViewHistory}>
            <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {resultsCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-0.5 text-[10px] text-white">
                {resultsCount}
              </span>
            )}
          </Button>
        )}
        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 sm:h-8 sm:w-8"
          title="Shuffle" onClick={shuffle}>
          <Shuffle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
        {onHideInputs && (
          <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 sm:h-8 sm:w-8"
            title="Hide" onClick={onHideInputs}>
            <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        )}
        <SlicesManageMenu settings={settings as unknown as WheelSettings}
          onUpdateSettings={(partial) => {
            updateSettings(partial as any)
            if (partial.spinBehavior && "removeWinnerAfterSpin" in partial.spinBehavior) {
              syncAction(partial.spinBehavior.removeWinnerAfterSpin ? "elimination" : "normal")
            }
          }}
          searchQuery={query} onSearchQueryChange={setQuery}
          onSortZA={sortZA} onShuffle={shuffle}
          onEqualize={() => showToast("JJK entries always use equal odds", "success")}
          onDeleteBlanks={() => {
            const blanks = custom.filter((item) => !item.name.trim()).map((item) => item.id)
            if (!blanks.length) return showToast("No blank entries", "info")
            setData({
              customCharacters: custom.filter((item) => item.name.trim()),
              selectedCharacters: selected.filter((id) => !blanks.includes(id)),
              characterOrder: (data?.characterOrder || []).filter((id) => !blanks.includes(id)),
            })
          }}
          onRemoveDuplicates={removeDuplicates}
          onClearAll={() => setSelected([])} />
      </div>
    </div>

    <div className="flex shrink-0 overflow-x-auto border-b">
      {TABS.map((item) => (
        <button key={item.id} type="button"
          onClick={() => {
            if (item.id === "text") setBulkText(exportText)
            setTab(item.id)
          }}
          className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium ${
            tab === item.id ? "border-b-2 border-violet-600 bg-violet-50 text-violet-800" : "text-slate-500"
          }`}>
          {item.icon}{item.label}
        </button>
      ))}
    </div>

    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2.5 sm:p-3">
      {tab === "inputs" && <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Action Mode</Label>
          <Select value={actionMode} onValueChange={(value) => syncAction(value as ActionMode)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal Mode</SelectItem>
              <SelectItem value="elimination">Elimination Mode</SelectItem>
              <SelectItem value="manual">Manual Mode</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">
            Elimination removes the winner after each spin. Manual lets you type an entry under the wheel. Synced with Game Mode and Header Settings → Remove Winner.
          </p>
        </div>

        <div className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {([
            { id: "manual" as const, label: "Manual", icon: null },
            { id: "ai" as const, label: "AI", icon: <Brain className="h-3.5 w-3.5" /> },
            { id: "stats" as const, label: "Stats", icon: <BarChart3 className="h-3.5 w-3.5" /> },
          ]).map((item) => (
            <Button key={item.id} type="button" size="sm" variant={inputsSubTab === item.id ? "default" : "ghost"}
              className="flex-1 gap-1" onClick={() => setInputsSubTab(item.id)}>
              {item.icon}{item.label}
            </Button>
          ))}
        </div>

        {inputsSubTab === "manual" && <>
          <div><Label>Template</Label>
            <Select onValueChange={(value) => onApplyTemplate(value as JjkWheelUseCaseId)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Choose a JJK template" /></SelectTrigger>
              <SelectContent>{JJK_WHEEL_USE_CASES.map((item) =>
                <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-800">ENTRIES</p>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                  {selected.length} of {entries.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Preview first selected"
                  onClick={() => {
                    const first = entries.find((item) => selected.includes(item.id))
                    if (first) setPreviewEntry(first)
                    else showToast("Select an entry to preview", "info")
                  }}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Shuffle" onClick={shuffle}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Add random" onClick={addRandom}>
                  <Shuffle className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelected([])}><X className="mr-2 h-4 w-4" />Clear All</DropdownMenuItem>
                    <DropdownMenuItem onClick={sortAZ}><Shuffle className="mr-2 h-4 w-4" />Sort A-Z</DropdownMenuItem>
                    <DropdownMenuItem onClick={sortZA}><Shuffle className="mr-2 h-4 w-4" />Sort Z-A</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelected(entries.map((item) => item.id))}>Select all</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {CATEGORY_FILTERS.map((filter) => (
                <Button key={filter.id} type="button" size="sm"
                  variant={categoryFilter === filter.id ? "default" : "outline"}
                  className="h-7 px-2 text-[10px]"
                  onClick={() => {
                    setCategoryFilter(filter.id)
                    if (filter.id !== "all") setSelected(filterByCategory(filter.id).map((item) => item.id))
                  }}>
                  {filter.label}
                </Button>
              ))}
            </div>

            <div className="rounded-lg border border-violet-200 bg-violet-50 p-2 text-xs text-violet-950">
              Equal odds per entry. For unequal chances use the{" "}
              <Link href="/weighted-wheel-spinner" className="font-semibold underline">Weighted Wheel Spinner</Link>.
            </div>

            <div className="mt-3 rounded-lg border p-2">
              <Label>Add custom entry</Label>
              <div className="mt-2 flex gap-2">
                <Input value={customEmoji} onChange={(event) => setCustomEmoji(event.target.value)}
                  className="w-16 text-center" maxLength={4} aria-label="Custom emoji" />
                <Input value={customName} onChange={(event) => setCustomName(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") addCustom() }} placeholder="Character or prompt" />
                <Button size="sm" onClick={() => addCustom()}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            <Input className="mt-3" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search catalog..." />

            <div className="mt-3 space-y-2">
              {filtered.map((item) => {
                const isFav = favorites.some((fav) => fav.id === item.id)
                const inCompare = comparison.some((cmp) => cmp.id === item.id)
                return (
                  <div key={item.id} className={`rounded-lg border p-2 ${selected.includes(item.id) ? "bg-white" : "bg-slate-50 opacity-70"}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-7 text-center text-xl">{item.emoji}</span>
                      <button type="button" className="min-w-0 flex-1 truncate text-left text-sm font-medium"
                        onClick={() => setPreviewEntry(item)}>{item.name}</button>
                      <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" title="Preview"
                        onClick={() => setPreviewEntry(item)}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button type="button" variant="ghost" size="sm"
                        className={`h-7 w-7 p-0 ${isFav ? "text-red-500" : ""}`} title="Favorite"
                        onClick={() => toggleFavorite(item)}><Heart className="h-3.5 w-3.5" /></Button>
                      <Button type="button" variant="ghost" size="sm"
                        className={`h-7 w-7 p-0 ${inCompare ? "text-blue-500" : ""}`} title="Compare"
                        onClick={() => toggleComparison(item)}><GitCompare className="h-3.5 w-3.5" /></Button>
                      <Switch checked={selected.includes(item.id)} onCheckedChange={() => toggle(item.id)} />
                      {item.custom && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500"
                          onClick={() => removeCustom(item.id)}><Trash2 className="h-4 w-4" /></Button>
                      )}
                    </div>
                    {item.custom && (
                      <div className="mt-2 flex items-center gap-2 pl-9">
                        {item.imageUrl && <Image src={item.imageUrl} alt="" width={36} height={36} unoptimized className="h-9 w-9 rounded object-cover" />}
                        <label className="flex cursor-pointer items-center rounded-md border px-2 py-1 text-xs hover:bg-slate-50">
                          <ImagePlus className="mr-1 h-4 w-4" /> {item.imageUrl ? "Replace image" : "Upload image"}
                          <input type="file" accept="image/*" className="hidden" onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (file) updateCustom(item.id, { imageUrl: URL.createObjectURL(file) })
                            event.currentTarget.value = ""
                          }} />
                        </label>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>}

        {inputsSubTab === "ai" && (
          <JjkAiTab
            selectedIds={selected}
            onSelectIds={setSelected}
            customEntries={custom}
            recentResults={data?.recentResults || []}
            totalSpins={data?.totalSpins || 0}
            onAddCustom={(entry) => {
              setData({
                customCharacters: [...custom, entry],
                selectedCharacters: [...selected, entry.id],
                characterOrder: [...(data?.characterOrder || selected), entry.id],
              })
            }}
          />
        )}

        {inputsSubTab === "stats" && <div className="space-y-4">
          <div className="rounded-lg border p-3">
            <p className="text-sm font-semibold text-slate-800">Collection Stats</p>
            <p className="mt-1 text-xs text-slate-500">Total spins: {data?.totalSpins || 0}</p>
            <p className="text-xs text-slate-500">Active entries: {selected.length}</p>
            <p className="text-xs text-slate-500">Unique recent winners: {new Set((data?.recentResults || []).map((item) => item.name)).size}</p>
            <p className="text-xs text-slate-500">Favorites: {favorites.length} · Comparison: {comparison.length}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="mb-2 text-sm font-semibold text-slate-800">Category distribution</p>
            <div className="space-y-1">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex justify-between text-xs text-slate-600">
                  <span className="capitalize">{category.replace("_", " ")}</span><span>{count}</span>
                </div>
              ))}
              {!Object.keys(categoryStats).length && <p className="text-xs text-slate-500">No active entries.</p>}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <p className="mb-2 text-sm font-semibold text-slate-800">Top recent picks</p>
            <div className="space-y-1">
              {resultStats.slice(0, 8).map(([name, count]) => (
                <div key={name} className="flex justify-between text-xs text-slate-600">
                  <span className="truncate pr-2">{name}</span><span>{count}</span>
                </div>
              ))}
              {!resultStats.length && <p className="text-xs text-slate-500">Spin to collect stats.</p>}
            </div>
          </div>
        </div>}
      </div>}

      {tab === "text" && <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium text-slate-700">JJK list</Label>
          <p className="mt-1 text-xs text-slate-500">One name per line. Matching catalog names are selected.</p>
        </div>
        <Textarea value={bulkText} onChange={(event) => setBulkText(event.target.value)} rows={12}
          placeholder={"Yuji Itadori\nSatoru Gojo\nMegumi Fushiguro"} className="font-mono text-sm" />
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={applyBulkText}>Apply text</Button>
          <Button type="button" variant="outline" onClick={() => setBulkText(exportText)}>Load current</Button>
          <Button type="button" variant="outline" onClick={() => {
            const blob = new Blob([exportText], { type: "text/plain" })
            const url = URL.createObjectURL(blob)
            const anchor = document.createElement("a")
            anchor.href = url
            anchor.download = "jjk-wheel.txt"
            anchor.click()
            URL.revokeObjectURL(url)
          }}>Export</Button>
        </div>
      </div>}

      {tab === "style" && <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Display Options</Label>
          <div className="grid gap-2">
            {([
              { value: "emoji-name" as const, label: "Emoji & Name" },
              { value: "emoji" as const, label: "Emoji Only" },
              { value: "name" as const, label: "Name Only" },
            ]).map((opt) => (
              <label key={opt.value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  displayMode === opt.value ? "border-violet-400 bg-violet-50" : "border-slate-200 hover:bg-slate-50"
                }`}>
                <input type="radio" name="jjk-display" value={opt.value}
                  checked={displayMode === opt.value}
                  onChange={() => setData({ displayMode: opt.value as DisplayMode })} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
          <div>
            <p className="text-sm font-medium text-slate-800">Show title</p>
            <p className="text-xs text-slate-500">Wheel title above the spinner</p>
          </div>
          <Switch checked={showTitle} onCheckedChange={(checked) => setData({ showTitle: checked })} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">Color palettes</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => {
              const palette = LETTER_COLOR_PALETTES[Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)]
              applyPalette(palette.colors)
            }}>Randomize</Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LETTER_COLOR_PALETTES.map((palette) => (
              <button key={palette.name} type="button" onClick={() => applyPalette(palette.colors)}
                className="rounded-lg border border-slate-200 p-2 text-left hover:border-violet-300 hover:bg-violet-50/40">
                <span className="mb-1 block text-xs font-semibold text-slate-800">{palette.name}</span>
                <span className="flex gap-0.5">
                  {palette.colors.slice(0, 6).map((color) =>
                    <span key={color} className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-slate-700">Themes</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => {
              const unlocked = themes.filter((theme) => theme.unlocked)
              const pool = unlocked.length ? unlocked : themes
              const next = pool[Math.floor(Math.random() * pool.length)]
              if (next) onThemeChange?.(next.id)
            }}>Randomize</Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => {
              const locked = !theme.unlocked
              const active = currentTheme === theme.id
              const colors = theme.colors || PICKER_WHEEL_THEMES.find((item) => item.id === theme.id)?.colors || []
              return (
                <button key={theme.id} type="button" disabled={locked}
                  onClick={() => { if (!locked) onThemeChange?.(theme.id) }}
                  className={`rounded-lg border p-2 text-left ${
                    active ? "border-violet-400 bg-violet-50"
                      : locked ? "cursor-not-allowed border-slate-100 opacity-50"
                        : "border-slate-200 hover:border-violet-300"
                  }`}
                  title={locked ? `Locked — ${theme.description || ""}` : theme.description}>
                  <span className="mb-1 flex items-center justify-between gap-1">
                    <span className="truncate text-xs font-semibold text-slate-800">{theme.name}</span>
                    {locked && <span className="text-[10px] text-slate-400">Locked</span>}
                  </span>
                  <span className="flex gap-0.5">
                    {colors.slice(0, 6).map((color) =>
                      <span key={`${theme.id}-${color}`} className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>}

      {tab === "other" && <div className="space-y-4">
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Confetti</p>
              <p className="text-xs text-slate-500">Celebrate each spin result</p>
            </div>
            <Switch checked={settings.confettiSound?.enableConfetti ?? true}
              onCheckedChange={(checked) => updateSettings({
                confettiSound: { ...settings.confettiSound, enableConfetti: checked },
              } as any)} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Sound</p>
              <p className="text-xs text-slate-500">Play spin / result sounds</p>
            </div>
            <Switch checked={settings.confettiSound?.enableSound ?? true}
              onCheckedChange={(checked) => updateSettings({
                confettiSound: { ...settings.confettiSound, enableSound: checked },
              } as any)} />
          </div>
        </div>

        <SidebarOtherOptions toolLabel="JJK entries" resultsCount={resultsCount || data?.recentResults?.length || 0}
          exportFileName="jjk-wheel.txt" exportText={exportText}
          entries={entries.filter((item) => selected.includes(item.id)).map((item) => ({ id: item.id, name: item.name, weight: 1, enabled: true }))}
          onImportText={(text) => {
            setBulkText(text)
            setTab("text")
            showToast("Pasted into Text tab — tap Apply text", "info")
          }}
          onRemoveDuplicates={removeDuplicates}
          onViewResults={onViewHistory || (() => window.dispatchEvent(new Event("open-jjk-results")))}
          onOpenSettings={onOpenSettings} onToggleFullscreen={onToggleFullscreen}
          onOpenAI={() => { setTab("inputs"); setInputsSubTab("ai") }}
          onOpenAnalytics={onOpenAnalytics} />
      </div>}
    </div>

    <Dialog open={showFavorites} onOpenChange={setShowFavorites}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Favorites</DialogTitle>
          <DialogDescription>Saved JJK entries for quick access.</DialogDescription>
        </DialogHeader>
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {favorites.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-lg border px-3 py-2">
              <span>{item.emoji}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</span>
              <Button size="sm" variant="outline" onClick={() => {
                if (!selected.includes(item.id)) setSelected([...selected, item.id])
              }}>Add</Button>
              <Button size="sm" variant="ghost" className="text-red-500" onClick={() => toggleFavorite(item)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {!favorites.length && <p className="py-8 text-center text-sm text-slate-500">No favorites yet. Tap the heart on any entry.</p>}
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={showComparison} onOpenChange={setShowComparison}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comparison</DialogTitle>
          <DialogDescription>Compare up to 4 JJK entries side by side.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {comparison.map((item) => (
            <div key={item.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-2xl">{item.emoji}</p>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{item.category.join(", ").replaceAll("_", " ")}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toggleComparison(item)}><X className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {!comparison.length && <p className="col-span-full py-8 text-center text-sm text-slate-500">Add entries with the compare icon.</p>}
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={!!previewEntry} onOpenChange={(open) => { if (!open) setPreviewEntry(null) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{previewEntry?.emoji} {previewEntry?.name}</DialogTitle>
          <DialogDescription>Entry details</DialogDescription>
        </DialogHeader>
        {previewEntry && (
          <div className="space-y-3">
            {previewEntry.imageUrl && (
              <Image src={previewEntry.imageUrl} alt="" width={160} height={160} unoptimized
                className="mx-auto h-40 w-40 rounded-lg object-cover" />
            )}
            <p className="text-sm text-slate-600 capitalize">
              Categories: {previewEntry.category.join(", ").replaceAll("_", " ")}
            </p>
            {previewEntry.school && <p className="text-sm text-slate-600">School: {previewEntry.school}</p>}
            {previewEntry.clan && <p className="text-sm text-slate-600">Clan: {previewEntry.clan}</p>}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => {
                if (!selected.includes(previewEntry.id)) setSelected([...selected, previewEntry.id])
                setPreviewEntry(null)
              }}>Enable on wheel</Button>
              <Button size="sm" variant="outline" onClick={() => toggleFavorite(previewEntry)}>
                {favorites.some((item) => item.id === previewEntry.id) ? "Unfavorite" : "Favorite"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => toggleComparison(previewEntry)}>
                {comparison.some((item) => item.id === previewEntry.id) ? "Remove compare" : "Add to compare"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </div>
}
