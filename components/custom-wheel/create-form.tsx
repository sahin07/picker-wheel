"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Link2, Check } from "lucide-react"
import { LETTER_WHEEL_COLORS } from "@/lib/letter-picker-constants"
import {
  type CustomWheelOption,
  buildShareUrl,
  createDefaultOptions,
  createOptionId,
  packCustomWheel,
  slugifyName,
} from "@/lib/custom-wheel"
import { useCustomWheelStore } from "@/stores/custom-wheel-store"
import { cn } from "@/lib/utils"

export default function CreateCustomWheelForm() {
  const router = useRouter()
  const saveNewWheel = useCustomWheelStore((s) => s.saveNewWheel)
  const listSlugs = useCustomWheelStore((s) => s.listSlugs)

  const [name, setName] = useState("My Custom Wheel")
  const [description, setDescription] = useState("A custom spin wheel for random decisions.")
  const [options, setOptions] = useState<CustomWheelOption[]>(() => createDefaultOptions(4))
  const [error, setError] = useState("")
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const previewSlug = useMemo(() => slugifyName(name), [name])
  const existing = listSlugs().some((s) => s.toLowerCase() === previewSlug.toLowerCase())

  const updateOption = (id: string, patch: Partial<CustomWheelOption>) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  }

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        id: createOptionId(),
        name: `Option ${prev.length + 1}`,
        color: LETTER_WHEEL_COLORS[prev.length % LETTER_WHEEL_COLORS.length],
        weight: 1,
        enabled: true,
      },
    ])
  }

  const removeOption = (id: string) => {
    setOptions((prev) => (prev.length <= 2 ? prev : prev.filter((o) => o.id !== id)))
  }

  const handleCreate = () => {
    setError("")
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Please enter a wheel name.")
      return
    }
    const validOptions = options.filter((o) => o.name.trim())
    if (validOptions.length < 2) {
      setError("Add at least 2 options.")
      return
    }

    const wheel = saveNewWheel({
      name: trimmed,
      description,
      options: validOptions,
    })
    // Ensure pending handoff + allow persist to flush before route change
    requestAnimationFrame(() => {
      router.push(`/w/${wheel.slug}`)
    })
  }

  const handleCopyShare = async () => {
    setError("")
    const trimmed = name.trim() || "My Custom Wheel"
    const validOptions = options.filter((o) => o.name.trim())
    if (validOptions.length < 2) {
      setError("Add at least 2 options before sharing.")
      return
    }
    const wheel = saveNewWheel({
      name: trimmed,
      description,
      options: validOptions,
    })
    const url = buildShareUrl(wheel.slug, packCustomWheel(wheel))
    setShareUrl(url)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("Could not copy automatically — use the link below.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="wheel-name" className="font-spin-display">
          Wheel name
        </Label>
        <Input
          id="wheel-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Party Night"
          className="font-spin-body"
        />
        <p className="text-xs text-slate-500">
          URL preview:{" "}
          <span className="font-mono text-emerald-700">
            /w/{previewSlug}
            {existing ? "-????" : ""}
          </span>
          {existing ? (
            <span className="ml-1 text-amber-600">(name taken — a short code will be added)</span>
          ) : null}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wheel-desc" className="font-spin-display">
          Description
        </Label>
        <Textarea
          id="wheel-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="What is this wheel for?"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label className="font-spin-display">Options</Label>
          <Button type="button" variant="outline" size="sm" onClick={addOption}>
            <Plus className="mr-1 h-4 w-4" />
            Add option
          </Button>
        </div>

        <div className="space-y-2">
          {options.map((option, index) => (
            <div
              key={option.id}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-2"
            >
              <input
                type="color"
                value={option.color}
                onChange={(e) => updateOption(option.id, { color: e.target.value })}
                className="h-9 w-10 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                title="Slice color"
              />
              <Input
                value={option.name}
                onChange={(e) => updateOption(option.id, { name: e.target.value })}
                placeholder={`Option ${index + 1}`}
                className="flex-1 bg-white"
              />
              <div className="hidden flex-wrap gap-1 sm:flex">
                {LETTER_WHEEL_COLORS.slice(0, 8).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      "h-5 w-5 rounded-full border border-white shadow-sm ring-1 ring-slate-200",
                      option.color === c && "ring-2 ring-emerald-500",
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => updateOption(option.id, { color: c })}
                    aria-label={`Use color ${c}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className={cn(
                  "rounded p-2 text-red-400 hover:bg-red-50 hover:text-red-600",
                  options.length <= 2 && "cursor-not-allowed opacity-30",
                )}
                disabled={options.length <= 2}
                onClick={() => removeOption(option.id)}
                title="Remove option"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          className="font-spin-display bg-emerald-600 hover:bg-emerald-700"
          onClick={handleCreate}
        >
          Create &amp; open wheel
        </Button>
        <Button type="button" variant="outline" className="font-spin-display" onClick={handleCopyShare}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Link2 className="mr-1.5 h-4 w-4" />}
          {copied ? "Link copied" : "Copy share link"}
        </Button>
      </div>

      {shareUrl ? (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Share link (works on Vercel, no database)
          </p>
          <p className="break-all font-mono text-xs text-slate-600">{shareUrl}</p>
        </div>
      ) : null}
    </div>
  )
}
