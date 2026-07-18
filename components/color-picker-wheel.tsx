"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"
import { WheelDisplay } from "@/components/color-picker-wheel/wheel-display"
import { TitleModal } from "@/components/color-picker-wheel/title-modal"
import { ResultsDisplay } from "@/components/color-picker-wheel/results-display"
import { ColorOutputDisplay } from "@/components/color-picker-wheel/color-output-display"
import { ColorWheelControls } from "@/components/color-picker-wheel/color-wheel-controls"
import { ManualControls } from "@/components/color-picker-wheel/manual-controls"
import { ImageControls } from "@/components/color-picker-wheel/image-controls"
import { AIColorAnalysis } from "@/components/color-picker-wheel/ai-color-analysis"
import { AIColorLearning } from "@/components/color-picker-wheel/ai-color-learning"
import { AIPaletteGenerator } from "@/components/color-picker-wheel/ai-palette-generator"
import { ColorBlindnessSimulator } from "@/components/color-picker-wheel/color-blindness-simulator"
import { EnhancedColorNaming } from "@/components/color-picker-wheel/enhanced-color-naming"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import { generateIntelligentColorName } from "@/lib/ai-color-utils"
import { Settings, Palette, Image, Eye, RotateCcw, BarChart3, Share2, Maximize2, Minimize2, Brain } from "lucide-react"
import Confetti from "react-confetti"

interface ColorPickerWheelProps {
  onOpenSettings?: () => void
}

