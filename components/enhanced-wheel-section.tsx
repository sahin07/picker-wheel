"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, RotateCcw, Trophy, Palette, BarChart3, Users, Gamepad2, Settings, Maximize, Minimize } from "lucide-react"
import { useEnhancedWheelStore } from "@/stores/enhanced-wheel-store"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import Confetti from "react-confetti";
import { Badge } from "@/components/ui/badge"
import { WheelCustomization } from '@/lib/picker-wheel-customization'
import { createSpinAudioController, type SpinAudioController } from '@/lib/wheel-spin-audio'

const WHEEL_SIZE = 680
const defaultWheelFallbackColors = ["#4ade80", "#fbbf24", "#f97316", "#84cc16", "#eab308", "#22c55e"]

interface EnhancedWheelSectionProps {
  onOpenAchievements?: () => void
  onOpenThemeSelector?: () => void
  onOpenAnalytics?: () => void
  onOpenSocialHub?: () => void
  onOpenGameModes?: () => void
  onOpenCustomization?: () => void
  customization?: WheelCustomization
  totalPoints?: number
  currentTheme?: string
  themes?: any[]
  spinHistory?: any[]
  currentUser?: any
  isGameActive?: boolean
  currentGameMode?: string
  onSpinCompleted?: () => void
  onConfettiChange?: (show: boolean) => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export default function EnhancedWheelSection({ 
  onOpenAchievements, 
  onOpenThemeSelector, 
  onOpenAnalytics, 
  onOpenSocialHub, 
  onOpenGameModes, 
  onOpenCustomization,
  customization,
  totalPoints, 
  currentTheme = 'classic',
  themes = [],
  spinHistory = [],
  currentUser,
  isGameActive = false,
  currentGameMode,
  onSpinCompleted,
  isFullscreen = false,
  onToggleFullscreen,
  onConfettiChange
}: EnhancedWheelSectionProps = {}) {
  // All hooks at the top, unconditionally
  const {
    isSpinning,
    selectedResult,
    spinRotation,
    setIsSpinning,
    setSpinRotation,
    setSelectedResult,
    incrementSpinCount,
    getTotalSpins,
    syncWithCurrentWheel,
    forceUpdate,
    subscribeToWheelManager,
    getCurrentWheelData,
    updateCurrentWheelData,
    removeOptionsByIds,
  } = useEnhancedWheelStore();
  const { getCurrentWheel, currentTool, currentWheelId } = useWheelManagerStore();
  const wheelOptionsFromStore = useWheelManagerStore((state) => {
    const tool = state.currentTool
    const wheels = state.wheelsByTool[tool] || []
    const wheel = wheels.find((w) => w.id === state.currentWheelId) || wheels[0]
    if (!wheel) return null
    if (tool === "picker-wheel") return (wheel.data as any)?.options ?? null
    if (tool === "country-wheel") return (wheel.data as any)?.selectedCountries ?? null
    if (tool === "state-wheel") return (wheel.data as any)?.selectedStates ?? null
    return null
  })
  const { settings } = useSettingsStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const currentRotationRef = useRef(0);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
  const [confetti, setConfetti] = useState<
    Array<{ x: number; y: number; color: string; velocity: { x: number; y: number } }>
  >([]);
  const animationRef = useRef<number | null>(null);
  const confettiRef = useRef<number | null>(null);
  const spinAudioRef = useRef<SpinAudioController | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mysteryResultRevealed, setMysteryResultRevealed] = useState(false);

  const shouldCelebrateResultRef = useRef(false);
  const optionsRef = useRef<any[]>([])
  const settingsRef = useRef(settings)
  const finishSpinRef = useRef<(result: any) => void>(() => {})
  const spinTokenRef = useRef(0)
  const winnerBlinkRef = useRef<number | null>(null)
  const winnerBlinkPhaseRef = useRef(0)
  const selectedResultRef = useRef<any>(null)
  /** Exact slice index under the pointer — never match by name (duplicates would all blink). */
  const winningIndexRef = useRef<number | null>(null)

