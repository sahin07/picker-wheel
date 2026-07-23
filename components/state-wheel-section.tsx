"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Maximize2, Minimize2, Trophy, Palette, BarChart3, Users, Gamepad2 } from "lucide-react"
import { useWheelManagerStore, StateWheelData } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import StateResultsModal from "./state-results-modal";
import Confetti from "react-confetti";
import { createPortal } from "react-dom"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { drawStateWheelLabel } from "@/lib/state-wheel-canvas"

const WHEEL_SIZE = 680

interface StateWheelSectionProps {
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
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  removeWinnerAfterSpin?: boolean
  /** When false, Results is rendered by the parent column. */
  showResultsButton?: boolean
}

export default function StateWheelSection({
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
  isFullscreen = false,
  onToggleFullscreen,
  removeWinnerAfterSpin = false,
  showResultsButton = true,
}: StateWheelSectionProps) {
  // Subscribe to the current wheel using a Zustand selector
  const wheel = useWheelManagerStore(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  });
  const data = (wheel?.data as StateWheelData) ?? {
    selectedCountry: "US",
    selectedStates: [],
    displayMode: "name",
    viewMode: "wheel",
    favoriteStates: [],
    comparisonStates: [],
    isSpinning: false,
    spinRotation: 0,
    selectedResult: null,
    totalSpins: 0,
    showStatistics: false,
    showComparison: false,
    showFavorites: false,
    currentRotation: 0,
  }

  const setData = (partial: Partial<StateWheelData>) => {
    if (!wheel) return
    useWheelManagerStore.getState().updateWheelData("state-wheel", wheel.id, { ...data, ...partial })
  }

  const { selectedStates, displayMode, totalSpins } = data

  const incrementSpinCount = () => setData({ totalSpins: totalSpins + 1 })

  const { settings } = useSettingsStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spinAudioRef = useRef<SpinAudioController | null>(null)
  const [muted, setMuted] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [spinRotation, setSpinRotation] = useState(0);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 800, height: 600 });

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
      // Audio not supported
    }
  }

  const stopSpinSound = () => {
    spinAudioRef.current?.stop()
  }

  // Get window dimensions safely
  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const openResults = () => setShowResultsModal(true)
    window.addEventListener("open-state-results", openResults)
    return () => window.removeEventListener("open-state-results", openResults)
  }, []);

  // Sync selectedResult with wheel's selectedResult when wheel changes
  useEffect(() => {
    // Always clear selectedResult on mount or wheel change to prevent confetti on page load
    setSelectedResult(null);
  }, [wheel?.id]);

  // Animation loop for spinning (match home page audio + easing)
  useEffect(() => {
    if (!isSpinning) return;
    const startRotation = currentRotation;
    const startTime = Date.now();
    const duration = settings.spinBehavior.spinningDuration * 1000;
    const targetRotation = spinRotation;
    const speedMultiplier = settings.spinBehavior.spinningSpeedLevel / 5;
    const soundEnabled = settings.confettiSound.enableSound && !muted;
    const userVolume = settings.confettiSound.soundVolume || 0.5;
    const segmentCount = (selectedStates || []).length;
    const spinAudio = soundEnabled ? getSpinAudio() : null;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 2 + speedMultiplier);
      const rotation = startRotation + (targetRotation - startRotation) * easeOut;
      setCurrentRotation(rotation);

      if (spinAudio && segmentCount > 0) {
        spinAudio.syncFrame(rotation, segmentCount, userVolume);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentRotation(targetRotation);
        stopSpinSound();
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning, spinRotation]);

  // Ensure looping whoosh always stops when the spin ends
  useEffect(() => {
    if (!isSpinning) {
      stopSpinSound();
    }
  }, [isSpinning]);

  // Redraw canvas on every currentRotation change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = WHEEL_SIZE / 2 - 20;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    if ((selectedStates || []).length === 0) {
      // Draw empty wheel
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#f3f4f6";
      ctx.fill();
      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw placeholder text
      ctx.fillStyle = "#6b7280";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Select states to start", 0, 0);
    } else {
      // Draw wheel with states — two passes like country wheel (fill, then clipped labels)
      const segmentAngle = (2 * Math.PI) / (selectedStates || []).length;
      const mysteryNames = !!(settings.spinBehavior?.mysterySpin && isSpinning);

      const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];
      const themeColors = currentThemeData?.colors || ["#22c55e", "#eab308"];

      const labelMeta: Array<{
        state: any
        startAngle: number
        endAngle: number
        textColor: string
        strokeColor: string
      }> = []

      ;(selectedStates || []).forEach((state: any, index: number) => {
        const startAngle = index * segmentAngle - Math.PI / 2;
        const endAngle = startAngle + segmentAngle;
        const segmentColor = themeColors[index % themeColors.length];

        let textColor = "#000000"
        let strokeColor = "#ffffff"
        // Light segments → dark text; dark segments → light text
        try {
          const hex = String(segmentColor).replace("#", "")
          if (hex.length >= 6) {
            const r = parseInt(hex.slice(0, 2), 16)
            const g = parseInt(hex.slice(2, 4), 16)
            const b = parseInt(hex.slice(4, 6), 16)
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            if (lum < 0.45) {
              textColor = "#ffffff"
              strokeColor = "#111827"
            }
          }
        } catch {
          /* keep defaults */
        }

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = segmentColor;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.stroke();

        labelMeta.push({ state, startAngle, endAngle, textColor, strokeColor })
      });

      labelMeta.forEach(({ state, startAngle, endAngle, textColor, strokeColor }) => {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.clip()
        ctx.rotate(startAngle + segmentAngle / 2)
        drawStateWheelLabel(ctx, state, displayMode || "both", radius * 0.72, {
          textColor,
          strokeColor,
          mysteryNames,
        })
        ctx.restore()
      })
    }

    ctx.restore();

    const centerSize = settings.display.spinButtonAnimation && isSpinning ? 45 : 40;
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize, 0, 2 * Math.PI);
    ctx.fillStyle = settings.display.spinButtonAnimation && isSpinning ? "#059669" : "#1f2937";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", centerX, centerY + 6);

    ctx.beginPath();
    ctx.moveTo(centerX + radius - 30, centerY);
    ctx.lineTo(centerX + radius - 5, centerY - 15);
    ctx.lineTo(centerX + radius - 5, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = "#dc2626";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [currentRotation, selectedStates, displayMode, currentTheme, themes, settings, isSpinning]);

  const handleSpin = () => {
    if ((selectedStates || []).length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedResult(null);
    if (settings.confettiSound.enableSound && !muted) {
      playSpinSound();
    }

    const startTime = Date.now();

    // Generate random rotation with extra spins
    const minSpins = 5 + Math.floor(Math.random() * 5);
    const maxSpins = 10 + Math.floor(Math.random() * 5);
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    const finalRotation = currentRotation + spins * 360 + Math.random() * 360;

    setSpinRotation(finalRotation);

    // Stop spinning after animation duration
    setTimeout(() => {
      stopSpinSound();
      const normalizedRotation = finalRotation % 360;
      const segmentAngle = 360 / (selectedStates || []).length;
      const angleUnderPointer = (360 - normalizedRotation) % 360;
      const selectedIndex = Math.floor(angleUnderPointer / segmentAngle);
      const result = (selectedStates || [])[selectedIndex];
      const endTime = Date.now();
      const spinDuration = endTime - startTime;

      setSelectedResult(result);
      setIsSpinning(false);
      incrementSpinCount();

      // Create analytics spin record
      const spinRecord = {
        id: `spin-${Date.now()}`,
        timestamp: new Date(),
        result: result.name,
        options: (selectedStates || []).map(state => state.name),
        mode: 'manual' as const,
        theme: currentTheme,
        spinDuration: spinDuration,
      };

      // Update store with recent results and spin history
      if (wheel) {
        const prevResults = (data.recentResults || []);
        const prevSpinHistory = (data.spinHistory || []);
        const newResults = [...prevResults, result].slice(-5);
        const newSpinHistory = [...prevSpinHistory, spinRecord].slice(-50); // Keep last 50 spins for analytics
        const latest = useWheelManagerStore.getState().getCurrentWheel()?.data as StateWheelData | undefined
        let nextSelected = latest?.selectedStates || selectedStates || []
        if (removeWinnerAfterSpin && result) {
          nextSelected = nextSelected.filter((s) => s.id !== result.id)
        }

        useWheelManagerStore.getState().updateWheelData("state-wheel", wheel.id, {
          ...data,
          selectedResult: result,
          totalSpins: data.totalSpins + 1,
          recentResults: newResults,
          spinHistory: newSpinHistory,
          selectedStates: nextSelected,
        });
      }
      onSpinCompleted?.();
    }, settings.spinBehavior.spinningDuration * 1000);
  };

  // Show confetti when a spin finishes and a result is selected
  useEffect(() => {
    if (selectedResult && !isSpinning) {
      setShowConfetti(true);
      // Play custom win sound if global sound is enabled and not locally muted
      if (settings.confettiSound?.enableSound && !muted) {
        const audio = new Audio("/sound-win.mp3");
        audio.volume = settings.confettiSound.soundVolume || 0.5;
        audio.play().catch((error) => {
          console.error('Error playing sound:', error);
        });
      }
      const timeout = setTimeout(() => setShowConfetti(false), 5000); // 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [selectedResult, isSpinning, settings.confettiSound?.enableSound, settings.confettiSound?.soundVolume, muted]);

  return (
    <div className="relative">
      {/* Confetti - Render at document body level for true browser-top falling */}
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
            colors={['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b']}
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

      {/* Wheel Container */}
      <div className="relative flex flex-col items-center">
        {/* Wheel Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            className="cursor-pointer drop-shadow-lg max-w-full h-auto"
            style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
            onClick={!isSpinning ? handleSpin : undefined}
          />

          {/* Results Button — only when parent does not own column-level Results */}
          {showResultsButton && (
            <div className="absolute top-4 left-4 z-10">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowResultsModal(true)}
                className="border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50 sm:px-3"
              >
                Results
                {(data.recentResults?.length || 0) > 0 && (
                  <span className="ml-2 rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-700">
                    {data.recentResults!.length}
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* Controls — mute + fullscreen bottom-left */}
          <div className="absolute bottom-2 left-2 z-20 flex flex-col space-y-2 sm:bottom-4 sm:left-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setMuted((m) => !m)
              }}
              className="h-9 w-9 bg-white/90 p-0 shadow-md hover:bg-white sm:h-10 sm:w-10"
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
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
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            )}
          </div>

          {isSpinning && (
            <div className="absolute right-2 top-2 z-20 animate-pulse rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
              Spinning...
            </div>
          )}
        </div>

        {/* Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={(selectedStates || []).length === 0 || isSpinning}
          className={`mt-6 px-8 py-3 text-lg font-semibold transition-all duration-300 ${
            (selectedStates || []).length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {isSpinning ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Spinning...
            </div>
          ) : (
            "SPIN WHEEL"
          )}
        </Button>

        {/* Game Mode Indicator */}
        {isGameActive && currentGameMode && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-300">
            <p className="text-sm font-semibold text-green-800">
              🎮 Playing: {currentGameMode}
            </p>
          </div>
        )}

        {/* Result Display */}
        {selectedResult && !isSpinning && (
          <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300 shadow-lg mb-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Selected State!</h3>
            <div className="flex items-center justify-center space-x-3">
              <span className="inline-flex h-12 min-w-12 items-center justify-center rounded-md border border-slate-300 bg-white px-2 text-lg font-bold text-slate-800 shadow-sm">
                {selectedResult.abbreviation || selectedResult.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="text-left">
                <p className="text-2xl font-bold text-green-900">{selectedResult.name}</p>
                <p className="text-sm text-green-700">
                  {selectedResult.capital ? `${selectedResult.capital} • ` : ""}
                  {selectedResult.country}
                </p>
              </div>
            </div>
          </div>
        )}

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

        {(selectedStates || []).length === 0 && (
          <p className="mt-4 text-gray-500 text-center">Select some states to start spinning!</p>
        )}

        {/* Results Modal */}
        <StateResultsModal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          results={data.recentResults || []}
        />
      </div>
    </div>
  );
}
