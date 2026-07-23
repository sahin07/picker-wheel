"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { ToolPageTitle } from "@/components/tool-favorite-star";
import Footer from "@/components/footer";
import PickerResultsModal from "@/components/picker-results-modal";
import { LolWheelPopularTemplates } from "@/components/lol-wheel/lol-wheel-popular-templates";
import type { LolWheelDeepLink } from "@/lib/lol-wheel-spokes";
import { LOL_WHEEL_SHORT_TITLE } from "@/lib/lol-wheel-seo";
import {
  applyLolWheelUseCase,
  getLolWheelUseCase,
  lolWheelUseCaseFromTemplate,
  type LolWheelUseCaseId,
} from "@/lib/lol-wheel-use-cases";
import {
  applyWheelRotation,
  computeSpinEndRotation,
  computeSpinFrame,
  getSpinDurationMs,
  pickSegmentIndex,
} from "@/lib/wheel-spin-animation";
import {
  createSpinAudioController,
  type SpinAudioController,
} from "@/lib/wheel-spin-audio";
import LolWheelSection from "@/components/lol-wheel-section";
import LolInputPanel from "@/components/lol-input-panel";
import { ChampionPreviewDialog } from "@/components/dialogs/champion-preview-dialog";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";
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

type LolWheelAppProps = {
  seoIntro?: ReactNode;
  seoSections?: ReactNode;
  shortTitle?: string;
  toolSubtitle?: string;
  deepLink?: LolWheelDeepLink;
};

