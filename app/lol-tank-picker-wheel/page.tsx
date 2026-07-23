import LolWheelSpokeRoute, {
  lolWheelSpokeMetadata,
} from "@/components/lol-wheel/lol-wheel-spoke-route"

export const metadata = lolWheelSpokeMetadata("tank")

export default function Page() {
  return <LolWheelSpokeRoute spokeId={"tank"} />
}
