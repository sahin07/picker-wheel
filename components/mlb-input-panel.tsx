"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Heart, GitCompare, Eye, List, Type, Shuffle, RotateCcw, Brain, BarChart3, Plus, X, ChevronDown, Sparkles, Target, TrendingUp, Users, Zap, Star, Trophy, Lightbulb, Gamepad2, Mic, Music, BookOpen, Globe, Cloud, Sun, Moon, Coffee, Pizza, Crown, Gem, Heart as HeartIcon, Zap as ZapIcon, Target as TargetIcon, Users as UsersIcon, Star as StarIcon, Trophy as TrophyIcon } from "lucide-react"
import { useWheelManagerStore, MLBWheelData } from "@/stores/wheel-manager-store"
import { mlbTeams, getMLBTeamsByLeague, type MLBTeam, type ActionMode } from "@/data/mlb-teams"
import { useToast } from "@/contexts/toast-context"
import MLBTeamDetailsModal from "./mlb-team-details-modal"
import MLBFavoritesModal from "./mlb-favorites-modal"
import MLBComparisonModal from "./mlb-comparison-modal"

interface MLBInputPanelProps {
  activeTab?: 'manual' | 'ai'
  onTabChange?: (tab: 'manual' | 'ai') => void
  actionMode?: ActionMode
  onActionModeChange?: (mode: ActionMode) => void
  onEliminationMode?: (selectedTeam: MLBTeam) => void
}

