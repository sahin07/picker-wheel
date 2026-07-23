import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("rare")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="rare" />
}
