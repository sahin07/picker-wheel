import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("duo-challenge")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="duo-challenge" />
}