const MLBInputPanel = React.memo(({ 
  activeTab: externalActiveTab, 
  onTabChange,
  actionMode: externalActionMode,
  onActionModeChange,
  onEliminationMode
}: MLBInputPanelProps) => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>(externalActiveTab || 'manual')
  const [showTeamList, setShowTeamList] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<MLBTeam | null>(null)
  const [showTeamDetailsModal, setShowTeamDetailsModal] = useState(false)
  const [showFavoritesModal, setShowFavoritesModal] = useState(false)
  const [showComparisonModal, setShowComparisonModal] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<MLBTeam[]>([])
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [aiCommentary, setAiCommentary] = useState<string>("")
  const [aiMood, setAiMood] = useState<string>("neutral")
  const [aiGameMode, setAiGameMode] = useState<string>("")
  const [aiTrivia, setAiTrivia] = useState<any>(null)
  const [aiPrediction, setAiPrediction] = useState<any>(null)
  const [aiEntertainment, setAiEntertainment] = useState<any>(null)
  const [aiLearning, setAiLearning] = useState<any>(null)
  const [aiSocial, setAiSocial] = useState<any>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [userInput, setUserInput] = useState<string>("")
  const [aiPredictionResponse, setAiPredictionResponse] = useState<string>("")
  const [isGeneratingPrediction, setIsGeneratingPrediction] = useState(false)
  const [aiCreativeContent, setAiCreativeContent] = useState<{
    type: string, 
    content: string, 
    suggestedTeams?: string[], 
    currentTeam?: MLBTeam
  } | null>(null)
  const [aiFantasyDraft, setAiFantasyDraft] = useState<any>(null)
  const [aiHistoricalAnalysis, setAiHistoricalAnalysis] = useState<any>(null)
  const [aiTeamChemistry, setAiTeamChemistry] = useState<any>(null)
  const [aiWeatherImpact, setAiWeatherImpact] = useState<any>(null)
  const [aiFanPerspective, setAiFanPerspective] = useState<any>(null)
  
  // Mode feature state
  const [actionMode, setActionMode] = useState<ActionMode>(externalActionMode || "normal")
  const [manualTeamName, setManualTeamName] = useState("")
  const [customTeams, setCustomTeams] = useState<MLBTeam[]>([])

  // Client-side only rendering to prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  // Subscribe to the current wheel using a Zustand selector - optimized
  const wheel = useWheelManagerStore(useCallback(state => {
    const wheels = state.wheelsByTool[state.currentTool] || [];
    return wheels.find(w => w.id === state.currentWheelId) || null;
  }, []));
  // Memoize default data to prevent recreation
  const defaultData = useMemo((): MLBWheelData => ({
    selectedLeague: "all",
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
    recentResults: [],
  }), []);
  const rawData = (wheel?.data as any) || {}
  const data: MLBWheelData = {
    ...defaultData,
    ...rawData,
    selectedTeams: Array.isArray(rawData?.selectedTeams) ? rawData.selectedTeams : []
  }

  const { updateWheelData } = useWheelManagerStore()
  const { showToast } = useToast()

  // Tab management - optimized with useCallback
  const handleTabChange = useCallback((tab: 'manual' | 'ai') => {
    setActiveTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }, [onTabChange])

  // Initialize with all teams if none selected - optimized
  useEffect(() => {
    if (!Array.isArray(data.selectedTeams) || data.selectedTeams.length === 0) {
      updateWheelData("mlb-wheel", wheel?.id || "", {
        ...data,
        selectedTeams: mlbTeams
      })
    }
  }, [data.selectedTeams, updateWheelData, wheel?.id, data])

  const handleLeagueChange = (league: "all" | "American" | "National") => {
    const teams = getMLBTeamsByLeague(league)
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      selectedLeague: league,
      selectedTeams: teams
    })
  }

  const handleDisplayModeChange = (mode: "logo" | "name" | "both") => {
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      displayMode: mode
    })
  }

  const handleViewModeChange = (mode: "wheel" | "list" | "text") => {
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      viewMode: mode
    })
  }

  const toggleTeam = (team: MLBTeam) => {
    const isSelected = data.selectedTeams.some(t => t.id === team.id)
    let updatedTeams: MLBTeam[]
    
    if (isSelected) {
      updatedTeams = data.selectedTeams.filter(t => t.id !== team.id)
    } else {
      updatedTeams = [...data.selectedTeams, team]
    }
    
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      selectedTeams: updatedTeams
    })
  }

  const selectAllTeams = () => {
    const teams = getMLBTeamsByLeague(data.selectedLeague)
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      selectedTeams: teams
    })
  }

  const clearAllTeams = () => {
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      selectedTeams: []
    })
  }

  const shuffleTeams = () => {
    const shuffled = [...data.selectedTeams].sort(() => Math.random() - 0.5)
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      selectedTeams: shuffled
    })
  }

  const sortTeamsAlphabetically = () => {
    const sorted = [...data.selectedTeams].sort((a, b) => a.name.localeCompare(b.name))
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      selectedTeams: sorted
    })
  }

  const addToFavorites = (team: MLBTeam) => {
    if (!data.favoriteTeams.some(t => t.id === team.id)) {
      updateWheelData("mlb-wheel", wheel?.id || "", {
        ...data,
        favoriteTeams: [...data.favoriteTeams, team]
      })
    }
  }

  const removeFromFavorites = (teamId: string) => {
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      favoriteTeams: data.favoriteTeams.filter(t => t.id !== teamId)
    })
  }

  const isFavorite = (teamId: string) => {
    return data.favoriteTeams.some(t => t.id === teamId)
  }

  const addToComparison = (team: MLBTeam) => {
    if (!data.comparisonTeams.some(t => t.id === team.id) && data.comparisonTeams.length < 4) {
      updateWheelData("mlb-wheel", wheel?.id || "", {
        ...data,
        comparisonTeams: [...data.comparisonTeams, team]
      })
    }
  }

  const removeFromComparison = (teamId: string) => {
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      comparisonTeams: data.comparisonTeams.filter(t => t.id !== teamId)
    })
  }

  const isInComparison = (teamId: string) => {
    return data.comparisonTeams.some(t => t.id === teamId)
  }

  const getLeagueColor = (league: string) => {
    return league === "American" ? "bg-red-100 text-red-800 border-red-200" : "bg-blue-100 text-blue-800 border-blue-200"
  }

  const getDivisionColor = (division: string) => {
    const colors = {
      "East": "bg-green-100 text-green-800 border-green-200",
      "Central": "bg-purple-100 text-purple-800 border-purple-200",
      "West": "bg-orange-100 text-orange-800 border-orange-200"
    }
    return colors[division as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getLeagueIcon = (league: string) => {
    switch (league) {
      case "all":
        return "⚾"
      case "American":
        return "🇺🇸"
      case "National":
        return "🏟️"
      default:
        return "⚾"
    }
  }

  const getLeagueBgColor = (league: string) => {
    switch (league) {
      case "all":
        return "bg-red-500"
      case "American":
        return "bg-blue-500"
      case "National":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Mode feature functions
  const handleAddManualTeam = () => {
    if (!manualTeamName.trim()) {
      console.log('Manual team name is empty')
      return
    }

    // Check if team with this name already exists
    const allTeams = getMLBTeamsByLeague(data.selectedLeague)
    const teamExists = allTeams.some(team => team.name.toLowerCase() === manualTeamName.trim().toLowerCase())
    if (teamExists) {
      console.log('Team with this name already exists:', manualTeamName)
      showToast(`Team "${manualTeamName}" already exists!`, "warning")
      return
    }

    console.log('Adding manual team:', manualTeamName)
    
    // Create a custom team object
    const customTeam: MLBTeam = {
      id: `manual-${Date.now()}`,
      name: manualTeamName.trim(),
      abbreviation: manualTeamName.trim().substring(0, 3).toUpperCase(),
      city: "Custom City",
      league: "American",
      division: "Custom",
      logo: "⚾",
      primaryColor: "#666666",
      secondaryColor: "#999999",
      founded: new Date().getFullYear(),
      championships: 0,
      homeVenue: "Custom Stadium",
      manager: "Custom Manager",
      owner: "Custom Owner"
    }

    // Add to custom teams state (avoid duplicates)
    setCustomTeams(prev => {
      const exists = prev.some(team => team.id === customTeam.id)
      return exists ? prev : [...prev, customTeam]
    })

    // Add to selected teams
    const newSelected = [...data.selectedTeams, customTeam]
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      selectedTeams: newSelected
    })
    
    // Reset input
    setManualTeamName("")
    
    showToast(`Added custom team "${customTeam.name}" to wheel!`, "success")
    console.log('Custom team added successfully:', customTeam.name)
  }

  const handleDeleteCustomTeam = (teamId: string) => {
    console.log('Deleting custom team:', teamId)
    
    // Remove from custom teams state
    setCustomTeams(prev => prev.filter(team => team.id !== teamId))
    
    // Remove from selected teams
    const newSelected = data.selectedTeams.filter(team => team.id !== teamId)
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      selectedTeams: newSelected
    })
    
    showToast('Custom team removed from wheel!', "info")
    console.log('Custom team deleted successfully:', teamId)
  }

  const handleEliminationMode = (selectedTeam: MLBTeam) => {
    if (actionMode === "elimination") {
      console.log('ELIMINATION MODE: Removing team from available options...')
      console.log('Team to eliminate:', selectedTeam.name, 'ID:', selectedTeam.id)
      
      // Call external elimination handler if provided
      if (onEliminationMode) {
        onEliminationMode(selectedTeam)
      } else {
        // Fallback to local elimination logic
        const newSelected = data.selectedTeams.filter(team => team.id !== selectedTeam.id)
        console.log('After elimination - remaining teams:', newSelected.length)
        
        updateWheelData("mlb-wheel", wheel?.id || "", {
          ...data,
          selectedTeams: newSelected
        })
        
        showToast(`Eliminated ${selectedTeam.name} from wheel!`, "info")
        console.log(`Elimination mode: Removed ${selectedTeam.name} from available options. Remaining: ${newSelected.length} teams`)
      }
    }
  }

  const generateAISuggestions = async () => {
    setIsGeneratingSuggestions(true)
    
    try {
      const allTeams = getMLBTeamsByLeague(data.selectedLeague)
      const prompt = `Suggest 8 MLB teams for a picker wheel based on the following criteria:

League: ${data.selectedLeague}
Available Teams: ${allTeams.map(team => `${team.name} (${team.city}, ${team.league} League, ${team.division} Division, Founded: ${team.founded}, Championships: ${team.championships})`).join(', ')}

Please suggest 8 teams that would create an interesting and balanced picker wheel. Consider:
- Mix of different eras and histories
- Balance between American and National League
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
            userPreferences: { sport: 'baseball', league: data.selectedLeague },
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
          
          // Auto-select AI suggestions
          updateWheelData("mlb-wheel", wheel?.id || "", {
            ...data,
            selectedTeams: suggestions
          })
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Suggestions Error:', error)
      // Fallback to simulated suggestions
      const allTeams = getMLBTeamsByLeague(data.selectedLeague)
      const shuffled = [...allTeams].sort(() => Math.random() - 0.5)
      const suggestions = shuffled.slice(0, 8)
      
      setAiSuggestions(suggestions)
      
      // Auto-select AI suggestions
      updateWheelData("mlb-wheel", wheel?.id || "", {
        ...data,
        selectedTeams: suggestions
      })
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }

  // Helper function to extract team names from AI response
  const extractTeamNames = (text: string): string[] => {
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
  }

  // AI Team Insights & Predictions
  const generateAIInsights = (team: MLBTeam) => {
    const insights = {
      performancePrediction: `${Math.floor(Math.random() * 30) + 60}% chance of making playoffs`,
      funFact: `Did you know ${team.name} has the ${['longest', 'shortest', 'most impressive'][Math.floor(Math.random() * 3)]} home run streak this season?`,
      aiMatchup: `${team.name} would be a great rival pick against the ${['Yankees', 'Red Sox', 'Dodgers', 'Giants'][Math.floor(Math.random() * 4)]} based on historical performance`,
      seasonOutlook: `${team.name} is projected to win ${Math.floor(Math.random() * 20) + 70} games this season`,
      playerSpotlight: `${team.name}'s star player is having an MVP-caliber season`,
      historicalContext: `${team.name} last won the World Series in ${Math.floor(Math.random() * 30) + 1980}`
    }
    setAiInsights(insights)
  }

  // AI Commentary & Storytelling
  const generateAICommentary = () => {
    const commentaries = [
      "The wheel is spinning with the intensity of a 9th-inning rally!",
      "Like a curveball in the strike zone, your result is coming in hot!",
      "The baseball gods are deciding your fate...",
      "The tension is building like a bases-loaded situation!",
      "This spin has the drama of a walk-off home run!",
      "The AI is analyzing patterns like a seasoned scout!",
      "The wheel is dancing like a perfect bunt down the line!",
      "The algorithms are working overtime like a relief pitcher in extra innings!"
    ]
    setAiCommentary(commentaries[Math.floor(Math.random() * commentaries.length)])
  }

  // Smart Team Recommendations
  const generateMoodBasedRecommendations = async (mood: string) => {
    setAiMood(mood)
    setIsGeneratingAI(true)
    
    try {
      const allTeams = getMLBTeamsByLeague(data.selectedLeague)
      const moodDescriptions = {
        "lucky": "teams with the most championships and success (5+ World Series titles)",
        "underdog": "teams with fewer championships (less than 2) that are often overlooked",
        "classic": "teams founded before 1950 with rich historical traditions",
        "modern": "teams founded after 1960 representing the modern era of baseball"
      }
      
      const prompt = `Suggest 6 MLB teams for a "${mood}" mood picker wheel.

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
            userPreferences: { sport: 'baseball', mood: mood },
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
            let fallbackTeams: MLBTeam[] = []
            switch(mood) {
              case "lucky":
                fallbackTeams = allTeams.filter(team => team.championships > 5).slice(0, 6)
                break
              case "underdog":
                fallbackTeams = allTeams.filter(team => team.championships < 2).slice(0, 6)
                break
              case "classic":
                fallbackTeams = allTeams.filter(team => team.founded < 1950).slice(0, 6)
                break
              case "modern":
                fallbackTeams = allTeams.filter(team => team.founded > 1960).slice(0, 6)
                break
              default:
                fallbackTeams = allTeams.slice(0, 6)
            }
            
            const remainingTeams = fallbackTeams.filter(team => !recommendations.includes(team))
            recommendations.push(...remainingTeams.slice(0, 6 - recommendations.length))
          }
          
          setAiSuggestions(recommendations)
          updateWheelData("mlb-wheel", wheel?.id || "", {
            ...data,
            selectedTeams: recommendations
          })
          
          showToast(`Generated ${mood} mood recommendations! Teams added to wheel.`, "success")
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Mood Recommendations Error:', error)
      // Fallback to simulated recommendations
    const allTeams = getMLBTeamsByLeague(data.selectedLeague)
    let recommendations: MLBTeam[] = []
    
    switch(mood) {
      case "lucky":
        recommendations = allTeams.filter(team => team.championships > 5).slice(0, 6)
        break
      case "underdog":
        recommendations = allTeams.filter(team => team.championships < 2).slice(0, 6)
        break
      case "classic":
        recommendations = allTeams.filter(team => team.founded < 1950).slice(0, 6)
        break
      case "modern":
        recommendations = allTeams.filter(team => team.founded > 1960).slice(0, 6)
        break
      default:
        recommendations = allTeams.slice(0, 6)
    }
    
    setAiSuggestions(recommendations)
    updateWheelData("mlb-wheel", wheel?.id || "", {
      ...data,
      selectedTeams: recommendations
    })
      
      showToast(`Generated ${mood} mood recommendations! Teams added to wheel.`, "success")
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // AI Game Modes
  const generateAIGameMode = async (mode: string) => {
    setAiGameMode(mode)
    setIsGeneratingAI(true)
    
    try {
      const allTeams = getMLBTeamsByLeague(data.selectedLeague)
      const gameModeDescriptions = {
        "challenger": "4 elite teams that would create intense competition and rivalries",
        "elimination": "8 teams with strong championship histories for elimination-style gameplay",
        "trivia": "6 diverse teams representing different eras and regions for trivia challenges",
        "fantasy": "10 modern teams with strong fantasy baseball potential and current relevance"
      }
      
      const prompt = `Suggest MLB teams for a "${mode}" game mode picker wheel.

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
            userPreferences: { sport: 'baseball', gameMode: mode },
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
            let fallbackTeams: MLBTeam[] = []
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
                fallbackTeams = allTeams.filter(team => team.founded > 1960).slice(0, 10)
                break
              default:
                fallbackTeams = allTeams.slice(0, 8)
            }
            
            const remainingTeams = fallbackTeams.filter(team => !selectedTeams.includes(team))
            selectedTeams.push(...remainingTeams.slice(0, targetCount - selectedTeams.length))
          }
          
          setAiSuggestions(selectedTeams)
          updateWheelData("mlb-wheel", wheel?.id || "", {
            ...data,
            selectedTeams: selectedTeams
          })
          
          showToast(`Generated ${mode} game mode teams! Ready to play!`, "success")
        } else {
          throw new Error('Invalid AI response')
        }
      } else {
        throw new Error('AI API request failed')
      }
    } catch (error) {
      console.error('AI Game Mode Error:', error)
      // Fallback to simulated game mode
      const allTeams = getMLBTeamsByLeague(data.selectedLeague)
      let selectedTeams: MLBTeam[] = []
      
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
          selectedTeams = allTeams.filter(team => team.founded > 1960).slice(0, 10)
          break
        default:
          selectedTeams = allTeams.slice(0, 8)
      }
      
      setAiSuggestions(selectedTeams)
      updateWheelData("mlb-wheel", wheel?.id || "", {
        ...data,
        selectedTeams: selectedTeams
      })
      
      showToast(`Generated ${mode} game mode teams! Ready to play!`, "success")
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // AI Trivia
  const generateAITrivia = (team: MLBTeam) => {
    const triviaQuestions = [
      {
        question: `In what year was ${team.name} founded?`,
        answer: team.founded.toString(),
        hint: "Think about the era of baseball expansion"
      },
      {
        question: `How many World Series championships has ${team.name} won?`,
        answer: team.championships.toString(),
        hint: "Check their championship history"
      },
      {
        question: `What is ${team.name}'s home venue?`,
        answer: team.homeVenue,
        hint: "It's their current stadium"
      },
      {
        question: `Who is ${team.name}'s current manager?`,
        answer: team.manager,
        hint: "The person calling the shots from the dugout"
      }
    ]
    
    setAiTrivia(triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)])
  }

  // AI Predictions
  const generateAIPredictions = (team: MLBTeam) => {
    const predictions = {
      seasonPrediction: `${team.name} is predicted to finish ${Math.floor(Math.random() * 5) + 1}${['st', 'nd', 'rd', 'th', 'th'][Math.floor(Math.random() * 5)]} in their division`,
      playoffChance: `${Math.floor(Math.random() * 40) + 30}% chance of making the playoffs`,
      fantasyImpact: `This pick could boost your fantasy lineup by ${Math.floor(Math.random() * 20) + 10}%`,
      tradePrediction: `${team.name} might trade for a ${['pitcher', 'catcher', 'outfielder', 'infielder'][Math.floor(Math.random() * 4)]} this season`,
      playerBreakout: `${team.name} has a rookie who could be the next big star`,
      worldSeriesOdds: `${Math.floor(Math.random() * 15) + 5}% chance of winning the World Series`
    }
    setAiPrediction(predictions)
  }

  // AI Entertainment
  const generateAIEntertainment = (team: MLBTeam) => {
    const entertainment = {
      teamRoast: `${team.name} is so slow, they make a turtle look like Usain Bolt! (But we still love them!)`,
      victoryDance: `When ${team.name} wins, fans do the "${team.name} Shuffle" - it's like the Macarena but with more baseball!`,
      teamPersonality: `If ${team.name} were a person, they'd be that friend who's always late but somehow makes it work!`,
      customChant: `Go ${team.name}! You're the best! Better than all the rest!`,
      victorySong: `🎵 ${team.name} are the champions, my friend! 🎵`,
      teamPoem: `${team.name} so bold and true,\nIn every game they see it through,\nWith heart and soul they play the game,\n${team.name} will bring us fame!`
    }
    setAiEntertainment(entertainment)
  }

  // AI Learning
  const generateAILearning = (team: MLBTeam) => {
    const learning = {
      baseballIQ: `${team.name} is known for their ${['aggressive base running', 'strong pitching staff', 'power hitting', 'defensive excellence'][Math.floor(Math.random() * 4)]}`,
      strategyInsights: `${team.name} often uses the ${['shift', 'bunt', 'steal', 'sacrifice fly'][Math.floor(Math.random() * 4)]} as a key strategy`,
      historicalLessons: `${team.name} taught us that ${['persistence pays off', 'teamwork wins championships', 'innovation changes the game', 'tradition matters'][Math.floor(Math.random() * 4)]}`,
      playingStyle: `${team.name} plays with ${['intensity', 'finesse', 'power', 'speed'][Math.floor(Math.random() * 4)]} as their signature style`,
      fanCulture: `${team.name} fans are known for their ${['loyalty', 'passion', 'knowledge', 'enthusiasm'][Math.floor(Math.random() * 4)]}`,
      stadiumFacts: `${team.name}'s stadium is famous for its ${['unique dimensions', 'amazing food', 'beautiful views', 'historic significance'][Math.floor(Math.random() * 4)]}`
    }
    setAiLearning(learning)
  }

  // AI Social Features
  const generateAISocial = (team: MLBTeam) => {
    const social = {
      aiMatchmaker: `${Math.floor(Math.random() * 50) + 30}% of users who picked ${team.name} also liked the ${['Yankees', 'Dodgers', 'Red Sox', 'Cubs'][Math.floor(Math.random() * 4)]}`,
      groupChallenge: `Join the "${team.name} Challenge" - can you pick them 3 times in a row?`,
      socialPrediction: `${Math.floor(Math.random() * 40) + 60}% of users who picked ${team.name} also enjoyed ${['pizza', 'hot dogs', 'nachos', 'peanuts'][Math.floor(Math.random() * 4)]} at the game`,
      fanConnection: `Connect with other ${team.name} fans in the community!`,
      trending: `${team.name} is trending ${Math.floor(Math.random() * 20) + 10}% higher than usual today!`,
      communityPick: `${team.name} was the most popular pick among users in your area!`
    }
    setAiSocial(social)
  }

  // AI Creative Content Generation
  const generateAICreativeContent = async (type: string) => {
    setIsGeneratingAI(true)
    
    // Use currently selected teams or a random team if none selected
    let targetTeams = data.selectedTeams
    if (targetTeams.length === 0) {
      targetTeams = [mlbTeams[Math.floor(Math.random() * mlbTeams.length)]]
    }
    
    // Select a random team from the selected teams
    const randomTeam = targetTeams[Math.floor(Math.random() * targetTeams.length)]
    
    try {
      const prompt = `Create a ${type} about the ${randomTeam.name} MLB team. 
      
Team Information:
- Name: ${randomTeam.name}
- City: ${randomTeam.city}
- Founded: ${randomTeam.founded}
- Championships: ${randomTeam.championships}
- Home Venue: ${randomTeam.homeVenue}
- Manager: ${randomTeam.manager}
- League: ${randomTeam.league}
- Division: ${randomTeam.division}

Please create a creative ${type} that celebrates this team's history, achievements, and spirit. Make it engaging, fun, and baseball-themed. Include emojis and formatting to make it visually appealing.

After creating the ${type}, suggest exactly 3 other MLB teams that would be interesting to spin the wheel for next, based on the theme of your ${type}. Format your suggestions like this:

**Los Angeles Dodgers:** A classic team with a rich history and passionate fanbase, offering a contrast to the Rangers' relatively newer history.
**New York Yankees:** Their legendary status and iconic imagery would provide a different poetic challenge, focusing on their long-standing dominance.
**Atlanta Braves:** A team with a long history and recent success, exploring themes of perseverance and overcoming challenges.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'baseball', team: randomTeam.name },
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
          showToast(`Created ${type} about ${randomTeam.name}! Spin the wheel to explore more teams!`, "success")
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
          content = `🏟️ The Legend of ${randomTeam.name} 🏟️

In the heart of ${randomTeam.city}, where dreams are born and legends are made, the ${randomTeam.name} stand as a testament to baseball's enduring spirit. Founded in ${randomTeam.founded}, this storied franchise has captured the hearts of millions.

The ${randomTeam.name} aren't just a team - they're a family. From the passionate fans who fill ${randomTeam.homeVenue} to the dedicated players who wear the uniform with pride, every game is a chapter in an epic tale of determination and triumph.

With ${randomTeam.championships} World Series championships to their name, the ${randomTeam.name} have proven that greatness isn't just about winning - it's about the journey, the struggles, and the moments that define a legacy.

As the sun sets over the diamond and the crowd rises to their feet, the ${randomTeam.name} continue to write their story, one pitch at a time, one game at a time, one season at a time. This is more than baseball - this is magic.

💡 **Spin the wheel to discover more legendary teams!**`
          break
          
        case "poem":
          content = `⚾ Ode to ${randomTeam.name} ⚾

In ${randomTeam.city} where legends dwell,
The ${randomTeam.name} cast their mighty spell.
Founded in ${randomTeam.founded}, proud and true,
Their colors shine in every hue.

${randomTeam.homeVenue} echoes with cheers so loud,
As fans gather in a faithful crowd.
${randomTeam.championships} championships won with might,
Beneath the stadium's golden light.

From ${randomTeam.manager}'s wisdom to the field,
A legacy that will never yield.
The ${randomTeam.name} spirit, bold and free,
A symbol of what baseball should be.

So here's to the team we love so dear,
The ${randomTeam.name} - year after year!

🎯 **Ready to spin? Try the wheel for another poetic team!**`
          break
          
        case "rap":
          content = `🎤 ${randomTeam.name} Rap Battle 🎤

Yo, listen up, I'm about to drop the truth,
About the ${randomTeam.name} and their baseball youth.
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

So step to the plate if you think you're ready,
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
To check his pitch count! 🏦

What's a ${randomTeam.name} player's favorite type of music?
Baseball blues! 🎵

Why did the ${randomTeam.name} mascot go to the doctor?
Because he was feeling a little "fowl"! 🐦

The ${randomTeam.name} are so good, even their shadows have batting averages! ⚾

Remember: In ${randomTeam.city}, we don't just play baseball - we make it fun! 😎

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
  }

  // Helper function to extract suggested teams from AI response
  const extractSuggestedTeams = (text: string): string[] => {
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
      'Los Angeles Dodgers', 'New York Yankees', 'Atlanta Braves', 'Boston Red Sox', 'Chicago Cubs',
      'San Francisco Giants', 'St. Louis Cardinals', 'Houston Astros', 'Philadelphia Phillies',
      'Milwaukee Brewers', 'Cincinnati Reds', 'Pittsburgh Pirates', 'Chicago White Sox',
      'Cleveland Guardians', 'Detroit Tigers', 'Kansas City Royals', 'Minnesota Twins',
      'Baltimore Orioles', 'Tampa Bay Rays', 'Toronto Blue Jays', 'Seattle Mariners',
      'Oakland Athletics', 'Los Angeles Angels', 'San Diego Padres', 'Colorado Rockies',
      'Arizona Diamondbacks', 'Miami Marlins', 'Washington Nationals', 'New York Mets'
    ]
    
    teamNames.forEach(teamName => {
      if (text.includes(teamName) && !suggestedTeams.includes(teamName)) {
        suggestedTeams.push(teamName)
      }
    })
    
    return [...new Set(suggestedTeams)].slice(0, 3) // Return up to 3 unique suggestions
  }

  // AI Fantasy Draft Analysis
  const generateAIFantasyDraft = async () => {
    setIsGeneratingAI(true)
    const randomTeam = mlbTeams[Math.floor(Math.random() * mlbTeams.length)]
    
    try {
      const prompt = `Analyze the ${randomTeam.name} for fantasy baseball purposes.

Team Information:
- Name: ${randomTeam.name}
- City: ${randomTeam.city}
- Founded: ${randomTeam.founded}
- Championships: ${randomTeam.championships}
- Home Venue: ${randomTeam.homeVenue}
- Manager: ${randomTeam.manager}
- League: ${randomTeam.league}
- Division: ${randomTeam.division}

Please provide fantasy baseball analysis including:
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
            userPreferences: { sport: 'baseball', analysis: 'fantasy' },
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
  }

  // Helper function to extract values from AI response
  const extractValue = (text: string, key: string): string | null => {
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
  }

  // AI Historical Analysis
  const generateAIHistoricalAnalysis = async () => {
    setIsGeneratingAI(true)
    const randomTeam = mlbTeams[Math.floor(Math.random() * mlbTeams.length)]
    
    try {
      const prompt = `Analyze the historical significance of the ${randomTeam.name} MLB team.

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
1. Era classification (Dead Ball Era, Golden Age, Modern Era, etc.)
2. Defining moment in team history
3. Legendary player who revolutionized the game
4. Cultural impact on baseball and the city
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
            userPreferences: { sport: 'baseball', analysis: 'historical' },
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
            era: extractValue(aiResponse, 'era') || `${randomTeam.founded < 1900 ? 'Dead Ball Era' : randomTeam.founded < 1950 ? 'Golden Age' : 'Modern Era'}`,
            definingMoment: extractValue(aiResponse, 'defining moment') || `The ${randomTeam.name}'s ${randomTeam.championships > 0 ? 'championship victory' : 'first playoff appearance'} changed baseball forever`,
            legendaryPlayer: extractValue(aiResponse, 'legendary player') || `${randomTeam.name} had a player who revolutionized the game`,
            culturalImpact: extractValue(aiResponse, 'cultural impact') || `${randomTeam.name} influenced baseball culture in ${randomTeam.city}`,
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
        era: `${randomTeam.founded < 1900 ? 'Dead Ball Era' : randomTeam.founded < 1950 ? 'Golden Age' : 'Modern Era'}`,
        definingMoment: `The ${randomTeam.name}'s ${randomTeam.championships > 0 ? 'championship victory' : 'first playoff appearance'} changed baseball forever`,
        legendaryPlayer: `${randomTeam.name} had a player who revolutionized the game`,
        culturalImpact: `${randomTeam.name} influenced baseball culture in ${randomTeam.city}`,
        statisticalMilestone: `${randomTeam.name} achieved a record that stood for decades`,
        evolution: `From ${randomTeam.founded} to today, ${randomTeam.name} has evolved with the game`
      }
      setAiHistoricalAnalysis(historicalAnalysis)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // AI Team Chemistry Analysis
  const generateAITeamChemistry = async () => {
    setIsGeneratingAI(true)
    const randomTeam = mlbTeams[Math.floor(Math.random() * mlbTeams.length)]
    
    try {
      const prompt = `Analyze the team chemistry and dynamics of the ${randomTeam.name} MLB team.

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
            userPreferences: { sport: 'baseball', analysis: 'chemistry' },
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
  }

  // AI Weather Impact Analysis
  const generateAIWeatherImpact = async () => {
    setIsGeneratingAI(true)
    const randomTeam = mlbTeams[Math.floor(Math.random() * mlbTeams.length)]
    
    try {
      const prompt = `Analyze how weather conditions impact the ${randomTeam.name} MLB team's performance.

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
1. Home field weather advantage
2. Wind patterns and their effects
3. Temperature preferences and performance
4. Humidity impact on ball flight
5. Seasonal performance patterns
6. Weather-based strategy adjustments

Format your response as a structured analysis with specific percentages and weather details.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'baseball', analysis: 'weather' },
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
            homeAdvantage: extractValue(aiResponse, 'home advantage') || `${randomTeam.name} performs ${Math.floor(Math.random() * 20) + 10}% better in their home weather`,
            windFactor: extractValue(aiResponse, 'wind') || `${randomTeam.homeVenue} has unique wind patterns that favor ${randomTeam.name}`,
            temperatureEffect: extractValue(aiResponse, 'temperature') || `${randomTeam.name} thrives in ${Math.floor(Math.random() * 20) + 60}°F weather`,
            humidityImpact: extractValue(aiResponse, 'humidity') || `Humidity levels at ${randomTeam.homeVenue} affect ball flight`,
            seasonalPerformance: extractValue(aiResponse, 'seasonal') || `${randomTeam.name} has a ${Math.floor(Math.random() * 30) + 60}% win rate in ideal conditions`,
            weatherStrategy: extractValue(aiResponse, 'strategy') || `${randomTeam.name} adjusts their game plan based on weather conditions`
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
        homeAdvantage: `${randomTeam.name} performs ${Math.floor(Math.random() * 20) + 10}% better in their home weather`,
        windFactor: `${randomTeam.homeVenue} has unique wind patterns that favor ${randomTeam.name}`,
        temperatureEffect: `${randomTeam.name} thrives in ${Math.floor(Math.random() * 20) + 60}°F weather`,
        humidityImpact: `Humidity levels at ${randomTeam.homeVenue} affect ball flight`,
        seasonalPerformance: `${randomTeam.name} has a ${Math.floor(Math.random() * 30) + 60}% win rate in ideal conditions`,
        weatherStrategy: `${randomTeam.name} adjusts their game plan based on weather conditions`
      }
      setAiWeatherImpact(weatherAnalysis)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // AI Fan Perspective Analysis
  const generateAIFanPerspective = async () => {
    setIsGeneratingAI(true)
    const randomTeam = mlbTeams[Math.floor(Math.random() * mlbTeams.length)]
    
    try {
      const prompt = `Analyze the fan perspective and community culture of the ${randomTeam.name} MLB team.

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
3. Community connection and local impact
4. Fan traditions and rituals
5. Social media presence and engagement
6. Multi-generational fan support

Format your response as a structured analysis with specific percentages and fan culture details.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'baseball', analysis: 'fan' },
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
            fanLoyalty: extractValue(aiResponse, 'fan loyalty') || `${Math.floor(Math.random() * 30) + 70}% of fans are die-hard supporters`,
            gameDayExperience: extractValue(aiResponse, 'game day') || `${randomTeam.homeVenue} offers one of the best fan experiences in baseball`,
            communityConnection: extractValue(aiResponse, 'community') || `${randomTeam.name} fans are deeply connected to their community`,
            traditionStrength: extractValue(aiResponse, 'traditions') || `${randomTeam.name} has ${Math.floor(Math.random() * 20) + 10} unique fan traditions`,
            socialMediaPresence: extractValue(aiResponse, 'social media') || `${randomTeam.name} fans are among the most active on social media`,
            generationalFandom: extractValue(aiResponse, 'generational') || `${Math.floor(Math.random() * 40) + 50}% of fans are multi-generational supporters`
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
        fanLoyalty: `${Math.floor(Math.random() * 30) + 70}% of fans are die-hard supporters`,
        gameDayExperience: `${randomTeam.homeVenue} offers one of the best fan experiences in baseball`,
        communityConnection: `${randomTeam.name} fans are deeply connected to their community`,
        traditionStrength: `${randomTeam.name} has ${Math.floor(Math.random() * 20) + 10} unique fan traditions`,
        socialMediaPresence: `${randomTeam.name} fans are among the most active on social media`,
        generationalFandom: `${Math.floor(Math.random() * 40) + 50}% of fans are multi-generational supporters`
      }
      setAiFanPerspective(fanAnalysis)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Generate all AI features for a team
  const generateAllAIFeatures = (team: MLBTeam) => {
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
  }

  const generateAIPredictionFromInput = async (userDescription: string) => {
    setIsGeneratingPrediction(true)
    
    try {
      const prompt = `Analyze this baseball scenario and provide a detailed prediction:

User Description: "${userDescription}"

Available MLB Teams:
${mlbTeams.map(team => `- ${team.name} (${team.city}, ${team.league} League, ${team.division} Division, Founded: ${team.founded}, Championships: ${team.championships}, Home: ${team.homeVenue}, Manager: ${team.manager})`).join('\n')}

Please provide a comprehensive analysis and prediction based on the user's description. Consider factors like:
- Team history and championships
- Recent performance trends
- Home field advantage
- Manager strategies
- League and division dynamics
- Historical matchups
- Current team chemistry

Make your prediction engaging, detailed, and baseball-focused. Include specific team names and reasoning.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          context: {
            currentSkins: [],
            userPreferences: { sport: 'baseball', analysis: 'prediction' },
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
      // Fallback to simulated prediction
      const teams = mlbTeams.filter(team => 
        userDescription.toLowerCase().includes(team.name.toLowerCase()) ||
        userDescription.toLowerCase().includes(team.city.toLowerCase())
      )
      
      if (teams.length === 0) {
        setAiPredictionResponse("Based on your description, I can't identify specific teams. However, here's my analysis: The team with the strongest recent performance and momentum would likely have the advantage. Consider factors like home field advantage, recent form, and head-to-head records when making your prediction.")
        setIsGeneratingPrediction(false)
        return
      }

      const randomTeam = teams[Math.floor(Math.random() * teams.length)]
      const opponent = mlbTeams.filter(t => t.id !== randomTeam.id)[Math.floor(Math.random() * (mlbTeams.length - 1))]
      
      const predictions = [
        `Based on your description, ${randomTeam.name} has a ${Math.floor(Math.random() * 30) + 60}% chance of winning against ${opponent.name}. Their recent form and ${randomTeam.division} division strength gives them the edge.`,
        `My AI analysis suggests ${randomTeam.name} will dominate this matchup. Their ${randomTeam.league} league experience and home advantage at ${randomTeam.homeVenue} will be key factors.`,
        `Looking at the patterns you described, ${randomTeam.name} appears to be the stronger contender. Their ${randomTeam.championships} championships and ${randomTeam.founded} founding legacy provide them with the winning mentality needed.`,
        `The data points to ${randomTeam.name} as the likely winner. Their manager's strategy and the team's performance in ${randomTeam.division} division games shows they're ready for this challenge.`,
        `Based on your input, ${randomTeam.name} has the momentum and team chemistry to secure a victory. Their recent performance trends and ${randomTeam.league} league standing position them well for success.`
      ]
      
      const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)]
      setAiPredictionResponse(randomPrediction)
    } finally {
      setIsGeneratingPrediction(false)
    }
  }

  const leagues = [
    { id: "all", name: "All Leagues" },
    { id: "American", name: "American League" },
    { id: "National", name: "National League" }
  ]

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-4">
        {/* Tab Navigation */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></span>
                INPUTS
              </h3>
          <div className="flex items-center space-x-2">
                             <Button
                 variant="ghost"
                 size="sm"
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    data.favoriteTeams?.length > 0 
                      ? "text-red-500 bg-red-50 hover:bg-red-100 border border-red-200" 
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                 onClick={() => setShowFavoritesModal(true)}
                 title="Favorites"
               >
                 <Heart className="w-4 h-4" />
                  {mounted && data.favoriteTeams?.length > 0 && (
                    <span className="ml-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                      {data.favoriteTeams.length}
                    </span>
                  )}
               </Button>
               <Button
                 variant="ghost"
                 size="sm"
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    data.comparisonTeams?.length > 0 
                      ? "text-blue-500 bg-blue-50 hover:bg-blue-100 border border-blue-200" 
                      : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                  }`}
                 onClick={() => setShowComparisonModal(true)}
                 title="Comparison"
               >
                 <GitCompare className="w-4 h-4" />
                  {mounted && data.comparisonTeams?.length > 0 && (
                    <span className="ml-1 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                      {data.comparisonTeams.length}
                    </span>
                  )}
               </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              title="Preview"
              onClick={() => setShowTeamList(!showTeamList)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showTeamList 
                    ? "bg-green-100 text-green-700 border border-green-300" 
                    : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                }`}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="List View"
              onClick={() => handleViewModeChange(data.viewMode === "list" ? "wheel" : "list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  data.viewMode === "list" 
                    ? "bg-teal-100 text-teal-700 border border-teal-300" 
                    : "text-gray-500 hover:text-teal-600 hover:bg-teal-50"
                }`}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Text Mode"
              onClick={() => handleViewModeChange(data.viewMode === "text" ? "wheel" : "text")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  data.viewMode === "text" 
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-300" 
                    : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
            >
              <Type className="w-4 h-4" />
            </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                title="Shuffle" 
                onClick={shuffleTeams}
                className="p-2 rounded-lg transition-all duration-200 text-gray-500 hover:text-purple-600 hover:bg-purple-50"
              >
              <Shuffle className="w-4 h-4" />
            </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                title="Sort A-Z" 
                onClick={sortTeamsAlphabetically}
                className="p-2 rounded-lg transition-all duration-200 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
              >
              <RotateCcw className="w-4 h-4" />
            </Button>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="bg-white rounded-xl p-2 border border-slate-200 mb-6 flex space-x-2">
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
          <div className="space-y-6">
            {/* League Selection */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <label className="block text-sm font-semibold text-blue-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Select League
              </label>
              <div className="grid grid-cols-3 gap-4">
                {leagues.map((league) => (
                  <Button
                    key={league.id}
                    variant={data.selectedLeague === league.id ? "default" : "outline"}
                    className={`h-20 flex flex-col items-center justify-center space-y-2 transition-all duration-200 transform hover:scale-105 ${
                      data.selectedLeague === league.id 
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25" 
                        : "bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border-blue-200 hover:border-blue-300"
                    }`}
                    onClick={() => handleLeagueChange(league.id as "all" | "American" | "National")}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                      data.selectedLeague === league.id 
                        ? "bg-white/20 backdrop-blur-sm" 
                        : getLeagueBgColor(league.id)
                    }`}>
                      <span className={`text-lg ${data.selectedLeague === league.id ? "text-white" : "text-white"}`}>
                        {getLeagueIcon(league.id)}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold ${data.selectedLeague === league.id ? "text-white" : "text-blue-700"}`}>
                      {league.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Selected Count */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between p-4 h-auto bg-white/80 hover:bg-white transition-all duration-200 border-green-300 hover:border-green-400"
                onClick={() => setShowTeamList(!showTeamList)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-800">
                  {data.selectedTeams.length} selected of {mlbTeams.length}
                </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-green-600 transition-transform duration-200 ${showTeamList ? "rotate-180" : ""}`} />
              </Button>
            </div>

            {/* Display Mode */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
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



            {/* Custom Teams Display */}
            {customTeams.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                <label className="block text-sm font-semibold text-purple-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Custom Teams ({customTeams.length})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {customTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          checked={data.selectedTeams.some(t => t.id === team.id)}
                          onCheckedChange={() => toggleTeam(team)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-2xl">⚾</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{team.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
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
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                <div className="max-h-96 overflow-y-auto space-y-6">
                    {/* Group teams by division */}
                    {(() => {
                      const teamsByDivision = data.selectedTeams.reduce((acc, team) => {
                        const division = team.division;
                        if (!acc[division]) {
                          acc[division] = [];
                        }
                        acc[division].push(team);
                        return acc;
                      }, {} as Record<string, MLBTeam[]>);

                      return Object.entries(teamsByDivision).map(([division, teams]) => (
                      <div key={division} className="space-y-3">
                          {/* Division Header */}
                        <div className="flex items-center space-x-3 py-3 px-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg border border-orange-300">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <h4 className="font-bold text-orange-800 text-sm uppercase tracking-wide">
                              {division} Division
                            </h4>
                          <span className="text-xs text-orange-700 bg-orange-200 px-3 py-1 rounded-full font-semibold">
                              {(teams as MLBTeam[]).length} team{(teams as MLBTeam[]).length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          {/* Teams in this division */}
                        <div className="space-y-3 pl-4">
                            {(teams as MLBTeam[]).map((team) => (
                              <div
                                key={team.id}
                              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                                data.selectedTeams.some(t => t.id === team.id)
                                  ? "bg-gradient-to-r from-orange-100 to-amber-100 border-orange-400 shadow-lg shadow-orange-500/20"
                                  : "bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 border-orange-200 hover:border-orange-300"
                              }`}
                            >
                              <div className="flex items-center space-x-4">
                                  <Checkbox
                                    checked={data.selectedTeams.some(t => t.id === team.id)}
                                    onCheckedChange={() => toggleTeam(team)}
                                  className={`w-5 h-5 ${
                                    data.selectedTeams.some(t => t.id === team.id) 
                                      ? "text-orange-600 border-orange-600" 
                                      : "text-orange-400 border-orange-300"
                                  }`}
                                />
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                                  data.selectedTeams.some(t => t.id === team.id)
                                    ? "bg-gradient-to-br from-orange-500 to-amber-500"
                                    : "bg-gradient-to-br from-orange-100 to-amber-100"
                                }`}>
                                  <span className="text-2xl">{team.logo}</span>
                                </div>
                                  <div className="flex-1">
                                  <div className={`font-bold text-sm ${
                                    data.selectedTeams.some(t => t.id === team.id) ? "text-orange-800" : "text-gray-800"
                                  }`}>
                                    {team.name}
                                    </div>
                                  <div className="text-xs text-gray-600 flex items-center space-x-2">
                                    <span className="flex items-center">
                                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                                      {team.city}
                                    </span>
                                    <span className="flex items-center">
                                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                      {team.league} League
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedTeam(team)
                                      setShowTeamDetailsModal(true)
                                    }}
                                    title="Team Details"
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                  >
                                    <BarChart3 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => isFavorite(team.id) ? removeFromFavorites(team.id) : addToFavorites(team)}
                                    title={isFavorite(team.id) ? "Remove from favorites" : "Add to favorites"}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isFavorite(team.id) 
                                      ? "text-red-500 hover:text-red-700 hover:bg-red-50" 
                                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                  }`}
                                  >
                                    <Heart className={`w-4 h-4 ${isFavorite(team.id) ? "fill-current" : ""}`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => isInComparison(team.id) ? removeFromComparison(team.id) : addToComparison(team)}
                                    title={isInComparison(team.id) ? "Remove from comparison" : "Add to comparison"}
                                    disabled={!isInComparison(team.id) && data.comparisonTeams.length >= 4}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isInComparison(team.id) 
                                      ? "text-blue-500 hover:text-blue-700 hover:bg-blue-50" 
                                      : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                                  }`}
                                  >
                                    {isInComparison(team.id) ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                </div>
              </div>
            )}

            {/* View Mode Display */}
            {data.viewMode === "list" && (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <h4 className="font-bold text-teal-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  List View
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {data.selectedTeams.map((team) => (
                    <div key={team.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-teal-200 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all duration-200 transform hover:scale-105">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-lg">{team.logo}</span>
                      </div>
                      <span className="text-sm font-semibold text-teal-800 truncate">{team.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {data.viewMode === "text" && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <h4 className="font-bold text-indigo-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Text Mode
                </h4>
                  <div className="max-h-64 overflow-y-auto">
                  <div className="text-sm leading-relaxed bg-white p-4 rounded-lg border border-indigo-200">
                      {data.selectedTeams.map((team, index) => (
                      <span key={team.id} className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-2 py-1 rounded-md mr-2 mb-2">
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
                  <span className="text-3xl">⚾</span>
                </div>
                <h3 className="font-bold text-gray-700 mb-2">No teams selected</h3>
                <p className="text-gray-600 mb-4">Choose a league and select teams to get started!</p>
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

            {/* AI Creative Hub - New Section */}
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-violet-600" />
                  <span className="text-xl">AI Creative Hub</span>
                </CardTitle>
                <p className="text-violet-700 text-sm">Unleash the power of AI to create unique baseball experiences</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Creative AI Tools Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => generateAICreativeContent("story")}
                    disabled={isGeneratingAI}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border-blue-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-semibold">Story Mode</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => generateAICreativeContent("poem")}
                    disabled={isGeneratingAI}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 border-green-200 hover:border-green-300 transition-all duration-200"
                  >
                    <Music className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-semibold">Poetry</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => generateAICreativeContent("rap")}
                    disabled={isGeneratingAI}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 border-orange-200 hover:border-orange-300 transition-all duration-200"
                  >
                    <Mic className="w-5 h-5 text-orange-600" />
                    <span className="text-xs font-semibold">Rap Battle</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => generateAICreativeContent("comedy")}
                    disabled={isGeneratingAI}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gradient-to-br hover:from-yellow-50 hover:to-amber-50 border-yellow-200 hover:border-yellow-300 transition-all duration-200"
                  >
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span className="text-xs font-semibold">Comedy</span>
                  </Button>
                </div>

                {/* AI Creative Output */}
                {aiCreativeContent && (
                  <div className="p-4 bg-white rounded-lg border border-violet-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-violet-600" />
                        <span className="font-semibold text-violet-800">{aiCreativeContent.type}</span>
                        {aiCreativeContent.currentTeam && (
                          <Badge variant="secondary" className="bg-violet-100 text-violet-800">
                            {aiCreativeContent.currentTeam.name}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAiCreativeContent(null)}
                        className="text-violet-600 hover:text-violet-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-3 rounded-lg mb-3">
                      <p className="text-violet-800 text-sm leading-relaxed whitespace-pre-wrap">{aiCreativeContent.content}</p>
                    </div>
                    
                    {/* Suggested Teams for Next Spin */}
                    {aiCreativeContent.suggestedTeams && aiCreativeContent.suggestedTeams.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-800">Suggested for Next Spin:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {aiCreativeContent.suggestedTeams.map((teamName, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Find the team and add it to selected teams
                                const team = mlbTeams.find(t => 
                                  t.name.toLowerCase().includes(teamName.toLowerCase()) ||
                                  teamName.toLowerCase().includes(t.name.toLowerCase())
                                )
                                if (team) {
                                  // Check if team is already selected
                                  const isAlreadySelected = data.selectedTeams.some(t => t.id === team.id)
                                  
                                  if (isAlreadySelected) {
                                    showToast(`${team.name} is already on the wheel!`, "info")
                                  } else {
                                    // Add team to existing selected teams
                                    updateWheelData("mlb-wheel", wheel?.id || "", {
                                      ...data,
                                      selectedTeams: [...data.selectedTeams, team]
                                    })
                                    showToast(`Added ${team.name} to wheel! Spin to see the result!`, "success")
                                  }
                                }
                              }}
                              className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
                            >
                              {teamName}
                            </Button>
                          ))}
                        </div>
                        <p className="text-blue-600 text-xs mt-2">
                          💡 Click a team to add it to your wheel and spin!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Prediction from User Input */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gem className="w-5 h-5 text-emerald-600" />
                  <span>AI Prediction Engine</span>
                </CardTitle>
                <p className="text-emerald-700 text-sm">Advanced AI analysis for game predictions</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-2">
                    Describe your scenario:
                  </label>
                  <Textarea
                    placeholder="e.g., 'Yankees vs Red Sox, Yankees won 3 games in a row, home field advantage, strong pitching, recent injuries...'"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[120px] resize-none border-emerald-200 focus:border-emerald-400"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-700">
                    AI will analyze patterns and predict outcomes
                  </span>
                  <Button
                    onClick={() => generateAIPredictionFromInput(userInput)}
                    disabled={!userInput.trim() || isGeneratingPrediction}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg"
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
                  <div className="p-4 bg-emerald-100 rounded-lg border border-emerald-300">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gem className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-800">AI Prediction:</span>
                    </div>
                    <p className="text-emerald-700 text-sm leading-relaxed">{aiPredictionResponse}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* League Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select League:</label>
              <Select value={data.selectedLeague} onValueChange={handleLeagueChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leagues</SelectItem>
                  <SelectItem value="American">American League</SelectItem>
                  <SelectItem value="National">National League</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Smart Team Recommendations */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <span>Smart Recommendations</span>
                </CardTitle>
                <p className="text-yellow-700 text-sm">AI-powered team suggestions based on your mood</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => generateMoodBasedRecommendations("lucky")}
                    className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 border-yellow-200 hover:border-yellow-300 transition-all duration-200"
                  >
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <span className="text-xs font-semibold">Feeling Lucky</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateMoodBasedRecommendations("underdog")}
                    className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border-blue-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-semibold">Underdog Mode</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateMoodBasedRecommendations("classic")}
                    className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 border-amber-200 hover:border-amber-300 transition-all duration-200"
                  >
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-semibold">Classic Teams</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => generateMoodBasedRecommendations("modern")}
                    className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border-purple-200 hover:border-purple-300 transition-all duration-200"
                  >
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-semibold">Modern Era</span>
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
                    <Brain className="w-4 h-4 mr-2" />
                    {isGeneratingSuggestions ? "Generating..." : "Generate"}
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

            {/* AI Insights & Predictions */}
            {aiInsights && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>AI Insights & Predictions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Performance Prediction</span>
                      </div>
                      <p className="text-sm text-blue-700">{aiInsights.performancePrediction}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Fun Fact</span>
                      </div>
                      <p className="text-sm text-green-700">{aiInsights.funFact}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">AI Matchup</span>
                      </div>
                      <p className="text-sm text-purple-700">{aiInsights.aiMatchup}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Trophy className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Season Outlook</span>
                      </div>
                      <p className="text-sm text-orange-700">{aiInsights.seasonOutlook}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Trivia */}
            {aiTrivia && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span>AI Trivia Challenge</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="font-medium text-indigo-800 mb-2">{aiTrivia.question}</p>
                    <p className="text-sm text-indigo-600 mb-3">💡 Hint: {aiTrivia.hint}</p>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-indigo-700 font-medium">Show Answer</summary>
                      <p className="mt-2 text-indigo-800 font-semibold">{aiTrivia.answer}</p>
                    </details>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Predictions */}
            {aiPrediction && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                                         <Gem className="w-5 h-5 text-purple-600" />
                    <span>AI Predictions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-800">Season Prediction</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">{aiPrediction.seasonPrediction}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Playoff Chance</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">{aiPrediction.playoffChance}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">Fantasy Impact</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">{aiPrediction.fantasyImpact}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Entertainment */}
            {aiEntertainment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Music className="w-5 h-5 text-pink-600" />
                    <span>AI Entertainment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Mic className="w-4 h-4 text-pink-600" />
                        <span className="text-sm font-medium text-pink-800">Team Roast</span>
                      </div>
                      <p className="text-sm text-pink-700 italic">"{aiEntertainment.teamRoast}"</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Music className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Victory Song</span>
                      </div>
                      <p className="text-sm text-yellow-700">{aiEntertainment.victorySong}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Team Personality</span>
                      </div>
                      <p className="text-sm text-orange-700">{aiEntertainment.teamPersonality}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Learning */}
            {aiLearning && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    <span>AI Learning</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">Baseball IQ</span>
                      </div>
                      <p className="text-sm text-emerald-700">{aiLearning.baseballIQ}</p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-medium text-teal-800">Strategy Insights</span>
                      </div>
                      <p className="text-sm text-teal-700">{aiLearning.strategyInsights}</p>
                    </div>
                    <div className="p-3 bg-cyan-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Trophy className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm font-medium text-cyan-800">Historical Lessons</span>
                      </div>
                      <p className="text-sm text-cyan-700">{aiLearning.historicalLessons}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Social Features */}
            {aiSocial && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-violet-600" />
                    <span>AI Social Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-violet-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <HeartIcon className="w-4 h-4 text-violet-600" />
                        <span className="text-sm font-medium text-violet-800">AI Matchmaker</span>
                      </div>
                      <p className="text-sm text-violet-700">{aiSocial.aiMatchmaker}</p>
                    </div>
                    <div className="p-3 bg-fuchsia-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TargetIcon className="w-4 h-4 text-fuchsia-600" />
                        <span className="text-sm font-medium text-fuchsia-800">Group Challenge</span>
                      </div>
                      <p className="text-sm text-fuchsia-700">{aiSocial.groupChallenge}</p>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-rose-600" />
                        <span className="text-sm font-medium text-rose-800">Trending</span>
                      </div>
                      <p className="text-sm text-rose-700">{aiSocial.trending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Advanced Analysis Hub */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  <span className="text-xl">AI Advanced Analysis Hub</span>
                </CardTitle>
                <p className="text-indigo-700 text-sm">Deep dive into advanced baseball analytics and insights</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Analysis Tools Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={generateAIFantasyDraft}
                    disabled={isGeneratingAI}
                    className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 border-green-200 hover:border-green-300 transition-all duration-200"
                  >
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold">Fantasy Draft</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={generateAIHistoricalAnalysis}
                    disabled={isGeneratingAI}
                    className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 border-amber-200 hover:border-amber-300 transition-all duration-200"
                  >
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-semibold">History</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={generateAITeamChemistry}
                    disabled={isGeneratingAI}
                    className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 border-purple-200 hover:border-purple-300 transition-all duration-200"
                  >
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold">Chemistry</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={generateAIWeatherImpact}
                    disabled={isGeneratingAI}
                    className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 border-cyan-200 hover:border-cyan-300 transition-all duration-200"
                  >
                    <Cloud className="w-4 h-4 text-cyan-600" />
                    <span className="text-xs font-semibold">Weather</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={generateAIFanPerspective}
                    disabled={isGeneratingAI}
                    className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 border-pink-200 hover:border-pink-300 transition-all duration-200"
                  >
                    <Heart className="w-4 h-4 text-pink-600" />
                    <span className="text-xs font-semibold">Fan View</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const randomTeam = mlbTeams[Math.floor(Math.random() * mlbTeams.length)]
                      generateAllAIFeatures(randomTeam)
                    }}
                    disabled={isGeneratingAI}
                    className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 border-indigo-200 hover:border-indigo-300 transition-all duration-200"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-semibold">All Features</span>
                  </Button>
                </div>

                {/* Analysis Results */}
                {aiFantasyDraft && (
                  <div className="p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-800">Fantasy Draft Analysis</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAiFantasyDraft(null)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-green-50 rounded">
                        <span className="text-xs font-medium text-green-700">Team Value:</span>
                        <p className="text-sm font-semibold text-green-800">{aiFantasyDraft.teamValue}</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <span className="text-xs font-medium text-green-700">Draft Position:</span>
                        <p className="text-sm font-semibold text-green-800">{aiFantasyDraft.draftPosition}</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <span className="text-xs font-medium text-green-700">Risk Factor:</span>
                        <p className="text-sm font-semibold text-green-800">{aiFantasyDraft.riskFactor}</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <span className="text-xs font-medium text-green-700">Chemistry Score:</span>
                        <p className="text-sm font-semibold text-green-800">{aiFantasyDraft.chemistryScore}</p>
                      </div>
                    </div>
                  </div>
                )}

                {aiHistoricalAnalysis && (
                  <div className="p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold text-amber-800">Historical Analysis</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAiHistoricalAnalysis(null)}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-amber-50 rounded">
                        <span className="text-xs font-medium text-amber-700">Era:</span>
                        <p className="text-sm font-semibold text-amber-800">{aiHistoricalAnalysis.era}</p>
                      </div>
                      <div className="p-2 bg-amber-50 rounded">
                        <span className="text-xs font-medium text-amber-700">Defining Moment:</span>
                        <p className="text-sm text-amber-800">{aiHistoricalAnalysis.definingMoment}</p>
                      </div>
                      <div className="p-2 bg-amber-50 rounded">
                        <span className="text-xs font-medium text-amber-700">Cultural Impact:</span>
                        <p className="text-sm text-amber-800">{aiHistoricalAnalysis.culturalImpact}</p>
                      </div>
                    </div>
                  </div>
                )}

                {aiTeamChemistry && (
                  <div className="p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-purple-800">Team Chemistry</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAiTeamChemistry(null)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-purple-50 rounded">
                        <span className="text-xs font-medium text-purple-700">Locker Room:</span>
                        <p className="text-sm font-semibold text-purple-800">{aiTeamChemistry.lockerRoomVibe}</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <span className="text-xs font-medium text-purple-700">Chemistry Score:</span>
                        <p className="text-sm font-semibold text-purple-800">{aiTeamChemistry.chemistryScore}</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <span className="text-xs font-medium text-purple-700">Leadership:</span>
                        <p className="text-sm text-purple-800">{aiTeamChemistry.leadershipQuality}</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <span className="text-xs font-medium text-purple-700">Winning Factor:</span>
                        <p className="text-sm text-purple-800">{aiTeamChemistry.winningFactor}</p>
                      </div>
                    </div>
                  </div>
                )}

                {aiWeatherImpact && (
                  <div className="p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Cloud className="w-4 h-4 text-cyan-600" />
                        <span className="font-semibold text-cyan-800">Weather Impact</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAiWeatherImpact(null)}
                        className="text-cyan-600 hover:text-cyan-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-cyan-50 rounded">
                        <span className="text-xs font-medium text-cyan-700">Home Advantage:</span>
                        <p className="text-sm text-cyan-800">{aiWeatherImpact.homeAdvantage}</p>
                      </div>
                      <div className="p-2 bg-cyan-50 rounded">
                        <span className="text-xs font-medium text-cyan-700">Wind Factor:</span>
                        <p className="text-sm text-cyan-800">{aiWeatherImpact.windFactor}</p>
                      </div>
                      <div className="p-2 bg-cyan-50 rounded">
                        <span className="text-xs font-medium text-cyan-700">Temperature Effect:</span>
                        <p className="text-sm text-cyan-800">{aiWeatherImpact.temperatureEffect}</p>
                      </div>
                    </div>
                  </div>
                )}

                {aiFanPerspective && (
                  <div className="p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-pink-600" />
                        <span className="font-semibold text-pink-800">Fan Perspective</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAiFanPerspective(null)}
                        className="text-pink-600 hover:text-pink-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-pink-50 rounded">
                        <span className="text-xs font-medium text-pink-700">Fan Loyalty:</span>
                        <p className="text-sm font-semibold text-pink-800">{aiFanPerspective.fanLoyalty}</p>
                      </div>
                      <div className="p-2 bg-pink-50 rounded">
                        <span className="text-xs font-medium text-pink-700">Game Day:</span>
                        <p className="text-sm text-pink-800">{aiFanPerspective.gameDayExperience}</p>
                      </div>
                      <div className="p-2 bg-pink-50 rounded">
                        <span className="text-xs font-medium text-pink-700">Community:</span>
                        <p className="text-sm text-pink-800">{aiFanPerspective.communityConnection}</p>
                      </div>
                      <div className="p-2 bg-pink-50 rounded">
                        <span className="text-xs font-medium text-pink-700">Traditions:</span>
                        <p className="text-sm text-pink-800">{aiFanPerspective.traditionStrength}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generate All AI Features Button */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <Button
                    onClick={() => {
                      const randomTeam = mlbTeams[Math.floor(Math.random() * mlbTeams.length)]
                      generateAllAIFeatures(randomTeam)
                    }}
                    disabled={isGeneratingAI}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 w-full h-12 shadow-lg"
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
                  <p className="text-xs text-purple-600 mt-2 font-medium">Experience the full AI-powered MLB experience!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Team Details Modal */}
      <MLBTeamDetailsModal
        isOpen={showTeamDetailsModal}
        onClose={() => setShowTeamDetailsModal(false)}
        team={selectedTeam}
      />

      {/* Favorites Modal */}
      <MLBFavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
      />

      {/* Comparison Modal */}
      <MLBComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
      />
    </>
  )
})

export default MLBInputPanel