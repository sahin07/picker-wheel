import type { Metadata } from "next"
import StateWheelSpokeRoute, {
  stateWheelSpokeMetadata,
} from "@/components/state-wheel/state-wheel-spoke-route"

export const metadata: Metadata = stateWheelSpokeMetadata("canada")

export default function CanadaProvincePickerWheelPage() {
  return <StateWheelSpokeRoute spokeId="canada" />
}
