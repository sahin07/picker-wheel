"use client"

import { useMemo, useState, type ReactNode } from "react"
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
  Brain,
  Settings,
  History,
  Trophy,
  Target,
  Eye,
  EyeOff,
  Shuffle,
} from "lucide-react"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import { useSettingsStore } from "@/stores/settings-store"
import type { WheelSettings } from "@/types/settings"

export type YesNoSidebarTab = "inputs" | "text" | "style" | "other"
export type YesNoControlMode = "manual" | "ai"
export type YesNoWheelMode = "yes-no" | "yes-no-maybe"
export type YesNoActionMode = "normal" | "elimination"
export type YesNoOptionKey = "yes" | "no" | "maybe"

export type YesNoOptionLabels = {
  yes: string
  no: string
  maybe: string
}

const TABS: { id: YesNoSidebarTab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <ListChecks className="w-4 h-4" /> },
  { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
  { id: "style", label: "Style", icon: <Palette className="w-4 h-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="w-4 h-4" /> },
]

export type YesNoPickerSidebarProps = {
  controlMode: YesNoControlMode
  setControlMode: (mode: YesNoControlMode) => void
  mode: YesNoWheelMode
  setMode: (mode: YesNoWheelMode) => void
  actionMode: YesNoActionMode
  onActionModeChange: (mode: YesNoActionMode) => void
  inputSets: number
  setInputSets: (sets: number) => void
  userQuestion: string
  setUserQuestion: (q: string) => void
  questionPlaceholder?: string
  onGenerateAdvice: () => void
  isGeneratingAdvice: boolean
  aiAdvice: string
  showTitle: boolean
  setShowTitle: (v: boolean) => void
  wheelTitle: string
  setWheelTitle: (v: string) => void
  wheelDescription: string
  setWheelDescription: (v: string) => void
  resultTitle: string
  setResultTitle: (v: string) => void
  optionLabels: YesNoOptionLabels
  setOptionLabels: (labels: YesNoOptionLabels) => void
  onApplyPalette: (colors: string[]) => void
  activePaletteColors?: string[] | null
  confettiEnabled: boolean
  setConfettiEnabled: (v: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (v: boolean) => void
  showStats: boolean
  setShowStats: (v: boolean) => void
  onShuffle: () => void
  onReset: () => void
  onHideInputs: () => void
  onViewHistory: () => void
  onOpenAchievements: () => void
  onOpenChallenges: () => void
  onOpenSettings?: () => void
  onToggleFullscreen?: () => void
  onOpenAI?: () => void
  onOpenThemes?: () => void
  resultsCount: number
  historyCount: number
  totalPoints: number
  activeCount: number
  eliminatedCount?: number
}

function buildTextFromLabels(mode: YesNoWheelMode, labels: YesNoOptionLabels, sets: number) {
  const unit = mode === "yes-no" ? [labels.yes, labels.no] : [labels.yes, labels.no, labels.maybe]
  const lines: string[] = []
  for (let s = 0; s < sets; s++) {
    lines.push(...unit)
  }
  return lines.join("\n")
}

function parseLabelsFromText(text: string, mode: YesNoWheelMode): YesNoOptionLabels {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (mode === "yes-no") {
    return {
      yes: lines[0] || "YES",
      no: lines[1] || "NO",
      maybe: "MAYBE",
    }
  }
  return {
    yes: lines[0] || "YES",
    no: lines[1] || "NO",
    maybe: lines[2] || "MAYBE",
  }
}

function colorsMatch(a: string[] | null | undefined, b: readonly string[]) {
  if (!a || a.length === 0) return false
  const n = Math.min(a.length, b.length, 3)
  for (let i = 0; i < n; i++) {
    if (a[i]?.toLowerCase() !== b[i]?.toLowerCase()) return false
  }
  return true
}

export function YesNoPickerSidebar({
  controlMode,
  setControlMode,
  mode,
  setMode,
  actionMode,
  onActionModeChange,
  inputSets,
  setInputSets,
  userQuestion,
  setUserQuestion,
  questionPlaceholder = "e.g., Should I take this new job offer?",
  onGenerateAdvice,
  isGeneratingAdvice,
  aiAdvice,
  showTitle,
  setShowTitle,
  wheelTitle,
  setWheelTitle,
  wheelDescription,
  setWheelDescription,
  resultTitle,
  setResultTitle,
  optionLabels,
  setOptionLabels,
  onApplyPalette,
  activePaletteColors,
  confettiEnabled,
  setConfettiEnabled,
  soundEnabled,
  setSoundEnabled,
  showStats,
  setShowStats,
  onShuffle,
  onReset,
  onHideInputs,
  onViewHistory,
  onOpenAchievements,
  onOpenChallenges,
  onOpenSettings,
  onToggleFullscreen,
  onOpenAI,
  onOpenThemes,
  resultsCount,
  historyCount,
  totalPoints,
  activeCount,
  eliminatedCount = 0,
}: YesNoPickerSidebarProps) {
  const { settings, updateSettings } = useSettingsStore()
  const [sidebarTab, setSidebarTab] = useState<YesNoSidebarTab>("inputs")
  const [textDraft, setTextDraft] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const getTextEditorValue = () => buildTextFromLabels(mode, optionLabels, inputSets)
  const textValue = textDraft ?? getTextEditorValue()

  const applyText = (raw: string) => {
    setOptionLabels(parseLabelsFromText(raw, mode))
    setTextDraft(null)
  }

  const exportText = useMemo(
    () => buildTextFromLabels(mode, optionLabels, 1),
    [mode, optionLabels],
  )

  const entries = useMemo(() => {
    const names =
      mode === "yes-no"
        ? [optionLabels.yes, optionLabels.no]
        : [optionLabels.yes, optionLabels.no, optionLabels.maybe]
    return names.map((name, i) => ({
      id: `opt-${i}`,
      name,
      weight: 1,
      enabled: true,
    }))
  }, [mode, optionLabels])

  const sortLabelsZA = () => {
    const keys: YesNoOptionKey[] = mode === "yes-no" ? ["yes", "no"] : ["yes", "no", "maybe"]
    const sorted = [...keys].sort((a, b) =>
      optionLabels[b].localeCompare(optionLabels[a], undefined, { sensitivity: "base" }),
    )
    const next = { ...optionLabels }
    keys.forEach((key, i) => {
      next[key] = optionLabels[sorted[i]]
    })
    setOptionLabels(next)
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b bg-slate-50/80 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-800">Yes / No Controls</p>
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {activeCount} active
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
            onClick={onViewHistory}
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
            settings={settings as unknown as WheelSettings}
            onUpdateSettings={(partial) => updateSettings(partial as any)}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSortZA={sortLabelsZA}
            onShuffle={onShuffle}
            onEqualize={() => {}}
            onDeleteBlanks={() => {}}
            onRemoveDuplicates={() =>
              setOptionLabels({ yes: "YES", no: "NO", maybe: "MAYBE" })
            }
            onClearAll={onReset}
          />
        </div>
      </div>

      <div className="flex overflow-x-auto border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (tab.id === "text") setTextDraft(getTextEditorValue())
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
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tool Description</Label>
                  <Textarea
                    value={wheelDescription}
                    onChange={(e) => setWheelDescription(e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Result Title</Label>
                  <Input
                    value={resultTitle}
                    onChange={(e) => setResultTitle(e.target.value)}
                    className="h-8"
                    placeholder="Your decision"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Action Mode</Label>
              <Select
                value={actionMode}
                onValueChange={(value: YesNoActionMode) => onActionModeChange(value)}
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

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={controlMode === "manual" ? "default" : "outline"}
                className="h-9 gap-1.5"
                onClick={() => setControlMode("manual")}
              >
                <Settings className="h-3.5 w-3.5" />
                Manual
              </Button>
              <Button
                type="button"
                variant={controlMode === "ai" ? "default" : "outline"}
                className={`h-9 gap-1.5 ${
                  controlMode === "ai"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : ""
                }`}
                onClick={() => setControlMode("ai")}
              >
                <Brain className="h-3.5 w-3.5" />
                AI
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Mode</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={mode === "yes-no" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setMode("yes-no")}
                >
                  YES or NO
                </Button>
                <Button
                  type="button"
                  variant={mode === "yes-no-maybe" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setMode("yes-no-maybe")}
                >
                  YES / NO / MAYBE
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Input sets</Label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    type="button"
                    variant={inputSets === num ? "default" : "outline"}
                    className="h-10 w-10"
                    onClick={() => setInputSets(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Higher sets add more slices on the wheel.
              </p>
            </div>

            {controlMode === "ai" && (
              <div className="space-y-3 rounded-lg border border-purple-100 bg-purple-50/40 p-3">
                <Label className="text-xs font-semibold text-purple-800">
                  What decision are you facing?
                </Label>
                <Textarea
                  placeholder={questionPlaceholder}
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  className="min-h-[90px] resize-none bg-white"
                />
                <Button
                  type="button"
                  onClick={onGenerateAdvice}
                  disabled={!userQuestion.trim() || isGeneratingAdvice}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isGeneratingAdvice ? "Analyzing…" : "Get AI Advice"}
                </Button>
                {aiAdvice && (
                  <div className="rounded-md border border-purple-200 bg-white p-3 text-sm text-purple-700">
                    {aiAdvice}
                  </div>
                )}
                <p className="text-[11px] text-slate-500">
                  For fun guidance only — not professional advice.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-slate-800">Show stats</p>
                <p className="text-xs text-slate-500">Totals & percentages on the wheel</p>
              </div>
              <Switch checked={showStats} onCheckedChange={setShowStats} />
            </div>
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              One option per line
              {mode === "yes-no"
                ? " (YES then NO). "
                : " (YES, NO, then MAYBE). "}
              Extra repeats follow your input sets. Edit labels, then Apply.
            </p>
            <Textarea
              value={textValue}
              onChange={(e) => setTextDraft(e.target.value)}
              onBlur={() => {
                if (textDraft !== null) applyText(textDraft)
              }}
              className="min-h-[320px] font-mono text-sm"
              placeholder={mode === "yes-no" ? "YES\nNO" : "YES\nNO\nMAYBE"}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => applyText(textDraft ?? getTextEditorValue())}
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
                  a.download = "yes-no-options.csv"
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
                      LETTER_COLOR_PALETTES[Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)]
                    const colors = [...palette.colors] as string[]
                    onApplyPalette(colors)
                    updateSettings({
                      appearance: {
                        ...settings.appearance,
                        toolColors: colors,
                      },
                    })
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
                    onClick={() => {
                      const colors = [...palette.colors] as string[]
                      onApplyPalette(colors)
                      updateSettings({
                        appearance: {
                          ...settings.appearance,
                          toolColors: colors,
                        },
                      })
                    }}
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
                  <p className="text-sm font-medium text-slate-800">Confetti</p>
                  <p className="text-xs text-slate-500">Celebrate each spin result</p>
                </div>
                <Switch checked={confettiEnabled} onCheckedChange={setConfettiEnabled} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Sound</p>
                  <p className="text-xs text-slate-500">Play spin / result sounds</p>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Show stats</p>
                  <p className="text-xs text-slate-500">Totals & percentages on the wheel</p>
                </div>
                <Switch checked={showStats} onCheckedChange={setShowStats} />
              </div>
            </div>

            <SidebarOtherOptions
              toolLabel="Yes or No Picker"
              resultsCount={resultsCount}
              exportFileName="yes-no-options.csv"
              exportText={exportText}
              entries={entries}
              onImportText={(text) => applyText(text)}
              onViewResults={onViewHistory}
              onOpenSettings={onOpenSettings}
              onOpenAnalytics={onViewHistory}
              onToggleFullscreen={onToggleFullscreen}
              onOpenAI={onOpenAI}
            />
          </div>
        )}
      </div>
    </div>
  )
}
