"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Maximize2, Trophy, Palette, BarChart3, Users, Gamepad2, X } from "lucide-react"
import { useWheelManagerStore, MLBWheelData } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import PickerResultsModal from "./picker-results-modal"
import MLBTeamDetailsModal from "./mlb-team-details-modal"
import Confetti from "react-confetti"
import { createPortal } from "react-dom"
import { type MLBTeam } from "@/data/mlb-teams"

interface MLBWheelSectionProps {
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
  onEliminationMode?: (selectedTeam: MLBTeam) => void
  onActionModeChange?: (mode: "normal" | "elimination" | "manual") => void
  onAddManualTeam?: (teamName: string) => void
}

const MLBWheelSection = React.memo(({ 
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
}: MLBWheelSectionProps) => {
  // Subscribe to the current wheel using a Zustand selector - optimized
  const wheel = useWheelManagerStore(useCallback(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  }, []));
  
  // Memoize default data to prevent recreation
  const defaultData = useMemo((): MLBWheelData => ({
    selectedLeague: "all",
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
  
  const data = (wheel?.data as MLBWheelData) ?? defaultData

  const { updateWheelData } = useWheelManagerStore()
  
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
  
  // Clear recent results when component mounts (to avoid showing old results)
  useEffect(() => {
    if (data.recentResults.length > 0 && data.totalSpins === 0) {
      // Clear recent results if we have results but no spins (fresh session)
      updateWheelData("mlb-wheel", wheel?.id || "", {
        ...data,
        recentResults: []
      })
    }
  }, [data.recentResults.length, data.totalSpins, updateWheelData, wheel?.id, data])
  
  const { settings } = useSettingsStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentRotation, setCurrentRotation] = useState(data.currentRotation || 0)
  const [confetti, setConfetti] = useState<
    Array<{ x: number; y: number; color: string; velocity: { x: number; y: number } }>
  >([])
  const animationRef = useRef<number | null>(null)
  const confettiRef = useRef<number | null>(null)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [muted, setMuted] = useState(false)
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

  // Memoize spin animation function
  const slowSpin = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const startTime = Date.now()
    const duration = settings.spinBehavior?.spinningDuration * 1000 || 3000 // 3 seconds
    const startRotation = currentRotation
    const endRotation = startRotation + 1440 + Math.random() * 720 // 4-6 full rotations

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const newRotation = startRotation + (endRotation - startRotation) * easeOut
      
      setCurrentRotation(newRotation)
      
      // Update wheel data with new rotation
      updateWheelData("mlb-wheel", wheel?.id || "", {
        ...data,
        spinRotation: newRotation,
        currentRotation: newRotation,
        isSpinning: true
      })

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Spin completed
        const finalAngle = newRotation % 360
        const segmentAngle = 360 / totalTeams
        // Calculate which segment the pointer is pointing to (pointer is at 3 o'clock = 0 degrees)
        // Since the wheel rotates clockwise and pointer is at 3 o'clock, we need to adjust the angle
        const normalizedAngle = (360 - finalAngle) % 360
        const selectedIndex = Math.floor(normalizedAngle / segmentAngle) % totalTeams
        const selectedTeam = teams[selectedIndex]
        
        // Update wheel data with result
        const updatedData = {
          ...data,
          selectedResult: selectedTeam,
          isSpinning: false,
          totalSpins: data.totalSpins + 1,
          recentResults: [selectedTeam, ...data.recentResults].slice(0, 10), // Keep last 10
          currentRotation: newRotation
        }
        
        updateWheelData("mlb-wheel", wheel?.id || "", updatedData)
        
        // Show confetti
        if (settings.confettiSound?.enableSound) {
          createConfetti()
        }
        
        // Play sound
        if (settings.confettiSound?.enableSound && !muted) {
          playSpinSound()
        }
        
        // Show results modal
        setShowResultsModal(true)
        
        // Call spin completed callback
        if (onSpinCompleted) {
          onSpinCompleted()
        }
        
        // Handle elimination mode
        if (actionMode === "elimination" && onEliminationMode && selectedTeam) {
          onEliminationMode(selectedTeam)
        }
      }
    }

    animate()
  }, [currentRotation, settings.spinBehavior?.spinningDuration, totalTeams, teams, data, updateWheelData, wheel?.id, settings.confettiSound?.enableSound, muted, onSpinCompleted, actionMode, onEliminationMode])

  // Memoize confetti creation function
  const createConfetti = useCallback(() => {
    setShowConfetti(true)
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
    
    const newConfetti = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 3 + 2
      }
    }))
    
    setConfetti(newConfetti)
    
    const animateConfetti = () => {
      setConfetti(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          velocity: {
            ...particle.velocity,
            y: particle.velocity.y + 0.1 // gravity
          }
        })).filter(particle => particle.y < window.innerHeight + 10)
      )
      
      if (confetti.length > 0) {
        confettiRef.current = requestAnimationFrame(animateConfetti)
      } else {
        setShowConfetti(false)
      }
    }
    
    animateConfetti()
  }, [confetti.length])

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

  // Memoize wheel drawing function
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !isClient) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (totalTeams === 0) {
      // Draw empty wheel
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 2
      ctx.stroke()
      
      ctx.fillStyle = '#f9fafb'
      ctx.fill()
      
      ctx.fillStyle = '#9ca3af'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('No teams selected', centerX, centerY)
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
    
    // Debug theme application
    console.log('MLB Wheel Theme Debug:', {
      currentTheme,
      selectedTheme: currentThemeData?.name,
      themeColors: themeColors.length,
      themesCount: themes.length
    });

    teams.forEach((team, index) => {
      const startAngle = index * segmentAngle + currentRotation * (Math.PI / 180)
      const endAngle = startAngle + segmentAngle

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      // Use theme colors instead of team colors
      const colorIndex = index % themeColors.length
      let fillStyle = themeColors[colorIndex]
      
      // Apply theme effects
      if (themeEffects.gradient) {
        // Create gradient effect
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
        gradient.addColorStop(0, fillStyle)
        gradient.addColorStop(1, adjustBrightness(fillStyle, -20))
        fillStyle = gradient
      }
      
      ctx.fillStyle = fillStyle
      ctx.fill()
      
      // Add glow effect
      if (themeEffects.glow) {
        ctx.shadowColor = fillStyle
        ctx.shadowBlur = 15
        ctx.stroke()
        ctx.shadowBlur = 0
      }
      
      // Add white border for better segment separation
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.stroke()
      
      // Add inner border for better definition
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius - 2, startAngle, endAngle)
      ctx.closePath()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw text horizontally within each segment
      ctx.save()
      
      // Calculate the center angle of this segment
      const segmentCenterAngle = startAngle + segmentAngle / 2
      
      // Calculate text position on the wheel (moved slightly outward for longer names)
      const textRadius = radius * 0.7
      const textX = centerX + Math.cos(segmentCenterAngle) * textRadius
      const textY = centerY + Math.sin(segmentCenterAngle) * textRadius
      
      // Move to text position
      ctx.translate(textX, textY)
      
      // Rotate to make text horizontal (counter-rotate the segment angle)
      ctx.rotate(segmentCenterAngle)
      
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      let displayText = ''
      let fontSize = 14
      
      if (data.displayMode === 'both') {
        // Show logo and full name
        displayText = `${team.logo} ${team.name}`
        fontSize = 12
      } else if (data.displayMode === 'logo') {
        displayText = team.logo
        fontSize = 18
      } else {
        // Use full team name
        displayText = team.name
        fontSize = 14
      }
      
      // Set font size
      ctx.font = `bold ${fontSize}px Arial`
      
      // Add text shadow for better readability
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      
      // Draw text at origin (0,0) since we've already translated
      ctx.fillText(displayText, 0, 0)
      
      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      
      ctx.restore()
    })

    // Draw center button with gradient effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40)
    gradient.addColorStop(0, '#2d3748')
    gradient.addColorStop(1, '#1a202c')
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI)
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Add outer border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.stroke()
    
    // Add inner border for depth
    ctx.beginPath()
    ctx.arc(centerX, centerY, 37, 0, 2 * Math.PI)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw MLB logo and SPIN text with better styling
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('⚾', centerX, centerY - 6)
    ctx.font = 'bold 10px Arial'
    ctx.fillText('SPIN', centerX, centerY + 10)

    // Draw pointer at 3 o'clock position (right side)
    ctx.beginPath()
    ctx.moveTo(centerX + radius - 20, centerY)
    ctx.lineTo(centerX + radius, centerY - 15)
    ctx.lineTo(centerX + radius, centerY + 15)
    ctx.closePath()
    
    // Add gradient to pointer
    const pointerGradient = ctx.createLinearGradient(centerX + radius - 20, centerY - 15, centerX + radius, centerY + 15)
    pointerGradient.addColorStop(0, '#dc2626')
    pointerGradient.addColorStop(0.5, '#ef4444')
    pointerGradient.addColorStop(1, '#dc2626')
    
    ctx.fillStyle = pointerGradient
    ctx.fill()
    
    // Add border to pointer
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()
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
    
    // Update wheel data to start spinning
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      isSpinning: true,
      selectedResult: null
    })
    
    slowSpin()
  }, [data.isSpinning, totalTeams, updateWheelData, wheel?.id, data, slowSpin])

  // Memoize manual stop handler
  const handleManualStop = useCallback(() => {
    if (!data.isSpinning) return
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    const finalAngle = currentRotation % 360
    const segmentAngle = 360 / totalTeams
    // Calculate which segment the pointer is pointing to (pointer is at 3 o'clock = 0 degrees)
    // Since the wheel rotates clockwise and pointer is at 3 o'clock, we need to adjust the angle
    const normalizedAngle = (360 - finalAngle) % 360
    const selectedIndex = Math.floor(normalizedAngle / segmentAngle) % totalTeams
    const selectedTeam = teams[selectedIndex]
    
    // Update wheel data with result
    const updatedData = {
      ...data,
      selectedResult: selectedTeam,
      isSpinning: false,
      totalSpins: data.totalSpins + 1,
      recentResults: [selectedTeam, ...data.recentResults].slice(0, 10), // Keep last 10
      currentRotation: currentRotation
    }
    
    updateWheelData("mlb-wheel", wheel?.id || "", updatedData)
    
    if (settings.confettiSound?.enableSound) {
      createConfetti()
    }
    
    if (settings.confettiSound?.enableSound && !muted) {
      playSpinSound()
    }
    
    setShowResultsModal(true)
    
    if (onSpinCompleted) {
      onSpinCompleted()
    }
  }, [data.isSpinning, currentRotation, totalTeams, teams, data, updateWheelData, wheel?.id, settings.confettiSound?.enableSound, muted, createConfetti, playSpinSound, onSpinCompleted])

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

  // Show confetti when a spin finishes and a result is selected
  useEffect(() => {
    if (data.selectedResult && !data.isSpinning) {
      setShowConfetti(true)
      const timeout = setTimeout(() => setShowConfetti(false), 5000); // 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [data.selectedResult, data.isSpinning]);

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
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="cursor-pointer drop-shadow-lg bg-white rounded-full"
          onClick={!data.isSpinning ? handleSpin : undefined}
        />
        
        {/* Results Button */}
        <div className="absolute top-4 left-4">
          <Button variant="outline" size="sm" onClick={handleOpenResultsModal}>
            Results
          </Button>
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-md"
            title={settings.confettiSound?.enableSound ? (muted ? "Unmute" : "Mute") : "Global sound disabled"}
          >
            {!settings.confettiSound?.enableSound ? (
              <VolumeX className="w-5 h-5 text-gray-400" />
            ) : muted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div className="absolute bottom-4 right-4">
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-md">
            <Maximize2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Manual Stop Button */}
        {data.isSpinning && (
          <Button
            onClick={handleManualStop}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-red-500 hover:bg-red-600 text-white"
            size="sm"
          >
            STOP
          </Button>
        )}

        {/* Spinning indicator */}
        {data.isSpinning && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            Spinning...
          </div>
        )}
        
        <PickerResultsModal
          isOpen={showResultsModal}
          onClose={handleCloseResultsModal}
          results={modalResults}
        />
        
        <MLBTeamDetailsModal
          isOpen={showTeamDetailsModal}
          onClose={handleCloseTeamDetailsModal}
          team={data.selectedResult}
        />
      </div>

      {/* Result Display */}
      {data.selectedResult && !data.isSpinning && (
        <div className="text-center p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-2 border-blue-300 shadow-lg mb-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">⚾ Selected Team!</h3>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-4xl">{data.selectedResult.logo}</span>
            <div>
              <p className="text-2xl font-bold text-blue-900">{data.selectedResult.name}</p>
              <p className="text-sm text-blue-700">{data.selectedResult.city} • {data.selectedResult.league} League</p>
              <p className="text-xs text-blue-600">{data.selectedResult.championships} championships • Founded {data.selectedResult.founded}</p>
            </div>
          </div>
          <Button
            onClick={handleOpenTeamDetailsModal}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 border-blue-300 text-blue-700"
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

      {/* Spin Button */}
      <Button
        onClick={handleSpin}
        disabled={data.isSpinning || totalTeams === 0}
        className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {data.isSpinning ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Spinning...</span>
          </div>
        ) : (
          "⚾ SPIN THE WHEEL"
        )}
      </Button>

      {totalTeams === 0 && (
        <p className="mt-4 text-gray-500 text-center">Select some teams to start spinning!</p>
      )}

      {/* Game Mode Section */}
      <div className="mt-6 p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
        <label className="block text-sm font-semibold text-red-800 mb-3 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Game Mode
        </label>
        
        {/* Quick Input Field for Manual Mode */}
        {actionMode === "manual" && (
          <div className="flex items-center space-x-2 mb-3">
            <input
              value={manualTeamName}
              onChange={handleManualTeamNameChange}
              placeholder="Type team name..."
              className="flex-1 px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              onKeyDown={handleManualTeamNameKeyDown}
            />
            <Button
              onClick={handleAddManualTeam}
              disabled={!manualTeamName.trim()}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2">
          <label className={`flex flex-col items-center space-y-2 p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            actionMode === "normal" 
              ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25" 
              : "bg-white hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 border border-red-200 hover:border-red-300"
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
              actionMode === "normal" ? "bg-white/20" : "bg-red-100"
            }`}>
              <span className="text-sm">🎯</span>
            </div>
            <span className={`text-xs font-semibold ${actionMode === "normal" ? "text-white" : "text-red-700"}`}>
              Normal
            </span>
          </label>
          
          <label className={`flex flex-col items-center space-y-2 p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            actionMode === "elimination" 
              ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25" 
              : "bg-white hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 border border-red-200 hover:border-red-300"
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
              actionMode === "elimination" ? "bg-white/20" : "bg-red-100"
            }`}>
              <span className="text-sm">❌</span>
            </div>
            <span className={`text-xs font-semibold ${actionMode === "elimination" ? "text-white" : "text-red-700"}`}>
              Elimination
            </span>
          </label>
          
          <label className={`flex flex-col items-center space-y-2 p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
            actionMode === "manual" 
              ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25" 
              : "bg-white hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 border border-red-200 hover:border-red-300"
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
              actionMode === "manual" ? "bg-white/20" : "bg-red-100"
            }`}>
              <span className="text-sm">📝</span>
            </div>
            <span className={`text-xs font-semibold ${actionMode === "manual" ? "text-white" : "text-red-700"}`}>
              Manual
            </span>
          </label>
        </div>
        
        {/* Mode Description */}
        <div className="text-xs text-red-600 text-center mt-3 p-2 bg-red-50 rounded-lg">
          {actionMode === "normal" && "🎯 All teams available for each spin"}
          {actionMode === "elimination" && "❌ Selected team is removed after each spin"}
          {actionMode === "manual" && "📝 Add custom teams by typing names"}
        </div>
      </div>

      {/* Feature Buttons */}
      <div className="flex flex-wrap items-center gap-2 justify-center mt-6 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAchievements}
          className="text-xs px-3 py-1 bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
        >
          <Trophy className="w-3 h-3 mr-1" />
          Achievements ({totalPoints})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenThemeSelector}
          className="text-xs px-3 py-1 bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
        >
          <Palette className="w-3 h-3 mr-1" />
          Themes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAnalytics}
          className="text-xs px-3 py-1 bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
        >
          <BarChart3 className="w-3 h-3 mr-1" />
          Analytics
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSocialHub}
          className="text-xs px-3 py-1 bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
        >
          <Users className="w-3 h-3 mr-1" />
          Social
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenGameModes}
          className="text-xs px-3 py-1 bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
        >
          <Gamepad2 className="w-3 h-3 mr-1" />
          Games
        </Button>
      </div>

      {/* Total Spins Counter */}
      <div className="mt-4 text-sm text-gray-500">
        <span>Total spins: {data.totalSpins}</span>
      </div>
    </div>
  )
})

export default MLBWheelSection 