import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("collabs")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="collabs" />
}
