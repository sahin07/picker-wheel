"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SpinWheel } from "@/components/letter-picker/spin-wheel"
import CustomWheelInputPanel from "@/components/custom-wheel/input-panel"
import type { CustomWheel, CustomWheelOption } from "@/lib/custom-wheel"
import {
  buildShareUrl,
  optionsToSlices,
  packCustomWheel,
} from "@/lib/custom-wheel"
import { useCustomWheelStore } from "@/stores/custom-wheel-store"
import { Pencil } from "lucide-react"
import Confetti from "react-confetti"

type Props = {
  wheel: CustomWheel
  onWheelChange?: (wheel: CustomWheel) => void
}

export default function CustomWheelPlayer({ wheel: initialWheel, onWheelChange }: Props) {
  const updateWheelBySlug = useCustomWheelStore((s) => s.updateWheelBySlug)
  const upsertWheel = useCustomWheelStore((s) => s.upsertWheel)

  const [wheel, setWheel] = useState(initialWheel)
  const [name, setName] = useState(initialWheel.name)
  const [description, setDescription] = useState(initialWheel.description)
  const [options, setOptions] = useState<CustomWheelOption[]>(initialWheel.options)
  const [editingTitle, setEditingTitle] = useState(false)

  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [toolMuted, setToolMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [resultIndex, setResultIndex] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const spinningRef = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const spinDurationMs = 4500

  useEffect(() => {
    setWheel(initialWheel)
    setName(initialWheel.name)
    setDescription(initialWheel.description)
    setOptions(initialWheel.options)
  }, [initialWheel.id, initialWheel.slug])

  const persist = useCallback(
    (next: { name?: string; description?: string; options?: CustomWheelOption[] }) => {
      const patch = {
        name: next.name ?? name,
        description: next.description ?? description,
        options: next.options ?? options,
      }
      const updated = updateWheelBySlug(wheel.slug, patch)
      if (updated) {
        setWheel(updated)
        onWheelChange?.(updated)
        setSavedFlash(true)
        window.setTimeout(() => setSavedFlash(false), 1200)
        return updated
      }
      const fallback: CustomWheel = {
        ...wheel,
        ...patch,
        name: patch.name.trim() || wheel.name,
        updatedAt: new Date().toISOString(),
      }
      upsertWheel(fallback)
      setWheel(fallback)
      onWheelChange?.(fallback)
      setSavedFlash(true)
      window.setTimeout(() => setSavedFlash(false), 1200)
      return fallback
    },
    [name, description, options, wheel, updateWheelBySlug, upsertWheel, onWheelChange],
  )

  const schedulePersist = useCallback(
    (next: { name?: string; description?: string; options?: CustomWheelOption[] }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => persist(next), 400)
    },
    [persist],
  )

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const handleOptionsChange = (next: CustomWheelOption[]) => {
    setOptions(next)
    schedulePersist({ options: next })
  }

  const handleNameBlur = () => {
    setEditingTitle(false)
    const trimmed = name.trim() || wheel.name
    setName(trimmed)
    persist({ name: trimmed })
  }

  const handleDescriptionBlur = () => {
    persist({ description })
  }

  const slices = useMemo(() => optionsToSlices(options), [options])

  const pickWeightedIndex = useCallback(() => {
    const total = slices.reduce((sum, s) => sum + Math.max(1, s.weight || 1), 0)
    let rand = Math.random() * total
    for (let i = 0; i < slices.length; i++) {
      rand -= Math.max(1, slices[i].weight || 1)
      if (rand <= 0) return i
    }
    return slices.length - 1
  }, [slices])

  const getAngleForIndex = useCallback(
    (index: number) => {
      // Must match SpinWheel segment layout (cursor starts at -90°).
      const total = slices.reduce((sum, s) => sum + Math.max(1, s.weight || 1), 0) || 1
      let cursor = -90
      for (let i = 0; i < slices.length; i++) {
        const span = (Math.max(1, slices[i].weight || 1) / total) * 360
        if (i === index) return cursor + span / 2
        cursor += span
      }
      return -90
    },
    [slices],
  )

  const spinWheel = () => {
    if (isSpinning || spinningRef.current || slices.length === 0) return
    spinningRef.current = true
    setIsSpinning(true)
    setResult(null)
    setResultIndex(null)
    setShowConfetti(false)

    const selectedIndex = pickWeightedIndex()
    const selected = slices[selectedIndex]
    const targetMidAngle = getAngleForIndex(selectedIndex)
    const spins = 4 + Math.floor(Math.random() * 3)
    const current = ((rotation % 360) + 360) % 360
    const desired = ((-targetMidAngle - current) % 360 + 360) % 360
    const extra = spins * 360 + desired
    const nextRotation = rotation + extra
    setRotation(nextRotation)

    window.setTimeout(() => {
      // Keep the final angle locked, then clear spinning (drops CSS transition safely).
      setRotation(nextRotation)
      setIsSpinning(false)
      spinningRef.current = false
      setResult(selected.text)
      setResultIndex(selectedIndex)
      setHistory((prev) => [selected.text, ...prev].slice(0, 50))
      setShowConfetti(true)
      window.setTimeout(() => setShowConfetti(false), 3500)
    }, spinDurationMs)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isFullscreen])

  const handleCopyShare = async () => {
    const latest = persist({})
    if (!latest) return
    const url = buildShareUrl(latest.slug, packCustomWheel(latest))
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="w-full">
      {!isFullscreen && (
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            {editingTitle ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameBlur()
                  if (e.key === "Escape") {
                    setName(wheel.name)
                    setEditingTitle(false)
                  }
                }}
                autoFocus
                className="max-w-xl text-center text-3xl font-bold h-auto py-2"
              />
            ) : (
              <button
                type="button"
                className="group inline-flex items-center gap-2"
                onClick={() => setEditingTitle(true)}
                title="Edit title"
              >
                <h1 className="text-4xl font-bold text-gray-800 group-hover:text-emerald-800">
                  {name}
                </h1>
                <Pencil className="h-4 w-4 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            )}
          </div>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Help you to make a random decision"
            className="mx-auto max-w-xl border-transparent bg-transparent text-center text-gray-600 shadow-none focus-visible:border-slate-200 focus-visible:bg-white"
          />
          <div className="mt-2 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span className="font-mono">/w/{wheel.slug}</span>
            {savedFlash ? <span className="text-emerald-600">Saved</span> : null}
          </div>
        </div>
      )}

      <div className={isFullscreen ? "" : "grid lg:grid-cols-3 gap-8 mb-8"}>
        <div
          className={
            isFullscreen
              ? ""
              : "relative lg:col-span-2 bg-white rounded-lg shadow-sm border p-6 overflow-hidden"
          }
        >
          {!isFullscreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResults((v) => !v)}
              className="absolute top-4 left-4 z-10 text-xs px-3 py-1 bg-white hover:bg-gray-50 shadow-sm border-blue-500 text-blue-600 hover:border-blue-600"
            >
              Results
              {history.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {history.length}
                </Badge>
              )}
            </Button>
          )}

          <SpinWheel
            slices={slices}
            rotation={rotation}
            isSpinning={isSpinning}
            spinDurationMs={spinDurationMs}
            soundEnabled={soundEnabled}
            isFullscreen={isFullscreen}
            toolMuted={toolMuted}
            setToolMuted={setToolMuted}
            highlightIndex={resultIndex}
            onSpin={spinWheel}
            onToggleSound={() => setSoundEnabled((v) => !v)}
            onShowAllResults={() => setShowResults(true)}
            onToggleFullscreen={() => setIsFullscreen((v) => !v)}
          />

          {result && !isSpinning ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Result</p>
              <p className="font-spin-display text-2xl font-bold text-emerald-900">{result}</p>
            </div>
          ) : null}

          {showResults && !isFullscreen ? (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Recent results</p>
                <button
                  type="button"
                  className="text-xs text-slate-400 hover:text-slate-700"
                  onClick={() => setHistory([])}
                >
                  Clear
                </button>
              </div>
              {history.length === 0 ? (
                <p className="text-xs text-slate-400">No results yet. Spin the wheel!</p>
              ) : (
                <ol className="max-h-40 space-y-1 overflow-y-auto text-sm text-slate-600">
                  {history.map((item, i) => (
                    <li key={`${item}-${i}`}>
                      {i + 1}. {item}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ) : null}
        </div>

        {!isFullscreen && (
          <CustomWheelInputPanel
            options={options}
            onChange={handleOptionsChange}
            resultsCount={history.length}
            onCopyShare={handleCopyShare}
            shareCopied={copied}
          />
        )}
      </div>

      {showConfetti && typeof window !== "undefined" ? (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={250}
          recycle={false}
          style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 1000 }}
        />
      ) : null}
    </div>
  )
}
