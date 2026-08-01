import type { Metadata } from "next"
import DtiWheelSpokeRoute, {
  dtiWheelSpokeMetadata,
} from "@/components/dti-wheel/dti-wheel-spoke-route"

export const metadata: Metadata = dtiWheelSpokeMetadata("challenge")

export default function Page() {
  return <DtiWheelSpokeRoute spokeId="challenge" />
}