  // All logic and variables that depend on hooks go here
  const wheel = getCurrentWheel();
  const rawOptions = useMemo(() => {
    if (!Array.isArray(wheelOptionsFromStore)) return [] as any[]
    return wheelOptionsFromStore as any[]
  }, [wheelOptionsFromStore])

  const options = useMemo(() => {
    if (currentTool !== "picker-wheel") return rawOptions
    return rawOptions.filter((o: any) => o && o.enabled !== false && String(o.name || "").trim())
  }, [rawOptions, currentTool])

  optionsRef.current = options
  settingsRef.current = settings
  selectedResultRef.current = selectedResult

  const optionsDrawKey = useMemo(
    () =>
      options
        .map((o: any) => `${o.id}:${o.name}:${o.weight ?? 1}:${o.color ?? ""}:${o.image ? "1" : "0"}`)
        .join("|"),
    [options],
  )

  const totalSpins = getTotalSpins();

  // Use useEffect to set client-side rendering after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync with current wheel when switching wheels
  useEffect(() => {
    if (currentWheelId) {
      shouldCelebrateResultRef.current = false
      winningIndexRef.current = null
      stopSpinSound()
      setShowConfetti(false)
      onConfettiChange?.(false)
      setConfetti([])
      syncWithCurrentWheel()
      forceUpdate()
      subscribeToWheelManager()
    }
  }, [currentWheelId, syncWithCurrentWheel, forceUpdate, subscribeToWheelManager, onConfettiChange])

  // Initial spinning effect
  useEffect(() => {
    if (!isClient) return; // Skip if not on client
    
    if (settings.display.initialSpinning && !isSpinning && !selectedResult && totalSpins > 0) {
      const slowSpin = () => {
        setCurrentRotation((prev) => {
          const next = (prev + 0.5) % 360
          currentRotationRef.current = next
          return next
        })
        animationRef.current = requestAnimationFrame(slowSpin)
      }
      animationRef.current = requestAnimationFrame(slowSpin)
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else {
      // Stop the initial spinning if there's a result or if spinning
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [settings.display.initialSpinning, currentWheelId, isSpinning, selectedResult, totalSpins, isClient])

  // Preload images
  useEffect(() => {
    if (!isClient) return; // Skip if not on client
    
    const imageMap = new Map<string, HTMLImageElement>()
    const imagePromises = options
      .filter((option) => option.image || option.flag)
      .map((option) => {
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            imageMap.set(option.id, img)
            resolve()
          }
          img.onerror = () => resolve()
          img.src = option.image || option.flag!
        })
      })

    Promise.all(imagePromises).then(() => {
      setLoadedImages(imageMap)
    })
  }, [options, currentWheelId, isClient])

  const getSpinAudio = () => {
    if (!spinAudioRef.current) {
      spinAudioRef.current = createSpinAudioController()
    }
    return spinAudioRef.current
  }

  const playSpinSound = () => {
    if (!settings.confettiSound.enableSound || muted) return

    try {
      getSpinAudio().startWhoosh("/wheel-sound.mp3", settings.confettiSound.soundVolume || 0.5)
    } catch {
      console.log("Audio not supported")
    }
  }

  const stopSpinSound = () => {
    spinAudioRef.current?.stop()
  }

