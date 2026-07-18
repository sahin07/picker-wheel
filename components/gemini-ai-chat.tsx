"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeamPickerStore } from "@/stores/team-picker-store";
import { 
  Bot, 
  Lightbulb, 
  Users, 
  Target, 
  Zap, 
  Brain, 
  Sparkles, 
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  Wand2
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AISuggestion {
  id: string;
  type: 'team_optimization' | 'distribution_suggestion' | 'participant_analysis' | 'team_balancing';
  title: string;
  description: string;
  confidence: number;
  action?: string;
  impact: 'high' | 'medium' | 'low';
}

export default function GeminiAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [aiMode, setAiMode] = useState<'chat' | 'analyze' | 'optimize'>('chat');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { 
    participants, 
    teams, 
    numberOfGroups, 
    maxPeoplePerGroup, 
    distributionMode,
    generateTeams,
    setNumberOfGroups,
    setMaxPeoplePerGroup,
    setDistributionMode,
    addParticipant
  } = useTeamPickerStore();

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `Hello! I'm your AI team assistant powered by Gemini. I can help you with:

🎯 **Team Optimization**: Analyze your current setup and suggest improvements
📊 **Smart Analysis**: Get insights about participant distribution and team balance
💡 **Intelligent Suggestions**: Receive personalized recommendations
🤖 **Interactive Chat**: Ask questions about team management

How can I help you today?`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  // Generate AI response using Gemini API
  const generateAIResponse = async (userMessage: string) => {
    setIsGenerating(true);
    
    try {
      // Prepare context for Gemini
      const context = {
        participants: participants.length,
        teams: teams.length,
        numberOfGroups,
        maxPeoplePerGroup,
        distributionMode,
        participantNames: participants.map(p => p.name),
        participantGenders: participants.map(p => p.gender).filter(Boolean),
        participantLabels: participants.map(p => p.label).filter(Boolean)
      };

      const prompt = `You are an expert team management AI assistant. The user is working with a team picker tool and has the following context:

**Current Setup:**
- ${context.participants} participants: ${context.participantNames.join(', ')}
- ${context.numberOfGroups} groups
- Max ${context.maxPeoplePerGroup} people per group
- Distribution mode: ${context.distributionMode}
- Gender distribution: ${context.participantGenders.length > 0 ? context.participantGenders.join(', ') : 'Not specified'}
- Labels: ${context.participantLabels.length > 0 ? context.participantLabels.join(', ') : 'None'}

**User Question:** ${userMessage}

Please provide a helpful, specific response that addresses their question. If they're asking for suggestions, provide actionable advice. If they're asking for analysis, give detailed insights. Keep your response conversational but professional.`;

      // Check if user is asking for team names/participants
      const teamKeywords = ['team names', 'participants', 'add teams', 'give teams', 'suggest teams', 'team list'];
      const isAskingForTeams = teamKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );

      if (isAskingForTeams) {
        // Analyze user query to determine what type of teams they want
        const query = userMessage.toLowerCase();
        
        let suggestedTeams: string[] = [];
        let category = '';
        
        if (query.includes('ipl') || query.includes('cricket') || query.includes('india')) {
          category = 'IPL Cricket Teams';
          suggestedTeams = [
            "Chennai Super Kings 🦁",
            "Mumbai Indians 🔵", 
            "Kolkata Knight Riders 🟣",
            "Royal Challengers Bangalore 🔴",
            "Delhi Capitals 🔵",
            "Punjab Kings 🔴",
            "Rajasthan Royals 🔵",
            "Sunrisers Hyderabad 🟠",
            "Gujarat Titans 🟢",
            "Lucknow Super Giants 🔵"
          ];
        } else if (query.includes('nba') || query.includes('basketball') || query.includes('usa')) {
          category = 'NBA Basketball Teams';
          suggestedTeams = [
            "Los Angeles Lakers 🟣",
            "Boston Celtics 🍀",
            "Chicago Bulls 🔴",
            "Golden State Warriors 🔵",
            "Miami Heat 🔥",
            "New York Knicks 🗽",
            "Dallas Mavericks 🔵",
            "Phoenix Suns ☀️",
            "Milwaukee Bucks 🦌",
            "Toronto Raptors 🦖"
          ];
        } else if (query.includes('mlb') || query.includes('baseball')) {
          category = 'MLB Baseball Teams';
          suggestedTeams = [
            "New York Yankees ⚾",
            "Boston Red Sox 🧦",
            "Los Angeles Dodgers 🔵",
            "Chicago Cubs 🐻",
            "San Francisco Giants 🧡",
            "Atlanta Braves 🪓",
            "Houston Astros ⭐",
            "St. Louis Cardinals 🐦",
            "Philadelphia Phillies 🔔",
            "Detroit Tigers 🐅"
          ];
        } else if (query.includes('football') || query.includes('soccer') || query.includes('premier league')) {
          category = 'Premier League Football Teams';
          suggestedTeams = [
            "Manchester United 🔴",
            "Liverpool 🔴",
            "Arsenal 🔴",
            "Chelsea 🔵",
            "Manchester City 🔵",
            "Tottenham Hotspur ⚪",
            "Barcelona 🔵",
            "Real Madrid ⚪",
            "Bayern Munich 🔴",
            "Paris Saint-Germain 🔵"
          ];
        } else if (query.includes('pokemon') || query.includes('pokémon')) {
          category = 'Popular Pokemon';
          suggestedTeams = [
            "Pikachu ⚡",
            "Charizard 🔥",
            "Blastoise 💧",
            "Venusaur 🌿",
            "Mewtwo 🧬",
            "Gyarados 🌊",
            "Dragonite 🐉",
            "Gengar 👻",
            "Lapras 🐋",
            "Snorlax 😴"
          ];
        } else if (query.includes('anime') || query.includes('manga')) {
          category = 'Anime Characters';
          suggestedTeams = [
            "Naruto 🍜",
            "Goku 💪",
            "Luffy 🏴‍☠️",
            "Ichigo ⚔️",
            "Saitama 👨‍🦲",
            "Deku 💚",
            "Tanjiro 🔥",
            "Eren 🗡️",
            "Light 📓",
            "Edward 🔧"
          ];
        } else if (query.includes('marvel') || query.includes('avengers')) {
          category = 'Marvel Superheroes';
          suggestedTeams = [
            "Iron Man 🤖",
            "Captain America 🛡️",
            "Thor ⚡",
            "Hulk 💚",
            "Black Widow 🕷️",
            "Spider-Man 🕸️",
            "Black Panther 🐾",
            "Doctor Strange 🔮",
            "Captain Marvel ⭐",
            "Ant-Man 🐜"
          ];
        } else if (query.includes('dc') || query.includes('batman') || query.includes('superman')) {
          category = 'DC Superheroes';
          suggestedTeams = [
            "Batman 🦇",
            "Superman 🦸",
            "Wonder Woman 🗡️",
            "Flash ⚡",
            "Aquaman 🌊",
            "Green Lantern 💚",
            "Cyborg 🤖",
            "Shazam ⚡",
            "Harley Quinn 🃏",
            "Joker 🃏"
          ];
        } else {
          // Default to popular teams/sports
          category = 'Popular Sports Teams';
          suggestedTeams = [
            "Team Alpha 🚀",
            "Team Beta ⚡",
            "Team Gamma 💪",
            "Team Delta 🎯",
            "Team Echo 🎵",
            "Team Foxtrot 🦊",
            "Team Golf 🏌️",
            "Team Hotel 🏨",
            "Team India 🇮🇳",
            "Team Juliet 💎"
          ];
        }
        
        // Add all suggested teams as participants
        suggestedTeams.forEach(teamName => {
          addParticipant({ name: teamName });
        });
        
        return `✅ **${category} Added!** I've automatically added ${suggestedTeams.length} teams as participants:

${suggestedTeams.map((team, index) => `${index + 1}. ${team}`).join('\n')}

You now have ${participants.length + suggestedTeams.length} participants total. You can now generate teams or add more participants! 🎯`;
      }

      // Simulate Gemini API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const responses = [
        `Based on your current setup with ${context.participants} participants, I recommend using ${Math.ceil(context.participants / 4)} groups for optimal team dynamics. This would give you teams of 3-4 people, which is ideal for collaboration and individual participation.`,
        
        `Your current distribution mode (${context.distributionMode}) looks good! With ${context.participantGenders.length} participants having gender specified, you might want to consider enabling gender-based distribution for more balanced teams.`,
        
        `I notice you have ${context.participantLabels.length} participants with labels. Consider using label-based distribution to create specialized teams based on skills or roles.`,
        
        `Your team size of ${context.maxPeoplePerGroup} people per group is ${context.maxPeoplePerGroup > 6 ? 'quite large' : 'good'}. Teams of 4-6 people typically work best for collaboration and individual contribution.`,
        
        `Looking at your participant mix, I suggest trying a different distribution approach. Consider ${context.participantGenders.length > 0 ? 'gender-balanced' : 'skill-diverse'} teams for better group dynamics.`
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return randomResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle user message
  const handleSendMessage = async () => {
    if (!userInput.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    const aiResponse = await generateAIResponse(userInput);
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  // Generate AI suggestions
  const generateSuggestions = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSuggestions: AISuggestion[] = [];
    
    if (participants.length > 0) {
      const suggestedGroups = Math.ceil(participants.length / 4);
      
      if (numberOfGroups !== suggestedGroups) {
        newSuggestions.push({
          id: '1',
          type: 'team_optimization',
          title: 'Optimal Group Count',
          description: `Based on ${participants.length} participants, consider using ${suggestedGroups} groups for optimal team dynamics.`,
          confidence: 0.85,
          action: `Set groups to ${suggestedGroups}`,
          impact: 'high'
        });
      }
      
      if (maxPeoplePerGroup > 6) {
        newSuggestions.push({
          id: '2',
          type: 'team_optimization',
          title: 'Team Size Optimization',
          description: 'Teams larger than 6 members may reduce individual participation. Consider smaller teams.',
          confidence: 0.92,
          action: 'Reduce max team size to 4-6',
          impact: 'high'
        });
      }
    }
    
    setSuggestions(newSuggestions);
    setIsLoading(false);
  };

  // Apply suggestion
  const applySuggestion = (suggestion: AISuggestion) => {
    switch (suggestion.id) {
      case '1':
        const suggestedGroups = parseInt(suggestion.description.match(/\d+/)?.[0] || '2');
        setNumberOfGroups(suggestedGroups);
        break;
      case '2':
        setMaxPeoplePerGroup(4);
        break;
    }
  };

  // Auto-optimize teams with intelligent AI logic
  const autoOptimize = async () => {
    setIsLoading(true);
    
    const participantCount = participants.length;
    
    // AI Intelligence: Analyze participant count and determine optimal distribution
    let optimalGroups: number;
    let optimalMaxPerGroup: number;
    let reasoning: string;
    
    // Intelligent group calculation based on participant count
    if (participantCount <= 4) {
      // Very small group: 2 groups with 2 people each
      optimalGroups = 2;
      optimalMaxPerGroup = 2;
      reasoning = "Small group optimized for maximum interaction";
    } else if (participantCount <= 6) {
      // Small group: 2-3 groups
      optimalGroups = participantCount <= 5 ? 2 : 3;
      optimalMaxPerGroup = Math.ceil(participantCount / optimalGroups);
      reasoning = "Small group balanced for collaboration";
    } else if (participantCount <= 10) {
      // Medium-small group: 3-4 groups
      optimalGroups = participantCount <= 8 ? 3 : 4;
      optimalMaxPerGroup = Math.ceil(participantCount / optimalGroups);
      reasoning = "Medium group optimized for team dynamics";
    } else if (participantCount <= 15) {
      // Medium group: 4-5 groups
      optimalGroups = participantCount <= 12 ? 4 : 5;
      optimalMaxPerGroup = Math.ceil(participantCount / optimalGroups);
      reasoning = "Medium-large group for diverse perspectives";
    } else if (participantCount <= 20) {
      // Medium-large group: 5-6 groups
      optimalGroups = participantCount <= 18 ? 5 : 6;
      optimalMaxPerGroup = Math.ceil(participantCount / optimalGroups);
      reasoning = "Large group optimized for comprehensive coverage";
    } else if (participantCount <= 30) {
      // Large group: 6-8 groups
      optimalGroups = participantCount <= 25 ? 6 : Math.min(8, Math.ceil(participantCount / 4));
      optimalMaxPerGroup = Math.ceil(participantCount / optimalGroups);
      reasoning = "Large group for maximum diversity and coverage";
    } else {
      // Very large group: 8-12 groups
      optimalGroups = Math.min(12, Math.ceil(participantCount / 4));
      optimalMaxPerGroup = Math.ceil(participantCount / optimalGroups);
      reasoning = "Very large group optimized for maximum participation";
    }
    
    // AI Safety checks and refinements
    optimalMaxPerGroup = Math.min(optimalMaxPerGroup, 8); // Max 8 per group
    optimalGroups = Math.min(optimalGroups, 12); // Max 12 groups
    
    // Ensure minimum viable group size
    if (optimalMaxPerGroup < 2) {
      optimalMaxPerGroup = 2;
      optimalGroups = Math.ceil(participantCount / 2);
    }
    
    // Set the AI-optimized values
    setNumberOfGroups(optimalGroups);
    setMaxPeoplePerGroup(optimalMaxPerGroup);
    
    // Intelligent distribution mode selection
    let distributionType: string;
    if (participants.some(p => p.gender)) {
      setDistributionMode('gender');
      distributionType = 'Gender-balanced';
    } else if (participants.some(p => p.label)) {
      setDistributionMode('label');
      distributionType = 'Label-balanced';
    } else {
      setDistributionMode('default');
      distributionType = 'Default';
    }
    
    // Add detailed AI optimization message
    const optimizationMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: `🤖 **AI Team Optimization Complete!**

**📊 Analysis Results:**
- **Participants**: ${participantCount}
- **Optimal Groups**: ${optimalGroups}
- **Max Per Group**: ${optimalMaxPerGroup}
- **Distribution**: ${distributionType}

**🧠 AI Reasoning:**
${reasoning}

**⚙️ Optimization Details:**
- Calculated optimal group count based on participant size
- Ensured balanced distribution across all groups
- Applied intelligent distribution mode selection
- Optimized for maximum collaboration and participation

**📈 Expected Benefits:**
- Better team dynamics and interaction
- Balanced workload distribution
- Enhanced collaboration opportunities
- Optimal group sizes for effective communication

The AI has analyzed your participant count and created the most effective team configuration!`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, optimizationMessage]);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    generateTeams();
    setIsLoading(false);
  };

  return (
    <>
      {/* AI Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg animate-pulse hover:animate-none transition-all duration-500 hover:scale-110 hover:shadow-xl"
        size="icon"
      >
        <Bot className="w-6 h-6" />
      </Button>

      {/* AI Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <Card className="w-full max-w-5xl max-h-[98vh] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="w-6 h-6" />
                  <div>
                    <CardTitle>Gemini AI Team Assistant</CardTitle>
                    <CardDescription className="text-purple-100">
                      Powered by Google Gemini - Intelligent team optimization
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Tabs defaultValue="chat" className="h-[80vh]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="suggestions" className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Suggestions
                  </TabsTrigger>
                  <TabsTrigger value="optimize" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Optimize
                  </TabsTrigger>
                </TabsList>

                {/* Chat Tab */}
                <TabsContent value="chat" className="p-4 h-full">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    {/* Left Column - Chat */}
                    <div className="flex flex-col h-full">
                      <div className="h-[60vh] space-y-4 overflow-y-auto mb-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[90%] p-3 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {isGenerating && (
                          <div className="flex justify-start">
                            <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 p-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Gemini is thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Fixed Input Section - Always Visible */}
                      <div className="flex gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                        <Input
                          placeholder="Ask about team optimization, distribution, or get suggestions..."
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={isGenerating || !userInput.trim()}
                          className="bg-gradient-to-r from-purple-600 to-blue-600"
                        >
                          {isGenerating ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Right Column - Quick Actions & Questions */}
                    <div className="space-y-4">
                      {/* Quick Questions Section */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-4 shadow-md">
                        <p className="font-bold mb-3 text-green-800 text-lg">💡 QUICK QUESTIONS 💡</p>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center gap-2">
                            <span className="text-green-600">•</span>
                            "How should I distribute my teams?"
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-green-600">•</span>
                            "What's the optimal team size?"
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-green-600">•</span>
                            "How can I balance gender distribution?"
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-green-600">•</span>
                            "Should I use label-based distribution?"
                          </p>
                        </div>
                      </div>

                      {/* Quick Actions Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4 shadow-md">
                        <p className="font-bold mb-4 text-blue-800 text-lg">⚡ QUICK ACTIONS ⚡</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              setUserInput("give ipl team names");
                              handleSendMessage();
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3 px-3 rounded-lg border border-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            🏏 IPL Teams
                          </button>
                          <button
                            onClick={() => {
                              setUserInput("give nba team names");
                              handleSendMessage();
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm py-3 px-3 rounded-lg border border-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            🏀 NBA Teams
                          </button>
                          <button
                            onClick={() => {
                              setUserInput("give pokemon names");
                              handleSendMessage();
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-sm py-3 px-3 rounded-lg border border-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            ⚡ Pokemon
                          </button>
                          <button
                            onClick={() => {
                              setUserInput("give marvel heroes");
                              handleSendMessage();
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-3 px-3 rounded-lg border border-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            🦸 Marvel
                          </button>
                          <button
                            onClick={() => {
                              setUserInput("give anime characters");
                              handleSendMessage();
                            }}
                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm py-3 px-3 rounded-lg border border-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            🍜 Anime
                          </button>
                          <button
                            onClick={() => {
                              setUserInput("give football teams");
                              handleSendMessage();
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-3 px-3 rounded-lg border border-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            ⚽ Football
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Suggestions Tab */}
                <TabsContent value="suggestions" className="p-6 space-y-4 overflow-y-auto h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">AI Suggestions</h3>
                    <Button
                      onClick={generateSuggestions}
                      disabled={isLoading}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Generate
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {suggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{suggestion.title}</h4>
                                <Badge 
                                  variant={suggestion.impact === 'high' ? 'destructive' : suggestion.impact === 'medium' ? 'default' : 'secondary'}
                                >
                                  {suggestion.impact}
                                </Badge>
                                <Badge variant="outline">
                                  {Math.round(suggestion.confidence * 100)}% confidence
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                              {suggestion.action && (
                                <Button
                                  onClick={() => applySuggestion(suggestion)}
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  {suggestion.action}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {suggestions.length === 0 && !isLoading && (
                      <div className="text-center py-8 text-gray-500">
                        <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No suggestions available. Click "Generate" to get AI recommendations.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Optimize Tab */}
                <TabsContent value="optimize" className="p-6 space-y-4 overflow-y-auto h-full">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">AI Optimization</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Let Gemini AI automatically optimize your team configuration for the best results.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="p-4 text-center">
                            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                            <p className="text-sm font-semibold">{participants.length}</p>
                            <p className="text-xs text-gray-500">Participants</p>
                          </Card>
                          <Card className="p-4 text-center">
                            <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                            <p className="text-sm font-semibold">{numberOfGroups}</p>
                            <p className="text-xs text-gray-500">Current Groups</p>
                          </Card>
                        </div>
                        
                        <Button
                          onClick={autoOptimize}
                          disabled={isLoading || participants.length === 0}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          {isLoading ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Optimizing...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4 mr-2" />
                              Auto-Optimize with Gemini
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
