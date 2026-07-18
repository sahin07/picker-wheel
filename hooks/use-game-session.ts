import { useState, useEffect, useCallback } from 'react'
import { GameMode } from '@/lib/picker-wheel-game-modes'
import { 
  GameSession, 
  GameResult, 
  createGameSession, 
  calculateSpinPoints, 
  checkGameCompletion, 
  updateGameTimer 
} from '@/lib/picker-wheel-game-session'

export function useGameSession() {
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null)
  const [isGameActive, setIsGameActive] = useState(false)
  const [timerKey, setTimerKey] = useState(0) // Force timer restart
  const [lastGameMode, setLastGameMode] = useState<GameMode | null>(null) // Store game mode for restart


  // Timer effect for games with time limits
  useEffect(() => {
    if (!currentSession || !currentSession.isActive || currentSession.timeRemaining === undefined) {
      return
    }

    const timer = setInterval(() => {
      setCurrentSession(prev => {
        if (!prev || !prev.isActive) return prev
        
        const updated = updateGameTimer(prev)
        
        // Check if time ran out
        if (updated.timeRemaining !== undefined && updated.timeRemaining <= 0) {
          setIsGameActive(false)
          return {
            ...updated,
            isActive: false,
            endTime: new Date()
          }
        }
        
        return updated
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [currentSession?.id]) // Only depend on session ID to prevent infinite loops

  const startGame = useCallback((gameMode: GameMode) => {
    const session = createGameSession(gameMode)
    
    setCurrentSession(session)
    setLastGameMode(gameMode) // Store game mode for restart
    setIsGameActive(true)
    
    return session
  }, [])

  const endGame = useCallback(() => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        isActive: false,
        endTime: new Date()
      } : null)
      setIsGameActive(false)
    }
  }, [currentSession])

  const restartGame = useCallback(() => {
    // Use lastGameMode if currentSession is null (game completed)
    const gameModeToRestart = currentSession?.gameMode || lastGameMode
    
    if (gameModeToRestart) {
      // First, completely clear the current session to force timer reset
      setCurrentSession(null)
      setIsGameActive(false)
      
      // Force timer restart by incrementing the key
      setTimerKey(prev => prev + 1)
      
      // Small delay to ensure the timer effect is cleared
      setTimeout(() => {
        // Create a new session with the same game mode
        const newSession = createGameSession(gameModeToRestart)
        
        // Set the new session and activate the game
        setCurrentSession(newSession)
        setIsGameActive(true)
      }, 100)
      
      return null
    }
  }, [currentSession, lastGameMode])

  const recordSpin = useCallback((result: string) => {
    console.log('recordSpin called with result:', result);
    setCurrentSession(prevSession => {
      if (!prevSession || !prevSession.isActive) {
        console.log('No active session, returning');
        return prevSession;
      }

      // Check if this result was already recorded in the last few seconds
      const now = new Date();
      const recentResults = prevSession.results.filter(r => {
        const timeDiff = now.getTime() - r.timestamp.getTime();
        return timeDiff < 2000 && r.result === result; // Check last 2 seconds
      });

      if (recentResults.length > 0) {
        console.log('Duplicate result detected, skipping:', result);
        return prevSession;
      }

      console.log('Recording spin for session:', {
        currentSpin: prevSession.currentSpin,
        totalSpins: prevSession.totalSpins,
        score: prevSession.score
      });

      const { points, bonus } = calculateSpinPoints(
        prevSession.gameMode,
        prevSession.currentSpin + 1,
        result,
        prevSession.results
      )

      const gameResult: GameResult = {
        spinNumber: prevSession.currentSpin + 1,
        result,
        timestamp: new Date(),
        points,
        bonus
      }

      const updatedSession = {
        ...prevSession,
        currentSpin: prevSession.currentSpin + 1,
        score: prevSession.score + points + (bonus || 0),
        results: [...prevSession.results, gameResult]
      }

      console.log('Updated session:', {
        currentSpin: updatedSession.currentSpin,
        score: updatedSession.score,
        points,
        bonus
      });

      // Check if game is complete
      if (checkGameCompletion(updatedSession)) {
        updatedSession.isActive = false
        updatedSession.endTime = new Date()
        setIsGameActive(false)
      }

      return updatedSession;
    });
    
    return null; // Return value not used
  }, []) // Keep empty dependency array to avoid infinite loops

  const getGameProgress = useCallback(() => {
    if (!currentSession) {
      return {
        currentSpin: 0,
        totalSpins: 0,
        progress: 0,
        timeRemaining: undefined,
        score: 0
      }
    }

    const progress = {
      currentSpin: currentSession.currentSpin,
      totalSpins: currentSession.totalSpins,
      progress: (currentSession.currentSpin / currentSession.totalSpins) * 100,
      timeRemaining: currentSession.timeRemaining,
      score: currentSession.score
    }
    
    return progress
  }, [currentSession])

  const isGameComplete = useCallback(() => {
    return currentSession ? !currentSession.isActive : false
  }, [currentSession])

  const getGameScore = useCallback(() => {
    return currentSession?.score || 0
  }, [currentSession])

  const getGameResults = useCallback(() => {
    return currentSession?.results || []
  }, [currentSession])

  const getGameStats = useCallback(() => {
    if (!currentSession) return null

    const results = currentSession.results
    const totalSpins = results.length
    const totalPoints = results.reduce((sum, r) => sum + r.points + (r.bonus || 0), 0)
    const averagePoints = totalSpins > 0 ? totalPoints / totalSpins : 0
    const maxPoints = Math.max(...results.map(r => r.points + (r.bonus || 0)), 0)
    const minPoints = Math.min(...results.map(r => r.points + (r.bonus || 0)), 0)

    return {
      gameMode: currentSession.gameMode.name,
      totalSpins,
      totalPoints,
      averagePoints,
      maxPoints,
      minPoints,
      duration: currentSession.endTime 
        ? currentSession.endTime.getTime() - currentSession.startTime.getTime()
        : Date.now() - currentSession.startTime.getTime()
    }
  }, [currentSession])

  return {
    currentSession,
    isGameActive,
    timerKey,
    lastGameMode,
    startGame,
    endGame,
    restartGame,
    recordSpin,
    getGameProgress,
    isGameComplete,
    getGameScore,
    getGameResults,
    getGameStats
  }
} 