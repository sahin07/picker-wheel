"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface WheelOption {
  id: string
  name: string
  image?: string
  color?: string
}

interface BingoCardProps {
  bingoCard: {
    id: string
    cells: (WheelOption | null)[]
    markedCells: boolean[]
    isWinner: boolean
  }
}

export function BingoCard({ bingoCard }: BingoCardProps) {
  const renderCell = (option: WheelOption | null, index: number, isMarked: boolean) => {
    if (!option) {
      return (
        <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-xs">Empty</span>
        </div>
      )
    }

    return (
      <div
        className={`w-full h-20 rounded-lg flex items-center justify-center relative transition-all ${
          isMarked
            ? "bg-green-100 border-2 border-green-500"
            : "bg-white border-2 border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="text-center px-2">
          <div className="text-sm font-medium text-gray-800 truncate">
            {option.name}
          </div>
        </div>
        
        {isMarked && (
          <div className="absolute top-1 right-1">
            <Check className="w-4 h-4 text-green-600" />
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Bingo Card</span>
          {bingoCard.isWinner && (
            <Badge variant="default" className="bg-green-500">
              WINNER!
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {bingoCard.cells.map((option, index) => (
            <div key={index}>
              {renderCell(option, index, bingoCard.markedCells[index])}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600">
            Marked: {bingoCard.markedCells.filter(Boolean).length}/9
          </div>
          {bingoCard.isWinner && (
            <div className="mt-2 text-green-600 font-medium">
              🎉 BINGO! You got 3 in a row!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 