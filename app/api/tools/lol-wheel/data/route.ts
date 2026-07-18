import { NextRequest, NextResponse } from "next/server";
import { lolChampions } from "@/data/lol-champions";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: lolChampions,
    });
  } catch (error) {
    console.error("Error fetching LoL champions data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch LoL champions data" },
      { status: 500 }
    );
  }
}
