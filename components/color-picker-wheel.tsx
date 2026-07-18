"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/contexts/settings-context"
import { useToast } from "@/hooks/use-toast"
import { WheelDisplay } from "@/components/color-picker-wheel/wheel-display"
import { TitleModal } from "@/components/color-picker-wheel/title-modal"
import { ResultsDisplay } from "@/components/color-picker-wheel/results-display"
import {
  ColorPickerSidebar,
  type ColorPickerModeTab,
} from "@/components/color-picker-wheel/color-picker-sidebar"
import { ColorResultsHistory } from "@/components/color-picker-wheel/color-results-history"
import { ColorThemeSelector } from "@/components/color-picker-wheel/color-theme-selector"
import {
  AchievementsDisplay,
  type Achievement,
} from "@/components/yes-no-picker-wheel/achievements-display"
import { ChallengesDisplay } from "@/components/yes-no-picker-wheel/challenges-display"
import { initializeAchievements, checkAchievements } from "@/lib/achievement-system"
import { initializeChallenges, checkChallenges, type Challenge } from "@/lib/decision-challenges"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"
import { generateIntelligentColorName } from "@/lib/ai-color-utils"
import {
  analyzeSpinData,
  type SpinRecord as AnalyticsSpinRecord,
} from "@/lib/picker-wheel-analytics"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import PickerWheelGameModes from "@/components/picker-wheel-game-modes"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { Palette, Share2, BarChart3, Users, Gamepad2, Trophy, Sparkles } from "lucide-react"
import Confetti from "react-confetti"
import { getColorPickerPalette } from "@/lib/color-picker-palettes"
import type { ColorPickerDeepLink } from "@/lib/color-picker-spokes"
import {
  DEFAULT_COLOR_RESULT_SHOW_MODE,
  formatRgba,
  hexToRgbString,
  rgbStringToRgba,
} from "@/lib/color-formats"

interface ColorPickerWheelProps {
  onOpenSettings?: () => void
  openGamesSignal?: number
  openAchievementsSignal?: number
  /** SEO / deep-link tab (`?tab=`) */
  initialTab?: ColorPickerModeTab
  /** SEO / deep-link combination (`?combo=`) */
  initialCombination?: string
  /** Spoke / palette deep link */
  deepLink?: ColorPickerDeepLink
}

