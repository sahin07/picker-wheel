import LolWheelSpokeRoute, {
  lolWheelSpokeMetadata,
} from "@/components/lol-wheel/lol-wheel-spoke-route"

export const metadata = lolWheelSpokeMetadata("shadow-isles")

export default function Page() {
  return <LolWheelSpokeRoute spokeId={"shadow-isles"} />
}
