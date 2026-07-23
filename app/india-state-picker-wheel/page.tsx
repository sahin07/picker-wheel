import type { Metadata } from "next"
import StateWheelSpokeRoute, {
  stateWheelSpokeMetadata,
} from "@/components/state-wheel/state-wheel-spoke-route"

export const metadata: Metadata = stateWheelSpokeMetadata("india")

export default function IndiaStatePickerWheelPage() {
  return <StateWheelSpokeRoute spokeId="india" />
}
