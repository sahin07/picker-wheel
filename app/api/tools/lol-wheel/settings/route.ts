import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Return default settings for LoL wheel
    const defaultSettings = {
      spinSpeed: 5,
      spinDuration: 3,
      enableSound: true,
      enableConfetti: true,
      backgroundColor: "#ffffff",
      selectedRole: "all",
      displayMode: "emoji-name",
      actionMode: "normal",
    };

    return NextResponse.json({
      success: true,
      data: defaultSettings,
    });
  } catch (error) {
    console.error("Error fetching LoL wheel settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch LoL wheel settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings = await request.json();

    // Here you would typically save settings to a database
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: "LoL wheel settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving LoL wheel settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save LoL wheel settings" },
      { status: 500 }
    );
  }
}
