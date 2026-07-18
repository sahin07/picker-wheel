"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, X, Circle, Star, Pencil } from "lucide-react"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useCustomWheelStore } from "@/stores/custom-wheel-store"
import { getToolByType, getToolHref, getToolLabel } from "@/lib/wheel-categories"
import { cn } from "@/lib/utils"

const ACTIVE_ROW =
  "border-orange-400 bg-orange-50 ring-2 ring-orange-300/70"
const ACTIVE_BADGE =
  "shrink-0 rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"

function formatWheelDate(value?: string) {
  if (!value) return "Just now"
  try {
    return new Date(value).toLocaleString(undefined, {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    })
  } catch {
    return value
  }
}

function toolMeta(toolType: string) {
  const meta = getToolByType(toolType)
  return {
    toolType,
    label: meta?.label || getToolLabel(toolType),
    href: meta?.href || getToolHref(toolType),
    Icon: meta?.icon,
    color: meta?.color || "#16a34a",
    bg: meta?.bg || "rgba(22, 163, 74, 0.12)",
  }
}

/** Match active tool from the real URL (more reliable than store alone). */
function isToolRouteActive(pathname: string, href: string) {
  if (!pathname) return false
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function MyWheelsMenu() {
  const pathname = usePathname() || ""
  const [isClient, setIsClient] = useState(false)
  const [open, setOpen] = useState(false)
  const [editingWheelId, setEditingWheelId] = useState<string | null>(null)
  const [editingCustomSlug, setEditingCustomSlug] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const currentWheelId = useWheelManagerStore((state) => state.currentWheelId)
  const currentTool = useWheelManagerStore((state) => state.currentTool)
  const wheelsByTool = useWheelManagerStore((state) => state.wheelsByTool)
  const favoriteTools = useWheelManagerStore((state) => state.favoriteTools)
  const setCurrentWheel = useWheelManagerStore((state) => state.setCurrentWheel)
  const setCurrentTool = useWheelManagerStore((state) => state.setCurrentTool)
  const createNewWheel = useWheelManagerStore((state) => state.createNewWheel)
  const deleteWheel = useWheelManagerStore((state) => state.deleteWheel)
  const updateWheelName = useWheelManagerStore((state) => state.updateWheelName)
  const toggleFavoriteTool = useWheelManagerStore((state) => state.toggleFavoriteTool)
  const customWheels = useCustomWheelStore((state) => state.wheels)
  const deleteCustomBySlug = useCustomWheelStore((state) => state.deleteBySlug)
  const updateCustomBySlug = useCustomWheelStore((state) => state.updateWheelBySlug)

  const wheels = useMemo(() => wheelsByTool[currentTool] || [], [wheelsByTool, currentTool])
  const wheelCount = wheels.length
  const customCount = customWheels.length
  const onCustomRoute = pathname.startsWith("/w/")

  /** Every tool the user has opened/played (has at least one saved local wheel). */
  const playedTools = useMemo(() => {
    return Object.entries(wheelsByTool)
      .filter(([, list]) => Array.isArray(list) && list.length > 0)
      .map(([toolType, list]) => {
        const latest = list.reduce((max, w) => {
          const t = Date.parse(w.updatedAt || w.createdAt || "") || 0
          return t > max ? t : max
        }, 0)
        return { ...toolMeta(toolType), wheelCount: list.length, lastActive: latest }
      })
      .sort((a, b) => b.lastActive - a.lastActive)
  }, [wheelsByTool])

  const allLocalWheelCount = useMemo(
    () => Object.values(wheelsByTool).reduce((sum, list) => sum + (list?.length || 0), 0),
    [wheelsByTool],
  )
  const totalCount = allLocalWheelCount + customCount
  const favoriteCount = favoriteTools.length
  const isCurrentFavorite = favoriteTools.includes(currentTool)

  const favoriteItems = useMemo(
    () => favoriteTools.map((toolType) => toolMeta(toolType)),
    [favoriteTools],
  )

  const isActiveTool = (href: string) => !onCustomRoute && isToolRouteActive(pathname, href)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      setOpen(false)
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onEscape)
    }
  }, [open])

  const handleCreate = () => {
    const id = `${currentTool}-${Date.now()}`
    const now = new Date().toISOString()
    const newWheelId = createNewWheel(currentTool, "Untitled wheel", id, now, now)
    setCurrentWheel(newWheelId)
    setOpen(true)
  }

  const handleDelete = (wheelId: string) => {
    if (wheels.length <= 1) return
    deleteWheel(currentTool, wheelId)
  }

  const handleSelect = (wheelId: string) => {
    setCurrentWheel(wheelId)
    setOpen(false)
  }

  const startRename = (wheelId: string, name: string) => {
    setEditingCustomSlug(null)
    setEditingWheelId(wheelId)
    setEditingName(name)
  }

  const startCustomRename = (slug: string, name: string) => {
    setEditingWheelId(null)
    setEditingCustomSlug(slug)
    setEditingName(name)
  }

  const saveRename = (wheelId: string) => {
    if (editingName.trim()) {
      updateWheelName(currentTool, wheelId, editingName.trim())
    }
    setEditingWheelId(null)
    setEditingName("")
  }

  const saveCustomRename = (slug: string) => {
    if (editingName.trim()) {
      updateCustomBySlug(slug, { name: editingName.trim() })
    }
    setEditingCustomSlug(null)
    setEditingName("")
  }

  const cancelRename = () => {
    setEditingWheelId(null)
    setEditingCustomSlug(null)
    setEditingName("")
  }

  if (!isClient) {
    return (
      <Button variant="ghost" size="sm" className="font-spin-display font-semibold text-gray-700" disabled>
        My Wheels (0)
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className={cn(
          "font-spin-display font-semibold text-gray-700",
          open && "bg-emerald-50 text-emerald-700 underline underline-offset-4",
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((prev) => !prev)}
      >
        My Wheels ({totalCount})
      </Button>

      {open && (
        <div
          ref={panelRef}
          className="absolute left-1/2 top-full z-[60] mt-2 w-[300px] -translate-x-1/2 rounded-xl border border-emerald-200 bg-white p-3 shadow-xl"
          role="dialog"
          aria-label="My Wheels"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="font-spin-display text-sm font-bold text-emerald-700">My Wheels</p>
              <p className="text-xs text-slate-500">Saved on this device</p>
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-3 rounded-lg border border-amber-100 bg-amber-50/60 p-2.5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Favorites ({favoriteCount})
              </p>
              <button
                type="button"
                onClick={() => toggleFavoriteTool(currentTool)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors",
                  isCurrentFavorite
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    : "bg-white text-amber-700 hover:bg-amber-100",
                )}
                title={isCurrentFavorite ? "Remove this tool from favorites" : "Add this tool to favorites"}
              >
                <Star className={cn("h-3.5 w-3.5", isCurrentFavorite && "fill-amber-500 text-amber-500")} />
                {isCurrentFavorite ? "Favorited" : "Favorite"}
              </button>
            </div>

            {favoriteItems.length === 0 ? (
              <p className="text-xs text-amber-700/70">
                Favorite this tool for quick access here.
              </p>
            ) : (
              <div className="max-h-36 space-y-1 overflow-y-auto">
                {favoriteItems.map((item) => {
                  const Icon = item.Icon
                  const active = isActiveTool(item.href)
                  return (
                    <div
                      key={item.toolType}
                      className={cn(
                        "group flex items-center gap-2 rounded-lg border px-2 py-1.5",
                        active ? ACTIVE_ROW : "border-transparent bg-white/80 hover:border-amber-200",
                      )}
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          setCurrentTool(item.toolType)
                          setOpen(false)
                        }}
                        className="flex min-w-0 flex-1 items-center gap-2"
                      >
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: item.bg, color: item.color }}
                        >
                          {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={2.25} /> : <Star className="h-3.5 w-3.5" />}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-800">
                          {item.label}
                        </span>
                        {active && <span className={ACTIVE_BADGE}>Active</span>}
                      </Link>
                      <button
                        type="button"
                        className="shrink-0 rounded p-1 text-amber-500 hover:bg-amber-100 hover:text-amber-700"
                        title="Remove from favorites"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavoriteTool(item.toolType)
                        }}
                      >
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mb-3 rounded-lg border border-emerald-100 bg-emerald-50/40 p-2.5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Tools you played ({playedTools.length})
            </p>
            {playedTools.length === 0 ? (
              <p className="text-xs text-emerald-700/70">
                Open any picker wheel and it will show up here so you can switch back.
              </p>
            ) : (
              <div className="max-h-44 space-y-1 overflow-y-auto">
                {playedTools.map((item) => {
                  const Icon = item.Icon
                  const active = isActiveTool(item.href)
                  return (
                    <Link
                      key={item.toolType}
                      href={item.href}
                      onClick={() => {
                        setCurrentTool(item.toolType)
                        setOpen(false)
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors",
                        active ? ACTIVE_ROW : "border-transparent bg-white/80 hover:border-emerald-200 hover:bg-white",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                        style={{ backgroundColor: item.bg, color: item.color }}
                      >
                        {Icon ? (
                          <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                        ) : (
                          <Circle className={cn("h-3.5 w-3.5", active && "fill-orange-500")} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-800">
                        {item.label}
                      </span>
                      {active ? (
                        <span className={ACTIVE_BADGE}>Active</span>
                      ) : (
                        <span className="shrink-0 text-[10px] font-medium text-slate-400">
                          {item.wheelCount} {item.wheelCount === 1 ? "wheel" : "wheels"}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Custom wheels ({customCount})
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              asChild
            >
              <Link href="/create-custom-wheel-spinner" onClick={() => setOpen(false)}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                New
              </Link>
            </Button>
          </div>

          <div className="mb-3 max-h-40 space-y-1.5 overflow-y-auto">
            {customWheels.length === 0 ? (
              <p className="px-1 py-3 text-center text-xs text-slate-400">
                No custom wheels yet
              </p>
            ) : (
              customWheels.map((wheel) => {
                const active = pathname === `/w/${wheel.slug}`
                const isEditing = editingCustomSlug === wheel.slug
                return (
                  <div
                    key={wheel.id}
                    className={cn(
                      "group flex items-start gap-2 rounded-lg border px-2.5 py-2 transition-colors",
                      active ? ACTIVE_ROW : "border-slate-100 bg-white hover:border-orange-200 hover:bg-orange-50/40",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-7 text-xs"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveCustomRename(wheel.slug)
                            if (e.key === "Escape") cancelRename()
                          }}
                          onBlur={() => saveCustomRename(wheel.slug)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <Link
                          href={`/w/${wheel.slug}`}
                          onClick={() => setOpen(false)}
                          className="block min-w-0 text-left"
                          aria-current={active ? "page" : undefined}
                        >
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-slate-800">{wheel.name}</p>
                            {active && <span className={ACTIVE_BADGE}>Active</span>}
                          </div>
                          <p className="truncate text-[11px] text-slate-400">
                            /w/{wheel.slug}
                          </p>
                        </Link>
                      )}
                    </div>
                    {!isEditing && (
                      <button
                        type="button"
                        className="shrink-0 rounded p-1 text-slate-400 opacity-70 transition-opacity hover:bg-orange-50 hover:text-orange-600 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          startCustomRename(wheel.slug, wheel.name)
                        }}
                        title="Rename wheel"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="shrink-0 rounded p-1 text-red-400 opacity-70 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteCustomBySlug(wheel.slug)
                      }}
                      title="Delete custom wheel"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              On this tool ({wheelCount})
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              onClick={handleCreate}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              New
            </Button>
          </div>

          <div className="max-h-64 space-y-1.5 overflow-y-auto">
            {wheels.length === 0 ? (
              <p className="px-1 py-4 text-center text-xs text-slate-400">No local wheels yet</p>
            ) : (
              wheels.map((wheel) => {
                const active = !onCustomRoute && wheel.id === currentWheelId
                const isEditing = editingWheelId === wheel.id

                return (
                  <div
                    key={wheel.id}
                    className={cn(
                      "group flex items-start gap-2 rounded-lg border px-2.5 py-2 transition-colors",
                      active ? ACTIVE_ROW : "border-slate-100 bg-white hover:border-orange-200 hover:bg-orange-50/40",
                    )}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-orange-500"
                      onClick={() => handleSelect(wheel.id)}
                      title="Open wheel"
                    >
                      <Circle className={cn("h-3.5 w-3.5", active ? "fill-orange-500" : "")} />
                    </button>

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-7 text-xs"
                          placeholder="Wheel name"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename(wheel.id)
                            if (e.key === "Escape") cancelRename()
                          }}
                          onBlur={() => saveRename(wheel.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left"
                          onClick={() => handleSelect(wheel.id)}
                        >
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-slate-800">{wheel.name}</p>
                            {active && <span className={ACTIVE_BADGE}>Active</span>}
                          </div>
                          <p className="truncate text-[11px] text-slate-400">
                            {formatWheelDate(wheel.updatedAt || wheel.createdAt)}
                          </p>
                        </button>
                      )}
                    </div>

                    {!isEditing && (
                      <button
                        type="button"
                        className="shrink-0 rounded p-1 text-slate-400 opacity-70 transition-opacity hover:bg-orange-50 hover:text-orange-600 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          startRename(wheel.id, wheel.name)
                        }}
                        title="Rename wheel"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      className={cn(
                        "shrink-0 rounded p-1 text-red-400 transition-opacity hover:bg-red-50 hover:text-red-600",
                        wheels.length <= 1 ? "cursor-not-allowed opacity-30" : "opacity-70 group-hover:opacity-100",
                      )}
                      disabled={wheels.length <= 1}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(wheel.id)
                      }}
                      title={wheels.length <= 1 ? "Keep at least one wheel" : "Delete wheel"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
