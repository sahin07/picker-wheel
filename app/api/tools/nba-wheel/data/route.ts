import { NextRequest, NextResponse } from "next/server"

let nbaWheelData: any = {
  selectedConference: "all",
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
    return NextResponse.json(nbaWheelData)
  } catch (error) {
    console.error("Error loading NBA wheel data:", error)
    return NextResponse.json({ error: "Failed to load NBA wheel data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    nbaWheelData = { ...nbaWheelData, ...body }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving NBA wheel data:", error)
    return NextResponse.json({ error: "Failed to save NBA wheel data" }, { status: 500 })
  }
}


