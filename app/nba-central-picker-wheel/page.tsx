import NbaWheelSpokeRoute, {
  nbaWheelSpokeMetadata,
} from "@/components/nba-wheel/nba-wheel-spoke-route"

export const metadata = nbaWheelSpokeMetadata("central")

export default function Page() {
  return <NbaWheelSpokeRoute spokeId="central" />
}
