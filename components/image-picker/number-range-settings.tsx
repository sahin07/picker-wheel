"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { NumberRange } from "@/lib/types"

interface NumberRangeSettingsProps {
  numberRange: NumberRange
  setNumberRange: React.Dispatch<React.SetStateAction<NumberRange>>
}

export function NumberRangeSettings({ numberRange, setNumberRange }: NumberRangeSettingsProps) {
  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-semibold text-blue-900">Number Range Settings</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min">Min</Label>
          <Input
            id="min"
            type="number"
            value={numberRange.min}
            onChange={(e) => setNumberRange((prev) => ({ ...prev, min: Number.parseInt(e.target.value) || 1 }))}
          />
        </div>
        <div>
          <Label htmlFor="max">Max</Label>
          <Input
            id="max"
            type="number"
            value={numberRange.max}
            onChange={(e) => setNumberRange((prev) => ({ ...prev, max: Number.parseInt(e.target.value) || 100 }))}
          />
        </div>
        <div>
          <Label htmlFor="step">Step</Label>
          <Input
            id="step"
            type="number"
            value={numberRange.step}
            onChange={(e) => setNumberRange((prev) => ({ ...prev, step: Number.parseInt(e.target.value) || 1 }))}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="duplicates"
            checked={numberRange.duplicates}
            onCheckedChange={(checked) => setNumberRange((prev) => ({ ...prev, duplicates: checked }))}
          />
          <Label htmlFor="duplicates">Allow Duplicates</Label>
        </div>
      </div>
    </div>
  )
}
