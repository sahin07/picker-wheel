import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("squad-challenge")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="squad-challenge" />
}
