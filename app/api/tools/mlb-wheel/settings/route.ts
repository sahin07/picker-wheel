import { NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In a real application, this would be a database
let mlbWheelSettings: any = {
  spinSpeed: 5,
  spinDuration: 3,
  enableManualStop: true,
  mysteryMode: false,
  enableConfetti: true,
  enableSound: true,
  wheelColor: "#4ade80",
  backgroundColor: "#ffffff",
  actionMode: "normal",
  customTheme: "classic",
  showTeamLogos: true,
  showTeamNames: true,
  showChampionships: true,
  showFoundedYear: true,
  showHomeVenue: true,
  showManager: true,
  showOwner: true,
}

export async function GET() {
  try {
    return NextResponse.json(mlbWheelSettings)
  } catch (error) {
    console.error("Error loading MLB wheel settings:", error)
    return NextResponse.json(
      { error: "Failed to load MLB wheel settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    mlbWheelSettings = { ...mlbWheelSettings, ...data }
    
    return NextResponse.json({ success: true, data: mlbWheelSettings })
  } catch (error) {
    console.error("Error saving MLB wheel settings:", error)
    return NextResponse.json(
      { error: "Failed to save MLB wheel settings" },
      { status: 500 }
    )
  }
} 