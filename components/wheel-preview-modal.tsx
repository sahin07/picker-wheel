"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import type { WheelOption } from "@/stores/enhanced-wheel-store"

interface WheelPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  options: WheelOption[]
}

export default function WheelPreviewModal({ isOpen, onClose, options }: WheelPreviewModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Wheel Preview</CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          {options.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No options to preview</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-4">Total options: {options.length}</div>
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: option.color }}
                  >
                    {index + 1}
                  </div>

                  {option.image && (
                    <img
                      src={option.image || "/placeholder.svg"}
                      alt={option.name}
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                  )}

                  <div className="flex-1">
                    <div className="font-medium">{option.name}</div>
                    {option.image && <div className="text-xs text-gray-500">With image</div>}
                  </div>

                  <div className="text-xs text-gray-400">{((1 / options.length) * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Close Preview</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