function LolWheelAppInner({
  seoIntro,
  seoSections,
  shortTitle,
  toolSubtitle,
  deepLink,
}: LolWheelAppProps) {
  // Core state — seed from spoke deepLink so the wheel isn't empty on first paint
  const [selectedRole, setSelectedRole] = useState<RoleFilter>(
    () => deepLink?.config.selectedRole ?? "all",
  );
  const [selectedChampions, setSelectedChampions] = useState<string[]>(
    () => deepLink?.config.champions.map((c) => c.id) ?? [],
  );
  const [championOrder, setChampionOrder] = useState<string[]>(
    () => deepLink?.config.champions.map((c) => c.id) ?? [],
  );
  const [totalSpins, setTotalSpins] = useState(0);
  const [spinHistory, setSpinHistory] = useState<any[]>([]);
  const [customChampions, setCustomChampions] = useState<LoLChampion[]>([]);

  // Client-side spin count display to avoid hydration issues (like Fortnite)
  const [displaySpinCount, setDisplaySpinCount] = useState(totalSpins);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Local state - like Fortnite wheel
  const [forceUpdate, setForceUpdate] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    () => deepLink?.config.displayMode ?? "emoji-name",
  );
  const [actionMode, setActionMode] = useState<ActionMode>("normal");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [muted, setMuted] = useState(false);
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
  const { settings, updateSettings, loadFromDatabase: loadSettings } = useSettingsStore();
  const removeWinnerAfterSpin = useSettingsStore(
    (st) => st.settings.spinBehavior?.removeWinnerAfterSpin,
  );
  const searchParams = useSearchParams();
  const [activeUseCaseId, setActiveUseCaseId] = useState<LolWheelUseCaseId | null>(
    deepLink?.useCaseId ?? null,
  );
  const deepLinkAppliedRef = useRef(false);
  const lastAppliedUseCaseRef = useRef<LolWheelUseCaseId | null>(null);
  const spinAnimationRef = useRef<number | null>(null);
  const spinAudioRef = useRef<SpinAudioController | null>(null);
  const rotationRef = useRef(0);
  const mutedRef = useRef(false);

  // Seed champions immediately from localStorage (or all champions on hub).
  // Avoids empty wheel when Zustand persist rehydrates after first paint.
  useEffect(() => {
    if (deepLink?.config.champions?.length) return;
    if (selectedChampions.length > 0) return;
    if (lolWheelUseCaseFromTemplate(searchParams.get("template"))) return;

    try {
      const raw = localStorage.getItem("wheel-manager");
      if (raw) {
        const parsed = JSON.parse(raw);
        const state = parsed.state ?? parsed;
        const lol = state.wheelsByTool?.["lol-wheel"] || [];
        const remembered = state.lastWheelIdByTool?.["lol-wheel"];
        const stored =
          lol.find((w: { id: string }) => w.id === remembered) ||
          lol.find((w: { id: string }) => w.id === state.currentWheelId) ||
          lol[0];
        const ids = stored?.data?.selectedChampions;
        if (Array.isArray(ids) && ids.length > 0) {
          const normalized =
            typeof ids[0] === "string"
              ? ids
              : ids.map((c: { id: string }) => c.id);
          setSelectedChampions(normalized);
          setChampionOrder(
            stored?.data?.championOrder?.length
              ? stored.data.championOrder
              : normalized,
          );
          return;
        }
      }
    } catch {
      // ignore parse errors
    }

    const allIds = Object.values(lolChampions).flat().map((c) => c.id);
    setSelectedChampions(allIds);
    setChampionOrder(allIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncActionMode = useCallback(
    (mode: ActionMode) => {
      setActionMode(mode);
      if (mode === "elimination" || mode === "normal") {
        const latest = useSettingsStore.getState().settings;
        updateSettings({
          spinBehavior: {
            ...latest.spinBehavior,
            removeWinnerAfterSpin: mode === "elimination",
          },
        });
      }
    },
    [updateSettings],
  );

  // Keep Game Mode in sync with Header/Settings → Remove winner (and reverse), like Fortnite
  useEffect(() => {
    if (actionMode === "manual") return;
    const wantMode: ActionMode = removeWinnerAfterSpin ? "elimination" : "normal";
    if (actionMode !== wantMode) {
      setActionMode(wantMode);
    }
  }, [removeWinnerAfterSpin, actionMode]);

  const applyUseCasePreset = useCallback((id: LolWheelUseCaseId) => {
    const useCase = getLolWheelUseCase(id);
    if (!useCase || !applyLolWheelUseCase(id)) return;
    setActiveUseCaseId(id);
    const ids = useCase.config.champions.map((c) => c.id);
    setSelectedChampions(ids);
    setChampionOrder(ids);
    setSelectedRole(useCase.config.selectedRole);
    setDisplayMode(useCase.config.displayMode);
    lastAppliedUseCaseRef.current = id;
    deepLinkAppliedRef.current = true;
    setForceUpdate((p) => p + 1);
  }, []);

  // Spoke / ?template= — re-apply when useCase changes (client nav between spokes)
  useEffect(() => {
    const id =
      deepLink?.useCaseId ??
      lolWheelUseCaseFromTemplate(searchParams.get("template"));
    if (!id) return;
    if (lastAppliedUseCaseRef.current === id && deepLinkAppliedRef.current) return;
    // Apply after a tick so the wheel store has a current wheel; keep delay short
    // to avoid a visible empty-wheel flash on spoke pages.
    const timer = window.setTimeout(() => {
      applyUseCasePreset(id);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [deepLink?.useCaseId, searchParams, applyUseCasePreset]);

  // Sync muted state → ref so animation callbacks always read fresh value
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Spin — shared animation + audio (Fortnite/Pokémon pattern)
  const completeSpinAtRotation = useCallback(
    (finalRotation: number) => {
      const availableChampions = getFilteredChampions();
      if (availableChampions.length === 0) {
        setIsSpinning(false);
        return;
      }

      const selectedIndex = pickSegmentIndex(finalRotation, availableChampions.length);
      const selectedChampion = availableChampions[selectedIndex];
      if (!selectedChampion) {
        setIsSpinning(false);
        return;
      }

      rotationRef.current = finalRotation;
      setRotation(finalRotation);
      applyWheelRotation(wheelRef.current, finalRotation);

      const result: SpinResult = {
        champion: selectedChampion,
        timestamp: new Date(),
      };

      const recentEntry = {
        id: selectedChampion.id,
        name: selectedChampion.name,
        emoji: selectedChampion.emoji,
        timestamp: Date.now(),
      };

      setSpinResult(result);
      setAllResults((prev) => [...prev, result]);
      setIsSpinning(false);
      if (settings.confettiSound?.enableConfetti !== false) {
        setShowConfetti(true);
      }

      try {
        spinAudioRef.current?.stop();
        const vol = settings.confettiSound?.soundVolume || 0.5;
        if (settings.confettiSound?.enableSound !== false && !mutedRef.current) {
          const win = new Audio("/sound-win.mp3");
          win.volume = Math.min(1, vol);
          void win.play().catch(() => {});
        }
      } catch {
        // ignore audio errors
      }

      const currentWheel = getCurrentWheel();
      if (currentWheel) {
        const currentData = currentWheel.data as any;
        const newTotalSpins = (currentData.totalSpins || 0) + 1;
        setTotalSpins(newTotalSpins);
        setSpinHistory((prev) => [result, ...prev.slice(0, 9)]);

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

        const existingSpins = currentData.spinHistory || [];
        const allSpunChampions = [...existingSpins, result].map(
          (spin) => spin.champion?.id || spin.champion,
        );
        const uniqueChampionsSpun = [...new Set(allSpunChampions.filter(Boolean))].length;
        const championRole = selectedChampion.role || "unknown";
        const spinResultsByRole = { ...currentStats.spinResultsByRole };
        spinResultsByRole[championRole] = (spinResultsByRole[championRole] || 0) + 1;
        const mostSpunRole =
          Object.entries(spinResultsByRole).reduce((a, b) =>
            spinResultsByRole[a[0]] > spinResultsByRole[b[0]] ? a : b,
          )?.[0] || undefined;
        const championSpins = allSpunChampions.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const mostSpunChampion =
          Object.entries(championSpins).reduce((a, b) =>
            championSpins[a[0]] > championSpins[b[0]] ? a : b,
          )?.[0] || undefined;

        updateWheelData("lol-wheel", currentWheel.id, {
          ...currentData,
          selectedResult: result,
          isSpinning: false,
          totalSpins: newTotalSpins,
          spinHistory: [result, ...(currentData.spinHistory || []).slice(0, 9)],
          recentResults: [recentEntry, ...(currentData.recentResults || [])].slice(0, 10),
          rotation: finalRotation,
          statistics: {
            ...currentStats,
            totalSpins: newTotalSpins,
            uniqueChampionsSpun,
            mostSpunChampion,
            mostSpunRole,
            lastSpinDate: new Date().toISOString(),
            firstSpinDate: currentStats.firstSpinDate || new Date().toISOString(),
            spinResultsByRole,
          },
        });
      }

      if (actionMode === "elimination" || removeWinnerAfterSpin) {
        const newSelected = selectedChampions.filter((id) => id !== selectedChampion.id);
        setSelectedChampions(newSelected);
        setChampionOrder(newSelected);
        setForceUpdate((prev) => prev + 1);
        const wheel2 = getCurrentWheel();
        if (wheel2) {
          updateWheelData("lol-wheel", wheel2.id, {
            ...wheel2.data,
            selectedChampions: newSelected,
            championOrder: newSelected,
          });
        }
      }
    },
    [
      getFilteredChampions,
      selectedChampions,
      actionMode,
      removeWinnerAfterSpin,
      getCurrentWheel,
      updateWheelData,
      settings.confettiSound,
    ],
  );

  const spinWheel = useCallback(() => {
    const availableChampions = getFilteredChampions();
    if (isSpinning || availableChampions.length === 0) return;

    if (spinAnimationRef.current) {
      cancelAnimationFrame(spinAnimationRef.current);
      spinAnimationRef.current = null;
    }
    spinAudioRef.current?.stop();

    const duration = getSpinDurationMs(settings.spinBehavior?.spinningDuration);
    const speedLevel = settings.spinBehavior?.spinningSpeedLevel;
    const startRotation = rotationRef.current || rotation || 0;
    const endRotation = computeSpinEndRotation(startRotation, {
      randomInitialAngle: settings.display?.randomInitialAngle,
    });
    const startTime = Date.now();
    const soundVolume = settings.confettiSound?.soundVolume || 0.5;
    const soundOn =
      settings.confettiSound?.enableSound !== false && !mutedRef.current;

    setIsSpinning(true);
    applyWheelRotation(wheelRef.current, startRotation);

    if (soundOn) {
      try {
        if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController();
        spinAudioRef.current.startWhoosh("/wheel-sound.mp3", soundVolume);
      } catch {
        // ignore
      }
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const { rotation: newRotation, done } = computeSpinFrame(
        startRotation,
        endRotation,
        elapsed,
        duration,
        speedLevel,
      );
      rotationRef.current = newRotation;
      applyWheelRotation(wheelRef.current, newRotation);

      if (soundOn && availableChampions.length > 0) {
        try {
          if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController();
          spinAudioRef.current.syncFrame(newRotation, availableChampions.length, soundVolume, null);
        } catch {
          // ignore
        }
      }

      if (!done) {
        spinAnimationRef.current = requestAnimationFrame(animate);
      } else {
        spinAnimationRef.current = null;
        setRotation(newRotation);
        completeSpinAtRotation(newRotation);
      }
    };

    spinAnimationRef.current = requestAnimationFrame(animate);
  }, [
    getFilteredChampions,
    isSpinning,
    rotation,
    settings.spinBehavior,
    settings.confettiSound,
    settings.display,
    completeSpinAtRotation,
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

  // Recover selection if local state is empty but the store already has champions
  // (hydration / wrong currentWheelId race). Do not gate on isInitialized.
  useEffect(() => {
    const fromStore = data?.selectedChampions;
    if (
      selectedChampions.length > 0 ||
      !Array.isArray(fromStore) ||
      fromStore.length === 0
    ) {
      return;
    }
    setSelectedChampions(fromStore);
    setChampionOrder(
      data?.championOrder?.length ? data.championOrder : fromStore,
    );
    setForceUpdate((p) => p + 1);
  }, [data?.selectedChampions, data?.championOrder, selectedChampions.length]);

  // Save data to wheel manager store whenever it changes (like Fortnite does)
  useEffect(() => {
    const currentWheel = getCurrentWheel();
    if (currentWheel && isInitialized && isDataLoaded) {
      const presetId =
        deepLink?.useCaseId ||
        lolWheelUseCaseFromTemplate(searchParams.get("template"));
      // Wait until spoke/template preset has applied before persisting — avoids
      // a stale empty-selection effect overwriting the preset in the store.
      if (presetId && !deepLinkAppliedRef.current) return;

      // Don't persist an empty selection over a populated store (hydration race).
      const existing = (currentWheel.data as { selectedChampions?: string[] })
        ?.selectedChampions;
      if (
        selectedChampions.length === 0 &&
        Array.isArray(existing) &&
        existing.length > 0
      ) {
        return;
      }

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

      // Load champions from store when present. Never clear here — an empty
      // read during persist rehydration was wiping a valid in-memory selection.
      if (wheelData.selectedChampions?.length > 0) {
        console.log(
          "Loading selectedChampions from wheel data:",
          wheelData.selectedChampions
        );
        setSelectedChampions(wheelData.selectedChampions);
        setChampionOrder(
          wheelData.championOrder?.length
            ? wheelData.championOrder
            : wheelData.selectedChampions,
        );
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
    const initializeApp = async () => {
      try {
        await loadSettings();

        // Hydrate BEFORE setCurrentTool so we don't create a throwaway wheel
        // on an empty in-memory store, then lose track of the persisted LoL wheel.
        await new Promise<void>((resolve) => {
          const api = useWheelManagerStore.persist;
          if (api?.hasHydrated?.()) {
            resolve();
            return;
          }
          let done = false;
          const finish = () => {
            if (done) return;
            done = true;
            unsub?.();
            resolve();
          };
          const unsub = api?.onFinishHydration?.(finish);
          window.setTimeout(finish, 800);
        });

        // Selects last/first lol wheel, or creates one with all champions
        setCurrentTool("lol-wheel");

        let currentWheel = getCurrentWheel();
        if (!currentWheel) {
          const state = useWheelManagerStore.getState();
          const lolWheels = state.wheelsByTool["lol-wheel"] || [];
          if (lolWheels.length > 0) {
            const remembered = state.lastWheelIdByTool["lol-wheel"];
            const target =
              lolWheels.find((w) => w.id === remembered) || lolWheels[0];
            state.setCurrentWheel(target.id);
            currentWheel = getCurrentWheel();
          } else {
            createNewWheel("lol-wheel", "LoL Champions Picker Wheel");
            currentWheel = getCurrentWheel();
          }
        }

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
            // Skip auto-select if a deepLink/template preset will be applied shortly
            const hasDeepLink = Boolean(deepLink);
            const hasTemplate = Boolean(
              lolWheelUseCaseFromTemplate(searchParams.get("template")),
            );
            if (!hasDeepLink && !hasTemplate && !deepLinkAppliedRef.current) {
              // Auto-select all champions on first load
              console.log(
                "No selected champions found, auto-selecting all champions",
              );
              const allChampions = Object.values(lolChampions).flat();
              const allChampionIds = allChampions.map((champion) => champion.id);
              console.log(
                "Auto-selecting champions:",
                allChampionIds.length,
                "champions",
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
          // Skip if a deepLink/template preset will populate the wheel
          const hasDeepLink = Boolean(deepLink);
          const hasTemplate = Boolean(
            lolWheelUseCaseFromTemplate(searchParams.get("template")),
          );
          const allChampions = Object.values(lolChampions).flat();
          const allChampionIds = hasDeepLink || hasTemplate || deepLinkAppliedRef.current
            ? []
            : allChampions.map((champion) => champion.id);
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
        } else {
          // Last resort: still mark initialized and seed all champions so the UI works
          const hasDeepLink = Boolean(deepLink);
          const hasTemplate = Boolean(
            lolWheelUseCaseFromTemplate(searchParams.get("template")),
          );
          if (!hasDeepLink && !hasTemplate) {
            const allChampionIds = Object.values(lolChampions)
              .flat()
              .map((c) => c.id);
            setSelectedChampions(allChampionIds);
            setChampionOrder(allChampionIds);
          }
          setIsDataLoaded(true);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing LoL wheel:", error);
        setIsDataLoaded(true);
        setIsInitialized(true);
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
        if (settings.confettiSound?.enableConfetti !== false) {
          setShowConfetti(true);
        }

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
    [actionMode, settings.confettiSound]
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

  // ── Named handlers ──────────────────────────────────────────────────────────

  const handleManualStop = useCallback(() => {
    if (!isSpinning) return;
    if (spinAnimationRef.current) {
      cancelAnimationFrame(spinAnimationRef.current);
      spinAnimationRef.current = null;
    }
    spinAudioRef.current?.stop();
    completeSpinAtRotation(rotationRef.current);
  }, [isSpinning, completeSpinAtRotation]);

  const handleRoleChange = useCallback(
    (role: RoleFilter) => {
      setSelectedRole(role);
      const allChampions = Object.values(lolChampions).flat();
      if (role === "all") {
        const ids = allChampions.map((c) => c.id);
        setSelectedChampions(ids);
        setChampionOrder(ids);
      } else {
        const ids = ((lolChampions as unknown as Record<string, typeof allChampions>)[role] || []).map((c) => c.id);
        setSelectedChampions(ids);
        setChampionOrder(ids);
      }
      const currentWheel = getCurrentWheel();
      if (currentWheel) {
        updateWheelData("lol-wheel", currentWheel.id, {
          ...currentWheel.data,
          selectedRole: role,
          selectedChampions:
            role === "all"
              ? allChampions.map((c) => c.id)
              : ((lolChampions as unknown as Record<string, typeof allChampions>)[role] || []).map((c) => c.id),
        });
      }
      setForceUpdate((p) => p + 1);
    },
    [getCurrentWheel, updateWheelData],
  );

  const handleChampionToggle = useCallback(
    (championId: string) => {
      const isSelected = selectedChampions.includes(championId);
      const newSelected = isSelected
        ? selectedChampions.filter((id) => id !== championId)
        : [...selectedChampions, championId];
      setSelectedChampions(newSelected);
      setChampionOrder(newSelected);
      const currentWheel = getCurrentWheel();
      if (currentWheel) {
        updateWheelData("lol-wheel", currentWheel.id, {
          ...currentWheel.data,
          selectedChampions: newSelected,
          championOrder: newSelected,
        });
      }
    },
    [selectedChampions, getCurrentWheel, updateWheelData],
  );

  const handleClearAll = useCallback(() => {
    setSelectedChampions([]);
    setChampionOrder([]);
    const currentWheel = getCurrentWheel();
    if (currentWheel) {
      updateWheelData("lol-wheel", currentWheel.id, {
        ...currentWheel.data,
        selectedChampions: [],
        championOrder: [],
      });
    }
    setForceUpdate((p) => p + 1);
  }, [getCurrentWheel, updateWheelData]);

  const handleDisplayModeChange = useCallback(
    (mode: DisplayMode) => {
      setDisplayMode(mode);
      const currentWheel = getCurrentWheel();
      if (currentWheel) {
        updateWheelData("lol-wheel", currentWheel.id, {
          ...currentWheel.data,
          displayMode: mode,
        });
      }
    },
    [getCurrentWheel, updateWheelData],
  );

  const handleDeleteCustomChampion = useCallback(
    (championId: string) => {
      const currentWheel = getCurrentWheel();
      if (currentWheel) {
        const currentData = currentWheel.data as any;
        const newCustomChampions = customChampions.filter((c) => c.id !== championId);
        setCustomChampions(newCustomChampions);
        const newSelected = selectedChampions.filter((id) => id !== championId);
        setSelectedChampions(newSelected);
        setChampionOrder(newSelected);
        updateWheelData("lol-wheel", currentWheel.id, {
          ...currentData,
          customChampions: newCustomChampions,
          selectedChampions: newSelected,
          championOrder: newSelected,
        });
      }
    },
    [customChampions, selectedChampions, getCurrentWheel, updateWheelData],
  );

  const handleChampionsChange = useCallback(
    (items: Set<string>) => {
      const ids = Array.from(items);
      setSelectedChampions(ids);
      setChampionOrder(ids);
      const currentWheel = getCurrentWheel();
      if (currentWheel) {
        updateWheelData("lol-wheel", currentWheel.id, {
          ...currentWheel.data,
          selectedChampions: ids,
          championOrder: ids,
        });
      }
      setForceUpdate((p) => p + 1);
    },
    [getCurrentWheel, updateWheelData],
  );

  const handleShuffleChampions = useCallback(() => {
    const shuffled = [...selectedChampions].sort(() => Math.random() - 0.5);
    setSelectedChampions(shuffled);
    setChampionOrder(shuffled);
    setForceUpdate((p) => p + 1);
  }, [selectedChampions]);

  const handleSortChampionsAZ = useCallback(() => {
    const all = getAllChampions();
    const sorted = [...selectedChampions].sort((a, b) => {
      const nameA = all.find((c) => c.id === a)?.name ?? a;
      const nameB = all.find((c) => c.id === b)?.name ?? b;
      return nameA.localeCompare(nameB);
    });
    setSelectedChampions(sorted);
    setChampionOrder(sorted);
    setForceUpdate((p) => p + 1);
  }, [selectedChampions, getAllChampions]);

  const handleSortChampionsZA = useCallback(() => {
    const all = getAllChampions();
    const sorted = [...selectedChampions].sort((a, b) => {
      const nameA = all.find((c) => c.id === a)?.name ?? a;
      const nameB = all.find((c) => c.id === b)?.name ?? b;
      return nameB.localeCompare(nameA);
    });
    setSelectedChampions(sorted);
    setChampionOrder(sorted);
    setForceUpdate((p) => p + 1);
  }, [selectedChampions, getAllChampions]);

  const handleImportChampionsText = useCallback(
    (text: string) => {
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const all = getAllChampions();
      const matched: string[] = [];
      for (const line of lines) {
        const found = all.find(
          (c) => c.name.toLowerCase() === line.toLowerCase(),
        );
        if (found) matched.push(found.id);
      }
      if (matched.length > 0) {
        setSelectedChampions(matched);
        setChampionOrder(matched);
        const currentWheel = getCurrentWheel();
        if (currentWheel) {
          updateWheelData("lol-wheel", currentWheel.id, {
            ...currentWheel.data,
            selectedChampions: matched,
            championOrder: matched,
          });
        }
        setForceUpdate((p) => p + 1);
      }
    },
    [getAllChampions, getCurrentWheel, updateWheelData],
  );

  const handleApplyPalette = useCallback((colors: readonly string[]) => {
    setThemes((prev) =>
      prev.map((t) =>
        t.id === currentTheme ? { ...t, colors: [...colors] } : t,
      ),
    );
    setForceUpdate((p) => p + 1);
  }, [currentTheme]);

  // ────────────────────────────────────────────────────────────────────────────

  return (
    <ToastProvider>
      <div
        className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
          isFullscreen ? "fixed inset-0 z-50 overflow-auto" : ""
        }`}
        style={{
          backgroundColor: settings.appearance.backgroundColor,
          backgroundImage: settings.appearance.backgroundImage
            ? `url(${settings.appearance.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {settings.appearance.bannerLogo && !isFullscreen && (
          <div className="py-4 text-center">
            <img
              src={settings.appearance.bannerLogo || "/placeholder.svg"}
              alt="Banner Logo"
              className="mx-auto h-16 object-contain"
            />
          </div>
        )}

        {!isFullscreen && (
          <Header
            onOpenSettings={() => setShowSettings(true)}
            onOpenGames={() => setShowGameModes(true)}
          />
        )}

        <main
          className={`w-full min-w-0 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8 ${
            isFullscreen ? "py-4" : ""
          }`}
        >
          {!isFullscreen && (
            <div className="mb-4 text-center">
              <ToolPageTitle
                title={shortTitle ?? LOL_WHEEL_SHORT_TITLE}
                toolType="lol-wheel"
              />
              <p className="text-gray-600">
                {toolSubtitle ?? "Pick a random League of Legends champion by wheel"}
              </p>
            </div>
          )}

          {!isFullscreen && <LolWheelPopularTemplates />}

          {!isFullscreen && activeUseCaseId && getLolWheelUseCase(activeUseCaseId) && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                Template: {getLolWheelUseCase(activeUseCaseId)!.label}
              </span>
            </div>
          )}

          {/* Advanced Game Modes Status */}
          {currentSession && (
            <PickerWheelGameStatus
              session={currentSession}
              onEndGame={() => {
                endAdvancedGame();
                const gameScore = getGameScore();
                setTotalPoints((prev) => prev + gameScore);
                const gameStats = getGameStats();
                if (gameStats) {
                  console.log("Game completed:", gameStats);
                }
              }}
              onRestartGame={() => {
                const gameScore = getGameScore();
                setTotalPoints((prev) => prev + gameScore);
                const gameStats = getGameStats();
                if (gameStats) {
                  console.log("Game completed:", gameStats);
                }
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
                restartAdvancedGame();
              }}
            />
          )}

          <div
            id="lol-spin-wheel"
            className="mb-6 grid min-w-0 gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-3 lg:gap-8"
          >
            <div
              className={`relative min-w-0 overflow-x-hidden bg-white p-3 sm:p-6 ${
                isFullscreen || !showInputs
                  ? "lg:col-span-3"
                  : "rounded-lg border shadow-sm lg:col-span-2"
              }`}
            >
              {!isFullscreen && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllResults(true)}
                  className="absolute left-2 top-2 z-10 border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50 sm:left-4 sm:top-4 sm:px-3"
                >
                  Results
                  {(((wheel?.data as any)?.recentResults?.length) || spinHistory.length) > 0 && (
                    <span className="ml-2 rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-700">
                      {((wheel?.data as any)?.recentResults?.length) || spinHistory.length}
                    </span>
                  )}
                </Button>
              )}

              {!showInputs && (
                <div className="mb-3 flex justify-end pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setShowInputs(true)}
                  >
                    <PanelRightOpen className="h-4 w-4" />
                    Show controls
                  </Button>
                </div>
              )}

              <div className={isFullscreen ? undefined : "pt-8"}>
                <LolWheelSection
                  champions={getFilteredChampions()}
                  rotation={rotation}
                  isSpinning={isSpinning}
                  spinDuration={settings.spinBehavior?.spinningDuration ?? 10}
                  wheelRef={wheelRef}
                  displayMode={displayMode}
                  currentTheme={currentTheme}
                  themes={themes}
                  wheelKey={`lol-wheel-${currentTheme}-${selectedRole}-${
                    Array.isArray(selectedChampions) ? selectedChampions.join(',') : ''
                  }-${forceUpdate}`}
                  onSpinCompleted={handleSpinCompleted}
                  muted={muted}
                  onToggleMute={() => setMuted((m) => !m)}
                  displaySpinCount={displaySpinCount}
                  onSpin={spinWheel}
                  onManualStop={handleManualStop}
                  actionMode={actionMode}
                  onActionModeChange={syncActionMode}
                  manualChampionName={manualInput}
                  onManualChampionNameChange={setManualInput}
                  onAddManualChampion={() => {
                    if (manualInput.trim()) {
                      handleAddManualChampion(manualInput);
                      setManualInput('');
                    }
                  }}
                  spinResult={spinResult}
                  isGameActive={isAdvancedGameActive}
                  currentGameModeName={currentSession?.gameMode?.name}
                  onOpenAchievements={() => setShowAchievements(true)}
                  onOpenThemeSelector={() => setShowThemeSelector(true)}
                  onOpenAnalytics={() => setShowAnalytics(true)}
                  onOpenSocialHub={() => setShowSocialHub(true)}
                  onOpenGameModes={() => setShowGameModes(true)}
                  totalPoints={totalPoints}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen((f) => !f)}
                />
              </div>
            </div>

            {showInputs && !isFullscreen && (
              <div className="min-w-0 self-start lg:col-span-1">
                  <LolInputPanel
                    forceUpdate={forceUpdate}
                    selectedRole={selectedRole}
                    selectedChampions={selectedChampions}
                    displayMode={displayMode}
                    showTitle={showTitle}
                    actionMode={actionMode}
                    onActionModeChange={syncActionMode}
                    customChampions={customChampions}
                    onRoleChange={handleRoleChange}
                    onChampionToggle={handleChampionToggle}
                    onClearAll={handleClearAll}
                    onDisplayModeChange={handleDisplayModeChange}
                    onShowTitleToggle={() => setShowTitle((t) => !t)}
                    onPreviewChampion={(champion) => setPreviewChampion(champion)}
                    getRoleCount={() => ({
                      selected: selectedChampions.length,
                      available: Object.values(lolChampions).flat().length,
                    })}
                    onShuffleChampions={handleShuffleChampions}
                    onSortChampionsAZ={handleSortChampionsAZ}
                    onSortChampionsZA={handleSortChampionsZA}
                    onDeleteCustomChampion={handleDeleteCustomChampion}
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
                    onAiModeChange={(mode) => {
                      const cw = getCurrentWheel();
                      if (cw) updateWheelData("lol-wheel", cw.id, { ...cw.data, aiMode: mode });
                    }}
                    onAiQueryChange={(query) => {
                      const cw = getCurrentWheel();
                      if (cw) updateWheelData("lol-wheel", cw.id, { ...cw.data, aiQuery: query });
                    }}
                    onAiQuerySubmit={() => {}}
                    onUserPreferencesChange={(prefs) => {
                      const cw = getCurrentWheel();
                      if (cw) updateWheelData("lol-wheel", cw.id, { ...cw.data, userPreferences: prefs });
                    }}
                    onChampionsChange={handleChampionsChange}
                    onAiResponseChange={(response) => {
                      const cw = getCurrentWheel();
                      if (cw) updateWheelData("lol-wheel", cw.id, { ...cw.data, aiResponse: response });
                    }}
                    getAllChampions={getAllChampions}
                    getFilteredChampions={getFilteredChampions}
                    championStats={(() => {
                      const stats: Record<string, number> = {};
                      (data?.recentResults || []).forEach((r: any) => {
                        const role = r.champion?.role || r.role || "unknown";
                        stats[role] = (stats[role] || 0) + 1;
                      });
                      return stats;
                    })()}
                    allResults={allResults}
                    resultsCount={spinHistory.length}
                    themes={themes}
                    currentTheme={currentTheme}
                    onThemeChange={handleThemeSelect}
                    onApplyPalette={handleApplyPalette}
                    onHideInputs={() => setShowInputs(false)}
                    onViewHistory={() => setShowAllResults(true)}
                    onOpenAchievements={() => setShowAchievements(true)}
                    onOpenSettings={() => setShowSettings(true)}
                    onToggleFullscreen={() => setIsFullscreen((f) => !f)}
                    onOpenAnalytics={() => setShowAnalytics(true)}
                    onImportChampionsText={handleImportChampionsText}
                  />
              </div>
            )}
          </div>

          {!isFullscreen && seoIntro}
          {!isFullscreen && seoSections}
        </main>

        {!isFullscreen && <Footer />}

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

        <PickerResultsModal
          isOpen={showAllResults}
          onClose={() => setShowAllResults(false)}
          results={(((wheel?.data as any)?.recentResults) || [])
            .slice(0, 10)
            .map((r: any) => ({
              id: r.id || r.champion?.id,
              name: r.name || r.champion?.name,
              emoji: r.emoji || r.champion?.emoji,
              timestamp: r.timestamp,
            }))}
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

      </div>
    </ToastProvider>
  );
}

export default function LolWheelApp(props: LolWheelAppProps) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading LoL Wheel...</div>}>
      <LolWheelAppInner {...props} />
    </Suspense>
  );
}
