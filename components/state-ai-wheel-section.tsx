"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Maximize2, Brain, Sparkles, Trophy, Palette, BarChart3, Users, Gamepad2 } from "lucide-react"
import { useWheelManagerStore, StateWheelData } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import StateResultsModal from "./state-results-modal"
import Confetti from "react-confetti"
import { createPortal } from "react-dom"
import { State } from "@/data/states"

interface StateAIWheelSectionProps {
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

export default function StateAIWheelSection({
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
}: StateAIWheelSectionProps) {
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
  };

  const { selectedStates, displayMode, totalSpins } = data;
  const selectedStatesSafe = selectedStates ?? [];

  // Ensure we only have valid state objects with name and flag properties
  const validStates = selectedStatesSafe.filter(state => 
    state && typeof state === 'object' && state.name && state.flag
  );

  const incrementSpinCount = () => {
    if (!wheel) return;
    useWheelManagerStore.getState().updateWheelData("state-wheel", wheel.id, { totalSpins: data.totalSpins + 1 });
  };

  const { settings } = useSettingsStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [muted, setMuted] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const animationRef = useRef<number>();
  const [spinRotation, setSpinRotation] = useState(0);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [windowDimensions, setWindowDimensions] = useState({ width: 800, height: 600 });

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

  // Animation loop for spinning - use manual wheel approach
  useEffect(() => {
    if (!isSpinning) return;
    const startRotation = currentRotation;
    const startTime = Date.now();
    const duration = settings.spinBehavior.spinningDuration * 1000;
    const targetRotation = spinRotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const rotation = startRotation + (targetRotation - startRotation) * easeOut;
      setCurrentRotation(rotation);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentRotation(targetRotation);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSpinning, spinRotation, currentRotation, settings.spinBehavior.spinningDuration]);

  // Redraw canvas on every currentRotation change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10; // Increased radius by reducing margin
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    if (validStates.length === 0) {
      // Draw empty AI wheel with gradient
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(0.5, '#ec4899');
      gradient.addColorStop(1, '#6366f1');
      
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw AI brain icon in center
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧠', 0, -10);
      
      ctx.font = 'bold 16px Arial';
      ctx.fillText('AI State Wheel', 0, 30);
      ctx.font = '12px Arial';
      ctx.fillText('Add states to start', 0, 50);
    } else {
      // Draw AI wheel with states
      const segmentAngle = (2 * Math.PI) / validStates.length;

      // Get current theme colors for AI wheel
      const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];
      const themeColors = currentThemeData?.colors || ["#8b5cf6", "#ec4899", "#6366f1"]; // fallback to purple/pink/blue
      
