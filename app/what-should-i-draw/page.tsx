import type { Metadata } from "next"
import FortuneWheelSpokeRoute, {
  fortuneWheelSpokeMetadata,
} from "@/components/fortune-wheel/fortune-wheel-spoke-route"

export const metadata: Metadata = fortuneWheelSpokeMetadata("draw-prompt")
export default function Page() {
  return <FortuneWheelSpokeRoute spokeId="draw-prompt" />
}
