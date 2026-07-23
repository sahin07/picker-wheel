import type { Metadata } from "next"
import StateWheelSpokeRoute, {
  stateWheelSpokeMetadata,
} from "@/components/state-wheel/state-wheel-spoke-route"

export const metadata: Metadata = stateWheelSpokeMetadata("us")

export default function USStatePickerWheelPage() {
  return <StateWheelSpokeRoute spokeId="us" />
}
