"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  RotateCcw,
  Share2,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Settings,
  History,
  Download,
  X,
  Sparkles,
  FileText,
  Wand2,
  Lightbulb,
  Plus,
  Target,
} from "lucide-react"
import { format, eachDayOfInterval } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import Header from "@/components/header"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useSettings } from "@/contexts/settings-context"
import Confetti from "react-confetti"
import { cn } from "@/lib/utils"

interface DateEntry {
  id: string
  date: Date
  formatted: string
}

interface DateRangeEntry {
  id: string
  from: Date
  to: Date
  label: string
  dates: DateEntry[]
}

interface SpinResult {
  date: string
  timestamp: Date
  eliminated: boolean
  wheelName: string
}

interface DateWheelData {
  singleDates: DateEntry[]
  dateRanges: DateRangeEntry[]
  allDates: DateEntry[]
  selectedDays: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  dateFormat: string
  wheelTitle: string
  wheelDescription: string
  resultTitle: string
  totalSpins: number
  lastResult: any
  recentResults: any[]
  spinHistory: SpinResult[]
  currentResult: string | null
}

function InnerDatePickerWheelPage() {
  // Global settings and stores
  const [showSettings, setShowSettings] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [muted, setMuted] = useState(false)
  const [toolMuted, setToolMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()
  const { getCurrentWheel, updateWheelData, setCurrentTool, createNewWheel, currentWheelId, globalSpinHistory, addToGlobalSpinHistory, clearGlobalSpinHistory } = useWheelManagerStore()
  const { settings: globalSettings } = useSettings()
  const prevWheelId = useRef<string | null>(null)

  // Local state
  const [dateFormat, setDateFormat] = useState("30/10/2022")
  const [singleDates, setSingleDates] = useState<DateEntry[]>([])
  const [dateRanges, setDateRanges] = useState<DateRangeEntry[]>([])
  const [allDates, setAllDates] = useState<DateEntry[]>([])
  const [selectedDays, setSelectedDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  })
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentResult, setCurrentResult] = useState<string | null>(null)
  const [spinHistory, setSpinHistory] = useState<SpinResult[]>([])
  const [actionMode, setActionMode] = useState<"normal" | "elimination">("normal")
  const [showTitle, setShowTitle] = useState(false)
  const [wheelTitle, setWheelTitle] = useState("")
  const [wheelDescription, setWheelDescription] = useState("")
  const [resultTitle, setResultTitle] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [wheelRotation, setWheelRotation] = useState(0)

  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [isRangeMode, setIsRangeMode] = useState(false)

  const [inputMode, setInputMode] = useState<"manual" | "ai">("manual")
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Switch wheel functionality
  useEffect(() => {
    setCurrentTool("date-picker-wheel")
    if (typeof window !== "undefined") {
      const wheel = getCurrentWheel()
      if (!wheel) {
        const newWheelId = createNewWheel("date-picker-wheel", "My Date Picker Wheel")
        console.log('Created new date picker wheel with ID:', newWheelId)
      }
    }
  }, [setCurrentTool, getCurrentWheel, createNewWheel])

  // Unified sync for all wheel data
  const syncWheelData = useCallback((data: Partial<DateWheelData>) => {
    const wheel = getCurrentWheel()
    if (wheel) {
      updateWheelData("date-picker-wheel", wheel.id, data)
    }
  }, [getCurrentWheel, updateWheelData])

  // Load wheel data when switching wheels
  useEffect(() => {
    const wheel = getCurrentWheel()
    if (!wheel) return
    
    // Check if this is a different wheel (wheel switching)
    if (prevWheelId.current !== wheel.id) {
      console.log('Switching to date wheel:', wheel.id, wheel.name, wheel.data)
      
      // Reset all states first
      setCurrentResult(null)
      setIsSpinning(false)
      setWheelRotation(0)
      
      if (wheel.data && Object.keys(wheel.data).length > 0) {
        const data = wheel.data as DateWheelData
        
        // Check if the wheel has meaningful data (dates)
        const hasExistingData = (data.singleDates && data.singleDates.length > 0) || 
                               (data.dateRanges && data.dateRanges.length > 0) ||
                               (data.allDates && data.allDates.length > 0)
        
        if (hasExistingData) {
          // Load all wheel data
          setSingleDates(data.singleDates || [])
          setDateRanges(data.dateRanges || [])
          setAllDates(data.allDates || [])
          setSelectedDays(data.selectedDays || {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          })
          setDateFormat(data.dateFormat || "30/10/2022")
          setWheelTitle(data.wheelTitle || "")
          setWheelDescription(data.wheelDescription || "")
          setResultTitle(data.resultTitle || "")
          setSpinHistory(data.spinHistory || [])
          setCurrentResult(data.currentResult || null)
          
          console.log('Loaded existing wheel data')
        } else {
          // Wheel exists but has no dates, generate default dates
          const defaultDates = generateDefaultDates()
          setSingleDates(defaultDates)
          setDateRanges([])
          setAllDates([])
          setSelectedDays(data.selectedDays || {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          })
          setDateFormat(data.dateFormat || "30/10/2022")
          setWheelTitle(data.wheelTitle || "")
          setWheelDescription(data.wheelDescription || "")
          setResultTitle(data.resultTitle || "")
          setSpinHistory(data.spinHistory || [])
          setCurrentResult(data.currentResult || null)
          
          console.log('Generated default dates for existing wheel with no dates')
        }
      } else {
        // If no data exists, generate default dates
        const defaultDates = generateDefaultDates()
        setSingleDates(defaultDates)
        setDateRanges([])
        setAllDates([])
        setSelectedDays({
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        })
        setDateFormat("30/10/2022")
        setWheelTitle("")
        setWheelDescription("")
        setResultTitle("")
        setSpinHistory([])
        setCurrentResult(null)
        
        console.log('Generated default dates for new wheel')
      }
      
      prevWheelId.current = wheel.id
    }
  }, [getCurrentWheel, currentWheelId])





  // Save wheel data whenever important state changes
  useEffect(() => {
    const wheel = getCurrentWheel()
    if (wheel) {
      syncWheelData({
        singleDates,
        dateRanges,
        allDates,
        selectedDays,
        dateFormat,
        wheelTitle,
        wheelDescription,
        resultTitle,
        totalSpins: spinHistory.length,
        lastResult: currentResult,
        recentResults: spinHistory.slice(-10), // Keep last 10 results
        spinHistory,
        currentResult,
      })
    }
  }, [singleDates, dateRanges, allDates, selectedDays, dateFormat, wheelTitle, wheelDescription, resultTitle, spinHistory, currentResult, syncWheelData])



  // Date format options
  const dateFormats = [
    "October 30, 2022",
    "10/30/2022",
    "10-30-2022",
    "Sunday, October 30, 2022",
    "30/10/2022",
    "30-10-2022",
    "30 October 2022",
    "Sunday, 30 October 2022",
  ]

  const dateFormatOptions = [
    { value: "October 30, 2022", label: "October 30, 2022" },
    { value: "10/30/2022", label: "10/30/2022" },
    { value: "10-30-2022", label: "10-30-2022" },
    { value: "Sunday, October 30, 2022", label: "Sunday, October 30, 2022" },
    { value: "30/10/2022", label: "30/10/2022" },
    { value: "30-10-2022", label: "30-10-2022" },
    { value: "30 October 2022", label: "30 October 2022" },
    { value: "Sunday, 30 October 2022", label: "Sunday, 30 October 2022" },
  ]

  // Generate default dates (current date to next 8 days)
  const generateDefaultDates = () => {
    const defaultDates: DateEntry[] = []
    const today = new Date()
    
    for (let i = 0; i < 9; i++) { // 9 days total (today + 8 next days)
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      if (shouldIncludeDate(date)) {
        defaultDates.push({
          id: Math.random().toString(36).substr(2, 9),
          date,
          formatted: formatDate(date, dateFormat),
        })
      }
    }
    
    return defaultDates
  }

  // Format date according to selected format
  const formatDate = (date: Date, formatType: string) => {
    switch (formatType) {
      case "October 30, 2022":
        return format(date, "MMMM d, yyyy")
      case "10/30/2022":
        return format(date, "MM/dd/yyyy")
      case "10-30-2022":
        return format(date, "MM-dd-yyyy")
      case "Sunday, October 30, 2022":
        return format(date, "EEEE, MMMM d, yyyy")
      case "30/10/2022":
        return format(date, "dd/MM/yyyy")
      case "30-10-2022":
        return format(date, "dd-MM-yyyy")
      case "30 October 2022":
        return format(date, "d MMMM yyyy")
      case "Sunday, 30 October 2022":
        return format(date, "EEEE, d MMMM yyyy")
      default:
        return format(date, "dd/MM/yyyy")
    }
  }

  // Check if date should be included based on day of week
  const shouldIncludeDate = (date: Date) => {
    const dayOfWeek = format(date, "EEEE").toLowerCase()
    return selectedDays[dayOfWeek as keyof typeof selectedDays]
  }

  // Add single date
  const addSingleDate = (date: Date) => {
    if (!shouldIncludeDate(date)) return

    const newDate: DateEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date,
      formatted: formatDate(date, dateFormat),
    }

    setSingleDates((prev) => [...prev, newDate])
  }

  // Add date range
  const addDateRange = (from: Date, to: Date) => {
    const datesInRange = eachDayOfInterval({ start: from, end: to })
    const validDates = datesInRange.filter(shouldIncludeDate)

    if (validDates.length === 0) return

    const dateEntries: DateEntry[] = validDates.map((date) => ({
      id: Math.random().toString(36).substr(2, 9),
      date,
      formatted: formatDate(date, dateFormat),
    }))

    const rangeEntry: DateRangeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      from,
      to,
      label: `${formatDate(from, dateFormat)} - ${formatDate(to, dateFormat)}`,
      dates: dateEntries,
    }

    setDateRanges((prev) => [...prev, rangeEntry])
  }

  // Remove single date
  const removeSingleDate = (id: string) => {
    setSingleDates((prev) => prev.filter((date) => date.id !== id))
  }

  // Remove date range
  const removeDateRange = (id: string) => {
    setDateRanges((prev) => prev.filter((range) => range.id !== id))
  }

  // Clear all dates
  const clearAllDates = () => {
    setSingleDates([])
    setDateRanges([])
  }

  const resetSpinHistory = () => {
    setSpinHistory([])
  }

  const removeDate = (id: string) => {
    // Remove from single dates
    setSingleDates(prev => prev.filter(date => date.id !== id))
    // Remove from date ranges
    setDateRanges(prev => 
      prev.map(range => ({
        ...range,
        dates: range.dates.filter(date => date.id !== id)
      })).filter(range => range.dates.length > 0)
    )
  }

  // Handle day of week selection change
  const handleDaySelectionChange = (day: string, checked: boolean) => {
    setSelectedDays(prev => ({ ...prev, [day]: checked }))
    
    // Show feedback to user about filtering
    if (!checked) {
      const dayName = day.charAt(0).toUpperCase() + day.slice(1)
      console.log(`${dayName} dates will be filtered out from the wheel`)
    }
  }

  // Get preview of dates that would be affected by day filter
  const getFilteredDatesPreview = () => {
    const allDateEntries = [...singleDates, ...dateRanges.flatMap((range) => range.dates)]
    const includedDates = allDateEntries.filter(date => shouldIncludeDate(date.date))
    const excludedDates = allDateEntries.filter(date => !shouldIncludeDate(date.date))
    
    return { includedDates, excludedDates }
  }

  // Update all dates when single dates, ranges, or selected days change
  useEffect(() => {
    const allDateEntries: DateEntry[] = [...singleDates, ...dateRanges.flatMap((range) => range.dates)]
    // Filter dates based on selected days of the week
    const filteredDates = allDateEntries.filter(date => shouldIncludeDate(date.date))
    setAllDates(filteredDates)
  }, [singleDates, dateRanges, selectedDays])

  // Update date formats when format changes
  useEffect(() => {
    setSingleDates((prev) =>
      prev.map((date) => ({
        ...date,
        formatted: formatDate(date.date, dateFormat),
      })),
    )

    setDateRanges((prev) =>
      prev.map((range) => ({
        ...range,
        label: `${formatDate(range.from, dateFormat)} - ${formatDate(range.to, dateFormat)}`,
        dates: range.dates.map((date) => ({
          ...date,
          formatted: formatDate(date.date, dateFormat),
        })),
      })),
    )
  }, [dateFormat])

  // Spin the wheel
  const spinWheel = () => {
    if (allDates.length === 0) return

    setIsSpinning(true)
    setCurrentResult(null)

    // Calculate random rotation (multiple full rotations + random final position)
    const randomRotation = Math.random() * 360 + 2160 // 6-7 full rotations (like image picker)
    setWheelRotation((prev) => prev + randomRotation)

    // Simulate spinning animation
    setTimeout(() => {
      const finalRotation = (wheelRotation + randomRotation) % 360
      const normalizedAngle = (360 - finalRotation) % 360
      const segmentAngle = 360 / allDates.length
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle) % allDates.length
      const selectedDate = allDates[segmentIndex]

      setCurrentResult(selectedDate.formatted)
      setIsSpinning(false)

      // Add to history
      const currentWheel = getCurrentWheel()
      const result: SpinResult = {
        date: selectedDate.formatted,
        timestamp: new Date(),
        eliminated: actionMode === "elimination",
        wheelName: currentWheel?.name || "Unknown Wheel",
      }
      setSpinHistory((prev) => [result, ...prev])
      
      // Add to global history
      addToGlobalSpinHistory({
        date: selectedDate.formatted,
        timestamp: new Date(),
        eliminated: actionMode === "elimination",
        wheelName: currentWheel?.name || "Unknown Wheel",
        toolType: "date-picker-wheel",
      })

      // Remove from list if elimination mode
      if (actionMode === "elimination") {
        // Find and remove the date from either single dates or ranges
        const dateToRemove = selectedDate

        // Check if it's in single dates
        const singleDateIndex = singleDates.findIndex((d) => d.id === dateToRemove.id)
        if (singleDateIndex !== -1) {
          setSingleDates((prev) => prev.filter((d) => d.id !== dateToRemove.id))
        } else {
          // Remove from ranges and update ranges
          setDateRanges((prev) =>
            prev
              .map((range) => ({
                ...range,
                dates: range.dates.filter((d) => d.id !== dateToRemove.id),
              }))
              .filter((range) => range.dates.length > 0),
          )
        }
      }
    }, 3000) // 3 second spin duration
  }

  // Handle confetti and sound effects
  useEffect(() => {
    if (currentResult && !isSpinning) {
      if (settings.confettiSound?.enableConfetti) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
      if (globalSettings.confettiSound?.enableSound && !toolMuted) {
        const audio = new Audio("/sound-win.mp3")
        audio.volume = globalSettings.confettiSound.soundVolume || 0.5
        audio.play().catch(() => {})
      }
    }
  }, [currentResult, isSpinning, globalSettings.confettiSound, toolMuted, settings.confettiSound])

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        spinWheel()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [allDates, actionMode, soundEnabled])

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // If no dates, show empty wheel with message
    if (allDates.length === 0) {
      // Draw empty wheel outline
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw center circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, 45, 0, 2 * Math.PI)
      ctx.fillStyle = "#f3f4f6"
      ctx.fill()
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 4
      ctx.stroke()

      // Draw "Add dates" text
      ctx.fillStyle = "#6b7280"
      ctx.font = "bold 20px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Add dates", centerX, centerY - 10)
      ctx.font = "14px Arial"
      ctx.fillText("to start spinning", centerX, centerY + 10)
      return
    }

    // Draw wheel segments (no internal rotation needed since motion.div handles it)
    const segmentAngle = (2 * Math.PI) / allDates.length
    const colors = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316", "#ec4899"]

    allDates.forEach((date, index) => {
      const startAngle = index * segmentAngle
      const endAngle = (index + 1) * segmentAngle
      const color = colors[index % colors.length]

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      const textAngle = startAngle + segmentAngle / 2
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7)
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7)

      ctx.save()
      ctx.translate(textX, textY)
      // Rotate text to be horizontal within the segment
      ctx.rotate(textAngle)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.fillText(date.formatted, 0, 0)
      ctx.restore()
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 45, 0, 2 * Math.PI)
    ctx.fillStyle = "#1f2937"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 4
    ctx.stroke()

    // Draw "SPIN" text
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 20px Arial"
    ctx.textAlign = "center"
    ctx.fillText("SPIN", centerX, centerY + 7)
  }, [allDates, dateFormat])

  // Generate dates using AI
  const generateAIDates = async (prompt: string) => {
    setIsGenerating(true)

    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate contextual dates based on prompt
      const suggestions = generateDateSuggestions(prompt)
      const generatedDates: DateEntry[] = []

      suggestions.forEach((dateStr) => {
        try {
          const date = new Date(dateStr)
          if (!isNaN(date.getTime()) && shouldIncludeDate(date)) {
            generatedDates.push({
              id: Math.random().toString(36).substr(2, 9),
              date,
              formatted: formatDate(date, dateFormat),
            })
          }
        } catch (error) {
          console.error("Error parsing date:", dateStr)
        }
      })

      setSingleDates((prev) => [...prev, ...generatedDates])
      setAiPrompt("")
    } catch (error) {
      console.error("Error generating dates:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate date suggestions based on prompt
  const generateDateSuggestions = (prompt: string): string[] => {
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1

    const promptLower = prompt.toLowerCase()

    if (promptLower.includes("holiday") || promptLower.includes("christmas")) {
      return [
        `${currentYear}-12-25`,
        `${nextYear}-12-25`,
        `${currentYear}-12-24`,
        `${currentYear}-01-01`,
        `${nextYear}-01-01`,
      ]
    }

    if (promptLower.includes("summer") || promptLower.includes("vacation")) {
      return [
        `${currentYear}-06-15`,
        `${currentYear}-07-04`,
        `${currentYear}-07-15`,
        `${currentYear}-08-01`,
        `${currentYear}-08-15`,
      ]
    }

    if (promptLower.includes("weekend") || promptLower.includes("saturday") || promptLower.includes("sunday")) {
      const dates = []
      const today = new Date()
      for (let i = 0; i < 10; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        if (date.getDay() === 0 || date.getDay() === 6) {
          // Sunday or Saturday
          dates.push(date.toISOString().split("T")[0])
        }
      }
      return dates.slice(0, 5)
    }

    if (promptLower.includes("birthday") || promptLower.includes("anniversary")) {
      return [
        `${currentYear}-02-14`,
        `${currentYear}-05-15`,
        `${currentYear}-09-20`,
        `${currentYear}-11-10`,
        `${nextYear}-03-25`,
      ]
    }

    if (promptLower.includes("meeting") || promptLower.includes("work") || promptLower.includes("business")) {
      const dates = []
      const today = new Date()
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        if (date.getDay() >= 1 && date.getDay() <= 5) {
          // Monday to Friday
          dates.push(date.toISOString().split("T")[0])
        }
      }
      return dates.slice(0, 5)
    }

    // Default: generate random dates in the next 3 months
    const dates = []
    const today = new Date()
    for (let i = 0; i < 5; i++) {
      const randomDays = Math.floor(Math.random() * 90) + 1
      const date = new Date(today)
      date.setDate(today.getDate() + randomDays)
      dates.push(date.toISOString().split("T")[0])
    }
    return dates
  }

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-white" : "min-h-screen transition-colors duration-300"}
      style={isFullscreen ? {} : {
        backgroundColor: settings.appearance?.backgroundColor,
        backgroundImage: settings.appearance?.backgroundImage
          ? `url(${settings.appearance.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {showConfetti && (
        <Confetti 
          width={window.innerWidth} 
          height={window.innerHeight} 
          numberOfPieces={400} 
          recycle={false} 
          style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1000 }} 
        />
      )}
      {!isFullscreen && <Header onOpenSettings={() => setShowSettings(true)} />}
      
      <main className={isFullscreen ? "h-full flex flex-col items-center justify-center p-4" : "w-full px-4 py-8 sm:px-6 lg:px-8"}>
        {!isFullscreen && (
          <div className="text-center mb-8">
            <ToolPageTitle
              title={showTitle && wheelTitle ? wheelTitle : "Date Picker Wheel"}
              toolType="date-picker-wheel"
            />
            <p className="text-gray-600">
              {showTitle && wheelDescription ? wheelDescription : "Randomly select dates for your events and activities"}
            </p>
          </div>
        )}

        <div className={isFullscreen ? "w-full max-w-4xl mx-auto" : "w-full"}>
          <div className={isFullscreen ? "flex flex-col items-center" : "grid grid-cols-1 lg:grid-cols-3 gap-8"}>
            {/* Wheel Section */}
            <div className={isFullscreen ? "w-full max-w-2xl" : "lg:col-span-2"}>
              <Card className="relative">
                <CardContent className="p-8">
                  {showTitle && wheelTitle && (
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">{wheelTitle}</h2>
                      {wheelDescription && <p className="text-gray-600 mt-2">{wheelDescription}</p>}
                    </div>
                  )}

                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <motion.div
                        className="rounded-full cursor-pointer"
                        animate={{ rotate: wheelRotation }}
                        transition={{ duration: isSpinning ? 3 : 0, ease: "easeOut" }}
                        onClick={spinWheel}
                      >
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={600}
                          className="border-2 border-gray-200 rounded-full"
                        />
                      </motion.div>

                      {allDates.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center text-gray-500">
                            {/* <CalendarIcon className="w-16 h-16 mx-auto mb-4" /> */}
                            <p>Add dates to start spinning</p>
                          </div>
                        </div>
                      )}

                                              {/* Black triangle pointer - positioned at 3pm (right side) */}
                        <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[30px] border-r-black pointer-events-none" />
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <button
                      className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg rounded-lg px-8 py-3 flex items-center gap-2 shadow-lg mx-auto"
                      onClick={spinWheel}
                      disabled={isSpinning || allDates.length === 0}
                    >
                      <Target className="w-6 h-6 text-pink-200" />
                      {isSpinning ? "SPINNING..." : "SPIN THE WHEEL"}
                    </button>

                    {currentResult && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 mb-2">{resultTitle || "Selected Date:"}</h3>
                        <p className="text-2xl font-bold text-green-900">{currentResult}</p>
                      </div>
                    )}

                    {/* Spin Count Display */}
                    <div className="text-center text-sm text-gray-600">
                      <p>Total Spins: {spinHistory.length}</p>
                      {(() => {
                        const allDateEntries = [...singleDates, ...dateRanges.flatMap((range) => range.dates)]
                        const filteredCount = allDateEntries.filter(date => shouldIncludeDate(date.date)).length
                        const totalCount = allDateEntries.length
                        const excludedCount = totalCount - filteredCount
                        
                        return excludedCount > 0 && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                            <div className="flex items-center justify-center space-x-1">
                              <span>🔍</span>
                              <span>Day filter active: {filteredCount}/{totalCount} dates</span>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className={
                    (isFullscreen
                      ? "fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-white/90 rounded-lg p-2 shadow-lg flex items-center space-x-4"
                      : "flex justify-between items-center mt-6 pt-4 border-t"
                    )
                  }>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setToolMuted(!toolMuted)}>
                        {toolMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowResults(true)}>
                        <History className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>



            {/* Inputs Section */}
            {!isFullscreen && (
              <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">INPUTS</CardTitle>
                    {allDates.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {allDates.length}
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={resetSpinHistory}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={clearAllDates} className="text-red-600">
                          <X className="w-4 h-4 mr-2" /> Clear All Dates
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={resetSpinHistory} className="text-gray-400">
                          <RotateCcw className="w-4 h-4 mr-2" /> Reset Spin History
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mode Switcher */}
                  <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as "manual" | "ai")}>
                    <TabsList className="grid w-full grid-cols-2">
                                                                   <TabsTrigger
                        value="manual"
                        className="flex items-center space-x-2 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:hover:bg-gray-800 data-[state=inactive]:bg-white"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Manual Input</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="ai"
                        className={`flex items-center space-x-2 ${
                          inputMode === "ai" 
                            ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-600 hover:to-pink-600" 
                            : "bg-white"
                        }`}
                      >
                        <Sparkles className={cn("w-4 h-4", inputMode === "ai" ? "text-white" : "text-violet-500")} />
                        <span className={inputMode === "ai" ? "text-white" : "bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"}>
                          AI-Powered
                        </span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual" className="space-y-4">
                      {/* Date Format */}
                      <div>
                        <Label>Date Format:</Label>
                        <Select value={dateFormat} onValueChange={setDateFormat}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dateFormats.map((format) => (
                              <SelectItem key={format} value={format}>
                                {format}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Date Input */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Inputs:</Label>
                          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                            <PopoverTrigger asChild>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Choose Dates
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <div className="p-4 space-y-4">
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant={!isRangeMode ? "default" : "outline"}
                                    onClick={() => setIsRangeMode(false)}
                                  >
                                    Single Date
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={isRangeMode ? "default" : "outline"}
                                    onClick={() => setIsRangeMode(true)}
                                  >
                                    Date Range
                                  </Button>
                                </div>

                                <Calendar
                                  mode={isRangeMode ? "range" : "single"}
                                  selected={isRangeMode ? selectedRange : selectedDate}
                                  onSelect={(date) => {
                                    if (isRangeMode) {
                                      setSelectedRange(date as DateRange)
                                    } else {
                                      setSelectedDate(date as Date)
                                    }
                                  }}
                                  initialFocus
                                />

                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      if (isRangeMode && selectedRange?.from && selectedRange?.to) {
                                        addDateRange(selectedRange.from, selectedRange.to)
                                        setSelectedRange(undefined)
                                      } else if (!isRangeMode && selectedDate) {
                                        addSingleDate(selectedDate)
                                        setSelectedDate(undefined)
                                      }
                                      setShowCalendar(false)
                                    }}
                                    disabled={isRangeMode ? !selectedRange?.from || !selectedRange?.to : !selectedDate}
                                  >
                                    Add
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedDate(undefined)
                                      setSelectedRange(undefined)
                                      setShowCalendar(false)
                                    }}
                                  >
                                    Reset
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Display selected dates and ranges as chips */}
                        <div className="space-y-2 min-h-[100px] max-h-40 overflow-y-auto bg-gray-50 p-3 rounded border">
                          {singleDates.length === 0 && dateRanges.length === 0 ? (
                            <div className="text-gray-500 text-sm text-center py-4">
                              Click here to pick a date or date range...
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {/* Single dates */}
                              {singleDates.map((date) => (
                                <Badge
                                  key={date.id}
                                  variant="secondary"
                                  className="bg-gray-700 text-white hover:bg-gray-800 pr-1 group"
                                >
                                  {date.formatted}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white rounded-full"
                                    onClick={() => removeSingleDate(date.id)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </Badge>
                              ))}

                              {/* Date ranges */}
                              {dateRanges.map((range) => (
                                <Badge
                                  key={range.id}
                                  variant="secondary"
                                  className="bg-gray-700 text-white hover:bg-gray-800 pr-1 group"
                                >
                                  {range.label}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white rounded-full"
                                    onClick={() => removeDateRange(range.id)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>



                      {/* Days of Week */}
                      <div className="space-y-3">
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center space-x-2">
                            <Label className="whitespace-nowrap">Days of Week included:</Label>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap" title="Uncheck days to filter out dates from those days of the week">
                              💡 Filter dates by day
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDays({
                                monday: true,
                                tuesday: true,
                                wednesday: true,
                                thursday: true,
                                friday: true,
                                saturday: true,
                                sunday: true,
                              })}
                              className="text-xs h-6 px-2"
                            >
                              All
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDays({
                                monday: false,
                                tuesday: false,
                                wednesday: false,
                                thursday: false,
                                friday: false,
                                saturday: false,
                                sunday: false,
                              })}
                              className="text-xs h-6 px-2"
                            >
                              None
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(selectedDays).map(([day, checked]) => (
                              <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                  id={day}
                                  checked={checked}
                                  onCheckedChange={(checked) => handleDaySelectionChange(day, checked as boolean)}
                                />
                                <Label htmlFor={day} className={`text-sm capitalize ${checked ? 'text-black font-medium' : 'text-gray-500'}`}>
                                  {day}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <div className="text-xs text-gray-600">
                            {Object.values(selectedDays).filter(Boolean).length === 7 
                              ? "All days selected - no filtering applied" 
                              : `${Object.values(selectedDays).filter(Boolean).length} days selected - dates will be filtered accordingly`
                            }
                          </div>
                        </div>
                        {(() => {
                          const allDateEntries = [...singleDates, ...dateRanges.flatMap((range) => range.dates)]
                          const filteredCount = allDateEntries.filter(date => shouldIncludeDate(date.date)).length
                          const totalCount = allDateEntries.length
                          const excludedCount = totalCount - filteredCount
                          
                          return excludedCount > 0 && (
                            <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                              <div className="flex items-center space-x-1">
                                <span>⚠️</span>
                                <span>{excludedCount} date{excludedCount !== 1 ? 's' : ''} excluded due to day filter</span>
                              </div>
                              <div className="mt-1 text-amber-700">
                                {filteredCount} of {totalCount} dates available on wheel
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    </TabsContent>

                    <TabsContent value="ai" className="space-y-4">
                      {/* AI Mode Interface */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-purple-800">AI Date Generator</h3>
                        </div>
                        <p className="text-sm text-purple-700 mb-4">
                          Describe what kind of dates you need, and AI will generate relevant suggestions for you!
                        </p>

                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="ai-prompt">What dates are you looking for?</Label>
                            <Textarea
                              id="ai-prompt"
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              placeholder="e.g., 'Summer vacation dates', 'Weekend dates for meetings', 'Holiday dates', 'Birthday party dates'..."
                              className="mt-2 min-h-[80px]"
                              disabled={isGenerating}
                            />
                          </div>

                          <Button
                            onClick={() => generateAIDates(aiPrompt)}
                            disabled={!aiPrompt.trim() || isGenerating}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            {isGenerating ? (
                              <>
                                <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating Dates...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Dates with AI
                              </>
                            )}
                          </Button>
                        </div>

                        {/* AI Suggestions */}
                        <div className="mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <Label className="text-sm font-medium">Try these prompts:</Label>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Summer vacation dates",
                              "Weekend dates only",
                              "Holiday celebrations",
                              "Business meeting dates",
                              "Birthday party dates",
                              "Anniversary dates",
                            ].map((suggestion) => (
                              <Button
                                key={suggestion}
                                variant="outline"
                                size="sm"
                                onClick={() => setAiPrompt(suggestion)}
                                className="text-xs bg-white hover:bg-purple-50 border-purple-200"
                                disabled={isGenerating}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Date Format for AI mode */}
                      <div>
                        <Label>Date Format:</Label>
                        <Select value={dateFormat} onValueChange={setDateFormat}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dateFormats.map((format) => (
                              <SelectItem key={format} value={format}>
                                {format}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Display AI generated dates */}
                      <div>
                        <Label>AI Generated Dates:</Label>
                        <div className="space-y-2 min-h-[100px] max-h-40 overflow-y-auto bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded border border-purple-200 mt-2">
                          {singleDates.length === 0 && dateRanges.length === 0 ? (
                            <div className="text-purple-600 text-sm text-center py-4 flex flex-col items-center space-y-2">
                              <Sparkles className="w-8 h-8 text-purple-400" />
                              <span>AI will generate dates based on your description</span>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {/* Single dates with AI styling */}
                              {singleDates.map((date) => (
                                <Badge
                                  key={date.id}
                                  variant="secondary"
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 pr-1 group"
                                >
                                  {date.formatted}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-600 rounded-full"
                                    onClick={() => removeSingleDate(date.id)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </Badge>
                              ))}

                              {/* Date ranges with AI styling */}
                              {dateRanges.map((range) => (
                                <Badge
                                  key={range.id}
                                  variant="secondary"
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 pr-1 group"
                                >
                                  {range.label}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-600 rounded-full"
                                    onClick={() => removeDateRange(range.id)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Days of Week for AI mode */}
                      <div className="space-y-3">
                        <Label className="whitespace-nowrap">Days of Week included:</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(selectedDays).map(([day, checked]) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={`ai-${day}`}
                                checked={checked}
                                onCheckedChange={(checked) => setSelectedDays((prev) => ({ ...prev, [day]: checked }))}
                              />
                              <Label htmlFor={`ai-${day}`} className={`text-sm capitalize ${checked ? 'text-black font-medium' : 'text-gray-500'}`}>
                                {day}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Clear All Button */}
                  <Button variant="destructive" size="sm" onClick={clearAllDates} className="w-full">
                    Clear All Dates
                  </Button>
                </CardContent>
              </Card>

              {/* Title Section Toggle */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Label>Enable Title Section</Label>
                    <Switch checked={showTitle} onCheckedChange={setShowTitle} />
                  </div>

                  {showTitle && (
                    <div className="space-y-3 mt-4">
                      <div>
                        <Label>Tool Title</Label>
                        <Input
                          value={wheelTitle}
                          onChange={(e) => setWheelTitle(e.target.value)}
                          placeholder="e.g., Annual Trip Date"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Tool Description</Label>
                        <Textarea
                          value={wheelDescription}
                          onChange={(e) => setWheelDescription(e.target.value)}
                          placeholder="Describe the purpose of this wheel..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Result Title</Label>
                        <Input
                          value={resultTitle}
                          onChange={(e) => setResultTitle(e.target.value)}
                          placeholder="e.g., Selected Date:"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            )}
          </div>
        </div>

        {/* Results Modal */}
        <Dialog open={showResults} onOpenChange={setShowResults}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Spin Results History</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {globalSpinHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No results yet. Start spinning!</p>
              ) : (
                globalSpinHistory.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.date}</span>
                        <span className="text-xs text-gray-500">({result.wheelName})</span>
                        <span className="text-xs text-blue-500">[{result.toolType}]</span>
                        {result.eliminated && (
                          <Badge variant="secondary" className="ml-2">
                            Eliminated
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{format(result.timestamp, "MMM d, HH:mm")}</span>
                  </div>
                ))
              )}
            </div>

                                <div className="flex justify-between pt-4 border-t">
                      <Button variant="outline" onClick={() => clearGlobalSpinHistory()} disabled={globalSpinHistory.length === 0}>
                        Clear All History
                      </Button>
              <div className="space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" onClick={() => setShowResults(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


      </main>

      {!isFullscreen && <Footer />}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

export default function DatePickerWheelPage() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <InnerDatePickerWheelPage />
      </ToastProvider>
    </SettingsProvider>
  )
} 