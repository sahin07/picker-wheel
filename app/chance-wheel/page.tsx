import type { Metadata } from "next"
import WeightedWheelSpokeRoute, { weightedWheelSpokeMetadata } from "@/components/weighted-wheel/weighted-wheel-spoke-route"

export const metadata: Metadata = weightedWheelSpokeMetadata("chance")

export default function ChanceWheelPage() {
  return <WeightedWheelSpokeRoute spokeId="chance" />
}
