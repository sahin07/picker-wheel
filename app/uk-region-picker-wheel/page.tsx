import type { Metadata } from "next"
import StateWheelSpokeRoute, {
  stateWheelSpokeMetadata,
} from "@/components/state-wheel/state-wheel-spoke-route"

export const metadata: Metadata = stateWheelSpokeMetadata("uk")

export default function UKRegionPickerWheelPage() {
  return <StateWheelSpokeRoute spokeId="uk" />
}
