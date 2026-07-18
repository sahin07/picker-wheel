import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3X3 } from "lucide-react"
import type { BingoCard as BingoCardType } from "@/lib/types"

interface BingoCardProps {
  bingoCard: BingoCardType
  currentTool: string
}

export function BingoCard({ bingoCard, currentTool }: BingoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Grid3X3 className="w-5 h-5 mr-2" />
          Bingo Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {bingoCard.cells.map((cell, index) => (
            <div
              key={index}
              className={`aspect-square border-2 rounded-lg flex items-center justify-center text-xs font-semibold ${
                bingoCard.markedCells[index]
                  ? "bg-green-500 text-white border-green-600"
                  : "bg-gray-100 border-gray-300"
              } ${index === 4 ? "bg-yellow-200 border-yellow-400" : ""}`}
            >
              {index === 4 ? (
                <span>FREE</span>
              ) : cell ? (
                currentTool === "image" && cell.imageUrl ? (
                  <img
                    src={cell.imageUrl || "/placeholder.svg"}
                    alt={cell.text}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-center p-1">{cell.text}</span>
                )
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
