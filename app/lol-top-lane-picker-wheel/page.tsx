import LolWheelSpokeRoute, {
  lolWheelSpokeMetadata,
} from "@/components/lol-wheel/lol-wheel-spoke-route"

export const metadata = lolWheelSpokeMetadata("top")

export default function Page() {
  return <LolWheelSpokeRoute spokeId={"top"} />
}
