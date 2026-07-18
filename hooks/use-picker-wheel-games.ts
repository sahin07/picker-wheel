"use client"

import { useState, useEffect, useCallback } from "react"

interface WheelOption {
  id: string
  name: string
  image?: string
  color?: string
}

interface BingoCard {
  id: string
  cells: (WheelOption | null)[]
  markedCells: boolean[]
  isWinner: boolean
}

interface MemoryChallenge {
  id: string
  targetOptions: WheelOption[]
  foundOptions: WheelOption[]
  timeLimit: number
  timeRemaining: number
  isActive: boolean
  isCompleted: boolean
  score: number
}

interface GameStats {
  bingoWins: number
  memoryWins: number
  totalSpins: number
  perfectMemoryRounds: number
  fastestMemoryRounds: number
  fastestBingo: number
  currentStreak: number
}

interface UsePickerWheelGamesProps {
  options: WheelOption[]
  selectedOption: WheelOption | null
  setSelectedOption: (option: WheelOption | null) => void
}

export function usePickerWheelGames({ options, selectedOption, setSelectedOption }: UsePickerWheelGamesProps) {
  // Ensure options is always an array to prevent undefined errors
  const safeOptions = options || [];
  
  const [gameMode, setGameMode] = useState("normal")
  const [bingoCard, setBingoCard] = useState<BingoCard | null>(null)
  const [memoryChallenge, setMemoryChallenge] = useState<MemoryChallenge | null>(null)
  const [collectionProgress, setCollectionProgress] = useState<WheelOption[]>([])
  const [sequenceTarget, setSequenceTarget] = useState<WheelOption[]>([])
  const [sequenceProgress, setSequenceProgress] = useState<WheelOption[]>([])
  const [gameTimer, setGameTimer] = useState<number>(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const [gameStats, setGameStats] = useState<GameStats>({
    bingoWins: 0,
    memoryWins: 0,
    totalSpins: 0,
    perfectMemoryRounds: 0,
    fastestMemoryRounds: 0,
    fastestBingo: 0,
    currentStreak: 0,
  })

  // Game timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isGameActive && gameTimer > 0) {
      interval = setInterval(() => {
        setGameTimer((prev) => {
          if (prev <= 1) {
            setIsGameActive(false)
            if (memoryChallenge) {
              endMemoryChallenge(false)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isGameActive, gameTimer, memoryChallenge])

  const checkBingo = useCallback((markedCells: boolean[]): boolean => {
    const patterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]
    return patterns.some((pattern) => pattern.every((index) => markedCells[index]))
  }, [])

  const handleGameSpin = useCallback(
    (selected: WheelOption) => {
      switch (gameMode) {
        case "bingo":
          handleBingoSpin(selected)
          break
        case "memory":
          handleMemorySpin(selected)
          break
        case "collection":
          handleCollectionSpin(selected)
          break
        case "sequence":
          handleSequenceSpin(selected)
          break
      }
    },
    [
      gameMode,
      bingoCard,
      memoryChallenge,
      collectionProgress,
      sequenceTarget,
      sequenceProgress,
      gameTimer,
      safeOptions,
      gameStats,
    ],
  )

  // Bingo Game Logic
  const createBingoCard = useCallback(() => {
    if (safeOptions.length < 9) {
      return
    }

    const shuffledOptions = [...safeOptions].sort(() => Math.random() - 0.5)
    const bingoOptions = shuffledOptions.slice(0, 9)
    
    const newBingoCard: BingoCard = {
      id: Date.now().toString(),
      cells: bingoOptions,
      markedCells: new Array(9).fill(false),
      isWinner: false,
    }
    
    setBingoCard(newBingoCard)
    setIsGameActive(true)
  }, [safeOptions])

  // Recreate bingo card when options change in bingo mode
  useEffect(() => {
    if (gameMode === "bingo" && safeOptions.length >= 9 && !bingoCard) {
      createBingoCard()
    }
  }, [gameMode, safeOptions.length, bingoCard, createBingoCard])

  const handleBingoSpin = useCallback(
    (selected: WheelOption) => {
      if (!bingoCard) return

      const cellIndex = bingoCard.cells.findIndex((cell) => cell?.id === selected.id)
      if (cellIndex === -1) return

      const newMarkedCells = [...bingoCard.markedCells]
      newMarkedCells[cellIndex] = true

      const newBingoCard = {
        ...bingoCard,
        markedCells: newMarkedCells,
        isWinner: checkBingo(newMarkedCells),
      }

      setBingoCard(newBingoCard)

      if (newBingoCard.isWinner) {
        setGameStats((prev) => ({
          ...prev,
          bingoWins: prev.bingoWins + 1,
          currentStreak: prev.currentStreak + 1,
          totalSpins: prev.totalSpins + 1,
        }))
        setIsGameActive(false)
        // Show win message
        alert("🎉 BINGO! You won!")
      }
    },
    [bingoCard, checkBingo],
  )

  // Memory Game Logic
  const createMemoryChallenge = useCallback(() => {
    if (safeOptions.length < 3) return

    const shuffledOptions = [...safeOptions].sort(() => Math.random() - 0.5)
    const targetOptions = shuffledOptions.slice(0, Math.min(5, safeOptions.length))
    
    const newMemoryChallenge: MemoryChallenge = {
      id: Date.now().toString(),
      targetOptions,
      foundOptions: [],
      timeLimit: 60,
      timeRemaining: 60,
      isActive: true,
      isCompleted: false,
      score: 0,
    }
    
    setMemoryChallenge(newMemoryChallenge)
    setGameTimer(60)
    setIsGameActive(true)
  }, [safeOptions])

  const handleMemorySpin = useCallback(
    (selected: WheelOption) => {
      if (!memoryChallenge) return

      const isTarget = memoryChallenge.targetOptions.some((target) => target.id === selected.id)
      const alreadyFound = memoryChallenge.foundOptions.some((found) => found.id === selected.id)

      if (isTarget && !alreadyFound) {
        const newFoundOptions = [...memoryChallenge.foundOptions, selected]
        const newMemoryChallenge = {
          ...memoryChallenge,
          foundOptions: newFoundOptions,
          isCompleted: newFoundOptions.length === memoryChallenge.targetOptions.length,
        }

        setMemoryChallenge(newMemoryChallenge)

        if (newMemoryChallenge.isCompleted) {
          endMemoryChallenge(true)
        }
      }
    },
    [memoryChallenge],
  )

  const endMemoryChallenge = useCallback((won: boolean) => {
    if (!memoryChallenge) return

    const endTime = Date.now()
    const timeTaken = Math.floor((endTime - parseInt(memoryChallenge.id)) / 1000)

    setMemoryChallenge((prev) => prev ? { ...prev, isActive: false, isCompleted: won } : null)
    setIsGameActive(false)

    if (won) {
      setGameStats((prev) => ({
        ...prev,
        memoryWins: prev.memoryWins + 1,
        currentStreak: prev.currentStreak + 1,
        totalSpins: prev.totalSpins + 1,
        fastestMemoryRounds: prev.fastestMemoryRounds === 0 ? timeTaken : Math.min(prev.fastestMemoryRounds, timeTaken),
      }))
      alert("🎉 Memory Challenge Complete!")
    } else {
      setGameStats((prev) => ({
        ...prev,
        currentStreak: 0,
        totalSpins: prev.totalSpins + 1,
      }))
      alert("⏰ Time's up! Memory Challenge failed.")
    }
  }, [memoryChallenge])

  // Collection Race Logic
  const startCollectionRace = useCallback(() => {
    if (safeOptions.length === 0) return

    setCollectionProgress([])
    setGameTimer(120) // 2 minutes
    setIsGameActive(true)
  }, [safeOptions])

  const handleCollectionSpin = useCallback(
    (selected: WheelOption) => {
      if (!isGameActive || gameMode !== "collection") return

      const alreadyCollected = collectionProgress.some((item) => item.id === selected.id)
      if (!alreadyCollected) {
        const newProgress = [...collectionProgress, selected]
        setCollectionProgress(newProgress)

        if (newProgress.length === safeOptions.length) {
          // All items collected!
          setGameStats((prev) => ({
            ...prev,
            currentStreak: prev.currentStreak + 1,
            totalSpins: prev.totalSpins + 1,
          }))
          setIsGameActive(false)
          alert("🎉 Collection Complete! All items found!")
        }
      }
    },
    [isGameActive, gameMode, collectionProgress, safeOptions],
  )

  // Sequence Match Logic
  const startSequenceMatch = useCallback(() => {
    if (safeOptions.length < 3) return

    const shuffledOptions = [...safeOptions].sort(() => Math.random() - 0.5)
    const targetSequence = shuffledOptions.slice(0, Math.min(4, safeOptions.length))
    
    setSequenceTarget(targetSequence)
    setSequenceProgress([])
    setGameTimer(90) // 1.5 minutes
    setIsGameActive(true)
  }, [safeOptions])

  const handleSequenceSpin = useCallback(
    (selected: WheelOption) => {
      if (!isGameActive || gameMode !== "sequence" || sequenceTarget.length === 0) return

      const expectedItem = sequenceTarget[sequenceProgress.length]
      if (selected.id === expectedItem.id) {
        const newProgress = [...sequenceProgress, selected]
        setSequenceProgress(newProgress)

        if (newProgress.length === sequenceTarget.length) {
          // Sequence completed!
          setGameStats((prev) => ({
            ...prev,
            currentStreak: prev.currentStreak + 1,
            totalSpins: prev.totalSpins + 1,
          }))
          setIsGameActive(false)
          alert("🎉 Sequence Match Complete!")
        }
      } else {
        // Wrong item - reset progress
        setSequenceProgress([])
        setGameStats((prev) => ({
          ...prev,
          currentStreak: 0,
          totalSpins: prev.totalSpins + 1,
        }))
        alert("❌ Wrong item! Sequence reset.")
      }
    },
    [isGameActive, gameMode, sequenceTarget, sequenceProgress],
  )

  // Game mode management
  const startGame = useCallback((mode: string) => {
    setGameMode(mode)
    switch (mode) {
      case "bingo":
        createBingoCard()
        break
      case "memory":
        createMemoryChallenge()
        break
      case "collection":
        startCollectionRace()
        break
      case "sequence":
        startSequenceMatch()
        break
      default:
        resetGame()
    }
  }, [createBingoCard, createMemoryChallenge, startCollectionRace, startSequenceMatch])

  const resetGame = useCallback(() => {
    setGameMode("normal")
    setBingoCard(null)
    setMemoryChallenge(null)
    setCollectionProgress([])
    setSequenceTarget([])
    setSequenceProgress([])
    setGameTimer(0)
    setIsGameActive(false)
  }, [])

  return {
    gameMode,
    setGameMode,
    bingoCard,
    createBingoCard,
    memoryChallenge,
    startMemoryChallenge: createMemoryChallenge,
    collectionProgress,
    startCollectionRace,
    sequenceTarget,
    sequenceProgress,
    startSequenceMatch,
    gameTimer,
    isGameActive,
    gameStats,
    setGameStats,
    handleGameSpin,
    resetGame,
    startGame,
  }
} 