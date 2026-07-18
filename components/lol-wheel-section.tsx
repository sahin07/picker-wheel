"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Share2,
  Maximize,
  EyeOff,
  Eye,
  Volume2,
  RotateCcw,
  Sparkles,
  BarChart3,
  Trophy,
  Palette,
  Users,
  Gamepad2,
} from "lucide-react";
import { WheelComponent } from "@/components/lol-wheel-component";
import { useWheelManagerStore } from "@/stores/wheel-manager-store";
import type {
  LoLChampion,
  SpinResult,
  DisplayMode,
  ActionMode,
  RoleFilter,
} from "@/types/lol-types";

interface LoLWheelSectionProps {
  onOpenAchievements?: () => void;
  onOpenThemeSelector?: () => void;
  onOpenAnalytics?: () => void;
  onOpenSocialHub?: () => void;
  onOpenGameModes?: () => void;
  totalPoints?: number;
  currentTheme?: string;
  themes?: any[];
  currentUser?: any;
  isGameActive?: boolean;
  currentGameMode?: string;
  onSpinCompleted?: () => void;
  actionMode?: ActionMode;
  onEliminationMode?: (champion: LoLChampion) => void;
  onActionModeChange?: (mode: ActionMode) => void;
  onAddManualChampion?: (name: string) => void;
}

