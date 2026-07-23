"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PanelRightOpen } from "lucide-react"
import TeamPickerSection from "@/components/team-picker-section"
import { TeamPickerSidebar } from "@/components/team-picker/team-picker-sidebar"
import { useTeamPickerStore } from "@/stores/team-picker-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { useSettingsStore } from "@/stores/settings-store"

const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

export type TeamPickerToolProps = {
  onOpenSettings?: () => void
  openGamesSignal?: number
}

export function TeamPickerTool({
  onOpenSettings,
  openGamesSignal = 0,
}: TeamPickerToolProps) {
  const [showInputs, setShowInputs] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })
  const [resultsCount, setResultsCount] = useState(0)
  const [hydratedWheelId, setHydratedWheelId] = useState<string | null>(null)

  const currentWheelId = useWheelManagerStore((s) => s.currentWheelId)
  const updateWheelData = useWheelManagerStore((s) => s.updateWheelData)
  const getCurrentWheel = useWheelManagerStore((s) => s.getCurrentWheel)
  const wheel = getCurrentWheel()

  const {
    participants,
    teams,
    distributionMode,
    numberOfGroups,
    maxPeoplePerGroup,
    pickRepresentatives,
    customTeamNames,
    toolTitle,
    toolDescription,
    resultTitle,
    pickQuantity,
    showGenderInResult,
    showLabelInResult,
    presetGroups = [],
    viewMode,
    actionMode,
    eliminatedTeams,
    setActionMode,
  } = useTeamPickerStore()

  const removeWinnerAfterSpin = useSettingsStore(
    (s) => s.settings.spinBehavior?.removeWinnerAfterSpin,
  )
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  useEffect(() => {
    const update = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Hydrate Zustand from My Wheels selection (skip persist until hydrated)
  useEffect(() => {
    if (!wheel) {
      setHydratedWheelId(null)
      return
    }

    const data = (wheel.data || {}) as Record<string, unknown>
    useTeamPickerStore.setState({
      participants: (data.participants as typeof participants) || [],
      teams: (data.teams as typeof teams) || [],
      distributionMode: (data.distributionMode as typeof distributionMode) || "default",
      numberOfGroups: (data.numberOfGroups as number) || 2,
      maxPeoplePerGroup: (data.maxPeoplePerGroup as number) || 1,
      pickRepresentatives: (data.pickRepresentatives as boolean) ?? true,
      customTeamNames: (data.customTeamNames as string[]) || [],
      toolTitle: (data.toolTitle as string) || "Team Picker Wheel",
      toolDescription: (data.toolDescription as string) || "Randomize people into groups",
      resultTitle: (data.resultTitle as string) || "RESULT",
      pickQuantity: data.pickQuantity as number | undefined,
      showGenderInResult: (data.showGenderInResult as boolean) ?? true,
      showLabelInResult: (data.showLabelInResult as boolean) ?? true,
      presetGroups: (data.presetGroups as string[][]) || [],
      viewMode: (data.viewMode as typeof viewMode) || "input",
      actionMode: (data.actionMode as typeof actionMode) || "normal",
      eliminatedTeams: (data.eliminatedTeams as string[]) || [],
      selectedTeam: null,
    })
    setHydratedWheelId(wheel.id)
    window.dispatchEvent(new Event("team-picker-hydrated"))
  }, [wheel?.id])

  // Persist tool state into current wheel (only after hydrate for this id)
  useEffect(() => {
    if (!wheel || hydratedWheelId !== wheel.id) return
    updateWheelData("team-picker", wheel.id, {
      participants,
      teams,
      distributionMode,
      numberOfGroups,
      maxPeoplePerGroup,
      pickRepresentatives,
      customTeamNames,
      toolTitle,
      toolDescription,
      resultTitle,
      pickQuantity,
      showGenderInResult,
      showLabelInResult,
      presetGroups: presetGroups || [],
      viewMode,
      actionMode,
      eliminatedTeams,
    })
  }, [
    participants,
    teams,
    distributionMode,
    numberOfGroups,
    maxPeoplePerGroup,
    pickRepresentatives,
    customTeamNames,
    toolTitle,
    toolDescription,
    resultTitle,
    pickQuantity,
    showGenderInResult,
    showLabelInResult,
    presetGroups,
    viewMode,
    actionMode,
    eliminatedTeams,
    wheel?.id,
    hydratedWheelId,
    updateWheelData,
  ])

  // Header/Manage "Remove winner" → Action Mode
  useEffect(() => {
    const wantMode = removeWinnerAfterSpin ? "elimination" : "normal"
    const current = useTeamPickerStore.getState().actionMode
    if (current === "manual") return
    if (current !== wantMode) {
      setActionMode(wantMode)
      if (wantMode !== "elimination") {
        useTeamPickerStore.getState().restoreAllTeams()
      }
    }
  }, [removeWinnerAfterSpin, setActionMode])

  const syncActionMode = (mode: "normal" | "elimination") => {
    setActionMode(mode)
    const latest = useSettingsStore.getState().settings
    updateSettings({
      spinBehavior: {
        ...latest.spinBehavior,
        removeWinnerAfterSpin: mode === "elimination",
      },
    })
    if (mode !== "elimination") {
      useTeamPickerStore.getState().restoreAllTeams()
    }
  }

  const shuffleParticipants = () => {
    const shuffled = [...participants]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    useTeamPickerStore.setState({ participants: shuffled })
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={400}
          recycle={false}
          gravity={0.3}
          wind={0.05}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      <div className="mb-8 grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div
          className={`relative overflow-x-hidden bg-white p-3 sm:p-6 ${
            isFullscreen || !showInputs
              ? "lg:col-span-3"
              : "rounded-lg border shadow-sm lg:col-span-2"
          }`}
        >
          {!isFullscreen && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.dispatchEvent(new Event("open-team-results"))}
              className="absolute left-2 top-2 z-10 border-blue-500 bg-white px-2 py-1 text-xs text-blue-600 shadow-sm hover:border-blue-600 hover:bg-gray-50 sm:left-4 sm:top-4 sm:px-3"
            >
              Results
              {resultsCount > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {resultsCount}
                </Badge>
              )}
            </Button>
          )}

          {!showInputs && (
            <div className="mb-3 flex justify-end pt-8">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setShowInputs(true)}
              >
                <PanelRightOpen className="h-4 w-4" />
                Show controls
              </Button>
            </div>
          )}

          <div className={isFullscreen ? undefined : "pt-8"}>
            <TeamPickerSection
              onConfettiChange={setShowConfetti}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen((v) => !v)}
              showResultsButton={false}
              onHistoryCountChange={setResultsCount}
              openGamesSignal={openGamesSignal}
              wheelId={currentWheelId}
            />
          </div>
        </div>

        {showInputs && !isFullscreen && (
          <div className="self-start lg:col-span-1">
            <TeamPickerSidebar
              onHideInputs={() => setShowInputs(false)}
              onShuffle={shuffleParticipants}
              onOpenSettings={onOpenSettings}
              onToggleFullscreen={() => setIsFullscreen((v) => !v)}
              onOpenAI={() => {
                window.dispatchEvent(new CustomEvent("open-gemini-ai-chat"))
              }}
              onOpenGroupsBoard={() => {
                window.dispatchEvent(new Event("open-groups-board"))
              }}
              onViewHistory={() => {
                window.dispatchEvent(new Event("open-team-results"))
              }}
              historyCount={resultsCount}
              onOpenAchievements={() => {
                window.dispatchEvent(new Event("open-team-achievements"))
              }}
              onActionModeChange={syncActionMode}
            />
          </div>
        )}
      </div>
    </>
  )
}
