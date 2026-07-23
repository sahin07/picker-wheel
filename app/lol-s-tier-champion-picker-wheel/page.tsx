import LolWheelSpokeRoute, {
  lolWheelSpokeMetadata,
} from "@/components/lol-wheel/lol-wheel-spoke-route"

export const metadata = lolWheelSpokeMetadata("s-tier")

export default function Page() {
  return <LolWheelSpokeRoute spokeId={"s-tier"} />
}
