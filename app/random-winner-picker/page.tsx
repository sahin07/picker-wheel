import type { Metadata } from "next"
import RaffleSpinWheelSpokeRoute, {
  raffleSpinWheelSpokeMetadata,
} from "@/components/raffle-spin-wheel/raffle-spin-wheel-spoke-route"

export const metadata: Metadata = raffleSpinWheelSpokeMetadata("random-winner")

export default function Page() {
  return <RaffleSpinWheelSpokeRoute spokeId="random-winner" />
}
