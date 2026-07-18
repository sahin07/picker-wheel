"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import type { WheelItem, WheelSettings, NumberRange } from "@/lib/types"
import { US_STATES, SAMPLE_NAMES } from "@/lib/constants"

export function useWheelPicker() {
  const [currentTool, setCurrentTool] = useState("image")
  const [wheelItems, setWheelItems] = useState<WheelItem[]>([])
  const [numberRange, setNumberRange] = useState<NumberRange>({ min: 1, max: 100, step: 1, duplicates: false })
  const [settings, setSettings] = useState<WheelSettings>({
    spinSpeed: 5,
    spinDuration: 3,
    enableManualStop: false,
    mysteryMode: false,
    enableConfetti: true,
    enableSound: true,
    wheelColor: "#10b981",
    backgroundColor: "#a7b5a0",
    actionMode: "normal",
  })
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [results, setResults] = useState<WheelItem[]>([])
  const [customInput, setCustomInput] = useState("")
  const [wheelTitle, setWheelTitle] = useState("")
  const [wheelDescription, setWheelDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const enabledItems = wheelItems.filter((item) => item.enabled)
  const segmentAngle = enabledItems.length > 0 ? 360 / enabledItems.length : 0

  // Initialize wheel items based on current tool
  useEffect(() => {
    let items: WheelItem[] = []

    const generateNumberItems = (): WheelItem[] => {
      const numItems: WheelItem[] = []
      const numbers = new Set<number>()
      for (let i = numberRange.min; i <= numberRange.max; i += numberRange.step) {
        if (!numberRange.duplicates && numbers.has(i)) continue
        numbers.add(i)
        numItems.push({
          id: `number-${i}`,
          text: i.toString(),
          enabled: true,
          count: 0,
        })
      }
      return numItems.slice(0, 50)
    }

    switch (currentTool) {
      case "image":
        items = [
          {
            id: "sample-1",
            text: "Sample Image 1",
            enabled: true,
            count: 0,
            imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+1",
          },
          {
            id: "sample-2",
            text: "Sample Image 2",
            enabled: true,
            count: 0,
            imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+2",
          },
          {
            id: "sample-3",
            text: "Sample Image 3",
            enabled: true,
            count: 0,
            imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+3",
          },
          {
            id: "sample-4",
            text: "Sample Image 4",
            enabled: true,
            count: 0,
            imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+4",
          },
        ]
        setWheelTitle("Image Picker Wheel")
        setWheelDescription("Randomly pick a picture by wheel")
        break
      case "state":
        items = US_STATES.slice(0, 10).map((state, index) => ({
          id: `state-${index}`,
          text: state,
          enabled: true,
          count: 0,
        }))
        setWheelTitle("US State Picker Wheel")
        setWheelDescription("Spin to pick a random US state")
        break
      case "name":
        items = SAMPLE_NAMES.slice(0, 10).map((name, index) => ({
          id: `name-${index}`,
          text: name,
          enabled: true,
          count: 0,
        }))
        setWheelTitle("Name Picker Wheel")
        setWheelDescription("Spin to pick a random name")
        break
      case "number":
        items = generateNumberItems()
        setWheelTitle("Number Picker Wheel")
        setWheelDescription("Spin to pick a random number")
        break
    }
    setWheelItems(items)
  }, [currentTool, numberRange])

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          const newItem: WheelItem = {
            id: `image-${Date.now()}-${Math.random()}`,
            text: file.name,
            enabled: true,
            count: 0,
            imageUrl: imageUrl,
            imageFile: file,
          }
          setWheelItems((prev) => [...prev, newItem])
        }
        reader.readAsDataURL(file)
      }
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const addCustomItem = useCallback(() => {
    if (!customInput.trim()) return
    const newItem: WheelItem = {
      id: `custom-${Date.now()}`,
      text: customInput.trim(),
      enabled: true,
      count: 0,
    }
    setWheelItems((prev) => [...prev, newItem])
    setCustomInput("")
  }, [customInput])

  const removeItem = useCallback((id: string) => {
    setWheelItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const toggleItem = useCallback((id: string) => {
    setWheelItems((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)))
  }, [])

  const resetCounts = useCallback(() => {
    setWheelItems((prev) => prev.map((item) => ({ ...item, count: 0 })))
  }, [])

  const removeAllInputs = useCallback(() => {
    setWheelItems([])
  }, [])

  const disableAllInputs = useCallback(() => {
    setWheelItems((prev) => prev.map((item) => ({ ...item, enabled: false })))
  }, [])

  return {
    currentTool,
    setCurrentTool,
    wheelItems,
    setWheelItems,
    numberRange,
    setNumberRange,
    settings,
    setSettings,
    isSpinning,
    setIsSpinning,
    selectedItem,
    setSelectedItem,
    wheelRotation,
    setWheelRotation,
    results,
    setResults,
    customInput,
    setCustomInput,
    wheelTitle,
    setWheelTitle,
    wheelDescription,
    setWheelDescription,
    fileInputRef,
    enabledItems,
    segmentAngle,
    handleImageUpload,
    addCustomItem,
    removeItem,
    toggleItem,
    resetCounts,
    removeAllInputs,
    disableAllInputs,
  }
}
