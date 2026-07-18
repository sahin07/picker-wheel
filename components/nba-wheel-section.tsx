"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { useWheelManagerStore, NBAWheelData } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import PickerResultsModal from "@/components/picker-results-modal"
import NBATeamDetailsModal from "@/components/nba-team-details-modal"
import Confetti from "react-confetti"
import { createPortal } from "react-dom"
import { Volume2, VolumeX, Maximize2, Trophy, Palette, BarChart3, Users, Gamepad2, X } from "lucide-react"
import { type NBATeam } from "@/data/nba-teams"

interface NBAWheelSectionProps {
  onOpenAchievements?: () => void
  onOpenThemeSelector?: () => void
  onOpenAnalytics?: () => void
  onOpenSocialHub?: () => void
  onOpenGameModes?: () => void
  totalPoints?: number
  currentTheme?: string
  themes?: any[]
  spinHistory?: any[]
  currentUser?: any
  isGameActive?: boolean
  currentGameMode?: string
  onSpinCompleted?: () => void
  actionMode?: "normal" | "elimination" | "manual"
  onEliminationMode?: (selectedTeam: NBATeam) => void
  onActionModeChange?: (mode: "normal" | "elimination" | "manual") => void
  onAddManualTeam?: (teamName: string) => void
}

const NBAWheelSection = React.memo(({ 
  onOpenAchievements, 
  onOpenThemeSelector, 
  onOpenAnalytics, 
  onOpenSocialHub, 
  onOpenGameModes, 
  totalPoints = 0, 
  currentTheme = 'classic',
  themes = [],
  spinHistory = [],
  currentUser,
  isGameActive = false,
  currentGameMode,
  onSpinCompleted,
  actionMode = "normal",
  onEliminationMode,
  onActionModeChange,
  onAddManualTeam
}: NBAWheelSectionProps) => {
  // Subscribe to the current wheel using a Zustand selector - optimized
  const wheel = useWheelManagerStore(useCallback(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  }, []));
  
  // Memoize default data to prevent recreation
  const defaultData = useMemo((): NBAWheelData => ({
    selectedConference: "all",
    selectedTeams: [],
    displayMode: "name",
    viewMode: "wheel",
    favoriteTeams: [],
    comparisonTeams: [],
    isSpinning: false,
    spinRotation: 0,
    selectedResult: null,
    totalSpins: 0,
    showStatistics: false,
    showComparison: false,
    showFavorites: false,
    recentResults: [],
  }), []);
  
  const data = (wheel?.data as NBAWheelData) ?? defaultData

  const { updateWheelData } = useWheelManagerStore()
  const { settings } = useSettingsStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentRotation, setCurrentRotation] = useState(data.currentRotation || 0)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false)
  const [muted, setMuted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 800, height: 600 })
  const [manualTeamName, setManualTeamName] = useState("")

  // Client-side only rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get window dimensions safely - optimized with debouncing
  const updateDimensions = useCallback(() => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);
  
  useEffect(() => {
    updateDimensions();
    
    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [updateDimensions]);

  // Memoize teams and total teams to prevent recalculation
  const teams = useMemo(() => data.selectedTeams || [], [data.selectedTeams])
  const totalTeams = useMemo(() => teams.length, [teams])

  // Update current rotation when data changes
  useEffect(() => {
    setCurrentRotation(data.currentRotation || 0)
  }, [data.currentRotation])

  // Memoize helper function to prevent recreation
  const adjustBrightness = useCallback((color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }, []);

  // Memoize sound play function
  const playSpinSound = useCallback(() => {
    try {
      const audio = new Audio('/sound-win.mp3')
      audio.volume = settings.confettiSound?.soundVolume || 0.5
      audio.play()
    } catch (error) {
      console.log('Sound play failed:', error)
    }
  }, [settings.confettiSound?.soundVolume])

  // Memoize spin animation function
  const spin = useCallback(() => {
    if (data.isSpinning || totalTeams === 0) return
    const start = currentRotation
    const end = start + 1440 + Math.random() * 720
    const duration = (settings.spinBehavior?.spinningDuration || 3) * 1000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const p = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const rot = start + (end - start) * eased
      setCurrentRotation(rot)
      updateWheelData("nba-wheel", wheel?.id || "", { ...data, isSpinning: true, currentRotation: rot, spinRotation: rot })
      if (p < 1) {
        requestAnimationFrame(animate)
      } else {
        const finalAngle = rot % 360
        const seg = 360 / totalTeams
        const index = Math.floor(((360 - finalAngle) % 360) / seg) % totalTeams
        const result = teams[index]

        // Handle elimination mode
        const updatedTeams = actionMode === 'elimination' ? teams.filter((t: any) => t.id !== result.id) : teams

        const updatedData = {
          ...data,
          isSpinning: false,
          selectedResult: result,
          totalSpins: (data.totalSpins || 0) + 1,
          recentResults: [result, ...(data.recentResults || [])].slice(0, 10),
          currentRotation: rot,
          selectedTeams: updatedTeams
        }
        updateWheelData("nba-wheel", wheel?.id || "", updatedData)

        if (settings.confettiSound?.enableSound) setShowConfetti(true)
        if (settings.confettiSound?.enableSound && !muted) playSpinSound()
        setTimeout(() => setShowConfetti(false), 5000)
        setShowResultsModal(true)
        
        // Call spin completed callback
        if (onSpinCompleted) {
          onSpinCompleted()
        }
        
        // Handle elimination mode
        if (actionMode === "elimination" && onEliminationMode && result) {
          onEliminationMode(result)
        }
      }
    }
    animate()
  }, [currentRotation, settings.spinBehavior?.spinningDuration, totalTeams, teams, data, updateWheelData, wheel?.id, settings.confettiSound?.enableSound, muted, playSpinSound, onSpinCompleted, actionMode, onEliminationMode])

  // Memoize wheel drawing function
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !isClient) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const r = Math.min(cx, cy) - 20
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (totalTeams === 0) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 2; ctx.stroke()
      ctx.fillStyle = '#f9fafb'; ctx.fill(); ctx.fillStyle = '#9ca3af'; ctx.font = '16px Arial'; ctx.textAlign = 'center'
      ctx.fillText('No teams selected', cx, cy)
      return
    }

    const segmentAngle = (2 * Math.PI) / totalTeams
    
    // Get current theme colors and effects
    const currentThemeData = themes.find(t => t.id === currentTheme)
    const themeColors = currentThemeData?.colors || ['#4ade80', '#fbbf24', '#f97316', '#84cc16', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
    const themeEffects = currentThemeData?.effects || {
      particles: false,
      glow: false,
      sparkle: false,
      rainbow: false,
      gradient: false
    }

    teams.forEach((team: any, i: number) => {
      const start = i * segmentAngle + currentRotation * (Math.PI / 180)
      const end = start + segmentAngle
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath()
      
      // Use theme colors instead of team colors
      const colorIndex = i % themeColors.length
      let fillStyle = themeColors[colorIndex]
      
      // Apply theme effects
      if (themeEffects.gradient) {
        // Create gradient effect
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        gradient.addColorStop(0, fillStyle)
        gradient.addColorStop(1, adjustBrightness(fillStyle, -20))
        fillStyle = gradient
      }
      
      ctx.fillStyle = fillStyle; ctx.fill()
      
      // Add glow effect
      if (themeEffects.glow) {
        ctx.shadowColor = fillStyle
        ctx.shadowBlur = 15
        ctx.stroke()
        ctx.shadowBlur = 0
      }
      
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke()

      ctx.save()
      const mid = start + segmentAngle / 2
      const tx = cx + Math.cos(mid) * (r * 0.7)
      const ty = cy + Math.sin(mid) * (r * 0.7)
      ctx.translate(tx, ty)
      ctx.rotate(mid)
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      let display = ''
      let fontSize = 14
      if (data.displayMode === 'both') { display = `${team.logo} ${team.name}`; fontSize = 12 }
      else if (data.displayMode === 'logo') { display = team.logo; fontSize = 18 }
      else { display = team.name; fontSize = 14 }
      ctx.font = `bold ${fontSize}px Arial`
      ctx.fillText(display, 0, 0)
      ctx.restore()
    })

    // Center button with gradient effect
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40)
    gradient.addColorStop(0, '#2d3748')
    gradient.addColorStop(1, '#1a202c')
    
    ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2)
    ctx.fillStyle = gradient; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke()
    ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText('🏀', cx, cy - 6)
    ctx.font = 'bold 10px Arial'; ctx.fillText('SPIN', cx, cy + 10)

    // Pointer at right with gradient
    ctx.beginPath(); ctx.moveTo(cx + r - 20, cy); ctx.lineTo(cx + r, cy - 15); ctx.lineTo(cx + r, cy + 15); ctx.closePath()
    
    // Add gradient to pointer
    const pointerGradient = ctx.createLinearGradient(cx + r - 20, cy - 15, cx + r, cy + 15)
    pointerGradient.addColorStop(0, '#dc2626')
    pointerGradient.addColorStop(0.5, '#ef4444')
    pointerGradient.addColorStop(1, '#dc2626')
    
    ctx.fillStyle = pointerGradient; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
  }, [teams, data.displayMode, currentRotation, isClient, currentTheme, themes, totalTeams, adjustBrightness])

  // Draw wheel on mount and when dependencies change - optimized
  useEffect(() => {
    drawWheel()
  }, [drawWheel])

  // Handle canvas resize - optimized
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    drawWheel()
  }, [drawWheel])
  
  useEffect(() => {
    resizeCanvas()
    
    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(resizeCanvas, 100);
    };
    
    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [resizeCanvas])

  // Memoize spin handler
  const handleSpin = useCallback(() => {
    if (data.isSpinning || totalTeams === 0) return
    spin()
  }, [data.isSpinning, totalTeams, spin])

  // Memoize mute toggle
  const toggleMute = useCallback(() => {
    setMuted(!muted)
  }, [muted])

  // Memoize manual team addition
  const handleAddManualTeam = useCallback(() => {
    if (manualTeamName.trim() && onAddManualTeam) {
      onAddManualTeam(manualTeamName.trim())
      setManualTeamName("") // Clear input after adding
    }
  }, [manualTeamName, onAddManualTeam])

  // Memoize modal handlers
  const handleOpenResultsModal = useCallback(() => setShowResultsModal(true), [])
  const handleCloseResultsModal = useCallback(() => setShowResultsModal(false), [])
  const handleOpenTeamDetailsModal = useCallback(() => setShowTeamDetailsModal(true), [])
  const handleCloseTeamDetailsModal = useCallback(() => setShowTeamDetailsModal(false), [])

  // Memoize action mode change handler
  const handleActionModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = e.target.value as "normal" | "elimination" | "manual"
    onActionModeChange?.(newMode)
  }, [onActionModeChange])

  // Memoize manual team name change handler
  const handleManualTeamNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setManualTeamName(e.target.value)
  }, [])

  // Memoize manual team name key down handler
  const handleManualTeamNameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && manualTeamName.trim()) {
      handleAddManualTeam()
    }
  }, [manualTeamName, handleAddManualTeam])

  // Memoize results for modal
  const modalResults = useMemo(() => 
    data.recentResults.slice(0, 5).map(result => ({
      id: result.id,
      name: result.name,
      abbreviation: result.abbreviation,
      image: result.logo,
      color: result.primaryColor,
      league: result.league,
      division: result.division,
      city: result.city,
      primaryColor: result.primaryColor,
      secondaryColor: result.secondaryColor,
      founded: result.founded,
      championships: result.championships,
      homeVenue: result.homeVenue,
      manager: result.manager,
      owner: result.owner
    })), [data.recentResults]
  )

  return (
    <div className="flex flex-col items-center">
      {showConfetti && typeof window !== 'undefined' && createPortal(
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          pointerEvents: 'none', 
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            numberOfPieces={400}
            recycle={false}
            gravity={0.3}
            wind={0.05}
            colors={['#22c55e', '#eab308', '#3b82f6', '#f59e0b', '#10b981', '#ef4444']}
            tweenDuration={5000}
            confettiSource={{
              x: 0,
              y: 0,
              w: windowDimensions.width,
              h: 0
            }}
          />
        </div>,
        document.body
      )}

      <div className="relative mb-4">
        <canvas ref={canvasRef} width={600} height={600} className="cursor-pointer drop-shadow-lg bg-white rounded-full" onClick={!data.isSpinning ? handleSpin : undefined} />

        <div className="absolute top-4 left-4">
          <Button variant="outline" size="sm" onClick={handleOpenResultsModal}>Results</Button>
        </div>

        <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
          <Button variant="ghost" size="sm" onClick={toggleMute} className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-md" title={settings.confettiSound?.enableSound ? (muted ? "Unmute" : "Mute") : "Global sound disabled"}>
            {!settings.confettiSound?.enableSound ? <VolumeX className="w-5 h-5 text-gray-400" /> : muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>

        <div className="absolute bottom-4 right-4">
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-md"><Maximize2 className="w-5 h-5" /></Button>
        </div>
      </div>

      <Button onClick={handleSpin} disabled={data.isSpinning || totalTeams === 0} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
        {data.isSpinning ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Spinning...</span>
          </div>
        ) : (
          "🏀 SPIN THE WHEEL"
        )}
      </Button>

      {totalTeams === 0 && <p className="mt-4 text-gray-500 text-center">Select some teams to start spinning!</p>}

      {/* Selected Result Display */}
      {data.selectedResult && !data.isSpinning && (
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-xl shadow-lg text-center">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">🏀 Selected Team!</h3>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-4xl">{data.selectedResult.logo}</span>
            <div>
              <p className="text-2xl font-bold text-orange-900">{data.selectedResult.name}</p>
              <p className="text-sm text-orange-700">{data.selectedResult.city} • {data.selectedResult.league} Conference</p>
              <p className="text-xs text-orange-600">{data.selectedResult.championships} championships • Founded {data.selectedResult.founded}</p>
            </div>
          </div>
          <Button
            onClick={handleOpenTeamDetailsModal}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 border-orange-300 text-orange-700"
          >
            📊 View Team Details
          </Button>
        </div>
      )}

      {/* Game Mode Indicator */}
      {isGameActive && currentGameMode && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300">
          <p className="text-sm font-semibold text-purple-800">
            🎮 Playing: {currentGameMode}
          </p>
        </div>
      )}

      {/* Game Mode Section */}
      <div className="mt-6 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
        <label className="block text-sm font-semibold text-orange-800 mb-3 flex items-center">
          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
          Game Mode
        </label>
        
        {/* Quick Input Field for Manual Mode */}
        {actionMode === "manual" && (
          <div className="flex items-center space-x-2 mb-3">
            <input
              value={manualTeamName}
              onChange={handleManualTeamNameChange}
              placeholder="Type team name..."
              className="flex-1 px-3 py-2 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              onKeyDown={handleManualTeamNameKeyDown}
            />
            <Button
              onClick={handleAddManualTeam}
              disabled={!manualTeamName.trim()}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2">
          <label className={`flex flex-col items-center space-y-2 p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            actionMode === "normal" 
              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25" 
              : "bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 border border-orange-200 hover:border-orange-300"
          }`}>
            <input
              type="radio"
              name="actionMode"
              value="normal"
              checked={actionMode === "normal"}
              onChange={handleActionModeChange}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              actionMode === "normal" ? "bg-white/20" : "bg-orange-100"
            }`}>
              <span className="text-sm">🎯</span>
            </div>
            <span className={`text-xs font-semibold ${actionMode === "normal" ? "text-white" : "text-orange-700"}`}>
              Normal
            </span>
          </label>
          
          <label className={`flex flex-col items-center space-y-2 p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            actionMode === "elimination" 
              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25" 
              : "bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 border border-orange-200 hover:border-orange-300"
          }`}>
            <input
              type="radio"
              name="actionMode"
              value="elimination"
              checked={actionMode === "elimination"}
              onChange={handleActionModeChange}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              actionMode === "elimination" ? "bg-white/20" : "bg-orange-100"
            }`}>
              <span className="text-sm">❌</span>
            </div>
            <span className={`text-xs font-semibold ${actionMode === "elimination" ? "text-white" : "text-orange-700"}`}>
              Elimination
            </span>
          </label>
          
          <label className={`flex flex-col items-center space-y-2 p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            actionMode === "manual" 
              ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25" 
              : "bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 border border-orange-200 hover:border-orange-300"
          }`}>
            <input
              type="radio"
              name="actionMode"
              value="manual"
              checked={actionMode === "manual"}
              onChange={handleActionModeChange}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              actionMode === "manual" ? "bg-white/20" : "bg-orange-100"
            }`}>
              <span className="text-sm">📝</span>
            </div>
            <span className={`text-xs font-semibold ${actionMode === "manual" ? "text-white" : "text-orange-700"}`}>
              Manual
            </span>
          </label>
        </div>
        
        {/* Mode Description */}
        <div className="text-xs text-orange-600 text-center mt-3 p-2 bg-orange-50 rounded-lg">
          {actionMode === "normal" && "🎯 All teams available for each spin"}
          {actionMode === "elimination" && "❌ Selected team is removed after each spin"}
          {actionMode === "manual" && "📝 Add custom teams by typing names"}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 justify-center mt-6 mb-4">
        <Button variant="outline" size="sm" onClick={onOpenAchievements} className="text-xs px-3 py-1 bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"><Trophy className="w-3 h-3 mr-1" />Achievements ({totalPoints})</Button>
        <Button variant="outline" size="sm" onClick={onOpenThemeSelector} className="text-xs px-3 py-1 bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"><Palette className="w-3 h-3 mr-1" />Themes</Button>
        <Button variant="outline" size="sm" onClick={onOpenAnalytics} className="text-xs px-3 py-1 bg-green-50 border-green-300 text-green-700 hover:bg-green-100"><BarChart3 className="w-3 h-3 mr-1" />Analytics</Button>
        <Button variant="outline" size="sm" onClick={onOpenSocialHub} className="text-xs px-3 py-1 bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"><Users className="w-3 h-3 mr-1" />Social</Button>
        <Button variant="outline" size="sm" onClick={onOpenGameModes} className="text-xs px-3 py-1 bg-red-50 border-red-300 text-red-700 hover:bg-red-100"><Gamepad2 className="w-3 h-3 mr-1" />Games</Button>
      </div>

      <PickerResultsModal
        isOpen={showResultsModal}
        onClose={handleCloseResultsModal}
        results={modalResults}
      />

      <NBATeamDetailsModal
        isOpen={showTeamDetailsModal}
        onClose={handleCloseTeamDetailsModal}
        team={data.selectedResult}
      />
    </div>
  )
})

export default NBAWheelSection


