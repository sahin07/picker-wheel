"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Header from "@/components/header";
import { ToolPageTitle } from "@/components/tool-favorite-star";
import LoLWheelSection from "@/components/lol-wheel-section";
import LoLInputPanel from "@/components/lol-input-panel";
import {
  ChampionsTab,
  CustomChampionsCard,
} from "@/components/tabs/champions-tab";
import { AITab } from "@/components/tabs/ai-tab";
import { StatsTab } from "@/components/tabs/stats-tab";
import { ResultDialog } from "@/components/dialogs/result-dialog";
import { SettingsDialog } from "@/components/dialogs/settings-dialog";
import { ResultsHistoryDialog } from "@/components/dialogs/results-history-dialog";
import { ChampionPreviewDialog } from "@/components/dialogs/champion-preview-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  BarChart3,
  Eye,
  EyeOff,
  Trophy,
  Palette,
  Users,
  Gamepad2,
  RotateCcw,
} from "lucide-react";
import Confetti from "react-confetti";
import SettingsPanel from "@/components/settings-panel";
import { useWheelManagerStore } from "@/stores/wheel-manager-store";
import { useSettingsStore } from "@/stores/settings-store";
import { ToastProvider } from "@/contexts/toast-context";
import PickerWheelAchievementsDisplay from "@/components/picker-wheel-achievements-display";
import PickerWheelThemeSelector from "@/components/picker-wheel-theme-selector";
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display";
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub";
import PickerWheelGameModes from "@/components/picker-wheel-game-modes";
import PickerWheelGameStatus from "@/components/picker-wheel-game-status";
import {
  PICKER_WHEEL_ACHIEVEMENTS,
  checkAchievementUnlocks,
} from "@/lib/picker-wheel-achievements";
import {
  PICKER_WHEEL_THEMES,
  checkThemeUnlocks,
} from "@/lib/picker-wheel-themes";
import { analyzeSpinData, SpinRecord } from "@/lib/picker-wheel-analytics";
import { SocialProfile, calculateLevel } from "@/lib/picker-wheel-social";
import { GameMode } from "@/lib/picker-wheel-game-modes";
import { useGameSession } from "@/hooks/use-game-session";
import { lolChampions } from "@/data/lol-champions";
import type {
  ActionMode,
  LoLChampion,
  RoleFilter,
  DisplayMode,
  SpinResult,
} from "@/types/lol-types";
import { WheelComponent } from "@/components/lol-wheel-component";

