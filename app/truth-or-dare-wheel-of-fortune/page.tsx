import type { Metadata } from "next"
import FortuneWheelSpokeRoute, {
  fortuneWheelSpokeMetadata,
} from "@/components/fortune-wheel/fortune-wheel-spoke-route"

export const metadata: Metadata = fortuneWheelSpokeMetadata("truth-or-dare")
export default function Page() {
  return <FortuneWheelSpokeRoute spokeId="truth-or-dare" />
}
