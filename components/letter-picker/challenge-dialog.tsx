"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Lightbulb } from "lucide-react"
import type { ChallengeMode, AIResponse } from "@/types/letter-picker"

interface ChallengeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentResult: string
  challengeMode: ChallengeMode
  aiResponse: AIResponse | null
  isLoadingAI: boolean
  onCompleteChallenge: (words: string[]) => void
}

export function ChallengeDialog({
  open,
  onOpenChange,
  currentResult,
  challengeMode,
  aiResponse,
  isLoadingAI,
  onCompleteChallenge,
}: ChallengeDialogProps) {
  const [userWords, setUserWords] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState("")
  const [challengeTimer, setChallengeTimer] = useState(60)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (open) {
      setChallengeTimer(challengeMode === "quick-fire" ? 30 : 60)
      setIsTimerActive(true)
      setUserWords([])
      setCurrentWord("")
    }
  }, [open, challengeMode])

  useEffect(() => {
    if (isTimerActive && challengeTimer > 0) {
      timerRef.current = setTimeout(() => {
        setChallengeTimer((prev) => prev - 1)
      }, 1000)
    } else if (challengeTimer === 0) {
      setIsTimerActive(false)
      handleCompleteChallenge()
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isTimerActive, challengeTimer])

  const addWord = () => {
    if (currentWord.trim() && currentWord.toLowerCase().startsWith(currentResult.toLowerCase())) {
      setUserWords((prev) => [...prev, currentWord.trim()])
      setCurrentWord("")
    }
  }

  const handleCompleteChallenge = () => {
    setIsTimerActive(false)
    onCompleteChallenge(userWords)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Challenge: Letter {currentResult}
            <div className="ml-auto flex items-center gap-2">
              <div className="text-sm text-gray-500">Time: {challengeTimer}s</div>
              <Progress
                value={(challengeTimer / (challengeMode === "quick-fire" ? 30 : 60)) * 100}
                className="w-20 h-2"
              />
            </div>
          </DialogTitle>
        </DialogHeader>

        {isLoadingAI ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>AI is preparing your challenge...</p>
          </div>
        ) : (
          aiResponse && (
            <Tabs defaultValue="challenge" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="challenge">Challenge</TabsTrigger>
                <TabsTrigger value="hints">
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Hints
                </TabsTrigger>
                <TabsTrigger value="story">Story</TabsTrigger>
              </TabsList>

              <TabsContent value="challenge" className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800 font-medium">{aiResponse.encouragement}</p>
                  {aiResponse.challenge && <p className="text-purple-600 mt-2">{aiResponse.challenge}</p>}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={currentWord}
                    onChange={(e) => setCurrentWord(e.target.value)}
                    placeholder={`Enter a word starting with ${currentResult}...`}
                    onKeyPress={(e) => e.key === "Enter" && addWord()}
                  />
                  <Button onClick={addWord} disabled={!currentWord.trim()}>
                    Add Word
                  </Button>
                </div>

                {userWords.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Your Words ({userWords.length}):</h4>
                    <div className="flex flex-wrap gap-2">
                      {userWords.map((word, index) => (
                        <Badge key={index} variant="secondary">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={handleCompleteChallenge} className="w-full">
                  Complete Challenge
                </Button>
              </TabsContent>

              <TabsContent value="hints" className="space-y-3">
                {aiResponse.hints.map((hint, index) => (
                  <div key={index} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-yellow-800">{hint}</p>
                  </div>
                ))}

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Example words:</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiResponse.examples.map((example, index) => (
                      <Badge key={index} variant="outline">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="story" className="space-y-4">
                {aiResponse.story ? (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800">{aiResponse.story}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Story mode not available for this challenge type.</p>
                )}
              </TabsContent>
            </Tabs>
          )
        )}
      </DialogContent>
    </Dialog>
  )
} 