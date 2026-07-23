"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Maximize2, Trophy, Palette, BarChart3, Users, Gamepad2, Minimize2 } from "lucide-react"
import { useWheelManagerStore, CountryWheelData } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import PickerResultsModal from "./picker-results-modal";
import Confetti from "react-confetti";
import { createPortal } from "react-dom"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { getSpinDurationMs } from "@/lib/wheel-spin-animation"
import { drawCountryWheelLabel } from "@/lib/country-wheel-canvas"
import { CountryFlagImage } from "@/components/country-flag-image"

const WHEEL_SIZE = 680

interface CountryWheelSectionProps {
  onOpenAchievements?: () => void;
  onOpenThemeSelector?: () => void;
  onOpenAnalytics?: () => void;
  onOpenSocialHub?: () => void;
  onOpenGameModes?: () => void;
  totalPoints?: number;
  currentTheme?: string;
  themes?: any[];
  spinHistory?: any[];
  currentUser?: any;
  isGameActive?: boolean;
  currentGameMode?: string;
  onSpinCompleted?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  removeWinnerAfterSpin?: boolean;
  /** When false, Results is rendered by the parent column (NBA/Pokemon placement). */
  showResultsButton?: boolean;
}

export default function CountryWheelSection({
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
}: CountryWheelSectionProps) {
  // Subscribe to the current wheel using a Zustand selector
  const wheel = useWheelManagerStore(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  });
  const data = (wheel?.data as CountryWheelData) ?? {
    selectedRegion: "all",
    selectedCountries: [],
    displayMode: "name", // default to title
    viewMode: "wheel",
    favoriteCountries: [],
    comparisonCountries: [],
    isSpinning: false,
    spinRotation: 0,
    selectedResult: null,
    totalSpins: 0,
    showStatistics: false,
    showComparison: false,
    showFavorites: false,
    currentRotation: 0,
  };

  const { selectedCountries, displayMode, totalSpins } = data;

  const selectedCountriesSafe = selectedCountries ?? [];

  const { settings } = useSettingsStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinAudioRef = useRef<SpinAudioController | null>(null);
  const [muted, setMuted] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const animationRef = useRef<number>();
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flagTick, setFlagTick] = useState(0);
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
      console.log("Audio not supported")
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
    window.addEventListener("open-country-results", openResults)
    return () => window.removeEventListener("open-country-results", openResults)
  }, []);

  // Animation loop for spinning (match home page audio + easing)
  useEffect(() => {
    if (!isSpinning) return;
    const startRotation = currentRotation;
    const startTime = Date.now();
    const duration = getSpinDurationMs(settings.spinBehavior?.spinningDuration)
    const targetRotation = spinRotation;
    const speedMultiplier = settings.spinBehavior.spinningSpeedLevel / 5;
    const soundEnabled = settings.confettiSound.enableSound && !muted;
    const userVolume = settings.confettiSound.soundVolume || 0.5;
    const segmentCount = selectedCountriesSafe.length;
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

  // Redraw when wheel data / display mode changes
  useEffect(() => {
    drawWheel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCountriesSafe,
    currentRotation,
    displayMode,
    settings,
    isSpinning,
    currentTheme,
    themes,
    flagTick,
  ])

  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = WHEEL_SIZE / 2 - 20
    const redraw = () => setFlagTick((t) => t + 1)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((currentRotation * Math.PI) / 180)

    if (selectedCountriesSafe.length === 0) {
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

    const anglePerSegment = (2 * Math.PI) / selectedCountriesSafe.length
    // Only hide names while spinning — idle wheel honors Flag / Name / Flag & Name
    const mysteryNames = !!(settings.spinBehavior?.mysterySpin && isSpinning)

    const currentThemeData = themes.find((t) => t.id === currentTheme) || themes[0]
    const themeColors = currentThemeData?.colors || ["#22c55e", "#eab308"]

    // Pass 1: fill segments only — labels drawn after so later fills don't cover names
    const labelMeta: Array<{
      country: (typeof selectedCountriesSafe)[number]
      startAngle: number
      endAngle: number
      textColor: string
      strokeColor: string
    }> = []

    selectedCountriesSafe.forEach((country, index) => {
      const startAngle = index * anglePerSegment - Math.PI / 2
      const endAngle = startAngle + anglePerSegment
      const segmentColor = themeColors[index % themeColors.length]

      let textColor = "#000000"
      let strokeColor = "#ffffff"
      const dark =
        segmentColor &&
        (segmentColor.toLowerCase() === "#000000" ||
          segmentColor.toLowerCase() === "#000" ||
          segmentColor.toLowerCase() === "#1f2937" ||
          segmentColor.toLowerCase() === "#374151" ||
          segmentColor.toLowerCase() === "#4b5563")
      if (dark) {
        textColor = "#ffffff"
        strokeColor = "#000000"
      }

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = segmentColor
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 4
      ctx.stroke()

      labelMeta.push({ country, startAngle, endAngle, textColor, strokeColor })
    })

    // Pass 2: labels on top (clipped to each wedge so dense wheels stay readable)
    labelMeta.forEach(({ country, startAngle, endAngle, textColor, strokeColor }) => {
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.clip()
      ctx.rotate(startAngle + anglePerSegment / 2)
      drawCountryWheelLabel(ctx, country, displayMode || "both", radius * 0.72, {
        textColor,
        strokeColor,
        mysteryNames,
        onFlagReady: redraw,
      })
      ctx.restore()
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
  }


  const handleSpin = () => {
    if (selectedCountriesSafe.length === 0 || isSpinning) return

    setIsSpinning(true)
    setSelectedResult(null)
    if (settings.confettiSound.enableSound && !muted) {
      playSpinSound()
    }

    const minSpins = 5 + settings.spinBehavior.spinningSpeedLevel / 2
    const maxSpins = 10 + settings.spinBehavior.spinningSpeedLevel
    const spins = Math.random() * (maxSpins - minSpins) + minSpins
    const finalRotation = currentRotation + spins * 360 + Math.random() * 360

    setSpinRotation(finalRotation)

    setTimeout(() => {
      stopSpinSound();
      const latestWheel = useWheelManagerStore.getState().getCurrentWheel();
      const latestData = latestWheel?.data as CountryWheelData;
      const options = latestData?.selectedCountries || [];
      const normalizedRotation = finalRotation % 360;
      const segmentAngle = 360 / options.length;
      const angleUnderPointer = (360 - normalizedRotation) % 360;
      const adjustedAngleForSegments = (angleUnderPointer + 90) % 360;
      const selectedIndex = Math.floor(adjustedAngleForSegments / segmentAngle);
      const result = options[selectedIndex];
      setSelectedResult(result);
      setIsSpinning(false);
      
      // Create analytics spin record
      const spinRecord = {
        id: `spin-${Date.now()}`,
        timestamp: new Date(),
        result: result.name,
        options: options.map(country => country.name),
        mode: 'manual' as const,
        theme: currentTheme,
        spinDuration: getSpinDurationMs(settings.spinBehavior?.spinningDuration),
      };
      
      // Update recentResults and spinHistory in the wheel data
      if (wheel) {
        const prevResults = (data.recentResults || []);
        const prevSpinHistory = (data.spinHistory || []);
        const newResults = [...prevResults, result].slice(-5);
        const newSpinHistory = [...prevSpinHistory, spinRecord].slice(-50); // Keep last 50 spins for analytics
        
        let nextSelected = latestData?.selectedCountries || options;
        if (removeWinnerAfterSpin && result) {
          nextSelected = nextSelected.filter((c) => c.id !== result.id);
        }

        useWheelManagerStore.getState().updateWheelData("country-wheel", wheel.id, {
          ...data,
          selectedResult: result,
          totalSpins: data.totalSpins + 1,
          recentResults: newResults,
          spinHistory: newSpinHistory,
          selectedCountries: nextSelected,
        });
      }
      onSpinCompleted?.();
    }, getSpinDurationMs(settings.spinBehavior?.spinningDuration));
  }

  // Show confetti when a spin finishes and a result is selected
  useEffect(() => {
    if (selectedResult && !isSpinning) {
      if (settings.confettiSound?.enableConfetti !== false) {
        setShowConfetti(true);
      }
      // Play custom win sound if global sound is enabled and not locally muted
      if (settings.confettiSound?.enableSound && !muted) {
        console.log('Playing sound - Global enabled:', settings.confettiSound.enableSound, 'Local muted:', muted, 'Volume:', settings.confettiSound.soundVolume);
        const audio = new Audio("/sound-win.mp3");
        audio.volume = settings.confettiSound.soundVolume || 0.5; // Volume is already a decimal
        audio.play().catch((error) => {
          console.error('Error playing sound:', error);
        });
      } else {
        console.log('Sound not playing - Global enabled:', settings.confettiSound?.enableSound, 'Local muted:', muted);
      }
      const timeout = setTimeout(() => setShowConfetti(false), 5000); // 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [selectedResult, isSpinning, settings.confettiSound?.enableSound, settings.confettiSound?.soundVolume, muted]);

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
        {/* Controls — mute + fullscreen bottom-left (NBA/Pokemon placement) */}
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
            title={settings.confettiSound?.enableSound ? (muted ? "Unmute" : "Mute") : "Global sound disabled"}
          >
            {!settings.confettiSound?.enableSound ? (
              <VolumeX className="h-5 w-5 text-gray-400" />
            ) : muted ? (
              <VolumeX className="h-5 w-5" />
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
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {/* Spinning indicator */}
        {isSpinning && (
          <div className="absolute right-2 top-2 z-20 animate-pulse rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
            Spinning...
          </div>
        )}
        <PickerResultsModal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          results={data.recentResults || []}
        />
      </div>

      {/* Result Display */}
      {selectedResult && !isSpinning && (
        <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300 shadow-lg mb-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Selected Country!</h3>
          <div className="flex items-center justify-center space-x-4">
            <CountryFlagImage
              country={selectedResult}
              width={160}
              className="drop-shadow-md"
              imgClassName="h-16 w-auto rounded-md border border-white/80 object-cover shadow-md"
            />
            <div className="text-left">
              <p className="text-2xl font-bold text-green-900">{selectedResult.name}</p>
              <p className="text-sm text-green-700">
                {[
                  selectedResult.capital && `Capital: ${selectedResult.capital}`,
                  selectedResult.region,
                  selectedResult.language,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
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
        disabled={isSpinning || selectedCountriesSafe.length === 0}
        className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isSpinning ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Spinning...</span>
          </div>
        ) : (
          "🎯 SPIN THE WHEEL"
        )}
      </Button>

      {selectedCountriesSafe.length === 0 && (
        <p className="mt-4 text-gray-500 text-center">Select some countries to start spinning!</p>
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

      {/* Total Spins Counter */}
      {settings.display.showSpinCount && (
        <div className="mt-4 text-sm text-gray-500">
          <span>Total spins: {totalSpins}</span>
        </div>
      )}
    </div>
  )
}
