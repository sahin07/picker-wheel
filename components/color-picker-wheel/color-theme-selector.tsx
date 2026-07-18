"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const THEMES = [
  { name: "classic", label: "Classic", swatch: "#64748b" },
  { name: "neon", label: "Neon", swatch: "#e879f9" },
  { name: "ocean", label: "Ocean", swatch: "#22d3ee" },
  { name: "sunset", label: "Sunset", swatch: "#fb923c" },
  { name: "forest", label: "Forest", swatch: "#10b981" },
] as const

type ColorThemeSelectorProps = {
  isVisible: boolean
  onClose: () => void
  wheelTheme: string
  setWheelTheme: (theme: string) => void
}

export function ColorThemeSelector({
  isVisible,
  onClose,
  wheelTheme,
  setWheelTheme,
}: ColorThemeSelectorProps) {
  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Wheel Themes</DialogTitle>
          <DialogDescription>Choose a frame style for the color wheel.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {THEMES.map((theme) => (
            <Button
              key={theme.name}
              type="button"
              variant={wheelTheme === theme.name ? "default" : "outline"}
              className="justify-start gap-3"
              onClick={() => {
                setWheelTheme(theme.name)
                onClose()
              }}
            >
              <span
                className="h-4 w-4 rounded-full border border-white/40 shadow"
                style={{ backgroundColor: theme.swatch }}
              />
              {theme.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