export default function LoLWheelPage() {
  // Core state management - like Fortnite wheel
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("all");
  const [selectedChampions, setSelectedChampions] = useState<string[]>([]);
  const [championOrder, setChampionOrder] = useState<string[]>([]);
  const [totalSpins, setTotalSpins] = useState(0);
  const [spinHistory, setSpinHistory] = useState<any[]>([]);
  const [customChampions, setCustomChampions] = useState<LoLChampion[]>([]);

  // Client-side spin count display to avoid hydration issues (like Fortnite)
  const [displaySpinCount, setDisplaySpinCount] = useState(totalSpins);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Local state - like Fortnite wheel
  const [forceUpdate, setForceUpdate] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("emoji-name");
  const [actionMode, setActionMode] = useState<ActionMode>("normal");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [allResults, setAllResults] = useState<SpinResult[]>([]);
  const [showInputs, setShowInputs] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [manualInput, setManualInput] = useState("");
  const [previewChampion, setPreviewChampion] = useState<LoLChampion | null>(
    null
  );

  // UI state
  const [showAchievements, setShowAchievements] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSocialHub, setShowSocialHub] = useState(false);
  const [showGameModes, setShowGameModes] = useState(false);
  const [achievements, setAchievements] = useState(PICKER_WHEEL_ACHIEVEMENTS);
  const [activeTab, setActiveTab] = useState<"manual" | "ai" | "stats">(
    "manual"
  );

  // Wheel mechanics state
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Helper functions - like Fortnite wheel
  const getFilteredChampions = (): LoLChampion[] => {
    const allPredefinedChampions = Object.values(lolChampions).flat();
    console.log(
      "DEBUG: getFilteredChampions called, selectedChampions:",
      selectedChampions?.length || 0
    );
    console.log(
      "DEBUG: allPredefinedChampions total:",
      allPredefinedChampions.length
    );

    if (!selectedChampions || selectedChampions.length === 0) {
      console.log("getFilteredChampions: No selected champions");
      return [];
    }

    const selectedChampionIds =
      selectedChampions instanceof Set
        ? Array.from(selectedChampions)
        : selectedChampions.map((item) =>
            typeof item === "string" ? item : (item as any).id || item
          );

    console.log(
      "getFilteredChampions: selectedChampionIds:",
      selectedChampionIds
    );
    console.log(
      "getFilteredChampions: customChampions count:",
      customChampions.length
    );

    // Get selected predefined champions that match the current role filter
    const selectedPredefinedChampions = allPredefinedChampions.filter(
      (champion) => selectedChampionIds.includes(champion.id)
    );

    // Get selected custom champions
    const selectedCustomChampions = customChampions.filter((champion) =>
      selectedChampionIds.includes(champion.id)
    );

    console.log(
      "getFilteredChampions: selectedPredefinedChampions count:",
      selectedPredefinedChampions.length
    );
    console.log(
      "getFilteredChampions: selectedCustomChampions count:",
      selectedCustomChampions.length
    );

    // Combine predefined and custom champions
    const allSelectedChampions = [
      ...selectedPredefinedChampions,
      ...selectedCustomChampions,
    ];

    // Sort according to championOrder if available
    let orderedChampions = allSelectedChampions;
    if (championOrder && championOrder.length > 0) {
      const orderedChampionsFromOrder = championOrder
        .map((championId) =>
          allSelectedChampions.find((champion) => champion.id === championId)
        )
        .filter((champion) => champion !== undefined) as LoLChampion[];

      const customChampionsNotInOrder = selectedCustomChampions.filter(
        (champion) => !championOrder.includes(champion.id)
      );

      orderedChampions = [
        ...orderedChampionsFromOrder,
        ...customChampionsNotInOrder,
      ];
    }

    console.log(
      "getFilteredChampions: returning total champions:",
      orderedChampions.length
    );
    return orderedChampions;
  };

  const getAllChampions = (): LoLChampion[] => {
    const allChampions = Object.values(lolChampions).flat();
    return [...allChampions, ...customChampions];
  };

  // Store hooks
  const {
    setCurrentTool,
    createNewWheel,
    getCurrentWheel,
    updateWheelData,
    loadFromDatabase: loadWheelManager,
  } = useWheelManagerStore();
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore();

  // Spin function - like Fortnite wheel
  const spinWheel = useCallback(() => {
    const availableChampions = getFilteredChampions();
    if (availableChampions.length === 0) return;

    setIsSpinning(true);

    // Enhanced spin mechanics like Fortnite wheel
    const spins = 8 + Math.random() * 4; // Increased from 5+5 to 8+4 for longer spinning
    const randomAngle = Math.random() * 360;
    const finalRotation = rotation + spins * 360 + randomAngle;

    setRotation(finalRotation);

    // Increased duration - make it spin longer
    const spinDurationMs = Math.max(
      4000,
      settings.spinBehavior.spinningDuration * 200
    ); // Minimum 4 seconds

    setTimeout(() => {
      // Calculate which segment the pointer is pointing to (pointer is at 12 o'clock = 0 degrees)
      const finalAngle = finalRotation % 360;
      const segmentAngle = 360 / availableChampions.length;

      // When wheel rotates clockwise, segments move clockwise
      let selectedIndex = Math.floor((360 - finalAngle) / segmentAngle);
      // Ensure the index is within bounds
      selectedIndex =
        ((selectedIndex % availableChampions.length) +
          availableChampions.length) %
        availableChampions.length;
      const selectedChampion = availableChampions[selectedIndex];

      const result: SpinResult = {
        champion: selectedChampion,
        timestamp: new Date(),
      };

      setSpinResult(result);
      setAllResults((prev) => [...prev, result]);
      setIsSpinning(false);
      setShowResultModal(true); // Show the result modal
      setShowConfetti(true); // Trigger confetti

      // Update wheel data with result and increment totalSpins
      const currentWheel = getCurrentWheel();
      if (currentWheel) {
        const currentData = currentWheel.data as any;
        const newTotalSpins = (currentData.totalSpins || 0) + 1;

        // Update local state immediately
        setTotalSpins(newTotalSpins);
        setSpinHistory((prev) => [result, ...prev.slice(0, 9)]); // Keep last 10

        // Update statistics like Fortnite wheel
        const currentStats = currentData.statistics || {
          totalSpins: 0,
          uniqueChampionsSpun: 0,
          mostSpunChampion: undefined,
          mostSpunRole: undefined,
          averageSpinsPerSession: 0,
          lastSpinDate: undefined,
          firstSpinDate: undefined,
          spinStreak: 0,
          totalSpinTime: 0,
          favoriteRole: undefined,
          championCountByRole: {},
          spinResultsByRole: {},
        };

        // Track unique champions spun
        const existingSpins = currentData.spinHistory || [];
        const allSpunChampions = [...existingSpins, result].map(
          (spin) => spin.champion?.id || spin.champion
        );
        const uniqueChampions = [...new Set(allSpunChampions.filter(Boolean))];
        const uniqueChampionsSpun = uniqueChampions.length;

        // Track role statistics
        const championRole = selectedChampion.role || "unknown";
        const spinResultsByRole = { ...currentStats.spinResultsByRole };
        spinResultsByRole[championRole] =
          (spinResultsByRole[championRole] || 0) + 1;

        // Find most spun role
        const mostSpunRole =
          Object.entries(spinResultsByRole).reduce((a, b) =>
            spinResultsByRole[a[0]] > spinResultsByRole[b[0]] ? a : b
          )?.[0] || undefined;

        // Track most spun champion
        const championSpins = allSpunChampions.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const mostSpunChampion =
          Object.entries(championSpins).reduce((a, b) =>
            championSpins[a[0]] > championSpins[b[0]] ? a : b
          )?.[0] || undefined;

        const updatedStats = {
          ...currentStats,
          totalSpins: newTotalSpins,
          uniqueChampionsSpun,
          mostSpunChampion,
          mostSpunRole,
          lastSpinDate: new Date().toISOString(),
          firstSpinDate: currentStats.firstSpinDate || new Date().toISOString(),
          spinResultsByRole,
        };

        updateWheelData("lol-wheel", currentWheel.id, {
          ...currentData,
          selectedResult: result,
          isSpinning: false,
          totalSpins: newTotalSpins,
          spinHistory: [result, ...(currentData.spinHistory || []).slice(0, 9)],
          recentResults: [result, ...(currentData.recentResults || [])].slice(
            0,
            10
          ), // Keep last 10
          rotation: finalRotation,
          statistics: updatedStats,
        });
      }

      // Handle different action modes
      if (actionMode === "elimination") {
        console.log("ELIMINATION MODE: Starting elimination process...");

        // Remove the selected champion from available options IMMEDIATELY
        const newSelected = selectedChampions.filter(
          (id) => id !== selectedChampion.id
        );
        console.log(
          "After elimination - newSelected:",
          newSelected.length,
          "champions"
        );

        // Update state immediately
        setSelectedChampions(newSelected);
        setChampionOrder(newSelected);
        setForceUpdate((prev) => prev + 1); // Force re-render

        // Update wheel data immediately
        const currentWheel = getCurrentWheel();
        if (currentWheel) {
          updateWheelData("lol-wheel", currentWheel.id, {
            ...currentWheel.data,
            selectedChampions: newSelected,
            championOrder: newSelected,
          });
        }

        console.log(
          `Elimination mode: Removed ${selectedChampion.name} from available options. Remaining: ${newSelected.length} champions`
        );
      }
    }, spinDurationMs);
  }, [
    getFilteredChampions,
    rotation,
    selectedChampions,
    championOrder,
    actionMode,
    getCurrentWheel,
    updateWheelData,
    settings.spinBehavior.spinningDuration,
  ]);

  // Advanced game session management
  const {
    currentSession,
    isGameActive: isAdvancedGameActive,
    startGame: startAdvancedGame,
    endGame: endAdvancedGame,
    restartGame: restartAdvancedGame,
    recordSpin,
    getGameProgress,
    isGameComplete,
    getGameScore,
    getGameResults,
    getGameStats,
  } = useGameSession();

  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES);
  const [currentTheme, setCurrentTheme] = useState("classic");
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentUser, setCurrentUser] = useState<SocialProfile | undefined>();

  // Subscribe to the current wheel using a Zustand selector - optimized
  const wheel = useWheelManagerStore(
    useCallback((state) => {
      const wheels = state.wheelsByTool[state.currentTool] || [];
      return wheels.find((w) => w.id === state.currentWheelId) || null;
    }, [])
  );

  // Get currentWheelId for wheel change detection
  const currentWheelId = useWheelManagerStore((state) => state.currentWheelId);
  const data = wheel?.data as any;

  // Save data to wheel manager store whenever it changes (like Fortnite does)
  useEffect(() => {
    const currentWheel = getCurrentWheel();
    if (currentWheel && isInitialized && isDataLoaded) {
      updateWheelData("lol-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedChampions,
        championOrder,
        totalSpins,
        spinHistory,
        customChampions,
        selectedRole,
        displayMode,
        actionMode,
        currentTheme,
        achievements,
        themes,
        selectedResult: spinResult,
      });
    }
  }, [
    selectedChampions,
    championOrder,
    totalSpins,
    spinHistory,
    customChampions,
    selectedRole,
    displayMode,
    actionMode,
    currentTheme,
    achievements,
    themes,
    isInitialized,
    isDataLoaded,
    getCurrentWheel,
    updateWheelData,
    spinResult,
  ]);

  // Listen for wheel changes and update local state (like Fortnite does)
  useEffect(() => {
    console.log(
      "Wheel change effect triggered - currentWheelId:",
      currentWheelId,
      "isInitialized:",
      isInitialized
    );

    const currentWheel = getCurrentWheel();
    console.log("getCurrentWheel() returned:", currentWheel);

    if (currentWheel?.data && isInitialized) {
      const wheelData = currentWheel.data as any;

      console.log("Wheel changed, loading data from wheel:", currentWheel.id);
      console.log("Wheel data:", wheelData);

      // Update local state to match current wheel data
      if (wheelData.selectedChampions) {
        console.log(
          "Loading selectedChampions from wheel data:",
          wheelData.selectedChampions
        );
        setSelectedChampions(wheelData.selectedChampions);
        setChampionOrder(wheelData.selectedChampions);
      } else {
        console.log("No selectedChampions in wheel data, clearing selection");
        setSelectedChampions([]);
        setChampionOrder([]);
      }

      if (wheelData.selectedRole) {
        console.log(
          "Loading selectedRole from wheel data:",
          wheelData.selectedRole
        );
        setSelectedRole(wheelData.selectedRole);
      } else {
        console.log("No selectedRole in wheel data, using default: all");
        setSelectedRole("all");
      }

      if (wheelData.displayMode) {
        console.log(
          "Loading displayMode from wheel data:",
          wheelData.displayMode
        );
        setDisplayMode(wheelData.displayMode);
      }

      if (wheelData.actionMode) {
        console.log(
          "Loading actionMode from wheel data:",
          wheelData.actionMode
        );
        setActionMode(wheelData.actionMode);
      }

      if (wheelData.currentTheme) {
        console.log(
          "Loading currentTheme from wheel data:",
          wheelData.currentTheme
        );
        setCurrentTheme(wheelData.currentTheme);
      }

      if (wheelData.totalSpins !== undefined) {
        console.log(
          "Loading totalSpins from wheel data:",
          wheelData.totalSpins
        );
        setTotalSpins(wheelData.totalSpins);
      }

      if (wheelData.spinHistory) {
        console.log(
          "Loading spinHistory from wheel data:",
          wheelData.spinHistory.length,
          "spins"
        );
        setSpinHistory(wheelData.spinHistory);
      }

      if (wheelData.customChampions) {
        console.log(
          "Loading customChampions from wheel data:",
          wheelData.customChampions.length,
          "champions"
        );
        setCustomChampions(wheelData.customChampions);
      }

      if (wheelData.achievements) {
        console.log(
          "Loading achievements from wheel data:",
          wheelData.achievements.length,
          "achievements"
        );
        setAchievements(wheelData.achievements);
        const points = wheelData.achievements
          .filter((a: any) => a.completed)
          .reduce((sum: number, a: any) => sum + a.points, 0);
        setTotalPoints(points);
      }

      if (wheelData.themes) {
        console.log(
          "Loading themes from wheel data:",
          wheelData.themes.length,
          "themes"
        );
        setThemes(wheelData.themes);
      }

      // Load the last spin result to display
      if (wheelData.selectedResult) {
        console.log(
          "Loading selectedResult from wheel data:",
          wheelData.selectedResult
        );
        setSpinResult(wheelData.selectedResult);
      } else {
        console.log("No selectedResult in wheel data, clearing result");
        setSpinResult(null);
      }

      // Mark data as loaded
      setIsDataLoaded(true);

      // Force wheel component to re-render with new data
      setForceUpdate((prev) => prev + 1);
    }
  }, [currentWheelId, isInitialized]);

  // Subscribe to wheel manager store changes (like Fortnite does)
  useEffect(() => {
    const unsubscribe = useWheelManagerStore.subscribe((state) => {
      console.log(
        "Wheel manager store subscription triggered - new currentWheelId:",
        state.currentWheelId
      );
      // Force a re-render when wheel ID changes
      setForceUpdate((prev) => prev + 1);
    });

    return unsubscribe;
  }, []);

  // Update display spin count to avoid hydration issues (like Fortnite)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentWheel = getCurrentWheel();
      const wheelData = currentWheel?.data as any;
      setDisplaySpinCount(wheelData?.totalSpins ?? totalSpins);
    }
  }, [totalSpins, getCurrentWheel]);

  // Initialize the app
  useEffect(() => {
    setCurrentTool("lol-wheel");
    const initializeApp = async () => {
      try {
        await loadSettings();
        // Client-only: create wheel if none exists
        if (typeof window !== "undefined") {
          const wheel = getCurrentWheel();
          if (!wheel) {
            const id = `lol-wheel-${Date.now()}`;
            const now = new Date().toISOString();
            createNewWheel(
              "lol-wheel",
              "LoL Champions Picker Wheel",
              id,
              now,
              now
            );
          }
        }

        const currentWheel = getCurrentWheel();
        console.log("Current wheel:", currentWheel);
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as any;
          console.log("Wheel data:", {
            selectedChampions: wheelData.selectedChampions,
            selectedChampionsType: typeof wheelData.selectedChampions,
            isArray: Array.isArray(wheelData.selectedChampions),
            length: wheelData.selectedChampions?.length,
            firstItem: wheelData.selectedChampions?.[0],
          });

          // Load data from wheel manager store (like Fortnite does)
          if (wheelData.achievements) {
            setAchievements(wheelData.achievements);
            const points = wheelData.achievements
              .filter((a: any) => a.completed)
              .reduce((sum: number, a: any) => sum + a.points, 0);
            setTotalPoints(points);
          }

          if (wheelData.themes) {
            setThemes(wheelData.themes);
          } else {
            setThemes(PICKER_WHEEL_THEMES);
          }

          if (wheelData.currentTheme) {
            setCurrentTheme(wheelData.currentTheme);
          }

          if (wheelData.customChampions) {
            setCustomChampions(wheelData.customChampions);
          }

          if (wheelData.selectedRole) {
            console.log(
              "Loading selectedRole from wheel data:",
              wheelData.selectedRole
            );
            setSelectedRole(wheelData.selectedRole);
          } else {
            console.log("No selectedRole in wheel data, using default: all");
          }

          if (
            wheelData.selectedChampions &&
            wheelData.selectedChampions.length > 0
          ) {
            // Check if selectedChampions is in old format (array of objects) and convert to new format (array of strings)
            let selectedChampionsData = wheelData.selectedChampions;
            if (
              Array.isArray(selectedChampionsData) &&
              selectedChampionsData.length > 0 &&
              typeof selectedChampionsData[0] === "object" &&
              selectedChampionsData[0].id
            ) {
              console.log(
                "Converting old selectedChampions format (objects) to new format (strings)"
              );
              selectedChampionsData = selectedChampionsData.map(
                (champion) => champion.id
              );
              // Update the wheel data with the new format
              updateWheelData("lol-wheel", currentWheel.id, {
                ...currentWheel.data,
                selectedChampions: selectedChampionsData,
                championOrder: selectedChampionsData,
              });
            }
            setSelectedChampions(selectedChampionsData);
            setChampionOrder(selectedChampionsData);
          } else {
            // Auto-select all champions on first load
            console.log(
              "No selected champions found, auto-selecting all champions"
            );
            const allChampions = Object.values(lolChampions).flat();
            const allChampionIds = allChampions.map((champion) => champion.id);
            console.log(
              "Auto-selecting champions:",
              allChampionIds.length,
              "champions"
            );
            setSelectedChampions(allChampionIds);
            setChampionOrder(allChampionIds);

            // Update wheel data with all champions selected
            updateWheelData("lol-wheel", currentWheel.id, {
              ...currentWheel.data,
              selectedChampions: allChampionIds,
              selectedRole: "all",
              displayMode: "emoji-name",
              actionMode: "normal",
              championOrder: allChampionIds,
            });
          }

          // Load existing statistics if available
          if (wheelData.statistics) {
            console.log(
              "Loading existing statistics from wheel data:",
              wheelData.statistics
            );
          } else {
            console.log(
              "No existing statistics found, will be created on first spin"
            );
          }

          // Load spin history if available
          if (wheelData.spinHistory) {
            console.log(
              "Loading existing spin history from wheel data:",
              wheelData.spinHistory.length,
              "spins"
            );
            setSpinHistory(wheelData.spinHistory);
          } else {
            console.log("No existing spin history found");
          }

          // Mark data as loaded immediately
          setIsDataLoaded(true);
          setIsInitialized(true);
        } else if (currentWheel) {
          // Initialize wheel data if it exists but has no data
          const allChampions = Object.values(lolChampions).flat();
          const allChampionIds = allChampions.map((champion) => champion.id);
          console.log(
            "No wheel data found, initializing with all champions:",
            allChampionIds.length
          );

          updateWheelData("lol-wheel", currentWheel.id, {
            selectedChampions: allChampionIds,
            selectedRole: "all",
            displayMode: "emoji-name",
            actionMode: "normal",
            championOrder: allChampionIds,
            totalSpins: 0,
            recentResults: [],
            selectedResult: null,
          });

          setSelectedChampions(allChampionIds);
          setChampionOrder(allChampionIds);
          setSelectedRole("all");
          setIsDataLoaded(true);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing LoL wheel:", error);
      }
    };
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for spin results from the wheel store
  const [lastSpinResult, setLastSpinResult] = useState<any>(null);

  useEffect(() => {
    const currentWheel = getCurrentWheel();
    if (currentWheel?.data) {
      const wheelData = currentWheel.data as any;
      if (
        wheelData.selectedResult &&
        wheelData.selectedResult !== lastSpinResult
      ) {
        const result = wheelData.selectedResult;
        setLastSpinResult(result);

        // Process the spin result for analytics and achievements
        if (result && result.name) {
          // Calculate stats for achievements using recent results
          const totalSpins = wheelData.totalSpins || 0;
          const recentResults = wheelData.recentResults || [];
          const uniqueResults = new Set(recentResults.map((r: any) => r.name))
            .size;

          const stats = {
            totalSpins,
            uniqueResults,
            perfectMemoryRounds: 0,
            bingoWins: 0,
            fastestMemoryTime: 0,
            consecutiveDays: 1,
            totalOptions: wheelData.selectedChampions?.length || 0,
            aiGeneratedOptions:
              activeTab === "ai" ? wheelData.selectedChampions?.length || 0 : 0,
            mysterySpins: 0,
          };

          // Check for achievement unlocks
          const updatedAchievements = checkAchievementUnlocks(
            achievements,
            stats
          );
          const newlyCompleted = updatedAchievements.filter(
            (a) =>
              a.completed &&
              !achievements.find((oa) => oa.id === a.id)?.completed
          );

          if (newlyCompleted.length > 0) {
            setAchievements(updatedAchievements);
            const newPoints = newlyCompleted.reduce(
              (sum, a) => sum + a.points,
              0
            );
            setTotalPoints((prev) => prev + newPoints);

            // Check for theme unlocks
            const updatedThemes = checkThemeUnlocks(themes, {
              totalSpins,
              totalPoints: totalPoints + newPoints,
            });
            const newlyUnlockedThemes = updatedThemes.filter(
              (t) =>
                t.unlocked && !themes.find((ot) => ot.id === t.id)?.unlocked
            );

            if (newlyUnlockedThemes.length > 0) {
              setThemes(updatedThemes);
            }

            // Save achievements and themes to wheel data
            if (currentWheel) {
              updateWheelData("lol-wheel", currentWheel.id, {
                ...currentWheel.data,
                achievements: updatedAchievements,
                themes: updatedThemes,
              });
            }
          }
        }
      }
    }
  }, [
    getCurrentWheel,
    lastSpinResult,
    achievements,
    themes,
    totalPoints,
    activeTab,
    currentTheme,
    updateWheelData,
  ]);

  // Handle theme selection - optimized with useCallback
  const handleThemeSelect = useCallback(
    (themeId: string) => {
      console.log("Theme selected:", themeId);
      setCurrentTheme(themeId);

      // Save theme selection to wheel data immediately
      const currentWheel = getCurrentWheel();
      if (currentWheel) {
        updateWheelData("lol-wheel", currentWheel.id, {
          ...currentWheel.data,
          currentTheme: themeId,
        });
      }
    },
    [getCurrentWheel, updateWheelData]
  );

  // Callback when a spin is completed - optimized with useCallback
  const handleSpinCompleted = useCallback(() => {
    // Trigger confetti animation
    setShowConfetti(true);

    // Record spin for game session if active
    if (isAdvancedGameActive && currentSession) {
      // Small delay to ensure wheel data is fully updated
      setTimeout(() => {
        // Get the result directly from the wheel data (like country wheel does)
        const currentWheel = getCurrentWheel();
        if (currentWheel?.data) {
          const wheelData = currentWheel.data as any;

          if (wheelData.selectedResult) {
            console.log(
              "Recording spin for game session:",
              wheelData.selectedResult.name
            );
            recordSpin(wheelData.selectedResult.name);
          }
        }
      }, 100); // Small delay to ensure state is updated
    }
  }, [isAdvancedGameActive, currentSession, getCurrentWheel, recordSpin]);

  // Handle elimination mode when a champion is selected - optimized with useCallback
  const handleEliminationMode = useCallback(
    (selectedChampion: LoLChampion) => {
      if (actionMode === "elimination") {
        console.log(
          "ELIMINATION MODE: Removing champion from available options..."
        );
        console.log(
          "Champion to eliminate:",
          selectedChampion.name,
          "ID:",
          selectedChampion.id
        );

        // Remove the selected champion from available options IMMEDIATELY
        const currentWheel = getCurrentWheel();
        if (currentWheel) {
          const currentData = currentWheel.data as any;
          const newSelected = currentData.selectedChampions.filter(
            (champion: LoLChampion) => champion.id !== selectedChampion.id
          );
          console.log(
            "After elimination - remaining champions:",
            newSelected.length
          );

          // Update wheel data immediately
          updateWheelData("lol-wheel", currentWheel.id, {
            ...currentData,
            selectedChampions: newSelected,
          });

          // Force UI update for immediate visual feedback
          setForceUpdate((prev) => prev + 1);

          console.log(
            `Elimination mode: Removed ${selectedChampion.name} from available options. Remaining: ${newSelected.length} champions`
          );
        }
      }
    },
    [actionMode, getCurrentWheel, updateWheelData]
  );

  // Handle manual champion addition - optimized with useCallback
  const handleAddManualChampion = useCallback(
    (championName: string) => {
      console.log("MANUAL MODE: Adding custom champion...");
      console.log("Champion name to add:", championName);

      // Create a custom LoL champion
      const customChampion: LoLChampion = {
        id: `manual-${Date.now()}`,
        name: championName.trim(),
        role: "top", // Default role
        emoji: "⚔️", // Default emoji
        difficulty: "medium",
        popularity: "B-tier",
        proPlayPresence: "low",
        communityFavorite: false,
        releaseYear: new Date().getFullYear(),
        region: "Custom",
        damageType: "mixed",
        playStyle: "balanced",
        skinCount: 1,
        esportsPresence: "low",
        preview: "/placeholder.svg?height=100&width=100&text=Custom",
      };

      // Add the custom champion to the wheel
      const currentWheel = getCurrentWheel();
      if (currentWheel) {
        const currentData = currentWheel.data as any;

        // Check if champion already exists (case-insensitive)
        // Note: selectedChampions contains champion IDs, not objects
        const allChampions = [
          ...Object.values(lolChampions).flat(),
          ...(currentData.customChampions || []),
        ];
        const existingChampion = allChampions.find(
          (champion: LoLChampion) =>
            champion.name &&
            champion.name.toLowerCase() === championName.toLowerCase()
        );

        if (existingChampion) {
          console.log(`Champion "${championName}" already exists in the wheel`);
          return;
        }

        console.log("Adding manual champion:", championName);

        // Add to custom champions state (avoid duplicates)
        setCustomChampions((prev) => {
          const exists = prev.some(
            (champion) => champion.id === customChampion.id
          );
          return exists ? prev : [...prev, customChampion];
        });

        // Add to selected champions
        const newSelected = [...selectedChampions, customChampion.id];
        setSelectedChampions(newSelected);
        setChampionOrder(newSelected);

        // Force re-render to update UI
        setForceUpdate((prev) => prev + 1);

        // Get current custom champions from wheel data to avoid duplicates
        const currentCustomChampions = currentData.customChampions || [];
        const customChampionExists = currentCustomChampions.some(
          (champion: LoLChampion) => champion.id === customChampion.id
        );

        updateWheelData("lol-wheel", currentWheel.id, {
          ...currentData,
          selectedChampions: newSelected,
          championOrder: newSelected,
          customChampions: customChampionExists
            ? currentCustomChampions
            : [...currentCustomChampions, customChampion],
        });

        console.log(
          `Manual mode: Added "${championName}" to available options. Total: ${newSelected.length} champions`
        );
      }
    },
    [getCurrentWheel, updateWheelData, selectedChampions]
  );

  // Manual mode: Allow user to manually select a champion (like Fortnite wheel)
  const handleManualSelect = useCallback(
    (champion: LoLChampion) => {
      if (actionMode === "manual") {
        const result: SpinResult = {
          champion: champion,
          timestamp: new Date(),
        };

        setSpinResult(result);
        setAllResults((prev) => [...prev, result]);
        setShowResultModal(true); // Show the result modal
        setShowConfetti(true); // Trigger confetti

        // Update wheel data
        const { getCurrentWheel, updateWheelData } =
          useWheelManagerStore.getState();
        const currentWheel = getCurrentWheel();
        if (currentWheel) {
          const currentData = currentWheel.data as any;
          const newTotalSpins = (currentData.totalSpins || 0) + 1;

          // Update local state immediately
          setTotalSpins(newTotalSpins);
          setSpinHistory((prev) => [result, ...prev.slice(0, 9)]); // Keep last 10

          // Update statistics like Fortnite wheel
          const currentStats = currentData.statistics || {
            totalSpins: 0,
            uniqueChampionsSpun: 0,
            mostSpunChampion: undefined,
            mostSpunRole: undefined,
            averageSpinsPerSession: 0,
            lastSpinDate: undefined,
            firstSpinDate: undefined,
            spinStreak: 0,
            totalSpinTime: 0,
            favoriteRole: undefined,
            championCountByRole: {},
            spinResultsByRole: {},
          };

          // Track unique champions spun
          const existingSpins = currentData.spinHistory || [];
          const allSpunChampions = [...existingSpins, result].map(
            (spin) => spin.champion?.id || spin.champion
          );
          const uniqueChampions = [
            ...new Set(allSpunChampions.filter(Boolean)),
          ];
          const uniqueChampionsSpun = uniqueChampions.length;

          // Track role statistics
          const championRole = champion.role || "unknown";
          const spinResultsByRole = { ...currentStats.spinResultsByRole };
          spinResultsByRole[championRole] =
            (spinResultsByRole[championRole] || 0) + 1;

          // Find most spun role
          const mostSpunRole =
            Object.entries(spinResultsByRole).reduce((a, b) =>
              spinResultsByRole[a[0]] > spinResultsByRole[b[0]] ? a : b
            )?.[0] || undefined;

          // Track most spun champion
          const championSpins = allSpunChampions.reduce((acc, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const mostSpunChampion =
            Object.entries(championSpins).reduce((a, b) =>
              championSpins[a[0]] > championSpins[b[0]] ? a : b
            )?.[0] || undefined;

          const updatedStats = {
            ...currentStats,
            totalSpins: newTotalSpins,
            uniqueChampionsSpun,
            mostSpunChampion,
            mostSpunRole,
            lastSpinDate: new Date().toISOString(),
            firstSpinDate:
              currentStats.firstSpinDate || new Date().toISOString(),
            spinResultsByRole,
          };

          updateWheelData("lol-wheel", currentWheel.id, {
            ...currentData,
            selectedResult: result,
            totalSpins: newTotalSpins,
            spinHistory: [
              result,
              ...(currentData.spinHistory || []).slice(0, 9),
            ],
            recentResults: [result, ...(currentData.recentResults || [])].slice(
              0,
              10
            ), // Keep last 10
            statistics: updatedStats,
          });
        }

        console.log("Manual mode: Champion selected:", champion.name);
      }
    },
    [actionMode]
  );

  // Immediate synchronization with wheel data changes
  useEffect(() => {
    const currentWheel = getCurrentWheel();
    if (currentWheel?.data) {
      const wheelData = currentWheel.data as any;

      // Sync current theme from wheel data
      if (wheelData.currentTheme && wheelData.currentTheme !== currentTheme) {
        setCurrentTheme(wheelData.currentTheme);
      }

      // Sync achievements from wheel data
      if (
        wheelData.achievements &&
        JSON.stringify(wheelData.achievements) !== JSON.stringify(achievements)
      ) {
        setAchievements(wheelData.achievements);
        const points = wheelData.achievements
          .filter((a: any) => a.completed)
          .reduce((sum: number, a: any) => sum + a.points, 0);
        setTotalPoints(points);
      }

      // Sync themes from wheel data
      if (
        wheelData.themes &&
        JSON.stringify(wheelData.themes) !== JSON.stringify(themes)
      ) {
        setThemes(wheelData.themes);
      }
    }
  }, [getCurrentWheel, currentTheme, achievements, themes]);

  return (
    <ToastProvider>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: settings.appearance.backgroundColor,
          backgroundImage: settings.appearance.backgroundImage
            ? `url(${settings.appearance.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {settings.appearance.bannerLogo && (
          <div className="text-center py-4">
            <img
              src={settings.appearance.bannerLogo || "/placeholder.svg"}
              alt="Banner Logo"
              className="h-16 mx-auto object-contain"
            />
          </div>
        )}

        <Header onOpenSettings={() => setShowSettings(true)} />

        <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <ToolPageTitle title="⚔️ LoL Champions Picker Wheel" toolType="lol-wheel" />
            <p className="text-gray-600">
              Pick a random League of Legends champion by wheel
            </p>
          </div>

          {/* Advanced Game Modes Status */}
          {currentSession && (
            <PickerWheelGameStatus
              session={currentSession}
              onEndGame={() => {
                endAdvancedGame();
                // Add game points to total points
                const gameScore = getGameScore();
                setTotalPoints((prev) => prev + gameScore);

                // Save game stats
                const gameStats = getGameStats();
                if (gameStats) {
                  console.log("Game completed:", gameStats);
                }
              }}
              onRestartGame={() => {
                // Add current game points to total points before restarting
                const gameScore = getGameScore();
                setTotalPoints((prev) => prev + gameScore);

                // Save game stats
                const gameStats = getGameStats();
                if (gameStats) {
                  console.log("Game completed:", gameStats);
                }

                // Reset wheel data for restart
                const currentWheel = getCurrentWheel();
                if (currentWheel) {
                  const { updateWheelData } = useWheelManagerStore.getState();
                  updateWheelData("lol-wheel", currentWheel.id, {
                    ...currentWheel.data,
                    totalSpins: 0,
                    spinHistory: [],
                    recentResults: [],
                    selectedResult: null,
                  });
                }

                // Restart the game
                restartAdvancedGame();
              }}
            />
          )}

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    {!isInitialized ? (
                      <div className="flex items-center justify-center w-[700px] h-[700px] bg-gray-100 rounded-full">
                        <div className="text-center">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading champions...</p>
                        </div>
                      </div>
                    ) : (
                      <WheelComponent
                        key={`lol-wheel-${currentTheme}-${selectedRole}-${
                          Array.isArray(selectedChampions)
                            ? selectedChampions.join(",")
                            : ""
                        }-${forceUpdate}`}
                        items={getFilteredChampions()}
                        rotation={rotation}
                        isSpinning={isSpinning}
                        spinDuration={Math.max(
                          4,
                          settings.spinBehavior.spinningDuration / 5
                        )}
                        wheelRef={wheelRef as React.RefObject<HTMLDivElement>}
                        displayMode={displayMode}
                        currentTheme={currentTheme}
                        onManualSelect={handleManualSelect}
                        actionMode={actionMode}
                      />
                    )}

                    {isSpinning && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                        Spinning...
                      </div>
                    )}

                    {isAdvancedGameActive && currentSession?.gameMode && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300 p-2">
                        <p className="text-xs font-semibold text-purple-800">
                          🎮 Playing: {currentSession.gameMode.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Spin Count Display */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {displaySpinCount}
                        </div>
                        <div className="text-sm opacity-90">Total Spins</div>
                      </div>
                    </div>
                  </div>

                  {/* Spin Button */}
                  <Button
                    onClick={spinWheel}
                    disabled={isSpinning || getFilteredChampions().length === 0}
                    className="font-bold py-3 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  >
                    {isSpinning ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Spinning...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>⚔️ SPIN THE WHEEL</span>
                      </div>
                    )}
                  </Button>

                  {/* Quick Input Field for Manual Mode */}
                  {actionMode === "manual" && (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="Type champion name..."
                        className="w-32 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && manualInput.trim()) {
                            handleAddManualChampion(manualInput);
                            setManualInput("");
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (manualInput.trim()) {
                            handleAddManualChampion(manualInput);
                            setManualInput("");
                          }
                        }}
                        disabled={!manualInput.trim()}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Add
                      </Button>
                    </div>
                  )}

                  {/* Mode Selection */}
                  <div className="flex flex-col items-center space-y-2">
                    <Label className="text-sm font-medium text-gray-800">
                      Mode:
                    </Label>
                    <RadioGroup
                      value={actionMode}
                      onValueChange={(value) =>
                        setActionMode(value as ActionMode)
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal" className="text-sm">
                          Normal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="elimination" id="elimination" />
                        <Label htmlFor="elimination" className="text-sm">
                          Elimination
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="manual" />
                        <Label htmlFor="manual" className="text-sm">
                          Manual
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Mode Description */}
                    <div className="text-xs text-gray-600 text-center mt-2">
                      {actionMode === "normal" &&
                        "🎯 All champions available for each spin"}
                      {actionMode === "elimination" &&
                        "❌ Selected champion is removed after each spin"}
                      {actionMode === "manual" &&
                        "📝 Add custom champions by typing names"}
                    </div>
                  </div>

                  {/* Current Result Display */}
                  {spinResult && (
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 rounded-lg p-4 text-center">
                      <h3 className="text-lg font-bold text-green-800 mb-2">
                        🎉 Current Result:
                      </h3>
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-3xl">
                          {spinResult.champion.emoji}
                        </span>
                        <div>
                          <p className="text-xl font-semibold text-gray-800">
                            {spinResult.champion.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {spinResult.champion.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => setShowAllResults(true)}
                      variant="outline"
                      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Results ({spinHistory.length})
                    </Button>
                    <Button
                      onClick={() => {
                        setSpinHistory([]);
                        setSpinResult(null);
                        setAllResults([]);
                        setIsSpinning(false);
                        setShowResultModal(false);
                      }}
                      variant="outline"
                      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* Advanced Game Modes Section */}
                  <div className="flex flex-wrap items-center gap-2 justify-center mt-6 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAchievements(true)}
                      className="text-xs px-3 py-1 bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    >
                      <Trophy className="w-3 h-3 mr-1" />
                      Achievements ({totalPoints})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowThemeSelector(true)}
                      className="text-xs px-3 py-1 bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
                    >
                      <Palette className="w-3 h-3 mr-1" />
                      Themes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAnalytics(true)}
                      className="text-xs px-3 py-1 bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Analytics
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSocialHub(true)}
                      className="text-xs px-3 py-1 bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Social
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGameModes(true)}
                      className="text-xs px-3 py-1 bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <Gamepad2 className="w-3 h-3 mr-1" />
                      Games
                    </Button>
                  </div>
                </div>
              </div>
              {showInputs && (
                <div className="lg:col-span-1 order-1 lg:order-2">
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      setActiveTab(value as "manual" | "ai" | "stats")
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-white border-gray-200">
                      <TabsTrigger
                        value="manual"
                        className="text-gray-800 data-[state=active]:bg-gray-100"
                      >
                        Champions
                      </TabsTrigger>
                      <TabsTrigger
                        value="ai"
                        className="text-gray-800 data-[state=active]:bg-gray-100"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        AI
                      </TabsTrigger>
                      <TabsTrigger
                        value="stats"
                        className="text-gray-800 data-[state=active]:bg-gray-100"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Stats
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual">
                      <ChampionsTab
                        selectedRole={selectedRole}
                        selectedChampions={new Set(selectedChampions)}
                        displayMode={displayMode}
                        showTitle={showTitle}
                        onRoleChange={(role) => {
                          setSelectedRole(role);
                          const allChampions =
                            Object.values(lolChampions).flat();

                          if (role === "all") {
                            // Select all champions
                            const allChampionIds = allChampions.map(
                              (c) => c.id
                            );
                            setSelectedChampions(allChampionIds);
                            setChampionOrder(allChampionIds);
                          } else {
                            // Select only champions of the chosen role
                            const roleChampions = lolChampions[role] || [];
                            const roleChampionIds = roleChampions.map(
                              (c) => c.id
                            );
                            setSelectedChampions(roleChampionIds);
                            setChampionOrder(roleChampionIds);
                          }

                          // Update wheel data
                          const currentWheel = getCurrentWheel();
                          if (currentWheel) {
                            updateWheelData("lol-wheel", currentWheel.id, {
                              ...currentWheel.data,
                              selectedRole: role,
                              selectedChampions:
                                role === "all"
                                  ? allChampions.map((c) => c.id)
                                  : lolChampions[role]?.map((c) => c.id) || [],
                            });
                          }
                        }}
                        onChampionToggle={(championId) => {
                          const isSelected =
                            selectedChampions.includes(championId);
                          let newSelected;

                          if (isSelected) {
                            // Remove champion
                            newSelected = selectedChampions.filter(
                              (id) => id !== championId
                            );
                          } else {
                            // Add champion
                            newSelected = [...selectedChampions, championId];
                          }

                          setSelectedChampions(newSelected);
                          setChampionOrder(newSelected);

                          // Update wheel data
                          const currentWheel = getCurrentWheel();
                          if (currentWheel) {
                            updateWheelData("lol-wheel", currentWheel.id, {
                              ...currentWheel.data,
                              selectedChampions: newSelected,
                              championOrder: newSelected,
                            });
                          }
                        }}
                        onClearAll={() => {
                          const currentWheel = getCurrentWheel();
                          if (currentWheel) {
                            updateWheelData("lol-wheel", currentWheel.id, {
                              ...currentWheel.data,
                              selectedChampions: [],
                            });
                          }
                        }}
                        onDisplayModeChange={(mode) => {
                          const currentWheel = getCurrentWheel();
                          if (currentWheel) {
                            updateWheelData("lol-wheel", currentWheel.id, {
                              ...currentWheel.data,
                              displayMode: mode,
                            });
                          }
                        }}
                        onShowTitleToggle={() => {
                          // Title toggle functionality - placeholder for future implementation
                          console.log("Title toggle clicked");
                        }}
                        onPreviewChampion={(champion) => {
                          setPreviewChampion(champion);
                        }}
                        getRoleCount={() => ({
                          selected: selectedChampions.length,
                          available: Object.values(lolChampions).flat().length,
                        })}
                      />

                      {/* Custom Champions Card with gap */}
                      <div className="mt-6">
                        <CustomChampionsCard
                          customChampions={customChampions}
                          selectedChampions={new Set(selectedChampions)}
                          onChampionToggle={(championId) => {
                            const currentWheel = getCurrentWheel();
                            if (currentWheel) {
                              const currentData = currentWheel.data as any;
                              const isSelected =
                                selectedChampions.includes(championId);
                              const newSelected = isSelected
                                ? selectedChampions.filter(
                                    (id) => id !== championId
                                  )
                                : [...selectedChampions, championId];

                              setSelectedChampions(newSelected);
                              setChampionOrder(newSelected);

                              updateWheelData("lol-wheel", currentWheel.id, {
                                ...currentData,
                                selectedChampions: newSelected,
                                championOrder: newSelected,
                              });
                            }
                          }}
                          onPreviewChampion={(champion) => {
                            setPreviewChampion(champion);
                          }}
                          onDeleteCustomChampion={(championId) => {
                            const currentWheel = getCurrentWheel();
                            if (currentWheel) {
                              const currentData = currentWheel.data as any;

                              // Remove from custom champions
                              const newCustomChampions = customChampions.filter(
                                (c) => c.id !== championId
                              );
                              setCustomChampions(newCustomChampions);

                              // Remove from selected champions
                              const newSelected = selectedChampions.filter(
                                (id) => id !== championId
                              );
                              setSelectedChampions(newSelected);
                              setChampionOrder(newSelected);

                              updateWheelData("lol-wheel", currentWheel.id, {
                                ...currentData,
                                customChampions: newCustomChampions,
                                selectedChampions: newSelected,
                                championOrder: newSelected,
                              });
                            }
                          }}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="ai">
                      <AITab
                        aiMode={data?.aiMode || "chat"}
                        aiQuery={data?.aiQuery || ""}
                        aiResponse={data?.aiResponse || ""}
                        aiLoading={false}
                        aiChatHistory={data?.aiChatHistory || []}
                        aiRecommendations={data?.aiRecommendations || []}
                        userPreferences={
                          data?.userPreferences || {
                            favoriteRoles: [],
                            preferredDifficulty: "all",
                            playStyle: "casual",
                            favoriteRegions: [],
                          }
                        }
                        selectedItems={new Set(selectedChampions)}
                        onModeChange={(mode) => {
                          const currentWheel = getCurrentWheel();
                          if (currentWheel) {
                            updateWheelData("lol-wheel", currentWheel.id, {
                              ...currentWheel.data,
                              aiMode: mode,
                            });
                          }
                        }}
                        onQueryChange={(query) => {
                          const currentWheel = getCurrentWheel();
                          if (currentWheel) {
                            updateWheelData("lol-wheel", currentWheel.id, {
                              ...currentWheel.data,
                              aiQuery: query,
                            });
                          }
                        }}
                        onQuerySubmit={() => {
                          // Handle AI query submission
                        }}
                        onPreferencesChange={(preferences) => {
                          const currentWheel = getCurrentWheel();
                          if (currentWheel) {
                            updateWheelData("lol-wheel", currentWheel.id, {
                              ...currentWheel.data,
                              userPreferences: preferences,
                            });
                          }
                        }}
                        onItemsChange={(items) => {
                          const newSelectedChampions = Array.from(items);
                          setSelectedChampions(newSelectedChampions);
                          setChampionOrder(newSelectedChampions);

                          const currentWheel = getCurrentWheel();
                          if (currentWheel) {
                            updateWheelData("lol-wheel", currentWheel.id, {
                              ...currentWheel.data,
                              selectedChampions: newSelectedChampions,
                              championOrder: newSelectedChampions,
                            });
                          }
                        }}
                        onResponseChange={(response) => {
                          const currentWheel = getCurrentWheel();
                          if (currentWheel) {
                            updateWheelData("lol-wheel", currentWheel.id, {
                              ...currentWheel.data,
                              aiResponse: response,
                            });
                          }
                        }}
                        onFilterChange={(filter) => {
                          const currentWheel = getCurrentWheel();
                          if (currentWheel) {
                            updateWheelData("lol-wheel", currentWheel.id, {
                              ...currentWheel.data,
                              selectedRole: filter,
                            });
                          }
                        }}
                        getAllItems={() => Object.values(lolChampions).flat()}
                        getFilteredItems={() => data?.selectedChampions || []}
                      />
                    </TabsContent>

                    <TabsContent value="stats">
                      <StatsTab
                        championStats={(() => {
                          const stats: Record<string, number> = {};
                          (data?.selectedChampions || []).forEach(
                            (champion: any) => {
                              stats[champion.role] =
                                (stats[champion.role] || 0) + 1;
                            }
                          );
                          return stats;
                        })()}
                        allResults={data?.recentResults || []}
                        getAllChampions={() =>
                          Object.values(lolChampions).flat()
                        }
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </main>

        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        <PickerWheelAchievementsDisplay
          achievements={achievements}
          totalPoints={totalPoints}
          isVisible={showAchievements}
          onClose={() => setShowAchievements(false)}
        />

        <PickerWheelThemeSelector
          themes={themes}
          currentTheme={currentTheme}
          onThemeSelect={handleThemeSelect}
          isVisible={showThemeSelector}
          onClose={() => setShowThemeSelector(false)}
        />

        <PickerWheelAnalyticsDisplay
          analytics={(() => {
            const currentWheel = getCurrentWheel();
            const wheelData = currentWheel?.data as any;
            const totalSpinsFromWheel = wheelData?.totalSpins || 0;
            const recentResults = wheelData?.recentResults || [];

            // Create spin records from recent results for analytics
            const spinRecords: SpinRecord[] = recentResults.map(
              (result: any, index: number) => ({
                id: `spin-${Date.now()}-${index}`,
                timestamp: new Date(
                  Date.now() - (recentResults.length - index - 1) * 1000
                ), // Approximate timestamps
                result: result.name,
                options:
                  wheelData.selectedChampions?.map(
                    (champion: any) => champion.name
                  ) || [],
                mode: activeTab === "ai" ? "ai" : "manual",
                theme: currentTheme,
                spinDuration: 3,
                userQuestion: undefined,
              })
            );

            const analyticsData = analyzeSpinData(spinRecords);
            // Ensure analytics shows the correct data from wheel
            return {
              ...analyticsData,
              totalSpins: totalSpinsFromWheel,
              uniqueResults: new Set(recentResults.map((r: any) => r.name))
                .size,
            };
          })()}
          isVisible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />

        <PickerWheelSocialHub
          isVisible={showSocialHub}
          onClose={() => setShowSocialHub(false)}
          currentUser={currentUser}
          onShareWheel={() => {
            // TODO: Implement wheel sharing functionality
            console.log("Share wheel functionality");
          }}
        />

        <PickerWheelGameModes
          isVisible={showGameModes}
          onClose={() => setShowGameModes(false)}
          userPoints={totalPoints}
          onStartGame={(gameMode: GameMode) => {
            // Reset wheel data for new game
            const currentWheel = getCurrentWheel();
            if (currentWheel) {
              const { updateWheelData } = useWheelManagerStore.getState();
              updateWheelData("lol-wheel", currentWheel.id, {
                ...currentWheel.data,
                totalSpins: 0,
                spinHistory: [],
                recentResults: [],
                selectedResult: null,
              });
            }

            // Start the game
            startAdvancedGame(gameMode);
            setShowGameModes(false);
          }}
        />

        {/* Dialog Components */}
        <ResultDialog
          result={spinResult}
          open={showResultModal}
          onClose={() => setShowResultModal(false)}
        />

        <ResultsHistoryDialog
          open={showAllResults}
          onOpenChange={setShowAllResults}
          results={(() => {
            // Get all LoL wheels and combine their results (like Fortnite)
            const { wheelsByTool } = useWheelManagerStore.getState();
            const allLoLWheels = wheelsByTool["lol-wheel"] || [];

            const allResults: any[] = [];

            allLoLWheels.forEach((wheel: any) => {
              const wheelData = wheel.data as any;
              if (
                wheelData.spinHistory &&
                Array.isArray(wheelData.spinHistory)
              ) {
                wheelData.spinHistory.forEach((spinRecord: any) => {
                  // Find the champion from the spin record
                  const champion = Object.values(lolChampions)
                    .flat()
                    .find(
                      (champ) =>
                        champ.name === spinRecord.champion?.name ||
                        champ.id === spinRecord.champion?.id
                    ) || {
                    id:
                      spinRecord.champion?.id ||
                      spinRecord.champion?.name ||
                      "unknown",
                    name:
                      spinRecord.champion?.name ||
                      spinRecord.result ||
                      "Unknown Champion",
                    emoji: spinRecord.champion?.emoji || "🎯",
                    role: spinRecord.champion?.role || "Unknown",
                    region: spinRecord.champion?.region || "Unknown",
                    difficulty: spinRecord.champion?.difficulty || "medium",
                    popularity: spinRecord.champion?.popularity || "medium",
                    preview: spinRecord.champion?.preview || "/placeholder.svg",
                  };

                  allResults.push({
                    champion,
                    timestamp: new Date(spinRecord.timestamp),
                    wheelName: spinRecord.wheelName || wheel.name, // Use stored wheel name or fallback to wheel name
                  });
                });
              }
            });

            // Sort by timestamp (most recent first)
            return allResults.sort(
              (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
            );
          })()}
          onClearResults={() => {
            setSpinHistory([]);
            setSpinResult(null);
            setAllResults([]);
            setIsSpinning(false);
            setTotalSpins(0);
            setShowResultModal(false);

            // Update wheel data to persist the clear action
            const currentWheel = getCurrentWheel();
            if (currentWheel) {
              updateWheelData("lol-wheel", currentWheel.id, {
                ...currentWheel.data,
                spinHistory: [],
                selectedResult: null,
                totalSpins: 0,
                recentResults: [],
              });
            }
          }}
        />

        <ChampionPreviewDialog
          champion={previewChampion}
          onClose={() => setPreviewChampion(null)}
        />

        {/* Confetti Animation */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}

        {/* Fullscreen Toggle Button */}
        {!isFullscreen && (
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-4 right-4 bg-white/90 hover:bg-white shadow-md"
            onClick={() => setShowInputs(!showInputs)}
          >
            {showInputs ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </ToastProvider>
  );
}
