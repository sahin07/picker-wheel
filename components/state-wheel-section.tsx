"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Maximize2, Trophy, Palette, BarChart3, Users, Gamepad2 } from "lucide-react"
import { useWheelManagerStore, StateWheelData } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import StateResultsModal from "./state-results-modal";
import Confetti from "react-confetti";
import { createPortal } from "react-dom"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"

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
  onSpinCompleted
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
      // Draw wheel with states
      const segmentAngle = (2 * Math.PI) / (selectedStates || []).length;

      // Get current theme colors
      const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];
      const themeColors = currentThemeData?.colors || ["#22c55e", "#eab308"]; // fallback to green/yellow

      (selectedStates || []).forEach((state: any, index: number) => {
        const startAngle = index * segmentAngle - Math.PI / 2;
        const endAngle = startAngle + segmentAngle;

        // Use theme colors, cycling through the array
        const segmentColor = themeColors[index % themeColors.length];

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = segmentColor;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Draw labels along the center line of each wheel segment.
        ctx.save();
        const segmentCenterAngle = startAngle + segmentAngle / 2;
        ctx.rotate(segmentCenterAngle);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        if (displayMode === "flag" || displayMode === "both") {
          ctx.font = "16px Arial";
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          const flagToShow = state.flag || "🏛️";
          ctx.strokeText(flagToShow, radius * 0.7, displayMode === "both" ? -8 : 5);
          ctx.fillText(flagToShow, radius * 0.7, displayMode === "both" ? -8 : 5);
        }

        if (displayMode === "name" || displayMode === "both") {
          ctx.font = "bold 16px Arial";
          ctx.fillStyle = "#000000";
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          const displayName = state.name.length > 12 ? state.name.substring(0, 12) + "..." : state.name;
          ctx.strokeText(displayName, radius * 0.7, displayMode === "both" ? 16 : 5);
          ctx.fillText(displayName, radius * 0.7, displayMode === "both" ? 16 : 5);
        }

        ctx.restore();
      });
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
  }, [currentRotation, selectedStates, displayMode, currentTheme, themes]);

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

      // Record spin for game session if active - DELAYED to ensure data is updated
      if (isGameActive && onSpinCompleted) {
        // Small delay to ensure wheel data is updated before calling onSpinCompleted
        setTimeout(() => {
          onSpinCompleted();
        }, 100);
      }

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
        
        useWheelManagerStore.getState().updateWheelData("state-wheel", wheel.id, {
          ...data,
          selectedResult: result,
          totalSpins: data.totalSpins + 1,
          recentResults: newResults,
          spinHistory: newSpinHistory,
        });
      }
    }, settings.spinBehavior.spinningDuration * 1000);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
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

          {/* Results Button */}
          <div className="absolute top-4 left-4">
            <Button variant="outline" size="sm" onClick={() => setShowResultsModal(true)}>
              Results
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
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
              <span className="text-4xl">{selectedResult.flag}</span>
              <div>
                <p className="text-2xl font-bold text-green-900">{selectedResult.name}</p>
                <p className="text-sm text-green-700">{selectedResult.country}</p>
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
