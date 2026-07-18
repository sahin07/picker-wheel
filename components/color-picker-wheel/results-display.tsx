"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Share2, Trash2 } from "lucide-react"

interface ResultsDisplayProps {
  results: Array<{
    color: string
    name: string
    hex: string
    rgb: string
    timestamp: Date
  }>
  lastResult: {
    color: string
    name: string
    hex: string
    rgb: string
  } | null
  inputMethod: string
  activeTab: string
  resultShowMode: {
    color: boolean
    text: boolean
    hex: boolean
    rgb: boolean
  }
  showStats: boolean
  totalSpins: number
}

export function ResultsDisplay({
  results,
  lastResult,
  inputMethod,
  activeTab,
  resultShowMode,
  showStats,
  totalSpins
}: ResultsDisplayProps) {
  const [showAllResults, setShowAllResults] = useState(false)

  if (!lastResult && results.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Last Result */}
      {lastResult && (
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: lastResult.color }}
              />
              Last Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resultShowMode.color && (
                <div className="flex items-center gap-3">
                  <span className="font-medium">Color:</span>
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: lastResult.color }}
                  />
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
                    {lastResult.rgb}
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
                        {result.hex} • {result.rgb}
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