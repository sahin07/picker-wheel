import type { Metadata } from "next"
import WeightedWheelSpokeRoute, { weightedWheelSpokeMetadata } from "@/components/weighted-wheel/weighted-wheel-spoke-route"

export const metadata: Metadata = weightedWheelSpokeMetadata("odds")

export default function RandomWheelWithOddsPage() {
  return <WeightedWheelSpokeRoute spokeId="odds" />
}
