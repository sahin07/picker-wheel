"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Share2, Trash2 } from "lucide-react"
import type { ColorResultShowMode } from "@/lib/color-formats"
import { formatRgba, rgbStringToRgba } from "@/lib/color-formats"

interface ResultsDisplayProps {
  results: Array<{
    color: string
    name: string
    hex: string
    rgb: string
    rgba?: string
    timestamp: Date
  }>
  lastResult: {
    color: string
    name: string
    hex: string
    rgb: string
    rgba?: string
  } | null
  inputMethod: string
  activeTab: string
  resultShowMode: ColorResultShowMode
  colorAlpha?: number
  showStats: boolean
  totalSpins: number
}

export function ResultsDisplay({
  results,
  lastResult,
  inputMethod,
  activeTab,
  resultShowMode,
  colorAlpha = 1,
  showStats,
  totalSpins
}: ResultsDisplayProps) {
  const [showAllResults, setShowAllResults] = useState(false)

  if (!lastResult && results.length === 0) {
    return null
  }

  const liveRgba = lastResult
    ? lastResult.hex
      ? formatRgba(lastResult.hex, colorAlpha)
      : lastResult.rgb
        ? rgbStringToRgba(lastResult.rgb, colorAlpha)
        : lastResult.rgba || ""
    : ""

  return (
    <div className="space-y-4">
      {/* Last Result */}
      {lastResult && (
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div 
                className="relative h-6 w-6 overflow-hidden rounded border"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                  backgroundSize: "6px 6px",
                  backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: liveRgba || lastResult.color }}
                />
              </div>
              Last Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resultShowMode.color && (
                <div className="flex items-center gap-3">
                  <span className="font-medium">Color:</span>
                  <div 
                    className="relative h-8 w-8 overflow-hidden rounded border"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                      backgroundSize: "8px 8px",
                      backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: liveRgba || lastResult.color }}
                    />
                  </div>
                </div>
              )}
              
              {resultShowMode.text && (
                <div className="flex items-center gap-3">
                  <span className="font-medium">Name:</span>
                  <Badge variant="secondary">{lastResult.name}</Badge>
                </div>
              )}
              
              {resultShowMode.hex && (
                <div className="flex items-center gap-3">
                  <span className="font-medium">HEX:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {lastResult.hex}
                  </code>
                </div>
              )}
              
              {resultShowMode.rgb && lastResult.rgb && (
                <div className="flex items-center gap-3">
                  <span className="font-medium">RGB:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    rgb({lastResult.rgb})
                  </code>
                </div>
              )}

              {resultShowMode.rgba && liveRgba && (
                <div className="flex items-center gap-3">
                  <span className="font-medium">RGBA:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {liveRgba}
                  </code>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {showStats && (
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalSpins}</div>
                <div className="text-sm text-gray-600">Total Spins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.length}</div>
                <div className="text-sm text-gray-600">Results Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Results Button */}
      {results.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAllResults(!showAllResults)}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            {showAllResults ? "Hide All Results" : "Show All Results"}
          </Button>
        </div>
      )}

      {/* All Results List */}
      {showAllResults && results.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>All Results</span>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: result.color }}
                    />
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-gray-600">
                        {result.hex}
                        {result.rgb ? ` · rgb(${result.rgb})` : ""}
                        {result.rgba
                          ? ` · ${result.rgba}`
                          : result.rgb
                            ? ` · ${rgbStringToRgba(result.rgb, colorAlpha)}`
                            : ""}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 