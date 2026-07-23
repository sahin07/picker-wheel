"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Clock, 
  Star,
  Play,
  Award,
  Users,
  Timer,
  Zap,
  Brain,
  Flame,
  Crosshair
} from "lucide-react"
import { 
  GameMode, 
  Tournament, 
  DailyChallenge,
  ADVANCED_GAME_MODES,
  MOCK_TOURNAMENTS,
  MOCK_DAILY_CHALLENGES,
  getDifficultyColor,
  getDifficultyBgColor,
  formatTime,
  isTournamentActive,
  canJoinTournament
} from "@/lib/picker-wheel-game-modes"

interface PickerWheelGameModesProps {
  isVisible: boolean
  onClose: () => void
  onStartGame?: (gameMode: GameMode) => void
  userPoints?: number
}

export default function PickerWheelGameModes({
  isVisible,
  onClose,
  onStartGame,
  userPoints = 0
}: PickerWheelGameModesProps) {
  const [activeTab, setActiveTab] = useState("modes")
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null)

  const handleStartGame = (gameMode: GameMode) => {
    setSelectedGameMode(gameMode)
    // Don't call onStartGame here - only open the modal
  }

  function GameModeCard({ gameMode }: { gameMode: GameMode }) {
    return (
      <Card className={`${getDifficultyBgColor(gameMode.difficulty)} hover:shadow-lg transition-all`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{gameMode.icon}</span>
                <CardTitle className="text-lg">{gameMode.name}</CardTitle>
                <Badge 
                  variant="outline" 
                  className={getDifficultyColor(gameMode.difficulty)}
                >
                  {gameMode.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{gameMode.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Spins: {gameMode.minSpins}-{gameMode.maxSpins}</span>
              {gameMode.timeLimit && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(gameMode.timeLimit)}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">Rules:</div>
              <ul className="text-xs text-gray-600 space-y-1">
                {gameMode.rules.slice(0, 2).map((rule, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-blue-500">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-green-600">+{gameMode.rewards.points} points</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/game-instructions/${gameMode.id}`}>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    How to Play
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  onClick={() => handleStartGame(gameMode)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Play
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  function TournamentCard({ tournament }: { tournament: Tournament }) {
    const isActive = isTournamentActive(tournament)
    const canJoin = canJoinTournament(tournament, userPoints)
    
    return (
      <Card className={`${isActive ? 'border-2 border-blue-200' : 'opacity-60'} hover:shadow-lg transition-all`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <CardTitle className="text-lg">{tournament.name}</CardTitle>
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? "Active" : "Ended"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{tournament.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Entry Fee</div>
                <div className="font-medium">{tournament.entryFee} points</div>
              </div>
              <div>
                <div className="text-gray-600">Prize Pool</div>
                <div className="font-medium text-green-600">{tournament.prizePool.first} points</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>{tournament.participants}/{tournament.maxParticipants} participants</span>
              <span className="text-gray-600">{tournament.gameMode}</span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">Top 3:</div>
              <div className="space-y-1">
                {tournament.leaderboard.slice(0, 3).map((entry, index) => (
                  <div key={entry.userId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{entry.rank}</span>
                      <span>{entry.username}</span>
                    </div>
                    <span className="text-green-600">{entry.score} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              size="sm" 
              className="w-full"
              disabled={!canJoin}
              variant={canJoin ? "default" : "secondary"}
            >
              {canJoin ? "Join Tournament" : "Cannot Join"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  function DailyChallengeCard({ challenge }: { challenge: DailyChallenge }) {
    const progress = (challenge.currentValue / challenge.targetValue) * 100
    const timeLeft = challenge.expiresAt.getTime() - Date.now()
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    
    return (
      <Card className={`${challenge.isCompleted ? 'border-2 border-green-200' : ''} hover:shadow-lg transition-all`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                {challenge.isCompleted && (
                  <Badge variant="outline" className="text-green-600">
                    Completed
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{challenge.currentValue}/{challenge.targetValue}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Time Left</span>
              <span className="font-medium">{hoursLeft}h</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium text-green-600">+{challenge.reward.points} points</span>
              </div>
              <Button 
                size="sm" 
                variant={challenge.isCompleted ? "secondary" : "default"}
                disabled={challenge.isCompleted}
              >
                {challenge.isCompleted ? "Completed" : "Start Challenge"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  function GameModeDetails() {
    if (!selectedGameMode) return null

    return (
      <Dialog open={!!selectedGameMode} onOpenChange={() => setSelectedGameMode(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedGameMode.icon}</span>
              {selectedGameMode.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{selectedGameMode.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Game Settings</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <Badge variant="outline" className={getDifficultyColor(selectedGameMode.difficulty)}>
                      {selectedGameMode.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Spins:</span>
                    <span>{selectedGameMode.minSpins}-{selectedGameMode.maxSpins}</span>
                  </div>
                  {selectedGameMode.timeLimit && (
                    <div className="flex justify-between">
                      <span>Time Limit:</span>
                      <span>{formatTime(selectedGameMode.timeLimit)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Rewards</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Points:</span>
                    <span className="text-green-600">+{selectedGameMode.rewards.points}</span>
                  </div>
                  {selectedGameMode.rewards.achievements.length > 0 && (
                    <div>
                      <span>Achievements:</span>
                      <div className="mt-1">
                        {selectedGameMode.rewards.achievements.map((achievement) => (
                          <Badge key={achievement} variant="outline" className="text-xs mr-1">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Rules</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {selectedGameMode.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => {
                  if (onStartGame) {
                    onStartGame(selectedGameMode)
                  }
                  setSelectedGameMode(null)
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedGameMode(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isVisible} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-purple-500" />
            Advanced Game Modes
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modes">Game Modes</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="modes" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ADVANCED_GAME_MODES.map((gameMode) => (
                <GameModeCard key={gameMode.id} gameMode={gameMode} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_TOURNAMENTS.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DAILY_CHALLENGES.map((challenge) => (
                <DailyChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6 mt-6">
            <div className="text-center text-gray-500 py-8">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Tournament leaderboards will appear here</p>
              <p className="text-sm">Complete tournaments to see your ranking!</p>
            </div>
          </TabsContent>
        </Tabs>

        <GameModeDetails />
      </DialogContent>
    </Dialog>
  )
} 