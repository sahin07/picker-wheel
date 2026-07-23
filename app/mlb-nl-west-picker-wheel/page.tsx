import MlbWheelSpokeRoute, {
  mlbWheelSpokeMetadata,
} from "@/components/mlb-wheel/mlb-wheel-spoke-route"

export const metadata = mlbWheelSpokeMetadata("nl-west")

export default function Page() {
  return <MlbWheelSpokeRoute spokeId="nl-west" />
}
