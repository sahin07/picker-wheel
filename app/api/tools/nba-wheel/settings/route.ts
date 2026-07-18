import { NextRequest, NextResponse } from "next/server"

let nbaWheelSettings: any = {
  spinBehavior: { spinningDuration: 3, spinningSpeed: 5, manualStop: true, mysterySpin: false },
  confettiSound: { enableConfetti: true, enableSound: true, soundVolume: 0.5 },
  background: { color: "#ffffff" }
}

export async function GET() {
  return NextResponse.json(nbaWheelSettings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  nbaWheelSettings = { ...nbaWheelSettings, ...body }
  return NextResponse.json({ success: true })
}


