import type { Metadata } from "next"
import FortuneWheelSpokeRoute, {
  fortuneWheelSpokeMetadata,
} from "@/components/fortune-wheel/fortune-wheel-spoke-route"

export const metadata: Metadata = fortuneWheelSpokeMetadata("game-night")
export default function Page() {
  return <FortuneWheelSpokeRoute spokeId="game-night" />
}
