import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("decision-wheel")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="decision-wheel" />
}