  // Spinning animation (visual only — winner is applied when this lands on spinRotation)
  useEffect(() => {
    if (!isClient) return
    if (!isSpinning || spinRotation === null) return

    const token = spinTokenRef.current
    const startTime = Date.now()
    const duration = settingsRef.current.spinBehavior.spinningDuration * 1000
    const startRotation = currentRotationRef.current
    const targetRotation = spinRotation
    const speedMultiplier = settingsRef.current.spinBehavior.spinningSpeedLevel / 5
    const soundEnabled = settingsRef.current.confettiSound.enableSound && !muted
    const userVolume = settingsRef.current.confettiSound.soundVolume || 0.5
    const spinAudio = soundEnabled ? getSpinAudio() : null

    const animate = () => {
      if (token !== spinTokenRef.current) return

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 2 + speedMultiplier)
      const rotation = startRotation + (targetRotation - startRotation) * easeOut

      currentRotationRef.current = rotation
      drawWheel(rotation)

      const opts = optionsRef.current
      if (spinAudio && opts.length > 0) {
        const currentData = getCurrentWheelData()
        const smartWeights = currentData.smartWeights || []
        spinAudio.syncFrame(
          rotation,
          opts.length,
          userVolume,
          smartWeights.length === opts.length ? smartWeights : null,
        )
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Exact final frame — must match the angle used for the winner
      currentRotationRef.current = targetRotation
      setCurrentRotation(targetRotation)
      drawWheel(targetRotation)
      stopSpinSound()
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isSpinning, spinRotation, muted, isClient])

  // Show confetti and play sound only after a spin completes (not on wheel switch / page load)
  useEffect(() => {
    if (!isClient) return;

    if (selectedResult && !isSpinning && shouldCelebrateResultRef.current) {
      shouldCelebrateResultRef.current = false
      setShowConfetti(true);
      onConfettiChange?.(true);
      if (settings.confettiSound?.enableSound && !muted) {
        const audio = new Audio("/sound-win.mp3");
        audio.volume = settings.confettiSound.soundVolume || 0.5;
        audio.play().catch((error) => {
          console.error('Error playing sound:', error);
        });
      }
    }
  }, [selectedResult, isSpinning, settings.confettiSound?.enableSound, settings.confettiSound?.soundVolume, muted, isClient, onConfettiChange]);

  // Blink the winning slice so the pointed result is obvious
  useEffect(() => {
    if (!isClient) return
    if (winnerBlinkRef.current) {
      cancelAnimationFrame(winnerBlinkRef.current)
      winnerBlinkRef.current = null
    }

    if (!selectedResult || isSpinning) {
      if (isSpinning) winningIndexRef.current = null
      winnerBlinkPhaseRef.current = 0
      return
    }

    const started = Date.now()
    const tick = () => {
      const elapsed = Date.now() - started
      winnerBlinkPhaseRef.current = elapsed
      drawWheel(currentRotationRef.current)
      if (elapsed < 4500) {
        winnerBlinkRef.current = requestAnimationFrame(tick)
      } else {
        // Keep a soft steady highlight after blink burst
        winnerBlinkPhaseRef.current = -1
        drawWheel(currentRotationRef.current)
      }
    }
    winnerBlinkRef.current = requestAnimationFrame(tick)

    return () => {
      if (winnerBlinkRef.current) {
        cancelAnimationFrame(winnerBlinkRef.current)
        winnerBlinkRef.current = null
      }
    }
  }, [selectedResult, isSpinning, isClient])

  // Confetti effect
  useEffect(() => {
    if (!isClient) return;

    if (selectedResult && !isSpinning && showConfetti && settings.confettiSound.enableConfetti) {
      createConfetti()
    }
  }, [selectedResult, isSpinning, showConfetti, settings.confettiSound.enableConfetti, isClient])

  // Draw wheel effect — avoid currentRotation/confetti deps (those caused frame-by-frame React work)
  useEffect(() => {
    if (!isClient) return
    drawWheel()
  }, [optionsDrawKey, loadedImages, settings, currentWheelId, currentTheme, themes, customization, isClient])

  // Keep ref in sync when rotation state is set outside the animation loop
  useEffect(() => {
    currentRotationRef.current = currentRotation
  }, [currentRotation])

  // Show loading state during SSR and initial client render
  if (!isClient) {
    return <div className="flex flex-col items-center" style={{ height: WHEEL_SIZE + 50 }} />;
  }

  const createConfetti = () => {
    const colors = settings.appearance.toolColors
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * WHEEL_SIZE,
      y: Math.random() * WHEEL_SIZE,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * -10 - 5,
      },
    }))

    setConfetti(newConfetti)

    const animateConfetti = () => {
      setConfetti((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            velocity: {
              x: particle.velocity.x * 0.99,
              y: particle.velocity.y + 0.3,
            },
          }))
          .filter((particle) => particle.y < 500),
      )

      if (confetti.length > 0) {
        confettiRef.current = requestAnimationFrame(animateConfetti)
      }
    }

    confettiRef.current = requestAnimationFrame(animateConfetti)

    setTimeout(() => {
      setConfetti([])
      setShowConfetti(false)
      onConfettiChange?.(false)
      if (confettiRef.current) {
        cancelAnimationFrame(confettiRef.current)
      }
    }, 6000)
  }

  const drawWheel = (rotationOverride?: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const wheelSize = WHEEL_SIZE
    const radius = (wheelSize / 2) - 20
    const rotation =
      typeof rotationOverride === "number" ? rotationOverride : currentRotationRef.current

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((rotation * Math.PI) / 180)

    const liveOptions = optionsRef.current?.length ? optionsRef.current : options
    const liveSettings = settingsRef.current || settings

    if (liveOptions.length === 0) {
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, 2 * Math.PI)
      ctx.fillStyle = "#e5e7eb"
      ctx.fill()
      ctx.strokeStyle = "#9ca3af"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()
      return
    }

    // Get smart weights if available; otherwise use per-option weight
    const currentData = getCurrentWheelData()
    const smartWeights = currentData.smartWeights || []
    const hasSmartWeights = smartWeights.length === liveOptions.length && smartWeights.length > 0
    const optionWeights = liveOptions.map((o: any) => Math.max(1, o.weight ?? 1))
    const hasOptionWeights = optionWeights.some((w: number) => w !== 1)

    // Calculate segment angles with smart weighting or per-option weight
    let segmentAngles: number[] = []
    if (hasSmartWeights) {
      const totalWeight = smartWeights.reduce((sum: number, weight: any) => sum + weight.weight, 0)
      segmentAngles = smartWeights.map((weight: any) => (weight.weight / totalWeight) * 2 * Math.PI)
    } else if (hasOptionWeights || currentTool === "picker-wheel") {
      const totalWeight = optionWeights.reduce((sum: number, w: number) => sum + w, 0) || 1
      segmentAngles = optionWeights.map((w: number) => (w / totalWeight) * 2 * Math.PI)
    } else {
      const anglePerSegment = (2 * Math.PI) / liveOptions.length
      segmentAngles = liveOptions.map(() => anglePerSegment)
    }

    const displayOptions = liveSettings.spinBehavior.mysterySpin
      ? liveOptions.map((opt) => ({ ...opt, name: "?" }))
      : liveOptions

    // Theme colors only when not on a Style "custom" palette
    const selectedTheme = themes.find((t) => t.id === currentTheme)
    const themeColors =
      currentTheme && currentTheme !== "custom" && selectedTheme?.colors?.length
        ? selectedTheme.colors
        : []
    const toolColors = liveSettings.appearance?.toolColors?.length
      ? liveSettings.appearance.toolColors
      : defaultWheelFallbackColors

    let currentAngle = -Math.PI / 2 // Start from top
    displayOptions.forEach((option, index) => {
      const startAngle = currentAngle
      const endAngle = startAngle + segmentAngles[index]

      // Style tab sets option.color + toolColors; prefer those over theme
      const segmentColor =
        option.color ||
        toolColors[index % toolColors.length] ||
        (themeColors.length > 0 ? themeColors[index % themeColors.length] : null) ||
        "#4ade80"

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = segmentColor
      ctx.fill()

      const isWinningSlice =
        !isSpinning &&
        winningIndexRef.current !== null &&
        winningIndexRef.current === index

      if (isWinningSlice) {
        const phase = winnerBlinkPhaseRef.current
        const pulse =
          phase < 0
            ? 0.35
            : 0.2 + 0.45 * (0.5 + 0.5 * Math.sin((phase / 1000) * Math.PI * 4.4))
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`
        ctx.fill()
        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = (customization?.wheel.borderWidth || 4) + 4
        ctx.stroke()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()
      } else {
        const borderWidth = customization?.wheel.borderWidth || 4
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = borderWidth
        ctx.stroke()
      }

      ctx.save()
      ctx.rotate(startAngle + segmentAngles[index] / 2)

      // Use image fallback: option.image or option.flag
      const imageSrc = option.image || option.flag || null
      const image = imageSrc ? loadedImages.get(option.id) : null
      if (image && imageSrc && !settings.spinBehavior.mysterySpin) {
        const imageRadius = radius * 0.6
        const imageSize = Math.min(imageRadius * 1.0, 80)
        const imageX = imageRadius - imageSize / 2
        const imageY = -imageSize / 2 - 10

        ctx.save()
        ctx.beginPath()
        ctx.roundRect(imageX, imageY, imageSize, imageSize, 8)
        ctx.clip()
        ctx.drawImage(image, imageX, imageY, imageSize, imageSize)
        ctx.restore()

        if (option.name && !settings.spinBehavior.mysterySpin) {
          const fontSize = customization?.fonts.size.labels || 11
          const fontFamily = customization?.fonts.family || 'Arial, sans-serif'
          const fontWeight = customization?.fonts.weight || 'bold'
          
          ctx.fillStyle = "#000000"
          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
          ctx.textAlign = "center"
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 3

          const displayText = option.name.length > 12 ? option.name.substring(0, 12) + "..." : option.name
          ctx.strokeText(displayText, imageX + imageSize / 2, imageY + imageSize + 20)
          ctx.fillText(displayText, imageX + imageSize / 2, imageY + imageSize + 20)
        }
      } else {
        const fontSize = customization?.fonts.size.wheel || 16
        const fontFamily = customization?.fonts.family || 'Arial, sans-serif'
        const fontWeight = customization?.fonts.weight || 'bold'
        
        ctx.textAlign = "center"
        ctx.fillStyle = "#000000"
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 3
        ctx.strokeText(option.name, radius * 0.7, 5)
        ctx.fillText(option.name, radius * 0.7, 5)
      }

      ctx.restore()
      
      // Update current angle for next segment
      currentAngle = endAngle
    })

    ctx.restore()

    const centerSize = settings.display.spinButtonAnimation && isSpinning ? 45 : 40
    ctx.beginPath()
    ctx.arc(centerX, centerY, centerSize, 0, 2 * Math.PI)
    ctx.fillStyle = settings.display.spinButtonAnimation && isSpinning ? "#059669" : "#1f2937"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 4
    ctx.stroke()

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("SPIN", centerX, centerY + 6)

    ctx.beginPath()
    ctx.moveTo(centerX + radius - 30, centerY)
    ctx.lineTo(centerX + radius - 5, centerY - 15)
    ctx.lineTo(centerX + radius - 5, centerY + 15)
    ctx.closePath()
    ctx.fillStyle = "#dc2626"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.stroke()

    confetti.forEach((particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, 3, 0, 2 * Math.PI)
      ctx.fillStyle = particle.color
      ctx.fill()
    })
  }

  const finishSpinResult = (result: any, winningIndex: number) => {
    shouldCelebrateResultRef.current = true
    setMysteryResultRevealed(false)
    winningIndexRef.current = winningIndex
    setSelectedResult(result)
    setIsSpinning(false)
    incrementSpinCount()
    appendSpinResult(result)

    if (settings.spinBehavior.removeWinnerAfterSpin && result?.id) {
      removeOptionsByIds([result.id])
    }

    if (isGameActive && onSpinCompleted) {
      setTimeout(() => {
        onSpinCompleted()
      }, 100)
    }
  }
  finishSpinRef.current = finishSpinResult

  const resolveResultFromRotation = (rotationDeg: number, opts: any[]) => {
    if (!opts.length) return null
    const normalizedRotation = ((rotationDeg % 360) + 360) % 360
    const angleUnderPointer = (360 - normalizedRotation) % 360
    const adjustedAngleForSegments = (angleUnderPointer + 90) % 360

    const currentData = getCurrentWheelData()
    const smartWeights = currentData.smartWeights || []
    const hasSmartWeights = smartWeights.length === opts.length && smartWeights.length > 0
    const optionWeights = opts.map((o: any) => Math.max(1, o.weight ?? 1))

    let selectedIndex = 0
    if (hasSmartWeights) {
      const totalWeight = smartWeights.reduce((sum: number, weight: any) => sum + weight.weight, 0) || 1
      const segmentAngles = smartWeights.map((weight: any) => (weight.weight / totalWeight) * 360)
      let currentAngle = 0
      for (let i = 0; i < segmentAngles.length; i++) {
        const endAngle = currentAngle + segmentAngles[i]
        if (adjustedAngleForSegments >= currentAngle && adjustedAngleForSegments < endAngle) {
          selectedIndex = i
          break
        }
        currentAngle = endAngle
      }
    } else {
      const totalWeight = optionWeights.reduce((sum: number, w: number) => sum + w, 0) || 1
      const segmentAngles = optionWeights.map((w: number) => (w / totalWeight) * 360)
      let currentAngle = 0
      for (let i = 0; i < segmentAngles.length; i++) {
        const endAngle = currentAngle + segmentAngles[i]
        if (adjustedAngleForSegments >= currentAngle && adjustedAngleForSegments < endAngle) {
          selectedIndex = i
          break
        }
        currentAngle = endAngle
      }
    }

    return { result: opts[selectedIndex] ?? opts[0], index: selectedIndex }
  }

  const lockWheelAtRotation = (finalRotation: number) => {
    spinTokenRef.current += 1
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    currentRotationRef.current = finalRotation
    setCurrentRotation(finalRotation)
    drawWheel(finalRotation)
  }

  const handleSpin = () => {
    if (options.length === 0 || isSpinning) return

    spinTokenRef.current += 1
    winningIndexRef.current = null
    setIsSpinning(true)
    setSelectedResult(null)
    setMysteryResultRevealed(false)
    shouldCelebrateResultRef.current = false

    const baseRotation = settings.display.randomInitialAngle ? Math.random() * 360 : 0
    const fixedSpins = 10
    const finalRotation = currentRotationRef.current + baseRotation + fixedSpins * 360 + Math.random() * 360

    setSpinRotation(finalRotation)

    if (settings.confettiSound.enableSound && !muted) {
      playSpinSound()
    }

    const durationMs = settings.spinBehavior.spinningDuration * 1000
    window.setTimeout(() => {
      stopSpinSound()
      // Snap to the exact final angle BEFORE reading the winner / ending the spin.
      // Previously the timeout fired slightly before the RAF animation finished and
      // setIsSpinning(false) cancelled the animation mid-flight, leaving the pointer
      // on a different slice than the announced result.
      lockWheelAtRotation(finalRotation)
      const resolved = resolveResultFromRotation(finalRotation, optionsRef.current)
      if (resolved?.result) finishSpinResult(resolved.result, resolved.index)
    }, durationMs)
  }

  const appendSpinResult = (result: any) => {
    const currentData = getCurrentWheelData()
    const currentWheel = getCurrentWheel()
    const prevResults = currentData.recentResults || []
    const resultWithTimestamp = {
      ...result,
      timestamp: Date.now(),
      id: `${result.id || result.name}-${Date.now()}`,
      wheelId: currentWheel?.id,
      wheelName: currentWheel?.name,
    }
    const newResults = [...prevResults, resultWithTimestamp]
    updateCurrentWheelData((data: any) => ({
      ...data,
      recentResults: newResults,
      selectedResult: result,
    }))
  }

  const handleManualStop = () => {
    if (settings.spinBehavior.manuallyStop && isSpinning) {
      shouldCelebrateResultRef.current = false
      stopSpinSound()
      const stoppedAt = currentRotationRef.current
      lockWheelAtRotation(stoppedAt)
      const resolved = resolveResultFromRotation(stoppedAt, optionsRef.current)
      if (resolved?.result) finishSpinResult(resolved.result, resolved.index)
    }
  }
  return (
    <div className="flex flex-col items-center space-y-8 overflow-visible">
        <div className="relative mb-4 overflow-visible">
        <canvas
          ref={canvasRef}
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          className="cursor-pointer drop-shadow-lg max-w-full h-auto"
          style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
          onClick={!isSpinning ? handleSpin : handleManualStop}
        />


        <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMuted((m) => !m)}
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
          {onToggleFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
              className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-md"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </Button>
          )}
        </div>

        {isSpinning && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            {settings.spinBehavior.manuallyStop ? "Click to Stop!" : "Spinning..."}
          </div>
        )}
      </div>

      {selectedResult && !isSpinning && (
        <div
          className={`text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300 shadow-lg ${
            settings.spinBehavior.mysteryResult && !mysteryResultRevealed ? "cursor-pointer" : ""
          }`}
          onClick={() => {
            if (settings.spinBehavior.mysteryResult && !mysteryResultRevealed) {
              setMysteryResultRevealed(true)
            }
          }}
        >
          <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Winner!</h3>
          <div className="flex items-center justify-center space-x-3">
            {selectedResult.image && !settings.spinBehavior.mysteryResult && (
              <img
                src={selectedResult.image || "/placeholder.svg"}
                alt={selectedResult.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
              />
            )}
            <p className="text-2xl font-bold text-green-900">
              {settings.spinBehavior.mysteryResult && !mysteryResultRevealed ? "?" : selectedResult.name}
            </p>
          </div>
          {settings.spinBehavior.mysteryResult && !mysteryResultRevealed && (
            <p className="text-xs text-green-700 mt-2">Click to reveal result</p>
          )}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {isGameActive && currentGameMode && (
          <div className="flex items-center justify-center gap-2 p-2 bg-purple-100 border border-purple-300 rounded-lg">
            <Gamepad2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              Playing: {currentGameMode}
            </span>
          </div>
        )}
        
        <Button
          onClick={handleSpin}
          disabled={isSpinning || options.length === 0}
          className={`px-12 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
            settings.display.spinButtonAnimation
              ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 animate-pulse"
              : "bg-green-600 hover:bg-green-700"
          } text-white`}
        >
          {isSpinning ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{settings.spinBehavior.manuallyStop ? "Click Wheel to Stop" : "Spinning..."}</span>
            </div>
          ) : (
            "🎯 SPIN THE WHEEL"
          )}
        </Button>
      </div>

      {options.length === 0 && <p className="mt-4 text-gray-500 text-center">Add some options to start spinning!</p>}

      {settings.display.showSpinCount && (
        <div className="mt-4 text-sm text-gray-500 flex items-center space-x-2">
          <span>Total spin = {totalSpins}</span>
          <RotateCcw className="w-4 h-4" />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        
        {onOpenThemeSelector && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenThemeSelector}
            className="relative text-xs px-3 py-1 border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600"
          >
            <Palette className="w-4 h-4 mr-2" />
            <span>Themes</span>
            {themes.filter(t => t.unlocked).length > 3 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {themes.filter(t => t.unlocked).length}
              </Badge>
            )}
          </Button>
        )}
        
        {onOpenAnalytics && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenAnalytics}
            className="relative text-xs px-3 py-1 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            <span>Analytics</span>
            {spinHistory.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {spinHistory.length}
              </Badge>
            )}
          </Button>
        )}
        
        {onOpenSocialHub && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenSocialHub}
            className="relative text-xs px-3 py-1 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600"
          >
            <Users className="w-4 h-4 mr-2" />
            <span>Social</span>
            {currentUser && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {currentUser.level}
              </Badge>
            )}
          </Button>
        )}
        
        {onOpenGameModes && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenGameModes}
            className="relative text-xs px-3 py-1 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            <span>Games</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              5
            </Badge>
          </Button>
        )}
        
        {onOpenAchievements && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenAchievements}
            className="relative text-xs px-3 py-1 border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-600"
          >
            <Trophy className="w-4 h-4 mr-2" />
            <span>Achievements</span>
            {totalPoints !== undefined && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {totalPoints}
              </Badge>
            )}
          </Button>
        )}

        {/* Customization button - commented out for now
        {onOpenCustomization && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCustomization}
            className="border-indigo-500 text-indigo-600 hover:bg-indigo-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
        )}
        */}
      </div>
    </div>
  )
}
