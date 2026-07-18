"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  List,
  Crown,
  Users,
  Brain,
  Target,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { lolChampions } from "@/data/lol-champions";
import {
  roleColors,
  roleNames,
  roleDescriptions,
  popularityColors,
  difficultyColors,
} from "@/constants/lol-config";
import type {
  LoLChampion,
  DisplayMode,
  RoleFilter,
  AIMode,
  ChatMessage,
  UserPreferences,
} from "@/types/lol-types";

interface LoLInputPanelProps {
  activeTab?: "manual" | "ai";
  onTabChange?: (tab: "manual" | "ai") => void;
  actionMode?: "normal" | "elimination" | "manual";
  onActionModeChange?: (mode: "normal" | "elimination" | "manual") => void;
  onEliminationMode?: (champion: LoLChampion) => void;
  onAddManualChampion?: (name: string) => void;
}

export default function LoLInputPanel({
  activeTab = "manual",
  onTabChange,
  actionMode = "normal",
  onActionModeChange,
  onEliminationMode,
  onAddManualChampion,
}: LoLInputPanelProps) {
  const [selectedRole, setSelectedRole] = useState<RoleFilter>("all");
  const [selectedChampions, setSelectedChampions] = useState<Set<string>>(
    new Set()
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>("emoji-name");
  const [aiMode, setAiMode] = useState<AIMode>("chat");
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<ChatMessage[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<LoLChampion[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    favoriteRoles: [],
    preferredDifficulty: "all",
    playStyle: "casual",
    favoriteRegions: [],
  });

  // Initialize with popular champions selected
  useEffect(() => {
    const popularChampionIds = new Set<string>();
    Object.values(lolChampions)
      .flat()
      .filter(
        (champion) =>
          champion.popularity === "S-tier" || champion.popularity === "A-tier"
      )
      .forEach((champion) => popularChampionIds.add(champion.id));
    setSelectedChampions(popularChampionIds);

    // Initialize AI recommendations
    generateAIRecommendations();
  }, []);

  const generateAIRecommendations = () => {
    const allChampions = getAllChampions();
    const recommendations = allChampions
      .filter(
        (champion) =>
          champion.popularity === "S-tier" ||
          champion.proPlayPresence === "high" ||
          champion.communityFavorite ||
          champion.difficulty === "easy"
      )
      .slice(0, 6);
    setAiRecommendations(recommendations);
  };

  const getAllChampions = (): LoLChampion[] => {
    return Object.values(lolChampions).flat();
  };

  const getFilteredChampions = (): LoLChampion[] => {
    const allChampions = getAllChampions();
    let filtered = allChampions;

    if (selectedRole !== "all") {
      filtered = lolChampions[selectedRole] || [];
    }

    return filtered.filter((champion) => selectedChampions.has(champion.id));
  };

  const handleRoleChange = (role: RoleFilter) => {
    setSelectedRole(role);
    const newSelected = new Set<string>();

    if (role === "all") {
      getAllChampions().forEach((champion) => newSelected.add(champion.id));
    } else {
      (lolChampions[role] || []).forEach((champion) =>
        newSelected.add(champion.id)
      );
    }

    setSelectedChampions(newSelected);
  };

  const handleChampionToggle = (championId: string) => {
    const newSelected = new Set(selectedChampions);
    if (newSelected.has(championId)) {
      newSelected.delete(championId);
    } else {
      newSelected.add(championId);
    }
    setSelectedChampions(newSelected);
  };

  const clearAllChampions = () => {
    setSelectedChampions(new Set());
  };

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    const userMessage = aiQuery.trim();

    // Add user message to chat history
    const newChatEntry: ChatMessage = {
      role: "user",
      message: userMessage,
      timestamp: new Date(),
    };
    setAiChatHistory((prev) => [...prev, newChatEntry]);

    // Simulate AI processing with realistic responses
    setTimeout(() => {
      let aiResponse = "";
      const query = userMessage.toLowerCase();

      // AI Response Logic based on query content
      if (query.includes("recommend") || query.includes("suggest")) {
        if (
          query.includes("beginner") ||
          query.includes("easy") ||
          query.includes("new")
        ) {
          aiResponse =
            "🎮 Perfect for beginners! I recommend: Garen (tanky top laner), Annie (simple mage), Ashe (straightforward ADC), and Soraka (easy support). These champions have simple mechanics and are great for learning the game!";
          const beginnerChampions = getAllChampions().filter(
            (champion) => champion.difficulty === "easy"
          );
          const newSelected = new Set<string>();
          beginnerChampions.forEach((champion) => newSelected.add(champion.id));
          setSelectedChampions(newSelected);
          setSelectedRole("all");
        } else if (
          query.includes("s-tier") ||
          query.includes("meta") ||
          query.includes("strong")
        ) {
          aiResponse =
            "⚡ S-tier meta champions! Try: Jinx (hyper carry ADC), Graves (versatile jungler), Ahri (safe mid laner), and Thresh (playmaking support). These are currently dominating solo queue and pro play!";
          const metaChampions = getAllChampions().filter(
            (champion) => champion.popularity === "S-tier"
          );
          const newSelected = new Set<string>();
          metaChampions.forEach((champion) => newSelected.add(champion.id));
          setSelectedChampions(newSelected);
          setSelectedRole("all");
        } else if (query.includes("pro play") || query.includes("esports")) {
          aiResponse =
            "🏆 Pro play favorites! Consider: Azir (scaling control mage), Lee Sin (high skill jungler), Thresh (playmaking support), and Gnar (versatile top laner). These champions shine in competitive play!";
          const proChampions = getAllChampions().filter(
            (champion) => champion.proPlayPresence === "high"
          );
          const newSelected = new Set<string>();
          proChampions.forEach((champion) => newSelected.add(champion.id));
          setSelectedChampions(newSelected);
          setSelectedRole("all");
        } else {
          aiResponse =
            "🎯 Based on community data: 1) S-tier champions for climbing, 2) Easy champions for learning, 3) Community favorites for fun. What's your current skill level and preferred playstyle?";
        }
      } else if (query.includes("best") || query.includes("top")) {
        aiResponse =
          "🏆 Top 5 community favorites: 1) Jinx (explosive ADC), 2) Yasuo (high skill ceiling), 3) Thresh (playmaking support), 4) Lee Sin (flashy jungler), 5) Ahri (versatile mid). Each offers unique gameplay experiences!";
      } else if (query.includes("role") || query.includes("position")) {
        if (query.includes("adc") || query.includes("bot")) {
          aiResponse =
            "🏹 ADC role! Focus on: Jinx (late game carry), Caitlyn (safe laning), Ezreal (mobile), and Ashe (utility). ADCs are the primary damage dealers in team fights!";
        } else if (query.includes("support")) {
          aiResponse =
            "🛡️ Support role! Try: Thresh (playmaker), Soraka (healer), Leona (tank), and Lulu (enchanter). Supports enable their team and control vision!";
        } else if (query.includes("jungle")) {
          aiResponse =
            "🌲 Jungle role! Consider: Graves (carry), Lee Sin (early game), Ammu (team fight), and Kha'Zix (assassin). Junglers control map pressure and objectives!";
        } else {
          aiResponse =
            "🎮 All roles have unique playstyles: Top (1v1 dueling), Jungle (map control), Mid (roaming), ADC (damage dealing), Support (team enabling). Which interests you most?";
        }
      } else if (query.includes("help") || query.includes("how")) {
        aiResponse =
          "🤖 I can help you: 1) Find champions by asking 'recommend easy champions', 2) Learn roles with 'tell me about jungle', 3) Get meta insights with 'best S-tier champions', 4) Explore playstyles. What would you like to know?";
      } else {
        // General AI response
        aiResponse = `🤖 I understand you're asking about "${userMessage}". I can help with champion recommendations, role explanations, meta analysis, and difficulty guidance. Try asking "recommend champions for my role" or "what are the best champions for beginners"?`;
      }

      // Add AI response to chat history
      const aiChatEntry: ChatMessage = {
        role: "ai",
        message: aiResponse,
        timestamp: new Date(),
      };
      setAiChatHistory((prev) => [...prev, aiChatEntry]);
      setAiResponse(aiResponse);
      setAiLoading(false);
      setAiQuery("");
    }, 1500);
  };

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
                      onCheckedChange={() => handleChampionToggle(champion.id)}
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
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange?.(value as "manual" | "ai")}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 bg-white border-gray-200">
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
      </TabsList>

      <TabsContent value="manual">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-800">CHAMPIONS</h3>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  {selectedChampions.size}
                </Badge>
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
                  onClick={() => handleRoleChange("all")}
                  className="text-xs bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
                >
                  All Champions
                </Button>
                {Object.keys(roleColors).map((role) => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRoleChange(role as RoleFilter)}
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
                {selectedChampions.size} selected champions
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllChampions}
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
                onValueChange={(value) => setDisplayMode(value as DisplayMode)}
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
      </TabsContent>

      <TabsContent value="ai">
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
                onClick={() => setAiMode("chat")}
                className="flex-1 bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
              >
                💬 Chat
              </Button>
              <Button
                variant={aiMode === "analysis" ? "default" : "outline"}
                size="sm"
                onClick={() => setAiMode("analysis")}
                className="flex-1 bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
              >
                📊 Analysis
              </Button>
              <Button
                variant={aiMode === "generator" ? "default" : "outline"}
                size="sm"
                onClick={() => setAiMode("generator")}
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
                  <input
                    type="text"
                    placeholder="Ask about champions, roles, meta, difficulty levels..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAiQuery()}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleAiQuery}
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
                        onClick={() => {
                          setAiQuery(question);
                          setTimeout(() => handleAiQuery(), 100);
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
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
                      const newSelected = new Set(selectedChampions);
                      newSelected.add(champion.id);
                      setSelectedChampions(newSelected);
                      setAiResponse(`✅ Added ${champion.name} to your wheel!`);
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
      </TabsContent>
    </Tabs>
  );
}
