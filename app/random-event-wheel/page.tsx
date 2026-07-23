import type { Metadata } from "next"
import WeightedWheelSpokeRoute, { weightedWheelSpokeMetadata } from "@/components/weighted-wheel/weighted-wheel-spoke-route"

export const metadata: Metadata = weightedWheelSpokeMetadata("event")

export default function RandomEventWheelPage() {
  return <WeightedWheelSpokeRoute spokeId="event" />
}
