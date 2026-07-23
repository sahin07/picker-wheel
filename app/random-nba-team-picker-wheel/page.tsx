import NbaWheelSpokeRoute, {
  nbaWheelSpokeMetadata,
} from "@/components/nba-wheel/nba-wheel-spoke-route"

export const metadata = nbaWheelSpokeMetadata("all-teams")

export default function Page() {
  return <NbaWheelSpokeRoute spokeId="all-teams" />
}
