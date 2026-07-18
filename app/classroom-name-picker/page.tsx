import HomeSpokeRoute, {
  homeSpokeMetadata,
} from "@/components/home/home-spoke-route"

export const metadata = homeSpokeMetadata("classroom")

export default function Page() {
  return <HomeSpokeRoute spokeId="classroom" />
}
