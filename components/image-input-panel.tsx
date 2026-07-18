"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Eye, RotateCcw, Shuffle, MoreHorizontal, ImageIcon, Copy, Check, FileImage } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEnhancedWheelStore } from "@/stores/enhanced-wheel-store"
import WheelPreviewModal from "@/components/wheel-preview-modal"
import ConfirmationDialog from "@/components/confirmation-dialog"
import { useToast } from "@/contexts/toast-context"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"

export default function ImageInputPanel() {
  const [showPreview, setShowPreview] = useState(false)
  const {
    addOption,
    removeOption,
    updateOption,
    duplicateOption,
    clearAllOptions,
    shuffleOptions,
    sortOptionsAZ,
    addRandomOptions,
    previewWheel,
    syncWithCurrentWheel,
    forceUpdate,
    getOptions,
  } = useEnhancedWheelStore()

  const { getCurrentWheel, currentTool, currentWheelId } = useWheelManagerStore()
  const [isClient, setIsClient] = useState(false)

  // Use useEffect to set client-side rendering after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get options using the proper getter function
  const options = getOptions() || []

  const [dragOver, setDragOver] = useState(false)
  const [newTextInput, setNewTextInput] = useState("")
  const multiFileInputRef = useRef<HTMLInputElement>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { showToast } = useToast()

  // Sync with current wheel when switching wheels
  useEffect(() => {
    if (currentWheelId) {
      syncWithCurrentWheel();
      forceUpdate();
    }
  }, [currentWheelId, syncWithCurrentWheel, forceUpdate]);

  // Show loading state during SSR and initial client render
  if (!isClient) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">INPUTS</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">0</span>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          <div className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const remainingSlots = 10 - options.length
    if (remainingSlots <= 0) {
      showToast("Maximum 10 images allowed!", "warning")
      return
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots)
    let processedCount = 0

    filesToProcess.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageName = file.name.replace(/\.[^/.]+$/, "")
          addOption(imageName, e.target?.result as string)
          processedCount++

          if (processedCount === filesToProcess.length) {
            showToast(`${processedCount} image(s) added successfully!`, "success")
          }
        }
        reader.readAsDataURL(file)
      }
    })

    if (files.length > remainingSlots) {
      showToast(`Only ${remainingSlots} more images can be added. Maximum is 10 images.`, "warning")
    }
  }

  const handleAddTextOption = () => {
    if (newTextInput.trim()) {
      addOption(newTextInput.trim())
      setNewTextInput("")
      showToast("Option added successfully!", "success")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleClearAll = () => {
    setShowClearConfirm(true)
  }

  const confirmClearAll = () => {
    clearAllOptions()
    showToast("All options cleared!", "info")
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleShuffle = () => {
    shuffleOptions()
    showToast("Options shuffled successfully!", "success")
  }

  const handleRandom = () => {
    addRandomOptions()
    showToast("Random options added!", "success")
  }

  const handleSortAZ = () => {
    sortOptionsAZ()
    showToast("Options sorted alphabetically!", "success")
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl p-6 shadow-lg border border-purple-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">INPUTS</h3>
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{options.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            title="Preview" 
            onClick={handlePreview}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShuffle} 
            title="Shuffle"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            title="Add Random Options" 
            onClick={handleRandom}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleClearAll}>
                <X className="w-4 h-4 mr-2" />
                Clear All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSortAZ}>
                <Shuffle className="w-4 h-4 mr-2" />
                Sort A-Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-3 mb-4">
          <Input
            placeholder="✨ Input text here..."
            className="flex-1 border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md"
            value={newTextInput}
            onChange={(e) => setNewTextInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTextOption()}
          />
          <Button 
            size="sm" 
            onClick={handleAddTextOption} 
            disabled={!newTextInput.trim()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-bold"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => multiFileInputRef.current?.click()}
            disabled={options.length >= 10}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 font-bold"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>

        <div
          className={`border-3 border-dashed rounded-xl p-8 text-center transition-all duration-300 shadow-lg ${
            dragOver 
              ? "border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 scale-105" 
              : "border-purple-300 bg-gradient-to-br from-white to-purple-50 hover:border-purple-400 hover:scale-102"
          } ${options.length >= 10 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => options.length < 10 && multiFileInputRef.current?.click()}
        >
          <FileImage className="w-16 h-16 mx-auto mb-4 text-purple-500 animate-pulse" />
          <p className="text-purple-700 font-bold text-lg mb-2">🎨 Drop images here or click to upload</p>
          <p className="text-sm text-purple-600 mb-2">Support multiple images (PNG, JPG, GIF) - Max 10 images</p>
          <p className={`text-xs font-semibold mt-2 ${options.length >= 10 ? 'text-red-500' : 'text-purple-500'}`}>
            {options.length}/10 images uploaded
          </p>
        </div>

        <input
          ref={multiFileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-white to-purple-50 rounded-xl border-2 border-purple-100 shadow-md group hover:shadow-lg transition-all duration-200 hover:scale-102">
            <div className="flex-shrink-0">
              {option.image ? (
                <img
                  src={option.image || "/placeholder.svg"}
                  alt={option.name}
                  className="w-14 h-14 rounded-xl object-cover border-3 border-purple-200 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  TEXT
                </div>
              )}
            </div>

            <Input
              value={option.name}
              onChange={(e) => updateOption(option.id, e.target.value, option.image)}
              className="flex-1 border-none shadow-none p-2 font-semibold text-purple-700 bg-transparent focus:bg-purple-50 rounded-lg transition-all duration-200"
              placeholder="Enter option name..."
            />

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                title="Duplicate"
                onClick={() => duplicateOption(option.id)}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Copy className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Edit"
                className="text-purple-500 hover:text-purple-700 hover:bg-purple-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Shuffle className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Copy"
                className="text-green-500 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <FileImage className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Check"
                className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Check className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Remove"
                onClick={() => removeOption(option.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {options.length === 0 && (
        <div className="text-center py-12 text-purple-600">
          <ImageIcon className="w-20 h-20 mx-auto mb-6 text-purple-400 animate-pulse" />
          <p className="font-bold text-xl mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">No options added yet</p>
          <p className="text-sm text-purple-500">✨ Add text or upload images above to create your decision wheel! ✨</p>
        </div>
      )}
      <WheelPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} options={options} />
      <ConfirmationDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearAll}
        title="Clear All Options"
        message="Are you sure you want to remove all options from this wheel? This action cannot be undone."
        confirmText="Clear All"
      />
    </div>
  )
}
