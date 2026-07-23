import type { Metadata } from "next"
import WeightedWheelSpokeRoute, { weightedWheelSpokeMetadata } from "@/components/weighted-wheel/weighted-wheel-spoke-route"

export const metadata: Metadata = weightedWheelSpokeMetadata("loot")

export default function LootWheelPage() {
  return <WeightedWheelSpokeRoute spokeId="loot" />
}
