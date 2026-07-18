"use client"

import { useState, useEffect, useRef, type ReactNode, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { SpinWheel } from "@/components/letter-picker/spin-wheel"
import { InputPanel } from "@/components/letter-picker/input-panel"
import { AchievementsPanel } from "@/components/letter-picker/achievements-panel"
import { ChallengeDialog } from "@/components/letter-picker/challenge-dialog"
import { ResultDialog } from "@/components/letter-picker/result-dialog"
import { TitleModal } from "@/components/letter-picker/title-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share, Star } from "lucide-react"
import { useLetterWheel } from "@/hooks/use-letter-wheel"
import { useAI } from "@/hooks/use-ai"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import Confetti from "react-confetti"

import { ToastProvider } from "@/contexts/toast-context"
import SettingsPanel from "@/components/settings-panel"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import PickerWheelGameModes from "@/components/picker-wheel-game-modes"
import PickerWheelThemeSelector from "@/components/picker-wheel-theme-selector"
import PickerWheelAnalyticsDisplay from "@/components/picker-wheel-analytics-display"
import PickerWheelSocialHub from "@/components/picker-wheel-social-hub"
import { useGameSession } from "@/hooks/use-game-session"
import type { GameMode } from "@/lib/picker-wheel-game-modes"
import { PICKER_WHEEL_THEMES } from "@/lib/picker-wheel-themes"
import { analyzeSpinData, type SpinRecord } from "@/lib/picker-wheel-analytics"
import { createSpinAudioController, type SpinAudioController } from "@/lib/wheel-spin-audio"
import { resolveNumberFromRotation } from "@/components/wheel-canvas"
import {
  LETTER_PICKER_SHORT_TITLE,
  SCRABBLE_LETTER_WEIGHTS,
  lettersForSeoPreset,
  type LetterPickerSeoPreset,
} from "@/lib/letter-picker-seo"
import type { LetterPickerDeepLink } from "@/lib/letter-picker-spokes"
import {
  getLetterPickerUseCase,
  type LetterPickerUseCaseId,
} from "@/lib/letter-picker-use-cases"
import { buildLetterModeResult } from "@/lib/letter-picker-mode-results"
import { LetterPickerUseCases } from "@/components/letter-picker/letter-picker-use-cases"
import type {
  ChallengeMode,
  Achievement,
  AIResponse,
  SpinResult,
  StyleOption,
  LetterOption,
} from "@/types/letter-picker"

type LetterPickerWheelAppProps = {
  seoIntro?: ReactNode
  seoSections?: ReactNode
  deepLink?: LetterPickerDeepLink
  shortTitle?: string
  toolSubtitle?: string
}

function LetterPickerWheelAppInner({
  seoIntro,
  seoSections,
  deepLink,
  shortTitle,
  toolSubtitle,
}: LetterPickerWheelAppProps) {
  const searchParams = useSearchParams()
  const [showSettings, setShowSettings] = useState(false)
  const [showTitleModal, setShowTitleModal] = useState(false)
  const [showGameModes, setShowGameModes] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSocialHub, setShowSocialHub] = useState(false)
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)
  const [themes, setThemes] = useState(PICKER_WHEEL_THEMES)
  const [currentTheme, setCurrentTheme] = useState("classic")
  const [mysteryResultRevealed, setMysteryResultRevealed] = useState(true)
  const { settings, updateSettings, loadFromDatabase: loadSettings } = useSettingsStore()
  const { getCurrentWheel, setCurrentTool, createNewWheel, currentWheelId, updateWheelData } =
    useWheelManagerStore()
  const {
    currentSession,
    isGameActive: isAdvancedGameActive,
    startGame: startAdvancedGame,
  } = useGameSession()

  const {
    letterOption,
    styleOption,
    spinMode,
    letterSlices,
    activeSlices,
    currentLetters,
    results,
    streak,
    spunLetters,
    achievements,
    wheelTitle,
    setWheelTitle,
    wheelDescription,
    setWheelDescription,
    sidebarTab,
    setSidebarTab,
    setSpinDurationMs,
    setLetterOption,
    setStyleOption,
    setSpinMode,
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
    setCurrentLetters,
  } = useLetterWheel()

  const { getAIResponse } = useAI()

  const [challengeMode, setChallengeMode] = useState<ChallengeMode>("word-building")
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const wheel = getCurrentWheel()
    if (wheel) {
      setRotation(0)
      currentRotationRef.current = 0
      finalRotationRef.current = 0
      setIsSpinning(false)
      isSpinningRef.current = false
    }
  }, [currentWheelId, getCurrentWheel])

  const [currentResult, setCurrentResult] = useState<string>("")
  const [resultIndex, setResultIndex] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showAllResults, setShowAllResults] = useState(false)
  const [muted, setMuted] = useState(false)
  const [showInputs, setShowInputs] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const [showChallenge, setShowChallenge] = useState(false)
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null)
  const [activeUseCaseId, setActiveUseCaseId] = useState<LetterPickerUseCaseId | null>(null)
  const activeUseCaseIdRef = useRef<LetterPickerUseCaseId | null>(null)
  activeUseCaseIdRef.current = activeUseCaseId

  const isSaving = useRef(false)
  const isSpinningRef = useRef(false)
  const settingsRef = useRef(settings)
  settingsRef.current = settings
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const spinAudioRef = useRef<SpinAudioController | null>(null)
  const currentRotationRef = useRef(0)
  const finalRotationRef = useRef(0)
  const pendingWinnerRef = useRef<{ index: number; letter: string } | null>(null)
  const activeSlicesRef = useRef(activeSlices)
  activeSlicesRef.current = activeSlices
  const finishSpinRef = useRef<() => void>(() => {})
  const lastUrlKeyRef = useRef("")
  const deepLinkAppliedRef = useRef(false)

  const applyCaseToLetters = (letters: string[], style: StyleOption) => {
    if (style === "lowercase") return letters.map((l) => l.toLowerCase())
    if (style === "mixed") {
      return letters.map((l, i) => (i % 2 === 0 ? l.toUpperCase() : l.toLowerCase()))
    }
    return letters.map((l) => l.toUpperCase())
  }

  const applyLetterSet = (preset: LetterOption | LetterPickerSeoPreset, style: StyleOption) => {
    setStyleOption(style)

    if (preset === "alphabet" || preset === "vowels" || preset === "consonants") {
      setLetterOption(preset)
      return
    }

    if (preset === "scrabble") {
      const text = Object.entries(SCRABBLE_LETTER_WEIGHTS)
        .map(([letter, weight]) => `${applyCaseToLetters([letter], style)[0]}, ${weight}`)
        .join("\n")
      setSlicesFromText(text)
      return
    }

    if (preset === "a-m" || preset === "n-z") {
      setCurrentLetters(applyCaseToLetters(lettersForSeoPreset(preset), style))
    }
  }

  const syncEliminationWithSettings = (enabled: boolean) => {
    setSpinMode(enabled ? "elimination" : "normal")
    const latest = useSettingsStore.getState().settings
    updateSettings({
      spinBehavior: {
        ...latest.spinBehavior,
        removeWinnerAfterSpin: enabled,
      },
    })
  }

  const applyUseCasePreset = (id: LetterPickerUseCaseId) => {
    const useCase = getLetterPickerUseCase(id)
    if (!useCase || isSpinningRef.current) return

    const c = useCase.config
    setActiveUseCaseId(id)
    applyLetterSet(c.preset, c.style)
    syncEliminationWithSettings(c.elimination)
    setWheelTitle(c.toolTitle)
    setWheelDescription(c.toolDescription)
    setCurrentResult("")
    setResultIndex(null)
    setResults([])
    setShowResult(false)
  }

  // Spoke pages: apply dedicated preset/mode once on mount
  useEffect(() => {
    if (!deepLink || deepLinkAppliedRef.current || isSpinningRef.current) return
    deepLinkAppliedRef.current = true

    if (deepLink.mode && getLetterPickerUseCase(deepLink.mode)) {
      applyUseCasePreset(deepLink.mode)
      if (deepLink.toolTitle) setWheelTitle(deepLink.toolTitle)
      if (deepLink.toolDescription) setWheelDescription(deepLink.toolDescription)
      return
    }

    const style = deepLink.style ?? "uppercase"
    setActiveUseCaseId(null)
    applyLetterSet(deepLink.preset, style)
    if (deepLink.toolTitle) setWheelTitle(deepLink.toolTitle)
    if (deepLink.toolDescription) setWheelDescription(deepLink.toolDescription)
  }, [deepLink])

  // Popular Letter Wheels / deep links: ?preset=vowels&style=lowercase or ?mode=classroom
  useEffect(() => {
    if (isSpinningRef.current) return
    const key = searchParams.toString()
    if (!key || key === lastUrlKeyRef.current) return
    lastUrlKeyRef.current = key

    const mode = searchParams.get("mode") as LetterPickerUseCaseId | null
    if (mode && getLetterPickerUseCase(mode)) {
      applyUseCasePreset(mode)
      return
    }

    const styleRaw = searchParams.get("style")
    const style: StyleOption =
      styleRaw === "uppercase" || styleRaw === "lowercase" || styleRaw === "mixed"
        ? styleRaw
        : "uppercase"

    const preset = searchParams.get("preset") as LetterPickerSeoPreset | null
    if (!preset) return

    setActiveUseCaseId(null)
    applyLetterSet(preset, style)
  }, [searchParams])

  // Align local spin duration with Header Settings (seconds → ms)
  useEffect(() => {
    const ms = Math.max(0.5, settings.spinBehavior.spinningDuration || 10) * 1000
    setSpinDurationMs(ms)
  }, [settings.spinBehavior.spinningDuration, setSpinDurationMs])

  // Keep spinMode elimination ↔ Manage/Header Settings "Remove winner" in sync
  // (do not override challenge mode)
  useEffect(() => {
    const wantElimination = !!settings.spinBehavior.removeWinnerAfterSpin
    const wantMode = wantElimination ? "elimination" : "normal"
    setSpinMode((prev) => {
      if (prev === "challenge") return prev
      return prev === wantMode ? prev : wantMode
    })
  }, [settings.spinBehavior.removeWinnerAfterSpin, setSpinMode])

  useEffect(() => {
    setCurrentTool("letter-picker-wheel")
    const initializeApp = async () => {
      try {
        await loadSettings()
        if (typeof window !== "undefined") {
          const wheel = getCurrentWheel()
          if (!wheel) {
            createNewWheel("letter-picker-wheel", "My Random Letter Picker")
            await new Promise((resolve) => setTimeout(resolve, 100))
          }
        }
      } catch (error) {
        console.error("Error initializing random letter picker:", error)
      }
    }
    initializeApp()
  }, [setCurrentTool, loadSettings, getCurrentWheel, createNewWheel])

  const currentWheelIdForKey = getCurrentWheel()?.id || "no-wheel"

  const checkAchievements = () => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        const updated = { ...achievement }

        switch (achievement.id) {
          case "first-spin":
            if (!updated.unlocked) {
              updated.progress = 1
              updated.unlocked = true
              setShowAchievement(updated)
            }
            break
          case "alphabet-explorer":
            updated.progress = spunLetters.size + 1
            if (updated.progress >= updated.maxProgress && !updated.unlocked) {
              updated.unlocked = true
              setShowAchievement(updated)
            }
            break
        }

        return updated
      }),
    )
  }

  const toCanvasItems = (slices: typeof activeSlices) =>
    slices.map((s) => ({
      value: s.text,
      weight: Math.max(1, s.weight || 1),
      color: s.color,
      id: s.id,
    }))

  const finishSpinWithWinner = async (selectedLetter: string, selectedIndex: number) => {
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current)
      spinTimeoutRef.current = null
    }
    spinAudioRef.current?.stop()

    setCurrentResult(selectedLetter)
    setResultIndex(selectedIndex)
    setSpunLetters((prevSpun) => new Set([...prevSpun, selectedLetter.toUpperCase()]))
    checkAchievements()

    if (settingsRef.current.confettiSound?.enableConfetti) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
    if (settingsRef.current.confettiSound?.enableSound && !muted) {
      const audio = new Audio("/sound-win.mp3")
      audio.volume = settingsRef.current.confettiSound.soundVolume || 0.5
      audio.play().catch(() => {})
    }

    if (spinMode === "challenge") {
      setIsLoadingAI(true)
      try {
        const response = await getAIResponse(selectedLetter, challengeMode)
        setAiResponse(response)
        setShowChallenge(true)
      } catch (error) {
        console.error("AI Error:", error)
      }
      setIsLoadingAI(false)
    } else if (!activeUseCaseIdRef.current) {
      // Mode cards show inline — only open dialog for plain spins
      setShowResult(true)
    }

    setIsSpinning(false)

    const newResult: SpinResult = {
      letter: selectedLetter,
      timestamp: new Date(),
      mode: spinMode,
      id: `${Date.now()}-${Math.random()}`,
    }

    setResults((prevResults) => {
      const isDuplicate = prevResults.some(
        (r) =>
          r.letter === newResult.letter &&
          Math.abs(r.timestamp.getTime() - newResult.timestamp.getTime()) < 1000,
      )
      if (isDuplicate) return prevResults
      return [...prevResults, newResult]
    })

    const eliminate =
      spinMode === "elimination" || !!settingsRef.current.spinBehavior.removeWinnerAfterSpin
    if (eliminate) {
      const id = activeSlicesRef.current[selectedIndex]?.id
      if (id) setEnabledForIds([id], false)
    }
  }

  const finishSpin = () => {
    if (!isSpinningRef.current) return
    isSpinningRef.current = false

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current)
      spinTimeoutRef.current = null
    }

    const lockedRotation = finalRotationRef.current
    currentRotationRef.current = lockedRotation
    setRotation(lockedRotation)

    const pending = pendingWinnerRef.current
    pendingWinnerRef.current = null
    if (pending) {
      void finishSpinWithWinner(pending.letter, pending.index)
      return
    }

    const resolved = resolveNumberFromRotation(lockedRotation, toCanvasItems(activeSlicesRef.current))
    if (!resolved) {
      setIsSpinning(false)
      spinAudioRef.current?.stop()
      return
    }
    void finishSpinWithWinner(String(resolved.value), resolved.index)
  }
  finishSpinRef.current = finishSpin

  const spinWheel = () => {
    if (isSpinning || activeSlices.length === 0) return
    if (isSaving.current || isSpinningRef.current) return

    isSpinningRef.current = true
    setIsSpinning(true)
    setResultIndex(null)
    setCurrentResult("")
    setMysteryResultRevealed(!settingsRef.current.spinBehavior.mysteryResult)
    pendingWinnerRef.current = null

    if (settingsRef.current.confettiSound?.enableSound && !muted) {
      try {
        if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
        spinAudioRef.current.startWhoosh(
          "/wheel-sound.mp3",
          settingsRef.current.confettiSound.soundVolume || 0.5,
        )
      } catch {
        // ignore
      }
    }

    // Home / Number style: 10 full turns + random, resolve winner from final angle
    const baseRotation = settingsRef.current.display.randomInitialAngle ? Math.random() * 360 : 0
    const finalRotation =
      currentRotationRef.current + baseRotation + 10 * 360 + Math.random() * 360
    finalRotationRef.current = finalRotation
    setRotation(finalRotation)

    const resolved = resolveNumberFromRotation(finalRotation, toCanvasItems(activeSlices))
    if (resolved) {
      pendingWinnerRef.current = { index: resolved.index, letter: String(resolved.value) }
    }

    const durationMs = Math.max(0.5, settingsRef.current.spinBehavior.spinningDuration || 10) * 1000
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    spinTimeoutRef.current = setTimeout(() => {
      finishSpinRef.current()
    }, durationMs + 80)
  }

  const handleManualStop = () => {
    if (!settingsRef.current.spinBehavior.manuallyStop) return
    if (!isSpinningRef.current) return
    const stoppedAt = currentRotationRef.current
    finalRotationRef.current = stoppedAt
    const resolved = resolveNumberFromRotation(stoppedAt, toCanvasItems(activeSlicesRef.current))
    if (resolved) {
      pendingWinnerRef.current = { index: resolved.index, letter: String(resolved.value) }
    }
    finishSpinRef.current()
  }

  const handleRotationFrame = (rotationDegrees: number, segmentCount: number) => {
    currentRotationRef.current = rotationDegrees
    if (!settings.confettiSound?.enableSound || muted || segmentCount <= 0) return
    try {
      if (!spinAudioRef.current) spinAudioRef.current = createSpinAudioController()
      spinAudioRef.current.syncFrame(
        rotationDegrees,
        segmentCount,
        settings.confettiSound.soundVolume || 0.5,
        null,
      )
    } catch {
      // ignore
    }
  }

  const handleCanvasSpinComplete = () => {
    finishSpinRef.current()
  }

  const spinHistoryRecords: SpinRecord[] = results.map((r) => ({
    id: r.id || String(r.timestamp.getTime()),
    timestamp: r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp),
    result: r.letter,
    options: activeSlices.map((s) => s.text),
    mode: "manual",
    theme: currentTheme,
    spinDuration: settings.spinBehavior.spinningDuration || 10,
  }))

  const achievementPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + 10, 0)

  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId)
    const theme = themes.find((t) => t.id === themeId) || PICKER_WHEEL_THEMES.find((t) => t.id === themeId)
    if (theme?.colors?.length) {
      applyColorPalette(theme.colors)
      updateSettings({
        appearance: {
          ...settings.appearance,
          toolColors: [...theme.colors],
        },
      })
    }
    setShowThemeSelector(false)
  }

  const modeResult =
    currentResult && !isSpinning
      ? buildLetterModeResult(activeUseCaseId, currentResult, activeSlices.length)
      : null

  const wheelBoxProps = {
    slices: activeSlices,
    rotation,
    isSpinning,
    isFullscreen,
    muted,
    onMutedChange: setMuted,
    highlightIndex: resultIndex,
    manuallyStop: !!settings.spinBehavior.manuallyStop,
    totalSpins: results.length,
    winnerLabel: currentResult && !isSpinning ? currentResult : null,
    modeResult,
    mysteryResult: !!settings.spinBehavior.mysteryResult,
    mysteryRevealed: mysteryResultRevealed,
    onRevealMystery: () => setMysteryResultRevealed(true),
    onSpin: !isSpinning ? spinWheel : handleManualStop,
    showResultsButton: false,
    onShowAllResults: () => setShowAllResults(true),
    onToggleFullscreen: () => setIsFullscreen((v) => !v),
    onOpenThemes: () => setShowThemeSelector(true),
    onOpenAnalytics: () => setShowAnalytics(true),
    onOpenSocial: () => setShowSocialHub(true),
    onOpenGames: () => setShowGameModes(true),
    onOpenAchievements: () => setShowAchievementsModal(true),
    themesUnlocked: themes.filter((t) => t.unlocked).length,
    analyticsCount: results.length,
    achievementPoints,
    isGameActive: isAdvancedGameActive,
    currentGameMode: currentSession?.gameMode.name,
    onRotationFrame: handleRotationFrame,
    onSpinComplete: handleCanvasSpinComplete,
  }

  const handleCompleteChallenge = (words: string[]) => {
    const wordsFound = words.length

    if (wordsFound > 0) {
      setStreak((prev) => prev + 1)
      setScore((prev) => prev + wordsFound * 5)
    } else {
      setStreak(0)
    }

    setResults((prev) =>
      prev.map((result, index) =>
        index === prev.length - 1
          ? { ...result, challengeCompleted: wordsFound > 0, wordsFound: [...words] }
          : result,
      ),
    )

    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.id === "word-master") {
          const updated = { ...achievement }
          updated.progress = Math.min(updated.progress + wordsFound, updated.maxProgress)
          if (updated.progress >= updated.maxProgress && !updated.unlocked) {
            updated.unlocked = true
            setShowAchievement(updated)
          }
          return updated
        }
        if (achievement.id === "streak-5") {
          const updated = { ...achievement }
          updated.progress = streak + 1
          if (updated.progress >= updated.maxProgress && !updated.unlocked) {
            updated.unlocked = true
            setShowAchievement(updated)
          }
          return updated
        }
        return achievement
      }),
    )

    setShowChallenge(false)
    setShowResult(true)
  }

  useEffect(() => {
    if (!isFullscreen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFullscreen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isFullscreen])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || (e.ctrlKey && e.key === "Enter")) {
        e.preventDefault()
        spinWheel()
      }
    }
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  })

  return (
    <ToastProvider>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={400}
          recycle={false}
          style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 1000 }}
        />
      )}
      <div
        key={currentWheelIdForKey}
        className={isFullscreen ? "fixed inset-0 z-50 bg-white" : "min-h-screen transition-colors duration-300"}
        style={{
          backgroundColor: settings.appearance.backgroundColor,
          backgroundImage: settings.appearance.backgroundImage
            ? `url(${settings.appearance.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!isFullscreen && settings.appearance.bannerLogo && (
          <div className="text-center py-4">
            <img
              src={settings.appearance.bannerLogo || "/placeholder.svg"}
              alt="Banner Logo"
              className="h-16 mx-auto object-contain"
            />
          </div>
        )}

        {!isFullscreen && (
          <Header
            onOpenSettings={() => setShowSettings(true)}
            onOpenGames={() => setShowGameModes(true)}
          />
        )}

        {!isFullscreen && (
          <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-4 text-center">
              <ToolPageTitle
                title={shortTitle ?? LETTER_PICKER_SHORT_TITLE}
                toolType="letter-picker-wheel"
              />
              <p className="text-gray-600">
                {toolSubtitle ?? "Spin the alphabet wheel to choose a random letter"}
              </p>
            </div>

            <LetterPickerUseCases
              activeId={activeUseCaseId}
              onSelectPreset={applyUseCasePreset}
            />

            {activeUseCaseId && (
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className="bg-slate-800 text-white hover:bg-slate-800">
                  Mode: {getLetterPickerUseCase(activeUseCaseId)?.label}
                </Badge>
                {spinMode === "elimination" || settings.spinBehavior.removeWinnerAfterSpin ? (
                  <Badge variant="secondary">{activeSlices.length} left on wheel</Badge>
                ) : null}
              </div>
            )}

            <div className="grid items-start gap-8 lg:grid-cols-3">
              <div className="relative self-start overflow-hidden rounded-lg border bg-white p-6 shadow-sm lg:col-span-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllResults(true)}
                  className="absolute left-4 top-4 z-10 border-blue-500 bg-white px-3 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50"
                >
                  Results
                  {results.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {results.length}
                    </Badge>
                  )}
                </Button>
                <div className="pt-6">
                  <SpinWheel {...wheelBoxProps} />
                </div>
              </div>

              {showInputs && (
                <div className="self-start">
                  <InputPanel
                    letterSlices={letterSlices}
                    activeCount={activeSlices.length}
                    resultsCount={results.length}
                    sidebarTab={sidebarTab}
                    setSidebarTab={setSidebarTab}
                    styleOption={styleOption}
                    letterOption={letterOption}
                    showTitleModal={showTitleModal}
                    setShowTitleModal={setShowTitleModal}
                    onStyleOptionChange={setStyleOption}
                    onLetterOptionChange={setLetterOption}
                    onHideInputs={() => setShowInputs(false)}
                    onShuffleLetters={shuffleLetters}
                    onSortSlicesZA={sortSlicesZA}
                    onEqualizeWeights={equalizeWeights}
                    onRemoveBlanks={removeBlanks}
                    onRemoveDuplicates={removeDuplicates}
                    onClearAllSlices={clearAllSlices}
                    onResetWheel={resetWheel}
                    onResetToAlphabet={resetToAlphabet}
                    updateSlice={updateSlice}
                    addSlice={addSlice}
                    removeSlices={removeSlices}
                    setSlicesFromText={setSlicesFromText}
                    applyColorPalette={applyColorPalette}
                    duplicateSlices={duplicateSlices}
                    setEnabledForIds={setEnabledForIds}
                    adjustWeightForIds={adjustWeightForIds}
                    setColorForIds={setColorForIds}
                    getProbability={getProbability}
                    getTextEditorValue={getTextEditorValue}
                    onViewResults={() => setShowAllResults(true)}
                    onOpenSettings={() => setShowSettings(true)}
                    onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                    actionMode={
                      spinMode === "elimination" || settings.spinBehavior.removeWinnerAfterSpin
                        ? "elimination"
                        : "normal"
                    }
                    onActionModeChange={(mode) => syncEliminationWithSettings(mode === "elimination")}
                  />
                </div>
              )}

              {!showInputs && (
                <div className="flex items-start">
                  <Button variant="outline" onClick={() => setShowInputs(true)}>
                    Show inputs
                  </Button>
                </div>
              )}
            </div>

            {seoIntro}
            {seoSections}
          </main>
        )}

        {isFullscreen && <SpinWheel {...wheelBoxProps} />}

        <ChallengeDialog
          open={showChallenge}
          onOpenChange={setShowChallenge}
          currentResult={currentResult}
          challengeMode={challengeMode}
          aiResponse={aiResponse}
          isLoadingAI={isLoadingAI}
          onCompleteChallenge={handleCompleteChallenge}
        />

        <ResultDialog
          open={showResult}
          onOpenChange={setShowResult}
          currentResult={currentResult}
          lastResult={results[results.length - 1]}
        />

        <TitleModal
          showTitleModal={showTitleModal}
          setShowTitleModal={setShowTitleModal}
          wheelTitle={wheelTitle}
          setWheelTitle={setWheelTitle}
          wheelDescription={wheelDescription}
          setWheelDescription={setWheelDescription}
        />

        <Dialog open={!!showAchievement} onOpenChange={() => setShowAchievement(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Achievement Unlocked! 🎉</DialogTitle>
            </DialogHeader>
            {showAchievement && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">{showAchievement.icon}</div>
                <h3 className="text-2xl font-bold text-yellow-600 mb-2">{showAchievement.title}</h3>
                <p className="text-gray-600">{showAchievement.description}</p>
              </div>
            )}
            <Button onClick={() => setShowAchievement(null)} className="w-full">
              Awesome!
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={showAllResults} onOpenChange={setShowAllResults}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>All Results ({results.length})</DialogTitle>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No results yet. Start spinning!</p>
              ) : (
                <div className="grid grid-cols-6 gap-2">
                  {results.map((result, index) => (
                    <div key={result.id || index} className="text-center p-3 bg-gray-50 rounded relative">
                      <div className="font-mono text-xl">{result.letter}</div>
                      <div className="text-xs text-gray-500 mt-1">#{index + 1}</div>
                      {result.challengeCompleted && (
                        <div className="absolute top-1 right-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setResults([])}>
                Clear Results
              </Button>
              <Button variant="outline">
                <Share className="w-4 h-4 mr-2" />
                Share All
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

        <PickerWheelThemeSelector
          themes={themes}
          currentTheme={currentTheme}
          onThemeSelect={handleThemeSelect}
          isVisible={showThemeSelector}
          onClose={() => setShowThemeSelector(false)}
        />

        <PickerWheelAnalyticsDisplay
          analytics={analyzeSpinData(spinHistoryRecords)}
          isVisible={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />

        <PickerWheelSocialHub
          isVisible={showSocialHub}
          onClose={() => setShowSocialHub(false)}
          onShareWheel={() => {}}
        />

        <Dialog open={showAchievementsModal} onOpenChange={setShowAchievementsModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Achievements</DialogTitle>
            </DialogHeader>
            <AchievementsPanel achievements={achievements} maxItems={0} />
          </DialogContent>
        </Dialog>

        <PickerWheelGameModes
          isVisible={showGameModes}
          onClose={() => setShowGameModes(false)}
          userPoints={achievementPoints}
          onStartGame={(gameMode: GameMode) => {
            const wheel = getCurrentWheel()
            if (wheel) {
              updateWheelData("letter-picker-wheel", wheel.id, {
                ...(wheel.data as any),
                results: [],
              })
            }
            setResults([])
            startAdvancedGame(gameMode)
            setShowGameModes(false)
          }}
        />

        {!isFullscreen && <Footer />}
      </div>
    </ToastProvider>
  )
}

export default function LetterPickerWheelApp(props: LetterPickerWheelAppProps) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-50" />}>
      <LetterPickerWheelAppInner {...props} />
    </Suspense>
  )
}
