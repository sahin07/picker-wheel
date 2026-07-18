"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"
import { WheelDisplay } from "@/components/yes-no-picker-wheel/wheel-display"
import { ResultsDisplay } from "@/components/yes-no-picker-wheel/results-display"
import { BackgroundEffects } from "@/components/yes-no-picker-wheel/background-effects"
import { TitleModal } from "@/components/yes-no-picker-wheel/title-modal"
import { YesNoPickerSidebar } from "@/components/yes-no-picker-wheel/yes-no-picker-sidebar"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useYesNoWheelStore } from "@/stores/yes-no-wheel-store"
import { useSettingsStore } from "@/stores/settings-store"
import { Brain, Sparkles, Zap } from "lucide-react"
import { AchievementsDisplay, Achievement } from "@/components/yes-no-picker-wheel/achievements-display"
import { initializeAchievements, checkAchievements } from "@/lib/achievement-system"
import { ChallengesDisplay, Challenge } from "@/components/yes-no-picker-wheel/challenges-display"
import { initializeChallenges, checkChallenges } from "@/lib/decision-challenges"
import { ThemeSelector } from "@/components/yes-no-picker-wheel/theme-selector"
import { WHEEL_THEMES, WheelTheme, checkThemeUnlocks } from "@/lib/wheel-themes"
import { SpinHistory, SpinRecord } from "@/components/yes-no-picker-wheel/spin-history"

