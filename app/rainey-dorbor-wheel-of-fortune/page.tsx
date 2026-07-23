import type { Metadata } from "next"
import FortuneWheelSpokeRoute, { fortuneWheelSpokeMetadata } from "@/components/fortune-wheel/fortune-wheel-spoke-route"

export const metadata: Metadata = fortuneWheelSpokeMetadata("rainey-dorbor")
export default function Page() { return <FortuneWheelSpokeRoute spokeId="rainey-dorbor" /> }
