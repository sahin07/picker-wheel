import type { Metadata } from "next"
import WeightedWheelSpokeRoute, { weightedWheelSpokeMetadata } from "@/components/weighted-wheel/weighted-wheel-spoke-route"

export const metadata: Metadata = weightedWheelSpokeMetadata("prize-odds")

export default function PrizeWheelWithOddsPage() {
  return <WeightedWheelSpokeRoute spokeId="prize-odds" />
}
