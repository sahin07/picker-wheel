"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Brain, Target, BarChart3, Users, Crown } from "lucide-react";
import type {
  LoLChampion,
  AIMode,
  ChatMessage,
  UserPreferences,
} from "@/types/lol-types";

interface AITabProps {
  aiMode: AIMode;
  aiQuery: string;
  aiResponse: string;
  aiLoading: boolean;
  aiChatHistory: ChatMessage[];
  aiRecommendations: LoLChampion[];
  userPreferences: UserPreferences;
  selectedItems: Set<string>;
  onModeChange: (mode: AIMode) => void;
  onQueryChange: (query: string) => void;
  onQuerySubmit: () => void;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onItemsChange: (items: Set<string>) => void;
  onResponseChange: (response: string) => void;
  onFilterChange: (filter: string) => void;
  getAllItems: () => LoLChampion[];
  getFilteredItems: () => LoLChampion[];
}

export function AITab({
  aiMode,
  aiQuery,
  aiResponse,
  aiLoading,
  aiChatHistory,
  aiRecommendations,
  userPreferences,
  selectedItems,
  onModeChange,
  onQueryChange,
  onQuerySubmit,
  onPreferencesChange,
  onItemsChange,
  onResponseChange,
  onFilterChange,
  getAllItems,
  getFilteredItems,
}: AITabProps) {
  const handleQuickQuestion = (question: string) => {
    onQueryChange(question);
    setTimeout(() => onQuerySubmit(), 100);
  };

  const generateAiAnalysis = () => {
    const selectedChampionsArray = getFilteredItems();
    const roleDistribution = selectedChampionsArray.reduce((acc, champion) => {
      acc[champion.role] = (acc[champion.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sTierCount = selectedChampionsArray.filter(
      (champion) => champion.popularity === "S-tier"
    ).length;
    const communityFavoriteCount = selectedChampionsArray.filter(
      (champion) => champion.communityFavorite
    ).length;
    const proPlayCount = selectedChampionsArray.filter(
      (champion) => champion.proPlayPresence === "high"
    ).length;

    let analysis = "🔍 **LoL Champion Pool Analysis:**\n\n";
    analysis += `📊 You have ${selectedChampionsArray.length} champions selected\n`;
    analysis += `⚡ ${sTierCount} S-tier champions (${Math.round(
      (sTierCount / selectedChampionsArray.length) * 100
    )}%)\n`;
    analysis += `❤️ ${communityFavoriteCount} Community favorites (${Math.round(
      (communityFavoriteCount / selectedChampionsArray.length) * 100
    )}%)\n`;
    analysis += `👑 ${proPlayCount} Pro play champions (${Math.round(
      (proPlayCount / selectedChampionsArray.length) * 100
    )}%)\n\n`;

    const topRoles = Object.entries(roleDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    analysis += `🎯 Top Roles: ${topRoles
      .map(([role, count]) => `${role} (${count})`)
      .join(", ")}\n\n`;

    if (sTierCount > selectedChampionsArray.length * 0.4) {
      analysis +=
        "🎯 **Insight:** You prefer meta champions! S-tier picks dominate your pool.\n";
    }

    if (communityFavoriteCount > selectedChampionsArray.length * 0.6) {
      analysis +=
        "❤️ **Insight:** You have great taste! Most champions are community favorites.\n";
    }

    if (proPlayCount > selectedChampionsArray.length * 0.3) {
      analysis +=
        "👑 **Insight:** You follow the pros! High competitive presence in your selection.\n";
    }

    analysis +=
      "\n💡 **AI Recommendation:** " +
      (sTierCount < 3
        ? "Add more S-tier champions for climbing ranked!"
        : communityFavoriteCount < selectedChampionsArray.length * 0.5
        ? "Include more community favorites for fun gameplay!"
        : "Perfect balance of meta and fun! You understand League perfectly!");

    onResponseChange(analysis);
  };

  const generateMetaTeam = () => {
    const metaChampions = getAllItems().filter(
      (champion) => champion.popularity === "S-tier"
    );
    const newSelected = new Set<string>();
    metaChampions.forEach((champion) => newSelected.add(champion.id));
    onItemsChange(newSelected);
    onFilterChange("all");
    onResponseChange(
      "⚡ Generated Meta Team: The strongest champions in the current patch!"
    );
  };

  const generateBeginnerTeam = () => {
    const beginnerChampions = getAllItems().filter(
      (champion) => champion.difficulty === "easy"
    );
    const newSelected = new Set<string>();
    beginnerChampions.forEach((champion) => newSelected.add(champion.id));
    onItemsChange(newSelected);
    onFilterChange("all");
    onResponseChange(
      "🎮 Generated Beginner Team: Perfect champions for learning League of Legends!"
    );
  };

  const generateProPlayTeam = () => {
    const proChampions = getAllItems().filter(
      (champion) => champion.proPlayPresence === "high"
    );
    const newSelected = new Set<string>();
    proChampions.forEach((champion) => newSelected.add(champion.id));
    onItemsChange(newSelected);
    onFilterChange("all");
    onResponseChange(
      "👑 Generated Pro Play Team: Champions dominating competitive League!"
    );
  };

  const generateCommunityTeam = () => {
    const communityChampions = getAllItems().filter(
      (champion) => champion.communityFavorite
    );
    const newSelected = new Set<string>();
    communityChampions.forEach((champion) => newSelected.add(champion.id));
    onItemsChange(newSelected);
    onFilterChange("all");
    onResponseChange(
      "❤️ Generated Community Favorites: The most beloved champions by 180M+ players!"
    );
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Brain className="w-5 h-5" />
          LoL Champion AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Mode Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={aiMode === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("chat")}
            className="flex-1 bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
          >
            💬 Chat
          </Button>
          <Button
            variant={aiMode === "analysis" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("analysis")}
            className="flex-1 bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
          >
            📊 Analysis
          </Button>
          <Button
            variant={aiMode === "generator" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange("generator")}
            className="flex-1 bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
          >
            ✨ Generator
          </Button>
        </div>

        {/* AI Chat Mode */}
        {aiMode === "chat" && (
          <div className="space-y-4">
            {/* Chat History */}
            <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200">
              {aiChatHistory.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">
                  <p>👋 Hi! I'm your League of Legends AI!</p>
                  <p>Ask me about champions, roles, and strategies!</p>
                </div>
              ) : (
                aiChatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      chat.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-sm ${
                        chat.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "bg-gray-100 border border-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{chat.message}</p>
                      <span className="text-xs opacity-70">
                        {chat.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/20 p-2 rounded-lg text-sm text-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                      AI is analyzing champion data...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask about champions, roles, meta, difficulty levels..."
                value={aiQuery}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && onQuerySubmit()}
                className="flex-1 bg-white border-gray-200 text-gray-800 placeholder:text-gray-500"
              />
              <Button
                onClick={onQuerySubmit}
                disabled={aiLoading || !aiQuery.trim()}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                {aiLoading ? "⏳" : "🚀"}
              </Button>
            </div>

            {/* Quick Questions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">
                Quick Questions:
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Recommend easy champions for beginners",
                  "Best S-tier champions for climbing",
                  "Tell me about jungle role",
                  "Pro play meta champions",
                  "Community favorite champions",
                ].map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs bg-white/5 border-white/20 text-gray-600 hover:bg-white/10"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Mode */}
        {aiMode === "analysis" && (
          <div className="space-y-4">
            <div className="text-center">
              <Button
                onClick={generateAiAnalysis}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze My Champion Pool
              </Button>
            </div>

            {aiResponse && aiMode === "analysis" && (
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <div className="text-sm text-gray-200 whitespace-pre-wrap">
                  {aiResponse}
                </div>
              </div>
            )}

            {/* User Preferences */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-800">
                Set Your Preferences:
              </Label>

              <div>
                <Label className="text-xs text-gray-500">Favorite Roles:</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {["Top", "Jungle", "Mid", "ADC", "Support"].map((role) => (
                    <Button
                      key={role}
                      variant={
                        userPreferences.favoriteRoles.includes(role)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className="text-xs bg-white/10 border-white/20 text-gray-800 hover:bg-white/20"
                      onClick={() => {
                        const newRoles = userPreferences.favoriteRoles.includes(
                          role
                        )
                          ? userPreferences.favoriteRoles.filter(
                              (r) => r !== role
                            )
                          : [...userPreferences.favoriteRoles, role];
                        onPreferencesChange({
                          ...userPreferences,
                          favoriteRoles: newRoles,
                        });
                      }}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Play Style:</Label>
                <RadioGroup
                  value={userPreferences.playStyle}
                  onValueChange={(value) =>
                    onPreferencesChange({
                      ...userPreferences,
                      playStyle: value,
                    })
                  }
                  className="flex gap-4 mt-1"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="casual" id="casual" />
                    <Label htmlFor="casual" className="text-xs text-gray-600">
                      Casual
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="ranked" id="ranked" />
                    <Label htmlFor="ranked" className="text-xs text-gray-600">
                      Ranked
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="competitive" id="competitive" />
                    <Label
                      htmlFor="competitive"
                      className="text-xs text-gray-600"
                    >
                      Competitive
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {/* AI Generator Mode */}
        {aiMode === "generator" && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h4 className="font-semibold text-sm text-gray-800">
                LoL Champion Team Generator
              </h4>
              <p className="text-xs text-gray-500">
                Generate teams based on different criteria
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/20 text-gray-600 hover:bg-white/10"
                onClick={generateMetaTeam}
              >
                ⚡ Generate S-Tier Meta Team
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/20 text-gray-600 hover:bg-white/10"
                onClick={generateBeginnerTeam}
              >
                🎮 Generate Beginner Team
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/20 text-gray-600 hover:bg-white/10"
                onClick={generateProPlayTeam}
              >
                👑 Generate Pro Play Team
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start bg-white/5 border-white/20 text-gray-600 hover:bg-white/10"
                onClick={generateCommunityTeam}
              >
                ❤️ Generate Community Favorites
              </Button>
            </div>

            {/* AI Response Display */}
            {aiResponse && aiMode === "generator" && (
              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                <div className="text-sm text-gray-200">{aiResponse}</div>
              </div>
            )}
          </div>
        )}

        {/* AI Recommendations (always visible) */}
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-800">
            <Target className="w-4 h-4" />
            Smart Recommendations
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {aiRecommendations.slice(0, 4).map((champion) => (
              <Button
                key={champion.id}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs bg-white/5 border-white/20 text-gray-600 hover:bg-white/10"
                onClick={() => {
                  const newSelected = new Set(selectedItems);
                  newSelected.add(champion.id);
                  onItemsChange(newSelected);
                  onResponseChange(`✅ Added ${champion.name} to your wheel!`);
                }}
              >
                <span>{champion.emoji}</span>
                <span className="truncate">{champion.name}</span>
                {champion.communityFavorite && (
                  <Users className="w-3 h-3 text-pink-400" />
                )}
                {champion.proPlayPresence === "high" && (
                  <Crown className="w-3 h-3 text-yellow-400" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
