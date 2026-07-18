"use client"

import { useMemo, useRef, useState, type ReactNode } from "react"
import {
  BarChart3,
  Bot,
  Calculator,
  ChevronRight,
  Code,
  Copy,
  CopyMinus,
  Download,
  History,
  Layers,
  Maximize,
  Monitor,
  QrCode,
  Scale,
  Settings,
  Share2,
  Sparkles,
  Trophy,
  Twitch,
  Upload,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/contexts/toast-context"
import { useSettingsStore } from "@/stores/settings-store"
import {
  buildProbabilityStats,
  getActiveEntries,
  pickWeightedWinners,
  type GiveawayEntry,
} from "@/lib/giveaway-utils"

export type { GiveawayEntry }

interface SidebarOtherOptionsProps {
  toolLabel: string
  resultsCount: number
  exportFileName: string
  exportText: string
  entries: GiveawayEntry[]
  onImportText: (text: string) => void
  onRemoveDuplicates?: () => void
  onViewResults?: () => void
  onOpenSettings?: () => void
  onToggleFullscreen?: () => void
  onOpenAI?: () => void
  onOpenAnalytics?: () => void
}

function ToolRow({
  title,
  description,
  icon,
  iconClassName,
  onClick,
}: {
  title: string
  description: string
  icon: ReactNode
  iconClassName: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-800">{title}</span>
        <span className="block text-xs text-slate-500">{description}</span>
      </span>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </button>
  )
}

export function SidebarOtherOptions({
  toolLabel,
  resultsCount,
  exportFileName,
  exportText,
  entries,
  onImportText,
  onRemoveDuplicates,
  onViewResults,
  onOpenSettings,
  onToggleFullscreen,
  onOpenAI,
  onOpenAnalytics,
}: SidebarOtherOptionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()
  const { settings, updateSettings } = useSettingsStore()

  const [embedOpen, setEmbedOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [multiWinnerOpen, setMultiWinnerOpen] = useState(false)
  const [winnerCount, setWinnerCount] = useState(3)
  const [pickedWinners, setPickedWinners] = useState<string[]>([])
  const [showProbability, setShowProbability] = useState(false)

  const activeCount = getActiveEntries(entries).length
  const pageUrl = typeof window !== "undefined" ? window.location.href : ""
  const embedCode = `<iframe src="${pageUrl}" width="500" height="520" style="border:0;" allowfullscreen></iframe>`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pageUrl)}`

  const probabilityStats = useMemo(() => buildProbabilityStats(entries), [entries])

  const handleExport = () => {
    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = exportFileName
    a.click()
    URL.revokeObjectURL(url)
    showToast("List exported!", "success")
  }

  const handleImport = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onImportText(String(reader.result || ""))
      showToast("List imported!", "success")
    }
    reader.readAsText(file)
  }

  const handleShare = async () => {
    const shareData = {
      title: toolLabel,
      text: `Try this ${toolLabel}`,
      url: pageUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(pageUrl)
      showToast("Link copied!", "success")
    } catch {
      showToast("Could not share link.", "error")
    }
  }

  const copyText = async (text: string, message: string) => {
    await navigator.clipboard.writeText(text)
    showToast(message, "success")
  }

  const startGiveawayMode = () => {
    updateSettings({
      spinBehavior: {
        ...settings.spinBehavior,
        removeWinnerAfterSpin: true,
      },
    })
    showToast("Giveaway mode enabled. Winners are removed after each spin.", "success")
  }

  const handlePickMultipleWinners = () => {
    if (activeCount === 0) {
      showToast("Add entries before picking winners.", "warning")
      return
    }

    const count = Math.max(1, Math.min(winnerCount, activeCount))
    const winners = pickWeightedWinners(entries, count)
    setPickedWinners(winners)
    setMultiWinnerOpen(true)
  }

  const handleRemoveDuplicates = () => {
    if (!onRemoveDuplicates) {
      showToast("Duplicate remover is not available here.", "warning")
      return
    }
    onRemoveDuplicates()
    showToast("Duplicate entries removed!", "success")
  }

  const openObsHelp = () => {
    copyText(
      `${pageUrl}\n\nOBS setup: Add a Browser Source and paste this URL. Use fullscreen for a clean overlay.`,
      "OBS URL copied!",
    )
  }

  const comingSoon = () => showToast("Live API integration is coming soon. Use CSV import for now.", "info")

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 rounded-lg border border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
        <div className="px-3 py-2">{toolLabel}</div>
        <div className="px-3 py-2 text-center">Results {resultsCount}</div>
        <div className="px-3 py-2 text-center text-emerald-600 border-l bg-white rounded-r-lg">
          More Tools
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.csv"
        className="hidden"
        onChange={(e) => {
          handleImport(e.target.files?.[0])
          e.currentTarget.value = ""
        }}
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="justify-start h-9 text-xs" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Import
          </Button>
          <Button variant="outline" className="justify-start h-9 text-xs" onClick={handleExport}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
          </Button>
          <Button variant="outline" className="justify-start h-9 text-xs" onClick={handleShare}>
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            Share
          </Button>
          <Button variant="outline" className="justify-start h-9 text-xs" onClick={() => setEmbedOpen(true)}>
            <Code className="w-3.5 h-3.5 mr-1.5" />
            Embed
          </Button>
          <Button variant="outline" className="justify-start h-9 text-xs" onClick={() => setQrOpen(true)}>
            <QrCode className="w-3.5 h-3.5 mr-1.5" />
            QR Code
          </Button>
          {onToggleFullscreen ? (
            <Button variant="outline" className="justify-start h-9 text-xs" onClick={onToggleFullscreen}>
              <Maximize className="w-3.5 h-3.5 mr-1.5" />
              Fullscreen
            </Button>
          ) : (
            <Button variant="outline" className="justify-start h-9 text-xs" onClick={openObsHelp}>
              <Monitor className="w-3.5 h-3.5 mr-1.5" />
              OBS
            </Button>
          )}
        </div>
        {onToggleFullscreen && (
          <Button variant="outline" className="justify-start h-9 text-xs w-full mt-2" onClick={openObsHelp}>
            <Monitor className="w-3.5 h-3.5 mr-1.5" />
            OBS Overlay URL
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Trophy className="w-3.5 h-3.5 text-emerald-500" />
          Giveaway Tools
        </div>

        <ToolRow
          title="Giveaway Picker"
          description="Enable remove-winner mode for giveaways"
          icon={<Trophy className="w-5 h-5 text-amber-500" />}
          iconClassName="bg-amber-500/15"
          onClick={startGiveawayMode}
        />
        <ToolRow
          title="Multi Winner Picker"
          description={`Pick multiple winners from ${activeCount} entries`}
          icon={<Users className="w-5 h-5 text-sky-500" />}
          iconClassName="bg-sky-500/15"
          onClick={handlePickMultipleWinners}
        />
        <ToolRow
          title="CSV Giveaway Import"
          description="Import a .csv or .txt entry list"
          icon={<Upload className="w-5 h-5 text-emerald-500" />}
          iconClassName="bg-emerald-500/15"
          onClick={() => fileInputRef.current?.click()}
        />
        <ToolRow
          title="Duplicate Entry Remover"
          description="Remove repeated names from the list"
          icon={<CopyMinus className="w-5 h-5 text-orange-500" />}
          iconClassName="bg-orange-500/15"
          onClick={handleRemoveDuplicates}
        />
        <ToolRow
          title="Weighted Giveaway"
          description="Uses entry weights from the List tab"
          icon={<Scale className="w-5 h-5 text-violet-500" />}
          iconClassName="bg-violet-500/15"
          onClick={() =>
            showToast("Weighted giveaway uses each entry's weight in the List tab.", "info")
          }
        />
        <ToolRow
          title="Discord Giveaway"
          description="Paste a Discord entry list via CSV import"
          icon={<Bot className="w-5 h-5 text-indigo-400" />}
          iconClassName="bg-indigo-500/15"
          onClick={comingSoon}
        />
        <ToolRow
          title="Twitch Giveaway"
          description="Paste chat names via CSV import"
          icon={<Twitch className="w-5 h-5 text-purple-400" />}
          iconClassName="bg-purple-500/15"
          onClick={comingSoon}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Premium & Utilities
        </div>

        <ToolRow
          title="Probability Calculator"
          description={`${activeCount} active entries`}
          icon={<Calculator className="w-5 h-5 text-teal-500" />}
          iconClassName="bg-teal-500/15"
          onClick={() => setShowProbability((prev) => !prev)}
        />

        {showProbability && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 max-h-40 overflow-y-auto space-y-1.5">
            {probabilityStats.length === 0 ? (
              <p className="text-xs text-slate-500">No active entries yet.</p>
            ) : (
              probabilityStats.map((stat) => (
                <div key={stat.name} className="flex items-center justify-between text-xs">
                  <span className="truncate pr-2 text-slate-700">{stat.name}</span>
                  <span className="shrink-0 text-slate-500">
                    {stat.weight}x · {stat.probability.toFixed(1)}%
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {onViewResults && (
          <ToolRow
            title="Wheel History"
            description={`View ${resultsCount} saved results`}
            icon={<History className="w-5 h-5 text-blue-500" />}
            iconClassName="bg-blue-500/15"
            onClick={onViewResults}
          />
        )}

        {onOpenAnalytics && (
          <ToolRow
            title="Spin Statistics"
            description="Open analytics for this wheel"
            icon={<BarChart3 className="w-5 h-5 text-pink-500" />}
            iconClassName="bg-pink-500/15"
            onClick={onOpenAnalytics}
          />
        )}

        <ToolRow
          title="Saved Wheels"
          description="Use the wheel dropdown in the header"
          icon={<Layers className="w-5 h-5 text-slate-600" />}
          iconClassName="bg-slate-500/15"
          onClick={() => showToast("Use the wheel switcher in the top header to manage saved wheels.", "info")}
        />

        {onOpenAI && (
          <ToolRow
            title="AI Wheel Generator"
            description="Generate options with AI"
            icon={<Sparkles className="w-5 h-5 text-fuchsia-500" />}
            iconClassName="bg-fuchsia-500/15"
            onClick={onOpenAI}
          />
        )}

        {onOpenSettings && (
          <ToolRow
            title="Background & Brand Logo"
            description="Open appearance settings"
            icon={<Settings className="w-5 h-5 text-slate-600" />}
            iconClassName="bg-slate-500/15"
            onClick={onOpenSettings}
          />
        )}
      </div>

      <Dialog open={embedOpen} onOpenChange={setEmbedOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Embed Wheel</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">Copy this code to embed the current page.</p>
          <textarea
            readOnly
            value={embedCode}
            className="w-full h-24 rounded-md border p-2 text-xs font-mono"
          />
          <Button onClick={() => copyText(embedCode, "Embed code copied!")}>
            <Copy className="w-4 h-4 mr-2" />
            Copy embed code
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code Sharing</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <img src={qrUrl} alt="QR code for this wheel" className="rounded-lg border" />
            <p className="text-xs text-slate-500 text-center break-all">{pageUrl}</p>
            <Button variant="outline" onClick={() => copyText(pageUrl, "Link copied!")}>
              Copy link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={multiWinnerOpen} onOpenChange={setMultiWinnerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Multi Winner Picker</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="winner-count" className="text-xs text-slate-500">
                Number of winners
              </Label>
              <Input
                id="winner-count"
                type="number"
                min={1}
                max={activeCount || 1}
                value={winnerCount}
                onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="mt-1"
              />
            </div>

            {pickedWinners.length > 0 ? (
              <div className="rounded-lg border bg-emerald-50 p-3 space-y-1">
                {pickedWinners.map((winner, index) => (
                  <p key={`${winner}-${index}`} className="text-sm font-medium text-emerald-900">
                    #{index + 1} {winner}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No winners picked yet.</p>
            )}

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handlePickMultipleWinners}>
                Pick again
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => copyText(pickedWinners.join("\n"), "Winners copied!")}
                disabled={pickedWinners.length === 0}
              >
                Copy winners
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
