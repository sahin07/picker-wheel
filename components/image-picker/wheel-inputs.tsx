"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Eye, RotateCcw, Upload, EyeOff, FileText } from "lucide-react"
import type { WheelItem } from "@/lib/types"
import { NumberRangeSettings } from "./number-range-settings"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface WheelInputsProps {
  currentTool: string
  enabledItems: WheelItem[]
  wheelItems: WheelItem[]
  settings: any // WheelSettings
  customInput: string
  setCustomInput: (value: string) => void
  addCustomItem: () => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  resetCounts: () => void
  removeAllInputs: () => void
  disableAllInputs: () => void
  enableAllInputs: () => void
  setShowTitleModal: (show: boolean) => void
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  numberRange: any // NumberRange
  setNumberRange: (range: any) => void // SetStateAction<NumberRange>
  syncWheelItems: (items: WheelItem[]) => void
}

export function WheelInputs({
  currentTool,
  enabledItems,
  wheelItems,
  settings,
  customInput,
  setCustomInput,
  addCustomItem,
  removeItem,
  toggleItem,
  resetCounts,
  removeAllInputs,
  enableAllInputs,
  disableAllInputs,
  setShowTitleModal,
  handleImageUpload,
  fileInputRef,
  numberRange,
  setNumberRange,
  syncWheelItems,
}: WheelInputsProps) {
  const allDisabled = wheelItems.length > 0 && wheelItems.every(item => !item.enabled);

  // Add custom item
  const handleAddCustomItem = () => {
    if (!customInput.trim()) return;
    const newItem: WheelItem = {
      id: `custom-${Date.now()}`,
      text: customInput.trim(),
      enabled: true,
      count: 0,
    };
    syncWheelItems([...wheelItems, newItem]);
    setCustomInput("");
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    syncWheelItems(wheelItems.filter(item => item.id !== id));
  };

  // Toggle item enabled
  const handleToggleItem = (id: string) => {
    syncWheelItems(wheelItems.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  // Reset all counts
  const handleResetCounts = () => {
    syncWheelItems(wheelItems.map(item => ({ ...item, count: 0 })));
  };

  // Remove all items
  const handleRemoveAll = () => {
    syncWheelItems([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          INPUTS
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{enabledItems.length}</Badge>
            <Button variant="ghost" size="sm" onClick={() => setShowTitleModal(true)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">⋯</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {allDisabled ? (
                  <DropdownMenuItem onClick={enableAllInputs}>
                    <Eye className="w-4 h-4 mr-2" /> Enable All Inputs
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={disableAllInputs}>
                    <EyeOff className="w-4 h-4 mr-2" /> Disable All Inputs
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setShowTitleModal(true)}>
                  <FileText className="w-4 h-4 mr-2" /> Modify Title & Desc.
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleResetCounts} className="text-gray-400">
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset All Counts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRemoveAll} className="text-red-600">
                  <X className="w-4 h-4 mr-2" /> Remove All Inputs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTool === "image" && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 border-2 border-dashed border-gray-400"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image(s)
            </Button>
            <div className="border-t border-dashed border-gray-300"></div>
          </div>
        )}

        {currentTool === "number" && <NumberRangeSettings numberRange={numberRange} setNumberRange={setNumberRange} />}

        {currentTool !== "number" && currentTool !== "image" && (
          <div className="flex space-x-2">
            <Input
              placeholder="Add custom item..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCustomItem()}
            />
            <Button onClick={handleAddCustomItem} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {wheelItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-2 rounded border ${
                item.enabled ? "bg-white" : "bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-2">
                {currentTool === "image" && item.imageUrl && (
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.text}
                    className="w-8 h-8 object-cover rounded border"
                  />
                )}
                <Button variant="ghost" size="sm" onClick={() => handleToggleItem(item.id)}>
                  {item.enabled ? (
                    <div className="w-4 h-4 border border-green-500 bg-green-500 rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm"></div>
                    </div>
                  ) : (
                    <div className="w-4 h-4 border border-gray-400 rounded-sm"></div>
                  )}
                </Button>
                <span className={`text-sm ${item.enabled ? "text-gray-900" : "text-gray-500"}`}>{item.text}</span>
                {settings.actionMode === "accumulation" && item.count > 0 && (
                  <Badge variant="secondary">{item.count}</Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
