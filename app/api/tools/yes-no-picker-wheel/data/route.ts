import { NextRequest, NextResponse } from "next/server"

// In-memory storage for development
// In production, you would use a database
let yesNoWheelData: any = null

export async function GET() {
  try {
    return NextResponse.json({ data: yesNoWheelData })
  } catch (error) {
    console.error("Error fetching yes-no wheel data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolType, data, timestamp } = body

    if (toolType !== "yes-no-picker-wheel") {
      return NextResponse.json({ error: "Invalid tool type" }, { status: 400 })
    }

    // Store the data
    yesNoWheelData = {
      ...data,
      timestamp,
    }

    return NextResponse.json({ success: true, data: yesNoWheelData })
  } catch (error) {
    console.error("Error saving yes-no wheel data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
} 