"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GAME_MODES } from "@/lib/constants"
import type { GameStats, WheelItem } from "@/lib/types"
import { Gamepad2, HelpCircle, RotateCcw, ExternalLink } from "lucide-react"
import Link from "next/link"

interface GameSelectionDialogProps {
  showGames: boolean
  setShowGames: (show: boolean) => void
  gameStats: GameStats
  gameMode: string
  setGameMode: (mode: string) => void
  enabledItems: WheelItem[]
  createBingoCard: () => void
  startMemoryChallenge: () => void
  startCollectionRace: () => void
  startSequenceMatch: () => void
  resetGame: () => void
}

export function GameSelectionDialog({
  showGames,
  setShowGames,
  gameStats,
  gameMode,
  setGameMode,
  enabledItems,
  createBingoCard,
  startMemoryChallenge,
  startCollectionRace,
  startSequenceMatch,
  resetGame,
}: GameSelectionDialogProps) {
  const handleGameStart = (modeId: string) => {
    switch (modeId) {
      case "bingo":
        createBingoCard();
        break;
      case "memory":
        startMemoryChallenge();
        break;
      case "collection":
        startCollectionRace();
        break;
      case "sequence":
        startSequenceMatch();
        break;
      case "normal":
        resetGame();
        break;
    }
    setShowGames(false);
  };

  const canPlayBingo = enabledItems.length >= 9;
  const canPlayMemory = enabledItems.length >= 3;
  const canPlaySequence = enabledItems.length >= 3;

  const getGameInstructionLink = (modeId: string) => {
    switch (modeId) {
      case "normal":
        return "/game-instructions/normal-spin";
      case "bingo":
        return "/game-instructions/spin-bingo";
      case "memory":
        return "/game-instructions/memory-challenge";
      case "collection":
        return "/game-instructions/collection-race";
      case "sequence":
        return "/game-instructions/sequence-match";
      default:
        return "/game-instructions";
    }
  };

  return (
    <Dialog open={showGames} onOpenChange={setShowGames}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Spin Games & Challenges
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Link href="/game-instructions">
                <Button variant="outline" size="sm">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  How to Play
                </Button>
              </Link>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Statistics Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{gameStats.bingoWins}</div>
              <div className="text-sm text-blue-800">Bingo Wins</div>
            </div>
            <div className="text-center p-3 bg-white border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{gameStats.memoryWins}</div>
              <div className="text-sm text-purple-800">Memory Wins</div>
            </div>
            <div className="text-center p-3 bg-white border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{gameStats.currentStreak}</div>
              <div className="text-sm text-green-800">Current Streak</div>
            </div>
            <div className="text-center p-3 bg-white border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{gameStats.totalSpins}</div>
              <div className="text-sm text-orange-800">Total Spins</div>
            </div>
          </div>

          {/* Game Options Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAME_MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = gameMode === mode.id;
              const isAvailable = 
                (mode.id === "bingo" && canPlayBingo) ||
                (mode.id === "memory" && canPlayMemory) ||
                (mode.id === "sequence" && canPlaySequence) ||
                mode.id === "collection" ||
                mode.id === "normal";
              
              const status = isActive ? "Active" : (isAvailable ? "Available" : "Unavailable");
              const statusColor = isActive ? "text-blue-600" : (isAvailable ? "text-gray-600" : "text-gray-400");

              return (
                <div
                  key={mode.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start space-x-3 mb-3">
                      <Icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{mode.name}</h3>
                          <Link href={getGameInstructionLink(mode.id)}>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{mode.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`text-xs font-medium ${statusColor}`}>
                        {status}
                      </span>
                      <Button
                        onClick={() => handleGameStart(mode.id)}
                        disabled={!isAvailable}
                        size="sm"
                        className="bg-black hover:bg-gray-800 text-white"
                      >
                        ▷ Play
                      </Button>
                    </div>
                    
                    {/* Requirements warning */}
                    {mode.id === "bingo" && !canPlayBingo && (
                      <p className="text-xs text-gray-400 mt-2">Add at least 9 images to play Bingo</p>
                    )}
                    {(mode.id === "memory" || mode.id === "sequence") && !isAvailable && (
                      <p className="text-xs text-gray-400 mt-2">Add at least 3 images to play</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset Button */}
          <div className="flex justify-center pt-4 border-t">
            <Button
              onClick={() => {
                // Reset all game stats
                resetGame();
                setGameMode("normal");
              }}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Game Stats</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
