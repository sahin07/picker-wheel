"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ListChecks,
  Type,
  Palette,
  MoreVertical,
  History,
  Eye,
  EyeOff,
  CalendarIcon,
  FileText,
  Sparkles,
  Wand2,
  Lightbulb,
  X,
  RotateCcw,
  Shuffle,
} from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import { useSettingsStore } from "@/stores/settings-store"
import type { WheelSettings as GlobalWheelSettings } from "@/types/settings"

export type DatePickerSidebarTab = "inputs" | "text" | "style" | "other"
export type DateActionMode = "normal" | "elimination"

type DateEntry = {
  id: string
  date: Date
  formatted: string
}

type DateRangeEntry = {
  id: string
  from: Date
  to: Date
  label: string
  dates: DateEntry[]
}

type SelectedDays = {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

const TABS: { id: DatePickerSidebarTab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <ListChecks className="w-4 h-4" /> },
  { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
  { id: "style", label: "Style", icon: <Palette className="w-4 h-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="w-4 h-4" /> },
]

export type DatePickerSidebarProps = {
  allDatesCount: number
  singleDates: DateEntry[]
  dateRanges: DateRangeEntry[]
  dateFormats: string[]
  dateFormat: string
  setDateFormat: (v: string) => void
  selectedDays: SelectedDays
  setSelectedDays: (days: SelectedDays | ((prev: SelectedDays) => SelectedDays)) => void
  handleDaySelectionChange: (day: string, checked: boolean) => void
  shouldIncludeDate: (date: Date) => boolean
  actionMode: DateActionMode
  onActionModeChange: (mode: DateActionMode) => void
  inputMode: "manual" | "ai"
  setInputMode: (mode: "manual" | "ai") => void
  aiPrompt: string
  setAiPrompt: (v: string) => void
  isGenerating: boolean
  generateAIDates: (prompt: string) => void
  showCalendar: boolean
  setShowCalendar: (v: boolean) => void
  isRangeMode: boolean
  setIsRangeMode: (v: boolean) => void
  selectedDate: Date | undefined
  setSelectedDate: (d: Date | undefined) => void
  selectedRange: DateRange | undefined
  setSelectedRange: (r: DateRange | undefined) => void
  addSingleDate: (date: Date) => void
  addDateRange: (from: Date, to: Date) => void
  removeSingleDate: (id: string) => void
  removeDateRange: (id: string) => void
  clearAllDates: () => void
  resetSpinHistory: () => void
  wheelTitle: string
  setWheelTitle: (v: string) => void
  wheelDescription: string
  setWheelDescription: (v: string) => void
  resultTitle: string
  setResultTitle: (v: string) => void
  showTitle: boolean
  setShowTitle: (v: boolean) => void
  resultsCount: number
  onViewResults: () => void
  onOpenSettings: () => void
  onToggleFullscreen: () => void
  onHideInputs: () => void
  onApplyPalette: (colors: string[]) => void
  activePaletteColors?: string[] | null
  onOpenThemes?: () => void
  onSortZA: () => void
  onShuffle: () => void
  onRemoveDuplicates: () => void
  onImportText: (text: string) => void
}

function colorsMatch(a: string[] | null | undefined, b: readonly string[]) {
  if (!a || a.length === 0) return false
  const n = Math.min(a.length, b.length, 3)
  for (let i = 0; i < n; i++) {
    if (a[i]?.toLowerCase() !== b[i]?.toLowerCase()) return false
  }
  return true
}

export function DatePickerSidebar({
  allDatesCount,
  singleDates,
  dateRanges,
  dateFormats,
  dateFormat,
  setDateFormat,
  selectedDays,
  setSelectedDays,
  handleDaySelectionChange,
  shouldIncludeDate,
  actionMode,
  onActionModeChange,
  inputMode,
  setInputMode,
  aiPrompt,
  setAiPrompt,
  isGenerating,
  generateAIDates,
  showCalendar,
  setShowCalendar,
  isRangeMode,
  setIsRangeMode,
  selectedDate,
  setSelectedDate,
  selectedRange,
  setSelectedRange,
  addSingleDate,
  addDateRange,
  removeSingleDate,
  removeDateRange,
  clearAllDates,
  resetSpinHistory,
  wheelTitle,
  setWheelTitle,
  wheelDescription,
  setWheelDescription,
  resultTitle,
  setResultTitle,
  showTitle,
  setShowTitle,
  resultsCount,
  onViewResults,
  onOpenSettings,
  onToggleFullscreen,
  onHideInputs,
  onApplyPalette,
  activePaletteColors,
  onOpenThemes,
  onSortZA,
  onShuffle,
  onRemoveDuplicates,
  onImportText,
}: DatePickerSidebarProps) {
  const [sidebarTab, setSidebarTab] = useState<DatePickerSidebarTab>("inputs")
  const [searchQuery, setSearchQuery] = useState("")
  const { settings, updateSettings } = useSettingsStore()

  const applyPalette = (colors: string[]) => {
    onApplyPalette(colors)
  }

  const q = searchQuery.trim().toLowerCase()
  const visibleSingleDates = q
    ? singleDates.filter((d) => d.formatted.toLowerCase().includes(q))
    : singleDates
  const visibleDateRanges = q
    ? dateRanges.filter((r) => r.label.toLowerCase().includes(q))
    : dateRanges

  const allDateEntries = [...singleDates, ...dateRanges.flatMap((range) => range.dates)]
  const filteredCount = allDateEntries.filter((d) => shouldIncludeDate(d.date)).length
  const excludedCount = allDateEntries.length - filteredCount

  const exportText = allDateEntries.map((d) => d.formatted).join("\n")

  const dateChips = (
    <div className="flex flex-wrap gap-2">
      {visibleSingleDates.map((date) => (
        <Badge
          key={date.id}
          variant="secondary"
          className={cn(
            "pr-1 group",
            inputMode === "ai"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              : "bg-gray-700 text-white hover:bg-gray-800",
          )}
        >
          {date.formatted}
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-5 w-5 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500 hover:text-white"
            onClick={() => removeSingleDate(date.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      {visibleDateRanges.map((range) => (
        <Badge
          key={range.id}
          variant="secondary"
          className={cn(
            "pr-1 group",
            inputMode === "ai"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              : "bg-gray-700 text-white hover:bg-gray-800",
          )}
        >
          {range.label}
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-5 w-5 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500 hover:text-white"
            onClick={() => removeDateRange(range.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  )

  const daysFilter = (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-xs font-semibold text-slate-600">Days of week</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setSelectedDays({
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
              sunday: true,
            })
          }
          className="h-6 px-2 text-xs"
        >
          All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setSelectedDays({
              monday: false,
              tuesday: false,
              wednesday: false,
              thursday: false,
              friday: false,
              saturday: false,
              sunday: false,
            })
          }
          className="h-6 px-2 text-xs"
        >
          None
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(selectedDays).map(([day, checked]) => (
          <div key={day} className="flex items-center space-x-2">
            <Checkbox
              id={`sidebar-${day}`}
              checked={checked}
              onCheckedChange={(value) => handleDaySelectionChange(day, value as boolean)}
            />
            <Label
              htmlFor={`sidebar-${day}`}
              className={`text-sm capitalize ${checked ? "font-medium text-black" : "text-gray-500"}`}
            >
              {day}
            </Label>
          </div>
        ))}
      </div>
      {excludedCount > 0 && (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          {excludedCount} date{excludedCount !== 1 ? "s" : ""} excluded by day filter ·{" "}
          {filteredCount}/{allDateEntries.length} on wheel
        </div>
      )}
    </div>
  )

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b bg-slate-50/80 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-800">Date Controls</p>
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {allDatesCount} active
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="relative h-8 w-8 p-0"
            title={`Spin History (${resultsCount})`}
            onClick={onViewResults}
          >
            <History className="h-4 w-4" />
            {resultsCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-0.5 text-[10px] text-white">
                {resultsCount}
              </span>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Reset spin history"
            onClick={resetSpinHistory}
          >
            <RotateCcw className="h-4 w-4" />
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
            onUpdateSettings={(partial) => {
              // Store is source of truth; Action Mode syncs via parent useEffect on removeWinnerAfterSpin
              const latest = useSettingsStore.getState().settings
              const next = { ...partial } as any
              if (partial.spinBehavior) {
                next.spinBehavior = {
                  ...latest.spinBehavior,
                  ...partial.spinBehavior,
                }
              }
              updateSettings(next)
            }}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSortZA={onSortZA}
            onShuffle={onShuffle}
            onEqualize={() => {}}
            onDeleteBlanks={() => {}}
            onRemoveDuplicates={onRemoveDuplicates}
            onClearAll={clearAllDates}
          />
        </div>
      </div>

      <div className="flex border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setSidebarTab(tab.id)
              if (tab.id === "text") setShowTitle(true)
            }}
            className={`flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors ${
              sidebarTab === tab.id
                ? "border-b-2 border-emerald-600 bg-emerald-50/50 text-emerald-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            <span className="leading-tight">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="max-h-[min(70vh,720px)] space-y-4 overflow-y-auto p-4">
        {sidebarTab === "inputs" && (
          <>
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "manual" | "ai")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="manual"
                  className="flex items-center space-x-2 data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4" />
                  <span>Manual</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className={`flex items-center space-x-2 ${
                    inputMode === "ai"
                      ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white"
                      : "bg-white"
                  }`}
                >
                  <Sparkles
                    className={cn("h-4 w-4", inputMode === "ai" ? "text-white" : "text-violet-500")}
                  />
                  <span
                    className={
                      inputMode === "ai"
                        ? "text-white"
                        : "bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"
                    }
                  >
                    AI
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-slate-600">Dates</Label>
                  <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                    <PopoverTrigger asChild>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Choose Dates
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <div className="space-y-4 p-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant={!isRangeMode ? "default" : "outline"}
                            onClick={() => setIsRangeMode(false)}
                          >
                            Single Date
                          </Button>
                          <Button
                            size="sm"
                            variant={isRangeMode ? "default" : "outline"}
                            onClick={() => setIsRangeMode(true)}
                          >
                            Date Range
                          </Button>
                        </div>
                        <Calendar
                          mode={isRangeMode ? "range" : "single"}
                          selected={isRangeMode ? selectedRange : selectedDate}
                          onSelect={(date) => {
                            if (isRangeMode) setSelectedRange(date as DateRange)
                            else setSelectedDate(date as Date)
                          }}
                          initialFocus
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              if (isRangeMode && selectedRange?.from && selectedRange?.to) {
                                addDateRange(selectedRange.from, selectedRange.to)
                                setSelectedRange(undefined)
                              } else if (!isRangeMode && selectedDate) {
                                addSingleDate(selectedDate)
                                setSelectedDate(undefined)
                              }
                              setShowCalendar(false)
                            }}
                            disabled={
                              isRangeMode
                                ? !selectedRange?.from || !selectedRange?.to
                                : !selectedDate
                            }
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDate(undefined)
                              setSelectedRange(undefined)
                              setShowCalendar(false)
                            }}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="min-h-[100px] max-h-40 space-y-2 overflow-y-auto rounded border bg-gray-50 p-3">
                  {visibleSingleDates.length === 0 && visibleDateRanges.length === 0 ? (
                    <div className="py-4 text-center text-sm text-gray-500">
                      {q
                        ? "No dates match your search."
                        : "Click Choose Dates to add a date or range…"}
                    </div>
                  ) : (
                    dateChips
                  )}
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-4 space-y-4">
                <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                  <div className="mb-3 flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">AI Date Generator</h3>
                  </div>
                  <p className="mb-4 text-sm text-purple-700">
                    Describe what kind of dates you need, and AI will generate suggestions.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="ai-prompt">What dates are you looking for?</Label>
                      <Textarea
                        id="ai-prompt"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., Summer vacation dates, Weekend meetings…"
                        className="mt-2 min-h-[80px]"
                        disabled={isGenerating}
                      />
                    </div>
                    <Button
                      onClick={() => generateAIDates(aiPrompt)}
                      disabled={!aiPrompt.trim() || isGenerating}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isGenerating ? (
                        <>
                          <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating…
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Dates with AI
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <Label className="text-sm font-medium">Try these prompts:</Label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Summer vacation dates",
                        "Weekend dates only",
                        "Holiday celebrations",
                        "Business meeting dates",
                        "Birthday party dates",
                        "Anniversary dates",
                      ].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          onClick={() => setAiPrompt(suggestion)}
                          className="border-purple-200 bg-white text-xs hover:bg-purple-50"
                          disabled={isGenerating}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="min-h-[100px] max-h-40 space-y-2 overflow-y-auto rounded border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-3">
                  {singleDates.length === 0 && dateRanges.length === 0 ? (
                    <div className="flex flex-col items-center space-y-2 py-4 text-center text-sm text-purple-600">
                      <Sparkles className="h-8 w-8 text-purple-400" />
                      <span>AI will generate dates based on your description</span>
                    </div>
                  ) : (
                    dateChips
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label className="text-xs font-semibold text-slate-600">Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((fmt) => (
                    <SelectItem key={fmt} value={fmt}>
                      {fmt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-600">Action Mode</Label>
              <Select
                value={actionMode}
                onValueChange={(v) => onActionModeChange(v as DateActionMode)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal Mode</SelectItem>
                  <SelectItem value="elimination">Elimination Mode</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-[11px] text-slate-400">
                Synced with Manage → Remove winner and Other Options
              </p>
            </div>

            {daysFilter}

            <Button variant="destructive" size="sm" onClick={clearAllDates} className="w-full">
              Clear All Dates
            </Button>
          </>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Title Section</Label>
              <Switch checked={showTitle} onCheckedChange={setShowTitle} />
            </div>
            {showTitle && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Tool Title</Label>
                  <Input
                    value={wheelTitle}
                    onChange={(e) => setWheelTitle(e.target.value)}
                    placeholder="e.g., Annual Trip Date"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Tool Description</Label>
                  <Textarea
                    value={wheelDescription}
                    onChange={(e) => setWheelDescription(e.target.value)}
                    placeholder="Describe the purpose of this wheel…"
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-xs">Result Title</Label>
                  <Input
                    value={resultTitle}
                    onChange={(e) => setResultTitle(e.target.value)}
                    placeholder="e.g., Selected Date:"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
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
                  <p className="text-sm font-medium text-slate-800">Mystery wheel</p>
                  <p className="text-xs text-slate-500">Synced with Header Settings + Manage</p>
                </div>
                <Switch
                  checked={!!settings.spinBehavior?.mysterySpin}
                  onCheckedChange={(checked) => {
                    const latest = useSettingsStore.getState().settings
                    updateSettings({
                      spinBehavior: {
                        ...latest.spinBehavior,
                        mysterySpin: checked,
                      },
                    })
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Mystery result</p>
                  <p className="text-xs text-slate-500">Synced with Manage → Mystery result</p>
                </div>
                <Switch
                  checked={!!settings.spinBehavior?.mysteryResult}
                  onCheckedChange={(checked) => {
                    const latest = useSettingsStore.getState().settings
                    updateSettings({
                      spinBehavior: {
                        ...latest.spinBehavior,
                        mysteryResult: checked,
                      },
                    })
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Remove winner</p>
                  <p className="text-xs text-slate-500">Synced with Action Mode + Manage</p>
                </div>
                <Switch
                  checked={!!settings.spinBehavior?.removeWinnerAfterSpin}
                  onCheckedChange={(checked) => {
                    onActionModeChange(checked ? "elimination" : "normal")
                  }}
                />
              </div>
            </div>

            <SidebarOtherOptions
              toolLabel="Date Picker Wheel"
              resultsCount={resultsCount}
              exportFileName="date-picker-results.txt"
              exportText={exportText}
              entries={allDateEntries.map((d) => ({
                id: d.id,
                name: d.formatted,
                weight: 1,
              }))}
              onImportText={onImportText}
              onRemoveDuplicates={onRemoveDuplicates}
              onViewResults={onViewResults}
              onOpenSettings={onOpenSettings}
              onToggleFullscreen={onToggleFullscreen}
              onOpenAI={() => {
                setSidebarTab("inputs")
                setInputMode("ai")
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
