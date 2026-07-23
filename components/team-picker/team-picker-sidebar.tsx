"use client"

import type React from "react"
import { useEffect, useMemo, useState, type ReactNode } from "react"
import { useTeamPickerStore } from "@/stores/team-picker-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ListChecks,
  Type,
  Palette,
  MoreVertical,
  EyeOff,
  Shuffle,
  Plus,
  Trash2,
  Upload,
  Info,
  Sparkles,
  Zap,
  Users,
  Grid,
  History,
  Trophy,
} from "lucide-react"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { LETTER_COLOR_PALETTES } from "@/lib/letter-picker-constants"
import { useSettingsStore } from "@/stores/settings-store"
import type { WheelSettings } from "@/types/settings"

export type TeamSidebarTab = "inputs" | "text" | "style" | "other"

const TABS: { id: TeamSidebarTab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Inputs", icon: <ListChecks className="h-4 w-4" /> },
  { id: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  { id: "style", label: "Style", icon: <Palette className="h-4 w-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="h-4 w-4" /> },
]

function colorsMatch(a: string[] | null | undefined, b: readonly string[]) {
  if (!a || a.length === 0) return false
  const n = Math.min(a.length, b.length, 3)
  for (let i = 0; i < n; i++) {
    if (a[i]?.toLowerCase() !== b[i]?.toLowerCase()) return false
  }
  return true
}

export type TeamPickerSidebarProps = {
  onHideInputs: () => void
  onShuffle: () => void
  onOpenSettings?: () => void
  onToggleFullscreen?: () => void
  onOpenAI?: () => void
  onOpenGroupsBoard?: () => void
  onViewHistory?: () => void
  historyCount?: number
  onOpenAchievements?: () => void
  onActionModeChange?: (mode: "normal" | "elimination") => void
}

export function TeamPickerSidebar({
  onHideInputs,
  onShuffle,
  onOpenSettings,
  onToggleFullscreen,
  onOpenAI,
  onOpenGroupsBoard,
  onViewHistory,
  historyCount = 0,
  onOpenAchievements,
  onActionModeChange,
}: TeamPickerSidebarProps) {
  const { settings, updateSettings } = useSettingsStore()
  const [sidebarTab, setSidebarTab] = useState<TeamSidebarTab>("inputs")
  const [newParticipantName, setNewParticipantName] = useState("")
  const [bulkInput, setBulkInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showTeamNamesDialog, setShowTeamNamesDialog] = useState(false)
  const [tempTeamNames, setTempTeamNames] = useState<string[]>([])
  const [showPresetDialog, setShowPresetDialog] = useState(false)
  const [zones, setZones] = useState<string[][]>([])
  const [zoneSelections, setZoneSelections] = useState<{ [zone: number]: string[] }>({})
  const [inputSubTab, setInputSubTab] = useState<"single" | "ai">("single")

  // Allow Themes / other UI to jump to a sidebar tab
  useEffect(() => {
    const openTab = (e: Event) => {
      const detail = (e as CustomEvent<TeamSidebarTab>).detail
      if (detail === "inputs" || detail === "text" || detail === "style" || detail === "other") {
        setSidebarTab(detail)
      }
    }
    window.addEventListener("team-picker-open-tab", openTab)
    return () => window.removeEventListener("team-picker-open-tab", openTab)
  }, [])

  const {
    participants,
    teams,
    distributionMode,
    numberOfGroups,
    maxPeoplePerGroup,
    pickRepresentatives,
    customTeamNames,
    addParticipant,
    removeParticipant,
    updateParticipant,
    setDistributionMode,
    setNumberOfGroups,
    setMaxPeoplePerGroup,
    setPickRepresentatives,
    setCustomTeamNames,
    importFromCSV,
    pickQuantity,
    setPickQuantity,
    showGenderInResult,
    setShowGenderInResult,
    showLabelInResult,
    setShowLabelInResult,
    setPresetGroups,
    clearTeams,
    generateTeams,
    setSelectedTeam,
    actionMode,
    setActionMode,
    eliminatedTeams,
    restoreAllTeams,
  } = useTeamPickerStore()

  const entries = useMemo(
    () =>
      participants.map((p) => ({
        id: p.id,
        name: p.name,
        weight: 1,
        enabled: true,
      })),
    [participants],
  )

  const exportText = useMemo(
    () => participants.map((p) => p.name).join("\n"),
    [participants],
  )

  const handleAddParticipant = () => {
    const name = newParticipantName.trim()
    if (!name) return
    if (participants.some((p) => p.name.trim().toLowerCase() === name.toLowerCase())) {
      alert("Participant with this name already exists.")
      return
    }
    addParticipant({ name })
    setNewParticipantName("")
  }

  const handleBulkImport = () => {
    if (!bulkInput.trim()) return
    bulkInput
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean)
      .forEach((name) => addParticipant({ name }))
    setBulkInput("")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      const reader = new FileReader()
      reader.onload = (e) => importFromCSV(String(e.target?.result || ""))
      reader.readAsText(file)
    }
  }

  const openTeamNamesDialog = () => {
    setTempTeamNames(
      Array.from({ length: numberOfGroups }, (_, i) => customTeamNames[i] || `Team ${i + 1}`),
    )
    setShowTeamNamesDialog(true)
  }

  const removeDuplicates = () => {
    const seen = new Set<string>()
    ;[...participants].forEach((p) => {
      const key = p.name.trim().toLowerCase()
      if (seen.has(key)) removeParticipant(p.id)
      else seen.add(key)
    })
  }

  const clearAllParticipants = () => {
    participants.forEach((p) => removeParticipant(p.id))
  }

  const activePaletteColors = settings.appearance.toolColors as string[] | undefined

  const applyPalette = (colors: string[]) => {
    updateSettings({
      appearance: {
        ...settings.appearance,
        toolColors: colors,
      },
    })
    if (teams.length > 0) {
      useTeamPickerStore.setState({
        teams: teams.map((team, i) => ({
          ...team,
          color: colors[i % colors.length],
        })),
      })
    }
  }

  return (
    <div className="flex max-h-[70vh] min-h-0 flex-col overflow-hidden rounded-lg border bg-white shadow-sm lg:max-h-none">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-slate-50/80 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-800">Team Controls</p>
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {participants.length} people
          </span>
          {teams.length > 0 && (
            <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              {teams.length} teams
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
            title="Shuffle participants"
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
            onUpdateSettings={(partial) => {
              updateSettings(partial as any)
              if (partial.spinBehavior && "removeWinnerAfterSpin" in partial.spinBehavior) {
                onActionModeChange?.(
                  partial.spinBehavior.removeWinnerAfterSpin ? "elimination" : "normal",
                )
              }
            }}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSortZA={() => {
              const sorted = [...participants].sort((a, b) =>
                b.name.localeCompare(a.name, undefined, { sensitivity: "base" }),
              )
              useTeamPickerStore.setState({ participants: sorted })
            }}
            onShuffle={onShuffle}
            onEqualize={() => {}}
            onDeleteBlanks={() => {
              participants
                .filter((p) => !p.name.trim())
                .forEach((p) => removeParticipant(p.id))
            }}
            onRemoveDuplicates={removeDuplicates}
            onClearAll={clearAllParticipants}
          />
        </div>
      </div>

      <div className="flex shrink-0 overflow-x-auto border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (tab.id === "text") {
                setBulkInput(participants.map((p) => p.name).join("\n"))
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

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {sidebarTab === "inputs" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Action Mode</Label>
              <Select
                value={actionMode === "manual" ? "normal" : actionMode}
                onValueChange={(value) =>
                  onActionModeChange
                    ? onActionModeChange(value as "normal" | "elimination")
                    : setActionMode(value as "normal" | "elimination")
                }
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
              {actionMode === "elimination" && eliminatedTeams.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={restoreAllTeams}
                >
                  Restore all teams ({eliminatedTeams.length} out)
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={inputSubTab === "single" ? "default" : "outline"}
                className="h-9"
                onClick={() => setInputSubTab("single")}
              >
                Add One
              </Button>
              <Button
                type="button"
                variant={inputSubTab === "ai" ? "default" : "outline"}
                className={`h-9 gap-1.5 ${
                  inputSubTab === "ai"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : ""
                }`}
                onClick={() => setInputSubTab("ai")}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Setup
              </Button>
            </div>

            {inputSubTab === "single" ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter participant name…"
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddParticipant()}
                  className="h-9"
                />
                <Button type="button" size="sm" className="h-9 px-3" onClick={handleAddParticipant}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2 rounded-lg border border-purple-100 bg-purple-50/40 p-3">
                <p className="text-xs text-purple-700">
                  Quick defaults for group size, or load sample names to try the tool.
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => {
                    setNumberOfGroups(3)
                    setMaxPeoplePerGroup(4)
                    setDistributionMode("default")
                  }}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Optimize Team Settings
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => {
                    ;[
                      "Alice Johnson",
                      "Bob Smith",
                      "Carol Davis",
                      "David Wilson",
                      "Eva Brown",
                      "Frank Miller",
                      "Grace Lee",
                      "Henry Taylor",
                      "Ivy Chen",
                      "Jack Anderson",
                      "Kate Martinez",
                      "Liam O'Connor",
                    ].forEach((name) => addParticipant({ name }))
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Add Sample Participants
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-600">Participants</Label>
                <span className="text-[11px] text-slate-400">{participants.length} total</span>
              </div>
              <div className="max-h-52 space-y-2 overflow-y-auto">
                {participants.length === 0 && (
                  <p className="py-4 text-center text-xs text-slate-400">
                    No participants yet. Add names above or use the Text tab.
                  </p>
                )}
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50/50 p-1.5"
                  >
                    <Input
                      className="h-8 flex-1 text-sm"
                      value={participant.name}
                      onChange={(e) =>
                        updateParticipant(participant.id, { name: e.target.value })
                      }
                      aria-label="Participant name"
                    />
                    {distributionMode === "gender" && showGenderInResult && (
                      <Select
                        value={participant.gender || "unset"}
                        onValueChange={(v) =>
                          updateParticipant(participant.id, {
                            gender: v === "unset" ? undefined : (v as "male" | "female"),
                          })
                        }
                      >
                        <SelectTrigger className="h-8 w-[4.5rem] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unset">—</SelectItem>
                          <SelectItem value="male">♂</SelectItem>
                          <SelectItem value="female">♀</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {distributionMode === "label" && showLabelInResult && (
                      <Input
                        placeholder="Label"
                        value={participant.label || ""}
                        onChange={(e) =>
                          updateParticipant(participant.id, { label: e.target.value })
                        }
                        className="h-8 w-16 text-xs"
                      />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                      onClick={() => removeParticipant(participant.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600">
                  Distribute equally based on
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "default", label: "Default" },
                      { id: "gender", label: "Gender" },
                      { id: "label", label: "Label" },
                    ] as const
                  ).map((mode) => (
                    <Button
                      key={mode.id}
                      type="button"
                      variant={distributionMode === mode.id ? "default" : "outline"}
                      className="h-9 text-xs"
                      onClick={() => setDistributionMode(mode.id)}
                    >
                      {mode.label}
                    </Button>
                  ))}
                </div>
              </div>

              {distributionMode === "gender" && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
                  <p className="text-sm font-medium text-slate-800">Show gender in result</p>
                  <Switch
                    checked={!!showGenderInResult}
                    onCheckedChange={(checked) => setShowGenderInResult?.(checked)}
                  />
                </div>
              )}
              {distributionMode === "label" && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
                  <p className="text-sm font-medium text-slate-800">Show label in result</p>
                  <Switch
                    checked={!!showLabelInResult}
                    onCheckedChange={(checked) => setShowLabelInResult?.(checked)}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  Pick quantity
                  <span title="How many inputs are randomly arranged for grouping (Default mode).">
                    <Info className="h-3.5 w-3.5 text-slate-400" />
                  </span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={Math.max(participants.length, 1)}
                    value={pickQuantity ?? participants.length}
                    onChange={(e) => setPickQuantity?.(Number(e.target.value))}
                    className="h-9 w-24"
                  />
                  <span className="text-xs text-slate-500">/ {participants.length}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Number of groups</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={numberOfGroups}
                  onChange={(e) => {
                    const num = Number.parseInt(e.target.value, 10)
                    if (!Number.isNaN(num) && num > 0) setNumberOfGroups(num)
                  }}
                  className="h-9"
                />
                <p className="text-[11px] text-slate-400">Or set max people per group below</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Max people / group</Label>
                <Input
                  type="number"
                  min={1}
                  value={maxPeoplePerGroup}
                  onChange={(e) => {
                    const num = Number.parseInt(e.target.value, 10)
                    if (!Number.isNaN(num) && num > 0) setMaxPeoplePerGroup(num)
                  }}
                  className="h-9"
                />
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
                <Checkbox
                  id="pick-representatives"
                  checked={pickRepresentatives}
                  onCheckedChange={(checked) => setPickRepresentatives(checked as boolean)}
                />
                <Label htmlFor="pick-representatives" className="text-sm font-medium text-slate-800">
                  Pick representatives
                </Label>
              </div>

              <Button
                type="button"
                className="w-full bg-emerald-600 font-semibold hover:bg-emerald-700"
                disabled={participants.length < 2}
                onClick={() => {
                  setSelectedTeam?.(null)
                  generateTeams()
                }}
              >
                {teams.length > 0 ? "Regenerate Teams" : "Generate Teams"}
              </Button>

              <div className="grid grid-cols-1 gap-2">
                <Button type="button" variant="outline" className="w-full" onClick={clearTeams}>
                  Remove All Groups
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={openTeamNamesDialog}
                >
                  Set Team Names
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-1.5"
                  onClick={() => {
                    setZones(zones.length ? zones : [[]])
                    setShowPresetDialog(true)
                  }}
                >
                  <Grid className="h-3.5 w-3.5" />
                  Preset Group Members
                </Button>
              </div>
            </div>
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              One name per line. Apply to replace or append participants.
            </p>
            <Textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="min-h-[280px] font-mono text-sm"
              placeholder={"Alice\nBob\nCarol"}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleBulkImport}
              >
                Import names
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  CSV
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([exportText], { type: "text/csv" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "participants.csv"
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                Export
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
                    LETTER_COLOR_PALETTES[
                      Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)
                    ]
                  applyPalette([...palette.colors])
                }}
              >
                Randomize
              </Button>
            </div>
            <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto">
              {LETTER_COLOR_PALETTES.map((palette) => {
                const selected = colorsMatch(activePaletteColors, palette.colors)
                return (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => applyPalette([...palette.colors])}
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
          <SidebarOtherOptions
            toolLabel="Team Picker"
            resultsCount={teams.length}
            exportFileName="team-participants.txt"
            exportText={exportText}
            entries={entries}
            onImportText={(text) => {
              text
                .split(/\r?\n/)
                .map((n) => n.trim())
                .filter(Boolean)
                .forEach((name) => addParticipant({ name }))
            }}
            onRemoveDuplicates={removeDuplicates}
            onViewResults={() => {
              window.dispatchEvent(new Event("open-team-results"))
            }}
            onOpenSettings={onOpenSettings}
            onToggleFullscreen={onToggleFullscreen}
            onOpenAI={onOpenAI}
          />
        )}
      </div>

      <Dialog open={showTeamNamesDialog} onOpenChange={setShowTeamNamesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Team Names</DialogTitle>
          </DialogHeader>
          <div className="max-h-60 space-y-3 overflow-y-auto">
            {tempTeamNames.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <Label className="w-16 shrink-0">Team {index + 1}</Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    const next = [...tempTeamNames]
                    next[index] = e.target.value
                    setTempTeamNames(next)
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowTeamNamesDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setCustomTeamNames(tempTeamNames)
                setShowTeamNamesDialog(false)
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showPresetDialog}
        onOpenChange={(open) => {
          setShowPresetDialog(open)
          if (!open) setPresetGroups?.(zones)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preset Group Members</DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-slate-600">
            Only available for Default distribution. Set this after configuring groups.
          </p>
          <div className="flex flex-col items-center gap-2">
            <Button
              type="button"
              className="mb-2 bg-amber-600 text-white hover:bg-amber-700"
              onClick={() => setZones([...zones, []])}
            >
              Add Zone
            </Button>
            {zones.map((zone, idx) => (
              <div key={idx} className="flex w-full items-center gap-2">
                <span className="w-16 shrink-0 text-sm">Zone {idx + 1}</span>
                <div className="max-h-28 flex-1 space-y-1 overflow-y-auto rounded border p-2">
                  {participants.map((p) => {
                    const checked = zoneSelections[idx]?.includes(p.id) || zone.includes(p.id)
                    return (
                      <label key={p.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            const current = new Set(zoneSelections[idx] || zone)
                            if (isChecked) current.add(p.id)
                            else current.delete(p.id)
                            const vals = Array.from(current)
                            setZoneSelections({ ...zoneSelections, [idx]: vals })
                            const next = [...zones]
                            next[idx] = vals
                            setZones(next)
                          }}
                        />
                        {p.name}
                      </label>
                    )
                  })}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setZones(zones.filter((_, i) => i !== idx))
                    const nextSel = { ...zoneSelections }
                    delete nextSel[idx]
                    setZoneSelections(nextSel)
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="destructive" onClick={() => setShowPresetDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-amber-600 text-white hover:bg-amber-700"
              onClick={() => {
                setPresetGroups?.(zones)
                setShowPresetDialog(false)
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
