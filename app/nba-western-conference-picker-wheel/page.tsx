import NbaWheelSpokeRoute, {
  nbaWheelSpokeMetadata,
} from "@/components/nba-wheel/nba-wheel-spoke-route"

export const metadata = nbaWheelSpokeMetadata("western")

export default function Page() {
  return <NbaWheelSpokeRoute spokeId="western" />
}
