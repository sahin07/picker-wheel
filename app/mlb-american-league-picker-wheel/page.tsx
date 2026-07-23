import MlbWheelSpokeRoute, {
  mlbWheelSpokeMetadata,
} from "@/components/mlb-wheel/mlb-wheel-spoke-route"

export const metadata = mlbWheelSpokeMetadata("american")

export default function Page() {
  return <MlbWheelSpokeRoute spokeId="american" />
}
