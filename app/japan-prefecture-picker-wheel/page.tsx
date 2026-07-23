import type { Metadata } from "next"
import StateWheelSpokeRoute, {
  stateWheelSpokeMetadata,
} from "@/components/state-wheel/state-wheel-spoke-route"

export const metadata: Metadata = stateWheelSpokeMetadata("japan")

export default function JapanPrefecturePickerWheelPage() {
  return <StateWheelSpokeRoute spokeId="japan" />
}
