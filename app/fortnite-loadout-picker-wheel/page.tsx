import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("loadout-wheel")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="loadout-wheel" />
}
