"use client"

import type { ReactNode } from "react"
import { Star } from "lucide-react"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { cn } from "@/lib/utils"

type ToolFavoriteStarProps = {
  /** Defaults to the store's currentTool */
  toolType?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeClass = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-7 w-7",
}

/**
 * Star toggle next to a tool page title — favorites the wheel tool (not a single wheel).
 */
export function ToolFavoriteStar({ toolType, className, size = "md" }: ToolFavoriteStarProps) {
  const currentTool = useWheelManagerStore((state) => state.currentTool)
  const favoriteTools = useWheelManagerStore((state) => state.favoriteTools)
  const toggleFavoriteTool = useWheelManagerStore((state) => state.toggleFavoriteTool)

  const tool = toolType || currentTool
  const isFavorite = favoriteTools.includes(tool)

  return (
    <button
      type="button"
      onClick={() => toggleFavoriteTool(tool)}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm",
        "border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300",
        isFavorite ? "text-amber-500" : "text-slate-400",
        className,
      )}
      aria-label={isFavorite ? "Remove tool from favorites" : "Add tool to favorites"}
      aria-pressed={isFavorite}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star className={cn(sizeClass[size], isFavorite && "fill-amber-500")} strokeWidth={2} />
    </button>
  )
}

type ToolPageTitleProps = {
  title: ReactNode
  toolType?: string
  className?: string
}

/** Tool page H1 with a favorite star beside the title */
export function ToolPageTitle({ title, toolType, className }: ToolPageTitleProps) {
  return (
    <h1
      className={cn(
        "mb-2 inline-flex items-center justify-center gap-1.5 text-4xl font-bold text-gray-800",
        className,
      )}
    >
      <span>{title}</span>
      <ToolFavoriteStar toolType={toolType} />
    </h1>
  )
}