export function ColorPickerWheel({
  onOpenSettings,
  openGamesSignal = 0,
  openAchievementsSignal = 0,
  initialTab,
  initialCombination,
  deepLink,
}: ColorPickerWheelProps = {}) {
  const [isClient, setIsClient] = useState(false)
  const { settings: globalSettings, updateSettings } = useSettings()
  const { settings: localSettings, updateSettings: updateLocalSettings } = useSettingsStore()
  const { toast } = useToast()
  const { getCurrentWheel, updateWheelData, setCurrentTool, createNewWheel, currentWheelId } = useWheelManagerStore()
  const toolType = 'color-picker-wheel';
  const prevWheelId = useRef<string | null>(null)
  const seoDeepLinkKey = useRef<string>("")

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Header → Games / Achievements (same modals as left toolbar)
  useEffect(() => {
    if (openGamesSignal > 0) setShowGameModes(true)
  }, [openGamesSignal])

  useEffect(() => {
    if (openAchievementsSignal > 0) setShowAchievements(true)
  }, [openAchievementsSignal])

  const openSettings = () => {
    if (onOpenSettings) onOpenSettings()
  }

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
  const [activeTab, setActiveTab] = useState<ColorPickerModeTab>(initialTab ?? "color-wheel")
  const [colorCombination, setColorCombination] = useState(initialCombination ?? "complementary")
  const [spinningPointerMode, setSpinningPointerMode] = useState<"manual" | "random">("random")
  const [selectedColor, setSelectedColor] = useState("#FF0000")
  const [customColors, setCustomColors] = useState<Array<{
    id: string
    color: string
    name: string
    enabled: boolean
  }>>([])
  const [showStats, setShowStats] = useState(false)
  const [showAIFeatures, setShowAIFeatures] = useState(true)
  const [confettiEnabled, setConfettiEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(globalSettings.confettiSound.enableSound)
  const [wheelTheme, setWheelTheme] = useState("classic")
  const [showConfetti, setShowConfetti] = useState(false)
  const [wheelShake, setWheelShake] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [showSpinHistory, setShowSpinHistory] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showChallenges, setShowChallenges] = useState(false)
  const [enhancedAchievements, setEnhancedAchievements] = useState<Achievement[]>(() =>
    initializeAchievements([]),
  )
  const [challenges, setChallenges] = useState<Challenge[]>(() => initializeChallenges([]))
  const [totalPoints, setTotalPoints] = useState(0)
  const [recentResults, setRecentResults] = useState<string[]>([])
  const [usedThemes, setUsedThemes] = useState<string[]>(["classic"])
  const [decisionDates, setDecisionDates] = useState<Date[]>([])
  const [colorStreak, setColorStreak] = useState<{ type: string; count: number }>({
    type: "",
    count: 0,
  })
  const [aiUsageCount, setAiUsageCount] = useState(0)
  
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
       rgba?: string
       timestamp: Date
     }>
     "manual": Array<{
       color: string
       name: string
       hex: string
       rgb: string
       rgba?: string
       timestamp: Date
     }>
     "image": Array<{
       color: string
       name: string
       hex: string
       rgb: string
       rgba?: string
       timestamp: Date
     }>
     "ai": Array<{
       color: string
       name: string
       hex: string
       rgb: string
       rgba?: string
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
       rgba?: string
       complementary?: {
         hex: string
         rgb: string
         rgba?: string
       }
     } | null
     "manual": {
       color: string
       name: string
       hex: string
       rgb: string
       rgba?: string
       complementary?: {
         hex: string
         rgb: string
         rgba?: string
       }
     } | null
     "image": {
       color: string
       name: string
       hex: string
       rgb: string
       rgba?: string
       complementary?: {
         hex: string
         rgb: string
         rgba?: string
       }
     } | null
     "ai": {
       color: string
       name: string
       hex: string
       rgb: string
       rgba?: string
       complementary?: {
         hex: string
         rgb: string
         rgba?: string
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
  const [resultShowMode, setResultShowMode] = useState(DEFAULT_COLOR_RESULT_SHOW_MODE)
  const [colorAlpha, setColorAlpha] = useState(1)
  
  // Result Action Modes
  const [resultActionMode, setResultActionMode] = useState<"normal" | "elimination">("normal")
  const [eliminatedColors, setEliminatedColors] = useState<Set<string>>(new Set())

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const animationRef = useRef<number | null>(null)
  const isSpinningRef = useRef(false)
  const spinAudioRef = useRef<SpinAudioController | null>(null)
  const rotationRef = useRef(0)

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
         
         setActiveTab((d.activeTab as ColorPickerModeTab) || "color-wheel");
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
         setResultShowMode({
           ...DEFAULT_COLOR_RESULT_SHOW_MODE,
           ...(d.resultShowMode || {}),
         });
         if (typeof d.colorAlpha === "number") setColorAlpha(d.colorAlpha);
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
         setResultShowMode({ ...DEFAULT_COLOR_RESULT_SHOW_MODE });
         setColorAlpha(1);
         setResultActionMode("normal");
         setEliminatedColors(new Set());
         
         console.log('Set default data for existing wheel with no data')
       }

      if (initialTab) setActiveTab(initialTab)
      if (initialCombination) setColorCombination(initialCombination)

      if (deepLink?.palette) {
        const swatches = getColorPickerPalette(deepLink.palette)
        setCustomColors(
          swatches.map((swatch, i) => ({
            id: `seo-${deepLink.palette}-${i}`,
            color: swatch.color,
            name: swatch.name,
            enabled: true,
          })),
        )
        setActiveTab(deepLink.tab ?? "manual")
        if (deepLink.toolTitle) setWheelTitle(deepLink.toolTitle)
        if (deepLink.toolDescription) setWheelDescription(deepLink.toolDescription)
        setEliminatedColors(new Set())
        seoDeepLinkKey.current = JSON.stringify({
          palette: deepLink.palette,
          tab: deepLink.tab ?? null,
          combination: deepLink.combination ?? null,
          title: deepLink.toolTitle ?? null,
        })
      }
      
      prevWheelId.current = wheel.id
    }
  }, [getCurrentWheel, currentWheelId, isClient, initialTab, initialCombination, deepLink])

  // SEO / spoke deep links (palette + tab + combo + titles)
  useEffect(() => {
    if (!isClient) return
    const key = JSON.stringify({
      palette: deepLink?.palette ?? null,
      tab: deepLink?.tab ?? initialTab ?? null,
      combination: deepLink?.combination ?? initialCombination ?? null,
      title: deepLink?.toolTitle ?? null,
    })
    if (!key || key === seoDeepLinkKey.current) return
    if (
      !deepLink?.palette &&
      !deepLink?.tab &&
      !deepLink?.combination &&
      !deepLink?.toolTitle &&
      !initialTab &&
      !initialCombination
    ) {
      return
    }

    seoDeepLinkKey.current = key

    const tab = deepLink?.tab ?? initialTab
    const combo = deepLink?.combination ?? initialCombination
    if (tab) setActiveTab(tab)
    if (combo) setColorCombination(combo)
    if (deepLink?.toolTitle) setWheelTitle(deepLink.toolTitle)
    if (deepLink?.toolDescription) setWheelDescription(deepLink.toolDescription)

    if (deepLink?.palette) {
      const swatches = getColorPickerPalette(deepLink.palette)
      setCustomColors(
        swatches.map((swatch, i) => ({
          id: `seo-${deepLink.palette}-${i}`,
          color: swatch.color,
          name: swatch.name,
          enabled: true,
        })),
      )
      setActiveTab(deepLink.tab ?? "manual")
      setEliminatedColors(new Set())
    }
  }, [isClient, deepLink, initialTab, initialCombination])

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
        colorAlpha,
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
      colorAlpha,
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
    const complementaryHue = (hue + 180) % 360
    const hex = hslToHex(complementaryHue, 100, 50)
    const rgb = hslToRgb(complementaryHue, 100, 50)
      .map((n) => Math.round(n))
      .join(", ")
    return {
      hex,
      rgb,
      rgba: formatRgba(hex, colorAlpha),
    }
  }

  // Spin wheel function
  const spinWheel = () => {
    if (isSpinning || isSpinningRef.current) return

    const currentSegments = generateSegments()
    if (currentSegments.length === 0) return

    const availableSegments =
      resultActionMode === "elimination"
        ? currentSegments.filter((segment) => !eliminatedColors.has(segment.color))
        : currentSegments

    if (availableSegments.length === 0) return

    isSpinningRef.current = true
    setIsSpinning(true)
    setWheelShake(true)
    setShowParticles(true)

    const soundCfg = useSettingsStore.getState().settings.confettiSound
    const soundOn = soundCfg?.enableSound !== false && soundEnabled
    const volume = soundCfg?.soundVolume || 0.5

    if (soundOn) {
      try {
        if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
        spinAudioRef.current.startWhoosh("/wheel-sound.mp3", volume)
      } catch {
        // ignore autoplay
      }
    }

    const durationSec = Math.max(0.5, localSettings.spinBehavior?.spinningDuration || 4)
    const duration = durationSec * 1000
    const spins = 5 + Math.random() * 5
    const finalAngle = Math.random() * 360
    const totalRotation = spins * 360 + finalAngle
    const startTime = Date.now()
    const startRotation = rotationRef.current
    const tickSegments =
      activeTab === "color-wheel" ? 24 : Math.max(availableSegments.length, 1)

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentRotation = startRotation + totalRotation * easeOut

      rotationRef.current = currentRotation
      setRotation(currentRotation)

      if (soundOn && spinAudioRef.current) {
        try {
          spinAudioRef.current.syncFrame(currentRotation, tickSegments, volume, null)
        } catch {
          // ignore
        }
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Finished — resolve winner
      spinAudioRef.current?.stop()

      const normalizedRotation = ((currentRotation % 360) + 360) % 360
      const segmentSize = 360 / availableSegments.length
      const segmentIndex =
        Math.floor(((360 - normalizedRotation) % 360) / segmentSize) %
        availableSegments.length
      const segment = availableSegments[segmentIndex]

      let result: {
        color: string
        name: string
        hex: string
        rgb: string
        rgba: string
        complementary?: { hex: string; rgb: string; rgba?: string }
      }

      if (activeTab === "color-wheel") {
        const hue = Math.round(segment.startAngle) % 360
        const hex = hslToHex(hue, 100, 50)
        const rgb = hslToRgb(hue, 100, 50)
          .map((n) => Math.round(n))
          .join(", ")
        const complementary = getComplementaryColor(hue)
        result = {
          color: segment.color,
          name: `Hue ${hue}°`,
          hex,
          rgb,
          rgba: formatRgba(hex, colorAlpha),
          complementary: {
            hex: complementary.hex,
            rgb: complementary.rgb,
            rgba: complementary.rgba,
          },
        }
      } else {
        const hex = segment.color
        const rgb = hexToRgbString(hex)
        result = {
          color: segment.color,
          name: segment.label,
          hex,
          rgb,
          rgba: formatRgba(hex, colorAlpha),
        }
      }

      setLastResult((prev) => ({
        ...prev,
        [activeTab]: result,
      }))

      setResults((prev) => ({
        ...prev,
        [activeTab]: [
          {
            color: result.color,
            name: result.name,
            hex: result.hex,
            rgb: result.rgb,
            rgba: result.rgba,
            timestamp: new Date(),
          },
          ...prev[activeTab as keyof typeof prev].slice(0, 99),
        ],
      }))

      setTotalSpins((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab as keyof typeof prev] + 1,
      }))

      const resultLabel = result.name || result.hex || result.color
      const nextLifetimeSpins =
        Object.values(totalSpins).reduce((sum, n) => sum + n, 0) + 1
      const nextRecent = [...recentResults.slice(-9), resultLabel]
      const nextThemes = usedThemes.includes(wheelTheme)
        ? usedThemes
        : [...usedThemes, wheelTheme]
      const nextDates = [...decisionDates, new Date()]
      const nextStreak =
        colorStreak.type === resultLabel
          ? { type: resultLabel, count: colorStreak.count + 1 }
          : { type: resultLabel, count: 1 }
      const nextAiUsage = aiUsageCount + (activeTab === "ai" ? 1 : 0)
      const stubResults = {
        yes: nextLifetimeSpins,
        no: 0,
        maybe: 0,
      }

      setRecentResults(nextRecent)
      setUsedThemes(nextThemes)
      setDecisionDates(nextDates)
      setColorStreak(nextStreak)
      if (activeTab === "ai") setAiUsageCount(nextAiUsage)

      setEnhancedAchievements((prevAchievements) => {
        const { updatedAchievements } = checkAchievements(
          prevAchievements,
          nextLifetimeSpins,
          stubResults,
          nextStreak,
          activeTab === "ai" ? "ai" : "manual",
          nextRecent,
          nextThemes,
          nextDates,
        )
        return updatedAchievements
      })

      setChallenges((prevChallenges) => {
        const { updatedChallenges, totalPoints: newTotalPoints } = checkChallenges(
          prevChallenges,
          nextLifetimeSpins,
          stubResults,
          nextStreak,
          activeTab === "ai" ? "ai" : "manual",
          nextRecent,
          nextAiUsage,
          nextDates,
        )
        setTotalPoints(newTotalPoints)
        return updatedChallenges
      })

      if (resultActionMode === "elimination") {
        setEliminatedColors((prev) => new Set([...prev, result.color]))
      }

      if (soundOn) {
        try {
          const audio = new Audio("/sound-win.mp3")
          audio.volume = volume
          void audio.play()
        } catch {
          // ignore
        }
      }

      const confettiOn = soundCfg?.enableConfetti !== false && confettiEnabled
      if (confettiOn) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }

      isSpinningRef.current = false
      setIsSpinning(false)
      setWheelShake(false)
      setShowParticles(false)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

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
    const randomRotation = Math.random() * 360
    rotationRef.current = randomRotation
    setRotation(randomRotation)
    setWheelShake(true)
    setTimeout(() => setWheelShake(false), 500)
  }

  // Sound enable/disable (accepts boolean for Switch + mute button)
  const applySoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled)
    const latest = useSettingsStore.getState().settings
    updateLocalSettings({
      confettiSound: {
        ...latest.confettiSound,
        enableSound: enabled,
      },
    } as any)
    updateSettings({
      confettiSound: {
        ...globalSettings.confettiSound,
        enableSound: enabled,
      },
    })
  }

  const toggleGlobalSound = () => {
    applySoundEnabled(!soundEnabled)
  }

  // Share function
  const shareResult = async () => {
    const currentLastResult = lastResult[activeTab as keyof typeof lastResult]
    const rgbaText = currentLastResult?.hex
      ? formatRgba(currentLastResult.hex, colorAlpha)
      : currentLastResult?.rgb
        ? rgbStringToRgba(currentLastResult.rgb, colorAlpha)
        : ""
    const text = currentLastResult
      ? `I just got "${currentLastResult.name}" (${currentLastResult.hex}${rgbaText ? ` / ${rgbaText}` : ""}) on the Color Picker Wheel! 🎨`
      : `Try the Color Picker Wheel — pick a random color by spinning! ${typeof window !== "undefined" ? window.location.href : ""}`

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ text, title: "Color Picker Wheel" })
        return
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        toast({
          title: currentLastResult ? "Result copied" : "Link copied",
          description: currentLastResult
            ? "Your color result is on the clipboard."
            : "Spin once to share a color result, or paste this link anywhere.",
        })
        return
      }
      toast({
        title: "Unable to share",
        description: "Clipboard and share are not available in this browser.",
        variant: "destructive",
      })
    } catch {
      // User cancelled native share — ignore
    }
  }

  // Toggle full screen (CSS overlay — matches Yes/No / Letter)
  const toggleFullScreen = () => {
    setIsFullScreen((v) => !v)
  }

  // Keyboard: Ctrl+Enter spin, Escape exit fullscreen
  useEffect(() => {
    if (!isClient) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault()
        spinWheel()
      }
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSpinning, isClient, isFullScreen])

  // Sync local sound state with global settings
  useEffect(() => {
    setSoundEnabled(globalSettings.confettiSound.enableSound)
  }, [globalSettings.confettiSound.enableSound])

  // Cleanup animation / audio on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      spinAudioRef.current?.stop()
    }
  }, [])

  const currentResults = results[activeTab as keyof typeof results] || []
  const colorAnalytics = useMemo(
    () =>
      analyzeSpinData(
        currentResults.map(
          (r, i): AnalyticsSpinRecord => ({
            id: `${activeTab}-${i}-${String(r.timestamp)}`,
            timestamp: r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp),
            result: r.name || r.hex || r.color,
            options:
              activeTab === "color-wheel"
                ? ["spectrum"]
                : customColors.filter((c) => c.enabled).map((c) => c.name || c.color),
            mode: activeTab === "ai" ? "ai" : "manual",
            theme: wheelTheme,
            spinDuration: 0,
          }),
        ),
      ),
    [currentResults, activeTab, customColors, wheelTheme],
  )

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
    <div className={`relative overflow-hidden ${isFullScreen ? "fixed inset-0 z-50 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50" : ""}`}>
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={400} recycle={false} />
        </div>
      )}

      <div className="relative z-10 w-full">
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Wheel column (left) */}
          <div
            className={`relative overflow-hidden bg-white p-4 sm:p-6 ${
              isFullScreen
                ? "lg:col-span-3"
                : "rounded-lg border shadow-sm lg:col-span-2"
            }`}
          >
            {!isFullScreen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSpinHistory(true)}
                className="absolute left-4 top-4 z-10 border-blue-500 bg-white px-3 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50"
              >
                Results
                {results[activeTab as keyof typeof results]?.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {results[activeTab as keyof typeof results].length}
                  </Badge>
                )}
              </Button>
            )}

            <div className="flex flex-col items-center space-y-6 pt-8">
              {resultActionMode === "elimination" && eliminatedColors.size > 0 && !isFullScreen && (
                <Badge variant="secondary">
                  {Math.max(
                    (activeTab === "color-wheel"
                      ? 360
                      : customColors.filter((c) => c.enabled).length) - eliminatedColors.size,
                    0,
                  )}{" "}
                  left on wheel
                </Badge>
              )}

              <WheelDisplay
                segments={segments}
                wheelBackground={
                  activeTab === "color-wheel"
                    ? "conic-gradient(from 0deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))"
                    : `conic-gradient(from 0deg, ${segments
                        .map((s) => {
                          const isEliminated =
                            resultActionMode === "elimination" && eliminatedColors.has(s.color)
                          const color = isEliminated ? "#cccccc" : s.color
                          return `${color} ${s.startAngle}deg ${s.startAngle + s.angle}deg`
                        })
                        .join(", ")})`
                }
                rotation={rotation}
                isSpinning={isSpinning}
                wheelShake={wheelShake}
                showParticles={showParticles}
                activeTab={activeTab}
                onSpin={spinWheel}
                soundEnabled={soundEnabled}
                setSoundEnabled={applySoundEnabled}
                isFullScreen={isFullScreen}
                onToggleFullscreen={toggleFullScreen}
                wheelTheme={wheelTheme}
              />

              {lastResult[activeTab as keyof typeof lastResult] && !isSpinning && (
                <div className="w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center shadow-lg">
                  <h3 className="mb-2 text-lg font-semibold text-green-800">🎉 Color picked!</h3>
                  <div className="mb-2 flex items-center justify-center gap-3">
                    <span
                      className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                        backgroundSize: "8px 8px",
                        backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
                      }}
                    >
                      <span
                        className="absolute inset-0"
                        style={{
                          backgroundColor: (() => {
                            const current = lastResult[activeTab as keyof typeof lastResult]
                            const hex = current?.hex || current?.color
                            return hex
                              ? formatRgba(hex, colorAlpha)
                              : current?.color || "#ccc"
                          })(),
                        }}
                      />
                    </span>
                    <p className="text-xl font-bold text-green-900">
                      {lastResult[activeTab as keyof typeof lastResult]?.name ||
                        lastResult[activeTab as keyof typeof lastResult]?.color}
                    </p>
                  </div>
                  {(resultShowMode.hex || resultShowMode.rgb || resultShowMode.rgba) && (
                    <p className="space-y-0.5 text-sm text-slate-600">
                      {resultShowMode.hex && (
                        <span className="block font-mono">
                          {lastResult[activeTab as keyof typeof lastResult]?.hex ||
                            lastResult[activeTab as keyof typeof lastResult]?.color}
                        </span>
                      )}
                      {resultShowMode.rgb &&
                        lastResult[activeTab as keyof typeof lastResult]?.rgb && (
                          <span className="block font-mono">
                            rgb({lastResult[activeTab as keyof typeof lastResult]?.rgb})
                          </span>
                        )}
                      {resultShowMode.rgba &&
                        (lastResult[activeTab as keyof typeof lastResult]?.hex ||
                          lastResult[activeTab as keyof typeof lastResult]?.rgb) && (
                          <span className="block font-mono">
                            {lastResult[activeTab as keyof typeof lastResult]?.hex
                              ? formatRgba(
                                  lastResult[activeTab as keyof typeof lastResult]!.hex,
                                  colorAlpha,
                                )
                              : rgbStringToRgba(
                                  lastResult[activeTab as keyof typeof lastResult]!.rgb,
                                  colorAlpha,
                                )}
                          </span>
                        )}
                    </p>
                  )}
                  <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={shareResult}>
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </Button>
                </div>
              )}

              {activeTab !== "color-wheel" &&
                customColors.filter((c) => c.enabled).length === 0 && (
                  <p className="text-center text-sm text-slate-500">
                    No colors on the wheel — add colors in Manual, Image, or AI, then spin.
                  </p>
                )}

              <Button
                onClick={spinWheel}
                disabled={
                  isSpinning ||
                  (activeTab !== "color-wheel" &&
                    customColors.filter((c) => c.enabled).length === 0)
                }
                className={`px-12 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl ${
                  activeTab === "ai"
                    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700"
                    : activeTab === "color-wheel"
                      ? "bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700"
                      : activeTab === "manual"
                        ? "bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700"
                        : "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700"
                }`}
              >
                {isSpinning ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Spinning...
                  </span>
                ) : activeTab === "ai" ? (
                  "🧠 SPIN WITH AI"
                ) : (
                  <span className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    SPIN THE COLOR WHEEL
                  </span>
                )}
              </Button>

              {localSettings.display?.showSpinCount && (
                <div className="text-sm text-gray-500">
                  Total spins: {totalSpins[activeTab as keyof typeof totalSpins]}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowThemeSelector(true)}
                  className="relative border-purple-500 px-3 py-1 text-xs text-purple-600 hover:border-purple-600 hover:bg-purple-50"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Themes
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnalytics(true)}
                  className="relative border-green-500 px-3 py-1 text-xs text-green-600 hover:border-green-600 hover:bg-green-50"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                  {results[activeTab as keyof typeof results]?.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {results[activeTab as keyof typeof results].length}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSocialHub(true)}
                  className="relative border-orange-500 px-3 py-1 text-xs text-orange-600 hover:border-orange-600 hover:bg-orange-50"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Social
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGameModes(true)}
                  className="relative border-red-500 px-3 py-1 text-xs text-red-600 hover:border-red-600 hover:bg-red-50"
                >
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Games
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAchievements(true)}
                  className="relative border-yellow-500 px-3 py-1 text-xs text-yellow-600 hover:border-yellow-600 hover:bg-yellow-50"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Achievements
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {totalPoints}
                  </Badge>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChallenges(true)}
                  className="relative border-sky-500 px-3 py-1 text-xs text-sky-600 hover:border-sky-600 hover:bg-sky-50"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Challenges
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareResult}
                  className="relative border-slate-400 px-3 py-1 text-xs text-slate-600 hover:border-slate-500 hover:bg-slate-50"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar column */}
          {!isFullScreen && (
            <div className="space-y-4 lg:col-span-1">
              <ResultsDisplay
                results={results[activeTab as keyof typeof results]}
                lastResult={lastResult[activeTab as keyof typeof lastResult]}
                inputMethod={activeTab}
                activeTab={activeTab}
                resultShowMode={resultShowMode}
                colorAlpha={colorAlpha}
                showStats={showStats}
                totalSpins={totalSpins[activeTab as keyof typeof totalSpins]}
              />

              {showInputs ? (
                <ColorPickerSidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  resultActionMode={resultActionMode}
                  setResultActionMode={setResultActionMode}
                  eliminatedCount={eliminatedColors.size}
                  onRestoreEliminated={() => setEliminatedColors(new Set())}
                  activeCount={
                    activeTab === "color-wheel"
                      ? 360
                      : customColors.filter((c) => c.enabled).length
                  }
                  colorCombination={colorCombination}
                  setColorCombination={setColorCombination}
                  spinningPointerMode={spinningPointerMode}
                  setSpinningPointerMode={setSpinningPointerMode}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  customColors={customColors}
                  setCustomColors={setCustomColors}
                  onReset={resetWheel}
                  confettiEnabled={confettiEnabled}
                  setConfettiEnabled={setConfettiEnabled}
                  soundEnabled={soundEnabled}
                  setSoundEnabled={applySoundEnabled}
                  resultShowMode={resultShowMode}
                  setResultShowMode={setResultShowMode}
                  colorAlpha={colorAlpha}
                  setColorAlpha={setColorAlpha}
                  lastResult={lastResult[activeTab as keyof typeof lastResult]}
                  results={results[activeTab as keyof typeof results]}
                  onOpenTitleModal={() => setShowTitleModal(true)}
                  onShuffle={shuffleWheel}
                  onHideInputs={() => setShowInputs(false)}
                  showStats={showStats}
                  setShowStats={setShowStats}
                  isFullScreen={isFullScreen}
                  onToggleFullscreen={toggleFullScreen}
                  onViewResults={() => setShowSpinHistory(true)}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  onOpenSettings={openSettings}
                  onOpenAchievements={() => setShowAchievements(true)}
                  onOpenChallenges={() => setShowChallenges(true)}
                  resultsCount={results[activeTab as keyof typeof results]?.length || 0}
                  historyCount={results[activeTab as keyof typeof results]?.length || 0}
                  totalPoints={totalPoints}
                  onAddAiColors={(colors, names) => {
                    colors.forEach((color, index) => {
                      const newColor = {
                        id: Date.now().toString() + Math.random(),
                        color,
                        name: names && names[index] ? names[index] : color,
                        enabled: true,
                      }
                      setCustomColors((prev) => [...prev, newColor])
                    })
                  }}
                  onUpdateLastResultName={(name) => {
                    if (lastResult[activeTab as keyof typeof lastResult]) {
                      setLastResult((prev) => ({
                        ...prev,
                        [activeTab]: {
                          ...prev[activeTab as keyof typeof prev]!,
                          name,
                        },
                      }))
                    }
                  }}
                  onAddSingleColor={(color, name) => {
                    setCustomColors((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        color,
                        name: name || color,
                        enabled: true,
                      },
                    ])
                  }}
                />
              ) : (
                <Button variant="outline" onClick={() => setShowInputs(true)}>
                  Show inputs
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <TitleModal
        showTitleModal={showTitleModal}
        setShowTitleModal={setShowTitleModal}
        wheelTitle={wheelTitle}
        setWheelTitle={setWheelTitle}
        wheelDescription={wheelDescription}
        setWheelDescription={setWheelDescription}
      />

      <ColorResultsHistory
        results={currentResults}
        isVisible={showSpinHistory}
        onClose={() => setShowSpinHistory(false)}
        modeLabel={activeTab}
        onClear={() =>
          setResults((prev) => ({
            ...prev,
            [activeTab]: [],
          }))
        }
      />

      <ColorThemeSelector
        isVisible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        wheelTheme={wheelTheme}
        setWheelTheme={setWheelTheme}
      />

      <PickerWheelAnalyticsDisplay
        analytics={colorAnalytics}
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      <PickerWheelSocialHub
        isVisible={showSocialHub}
        onClose={() => setShowSocialHub(false)}
        onShareWheel={shareResult}
      />

      <PickerWheelGameModes
        isVisible={showGameModes}
        onClose={() => setShowGameModes(false)}
        userPoints={totalPoints}
        onStartGame={() => {
          setShowGameModes(false)
          setShowChallenges(true)
        }}
      />

      <AchievementsDisplay
        achievements={enhancedAchievements}
        totalSpins={Object.values(totalSpins).reduce((sum, n) => sum + n, 0)}
        results={{
          yes: Object.values(totalSpins).reduce((sum, n) => sum + n, 0),
          no: 0,
          maybe: 0,
        }}
        streak={colorStreak}
        activeTab={activeTab === "ai" ? "ai" : "manual"}
        isVisible={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <ChallengesDisplay
        challenges={challenges}
        totalSpins={Object.values(totalSpins).reduce((sum, n) => sum + n, 0)}
        results={{
          yes: Object.values(totalSpins).reduce((sum, n) => sum + n, 0),
          no: 0,
          maybe: 0,
        }}
        streak={colorStreak}
        activeTab={activeTab === "ai" ? "ai" : "manual"}
        isVisible={showChallenges}
        onClose={() => setShowChallenges(false)}
      />
    </div>
  )
} 