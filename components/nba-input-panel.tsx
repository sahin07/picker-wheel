"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useWheelManagerStore, NBAWheelData } from "@/stores/wheel-manager-store"
import { nbaTeams, getNBATeamsByConference, type NBATeam, nbaDivisions, type ActionMode } from "@/data/nba-teams"
import { 
  Brain, 
  Sparkles, 
  Crown, 
  Target, 
  Trophy, 
  Zap, 
  Gamepad2, 
  BookOpen, 
  TrendingUp, 
  X, 
  Gem, 
  Mic,
  Target as TargetIcon,
  Users,
  Shuffle,
  RotateCcw,
  ChevronDown,
  Star,
  Clock,
  Home,
  Wind,
  BarChart3,
  Cloud,
  Heart,
  Music,
  CheckSquare,
  Plus
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NBAInputPanelProps {
  activeTab?: 'manual' | 'ai'
  onTabChange?: (tab: 'manual' | 'ai') => void
  actionMode?: ActionMode
  onActionModeChange?: (mode: ActionMode) => void
  onEliminationMode?: (selectedTeam: NBATeam) => void
}

const NBAInputPanel = React.memo(({ 
  activeTab: externalActiveTab, 
  onTabChange,
  actionMode: externalActionMode,
  onActionModeChange,
  onEliminationMode
}: NBAInputPanelProps) => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>(externalActiveTab || 'manual')
  const [showTeamList, setShowTeamList] = useState(true)
  
  // AI-related state variables
  const [aiSuggestions, setAiSuggestions] = useState<NBATeam[]>([])
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const [aiCommentary, setAiCommentary] = useState<string>("")
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [userInput, setUserInput] = useState<string>("")
  const [aiPredictionResponse, setAiPredictionResponse] = useState<string>("")
  const [isGeneratingPrediction, setIsGeneratingPrediction] = useState(false)
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [aiTrivia, setAiTrivia] = useState<any>(null)
  const [aiPrediction, setAiPrediction] = useState<any>(null)
  const [aiEntertainment, setAiEntertainment] = useState<any>(null)
  const [aiLearning, setAiLearning] = useState<any>(null)
  const [aiSocial, setAiSocial] = useState<any>(null)
  const [aiCreativeContent, setAiCreativeContent] = useState<{
    type: string;
    content: string;
    suggestedTeams?: string[];
    currentTeam?: NBATeam;
  } | null>(null)
  const [aiMood, setAiMood] = useState<string>("neutral")
  const [aiGameMode, setAiGameMode] = useState<string>("")
  const [aiFantasyDraft, setAiFantasyDraft] = useState<any>(null)
  const [aiHistoricalAnalysis, setAiHistoricalAnalysis] = useState<any>(null)
  const [aiTeamChemistry, setAiTeamChemistry] = useState<any>(null)
  const [aiWeatherImpact, setAiWeatherImpact] = useState<any>(null)
  const [aiFanPerspective, setAiFanPerspective] = useState<any>(null)
  
  // Manual input state variables
  const [manualTeamName, setManualTeamName] = useState("")
  const [customTeams, setCustomTeams] = useState<NBATeam[]>([])

  const { toast } = useToast()

  useEffect(() => setMounted(true), [])

  // Subscribe to the current wheel using a Zustand selector - optimized
  const wheel = useWheelManagerStore(useCallback(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  }, []));
  
  // Memoize default data to prevent recreation
  const defaultData = useMemo((): NBAWheelData => ({
    selectedConference: "all",
    selectedTeams: [],
    displayMode: "name",
    viewMode: "wheel",
    favoriteTeams: [],
    comparisonTeams: [],
    isSpinning: false,
    spinRotation: 0,
    selectedResult: null,
    totalSpins: 0,
    showStatistics: false,
    showComparison: false,
    showFavorites: false,
    recentResults: []
  }), []);
  
  const rawData = (wheel?.data as any) || {}
  const data: NBAWheelData = useMemo(() => ({
    ...defaultData,
    ...rawData,
    selectedTeams: Array.isArray(rawData?.selectedTeams) ? rawData.selectedTeams : []
  }), [rawData, defaultData])

  const { updateWheelData } = useWheelManagerStore()

  // Tab management - optimized with useCallback
  const handleTabChange = useCallback((tab: 'manual' | 'ai') => {
    setActiveTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }, [onTabChange])

  // Initialize with all teams if none selected - optimized with useCallback
  useEffect(() => {
    if (!Array.isArray(data.selectedTeams) || data.selectedTeams.length === 0) {
      const allTeams = getNBATeamsByConference(data.selectedConference || "all")
      updateWheelData("nba-wheel", wheel?.id || "", {
        ...data,
        selectedTeams: allTeams
      })
    }
  }, [data.selectedConference, data.selectedTeams, wheel?.id, updateWheelData, data])

  const handleConferenceChange = useCallback((conf: "all" | "Eastern" | "Western") => {
    const teams = getNBATeamsByConference(conf as any)
    const updatedData = { ...data, selectedConference: conf, selectedTeams: teams }
    updateWheelData("nba-wheel", wheel?.id || "", updatedData)
  }, [data, updateWheelData, wheel?.id])

  const handleDisplayModeChange = useCallback((mode: "logo" | "name" | "both") => {
    const updatedData = { ...data, displayMode: mode }
    updateWheelData("nba-wheel", wheel?.id || "", updatedData)
  }, [data, updateWheelData, wheel?.id])

  const handleViewModeChange = useCallback((mode: "wheel" | "list" | "text") => {
    const updatedData = { ...data, viewMode: mode }
    updateWheelData("nba-wheel", wheel?.id || "", updatedData)
  }, [data, updateWheelData, wheel?.id])

  const toggleTeam = useCallback((team: NBATeam) => {
    const currentTeams = data.selectedTeams || []
    const exists = currentTeams.some((t: any) => t.id === team.id)
    const updated = exists ? currentTeams.filter((t: any) => t.id !== team.id) : [...currentTeams, team]
    const updatedData = { ...data, selectedTeams: updated }
    updateWheelData("nba-wheel", wheel?.id || "", updatedData)
  }, [data, updateWheelData, wheel?.id])

  const selectAll = useCallback(() => {
    const teams = getNBATeamsByConference(data.selectedConference as any)
    const updatedData = { ...data, selectedTeams: teams }
    updateWheelData("nba-wheel", wheel?.id || "", updatedData)
  }, [data, updateWheelData, wheel?.id])

  const clearAll = useCallback(() => {
    const updatedData = { ...data, selectedTeams: [] }
    updateWheelData("nba-wheel", wheel?.id || "", updatedData)
  }, [data, updateWheelData, wheel?.id])

  const shuffleTeams = useCallback(() => {
    const currentTeams = data.selectedTeams || []
    const shuffled = [...currentTeams].sort(() => Math.random() - 0.5)
    const updatedData = { ...data, selectedTeams: shuffled }
    updateWheelData("nba-wheel", wheel?.id || "", updatedData)
  }, [data, updateWheelData, wheel?.id])

  const sortTeamsAlphabetically = useCallback(() => {
    const currentTeams = data.selectedTeams || []
    const sorted = [...currentTeams].sort((a, b) => a.name.localeCompare(b.name))
    const updatedData = { ...data, selectedTeams: sorted }
    updateWheelData("nba-wheel", wheel?.id || "", updatedData)
  }, [data, updateWheelData, wheel?.id])

  const divisionsByConf = useCallback((conf: "Eastern" | "Western") => nbaDivisions.filter(d => d.league === conf), []);

  // AI Functions
  const generateAISuggestions = useCallback(async () => {
    setIsGeneratingSuggestions(true)
    
    try {
      const allTeams = getNBATeamsByConference(data.selectedConference || "all")
      const prompt = `Suggest 8 NBA teams for a picker wheel based on the following criteria:

Conference: ${data.selectedConference}
Available Teams: ${allTeams.map(team => `${team.name} (${team.city}, ${team.league} Conference, ${team.division} Division, Founded: ${team.founded}, Championships: ${team.championships})`).join(', ')}

Please suggest 8 teams that would create an interesting and balanced picker wheel. Consider:
- Mix of different eras and histories
- Balance between Eastern and Western Conference
- Variety in championship counts
- Geographic diversity
- Different division representation

Return only the team names in a simple list format.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'basketball', conference: data.selectedConference },
            chatHistory: [],
            mode: 'generator'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.message) {
          // Extract team names from AI response
          const aiResponse = result.data.message
          const suggestedTeamNames = extractTeamNames(aiResponse)
          
          // Find the actual team objects
          const suggestions = allTeams.filter(team => 
            suggestedTeamNames.some(name => 
              team.name.toLowerCase().includes(name.toLowerCase()) ||
              name.toLowerCase().includes(team.name.toLowerCase())
            )
          ).slice(0, 8)
          
          // If AI didn't suggest enough teams, fill with random ones
          if (suggestions.length < 8) {
            const remainingTeams = allTeams.filter(team => !suggestions.includes(team))
            const shuffled = [...remainingTeams].sort(() => Math.random() - 0.5)
            suggestions.push(...shuffled.slice(0, 8 - suggestions.length))
          }
          
          setAiSuggestions(suggestions)
          
          // Auto-select AI suggestions to the wheel
          const updatedData = { ...data, selectedTeams: suggestions }
          updateWheelData("nba-wheel", wheel?.id || "", updatedData)
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Suggestions Error:', error)
      // Fallback to simulated suggestions
      const allTeams = getNBATeamsByConference(data.selectedConference || "all")
      const shuffled = [...allTeams].sort(() => Math.random() - 0.5)
      const suggestions = shuffled.slice(0, 8)
      
      setAiSuggestions(suggestions)
      
      // Auto-select AI suggestions to the wheel
      const updatedData = { ...data, selectedTeams: suggestions }
      updateWheelData("nba-wheel", wheel?.id || "", updatedData)
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }, [data.selectedConference, updateWheelData, wheel?.id])

  // Manual team handling functions
  const handleAddManualTeam = useCallback(() => {
    if (!manualTeamName.trim()) {
      console.log('Manual team name is empty')
      return
    }

    // Check if team with this name already exists
    const allTeams = getNBATeamsByConference(data.selectedConference || "all")
    const teamExists = allTeams.some(team => team.name.toLowerCase() === manualTeamName.trim().toLowerCase())
    if (teamExists) {
      console.log('Team with this name already exists:', manualTeamName)
      toast({
        title: "Team Already Exists",
        description: `Team "${manualTeamName}" already exists!`,
        duration: 3000,
      })
      return
    }

    console.log('Adding manual team:', manualTeamName)
    
    // Create a custom team object
    const customTeam: NBATeam = {
      id: `manual-${Date.now()}`,
      name: manualTeamName.trim(),
      abbreviation: manualTeamName.trim().substring(0, 3).toUpperCase(),
      city: "Custom City",
      league: "Eastern",
      division: "Atlantic",
      logo: "🏀",
      primaryColor: "#666666",
      secondaryColor: "#999999",
      founded: new Date().getFullYear(),
      championships: 0,
      homeVenue: "Custom Arena",
      manager: "Custom Coach",
      owner: "Custom Owner"
    }

    // Add to custom teams state (avoid duplicates)
    setCustomTeams(prev => {
      const exists = prev.some(team => team.id === customTeam.id)
      return exists ? prev : [...prev, customTeam]
    })

    // Add to selected teams
    const newSelected = [...data.selectedTeams, customTeam]
    updateWheelData("nba-wheel", wheel?.id || "", {
      ...data,
      selectedTeams: newSelected
    })
    
    // Reset input
    setManualTeamName("")
    
    toast({
      title: "Custom Team Added!",
      description: `Added custom team "${customTeam.name}" to wheel!`,
      duration: 3000,
    })
    console.log('Custom team added successfully:', customTeam.name)
  }, [manualTeamName, data.selectedConference, data.selectedTeams, updateWheelData, wheel?.id, toast])

  const handleDeleteCustomTeam = useCallback((teamId: string) => {
    console.log('Deleting custom team:', teamId)
    
    // Remove from custom teams state
    setCustomTeams(prev => prev.filter(team => team.id !== teamId))
    
    // Remove from selected teams
    const newSelected = data.selectedTeams.filter(team => team.id !== teamId)
    updateWheelData("nba-wheel", wheel?.id || "", {
      ...data,
      selectedTeams: newSelected
    })
    
    toast({
      title: "Custom Team Removed",
      description: "Custom team removed from wheel!",
      duration: 3000,
    })
    console.log('Custom team deleted successfully:', teamId)
  }, [data.selectedTeams, updateWheelData, wheel?.id, toast])

  // Helper function to extract team names from AI response
  const extractTeamNames = useCallback((text: string): string[] => {
    const teamNames: string[] = []
    
    // Extract from numbered lists
    const numberedMatches = text.match(/\d+\.\s*([^:]+?)(?:\s*\([^)]+\))?/g)
    if (numberedMatches) {
      numberedMatches.forEach(match => {
        const teamName = match.replace(/\d+\.\s*/, '').replace(/\s*\([^)]+\)/, '').trim()
        if (teamName && teamName.length > 2) {
          teamNames.push(teamName)
        }
      })
    }
    
    // Extract from bullet points
    const bulletMatches = text.match(/\*\s*([^:]+?)(?:\s*\([^)]+\))?/g)
    if (bulletMatches) {
      bulletMatches.forEach(match => {
        const teamName = match.replace(/\*\s*/, '').replace(/\s*\([^)]+\)/, '').trim()
        if (teamName && teamName.length > 2) {
          teamNames.push(teamName)
        }
      })
    }
    
    // Extract from dash lists
    const dashMatches = text.match(/-\s*([^:]+?)(?:\s*\([^)]+\))?/g)
    if (dashMatches) {
      dashMatches.forEach(match => {
        const teamName = match.replace(/-\s*/, '').replace(/\s*\([^)]+\)/, '').trim()
        if (teamName && teamName.length > 2) {
          teamNames.push(teamName)
        }
      })
    }
    
    return [...new Set(teamNames)] // Remove duplicates
  }, [])

  const generateAIInsights = useCallback((team: NBATeam) => {
    const insights = {
      performancePrediction: `${Math.floor(Math.random() * 30) + 60}% chance of making playoffs`,
      funFact: `Did you know ${team.name} has the ${['longest', 'shortest', 'most impressive'][Math.floor(Math.random() * 3)]} winning streak this season?`,
      strategicAdvantage: `${team.name} excels in ${['fast breaks', 'three-point shooting', 'defense', 'rebounding'][Math.floor(Math.random() * 4)]}`,
      competitiveEdge: `${team.name} performs ${Math.floor(Math.random() * 20) + 10}% better at home games`
    }
    setAiInsights(insights)
  }, [])

  const generateAICommentary = useCallback(() => {
    const commentaries = [
      "The wheel is spinning with the intensity of a game 7 final!",
      "Like a perfect three-pointer, your result is coming in clutch!",
      "The AI is analyzing court dynamics faster than a fast break!",
      "This spin has more suspense than overtime in the finals!",
      "The basketball gods are aligning the stars for your perfect pick!"
    ]
    setAiCommentary(commentaries[Math.floor(Math.random() * commentaries.length)])
  }, [])

  const generateAITrivia = useCallback((team: NBATeam) => {
    const triviaQuestions = [
      {
        question: `In what year was ${team.name} founded?`,
        answer: team.founded.toString(),
        difficulty: "Easy"
      },
      {
        question: `How many championships has ${team.name} won?`,
        answer: team.championships.toString(),
        difficulty: "Medium"
      },
      {
        question: `What arena does ${team.name} call home?`,
        answer: team.homeVenue,
        difficulty: "Hard"
      }
    ]
    setAiTrivia({
      questions: triviaQuestions,
      currentQuestion: triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)],
      hint: `Think about ${team.name}'s history and location!`
    })
  }, [])

  const generateAIPredictions = useCallback((team: NBATeam) => {
    const predictions = {
      seasonPrediction: `${team.name} is predicted to finish ${Math.floor(Math.random() * 5) + 1}${['st', 'nd', 'rd', 'th', 'th'][Math.floor(Math.random() * 5)]} in their conference`,
      playoffChance: `${Math.floor(Math.random() * 40) + 30}% chance of making the playoffs`,
      keyPlayer: `Watch out for ${team.name}'s star player this season!`,
      matchupAdvantage: `${team.name} has a strong matchup advantage against divisional rivals`
    }
    setAiPrediction(predictions)
  }, [])

  const generateAIEntertainment = useCallback((team: NBATeam) => {
    const entertainment = {
      teamRoast: `${team.name}? More like ${team.name}... am I right? 😂`,
      victoryDance: `When ${team.name} wins, the crowd goes wild! 🎉`,
      chant: `"Let's go ${team.name}!" echoes through ${team.homeVenue} like thunder!`
    }
    setAiEntertainment(entertainment)
  }, [])

  const generateAILearning = useCallback((team: NBATeam) => {
    const learning = {
      basketballIQ: `${team.name} is known for their ${['aggressive offense', 'lockdown defense', 'clutch shooting', 'team chemistry'][Math.floor(Math.random() * 4)]}`,
      strategyInsights: `${team.name} often uses the ${['pick and roll', 'zone defense', 'fast break', 'isolation play'][Math.floor(Math.random() * 4)]} as a key strategy`,
      historicalContext: `${team.name} has a rich history of ${['developing young talent', 'championship success', 'legendary coaches', 'iconic players'][Math.floor(Math.random() * 4)]}`,
      coachingStyle: `The coaching philosophy focuses on ${['player development', 'team chemistry', 'defensive intensity', 'offensive innovation'][Math.floor(Math.random() * 4)]}`
    }
    setAiLearning(learning)
  }, [])

  const generateAISocial = useCallback((team: NBATeam) => {
    const social = {
      aiMatchmaker: `${Math.floor(Math.random() * 50) + 30}% of users who picked ${team.name} also liked the ${['Lakers', 'Warriors', 'Celtics', 'Bulls'][Math.floor(Math.random() * 4)]}`,
      groupChallenge: `Join the "${team.name} Challenge" - can you pick them 3 times in a row?`,
      trending: `${team.name} is trending among basketball fans for their exciting gameplay!`,
      community: `The ${team.name} fan community is known for their passionate support and dedication`
    }
    setAiSocial(social)
  }, [])

  // AI Creative Content Generation
  const generateAICreativeContent = useCallback(async (type: string) => {
    setIsGeneratingAI(true)
    
    // Use currently selected teams or a random team if none selected
    let targetTeams = data.selectedTeams
    if (targetTeams.length === 0) {
      targetTeams = [nbaTeams[Math.floor(Math.random() * nbaTeams.length)]]
    }
    
    // Select a random team from the selected teams
    const randomTeam = targetTeams[Math.floor(Math.random() * targetTeams.length)]
    
    try {
      const prompt = `Create a ${type} about the ${randomTeam.name} NBA team. 
      
Team Information:
- Name: ${randomTeam.name}
- City: ${randomTeam.city}
- Founded: ${randomTeam.founded}
- Championships: ${randomTeam.championships}
- Home Venue: ${randomTeam.homeVenue}
- Manager: ${randomTeam.manager}
- League: ${randomTeam.league}
- Division: ${randomTeam.division}

Please create a creative ${type} that celebrates this team's history, achievements, and spirit. Make it engaging, fun, and basketball-themed. Include emojis and formatting to make it visually appealing.

After creating the ${type}, suggest exactly 3 other NBA teams that would be interesting to spin the wheel for next, based on the theme of your ${type}. Format your suggestions like this:

**Los Angeles Lakers:** A classic team with a rich history and passionate fanbase, offering a contrast to the team's relatively newer history.
**Boston Celtics:** Their legendary status and iconic imagery would provide a different poetic challenge, focusing on their long-standing dominance.
**Chicago Bulls:** A team with a long history and recent success, exploring themes of perseverance and overcoming challenges.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'basketball', team: randomTeam.name },
            chatHistory: [],
            mode: 'generator'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.message) {
          const aiResponse = result.data.message
          
          // Extract suggested teams for next spin
          const suggestedTeams = extractSuggestedTeams(aiResponse)
          
          setAiCreativeContent({ 
            type: type.charAt(0).toUpperCase() + type.slice(1), 
            content: aiResponse,
            suggestedTeams: suggestedTeams,
            currentTeam: randomTeam
          })
          
          // Show toast with suggestion to spin wheel
          toast({
            title: "Creative Content Generated!",
            description: `Created ${type} about ${randomTeam.name}! Spin the wheel to explore more teams!`,
            duration: 3000,
          })
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Creative Content Error:', error)
      // Fallback to simulated content
      let content = ""
      
      switch(type) {
        case "story":
          content = `🏀 The Legend of ${randomTeam.name} 🏀

In the heart of ${randomTeam.city}, where dreams are born and legends are made, the ${randomTeam.name} stand as a testament to basketball's enduring spirit. Founded in ${randomTeam.founded}, this storied franchise has captured the hearts of millions.

The ${randomTeam.name} aren't just a team - they're a family. From the passionate fans who fill ${randomTeam.homeVenue} to the dedicated players who wear the uniform with pride, every game is a chapter in an epic tale of determination and triumph.

With ${randomTeam.championships} NBA championships to their name, the ${randomTeam.name} have proven that greatness isn't just about winning - it's about the journey, the struggles, and the moments that define a legacy.

As the sun sets over the court and the crowd rises to their feet, the ${randomTeam.name} continue to write their story, one shot at a time, one game at a time, one season at a time. This is more than basketball - this is magic.

💡 **Spin the wheel to discover more legendary teams!**`
          break
          
        case "poem":
          content = `🏀 Ode to ${randomTeam.name} 🏀

In ${randomTeam.city} where legends dwell,
The ${randomTeam.name} cast their mighty spell.
Founded in ${randomTeam.founded}, proud and true,
Their colors shine in every hue.

${randomTeam.homeVenue} echoes with cheers so loud,
As fans gather in a faithful crowd.
${randomTeam.championships} championships won with might,
Beneath the arena's golden light.

From ${randomTeam.manager}'s wisdom to the court,
A legacy that will never fall short.
The ${randomTeam.name} spirit, bold and free,
A symbol of what basketball should be.

So here's to the team we love so dear,
The ${randomTeam.name} - year after year!

🎯 **Ready to spin? Try the wheel for another poetic team!**`
          break
          
        case "rap":
          content = `🎤 ${randomTeam.name} Rap Battle 🎤

Yo, listen up, I'm about to drop the truth,
About the ${randomTeam.name} and their basketball youth.
Founded in ${randomTeam.founded}, they've been in the game,
Building a legacy, earning their fame.

${randomTeam.homeVenue} is where the magic happens,
Fans going wild, no time for napping.
${randomTeam.championships} rings on their fingers,
Proving they're winners, not just singers.

${randomTeam.manager} leading the charge,
Taking this team to the top, large.
${randomTeam.city} representing strong,
The ${randomTeam.name} can do no wrong.

So step to the court if you think you're ready,
But the ${randomTeam.name} keep it steady.
This is our house, this is our game,
The ${randomTeam.name} will always reign!

🔥 **Drop the mic and spin the wheel for the next rap battle!**`
          break
          
        case "comedy":
          content = `😂 ${randomTeam.name} Comedy Hour 😂

Why did the ${randomTeam.name} player bring a ladder to the game?
Because he wanted to reach new heights! 😄

What do you call a ${randomTeam.name} fan who's always late?
A fashionably delayed supporter! ⏰

How many ${randomTeam.name} players does it take to change a light bulb?
None - they prefer to play in the spotlight! 💡

Why did the ${randomTeam.name} coach go to the bank?
To check his shot count! 🏦

What's a ${randomTeam.name} player's favorite type of music?
Basketball blues! 🎵

Why did the ${randomTeam.name} mascot go to the doctor?
Because he was feeling a little "fowl"! 🐦

The ${randomTeam.name} are so good, even their shadows have shooting percentages! 🏀

Remember: In ${randomTeam.city}, we don't just play basketball - we make it fun! 😎

🎭 **Laughing? Now spin the wheel for more comedy gold!**`
          break
      }
      
      setAiCreativeContent({ 
        type: type.charAt(0).toUpperCase() + type.slice(1), 
        content: content,
        suggestedTeams: [],
        currentTeam: randomTeam
      })
    } finally {
      setIsGeneratingAI(false)
    }
  }, [data.selectedTeams, nbaTeams, toast])

  // Helper function to extract suggested teams from AI response
  const extractSuggestedTeams = useCallback((text: string): string[] => {
    const suggestedTeams: string[] = []
    
    // Look for numbered lists with team names
    const numberedPattern = /\d+\.\s*\*\*([^*]+)\*\*:?\s*([^.!?]+)/gi
    const numberedMatches = text.match(numberedPattern)
    
    if (numberedMatches) {
      numberedMatches.forEach(match => {
        const teamName = match.replace(/\d+\.\s*\*\*/, '').replace(/\*\*:?\s*.*/, '').trim()
        if (teamName && teamName.length > 0) {
          suggestedTeams.push(teamName)
        }
      })
    }
    
    // Look for patterns like "suggest", "try", "next", "spin for"
    const patterns = [
      /(?:suggest|try|next|spin for|wheel for)\s*:?\s*([^.!?]+)/gi,
      /(?:teams?|franchises?)\s*:?\s*([^.!?]+)/gi
    ]
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const teamNames = match.replace(/(?:suggest|try|next|spin for|wheel for|teams?|franchises?)\s*:?\s*/gi, '')
            .split(/[,&]/)
            .map(name => name.trim())
            .filter(name => name.length > 0)
          
          suggestedTeams.push(...teamNames)
        })
      }
    })
    
    // Look for specific team names in the text
    const teamNames = [
      'Los Angeles Lakers', 'Boston Celtics', 'Chicago Bulls', 'Golden State Warriors', 'Miami Heat',
      'San Antonio Spurs', 'Dallas Mavericks', 'Houston Rockets', 'Phoenix Suns', 'Denver Nuggets',
      'Portland Trail Blazers', 'Utah Jazz', 'Oklahoma City Thunder', 'Minnesota Timberwolves',
      'Sacramento Kings', 'Los Angeles Clippers', 'New Orleans Pelicans', 'Memphis Grizzlies',
      'Milwaukee Bucks', 'Indiana Pacers', 'Detroit Pistons', 'Cleveland Cavaliers', 'Toronto Raptors',
      'Philadelphia 76ers', 'New York Knicks', 'Brooklyn Nets', 'Washington Wizards', 'Atlanta Hawks',
      'Charlotte Hornets', 'Orlando Magic'
    ]
    
    teamNames.forEach(teamName => {
      if (text.includes(teamName) && !suggestedTeams.includes(teamName)) {
        suggestedTeams.push(teamName)
      }
    })
    
    return [...new Set(suggestedTeams)].slice(0, 3) // Return up to 3 unique suggestions
  }, [])

  // Helper function to extract values from AI response
  const extractValue = useCallback((text: string, key: string): string | null => {
    const patterns = {
      // Fantasy Draft patterns
      'team value': /team value[:\s]*(\$[\d.]+[MBK]?)/i,
      'draft position': /draft position[:\s]*(\d+[stndrdth]+)/i,
      'sleeper': /sleeper[:\s]*([^.]+)/i,
      'risk': /risk[:\s]*([^.]+)/i,
      'advice': /advice[:\s]*([^.]+)/i,
      'keeper': /keeper[:\s]*([^.]+)/i,
      
      // Historical Analysis patterns
      'era': /era[:\s]*([^.]+)/i,
      'defining moment': /defining moment[:\s]*([^.]+)/i,
      'legendary player': /legendary player[:\s]*([^.]+)/i,
      'cultural impact': /cultural impact[:\s]*([^.]+)/i,
      'statistical milestone': /statistical milestone[:\s]*([^.]+)/i,
      'evolution': /evolution[:\s]*([^.]+)/i,
      
      // Team Chemistry patterns
      'locker room': /locker room[:\s]*([^.]+)/i,
      'leadership': /leadership[:\s]*([^.]+)/i,
      'rookie': /rookie[:\s]*([^.]+)/i,
      'bonding': /bonding[:\s]*([^.]+)/i,
      'chemistry score': /chemistry score[:\s]*([^.]+)/i,
      'winning factor': /winning factor[:\s]*([^.]+)/i,
      
      // Weather Impact patterns
      'home advantage': /home advantage[:\s]*([^.]+)/i,
      'wind': /wind[:\s]*([^.]+)/i,
      'temperature': /temperature[:\s]*([^.]+)/i,
      'humidity': /humidity[:\s]*([^.]+)/i,
      'seasonal': /seasonal[:\s]*([^.]+)/i,
      'strategy': /strategy[:\s]*([^.]+)/i,
      
      // Fan Perspective patterns
      'fan loyalty': /fan loyalty[:\s]*([^.]+)/i,
      'game day': /game day[:\s]*([^.]+)/i,
      'community': /community[:\s]*([^.]+)/i,
      'traditions': /traditions[:\s]*([^.]+)/i,
      'social media': /social media[:\s]*([^.]+)/i,
      'generational': /generational[:\s]*([^.]+)/i
    }
    
    const pattern = patterns[key as keyof typeof patterns]
    if (pattern) {
      const match = text.match(pattern)
      return match ? match[1].trim() : null
    }
    return null
  }, [])

  const generateAllAIFeatures = useCallback((team: NBATeam) => {
    setIsGeneratingAI(true)
    
    setTimeout(() => {
      generateAIInsights(team)
      generateAICommentary()
      generateAITrivia(team)
      generateAIPredictions(team)
      generateAIEntertainment(team)
      generateAILearning(team)
      generateAISocial(team)
      setIsGeneratingAI(false)
    }, 2000)
  }, [generateAIInsights, generateAICommentary, generateAITrivia, generateAIPredictions, generateAIEntertainment, generateAILearning, generateAISocial, setIsGeneratingAI])

  // AI Fantasy Draft Analysis
  const generateAIFantasyDraft = useCallback(async () => {
    setIsGeneratingAI(true)
    const randomTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)]
    
    try {
      const prompt = `Analyze the ${randomTeam.name} for fantasy basketball purposes.

Team Information:
- Name: ${randomTeam.name}
- City: ${randomTeam.city}
- Founded: ${randomTeam.founded}
- Championships: ${randomTeam.championships}
- Home Venue: ${randomTeam.homeVenue}
- Manager: ${randomTeam.manager}
- League: ${randomTeam.league}
- Division: ${randomTeam.division}

Please provide fantasy basketball analysis including:
1. Team value estimation
2. Recommended draft position
3. Sleeper pick potential
4. Risk vs reward assessment
5. Fantasy advice
6. Keeper potential

Format your response as a structured analysis with specific numbers and percentages.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'basketball', analysis: 'fantasy' },
            chatHistory: [],
            mode: 'analysis'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.message) {
          // Parse the AI response to extract structured data
          const aiResponse = result.data.message
          const fantasyAnalysis = {
            teamValue: extractValue(aiResponse, 'team value') || `$${Math.floor(Math.random() * 50) + 100}M`,
            draftPosition: extractValue(aiResponse, 'draft position') || `${Math.floor(Math.random() * 10) + 1}${['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th'][Math.floor(Math.random() * 10)]}`,
            sleeperPick: extractValue(aiResponse, 'sleeper') || `${randomTeam.name} has a hidden gem that could be this year's breakout star`,
            riskFactor: extractValue(aiResponse, 'risk') || `${Math.floor(Math.random() * 40) + 20}% risk, ${Math.floor(Math.random() * 40) + 40}% reward`,
            fantasyAdvice: extractValue(aiResponse, 'advice') || `Consider ${randomTeam.name} in the mid-rounds for solid value`,
            keeperPotential: extractValue(aiResponse, 'keeper') || `${Math.floor(Math.random() * 30) + 70}% chance of being a keeper for next season`
          }
          setAiFantasyDraft(fantasyAnalysis)
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Fantasy Draft Error:', error)
      // Fallback to simulated analysis
      const fantasyAnalysis = {
        teamValue: `$${Math.floor(Math.random() * 50) + 100}M`,
        draftPosition: `${Math.floor(Math.random() * 10) + 1}${['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th'][Math.floor(Math.random() * 10)]}`,
        sleeperPick: `${randomTeam.name} has a hidden gem that could be this year's breakout star`,
        riskFactor: `${Math.floor(Math.random() * 40) + 20}% risk, ${Math.floor(Math.random() * 40) + 40}% reward`,
        fantasyAdvice: `Consider ${randomTeam.name} in the mid-rounds for solid value`,
        keeperPotential: `${Math.floor(Math.random() * 30) + 70}% chance of being a keeper for next season`
      }
      setAiFantasyDraft(fantasyAnalysis)
    } finally {
      setIsGeneratingAI(false)
    }
  }, [nbaTeams, extractValue])

  // AI Historical Analysis
  const generateAIHistoricalAnalysis = useCallback(async () => {
    setIsGeneratingAI(true)
    const randomTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)]
    
    try {
      const prompt = `Analyze the historical significance of the ${randomTeam.name} NBA team.

Team Information:
- Name: ${randomTeam.name}
- City: ${randomTeam.city}
- Founded: ${randomTeam.founded}
- Championships: ${randomTeam.championships}
- Home Venue: ${randomTeam.homeVenue}
- Manager: ${randomTeam.manager}
- League: ${randomTeam.league}
- Division: ${randomTeam.division}

Please provide historical analysis including:
1. Era classification (Early NBA, Golden Age, Modern Era, etc.)
2. Defining moment in team history
3. Legendary player who revolutionized the game
4. Cultural impact on basketball and the city
5. Statistical milestones and records
6. Evolution of the team over time

Format your response as a structured analysis with specific historical details.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'basketball', analysis: 'historical' },
            chatHistory: [],
            mode: 'analysis'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.message) {
          const aiResponse = result.data.message
          const historicalAnalysis = {
            era: extractValue(aiResponse, 'era') || `${randomTeam.founded < 1950 ? 'Early NBA Era' : randomTeam.founded < 1980 ? 'Golden Age' : 'Modern Era'}`,
            definingMoment: extractValue(aiResponse, 'defining moment') || `The ${randomTeam.name}'s ${randomTeam.championships > 0 ? 'championship victory' : 'first playoff appearance'} changed basketball forever`,
            legendaryPlayer: extractValue(aiResponse, 'legendary player') || `${randomTeam.name} had a player who revolutionized the game`,
            culturalImpact: extractValue(aiResponse, 'cultural impact') || `${randomTeam.name} influenced basketball culture in ${randomTeam.city}`,
            statisticalMilestone: extractValue(aiResponse, 'statistical milestone') || `${randomTeam.name} achieved a record that stood for decades`,
            evolution: extractValue(aiResponse, 'evolution') || `From ${randomTeam.founded} to today, ${randomTeam.name} has evolved with the game`
          }
          setAiHistoricalAnalysis(historicalAnalysis)
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Historical Analysis Error:', error)
      // Fallback to simulated analysis
      const historicalAnalysis = {
        era: `${randomTeam.founded < 1950 ? 'Early NBA Era' : randomTeam.founded < 1980 ? 'Golden Age' : 'Modern Era'}`,
        definingMoment: `The ${randomTeam.name}'s ${randomTeam.championships > 0 ? 'championship victory' : 'first playoff appearance'} changed basketball forever`,
        legendaryPlayer: `${randomTeam.name} had a player who revolutionized the game`,
        culturalImpact: `${randomTeam.name} influenced basketball culture in ${randomTeam.city}`,
        statisticalMilestone: `${randomTeam.name} achieved a record that stood for decades`,
        evolution: `From ${randomTeam.founded} to today, ${randomTeam.name} has evolved with the game`
      }
      setAiHistoricalAnalysis(historicalAnalysis)
    } finally {
      setIsGeneratingAI(false)
    }
  }, [nbaTeams, extractValue])

  // AI Team Chemistry Analysis
  const generateAITeamChemistry = useCallback(async () => {
    setIsGeneratingAI(true)
    const randomTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)]
    
    try {
      const prompt = `Analyze the team chemistry and dynamics of the ${randomTeam.name} NBA team.

Team Information:
- Name: ${randomTeam.name}
- City: ${randomTeam.city}
- Founded: ${randomTeam.founded}
- Championships: ${randomTeam.championships}
- Home Venue: ${randomTeam.homeVenue}
- Manager: ${randomTeam.manager}
- League: ${randomTeam.league}
- Division: ${randomTeam.division}

Please provide team chemistry analysis including:
1. Locker room atmosphere and vibe
2. Leadership quality and veteran presence
3. Rookie integration and team culture
4. Team bonding and player relationships
5. Overall chemistry score (0-100)
6. How chemistry contributes to winning

Format your response as a structured analysis with specific percentages and scores.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'basketball', analysis: 'chemistry' },
            chatHistory: [],
            mode: 'analysis'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.message) {
          const aiResponse = result.data.message
          const chemistryAnalysis = {
            lockerRoomVibe: extractValue(aiResponse, 'locker room') || `${Math.floor(Math.random() * 40) + 60}% positive energy`,
            leadershipQuality: extractValue(aiResponse, 'leadership') || `${randomTeam.name} has exceptional veteran leadership`,
            rookieIntegration: extractValue(aiResponse, 'rookie') || `New players fit seamlessly into the ${randomTeam.name} culture`,
            teamBonding: extractValue(aiResponse, 'bonding') || `${randomTeam.name} players are known for their strong friendships`,
            chemistryScore: extractValue(aiResponse, 'chemistry score') || `${Math.floor(Math.random() * 30) + 70}/100`,
            winningFactor: extractValue(aiResponse, 'winning factor') || `Team chemistry contributes ${Math.floor(Math.random() * 20) + 30}% to their success`
          }
          setAiTeamChemistry(chemistryAnalysis)
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Team Chemistry Error:', error)
      // Fallback to simulated analysis
      const chemistryAnalysis = {
        lockerRoomVibe: `${Math.floor(Math.random() * 40) + 60}% positive energy`,
        leadershipQuality: `${randomTeam.name} has exceptional veteran leadership`,
        rookieIntegration: `New players fit seamlessly into the ${randomTeam.name} culture`,
        teamBonding: `${randomTeam.name} players are known for their strong friendships`,
        chemistryScore: `${Math.floor(Math.random() * 30) + 70}/100`,
        winningFactor: `Team chemistry contributes ${Math.floor(Math.random() * 20) + 30}% to their success`
      }
      setAiTeamChemistry(chemistryAnalysis)
    } finally {
      setIsGeneratingAI(false)
    }
  }, [nbaTeams, extractValue])

  // AI Weather Impact Analysis
  const generateAIWeatherImpact = useCallback(async () => {
    setIsGeneratingAI(true)
    const randomTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)]
    
    try {
      const prompt = `Analyze how weather and environmental factors impact the ${randomTeam.name} NBA team.

Team Information:
- Name: ${randomTeam.name}
- City: ${randomTeam.city}
- Founded: ${randomTeam.founded}
- Championships: ${randomTeam.championships}
- Home Venue: ${randomTeam.homeVenue}
- Manager: ${randomTeam.manager}
- League: ${randomTeam.league}
- Division: ${randomTeam.division}

Please provide weather impact analysis including:
1. Home court advantage in different weather conditions
2. Wind effects on shooting and gameplay
3. Temperature and humidity impacts
4. Seasonal performance variations
5. Weather-based strategic adjustments
6. Travel and weather considerations

Format your response as a structured analysis with specific environmental factors.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'basketball', analysis: 'weather' },
            chatHistory: [],
            mode: 'analysis'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.message) {
          const aiResponse = result.data.message
          const weatherAnalysis = {
            homeAdvantage: extractValue(aiResponse, 'home advantage') || `${randomTeam.name} performs ${Math.floor(Math.random() * 20) + 10}% better at home`,
            windEffects: extractValue(aiResponse, 'wind') || `Wind conditions affect ${randomTeam.name}'s shooting accuracy`,
            temperatureImpact: extractValue(aiResponse, 'temperature') || `Temperature variations impact ${randomTeam.name}'s energy levels`,
            humidityEffects: extractValue(aiResponse, 'humidity') || `Humidity affects ${randomTeam.name}'s conditioning`,
            seasonalVariations: extractValue(aiResponse, 'seasonal') || `${randomTeam.name} shows seasonal performance patterns`,
            weatherStrategy: extractValue(aiResponse, 'strategy') || `${randomTeam.name} adjusts strategy based on weather conditions`
          }
          setAiWeatherImpact(weatherAnalysis)
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Weather Impact Error:', error)
      // Fallback to simulated analysis
      const weatherAnalysis = {
        homeAdvantage: `${randomTeam.name} performs ${Math.floor(Math.random() * 20) + 10}% better at home`,
        windEffects: `Wind conditions affect ${randomTeam.name}'s shooting accuracy`,
        temperatureImpact: `Temperature variations impact ${randomTeam.name}'s energy levels`,
        humidityEffects: `Humidity affects ${randomTeam.name}'s conditioning`,
        seasonalVariations: `${randomTeam.name} shows seasonal performance patterns`,
        weatherStrategy: `${randomTeam.name} adjusts strategy based on weather conditions`
      }
      setAiWeatherImpact(weatherAnalysis)
    } finally {
      setIsGeneratingAI(false)
    }
  }, [nbaTeams, extractValue])

  // AI Fan Perspective Analysis
  const generateAIFanPerspective = useCallback(async () => {
    setIsGeneratingAI(true)
    const randomTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)]
    
    try {
      const prompt = `Analyze the fan perspective and community culture of the ${randomTeam.name} NBA team.

Team Information:
- Name: ${randomTeam.name}
- City: ${randomTeam.city}
- Founded: ${randomTeam.founded}
- Championships: ${randomTeam.championships}
- Home Venue: ${randomTeam.homeVenue}
- Manager: ${randomTeam.manager}
- League: ${randomTeam.league}
- Division: ${randomTeam.division}

Please provide fan perspective analysis including:
1. Fan loyalty and dedication levels
2. Game day experience and atmosphere
3. Community involvement and culture
4. Traditions and rituals
5. Social media presence and engagement
6. Generational fan base characteristics

Format your response as a structured analysis with specific fan insights.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'basketball', analysis: 'fan' },
            chatHistory: [],
            mode: 'analysis'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.message) {
          const aiResponse = result.data.message
          const fanAnalysis = {
            fanLoyalty: extractValue(aiResponse, 'fan loyalty') || `${Math.floor(Math.random() * 30) + 70}% of fans show high loyalty`,
            gameDayExperience: extractValue(aiResponse, 'game day') || `${randomTeam.name} fans create an electric atmosphere`,
            communityCulture: extractValue(aiResponse, 'community') || `${randomTeam.name} has a strong community presence`,
            traditions: extractValue(aiResponse, 'traditions') || `${randomTeam.name} fans have unique traditions`,
            socialMedia: extractValue(aiResponse, 'social media') || `${randomTeam.name} has active social media engagement`,
            generationalFans: extractValue(aiResponse, 'generational') || `${randomTeam.name} has multi-generational fan support`
          }
          setAiFanPerspective(fanAnalysis)
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Fan Perspective Error:', error)
      // Fallback to simulated analysis
      const fanAnalysis = {
        fanLoyalty: `${Math.floor(Math.random() * 30) + 70}% of fans show high loyalty`,
        gameDayExperience: `${randomTeam.name} fans create an electric atmosphere`,
        communityCulture: `${randomTeam.name} has a strong community presence`,
        traditions: `${randomTeam.name} fans have unique traditions`,
        socialMedia: `${randomTeam.name} has active social media engagement`,
        generationalFans: `${randomTeam.name} has multi-generational fan support`
      }
      setAiFanPerspective(fanAnalysis)
    } finally {
      setIsGeneratingAI(false)
    }
  }, [nbaTeams, extractValue])

  const generateAIPredictionFromInput = useCallback(async (input: string) => {
    setIsGeneratingPrediction(true)
    
    try {
      const prompt = `Analyze this basketball scenario and predict which NBA teams would perform well:

User Scenario: "${input}"

Please provide a basketball analysis and suggest teams that would be strong picks based on this scenario. Consider:
- Team strengths and weaknesses
- Current form and momentum
- Historical performance in similar situations
- Player matchups and chemistry
- Strategic advantages

Provide a detailed analysis with specific team recommendations and reasoning.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'basketball', scenario: input },
            chatHistory: [],
            mode: 'analysis'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.message) {
          setAiPredictionResponse(result.data.message)
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Prediction Error:', error)
      // Fallback to simulated responses
      const responses = [
        "Based on your description, the AI predicts teams with strong offensive capabilities will perform well. Consider Lakers, Warriors, or Celtics.",
        "Your scenario suggests looking at defensive powerhouses. The AI recommends Heat, Spurs, or Nuggets for their strategic gameplay.",
        "Given the context, teams with championship experience like Warriors, Lakers, or Celtics have higher probability of success.",
        "The AI analysis indicates that young, emerging teams like Timberwolves, Magic, or Thunder could be exciting choices."
      ]
      setAiPredictionResponse(responses[Math.floor(Math.random() * responses.length)])
    } finally {
      setIsGeneratingPrediction(false)
    }
  }, [setIsGeneratingPrediction, setAiPredictionResponse])

  const generateMoodBasedRecommendations = useCallback(async (mood: string) => {
    setAiMood(mood)
    setIsGeneratingAI(true)
    
    try {
      const allTeams = getNBATeamsByConference(data.selectedConference || "all")
      const moodDescriptions = {
        "lucky": "teams with the most championships and success (5+ NBA titles)",
        "underdog": "teams with fewer championships (less than 2) that are often overlooked",
        "classic": "teams founded before 1980 with rich historical traditions",
        "modern": "teams founded after 1980 representing the modern era of basketball"
      }
      
      const prompt = `Suggest 6 NBA teams for a "${mood}" mood picker wheel.

Available Teams: ${allTeams.map(team => `${team.name} (${team.city}, Founded: ${team.founded}, Championships: ${team.championships})`).join(', ')}

Mood Criteria: ${moodDescriptions[mood as keyof typeof moodDescriptions]}

Please suggest exactly 6 teams that match this mood and would create an interesting wheel. Consider:
- Team history and achievements
- Fan base and cultural significance
- Current relevance and appeal
- Balance between different eras and regions

Return only the team names in a simple numbered list format:
1. Team Name
2. Team Name
3. Team Name
...`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'basketball', mood: mood },
            chatHistory: [],
            mode: 'generator'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.message) {
          const aiResponse = result.data.message
          const suggestedTeamNames = extractTeamNames(aiResponse)
          
          // Find the actual team objects
          const recommendations = allTeams.filter(team => 
            suggestedTeamNames.some(name => 
              team.name.toLowerCase().includes(name.toLowerCase()) ||
              name.toLowerCase().includes(team.name.toLowerCase())
            )
          ).slice(0, 6)
          
          // If AI didn't suggest enough teams, fill with mood-appropriate ones
          if (recommendations.length < 6) {
            let fallbackTeams: NBATeam[] = []
            switch(mood) {
              case "lucky":
                fallbackTeams = allTeams.filter(team => team.championships > 5).slice(0, 6)
                break
              case "underdog":
                fallbackTeams = allTeams.filter(team => team.championships < 2).slice(0, 6)
                break
              case "classic":
                fallbackTeams = allTeams.filter(team => team.founded < 1980).slice(0, 6)
                break
              case "modern":
                fallbackTeams = allTeams.filter(team => team.founded > 1980).slice(0, 6)
                break
              default:
                fallbackTeams = allTeams.slice(0, 6)
            }
            
            const remainingTeams = fallbackTeams.filter(team => !recommendations.includes(team))
            recommendations.push(...remainingTeams.slice(0, 6 - recommendations.length))
          }
          
          setAiSuggestions(recommendations)
          const updatedData = { ...data, selectedTeams: recommendations }
          updateWheelData("nba-wheel", wheel?.id || "", updatedData)
          
          toast({
            title: "AI Recommendations Generated!",
            description: `Generated ${mood} mood recommendations! Teams added to wheel.`,
            duration: 3000,
          })
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Mood Recommendations Error:', error)
      // Fallback to simulated recommendations
    const allTeams = getNBATeamsByConference(data.selectedConference || "all")
    let recommendations: NBATeam[] = []
    
      switch(mood) {
      case "lucky":
        recommendations = allTeams.filter(team => team.championships > 5).slice(0, 6)
        break
      case "underdog":
          recommendations = allTeams.filter(team => team.championships < 2).slice(0, 6)
        break
      case "classic":
        recommendations = allTeams.filter(team => team.founded < 1980).slice(0, 6)
        break
      case "modern":
          recommendations = allTeams.filter(team => team.founded > 1980).slice(0, 6)
        break
      default:
        recommendations = allTeams.slice(0, 6)
    }
    
    setAiSuggestions(recommendations)
    const updatedData = { ...data, selectedTeams: recommendations }
    updateWheelData("nba-wheel", wheel?.id || "", updatedData)
      
      toast({
        title: "AI Recommendations Generated!",
        description: `Generated ${mood} mood recommendations! Teams added to wheel.`,
        duration: 3000,
      })
    } finally {
      setIsGeneratingAI(false)
    }
  }, [data.selectedConference, updateWheelData, wheel?.id, setAiSuggestions, extractTeamNames, toast])

  const generateAIGameMode = useCallback(async (mode: string) => {
    setAiGameMode(mode)
    setIsGeneratingAI(true)
    
    try {
      const allTeams = getNBATeamsByConference(data.selectedConference || "all")
      const gameModeDescriptions = {
        "challenger": "4 elite teams that would create intense competition and rivalries",
        "elimination": "8 teams with strong championship histories for elimination-style gameplay",
        "trivia": "6 diverse teams representing different eras and regions for trivia challenges",
        "fantasy": "10 modern teams with strong fantasy basketball potential and current relevance"
      }
      
      const prompt = `Suggest NBA teams for a "${mode}" game mode picker wheel.

Available Teams: ${allTeams.map(team => `${team.name} (${team.city}, Founded: ${team.founded}, Championships: ${team.championships})`).join(', ')}

Game Mode Criteria: ${gameModeDescriptions[mode as keyof typeof gameModeDescriptions]}

Please suggest teams that would create the best experience for this game mode. Consider:
- Team competitiveness and rivalry potential
- Historical significance and fan engagement
- Current relevance and fantasy value
- Balance and variety for gameplay

Return only the team names in a simple numbered list format:
1. Team Name
2. Team Name
3. Team Name
...`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'basketball', gameMode: mode },
            chatHistory: [],
            mode: 'generator'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.message) {
          const aiResponse = result.data.message
          const suggestedTeamNames = extractTeamNames(aiResponse)
          
          // Find the actual team objects
          let selectedTeams = allTeams.filter(team => 
            suggestedTeamNames.some(name => 
              team.name.toLowerCase().includes(name.toLowerCase()) ||
              name.toLowerCase().includes(team.name.toLowerCase())
            )
          )
          
          // Set appropriate team count based on game mode
          const teamCounts = {
            "challenger": 4,
            "elimination": 8,
            "trivia": 6,
            "fantasy": 10
          }
          const targetCount = teamCounts[mode as keyof typeof teamCounts] || 8
          selectedTeams = selectedTeams.slice(0, targetCount)
          
          // If AI didn't suggest enough teams, fill with mode-appropriate ones
          if (selectedTeams.length < targetCount) {
            let fallbackTeams: NBATeam[] = []
            switch(mode) {
              case "challenger":
                fallbackTeams = allTeams.slice(0, 4)
                break
              case "elimination":
                fallbackTeams = allTeams.filter(team => team.championships > 2).slice(0, 8)
                break
              case "trivia":
                fallbackTeams = allTeams.slice(0, 6)
                break
              case "fantasy":
                fallbackTeams = allTeams.filter(team => team.founded > 1980).slice(0, 10)
                break
              default:
                fallbackTeams = allTeams.slice(0, 8)
            }
            
            const remainingTeams = fallbackTeams.filter(team => !selectedTeams.includes(team))
            selectedTeams.push(...remainingTeams.slice(0, targetCount - selectedTeams.length))
          }
          
          setAiSuggestions(selectedTeams)
          const updatedData = { ...data, selectedTeams: selectedTeams }
          updateWheelData("nba-wheel", wheel?.id || "", updatedData)
          
          toast({
            title: "AI Game Mode Generated!",
            description: `Generated ${mode} game mode teams! Ready to play!`,
            duration: 3000,
          })
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Game Mode Error:', error)
      // Fallback to simulated game mode
      const allTeams = getNBATeamsByConference(data.selectedConference || "all")
      let selectedTeams: NBATeam[] = []
      
      switch(mode) {
        case "challenger":
          selectedTeams = allTeams.slice(0, 4)
          break
        case "elimination":
          selectedTeams = allTeams.filter(team => team.championships > 2).slice(0, 8)
          break
        case "trivia":
          selectedTeams = allTeams.slice(0, 6)
          break
        case "fantasy":
          selectedTeams = allTeams.filter(team => team.founded > 1980).slice(0, 10)
          break
        default:
          selectedTeams = allTeams.slice(0, 8)
      }
      
      setAiSuggestions(selectedTeams)
      const updatedData = { ...data, selectedTeams: selectedTeams }
      updateWheelData("nba-wheel", wheel?.id || "", updatedData)
      
      toast({
        title: "AI Game Mode Generated!",
        description: `Generated ${mode} game mode teams! Ready to play!`,
        duration: 3000,
      })
    } finally {
      setIsGeneratingAI(false)
    }
  }, [data.selectedConference, updateWheelData, wheel?.id, setAiSuggestions, extractTeamNames, toast])

  if (!mounted) return null

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-800 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Inputs
          </CardTitle>
          <div className="flex space-x-2">
            {/* View Mode Buttons */}
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant={data.viewMode === "wheel" ? "default" : "outline"}
                onClick={() => handleViewModeChange("wheel")}
                className={data.viewMode === "wheel" ? "bg-blue-600 text-white shadow-md" : "bg-white hover:bg-blue-50 border-blue-200"}
                title="Wheel"
              >
                <Gamepad2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={data.viewMode === "list" ? "default" : "outline"}
                onClick={() => handleViewModeChange("list")}
                className={data.viewMode === "list" ? "bg-green-600 text-white shadow-md" : "bg-white hover:bg-green-50 border-green-200"}
                title="List"
              >
                <Users className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={data.viewMode === "text" ? "default" : "outline"}
                onClick={() => handleViewModeChange("text")}
                className={data.viewMode === "text" ? "bg-purple-600 text-white shadow-md" : "bg-white hover:bg-purple-50 border-purple-200"}
                title="Text"
              >
                <BookOpen className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-1">
              <Button size="sm" onClick={selectAll} title="Select All" className="bg-orange-600 text-white hover:bg-orange-700 shadow-md">
                <CheckSquare className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={sortTeamsAlphabetically} title="Sort A→Z" className="bg-white hover:bg-yellow-50 border-yellow-200">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={shuffleTeams} title="Shuffle" className="bg-white hover:bg-pink-50 border-pink-200">
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Tab Buttons (Manual / AI) to mirror MLB */}
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === 'manual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTabChange('manual')}
            className={`px-6 py-2 rounded-lg transition-all duration-200 font-semibold ${
              activeTab === 'manual' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-105' 
                : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-600 hover:text-blue-700 border-blue-200 hover:border-blue-300'
            }`}
          >
            <span className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${activeTab === 'manual' ? 'bg-white' : 'bg-blue-500'}`}></span>
            Manual
            </span>
          </Button>
          <Button
            variant={activeTab === 'ai' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTabChange('ai')}
            className={`px-6 py-2 rounded-lg transition-all duration-200 font-semibold ${
              activeTab === 'ai' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 transform scale-105' 
                : 'bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-gray-600 hover:text-purple-700 border-purple-200 hover:border-purple-300'
            }`}
          >
            <span className="flex items-center">
            <Brain className={`w-4 h-4 mr-2 ${activeTab === 'ai' ? 'text-white' : 'text-purple-600'}`} />
            AI-Powered
            </span>
          </Button>
        </div>

        {/* Manual Tab Content */}
        {activeTab === 'manual' && (
          <div className="space-y-4">

            {/* Selected Count */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <span className="font-medium text-gray-700">
                  {data.selectedTeams.length} selected of {nbaTeams.length}
                </span>
              <Button
                variant="outline"
                  size="sm"
                onClick={() => setShowTeamList(!showTeamList)}
                  className="flex items-center space-x-2"
              >
                  <span className="text-sm">{showTeamList ? "Hide" : "Show"} Teams</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showTeamList ? "rotate-180" : ""}`} />
              </Button>
              </div>
            </div>

            {/* Conference Selection */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
              <label className="block text-sm font-semibold text-green-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Conference
              </label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={data.selectedConference === 'all' ? "default" : "outline"}
                  className={`h-20 flex flex-col items-center justify-center space-y-2 transition-all duration-200 transform hover:scale-105 ${
                    data.selectedConference === 'all' 
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25" 
                      : "bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border-blue-200 hover:border-blue-300"
                  }`}
                  onClick={() => handleConferenceChange('all')}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    data.selectedConference === 'all' 
                      ? "bg-white/20 backdrop-blur-sm" 
                      : "bg-gradient-to-br from-blue-500 to-indigo-500"
                  }`}>
                    <span className="text-white text-lg">🏀</span>
                  </div>
                  <span className={`text-xs font-semibold ${data.selectedConference === 'all' ? "text-white" : "text-blue-700"}`}>
                    All Teams
                  </span>
                </Button>
                <Button
                  variant={data.selectedConference === 'Eastern' ? "default" : "outline"}
                  className={`h-20 flex flex-col items-center justify-center space-y-2 transition-all duration-200 transform hover:scale-105 ${
                    data.selectedConference === 'Eastern' 
                      ? "bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25" 
                      : "bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 border-green-200 hover:border-green-300"
                  }`}
                  onClick={() => handleConferenceChange('Eastern')}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    data.selectedConference === 'Eastern' 
                      ? "bg-white/20 backdrop-blur-sm" 
                      : "bg-gradient-to-br from-green-500 to-emerald-500"
                  }`}>
                    <span className="text-white text-lg">🏀</span>
                  </div>
                  <span className={`text-xs font-semibold ${data.selectedConference === 'Eastern' ? "text-white" : "text-green-700"}`}>
                    Eastern
                  </span>
                </Button>
                <Button
                  variant={data.selectedConference === 'Western' ? "default" : "outline"}
                  className={`h-20 flex flex-col items-center justify-center space-y-2 transition-all duration-200 transform hover:scale-105 ${
                    data.selectedConference === 'Western' 
                      ? "bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/25" 
                      : "bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 border-orange-200 hover:border-orange-300"
                  }`}
                  onClick={() => handleConferenceChange('Western')}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    data.selectedConference === 'Western' 
                      ? "bg-white/20 backdrop-blur-sm" 
                      : "bg-gradient-to-br from-orange-500 to-red-500"
                  }`}>
                    <span className="text-white text-lg">🏀</span>
                  </div>
                  <span className={`text-xs font-semibold ${data.selectedConference === 'Western' ? "text-white" : "text-orange-700"}`}>
                    Western
                  </span>
                </Button>
              </div>
            </div>

            {/* Display Mode */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 mb-6">
              <label className="block text-sm font-semibold text-purple-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Display Options
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className={`flex flex-col items-center space-y-2 p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                  data.displayMode === "both" 
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25" 
                    : "bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border border-purple-200 hover:border-purple-300"
                }`}>
                  <input
                    type="radio"
                    name="displayMode"
                    value="both"
                    checked={data.displayMode === "both"}
                    onChange={(e) => handleDisplayModeChange(e.target.value as "logo" | "name" | "both")}
                    className="sr-only"
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    data.displayMode === "both" ? "bg-white/20" : "bg-purple-100"
                  }`}>
                    <span className="text-lg">🎨</span>
                  </div>
                  <span className={`text-xs font-semibold ${data.displayMode === "both" ? "text-white" : "text-purple-700"}`}>
                    Logo & Name
                  </span>
                </label>
                
                <label className={`flex flex-col items-center space-y-2 p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                  data.displayMode === "logo" 
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25" 
                    : "bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border border-purple-200 hover:border-purple-300"
                }`}>
                  <input
                    type="radio"
                    name="displayMode"
                    value="logo"
                    checked={data.displayMode === "logo"}
                    onChange={(e) => handleDisplayModeChange(e.target.value as "logo" | "name" | "both")}
                    className="sr-only"
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    data.displayMode === "logo" ? "bg-white/20" : "bg-purple-100"
                  }`}>
                    <span className="text-lg">🎯</span>
                  </div>
                  <span className={`text-xs font-semibold ${data.displayMode === "logo" ? "text-white" : "text-purple-700"}`}>
                    Logo Only
                  </span>
                </label>
                
                <label className={`flex flex-col items-center space-y-2 p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                  data.displayMode === "name" 
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25" 
                    : "bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border border-purple-200 hover:border-purple-300"
                }`}>
                  <input
                    type="radio"
                    name="displayMode"
                    value="name"
                    checked={data.displayMode === "name"}
                    onChange={(e) => handleDisplayModeChange(e.target.value as "logo" | "name" | "both")}
                    className="sr-only"
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    data.displayMode === "name" ? "bg-white/20" : "bg-purple-100"
                  }`}>
                    <span className="text-lg">📝</span>
                  </div>
                  <span className={`text-xs font-semibold ${data.displayMode === "name" ? "text-white" : "text-purple-700"}`}>
                    Name Only
                  </span>
                </label>
              </div>
            </div>

            {/* Manual Team Input */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
              <label className="block text-sm font-semibold text-red-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Add Custom Team
              </label>
              <div className="flex space-x-3">
                <Input
                  type="text"
                  placeholder="Enter custom team name..."
                  value={manualTeamName}
                  onChange={(e) => setManualTeamName(e.target.value)}
                  className="flex-1 border-red-200 focus:border-red-400 focus:ring-red-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddManualTeam()}
                />
                <Button
                  onClick={handleAddManualTeam}
                  disabled={!manualTeamName.trim()}
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Custom Teams Display */}
            {customTeams.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                <label className="block text-sm font-semibold text-red-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Custom Teams ({customTeams.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {customTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          checked={data.selectedTeams.some(t => t.id === team.id)}
                          onCheckedChange={() => toggleTeam(team)}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <span className="text-2xl">🏀</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{team.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                              {team.league}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {team.division}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomTeam(team.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team List (when expanded) */}
            {showTeamList && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 mt-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Select Teams
                  </h3>
                  <p className="text-sm text-orange-700">Click the checkboxes to select teams for your wheel</p>
                </div>


                <div className="p-4 max-h-[500px] overflow-y-auto border border-orange-300 rounded-lg bg-white shadow-inner">
                  <div className="space-y-4">
                    {/* Group teams by division */}
                    {(() => {
                      // Use selected teams (like MLB tool) to show teams that are actually selected
                      const selectedTeams = data.selectedTeams || []
                      
                      // Group selected teams by division
                      const teamsByDivision = selectedTeams.reduce((acc, team) => {
                        const division = team.division === "Atlantic" && team.id.startsWith("manual-") ? "CUSTOM" : team.division;
                        if (!acc[division]) {
                          acc[division] = [];
                        }
                        acc[division].push(team);
                        return acc;
                      }, {} as Record<string, NBATeam[]>);

                      return Object.entries(teamsByDivision).map(([division, teams]) => (
                        <div key={division} className="space-y-2">
                          {/* Division Header */}
                          <div className="flex items-center space-x-2 py-3 border-b border-orange-200 bg-gradient-to-r from-orange-100 to-amber-100 rounded-t-lg">
                            <h4 className="font-semibold text-orange-800 text-sm uppercase tracking-wide flex items-center">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                              {division === "CUSTOM" ? "CUSTOM DIVISION" : `${division} Division`}
                            </h4>
                            <span className="text-xs text-orange-700 bg-orange-200 px-3 py-1 rounded-full font-semibold">
                              {(teams as NBATeam[]).length} team{(teams as NBATeam[]).length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          {/* Teams in this division */}
                          <div className="space-y-2 pl-2">
                            {(teams as NBATeam[]).map((team) => (
                              <div
                                key={team.id}
                                className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 rounded-lg border border-orange-200 transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
                              >
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    checked={(data.selectedTeams || []).some((t: any) => t.id === team.id)}
                                    onCheckedChange={() => toggleTeam(team)}
                                    className="text-orange-600 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                                  />
                                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-xl">{team.logo}</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-orange-900">{team.name}</p>
                                    <p className="text-sm text-orange-600">{team.city}</p>
                                  </div>
                                </div>
                                <div className="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded-full font-medium">
                                  {team.division}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* No teams selected warning */}
            {data.selectedTeams.length === 0 && showTeamList && (
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">⚠️</span>
            </div>
                  <span className="text-sm font-semibold text-yellow-800">
                    No teams selected. Please select at least one team to create your wheel.
                  </span>
                </div>
              </div>
            )}

            {/* View Mode Display */}
            {data.viewMode === "list" && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h4 className="font-bold text-green-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  List View
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {data.selectedTeams.map((team) => (
                    <div key={team.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 transform hover:scale-105">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-lg">{team.logo}</span>
                      </div>
                      <span className="text-sm font-semibold text-green-800 truncate">{team.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.viewMode === "text" && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Text Mode
                </h4>
                <div className="max-h-64 overflow-y-auto">
                  <div className="text-sm leading-relaxed bg-white p-4 rounded-lg border border-purple-200">
                    {data.selectedTeams.map((team, index) => (
                      <span key={team.id} className="inline-block bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-2 py-1 rounded-md mr-2 mb-2">
                        {team.name}
                        {index < data.selectedTeams.length - 1 ? "" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {data.selectedTeams.length === 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-8 border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏀</span>
                </div>
                <h3 className="font-bold text-gray-700 mb-2">No teams selected</h3>
                <p className="text-gray-600 mb-4">Choose a conference and select teams to get started!</p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Tab Content */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            {/* AI Commentary Banner */}
            {aiCommentary && (
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-5 h-5 text-purple-600" />
                    <p className="text-purple-800 font-medium italic">"{aiCommentary}"</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Prediction from User Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gem className="w-5 h-5 text-emerald-600" />
                  <span>AI Prediction from Basketball Context</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your basketball situation or context:
                  </label>
                  <Textarea
                    placeholder="e.g., 'Lakers vs Warriors, Lakers on a winning streak, home court advantage, LeBron playing well...'"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Let AI analyze your basketball context and predict winning teams
                  </span>
                  <Button
                    onClick={() => generateAIPredictionFromInput(userInput)}
                    disabled={!userInput.trim() || isGeneratingPrediction}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                  >
                    {isGeneratingPrediction ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4" />
                        <span>Get AI Prediction</span>
                      </div>
                    )}
                  </Button>
                </div>

                {aiPredictionResponse && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gem className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-800">AI Prediction:</span>
                    </div>
                    <p className="text-emerald-700 text-sm leading-relaxed">{aiPredictionResponse}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conference Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Conference:</label>
              <Select value={data.selectedConference} onValueChange={handleConferenceChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conferences</SelectItem>
                  <SelectItem value="Eastern">Eastern Conference</SelectItem>
                  <SelectItem value="Western">Western Conference</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Smart Team Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>Smart Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => generateMoodBasedRecommendations("lucky")}
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span className="text-xs">Championship Teams</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateMoodBasedRecommendations("underdog")}
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">Underdog Mode</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateMoodBasedRecommendations("classic")}
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <span className="text-xs">Classic Teams</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateMoodBasedRecommendations("modern")}
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="text-xs">Modern Era</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Game Modes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gamepad2 className="w-5 h-5 text-green-600" />
                  <span>AI Game Modes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => generateAIGameMode("challenger")}
                    disabled={isGeneratingAI}
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <TargetIcon className="w-5 h-5 text-red-600" />
                    <span className="text-xs">AI Challenger</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateAIGameMode("elimination")}
                    disabled={isGeneratingAI}
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                    <span className="text-xs">Smart Elimination</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateAIGameMode("trivia")}
                    disabled={isGeneratingAI}
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">Trivia Mode</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateAIGameMode("fantasy")}
                    disabled={isGeneratingAI}
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-xs">Fantasy Impact</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>AI Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Generate AI-powered team suggestions</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateAISuggestions}
                    disabled={isGeneratingSuggestions}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-300 hover:bg-purple-700"
                  >
                    {isGeneratingSuggestions ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Generate</span>
                      </div>
                    )}
                  </Button>
                </div>

                {aiSuggestions.length > 0 && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">AI Suggested Teams:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {aiSuggestions.map((team) => (
                        <div key={team.id} className="flex items-center space-x-2 p-2 bg-white rounded border">
                          <span className="text-lg">{team.logo}</span>
                          <span className="text-sm font-medium">{team.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Insights Display */}
            {aiInsights && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span>AI Team Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">Performance</span>
                    </div>
                    <p className="text-sm text-blue-700">{aiInsights.performancePrediction}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-800">Fun Fact</span>
                    </div>
                    <p className="text-sm text-green-700">{aiInsights.funFact}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">Strategic Advantage</span>
                    </div>
                    <p className="text-sm text-yellow-700">{aiInsights.strategicAdvantage}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Trivia Display */}
            {aiTrivia && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>Basketball Trivia</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-indigo-800">
                        {aiTrivia.currentQuestion.difficulty} Question
                      </span>
                      <Badge variant="outline" className="text-indigo-700">
                        Basketball IQ
                      </Badge>
                    </div>
                    <p className="text-sm text-indigo-700 mb-3">{aiTrivia.currentQuestion.question}</p>
                    <details className="text-xs text-indigo-600">
                      <summary className="cursor-pointer font-medium">Show Answer</summary>
                      <p className="mt-2 p-2 bg-indigo-100 rounded">{aiTrivia.currentQuestion.answer}</p>
                    </details>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Predictions Display */}
            {aiPrediction && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-red-600" />
                    <span>Season Predictions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-800">Season Outlook</span>
                    </div>
                    <p className="text-sm text-red-700">{aiPrediction.seasonPrediction}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-orange-800">Playoff Chances</span>
                    </div>
                    <p className="text-sm text-orange-700">{aiPrediction.playoffChance}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Entertainment Display */}
            {aiEntertainment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gamepad2 className="w-5 h-5 text-pink-600" />
                    <span>Fan Entertainment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-pink-600" />
                      <span className="font-semibold text-pink-800">Team Roast</span>
                    </div>
                    <p className="text-sm text-pink-700">{aiEntertainment.teamRoast}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-purple-800">Victory Dance</span>
                    </div>
                    <p className="text-sm text-purple-700">{aiEntertainment.victoryDance}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Learning Display */}
            {aiLearning && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-teal-600" />
                    <span>Basketball Knowledge</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-teal-800">Basketball IQ</span>
                    </div>
                    <p className="text-sm text-teal-700">{aiLearning.basketballIQ}</p>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-cyan-600" />
                      <span className="font-semibold text-cyan-800">Strategy Insights</span>
                    </div>
                    <p className="text-sm text-cyan-700">{aiLearning.strategyInsights}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Social Display */}
            {aiSocial && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-rose-600" />
                    <span>Community & Social</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-rose-600" />
                      <span className="font-semibold text-rose-800">Fan Matchmaker</span>
                    </div>
                    <p className="text-sm text-rose-700">{aiSocial.aiMatchmaker}</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gamepad2 className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-amber-800">Challenge</span>
                    </div>
                    <p className="text-sm text-amber-700">{aiSocial.groupChallenge}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-800">Trending</span>
                    </div>
                    <p className="text-sm text-emerald-700">{aiSocial.trending}</p>
                  </div>
                </CardContent>
              </Card>
            )}

                         {/* AI Advanced Analysis Hub */}
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center space-x-2">
                   <BarChart3 className="w-5 h-5 text-indigo-600" />
                   <span>AI Advanced Analysis Hub</span>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-2 gap-3">
                   <Button
                     variant="outline"
                     onClick={generateAIFantasyDraft}
                     disabled={isGeneratingAI}
                     className="h-16 flex flex-col items-center justify-center space-y-1"
                   >
                     <TrendingUp className="w-5 h-5 text-green-600" />
                     <span className="text-xs">Fantasy Draft</span>
                   </Button>
                   <Button
                     variant="outline"
                     onClick={generateAIHistoricalAnalysis}
                     disabled={isGeneratingAI}
                     className="h-16 flex flex-col items-center justify-center space-y-1"
                   >
                     <BookOpen className="w-5 h-5 text-amber-600" />
                     <span className="text-xs">History</span>
                   </Button>
                   <Button
                     variant="outline"
                     onClick={generateAITeamChemistry}
                     disabled={isGeneratingAI}
                     className="h-16 flex flex-col items-center justify-center space-y-1"
                   >
                     <Users className="w-5 h-5 text-blue-600" />
                     <span className="text-xs">Chemistry</span>
                   </Button>
                   <Button
                     variant="outline"
                     onClick={generateAIWeatherImpact}
                     disabled={isGeneratingAI}
                     className="h-16 flex flex-col items-center justify-center space-y-1"
                   >
                     <Cloud className="w-5 h-5 text-gray-600" />
                     <span className="text-xs">Weather</span>
                   </Button>
                   <Button
                     variant="outline"
                     onClick={generateAIFanPerspective}
                     disabled={isGeneratingAI}
                     className="h-16 flex flex-col items-center justify-center space-y-1 col-span-2"
                   >
                     <Heart className="w-5 h-5 text-red-600" />
                     <span className="text-xs">Fan Perspective</span>
                   </Button>
                 </div>
               </CardContent>
             </Card>

             {/* AI Creative Hub */}
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center space-x-2">
                   <Sparkles className="w-5 h-5 text-purple-600" />
                   <span>AI Creative Hub</span>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-2 gap-3">
                   <Button
                     variant="outline"
                     onClick={() => generateAICreativeContent("story")}
                     disabled={isGeneratingAI}
                     className="h-16 flex flex-col items-center justify-center space-y-1"
                   >
                     <BookOpen className="w-5 h-5 text-blue-600" />
                     <span className="text-xs">Story Mode</span>
                   </Button>
                   <Button
                     variant="outline"
                     onClick={() => generateAICreativeContent("poem")}
                     disabled={isGeneratingAI}
                     className="h-16 flex flex-col items-center justify-center space-y-1"
                   >
                     <Mic className="w-5 h-5 text-green-600" />
                     <span className="text-xs">Poetry</span>
                   </Button>
                   <Button
                     variant="outline"
                     onClick={() => generateAICreativeContent("rap")}
                     disabled={isGeneratingAI}
                     className="h-16 flex flex-col items-center justify-center space-y-1"
                   >
                     <Music className="w-5 h-5 text-purple-600" />
                     <span className="text-xs">Rap Battle</span>
                   </Button>
                   <Button
                     variant="outline"
                     onClick={() => generateAICreativeContent("comedy")}
                     disabled={isGeneratingAI}
                     className="h-16 flex flex-col items-center justify-center space-y-1"
                   >
                     <Zap className="w-5 h-5 text-yellow-600" />
                     <span className="text-xs">Comedy</span>
                   </Button>
                 </div>
               </CardContent>
             </Card>

             {/* AI Creative Content Display */}
             {aiCreativeContent && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <Sparkles className="w-5 h-5 text-purple-600" />
                     <span>AI {aiCreativeContent.type}</span>
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                     <div className="prose prose-sm max-w-none">
                       <div dangerouslySetInnerHTML={{ __html: aiCreativeContent.content.replace(/\n/g, '<br/>') }} />
                     </div>
                     
                     {aiCreativeContent.suggestedTeams && aiCreativeContent.suggestedTeams.length > 0 && (
                       <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                         <h4 className="font-semibold text-purple-800 mb-2">Suggested Teams for Next Spin:</h4>
                         <div className="flex flex-wrap gap-2">
                           {aiCreativeContent.suggestedTeams.map((teamName, index) => (
                             <Button
                               key={index}
                               variant="outline"
                               size="sm"
                               className="text-xs bg-purple-100 hover:bg-purple-200 border-purple-300"
                               onClick={() => {
                                 // Find the team and add it to suggestions
                                 const team = nbaTeams.find(t => t.name.toLowerCase().includes(teamName.toLowerCase()))
                                 if (team) {
                                   setAiSuggestions([team])
                                   toast({
                                     title: "Team Added!",
                                     description: `Added ${team.name} to AI suggestions!`,
                                     duration: 2000,
                                   })
                                 }
                               }}
                             >
                               {teamName}
                             </Button>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 </CardContent>
               </Card>
             )}

             {/* AI Advanced Analysis Displays */}
             {aiFantasyDraft && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <TrendingUp className="w-5 h-5 text-green-600" />
                     <span>Fantasy Basketball Analysis</span>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Target className="w-4 h-4 text-green-600" />
                       <span className="font-semibold text-green-800">Team Value</span>
                     </div>
                     <p className="text-sm text-green-700">{aiFantasyDraft.teamValue}</p>
                   </div>
                   <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Trophy className="w-4 h-4 text-blue-600" />
                       <span className="font-semibold text-blue-800">Draft Position</span>
                     </div>
                     <p className="text-sm text-blue-700">{aiFantasyDraft.draftPosition}</p>
                   </div>
                   <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Star className="w-4 h-4 text-yellow-600" />
                       <span className="font-semibold text-yellow-800">Sleeper Pick</span>
                     </div>
                     <p className="text-sm text-yellow-700">{aiFantasyDraft.sleeperPick}</p>
                   </div>
                 </CardContent>
               </Card>
             )}

             {aiHistoricalAnalysis && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <BookOpen className="w-5 h-5 text-amber-600" />
                     <span>Historical Analysis</span>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Clock className="w-4 h-4 text-amber-600" />
                       <span className="font-semibold text-amber-800">Era</span>
                     </div>
                     <p className="text-sm text-amber-700">{aiHistoricalAnalysis.era}</p>
                   </div>
                   <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Trophy className="w-4 h-4 text-orange-600" />
                       <span className="font-semibold text-orange-800">Defining Moment</span>
                     </div>
                     <p className="text-sm text-orange-700">{aiHistoricalAnalysis.definingMoment}</p>
                   </div>
                 </CardContent>
               </Card>
             )}

             {aiTeamChemistry && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <Users className="w-5 h-5 text-blue-600" />
                     <span>Team Chemistry Analysis</span>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Heart className="w-4 h-4 text-blue-600" />
                       <span className="font-semibold text-blue-800">Locker Room Vibe</span>
                     </div>
                     <p className="text-sm text-blue-700">{aiTeamChemistry.lockerRoomVibe}</p>
                   </div>
                   <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Target className="w-4 h-4 text-indigo-600" />
                       <span className="font-semibold text-indigo-800">Chemistry Score</span>
                     </div>
                     <p className="text-sm text-indigo-700">{aiTeamChemistry.chemistryScore}</p>
                   </div>
                 </CardContent>
               </Card>
             )}

             {aiWeatherImpact && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <Cloud className="w-5 h-5 text-gray-600" />
                     <span>Weather Impact Analysis</span>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Home className="w-4 h-4 text-gray-600" />
                       <span className="font-semibold text-gray-800">Home Advantage</span>
                     </div>
                     <p className="text-sm text-gray-700">{aiWeatherImpact.homeAdvantage}</p>
                   </div>
                   <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Wind className="w-4 h-4 text-cyan-600" />
                       <span className="font-semibold text-cyan-800">Wind Effects</span>
                     </div>
                     <p className="text-sm text-cyan-700">{aiWeatherImpact.windEffects}</p>
                   </div>
                 </CardContent>
               </Card>
             )}

             {aiFanPerspective && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center space-x-2">
                     <Heart className="w-5 h-5 text-red-600" />
                     <span>Fan Perspective Analysis</span>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3">
                   <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Heart className="w-4 h-4 text-red-600" />
                       <span className="font-semibold text-red-800">Fan Loyalty</span>
                     </div>
                     <p className="text-sm text-red-700">{aiFanPerspective.fanLoyalty}</p>
                   </div>
                   <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                     <div className="flex items-center space-x-2 mb-2">
                       <Users className="w-4 h-4 text-pink-600" />
                       <span className="font-semibold text-pink-800">Game Day Experience</span>
                     </div>
                     <p className="text-sm text-pink-700">{aiFanPerspective.gameDayExperience}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generate All AI Features Button */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Button
                    onClick={() => {
                      const randomTeam = nbaTeams[Math.floor(Math.random() * nbaTeams.length)]
                      generateAllAIFeatures(randomTeam)
                    }}
                    disabled={isGeneratingAI}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 w-full h-12"
                  >
                    {isGeneratingAI ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating AI Magic...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Generate All AI Features</span>
                      </div>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Experience the full AI-powered NBA experience!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

export default NBAInputPanel


