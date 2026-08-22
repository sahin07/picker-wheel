"use client"



import { useCallback, useMemo, useState, type ReactNode } from "react"

import {

  EyeOff,

  History,

  List,

  MoreVertical,

  Palette,

  Shuffle,

  Trophy,

  Type,

} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {

  Select,

  SelectContent,

  SelectItem,

  SelectTrigger,

  SelectValue,

} from "@/components/ui/select"

import { Switch } from "@/components/ui/switch"

import { Textarea } from "@/components/ui/textarea"

import { SidebarOtherOptions } from "@/components/sidebar-other-options"

import { SlicesManageMenu } from "@/components/slices-manage-menu"

import { useToast } from "@/contexts/toast-context"

import { getAllMlbAngelsNicknames } from "@/data/mlb-angels-nicknames"

import { MLB_ANGELS_USE_CASES, applyMlbAngelsUseCase } from "@/lib/mlb-angels-use-cases"

import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"

import { useSettingsStore } from "@/stores/settings-store"

import { useWheelManagerStore, type MlbAngelsWheelData } from "@/stores/wheel-manager-store"

import type { MlbAngelsActionMode, MlbAngelsDisplayMode } from "@/types/mlb-angels-types"

import type { WheelSettings } from "@/types/settings"



type SidebarTab = "inputs" | "text" | "style" | "other"



const SIDEBAR_TABS: { id: SidebarTab; label: string; icon: ReactNode }[] = [

  { id: "inputs", label: "Inputs", icon: <List className="h-4 w-4" /> },

  { id: "text", label: "Text", icon: <Type className="h-4 w-4" /> },

  { id: "style", label: "Style", icon: <Palette className="h-4 w-4" /> },

  { id: "other", label: "Other Options", icon: <MoreVertical className="h-4 w-4" /> },

]



type Props = {

  actionMode?: MlbAngelsActionMode

  onActionModeChange?: (mode: MlbAngelsActionMode) => void

  onHideInputs?: () => void

  onOpenAchievements?: () => void

  onViewHistory?: () => void

  onOpenSettings?: () => void

  onToggleFullscreen?: () => void

  onOpenAnalytics?: () => void

  historyCount?: number

}



