import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("landing-spot-wheel")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="landing-spot-wheel" />
}
