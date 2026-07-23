import type { Metadata } from "next"
import WeightedWheelSpokeRoute, { weightedWheelSpokeMetadata } from "@/components/weighted-wheel/weighted-wheel-spoke-route"

export const metadata: Metadata = weightedWheelSpokeMetadata("probability")

export default function ProbabilityWheelPage() {
  return <WeightedWheelSpokeRoute spokeId="probability" />
}
