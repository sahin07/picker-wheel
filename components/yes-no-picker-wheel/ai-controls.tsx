"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Brain, MessageSquare, RotateCcw } from "lucide-react"

interface AIControlsProps {
  userQuestion: string
  setUserQuestion: (question: string) => void
  onGenerateAdvice: () => void
  isGeneratingAdvice: boolean
  aiAdvice: string
  mode: "yes-no" | "yes-no-maybe"
  setMode: (mode: "yes-no" | "yes-no-maybe") => void
  inputSets: number
  setInputSets: (sets: number) => void
  onReset: () => void
}

export function AIControls({
  userQuestion,
  setUserQuestion,
  onGenerateAdvice,
  isGeneratingAdvice,
  aiAdvice,
  mode,
  setMode,
  inputSets,
  setInputSets,
  onReset,
}: AIControlsProps) {
  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-600" />
          AI ASSISTANT
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="hover:scale-110 transition-transform bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Question Input */}
      <div>
        <label className="block text-sm font-medium mb-2">What decision are you facing?</label>
        <Textarea
          placeholder="e.g., Should I take this new job offer? Should I move to a new city? Should I start learning a new skill?"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* AI Advice Generation */}
      <Button
        onClick={onGenerateAdvice}
        disabled={!userQuestion.trim() || isGeneratingAdvice}
        className="relative z-30 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isGeneratingAdvice ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Get AI Advice
          </span>
        )}
      </Button>

      {/* AI Advice Display */}
      {aiAdvice && (
        <Card className="relative z-30 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-purple-700">
              <MessageSquare className="h-4 w-4" />
              AI Advice
            </h4>
            <p className="text-sm text-purple-600 leading-relaxed">{aiAdvice}</p>
          </CardContent>
        </Card>
      )}

      {/* Mode Selection for AI */}
      <div>
        <label className="block text-sm font-medium mb-2">Decision Type</label>
        <div className="flex space-x-2">
          <Button
            variant={mode === "yes-no" ? "default" : "outline"}
            onClick={() => setMode("yes-no")}
            className="relative z-30 flex-1 hover:scale-105 transition-transform"
          >
            YES or NO
          </Button>
          <Button
            variant={mode === "yes-no-maybe" ? "default" : "outline"}
            onClick={() => setMode("yes-no-maybe")}
            className="relative z-30 flex-1 hover:scale-105 transition-transform"
          >
            YES NO or MAYBE
          </Button>
        </div>
      </div>

      {/* Number of Input Sets for AI */}
      <div>
        <label className="block text-sm font-medium mb-2">Decision Complexity</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <Button
              key={num}
              variant={inputSets === num ? "default" : "outline"}
              onClick={() => setInputSets(num)}
              className="relative z-30 w-12 h-12 hover:scale-110 transition-transform"
            >
              {num}
            </Button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">Higher numbers = more wheel segments for complex decisions</p>
      </div>
    </div>
  )
} 