import type { Metadata } from "next"
import RaffleSpinWheelSpokeRoute, {
  raffleSpinWheelSpokeMetadata,
} from "@/components/raffle-spin-wheel/raffle-spin-wheel-spoke-route"

export const metadata: Metadata = raffleSpinWheelSpokeMetadata("contest")

export default function Page() {
  return <RaffleSpinWheelSpokeRoute spokeId="contest" />
}
