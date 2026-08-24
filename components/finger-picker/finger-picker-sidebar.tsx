"use client"

import { useState, type ReactNode } from "react"
import { FileText, List, MoreVertical, Palette, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import { FINGER_PICKER_USE_CASES, type FingerPickerUseCaseId } from "@/lib/finger-picker-use-cases"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import type { FingerPickerActionMode, FingerPickerPlayer } from "@/types/finger-picker-types"
import { FINGER_PICKER_COLORS, FINGER_PICKER_EMOJIS } from "@/types/finger-picker-types"

type Tab = "inputs" | "text" | "style" | "other"

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "inputs", label: "Players", icon: <List className="h-4 w-4" /> },
  { id: "text", label: "Text", icon: <FileText className="h-4 w-4" /> },
  { id: "style", label: "Style", icon: <Palette className="h-4 w-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="h-4 w-4" /> },
]

type Props = {
  actionMode: FingerPickerActionMode
  onActionModeChange: (mode: FingerPickerActionMode) => void
  winnerCount: number
  onWinnerCountChange: (n: number) => void
  players: FingerPickerPlayer[]
  onPlayersChange: (players: FingerPickerPlayer[]) => void
  onApplyTemplate: (id: FingerPickerUseCaseId) => void
  activeUseCaseId?: FingerPickerUseCaseId | null
  onHideInputs?: () => void
  onOpenSettings?: () => void
  onToggleFullscreen?: () => void
  onViewHistory?: () => void
  resultsCount?: number
  soundEnabled: boolean
  vibrationEnabled: boolean
  onSoundChange: (value: boolean) => void
  onVibrationChange: (value: boolean) => void
  currentTheme?: string
  onThemeChange?: (id: string) => void
  desktopMaxHeight?: number | null
}

export function FingerPickerSidebar({
  actionMode,
  onActionModeChange,
  winnerCount,
  onWinnerCountChange,
  players,
  onPlayersChange,
  onApplyTemplate,
  activeUseCaseId,
  onHideInputs,
  onOpenSettings,
  onToggleFullscreen,
  onViewHistory,
  resultsCount = 0,
  soundEnabled,
  vibrationEnabled,
  onSoundChange,
  onVibrationChange,
  currentTheme,
  onThemeChange,
  desktopMaxHeight,
}: Props) {
  const [tab, setTab] = useState<Tab>("inputs")
  const [bulk, setBulk] = useState("")

  const addPlayer = (name = `Player ${players.length + 1}`) => {
    if (players.length >= 10) return
    const index = players.length
    onPlayersChange([
      ...players,
      {
        id: `p-${Date.now()}-${index}`,
        name,
        emoji: FINGER_PICKER_EMOJIS[index % FINGER_PICKER_EMOJIS.length],
        color: FINGER_PICKER_COLORS[index % FINGER_PICKER_COLORS.length],
        eliminated: false,
      },
    ])
  }

  return (
    <aside
      className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
      style={desktopMaxHeight ? { maxHeight: desktopMaxHeight } : undefined}
    >
      <div className="flex shrink-0 border-b">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`flex flex-1 items-center justify-center gap-1 px-1 py-2 text-[11px] font-semibold sm:text-xs ${
              tab === item.id ? "border-b-2 border-violet-600 text-violet-700" : "text-slate-500"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === "inputs" && (
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Action Mode</Label>
              <div className="mt-1 flex gap-2">
                {(["normal", "elimination"] as const).map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    size="sm"
                    variant={actionMode === mode ? "default" : "outline"}
                    className={actionMode === mode ? "bg-violet-600 hover:bg-violet-700" : ""}
                    onClick={() => onActionModeChange(mode)}
                  >
                    {mode === "normal" ? "Normal" : "Elimination"}
                  </Button>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Synced with Manage → Remove winner</p>
            </div>
            <div>
              <Label className="text-xs">Winners per pick (1–5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={winnerCount}
                onChange={(event) => onWinnerCountChange(Math.min(5, Math.max(1, Number(event.target.value) || 1)))}
                className="mt-1 h-9"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Named players (optional)</Label>
                <Button type="button" size="sm" variant="outline" onClick={() => addPlayer()} disabled={players.length >= 10}>
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              </div>
              {players.map((player, index) => (
                <div key={player.id} className="flex items-center gap-2">
                  <span className="text-lg">{player.emoji}</span>
                  <Input
                    value={player.name}
                    onChange={(event) => {
                      const next = [...players]
                      next[index] = { ...player, name: event.target.value }
                      onPlayersChange(next)
                    }}
                    className="h-8"
                  />
                  <button type="button" onClick={() => onPlayersChange(players.filter((item) => item.id !== player.id))}>
                    <Trash2 className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <Label className="text-xs">Modes</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {FINGER_PICKER_USE_CASES.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    size="sm"
                    variant={activeUseCaseId === item.id ? "default" : "outline"}
                    className="h-auto px-2 py-1 text-[11px]"
                    onClick={() => onApplyTemplate(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === "text" && (
          <div className="space-y-2">
            <Label className="text-xs">Paste names (one per line)</Label>
            <textarea
              value={bulk}
              onChange={(event) => setBulk(event.target.value)}
              className="h-40 w-full rounded-md border p-2 text-sm"
              placeholder={"Alex\nSam\nJohn\nMia"}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const names = bulk.split(/\n|,/).map((item) => item.trim()).filter(Boolean).slice(0, 10)
                onPlayersChange(
                  names.map((name, index) => ({
                    id: `p-${Date.now()}-${index}`,
                    name,
                    emoji: FINGER_PICKER_EMOJIS[index % FINGER_PICKER_EMOJIS.length],
                    color: FINGER_PICKER_COLORS[index % FINGER_PICKER_COLORS.length],
                    eliminated: false,
                  })),
                )
              }}
            >
              Load names
            </Button>
          </div>
        )}
        {tab === "style" && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={soundEnabled} onChange={(event) => onSoundChange(event.target.checked)} />
              Sound effects
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={vibrationEnabled} onChange={(event) => onVibrationChange(event.target.checked)} />
              Vibration (mobile)
            </label>
            <div className="flex flex-wrap gap-2">
              {PICKER_WHEEL_THEMES.slice(0, 8).map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onThemeChange?.(theme.id)}
                  className={`rounded-lg border px-2 py-1 text-xs ${currentTheme === theme.id ? "border-violet-500 bg-violet-50" : ""}`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {tab === "other" && (
          <SidebarOtherOptions
            toolLabel="Finger Picker"
            resultsCount={resultsCount}
            exportFileName="finger-picker-history.txt"
            exportText={players.map((item) => item.name).join("\n")}
            entries={players.map((item) => ({ id: item.id, name: item.name, weight: 1 }))}
            onImportText={(text) => {
              const names = text.split(/\n|,/).map((item) => item.trim()).filter(Boolean).slice(0, 10)
              onPlayersChange(
                names.map((name, index) => ({
                  id: `p-${Date.now()}-${index}`,
                  name,
                  emoji: FINGER_PICKER_EMOJIS[index % FINGER_PICKER_EMOJIS.length],
                  color: FINGER_PICKER_COLORS[index % FINGER_PICKER_COLORS.length],
                  eliminated: false,
                })),
              )
            }}
            onViewResults={onViewHistory}
            onOpenSettings={onOpenSettings}
            onToggleFullscreen={onToggleFullscreen}
          />
        )}
      </div>
      {onHideInputs && (
        <div className="border-t p-2">
          <Button type="button" variant="ghost" size="sm" className="w-full" onClick={onHideInputs}>
            Hide panel
          </Button>
        </div>
      )}
    </aside>
  )
}