export function YesNoPickerWheel() {
  const [isClient, setIsClient] = useState(false)
  const { settings: globalSettings, updateSettings } = useSettings()
  const { settings: localSettings } = useSettingsStore()
  const { getCurrentWheel, updateWheelData, setCurrentTool, createNewWheel, currentWheelId } = useWheelManagerStore()
  const toolType = 'yes-no-picker-wheel';
  const prevWheelId = useRef<string | null>(null)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize enhanced achievements, challenges, themes, and spin history
  useEffect(() => {
    if (!isClient) return
    setEnhancedAchievements(initializeAchievements([]))
    setChallenges(initializeChallenges([]))
    setThemes(WHEEL_THEMES)
    setSpinHistory([])
  }, [isClient])

  // Initialize tool and wheel
  useEffect(() => {
    if (!isClient) return
    
    setCurrentTool("yes-no-picker-wheel")
    if (typeof window !== "undefined") {
      const wheel = getCurrentWheel()
      if (!wheel) {
        const newWheelId = createNewWheel("yes-no-picker-wheel", "Yes or No Picker Wheel")
        console.log('Created new yes/no picker wheel with ID:', newWheelId)
        
        // Check the created wheel data
        setTimeout(() => {
          const createdWheel = getCurrentWheel()
          console.log('Created wheel data:', createdWheel?.data)
        }, 100)
      } else {
        console.log('Existing wheel found:', wheel.id, wheel.data)
      }
    }
  }, [setCurrentTool, getCurrentWheel, createNewWheel, isClient])

  // State management - use default values directly
  const [activeTab, setActiveTab] = useState("manual")
  const [mode, setMode] = useState<"yes-no" | "yes-no-maybe">("yes-no")
  const [inputSets, setInputSets] = useState(1)
  const [userQuestion, setUserQuestion] = useState("")
  const [aiAdvice, setAiAdvice] = useState("")
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [confettiEnabled, setConfettiEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(globalSettings.confettiSound.enableSound)
  const [wheelTheme, setWheelTheme] = useState("classic")
  const [showConfetti, setShowConfetti] = useState(false)
  const [wheelShake, setWheelShake] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  
  // Title and description state
  const [wheelTitle, setWheelTitle] = useState("Yes or No Picker Wheel")
  const [wheelDescription, setWheelDescription] = useState("Make decisions with a simple spin of the wheel")
  const [showTitleModal, setShowTitleModal] = useState(false)
  const [optionLabels, setOptionLabels] = useState({ yes: "YES", no: "NO", maybe: "MAYBE" })
  const [customColors, setCustomColors] = useState<{ yes: string; no: string; maybe: string } | null>(
    null,
  )

  // Results and statistics
  const [results, setResults] = useState({ yes: 0, no: 0, maybe: 0 })
  const [lastResult, setLastResult] = useState<string | null>(null)
  const [totalSpins, setTotalSpins] = useState(0)
  const [streak, setStreak] = useState({ type: "", count: 0 })
  const [achievements, setAchievements] = useState<string[]>([])
  const [aiContext, setAiContext] = useState("")

  // Enhanced Achievement System
  const [enhancedAchievements, setEnhancedAchievements] = useState<Achievement[]>([])
  const [showAchievements, setShowAchievements] = useState(false)
  const [recentResults, setRecentResults] = useState<string[]>([])
  const [decisionDates, setDecisionDates] = useState<Date[]>([])
  const [usedThemes, setUsedThemes] = useState<string[]>([])
  const [aiUsageCount, setAiUsageCount] = useState(0)

  // Decision Challenges System
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [showChallenges, setShowChallenges] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)

  // Theme System
  const [themes, setThemes] = useState<WheelTheme[]>(WHEEL_THEMES)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [newlyUnlockedThemes, setNewlyUnlockedThemes] = useState<string[]>([])

  // Spin History System
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([])
  const [showSpinHistory, setShowSpinHistory] = useState(false)

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const animationRef = useRef<number | null>(null)
  const isUpdatingRef = useRef(false)

  // Temporarily disable wheel store updates to prevent infinite re-renders
  // useEffect(() => {
  //   if (!isClient || !wheelId || isUpdatingRef.current) return;
    
  //   const timeoutId = setTimeout(() => {
  //     wheelManager.updateWheelData(toolType, wheelId, {
  //       activeTab, mode, inputSets, userQuestion, aiAdvice, showStats, confettiEnabled,
  //       wheelTheme, results, lastResult, totalSpins, streak, achievements, aiContext, wheelTitle, wheelDescription
  //     });
  //   }, 100); // Debounce for 100ms
    
  //   return () => clearTimeout(timeoutId);
  // }, [activeTab, mode, inputSets, userQuestion, aiAdvice, showStats, confettiEnabled,
  //     wheelTheme, results, lastResult, totalSpins, streak, achievements, aiContext, wheelTitle, wheelDescription, wheelId, isClient]);

  // Load wheel data when switching wheels
  useEffect(() => {
    if (!isClient) return
    
    const wheel = getCurrentWheel()
    if (!wheel) return
    
    // Check if this is a different wheel (wheel switching)
    if (prevWheelId.current !== wheel.id) {
      console.log('Switching to yes/no wheel:', wheel.id, wheel.name, wheel.data)
      
      // Reset all states first
      setLastResult(null)
      setIsSpinning(false)
      setRotation(0)
      setWheelShake(false)
      setShowParticles(false)
      setShowConfetti(false)
      
      if (wheel.data && Object.keys(wheel.data).length > 0) {
        const d = wheel.data as any;
        console.log('Loading wheel data:', d)
        
        setActiveTab(d.activeTab || "manual");
        setMode(d.mode || "yes-no");
        setInputSets(d.inputSets || 1);
        setUserQuestion(d.userQuestion || "");
        setAiAdvice(d.aiAdvice || "");
        setShowStats(d.showStats || false);
        setConfettiEnabled(d.confettiEnabled ?? true);
        setWheelTheme(d.wheelTheme || "classic");
        setWheelTitle(d.wheelTitle || "Yes or No Picker Wheel");
        setWheelDescription(d.wheelDescription || "Make decisions with a simple spin of the wheel");
        setResults(d.results || { yes: 0, no: 0, maybe: 0 });
        setLastResult(d.lastResult || null);
        setTotalSpins(d.totalSpins || 0);
        setStreak(d.streak || { type: "", count: 0 });
        setAchievements(d.achievements || []);
        setAiContext(d.aiContext || "");
        
        // Load enhanced achievement data
        setEnhancedAchievements(initializeAchievements(d.enhancedAchievements || []));
        setRecentResults(d.recentResults || []);
        setDecisionDates(d.decisionDates ? d.decisionDates.map((date: string) => new Date(date)) : []);
        setUsedThemes(d.usedThemes || []);
        setAiUsageCount(d.aiUsageCount || 0);
        
        // Load challenges data
        setChallenges(initializeChallenges(d.challenges || []));
        setTotalPoints(d.totalPoints || 0);
        
        // Load themes data
        setThemes(d.themes || WHEEL_THEMES);
        
        // Load spin history data
        setSpinHistory(d.spinHistory ? d.spinHistory.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        })) : []);
        
        console.log('Loaded existing wheel data for wheel:', wheel.id)
      } else {
        // Wheel exists but has no data, set defaults
        console.log('No data found for wheel:', wheel.id, 'setting defaults')
        
        setActiveTab("manual");
        setMode("yes-no");
        setInputSets(1);
        setUserQuestion("");
        setAiAdvice("");
        setShowStats(false);
        setConfettiEnabled(true);
        setWheelTheme("classic");
        setWheelTitle("Yes or No Picker Wheel");
        setWheelDescription("Make decisions with a simple spin of the wheel");
        setResults({ yes: 0, no: 0, maybe: 0 });
        setLastResult(null);
        setTotalSpins(0);
        setStreak({ type: "", count: 0 });
        setAchievements([]);
        setAiContext("");
        
        // Reset challenges data
        setChallenges(initializeChallenges([]));
        setTotalPoints(0);
        
        // Reset themes data
        setThemes(WHEEL_THEMES);
        
        console.log('Set default data for existing wheel with no data')
      }
      
      prevWheelId.current = wheel.id
    }
  }, [getCurrentWheel, currentWheelId, isClient])

  // Unified sync for all wheel data
  const syncWheelData = useCallback((data: any) => {
    const wheel = getCurrentWheel()
    if (wheel) {
      updateWheelData("yes-no-picker-wheel", wheel.id, data)
    }
  }, [getCurrentWheel, updateWheelData])

  // Save wheel data whenever important state changes
  useEffect(() => {
    const wheel = getCurrentWheel()
    if (wheel && isClient) {
      const wheelData = {
        activeTab,
        mode,
        inputSets,
        userQuestion,
        aiAdvice,
        showStats,
        confettiEnabled,
        wheelTheme,
        results,
        lastResult,
        totalSpins,
        streak,
        achievements,
        aiContext,
        wheelTitle,
        wheelDescription,
        enhancedAchievements,
        recentResults,
        decisionDates: decisionDates.map(date => date.toISOString()),
        usedThemes,
        aiUsageCount,
        challenges,
        totalPoints,
        themes,
        spinHistory: spinHistory.map(record => ({
          ...record,
          timestamp: record.timestamp.toISOString()
        })),
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
  }, [activeTab, mode, inputSets, userQuestion, aiAdvice, showStats, confettiEnabled,
      wheelTheme, results, lastResult, totalSpins, streak, achievements, aiContext, 
      wheelTitle, wheelDescription, enhancedAchievements, recentResults, decisionDates, 
      usedThemes, aiUsageCount, challenges, totalPoints, themes, spinHistory, syncWheelData, isClient])

  // Generate wheel segments based on mode and input sets
  const generateSegments = () => {
    const currentTheme = themes.find((t) => t.id === wheelTheme) || themes[0]
    const themeColors = customColors ?? currentTheme.colors
    const segments = []
    const totalSegments = mode === "yes-no" ? inputSets * 2 : inputSets * 3
    const anglePerSegment = 360 / totalSegments

    for (let i = 0; i < totalSegments; i++) {
      let label = ""
      let color = ""

      if (mode === "yes-no") {
        label = i % 2 === 0 ? optionLabels.yes : optionLabels.no
        color = i % 2 === 0 ? themeColors.yes : themeColors.no
      } else {
        const option = i % 3
        if (option === 0) {
          label = optionLabels.yes
          color = themeColors.yes
        } else if (option === 1) {
          label = optionLabels.no
          color = themeColors.no
        } else {
          label = optionLabels.maybe
          color = themeColors.maybe
        }
      }

      segments.push({
        label,
        color,
        angle: anglePerSegment,
        startAngle: i * anglePerSegment,
      })
    }

    return segments
  }

  const segments = generateSegments();

  // AI advice generation
  const generateAdvice = async () => {
    if (!userQuestion.trim()) return;

    setIsGeneratingAdvice(true);
    try {
      // Simulate AI API call - replace with actual AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const advice = `Based on your question "${userQuestion}", I've analyzed the situation and created a decision wheel with ${inputSets} set(s) of options. The wheel will help you make an informed decision by considering multiple perspectives.`;
      
      setAiAdvice(advice);
      setAiContext(advice);
    } catch (error) {
      console.error("Error generating AI advice:", error);
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  // Spin wheel function
  const spinWheel = () => {
    if (isSpinning) return;

    // Play sound immediately on user interaction if enabled
    if (globalSettings.confettiSound.enableSound && soundEnabled) {
      console.log('Playing sound on spin...');
      const audio = new Audio("/sound-win.mp3");
      audio.volume = globalSettings.confettiSound.soundVolume || 0.5;
      audio.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    }

    setIsSpinning(true);
    
    // Apply theme-specific effects
    const currentTheme = themes.find(t => t.id === wheelTheme) || themes[0];
    setWheelShake(currentTheme.animations?.shake || false);
    setShowParticles(currentTheme.effects?.particles || false);

    // Get spin speed multiplier
    const spinSpeedMultiplier = currentTheme.animations?.spinSpeed || 1;
    
    // Generate random rotation
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalRotation = Math.random() * 360;
    const totalRotation = spins * 360 + finalRotation;
    const duration = (3000 + Math.random() * 2000) / spinSpeedMultiplier; // 3-5 seconds adjusted by theme speed

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
        // Determine result
        const normalizedRotation = (currentRotation % 360 + 360) % 360;
        // The pointer is at the top (0 degrees), so we need to find which segment is at the top
        // Since the wheel rotates clockwise, we need to invert the calculation
        const segmentIndex = Math.floor((360 - normalizedRotation) / (360 / segments.length)) % segments.length;
        const result = segments[segmentIndex].label;

        setLastResult(result);
        setResults((prev: { yes: number; no: number; maybe: number }) => ({
          ...prev,
          [result.toLowerCase()]: prev[result.toLowerCase() as keyof typeof prev] + 1
        }));
        setTotalSpins((prev: number) => prev + 1);

        // Update streak
        setStreak((prev: { type: string; count: number }) => {
          if (prev.type === result) {
            return { type: result, count: prev.count + 1 };
          } else {
            return { type: result, count: 1 };
          }
        });

        // Record spin history
        const spinRecord: SpinRecord = {
          id: Date.now().toString(),
          timestamp: new Date(),
          result,
          rotation: currentRotation,
          duration,
          mode,
          activeTab,
          userQuestion: userQuestion || undefined,
          aiAdvice: aiAdvice || undefined,
          wheelTheme,
          streak: { type: result, count: 1 }, // Will be updated by setStreak above
          totalSpins: totalSpins + 1,
          results: { ...results, [result.toLowerCase()]: results[result.toLowerCase() as keyof typeof results] + 1 }
        };
        setSpinHistory(prev => [spinRecord, ...prev.slice(0, 99)]); // Keep last 100 spins

        // Update achievement tracking data
        setRecentResults(prev => [...prev.slice(-9), result]); // Keep last 10 results
        setDecisionDates(prev => [...prev, new Date()]);
        
        // Track theme usage
        if (!usedThemes.includes(wheelTheme)) {
          setUsedThemes(prev => [...prev, wheelTheme]);
        }

        // Track AI usage
        if (activeTab === "ai") {
          setAiUsageCount(prev => prev + 1);
        }

        // Check achievements
        setEnhancedAchievements(prevAchievements => {
          const { updatedAchievements, newlyUnlocked } = checkAchievements(
            prevAchievements,
            totalSpins + 1,
            { ...results, [result.toLowerCase()]: results[result.toLowerCase() as keyof typeof results] + 1 },
            { type: result, count: 1 }, // Current streak
            activeTab,
            [...recentResults.slice(-9), result],
            usedThemes.includes(wheelTheme) ? usedThemes : [...usedThemes, wheelTheme],
            [...decisionDates, new Date()]
          );
          
          // Show achievement notification if new ones unlocked
          if (newlyUnlocked.length > 0) {
            console.log('New achievements unlocked:', newlyUnlocked);
            // You could add a toast notification here
          }
          
          return updatedAchievements;
        });

        // Check challenges
        setChallenges(prevChallenges => {
          const { updatedChallenges, newlyCompleted, totalPoints: newTotalPoints } = checkChallenges(
            prevChallenges,
            totalSpins + 1,
            { ...results, [result.toLowerCase()]: results[result.toLowerCase() as keyof typeof results] + 1 },
            { type: result, count: 1 }, // Current streak
            activeTab,
            [...recentResults.slice(-9), result],
            aiUsageCount + (activeTab === "ai" ? 1 : 0),
            [...decisionDates, new Date()]
          );
          
          // Update total points
          setTotalPoints(newTotalPoints);
          
          // Show challenge completion notification if new ones completed
          if (newlyCompleted.length > 0) {
            console.log('New challenges completed:', newlyCompleted);
            // You could add a toast notification here
          }
          
          return updatedChallenges;
        });

        // Check theme unlocks
        setThemes(prevThemes => {
          const { updatedThemes, newlyUnlocked } = checkThemeUnlocks(
            prevThemes,
            totalSpins + 1,
            { ...results, [result.toLowerCase()]: results[result.toLowerCase() as keyof typeof results] + 1 },
            usedThemes.includes(wheelTheme) ? usedThemes : [...usedThemes, wheelTheme],
            totalPoints,
            challenges.filter(c => c.completed).length
          );
          
          // Show theme unlock notification if new ones unlocked
          if (newlyUnlocked.length > 0) {
            console.log('New themes unlocked:', newlyUnlocked);
            setNewlyUnlockedThemes(newlyUnlocked);
            // You could add a toast notification here
          }
          
          return updatedThemes;
        });

        // Force save wheel data after spin
        setTimeout(() => {
          const wheel = getCurrentWheel()
          if (wheel && isClient) {
            const wheelData = {
              activeTab,
              mode,
              inputSets,
              userQuestion,
              aiAdvice,
              showStats,
              confettiEnabled,
              wheelTheme,
              results: { ...results, [result.toLowerCase()]: results[result.toLowerCase() as keyof typeof results] + 1 },
              lastResult: result,
              totalSpins: totalSpins + 1,
              streak: { type: result, count: 1 }, // Will be updated by the setStreak call above
              achievements,
              aiContext,
              wheelTitle,
              wheelDescription,
              enhancedAchievements,
              recentResults,
              decisionDates: decisionDates.map(d => d.toISOString()),
              usedThemes,
              aiUsageCount,
              challenges,
              totalPoints,
              themes,
              spinHistory: spinHistory.map(record => ({
                ...record,
                timestamp: record.timestamp.toISOString()
              })),
            }
            console.log('Force saving wheel data after spin:', wheelData)
            syncWheelData(wheelData)
          }
        }, 100)

        // Confetti and sound effects are handled by useEffect when lastResult changes

        setIsSpinning(false);
        setWheelShake(false);
        setShowParticles(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Reset function
  const resetWheel = () => {
    setResults({ yes: 0, no: 0, maybe: 0 });
    setLastResult(null);
    setTotalSpins(0);
    setStreak({ type: "", count: 0 });
    setAchievements([]);
    setAiAdvice("");
    setAiContext("");
    setUserQuestion("");
    setRotation(0);
    
    // Reset enhanced achievement data
    setEnhancedAchievements(initializeAchievements([]));
    setRecentResults([]);
    setDecisionDates([]);
    setUsedThemes([]);
    setAiUsageCount(0);
    
    // Reset challenges data
    setChallenges(initializeChallenges([]));
    setTotalPoints(0);
    
    // Reset themes data
    setThemes(WHEEL_THEMES);
    setNewlyUnlockedThemes([]);
    
    // Reset spin history data
    setSpinHistory([]);
    
    // Force save wheel data after reset
    setTimeout(() => {
      const wheel = getCurrentWheel()
      if (wheel && isClient) {
        const wheelData = {
          activeTab,
          mode,
          inputSets,
          userQuestion: "",
          aiAdvice: "",
          showStats,
          confettiEnabled,
          wheelTheme,
          results: { yes: 0, no: 0, maybe: 0 },
          lastResult: null,
          totalSpins: 0,
          streak: { type: "", count: 0 },
          achievements: [],
          aiContext: "",
          wheelTitle,
          wheelDescription,
          enhancedAchievements: [],
          recentResults: [],
          decisionDates: [],
          usedThemes: [],
          aiUsageCount: 0,
          challenges: [],
          totalPoints: 0,
          themes: WHEEL_THEMES,
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

  const applySoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled)
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
  const shareResult = () => {
    if (lastResult) {
      const text = `I just got "${lastResult}" on the Yes/No Picker Wheel! 🎯`;
      if (navigator.share) {
        navigator.share({ text });
      } else {
        navigator.clipboard.writeText(text);
        // Show toast notification
      }
    }
  };

  // Replay function for spin history
  const replaySpin = (spin: SpinRecord) => {
    // Set the wheel to the exact state of the recorded spin
    setMode(spin.mode);
    setActiveTab(spin.activeTab);
    setWheelTheme(spin.wheelTheme);
    setUserQuestion(spin.userQuestion || "");
    setAiAdvice(spin.aiAdvice || "");
    
    // Animate the wheel to the recorded rotation
    setIsSpinning(true);
    setWheelShake(false);
    setShowParticles(false);
    
    const startTime = Date.now();
    const startRotation = rotation;
    const targetRotation = spin.rotation;
    const replayDuration = 2000; // 2 seconds for replay
    
    const animateReplay = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / replayDuration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
      
      setRotation(currentRotation);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateReplay);
      } else {
        // Show the result briefly
        setLastResult(spin.result);
        setTimeout(() => {
          setLastResult(null);
          setIsSpinning(false);
        }, 2000);
      }
    };
    
    animationRef.current = requestAnimationFrame(animateReplay);
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
  }, [isSpinning, isClient]); // Re-add listener when spinning state changes

  // Sync local sound state with global settings
  useEffect(() => {
    setSoundEnabled(globalSettings.confettiSound.enableSound);
  }, [globalSettings.confettiSound.enableSound]);

  // Handle confetti and sound effects when result changes
  useEffect(() => {
    if (!isClient || !lastResult || isSpinning) return
    
    console.log('Result achieved:', lastResult);
    console.log('Global confetti enabled:', globalSettings.confettiSound.enableConfetti);
    console.log('Global sound enabled:', globalSettings.confettiSound.enableSound);
    console.log('Local sound enabled:', soundEnabled);
    
    // Show confetti if enabled (use global settings)
    if (globalSettings.confettiSound.enableConfetti) {
      console.log('Showing confetti...');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    

  }, [lastResult, isSpinning, globalSettings.confettiSound, soundEnabled, isClient]);

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
    <div className="relative w-full">
      <BackgroundEffects showConfetti={showConfetti} />

      <div className="relative z-10 w-full">
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Wheel */}
          <div className="relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm lg:col-span-2 sm:p-6">
            {(wheelTitle || wheelDescription) && (
              <div className="mb-4 text-center">
                {wheelTitle && (
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{wheelTitle}</h2>
                )}
                {wheelDescription && (
                  <p className="mt-1 text-sm text-slate-600">{wheelDescription}</p>
                )}
              </div>
            )}
            <div className="flex items-center justify-center">
              <WheelDisplay
                segments={segments}
                wheelBackground={`conic-gradient(from 0deg, ${segments.map((s, i) => `${s.color} ${s.startAngle}deg ${s.startAngle + s.angle}deg`).join(", ")})`}
                rotation={rotation}
                isSpinning={isSpinning}
                wheelShake={wheelShake}
                showParticles={showParticles}
                activeTab={activeTab}
                onSpin={spinWheel}
                soundEnabled={soundEnabled}
                setSoundEnabled={applySoundEnabled}
                showStats={showStats}
                setShowStats={setShowStats}
                onShare={shareResult}
                lastResult={lastResult}
                wheelTheme={wheelTheme}
                setWheelTheme={setWheelTheme}
                themeEffects={themes.find((t) => t.id === wheelTheme)?.effects}
                themeAnimations={themes.find((t) => t.id === wheelTheme)?.animations}
              />
            </div>
          </div>

          {/* Sidebar column */}
          <div className="space-y-4 lg:col-span-1">
            <ResultsDisplay
              results={results}
              lastResult={lastResult}
              mode={mode}
              activeTab={activeTab}
              aiContext={aiContext}
              streak={streak}
              achievements={achievements}
              showStats={showStats}
              totalSpins={totalSpins}
            />

            <YesNoPickerSidebar
              controlMode={activeTab === "ai" ? "ai" : "manual"}
              setControlMode={(m) => setActiveTab(m === "ai" ? "ai" : "manual")}
              mode={mode}
              setMode={setMode}
              inputSets={inputSets}
              setInputSets={setInputSets}
              userQuestion={userQuestion}
              setUserQuestion={setUserQuestion}
              onGenerateAdvice={generateAdvice}
              isGeneratingAdvice={isGeneratingAdvice}
              aiAdvice={aiAdvice}
              wheelTitle={wheelTitle}
              setWheelTitle={setWheelTitle}
              wheelDescription={wheelDescription}
              setWheelDescription={setWheelDescription}
              optionLabels={optionLabels}
              setOptionLabels={setOptionLabels}
              onApplyPalette={(colors) => {
                setCustomColors({
                  yes: colors[0] ?? "#22c55e",
                  no: colors[1] ?? colors[0] ?? "#eab308",
                  maybe: colors[2] ?? colors[1] ?? colors[0] ?? "#f97316",
                })
              }}
              confettiEnabled={confettiEnabled}
              setConfettiEnabled={setConfettiEnabled}
              soundEnabled={soundEnabled}
              setSoundEnabled={applySoundEnabled}
              onShuffle={shuffleWheel}
              onReset={resetWheel}
              onViewHistory={() => setShowSpinHistory(true)}
              onOpenAchievements={() => setShowAchievements(true)}
              onOpenChallenges={() => setShowChallenges(true)}
              onOpenSettings={() => setShowTitleModal(true)}
              resultsCount={totalSpins}
              historyCount={spinHistory.length}
              totalPoints={totalPoints}
            />

            <Button
              onClick={spinWheel}
              disabled={isSpinning}
              className={`relative z-30 h-14 w-full text-lg font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                activeTab === "ai"
                  ? "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700"
              }`}
            >
              {isSpinning ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                  SPINNING…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {activeTab === "ai" ? <Brain className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                  {activeTab === "ai" ? "SPIN WITH AI" : "SPIN THE WHEEL"}
                  {activeTab === "ai" ? <Brain className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-slate-500">
              Press Ctrl + Enter to spin
              {activeTab === "ai" ? " · AI mode" : ""}
            </p>
          </div>
        </div>
      </div>

      <AchievementsDisplay
        achievements={enhancedAchievements}
        totalSpins={totalSpins}
        results={results}
        streak={streak}
        activeTab={activeTab}
        isVisible={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <ChallengesDisplay
        challenges={challenges}
        totalSpins={totalSpins}
        results={results}
        streak={streak}
        activeTab={activeTab}
        isVisible={showChallenges}
        onClose={() => setShowChallenges(false)}
      />

      <ThemeSelector
        themes={themes}
        currentTheme={wheelTheme}
        onThemeChange={(id) => {
          setWheelTheme(id)
          setCustomColors(null)
        }}
        isVisible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      <SpinHistory
        spinHistory={spinHistory}
        isVisible={showSpinHistory}
        onClose={() => setShowSpinHistory(false)}
        onReplay={replaySpin}
        currentMode={mode}
        currentActiveTab={activeTab}
      />

      <TitleModal
        showTitleModal={showTitleModal}
        setShowTitleModal={setShowTitleModal}
        wheelTitle={wheelTitle}
        setWheelTitle={setWheelTitle}
        wheelDescription={wheelDescription}
        setWheelDescription={setWheelDescription}
      />
    </div>
  )
}
 