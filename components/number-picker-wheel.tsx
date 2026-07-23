"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Palette,
  BarChart3,
  Users,
  Gamepad2,
  Trophy,
} from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import {
  WheelCanvas,
  resolveNumberFromRotation,
} from "@/components/wheel-canvas";
import { ResultDialog } from "@/components/result-dialog";
import { HistoryDialog } from "@/components/history-dialog";
import Confetti from "react-confetti";
import { useWheelManagerStore } from "@/stores/wheel-manager-store";
import {
  createSpinAudioController,
  type SpinAudioController,
} from "@/lib/wheel-spin-audio";
import { NumberPickerSidebar } from "@/components/number-picker/number-picker-sidebar";
import { NumberPickerUseCases } from "@/components/number-picker/number-picker-use-cases";
import { ModeResultPanel } from "@/components/number-picker/mode-result-panel";
import PickerWheelAchievementsDisplay from "@/components/picker-wheel-achievements-display";
import PickerWheelThemeSelector from "@/components/picker-wheel-theme-selector";
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display";
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub";
import PickerWheelGameModes from "@/components/picker-wheel-game-modes";
import { PICKER_WHEEL_ACHIEVEMENTS } from "@/lib/picker-wheel-achievements";
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes";
import { analyzeSpinData, type SpinRecord } from "@/lib/picker-wheel-analytics";
import type { SocialProfile } from "@/lib/picker-wheel-social";
import type { GameMode } from "@/lib/picker-wheel-game-modes";
import { useGameSession } from "@/hooks/use-game-session";
import {
  getNumberPickerUseCase,
  NUMBER_PICKER_USE_CASES,
  type NumberPickerUseCaseId,
} from "@/lib/number-picker-use-cases";
import {
  buildModeResult,
  formatBingoHistory,
} from "@/lib/number-picker-mode-results";

interface NumberResult {
  id: string;
  value: number | string;
  timestamp: Date;
  mode: "normal" | "elimination";
}

interface DigitRange {
  from: number;
  to: number;
}

type ResultMode = "random-number" | "random-digits";

interface WeightedNumber {
  value: number;
  weight: number;
}

