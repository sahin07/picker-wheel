import type { Metadata } from "next"
import StateWheelSpokeRoute, {
  stateWheelSpokeMetadata,
} from "@/components/state-wheel/state-wheel-spoke-route"

export const metadata: Metadata = stateWheelSpokeMetadata("australia")

export default function AustraliaStatePickerWheelPage() {
  return <StateWheelSpokeRoute spokeId="australia" />
}