export default function MlbAngelsInputPanel({

  actionMode: externalActionMode = "normal",

  onActionModeChange,

  onHideInputs,

  onOpenAchievements,

  onViewHistory,

  onOpenSettings,

  onToggleFullscreen,

  onOpenAnalytics,

  historyCount = 0,

}: Props) {

  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("inputs")

  const [bulkText, setBulkText] = useState("")

  const [searchQuery, setSearchQuery] = useState("")

  const { settings, updateSettings } = useSettingsStore()

  const { showToast } = useToast()



  const wheel = useWheelManagerStore((state) =>

    (state.wheelsByTool["mlb-angels-wheel"] || []).find((item) => item.id === state.currentWheelId) || null)

  const data = wheel?.data as MlbAngelsWheelData | undefined

  const allEntries = useMemo(() => getAllMlbAngelsNicknames(), [])

  const selected = data?.selectedNicknameIds || []

  const activeUseCase = data?.activeUseCaseId || "all-nicknames"

  const actionMode = externalActionMode



  const entryByNickname = useMemo(() => {

    const map = new Map<string, string>()

    for (const entry of allEntries) {

      map.set(entry.nickname.toLowerCase(), entry.id)

      map.set(entry.playerName.toLowerCase(), entry.id)

    }

    return map

  }, [allEntries])



  const filtered = useMemo(() => {

    const value = searchQuery.trim().toLowerCase()

    if (!value) return allEntries

    return allEntries.filter(

      (item) =>

        item.nickname.toLowerCase().includes(value) ||

        item.playerName.toLowerCase().includes(value),

    )

  }, [allEntries, searchQuery])



  const exportText = useMemo(

    () =>

      allEntries

        .filter((item) => selected.includes(item.id))

        .map((item) => item.nickname)

        .join("\n"),

    [allEntries, selected],

  )



  const giveawayEntries = useMemo(

    () =>

      allEntries

        .filter((item) => selected.includes(item.id))

        .map((item) => ({

          id: item.id,

          name: item.nickname,

          weight: 1,

          enabled: true,

        })),

    [allEntries, selected],

  )



  const setData = useCallback(

    (partial: Partial<MlbAngelsWheelData>) => {

      if (!wheel || !data) return

      useWheelManagerStore.getState().updateWheelData("mlb-angels-wheel", wheel.id, { ...data, ...partial })

    },

    [data, wheel],

  )



  const setActionModeSynced = (mode: MlbAngelsActionMode) => {

    onActionModeChange?.(mode)

    if (mode === "elimination" || mode === "normal") {

      const latest = useSettingsStore.getState().settings

      updateSettings({

        spinBehavior: {

          ...latest.spinBehavior,

          removeWinnerAfterSpin: mode === "elimination",

        },

      })

    }

  }



  const toggleEntry = (id: string, enabled: boolean) => {

    if (!data) return

    const next = enabled

      ? [...data.selectedNicknameIds, id]

      : data.selectedNicknameIds.filter((item) => item !== id)

    const order = enabled

      ? [...data.nicknameOrder.filter((item) => item !== id), id]

      : data.nicknameOrder.filter((item) => item !== id)

    setData({ selectedNicknameIds: next, nicknameOrder: order, activeUseCaseId: null })

  }



  const shuffle = () => {

    if (!data) return

    const shuffled = [...data.selectedNicknameIds].sort(() => Math.random() - 0.5)

    setData({ nicknameOrder: shuffled })

    showToast("Nickname order shuffled", "success")

  }



  const sortZA = () => {

    if (!data) return

    const byId = new Map(allEntries.map((item) => [item.id, item]))

    const sorted = [...data.selectedNicknameIds].sort((a, b) =>

      (byId.get(b)?.nickname || b).localeCompare(byId.get(a)?.nickname || a),

    )

    setData({ nicknameOrder: sorted })

  }



  const clearAll = () => {

    setData({ selectedNicknameIds: [], nicknameOrder: [], activeUseCaseId: null })

    showToast("All nicknames cleared", "success")

  }



  const removeDuplicates = () => {

    if (!data) return

    const byId = new Map(allEntries.map((item) => [item.id, item]))

    const seen = new Set<string>()

    const unique: string[] = []

    for (const id of data.selectedNicknameIds) {

      const key = (byId.get(id)?.nickname || id).toLowerCase()

      if (seen.has(key)) continue

      seen.add(key)

      unique.push(id)

    }

    setData({ selectedNicknameIds: unique, nicknameOrder: unique })

    showToast("Duplicate nicknames removed", "success")

  }



  const applyBulkText = () => {

    const lines = bulkText

      .split(/\r?\n/)

      .map((line) => line.trim())

      .filter(Boolean)

    if (lines.length === 0) {

      showToast("Add one nickname or player name per line", "error")

      return

    }

    const ids: string[] = []

    const missing: string[] = []

    for (const line of lines) {

      const id = entryByNickname.get(line.toLowerCase())

      if (id && !ids.includes(id)) {

        ids.push(id)

      } else if (!id) {

        missing.push(line)

      }

    }

    if (ids.length === 0) {

      showToast("No matching Angels nicknames found in text", "error")

      return

    }

    setData({ selectedNicknameIds: ids, nicknameOrder: ids, activeUseCaseId: null })

    showToast(

      missing.length

        ? `Loaded ${ids.length} nicknames (${missing.length} unmatched)`

        : `Loaded ${ids.length} nicknames`,

      "success",

    )

  }



  const applyPalette = (colors: readonly string[]) => {

    setData({ paletteColors: [...colors] })

    showToast("Palette applied", "success")

  }



  return (

    <div className="flex max-h-[min(70vh,36rem)] min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border bg-white shadow-sm lg:max-h-none">

      <div className="flex shrink-0 items-center justify-between gap-1 border-b bg-slate-50/80 px-2 py-2 sm:gap-2 sm:px-3">

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">

          <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">Angels Controls</p>

          <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 sm:px-2 sm:text-xs">

            {selected.length} selected

          </span>

        </div>

        <div className="flex shrink-0 items-center gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {onOpenAchievements && (

            <Button

              type="button"

              variant="ghost"

              size="sm"

              className="h-7 w-7 p-0 sm:h-8 sm:w-8"

              title="Achievements"

              onClick={onOpenAchievements}

            >

              <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

            </Button>

          )}

          {onViewHistory && (

            <Button

              type="button"

              variant="ghost"

              size="sm"

              className="relative h-7 w-7 p-0 sm:h-8 sm:w-8"

              title={`Spin History (${historyCount})`}

              onClick={onViewHistory}

            >

              <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

              {historyCount > 0 && (

                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-0.5 text-[10px] text-white">

                  {historyCount}

                </span>

              )}

            </Button>

          )}

          <Button

            type="button"

            variant="ghost"

            size="sm"

            className="h-7 w-7 p-0 sm:h-8 sm:w-8"

            title="Shuffle"

            onClick={shuffle}

          >

            <Shuffle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

          </Button>

          {onHideInputs && (

            <Button

              type="button"

              variant="ghost"

              size="sm"

              className="h-7 w-7 p-0 sm:h-8 sm:w-8"

              title="Hide"

              onClick={onHideInputs}

            >

              <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

            </Button>

          )}

          <SlicesManageMenu

            settings={settings as unknown as WheelSettings}

            onUpdateSettings={(partial) => {

              updateSettings(partial as Parameters<typeof updateSettings>[0])

              if (partial.spinBehavior && "removeWinnerAfterSpin" in partial.spinBehavior) {

                setActionModeSynced(

                  partial.spinBehavior.removeWinnerAfterSpin ? "elimination" : "normal",

                )

              }

            }}

            searchQuery={searchQuery}

            onSearchQueryChange={setSearchQuery}

            onSortZA={sortZA}

            onShuffle={shuffle}

            onEqualize={() => {}}

            onDeleteBlanks={() => {}}

            onRemoveDuplicates={removeDuplicates}

            onClearAll={clearAll}

          />

        </div>

      </div>



      <div className="flex shrink-0 overflow-x-auto border-b">

        {SIDEBAR_TABS.map((tab) => (

          <button

            key={tab.id}

            type="button"

            onClick={() => {

              if (tab.id === "text") {

                setBulkText(exportText)

              }

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



      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2.5 sm:p-3">

        {sidebarTab === "inputs" && (

          <div className="space-y-4">

            <div className="space-y-2">

              <Label className="text-sm font-medium text-slate-700">Action Mode</Label>

              <Select value={actionMode} onValueChange={(value) => setActionModeSynced(value as MlbAngelsActionMode)}>

                <SelectTrigger>

                  <SelectValue />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="normal">Normal Mode</SelectItem>

                  <SelectItem value="elimination">Elimination Mode</SelectItem>

                </SelectContent>

              </Select>

              <p className="text-xs text-slate-500">

                Elimination removes the winning nickname after each spin. Synced with Game Mode under the wheel.

              </p>

            </div>



            <div>

              <Label className="mb-2 block text-sm font-medium text-slate-700">Nickname pool</Label>

              <div className="grid grid-cols-1 gap-2">

                {MLB_ANGELS_USE_CASES.map((preset) => (

                  <button

                    key={preset.id}

                    type="button"

                    onClick={() => applyMlbAngelsUseCase(preset.id)}

                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${

                      activeUseCase === preset.id

                        ? "border-emerald-400 bg-emerald-50 text-emerald-900"

                        : "border-slate-200 bg-white hover:border-emerald-200"

                    }`}

                  >

                    <span className="font-semibold">{preset.label}</span>

                    <span className="mt-0.5 block text-xs text-slate-500">{preset.description}</span>

                  </button>

                ))}

              </div>

            </div>



            {searchQuery && (

              <p className="text-xs text-slate-500">

                Filtering list: <span className="font-medium text-slate-700">{searchQuery}</span>

              </p>

            )}



            <ul className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">

              {filtered.map((entry) => (

                <li

                  key={entry.id}

                  className="flex items-center justify-between gap-2 rounded-md px-1 py-1.5 hover:bg-slate-50"

                >

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-slate-900">

                      {entry.emoji} {entry.nickname}

                    </p>

                    <p className="truncate text-xs text-slate-500">{entry.playerName}</p>

                  </div>

                  <Switch

                    checked={selected.includes(entry.id)}

                    onCheckedChange={(checked) => toggleEntry(entry.id, checked)}

                    aria-label={`Toggle ${entry.nickname}`}

                  />

                </li>

              ))}

            </ul>

          </div>

        )}



        {sidebarTab === "text" && (

          <div className="space-y-3">

            <div>

              <Label className="text-sm font-medium text-slate-700">Nickname list</Label>

              <p className="mt-1 text-xs text-slate-500">

                One nickname or player name per line. Names must match the Angels catalog.

              </p>

            </div>

            <Textarea

              value={bulkText}

              onChange={(event) => setBulkText(event.target.value)}

              rows={12}

              placeholder={"The Millville Meteor\nShowtime\nMike Trout"}

              className="font-mono text-sm"

            />

            <div className="flex flex-wrap gap-2">

              <Button type="button" onClick={applyBulkText}>

                Apply text

              </Button>

              <Button type="button" variant="outline" onClick={() => setBulkText(exportText)}>

                Load current

              </Button>

              <Button

                type="button"

                variant="outline"

                onClick={() => {

                  const blob = new Blob([exportText], { type: "text/plain" })

                  const url = URL.createObjectURL(blob)

                  const anchor = document.createElement("a")

                  anchor.href = url

                  anchor.download = "angels-nicknames.txt"

                  anchor.click()

                  URL.revokeObjectURL(url)

                }}

              >

                Export

              </Button>

            </div>

          </div>

        )}



        {sidebarTab === "style" && (

          <div className="space-y-5">

            <div className="space-y-2">

              <Label className="text-sm font-medium text-slate-700">Display Options</Label>

              <div className="grid gap-2">

                {(

                  [

                    { value: "nickname-name", label: "Emoji + Nickname" },

                    { value: "nickname", label: "Nickname Only" },

                    { value: "name", label: "Player Name" },

                  ] as const

                ).map((opt) => (

                  <label

                    key={opt.value}

                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${

                      data?.displayMode === opt.value

                        ? "border-emerald-400 bg-emerald-50"

                        : "border-slate-200 hover:bg-slate-50"

                    }`}

                  >

                    <input

                      type="radio"

                      name="angels-display"

                      value={opt.value}

                      checked={data?.displayMode === opt.value}

                      onChange={() => setData({ displayMode: opt.value as MlbAngelsDisplayMode })}

                    />

                    {opt.label}

                  </label>

                ))}

              </div>

            </div>



            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <Label className="text-sm font-medium text-slate-700">Color palettes</Label>

                <Button

                  type="button"

                  variant="outline"

                  size="sm"

                  onClick={() => {

                    const palette =

                      LETTER_COLOR_PALETTES[Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)]

                    applyPalette(palette.colors)

                  }}

                >

                  Randomize

                </Button>

              </div>

              <div className="grid grid-cols-2 gap-2">

                {LETTER_COLOR_PALETTES.map((palette) => (

                  <button

                    key={palette.name}

                    type="button"

                    onClick={() => applyPalette(palette.colors)}

                    className="rounded-lg border border-slate-200 p-2 text-left hover:border-emerald-300 hover:bg-emerald-50/40"

                  >

                    <span className="mb-1 block text-xs font-semibold text-slate-800">{palette.name}</span>

                    <span className="flex gap-0.5">

                      {palette.colors.slice(0, 6).map((color) => (

                        <span

                          key={color}

                          className="h-3 w-3 rounded-sm"

                          style={{ backgroundColor: color }}

                        />

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

            <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <p className="text-sm font-medium text-slate-800">Confetti</p>

                  <p className="text-xs text-slate-500">Celebrate each spin result</p>

                </div>

                <Switch

                  id="angels-confetti"

                  checked={settings.confettiSound?.enableConfetti ?? true}

                  onCheckedChange={(checked) =>

                    updateSettings({

                      confettiSound: { ...settings.confettiSound, enableConfetti: checked },

                    } as Parameters<typeof updateSettings>[0])

                  }

                />

              </div>

              <div className="flex items-center justify-between gap-3">

                <div>

                  <p className="text-sm font-medium text-slate-800">Sound</p>

                  <p className="text-xs text-slate-500">Play spin / result sounds</p>

                </div>

                <Switch

                  id="angels-sound"

                  checked={settings.confettiSound?.enableSound ?? true}

                  onCheckedChange={(checked) =>

                    updateSettings({

                      confettiSound: { ...settings.confettiSound, enableSound: checked },

                    } as Parameters<typeof updateSettings>[0])

                  }

                />

              </div>

            </div>



            <SidebarOtherOptions

              toolLabel="Angels Nickname Wheel"

              resultsCount={historyCount || data?.recentResults?.length || data?.totalSpins || 0}

              exportFileName="angels-nicknames.txt"

              exportText={exportText}

              entries={giveawayEntries}

              onImportText={(text) => {

                setBulkText(text)

                setSidebarTab("text")

                showToast("Pasted into Text tab — tap Apply text", "info")

              }}

              onRemoveDuplicates={removeDuplicates}

              onViewResults={onViewHistory}

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


