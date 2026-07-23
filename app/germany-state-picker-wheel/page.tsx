import type { Metadata } from "next"
import StateWheelSpokeRoute, {
  stateWheelSpokeMetadata,
} from "@/components/state-wheel/state-wheel-spoke-route"

export const metadata: Metadata = stateWheelSpokeMetadata("germany")

export default function GermanyStatePickerWheelPage() {
  return <StateWheelSpokeRoute spokeId="germany" />
}
