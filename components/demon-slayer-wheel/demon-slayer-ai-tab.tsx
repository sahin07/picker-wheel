"use client"

import { useMemo, useState } from "react"
import { BarChart3, Brain, Sparkles, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { filterByCategory, getAllDemonSlayerEntries } from "@/data/demon-slayer-characters"
import type { DemonSlayerCategory, DemonSlayerEntry } from "@/types/demon-slayer-types"

type AiMode = "chat" | "analysis" | "generator"

type Props = {
  selectedIds: string[]
  onSelectIds: (ids: string[]) => void
  customEntries?: DemonSlayerEntry[]
  onAddCustom?: (entry: DemonSlayerEntry) => void
  recentResults?: DemonSlayerEntry[]
  totalSpins?: number
}

const QUICK_QUESTIONS = [
  "Who should I pick for a beginner Demon Slayer challenge?",
  "Build a balanced Hashira vs Upper Rank draft",
  "Suggest breathing styles for a cosplay challenge",
  "Pick a Hashira for a tough fan challenge",
]

const GENERATOR_PRESETS: { label: string; category?: DemonSlayerCategory; size?: number }[] = [
  { label: "Main cast", category: "main" },
  { label: "Hashira", category: "hashira" },
  { label: "Demons", category: "demon" },
  { label: "Upper Rank", category: "upper_rank" },
  { label: "Lower Rank", category: "lower_rank" },
  { label: "Breathing styles", category: "breathing" },
  { label: "Nichirin colors", category: "nichirin" },
  { label: "Surprise Me!", size: 12 },
]

export function DemonSlayerAiTab({
  selectedIds, onSelectIds, customEntries = [], onAddCustom,
  recentResults = [], totalSpins = 0,
}: Props) {
  const [mode, setMode] = useState<AiMode>("generator")
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [playStyle, setPlayStyle] = useState<"casual" | "competitive" | "collector">("casual")
  const catalog = useMemo(() => [...getAllDemonSlayerEntries(), ...customEntries], [customEntries])

  const applyCategory = (category: DemonSlayerCategory) => {
    onSelectIds(filterByCategory(category).map((item) => item.id))
  }

  const surprise = (size = 12) => {
    const pool = [...catalog].sort(() => Math.random() - 0.5).slice(0, Math.min(size, catalog.length))
    onSelectIds(pool.map((item) => item.id))
  }

  const submitQuery = async (text = query) => {
    const prompt = text.trim()
    if (!prompt) return
    setLoading(true)
    setResponse("")
    try {
      const names = catalog.filter((item) => selectedIds.includes(item.id)).map((item) => item.name)
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a Demon Slayer wheel assistant. Play style: ${playStyle}. Active wheel entries: ${names.join(", ") || "none"}. Recent winners: ${recentResults.map((item) => item.name).join(", ") || "none"}. Total spins: ${totalSpins}. User question: ${prompt}`,
          context: "demon-slayer-wheel",
        }),
      })
      if (!res.ok) throw new Error("AI unavailable")
      const data = await res.json()
      const answer = data.response || data.message || data.text || "No response"
      setResponse(String(answer))
      const mentioned = catalog.filter((item) =>
        String(answer).toLowerCase().includes(item.name.toLowerCase()))
      if (mentioned.length) onSelectIds(mentioned.slice(0, 16).map((item) => item.id))
    } catch {
      const fallback = catalog.filter((item) => selectedIds.includes(item.id)).slice(0, 5)
      setResponse(
        `AI chat is offline right now. Try Generator presets, or start from: ${
          fallback.map((item) => item.name).join(", ") || "Select some entries first"
        }.`,
      )
    } finally {
      setLoading(false)
    }
  }

  const analyze = () => {
    const active = catalog.filter((item) => selectedIds.includes(item.id))
    const byCat: Record<string, number> = {}
    for (const item of active) for (const category of item.category) byCat[category] = (byCat[category] || 0) + 1
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 4)
    setMode("analysis")
    setResponse(
      `Collection analysis (${playStyle}): ${active.length} active entries across ${top.length || 0} top categories. ` +
      (top.length ? `Heaviest: ${top.map(([k, v]) => `${k.replace("_", " ")} (${v})`).join(", ")}. ` : "") +
      `Spins so far: ${totalSpins}. Unique recent winners: ${new Set(recentResults.map((item) => item.name)).size}.`,
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-violet-700" />
        <div>
          <p className="text-sm font-semibold text-slate-800">AI Assistant</p>
          <p className="text-[10px] text-violet-600">Demon Slayer wheel helper</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 rounded-lg border bg-slate-50 p-1">
        {([
          { id: "chat" as const, label: "Chat", icon: <Brain className="h-3.5 w-3.5" /> },
          { id: "analysis" as const, label: "Analysis", icon: <BarChart3 className="h-3.5 w-3.5" /> },
          { id: "generator" as const, label: "Generator", icon: <Sparkles className="h-3.5 w-3.5" /> },
        ]).map((item) => (
          <Button key={item.id} type="button" size="sm" variant={mode === item.id ? "default" : "ghost"}
            className="gap-1 text-xs" onClick={() => setMode(item.id)}>
            {item.icon}{item.label}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Play style</Label>
        <div className="grid grid-cols-3 gap-1">
          {(["casual", "competitive", "collector"] as const).map((style) => (
            <Button key={style} type="button" size="sm" variant={playStyle === style ? "default" : "outline"}
              className="capitalize text-xs" onClick={() => setPlayStyle(style)}>{style}</Button>
          ))}
        </div>
      </div>

      {mode === "chat" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((question) => (
              <Button key={question} type="button" size="sm" variant="outline" className="h-auto whitespace-normal px-2 py-1 text-left text-[10px]"
                onClick={() => { setQuery(question); void submitQuery(question) }}>{question}</Button>
            ))}
          </div>
          <Textarea value={query} onChange={(event) => setQuery(event.target.value)} rows={3}
            placeholder="Ask about drafts, Domains, or challenge ideas..." />
          <Button type="button" className="w-full" disabled={loading || !query.trim()} onClick={() => void submitQuery()}>
            {loading ? "Thinking..." : "Ask AI"}
          </Button>
          {response && <div className="rounded-lg border bg-violet-50 p-3 text-xs text-violet-950 whitespace-pre-wrap">{response}</div>}
        </div>
      )}

      {mode === "analysis" && (
        <div className="space-y-3">
          <Button type="button" className="w-full" onClick={analyze}>
            <Target className="mr-1 h-4 w-4" /> Analyze my collection
          </Button>
          {response && <div className="rounded-lg border bg-violet-50 p-3 text-xs text-violet-950 whitespace-pre-wrap">{response}</div>}
        </div>
      )}

      {mode === "generator" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">Build a ready-made Demon Slayer wheel set in one tap.</p>
          <div className="grid grid-cols-2 gap-2">
            {GENERATOR_PRESETS.map((preset) => (
              <Button key={preset.label} type="button" variant="outline" size="sm"
                onClick={() => {
                  if (preset.size) surprise(preset.size)
                  else if (preset.category) applyCategory(preset.category)
                }}>{preset.label}</Button>
            ))}
          </div>
          <div className="space-y-2 rounded-lg border p-3">
            <Label className="text-xs">Custom request</Label>
            <Input value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. Hashira-only challenge wheel" />
            <Button type="button" size="sm" className="w-full" disabled={loading}
              onClick={() => void submitQuery(query || "Suggest a themed Demon Slayer wheel set")}>
              Generate
            </Button>
          </div>
          {response && <div className="rounded-lg border bg-violet-50 p-3 text-xs text-violet-950 whitespace-pre-wrap">{response}</div>}
          <Button type="button" variant="outline" size="sm" className="w-full"
            onClick={() => {
              const name = `OC ${Date.now().toString().slice(-4)}`
              onAddCustom?.({
                id: `demon-slayer-custom-${Date.now()}`, name, emoji: "✨", category: ["main"], custom: true,
                preview: `/placeholder.svg?text=${encodeURIComponent(name)}`,
              })
            }}>
            Add blank custom entry
          </Button>
        </div>
      )}
    </div>
  )
}
