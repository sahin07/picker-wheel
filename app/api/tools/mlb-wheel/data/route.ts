import { NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In a real application, this would be a database
let mlbWheelData: any = {
  selectedLeague: "all",
  selectedTeams: [],
  displayMode: "both",
  viewMode: "wheel",
  favoriteTeams: [],
  comparisonTeams: [],
  isSpinning: false,
  spinRotation: 0,
  selectedResult: null,
  totalSpins: 0,
  recentResults: [],
  showStatistics: false,
  showComparison: false,
  showFavorites: false,
}

export async function GET() {
  try {
    return NextResponse.json(mlbWheelData)
  } catch (error) {
    console.error("Error loading MLB wheel data:", error)
    return NextResponse.json(
      { error: "Failed to load MLB wheel data" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    mlbWheelData = { ...mlbWheelData, ...data }
    
    return NextResponse.json({ success: true, data: mlbWheelData })
  } catch (error) {
    console.error("Error saving MLB wheel data:", error)
    return NextResponse.json(
      { error: "Failed to save MLB wheel data" },
      { status: 500 }
    )
  }
} 