import LolWheelSpokeRoute, {
  lolWheelSpokeMetadata,
} from "@/components/lol-wheel/lol-wheel-spoke-route"

export const metadata = lolWheelSpokeMetadata("a-tier")

export default function Page() {
  return <LolWheelSpokeRoute spokeId={"a-tier"} />
}
