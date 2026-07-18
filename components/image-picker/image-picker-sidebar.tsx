"use client"

import { useMemo, useState, type ReactNode, type ChangeEvent, type RefObject } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ListChecks,
  Type,
  Palette,
  MoreVertical,
  History,
  Trophy,
  Target,
  Eye,
  EyeOff,
  Shuffle,
  Upload,
  X,
} from "lucide-react"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { useSettingsStore } from "@/stores/settings-store"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import type { WheelSettings as GlobalWheelSettings } from "@/types/settings"
import type { WheelItem, WheelSettings } from "@/lib/types"

export type ImagePickerSidebarTab = "inputs" | "text" | "style" | "other"
export type ImageActionMode = "normal" | "elimination" | "accumulation"

const TABS: { id: ImagePickerSidebarTab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <ListChecks className="w-4 h-4" /> },
  { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
  { id: "style", label: "Style", icon: <Palette className="w-4 h-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="w-4 h-4" /> },
]

function colorsMatch(a: string[] | null | undefined, b: readonly string[]) {
  if (!a || a.length === 0) return false
  const n = Math.min(a.length, b.length, 3)
  for (let i = 0; i < n; i++) {
    if (a[i]?.toLowerCase() !== b[i]?.toLowerCase()) return false
  }
  return true
}

export type ImagePickerSidebarProps = {
  wheelItems: WheelItem[]
  enabledItems: WheelItem[]
  syncWheelItems: (items: WheelItem[]) => void
  wheelSettings: WheelSettings
  setWheelSettings: (settings: WheelSettings | ((prev: WheelSettings) => WheelSettings)) => void
  actionMode: ImageActionMode
  onActionModeChange: (mode: ImageActionMode) => void
  wheelTitle: string
  setWheelTitle: (v: string) => void
  wheelDescription: string
  setWheelDescription: (v: string) => void
  showTitle: boolean
  setShowTitle: (v: boolean) => void
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void
  fileInputRef: RefObject<HTMLInputElement | null>
  enableAllInputs: () => void
  disableAllInputs: () => void
  resetCounts: () => void
  removeAllInputs: () => void
  showStats: boolean
  setShowStats: (v: boolean) => void
  onApplyPalette: (colors: string[]) => void
  activePaletteColors?: string[] | null
  onOpenThemes?: () => void
  onShuffle: () => void
  onHideInputs: () => void
  onOpenTitleModal: () => void
  onViewResults: () => void
  onOpenGames?: () => void
  onOpenAchievements?: () => void
  onOpenChallenges?: () => void
  onOpenAnalytics?: () => void
  onToggleFullscreen?: () => void
  resultsCount: number
  historyCount?: number
  totalPoints?: number
}

export function ImagePickerSidebar({
  wheelItems,
  enabledItems,
  syncWheelItems,
  wheelSettings,
  setWheelSettings,
  actionMode,
  onActionModeChange,
  wheelTitle,
  setWheelTitle,
  wheelDescription,
  setWheelDescription,
  showTitle,
  setShowTitle,
  handleImageUpload,
  fileInputRef,
  enableAllInputs,
  disableAllInputs,
  resetCounts,
  removeAllInputs,
  showStats,
  setShowStats,
  onApplyPalette,
  activePaletteColors,
  onOpenThemes,
  onShuffle,
  onHideInputs,
  onOpenTitleModal,
  onViewResults,
  onOpenGames,
  onOpenAchievements,
  onOpenChallenges,
  onOpenAnalytics,
  onToggleFullscreen,
  resultsCount,
  historyCount = 0,
  totalPoints = 0,
}: ImagePickerSidebarProps) {
  const { settings, updateSettings } = useSettingsStore()
  const [sidebarTab, setSidebarTab] = useState<ImagePickerSidebarTab>("inputs")
  const [searchQuery, setSearchQuery] = useState("")
  const [textDraft, setTextDraft] = useState<string | null>(null)

  const allDisabled = wheelItems.length > 0 && wheelItems.every((item) => !item.enabled)
  const eliminatedCount = wheelItems.filter((item) => item.enabled === false).length

  const applyPalette = (colors: string[]) => {
    onApplyPalette(colors)
    updateSettings({
      appearance: {
        ...settings.appearance,
        toolColors: colors,
      },
    })
  }

  const exportText = useMemo(
    () => wheelItems.map((item) => `${item.text},${item.enabled ? "on" : "off"}`).join("\n"),
    [wheelItems],
  )

  const entries = useMemo(
    () =>
      wheelItems.map((item) => ({
        id: item.id,
        name: item.text,
        weight: 1,
        enabled: item.enabled !== false,
      })),
    [wheelItems],
  )

  const textEditorValue = useMemo(
    () => wheelItems.map((item) => item.text).join("\n"),
    [wheelItems],
  )

  const applyTextLabels = (raw: string) => {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) return

    const next = wheelItems.map((item, i) => ({
      ...item,
      text: lines[i] ?? item.text,
    }))
    // Extra lines become text-only slices (no image) so import stays useful
    const extras: WheelItem[] = lines.slice(wheelItems.length).map((text, i) => ({
      id: `text-${Date.now()}-${i}`,
      text,
      enabled: true,
      count: 0,
    }))
    syncWheelItems([...next, ...extras])
    setTextDraft(null)
  }

  const importFromText = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) return
    const next: WheelItem[] = lines.map((line, i) => {
      const parts = line.split(/[,|\t]/).map((p) => p.trim())
      const enabled = !parts.some((p) => /^(off|false|0)$/i.test(p))
      const name = parts[0] || `Image ${i + 1}`
      const existing = wheelItems[i]
      return {
        id: existing?.id || `import-${Date.now()}-${i}`,
        text: name,
        enabled,
        count: existing?.count || 0,
        imageUrl: existing?.imageUrl,
        imageFile: existing?.imageFile,
      }
    })
    syncWheelItems(next)
    setSidebarTab("inputs")
  }

  const toggleItem = (id: string) => {
    syncWheelItems(
      wheelItems.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    )
  }

  const removeItem = (id: string) => {
    syncWheelItems(wheelItems.filter((item) => item.id !== id))
  }

  const renameItem = (id: string, text: string) => {
    syncWheelItems(
      wheelItems.map((item) => (item.id === id ? { ...item, text } : item)),
    )
  }

  const sortZA = () => {
    syncWheelItems(
      [...wheelItems].sort((a, b) =>
        b.text.localeCompare(a.text, undefined, { sensitivity: "base" }),
      ),
    )
  }

  const filteredItems = searchQuery.trim()
    ? wheelItems.filter((item) =>
        item.text.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : wheelItems

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b bg-slate-50/80 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-800">Image Controls</p>
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {enabledItems.length} active
          </span>
          {eliminatedCount > 0 && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {eliminatedCount} out
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Achievements"
            onClick={onOpenAchievements}
          >
            <Trophy className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="relative h-8 w-8 p-0"
            title={`Challenges (${totalPoints} pts)`}
            onClick={onOpenChallenges}
          >
            <Target className="h-4 w-4" />
            {totalPoints > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-500 px-0.5 text-[10px] text-white">
                {totalPoints}
              </span>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="relative h-8 w-8 p-0"
            title={`Spin History (${historyCount})`}
            onClick={onViewResults}
          >
            <History className="h-4 w-4" />
            {historyCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-0.5 text-[10px] text-white">
                {historyCount}
              </span>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={showTitle ? "Hide title settings" : "Show title settings"}
            onClick={() => setShowTitle(!showTitle)}
          >
            {showTitle ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Shuffle"
            onClick={onShuffle}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Hide"
            onClick={onHideInputs}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
          <SlicesManageMenu
            settings={settings as unknown as GlobalWheelSettings}
            onUpdateSettings={(partial) => updateSettings(partial as any)}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSortZA={sortZA}
            onShuffle={onShuffle}
            onEqualize={() => {}}
            onDeleteBlanks={() =>
              syncWheelItems(wheelItems.filter((item) => item.text.trim().length > 0))
            }
            onRemoveDuplicates={() => {
              const seen = new Set<string>()
              syncWheelItems(
                wheelItems.filter((item) => {
                  const key = item.text.trim().toLowerCase()
                  if (seen.has(key)) return false
                  seen.add(key)
                  return true
                }),
              )
            }}
            onClearAll={removeAllInputs}
          />
        </div>
      </div>

      <div className="flex overflow-x-auto border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (tab.id === "text") setTextDraft(textEditorValue)
              setSidebarTab(tab.id)
            }}
            className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors ${
              sidebarTab === tab.id
                ? "border-b-2 border-emerald-600 bg-emerald-50/50 text-emerald-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-h-[70vh] overflow-y-auto p-3">
        {sidebarTab === "inputs" && (
          <div className="space-y-4">
            {showTitle && (
              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                <div className="space-y-1">
                  <Label className="text-xs">Tool Title</Label>
                  <Input
                    value={wheelTitle}
                    onChange={(e) => setWheelTitle(e.target.value)}
                    className="h-8"
                    placeholder="Image Picker Wheel"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tool Description</Label>
                  <Textarea
                    value={wheelDescription}
                    onChange={(e) => setWheelDescription(e.target.value)}
                    rows={2}
                    className="text-sm"
                    placeholder="Randomly pick a picture by wheel"
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={onOpenTitleModal}>
                  Open title modal
                </Button>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Action Mode</Label>
              <Select
                value={actionMode}
                onValueChange={(value: ImageActionMode) => onActionModeChange(value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal Mode</SelectItem>
                  <SelectItem value="elimination">Elimination Mode</SelectItem>
                  <SelectItem value="accumulation">Accumulation Mode</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-slate-400">
                Synced with Manage → Remove winner (Header Settings)
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 flex-1"
                onClick={allDisabled ? enableAllInputs : disableAllInputs}
              >
                {allDisabled ? (
                  <>
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Enable all
                  </>
                ) : (
                  <>
                    <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                    Disable all
                  </>
                )}
              </Button>
              {onOpenGames && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 flex-1"
                  onClick={onOpenGames}
                >
                  <Target className="mr-1.5 h-3.5 w-3.5" />
                  Games
                </Button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image(s)
            </Button>

            <div className="space-y-2">
              {filteredItems.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">
                  No images yet — upload pictures to build the wheel.
                </p>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-2 rounded-lg border p-2 ${
                      item.enabled ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.text}
                          className="h-9 w-9 shrink-0 rounded border object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border bg-slate-100 text-[10px] text-slate-400">
                          TXT
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 shrink-0 p-0"
                        onClick={() => toggleItem(item.id)}
                        title={item.enabled ? "Disable" : "Enable"}
                      >
                        {item.enabled ? (
                          <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-emerald-500 bg-emerald-500">
                            <div className="h-2 w-2 rounded-sm bg-white" />
                          </div>
                        ) : (
                          <div className="h-4 w-4 rounded-sm border border-slate-400" />
                        )}
                      </Button>
                      <span
                        className={`truncate text-sm ${
                          item.enabled ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {item.text}
                      </span>
                      {actionMode === "accumulation" && item.count > 0 && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {item.count}
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 shrink-0 p-0 text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={resetCounts}>
                Reset counts
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={removeAllInputs}
              >
                Remove all
              </Button>
            </div>
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-4">
            <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <div className="space-y-1">
                <Label className="text-xs">Tool Title</Label>
                <Input
                  value={wheelTitle}
                  onChange={(e) => setWheelTitle(e.target.value)}
                  className="h-8"
                  placeholder="Image Picker Wheel"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tool Description</Label>
                <Textarea
                  value={wheelDescription}
                  onChange={(e) => setWheelDescription(e.target.value)}
                  rows={2}
                  className="text-sm"
                  placeholder="Randomly pick a picture by wheel"
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={onOpenTitleModal}>
                Open title modal
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                Image labels (one per line)
              </Label>
              <Textarea
                value={textDraft ?? textEditorValue}
                onChange={(e) => setTextDraft(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => applyTextLabels(textDraft ?? textEditorValue)}
                >
                  Apply labels
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setTextDraft(textEditorValue)}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Rename individually</Label>
              {wheelItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-7 w-7 rounded border object-cover"
                    />
                  )}
                  <Input
                    value={item.text}
                    onChange={(e) => renameItem(item.id, e.target.value)}
                    className="h-8"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {sidebarTab === "style" && (
          <div className="space-y-4">
            <div className="mb-1 flex items-center justify-between">
              <Label className="text-xs text-slate-500">Color palettes</Label>
              <div className="flex items-center gap-1">
                {onOpenThemes && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={onOpenThemes}
                  >
                    Themes
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    const palette =
                      LETTER_COLOR_PALETTES[
                        Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)
                      ]
                    applyPalette([...palette.colors] as string[])
                  }}
                >
                  Randomize
                </Button>
              </div>
            </div>
            <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto">
              {LETTER_COLOR_PALETTES.map((palette) => {
                const selected = colorsMatch(activePaletteColors, palette.colors)
                return (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => applyPalette([...palette.colors] as string[])}
                    className={`flex flex-col gap-1.5 rounded-lg border p-2 text-left transition-colors ${
                      selected
                        ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-400"
                        : "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40"
                    }`}
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
                )
              })}
            </div>
          </div>
        )}

        {sidebarTab === "other" && (
          <div className="space-y-4">
            <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Show stats</p>
                  <p className="text-xs text-slate-500">Totals & percentages on the wheel</p>
                </div>
                <Switch checked={showStats} onCheckedChange={setShowStats} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Mystery mode</p>
                  <p className="text-xs text-slate-500">Hide images until after a spin</p>
                </div>
                <Switch
                  checked={!!wheelSettings.mysteryMode}
                  onCheckedChange={(checked) => {
                    setWheelSettings({ ...wheelSettings, mysteryMode: checked })
                    updateSettings({
                      spinBehavior: {
                        ...settings.spinBehavior,
                        mysterySpin: checked,
                      },
                    })
                  }}
                />
              </div>
            </div>

            <SidebarOtherOptions
              toolLabel="Image Picker Wheel"
              resultsCount={resultsCount}
              exportFileName="image-picker-labels.csv"
              exportText={exportText}
              entries={entries}
              onImportText={importFromText}
              onViewResults={onViewResults}
              onOpenAnalytics={onOpenAnalytics || onViewResults}
              onToggleFullscreen={onToggleFullscreen}
            />
          </div>
        )}
      </div>
    </div>
  )
}
