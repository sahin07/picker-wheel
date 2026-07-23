import NbaWheelSpokeRoute, {
  nbaWheelSpokeMetadata,
} from "@/components/nba-wheel/nba-wheel-spoke-route"

export const metadata = nbaWheelSpokeMetadata("pacific")

export default function Page() {
  return <NbaWheelSpokeRoute spokeId="pacific" />
}
