import type { Metadata } from "next"
import PrizeWheelSpokeRoute, { prizeWheelSpokeMetadata } from "@/components/prize-wheel/prize-wheel-spoke-route"
export const metadata: Metadata = prizeWheelSpokeMetadata("lucky")
export default function Page() { return <PrizeWheelSpokeRoute spokeId="lucky" /> }
