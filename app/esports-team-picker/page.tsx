import TeamPickerSpokeRoute, {
  teamPickerSpokeMetadata,
} from "@/components/team-picker/team-picker-spoke-route"

export const metadata = teamPickerSpokeMetadata("gaming")

export default function Page() {
  return <TeamPickerSpokeRoute spokeId="gaming" />
}
