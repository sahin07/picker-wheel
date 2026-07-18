"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface ColorOutputDisplayProps {
  selectedColor: string
  colorCombination: string
  lastResult?: {
    color: string
    name: string
    hex: string
    rgb: string
  } | null
}

interface ColorInfo {
  hex: string
  rgb: string
  name: string
}

export function ColorOutputDisplay({ 
  selectedColor, 
  colorCombination, 
  lastResult 
}: ColorOutputDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Convert HEX to RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      const r = parseInt(result[1], 16)
      const g = parseInt(result[2], 16)
      const b = parseInt(result[3], 16)
      return `${r}, ${g}, ${b}`
    }
    return "0, 0, 0"
  }

  // Convert HEX to HSL
  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      const r = parseInt(result[1], 16) / 255
      const g = parseInt(result[2], 16) / 255
      const b = parseInt(result[3], 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0
      let s = 0
      const l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
          case g:
            h = (b - r) / d + 2
            break
          case b:
            h = (r - g) / d + 4
            break
        }
        h /= 6
      }

      return { h: h * 360, s: s * 100, l: l * 100 }
    }
    return { h: 0, s: 0, l: 0 }
  }

  // Convert HSL to HEX
  const hslToHex = (h: number, s: number, l: number): string => {
    h /= 360
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h * 6) % 2 - 1))
    const m = l - c / 2
    let r = 0
    let g = 0
    let b = 0

    if (0 <= h && h < 1 / 6) {
      r = c
      g = x
      b = 0
    } else if (1 / 6 <= h && h < 2 / 6) {
      r = x
      g = c
      b = 0
    } else if (2 / 6 <= h && h < 3 / 6) {
      r = 0
      g = c
      b = x
    } else if (3 / 6 <= h && h < 4 / 6) {
      r = 0
      g = x
      b = c
    } else if (4 / 6 <= h && h < 5 / 6) {
      r = x
      g = 0
      b = c
    } else if (5 / 6 <= h && h <= 1) {
      r = c
      g = 0
      b = x
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0')
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0')
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0')

    return `#${rHex}${gHex}${bHex}`
  }

  // Generate color combinations
  const generateColorCombination = (): ColorInfo[] => {
    // Use lastResult color if available, otherwise fall back to selectedColor
    const baseColor = lastResult?.hex || selectedColor
    const baseHsl = hexToHsl(baseColor)
    const colors: ColorInfo[] = []

    switch (colorCombination) {
      case "single":
        colors.push({
          hex: baseColor,
          rgb: hexToRgb(baseColor),
          name: "Primary"
        })
        break

      case "complementary":
        colors.push({
          hex: baseColor,
          rgb: hexToRgb(baseColor),
          name: "Primary"
        })
        const complementaryHue = (baseHsl.h + 180) % 360
        const complementaryHex = hslToHex(complementaryHue, baseHsl.s, baseHsl.l)
        colors.push({
          hex: complementaryHex,
          rgb: hexToRgb(complementaryHex),
          name: "Complementary"
        })
        break

      case "split-complementary":
        colors.push({
          hex: baseColor,
          rgb: hexToRgb(baseColor),
          name: "Primary"
        })
        const splitComp1Hue = (baseHsl.h + 150) % 360
        const splitComp2Hue = (baseHsl.h + 210) % 360
        colors.push({
          hex: hslToHex(splitComp1Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(splitComp1Hue, baseHsl.s, baseHsl.l)),
          name: "Split-Comp 1"
        })
        colors.push({
          hex: hslToHex(splitComp2Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(splitComp2Hue, baseHsl.s, baseHsl.l)),
          name: "Split-Comp 2"
        })
        break

      case "analogous":
        colors.push({
          hex: baseColor,
          rgb: hexToRgb(baseColor),
          name: "Primary"
        })
        const analogous1Hue = (baseHsl.h - 30 + 360) % 360
        const analogous2Hue = (baseHsl.h + 30) % 360
        colors.push({
          hex: hslToHex(analogous1Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(analogous1Hue, baseHsl.s, baseHsl.l)),
          name: "Analogous 1"
        })
        colors.push({
          hex: hslToHex(analogous2Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(analogous2Hue, baseHsl.s, baseHsl.l)),
          name: "Analogous 2"
        })
        break

      case "triadic":
        colors.push({
          hex: baseColor,
          rgb: hexToRgb(baseColor),
          name: "Primary"
        })
        const triadic1Hue = (baseHsl.h + 120) % 360
        const triadic2Hue = (baseHsl.h + 240) % 360
        colors.push({
          hex: hslToHex(triadic1Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(triadic1Hue, baseHsl.s, baseHsl.l)),
          name: "Triadic 1"
        })
        colors.push({
          hex: hslToHex(triadic2Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(triadic2Hue, baseHsl.s, baseHsl.l)),
          name: "Triadic 2"
        })
        break

      case "tetradic":
        colors.push({
          hex: baseColor,
          rgb: hexToRgb(baseColor),
          name: "Primary"
        })
        const tetradic1Hue = (baseHsl.h + 90) % 360
        const tetradic2Hue = (baseHsl.h + 180) % 360
        const tetradic3Hue = (baseHsl.h + 270) % 360
        colors.push({
          hex: hslToHex(tetradic1Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(tetradic1Hue, baseHsl.s, baseHsl.l)),
          name: "Tetradic 1"
        })
        colors.push({
          hex: hslToHex(tetradic2Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(tetradic2Hue, baseHsl.s, baseHsl.l)),
          name: "Tetradic 2"
        })
        colors.push({
          hex: hslToHex(tetradic3Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(tetradic3Hue, baseHsl.s, baseHsl.l)),
          name: "Tetradic 3"
        })
        break

      case "square":
        colors.push({
          hex: baseColor,
          rgb: hexToRgb(baseColor),
          name: "Primary"
        })
        const square1Hue = (baseHsl.h + 90) % 360
        const square2Hue = (baseHsl.h + 180) % 360
        const square3Hue = (baseHsl.h + 270) % 360
        colors.push({
          hex: hslToHex(square1Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(square1Hue, baseHsl.s, baseHsl.l)),
          name: "Square 1"
        })
        colors.push({
          hex: hslToHex(square2Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(square2Hue, baseHsl.s, baseHsl.l)),
          name: "Square 2"
        })
        colors.push({
          hex: hslToHex(square3Hue, baseHsl.s, baseHsl.l),
          rgb: hexToRgb(hslToHex(square3Hue, baseHsl.s, baseHsl.l)),
          name: "Square 3"
        })
        break

      case "monochromatic":
        colors.push({
          hex: baseColor,
          rgb: hexToRgb(baseColor),
          name: "Primary"
        })
        const lighterHex = hslToHex(baseHsl.h, baseHsl.s, Math.min(100, baseHsl.l + 20))
        const darkerHex = hslToHex(baseHsl.h, baseHsl.s, Math.max(0, baseHsl.l - 20))
        colors.push({
          hex: lighterHex,
          rgb: hexToRgb(lighterHex),
          name: "Lighter"
        })
        colors.push({
          hex: darkerHex,
          rgb: hexToRgb(darkerHex),
          name: "Darker"
        })
        break

      default:
        colors.push({
          hex: baseColor,
          rgb: hexToRgb(baseColor),
          name: "Primary"
        })
    }

    return colors
  }

  const colors = generateColorCombination()

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Always show the full color combination based on the selected combination type
  const displayColors = colors

  // Add a small color wheel preview showing the selected colors
  const renderColorWheelPreview = () => {
    if (colorCombination === "single") return null
    
    const baseColor = lastResult?.hex || selectedColor
    const baseHsl = hexToHsl(baseColor)
    const previewColors = []
    
    switch (colorCombination) {
      case "complementary":
        const complementaryHue = (baseHsl.h + 180) % 360
        previewColors.push({ hue: baseHsl.h, color: baseColor })
        previewColors.push({ hue: complementaryHue, color: hslToHex(complementaryHue, baseHsl.s, baseHsl.l) })
        break
      case "split-complementary":
        previewColors.push({ hue: baseHsl.h, color: baseColor })
        previewColors.push({ hue: (baseHsl.h + 150) % 360, color: hslToHex((baseHsl.h + 150) % 360, baseHsl.s, baseHsl.l) })
        previewColors.push({ hue: (baseHsl.h + 210) % 360, color: hslToHex((baseHsl.h + 210) % 360, baseHsl.s, baseHsl.l) })
        break
      case "triadic":
        previewColors.push({ hue: baseHsl.h, color: baseColor })
        previewColors.push({ hue: (baseHsl.h + 120) % 360, color: hslToHex((baseHsl.h + 120) % 360, baseHsl.s, baseHsl.l) })
        previewColors.push({ hue: (baseHsl.h + 240) % 360, color: hslToHex((baseHsl.h + 240) % 360, baseHsl.s, baseHsl.l) })
        break
      case "analogous":
        previewColors.push({ hue: (baseHsl.h - 30 + 360) % 360, color: hslToHex((baseHsl.h - 30 + 360) % 360, baseHsl.s, baseHsl.l) })
        previewColors.push({ hue: baseHsl.h, color: baseColor })
        previewColors.push({ hue: (baseHsl.h + 30) % 360, color: hslToHex((baseHsl.h + 30) % 360, baseHsl.s, baseHsl.l) })
        break
      case "tetradic":
      case "square":
        previewColors.push({ hue: baseHsl.h, color: baseColor })
        previewColors.push({ hue: (baseHsl.h + 90) % 360, color: hslToHex((baseHsl.h + 90) % 360, baseHsl.s, baseHsl.l) })
        previewColors.push({ hue: (baseHsl.h + 180) % 360, color: hslToHex((baseHsl.h + 180) % 360, baseHsl.s, baseHsl.l) })
        previewColors.push({ hue: (baseHsl.h + 270) % 360, color: hslToHex((baseHsl.h + 270) % 360, baseHsl.s, baseHsl.l) })
        break
    }
    
    return (
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Color Combination Preview</div>
        <div className="relative w-32 h-32 mx-auto">
          <div
            className="w-full h-full rounded-full border-2 border-gray-300"
            style={{
              background: "conic-gradient(from 0deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))"
            }}
          >
            {previewColors.map((colorInfo, index) => (
              <div
                key={index}
                className="absolute w-4 h-4 bg-white border-2 border-gray-800 rounded-full pointer-events-none"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${colorInfo.hue}deg) translateY(-12px)`,
                  backgroundColor: colorInfo.color
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {renderColorWheelPreview()}
        <div className="space-y-3">
          {displayColors.map((color, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{color.name}</div>
                <div className="text-xs text-gray-500 font-mono">{color.hex}</div>
                <div className="text-xs text-gray-500 font-mono">RGB({color.rgb})</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(color.hex, index)}
                className="h-8 w-8 p-0"
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 