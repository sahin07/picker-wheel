"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Trophy,
  Palette,
  BarChart3,
  Users,
  Gamepad2,
} from "lucide-react"
import { useWheelManagerStore, MLBWheelData } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import PickerResultsModal from "./picker-results-modal"
import MLBTeamDetailsModal from "./mlb-team-details-modal"
import Confetti from "react-confetti"
import { createPortal } from "react-dom"
import { type MLBTeam } from "@/data/mlb-teams"
import {
  createSpinAudioController,
  type SpinAudioController,
} from "@/lib/wheel-spin-audio"
import {
  computeSpinEndRotation,
  computeSpinFrame,
  getSpinDurationMs,
  pickSegmentIndex,
} from "@/lib/wheel-spin-animation"

const WHEEL_SIZE = 680

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
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  showResultsButton?: boolean
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
  onAddManualTeam,
  isFullscreen = false,
  onToggleFullscreen,
  showResultsButton = false,
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
  const spinAudioRef = useRef<SpinAudioController | null>(null)
  const mutedRef = useRef(false)
  const [currentRotation, setCurrentRotation] = useState(data.currentRotation || 0)
  const animationRef = useRef<number | null>(null)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [muted, setMuted] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 800, height: 600 })
  const [manualTeamName, setManualTeamName] = useState("")

  mutedRef.current = muted
  const soundGloballyOff = settings.confettiSound?.enableSound === false

  // Clear stuck Spinning… if flag is true but no animation is running
  // (covers hydration restoring isSpinning after mount, and aborted spins)
  useEffect(() => {
    if (!data.isSpinning || !wheel?.id) return
    if (animationRef.current != null) return

    const t = window.setTimeout(() => {
      if (animationRef.current != null) return
      const { getCurrentWheel, updateWheelData: update } = useWheelManagerStore.getState()
      // Prefer this wheel by id under mlb-wheel tool (don't rely on currentTool timing)
      const state = useWheelManagerStore.getState()
      const mlbWheels = state.wheelsByTool["mlb-wheel"] || []
      const target = mlbWheels.find((w) => w.id === wheel.id) || getCurrentWheel()
      if (!target || !(target.data as MLBWheelData)?.isSpinning) return
      update("mlb-wheel", target.id, {
        ...target.data,
        isSpinning: false,
      })
    }, 50)

    return () => window.clearTimeout(t)
  }, [data.isSpinning, wheel?.id])

  // Client-side only rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // If a spin animation is aborted (unmount / navigation), never leave the button stuck
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      spinAudioRef.current?.stop()
      const state = useWheelManagerStore.getState()
      const mlbWheels = state.wheelsByTool["mlb-wheel"] || []
      for (const w of mlbWheels) {
        if ((w.data as MLBWheelData)?.isSpinning) {
          state.updateWheelData("mlb-wheel", w.id, {
            ...w.data,
            isSpinning: false,
          })
        }
      }
    }
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
    const duration = getSpinDurationMs(settings.spinBehavior?.spinningDuration)
    const speedLevel = settings.spinBehavior?.spinningSpeedLevel
    const startRotation = currentRotation
    const endRotation = computeSpinEndRotation(startRotation, {
      randomInitialAngle: settings.display?.randomInitialAngle,
    })
    const soundVolume = settings.confettiSound?.soundVolume || 0.5
    const soundOn =
      settings.confettiSound?.enableSound !== false && !mutedRef.current

    if (soundOn) {
      try {
        if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
        spinAudioRef.current.startWhoosh("/wheel-sound.mp3", soundVolume)
      } catch {
        // ignore
      }
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const { rotation: newRotation, done } = computeSpinFrame(
        startRotation,
        endRotation,
        elapsed,
        duration,
        speedLevel,
      )
      
      setCurrentRotation(newRotation)

      if (soundOn && totalTeams > 0) {
        try {
          if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
          spinAudioRef.current.syncFrame(newRotation, totalTeams, soundVolume, null)
        } catch {
          // ignore
        }
      }

      if (!done) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        spinAudioRef.current?.stop()
        animationRef.current = null

        const selectedIndex = pickSegmentIndex(newRotation, totalTeams)
        const selectedTeam = teams[selectedIndex]

        const fresh = useWheelManagerStore.getState().getCurrentWheel()
        const freshData = (fresh?.data as MLBWheelData) || data
        
        const updatedData = {
          ...freshData,
          selectedResult: selectedTeam,
          isSpinning: false,
          totalSpins: (freshData.totalSpins || 0) + 1,
          recentResults: [selectedTeam, ...(freshData.recentResults || [])].slice(0, 10),
          currentRotation: newRotation,
          spinRotation: newRotation,
        }
        
        updateWheelData("mlb-wheel", wheel?.id || "", updatedData)
        
        // Show confetti
        if (settings.confettiSound?.enableConfetti !== false) {
          setShowConfetti(true)
          window.setTimeout(() => setShowConfetti(false), 5000)
        }
        
        // Play win sound
        if (soundOn) {
          try {
            const audio = new Audio("/sound-win.mp3")
            audio.volume = soundVolume
            void audio.play()
          } catch {
            // ignore
          }
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
  }, [currentRotation, settings.spinBehavior?.spinningDuration, settings.spinBehavior?.spinningSpeedLevel, settings.display?.randomInitialAngle, settings.confettiSound?.enableSound, settings.confettiSound?.enableConfetti, settings.confettiSound?.soundVolume, totalTeams, teams, data, updateWheelData, wheel?.id, onSpinCompleted, actionMode, onEliminationMode])

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

      // Prefer team colors (Style tab palettes); fall back to active theme
      const colorIndex = index % themeColors.length
      let fillStyle = team.primaryColor || themeColors[colorIndex]
      
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
        ctx.shadowColor = fillStyle as string
        ctx.shadowBlur = 15
        ctx.strokeStyle = fillStyle as string
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.shadowBlur = 0
      }

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
    
    // Outer rim (no white stripe)
    ctx.strokeStyle = '#111827'
    ctx.lineWidth = 2
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
  }, [teams, data.displayMode, currentRotation, isClient, currentTheme, themes, totalTeams, adjustBrightness])

  // Draw wheel on mount and when dependencies change - optimized
  useEffect(() => {
    drawWheel()
  }, [drawWheel])

  // Keep a fixed square drawing buffer (680); CSS scales it responsively like other tools
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (canvas.width !== WHEEL_SIZE || canvas.height !== WHEEL_SIZE) {
      canvas.width = WHEEL_SIZE
      canvas.height = WHEEL_SIZE
    }
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
    spinAudioRef.current?.stop()
    
    const selectedIndex = pickSegmentIndex(currentRotation, totalTeams)
    const selectedTeam = teams[selectedIndex]
    
    const fresh = useWheelManagerStore.getState().getCurrentWheel()
    const freshData = (fresh?.data as MLBWheelData) || data

    // Update wheel data with result
    const updatedData = {
      ...freshData,
      selectedResult: selectedTeam,
      isSpinning: false,
      totalSpins: (freshData.totalSpins || 0) + 1,
      recentResults: [selectedTeam, ...(freshData.recentResults || [])].slice(0, 10), // Keep last 10
      currentRotation: currentRotation,
      spinRotation: currentRotation,
    }
    
    updateWheelData("mlb-wheel", wheel?.id || "", updatedData)
    
    if (settings.confettiSound?.enableConfetti !== false) {
      setShowConfetti(true)
      window.setTimeout(() => setShowConfetti(false), 5000)
    }
    
    if (settings.confettiSound?.enableSound !== false && !muted) {
      try {
        const audio = new Audio("/sound-win.mp3")
        audio.volume = settings.confettiSound?.soundVolume || 0.5
        void audio.play()
      } catch {
        // ignore
      }
    }
    
    setShowResultsModal(true)
    
    if (onSpinCompleted) {
      onSpinCompleted()
    }
  }, [data.isSpinning, currentRotation, totalTeams, teams, data, updateWheelData, wheel?.id, settings.confettiSound?.enableConfetti, settings.confettiSound?.enableSound, settings.confettiSound?.soundVolume, muted, onSpinCompleted])

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

  useEffect(() => {
    const openResults = () => setShowResultsModal(true)
    window.addEventListener("open-mlb-results", openResults)
    return () => window.removeEventListener("open-mlb-results", openResults)
  }, [])

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
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center space-y-4 overflow-auto bg-white p-3 sm:space-y-6 sm:p-4"
          : "relative flex w-full min-w-0 max-w-full flex-col items-center space-y-4 sm:space-y-6"
      }
    >
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

      {showResultsButton && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleOpenResultsModal}
          className="absolute left-2 top-2 z-10 border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50 sm:left-4 sm:top-4 sm:px-3"
        >
          Results
          {data.recentResults.length > 0 && (
            <span className="ml-2 rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-700">
              {data.recentResults.length}
            </span>
          )}
        </Button>
      )}
      
      <div className="relative mx-auto flex w-full max-w-[680px] flex-col items-center">
        <div
          className={`relative w-full max-w-[680px] overflow-visible ${
            !data.isSpinning && totalTeams > 0 ? "cursor-pointer" : ""
          }`}
          onClick={!data.isSpinning && totalTeams > 0 ? handleSpin : undefined}
        >
          <canvas
            ref={canvasRef}
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            className="aspect-square h-auto w-full max-w-full drop-shadow-lg rounded-full"
          />

          <div className="absolute bottom-2 left-2 z-20 flex flex-col space-y-2 sm:bottom-4 sm:left-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleMute()
              }}
              className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white sm:h-10 sm:w-10"
              title={
                soundGloballyOff
                  ? "Global sound disabled"
                  : muted
                    ? "Unmute"
                    : "Mute"
              }
            >
              {soundGloballyOff || muted ? (
                <VolumeX className={`h-5 w-5 ${soundGloballyOff ? "text-gray-400" : ""}`} />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            {onToggleFullscreen && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFullscreen()
                }}
                className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white sm:h-10 sm:w-10"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            )}
          </div>

          {data.isSpinning && (
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleManualStop()
              }}
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white hover:bg-red-600"
              size="sm"
            >
              STOP
            </Button>
          )}

          {data.isSpinning && (
            <div className="absolute right-2 top-2 z-20 animate-pulse rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
              Spinning...
            </div>
          )}
        </div>
        
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
        <div className="mb-2 w-full max-w-md rounded-xl border-2 border-blue-300 bg-gradient-to-r from-blue-100 to-purple-100 p-4 text-center shadow-lg sm:mb-4 sm:p-6">
          <h3 className="mb-2 text-base font-semibold text-blue-800 sm:text-lg">⚾ Selected Team!</h3>
          <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4 sm:gap-3">
            <span className="text-3xl sm:text-4xl">{data.selectedResult.logo}</span>
            <div className="min-w-0 text-left">
              <p className="truncate text-xl font-bold text-blue-900 sm:text-2xl">{data.selectedResult.name}</p>
              <p className="text-xs text-blue-700 sm:text-sm">{data.selectedResult.city} • {data.selectedResult.league} League</p>
              <p className="text-[11px] text-blue-600 sm:text-xs">{data.selectedResult.championships} championships • Founded {data.selectedResult.founded}</p>
            </div>
          </div>
          <Button
            onClick={handleOpenTeamDetailsModal}
            variant="outline"
            size="sm"
            className="border-blue-300 bg-white text-blue-700 hover:bg-gray-50"
          >
            📊 View Team Details
          </Button>
        </div>
      )}

      {/* Game Mode Indicator */}
      {isGameActive && currentGameMode && (
        <div className="mb-2 w-full max-w-md rounded-lg border-2 border-purple-300 bg-gradient-to-r from-purple-100 to-pink-100 p-2.5 sm:mb-4 sm:p-3">
          <p className="text-xs font-semibold text-purple-800 sm:text-sm">
            🎮 Playing: {currentGameMode}
          </p>
        </div>
      )}

      {/* Spin Button */}
      <Button
        onClick={handleSpin}
        disabled={data.isSpinning || totalTeams === 0}
        className="w-full max-w-sm bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl sm:px-12 sm:text-lg"
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
      <div className="mt-4 w-full max-w-md rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-3 sm:mt-6 sm:p-4">
        <label className="mb-2 flex items-center text-sm font-semibold text-red-800 sm:mb-3">
          <span className="mr-2 h-2 w-2 rounded-full bg-red-500"></span>
          Game Mode
        </label>
        
        {/* Quick Input Field for Manual Mode */}
        {actionMode === "manual" && (
          <div className="mb-3 flex min-w-0 items-center gap-2">
            <input
              value={manualTeamName}
              onChange={handleManualTeamNameChange}
              placeholder="Type team name..."
              className="min-w-0 flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
              onKeyDown={handleManualTeamNameKeyDown}
            />
            <Button
              onClick={handleAddManualTeam}
              disabled={!manualTeamName.trim()}
              size="sm"
              className="shrink-0 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <label className={`flex cursor-pointer flex-col items-center space-y-1 rounded-lg p-2 transition-all duration-200 sm:space-y-2 sm:p-3 ${
            actionMode === "normal" 
              ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25" 
              : "border border-red-200 bg-white hover:border-red-300 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50"
          }`}>
            <input
              type="radio"
              name="actionMode"
              value="normal"
              checked={actionMode === "normal"}
              onChange={handleActionModeChange}
              className="sr-only"
            />
            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
              actionMode === "normal" ? "bg-white/20" : "bg-red-100"
            }`}>
              <span className="text-sm">🎯</span>
            </div>
            <span className={`text-[10px] font-semibold sm:text-xs ${actionMode === "normal" ? "text-white" : "text-red-700"}`}>
              Normal
            </span>
          </label>
          
          <label className={`flex cursor-pointer flex-col items-center space-y-1 rounded-lg p-2 transition-all duration-200 sm:space-y-2 sm:p-3 ${
            actionMode === "elimination" 
              ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25" 
              : "border border-red-200 bg-white hover:border-red-300 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50"
          }`}>
            <input
              type="radio"
              name="actionMode"
              value="elimination"
              checked={actionMode === "elimination"}
              onChange={handleActionModeChange}
              className="sr-only"
            />
            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
              actionMode === "elimination" ? "bg-white/20" : "bg-red-100"
            }`}>
              <span className="text-sm">❌</span>
            </div>
            <span className={`text-[10px] font-semibold sm:text-xs ${actionMode === "elimination" ? "text-white" : "text-red-700"}`}>
              Elimination
            </span>
          </label>
          
          <label className={`flex cursor-pointer flex-col items-center space-y-1 rounded-lg p-2 transition-all duration-200 sm:space-y-2 sm:p-3 ${
            actionMode === "manual" 
              ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25" 
              : "border border-red-200 bg-white hover:border-red-300 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50"
          }`}>
            <input
              type="radio"
              name="actionMode"
              value="manual"
              checked={actionMode === "manual"}
              onChange={handleActionModeChange}
              className="sr-only"
            />
            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
              actionMode === "manual" ? "bg-white/20" : "bg-red-100"
            }`}>
              <span className="text-sm">📝</span>
            </div>
            <span className={`text-[10px] font-semibold sm:text-xs ${actionMode === "manual" ? "text-white" : "text-red-700"}`}>
              Manual
            </span>
          </label>
        </div>
        
        {/* Mode Description */}
        <div className="mt-2 rounded-lg bg-red-50 p-2 text-center text-[11px] text-red-600 sm:mt-3 sm:text-xs">
          {actionMode === "normal" && "🎯 All teams available for each spin"}
          {actionMode === "elimination" && "❌ Selected team is removed after each spin"}
          {actionMode === "manual" && "📝 Add custom teams by typing names"}
        </div>
      </div>

      {/* Feature Buttons */}
      <div className="mb-2 mt-4 grid w-full grid-cols-5 gap-1.5 sm:mb-4 sm:mt-6 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAchievements}
          className="h-auto min-w-0 border-yellow-300 bg-yellow-50 px-1.5 py-1.5 text-[10px] text-yellow-700 hover:bg-yellow-100 sm:px-2 sm:text-xs"
        >
          <Trophy className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Achievements ({totalPoints})</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenThemeSelector}
          className="h-auto min-w-0 border-purple-300 bg-purple-50 px-1.5 py-1.5 text-[10px] text-purple-700 hover:bg-purple-100 sm:px-2 sm:text-xs"
        >
          <Palette className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Themes</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAnalytics}
          className="h-auto min-w-0 border-green-300 bg-green-50 px-1.5 py-1.5 text-[10px] text-green-700 hover:bg-green-100 sm:px-2 sm:text-xs"
        >
          <BarChart3 className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Analytics</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSocialHub}
          className="h-auto min-w-0 border-orange-300 bg-orange-50 px-1.5 py-1.5 text-[10px] text-orange-700 hover:bg-orange-100 sm:px-2 sm:text-xs"
        >
          <Users className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Social</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenGameModes}
          className="h-auto min-w-0 border-red-300 bg-red-50 px-1.5 py-1.5 text-[10px] text-red-700 hover:bg-red-100 sm:px-2 sm:text-xs"
        >
          <Gamepad2 className="mr-0.5 h-3 w-3 shrink-0 sm:mr-1" />
          <span className="truncate">Games</span>
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