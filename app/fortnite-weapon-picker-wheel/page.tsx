import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("weapon-wheel")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="weapon-wheel" />
}
