import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  ACHIEVEMENTS,
  DEFAULT_WHEEL_DESCRIPTION,
  DEFAULT_WHEEL_TITLE,
  createDefaultAlphabetSlices,
  createLetterId,
  lettersToSlices,
  LETTER_OPTIONS,
  LETTER_WHEEL_COLORS,
  parseTextToSlices,
  slicesToText,
  applyPaletteToSlices,
} from "@/lib/letter-picker-constants"
import type {
  LetterOption,
  StyleOption,
  SpinMode,
  SpinResult,
  Achievement,
  LetterSlice,
  LetterSidebarTab,
} from "@/types/letter-picker"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"

export function useLetterWheel() {
  const [letterOption, setLetterOption] = useState<LetterOption>("alphabet")
  const [styleOption, setStyleOption] = useState<StyleOption>("uppercase")
  const [customLetters, setCustomLetters] = useState<string>("")
  const [spinMode, setSpinMode] = useState<SpinMode>("normal")
  const [letterSlices, setLetterSlices] = useState<LetterSlice[]>(() => createDefaultAlphabetSlices())
  const [results, setResults] = useState<SpinResult[]>([])
  const [streak, setStreak] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [spunLetters, setSpunLetters] = useState<Set<string>>(new Set())
  const [achievements, setAchievements] = useState<Achievement[]>([...ACHIEVEMENTS])
  const [wheelTitle, setWheelTitle] = useState<string>(DEFAULT_WHEEL_TITLE)
  const [wheelDescription, setWheelDescription] = useState<string>(DEFAULT_WHEEL_DESCRIPTION)
  const [sidebarTab, setSidebarTab] = useState<LetterSidebarTab>("list")
  const [spinDurationMs, setSpinDurationMs] = useState(5000)
  const [skipPresetSync, setSkipPresetSync] = useState(false)

  const { getCurrentWheel, updateWheelData, currentWheelId } = useWheelManagerStore()
  const prevWheelId = useRef<string | null>(null)

  const syncWheelData = useCallback(
    (data: Record<string, unknown>) => {
      const wheel = getCurrentWheel()
      if (wheel) {
        updateWheelData("letter-picker-wheel", wheel.id, data)
      }
    },
    [getCurrentWheel, updateWheelData],
  )

  const activeSlices = useMemo(
    () => letterSlices.filter((s) => s.enabled && s.text.trim().length > 0),
    [letterSlices],
  )

  const currentLetters = useMemo(() => activeSlices.map((s) => s.text), [activeSlices])

  const totalWeight = useMemo(
    () => activeSlices.reduce((sum, s) => sum + Math.max(1, s.weight || 1), 0),
    [activeSlices],
  )

  const getProbability = useCallback(
    (slice: LetterSlice) => {
      if (!slice.enabled || totalWeight <= 0) return 0
      return (Math.max(1, slice.weight || 1) / totalWeight) * 100
    },
    [totalWeight],
  )

  useEffect(() => {
    const wheel = getCurrentWheel()
    if (!wheel) return

    if (prevWheelId.current !== wheel.id) {
      setResults([])
      setStreak(0)
      setScore(0)
      setSpunLetters(new Set())
      setAchievements([...ACHIEVEMENTS])
      setSkipPresetSync(true)

      if (wheel.data && Object.keys(wheel.data).length > 0) {
        const data = wheel.data as any
        const hasSlices = Array.isArray(data.letterSlices) && data.letterSlices.length > 0
        const hasLetters = Array.isArray(data.currentLetters) && data.currentLetters.length > 0

        if (hasSlices) {
          setLetterSlices(data.letterSlices)
        } else if (hasLetters) {
          setLetterSlices(lettersToSlices(data.currentLetters))
        } else {
          setLetterSlices(createDefaultAlphabetSlices())
        }

        setLetterOption(data.letterOption || "alphabet")
        setStyleOption(data.styleOption || "uppercase")
        setCustomLetters(data.customLetters || "")
        setSpinMode(data.spinMode || "normal")
        setSpinDurationMs(data.spinDurationMs || 5000)

        // Align Manage/Header "Remove winner" with loaded wheel spin mode (same as Number)
        if ((data.spinMode || "normal") === "elimination") {
          const latest = useSettingsStore.getState().settings
          if (!latest.spinBehavior.removeWinnerAfterSpin) {
            useSettingsStore.getState().updateSettings({
              spinBehavior: {
                ...latest.spinBehavior,
                removeWinnerAfterSpin: true,
              },
            })
          }
        }

        const rawResults = data.results
        const loadedResults = (Array.isArray(rawResults) ? rawResults : []).map((result: any) => ({
          ...result,
          timestamp: new Date(result?.timestamp ?? Date.now()),
        }))
        setResults(loadedResults)
        setStreak(typeof data.streak === "number" ? data.streak : 0)
        setScore(typeof data.score === "number" ? data.score : 0)
        setSpunLetters(
          new Set(Array.isArray(data.spunLetters) ? data.spunLetters : []),
        )
        setAchievements(
          Array.isArray(data.achievements) && data.achievements.length > 0
            ? data.achievements
            : [...ACHIEVEMENTS],
        )
        setWheelTitle(data.wheelTitle || DEFAULT_WHEEL_TITLE)
        setWheelDescription(data.wheelDescription || DEFAULT_WHEEL_DESCRIPTION)
      } else {
        setLetterOption("alphabet")
        setStyleOption("uppercase")
        setCustomLetters("")
        setSpinMode("normal")
        setLetterSlices(createDefaultAlphabetSlices())
        setResults([])
        setStreak(0)
        setScore(0)
        setSpunLetters(new Set())
        setAchievements([...ACHIEVEMENTS])
        setWheelTitle(DEFAULT_WHEEL_TITLE)
        setWheelDescription(DEFAULT_WHEEL_DESCRIPTION)
        setSpinDurationMs(5000)
      }

      prevWheelId.current = wheel.id
      // Allow preset sync after load settles
      setTimeout(() => setSkipPresetSync(false), 0)
    }
  }, [getCurrentWheel, currentWheelId])

  // Generate slices when preset letter options change (not when editing list manually)
  useEffect(() => {
    if (skipPresetSync) return
    if (letterOption === "custom" && !customLetters.trim()) return

    let letters: string[] = []

    switch (letterOption) {
      case "alphabet":
        letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
        break
      case "vowels":
        letters = ["A", "E", "I", "O", "U"]
        break
      case "consonants":
        letters = ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"]
        break
      case "custom":
        letters = customLetters
          .split("")
          .filter((char) => /[a-zA-Z]/.test(char))
          .map((char) => char.toUpperCase())
          .filter((char, index, arr) => arr.indexOf(char) === index)
        break
    }

    switch (styleOption) {
      case "lowercase":
        letters = letters.map((letter) => letter.toLowerCase())
        break
      case "mixed":
        letters = letters.map((letter, index) =>
          index % 2 === 0 ? letter.toUpperCase() : letter.toLowerCase(),
        )
        break
      case "uppercase":
      default:
        letters = letters.map((letter) => letter.toUpperCase())
        break
    }

    setLetterSlices((prev) => {
      // Preserve weights/colors when regenerating from presets if texts match length
      return letters.map((text, i) => {
        const prevSlice = prev[i]
        return {
          id: prevSlice?.id || createLetterId() + `-${i}`,
          text,
          weight: prevSlice?.weight ?? 1,
          enabled: prevSlice?.enabled ?? true,
          color: prevSlice?.color || LETTER_WHEEL_COLORS[i % LETTER_WHEEL_COLORS.length],
        }
      })
    })
  }, [letterOption, styleOption, customLetters, skipPresetSync])

  useEffect(() => {
    const wheel = getCurrentWheel()
    if (wheel) {
      syncWheelData({
        letterOption,
        styleOption,
        customLetters,
        spinMode,
        letterSlices,
        currentLetters,
        results,
        streak,
        score,
        spunLetters: Array.from(spunLetters),
        achievements,
        wheelTitle,
        wheelDescription,
        spinDurationMs,
        totalSpins: results.length,
        lastResult: results[results.length - 1] || null,
        recentResults: results.slice(-10),
      })
    }
  }, [
    letterOption,
    styleOption,
    customLetters,
    spinMode,
    letterSlices,
    currentLetters,
    results,
    streak,
    score,
    spunLetters,
    achievements,
    wheelTitle,
    wheelDescription,
    spinDurationMs,
    syncWheelData,
  ])

  const resetWheel = () => {
    setResults([])
    setStreak(0)
    setScore(0)
    setSpunLetters(new Set())
    setAchievements([...ACHIEVEMENTS])
  }

  const resetToAlphabet = () => {
    setSkipPresetSync(true)
    setLetterOption("alphabet")
    setStyleOption("uppercase")
    setCustomLetters("")
    setLetterSlices(createDefaultAlphabetSlices())
    setTimeout(() => setSkipPresetSync(false), 0)
  }

  const shuffleLetters = () => {
    setLetterSlices((prev) => {
      const shuffled = [...prev]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    })
  }

  const sortSlicesZA = () => {
    setSkipPresetSync(true)
    setLetterOption("custom")
    setLetterSlices((prev) => [...prev].sort((a, b) => b.text.localeCompare(a.text)))
  }

  const equalizeWeights = () => {
    setLetterSlices((prev) => prev.map((s) => ({ ...s, weight: 1 })))
  }

  const removeBlanks = () => {
    setSkipPresetSync(true)
    setLetterOption("custom")
    setLetterSlices((prev) => prev.filter((s) => s.text.trim().length > 0))
  }

  const removeDuplicates = () => {
    setSkipPresetSync(true)
    setLetterOption("custom")
    setLetterSlices((prev) => {
      const seen = new Set<string>()
      return prev.filter((s) => {
        const key = s.text.trim().toLowerCase()
        if (!key || seen.has(key)) return false
        seen.add(key)
        return true
      })
    })
  }

  const clearAllSlices = () => {
    setSkipPresetSync(true)
    setLetterOption("custom")
    setLetterSlices([])
  }

  const updateSlice = (id: string, patch: Partial<LetterSlice>) => {
    setSkipPresetSync(true)
    setLetterOption("custom")
    setLetterSlices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const addSlice = (text = "") => {
    setSkipPresetSync(true)
    setLetterOption("custom")
    setLetterSlices((prev) => [
      ...prev,
      {
        id: createLetterId(),
        text: text || String.fromCharCode(65 + (prev.length % 26)),
        weight: 1,
        enabled: true,
        color: LETTER_WHEEL_COLORS[prev.length % LETTER_WHEEL_COLORS.length],
      },
    ])
  }

  const removeSlices = (ids: string[]) => {
    setSkipPresetSync(true)
    setLetterOption("custom")
    setLetterSlices((prev) => prev.filter((s) => !ids.includes(s.id)))
  }

  const setSlicesFromText = (text: string) => {
    setSkipPresetSync(true)
    setLetterOption("custom")
    setLetterSlices((prev) => parseTextToSlices(text, prev))
  }

  const applyColorPalette = useCallback((colors: readonly string[]) => {
    setLetterSlices((prev) => applyPaletteToSlices(prev, colors))
  }, [])

  const duplicateSlices = (ids: string[]) => {
    setSkipPresetSync(true)
    setLetterOption("custom")
    setLetterSlices((prev) => {
      const clones = prev
        .filter((s) => ids.includes(s.id))
        .map((s) => ({ ...s, id: createLetterId(), text: s.text }))
      return [...prev, ...clones]
    })
  }

  const setEnabledForIds = (ids: string[], enabled: boolean) => {
    setLetterSlices((prev) => prev.map((s) => (ids.includes(s.id) ? { ...s, enabled } : s)))
  }

  const adjustWeightForIds = (ids: string[], delta: number) => {
    setLetterSlices((prev) =>
      prev.map((s) =>
        ids.includes(s.id) ? { ...s, weight: Math.max(1, (s.weight || 1) + delta) } : s,
      ),
    )
  }

  const setColorForIds = (ids: string[], color: string) => {
    setLetterSlices((prev) => prev.map((s) => (ids.includes(s.id) ? { ...s, color } : s)))
  }

  const getTextEditorValue = () => slicesToText(letterSlices)

  return {
    letterOption,
    styleOption,
    customLetters,
    spinMode,
    letterSlices,
    activeSlices,
    currentLetters,
    results,
    streak,
    score,
    spunLetters,
    achievements,
    wheelTitle,
    setWheelTitle,
    wheelDescription,
    setWheelDescription,
    sidebarTab,
    setSidebarTab,
    spinDurationMs,
    setSpinDurationMs,
    setLetterOption,
    setStyleOption,
    setCustomLetters,
    setSpinMode,
    setLetterSlices,
    setCurrentLetters: (letters: string[]) => {
      setSkipPresetSync(true)
      setLetterOption("custom")
      setLetterSlices(lettersToSlices(letters))
    },
    setResults,
    setStreak,
    setScore,
    setSpunLetters,
    setAchievements,
    resetWheel,
    resetToAlphabet,
    shuffleLetters,
    sortSlicesZA,
    equalizeWeights,
    removeBlanks,
    removeDuplicates,
    clearAllSlices,
    updateSlice,
    addSlice,
    removeSlices,
    setSlicesFromText,
    applyColorPalette,
    duplicateSlices,
    setEnabledForIds,
    adjustWeightForIds,
    setColorForIds,
    getProbability,
    getTextEditorValue,
    totalWeight,
    letterPresets: LETTER_OPTIONS,
  }
}
