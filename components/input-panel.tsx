"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Eye, RotateCcw, Shuffle, MoreHorizontal, ImageIcon, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { WheelOption } from "@/app/page"

interface InputPanelProps {
  options: WheelOption[]
  onAddOption: (text: string, image?: string) => void
  onRemoveOption: (id: string) => void
  onUpdateOption: (id: string, text: string, image?: string) => void
}

export default function InputPanel({ options, onAddOption, onRemoveOption, onUpdateOption }: InputPanelProps) {
  const [newOption, setNewOption] = useState("")
  const [bulkInput, setBulkInput] = useState("")
  const [showBulkInput, setShowBulkInput] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRefs = useRef<Map<string, HTMLInputElement>>(new Map())

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditImageSelect = (optionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const option = options.find((opt) => opt.id === optionId)
        if (option) {
          onUpdateOption(optionId, option.text, e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddOption = () => {
    if (newOption.trim()) {
      onAddOption(newOption, selectedImage || undefined)
      setNewOption("")
      setSelectedImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleBulkAdd = () => {
    const lines = bulkInput.split("\n").filter((line) => line.trim())
    lines.forEach((line) => onAddOption(line.trim()))
    setBulkInput("")
    setShowBulkInput(false)
  }

  const clearAll = () => {
    options.forEach((option) => onRemoveOption(option.id))
  }

  const shuffleOptions = () => {
    // This would need to be handled by parent component
    console.log("Shuffle options")
  }

  const removeDuplicates = () => {
    const seen = new Set()
    options.forEach((option) => {
      if (seen.has(option.text.toLowerCase())) {
        onRemoveOption(option.id)
      } else {
        seen.add(option.text.toLowerCase())
      }
    })
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">INPUTS</h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" title="Preview">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={shuffleOptions} title="Shuffle">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Random">
            <Shuffle className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowBulkInput(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Bulk Add
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearAll}>
                <X className="w-4 h-4 mr-2" />
                Clear All
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shuffle className="w-4 h-4 mr-2" />
                Sort A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={removeDuplicates}>
                <X className="w-4 h-4 mr-2" />
                Remove Duplicates
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Add New Option */}
      <div className="space-y-3 mb-4">
        <div className="flex space-x-2">
          <Input
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Input text here..."
            onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
            className="flex-1"
          />
          <Button onClick={handleAddOption} size="sm" disabled={!newOption.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Image Upload for New Option */}
        <div className="flex items-center space-x-2">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="flex-1">
            <ImageIcon className="w-4 h-4 mr-2" />
            {selectedImage ? "Image Selected" : "Add Image"}
          </Button>
          {selectedImage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedImage(null)
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="flex justify-center">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Preview"
              className="w-16 h-16 rounded-lg object-cover border-2 border-gray-300"
            />
          </div>
        )}
      </div>

      {/* Bulk Input Modal */}
      {showBulkInput && (
        <div className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
          <h4 className="font-medium mb-2">Bulk Add Options</h4>
          <Textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="Enter each option on a new line..."
            rows={5}
            className="mb-2"
          />
          <div className="flex space-x-2">
            <Button onClick={handleBulkAdd} size="sm">
              Add All
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowBulkInput(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Options List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {options.map((option, index) => (
          <div key={`${option.id}-${index}`} className="flex items-center space-x-2 p-3 bg-white rounded-lg border shadow-sm">
            {/* Image Display/Upload */}
            <div className="flex-shrink-0">
              {option.image ? (
                <div className="relative group">
                  <img
                    src={option.image || "/placeholder.svg"}
                    alt={option.text}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const input = editFileInputRefs.current.get(option.id)
                        input?.click()
                      }}
                      className="text-white hover:text-gray-200 p-1"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = editFileInputRefs.current.get(option.id)
                    input?.click()
                  }}
                  className="w-12 h-12 p-0"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              )}
              <input
                ref={(el) => {
                  if (el) editFileInputRefs.current.set(option.id, el)
                }}
                type="file"
                accept="image/*"
                onChange={(e) => handleEditImageSelect(option.id, e)}
                className="hidden"
              />
            </div>

            {/* Text Input */}
            <Input
              value={option.text}
              onChange={(e) => onUpdateOption(option.id, e.target.value, option.image)}
              className="flex-1 border-none shadow-none p-1 font-medium"
              placeholder="Enter option text..."
            />

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveOption(option.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {options.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No options added yet.</p>
          <p className="text-sm">Add text and images above to get started!</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 text-center bg-white rounded-lg p-2">
        <div className="flex justify-between items-center">
          <span>
            {options.length} option{options.length !== 1 ? "s" : ""} added
          </span>
          <span className="text-xs text-gray-400">{options.filter((opt) => opt.image).length} with images</span>
        </div>
      </div>
    </div>
  )
}
