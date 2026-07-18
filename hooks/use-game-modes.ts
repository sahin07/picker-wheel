"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import type { WheelItem, BingoCard, MemoryChallenge, GameStats } from "@/lib/types"

interface UseGameModesProps {
  enabledItems: WheelItem[]
  selectedItem: WheelItem | null
  setSelectedItem: React.Dispatch<React.SetStateAction<WheelItem | null>>
}

export function useGameModes({ enabledItems, selectedItem, setSelectedItem }: UseGameModesProps) {
  const [gameMode, setGameMode] = useState("normal")
  const [bingoCard, setBingoCard] = useState<BingoCard | null>(null)
  const [memoryChallenge, setMemoryChallenge] = useState<MemoryChallenge | null>(null)
  const [collectionProgress, setCollectionProgress] = useState<WheelItem[]>([])
  const [sequenceTarget, setSequenceTarget] = useState<WheelItem[]>([])
  const [sequenceProgress, setSequenceProgress] = useState<WheelItem[]>([])
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
    (selected: WheelItem) => {
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
      enabledItems,
      gameStats,
    ],
  )

  // Bingo Game Logic
  const createBingoCard = useCallback(() => {
    if (enabledItems.length < 9) return

    const shuffled = [...enabledItems].sort(() => Math.random() - 0.5)
    const cells = shuffled.slice(0, 9)
    cells.splice(4, 0, null) // Add null for center free space

    const newCard: BingoCard = {
      id: `bingo-${Date.now()}`,
      cells,
      markedCells: new Array(10).fill(false),
      isWinner: false,
    }
    newCard.markedCells[4] = true // Mark center as free space

    setBingoCard(newCard)
    setGameMode("bingo")
    setIsGameActive(true)
    setGameTimer(300) // 5 minutes
    setSelectedItem(null) // Clear previous selection
  }, [enabledItems, setGameMode, setSelectedItem])

  const handleBingoSpin = useCallback(
    (selected: WheelItem) => {
      if (!bingoCard) return
      const cellIndex = bingoCard.cells.findIndex((cell) => cell?.id === selected.id)
      if (cellIndex !== -1 && !bingoCard.markedCells[cellIndex]) {
        const newMarkedCells = [...bingoCard.markedCells]
        newMarkedCells[cellIndex] = true
        const updatedCard = { ...bingoCard, markedCells: newMarkedCells }

        if (checkBingo(newMarkedCells)) {
          updatedCard.isWinner = true
          setGameStats((prev) => ({
            ...prev,
            bingoWins: prev.bingoWins + 1,
            currentStreak: prev.currentStreak + 1,
            fastestBingo: prev.fastestBingo === 0 ? 300 - gameTimer : Math.min(prev.fastestBingo, 300 - gameTimer),
          }))
          setIsGameActive(false)
        }
        setBingoCard(updatedCard)
      }
    },
    [bingoCard, checkBingo, gameTimer, setGameStats],
  )

  // Memory Challenge Logic
  const startMemoryChallenge = useCallback(() => {
    if (enabledItems.length < 3) return
    const targetCount = Math.min(5, enabledItems.length)
    const targets = [...enabledItems].sort(() => Math.random() - 0.5).slice(0, targetCount)

    const newChallenge: MemoryChallenge = {
      id: `memory-${Date.now()}`,
      targetImages: targets,
      foundImages: [],
      timeLimit: 60,
      timeRemaining: 60,
      isActive: true,
      isCompleted: false,
      score: 0,
    }
    setMemoryChallenge(newChallenge)
    setGameMode("memory")
    setIsGameActive(true)
    setGameTimer(60)
    setSelectedItem(null)

    // Show targets briefly
    setTimeout(() => {
      setMemoryChallenge((prev) => (prev ? { ...prev, isActive: false } : null))
    }, 3000)
  }, [enabledItems, setGameMode, setSelectedItem])

  const handleMemorySpin = useCallback(
    (selected: WheelItem) => {
      if (!memoryChallenge || memoryChallenge.isCompleted) return
      const isTarget = memoryChallenge.targetImages.some((target) => target.id === selected.id)
      const alreadyFound = memoryChallenge.foundImages.some((found) => found.id === selected.id)

      if (isTarget && !alreadyFound) {
        const newFoundImages = [...memoryChallenge.foundImages, selected]
        const newScore = memoryChallenge.score + gameTimer * 10 // Bonus for speed
        const updatedChallenge = { ...memoryChallenge, foundImages: newFoundImages, score: newScore }

        if (newFoundImages.length === memoryChallenge.targetImages.length) {
          updatedChallenge.isCompleted = true
          setGameStats((prev) => ({
            ...prev,
            memoryWins: prev.memoryWins + 1,
            perfectMemoryRounds: prev.perfectMemoryRounds + 1,
            currentStreak: prev.currentStreak + 1,
          }))
          setIsGameActive(false)
        }
        setMemoryChallenge(updatedChallenge)
      } else if (!isTarget) {
        setMemoryChallenge((prev) => (prev ? { ...prev, score: Math.max(0, prev.score - 100) } : null))
      }
    },
    [memoryChallenge, gameTimer, setGameStats],
  )

  const endMemoryChallenge = useCallback(
    (completed: boolean) => {
      if (memoryChallenge) {
        setMemoryChallenge((prev) => (prev ? { ...prev, isCompleted: true, isActive: false } : null))
        if (!completed) {
          setGameStats((prev) => ({ ...prev, currentStreak: 0 }))
        }
      }
    },
    [memoryChallenge, setGameStats],
  )

  // Collection Race Logic
  const startCollectionRace = useCallback(() => {
    setCollectionProgress([])
    setGameMode("collection")
    setIsGameActive(true)
    setGameTimer(120) // 2 minutes
    setSelectedItem(null)
  }, [setGameMode, setSelectedItem])

  const handleCollectionSpin = useCallback(
    (selected: WheelItem) => {
      const alreadyCollected = collectionProgress.some((item) => item.id === selected.id)
      if (!alreadyCollected) {
        const newProgress = [...collectionProgress, selected]
        setCollectionProgress(newProgress)
        if (newProgress.length === enabledItems.length) {
          setGameStats((prev) => ({ ...prev, currentStreak: prev.currentStreak + 1 }))
          setIsGameActive(false)
        }
      }
    },
    [collectionProgress, enabledItems, setGameStats],
  )

  // Sequence Match Logic
  const startSequenceMatch = useCallback(() => {
    if (enabledItems.length < 3) return
    const sequenceLength = Math.min(4, enabledItems.length)
    const sequence = [...enabledItems].sort(() => Math.random() - 0.5).slice(0, sequenceLength)

    setSequenceTarget(sequence)
    setSequenceProgress([])
    setGameMode("sequence")
    setIsGameActive(true)
    setGameTimer(90)
    setSelectedItem(null)
  }, [enabledItems, setGameMode, setSelectedItem])

  const handleSequenceSpin = useCallback(
    (selected: WheelItem) => {
      const nextExpected = sequenceTarget[sequenceProgress.length]
      if (nextExpected && selected.id === nextExpected.id) {
        const newProgress = [...sequenceProgress, selected]
        setSequenceProgress(newProgress)
        if (newProgress.length === sequenceTarget.length) {
          setGameStats((prev) => ({ ...prev, currentStreak: prev.currentStreak + 1 }))
          setIsGameActive(false)
        }
      } else {
        setSequenceProgress([])
        setGameStats((prev) => ({ ...prev, currentStreak: 0 }))
      }
    },
    [sequenceTarget, sequenceProgress, setGameStats],
  )

  const resetGame = useCallback(() => {
    setGameMode("normal")
    setBingoCard(null)
    setMemoryChallenge(null)
    setCollectionProgress([])
    setSequenceTarget([])
    setSequenceProgress([])
    setIsGameActive(false)
    setGameTimer(0)
    setSelectedItem(null)
  }, [setGameMode, setSelectedItem])

  return {
    gameMode,
    setGameMode,
    bingoCard,
    createBingoCard,
    memoryChallenge,
    startMemoryChallenge,
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
  }
}
