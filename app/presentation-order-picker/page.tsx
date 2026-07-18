import HomeSpokeRoute, {
  homeSpokeMetadata,
} from "@/components/home/home-spoke-route"

export const metadata = homeSpokeMetadata("presentation")

export default function Page() {
  return <HomeSpokeRoute spokeId="presentation" />
}
