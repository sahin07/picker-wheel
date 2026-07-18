"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  ImageIcon,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEnhancedWheelStore, type WheelOption } from "@/stores/enhanced-wheel-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import { useToast } from "@/contexts/toast-context"
import { SlicesManageMenu } from "@/components/slices-manage-menu"
import { SidebarOtherOptions } from "@/components/sidebar-other-options"
import {
  BULK_COLOR_SWATCHES,
  LETTER_COLOR_PALETTES,
} from "@/lib/letter-picker-constants"
import WheelPreviewModal from "@/components/wheel-preview-modal"
import ConfirmationDialog from "@/components/confirmation-dialog"

type SidebarTab = "list" | "text" | "style" | "other"

const EMPTY_OPTIONS: WheelOption[] = []

const TABS: { id: SidebarTab; label: string; icon: ReactNode }[] = [
  { id: "list", label: "List", icon: <ListChecks className="w-4 h-4" /> },
  { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
  { id: "style", label: "Style", icon: <Palette className="w-4 h-4" /> },
  { id: "other", label: "Other Options", icon: <MoreVertical className="w-4 h-4" /> },
]

interface PickerWheelInputPanelProps {
  onViewResults?: () => void
  onOpenSettings?: () => void
  onOpenAI?: () => void
  onOpenAnalytics?: () => void
}

export default function PickerWheelInputPanel({
  onViewResults,
  onOpenSettings,
  onOpenAI,
  onOpenAnalytics,
}: PickerWheelInputPanelProps = {}) {
  const {
    addOption,
    removeOptionsByIds,
    updateOption,
    patchOption,
    duplicateOptionsByIds,
    clearAllOptions,
    shuffleOptions,
    sortOptionsZA,
    equalizeWeights,
    removeBlanks,
    removeDuplicates,
    addRandomOptions,
    setEnabledForIds,
    adjustWeightForIds,
    setColorForIds,
    applyColorPalette,
    setOptionsFromText,
  } = useEnhancedWheelStore()

  const { settings, updateSettings } = useSettingsStore()
  const options = useWheelManagerStore((state) => {
    if (state.currentTool !== "picker-wheel") return EMPTY_OPTIONS
    const wheels = state.wheelsByTool["picker-wheel"] || []
    const wheel = wheels.find((w) => w.id === state.currentWheelId) || wheels[0]
    return ((wheel?.data as any)?.options as WheelOption[]) || EMPTY_OPTIONS
  })
  const resultsCount = useWheelManagerStore((state) => {
    if (state.currentTool !== "picker-wheel") return 0
    const wheels = state.wheelsByTool["picker-wheel"] || []
    const wheel = wheels.find((w) => w.id === state.currentWheelId) || wheels[0]
    return ((wheel?.data as any)?.recentResults as unknown[] | undefined)?.length || 0
  })
  const { showToast } = useToast()

  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("list")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [newTextInput, setNewTextInput] = useState("")
  const [textDraft, setTextDraft] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const activeOptions = useMemo(
    () => options.filter((o) => o.enabled !== false && o.name.trim()),
    [options],
  )

  const totalWeight = useMemo(
    () => activeOptions.reduce((sum, o) => sum + Math.max(1, o.weight ?? 1), 0),
    [activeOptions],
  )

  const getProbability = (option: WheelOption) => {
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

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(options.map((o) => o.id))
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleAdd = () => {
    if (!newTextInput.trim()) return
    addOption(newTextInput.trim())
    setNewTextInput("")
    showToast("Option added!", "success")
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
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setShowPreview(true)} title="Preview">
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
              <Button size="sm" className="h-9 bg-emerald-600 hover:bg-emerald-700" onClick={handleAdd} disabled={!newTextInput.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleSelectAll}
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
                  title="Decrease weight"
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  disabled={selectedCount === 0}
                  onClick={() => adjustWeightForIds(selectedIds, 1)}
                  title="Increase weight"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none"
                  disabled={selectedCount === 0}
                  onClick={() => duplicateOptionsByIds(selectedIds)}
                  title="Duplicate"
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
                  title="Hide selected"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </Button>
              </div>

              {selectedCount > 0 && (
                <>
                  <button type="button" className="text-xs text-slate-500 hover:text-slate-700" onClick={() => setSelectedIds([])}>
                    Clear selection
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      removeOptionsByIds(selectedIds)
                      setSelectedIds([])
                    }}
                    title="Delete selected"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                className="h-7 ml-auto"
                onClick={() => {
                  addRandomOptions()
                  showToast("Random options added!", "success")
                }}
              >
                <ImageIcon className="w-3.5 h-3.5 mr-1" />
                Random
              </Button>

              <SlicesManageMenu
                settings={settings}
                onUpdateSettings={updateSettings}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSortZA={() => {
                  sortOptionsZA()
                  showToast("Sorted Z–A!", "success")
                }}
                onShuffle={() => {
                  shuffleOptions()
                  showToast("Options shuffled!", "success")
                }}
                onEqualize={() => {
                  equalizeWeights()
                  showToast("Weights equalized!", "success")
                }}
                onDeleteBlanks={() => {
                  removeBlanks()
                  showToast("Blank options removed!", "success")
                }}
                onRemoveDuplicates={() => {
                  removeDuplicates()
                  showToast("Duplicates removed!", "success")
                }}
                onClearAll={() => setShowClearConfirm(true)}
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
                    className={`flex items-center gap-1.5 rounded-md border px-1.5 py-1 ${
                      enabled ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60"
                    } ${selected ? "ring-1 ring-emerald-400" : ""}`}
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => toggleSelect(option.id)}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    {option.image ? (
                      <img src={option.image} alt="" className="w-7 h-7 rounded object-cover shrink-0" />
                    ) : null}
                    <Input
                      value={option.name}
                      onChange={(e) => updateOption(option.id, e.target.value, option.image)}
                      className="h-8 flex-1 min-w-0 text-sm font-medium"
                    />
                    <div className="flex items-center border rounded-md overflow-hidden shrink-0">
                      <button
                        type="button"
                        className="h-8 w-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                        disabled={(option.weight ?? 1) <= 1}
                        onClick={() => patchOption(option.id, { weight: Math.max(1, (option.weight ?? 1) - 1) })}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={option.weight ?? 1}
                        onChange={(e) =>
                          patchOption(option.id, { weight: Math.max(1, parseInt(e.target.value, 10) || 1) })
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
                        <DropdownMenuItem onClick={() => patchOption(option.id, { enabled: !enabled })}>
                          {enabled ? "Disable" : "Enable"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateOptionsByIds([option.id])}>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            removeOptionsByIds([option.id])
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
                {searchQuery.trim() ? "No slices match your search." : "Add names or options above to build your wheel."}
              </p>
            )}
          </div>
        )}

        {sidebarTab === "text" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              One option per line. Supports <code className="bg-slate-100 px-1 rounded">3, Name</code> or{" "}
              <code className="bg-slate-100 px-1 rounded">Name, 3</code> for weights.
            </p>
            <Textarea
              value={textValue}
              onChange={(e) => setTextDraft(e.target.value)}
              onBlur={() => {
                if (textDraft !== null) {
                  setOptionsFromText(textDraft)
                  setTextDraft(null)
                }
              }}
              className="min-h-[320px] font-mono text-sm"
              placeholder={"Alice\nBob\nCharlie"}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  if (textDraft !== null) {
                    setOptionsFromText(textDraft)
                    setTextDraft(null)
                    showToast("List updated!", "success")
                  }
                }}
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
                  a.download = "options.csv"
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
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs text-slate-500">Color palettes</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  const palette = LETTER_COLOR_PALETTES[Math.floor(Math.random() * LETTER_COLOR_PALETTES.length)]
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
          <SidebarOtherOptions
            toolLabel="Picker"
            resultsCount={resultsCount}
            exportFileName="options.csv"
            exportText={getTextEditorValue()}
            entries={options.map((o) => ({
              id: o.id,
              name: o.name,
              weight: o.weight ?? 1,
              enabled: o.enabled,
            }))}
            onImportText={(text) => {
              setOptionsFromText(text)
              setTextDraft(null)
            }}
            onRemoveDuplicates={() => {
              removeDuplicates()
            }}
            onViewResults={onViewResults}
            onOpenSettings={onOpenSettings}
            onOpenAI={onOpenAI}
            onOpenAnalytics={onOpenAnalytics}
          />
        )}
      </div>

      <WheelPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} options={options} />
      <ConfirmationDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearAllOptions()
          setSelectedIds([])
          showToast("All options cleared!", "info")
        }}
        title="Clear All Options"
        message="Are you sure you want to remove all options from this wheel? This action cannot be undone."
        confirmText="Clear All"
      />
    </div>
  )
}
