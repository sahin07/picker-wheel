import type { Metadata } from "next"
import StateWheelSpokeRoute, {
  stateWheelSpokeMetadata,
} from "@/components/state-wheel/state-wheel-spoke-route"

export const metadata: Metadata = stateWheelSpokeMetadata("random")

export default function RandomStatePickerWheelPage() {
  return <StateWheelSpokeRoute spokeId="random" />
}