export function NumberPickerWheel({
  openGamesSignal = 0,
}: {
  /** Increment from Header Games to open the game modes dialog */
  openGamesSignal?: number;
} = {}) {
  const searchParams = useSearchParams();
  const { settings, updateSettings } = useSettingsStore();
  const wheelManager = useWheelManagerStore();
  const wheel = wheelManager.getCurrentWheel();
  const wheelId = wheel?.id;
  const toolType = "number-picker-wheel";
  const spinAudioRef = useRef<SpinAudioController | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const {
    currentSession,
    isGameActive: isAdvancedGameActive,
    startGame: startAdvancedGame,
  } = useGameSession();

  const [showAchievements, setShowAchievements] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSocialHub, setShowSocialHub] = useState(false);
  const [showGameModes, setShowGameModes] = useState(false);
  const [achievements, setAchievements] = useState(PICKER_WHEEL_ACHIEVEMENTS);
  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES);
  const [currentTheme, setCurrentTheme] = useState("classic");
  const [totalPoints, setTotalPoints] = useState(0);
  const [spinHistory, setSpinHistory] = useState<SpinRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<SocialProfile | undefined>();

  useEffect(() => {
    if (openGamesSignal > 0) setShowGameModes(true);
  }, [openGamesSignal]);

  const wheelData = (wheel?.data as any) ?? {};
  const [resultMode, setResultMode] = useState<ResultMode>(
    wheelData.resultMode || "random-number",
  );
  const [inputMethod, setInputMethod] = useState<"range" | "formula">(
    wheelData.inputMethod || "range",
  );
  const [actionMode, setActionMode] = useState<"normal" | "elimination">(
    wheelData.actionMode || "normal",
  );
  const [minValue, setMinValue] = useState(wheelData.minValue ?? 1);
  const [maxValue, setMaxValue] = useState(wheelData.maxValue ?? 10);
  const [interval, setInterval] = useState(wheelData.interval ?? 1);
  const [excludeNumbers, setExcludeNumbers] = useState(
    wheelData.excludeNumbers ?? "",
  );
  const [formula, setFormula] = useState(wheelData.formula ?? "");
  const [numDigits, setNumDigits] = useState(wheelData.numDigits ?? 4);
  const [digitRanges, setDigitRanges] = useState<DigitRange[]>(
    wheelData.digitRanges ?? [
      { from: 0, to: 9 },
      { from: 0, to: 9 },
      { from: 0, to: 9 },
      { from: 0, to: 9 },
      { from: 0, to: 9 },
      { from: 0, to: 9 },
    ],
  );
  const [autoSpin, setAutoSpin] = useState(wheelData.autoSpin ?? false);
  const [digitResults, setDigitResults] = useState<number[]>(
    wheelData.digitResults ?? [],
  );
  const [activeDigitPosition, setActiveDigitPosition] = useState(
    wheelData.activeDigitPosition ?? 0,
  );
  const [numbers, setNumbers] = useState<WeightedNumber[]>(
    wheelData.numbers ?? [],
  );
  const [isSpinning, setIsSpinning] = useState(wheelData.isSpinning ?? false);
  const [currentResult, setCurrentResult] = useState<NumberResult | null>(
    wheelData.currentResult ?? null,
  );
  const [results, setResults] = useState<NumberResult[]>(
    wheelData.results ?? [],
  );
  const [showResult, setShowResult] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTitle, setShowTitle] = useState(wheelData.showTitle ?? false);
  const [toolTitle, setToolTitle] = useState(
    wheelData.toolTitle ?? "Number Picker Wheel",
  );
  const [toolDescription, setToolDescription] = useState(
    wheelData.toolDescription ?? "Pick a random number by spinning the wheel",
  );
  const [resultTitle, setResultTitle] = useState(
    wheelData.resultTitle ?? "Your Lucky Number",
  );
  const [activeUseCaseId, setActiveUseCaseId] =
    useState<NumberPickerUseCaseId | null>(wheelData.activeUseCaseId ?? null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [muted, setMuted] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const currentRotationRef = useRef(0);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [lastResultId, setLastResultId] = useState<string | null>(null);
  const manualStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [manualStopActive, setManualStopActive] = useState(false);
  const pendingWinnerRef = useRef<{ index: number; value: number } | null>(
    null,
  );
  const finalRotationRef = useRef(0);
  const spinActiveRef = useRef(false);

  useEffect(() => {
    if (!wheelId) return;
    wheelManager.updateWheelData(toolType, wheelId, {
      resultMode,
      inputMethod,
      actionMode,
      minValue,
      maxValue,
      interval,
      excludeNumbers,
      formula,
      numDigits,
      digitRanges,
      autoSpin,
      digitResults,
      activeDigitPosition,
      numbers,
      currentResult,
      results,
      showTitle,
      toolTitle,
      toolDescription,
      resultTitle,
      activeUseCaseId,
    });
  }, [
    resultMode,
    inputMethod,
    actionMode,
    minValue,
    maxValue,
    interval,
    excludeNumbers,
    formula,
    numDigits,
    digitRanges,
    autoSpin,
    digitResults,
    activeDigitPosition,
    numbers,
    currentResult,
    results,
    showTitle,
    toolTitle,
    toolDescription,
    resultTitle,
    activeUseCaseId,
    wheelId,
  ]);

  useEffect(() => {
    if (!wheel) return;
    const d = (wheel.data as any) ?? {};
    setResultMode(d.resultMode || "random-number");
    setInputMethod(d.inputMethod || "range");
    setActionMode(d.actionMode || "normal");
    // Align Manage/Header "Remove winner" with loaded wheel action mode
    if ((d.actionMode || "normal") === "elimination") {
      const latest = useSettingsStore.getState().settings;
      if (!latest.spinBehavior.removeWinnerAfterSpin) {
        updateSettings({
          spinBehavior: { ...latest.spinBehavior, removeWinnerAfterSpin: true },
        });
      }
    }
    setMinValue(d.minValue ?? 1);
    setMaxValue(d.maxValue ?? 10);
    setInterval(d.interval ?? 1);
    setExcludeNumbers(d.excludeNumbers ?? "");
    setFormula(d.formula ?? "");
    setNumDigits(d.numDigits ?? 4);
    setDigitRanges(
      d.digitRanges ?? [
        { from: 0, to: 9 },
        { from: 0, to: 9 },
        { from: 0, to: 9 },
        { from: 0, to: 9 },
        { from: 0, to: 9 },
        { from: 0, to: 9 },
      ],
    );
    setAutoSpin(d.autoSpin ?? false);
    setDigitResults(d.digitResults ?? []);
    setActiveDigitPosition(d.activeDigitPosition ?? 0);
    setNumbers(d.numbers ?? []);
    setIsSpinning(false);
    setCurrentResult(d.currentResult ?? null);
    setResults(d.results ?? []);
    setShowTitle(d.showTitle ?? false);
    setToolTitle(d.toolTitle ?? "Number Picker Wheel");
    setToolDescription(
      d.toolDescription ?? "Pick a random number by spinning the wheel",
    );
    setResultTitle(d.resultTitle ?? "Your Lucky Number");
    setActiveUseCaseId(d.activeUseCaseId ?? null);
    if (d.achievements) {
      setAchievements(d.achievements);
      setTotalPoints(
        d.achievements
          .filter((a: any) => a.completed)
          .reduce((sum: number, a: any) => sum + a.points, 0),
      );
    }
    if (d.themes) setThemes(d.themes);
    else setThemes(PICKER_WHEEL_THEMES);
    if (d.currentTheme) setCurrentTheme(d.currentTheme);
    if (d.spinHistory) {
      setSpinHistory(
        d.spinHistory.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp),
        })),
      );
    }
  }, [wheelId]);

  const generateNumbers = () => {
    const newNumbers: number[] = [];

    if (inputMethod === "range") {
      const excludeList = excludeNumbers
        .split(",")
        .map((n: string) => Number.parseInt(n.trim()))
        .filter((n: number) => !Number.isNaN(n));

      for (let i = minValue; i <= maxValue; i += interval) {
        if (!excludeList.includes(i)) newNumbers.push(i);
      }
    } else if (inputMethod === "formula" && formula) {
      try {
        formula.split(",").forEach((f: string) => {
          const trimmed = f.trim();
          if (trimmed.includes("-")) {
            const [start, end] = trimmed
              .split("-")
              .map((n: string) => Number.parseInt(n.trim()));
            if (!Number.isNaN(start) && !Number.isNaN(end)) {
              for (let i = start; i <= end; i++) newNumbers.push(i);
            }
          } else {
            const num = Number.parseInt(trimmed);
            if (!Number.isNaN(num)) newNumbers.push(num);
          }
        });
      } catch (error) {
        console.error("Formula parsing error:", error);
      }
    }

    setNumbers(newNumbers.map((n) => ({ value: n, weight: 1 })));
  };

  useEffect(() => {
    if (resultMode === "random-number") generateNumbers();
    else setDigitResults(new Array(numDigits).fill(0));
  }, [
    resultMode,
    inputMethod,
    minValue,
    maxValue,
    interval,
    excludeNumbers,
    formula,
    numDigits,
  ]);

  useEffect(() => {
    if (resultMode === "random-number" && numbers.length === 0) {
      setNumbers(
        Array.from({ length: 10 }, (_, i) => ({ value: i + 1, weight: 1 })),
      );
    }
  }, [wheelId, resultMode, numbers.length]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const processFormula = () => generateNumbers();

  const shuffleNumbers = () => {
    setNumbers([...numbers].sort(() => Math.random() - 0.5));
  };

  const getSpinAudio = () => {
    if (!spinAudioRef.current)
      spinAudioRef.current = createSpinAudioController();
    return spinAudioRef.current;
  };

  const playSpinSound = () => {
    if (!settings.confettiSound?.enableSound || muted) return;
    try {
      getSpinAudio().startWhoosh(
        "/wheel-sound.mp3",
        settings.confettiSound.soundVolume || 0.5,
      );
    } catch {
      // ignore
    }
  };

  const stopSpinSound = () => {
    spinAudioRef.current?.stop();
  };

  useEffect(() => () => spinAudioRef.current?.stop(), []);

  // Never leave the UI stuck in a spinning state after remount / HMR
  useEffect(() => {
    setIsSpinning(false);
    spinActiveRef.current = false;
  }, []);

  useEffect(() => {
    if (currentResult && !isSpinning && currentResult.id !== lastResultId) {
      if (settings.confettiSound?.enableConfetti) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      setLastResultId(currentResult.id);
    }
  }, [currentResult, isSpinning, settings.confettiSound, lastResultId]);

  const getAvailableNumbers = () => {
    if (resultMode !== "random-number") {
      return Array.from({ length: 10 }, (_, i) => ({ value: i, weight: 1 }));
    }
    const eliminate =
      actionMode === "elimination" ||
      !!settings.spinBehavior?.removeWinnerAfterSpin;
    if (eliminate) {
      return numbers.filter(
        (n) =>
          !results.some((r) => r.value === n.value && r.mode === "elimination"),
      );
    }
    return numbers;
  };

  const finishSpinWithWinner = (
    selectedNumber: number,
    winningIndex: number | null,
  ) => {
    stopSpinSound();
    const eliminate =
      actionMode === "elimination" ||
      !!settingsRef.current.spinBehavior?.removeWinnerAfterSpin;
    const result: NumberResult = {
      id: Date.now().toString(),
      value: selectedNumber,
      timestamp: new Date(),
      mode: eliminate ? "elimination" : "normal",
    };
    setCurrentResult(result);
    setResults((prev) => [...prev, result]);
    setShowResult(true);
    setIsSpinning(false);
    setManualStopActive(false);
    setHighlightIndex(winningIndex);
    pendingWinnerRef.current = null;

    const list = getAvailableNumbers();
    const historyEntry: SpinRecord = {
      id: result.id,
      timestamp: new Date(),
      result: String(selectedNumber),
      options: list.map((n) => String(n.value)),
      mode: "manual",
      theme: currentTheme,
      spinDuration: settingsRef.current.spinBehavior?.spinningDuration ?? 10,
    };
    setSpinHistory((prev) => {
      const next = [...prev, historyEntry];
      if (wheelId) {
        wheelManager.updateWheelData(toolType, wheelId, {
          ...(wheel?.data as any),
          spinHistory: next,
        });
      }
      return next;
    });

    if (eliminate && resultMode === "random-number") {
      setNumbers((prev) => prev.filter((n) => n.value !== selectedNumber));
    }

    if (settingsRef.current.confettiSound?.enableSound && !muted) {
      const audio = new Audio("/sound-win.mp3");
      audio.volume = settingsRef.current.confettiSound.soundVolume || 0.5;
      audio.play().catch(() => {});
    }
  };

  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId);
    const theme =
      themes.find((t) => t.id === themeId) ||
      PICKER_WHEEL_THEMES.find((t) => t.id === themeId);
    if (theme?.colors?.length) {
      updateSettings({
        appearance: {
          ...settings.appearance,
          toolColors: [...theme.colors],
        },
      });
    }
    if (wheelId) {
      wheelManager.updateWheelData(toolType, wheelId, {
        ...(wheel?.data as any),
        currentTheme: themeId,
      });
    }
    setShowThemeSelector(false);
  };

  const syncEliminationWithSettings = (enabled: boolean) => {
    setActionMode(enabled ? "elimination" : "normal");
    const latest = useSettingsStore.getState().settings;
    updateSettings({
      spinBehavior: {
        ...latest.spinBehavior,
        removeWinnerAfterSpin: enabled,
      },
    });
  };

  // Keep sidebar Action Mode ↔ Header/Manage "Remove winner" in sync
  useEffect(() => {
    const wantElimination = !!settings.spinBehavior.removeWinnerAfterSpin;
    const wantMode = wantElimination ? "elimination" : "normal";
    if (actionMode !== wantMode) {
      setActionMode(wantMode);
    }
  }, [settings.spinBehavior.removeWinnerAfterSpin]);

  const applyUseCasePreset = (id: NumberPickerUseCaseId) => {
    const useCase = getNumberPickerUseCase(id);
    if (!useCase || isSpinning || spinActiveRef.current) return;

    const c = useCase.config;
    setActiveUseCaseId(id);
    setResultMode(c.resultMode);
    setInputMethod(c.inputMethod);
    syncEliminationWithSettings(c.actionMode === "elimination");
    setMinValue(c.minValue);
    setMaxValue(c.maxValue);
    setInterval(c.interval);
    setExcludeNumbers(c.excludeNumbers);
    setFormula(c.formula);
    if (c.numDigits != null) setNumDigits(c.numDigits);
    setToolTitle(c.toolTitle);
    setToolDescription(c.toolDescription);
    setResultTitle(c.resultTitle);
    setShowTitle(true);
    setCurrentResult(null);
    setResults([]);
    setHighlightIndex(null);
    setShowResult(false);
    setDigitResults([]);
  };

  // Popular Number Wheels / deep links: ?preset=bingo or ?min=1&max=100&interval=2
  const lastUrlKeyRef = useRef<string>("");
  useEffect(() => {
    if (!wheelId || isSpinning || spinActiveRef.current) return;

    const key = searchParams.toString();
    if (!key || key === lastUrlKeyRef.current) return;
    lastUrlKeyRef.current = key;

    const preset = searchParams.get("preset") as NumberPickerUseCaseId | null;
    if (preset && getNumberPickerUseCase(preset)) {
      applyUseCasePreset(preset);
      return;
    }

    const minRaw = searchParams.get("min");
    const maxRaw = searchParams.get("max");
    if (minRaw == null && maxRaw == null) return;

    const min = minRaw != null ? Number.parseInt(minRaw, 10) : 1;
    const max = maxRaw != null ? Number.parseInt(maxRaw, 10) : 10;
    const stepRaw = searchParams.get("interval");
    const step = stepRaw != null ? Number.parseInt(stepRaw, 10) : 1;
    if (Number.isNaN(min) || Number.isNaN(max) || min > max) return;

    setActiveUseCaseId(null);
    setResultMode("random-number");
    setInputMethod("range");
    setMinValue(min);
    setMaxValue(max);
    setInterval(Number.isNaN(step) || step < 1 ? 1 : step);
    setExcludeNumbers("");
    setCurrentResult(null);
    setResults([]);
    setHighlightIndex(null);
    setToolTitle("Number Picker Wheel");
    setResultTitle("Your Lucky Number");
  }, [wheelId, searchParams]);

  const availableCount = getAvailableNumbers().length;
  const activeUseCase = activeUseCaseId
    ? NUMBER_PICKER_USE_CASES.find((u) => u.id === activeUseCaseId)
    : undefined;
  const modeResult =
    currentResult && !isSpinning
      ? buildModeResult(activeUseCaseId, currentResult.value, availableCount)
      : null;
  const bingoHistory =
    activeUseCaseId === "bingo"
      ? formatBingoHistory(results.map((r) => r.value))
      : [];

  const finishSpin = () => {
    if (!spinActiveRef.current) return;
    spinActiveRef.current = false;

    if (manualStopRef.current) {
      clearTimeout(manualStopRef.current);
      manualStopRef.current = null;
    }

    // Lock to the exact final angle BEFORE ending spin (home behavior)
    const lockedRotation = finalRotationRef.current;
    currentRotationRef.current = lockedRotation;
    setSpinRotation(lockedRotation);

    const pending = pendingWinnerRef.current;
    if (pending) {
      finishSpinWithWinner(pending.value, pending.index);
      return;
    }

    const list = getAvailableNumbers();
    const resolved = resolveNumberFromRotation(lockedRotation, list);
    if (!resolved) {
      setIsSpinning(false);
      setManualStopActive(false);
      stopSpinSound();
      return;
    }
    finishSpinWithWinner(Number(resolved.value), resolved.index);
  };

  const finishSpinRef = useRef(finishSpin);
  finishSpinRef.current = finishSpin;

  const handleCanvasSpinComplete = () => {
    finishSpinRef.current();
  };

  const spinWheel = () => {
    if (isSpinning || spinActiveRef.current) return;
    if (resultMode === "random-number" && numbers.length === 0) return;

    const list = getAvailableNumbers();
    if (resultMode === "random-number" && list.length === 0) return;

    spinActiveRef.current = true;
    setIsSpinning(true);
    setManualStopActive(false);
    setHighlightIndex(null);
    setCurrentResult(null);
    playSpinSound();

    const baseRotation = settingsRef.current.display?.randomInitialAngle
      ? Math.random() * 360
      : 0;
    const finalRotation =
      currentRotationRef.current +
      baseRotation +
      10 * 360 +
      Math.random() * 360;
    finalRotationRef.current = finalRotation;
    setSpinRotation(finalRotation);

    if (resultMode === "random-number") {
      const resolved = resolveNumberFromRotation(finalRotation, list);
      if (resolved) {
        pendingWinnerRef.current = {
          index: resolved.index,
          value: Number(resolved.value),
        };
      }
    } else {
      const digits = digitRanges.slice(0, numDigits).map((range) => {
        return (
          Math.floor(Math.random() * (range.to - range.from + 1)) + range.from
        );
      });
      setDigitResults(digits);
      const selectedNumber = Number.parseInt(digits.join(""));
      const firstDigit =
        Math.floor(selectedNumber / Math.pow(10, Math.max(numDigits - 1, 0))) %
        10;
      pendingWinnerRef.current = { index: firstDigit, value: selectedNumber };
    }

    if (settingsRef.current.spinBehavior?.manuallyStop) {
      setManualStopActive(true);
    }

    // Safety net if the canvas callback is missed (tab backgrounded, etc.)
    const durationMs =
      Math.max(0.5, settingsRef.current.spinBehavior?.spinningDuration ?? 10) *
      1000;
    if (manualStopRef.current) clearTimeout(manualStopRef.current);
    manualStopRef.current = setTimeout(() => {
      finishSpinRef.current();
    }, durationMs + 80);
  };

  const handleManualStop = () => {
    if (!manualStopActive || !isSpinning) return;
    const stoppedAt = currentRotationRef.current;
    finalRotationRef.current = stoppedAt;
    const list = getAvailableNumbers();
    const resolved = resolveNumberFromRotation(stoppedAt, list);
    if (resolved && resultMode === "random-number") {
      pendingWinnerRef.current = {
        index: resolved.index,
        value: Number(resolved.value),
      };
    }
    finishSpin();
  };

  const handleRotationFrame = (
    rotationDegrees: number,
    segmentCount: number,
  ) => {
    currentRotationRef.current = rotationDegrees;
    if (!settings.confettiSound?.enableSound || muted || segmentCount <= 0)
      return;
    try {
      getSpinAudio().syncFrame(
        rotationDegrees,
        segmentCount,
        settings.confettiSound.soundVolume || 0.5,
        null,
      );
    } catch {
      // ignore
    }
  };

  const spinSingleDigit = (index: number) => {
    const range = digitRanges[index];
    const newDigits = [...digitResults];
    const newDigit =
      Math.floor(Math.random() * (range.to - range.from + 1)) + range.from;
    newDigits[index] = newDigit;
    setDigitResults(newDigits);
    // Point the wheel at the spun digit (degrees, home-compatible)
    const segmentDegrees = 360 / 10;
    const target =
      currentRotationRef.current +
      4 * 360 +
      (360 - (newDigit * segmentDegrees + segmentDegrees / 2));
    currentRotationRef.current = target;
    finalRotationRef.current = target;
    setSpinRotation(target);
  };

  const resetDigits = () => setDigitResults(new Array(numDigits).fill(0));
  const clearResults = () => setResults([]);

  const updateDigitRange = (
    digitIndex: number,
    field: "from" | "to",
    value: number,
  ) => {
    const newRanges = [...digitRanges];
    newRanges[digitIndex] = { ...newRanges[digitIndex], [field]: value };
    setDigitRanges(newRanges);
  };

  const getDigitPositionName = (index: number) => {
    const positions = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
    return positions[numDigits - 1 - index] || `${numDigits - index}th`;
  };

  const getDigitPositionLabel = (index: number) => {
    const positions = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
    return positions[index] || `${index + 1}th`;
  };

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 overflow-auto bg-white p-4"
          : "w-full"
      }
    >
      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
          numberOfPieces={400}
          recycle={false}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 1000,
          }}
        />
      )}

      {!isFullscreen && (
        <>
          <NumberPickerUseCases
            activeId={activeUseCaseId}
            onSelectPreset={applyUseCasePreset}
          />
          {activeUseCase && (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge className="bg-slate-800 text-white hover:bg-slate-800">
                Mode: {activeUseCase.label}
              </Badge>
              {actionMode === "elimination" ||
              settings.spinBehavior.removeWinnerAfterSpin ? (
                <Badge variant="secondary">
                  {availableCount} left on wheel
                </Badge>
              ) : null}
            </div>
          )}
        </>
      )}

      <div className="mb-8 grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div
          className={`relative overflow-x-hidden lg:col-span-2 lg:order-1 ${
            isFullscreen
              ? ""
              : "rounded-lg border bg-white p-3 shadow-sm sm:p-6"
          }`}
        >
          {!isFullscreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="absolute left-2 top-2 z-10 border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50 sm:left-4 sm:top-4 sm:px-3"
            >
              Results
              {results.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {results.length}
                </Badge>
              )}
            </Button>
          )}

          <div className="flex flex-col items-center space-y-6 pt-6">
            <div className="relative mx-auto w-full max-w-[680px]">
              <div
                className="cursor-pointer"
                onClick={!isSpinning ? spinWheel : handleManualStop}
              >
                <WheelCanvas
                  numbers={
                    resultMode === "random-number"
                      ? numbers
                      : Array.from({ length: 10 }, (_, i) => ({
                          value: i,
                          weight: 1,
                        }))
                  }
                  isSpinning={isSpinning}
                  settings={settings}
                  rotation={spinRotation}
                  size={680}
                  highlightIndex={highlightIndex}
                  onRotationFrame={handleRotationFrame}
                  onSpinComplete={handleCanvasSpinComplete}
                />
              </div>

              <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMuted((m) => !m);
                  }}
                  className="h-10 w-10 bg-white/90 p-0 shadow-md hover:bg-white"
                  title={
                    settings.confettiSound?.enableSound
                      ? muted
                        ? "Unmute"
                        : "Mute"
                      : "Global sound disabled"
                  }
                >
                  {!settings.confettiSound?.enableSound ? (
                    <VolumeX className="h-5 w-5 text-gray-400" />
                  ) : muted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen((v) => !v);
                  }}
                  className="h-10 w-10 bg-white/90 p-0 shadow-md hover:bg-white"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {isSpinning && (
                <div className="absolute right-4 top-4 animate-pulse rounded-full bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
                  {settings.spinBehavior.manuallyStop
                    ? "Click to Stop!"
                    : "Spinning..."}
                </div>
              )}
            </div>

            {currentResult &&
              !isSpinning &&
              (modeResult ? (
                <ModeResultPanel
                  result={modeResult}
                  bingoHistory={bingoHistory}
                  resultTitle={resultTitle}
                />
              ) : (
                <div className="w-full max-w-md rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 p-6 text-center shadow-lg">
                  <h3 className="mb-2 text-lg font-semibold text-green-800">
                    🎉 {resultTitle}
                  </h3>
                  <p className="text-2xl font-bold text-green-900">
                    {currentResult.value}
                  </p>
                </div>
              ))}

            <Button
              onClick={!isSpinning ? spinWheel : handleManualStop}
              disabled={
                (!isSpinning &&
                  resultMode === "random-number" &&
                  numbers.length === 0) ||
                (isSpinning && !settings.spinBehavior.manuallyStop)
              }
              className={`px-12 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl ${
                settings.display.spinButtonAnimation
                  ? "animate-pulse bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSpinning ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>
                    {settings.spinBehavior.manuallyStop
                      ? "Click Wheel to Stop"
                      : "Spinning..."}
                  </span>
                </div>
              ) : (
                "🎯 SPIN THE WHEEL"
              )}
            </Button>

            {settings.display?.showSpinCount && (
              <div className="text-sm text-gray-500">
                Total spins: {results.length}
              </div>
            )}

            {isAdvancedGameActive && currentSession && (
              <Badge variant="secondary" className="text-xs">
                Playing: {currentSession.gameMode.name}
              </Badge>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemeSelector(true)}
                className="relative border-purple-500 px-3 py-1 text-xs text-purple-600 hover:border-purple-600 hover:bg-purple-50"
              >
                <Palette className="mr-2 h-4 w-4" />
                <span>Themes</span>
                {themes.filter((t) => t.unlocked).length > 3 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {themes.filter((t) => t.unlocked).length}
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnalytics(true)}
                className="relative border-green-500 px-3 py-1 text-xs text-green-600 hover:border-green-600 hover:bg-green-50"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Analytics</span>
                {spinHistory.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {spinHistory.length}
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
                <span>Social</span>
                {currentUser && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {currentUser.level}
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGameModes(true)}
                className="relative border-red-500 px-3 py-1 text-xs text-red-600 hover:border-red-600 hover:bg-red-50"
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                <span>Games</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  5
                </Badge>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAchievements(true)}
                className="relative border-yellow-500 px-3 py-1 text-xs text-yellow-600 hover:border-yellow-600 hover:bg-yellow-50"
              >
                <Trophy className="mr-2 h-4 w-4" />
                <span>Achievements</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {totalPoints}
                </Badge>
              </Button>
            </div>

            {resultMode === "random-digits" && (
              <div className="w-full max-w-lg space-y-4">
                <div className="flex justify-center gap-2">
                  {Array.from({ length: numDigits }, (_, i) => {
                    const reverseIndex = numDigits - 1 - i;
                    return (
                      <div
                        key={i}
                        className={`flex h-20 w-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 transition-colors ${
                          activeDigitPosition === reverseIndex
                            ? "border-orange-500 bg-orange-400 text-white"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                        onClick={() => setActiveDigitPosition(reverseIndex)}
                      >
                        <div className="text-lg font-bold">
                          {digitResults[reverseIndex] !== undefined
                            ? digitResults[reverseIndex]
                            : 0}
                        </div>
                        <div className="text-xs">{getDigitPositionName(i)}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {Array.from({ length: numDigits }, (_, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => spinSingleDigit(numDigits - 1 - i)}
                      className="text-xs"
                    >
                      Spin {getDigitPositionName(i)}
                    </Button>
                  ))}
                </div>
                {digitResults.length > 0 && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800">
                      {digitResults.slice(0, numDigits).join("")}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Combined Result
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {!isFullscreen && (
          <div className="lg:col-span-1 lg:order-2">
            <NumberPickerSidebar
              resultMode={resultMode}
              setResultMode={setResultMode}
              inputMethod={inputMethod}
              setInputMethod={setInputMethod}
              actionMode={actionMode}
              setActionMode={(mode) =>
                syncEliminationWithSettings(mode === "elimination")
              }
              minValue={minValue}
              setMinValue={setMinValue}
              maxValue={maxValue}
              setMaxValue={setMaxValue}
              interval={interval}
              setIntervalValue={setInterval}
              excludeNumbers={excludeNumbers}
              setExcludeNumbers={setExcludeNumbers}
              formula={formula}
              setFormula={setFormula}
              processFormula={processFormula}
              numDigits={numDigits}
              setNumDigits={setNumDigits}
              digitRanges={digitRanges}
              updateDigitRange={updateDigitRange}
              autoSpin={autoSpin}
              setAutoSpin={setAutoSpin}
              numbers={numbers}
              setNumbers={setNumbers}
              showTitle={showTitle}
              setShowTitle={setShowTitle}
              toolTitle={toolTitle}
              setToolTitle={setToolTitle}
              toolDescription={toolDescription}
              setToolDescription={setToolDescription}
              resultTitle={resultTitle}
              setResultTitle={setResultTitle}
              resultsCount={results.length}
              onViewHistory={() => setShowHistory(true)}
              onToggleFullscreen={() => setIsFullscreen((v) => !v)}
              getDigitPositionLabel={getDigitPositionLabel}
              shuffleNumbers={shuffleNumbers}
              resetDigits={resetDigits}
            />
          </div>
        )}
      </div>

      <ResultDialog
        open={showResult}
        onOpenChange={setShowResult}
        result={currentResult}
        resultTitle={modeResult?.headline || resultTitle}
        displayValue={
          modeResult?.variant === "bingo"
            ? modeResult.bingoCall
            : modeResult?.variant === "math"
              ? modeResult.math?.expression
              : modeResult?.variant === "fitness"
                ? modeResult.headline
                : currentResult?.value
        }
        resultMessage={
          modeResult
            ? [modeResult.detail, modeResult.hint, modeResult.remainingLabel]
                .filter(Boolean)
                .join(" · ")
            : null
        }
      />
      <HistoryDialog
        open={showHistory}
        onOpenChange={setShowHistory}
        results={results}
        onClearResults={clearResults}
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
        analytics={analyzeSpinData(spinHistory)}
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      <PickerWheelSocialHub
        isVisible={showSocialHub}
        onClose={() => setShowSocialHub(false)}
        currentUser={currentUser}
        onShareWheel={() => {}}
      />

      <PickerWheelGameModes
        isVisible={showGameModes}
        onClose={() => setShowGameModes(false)}
        userPoints={totalPoints}
        onStartGame={(gameMode: GameMode) => {
          if (wheelId) {
            wheelManager.updateWheelData(toolType, wheelId, {
              ...(wheel?.data as any),
              totalSpins: 0,
              spinHistory: [],
              recentResults: [],
              selectedResult: null,
            });
          }
          setSpinHistory([]);
          startAdvancedGame(gameMode);
          setShowGameModes(false);
        }}
      />
    </div>
  );
}
