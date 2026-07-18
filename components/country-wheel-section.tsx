"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Maximize2, Trophy, Palette, BarChart3, Users, Gamepad2 } from "lucide-react"
import { useWheelManagerStore, CountryWheelData } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import CountryResultsModal from "./country-results-modal";
import Confetti from "react-confetti";
import { createPortal } from "react-dom"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"

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
  onSpinCompleted
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

  // Redraw canvas on every currentRotation change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = WHEEL_SIZE / 2 - 20
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((currentRotation * Math.PI) / 180)

    if (selectedCountriesSafe.length === 0) {
      // Draw empty wheel
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
    const displayOptions = settings.spinBehavior.mysterySpin
      ? selectedCountriesSafe.map((opt) => ({ ...opt, name: "?" }))
      : selectedCountriesSafe

    displayOptions.forEach((country, index) => {
      const startAngle = index * anglePerSegment - Math.PI / 2;
      const endAngle = startAngle + anglePerSegment;

      // Alternate between green and yellow colors like in the screenshot
      const segmentColor = index % 2 === 0 ? "#22c55e" : "#eab308";

      // Determine text color for contrast
      let textColor = "#000000";
      let strokeColor = "#ffffff";
      if (segmentColor === "#22c55e") { // green
        textColor = "#ffffff";
        strokeColor = "#000000";
      } else if (segmentColor === "#eab308") { // yellow
        textColor = "#000000";
        strokeColor = "#ffffff";
      }

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segmentColor;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw content
      ctx.save();
      ctx.rotate(startAngle + anglePerSegment / 2);

      const textRadius = radius * 0.8; // Moved text further out

      if (displayMode === "flag") {
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = textColor;
        ctx.strokeStyle = textColor;
        const flagToShow = typeof country.flag === 'string' && country.flag.trim().length > 0 ? country.flag : "🌎";
        ctx.fillText(flagToShow, textRadius, -8);
      } else if (displayMode === "both") {
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#ffffff";
        const flagToShow = typeof country.flag === 'string' && country.flag.trim().length > 0 ? country.flag : "🌎";
        ctx.fillText(flagToShow, textRadius, -8);
        // Draw country name below flag - use textColor for fill, opposite for stroke
        ctx.font = "14px Arial";
        ctx.fillStyle = textColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        const displayName = country.name.length > 12 ? country.name.substring(0, 12) + "..." : country.name;
        ctx.strokeText(displayName, textRadius, 20);
        ctx.fillText(displayName, textRadius, 20);
      } else if (displayMode === "name") {
        ctx.font = "14px Arial";
        ctx.fillStyle = textColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        const displayName = country.name.length > 14 ? country.name.substring(0, 14) + "..." : country.name;
        ctx.strokeText(displayName, textRadius, 5);
        ctx.fillText(displayName, textRadius, 5);
      }

      ctx.restore();
    });

    ctx.restore()

    // Draw center circle - larger
    const centerSize = settings.display.spinButtonAnimation && isSpinning ? 50 : 45
    ctx.beginPath()
    ctx.arc(centerX, centerY, centerSize, 0, 2 * Math.PI)
    ctx.fillStyle = settings.display.spinButtonAnimation && isSpinning ? "#059669" : "#1f2937"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 4
    ctx.stroke()

    ctx.fillStyle = "#ffffff"
    ctx.font = "18px Arial"
    ctx.textAlign = "center"
    ctx.fillText("SPIN", centerX, centerY + 6)

    // Draw pointer - larger
    ctx.beginPath()
    ctx.moveTo(centerX + radius - 35, centerY)
    ctx.lineTo(centerX + radius - 8, centerY - 18)
    ctx.lineTo(centerX + radius - 8, centerY + 18)
    ctx.closePath()
    ctx.fillStyle = "#dc2626"
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 4
    ctx.stroke()
  }, [currentRotation, selectedCountriesSafe, displayMode, settings, isSpinning]);

  useEffect(() => {
    drawWheel()
  }, [selectedCountriesSafe, currentRotation, displayMode, settings, isSpinning, currentTheme, themes])

  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = WHEEL_SIZE / 2 - 20

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((currentRotation * Math.PI) / 180)

    if (selectedCountriesSafe.length === 0) {
      // Draw empty wheel
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
    const displayOptions = settings.spinBehavior.mysterySpin
      ? selectedCountriesSafe.map((opt) => ({ ...opt, name: "?" }))
      : selectedCountriesSafe

    // Get current theme colors
    const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];
    const themeColors = currentThemeData?.colors || ["#22c55e", "#eab308"]; // fallback to green/yellow
    
    // Debug theme application
    console.log('Manual Wheel Theme Debug:', {
      currentTheme,
      selectedTheme: currentThemeData?.name,
      themeColors: themeColors.length,
      themesCount: themes.length
    });

    displayOptions.forEach((country, index) => {
      const startAngle = index * anglePerSegment - Math.PI / 2
      const endAngle = startAngle + anglePerSegment

      // Use theme colors, cycling through the array
      const segmentColor = themeColors[index % themeColors.length];

      // Determine text color for contrast
      let textColor = "#000000"; // default black
      let strokeColor = "#ffffff"; // default white
      
      // Simple contrast calculation - if color is dark, use white text, otherwise black
      const isDarkColor = segmentColor && (
        segmentColor.toLowerCase() === '#000000' ||
        segmentColor.toLowerCase() === '#000' ||
        segmentColor.toLowerCase() === '#1f2937' ||
        segmentColor.toLowerCase() === '#374151' ||
        segmentColor.toLowerCase() === '#4b5563'
      );
      
      if (isDarkColor) {
        textColor = "#ffffff"; // white text for dark colors
        strokeColor = "#000000"; // black stroke for dark colors
      } else {
        textColor = "#000000"; // black text for light colors
        strokeColor = "#ffffff"; // white stroke for light colors
      }

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = segmentColor
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 4
      ctx.stroke()

      // Draw content
      ctx.save()
      ctx.rotate(startAngle + anglePerSegment / 2)

      const textRadius = radius * 0.8 // Moved text further out

      if (displayMode === "flag" || displayMode === "both") {
        // Draw flag emoji - larger size
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = textColor;
        ctx.strokeStyle = textColor;
        const flagToShow = typeof country.flag === 'string' && country.flag.trim().length > 0 ? country.flag : "🌎";
        ctx.fillText(flagToShow, textRadius, -8);
        if (displayMode === "both") {
          // Draw country name below flag - larger font
          ctx.font = "14px Arial";
          ctx.fillStyle = textColor;
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 3;
          const displayName = country.name.length > 12 ? country.name.substring(0, 12) + "..." : country.name;
          ctx.strokeText(displayName, textRadius, 20);
          ctx.fillText(displayName, textRadius, 20);
        }
      } else if (displayMode === "name") {
        // Draw only country name - larger font
        ctx.font = "16px Arial";
        ctx.fillStyle = textColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.textAlign = "center";
        const displayName = country.name.length > 14 ? country.name.substring(0, 14) + "..." : country.name;
        ctx.strokeText(displayName, textRadius, 5);
        ctx.fillText(displayName, textRadius, 5);
      }

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
        spinDuration: settings.spinBehavior.spinningDuration * 1000,
      };
      
      // Update recentResults and spinHistory in the wheel data
      if (wheel) {
        const prevResults = (data.recentResults || []);
        const prevSpinHistory = (data.spinHistory || []);
        const newResults = [...prevResults, result].slice(-5);
        const newSpinHistory = [...prevSpinHistory, spinRecord].slice(-50); // Keep last 50 spins for analytics
        
        useWheelManagerStore.getState().updateWheelData("country-wheel", wheel.id, {
          ...data,
          selectedResult: result,
          totalSpins: data.totalSpins + 1,
          recentResults: newResults,
          spinHistory: newSpinHistory,
        });
      }
      onSpinCompleted?.();
    }, settings.spinBehavior.spinningDuration * 1000);
  }

  // Show confetti when a spin finishes and a result is selected
  useEffect(() => {
    if (selectedResult && !isSpinning) {
      setShowConfetti(true);
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
        {/* Results Button */}
        <div className="absolute top-4 left-4">
          <Button variant="outline" size="sm" onClick={() => setShowResultsModal(true)}>
            Results
          </Button>
        </div>
        {/* Controls */}
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
        </div>

        <div className="absolute bottom-4 right-4">
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-md">
            <Maximize2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Spinning indicator */}
        {isSpinning && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            Spinning...
          </div>
        )}
        <CountryResultsModal 
          isOpen={showResultsModal} 
          onClose={() => setShowResultsModal(false)} 
          result={selectedResult}
          results={data.recentResults || []}
        />
      </div>

      {/* Result Display */}
      {selectedResult && !isSpinning && (
        <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300 shadow-lg mb-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Selected Country!</h3>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-4xl">{selectedResult.flag}</span>
            <div>
              <p className="text-2xl font-bold text-green-900">{selectedResult.name}</p>
              <p className="text-sm text-green-700">{selectedResult.region}</p>
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
