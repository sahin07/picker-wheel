import type { Metadata } from "next"
import FortuneWheelSpokeRoute, { fortuneWheelSpokeMetadata } from "@/components/fortune-wheel/fortune-wheel-spoke-route"

export const metadata: Metadata = fortuneWheelSpokeMetadata("jess-coleman")
export default function Page() { return <FortuneWheelSpokeRoute spokeId="jess-coleman" /> }
