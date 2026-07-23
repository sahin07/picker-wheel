import MlbWheelSpokeRoute, {
  mlbWheelSpokeMetadata,
} from "@/components/mlb-wheel/mlb-wheel-spoke-route"

export const metadata = mlbWheelSpokeMetadata("nl-east")

export default function Page() {
  return <MlbWheelSpokeRoute spokeId="nl-east" />
}
