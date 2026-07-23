import FortniteWheelSpokeRoute, {
  fortniteWheelSpokeMetadata,
} from "@/components/fortnite-wheel/fortnite-wheel-spoke-route"

export const metadata = fortniteWheelSpokeMetadata("item-picker")

export default function Page() {
  return <FortniteWheelSpokeRoute spokeId="item-picker" />
}
