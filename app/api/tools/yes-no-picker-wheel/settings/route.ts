import { NextRequest, NextResponse } from "next/server"

// In-memory storage for development
// In production, you would use a database
let yesNoWheelSettings: any = null

export async function GET() {
  try {
    return NextResponse.json({ settings: yesNoWheelSettings })
  } catch (error) {
    console.error("Error fetching yes-no wheel settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolType, settings, timestamp } = body

    if (toolType !== "yes-no-picker-wheel") {
      return NextResponse.json({ error: "Invalid tool type" }, { status: 400 })
    }

    // Store the settings
    yesNoWheelSettings = {
      ...settings,
      timestamp,
    }

    return NextResponse.json({ success: true, settings: yesNoWheelSettings })
  } catch (error) {
    console.error("Error saving yes-no wheel settings:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
} 