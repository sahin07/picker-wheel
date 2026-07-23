import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("vehicle-wheel")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="vehicle-wheel" />
}
