import type { Metadata } from "next"
import WeightedWheelSpokeRoute, { weightedWheelSpokeMetadata } from "@/components/weighted-wheel/weighted-wheel-spoke-route"

export const metadata: Metadata = weightedWheelSpokeMetadata("percentage")

export default function PercentageWheelPage() {
  return <WeightedWheelSpokeRoute spokeId="percentage" />
}
