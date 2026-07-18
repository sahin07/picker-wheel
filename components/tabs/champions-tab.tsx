"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, List, Crown, Users, Trash2 } from "lucide-react";
import { lolChampions } from "@/data/lol-champions";
import {
  roleColors,
  roleNames,
  roleDescriptions,
  popularityColors,
  difficultyColors,
} from "@/constants/lol-config";
import type { LoLChampion, DisplayMode, RoleFilter } from "@/types/lol-types";

interface ChampionsTabProps {
  selectedRole: RoleFilter;
  selectedChampions: Set<string>;
  displayMode: DisplayMode;
  showTitle: boolean;
  onRoleChange: (role: RoleFilter) => void;
  onChampionToggle: (championId: string) => void;
  onClearAll: () => void;
  onDisplayModeChange: (mode: DisplayMode) => void;
  onShowTitleToggle: () => void;
  onPreviewChampion: (champion: LoLChampion) => void;
  getRoleCount: () => { selected: number; available: number };
}

export function ChampionsTab({
  selectedRole,
  selectedChampions,
  displayMode,
  showTitle,
  onRoleChange,
  onChampionToggle,
  onClearAll,
  onDisplayModeChange,
  onShowTitleToggle,
  onPreviewChampion,
  getRoleCount,
}: ChampionsTabProps) {
  const renderChampionsList = () => {
    const roles =
      selectedRole === "all" ? Object.keys(lolChampions) : [selectedRole];

    return (
      <div className="space-y-4">
        {roles.map((roleKey) => {
          const champions =
            lolChampions[roleKey as keyof typeof lolChampions] || [];
          const roleColor = roleColors[roleKey as keyof typeof roleColors];
          const roleName = roleNames[roleKey as keyof typeof roleNames];
          const roleDesc =
            roleDescriptions[roleKey as keyof typeof roleDescriptions];

          return (
            <div key={roleKey}>
              <div className="mb-2">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-gray-800">
                  <span style={{ color: roleColor }}>●</span>
                  {roleName} ({champions.length})
                </h4>
                <p className="text-xs text-gray-500 ml-4">{roleDesc}</p>
              </div>
              <div className="space-y-2">
                {champions.map((champion) => (
                  <div
                    key={champion.id}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Checkbox
                      id={champion.id}
                      checked={selectedChampions.has(champion.id)}
                      onCheckedChange={() => onChampionToggle(champion.id)}
                    />
                    <Label
                      htmlFor={champion.id}
                      className="flex items-center space-x-2 cursor-pointer flex-1"
                    >
                      <span className="text-lg">{champion.emoji}</span>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium text-gray-800">
                          {champion.name}
                        </span>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span
                            className="text-xs px-1 rounded text-white"
                            style={{
                              backgroundColor:
                                popularityColors[
                                  champion.popularity as keyof typeof popularityColors
                                ],
                            }}
                          >
                            {champion.popularity}
                          </span>
                          <span
                            className="text-xs px-1 rounded text-white"
                            style={{
                              backgroundColor:
                                difficultyColors[
                                  champion.difficulty as keyof typeof difficultyColors
                                ],
                            }}
                          >
                            {champion.difficulty}
                          </span>
                          {champion.communityFavorite && (
                            <Users className="w-3 h-3 text-pink-400" />
                          )}
                          {champion.proPlayPresence === "high" && (
                            <Crown className="w-3 h-3 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreviewChampion(champion)}
                      className="ml-auto text-gray-500 hover:text-gray-800"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-800">CHAMPIONS</h3>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 border-blue-200"
            >
              {getRoleCount().selected}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-800"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-800"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowTitleToggle}
              className="text-gray-500 hover:text-gray-800"
            >
              T
            </Button>
          </div>
        </div>

        {/* Role Selection */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block text-gray-800">
            Select Role & Filter Champions:
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={selectedRole === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => onRoleChange("all")}
              className="text-xs bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
            >
              All Champions
            </Button>
            {Object.keys(roleColors).map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "outline"}
                size="sm"
                onClick={() => onRoleChange(role as RoleFilter)}
                className="text-xs border-gray-200 text-gray-800 hover:bg-gray-100"
                style={{
                  backgroundColor:
                    selectedRole === role
                      ? roleColors[role as keyof typeof roleColors]
                      : undefined,
                  color: selectedRole === role ? "white" : undefined,
                }}
              >
                {roleNames[role as keyof typeof roleNames]}
              </Button>
            ))}
          </div>
        </div>

        {/* Champion Count and Clear */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {getRoleCount().selected} selected of {getRoleCount().available}{" "}
            champions
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-red-400 hover:text-red-300"
          >
            Clear All
          </Button>
        </div>

        {/* Champions List */}
        <div className="max-h-64 overflow-y-auto mb-4">
          {renderChampionsList()}
        </div>

        <Separator className="my-4 bg-gray-200" />

        {/* Display Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-800">Show:</Label>
          <RadioGroup
            value={displayMode}
            onValueChange={(value) => onDisplayModeChange(value as DisplayMode)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="emoji-name" id="emoji-name" />
              <Label htmlFor="emoji-name" className="text-gray-600">
                Emoji & Name
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="emoji" id="emoji" />
              <Label htmlFor="emoji" className="text-gray-600">
                Emoji Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="name" id="name" />
              <Label htmlFor="name" className="text-gray-600">
                Name Only
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom Champions Card Component (like Fortnite's Custom Skins Card)
export function CustomChampionsCard({
  customChampions = [],
  selectedChampions = new Set(),
  onChampionToggle,
  onPreviewChampion,
  onDeleteCustomChampion,
}: {
  customChampions?: LoLChampion[];
  selectedChampions?: Set<string>;
  onChampionToggle?: (championId: string) => void;
  onPreviewChampion?: (champion: LoLChampion) => void;
  onDeleteCustomChampion?: (championId: string) => void;
}) {
  if (!customChampions || customChampions.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span className="text-purple-600">⚔️</span>
          Custom Champions ({customChampions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {customChampions.map((champion) => (
            <div
              key={champion.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={selectedChampions.has(champion.id)}
                  onChange={() => onChampionToggle?.(champion.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-2xl">{champion.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {champion.name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {champion.role}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      Custom
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreviewChampion?.(champion)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {onDeleteCustomChampion && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteCustomChampion(champion.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
