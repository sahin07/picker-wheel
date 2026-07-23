import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("loot-challenge")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="loot-challenge" />
}
