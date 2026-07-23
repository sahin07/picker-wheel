import MlbWheelSpokeRoute, {
  mlbWheelSpokeMetadata,
} from "@/components/mlb-wheel/mlb-wheel-spoke-route"

export const metadata = mlbWheelSpokeMetadata("al-east")

export default function Page() {
  return <MlbWheelSpokeRoute spokeId="al-east" />
}
