import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("all-skins")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="all-skins" />
}
