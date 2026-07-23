import MlbWheelSpokeRoute, {
  mlbWheelSpokeMetadata,
} from "@/components/mlb-wheel/mlb-wheel-spoke-route"

export const metadata = mlbWheelSpokeMetadata("nl-central")

export default function Page() {
  return <MlbWheelSpokeRoute spokeId="nl-central" />
}
