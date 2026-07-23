import MlbWheelSpokeRoute, {
  mlbWheelSpokeMetadata,
} from "@/components/mlb-wheel/mlb-wheel-spoke-route"

export const metadata = mlbWheelSpokeMetadata("all-teams")

export default function Page() {
  return <MlbWheelSpokeRoute spokeId="all-teams" />
}
