import type { Metadata } from "next"
import WeightedWheelSpokeRoute, { weightedWheelSpokeMetadata } from "@/components/weighted-wheel/weighted-wheel-spoke-route"

export const metadata: Metadata = weightedWheelSpokeMetadata("weighted-random")

export default function WeightedRandomPickerPage() {
  return <WeightedWheelSpokeRoute spokeId="weighted-random" />
}
