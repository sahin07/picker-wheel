"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FINGER_PICKER_USE_CASES, type FingerPickerUseCaseId } from "@/lib/finger-picker-use-cases"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (id: FingerPickerUseCaseId) => void
}

export function FingerPickerGamesDialog({ open, onOpenChange, onSelect }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Finger Picker games</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 sm:grid-cols-2">
          {FINGER_PICKER_USE_CASES.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant="outline"
              className="h-auto justify-start whitespace-normal p-3 text-left"
              onClick={() => {
                onSelect(item.id)
                onOpenChange(false)
              }}
            >
              <span>
                <span className="block font-semibold">{item.label}</span>
                <span className="block text-xs font-normal text-slate-500">{item.description}</span>
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