export function ColorPickerWheel({ onOpenSettings }: ColorPickerWheelProps = {}) {
  const [isClient, setIsClient] = useState(false)
  const { settings: globalSettings, updateSettings } = useSettings()
  const { settings: localSettings } = useSettingsStore()
  const { getCurrentWheel, updateWheelData, setCurrentTool, createNewWheel, currentWheelId } = useWheelManagerStore()
  const toolType = 'color-picker-wheel';
  const prevWheelId = useRef<string | null>(null)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize tool and wheel
  useEffect(() => {
    if (!isClient) return
    
    setCurrentTool("color-picker-wheel")
    if (typeof window !== "undefined") {
      const wheel = getCurrentWheel()
      if (!wheel) {
        const newWheelId = createNewWheel("color-picker-wheel", "Color Picker Wheel")
        console.log('Created new color picker wheel with ID:', newWheelId)
      } else {
        console.log('Existing wheel found:', wheel.id, wheel.data)
      }
    }
  }, [setCurrentTool, getCurrentWheel, createNewWheel, isClient])

  // State management
  const [activeTab, setActiveTab] = useState("color-wheel")
  const [colorCombination, setColorCombination] = useState("complementary")
  const [spinningPointerMode, setSpinningPointerMode] = useState<"manual" | "random">("random")
  const [selectedColor, setSelectedColor] = useState("#FF0000")
  const [customColors, setCustomColors] = useState<Array<{
    id: string
    color: string
    name: string
    enabled: boolean
  }>>([])
  const [showStats, setShowStats] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAIFeatures, setShowAIFeatures] = useState(true)
  const [confettiEnabled, setConfettiEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(globalSettings.confettiSound.enableSound)
  const [wheelTheme, setWheelTheme] = useState("classic")
  const [showConfetti, setShowConfetti] = useState(false)
  const [wheelShake, setWheelShake] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  
  // Title and description state
  const [wheelTitle, setWheelTitle] = useState("Color Picker Wheel")
  const [wheelDescription, setWheelDescription] = useState("Pick a random color by wheel")
  const [showTitleModal, setShowTitleModal] = useState(false)

     // Results and statistics - Separate for each mode
   const [results, setResults] = useState<{
     "color-wheel": Array<{
       color: string
       name: string
       hex: string
       rgb: string
       timestamp: Date
     }>
     "manual": Array<{
       color: string
       name: string
       hex: string
       rgb: string
       timestamp: Date
     }>
     "image": Array<{
       color: string
       name: string
       hex: string
       rgb: string
       timestamp: Date
     }>
     "ai": Array<{
       color: string
       name: string
       hex: string
       rgb: string
       timestamp: Date
     }>
   }>({
     "color-wheel": [],
     "manual": [],
     "image": [],
     "ai": []
   })
  
     const [lastResult, setLastResult] = useState<{
     "color-wheel": {
       color: string
       name: string
       hex: string
       rgb: string
       complementary?: {
         hex: string
         rgb: string
       }
     } | null
     "manual": {
       color: string
       name: string
       hex: string
       rgb: string
       complementary?: {
         hex: string
         rgb: string
       }
     } | null
     "image": {
       color: string
       name: string
       hex: string
       rgb: string
       complementary?: {
         hex: string
         rgb: string
       }
     } | null
     "ai": {
       color: string
       name: string
       hex: string
       rgb: string
       complementary?: {
         hex: string
         rgb: string
       }
     } | null
   }>({
     "color-wheel": null,
     "manual": null,
     "image": null,
     "ai": null
   })
  
     const [totalSpins, setTotalSpins] = useState<{
     "color-wheel": number
     "manual": number
     "image": number
     "ai": number
   }>({
     "color-wheel": 0,
     "manual": 0,
     "image": 0,
     "ai": 0
   })
  const [resultShowMode, setResultShowMode] = useState({
    color: true,
    text: true,
    hex: true,
    rgb: true
  })
  
  // Result Action Modes
  const [resultActionMode, setResultActionMode] = useState<"normal" | "elimination">("normal")
  const [eliminatedColors, setEliminatedColors] = useState<Set<string>>(new Set())

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const animationRef = useRef<number | null>(null)

  // Debug current state
  useEffect(() => {
    console.log('Current state - activeTab:', activeTab, 'shouldShowWheel: true (all modes)');
    console.log('Wheel is now visible for all modes including Manual mode');
  }, [activeTab]);

  // Add default colors for Manual mode if none exist
  useEffect(() => {
    if (activeTab === "manual" && customColors.length === 0 && isClient) {
      const defaultColors = [
        { id: "1", color: "#FF0000", name: "Red", enabled: true },
        { id: "2", color: "#FFA500", name: "Orange", enabled: true },
        { id: "3", color: "#FFFF00", name: "Yellow", enabled: true },
        { id: "4", color: "#008000", name: "Green", enabled: true },
        { id: "5", color: "#0000FF", name: "Blue", enabled: true },
        { id: "6", color: "#800080", name: "Purple", enabled: true },
        { id: "7", color: "#000000", name: "Black", enabled: true },
        { id: "8", color: "#FFFFFF", name: "White", enabled: true }
      ];
      setCustomColors(defaultColors);
    }
  }, [activeTab, customColors.length, isClient]);

  // Load wheel data when switching wheels
  useEffect(() => {
    if (!isClient) return
    
    const wheel = getCurrentWheel()
    if (!wheel) return
    
    // Check if this is a different wheel (wheel switching)
    if (prevWheelId.current !== wheel.id) {
      console.log('Switching to color picker wheel:', wheel.id, wheel.name, wheel.data)
      
             // Reset all states first
       setLastResult({
         "color-wheel": null,
         "manual": null,
         "image": null,
         "ai": null
       })
       setIsSpinning(false)
       setRotation(0)
       setWheelShake(false)
       setShowParticles(false)
       setShowConfetti(false)
       
       if (wheel.data && Object.keys(wheel.data).length > 0) {
         const d = wheel.data as any;
         console.log('Loading wheel data:', d)
         
         setActiveTab(d.activeTab || "color-wheel");
         setColorCombination(d.colorCombination || "complementary");
         setSpinningPointerMode(d.spinningPointerMode || "random");
         setSelectedColor(d.selectedColor || "#FF0000");
         setCustomColors(d.customColors || []);
         setShowStats(d.showStats || false);
         setConfettiEnabled(d.confettiEnabled ?? true);
         setWheelTheme(d.wheelTheme || "classic");
         setWheelTitle(d.wheelTitle || "Color Picker Wheel");
         setWheelDescription(d.wheelDescription || "Pick a random color by wheel");
         // Ensure all keys exist in results, even if loaded data is missing some
         const loadedResults = d.results || {};
         setResults({
           "color-wheel": loadedResults["color-wheel"] || [],
           "manual": loadedResults["manual"] || [],
           "image": loadedResults["image"] || [],
           "ai": loadedResults["ai"] || []
         });
                   // Ensure all keys exist in lastResult, even if loaded data is missing some
                   const loadedLastResult = d.lastResult || {};
                   setLastResult({
                     "color-wheel": loadedLastResult["color-wheel"] || null,
                     "manual": loadedLastResult["manual"] || null,
                     "image": loadedLastResult["image"] || null,
                     "ai": loadedLastResult["ai"] || null
                   });
                   
                   // Ensure all keys exist in totalSpins, even if loaded data is missing some
                   const loadedTotalSpins = d.totalSpins || {};
                   setTotalSpins({
                     "color-wheel": loadedTotalSpins["color-wheel"] || 0,
                     "manual": loadedTotalSpins["manual"] || 0,
                     "image": loadedTotalSpins["image"] || 0,
                     "ai": loadedTotalSpins["ai"] || 0
                   });
         setResultShowMode(d.resultShowMode || { color: true, text: true, hex: true, rgb: true });
         setResultActionMode(d.resultActionMode || "normal");
         setEliminatedColors(new Set(d.eliminatedColors || []));
         
         console.log('Loaded existing wheel data for wheel:', wheel.id)
       } else {
         // Wheel exists but has no data, set defaults
         console.log('No data found for wheel:', wheel.id, 'setting defaults')
         
         setActiveTab("color-wheel");
         setColorCombination("complementary");
         setSpinningPointerMode("random");
         setSelectedColor("#FF0000");
         setCustomColors([]);
         setShowStats(false);
         setConfettiEnabled(true);
         setWheelTheme("classic");
         setWheelTitle("Color Picker Wheel");
         setWheelDescription("Pick a random color by wheel");
         setResults({
           "color-wheel": [],
           "manual": [],
           "image": [],
           "ai": []
         });
         setLastResult({
           "color-wheel": null,
           "manual": null,
           "image": null,
           "ai": null
         });
         setTotalSpins({
           "color-wheel": 0,
           "manual": 0,
           "image": 0,
           "ai": 0
         });
         setResultShowMode({ color: true, text: true, hex: true, rgb: true });
         setResultActionMode("normal");
         setEliminatedColors(new Set());
         
         console.log('Set default data for existing wheel with no data')
       }
      
      prevWheelId.current = wheel.id
    }
  }, [getCurrentWheel, currentWheelId, isClient])

  // Unified sync for all wheel data
  const syncWheelData = useCallback((data: any) => {
    const wheel = getCurrentWheel()
    if (wheel) {
      updateWheelData("color-picker-wheel", wheel.id, data)
    }
  }, [getCurrentWheel, updateWheelData])

  // Save wheel data whenever important state changes
  useEffect(() => {
    const wheel = getCurrentWheel()
    if (wheel && isClient) {
      const wheelData = {
        activeTab,
        colorCombination,
        spinningPointerMode,
        selectedColor,
        customColors,
        resultActionMode,
        eliminatedColors: Array.from(eliminatedColors),
        showStats,
        confettiEnabled,
        wheelTheme,
        results,
        lastResult,
        totalSpins,
        resultShowMode,
        wheelTitle,
        wheelDescription,
      }
      
      console.log('Saving wheel data for wheel:', wheel.id, wheelData)
      console.log('Current wheel data before save:', wheel.data)
      syncWheelData(wheelData)
      
      // Verify the data was saved
      setTimeout(() => {
        const updatedWheel = getCurrentWheel()
        console.log('Wheel data after save:', updatedWheel?.data)
      }, 100)
    }
      }, [activeTab, colorCombination, spinningPointerMode, selectedColor, customColors, 
      resultActionMode, eliminatedColors, showStats, confettiEnabled, wheelTheme, results, lastResult, totalSpins, resultShowMode, 
      wheelTitle, wheelDescription, syncWheelData, isClient])

  // Generate wheel segments based on input method
  const generateSegments = (): Array<{
    label: string
    color: string
    angle: number
    startAngle: number
  }> => {
    if (activeTab === "color-wheel") {
      // Generate color wheel segments
      const segments: Array<{
        label: string
        color: string
        angle: number
        startAngle: number
      }> = [];
      const totalSegments = 360; // Full color wheel
      const anglePerSegment = 360 / totalSegments;

      for (let i = 0; i < totalSegments; i++) {
        const hue = i;
        const color = `hsl(${hue}, 100%, 50%)`;
        segments.push({
          label: "",
          color,
          angle: anglePerSegment,
          startAngle: i * anglePerSegment,
        });
      }
      return segments;
    } else {
      // Generate segments from custom colors
      const enabledColors = customColors.filter(c => c.enabled);
      if (enabledColors.length === 0) return [];

      const segments: Array<{
        label: string
        color: string
        angle: number
        startAngle: number
      }> = [];
      const anglePerSegment = 360 / enabledColors.length;

      enabledColors.forEach((colorData, i) => {
        // For AI tab, always use the AI-generated name if available
        let label = colorData.name || colorData.color;
        
        // If we're in AI tab and the name is just a hex code, generate an AI name
        if (activeTab === "ai" && colorData.name === colorData.color) {
          label = generateIntelligentColorName(colorData.color, "nature");
        }
        
        segments.push({
          label,
          color: colorData.color,
          angle: anglePerSegment,
          startAngle: i * anglePerSegment,
        });
      });

      return segments;
    }
  };

  const segments = generateSegments();

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };

  // Convert HSL to HEX
  const hslToHex = (h: number, s: number, l: number) => {
    const [r, g, b] = hslToRgb(h, s, l);
    return "#" + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  // Get complementary color
  const getComplementaryColor = (hue: number) => {
    const complementaryHue = (hue + 180) % 360;
    return {
      hex: hslToHex(complementaryHue, 100, 50),
      rgb: hslToRgb(complementaryHue, 100, 50).join(", ")
    };
  };

  // Spin wheel function
  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWheelShake(true);
    setShowParticles(true);

    // Generate segments based on current input method
    const currentSegments = generateSegments();
    if (currentSegments.length === 0) {
      setIsSpinning(false);
      return;
    }

    // Filter out eliminated colors if in elimination mode
    const availableSegments = resultActionMode === "elimination" 
      ? currentSegments.filter(segment => !eliminatedColors.has(segment.color))
      : currentSegments;

    if (availableSegments.length === 0) {
      setIsSpinning(false);
      return;
    }

    // Generate random rotation
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalRotation = Math.random() * 360;
    const totalRotation = spins * 360 + finalRotation;
    const duration = 3000 + Math.random() * 2000; // 3-5 seconds

    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + totalRotation * easeOut;
      
      setRotation(currentRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Determine result from available segments
        const normalizedRotation = (currentRotation % 360 + 360) % 360;
        const segmentIndex = Math.floor((360 - normalizedRotation) / (360 / availableSegments.length)) % availableSegments.length;
        const segment = availableSegments[segmentIndex];

        let result;
        if (activeTab === "color-wheel") {
          const hue = segmentIndex;
          const hex = hslToHex(hue, 100, 50);
          const rgb = hslToRgb(hue, 100, 50).join(", ");
          const complementary = getComplementaryColor(hue);
          
          result = {
            color: segment.color,
            name: `Hue ${hue}°`,
            hex,
            rgb,
            complementary: {
              hex: complementary.hex,
              rgb: complementary.rgb
            }
          };
        } else {
          result = {
            color: segment.color,
            name: segment.label,
            hex: segment.color,
            rgb: "", // Would need to convert hex to rgb
            complementary: undefined
          };
        }

                 // Update results for current mode
         setLastResult(prev => ({
           ...prev,
           [activeTab]: result
         }));
         
         setResults(prev => ({
           ...prev,
           [activeTab]: [{
             color: result.color,
             name: result.name,
             hex: result.hex,
             rgb: result.rgb,
             timestamp: new Date()
           }, ...prev[activeTab as keyof typeof prev].slice(0, 99)] // Keep last 100 results
         }));
         
         setTotalSpins(prev => ({
           ...prev,
           [activeTab]: prev[activeTab as keyof typeof prev] + 1
         }));

         // Handle elimination mode
         if (resultActionMode === "elimination") {
           setEliminatedColors(prev => new Set([...prev, result.color]));
         }

         // Force save wheel data after spin
         setTimeout(() => {
           const wheel = getCurrentWheel()
           if (wheel && isClient) {
             const wheelData = {
               activeTab,
               colorCombination,
               spinningPointerMode,
               selectedColor,
               customColors,
               resultActionMode,
               eliminatedColors: Array.from(eliminatedColors),
               showStats,
               confettiEnabled,
               wheelTheme,
               results: {
                 ...results,
                 [activeTab]: [{
                   color: result.color,
                   name: result.name,
                   hex: result.hex,
                   rgb: result.rgb,
                   timestamp: new Date()
                 }, ...results[activeTab as keyof typeof results].slice(0, 99)]
               },
               lastResult: {
                 ...lastResult,
                 [activeTab]: result
               },
               totalSpins: {
                 ...totalSpins,
                 [activeTab]: totalSpins[activeTab as keyof typeof totalSpins] + 1
               },
               resultShowMode,
               wheelTitle,
               wheelDescription,
             }
             console.log('Force saving wheel data after spin:', wheelData)
             syncWheelData(wheelData)
           }
         }, 100)

        setIsSpinning(false);
        setWheelShake(false);
        setShowParticles(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Reset function
  const resetWheel = () => {
    setResults({
      "color-wheel": [],
      "manual": [],
      "image": [],
      "ai": []
    });
    setLastResult({
      "color-wheel": null,
      "manual": null,
      "image": null,
      "ai": null
    });
    setTotalSpins({
      "color-wheel": 0,
      "manual": 0,
      "image": 0,
      "ai": 0
    });
    setCustomColors([]);
    setSelectedColor("#FF0000");
    
    // Force save wheel data after reset
    setTimeout(() => {
      const wheel = getCurrentWheel()
      if (wheel && isClient) {
        const wheelData = {
          activeTab,
          colorCombination,
          spinningPointerMode,
          selectedColor: "#FF0000",
          customColors: [],
          showStats,
          confettiEnabled,
          wheelTheme,
          results: {
            "color-wheel": [],
            "manual": [],
            "image": [],
            "ai": []
          },
          lastResult: {
            "color-wheel": null,
            "manual": null,
            "image": null,
            "ai": null
          },
          totalSpins: {
            "color-wheel": 0,
            "manual": 0,
            "image": 0,
            "ai": 0
          },
          resultShowMode,
          wheelTitle,
          wheelDescription,
        }
        console.log('Force saving wheel data after reset:', wheelData)
        syncWheelData(wheelData)
      }
    }, 100)
  };

  // Shuffle wheel function
  const shuffleWheel = () => {
    // Add a random rotation to shuffle the wheel appearance
    const randomRotation = Math.random() * 360;
    setRotation(randomRotation);
    
    // Add a brief shake effect
    setWheelShake(true);
    setTimeout(() => setWheelShake(false), 500);
  };

  // Global sound toggle function
  const toggleGlobalSound = () => {
    const newSoundEnabled = !soundEnabled;
    console.log('Toggling sound from', soundEnabled, 'to', newSoundEnabled);
    setSoundEnabled(newSoundEnabled);
    // Update global settings
    updateSettings({
      confettiSound: {
        ...globalSettings.confettiSound,
        enableSound: newSoundEnabled
      }
    });
  };

  // Share function
  const shareResult = () => {
    const currentLastResult = lastResult[activeTab as keyof typeof lastResult];
    if (currentLastResult) {
      const text = `I just got "${currentLastResult.name}" (${currentLastResult.hex}) on the Color Picker Wheel! 🎨`;
      if (navigator.share) {
        navigator.share({ text });
      } else {
        navigator.clipboard.writeText(text);
        // Show toast notification
      }
    }
  };

  // Toggle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        console.log('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      }).catch(err => {
        console.log('Error attempting to exit fullscreen:', err);
      });
    }
  };

  // Keyboard shortcut for Ctrl + Enter to spin
  useEffect(() => {
    if (!isClient) return
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        spinWheel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSpinning, isClient]);

  // Sync local sound state with global settings
  useEffect(() => {
    setSoundEnabled(globalSettings.confettiSound.enableSound);
  }, [globalSettings.confettiSound.enableSound]);

  // Listen for fullscreen changes
  useEffect(() => {
    if (!isClient) return;

    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isClient]);

  // Show confetti when a spin finishes and a result is selected
  useEffect(() => {
    if (!isClient) return;
    
    const currentLastResult = lastResult[activeTab as keyof typeof lastResult];
    if (currentLastResult && !isSpinning) {
      setShowConfetti(true);
      // Play custom win sound if global sound is enabled and not locally muted
      if (globalSettings.confettiSound?.enableSound && soundEnabled) {
        console.log('Playing sound - Global enabled:', globalSettings.confettiSound.enableSound, 'Local sound enabled:', soundEnabled, 'Volume:', globalSettings.confettiSound.soundVolume);
        const audio = new Audio("/sound-win.mp3");
        audio.volume = globalSettings.confettiSound.soundVolume || 0.5; // Volume is already a decimal
        audio.play().catch((error) => {
          console.error('Error playing sound:', error);
        });
      } else {
        console.log('Sound not playing - Global enabled:', globalSettings.confettiSound?.enableSound, 'Local sound enabled:', soundEnabled);
      }
      const timeout = setTimeout(() => setShowConfetti(false), 5000); // 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [lastResult, activeTab, isSpinning, globalSettings.confettiSound?.enableSound, globalSettings.confettiSound?.soundVolume, soundEnabled, isClient]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Don't render until client is ready
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 relative overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={400} recycle={false} />
        </div>
      )}



             {/* Main Content */}
       <div className="max-w-none mx-0 p-0 relative z-10">
         <div className={`grid ${isFullScreen ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-8 items-start px-4 pt-6`}>
          {/* Left Column - Wheel and Results */}
          <div className="space-y-6">
            {/* Wheel Section - Show for all modes */}
            <div className="flex justify-center items-center">
                             <WheelDisplay
                 segments={segments}
                 wheelBackground={activeTab === "color-wheel" 
                   ? "conic-gradient(from 0deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))"
                   : `conic-gradient(from 0deg, ${segments.map((s, i) => {
                       const isEliminated = resultActionMode === "elimination" && eliminatedColors.has(s.color);
                       const color = isEliminated ? "#cccccc" : s.color; // Gray out eliminated colors
                       return `${color} ${s.startAngle}deg ${s.startAngle + s.angle}deg`;
                     }).join(", ")})`
                 }
                 rotation={rotation}
                 isSpinning={isSpinning}
                 wheelShake={wheelShake}
                 showParticles={showParticles}
                 activeTab={activeTab}
                 onSpin={spinWheel}
                 soundEnabled={soundEnabled}
                 setSoundEnabled={toggleGlobalSound}
                 showStats={showStats}
                 setShowStats={setShowStats}
                 onShare={shareResult}
                 lastResult={lastResult[activeTab as keyof typeof lastResult]}
                 wheelTheme={wheelTheme}
                 setWheelTheme={setWheelTheme}
                 isFullScreen={isFullScreen}
               />
            </div>

                         {/* Results Display - Moved to left side under wheel */}
             {!isFullScreen && (
               <ResultsDisplay
                 results={results[activeTab as keyof typeof results]}
                 lastResult={lastResult[activeTab as keyof typeof lastResult]}
                 inputMethod={activeTab}
                 activeTab={activeTab}
                 resultShowMode={resultShowMode}
                 showStats={showStats}
                 totalSpins={totalSpins[activeTab as keyof typeof totalSpins]}
               />
             )}
          </div>

          {/* Right Column - Controls */}
          {!isFullScreen && (
            <div className="space-y-6">
                             {/* Color Output Display - Only show for Color Wheel mode */}
               {activeTab === "color-wheel" && (
                 <ColorOutputDisplay
                   selectedColor={selectedColor}
                   colorCombination={colorCombination}
                   lastResult={lastResult[activeTab as keyof typeof lastResult]}
                 />
               )}



              {/* Result Action Mode Toggle - Show for all modes */}
              {(
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Result Mode:</span>
                      <Button
                        variant={resultActionMode === "normal" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setResultActionMode("normal")}
                        className="text-xs"
                      >
                        Normal
                      </Button>
                      <Button
                        variant={resultActionMode === "elimination" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setResultActionMode("elimination")}
                        className="text-xs"
                      >
                        Elimination
                      </Button>
                    </div>
                    {resultActionMode === "elimination" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEliminatedColors(new Set())}
                        className="text-xs"
                        title="Restore all eliminated colors"
                      >
                        Restore All
                      </Button>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {resultActionMode === "elimination" && eliminatedColors.size > 0 && (
                      <span>Eliminated: {eliminatedColors.size}</span>
                    )}
                  </div>
                </div>
              )}

                                            {/* Action Buttons - Show for all modes */}
               {(
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex space-x-2">
                     <Button
                       variant="outline"
                       size="icon"
                       onClick={() => setShowTitleModal(true)}
                       className="hover:scale-110 transition-transform"
                       title="Modify Title & Description"
                     >
                       <Eye className="h-4 w-4" />
                     </Button>
                     <Button
                       variant="outline"
                       size="icon"
                       onClick={shuffleWheel}
                       className="hover:scale-110 transition-transform"
                       title="Shuffle Wheel"
                     >
                       <RotateCcw className="h-4 w-4" />
                     </Button>
                     <Button
                       variant="outline"
                       size="icon"
                       onClick={onOpenSettings}
                       className="hover:scale-110 transition-transform"
                       title="Settings"
                     >
                       <Settings className="h-4 w-4" />
                     </Button>
                   </div>
                                     <div className="flex space-x-2">
                     <Button
                       variant="outline"
                       size="icon"
                       onClick={() => setShowStats(!showStats)}
                       className="hover:scale-110 transition-transform"
                       title={showStats ? "Hide Stats" : "Show Stats"}
                     >
                       <BarChart3 className="h-4 w-4" />
                     </Button>
                     <Button
                       variant="outline"
                       size="icon"
                       onClick={toggleFullScreen}
                       className="hover:scale-110 transition-transform"
                       title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                     >
                       {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                     </Button>
                   </div>
                </div>
              )}

                             {/* Tab System for different input methods */}
               <Card className="relative z-30 shadow-lg">
                 <CardContent className="p-4">
                   <Tabs value={activeTab} onValueChange={setActiveTab}>
                     <TabsList className="grid w-full grid-cols-4">
                                               <TabsTrigger 
                          value="color-wheel" 
                          className={`flex items-center gap-2 transition-all duration-200 ${
                            activeTab === "color-wheel" 
                              ? "bg-gradient-to-r from-red-500 to-orange-500 !text-white shadow-lg" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                         <Palette className="h-4 w-4" />
                         Color Wheel
                       </TabsTrigger>
                                               <TabsTrigger 
                          value="manual" 
                          className={`flex items-center gap-2 transition-all duration-200 ${
                            activeTab === "manual" 
                              ? "bg-gradient-to-r from-green-500 to-blue-500 !text-white shadow-lg" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                         <Settings className="h-4 w-4" />
                         Manual
                       </TabsTrigger>
                                               <TabsTrigger 
                          value="image" 
                          className={`flex items-center gap-2 transition-all duration-200 ${
                            activeTab === "image" 
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 !text-white shadow-lg" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                         <Image className="h-4 w-4" />
                         Image
                       </TabsTrigger>
                                               <TabsTrigger 
                          value="ai" 
                          className={`flex items-center gap-2 transition-all duration-200 ${
                            activeTab === "ai" 
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 !text-white shadow-lg" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                         <Brain className="h-4 w-4" />
                         AI-Powered
                       </TabsTrigger>
                     </TabsList>

                    <TabsContent value="color-wheel">
                      <ColorWheelControls
                        colorCombination={colorCombination}
                        setColorCombination={setColorCombination}
                        spinningPointerMode={spinningPointerMode}
                        setSpinningPointerMode={setSpinningPointerMode}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                        onReset={resetWheel}
                        showSettings={showSettings}
                        setShowSettings={setShowSettings}
                        confettiEnabled={confettiEnabled}
                        setConfettiEnabled={setConfettiEnabled}
                        soundEnabled={soundEnabled}
                        setSoundEnabled={toggleGlobalSound}
                        resultShowMode={resultShowMode}
                        setResultShowMode={setResultShowMode}
                      />
                    </TabsContent>

                    <TabsContent value="manual">
                      <ManualControls
                        customColors={customColors}
                        setCustomColors={setCustomColors}
                        onReset={resetWheel}
                        showSettings={showSettings}
                        setShowSettings={setShowSettings}
                        confettiEnabled={confettiEnabled}
                        setConfettiEnabled={setConfettiEnabled}
                        soundEnabled={soundEnabled}
                        setSoundEnabled={toggleGlobalSound}
                        resultShowMode={resultShowMode}
                        setResultShowMode={setResultShowMode}
                      />
                    </TabsContent>

                                         <TabsContent value="image">
                       <ImageControls
                         customColors={customColors}
                         setCustomColors={setCustomColors}
                         onReset={resetWheel}
                         showSettings={showSettings}
                         setShowSettings={setShowSettings}
                         confettiEnabled={confettiEnabled}
                         setConfettiEnabled={setConfettiEnabled}
                         soundEnabled={soundEnabled}
                         setSoundEnabled={toggleGlobalSound}
                         resultShowMode={resultShowMode}
                         setResultShowMode={setResultShowMode}
                       />
                     </TabsContent>

                                           <TabsContent value="ai">
                        <div className="space-y-6">
                          {/* AI Palette Generator */}
                          <AIPaletteGenerator
                            onAddColors={(colors, names) => {
                              colors.forEach((color, index) => {
                                const newColor = {
                                  id: Date.now().toString() + Math.random(),
                                  color,
                                  name: names && names[index] ? names[index] : color,
                                  enabled: true
                                };
                                setCustomColors(prev => [...prev, newColor]);
                              });
                            }}
                          />

                          {/* Enhanced Color Naming */}
                          <EnhancedColorNaming
                            color={lastResult[activeTab as keyof typeof lastResult]?.color || "#FF0000"}
                            onNameChange={(name) => {
                              // Update the name of the last result
                              if (lastResult[activeTab as keyof typeof lastResult]) {
                                setLastResult(prev => ({
                                  ...prev,
                                  [activeTab]: {
                                    ...prev[activeTab as keyof typeof prev]!,
                                    name
                                  }
                                }));
                              }
                            }}
                            currentName={lastResult[activeTab as keyof typeof lastResult]?.name}
                          />

                          {/* Color Blindness Simulator */}
                          <ColorBlindnessSimulator
                            color={lastResult[activeTab as keyof typeof lastResult]?.color || "#FF0000"}
                            onColorChange={(color) => {
                              // This could be used to update the current color
                              console.log('Color changed in simulator:', color);
                            }}
                          />

                          {/* AI Color Analysis */}
                          <AIColorAnalysis
                            colors={results[activeTab as keyof typeof results].map(r => r.color)}
                            onAddColor={(color, name) => {
                              const newColor = {
                                id: Date.now().toString(),
                                color,
                                name: name || color,
                                enabled: true
                              };
                              setCustomColors(prev => [...prev, newColor]);
                            }}
                          />

                          {/* AI Color Learning */}
                          <AIColorLearning
                            results={results[activeTab as keyof typeof results]}
                            onAddColor={(color, name) => {
                              const newColor = {
                                id: Date.now().toString(),
                                color,
                                name: name || color,
                                enabled: true
                              };
                              setCustomColors(prev => [...prev, newColor]);
                            }}
                          />
                        </div>
                      </TabsContent>
                   </Tabs>
                </CardContent>
              </Card>

              {/* Enhanced Spin Button - Show for all modes */}
              {(
                <>
                  <Button
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className={`relative z-30 w-full h-16 text-xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg ${
                      activeTab === "color-wheel"
                        ? "bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700"
                        : activeTab === "manual"
                        ? "bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700"
                        : "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700"
                    }`}
                  >
                    {isSpinning ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        SPINNING...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Palette className="h-6 w-6" />
                        SPIN THE COLOR WHEEL
                        <Palette className="h-6 w-6" />
                      </span>
                    )}
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    ✨ Press Ctrl + Enter to spin ✨{activeTab === "color-wheel" && " | 🎨 Full color spectrum"}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title Modal */}
      <TitleModal
        showTitleModal={showTitleModal}
        setShowTitleModal={setShowTitleModal}
        wheelTitle={wheelTitle}
        setWheelTitle={setWheelTitle}
        wheelDescription={wheelDescription}
        setWheelDescription={setWheelDescription}
      />
    </div>
  );
} 