"use client";

import type React from "react";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RotateCcw, Plus, X, Edit2, Check } from "lucide-react";
import { useWheelManagerStore } from "@/stores/wheel-manager-store";

export default function SwitchWheelDropdown() {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Only subscribe to the specific data we need
  const currentWheelId = useWheelManagerStore((state) => state.currentWheelId);
  const currentTool = useWheelManagerStore((state) => state.currentTool);
  const wheelsByTool = useWheelManagerStore((state) => state.wheelsByTool);
  const setCurrentWheel = useWheelManagerStore(
    (state) => state.setCurrentWheel
  );
  const createNewWheel = useWheelManagerStore((state) => state.createNewWheel);
  const deleteWheel = useWheelManagerStore((state) => state.deleteWheel);
  const updateWheelName = useWheelManagerStore(
    (state) => state.updateWheelName
  );

  // Get wheels for current tool using useMemo to avoid infinite loops
  const wheels = useMemo(() => {
    return wheelsByTool[currentTool] || [];
  }, [wheelsByTool, currentTool]);

  const [editingWheelId, setEditingWheelId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get current wheel using memoization
  const currentWheel = useMemo(() => {
    if (!isClient || !currentWheelId) return null;
    return wheels.find((wheel: any) => wheel.id === currentWheelId) || null;
  }, [wheels, currentWheelId, isClient]);

  const handleCreateNewWheel = () => {
    const id = `${currentTool}-${Date.now()}`;
    const now = new Date().toISOString();
    const newWheelId = createNewWheel(currentTool, undefined, id, now, now);
    setCurrentWheel(newWheelId);
  };

  const handleDeleteWheel = (wheelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wheels.length > 1) {
      deleteWheel(currentTool, wheelId);
    }
  };

  const handleEditName = (
    wheelId: string,
    currentName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingWheelId(wheelId);
    setEditingName(currentName);
  };

  const handleSaveName = (wheelId: string) => {
    if (editingName.trim()) {
      updateWheelName(currentTool, wheelId, editingName.trim());
    }
    setEditingWheelId(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingWheelId(null);
    setEditingName("");
  };

  const handleSwitchWheel = (wheelId: string) => {
    setCurrentWheel(wheelId);
  };

  // Don't render until client is ready
  if (!isClient) {
    return (
      <Button variant="ghost" size="sm" className="text-gray-600" disabled>
        <RotateCcw className="w-4 h-4 mr-2" />
        Switch Wheel
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600">
          <RotateCcw className="w-4 h-4 mr-2" />
          Switch Wheel
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2">
        {/* Create New Wheel Option */}
        <DropdownMenuItem
          onClick={handleCreateNewWheel}
          className="flex items-center p-3 hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-2 text-green-600" />
          <div>
            <div className="font-medium text-green-600">Create New Wheel</div>
            <div className="text-xs text-gray-500">
              Only the selected wheel is kept for next visit.
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Wheel List */}
        <div className="max-h-64 overflow-y-auto">
          {wheels.map((wheel: any) => {
            let summary = "No data";
            if (currentTool === "team-picker" && wheel.data) {
              const data = wheel.data as any;
              const numParticipants = Array.isArray(data.participants)
                ? data.participants.length
                : 0;
              const numTeams = Array.isArray(data.teams)
                ? data.teams.length
                : 0;
              if (numParticipants > 0 || numTeams > 0) {
                summary = `${numParticipants} participant${
                  numParticipants !== 1 ? "s" : ""
                }, ${numTeams} team${numTeams !== 1 ? "s" : ""}`;
              }
            } else if (
              wheel.toolType === "picker-wheel" &&
              Array.isArray((wheel.data as any).options)
            ) {
              summary = `${(wheel.data as any).options.length} options • ${
                (wheel.data as any).totalSpins ?? 0
              } spins`;
            } else if (
              wheel.toolType === "country-wheel" &&
              Array.isArray((wheel.data as any).selectedCountries)
            ) {
              summary = `${
                (wheel.data as any).selectedCountries.length
              } countries • ${(wheel.data as any).totalSpins ?? 0} spins`;
            } else if (
              wheel.toolType === "state-wheel" &&
              Array.isArray((wheel.data as any).selectedStates)
            ) {
              summary = `${
                (wheel.data as any).selectedStates.length
              } states • ${(wheel.data as any).totalSpins ?? 0} spins`;
            } else if (
              wheel.toolType === "mlb-wheel" &&
              Array.isArray((wheel.data as any).selectedTeams)
            ) {
              summary = `${(wheel.data as any).selectedTeams.length} teams • ${
                (wheel.data as any).totalSpins ?? 0
              } spins`;
            } else if (
              wheel.toolType === "nba-wheel" &&
              Array.isArray((wheel.data as any).selectedTeams)
            ) {
              summary = `${(wheel.data as any).selectedTeams.length} teams • ${
                (wheel.data as any).totalSpins ?? 0
              } spins`;
            } else if (wheel.toolType === "fortnite-wheel") {
              const data = wheel.data as any;

              // Count selected skins
              let skinCount = 0;
              if (Array.isArray(data.selectedSkins)) {
                skinCount = data.selectedSkins.length;
              }
              const totalSpins = data.totalSpins ?? 0;
              const selectedRarity = data.selectedRarity || "all";
              const statistics = data.statistics;

              summary = `${skinCount} skins • ${totalSpins} spins`;

              // Add enhanced statistics if available
              if (statistics) {
                const uniqueSkinsSpun = statistics.uniqueSkinsSpun ?? 0;
                const mostSpunRarity = statistics.mostSpunRarity;
                const lastSpinDate = statistics.lastSpinDate;
                const spinHistory = statistics.spinHistory;

                if (uniqueSkinsSpun > 0) {
                  summary += ` • ${uniqueSkinsSpun} unique spun`;
                }

                if (mostSpunRarity && mostSpunRarity !== "all") {
                  summary += ` • ${mostSpunRarity}`;
                }

                if (lastSpinDate) {
                  const daysSinceLastSpin = Math.floor(
                    (Date.now() - new Date(lastSpinDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  if (daysSinceLastSpin === 0) {
                    summary += ` • Today`;
                  } else if (daysSinceLastSpin === 1) {
                    summary += ` • Yesterday`;
                  } else if (daysSinceLastSpin < 7) {
                    summary += ` • ${daysSinceLastSpin}d ago`;
                  }
                }

                // Add recent results if available
                if (
                  spinHistory &&
                  Array.isArray(spinHistory) &&
                  spinHistory.length > 0
                ) {
                  const recentResults = spinHistory
                    .slice(-3)
                    .map((spin: any) => spin.result)
                    .join(", ");
                  if (recentResults) {
                    summary += ` • Recent: ${recentResults}`;
                  }
                }
              } else {
                // Fallback to basic info
                if (selectedRarity !== "all") {
                  summary += ` • ${selectedRarity}`;
                }
              }
            } else if (
              wheel.toolType === "number-picker-wheel" &&
              Array.isArray((wheel.data as any).numbers)
            ) {
              summary = `${(wheel.data as any).numbers.length} numbers • ${
                (wheel.data as any).results
                  ? (wheel.data as any).results.length
                  : 0
              } spins`;
            } else if (
              wheel.toolType === "image-picker-wheel" &&
              Array.isArray((wheel.data as any).wheelItems)
            ) {
              summary = `${(wheel.data as any).wheelItems.length} images • ${
                (wheel.data as any).totalSpins ?? 0
              } spins`;
            } else if (
              wheel.toolType === "date-picker-wheel" &&
              Array.isArray((wheel.data as any).allDates)
            ) {
              summary = `${(wheel.data as any).allDates.length} dates • ${
                (wheel.data as any).totalSpins ?? 0
              } spins`;
            } else if (
              wheel.toolType === "letter-picker-wheel" &&
              Array.isArray((wheel.data as any).currentLetters)
            ) {
              const totalSpins = (wheel.data as any).totalSpins ?? 0;
              const resultsLength = (wheel.data as any).results?.length ?? 0;
              summary = `${
                (wheel.data as any).currentLetters.length
              } letters • ${totalSpins} spins`;
            } else if (
              wheel.toolType === "yes-no-picker-wheel" &&
              (wheel.data as any)
            ) {
              const data = wheel.data as any;
              const totalSpins = data.totalSpins ?? 0;
              const yesCount = data.results?.yes ?? 0;
              const noCount = data.results?.no ?? 0;
              const maybeCount = data.results?.maybe ?? 0;
              const totalResults = yesCount + noCount + maybeCount;

              if (totalSpins > 0 || totalResults > 0) {
                const mode =
                  data.mode === "yes-no-maybe" ? "YES/NO/MAYBE" : "YES/NO";
                summary = `${mode} • ${totalSpins} spins • ${yesCount}Y/${noCount}N${
                  maybeCount > 0 ? `/${maybeCount}M` : ""
                }`;
              }
            } else if (
              wheel.toolType === "pokemon-wheel" &&
              (wheel.data as any)
            ) {
              const data = wheel.data as any;

              // Count selected Pokemon
              let pokemonCount = 0;
              if (Array.isArray(data.selectedPokemon)) {
                pokemonCount = data.selectedPokemon.length;
              }
              const totalSpins = data.totalSpins ?? 0;
              const selectedGeneration = data.selectedGeneration || "all";
              const customPokemon = data.customPokemon || [];
              const achievements = data.achievements || [];
              const themes = data.themes || [];

              summary = `${pokemonCount} Pokemon • ${totalSpins} spins`;

              // Add enhanced information if available
              if (customPokemon.length > 0) {
                summary += ` • ${customPokemon.length} custom`;
              }

              if (achievements.length > 0) {
                const completedAchievements = achievements.filter(
                  (a: any) => a.completed
                ).length;
                if (completedAchievements > 0) {
                  summary += ` • ${completedAchievements} achievements`;
                }
              }

              if (themes.length > 0) {
                const unlockedThemes = themes.filter(
                  (t: any) => t.unlocked
                ).length;
                if (unlockedThemes > 0) {
                  summary += ` • ${unlockedThemes} themes`;
                }
              }

              if (selectedGeneration !== "all") {
                summary += ` • ${selectedGeneration}`;
              }
            } else if (
              wheel.toolType === "color-picker-wheel" &&
              (wheel.data as any)
            ) {
              const data = wheel.data as any;
              const activeTab = data.activeTab || "color-wheel";
              let colorCount = 0;
              let totalSpins = 0;

              // Calculate total spins across all modes
              if (data.totalSpins && typeof data.totalSpins === "object") {
                totalSpins = Object.values(data.totalSpins).reduce(
                  (sum: number, count: any) => sum + (count || 0),
                  0
                );
              } else {
                totalSpins = data.totalSpins ?? 0;
              }

              if (activeTab === "color-wheel") {
                colorCount = 360; // Full color spectrum
              } else if (
                activeTab === "manual" &&
                Array.isArray(data.customColors)
              ) {
                colorCount = data.customColors.filter(
                  (c: any) => c.enabled
                ).length;
              } else if (
                activeTab === "image" &&
                Array.isArray(data.customColors)
              ) {
                colorCount = data.customColors.filter(
                  (c: any) => c.enabled
                ).length;
              } else if (
                activeTab === "ai" &&
                Array.isArray(data.customColors)
              ) {
                colorCount = data.customColors.filter(
                  (c: any) => c.enabled
                ).length;
              }

              if (totalSpins > 0 || colorCount > 0) {
                const mode =
                  activeTab === "color-wheel"
                    ? "COLOR WHEEL"
                    : activeTab.toUpperCase();
                summary = `${mode} • ${colorCount} colors • ${totalSpins} spins`;
              }
            } else if (wheel.toolType === "lol-wheel" && (wheel.data as any)) {
              const data = wheel.data as any;

              // Count selected champions
              let championCount = 0;
              if (Array.isArray(data.selectedChampions)) {
                championCount = data.selectedChampions.length;
              }
              const totalSpins = data.totalSpins ?? 0;
              const selectedRole = data.selectedRole || "all";
              const achievements = data.achievements || [];
              const themes = data.themes || [];
              const statistics = data.statistics;

              summary = `${championCount} champions • ${totalSpins} spins`;

              // Add enhanced statistics if available (like Fortnite)
              if (statistics) {
                const uniqueChampionsSpun = statistics.uniqueChampionsSpun ?? 0;
                const mostSpunRole = statistics.mostSpunRole;
                const lastSpinDate = statistics.lastSpinDate;
                const spinHistory = statistics.spinHistory;

                if (uniqueChampionsSpun > 0) {
                  summary += ` • ${uniqueChampionsSpun} unique spun`;
                }

                if (mostSpunRole && mostSpunRole !== "all") {
                  summary += ` • ${mostSpunRole}`;
                }

                if (lastSpinDate) {
                  const daysSinceLastSpin = Math.floor(
                    (Date.now() - new Date(lastSpinDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  if (daysSinceLastSpin === 0) {
                    summary += ` • Today`;
                  } else if (daysSinceLastSpin === 1) {
                    summary += ` • Yesterday`;
                  } else if (daysSinceLastSpin < 7) {
                    summary += ` • ${daysSinceLastSpin}d ago`;
                  }
                }

                // Add recent results if available
                if (
                  spinHistory &&
                  Array.isArray(spinHistory) &&
                  spinHistory.length > 0
                ) {
                  const recentResults = spinHistory
                    .slice(-3)
                    .map(
                      (spin: any) => spin.result?.champion?.name || spin.result
                    )
                    .join(", ");
                  if (recentResults) {
                    summary += ` • Recent: ${recentResults}`;
                  }
                }
              } else {
                // Fallback to basic info (like Fortnite)
                if (achievements.length > 0) {
                  const completedAchievements = achievements.filter(
                    (a: any) => a.completed
                  ).length;
                  if (completedAchievements > 0) {
                    summary += ` • ${completedAchievements} achievements`;
                  }
                }

                if (themes.length > 0) {
                  const unlockedThemes = themes.filter(
                    (t: any) => t.unlocked
                  ).length;
                  if (unlockedThemes > 0) {
                    summary += ` • ${unlockedThemes} themes`;
                  }
                }

                if (selectedRole !== "all") {
                  summary += ` • ${selectedRole}`;
                }
              }
            }
            return (
              <div
                key={wheel.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                  wheel.id === currentWheelId
                    ? "bg-yellow-100 border border-yellow-300"
                    : ""
                }`}
                onClick={() => !editingWheelId && handleSwitchWheel(wheel.id)}
              >
                <div className="flex-1 min-w-0">
                  {editingWheelId === wheel.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-8 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveName(wheel.id);
                          } else if (e.key === "Escape") {
                            handleCancelEdit();
                          }
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveName(wheel.id);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium text-sm truncate">
                        {wheel.name}
                      </div>
                      <div className="text-xs text-gray-500">{summary}</div>
                    </div>
                  )}
                </div>

                {editingWheelId !== wheel.id && (
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleEditName(wheel.id, wheel.name, e)}
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-gray-200"
                      title="Edit name"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>

                    {wheels.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleDeleteWheel(wheel.id, e)}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 text-red-600"
                        title="Delete wheel"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {wheels.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No wheels found</p>
            <Button onClick={handleCreateNewWheel} size="sm" className="mt-2">
              Create First Wheel
            </Button>
          </div>
        )}

        <DropdownMenuSeparator />

        {/* Current Selection Info */}
        {currentWheel && (
          <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
            <div className="font-medium">Currently Selected:</div>
            <div>{currentWheel.name}</div>
            <div>
              Last updated:{" "}
              {new Date(currentWheel.updatedAt || "").toLocaleDateString()}
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