      validStates.forEach((state: State, index: number) => {
        const startAngle = index * segmentAngle - Math.PI / 2; // Start from top like manual wheel
        const endAngle = startAngle + segmentAngle;

        // Use theme colors, cycling through the array
        const segmentColor = themeColors[index % themeColors.length];
        
        // Create gradient for each segment using theme color
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, segmentColor);
        gradient.addColorStop(1, segmentColor + 'CC'); // Add transparency for depth
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw content - use manual wheel approach
        ctx.save();
        ctx.rotate(startAngle + segmentAngle / 2);
        
        const textRadius = radius * 0.8; // Use same radius as manual wheel
        
        if (displayMode === "flag" || displayMode === "both") {
          ctx.font = "20px Arial";
          ctx.textAlign = "center";
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          const flagToShow = typeof state.flag === 'string' && state.flag.trim().length > 0 ? state.flag : "🏛️";
          ctx.strokeText(flagToShow, textRadius, -8);
          ctx.fillText(flagToShow, textRadius, -8);
        }
        
        if (displayMode === "name" || displayMode === "both") {
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 4;
          const displayName = state.name.length > 14 ? state.name.substring(0, 14) + "..." : state.name;
          ctx.strokeText(displayName, textRadius, 5);
          ctx.fillText(displayName, textRadius, 5);
        }

        ctx.restore();
      });
    }

    ctx.restore();
  }, [currentRotation, validStates, displayMode, currentTheme, themes]);

  const playSpinSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(settings.confettiSound.soundVolume * 0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      // Audio not supported
    }
  }

  const handleSpin = () => {
    if (validStates.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedResult(null);
    playSpinSound();

    const startTime = Date.now();

    // Generate random rotation with extra spins (simplified like manual wheel)
    const minSpins = 5 + Math.floor(Math.random() * 5);
    const maxSpins = 10 + Math.floor(Math.random() * 5);
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    const finalRotation = currentRotation + spins * 360 + Math.random() * 360;

    setSpinRotation(finalRotation);

    // Stop spinning after animation duration
    setTimeout(() => {
      const normalizedRotation = finalRotation % 360;
      const segmentAngle = 360 / validStates.length;
      const angleUnderPointer = (360 - normalizedRotation) % 360;
      // Since pointer is at 12 o'clock (top), no need to add 90 degrees
      const adjustedAngleForSegments = angleUnderPointer;
      const selectedIndex = Math.floor(adjustedAngleForSegments / segmentAngle);
      const result = validStates[selectedIndex];
      const endTime = Date.now();
      const spinDuration = endTime - startTime;

      // Generate simple AI insights
      const insights = [
        `AI Analysis: ${result.name} is a fascinating state!`,
        `Based on your preferences, this state has a ${Math.floor(Math.random() * 40) + 60}% compatibility score.`,
        `Travel Tip: Best time to visit is during ${['spring', 'summer', 'fall', 'winter'][Math.floor(Math.random() * 4)]}.`,
        `Cultural Insight: ${result.capital} offers unique experiences in ${result.country}.`
      ];
      setAiInsights(insights);

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
        options: validStates.map(state => state.name),
        mode: 'ai' as const,
        theme: currentTheme,
        spinDuration: spinDuration,
        userQuestion: 'AI-generated state selection'
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
          console.error('Error playing AI sound:', error);
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
            colors={['#8b5cf6', '#ec4899', '#6366f1', '#f59e0b', '#10b981', '#ef4444']}
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
      
      {/* AI Wheel Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI-Powered State Wheel
          </h2>
          <Sparkles className="h-6 w-6 text-pink-600" />
        </div>
        <p className="text-gray-600">Intelligent state selection with AI insights</p>
      </div>

      {/* AI Wheel Container */}
      <div className="relative flex flex-col items-center">
        {/* AI Wheel Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="cursor-pointer drop-shadow-2xl rounded-full border-4 border-purple-200"
            onClick={!isSpinning ? handleSpin : undefined}
          />
          
          {/* AI Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-purple-600"></div>
          </div>

          {/* Results Button */}
          <div className="absolute top-4 left-4">
            <Button variant="outline" size="sm" onClick={() => setShowResultsModal(true)} className="border-purple-300 text-purple-600 hover:bg-purple-50">
              Results
            </Button>
          </div>

          {/* AI Status Indicator - Only show small indicator, not full overlay */}
          {isSpinning && (
            <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              AI Spinning...
            </div>
          )}
        </div>

        {/* AI Controls */}
        <div className="flex items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* AI Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={validStates.length === 0 || isSpinning}
          className={`mt-6 px-8 py-3 text-lg font-semibold transition-all duration-300 ${
            validStates.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {isSpinning ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              AI Spinning...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              SPIN WITH AI
            </div>
          )}
        </Button>

        {/* Game Mode Indicator */}
        {isGameActive && currentGameMode && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300">
            <p className="text-sm font-semibold text-purple-800">
              🎮 Playing: {currentGameMode}
            </p>
          </div>
        )}

        {/* Result Display */}
        {selectedResult && !isSpinning && (
          <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300 shadow-lg mb-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">🎉 Selected State!</h3>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-4xl">{selectedResult.flag}</span>
              <div>
                <p className="text-2xl font-bold text-purple-900">{selectedResult.name}</p>
                <p className="text-sm text-purple-700">{selectedResult.country}</p>
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

        {validStates.length === 0 && (
          <p className="mt-4 text-gray-500 text-center">Select some states to start spinning!</p>
        )}

        {/* AI Results Modal */}
        <StateResultsModal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          result={selectedResult}
          results={data.recentResults || []}
          aiInsights={aiInsights}
          isAI={true}
        />
      </div>
    </div>
  );
} 