export default function LoLWheelSection({
  onOpenAchievements,
  onOpenThemeSelector,
  onOpenAnalytics,
  onOpenSocialHub,
  onOpenGameModes,
  totalPoints = 0,
  currentTheme = "classic",
  themes = [],
  currentUser,
  isGameActive = false,
  currentGameMode,
  onSpinCompleted,
  actionMode = "normal",
  onEliminationMode,
  onActionModeChange,
  onAddManualChampion,
}: LoLWheelSectionProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [showInputs, setShowInputs] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [spinSpeed, setSpinSpeed] = useState([5]);
  const [spinDuration, setSpinDuration] = useState([3]);

  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  const { getCurrentWheel, updateWheelData } = useWheelManagerStore();

  // Get current wheel data
  const currentWheel = getCurrentWheel();
  const wheelData = currentWheel?.data as any;

  const getFilteredChampions = useCallback((): LoLChampion[] => {
    if (!wheelData?.selectedChampions) return [];

    const selectedRole = wheelData.selectedRole || "all";
    const selectedChampions = wheelData.selectedChampions || [];

    if (selectedRole === "all") {
      return selectedChampions;
    }

    return selectedChampions.filter(
      (champion: LoLChampion) => champion.role === selectedRole
    );
  }, [wheelData]);

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
    const spinDurationMs = Math.max(4000, spinDuration[0] * 1000); // Minimum 4 seconds

    setTimeout(() => {
      // Calculate which segment the pointer is pointing to (pointer is at 12 o'clock = 0 degrees)
      const finalAngle = finalRotation % 360;
      const segmentAngle = 360 / availableChampions.length;

      // Debug: Log the calculation
      console.log("Final rotation:", finalRotation);
      console.log("Final angle:", finalAngle);
      console.log("Segment angle:", segmentAngle);
      console.log("Available champions:", availableChampions.length);

      // When wheel rotates clockwise, segments move clockwise
      // Segment 0 starts at 0°, Segment 1 starts at segmentAngle°, etc.
      // After rotation, the segment that was at 0° is now at finalAngle°
      // To find which segment is now at 0° (12 o'clock), we need to find
      // which segment was originally at (360 - finalAngle)°
      let selectedIndex = Math.floor((360 - finalAngle) / segmentAngle);
      // Ensure the index is within bounds
      selectedIndex =
        ((selectedIndex % availableChampions.length) +
          availableChampions.length) %
        availableChampions.length;
      const selectedChampion = availableChampions[selectedIndex];

      console.log("Selected index:", selectedIndex);
      console.log("Selected champion:", selectedChampion?.name);

      const result: SpinResult = {
        champion: selectedChampion,
        timestamp: new Date(),
      };

      setSpinResult(result);
      setIsSpinning(false);

      // Update wheel data with enhanced statistics like Fortnite wheel
      if (currentWheel) {
        const currentData = currentWheel.data as any;
        const newTotalSpins = (currentData.totalSpins || 0) + 1;

        // Calculate enhanced statistics
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
        const allSpunChampions = new Set<string>();

        // Add current spin history champions from the actual spin history
        if (
          currentData.recentResults &&
          Array.isArray(currentData.recentResults)
        ) {
          currentData.recentResults.forEach((spin: any) => {
            if (spin.name) {
              allSpunChampions.add(spin.name);
            }
          });
        }

        // Add current spin result
        allSpunChampions.add(selectedChampion.name);

        const uniqueChampionsSpun = allSpunChampions.size;

        // Track spin results by role
        const spinResultsByRole = { ...currentStats.spinResultsByRole };
        const championRole = selectedChampion.role.toLowerCase();
        spinResultsByRole[championRole] =
          (spinResultsByRole[championRole] || 0) + 1;

        // Find most spun role
        const mostSpunRole = Object.entries(spinResultsByRole).sort(
          ([, a], [, b]) => (b as number) - (a as number)
        )[0]?.[0];

        // Calculate champion count by role for current selection
        const championCountByRole: Record<string, number> = {};
        availableChampions.forEach((champion) => {
          const role = champion.role.toLowerCase();
          championCountByRole[role] = (championCountByRole[role] || 0) + 1;
        });

        // Update statistics
        const updatedStats = {
          ...currentStats,
          totalSpins: newTotalSpins,
          uniqueChampionsSpun,
          mostSpunChampion: selectedChampion.name, // For now, just track the latest
          mostSpunRole,
          averageSpinsPerSession: newTotalSpins, // Simplified for now
          lastSpinDate: new Date().toISOString(),
          firstSpinDate: currentStats.firstSpinDate || new Date().toISOString(),
          spinStreak: currentStats.spinStreak + 1, // Simplified streak calculation
          totalSpinTime: currentStats.totalSpinTime + 4, // Assuming 4 second spins
          favoriteRole: mostSpunRole,
          championCountByRole,
          spinResultsByRole,
        };

        const updatedData = {
          ...currentData,
          selectedResult: selectedChampion,
          totalSpins: newTotalSpins,
          recentResults: [
            { name: selectedChampion.name, timestamp: new Date() },
            ...(currentData.recentResults || []).slice(-9),
          ],
          statistics: updatedStats,
          rotation: finalRotation,
        };
        updateWheelData("lol-wheel", currentWheel.id, updatedData);
      }

      // Handle elimination mode with immediate removal
      if (actionMode === "elimination" && onEliminationMode) {
        console.log("ELIMINATION MODE: Starting elimination process...");
        console.log(
          "Champion to eliminate:",
          selectedChampion.name,
          "ID:",
          selectedChampion.id
        );

        // Call elimination handler immediately
        onEliminationMode(selectedChampion);
      }

      // Call spin completed callback
      if (onSpinCompleted) {
        onSpinCompleted();
      }
    }, spinDurationMs);
  }, [
    getFilteredChampions,
    rotation,
    spinDuration,
    actionMode,
    onEliminationMode,
    onSpinCompleted,
    currentWheel,
    wheelData,
    updateWheelData,
  ]);

  const addManualChampion = useCallback(() => {
    if (!manualInput.trim()) return;

    if (onAddManualChampion) {
      onAddManualChampion(manualInput.trim());
    }
    setManualInput("");
  }, [manualInput, onAddManualChampion]);

  const availableChampions = getFilteredChampions();

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Wheel */}
      <WheelComponent
        items={availableChampions}
        rotation={rotation}
        isSpinning={isSpinning}
        spinDuration={spinDuration[0]}
        wheelRef={wheelRef}
      />

      {/* Spin Button */}
      <Button
        size="lg"
        onClick={spinWheel}
        disabled={isSpinning || availableChampions.length === 0}
        className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
      >
        {isSpinning ? "⚔️ Spinning..." : "⚔️ SPIN THE WHEEL"}
      </Button>

      {/* Mode Selection */}
      <div className="flex items-center space-x-4">
        <Label className="text-sm text-gray-600">Mode:</Label>
        <RadioGroup
          value={actionMode}
          onValueChange={(value) => onActionModeChange?.(value as ActionMode)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="normal" id="normal" />
            <Label htmlFor="normal" className="text-sm text-gray-600">
              Normal
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="elimination" id="elimination" />
            <Label htmlFor="elimination" className="text-sm text-gray-600">
              Elimination
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id="manual" />
            <Label htmlFor="manual" className="text-sm text-gray-600">
              Manual
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Manual Input */}
      {actionMode === "manual" && (
        <div className="flex items-center space-x-2 w-full max-w-md">
          <Input
            placeholder="Enter custom champion name..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            className="flex-1 bg-white border-gray-200 text-gray-800 placeholder:text-gray-500"
          />
          <Button onClick={addManualChampion} disabled={!manualInput.trim()}>
            Add
          </Button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        {onOpenAnalytics && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAnalytics}
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            📊 View Results ({wheelData?.recentResults?.length || 0})
          </Button>
        )}
      </div>

      {/* Result Display */}
      {spinResult && (
        <Card className="w-full max-w-md bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">{spinResult.champion.emoji}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {spinResult.champion.name}
            </h3>
            <div className="flex justify-center gap-2 mb-2">
              <Badge className="bg-blue-100 text-blue-800">
                {spinResult.champion.role}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                {spinResult.champion.popularity}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {spinResult.champion.region} • {spinResult.champion.playStyle}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
